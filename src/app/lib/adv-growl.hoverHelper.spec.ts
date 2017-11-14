import {AdvGrowlHoverHelper, MOUSE_LEFT_ID} from './adv-growl.hoverHelper';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

describe('AdvGrowlHoverHelper', () => {

    let sut
    let mouseenter$
    let mouseleave$

    beforeEach(() => {
        mouseenter$ = new Subject<string>()
        mouseleave$ = new Subject<string>()
        sut = new AdvGrowlHoverHelper(mouseenter$, mouseleave$)
    })

    describe('Initialisation and setup', () => {

        it(`should combine the mouseenter$ and the mouseleave$ to a messagehover$
            and stream the MOUSE_LEFT_ID as a starting value`, () => {
            // given
            const enterMessage = 'I entered the message'
            const hoveredMessages: Array<string> = []

            const observer = {
                next: hoverMessage => hoveredMessages.push(hoverMessage)
            }
            sut.messageHover$.subscribe(observer)

            // when
            mouseenter$.next(enterMessage)
            mouseleave$.next()

            // then
            expect(hoveredMessages[0]).toBe(MOUSE_LEFT_ID)
            expect(hoveredMessages[1]).toBe(enterMessage)
            expect(hoveredMessages[2]).toBe(MOUSE_LEFT_ID)
        })
    })

    describe('get pausable message stream', () => {

        it(`should return an empty observable if we only want to pause the hovered messageId and
            the hoveredMessageId is the same as the messageId of the currently displayed message`, () => {
            // given
            const messageId = '42'
            const hoveredMessageId = '42'
            const lifeTime = 2000
            const pauseOnlyHovered = true
            spyOn(Observable, 'interval').and.returnValue(Observable.create(function (observer) {
                observer.next(MOUSE_LEFT_ID)
            }))
            spyOn(Observable, 'never').and.returnValue(Observable.create(function () {
            }))

            // when
            sut.getPausableMessageStream(messageId, lifeTime, pauseOnlyHovered)
                .subscribe(() => {
                })
            mouseenter$.next(hoveredMessageId)

            // then
            expect(Observable.interval).toHaveBeenCalled()
            expect(Observable.never).toHaveBeenCalled()
        })

        it('should return an empty observable if want to pause all messages and we enter a message', () => {
            // given
            const messageId = '42'
            const hoveredMessageId = '42'
            const lifeTime = 2000
            const pauseOnlyHovered = false
            spyOn(Observable, 'interval').and.returnValue(Observable.create(function (observer) {
                observer.next(MOUSE_LEFT_ID)
            }))
            spyOn(Observable, 'never').and.returnValue(Observable.create(function () {
            }))

            // when
            sut.getPausableMessageStream(messageId, lifeTime, pauseOnlyHovered)
                .subscribe(() => {
                })
            mouseenter$.next(hoveredMessageId)

            // then
            expect(Observable.interval).toHaveBeenCalled()
            expect(Observable.never).toHaveBeenCalled()
        })
    })

    describe('Detection if the message is entered', () => {

        it('should detect that the MOUSE_LEFT_ID occurs when we leave a message', () => {
            // given
            const hoveredMessageId = MOUSE_LEFT_ID
            // when
            const isMessageEntered = sut.isMessageEntered(hoveredMessageId)
            // then
            expect(isMessageEntered).toBeFalsy()
        })

        it('should detect that the id 1 occurs when we enter a message', () => {
            // given
            const hoveredMessageId = 1
            // when
            const isMessageEntered = sut.isMessageEntered(hoveredMessageId)
            // then
            expect(isMessageEntered).toBeTruthy()
        })
    })
})
