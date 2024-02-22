import { test, expect } from '@playwright/test'
// const baseURL = `http://localhost:3333`


// Test :host
//************************************************ */
  test(':host', async ({ page }) => {
    await page.goto('/test/host-bare');
    const light = await page.waitForSelector('tag-light span');
    const lightStyle = await light.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    const shadow = await page.waitForSelector('tag-shadow span');
    const shadowStyle = await shadow.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    console.log(lightStyle['background-color'])
    console.log(shadowStyle['background-color'])
    expect(lightStyle).toEqual(shadowStyle)
  })

// Test ::slotted()
//************************************************ */
  test('::slotted()', async ({ page }) => {
    await page.goto('/test/slotted');
    const light = await page.waitForSelector('tag-light span');
    const lightStyle = await light.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    const shadow = await page.waitForSelector('tag-shadow span');
    const shadowStyle = await shadow.evaluate(async (el) => {
      return window.getComputedStyle(el);
    });
    console.log(lightStyle.backgroundColor)
    console.log(shadowStyle.backgroundColor)
    expect(lightStyle).toEqual(shadowStyle)
  })
