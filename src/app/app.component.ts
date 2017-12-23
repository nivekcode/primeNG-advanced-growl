import {Component} from '@angular/core';
import {AdvGrowlService} from './lib/adv-growl.service';
import {AdvPrimeMessage} from './lib/adv-growl.model';

const DEFAULT_MESSAGE_SPOTS = 0
const DEFAULT_LIFETIME = 0

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.styles.css']
})
export class AppComponent {

    messages = []
    lifeTime = DEFAULT_LIFETIME
    messageSpots = DEFAULT_MESSAGE_SPOTS
    freezeMessagesOnHover = false
    pauseOnlyHoveredMessage = false
    version = require('../../package.json').version

    constructor(private advMessagesService: AdvGrowlService) {
    }

    public toggleFreeze() {
        this.freezeMessagesOnHover = !this.freezeMessagesOnHover
    }

    public togglePauseOnlyHovered() {
        this.pauseOnlyHoveredMessage = !this.pauseOnlyHoveredMessage
    }

    public createInfoMessage(): void {
        this.advMessagesService.createInfoMessage('Awesome success message content', 'Awesome info', 3000);
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
        this.advMessagesService.createWarningMessage('Important warning content', 'Important warning', 6000);
    }

    public createErrorMessage(): void {
        this.advMessagesService.createTimedErrorMessage('Awful error message', 'Error summary', 0);
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
