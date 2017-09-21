import {Component} from '@angular/core';
import {AdvGrowlService} from '../../lib/messages/adv-growl.service';
import {AdvPrimeMessage} from '../../lib/messages/adv-growl.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.styles.css']
})
export class AppComponent {

    messages = [];
    lifeTime = 3000;
    freezeMessagesOnHover = true;
    version = require('../../package.json').version;

    constructor(private advMessagesService: AdvGrowlService) {
    }

    public toggleFreeze() {
        this.freezeMessagesOnHover = !this.freezeMessagesOnHover;
    }

    public createInfoMessage(): void {
        this.advMessagesService.createInfoMessage('Awesome success message content', 'Awesome info');
    }

    public createSuccessMessage(): void {
        this.advMessagesService.createSuccessMessage('Awesome success message content', 'Awesome success');
    }

    public createSuccessMessageWithAdditionalInfos(): void {
        this.advMessagesService.createSuccessMessage('Awesome success message content', 'Awesome success', {
            clickMessage: 'Awesome click'
        });
    }

    public createWarningMessage(): void {
        this.advMessagesService.createWarningMessage('Important warning content', 'Important warning');
    }

    public createErrorMessage(): void {
        this.advMessagesService.createErrorMessage('Awful error message', 'Error summary');
    }

    public clearMessages(): void {
        this.advMessagesService.clearMessages();
    }

    public logMessage(message: AdvPrimeMessage) {
        if (message.additionalProperties) {
            console.log(message.additionalProperties.clickMessage)
        } else {
            console.log('You clicked on message', message)
        }
    }

    public logClose(message: AdvPrimeMessage) {
        console.log('You closed message', message)
    }

    public onMessages(messages) {
        this.messages = messages;
    }

    public createNonDuplicatedSuccessMessage(): void {
        const index = this.messages.findIndex(message => message.summary === 'Awesome success');
        if (index < 0) {
            this.createSuccessMessage()
        }
    }
}
