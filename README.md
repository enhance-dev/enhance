# enhance-base-element
Base Element class for Enhance components.

The Enhance Base Element enables reuse of single file components.

## Install

`npm i @enhance/base-element`

## Usage

Reusing a single file component.

`/pages/index.html`

```html
<my-component heading="Heyo!"></my-component>
```

`/elements/my-header.mjs`

```javascript
export default function MyHeader({ html, state }) {
  const { attrs={} } = state
  const { heading='default' } = attrs
  return html`
    <h1>${heading}</h1>
  `
}
```

`/browser/index.mjs`

```javascript
import BaseElement from '@enhance/base-element'
import MyHeaderElement from '../elements/my-header.mjs'

class MyHeader extends BaseElement {
  constructor() {
    super()
    this.innerHTML = this.render({
      html: this.html,
      state: this.state
    })
  }

  render(args) {
    return MyHeaderElement(args)
  }
  // Specify what attributes to use for updating the component
  static get observedAttributes() {
    return [ 'heading' ]
  }
  // adding an attribute changed handler will get automatically called when the attribute changes if it matches the naming convention of ${attributeName}Changed
  headingChanged(value) {
    const header = this.querySelector('h1')
    header.innerHTML = value
  }
}
customElements.define('my-component', MyComponent)
```


