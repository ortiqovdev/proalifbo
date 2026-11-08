import { existsSync, readFileSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';

export function preferences(path) {
  const modes = new Map();
  if (existsSync(path)) {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    for (const [id, mode] of Object.entries(data)) {
      if (['new', 'latin', 'kirill'].includes(mode)) modes.set(id, { ui: 'latin', target: mode });
      else if (mode && ['new', 'latin', 'kirill'].includes(mode.ui) && ['new', 'latin', 'kirill'].includes(mode.target)) modes.set(id, mode);
    }
  }
  return { modes, save(values) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(`${path}.tmp`, JSON.stringify(Object.fromEntries(values)), 'utf8');
    renameSync(`${path}.tmp`, path);
  } };
}
