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

export class AdvGrowlMessageCache {

    private messageCache: Array<AdvPrimeMessage> = []
    private cachedMessage$ = new Subject<MessageWithSender>()
    private schredder$ = new Subject<MessageWithSender>()
    private allocatedMessageSpots: number

    constructor(private maxNumberOfMessages: number) {
        this.allocatedMessageSpots = 0
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
            .switchMap((messageWithSender: MessageWithSender) => {
                    switch (messageWithSender.sender) {
                        case MESSAGE_SENDER.USER:
                            if (this.allocatedMessageSpots >= this.maxNumberOfMessages) {
                                this.messageCache.push(messageWithSender.message)
                                return Observable.never()
                            } else {
                                this.allocatedMessageSpots++
                                return Observable.of(messageWithSender.message)
                            }
                        case MESSAGE_SENDER.CACHE:
                            return Observable.of(messageWithSender.message)
                        case MESSAGE_SENDER.SCHREDDER:
                            return Observable.never()
                    }
                }
            )
    }

    deallocateMessageSpot(): void {
        this.allocatedMessageSpots--
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
