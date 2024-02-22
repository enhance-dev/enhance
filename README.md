# enhance-morphdom-mixin
Enhance mixin to add [Morphdom](https://github.com/patrick-steele-idem/morphdom) DOM diffing to a Custom Element

## Install
`npm i @enhance/morphdom-mixin`

## Usage

`/pages/index.html`

```html
<my-header heading="My list"></my-header>
```

`/elements/my-header.mjs`

```javascript
function MyHeader({ html, state  }) {
  const { attrs={} } = state
  const { heading='default' } = attrs
  return html`
    <style>
      :host h1 {
        font-size: 1.3rem;
        color: indigo;
      }
    </style>
    <h1>${heading}</h1>
    <p>${heading}</p>
    <a href="/foo/${heading}"></a>
  `
}
```

`/browser/index.html`

```javascript
    class MyHeaderElement extends MorphdomMixin(CustomElement) {
      constructor() {
        super()
      }

      render(args) {
        return MyHeader(args)
      }

      static get observedAttributes() {
        return [ 'heading' ]
      }
    }
    customElements.define('my-header', MyHeaderElement)

```

Setting the `heading` attribute on the `<my-header>` element will trigger a re-render (scoped only to this element not the entire page) that will update all variables which avoids needing to manually write surgical DOM updates.

This approach, while convenient at times will not perform as well as surgical DOM updates.
