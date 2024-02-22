const TemplateMixin = (superclass) => class extends superclass {
  constructor() {
    super()
    if (!this.render || !this.html) {
      throw new Error('TemplateMixin must extend Enhance BaseElement')
    }
    const templateName = `${this.tagName.toLowerCase()}-template`
    const template = document.getElementById(templateName)
    const html = this.html
    const state = {}
    if (template) {
      this.template = template
    }
    else {
      this.template = document.createElement('template')
      this.template.innerHTML = this.render({ html, state })
      this.template.setAttribute('id', templateName)
      document.body.appendChild(this.template)
    }
  }
}

export default TemplateMixin
