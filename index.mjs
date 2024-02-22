if (typeof process !== 'undefined') {
  global.HTMLElement = function() { return {} }
  global.customElements = {
    define: function() { },
    get: function() { }
  }
  global.Worker = function() { return { postMessage: function() { } } }
}

export default class BaseElement extends HTMLElement {
  constructor() {
    super()
    this.store = {}
    this.context = {}
    this.instanceID = this.getAttribute('id') ||
      self.crypto.randomUUID()
  }

  get state() {
    const attrs = this.attributes.length
      ? this.attrsToObject(this.attributes)
      : {}

    return {
      attrs,
      context: this.context,
      instanceID: this.instanceID,
      store: this.store
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const fun = `${name}Changed`
      if (this[fun]) {
        this[fun](newValue)
      }
    }
  }

  attrsToObject(attrs = []) {
    const attrsObj = {}
    for (let d = attrs.length - 1; d >= 0; d--) {
      let attr = attrs[d]
      attrsObj[attr.nodeName] = attr.nodeValue
    }
    return attrsObj
  }

  html(strings, ...values) {
    return String.raw({ raw: strings }, ...values)
  }
}
