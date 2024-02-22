// import ElementBase from './element-base.mjs'
// import ShadowBase from './shadow-base.mjs'
class ElementBase extends HTMLElement {
  constructor() {
    super()
    const name = this.tagName.toLowerCase()
    const template = document.getElementById(`${name}-template`)
    if (template) {
      this.replaceChildren(template.content.cloneNode(true))
    }
  }
}
class ShadowBase extends HTMLElement {
  constructor() {
    super()
    const id = this.getAttribute('id')
    const authored = document.getElementById(`${id}-template`)
    if (authored) {
      this.replaceChildren(authored.content.cloneNode(true))
    }
    const name = this.tagName.toLowerCase()
    const template = document.getElementById(`${name}-template`)
    if (template) {
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }
  }
}

const enhance = {}

enhance.register = function register(tag, options) {
  const opts = Object.assign({}, options)
  const Base = opts.shadow
    ? ShadowBase
    : ElementBase
  const adoptedCallback = opts.adoptedCallback
  delete opts.adoptedCallback
  const connectedCallback = opts.connectedCallback
  delete opts.connectedCallback
  const disconnectedCallback = opts.disconnectedCallback
  delete opts.disconnectedCallback

  class EnhanceElement extends Base {
    constructor() {
      super()
      Object.keys(opts)
        .map(k => Object.defineProperty(this, k, {
          value: opts[k],
          writable: false
        })
      )
      this.init(this)
    }

    static get observedAttributes() {
      return opts.observedAttributes
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        const fName = `${name}Update`
        if (this[fName]) {
          this[fName](newValue)
        }
      }
    }
  }

  function checkConnected() {
    if (this.isConnected) {
      connectedCallback.call(this)
    }
  }

  EnhanceElement.prototype.adoptedCallback = adoptedCallback
  EnhanceElement.prototype.connectedCallback = checkConnected
  EnhanceElement.prototype.disconnectedCallback = disconnectedCallback

  customElements.define(
    tag,
    EnhanceElement
  )
}

export default enhance