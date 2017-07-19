/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import {Observable} from 'rxjs/Observable';
import {AdvPrimeMessage} from './adv-growl.model';
import {AdvGrowlService} from './adv-growl.service';

const DEFAULT_LIFETIME = 0;

@Component({
    selector: 'adv-growl',
    templateUrl: './adv-growl.component.html'
})
export class AdvGrowlComponent {

    public messages: Array<AdvPrimeMessage> = [];
    @Input() style: any;
    @Input() styleClass: any;
    @Input() life = DEFAULT_LIFETIME;
    @Output() onClose = new EventEmitter<any>();

    constructor(private messageService: AdvGrowlService) {
        this.subscribeForMessages();
    }

    public subscribeForMessages() {
        this.messages = [];
        this.messageService.getMessageStream()
            .do(message => this.messages.push(message))
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
        }
    }

    public getLifeTimeStream(messageId: string): Observable<any> {
        if (this.life > DEFAULT_LIFETIME) {
            return Observable.timer(this.life)
                .mapTo(messageId);
        }
        return Observable.empty();
    }

    public messageClosed($event) {
        this.onClose.next($event);
    }
}
