import test from 'node:test';
import assert from 'node:assert/strict';
import { detectScript, toCyrillic, toLatin } from './transliterate.js';

test('common Uzbek words in both directions', () => {
  assert.equal(toCyrillic('Oʻzbekiston, gʻalaba!'), 'Ўзбекистон, ғалаба!');
  assert.equal(toLatin('Ўзбекистон, ғалаба!'), 'Oʻzbekiston, gʻalaba!');
  assert.equal(toCyrillic('Shahar, choy, yoʻl'), 'Шаҳар, чой, йўл');
  assert.equal(toLatin('Шаҳар, чой, йўл'), 'Shahar, choy, yoʻl');
  assert.equal(toCyrillic('Ertaga yangi yil'), 'Эртага янги йил');
  assert.equal(toLatin('Европа'), 'Yevropa');
});

test('detects mixed script', () => {
  assert.equal(detectScript('salom дунё'), 'mixed');
});
