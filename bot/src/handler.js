import { convert } from '../../shared/new-alphabet.js';
import { shareUrl } from './share.js';
import { tr, isMenu } from './locale.js';

const alphabets = ['latin', 'kirill', 'new'];
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function splitText(text, max = 3500) {
  const parts = [];
  let part = '';
  for (const char of text) {
    if (part.length + char.length > max) { parts.push(part); part = ''; }
    part += char;
  }
  if (part) parts.push(part);
  return parts;
}

export function createHandler({ modes = new Map(), save = () => {} } = {}) {
  const current = id => {
    const value = modes.get(String(id));
    return typeof value === 'string' ? { ui: 'latin', target: value } : value ?? { ui: null, target: 'new' };
  };
  const t = (id, key) => tr(current(id).ui ?? 'latin', key);
  const mainKeyboard = id => ({
    keyboard: [[{ text: t(id, 'settings') }, { text: t(id, 'help') }]],
    resize_keyboard: true, is_persistent: true, one_time_keyboard: false
  });
  const ready = id => ({ text: `${t(id, 'ready')}\n\n${t(id, 'target')}: ${t(id, current(id).target)}`, reply_markup: mainKeyboard(id) });
  const welcome = (id, firstName) => ({
    text: `Assalomu alaykum, ${firstName || 'do‘stim'}! Pro Alifbo’ga xush kelibsiz 🌿\n\nMatnlaringizni lotin, kirill va yangi alifbo o‘rtasida o‘giring.\n\nO‘zingizga qulay bot tilini tanlang:\nЎзингизга қулай бот тилини танланг:`,
    reply_markup: { inline_keyboard: [[{ text: 'Lotin', callback_data: 'onboard:latin' }, { text: 'Кирилл', callback_data: 'onboard:kirill' }]] }
  });
  const settings = id => ({
    text: `${t(id, 'settings')}\n\n💬 ${t(id, 'ui')}: ${t(id, current(id).ui ?? 'latin')}\n🔄 ${t(id, 'target')}: ${t(id, current(id).target)}\n\n${t(id, 'settingsHint')}`,
    reply_markup: { inline_keyboard: ['ui', 'target'].map(field => alphabets.map(mode => ({
      text: `${field === 'ui' ? '💬' : '🔄'} ${current(id)[field] === mode ? '✅ ' : ''}${t(id, mode)}`,
      callback_data: `pref:${field}:${mode}`
    }))) }
  });
  const update = (id, changes) => { modes.set(String(id), { ...current(id), ...changes }); save(modes); };

  function handleText(id, text, firstName) {
    const trimmed = text?.trim() ?? '';
    const command = /^\/(\w+)(?:@\w+)?(?:\s|$)/.exec(trimmed)?.[1]?.toLowerCase();
    if (command === 'start' && current(id).ui) {
      return [{ text: t(id, 'ready'), reply_markup: mainKeyboard(id) }];
    }
    if (!current(id).ui) return [welcome(id, firstName)];
    if (command === 'settings' || isMenu(trimmed, 'settings')) return [settings(id)];
    if (command === 'help' || isMenu(trimmed, 'help')) return [{ text: t(id, 'helpText'), reply_markup: mainKeyboard(id) }];
    const mode = { new: 'new', latin: 'latin', kirill: 'kirill', cyrillic: 'kirill', auto: 'new' }[command];
    if (mode) { update(id, { target: mode }); return [settings(id)]; }
    if (trimmed.startsWith('/')) return [{ text: t(id, 'unknown'), reply_markup: mainKeyboard(id) }];
    if (text == null) return [{ text: t(id, 'media'), reply_markup: mainKeyboard(id) }];
    if (!trimmed) return [{ text: t(id, 'empty') }];
    if (text.length > 12000) return [{ text: t(id, 'long') }];
    return splitText(convert(text, current(id).target)).map(part => {
      const tag = part.length <= 256 ? 'code' : 'pre';
      return {
        text: `<${tag}>${escapeHtml(part)}</${tag}>`, parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [[{ text: t(id, 'share'), url: shareUrl(part) }]] }
      };
    });
  }

  function handleCallback(id, data) {
    const [, onboarding] = /^onboard:(latin|kirill)$/.exec(data ?? '') ?? [];
    if (onboarding) {
      update(id, { ui: onboarding });
      return {
        notice: t(id, 'saved'),
        clearKeyboard: true,
        send: ready(id)
      };
    }
    if (!current(id).ui) return { notice: t(id, 'choose') };
    const [, field, mode] = /^pref:(ui|target):(latin|kirill|new)$/.exec(data ?? '') ?? [];
    if (field) {
      update(id, { [field]: mode });
      return { notice: t(id, 'saved'), edit: settings(id), ...(field === 'ui' ? { send: ready(id) } : {}) };
    }
    return { notice: t(id, 'expired') };
  }
  return { handleText, handleCallback };
}
