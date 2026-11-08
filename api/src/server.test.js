import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiServer } from './server.js';

test('HTTP API supports all six conversion directions and validates requests', async t => {
  const server = createApiServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${base}/v1/transliterate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const texts = { latin: 'Shahar, choy, gʻalaba, Oʻzbekiston', cyrillic: 'Шаҳар, чой, ғалаба, Ўзбекистон', new: 'Şahar, çoy, ğalaba, Özbekiston' };
  for (const [source, text] of Object.entries(texts)) {
    for (const target of Object.keys(texts).filter(target => target !== source)) {
      const response = await post({ text, target });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { text: texts[target], detectedScript: source, target });
    }
  }
  assert.equal((await (await post({ text: 'Шаҳар' })).json()).text, 'Şahar');
  assert.equal((await (await post({ text: 'Şahar', target: 'uzbek' })).json()).text, 'Shahar');
  assert.equal((await post({ text: 'test', target: 'wrong' })).status, 400);
  assert.equal((await post({ text: 123 })).status, 400);
  assert.equal((await post(null)).status, 400);
  assert.equal((await post({ text: 'a'.repeat(12001) })).status, 413);
  assert.equal((await post({ text: 'a'.repeat(70000) })).status, 413);
  assert.equal((await fetch(`${base}/v1/transliterate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await fetch(`${base}/v1/transliterate`, { method: 'POST', body: 'abc' })).status, 415);
  assert.equal((await fetch(`${base}/v1/transliterate`)).status, 405);
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  assert.equal((await fetch(`${base}/v1/transliterate`, { method: 'OPTIONS' })).status, 204);
  assert.equal((await (await fetch(`${base}/health`)).json()).status, 'ok');
});
