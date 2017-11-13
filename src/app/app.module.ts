import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/primeng';
import {AdvGrowlModule} from './lib/adv-growl.module';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        ButtonModule,
        AdvGrowlModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
