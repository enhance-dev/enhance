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
  t.equal(expected,result,'basic SSR context')
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
  t.equal(expected,result,'template context')
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
  t.equal(expected,result,'shadow CSS same in template')
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
  const expected = `my-tag {
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
  t.equal(expected,result,'shadow CSS transformed for SSR')
})

test(':host pseudo element', (t) => {
  t.plan(1)

  const block = `:host div { background: blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag div {
  background: blue;
}` 
  t.equal(expected,result,'basic :host')
})

test(':host() function form', (t) => {
  t.plan(1)

  const block = `:host(.something) div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag.something div {
  background: blue;
}` 
  t.equal(expected,result,':host() works')
})


test(':host-context() function form', (t) => {
  t.plan(1)

  const block = `:host-context(.something) div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `.something my-tag div {
  background: blue;
}` 
  t.equal(expected,result,':host-context()')
})


// Selector Lists have inconsistent browser support and it is unclear if the spec for :host :host-context and ::slotted support Selector Lists. The tests below are skipped for now.

// Not supported yet
test.skip(':host() with selector list', (t) => {
  t.plan(1)

  const block = `:host(.something, [some=thing]) div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag.something div,
  my-tag[some=thing] div {
    background:blue; 
}` 
  t.equal(expected,result,':host() with list')
})

//Not supported Yet
test.skip(':host-context() with selector list', (t) => {
  t.plan(1)

  const block = `:host-context(.something, [some=thing]) div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `.something my-tag div, 
  [some=thing] my-tag div {
    background: blue;
  }` 
  t.equal(expected,result,':host-context() with list')
})

//Not supported yet
test.skip('::slotted() with selector list', (t) => {
  t.plan(1)

  const block = `::slotted(.something, [some=thing]) div { background:blue; }`
  const result = transform({
    tagName: 'my-tag',
    context: 'markup',
    raw: block
  })
  const expected = `my-tag .something div, 
  [some=thing] my-tag div {
    background: blue;
  }` 
  t.equal(expected,result,'::slotted() with list')
})


