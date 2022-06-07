import * as cssParser from 'css'

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

function processBlock({
  css = '',
  scopeTo = '',
  disabled = false,
  instance = ''
}) {
  if (disabled || !scopeTo) return css
  const parsed = cssParser.parse(css)

  function changeRules(arr) {
    arr.forEach((v, i, a) => {
      if (v.type === 'rule') {
        a[i].selectors = a[i].selectors.map((s) =>
          `${scopeTo}${instance ? `.${instance}` : ''} ${s}`
            .replace(/(::slotted)\(\s*(.+)\s*\)/, '$2')
            .replace(
              /([[a-zA-Z0-9_-]*)(::part)\(\s*(.+)\s*\)/,
              '$1 [part*="$3"][part*="$1"]'
            )
            // the component is added above so host is just removed here
            .replace(':host', '')
        )
      }
      if (v.type === 'media') {
        changeRules(a[i].rules)
      }
    })
  }
  changeRules(parsed.stylesheet?.rules)
  return cssParser.stringify(parsed)
}
