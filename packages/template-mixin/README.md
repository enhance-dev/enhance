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
  }

  render(args) {
    return MyElement(args)
  }
}
customElements.define('my-element', MyElement)
```

Running the above code will insert a template element into the body containing the default content of your single file component and an ID of `my-element-template` ready to be updated by the first run of the `attributeChangedCallback` when an instance of the component is inserted into the DOM.

```html
<template id="my-element-template">
  <h1>default</h1>
</template>
```

> ⚠️  WARN: To reuse the template for multiple instances you will need to implement `observedAttributes` by supplying a `static get observedAttributes` function that returns an array of the attributes you plan to update the component with.

