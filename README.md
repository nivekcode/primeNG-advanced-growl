# PrimeNGAdvancedGrowl

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [AdvGrowlModul](#advgrowlmodul)
  - [What is missing on PrimeNG?](#what-is-missing-on-primeng)
  - [What does the AdvGrowlModule is offering?](#what-does-the-advgrowlmodule-is-offering)
  - [How do you use PrimeNGAdvancedGrowl?](#how-do-you-use-primengadvancedgrowl)
    - [installation](#installation)
    - [AdvGrowlComponent](#advgrowlcomponent)
      - [Input](#input)
      - [Output](#output)
    - [AdvGrowlService](#advgrowlservice)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# AdvGrowlModul

The AdvGrowlModule is a wrapper around the growl module from PrimeNG. This wrapper was created
because PrimeNG is missing some features.

## What is missing on PrimeNG?
- PrimeNG module does not offer a central service to
create growl messages. The PrimeNG message modul strongly couples the template and the component.
You need to include the growl component in each template.
- PrimeNG growl offers us to define a sticky property to remove the messages. When we set the lifetime
of the messages to 3 seconds all messages will be removed after the specified time. The problem comes
when a message gets created 2 seconds after the first message. This message will not be removed after
the specified 3 seconds. This message will be removed 1 seconds after creation. This is the point where
the 3 seconds from the first message have passed.

## What does the AdvGrowlModule is offering?
- The AdvGrowlModule provides you the sticky feature with a unique lifetime for each message. The specified
lifetime is unique for each message. The growl message will only disappear after the given time has elapsed
or you pressed the cancel button on the growl message.
- The PrimeNGAdvancedGrowl module provides you a messageservice.
With the help of this service you have a central way to create growl messages.

## How do you use PrimeNGAdvancedGrowl?
### installation
PrimeNGAdvancedGrowl is an node_module and therefore it is provided over npm. To install it node and npm
are required.
```
npm install --save TODO
```

To use the AdvGrowlService and the AdvGrowlComponent you need to import the AdvGrowlModul in your appliction.
```javascript
TODO
import {MessagesModule} from 'esta-webjs-extensions';

@NgModule({
    declarations: [AppComponent],
    imports: [MessagesModul]
})
...
```


### AdvGrowlComponent
The AdvGrowlModule exports a component named AdvGrowlComponent. You need to include this component
once in your app.component.html. With the help of this component the advanced PrimeNG growl messages
can be displayed.
```html
TODO
<app-navbar></app-navbar>
<esta-messages></esta-messages>
<div class="container">
    <router-outlet></router-outlet>
</div>
```

The advanced growl messages component has the following in- and outputs.

#### Input
| Input        | Description                                                                                                                                                                                                                                                                                    |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| style        | Inline styles that should be applied to the growl component of PrimeNG                                                                                                                                                                                                                         |
| styleClass   | Style class for the growl component of PrimeNG                                                                                                                                                                                                                                                 |
| life: number | A number that represents the lifetime of each growl message. If set to 3000 each message will be disappear after 3 seconds. If no life param is passed to the components the growl messages are sticky and do not disappear until you call clearMessages or click on the cancel x on a message |

#### Output

| onClose | Throws an event with the closed message |
|---------|-----------------------------------------|

### AdvGrowlService
The AdvGrowlService allows you to create and delete messages. The AdvGrowlService
can be accessed over dependency injection inside your component.

```javascript
TODO
import {MessagesService} from 'esta-webjs-extensions';

@Component({
    selector: ...,
    templateUrl: ...
})
export class SampleComponent{

    constructor(private messagesService: MessagesService){
    }
}
```

The AdvGrowlService provides the following methods to create messages. Each method expects
the message content and a message title.

- createSuccessMessage(messageContent: string, summary: string): void
- createInfoMessage(messageContent: string, summary: string): void
- createWarningMessage(messageContent: string, summary: string): void
- createErrorMessage(messageContent: string, summary: string): void

To clear all messages you can call the **clearMessages()** method from the AdvGrowlService.

