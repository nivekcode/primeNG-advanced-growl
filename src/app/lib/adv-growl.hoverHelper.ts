
import {interval as observableInterval, never as observableNever, merge as observableMerge} from 'rxjs';
/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Observable} from 'rxjs'

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





export const MOUSE_LEFT_ID = 'MOUSE_LEFT_ID';
const STEP_TIME_UNIT = 100;

export class AdvGrowlHoverHelper {

    private messageHover$: Observable<string>

    constructor(mouseenter$: Observable<string>, mouseleave$: Observable<any>) {
        this.messageHover$ = observableMerge(
            mouseenter$, mouseleave$.mapTo(MOUSE_LEFT_ID)
        )
            .startWith(MOUSE_LEFT_ID)
    }

    public getPausableMessageStream(messageId: string, lifeTime: number, pauseOnlyHovered: boolean) {

        return this.messageHover$.switchMap((hoveredMessageId: string) => {

                if (this.isMessageEntered(hoveredMessageId) && !pauseOnlyHovered) {
                    return observableNever().materialize()
                }

                if (hoveredMessageId === messageId) {
                    return observableNever().materialize()
                }
                return observableInterval(STEP_TIME_UNIT)
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
