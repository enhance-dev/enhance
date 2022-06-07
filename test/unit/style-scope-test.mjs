import styleTransform from '../../src/style-transform.mjs'
import test from 'tape'
const globalAttrs = [{name:'scope',value:'global'}]
const transform = ({ raw='', attrs, context='', tagName='my-tag' } = {})=>styleTransform({raw,attrs,context,tagName})

test('global in ssr context', (t) => {
  t.plan(1)

  const block = `div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    attrs: globalAttrs,
    context: 'markup',
    raw: block
  })
  const expected = `div { background:blue; }` 
  t.equal(expected,result,'it works')
})

test('global in template context', (t) => {
  t.plan(1)

  const block = `div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    attrs: globalAttrs,
    context: 'template',
    raw: block
  })
  const expected = `` 
  t.equal(expected,result,'it works')
})

test('default component scoped in ssr context', (t) => {
  t.plan(1)

  const block = `div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag div {
  background: blue;
}` 
  t.equal(expected,result,'it works')
})

test('default component scoped in template context', (t) => {
  t.plan(1)

  const block = `div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'template',
    raw: block
  })
  const expected = `div { background:blue; }` 
  console.log({result})
  console.log({expected})
  t.equal(expected,result,'it works')
})

test('template context with shadow selectors should not change', (t) => {
  t.plan(1)

  const block = `:host { background:blue; }
    .container > ::slotted(*) {
      display: block;
    }
    .container > ::slotted(*[slot="title"]) {
      display: block;
    }
    .foo { display: block; }
    another-tag::part(thing) { display: block; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'template',
    raw: block
  })
  const expected = block
  t.equal(expected,result,'it works')
})

test('ssr context with special selectors', (t) => {
  t.plan(1)

  const block = `:host { background:blue; }
    .container > ::slotted(*) {
      display: block;
    }
    .container > ::slotted(*[slot="title"]) {
      display: block;
    }
    .foo { display: block; }
    another-tag::part(thing) { display: block; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag  {
  background: blue;
}

my-tag .container > * {
  display: block;
}

my-tag .container > *[slot="title"] {
  display: block;
}

my-tag .foo {
  display: block;
}

my-tag another-tag [part*="thing"][part*="another-tag"] {
  display: block;
}` 
  t.equal(expected,result,'it works')
})


