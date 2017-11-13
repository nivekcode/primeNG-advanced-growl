/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Observable} from 'rxjs/Observable'

import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/materialize'
import 'rxjs/add/operator/dematerialize'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/takeWhile'
import 'rxjs/add/operator/last'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/switchMap'

import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/never'
import 'rxjs/add/observable/interval'

export const MOUSE_LEFT_ID = 'MOUSE_LEFT_ID';
const STEP_TIME_UNIT = 100;

export class AdvGrowlHoverHelper {

    private messageHover$: Observable<string>

    constructor(mouseenter$: Observable<string>, mouseleave$: Observable<any>) {
        this.messageHover$ = Observable.merge(
            mouseenter$, mouseleave$.mapTo(MOUSE_LEFT_ID)
        )
            .startWith(MOUSE_LEFT_ID)
    }

    public getPausableMessageStream(messageId: string, lifeTime: number, pauseOnlyHovered: boolean) {

        return this.messageHover$.switchMap((hoveredMessageId: string) => {

                if (this.isMessageEntered(hoveredMessageId) && !pauseOnlyHovered) {
                    return Observable.never().materialize()
                }

                if (hoveredMessageId === messageId) {
                    return Observable.never().materialize()
                }
                return Observable.interval(STEP_TIME_UNIT)
                    .do(() => lifeTime -= STEP_TIME_UNIT)
                    .mapTo(messageId)
                    .takeWhile(() => lifeTime !== 0)
                    .materialize()
            }
        )
            .dematerialize()
            .last()
    }

    isMessageEntered(hoveredMessageId: string): boolean {
        return hoveredMessageId !== MOUSE_LEFT_ID
    }
}
