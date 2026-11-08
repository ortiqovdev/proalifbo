import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.EXTENSION_TEST_BROWSER });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page.locator('#source').fill('Шаҳар, чой, ғалаба, Ўзбекистон');
  await page.waitForFunction(() => document.querySelector('#result').value === 'Şahar, çoy, ğalaba, Özbekiston');
  await page.locator('[data-article="alphabet"]').click();
  assert(await page.locator('dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log('Konvertor, maqola va mobil sahifa tekshirildi.');
} finally {
  await browser.close();
}
