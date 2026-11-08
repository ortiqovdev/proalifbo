import { mkdir, copyFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
for (const dir of ['lib', 'assets', 'downloads']) await mkdir(new URL(`web/public/${dir}/`, root), { recursive: true });
for (const file of ['new-alphabet.js', 'transliterate.js']) await copyFile(new URL(`shared/${file}`, root), new URL(`web/public/lib/${file}`, root));
await copyFile(new URL('assets/brand/pro-alifbo-mark-transparent.png', root), new URL('web/public/assets/logo.png', root));
await copyFile(new URL('pro-alifbo-chrome-v0.1.3.zip', root), new URL('web/public/downloads/pro-alifbo-chrome-v0.1.3.zip', root));
console.log('Web modullari, logo va Chrome tarqatmasi yangilandi.');

