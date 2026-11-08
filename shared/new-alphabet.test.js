import test from 'node:test';
import assert from 'node:assert/strict';
import { convert } from './new-alphabet.js';

test('four user approved letter substitutions from both source scripts', () => {
  assert.equal(convert('Sh sh Ch ch G‘ g‘ O‘ o‘', 'new'), 'Ş ş Ç ç Ğ ğ Ö ö');
  assert.equal(convert('Ш ш Ч ч Ғ ғ Ў ў', 'new'), 'Ş ş Ç ç Ğ ğ Ö ö');
  assert.equal(convert('SH SHAHAR ШАҲАР', 'new'), 'Ş ŞAHAR ŞAHAR');
  assert.equal(convert("O'zbek G’ulom gʻalaba oʼz", 'new'), 'Özbek Ğulom ğalaba öz');
});

test('mixed script and reverse conversion', () => {
  assert.equal(convert('Shahar ва ғалаба 😊', 'new'), 'Şahar va ğalaba 😊');
  assert.equal(convert('Şahar, çoy, ğalaba, Özbekiston', 'latin'), 'Shahar, choy, gʻalaba, Oʻzbekiston');
  assert.equal(convert('Şahar, çoy, ğalaba, Özbekiston', 'kirill'), 'Шаҳар, чой, ғалаба, Ўзбекистон');
  assert.equal(convert('Şahar', 'new'), 'Şahar');
});
