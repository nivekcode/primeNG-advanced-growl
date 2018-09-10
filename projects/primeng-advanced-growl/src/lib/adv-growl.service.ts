/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Servcice
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {Injectable} from '@angular/core';
import {AdvPrimeMessage} from './adv-growl.model';
import {Observable, Subject} from 'rxjs';

const MessageSeverities = {
    SUCCESS: 'success',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

@Injectable()
export class AdvGrowlService {

    private message$: Subject<AdvPrimeMessage> = new Subject<AdvPrimeMessage>();
    private cancel$: Subject<any> = new Subject<any>();
    private readonly NO_LIFETIME_SPECIFIED = undefined;

    constructor() {
    }

    public createSuccessMessage(messageContent: string, summary: string, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.SUCCESS, summary, messageContent, this.NO_LIFETIME_SPECIFIED, additionalProperties);
    }

    public createTimedSuccessMessage(
        messageContent: string, summary: string, lifeTime: number, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.SUCCESS, summary, messageContent, lifeTime, additionalProperties);
    }

    public createInfoMessage(messageContent: string, summary: string, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.INFO, summary, messageContent, this.NO_LIFETIME_SPECIFIED, additionalProperties);
    }

    public createTimedInfoMessage(messageContent: string, summary: string, lifeTime: number, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.INFO, summary, messageContent, lifeTime, additionalProperties);
    }

    public createWarningMessage(messageContent: string, summary: string, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.WARN, summary, messageContent, this.NO_LIFETIME_SPECIFIED, additionalProperties);
    }

    public createTimedWarningMessage(
        messageContent: string, summary: string, lifeTime: number, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.WARN, summary, messageContent, lifeTime, additionalProperties);
    }

    public createErrorMessage(messageContent: string, summary: string, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.ERROR, summary, messageContent, this.NO_LIFETIME_SPECIFIED, additionalProperties);
    }

    public createTimedErrorMessage(messageContent: string, summary: string, lifeTime: number, additionalProperties?: any): AdvPrimeMessage {
        return this.createMessage(MessageSeverities.ERROR, summary, messageContent, lifeTime, additionalProperties);
    }

    private createMessage(
        severity: string, summary: string, detail: string, lifeTime?: number, additionalProperties?: any): AdvPrimeMessage {
        const advPrimeMessage = {id: this.getTimeStamp(), severity, summary, detail, lifeTime, additionalProperties};
        this.message$.next(advPrimeMessage);
        return advPrimeMessage;
    }

    private getTimeStamp(): string {
        return new Date().getTime() + ''
    }

    public clearMessages(): void {
        this.cancel$.next();
    }

    public getMessageStream(): Observable<AdvPrimeMessage> {
        return this.message$.asObservable();
    }

    public getCancelStream(): Observable<boolean> {
        return this.cancel$.asObservable();
    }
}
