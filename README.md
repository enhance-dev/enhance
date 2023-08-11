# custom-element-mixin
Custom Element mixin that enables the reuse of single file components

## Install 

`npm i @enhance/custom-element-mixin`

## Usage

`/pages/index.html`

```html
<my-element heading="one"></my-element>
<script type="module" src="/_public/browser/index.mjs"></script>
```

`/elements/my-header.mjs`

```javascript

function MyHeader({ html, state  }) {
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
import MyHeaderElement from './elements/my-header.mjs'
import BaseElement from '@enhance/base-element'
import TemplateMixin from '@enhance/template-mixin'
import CustomElementMixin from '@enhance/custom-element-mixin'

class MyHeader extends CustomElementMixin(TemplateMixin(BaseElement)) {
  constructor() {
    super()
    this.header = this.querySelector('h1')
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

