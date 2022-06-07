# Style Scoping Prototype

This script is intended to scope styles to global, component or instance level for enhance components. It allows users to use Web Component CSS selectors (::part, ::slotted, and :host) to target enhance components both before and after javascript hydrates the components. This works with or without the shadowDOM. 

See the [related discussion](https://github.com/enhance-dev/enhance/discussions/8) for context.

This script only modifies the style blocks. The advantage to this approach is it requires minimal changes to the rest of the markup. The only two changes required are:
1. If instance scope is used a class needs to be added to the host itself matching the instance id 
    - `<my-tag class="abc123">`
2. Any elements that use the part attribute need to be modified to add the name of the component to the list of parts. 
    - `<div part="thing">` becomes `<div part="thing my-tag">`

## How to use it
``` javascript
import buildScoper from '../css-scope.mjs'
export default function({html,state={}}){
  // This is a flag stored in the initialState passed to enhance. It signals if this is a template pass or an SSR pass to know whether to scope or pass through
  const { scopeCSS } = state.store
  const id = Math.random().toString(32).slice(2) //instance id if needed
  const scope = buildScoper({
    scopeTo:'my-tag',
    instance:id,
    disable:!scopeCSS
  })

//TODO: Currently you have to manually add the tag name to part attributes (i.e.`my-element`). This will be added to enhance if this approach is adopted 
  return html`
    ${scope`
    <style>
      h1 {
        color: red;
      }
    </style>
    `}

    <h1>${greeting}</h1>
    <p part="thing my-element">${message}</p>

  `
}
```

## Authored Styles in Component
``` html
//global block
  <style scope="global"> 
    div {
       background:blue;
     }
  </style>

// component block
  <style scope="component">
    :host {
      display: block;
    }
    .container > ::slotted(*) {
      display: block;
    }
    .container > ::slotted(*[slot="title"]) {
      display: block;
    }
    .foo {
      display: block;
    }
    another-tag::part(title){
      display:block;
    }
  </style>

// instance block
  <style scope="instance">
    :host {
      display: block;
    }
    .container > ::slotted(*) {
      display: block;
    }
    .container > ::slotted(*[slot="title"]) {
      display: block;
    }
    .foo {
      display: block;
    }
    another-tag::part(title){
      display:block;
    }
  </style>
  <div class="foo">Shadow</div>
  <div class="container">
    <slot> </slot>
    <slot name="title"></slot>
  </div>
```

## Used like this 
``` html
<my-element>
  <span>Light</span>
  <span slot="title">Title</span>
  <another-tag><div part="title"></div></another-tag>
</my-element>
```

## Becomes this
```html
<my-element class="xyz123">

<style scope="global">
    div {
      background:blue;
      }
</style>
<style scope="my-element">
  my-element {
    display: block;
  }
  my-element .container > * {
      display: block;
  }
  my-element .container > *[slot="title"] {
      display: block;
  }
  my-element .foo {
      display: block;
  }
  my-element another-tag [part*="title"][part*="another-tag"]{
    display:block;
  }
</style>
<style scope="my-element.xyz123">
  my-element.xyz123 {
    display: block;
  }
  my-element.xyz123 .container > * {
      display: block;
  }
  my-element.xyz123 .container > *[slot="title"] {
      display: block;
  }
  my-element.xyz123 .foo {
      display: block;
  }
  my-element.xyz123 another-tag [part*="title"][part*="another-tag"]{
    display:block;
  }
</style>

  <div class="foo">Shadow</div>
  <div class="container">
    <span>Light</span>
    <span slot="title">Title</span>
  </div>
  <another-tag><div part="title another-tag"></div></another-tag>
</my-element>
```