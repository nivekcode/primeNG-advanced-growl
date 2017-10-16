import {AdvPrimeMessage} from './adv-growl.model';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/scan'
import 'rxjs/add/observable/of'

export enum MESSAGE_SENDER {
    USER,
    CACHE,
    SCHREDDER
}

interface MessageWithSender {
    sender: MESSAGE_SENDER,
    message?: AdvPrimeMessage
}

export class AdvGrowlMessageCache {

    messageCache: Array<AdvPrimeMessage> = []
    cachedMessage$ = new Subject<MessageWithSender>()
    schredder$ = new Subject<MessageWithSender>()
    allocatedMessageSpots: number

    constructor(private maxNumberOfMessages: number) {
        this.allocatedMessageSpots = 0
    }

    public getMessages(message$: Observable<AdvPrimeMessage>): Observable<AdvPrimeMessage> {

        return Observable.merge(
            message$.map((message: AdvPrimeMessage) => ({
                sender: MESSAGE_SENDER.USER,
                message: message
            })),
            this.cachedMessage$,
            this.schredder$
        )
            .switchMap(this.getMessage)
    }

    getMessage = (messageWithSender: MessageWithSender) => {
        switch (messageWithSender.sender) {
            case MESSAGE_SENDER.USER:
                return this.getUserMessage(messageWithSender)
            case MESSAGE_SENDER.CACHE:
                this.allocatedMessageSpots++
                return Observable.of(messageWithSender.message)
            case MESSAGE_SENDER.SCHREDDER:
                return Observable.never()
        }
    }

    getUserMessage(messageWithSender: MessageWithSender): Observable<AdvPrimeMessage> {
        if (this.allocatedMessageSpots >= this.maxNumberOfMessages) {
            this.messageCache.push(messageWithSender.message)
            return Observable.never()
        } else {
            this.allocatedMessageSpots++
            return Observable.of(messageWithSender.message)
        }
    }

    deallocateMessageSpot(): void {
        this.allocatedMessageSpots--
        if (this.isCacheEmpty()) {
            this.schredder$.next({sender: MESSAGE_SENDER.SCHREDDER})
        } else {
            const message = this.messageCache.shift()
            this.cachedMessage$.next({sender: MESSAGE_SENDER.CACHE, message: message})
        }
    }

    isCacheEmpty(): boolean {
        return this.messageCache.length === 0
    }

    public clearCache(): void {
        this.allocatedMessageSpots = 0
        this.messageCache = []
    }
}
