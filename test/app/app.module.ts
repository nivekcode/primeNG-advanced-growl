import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/primeng';
import {AdvGrowlModule} from '../../lib/messages/adv-growl.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ButtonModule,
        AdvGrowlModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
