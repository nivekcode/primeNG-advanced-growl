/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {mapTo, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {AdvPrimeMessage} from './adv-growl.model';
import {AdvGrowlService} from './adv-growl.service';
import {AdvGrowlHoverHelper} from './adv-growl.hoverHelper';
import {AdvGrowlMessageCache} from './adv-growl.messageCache';
import {fromEvent, merge, Observable, Observer, Subject, timer, NEVER} from 'rxjs';

const NO_LIFETIME = 0;
const FREEZE_MESSAGES_DEFAULT = false;
const PAUSE_ONLY_HOVERED_DEFAULT = false;
const DEFAULT_MESSAGE_SPOTS = 0;

@Component({
    selector: 'adv-growl',
    templateUrl: './adv-growl.component.html'
})
export class AdvGrowlComponent implements OnInit, OnChanges {


    @Input() style: any;
    @Input() styleClass: any;
    @Input('life') lifeTime = NO_LIFETIME;
    @Input() freezeMessagesOnHover = FREEZE_MESSAGES_DEFAULT;
    @Input() messageSpots = DEFAULT_MESSAGE_SPOTS;
    @Input() pauseOnlyHoveredMessage = PAUSE_ONLY_HOVERED_DEFAULT;
    @Output() onClose = new EventEmitter<AdvPrimeMessage>();
    @Output() onClick = new EventEmitter<AdvPrimeMessage>();
    @Output() onMessagesChanges = new EventEmitter<Array<AdvPrimeMessage>>();

    @ViewChild('growlMessage') growlMessage;

    public messages: Array<AdvPrimeMessage> = [];
    messageEnter$ = new Subject<string>();
    messageSpotChange$ = new Subject();
    hoverHelper: AdvGrowlHoverHelper;
    messageCache: AdvGrowlMessageCache;
    private messageObserver: Observer<any>;

    constructor(private messageService: AdvGrowlService) {
        this.messageObserver = this.createMessageObserver();
    }

    ngOnInit(): void {
        const mouseLeave$ = fromEvent(this.growlMessage.el.nativeElement, 'mouseleave');
        this.hoverHelper = new AdvGrowlHoverHelper(this.messageEnter$, mouseLeave$);
        this.messageCache = new AdvGrowlMessageCache();
        this.subscribeForMessages();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const messageSpotChange = changes.messageSpots
        if (messageSpotChange != null && this.haveMessageSpotsChanged(messageSpotChange)) {
            this.messageSpotChange$.next()
        }
    }

    haveMessageSpotsChanged(messageSpotChange: SimpleChange) {
        const currentValue = messageSpotChange.currentValue
        const previousValue = messageSpotChange.previousValue
        const firstChange = messageSpotChange.firstChange
        const hasValueChanged = currentValue !== previousValue
        if (currentValue != null && !firstChange && hasValueChanged) {
            return true
        }
        return false
    }

    createMessageObserver(): Observer<any> {
        return {
            next: (messageId: string) => {
                this.messageCache.deallocateMessageSpot()
                this.removeMessage(messageId)
            },
            error: (error) => {
                throw error;
            },
            complete: () => {
                this.messageCache.clearCache()
                this.subscribeForMessages()
            }
        };
    }

    public subscribeForMessages() {
        this.messages = [];
        this.messageCache.getMessages(this.messageService.getMessageStream(), this.messageSpots)
            .pipe(
                tap((message: AdvPrimeMessage) => {
                    this.messages.push(message);
                    this.onMessagesChanges.emit(this.messages);
                }),
                mergeMap((message: AdvPrimeMessage) => this.getLifeTimeStream(message.id, message.lifeTime)),
                takeUntil(merge(
                    this.messageService.getCancelStream(),
                    this.messageSpotChange$)
                )
            )
            .subscribe(this.messageObserver);
    }

    removeMessage(messageId: string) {
        const index = this.messages.findIndex(message => message.id === messageId);
        if (index >= 0) {
            this.messages.splice(index, 1);
            this.onMessagesChanges.emit(this.messages);
        }
    }

    getLifeTimeStream(messageId: string, lifeTime = this.lifeTime): Observable<any> {
        if (this.hasLifeTime(lifeTime)) {
            return this.getFinitStream(messageId, lifeTime);
        }
        return this.getInifiniteStream();
    }

    hasLifeTime(lifeTime: number): boolean {
        return lifeTime > NO_LIFETIME;
    }

    getInifiniteStream(): Observable<any> {
        return NEVER;
    }

    getFinitStream(messageId: string, lifeTime: number): Observable<string> {
        let finitStream: Observable<any>;
        if (this.freezeMessagesOnHover) {
            finitStream = this.hoverHelper.getPausableMessageStream(messageId, lifeTime, this.pauseOnlyHoveredMessage);
        } else {
            finitStream = this.getUnPausableMessageStream(lifeTime);
        }
        return finitStream.pipe(mapTo(messageId));
    }

    getUnPausableMessageStream(lifeTime: number) {
        return timer(lifeTime);
    }

    public messageClosed($event) {
        this.messageCache.deallocateMessageSpot()
        this.emitMessage($event, this.onClose);
    }

    public messageClicked($event) {
        this.emitMessage($event, this.onClick);
    }

    public messageEntered($event) {
        const message: AdvPrimeMessage = $event.message;
        this.messageEnter$.next(message.id);
    }

    emitMessage($event, emitter: EventEmitter<AdvPrimeMessage>) {
        const message = $event.message;
        if (message) {
            emitter.next(message);
        }
    }
}
