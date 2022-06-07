import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import buildScoper from '../../../../../src/scope-css.mjs'
let html = enhance()
import { testMap } from '../../../../browser/style-scope.spec.mjs'

export const handler = arc.http.async(HTML)


async function HTML(req) {
  const testRef =  req.params.testRef
  const noJS= req.query.noJS || req.query.noJS ===''
  const noScoping = req.query.noScoping || req.query.noScoping ===''
  try {
    html = enhance({
      elements: {
        'test-component':buildTestComponent({templateMarkup:testMap[testRef].templateMarkup,templateStyles:testMap[testRef].templateStyles}),
        'another-tag':buildAnotherTag({anotherMarkup:testMap[testRef].anotherMarkup,anotherStyles:testMap[testRef].anotherStyles}),
      },
      initialState: {
        scopeCSS:!noScoping
      }
    })

    function stripScript(str) { return str.replace(/<script>Array\.from\(document\.getElementsByTagName\("template"\)\)\.forEach\(t => t\.content\.lastElementChild && 'SCRIPT' === t\.content\.lastElementChild\.nodeName\?document\.body\.appendChild\(t\.content\.lastElementChild\):''\)<\/script>/gm, '') }
    return {
      statusCode: 200,
      html: noJS ? stripScript(html`${testMap[testRef].markup}`) : html`${testMap[testRef].markup}`
    }
  } catch (err) {
    console.log(err)
  }
}


function buildTestComponent({ templateStyles, templateMarkup }) {
return function TestComponentTemplate({ html, state = {} }) {
const { scopeCSS} = state.store
  const id = Math.random().toString(32).slice(2) //instance id if needed
  const scope = buildScoper({
    scopeTo:'test-component',
    instance:id,
    disabled:!scopeCSS 
  })
  
  return html`
    ${scope` ${templateStyles} `}
    ${templateMarkup}
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
}
function buildAnotherTag({ anotherStyles='', anotherMarkup='' }) {
return function AnotherTagTemplate({ html, state = {} }) {
const { scopeCSS} = state.store
  const id = Math.random().toString(32).slice(2) //instance id if needed
  const scope = buildScoper({
    scopeTo:'another-tag',
    instance:id,
    disabled:!scopeCSS 
  })
  
  return html`
    ${scope` ${anotherStyles} `}
    ${anotherMarkup}
    <script type="module">
      class AnotherComponent extends HTMLElement {
        constructor() {
          super()
          const template = document.getElementById(
            'another-tag-template'
          )
          this.attachShadow({ mode: 'open' }).appendChild(
            template.content.cloneNode(true)
          )
        }
      }
      customElements.define('another-tag', AnotherComponent)
    </script>
  `
}
}

