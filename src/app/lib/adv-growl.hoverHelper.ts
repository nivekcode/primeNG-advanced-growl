
import {interval as observableInterval, never as observableNever, merge as observableMerge} from 'rxjs';
/**
 * Created by kevinkreuzer on 08.07.17.
 */
import {Observable} from 'rxjs'
import {materialize, dematerialize, startWith, takeWhile, last, tap, mapTo, switchMap} from 'rxjs/operators';



export const MOUSE_LEFT_ID = 'MOUSE_LEFT_ID';
const STEP_TIME_UNIT = 100;

export class AdvGrowlHoverHelper {

    private messageHover$: Observable<string>

    constructor(mouseenter$: Observable<string>, mouseleave$: Observable<any>) {
        this.messageHover$ = observableMerge(
            mouseenter$, mouseleave$.pipe(mapTo(MOUSE_LEFT_ID),
            startWith(MOUSE_LEFT_ID)))
    }

    public getPausableMessageStream(messageId: string, lifeTime: number, pauseOnlyHovered: boolean) {

        return this.messageHover$.pipe(switchMap((hoveredMessageId: string) => {

                if (this.isMessageEntered(hoveredMessageId) && !pauseOnlyHovered) {
                    return observableNever().pipe(materialize())
                }

                if (hoveredMessageId === messageId) {
                    return observableNever().pipe(materialize())
                }
                return observableInterval(STEP_TIME_UNIT)
                    .pipe(tap(() => lifeTime -= STEP_TIME_UNIT),
                    mapTo(messageId),
                    takeWhile(() => lifeTime !== 0),
                    materialize())
            })
        )
            .pipe(dematerialize(),
            last())
    }

    isMessageEntered(hoveredMessageId: string): boolean {
        return hoveredMessageId !== MOUSE_LEFT_ID
    }
}
