import MorphdomMixin from '@enhance/morphdom-mixin'
import TemplateMixin from '@enhance/template-mixin'
import ShadowElementMixin from '@enhance/shadow-element-mixin'
import CustomElementMixin from '@enhance/custom-element-mixin'
import BaseElement from '@enhance/base-element'

export default function enhance(tagName, opts) {
  const shadow = opts.shadow ? opts.shadow : false
  const shadowRootMode = opts.shadowRootMode || 'open'
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

  class Base extends BaseElement {
    constructor() {
      super()
      Object.keys(opts)
        .map(k => Object.defineProperty(
          this,
          k,
          {
            value: opts[k],
            writable: true
          })
        )
    }

    static get observedAttributes() {
      return _observedAttributes
    }

    adoptedCallback() {
      if (typeof _adoptedCallback === 'function') {
        _adoptedCallback.call(this)
      }
    }

    connectedCallback() {
      if (this.isConnected && typeof _connectedCallback === 'function') {
        _connectedCallback.call(this)
      }
    }

    disconnectedCallback() {
      if (this.api) {
        this.api.unsubscribe(this.process)
      }

      if (typeof _disconnectedCallback === 'function') {
        _disconnectedCallback.call(this)
      }
    }
  }

  const elementMixin = shadow ? ShadowElementMixin : CustomElementMixin

  class EnhanceElement extends MorphdomMixin(elementMixin(TemplateMixin(Base))) {
    constructor() {
      super({ mode: shadowRootMode })
      if (this.api && this.keys) {
        this.api.subscribe(this.process, this.keys)
      }
      this.init && this.init(this)
    }
  }

 if (!customElements.get('tagName')) {
    customElements.define(
      tagName,
      EnhanceElement
    )
 }
}

