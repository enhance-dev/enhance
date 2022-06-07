import { test, expect } from '@playwright/test'
const runTests = process.argv.length>1
const baseUrl = "http://localhost:3333"
let testMarkup = {}


// Test One
//************************************************ */
testMarkup.ONE = {
 markup: /*html*/`
    <div id="outside">Outside</div>
    <test-component>Inside</test-component>`,
    templateStyles: /*html*/` 
    <style enh-scope="component">
      div {
        color:red;
      }
    </style>`,
    templateMarkup:/*html*/`<div id="inside">Inside</div>`
  }

  if (runTests) test('component inside vs outside without scoping', async ({ page }) => {
    await page.goto(`${baseUrl}/test/ONE?noJS`);
    const inside = await page.waitForSelector('#inside');
    const insideStyle = await inside.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    const outside = await page.waitForSelector('#outside');
    const outsideStyle = await outside.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    expect(insideStyle).not.toEqual(outsideStyle)
  })

  // Test Two
  //************************************************ */
  testMarkup.TWO = {
    markup: /*html*/`
    <div id="outside">Outside</div>
    <test-component id="test-component"><div id="in-slot">Title</div></test-component>`,
    templateStyles: /*html*/` 
    <style enh-scope="component">
      :host {
        display:block;
      }
    </style>`,
    templateMarkup:/*html*/`<slot id="the-slot"></slot>`
  }

  if (runTests) test('Changing :host for SSR without scoping', async ({ page }) => {
    await page.goto(`${baseUrl}/test/TWO?noJS&noScoping`);
    const ssr_no_scoping = await page.waitForSelector('#test-component');
    const ssr_no_scoping_style = await ssr_no_scoping.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('display');
    });
    expect(ssr_no_scoping_style).toBe('inline')
})

  if (runTests) test('Changing :host for SSR', async ({ page }) => {
    await page.goto(`${baseUrl}/test/TWO?noJS`);
    const ssr = await page.waitForSelector('#test-component');
    const ssr_style = await ssr.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('display');
    });
    expect(ssr_style).toBe('block')
  })

  if (runTests) test('Changing :host after hydration', async ({ page }) => {
    await page.goto(`${baseUrl}/test/TWO?noScoping`);
    const hydrated = await page.waitForSelector('#test-component');
    const hydrated_style = await hydrated.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('display');
    });
    expect(hydrated_style).toBe('block')
  })

  // Test Three
  /*************************************************/
  testMarkup.THREE = {
    markup: /*html*/`
    <div id="outside">Outside</div>
    <test-component id="test-component"><div id="in-slot">Title</div></test-component>`,
    templateStyles: /*html*/` 
    <style enh-scope="component">
      ::slotted(*) {
        color:red;
      }
    </style>`,
    templateMarkup:/*html*/`<slot id="the-slot"></slot>`
  }

  if (runTests) test('::slotted test', async ({ page }) => {
    await page.goto(`${baseUrl}/test/THREE?noJS`);
    const ssr = await page.waitForSelector('#in-slot');
    const ssr_style = await ssr.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('color');
    });
    await page.goto(`${baseUrl}/test/THREE`);
    const hydrated = await page.waitForSelector('#in-slot');
    const hydrated_style = await hydrated.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(ssr_style).toEqual(hydrated_style)
  })

  // Test Four
  //************************************************ */
  testMarkup.FOUR = {
    markup: /*html*/`
    <div id="outside">Outside</div>
    <test-component id="test-component"><div id="in-slot">Title</div></test-component>`,
    templateStyles: /*html*/` 
    <style enh-scope="component">
      ::slotted(*) {
        color:red;
      }
      another-tag::part(a-part) {
        color:green;
      }
    </style>`,
    templateMarkup:/*html*/`<another-tag></another-tag>`,
    anotherMarkup:/*html*/`<div><p id="a-part" part="a-part another-tag">Some Text</p></div>`,
  }

  if (runTests) test('::part test', async ({ page }) => {
    await page.goto(`${baseUrl}/test/FOUR?noJS`);
    const ssr = await page.waitForSelector('#a-part');
    const ssr_style = await ssr.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('color');
    });
    await page.goto(`${baseUrl}/test/FOUR`);
    const hydrated = await page.waitForSelector('#a-part',{strict:false});
    console.log(hydrated)
    const hydrated_style = await hydrated.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(ssr_style).toEqual(hydrated_style)
  })
  export const testMap = testMarkup
