import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {AdvGrowlModule} from 'primeng-advanced-growl';

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
