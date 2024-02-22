# enhance-event-handler-mixin
The Enhance event handler mixin is used to simplify adding event listeners to your Custom Element in markup.
Adding a function with the same name as a valid event name will add the event listener automatically.
Meaning if you have a function named `click` it will get called when a user clicks on your component.

## Install
`npm i @enhance/event-handler-mixin`

## Usage
Add an attribute with a valid event name and a function of the same name and in it will get called when a user triggers that event.

```html
<my-component click></my-component>
```

```javascript
import CustomElement from '@enhance/custom-element'
import EventHandlerMixin from '@enhance/event-handler-mixin'

class MyComponent extends EventHandlerMixin(CustomElement) {
  constructor() {
    super()
  }

  click = e => {
    alert('You clicked me!')
  }

  render({ html }) {
    return html`
      <button>Click me!</button>
    `
  }
}
```

## Advanced Usage
Add an attribute with a valid event name and give it a value of the child element to target and the event handler will get called when a user triggers the event on the target child element.

```html
<my-component blur="input[type='email']" click="button"></my-component>
```

```javascript
import CustomElement from '@enhance/custom-element'
import EventHandlerMixin from '@enhance/event-handler-mixin'

class MyComponent extends EventHandlerMixin(CustomElement) {
  constructor() {
    super()
  }

  blur = e => {
    alert('Get your blur on!')
  }

  click = e => {
    alert('You clicked me!')
  }

  render({ html }) {
    return html`
      <input type="email">
      <button>Click me!</button>
    `
  }
}
```
### Considerations
This is a convenience method that does not offer all of the abilities of adding an event listener yourself.
In more advanced use cases where you would need an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) the standard [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) would need to be used.



