# enhance-shadow-element-mixin
Enhance Shadow DOM Element mixin

This mixin cuts down on some boilerplate when creating a Web Component enhanced with the Shadow DOM.

## Install

`npm i @enhance/shadow-element-mixin`

## Usage

`/pages/index.html`

```html
<my-element heading="one"></my-element>
```

`/element/my-header.mjs`

```javascript
export default function MySingleFileComponent({ html, state  }) {
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
import BaseElement from '@enhance/base-element'
import TemplateMixin from '@enhance/template-mixin'

class MyCustomElement extends ShadowElementMixin(TemplateMixin(BaseElement)) {
  constructor() {
  super()
    this.header = this.shadowRoot.querySelector('h1')
  }

  render(args) {
    return MySingleFileComponent(args)
  }

  static get observedAttributes() {
    return [ 'heading' ]
  }

  headingChanged(value) {
    this.header.textContent = value
  }
}
customElements.define('my-element', MyCustomElement)
```
