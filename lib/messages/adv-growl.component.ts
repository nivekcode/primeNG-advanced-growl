/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/never';
import {Observable} from 'rxjs/Observable';
import {AdvPrimeMessage} from './adv-growl.model';
import {AdvGrowlService} from './adv-growl.service';
import {Subject} from 'rxjs/Subject';
import {AdvGrowlHoverHelper} from './adv-growl.hoverHelper';

const DEFAULT_LIFETIME = 0
const FREEZE_MESSAGES_DEFAULT = false
const PAUSE_ONLY_HOVERED_DEFAULT = false

@Component({
    selector: 'adv-growl',
    templateUrl: './adv-growl.component.html'
})
export class AdvGrowlComponent implements OnInit {

    @Input() style: any
    @Input() styleClass: any
    @Input('life') lifeTime = DEFAULT_LIFETIME
    @Input() freezeMessagesOnHover = FREEZE_MESSAGES_DEFAULT
    @Input() pauseOnlyHoveredMessage = PAUSE_ONLY_HOVERED_DEFAULT;
    @Output() onClose = new EventEmitter<AdvPrimeMessage>()
    @Output() onClick = new EventEmitter<AdvPrimeMessage>()
    @Output() onMessagesChanges = new EventEmitter<Array<AdvPrimeMessage>>()

    @ViewChild('growlMessage', {read: ElementRef}) growlMessage

    public messages: Array<AdvPrimeMessage> = []
    messageEnter$ = new Subject<string>()
    hoverHelper: AdvGrowlHoverHelper;

    constructor(private messageService: AdvGrowlService) {
    }

    ngOnInit(): void {
        const mouseLeave$ = Observable.fromEvent(this.growlMessage.nativeElement, 'mouseleave')
        this.hoverHelper = new AdvGrowlHoverHelper(this.messageEnter$, mouseLeave$)
        this.subscribeForMessages()
    }

    public subscribeForMessages() {
        this.messages = [];
        this.messageService.getMessageStream()
            .do(message => {
                this.messages.push(message);
                this.onMessagesChanges.emit(this.messages);
            })
            .mergeMap(message => this.getLifeTimeStream(message.id))
            .takeUntil(this.messageService.getCancelStream())
            .subscribe(
                messageId => this.removeMessage(messageId),
                err => {
                    throw err;
                },
                () => this.subscribeForMessages()
            );
    }

    removeMessage(messageId: string) {
        const index = this.messages.findIndex(message => message.id === messageId);
        if (index >= 0) {
            this.messages.splice(index, 1);
            this.onMessagesChanges.emit(this.messages);
        }
    }

    getLifeTimeStream(messageId: string): Observable<any> {
        if (this.hasLifeTime()) {
            return this.getFinitStream(messageId)
        }
        return this.getInifiniteStream();
    }

    hasLifeTime(): boolean {
        return this.lifeTime > DEFAULT_LIFETIME
    }

    getInifiniteStream(): Observable<any> {
        return Observable.never();
    }

    getFinitStream(messageId: string): Observable<string> {
        let finitStream: Observable<any>
        if (this.freezeMessagesOnHover) {
            finitStream = this.hoverHelper.getPausableMessageStream(messageId, this.lifeTime, this.pauseOnlyHoveredMessage)
        } else {
            finitStream = this.getUnPausableMessageStream()
        }
        return finitStream.mapTo(messageId)
    }

    getUnPausableMessageStream() {
        return Observable.timer(this.lifeTime)
    }

    public messageClosed($event) {
        this.emitMessage($event, this.onClose)
    }

    public messageClicked($event) {
        this.emitMessage($event, this.onClick)
    }

    public messageEntered($event) {
        const message: AdvPrimeMessage = $event.message
        this.messageEnter$.next(message.id)
    }

    emitMessage($event, emitter: EventEmitter<AdvPrimeMessage>) {
        const message = $event.message
        if (message) {
            emitter.next(message)
        }
    }
}
