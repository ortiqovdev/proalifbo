import { toLatin, toCyrillic } from './transliterate.js';

export function fromNewAlphabet(text) {
  return text.replace(/[ŞşÇçĞğÖö]/g, char => ({ Ş: 'Sh', ş: 'sh', Ç: 'Ch', ç: 'ch', Ğ: 'Gʻ', ğ: 'gʻ', Ö: 'Oʻ', ö: 'oʻ' })[char]);
}

export function toNewAlphabet(text) {
  return toLatin(text).replace(/sh|ch|g['’ʻ‘ʼ`]|o['’ʻ‘ʼ`]/gi, source => {
    const lower = source.toLowerCase();
    const mapped = lower.startsWith('sh') ? 'ş' : lower.startsWith('ch') ? 'ç' : lower[0] === 'g' ? 'ğ' : 'ö';
    return source[0] === source[0].toUpperCase() ? mapped.toUpperCase() : mapped;
  });
}

export function convert(text, target) {
  if (target === 'new') return toNewAlphabet(text);
  if (target === 'latin') return toLatin(fromNewAlphabet(text));
  if (target === 'kirill') return toCyrillic(fromNewAlphabet(text));
  throw new Error('Unknown alphabet');
}
