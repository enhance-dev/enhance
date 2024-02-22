# enhance-shadow-element
Enhance Shadow DOM element base class

## Install

`npm i @enhance/shadow-element`

**unpkg**

`import ShadowElement from 'https://unpkg.com/@enhance/shadow-element?module=true`

## Usage

`/pages/index.html`

```html
<my-header heading="YOLO!"></my-header>
```

`/elments/my-header-element.mjs`

```javascript
function MyHeaderElement({ html, state  }) {
  const { attrs={} } = state
  const { heading='default' } = attrs
  return html`
    <style>
      :host {
        color: red;
      }
    </style>
    <h1>${heading}</h1>
  `
}
```

`/browser/index.mjs`

```javascript
import ShadowElement from '@enhance/shadow-element'
import MyHeaderElement from '../elements/my-header-element.mjs'

class MyHeader extends ShadowElement {
  constructor() {
    super()
    this.header = this.shadowRoot.querySelector('h1')
  }

  render(args) {
    return MyHeaderElement(args)
  }

  static get observedAttributes() {
    return [ 'heading' ]
  }

  headingChanged(value) {
    this.header.textContent = value
  }
}
customElements.define('my-header', MyHeader)
```
