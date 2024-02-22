const TemplateMixin = (superclass) => class extends superclass {
  constructor() {
    super()
    if (!this.render || !this.html) {
      throw new Error('TemplateMixin must extend Enhance BaseElement')
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.templateName = `${this.tagName.toLowerCase()}-template`
    const template = document.getElementById(this.templateName)
    if (template) {
      this.template = template
    }
    else {
      const html = this.html
      const state = {}
      this.template = document.createElement('template')
      this.template.innerHTML = this.render({ html, state })
      this.template.setAttribute('id', this.templateName)
      document.body.appendChild(this.template)
    }
  }
}

export default TemplateMixin
