# Enhance element
HTML first base element class to help cut down on web component boilerplate.

## Install
`npm i @enhance/element`

**unpkg**
`import enhance from 'https://unpkg.com/@enhance/element?module=true'`

[Codepen](https://codepen.io/dam/pen/WNLWbZG)

## Usage

```html
<my-list heading="Todos"></my-list>
```

```javascript

enhance('my-list', {
  api,
  attrs: [ 'heading' ],
  keys: [ 'todos' ],
  init(element) {
    console.log('My List: ', element)
  },
  render({ html, state }) {
    const { attrs={}, store={} } = state
    const { heading='' } = attrs
    const { todos=[{ title: 'You have not todos yet.' }] } = store
    const todoItems = todos
      .map(t => `<li>${t.title || ''}</li>`)
      .join('\n')

    return html`
    <h1>${heading}</h1>
    <ul>
      ${todoItems}
    </ul>
    <!-- debug -->
    <pre>
      ${JSON.stringify(state)}
    </pre>
    `
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

**shadow**:Enum

The `shadow` property can be set to either `open` or `closed` and effects how the components shadow root is "encapsulated".

```javascript
 enhance('my-shady',{
    attrs: [ 'message' ],
    shadow: 'open',
    render({ html, state }) {
      const { attrs={} } = state
      const { message='So shady' } = attrs
      return html`
      <p>
        ${message}
      </p>
      `
    }
  })
```


