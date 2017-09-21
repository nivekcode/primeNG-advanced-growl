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

import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/interval'

const MOUSE_LEFT = 'MOUSE_LEFT';
const STEP_TIME_UNIT = 100;

export class AdvGrowlHoverHelper {

    private messageHover$: Observable<string>

    constructor(mouseenter$: Observable<string>, mouseleave$: Observable<string>) {
        this.messageHover$ = Observable.merge(
            mouseenter$, mouseleave$.mapTo(MOUSE_LEFT)
        )
            .startWith(MOUSE_LEFT)
    }

    public getPausableMessageStream(messageId: string, lifeTime: number) {
        return this.messageHover$.switchMap((hoveredMessageId: string) => {
                if (hoveredMessageId === messageId) {
                    return Observable.empty()
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
}
