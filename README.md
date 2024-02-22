# Enhance style scoping transform

This transform enables scoping styles in Enhance components with or without the need for shadowDOM. 

It does not add new syntax. It sets firm upper bound so component styles can't bleed outside the component. It also allows some Web Component CSS selectors (::part, ::slotted, and :host) to target enhance components both before and after JavaScript hydrates the components. For server side rendering these selectors are converted to CSS that does not require the shadowDOM.

## Goal 
The shadowDOM gives full encapsulation of styles, but breaks other things like forms. When building with components what we want is some reasonable tools to help scope styles to those components. More like caution tape than chain-link fence. If the shadowDOM is used styles can be written once that will work before and after the shadowDOM initializes.

## limitations
This approach doesn't completely avoid deep selection of nested elements. It makes tradeoffs to improve scoping without creating other problems. Transformed shadow selectors can also select some unintended elements if they are written to too broadly (i.e. `::slotted(*)` will select all children). If you prefer a bullet proof style encapsulation and are willing to accept the downsides (broken forms, FOUC, etc.) use the shadowDOM.   
## Other Recommendations
- Use with utility classes.
  This transform works well with utility class styles. We recommend writing most styles as utility classes directly on the elements in your template. This only leaves styles that cannot be written as utility classes which can be added to the component.
- Use specific selectors to avoid deep selecting.
  It is better to use the `>` child selector rather than the general descendent selector when possible(i.e. `:host > div` ). 
- With slotted and part be specific enough to avoid over selection
  

## Basic Usage
Below is an example a style transform when deploying to [https://arc.codes](arc.codes). 

### Input
```JavaScript
//Renderer handler.mjs
import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'

const html = enhance({
  styleTransforms: [styleTransform]
})

const myDoc = html`<my-tag>Something</my-tag>`
```

```JavaScript
//<my-tag> component definition
export default function MyTag({html}){
  return html`
    <style>
      h1 {
        background: red;
      }
    </style>

    <h1>
      <slot></slot>
    </h1>
  `
}
```

### Output
```html
<!-- Rendered Output-->
<head>
  <style>
    /* scoped version of styles from <my-tag> */
    my-tag h1 {
      background: red;
    }
  </style>
</head>
<body>
  <template>
    <style>
    /* unscoped version of styles from <my-tag> */
      h1 {
        background: red;
      }
    </style>

    <h1>
      <slot></slot>
    </h1>
  </template>
  <my-tag>
    <h1>Something</h1>
  </my-tag>
</body>
```
## SSR transformations
The transformations below are used for the server rendered styles. These styles will be collected and placed in the document head. The 'template' context styles do not receive any transformation.
### Component scoping
Basic component scoping is done by adding a component selector to every rule. This effectively sets the upper bound to all rules so styles cannot leak outside the component. The rule `div {background: red}` becomes `my-tag div {background: red}`. This sets a firm upper bound on styles but it does not limit deep selecting for anything nested inside the component. This is sometimes useful and sometimes a problem. To limit deep selection you can use more specificity in your selector choice. Combining this technique with utility classes also helps limit deep selection by minimizing the number of rules that need to be written for each component. 

#### `:host` `:host()` `:host-context()` 
When writing components it is often necessary to add styles to the element itself. The `:host` selector and its variations solve this problem, but they do not work when there is no shadowDOM. For the SSR context these styles are converted so that they work for both. `:host` itself is a selector stand in for the element. The function form of `:host()` is [required](https://drafts.csswg.org/css-scoping/#host-selector:~:text=it%20takes%20a%20selector%20argument%20for%20syntactic%20reasons%20(we%20can%E2%80%99t%20say%20that%20%3Ahost.foo%20matches%20but%20.foo%20doesn%E2%80%99t)%2C%20but%20is%20otherwise%20identical%20to%20just%20using%20%3Ahost%20followed%20by%20a%20selector.) to specify a class or attribute on the host itself. In order to select the context outside of host you can use the `:host-context()` form. 

```CSS
/* Scoping without host */
div { color: red; }
/* Becomes */
my-tag div { color: red; }

/* Scoping with host selector */
:host { color: red; }
/* Becomes */
my-tag { color: red; }

:host(.some-class) div { color: red; }
/* Becomes */
my-tag.some-class div { color: red; }

:host-context(footer > h1) div { color: red; }
/* Becomes */
footer > h1 my-tag div { color: red; }

```

#### `::slotted()` 
With shadowDOM `<slot>`'s child elements in the light DOM are rendered inside the shadowDOM. The `::slotted()` pseudo selector is used inside the shadowDOM to style these elements. Any selector argument will be applied to any matching elements that are slotted. The transform takes rules like `div::slotted([slot=here]) { color:red; }` and returns `div[slot=here] { color: red; }`. This allows for styles to be written that work both with and without the shadowDOM. It also lets you write styles so the intent is clear. Use caution picking the selector argument so that it does not select more than intended after transformation. `::slotted(*)` for instance would select all elements. `::slotted([slot])` is useful for selecting all named slot contents.  
#### `::part()` 
The shadow parts API allows selected elements to be exposed for styling outside the shadowDOM. By labeling an element inside the component with a `part=something` attribute it can be selected outside that component with a `the-tag::part(something) {color: red;}` selector. For server rendering this is transformed into `the-tag [part*=something] { color: red; }`. Notice again that this does not stop deep selection. This selector will match any part of the same name nested within. 

#### `scope=global`
Global unscoped styles can be added to components if desired. If a `scope=global` attribute is added to a style tag the styles will be collected and added to the head tag as with other styles. But no transforms or scoping will be done. These styles are removed from the template tag so that they will not appear inside shadowDOM. 
```html
<style scope=global>
  /* this rule will be put in the head and */
  /* will select all div's in the document */
  div { color:red; }
</style>
```
A style tag that is nested inside a component but is not a direct child will not be transformed or collected at all by the transform. 
```JavaScript
export default Component({html}){
  return html`
    <div>Hello World</div>
    <script>
      //this script will be transformed and moved 
    </script>
    <div>
      <script>
        //this script is left alone
      </script>
    </div>
  `
}
```


## Style context
Enhance renders pages by expanding each component instance in the document with their template contents. The templates are also placed into the page for use in the shadowDOM. The styles are transformed for each of these context. The styles transformed for the server rendered output are collected and put in the document head. Any duplicated style tags are removed. The template context styles are left with the template tags for use with the shadowDOM.  

## API
Style Transforms are passed as an array. Transforms are called with a single object argument with the following properties:
- `raw`: a string with the contents of the script tag
- `attrs`: with any attributes on the script tag
- `context`: a value of 'markup' for SSR global CSS, and 'template' for shadowDOM CSS
- `tagName`: the custom element tagName

The return value from the transform should be the new string contents of the style tag for the given context.


## More Examples
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
