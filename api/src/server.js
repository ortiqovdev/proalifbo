import { createServer } from 'node:http';
import { convert } from '../../shared/new-alphabet.js';

const targets = new Map([['new', 'new'], ['latin', 'latin'], ['uzbek', 'latin'], ['cyrillic', 'kirill'], ['kirill', 'kirill']]);

export function detectScript(text) {
  const cyrillic = /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(text);
  const latin = /[A-Za-zŞşÇçĞğÖö]/.test(text);
  if (cyrillic && latin) return 'mixed';
  if (cyrillic) return 'cyrillic';
  if (/[ŞşÇçĞğÖö]/.test(text)) return 'new';
  return latin ? 'latin' : 'unknown';
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body));
}

export function createApiServer() {
  return createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && path === '/health') return send(res, 200, { status: 'ok', service: 'pro-alifbo' });
    if (path !== '/v1/transliterate') return send(res, 404, { error: 'not_found' });
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'Content-Type' });
      return res.end();
    }
    if (req.method !== 'POST') { res.setHeader('allow', 'POST, OPTIONS'); return send(res, 405, { error: 'method_not_allowed' }); }
    if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') return send(res, 415, { error: 'json_required' });
    try {
      const chunks = [];
      let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 65536) { send(res, 413, { error: 'body_too_large' }); return; }
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { return send(res, 400, { error: 'invalid_json' }); }
      if (!body || Array.isArray(body) || typeof body !== 'object' || typeof body.text !== 'string' || !body.text.trim()) return send(res, 400, { error: 'text_required' });
      if (body.text.length > 12000) return send(res, 413, { error: 'text_too_long', maxLength: 12000 });
      const target = targets.get(body.target ?? 'new');
      if (!target) return send(res, 400, { error: 'invalid_target', allowed: ['cyrillic', 'latin', 'new'] });
      send(res, 200, {
        text: convert(body.text, target),
        detectedScript: detectScript(body.text),
        target: target === 'kirill' ? 'cyrillic' : target
      });
    } catch {
      if (!res.writableEnded && !res.destroyed) send(res, 500, { error: 'internal_error' });
    }
  });
}
