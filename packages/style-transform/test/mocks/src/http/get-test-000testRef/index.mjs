import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import styleTransform from '../../../../../src/style-transform.mjs'

export const handler = arc.http.async(HTML)


async function HTML(req) {
  const testRef = req.params.testRef
  const test = await import(`./${testRef}.mjs`)
  const elements = test.elements
  const html = enhance({elements,styleTransforms:[styleTransform]})
  return {
    html : html`${test.default}`
  }
}


