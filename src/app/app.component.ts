import {Component} from '@angular/core';
import {AdvMessagesService} from '../../messages/adv-growl-messages.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private advMessagesService: AdvMessagesService) {
    }

    public createInfoMessage() {
        this.advMessagesService.createInfoMessage('Awesome message content', 'Awesome summary');
    }
}
