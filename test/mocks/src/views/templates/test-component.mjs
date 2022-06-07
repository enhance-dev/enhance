import buildScoper from '../../../../../src/scope-css.mjs'
export default function ContentContainerTemplate({ html, state = {} }) {
const { scopeCSS, testDisableScope } = state.store
  const id = Math.random().toString(32).slice(2) //instance id if needed
  const scope = buildScoper({
    scopeTo:'test-component',
    instance:id,
    disabled:!scopeCSS || testDisableScope
  })
  
  return html`
      ${scope`
    <style enh-scope="component">
      div {
        color:red;
      }
      :host {
        background-color:blue;
        display:block;
      }
    </style>
    `}
    <div >
      Inside Component
    </div>

    <script type="module">
      class TestComponent extends HTMLElement {
        constructor() {
          super()
          const template = document.getElementById(
            'test-component-template'
          )
          this.attachShadow({ mode: 'open' }).appendChild(
            template.content.cloneNode(true)
          )
        }
      }
      customElements.define('test-component', TestComponent)
    </script>
  `
}
