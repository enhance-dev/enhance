import * as cssParser from '@enhance/css-parser'

export default function styleTransform(options) {
  const { attrs = [], raw = '', tagName = '', context='' } = options
  const scope = attrs?.find((i) => i.name === 'scope')?.value
  if (scope === 'global' && context === 'markup') {
    return raw
  } else if (scope === 'global' && context === 'template') {
    return ''
  } else if (context === 'markup') {
    return processBlock({ scopeTo: tagName, css: raw })
  } else {         // for context==='template' and any other case
    return raw
  }
}

// Certain rule blocks require `changeRules` to run recursively on their contents in order to
// emit rulesets with custom element names prepended to the selector
const recursiveTypes = [
  'container',
  'media',
  'supports',
]

function processBlock({
  css = '',
  scopeTo = '',
  disabled = false,
}) {
  if (disabled || !scopeTo) return css
  const parsed = cssParser.parse(css)

  function changeRules(arr) {
    arr.forEach((v, i, a) => {
      if (v.type === 'rule') {
        a[i].selectors = a[i].selectors.map((s) => {
          let out = s
          out = out.replace(/(::slotted)\(\s*(.+)\s*\)/, '$2')
            .replace(/(:host-context)\(\s*(.+)\s*\)/, '$2 __TAGNAME__')
            .replace(/(:host)\(\s*(.+)\s*\)/, '__TAGNAME__$2')
            .replace(
              /([[a-zA-Z0-9_-]*)(::part)\(\s*(.+)\s*\)/,
              '$1 [part*="$3"][part*="$1"]')
            .replace(':host', '__TAGNAME__')
          out = /__TAGNAME__/.test(out) ?  out.replace(/(.*)__TAGNAME__(.*)/,`$1${scopeTo}$2`) : `${scopeTo} ${out}`

          return out
        })
      }
      if (recursiveTypes.includes(v.type)) {
        changeRules(a[i].rules)
      }
    })
  }
  changeRules(parsed.stylesheet?.rules)
  return cssParser.stringify(parsed)
}

