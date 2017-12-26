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

    describe('createSuccessMessage', () => {

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
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage)
                    done();
                });
            // when
            sut.createSuccessMessage(messageContent, messageSummary);
        });

        it('should create a successmessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awesome Message';
            const messageSummary = 'Success';
            const additionalProperties = {title: 'test', description: 'Test message'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'success',
                summary: messageSummary,
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage)
                    done();
                });
            // when
            sut.createSuccessMessage(messageContent, messageSummary, additionalProperties);
        })
    })

    describe('createErrorMessage', () => {

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
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createErrorMessage(messageContent, messageSummary);
        });

        it('should create a errormessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awful Error';
            const messageSummary = 'Error';
            const additionalProperties = {title: 'Error message', description: 'something went wrong'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'error',
                summary: messageSummary,
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createErrorMessage(messageContent, messageSummary, additionalProperties);
        })
    })

    describe('createInfoMessage', () => {

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
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createInfoMessage(messageContent, messageSummary);
        });

        it('should create a infomessage with additonal properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important information';
            const messageSummary = 'Information';
            const additionalProperties = {title: 'Info message', description: 'Just some information'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'info',
                summary: messageSummary,
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createInfoMessage(messageContent, messageSummary, additionalProperties);
        })
    })

    describe('createWarningMessage', () => {

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
                detail: messageContent,
                lifeTime: undefined,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createWarningMessage(messageContent, messageSummary);
        });

        it('should create a warningmessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Super important warning';
            const messageSummary = 'Warning';
            const additionalProperties = {title: 'Warning message', description: 'Some warnings'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'warn',
                summary: messageSummary,
                detail: messageContent,
                lifeTime: undefined,
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

    describe('clearMessages', () => {
        it('should stream a new message in the clearStream when calling clearMessages', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            sut.getCancelStream()
                .subscribe(e => done());
            // when
            sut.clearMessages();
        });
    })

    describe('createTimedSuccessMessage', () => {

        it('should create a timed successmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awesome Message';
            const messageSummary = 'Success';
            const lifeTime = 2000;
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'success',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage)
                    done();
                });
            // when
            sut.createTimedSuccessMessage(messageContent, messageSummary, lifeTime);
        });

        it('should create a timed successmessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Awesome Message'
            const messageSummary = 'Success'
            const lifeTime = 2000
            const additionalProperties = {title: 'test', description: 'Test message'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'success',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage)
                    done();
                });
            // when
            sut.createTimedSuccessMessage(messageContent, messageSummary, lifeTime, additionalProperties);
        })
    })

    describe('createTimedErrorMessage', () => {

        it('should create a timed errormessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService);
            const messageContent = 'Awful Error';
            const messageSummary = 'Error';
            const lifeTime = 2000;
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'error',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createTimedErrorMessage(messageContent, messageSummary, lifeTime);
        });

        it('should create a timed errormessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Awful Error'
            const messageSummary = 'Error'
            const lifeTime = 2000
            const additionalProperties = {title: 'Error message', description: 'something went wrong'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'error',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createTimedErrorMessage(messageContent, messageSummary, lifeTime, additionalProperties);
        })
    })

    describe('createTimedInfoMessage', () => {

        it('should create a timed infomessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Super important information'
            const messageSummary = 'Information'
            const lifeTime = 2000
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'info',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createTimedInfoMessage(messageContent, messageSummary, lifeTime);
        });

        it('should create a timed infomessage with additonal properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Super important information'
            const messageSummary = 'Information'
            const lifeTime = 2000
            const additionalProperties = {title: 'Info message', description: 'Just some information'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'info',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createTimedInfoMessage(messageContent, messageSummary, lifeTime, additionalProperties);
        })
    })

    describe('createTimedWarningMessage', () => {

        it('should create a timed warningmessage and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Super important warning'
            const messageSummary = 'Warning'
            const lifeTime = 2000
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'warn',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties: undefined
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                });
            // when
            sut.createTimedWarningMessage(messageContent, messageSummary, lifeTime);
        });

        it('should create a timed warningmessage with additional properties and stream it into the message subject', done => {
            // given
            const sut = TestBed.get(AdvGrowlService)
            const messageContent = 'Super important warning'
            const messageSummary = 'Warning'
            const lifeTime = 2000
            const additionalProperties = {title: 'Warning message', description: 'Some warnings'}
            const id = 1;
            spyOn(sut, 'getTimeStamp').and.returnValue(id);
            const expectedMessage = {
                id,
                severity: 'warn',
                summary: messageSummary,
                detail: messageContent,
                lifeTime,
                additionalProperties
            };
            sut.getMessageStream()
                .subscribe(message => {
                    expect(message).toEqual(expectedMessage);
                    done();
                })
            // when
            sut.createTimedWarningMessage(messageContent, messageSummary, lifeTime, additionalProperties);
        })
    })
})
