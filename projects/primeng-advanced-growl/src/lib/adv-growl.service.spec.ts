import {TestBed} from '@angular/core/testing';
import {GrowlModule} from 'primeng/primeng';
import {AdvGrowlService} from './adv-growl.service';

describe('Message Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GrowlModule],
            providers: [AdvGrowlService]
        });
    });

    describe('Creating simple messages', () => {

        it('should create a successmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awesome Message';
            const messageSummary = 'Success';
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'success',
                summary: messageSummary,
                detail: messageContent
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage)
                    done();
                });
            // when
            sut.createSuccessMessage(messageContent, messageSummary);
        });

        it('should create a errormessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awful Error';
            const messageSummary = 'Error';
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'error',
                summary: messageSummary,
                detail: messageContent
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createErrorMessage(messageContent, messageSummary);
        });

        it('should create a infomessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important information';
            const messageSummary = 'Information';
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'info',
                summary: messageSummary,
                detail: messageContent
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createInfoMessage(messageContent, messageSummary);
        });

        it('should create a warningmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important warning';
            const messageSummary = 'Warning';
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'warn',
                summary: messageSummary,
                detail: messageContent
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createWarningMessage(messageContent, messageSummary);
        });
    })

    describe('Streaming messages with additional properties', () => {

        it('should create a successmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awesome Message';
            const messageSummary = 'Success';
            const additionalProperties = {
                clickMessage: 'Awesome click'
            };
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'success',
                summary: messageSummary,
                detail: messageContent,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createSuccessMessage(messageContent, messageSummary, additionalProperties);
        });

        it('should create a errormessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awful Error';
            const messageSummary = 'Error';
            const additionalProperties = {
                clickMessage: 'Awesome click'
            };
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'error',
                summary: messageSummary,
                detail: messageContent,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createErrorMessage(messageContent, messageSummary, additionalProperties);
        });

        it('should create a infomessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important information';
            const messageSummary = 'Information';
            const additionalProperties = {
                clickMessage: 'Awesome click'
            };
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'info',
                summary: messageSummary,
                detail: messageContent,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createInfoMessage(messageContent, messageSummary, additionalProperties);
        });

        it('should create a warningmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important warning';
            const messageSummary = 'Warning';
            const additionalProperties = {
                clickMessage: 'Awesome click'
            };
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'warn',
                summary: messageSummary,
                detail: messageContent,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createWarningMessage(messageContent, messageSummary, additionalProperties);
        });
    })

    describe('Clearing messages', () => {
        it('should stream a new message in the clearStream when calling clearMessages', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            sut.getCancelStream()
                .subscribe(e => done());
            // when
            sut.clearMessages();
        });
    })

    describe('Retrieve AdvPrime instances', () => {

        const methodsToBeTested = [
            'createSuccessMessage',
            'createInfoMessage',
            'createWarningMessage',
            'createErrorMessage'
        ];

        methodsToBeTested.forEach((methodToBeTested: string) => {

            it(`must return the AdvPrimeMessage when we call ${methodToBeTested}`, () => {
                // given
                const sut = TestBed.get(AdvGrowlService);
                const messageContent = 'awesome message';
                const summary = 'awesome message';

                // when
                const advPrimeMessage = sut[methodToBeTested](messageContent, summary)
                // then
                expect(advPrimeMessage.detail).toBe(messageContent);
                expect(advPrimeMessage.summary).toBe(summary);
            })
        })
    })
})




