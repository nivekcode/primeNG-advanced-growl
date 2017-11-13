/**
 * Created by kevinkreuzer on 16.10.17.
 */
import {AdvGrowlMessageCache, MESSAGE_SENDER} from './adv-growl.messageCache';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty'

describe('AdvGrowl Message Cache', () => {

    const maxNumberOfMessages = 5
    let sut

    beforeEach(() => {
        sut = new AdvGrowlMessageCache()
    })

    describe('Cache interactions', () => {

        it('should detect that the cache is empty if no elements are cached', () => {
            // given
            sut.messageCache = []
            // when
            const isCacheEmpty = sut.isCacheEmpty()
            // then
            expect(isCacheEmpty).toBeTruthy()
        })

        it('should detect that the cache is not empty if there are elements cached', () => {
            // given
            sut.messageCache = ['AwesomeMessage1', 'AwesomeMessage2'] as any
            // when
            const isCacheEmpty = sut.isCacheEmpty()
            // then
            expect(isCacheEmpty).toBeFalsy()
        })

        it('should clear the cache and deallocate all message spots on clearCache()', () => {
            // given
            sut.messageCache = ['AwesomeMessage1', 'AwesomeMessage2'] as any
            sut.allocatedMessageSpots = 2
            // when
            sut.clearCache()
            // then
            expect(sut.messageCache).toEqual([])
            expect(sut.allocatedMessageSpots).toBe(0)
        })
    })

    describe('Deallocating message spots', () => {

        it('should deallocate a messagespot and stream a cached message', () => {
            // given
            const allocatedMessageSpots = 5
            const expectedAllocatedMessageSpots = 4
            const awesomeSuperMessage = 'Awesome super message'
            const normalMessage = 'Normal message'
            sut.messageCache = [awesomeSuperMessage, normalMessage] as any
            sut.allocatedMessageSpots = allocatedMessageSpots

            spyOn(sut, 'isCacheEmpty').and.returnValue(false)
            // when
            sut.deallocateMessageSpot()
            // then
            expect(sut.allocatedMessageSpots).toBe(expectedAllocatedMessageSpots)
            sut.cachedMessage$.subscribe(message => {
                expect(message).toEqual({sender: MESSAGE_SENDER.CACHE, message: awesomeSuperMessage})
            })
        })

        it('should deallocate a messagespot and schredder the message if nothing is cached', () => {
            // given
            const allocatedMessageSpots = 1
            const expectedAllocatedMessageSpots = 0
            sut.messageCache = []
            sut.allocatedMessageSpots = allocatedMessageSpots

            spyOn(sut, 'isCacheEmpty').and.returnValue(true)
            // when
            sut.deallocateMessageSpot()
            // then
            expect(sut.allocatedMessageSpots).toBe(expectedAllocatedMessageSpots)
            sut.schredder$.subscribe(message => {
                expect(message).toEqual({sender: MESSAGE_SENDER.SCHREDDER})
            })
        })
    })

    describe('Get user messages', () => {

        it('should cache messgaes and wait if there are no more spots available', () => {
            // given
            const message = 'Awesome message' as any
            const messageWithSender = {sender: MESSAGE_SENDER.USER, message: message}
            sut.messageSpots = maxNumberOfMessages
            sut.allocatedMessageSpots = maxNumberOfMessages

            spyOn(Observable, 'never')

            // when
            sut.getUserMessage(messageWithSender)
            // then
            expect(sut.messageCache).toEqual([message])
            expect(Observable.never).toHaveBeenCalled()
        })

        it('should allocate a spot for a cached message', () => {
            // given
            const message = 'Awesome message' as any
            const messageWithSender = {sender: MESSAGE_SENDER.USER, message: message}
            sut.allocatedMessageSpots = maxNumberOfMessages - 1
            // when
            const usermessage$ = sut.getUserMessage(messageWithSender)
            // then
            expect(sut.allocatedMessageSpots).toBe(maxNumberOfMessages)
            usermessage$.subscribe(userMessage => expect(userMessage).toBe(message))
        })
    })

    describe('Get message', () => {

        it('should call getUserMessage if the sender is the user', () => {
            // given
            const messageWithSender = {sender: MESSAGE_SENDER.USER, message: 'Awesome message' as any}
            spyOn(sut, 'getUserMessage')
            // when
            sut.getMessage(messageWithSender)
            // then
            expect(sut.getUserMessage).toHaveBeenCalledWith(messageWithSender)
        })

        it('should allocate a spot and return a stream with the message if the sender is the cache', () => {
            // given
            const message = 'Awesome message' as any
            const messageWithSender = {sender: MESSAGE_SENDER.CACHE, message: message}
            const allocatedSpots = 3
            sut.allocatedMessageSpots = allocatedSpots
            // when
            const message$ = sut.getMessage(messageWithSender)
            // then
            expect(sut.allocatedMessageSpots).toBe(allocatedSpots + 1)
            message$.subscribe(messageFromCache => expect(messageFromCache).toBe(message))
        })

        it('should return a stream that never completes if the schredderer is the sender', () => {
            // given
            const messageWithSender = {sender: MESSAGE_SENDER.SCHREDDER}
            spyOn(Observable, 'never')
            // when
            sut.getMessage(messageWithSender)
            // then
            expect(Observable.never).toHaveBeenCalled()
        })
    })

    describe('Get messages', () => {

        it('should return a message if the message Stream emitts a value', () => {
            // given
            const message = 'Awesome message'
            const message$ = Observable.of(message as any)

            spyOn(Observable.prototype, 'switchMap').and.returnValue(Observable.of(message))

            // when
            const messages$ = sut.getMessages(message$, maxNumberOfMessages)
            // then
            messages$.subscribe(m => expect(m).toBe(message))
        })

        it('should call switchMap if the cached message Stream emitts a value', () => {
            // given
            const message = 'Awesome message'
            const message$ = Observable.empty()

            spyOn(Observable.prototype, 'switchMap').and.returnValue(Observable.never())

            // when
            sut.getMessages(message$)
            sut.cachedMessage$.next(message as any)
            // then
            expect(Observable.prototype.switchMap).toHaveBeenCalled()
        })

        it('should call switchMap if the schredder message Stream emitts a value', () => {
            // given
            const message = 'Awesome message'
            const message$ = Observable.empty()

            spyOn(Observable.prototype, 'switchMap').and.returnValue(Observable.never())

            // when
            sut.getMessages(message$, maxNumberOfMessages)
            sut.schredder$.next(message as any)
            // then
            expect(Observable.prototype.switchMap).toHaveBeenCalled()
        })
    })
})

