const EventHandlerMixin = (superclass) => class extends superclass {
  constructor() {
    super()
  }

  connectedCallback() {
    const htmlElementPrototype = Object.getOwnPropertyNames(HTMLElement.prototype)
    const attrs = this?.state?.attrs
    const eventsToRemove = []
    Object.keys(attrs)
      .map(event => {
        if (htmlElementPrototype.indexOf(`on${event}`) !== -1) {
          /*
           * Elements we want to add event listeners to can either live in light DOM or shadow DOM.
           * Slotted content and Custom Element content will live in light DOM so we use querySelector by default.
           * If we don't find them there then we look in the shadowRoot using shadowRoot.querySelector
           * otherwise we add the listener to the component instead of a nested element.
           * Problem with adding a listener to the component is that there could be issues adding more than one event listener ( think blur, click and submit for instance )
          */
          const target = this.querySelector(attrs[event]) ||
            this.shadowRoot.querySelector(attrs[event]) ||
            this

          if (target) {
            target.addEventListener(event, this[event])
            eventsToRemove.push({ target, event: this[event] })
          }
        }
      })

    if(super.connectedCallback) {
      super.connectedCallback()
    }
  }

  disconnectedCallback() {
    eventsToRemove.forEach(l => removeEventListener(l.event, l.target))
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
  }
}

export default EventHandlerMixin

