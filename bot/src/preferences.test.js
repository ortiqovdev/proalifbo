import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { preferences } from './preferences.js';

test('old stored targets migrate and both settings survive reload', t => {
  const dir = mkdtempSync(join(tmpdir(), 'pro-alifbo-prefs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, 'preferences.json');
  writeFileSync(path, JSON.stringify({ 1: 'kirill', 2: { ui: 'new', target: 'latin' }, 3: { ui: 'bad', target: 'latin' } }));
  const store = preferences(path);
  assert.deepEqual(store.modes.get('1'), { ui: 'latin', target: 'kirill' });
  assert.equal(store.modes.has('3'), false);
  store.modes.set('1', { ui: 'kirill', target: 'new' });
  store.save(store.modes);
  assert.deepEqual(preferences(path).modes.get('1'), { ui: 'kirill', target: 'new' });
});
