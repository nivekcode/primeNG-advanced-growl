/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/never';
import {Observable} from 'rxjs/Observable';
import {AdvPrimeMessage} from './adv-growl.model';
import {AdvGrowlService} from './adv-growl.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const DEFAULT_LIFETIME = 0;

@Component({
    selector: 'adv-growl',
    templateUrl: './adv-growl.component.html'
})
export class AdvGrowlComponent implements OnInit {

    @Input() style: any;
    @Input() styleClass: any;
    @Input() life = DEFAULT_LIFETIME;
    @Input() freezeMessagesOnHover = false;
    @Output() onClose = new EventEmitter<AdvPrimeMessage>();
    @Output() onClick = new EventEmitter<AdvPrimeMessage>();
    @Output() onMessagesChanges = new EventEmitter<Array<AdvPrimeMessage>>();

    @ViewChild('growlMessage', {read: ElementRef}) growlMessage;

    public messages: Array<AdvPrimeMessage> = [];
    private scheduler = new BehaviorSubject<boolean>(false)

    constructor(private messageService: AdvGrowlService) {
    }

    ngOnInit(): void {
        this.setupStreams()
        this.subscribeForMessages()
    }

    private setupStreams() {
        Observable.fromEvent(this.growlMessage.nativeElement, 'mouseenter')
            .subscribe(e => this.scheduler.next(true))
        Observable.fromEvent(this.growlMessage.nativeElement, 'mouseleave')
            .subscribe(e => this.scheduler.next(false))
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

    public removeMessage(messageId: string) {
        const index = this.messages.findIndex(message => message.id === messageId);
        if (index >= 0) {
            this.messages.splice(index, 1);
            this.onMessagesChanges.emit(this.messages);
        }
    }

    public getLifeTimeStream(messageId: string): Observable<any> {
        if (this.life > DEFAULT_LIFETIME) {
            const lifetimeStream = this.freezeMessagesOnHover ? this.getSchedueLifeTimeStream()
                : this.getUnscheduledLifeTimeStream()
            return lifetimeStream
                .mapTo(messageId);

        }
        return Observable.never();
    }

    private getSchedueLifeTimeStream() {
        return this.scheduler
            .switchMap(pause => pause ? Observable.never() : Observable.timer(this.life))
    }

    private getUnscheduledLifeTimeStream() {
        return Observable.timer(this.life)
    }

    public messageClosed($event) {
        this.emitMessage($event, this.onClose)
    }

    public messageClicked($event): void {
        this.emitMessage($event, this.onClick)
    }

    emitMessage($event, emitter: EventEmitter<AdvPrimeMessage>) {
        const message = $event.message
        if (message) {
            emitter.next(message)
        }
    }
}
