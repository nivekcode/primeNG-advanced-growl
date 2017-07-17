import {NgModule} from '@angular/core';
import {GrowlModule} from 'primeng/primeng';
import {AdvGrowlMessagesComponent} from './adv-growl-message.component';
import {AdvMessagesService} from './adv-growl-messages.service';

@NgModule({
    imports: [
        GrowlModule
    ],
    declarations: [AdvGrowlMessagesComponent],
    providers: [AdvMessagesService],
    exports: [AdvGrowlMessagesComponent]
})
export class AdvMessagesModule {
}
