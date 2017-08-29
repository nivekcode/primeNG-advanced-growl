/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Servcice
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {AdvPrimeMessage} from './adv-growl.model';
import {UUID} from 'angular2-uuid';

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

    constructor() {
    }

    public createSuccessMessage(messageContent: string, summary: string, additionalProperties?: any): void {
        this.createMessage(MessageSeverities.SUCCESS, summary, messageContent, additionalProperties);
    }

    public createInfoMessage(messageContent: string, summary: string, additionalProperties?: any): void {
        this.createMessage(MessageSeverities.INFO, summary, messageContent, additionalProperties);
    }

    public createWarningMessage(messageContent: string, summary: string, additionalProperties?: any): void {
        this.createMessage(MessageSeverities.WARN, summary, messageContent, additionalProperties);
    }

    public createErrorMessage(messageContent: string, summary: string, additionalProperties?: any): void {
        this.createMessage(MessageSeverities.ERROR, summary, messageContent, additionalProperties);
    }

    private createMessage(severity: string, summary: string, detail: string, additionalProperties?: any): void {
        if (additionalProperties) {
            this.message$.next({id: UUID.UUID(), severity, summary, detail, additionalProperties});
        } else {
            this.message$.next({id: UUID.UUID(), severity, summary, detail});
        }
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
