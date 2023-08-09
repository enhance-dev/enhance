export default class BaseElement extends HTMLElement {
  constructor(api) {
    super()
    this.api = api || {}
    this.store = this.api?.store || {}
    this.context = {}
  }

  get state() {
    const attrs = this.attributes.length
      ? this.attrsToObject(this.attributes)
      : {}

    return {
      attrs,
      context: this.context,
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
    const collect = []
    for (let i = 0; i < strings.length - 1; i++) {
      collect.push(strings[i], values[i])
    }
    collect.push(strings[strings.length - 1])
    return collect.join('')
  }
}
