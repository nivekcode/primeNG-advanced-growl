/**
 * Created by kevinkreuzer on 16.10.17.
 */
import {AdvPrimeMessage} from './adv-growl.model';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {of} from 'rxjs/observable/of';
import {never} from 'rxjs/observable/never';
import {merge} from 'rxjs/observable/merge';
import {map, switchMap} from 'rxjs/operators';


export enum MESSAGE_SENDER {
    USER,
    CACHE,
    SCHREDDER
}

export interface MessageWithSender {
    sender: MESSAGE_SENDER,
    message?: AdvPrimeMessage
}

export class AdvGrowlMessageCache {

    messageCache: Array<AdvPrimeMessage> = []
    cachedMessage$ = new Subject<MessageWithSender>()
    schredder$ = new Subject<MessageWithSender>()
    allocatedMessageSpots: number
    hasMessageSpots: boolean
    messageSpots: number

    constructor() {
    }

    public getMessages(message$: Observable<AdvPrimeMessage>, messageSpots: number): Observable<AdvPrimeMessage> {
        this.messageSpots = messageSpots
        this.hasMessageSpots = messageSpots !== 0
        this.allocatedMessageSpots = 0

        if (!this.hasMessageSpots) {
            return message$
        }

        return merge(
            message$.pipe(map((message: AdvPrimeMessage) => ({
                sender: MESSAGE_SENDER.USER,
                message: message
            }))),
            this.cachedMessage$,
            this.schredder$
        ).pipe(
            switchMap(this.getMessage))
    }

    getMessage = (messageWithSender: MessageWithSender): Observable<AdvPrimeMessage> => {
        switch (messageWithSender.sender) {
            case MESSAGE_SENDER.USER:
                return this.getUserMessage(messageWithSender)
            case MESSAGE_SENDER.CACHE:
                this.allocatedMessageSpots++
                return of(messageWithSender.message)
            case MESSAGE_SENDER.SCHREDDER:
                return never()
        }
    }

    getUserMessage(messageWithSender: MessageWithSender): Observable<AdvPrimeMessage> {
        if (this.allocatedMessageSpots >= this.messageSpots) {
            this.messageCache.push(messageWithSender.message)
            return never()
        } else {
            this.allocatedMessageSpots++
            return of(messageWithSender.message)
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
