import {Component, OnInit} from '@angular/core';
import {AdvGrowlService} from 'primeng-advanced-growl';
import {AdvPrimeMessage} from 'primeng-advanced-growl';

// TODO kk - fix this
// import packageJSON from '../../package.json';

const DEFAULT_MESSAGE_SPOTS = 0;
const DEFAULT_LIFETIME = 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.styles.css']
})
export class AppComponent implements OnInit {

  messages = [];
  lifeTime = DEFAULT_LIFETIME;
  messageSpots = DEFAULT_MESSAGE_SPOTS;
  freezeMessagesOnHover = false;
  pauseOnlyHoveredMessage = false;
  version: string;

  constructor(private advMessagesService: AdvGrowlService) {
  }

  ngOnInit(): void {
    this.version = '4.0.0';
  }

  public toggleFreeze() {
    this.freezeMessagesOnHover = !this.freezeMessagesOnHover;
  }

  public togglePauseOnlyHovered() {
    this.pauseOnlyHoveredMessage = !this.pauseOnlyHoveredMessage;
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
      console.log(message.additionalProperties.clickMessage);
    } else {
      console.log('You clicked on message', message);
    }
  }

  public logClose(message: AdvPrimeMessage) {
    console.log('You closed message', message);
  }

  public onMessages(messages) {
    this.messages = messages;
  }

  public createNonDuplicatedSuccessMessage(): void {
    const index = this.messages.findIndex(message => message.summary === 'Awesome success');
    if (index < 0) {
      this.createSuccessMessage();
    }
  }

}
