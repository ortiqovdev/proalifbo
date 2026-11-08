import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from './handler.js';
import { processUpdate } from './updates.js';

test('start greets the actual first name and offers Latin and Cyrillic only', () => {
  const h = createHandler();
  const welcome = h.handleText(1, '/start', 'Ali <3')[0];
  assert.match(welcome.text, /Assalomu alaykum, Ali <3!/);
  assert.equal(welcome.parse_mode, undefined);
  assert.deepEqual(welcome.reply_markup.inline_keyboard[0].map(b => b.callback_data), ['onboard:latin', 'onboard:kirill']);
  assert.match(h.handleText(1, 'Salom', 'Ali')[0].text, /bot tilini tanlang/);
  const selected = h.handleCallback(1, 'onboard:kirill');
  assert.equal(selected.clearKeyboard, true);
  assert.deepEqual(selected.send.reply_markup.keyboard, [[{ text: '⚙️ Созламалар' }, { text: 'ℹ️ Ёрдам' }]]);
  assert.equal(h.handleText(1, 'Shahar')[0].text, '<code>Şahar</code>');
});

test('UI and target are independent, localized, isolated, and persisted', () => {
  let saved;
  const h = createHandler({ save: values => { saved = new Map(values); } });
  h.handleCallback(1, 'onboard:latin');
  h.handleCallback(2, 'onboard:latin');
  const target = h.handleCallback(1, 'pref:target:kirill');
  assert.match(target.edit.text, /Natija alifbosi: Kirill/);
  assert.equal(target.send, undefined);
  const ui = h.handleCallback(1, 'pref:ui:kirill');
  assert.match(ui.edit.text, /Бот интерфейси: Кирилл/);
  assert.equal(h.handleText(1, 'Şahar')[0].text, '<code>Шаҳар</code>');
  assert.equal(h.handleText(2, 'Shahar')[0].text, '<code>Şahar</code>');
  assert.deepEqual(saved.get('1'), { ui: 'kirill', target: 'kirill' });
  const restarted = createHandler({ modes: saved });
  assert.equal(restarted.handleText(1, 'Şahar')[0].text, '<code>Шаҳар</code>');
  assert.match(restarted.handleText(1, '⚙️ Созламалар')[0].text, /Бот интерфейси/);
  h.handleCallback(1, 'pref:ui:new');
  assert.equal(h.handleText(1, 'Shahar')[0].reply_markup.inline_keyboard[0][0].text, '↗️ Ulaşiş');
  assert.match(h.handleCallback(1, 'pref:target:invalid').notice, /eskirgan/);
});

test('returning users skip onboarding on every start, including after restart', () => {
  let saved;
  const h = createHandler({ save: values => { saved = new Map(values); } });
  h.handleText(1, '/start', 'Akmal');
  h.handleCallback(1, 'onboard:kirill');
  h.handleCallback(1, 'pref:target:latin');
  for (const handler of [h, createHandler({ modes: saved })]) {
    for (const command of ['/start', '/start@proalifbobot', '/start welcome']) {
      const reply = handler.handleText(1, command, 'Akmal')[0];
      assert.equal(reply.text, 'Тайёр! Матнингизни юборинг 🌿');
      assert.equal(reply.reply_markup.inline_keyboard, undefined);
      assert.equal(reply.reply_markup.keyboard[0][0].text, '⚙️ Созламалар');
      assert.equal(handler.handleText(1, 'Шаҳар')[0].text, '<code>Shahar</code>');
    }
  }
  assert.match(h.handleText(2, '/start', 'Ali')[0].text, /Assalomu alaykum, Ali!/);
});

test('HTML escaping and long results retain only sharing button', () => {
  const h = createHandler(); h.handleCallback(1, 'onboard:latin');
  assert.equal(h.handleText(1, '<b>Sh</b> &')[0].text, '<code>&lt;b&gt;Ş&lt;/b&gt; &amp;</code>');
  const replies = h.handleText(1, 'Я'.repeat(4000));
  assert.equal(replies.length, 3);
  for (const reply of replies) {
    assert.equal(reply.reply_markup.inline_keyboard.flat().length, 1);
    assert.equal(reply.reply_markup.inline_keyboard[0][0].text, '↗️ Ulashish');
    assert.ok(reply.reply_markup.inline_keyboard[0][0].url);
  }
});

test('update routes first name, callback acknowledgement and ordinary keyboard', async () => {
  const calls = [];
  const call = async (method, body) => { calls.push({ method, body }); };
  const h = createHandler();
  await processUpdate({ message: { chat: { id: 1, type: 'private' }, from: { first_name: 'Madina' }, message_id: 1, text: '/start' } }, call, h);
  assert.match(calls[0].body.text, /Madina!/);
  calls.length = 0;
  await processUpdate({ callback_query: { id: 'q', from: { id: 1 }, data: 'onboard:latin', message: { chat: { id: 1, type: 'private' }, message_id: 5 } } }, call, h);
  assert.deepEqual(calls.map(c => c.method), ['answerCallbackQuery', 'editMessageReplyMarkup', 'sendMessage']);
  assert.equal(calls[2].body.reply_markup.keyboard[0][0].text, '⚙️ Sozlamalar');
  assert.match(h.handleText(1, 'ℹ️ Yordam')[0].text, /Sozlamalarda/);
  assert.equal(h.handleText(1, '⚙️ Sozlamalar')[0].reply_markup.inline_keyboard.length, 2);
});

test('old result callbacks are retired and existing output preferences survive migration', () => {
  const h = createHandler({ modes: new Map([['1', 'kirill']]) });
  assert.equal(h.handleText(1, 'Şahar')[0].text, '<code>Шаҳар</code>');
  assert.match(h.handleCallback(1, 'mode:latin').notice, /eskirgan/);
  assert.match(h.handleCallback(1, 'copyhelp').notice, /eskirgan/);
});
