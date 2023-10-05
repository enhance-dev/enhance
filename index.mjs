import morphdom from "morphdom"

const MorphdomMixin = (superclass) => class extends superclass {
  constructor() {
    super()
    this.process = this.process.bind(this)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.process()
    }
  }

  process() {
    const tmp = this.render({
      html: this.html,
      state: this.state
    })
    const updated = document.createElement('div')
    updated.innerHTML = tmp.trim()
    const root = this.shadowRoot
      ? this.shadowRoot
      : this
    morphdom(
      root,
      updated,
      {
        childrenOnly: true
      }
    )
  }
}
export default MorphdomMixin
