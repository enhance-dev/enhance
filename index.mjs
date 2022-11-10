import morph from './morph.mjs'

export default function enhance(tagName, opts) {
  const shadow = opts.shadow
  const _observedAttributes = opts.observedAttributes ||
        opts.attrs
  delete opts.observedAttributes
  delete opts.attrs
  const _adoptedCallback = opts.adoptedCallback ||
    opts.adopted
  delete opts.adoptedCallback
  delete opts.adopted
  const _connectedCallback = opts.connectedCallback ||
    opts.connected
  delete opts.connectedCallback
  delete opts.connected
  const _disconnectedCallback = opts.disconnectedCallback ||
    opts.disconnected
  delete opts.disconnectedCallback
  delete opts.disconnected

  class EnhanceElement extends HTMLElement {
    constructor() {
      super()
      Object.keys(opts)
        .map(k => Object.defineProperty(this, k, {
          value: opts[k],
          writable: false
        })
      )

      if (shadow) {
        this.shadowMode = shadow
      }
      const templateName = `${this.tagName.toLowerCase()}-template`
      const template = document.getElementById(templateName)
      if (template) {
        this.template = template
      }
      else {
        this.template = document.createElement('template')
        this.template.innerHTML = this.render({
          html:this.html,
          state:{ attrs:{}, store:{} }
        })
        this.template.setAttribute('id', templateName)
      }

      this.shadowMode
        ? this.attachShadow({ mode: this.shadowMode || 'open' })
            .appendChild(this.template.content.cloneNode(true))
        : this.replaceChildren(
            this.template.content.cloneNode(true))

      this.store = {}
      this.init && this.init(this)
    }

    static get observedAttributes() {
      return _observedAttributes
    }

    adoptedCallback() {
      if(typeof _adoptedCallback === 'function') {
        _adoptedCallback.call(this)
      }
    }

    connectedCallback() {
      if (this.isConnected && typeof _connectedCallback === 'function') {
        _connectedCallback.call(this)
      }
    }

    disconnectedCallback() {
      if(typeof _disconnectedCallback === 'function') {
        _disconnectedCallback.call(this)
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.#process()
      }
    }

    html(strings, ...values) {
      const collect = []
      for (let i = 0; i < strings.length - 1; i++) {
        collect.push(strings[i], values[i])
      }
      collect.push(strings[strings.length - 1])
      return collect.join('')
    }

    get #state() {
      const attrs = this.attributes.length
        ? this.attrsToObject(this.attributes)
        : {}
      const store = this.store

      return {
        attrs,
        store
      }
    }

    attrsToObject(attrs=[]) {
      const attrsObj = {}
      for (let d = attrs.length - 1; d >= 0; d--) {
        let attr = attrs[d]
        attrsObj[attr.nodeName] = attr.nodeValue
      }
      return attrsObj
    }

    #process() {
      const tmp = this.render({
        html:this.html,
        state:this.#state
      })
      const updated = document.createElement('div')
      updated.innerHTML = tmp.trim()
      morph(
        this,
        updated,
        {
          childrenOnly: true
        }
      )
    }
  }

  customElements.define(
    tagName,
    EnhanceElement
  )
}

