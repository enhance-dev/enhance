# Enhance element
An element base class to cut down on web component boilerplate when progressively enhancing your HTML.

## Install
`npm i @enhance/element`

## Usage

```html
<my-button label="Click me"></my-button>
```

```javascript

enhance('my-button', {
  api,
  attrs: [ 'label' ],
  keys: [ 'one', 'two', 'three' ],
  init(el) {
    el.addEventListener('click', el.click)
  },
  render({ html, state }) {
    const { attrs={} } = state
    const { label='Nope' } = attrs
    return html`
    <pre>
      ${JSON.stringify(state)}
    </pre>
    <button>${label}</button>
    `
  },
  click(e) {
    console.log('CLICK')
  },
  connected() {
    console.log('CONNECTED')
  },
  disconnected() {
    console.log('DISCONNECTED')
  }
})

```
**api**:Object

The `api` object is used in the Enhance state management flow.
`api` object must expose a subscribe and unsubscribe methods that accept a listener function to be passed a state object when an update occurs.

**keys**:Array

The `keys` array contains strings corresponding to the keys on a state object.
Your Enhance Element will only update when a specified key updates in the state object.

**attrs**:Array

The `attrs` array is where you declare what attributes you want your component to update

**init**:Function

The `init` function will be called once and is where you should run your setup code like adding event listeners, grabbing DOM references etc.

**render**:Function

The `render` function is a pure function that returns an HTML string

**connected**:Function

The `connected` function is called when your component is added to the page

**disconnected**:Function

The `disconnected` function is called when your component is removed to the page

