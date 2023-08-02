# enhance-template-mixin
Template mixin for Enhance base element.

This mixin creates a single template element that is reused by all instances of the Custom Element that it's mixed into.

## Install

`npm i @enhance/template-mixin`

## Usage

`/pages/index.html`
```html
<my-element heading="one"></my-element>
```

`/elements/my-element.mjs`

```javascript
export default function MyElement({ html, state }) {
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
import TemplateMixin from '../index.mjs'
import MyElement from '../elements/my-element.mjs'

class MyElement extends TemplateMixin(BaseElement) {
  constructor() {
    super()
    // If not expanded by server side render then expand with the template
    if (!this.children.length) {
      this.replaceChildren(this.template.content.cloneNode(true))
    }
  }

  render(args) {
    return MyElement(args)
  }
}
customElements.define('my-element', MyElement)
```

> ⚠️  WARN: To reuse the template for multiple instances you will need to implement `observedAttributes` and `atrtributeChangedCallback`

