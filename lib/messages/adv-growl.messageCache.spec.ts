import {AdvGrowlMessageCache, MESSAGE_SENDER} from './adv-growl.messageCache';
import {Observable} from 'rxjs/Observable';

describe('AdvGrowl Message Cache', () => {

    const maxNumberOfMessages = 5
    const sut = new AdvGrowlMessageCache(maxNumberOfMessages)

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

    fdescribe('Get user messages', () => {

        it('should cache messgaes and wait if there are no more spots available', () => {
            // given
            const message = 'Awesome message' as any
            const messageWithSender = {sender: MESSAGE_SENDER.USER, message: message}
            sut.allocatedMessageSpots = maxNumberOfMessages

            spyOn(Observable, 'never')

            // when
            sut.getUserMessage(messageWithSender)
            // then
            expect(sut.messageCache).toEqual([message])
            expect(Observable.never).toHaveBeenCalled()
        })
    })
})

