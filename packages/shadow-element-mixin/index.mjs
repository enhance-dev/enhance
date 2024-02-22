const ShadowElementMixin = (superclass) => class extends superclass {
  constructor(args={}) {
    super()
    const { mode='open' } = args
    this.template.content.querySelectorAll('script')
      .forEach((tag) => { this.template.content.removeChild(tag) })
    this.attachShadow({ mode })
      .appendChild(this.template.content.cloneNode(true))
  }
}
export default ShadowElementMixin
