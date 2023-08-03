// Mixin specifically for reusing SFCs as Custom Elements in the browser
const CustomElementMixin = (superclass) => class extends superclass {
  constructor() {
    super()
    // Removes style tags as they are already inserted into the head by SSR
    // TODO: If only added dynamically in the browser we need to insert the style tag after running the style transform on it. As well as handle deduplication.
    this.template.content.querySelectorAll('style')
      .forEach((tag) => { this.template.content.removeChild(tag) })
    // Removes script tags as they are already appended to the body by SSR
    // TODO: If only added dynamically in the browser we need to insert the script tag after running the script transform on it. As well as handle deduplication.
    this.template.content.querySelectorAll('script')
      .forEach((tag) => { this.template.content.removeChild(tag) })

    // If the Custom Element was already expanded by SSR it will have children so do not replaceChildren
    if (!this.children.length) {
      // If this Custom Element was added dynamically with JavaScript then use the template contents to expand the element
      this.replaceChildren(this.template.content.cloneNode(true))
    }
  }
}
export default CustomElementMixin
