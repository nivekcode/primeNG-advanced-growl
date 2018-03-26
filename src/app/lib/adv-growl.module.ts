import {NgModule} from '@angular/core';
import {GrowlModule} from 'primeng/growl';
import {AdvGrowlComponent} from './adv-growl.component';
import {AdvGrowlService} from './adv-growl.service';

@NgModule({
    imports: [GrowlModule],
    declarations: [AdvGrowlComponent],
    providers: [AdvGrowlService],
    exports: [AdvGrowlComponent]
})
export class AdvGrowlModule {
}
