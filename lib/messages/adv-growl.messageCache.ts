import {AdvPrimeMessage} from './adv-growl.model';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/scan'
import 'rxjs/add/observable/of'

enum MESSAGE_SENDER {
    USER,
    CACHE,
    SCHREDDER
}

interface MessageWithSender {
    sender: MESSAGE_SENDER,
    message: AdvPrimeMessage
}

interface MessageQueue {
    length: number,
    newMessage: MessageWithSender
}

export class AdvGrowlMessageCache {

    private messageCache: Array<AdvPrimeMessage> = []
    private cachedMessage$ = new Subject<MessageWithSender>()
    private schredder$ = new Subject<MessageWithSender>()

    constructor(private maxNumberOfMessages: number) {
    }

    getMessages(message$: Observable<AdvPrimeMessage>): Observable<AdvPrimeMessage> {

        return Observable.merge(
            message$.map((message: AdvPrimeMessage) => ({
                sender: MESSAGE_SENDER.USER,
                message: message
            })),
            this.cachedMessage$,
            this.schredder$
        )
            .scan((messageQueue: MessageQueue, messageWithSender: MessageWithSender) => {
                switch (messageWithSender.sender) {
                    case MESSAGE_SENDER.USER:
                        return {length: ++messageQueue.length, newMessage: messageWithSender}
                    case MESSAGE_SENDER.SCHREDDER:
                        return {length: --messageQueue.length, newMessage: messageWithSender}
                    case MESSAGE_SENDER.CACHE:
                        return {length: messageQueue.length, newMessage: messageWithSender}
                }
            }, {length: 0, newMessage: {}})
            .switchMap((queue: MessageQueue) => {
                if (queue.length <= this.maxNumberOfMessages || queue.newMessage.sender === MESSAGE_SENDER.CACHE) {
                    return Observable.of(queue.newMessage.message)
                }
                this.messageCache.push(queue.newMessage.message)
                return Observable.empty()
            })
    }

    deallocateMessageSpot(): void {
        if (this.isCacheEmpty()) {
            this.schredder$.next({sender: MESSAGE_SENDER.SCHREDDER, message: undefined})
        } else {
            const message = this.messageCache.shift()
            this.cachedMessage$.next({sender: MESSAGE_SENDER.CACHE, message: message})
        }
    }

    private isCacheEmpty(): boolean {
        return this.messageCache.length === 0
    }
}
