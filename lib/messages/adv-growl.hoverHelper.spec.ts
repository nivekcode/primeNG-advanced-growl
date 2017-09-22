import {AdvGrowlHoverHelper, MOUSE_LEFT_ID} from './adv-growl.hoverHelper';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/of'

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

        it(`should return an empty observable if the hoveredMessageId is the same
            as the messageId of the currently displayed message`, () => {
            // given
            const messageId = '42'
            const hoveredMessageId = '42'
            const lifeTime = 2000
            spyOn(Observable, 'empty').and.returnValue(Observable.create(function(){
            }))

            // when
            sut.getPausableMessageStream(messageId, lifeTime)
                .subscribe(() => {
                })
            mouseenter$.next(hoveredMessageId)

            // then
            expect(Observable.empty).toHaveBeenCalled()
        })
    })
})
