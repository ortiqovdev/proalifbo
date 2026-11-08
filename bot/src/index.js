import { createHandler } from './handler.js';
import { preferences } from './preferences.js';
import { processUpdate } from './updates.js';
import { fileURLToPath } from 'node:url';

const handler = createHandler(preferences(fileURLToPath(new URL('../../.data/preferences.json', import.meta.url))));

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token || token === 'BotFather_tokenini_shu_yerga_yozing') {
  console.error('TELEGRAM_BOT_TOKEN kerak. README.md dagi ko‘rsatmani bajaring.');
  process.exit(1);
}

const baseUrl = `https://api.telegram.org/bot${token}`;
let stopping = false;
process.on('SIGINT', () => { stopping = true; });
process.on('SIGTERM', () => { stopping = true; });

async function call(method, body) {
  const response = await fetch(`${baseUrl}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(35000)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    const error = new Error(`${method}: ${data.description ?? response.status}`);
    error.code = data.error_code ?? response.status;
    error.retryAfter = data.parameters?.retry_after;
    throw error;
  }
  return data.result;
}

async function main() {
  const me = await call('getMe', {});
  await call('setMyDescription', { description: 'Assalomu alaykum! 🌿 Pro Alifbo matnni lotin, kirill va yangi alifbo o‘rtasida o‘giradi. Bot tilini va natija alifbosini Sozlamalar orqali tanlang. Boshlash uchun START tugmasini bosing.' });
  await call('setMyCommands', { commands: [
    { command: 'start', description: 'Boshlash va salomlashuv' },
    { command: 'settings', description: 'Yozuvni tanlash' },
    { command: 'help', description: 'Yordam' }
  ] });
  console.log(`@${me.username} ishlayapti. To‘xtatish: Ctrl+C`);
  let offset = 0;
  while (!stopping) {
    try {
      const updates = await call('getUpdates', { offset, timeout: 25, allowed_updates: ['message', 'callback_query'] });
      for (const update of updates) {
        try {
          await processUpdate(update, call, handler);
        } catch (error) {
          if (![400, 403].includes(error.code)) throw error;
          console.error(error.message);
        }
        offset = update.update_id + 1;
      }
    } catch (error) {
      console.error(error.message);
      if ([401, 409].includes(error.code)) throw error;
      if (!stopping) await new Promise(resolve => setTimeout(resolve, (error.retryAfter ?? 2) * 1000));
    }
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
