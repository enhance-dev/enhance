export default /*html*/`
<style>
  * {
    background: blue;
  }
</style>
<tag-shadow class=shadow><span slot=here>shadow</span></tag-shadow>
<tag-light class=light><span slot=here>light</span></tag-light>
`

function TagShadow({ html }) {
  return html`
  <style>
    ::slotted([slot=here]) {
      background: green;
    }
  </style>
  <div class=shadow><slot name=here></slot></div>
  <script type="module">
      import enhance from '/_static/enhance.mjs'
      const tag = { shadow: true, }
      enhance.register('tag-shadow', tag)
  </script>
  `
}
function TagLight({ html }) {
  return html`
  <style>
    ::slotted([slot=here]) {
      background: green;
    }
  </style>
  <div><slot name=here></slot></div>
  `
}

export const elements = {
  'tag-shadow': TagShadow,
  'tag-light': TagLight
}

