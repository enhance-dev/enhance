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

`/elements/header.mjs`

```javascript
export default function Header({ html, state }) {
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
import MyComponent from '../elements/my-component.mjs'

class MyComponent extends BaseElement {
  constructor() {
    super()
    this.innerHTML = this.render({
      html: this.html,
      state: this.state
    })
  }

  render(args) {
    return MyComponent(args)
  }
}
customElements.define('my-component', MyComponent)
```


