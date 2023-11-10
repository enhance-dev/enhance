// Mixin specifically for reusing SFCs as Custom Elements in the browser
const CustomElementMixin = (superclass) => class extends superclass {
  constructor() {
    super()

    // Has this element been server side rendered
    const enhanced = this.hasAttribute('enhanced')

    // Handle style tags
    if (enhanced) {
      // Removes style tags as they are already inserted into the head by SSR
      this.template.content.querySelectorAll('style')
        .forEach((tag) => { this.template.content.removeChild(tag) })
    } else {
      let tagName = this.tagName
      this.template.content.querySelectorAll('style')
        .forEach((tag) => {
          let sheet = this.styleTransform({ tag, tagName, scope: tag.getAttribute('scope') })
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
          this.template.content.removeChild(tag)
        })
    }

    // Removes script tags as they are already appended to the body by SSR
    // TODO: If only added dynamically in the browser we need to insert the script tag after running the script transform on it. As well as handle deduplication.
    this.template.content.querySelectorAll('script')
      .forEach((tag) => { this.template.content.removeChild(tag) })

    // Expands the Custom Element with the template content
    const hasSlots = this.template.content.querySelectorAll('slot')?.length

    // If the Custom Element was already expanded by SSR it will have the "enhanced" attribute so do not replaceChildren
    // If this Custom Element was added dynamically with JavaScript then use the template contents to expand the element
    if (!enhanced && !hasSlots) {
      this.replaceChildren(this.template.content.cloneNode(true))
    } else if (!enhanced && hasSlots) {
      this.innerHTML = this.expandSlots(this)
    }
  }

  toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  }

  styleTransform({ tag, tagName, scope }) {
    const styles = this.parseCSS(tag.textContent)

    if (scope === 'global') {
      return styles
    }

    const rules = styles.cssRules
    const sheet = new CSSStyleSheet();
    for (let rule of rules) {
      if (rule.conditionText) {
        let selectorText = ''
        for (let innerRule of rule.cssRules) {
          let selectors = innerRule.selectorText.split(',')
          selectorText = selectors.map(selector => {
            return innerRule.cssText.replace(innerRule.selectorText, this.transform(selector, tagName))
          }).join(',')
        }
        let type = this.getRuleType(rule)
        sheet.insertRule(`${type} ${rule.conditionText} { ${selectorText}}`, sheet.cssRules.length)
      } else {
        let selectors = rule.selectorText.split(',')
        let selectorText = selectors.map(selector => {
          return this.transform(selector, tagName)
        }).join(',')
        sheet.insertRule(rule.cssText.replace(rule.selectorText, selectorText), sheet.cssRules.length)
      }
    }
    return sheet
  }

  getRuleType(rule) {
    switch (rule.constructor) {
      case CSSContainerRule:
        return '@container'
      case CSSMediaRule:
        return '@media'
      case CSSSupportsRule:
        return '@supports'
      default:
        return null
    }
  }

  transform(input, tagName) {
    let out = input
    out = out.replace(/(::slotted)\(\s*(.+)\s*\)/, '$2')
      .replace(/(:host-context)\(\s*(.+)\s*\)/, '$2 __TAGNAME__')
      .replace(/(:host)\(\s*(.+)\s*\)/, '__TAGNAME__$2')
      .replace(
        /([[a-zA-Z0-9_-]*)(::part)\(\s*(.+)\s*\)/,
        '$1 [part*="$3"][part*="$1"]')
      .replace(':host', '__TAGNAME__')
    out = /__TAGNAME__/.test(out) ? out.replace(/(.*)__TAGNAME__(.*)/, `$1${tagName}$2`) : `${tagName} ${out}`
    return out
  }

  parseCSS(styleContent) {
    const doc = document.implementation.createHTMLDocument("")
    const styleElement = document.createElement("style")

    styleElement.textContent = styleContent
    doc.body.appendChild(styleElement)

    return styleElement.sheet
  }


  expandSlots(here) {
    const fragment = document.createElement('div')
    fragment.innerHTML = here.innerHTML
    fragment.attachShadow({ mode: 'open' }).appendChild(
      here.template.content.cloneNode(true)
    )

    const children = Array.from(fragment.childNodes)
    let unnamedSlot = {}
    let namedSlots = {}

    children.forEach(child => {
      const slot = child.assignedSlot
      if (slot) {
        if (slot.name) {
          if (!namedSlots[slot.name]) namedSlots[slot.name] = { slotNode: slot, contentToSlot: [] }
          namedSlots[slot.name].contentToSlot.push(child)
        } else {
          if (!unnamedSlot["slotNode"]) unnamedSlot = { slotNode: slot, contentToSlot: [] }
          unnamedSlot.contentToSlot.push(child)
        }
      }
    })

    // Named Slots
    Object.entries(namedSlots).forEach(([name, slot]) => {
      slot.slotNode.after(...namedSlots[name].contentToSlot)
      slot.slotNode.remove()
    })

    // Unnamed Slot
    unnamedSlot.slotNode?.after(...unnamedSlot.contentToSlot)
    unnamedSlot.slotNode?.remove()

    // Unused slots and default content
    const unfilledUnnamedSlots = Array.from(fragment.shadowRoot.querySelectorAll('slot:not([name])'))
    unfilledUnnamedSlots.forEach(slot => slot.remove())
    const unfilledSlots = Array.from(fragment.shadowRoot.querySelectorAll('slot[name]'))
    unfilledSlots.forEach(slot => {
      const as = slot.getAttribute('as') || 'span'
      const asElement = document.createElement(as)
      while (slot.childNodes.length > 0) {
        asElement.appendChild(slot.childNodes[0]);
      }
      slot.after(asElement)
      slot.remove()
    })

    return fragment.shadowRoot.innerHTML
  }

}
export default CustomElementMixin
