import {Component} from '@angular/core';
import {AdvGrowlService} from '../../lib/messages/adv-growl.service';
import {AdvPrimeMessage} from '../../lib/messages/adv-growl.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    messages = [];

    constructor(private advMessagesService: AdvGrowlService) {
    }

    public createInfoMessage(): void {
        this.advMessagesService.createInfoMessage('Awesome success message content', 'Awesome info');
    }

    public createSuccessMessage(): void {
        this.advMessagesService.createSuccessMessage('Awesome success message content', 'Awesome success');
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
        console.log('You clicked on message', message)
    }
    public logClose(message: AdvPrimeMessage) {
        console.log('You closed message', message)
    }

    public onMessages(messages){
        this.messages = messages;
    }

    public createNonDuplicatedSuccessMessage(): void {
        var index = this.messages.findIndex(message=>message.summary==='Awesome success');
        if(index<0)
            this.advMessagesService.createSuccessMessage('Awesome success message content', 'Awesome success');
    }
}
