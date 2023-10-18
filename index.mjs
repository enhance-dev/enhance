const EventHandlerMixin = (superclass) => class extends superclass {
  constructor() {
    super()
  }

  connectedCallback() {
    const htmlElementPrototype = Object.getOwnPropertyNames(HTMLElement.prototype)
    const root = this.shadowRoot
      ? this.shadowRoot
      : this
    const attrs = this?.state?.attrs
    Object.keys(attrs)
      .map(event => {
        if (htmlElementPrototype.indexOf(`on${event}`) !== -1) {
          const target = attrs[event]
            ? root.querySelector(attrs[event])
            : root
          target.addEventListener(event, this[event])
        }
      })

    if(super.connectedCallback) {
      super.connectedCallback()
    }

  }
}

export default EventHandlerMixin
