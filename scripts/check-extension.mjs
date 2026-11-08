import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const extensionPath = fileURLToPath(new URL('extension/', root));
const manifest = JSON.parse(await readFile(new URL('extension/manifest.json', root), 'utf8'));
const hash = createHash('sha256').update(Buffer.from(manifest.key, 'base64')).digest('hex').slice(0, 32);
const id = [...hash].map(char => String.fromCharCode(97 + parseInt(char, 16))).join('');
const origin = `chrome-extension://${id}`;
const png = await readFile(new URL('extension/assets/logo.png', root));
assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.deepEqual(png, await readFile(new URL('assets/brand/pro-alifbo-mark-transparent.png', root)));

const context = await chromium.launchPersistentContext('', {
  ...(process.env.EXTENSION_TEST_BROWSER ? { executablePath: process.env.EXTENSION_TEST_BROWSER } : { channel: 'chromium' }),
  headless: true, viewport: { width: 420, height: 600 },
  ignoreDefaultArgs: ['--hide-scrollbars'],
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
});
try {
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => { if (/^https?:/.test(req.url())) requests.push(req.url()); });
  await page.goto(`${origin}/popup.html`);
  await page.locator('#source').waitFor();
  assert.equal(await page.locator('#copy').isDisabled(), true);
  assert.equal(await page.locator('#clear').isDisabled(), true);
  assert.equal(await page.evaluate(() => document.querySelector('img').naturalWidth > 0), true);
  assert.equal(await page.locator('h1').innerText(), 'Pro Alifbo');
  assert.equal(await page.locator('footer').count(), 0);
  assert.match(await page.locator('#result').evaluate(el => getComputedStyle(el).fontFamily), /Times New Roman/);
  assert.ok((await page.locator('header').boundingBox()).height <= 56);
  const transparent = await page.evaluate(() => {
    const image = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
  });
  assert.equal(transparent, true);
  assert.equal(await page.evaluate(() => chrome.runtime.getManifest().name), 'Pro Alifbo');

  const texts = { latin: 'Shahar, choy, gʻalaba, Oʻzbekiston', kirill: 'Шаҳар, чой, ғалаба, Ўзбекистон', new: 'Şahar, çoy, ğalaba, Özbekiston' };
  for (const [source, text] of Object.entries(texts)) {
    for (const [target, expected] of Object.entries(texts)) {
      await page.locator(`input[value="${target}"]`).check();
      await page.locator('#source').fill(text);
      assert.equal(await page.locator('#result').inputValue(), expected, `${source} → ${target}`);
    }
  }
  await page.locator('input[value="new"]').check();
  await page.locator('#source').fill('Shahar, чой va ÖZBEKISTON 😊');
  assert.equal(await page.locator('#result').inputValue(), 'Şahar, çoy va ÖZBEKISTON 😊');
  await page.locator('#source').fill('<script>alert(1)</script> & Sh');
  assert.equal(await page.locator('#result').inputValue(), '<script>alert(1)</script> & Ş');
  assert.equal(await page.locator('script').count(), 1);

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#source').fill('Shahar, choy, gʻalaba, Oʻzbekiston.');
  await page.locator('#copy').click();
  await page.waitForFunction(() => document.querySelector('#copy-label').textContent.includes('Nusxalandi'));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'Şahar, çoy, ğalaba, Özbekiston.');
  await page.locator('#source').fill('Salom, dunyo!\nШаҳар, чой, ғалаба.\nO‘zbekiston — yangi alifboda.');
  const size = await page.evaluate(() => ({ width: document.body.scrollWidth, height: document.body.scrollHeight }));
  assert.ok(size.width <= 420 && size.height <= 600, JSON.stringify(size));
  await mkdir(new URL('artifacts/', root), { recursive: true });
  await page.locator('body').screenshot({ path: fileURLToPath(new URL('artifacts/extension-preview.png', root)) });

  await page.locator('#clear').click();
  assert.equal(await page.locator('#result').inputValue(), '');
  assert.equal(await page.locator('#source').inputValue(), '');
  assert.equal(await page.locator('#copy').isDisabled(), true);
  await page.locator('input[value="kirill"]').check();
  await page.waitForFunction(async () => (await chrome.storage.local.get('target')).target === 'kirill');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('input[value="kirill"]').checked);
  await page.locator('#source').fill('Şahar');
  assert.equal(await page.locator('#result').inputValue(), 'Шаҳар');
  assert.deepEqual(Object.keys(await page.evaluate(() => chrome.storage.local.get(null))), ['target']);
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, []);
  await page.locator('#source').fill('Shahar va choy. '.repeat(200));
  assert.equal(await page.locator('#source').evaluate(el => el.scrollHeight > el.clientHeight), true);
  assert.equal(await page.locator('#source').evaluate(el => getComputedStyle(el).scrollbarWidth), 'thin');
  await page.locator('#source').evaluate(el => { el.scrollTop = 60; });
  assert.ok(await page.locator('#source').evaluate(el => el.scrollTop > 0));
  await page.locator('body').screenshot({ path: fileURLToPath(new URL('artifacts/extension-scroll-preview.png', root)) });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).animationName), 'none');
  console.log('Extension installed in Chromium: 9 conversion combinations, mixed script, clipboard, clear, storage, PNG and popup layout passed.');
} finally {
  await context.close();
}
