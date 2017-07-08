/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {TestBed, inject, ComponentFixture} from '@angular/core/testing';
import {GrowlModule, Message} from 'primeng/primeng';
import {AdvGrowlMessagesComponent} from './adv-growl-message.component';
import {AdvMessagesService} from './adv-growl-messages.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/of';
import {AdvPrimeMessage} from './adv-growl-message.model';

describe('Message Component', () => {

    let component: AdvGrowlMessagesComponent;
    let fixture: ComponentFixture<AdvGrowlMessagesComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [GrowlModule],
            declarations: [AdvGrowlMessagesComponent],
            providers: [AdvMessagesService]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdvGrowlMessagesComponent);
        component = fixture.componentInstance;
    });

    describe('Subscribe for messages', () => {

        const createMessage = (id: string, severity: string, summary: string, detail: string): AdvPrimeMessage => (
            {id, severity, summary, detail}
        );

        it(`should add all arriving messages and not emit a new value which indicates that
            none of the messages should be removed`,
            inject([AdvMessagesService], (messagesService: AdvMessagesService) => {
                // given
                const expectedMessages: Array<AdvPrimeMessage> = [
                    createMessage('1', 'success', 'awesome message', 'awesome detail'),
                    createMessage('2', 'wanring', 'awesome message', 'awesome detail'),
                    createMessage('3', 'error', 'awesome message', 'awesome detail')
                ];
                const messages$ = Observable.create(observer => {
                    expectedMessages.forEach(message => {
                        observer.next(message);
                    });
                });
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);
                spyOn(messagesService, 'getCancelStream').and.returnValue(Observable.never());
                // when
                component.subscribeForMessages();
                // then
                expect(component.messages).toEqual(expectedMessages);
            }));

        it('should return an empty observable when no lifetime is set', () => {
            // given
            spyOn(Observable, 'empty');
            const messageId = '123456789';
            // when
            component.getLifeTimeStream(messageId);
            // then
            expect(Observable.empty).toHaveBeenCalled();
        });

        it('should return an observable that emits the messageId after the lifetime has passed', () => {
            // given
            spyOn(Observable, 'timer').and.returnValue(Observable.of(1));
            spyOn(Observable.prototype, 'mapTo');
            component.life = 3000;
            const messageId = '12345678';
            // when
            component.getLifeTimeStream(messageId);
            // then
            expect(Observable.timer).toHaveBeenCalledWith(3000);
            expect(Observable.prototype.mapTo).toHaveBeenCalledWith(messageId);
        });

        it('it should call removeMessage in subscribe when a message is cleared',
            inject([AdvMessagesService], (messagesService: AdvMessagesService) => {
                // given
                const expectedMessages: Array<Message> = [
                    createMessage('1', 'success', 'awesome message', 'awesome detail'),
                    createMessage('2', 'wanring', 'awesome message', 'awesome detail'),
                    createMessage('3', 'error', 'awesome message', 'awesome detail')
                ];
                const messages$ = Observable.create(observer => {
                    expectedMessages.forEach(message => {
                        observer.next(message);
                    });
                });
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);
                spyOn(component, 'getLifeTimeStream').and.returnValue(Observable.of(1));
                spyOn(component, 'removeMessage');
                // when
                component.subscribeForMessages();
                // then
                expect(component.removeMessage).toHaveBeenCalledTimes(3);
            })
        );

        it(`it should call unshift in subscribe until the clearStream emits a value,
            in this case it should automatically resubscribe to the messagestream`,
            inject([AdvMessagesService], (messagesService: AdvMessagesService) => {
                // given
                let numberOfCalls = 0;
                const expectedMessages = [
                    createMessage('1', 'success', 'awesome message', 'awesome detail'),
                    createMessage('2', 'wanring', 'awesome message', 'awesome detail'),
                    createMessage('3', 'error', 'awesome message', 'awesome detail')
                ];
                const messages$ = Observable.create(observer => {
                    expectedMessages.forEach(message => {
                        observer.next(message);
                    });
                });
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);
                spyOn(messagesService, 'getCancelStream').and.callFake(() => {
                    if (numberOfCalls === 0) {
                        numberOfCalls++;
                        return Observable.of(1);
                    }
                    return Observable.empty();
                });
                spyOn(component, 'getLifeTimeStream').and.returnValue(Observable.of(1));
                spyOn(Array.prototype, 'shift');
                spyOn(component, 'subscribeForMessages').and.callThrough();
                // when
                component.subscribeForMessages();
                // then
                expect(component.subscribeForMessages).toHaveBeenCalledTimes(2);
            }));

        it('should remove the message with the matching messageId', () => {
            // given
            const messageId = '1';
            const message1 = createMessage('1', 'success', 'awesome message', 'awesome detail');
            const message2 = createMessage('2', 'wanring', 'awesome message', 'awesome detail');
            const message3 = createMessage('3', 'error', 'awesome message', 'awesome detail');
            component.messages = [message1, message2, message3];
            // when
            component.removeMessage(messageId);
            // then
            expect(component.messages).toEqual([message2, message3]);
        });

        it('should not remove a message when no matching Id was found', () => {
            // given
            const messageId = '4';
            const message1 = createMessage('1', 'success', 'awesome message', 'awesome detail');
            const message2 = createMessage('2', 'wanring', 'awesome message', 'awesome detail');
            const message3 = createMessage('3', 'error', 'awesome message', 'awesome detail');
            component.messages = [message1, message2, message3];
            // when
            component.removeMessage(messageId);
            // then
            expect(component.messages).toEqual([message1, message2, message3]);
        });

        it('should throw an error when an error occures',
            inject([AdvMessagesService], (messagesService: AdvMessagesService) => {
                // given
                const errorMessage = 'Awful error';
                const messages$ = Observable.throw(new Error(errorMessage));
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);

                // when then
                expect(() => component.subscribeForMessages()).toThrowError(errorMessage);
            }));

        it('should emit a the onClosed event when a message is closed', () => {
            // given
            spyOn(component.onClose, 'next');
            const $event = {
                message: 'Awesome Message'
            };
            // when
            component.messageClosed($event);
            // then
            expect(component.onClose.next).toHaveBeenCalledWith($event);
        });
    });
});
