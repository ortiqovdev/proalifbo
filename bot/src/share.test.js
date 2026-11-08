import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from './handler.js';
import { shareUrl } from './share.js';

test('sharing preserves converted text with punctuation and adds attribution only to shared text', () => {
  const h = createHandler();
  h.handleCallback(1, 'onboard:latin');
  const reply = h.handleText(1, 'Shahar & choy? #1 😊')[0];
  const url = new URL(reply.reply_markup.inline_keyboard[0][0].url);
  assert.equal(url.origin + url.pathname, 'https://t.me/share/url');
  assert.equal(url.searchParams.get('url'), 'Şahar & çoy? #1 😊\n\n@proalifbobot');
  assert.equal(url.searchParams.has('text'), false);
  assert.ok(!url.searchParams.get('url').includes('https://t.me/proalifbobot'));
  assert.equal(reply.reply_markup.inline_keyboard.flat().length, 1);
  assert.equal(reply.reply_markup.inline_keyboard[0][0].copy_text, undefined);
});

test('long replies share every output chunk without truncation', () => {
  const input = 'Шаҳар 😊 '.repeat(700);
  const h = createHandler();
  h.handleCallback(1, 'onboard:latin');
  const replies = h.handleText(1, input);
  const parts = replies.map(reply => new URL(reply.reply_markup.inline_keyboard[0][0].url).searchParams.get('url'));
  assert.ok(parts.every(part => part.endsWith('\n\n@proalifbobot')));
  assert.equal(parts.map(part => part.slice(0, -'\n\n@proalifbobot'.length)).join(''), 'Şahar 😊 '.repeat(700));
});

test('share draft meets Telegram Desktop nonempty and non-inline-query guards', () => {
  for (const input of ['Salom', 'Şahar & choy? #1 😊', '@someone salom', '  @someone salom', '']) {
    const draft = new URL(shareUrl(input)).searchParams.get('url');
    assert.ok(draft.length > 0);
    assert.ok(!/^[\s\uFFFC]*@/u.test(draft));
    assert.equal(draft.replace(/^\u2060/u, ''), `${input}\n\n@proalifbobot`);
  }
});
