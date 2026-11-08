import { mkdir, copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
for (const dir of ['extension/lib/', 'extension/assets/']) await mkdir(new URL(dir, root), { recursive: true });
for (const name of ['new-alphabet.js', 'transliterate.js']) await copyFile(new URL(`shared/${name}`, root), new URL(`extension/lib/${name}`, root));
await copyFile(new URL('assets/brand/pro-alifbo-mark-transparent.png', root), new URL('extension/assets/logo.png', root));
const manifest = JSON.parse(await readFile(new URL('extension/manifest.json', root), 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('Manifest V3 kerak');
console.log(`Chrome kengaytmasi tayyor: ${fileURLToPath(new URL('extension/', root))}`);
