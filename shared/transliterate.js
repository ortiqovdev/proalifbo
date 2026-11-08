const cyrillicToLatinMap = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: 'ʼ', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ў: 'oʻ', қ: 'q', ғ: 'gʻ', ҳ: 'h'
};

const latinToCyrillicMap = {
  shch: 'щ', ch: 'ч', sh: 'ш', ng: 'нг', yo: 'ё', yu: 'ю', ya: 'я', ye: 'е', ts: 'ц',
  a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л',
  m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х',
  y: 'й', z: 'з', c: 'ц', w: 'в'
};

const apostrophes = new Set(["'", '’', 'ʻ', '‘', 'ʼ', '`']);
const latinLetter = /[A-Za-z]/;
const cyrillicLetter = /[А-Яа-яЁёЎўҚқҒғҲҳ]/;

function matchCase(source, result) {
  if (!result) return result;
  if (source.length > 1 && source === source.toUpperCase()) return result.toUpperCase();
  if (source[0] === source[0].toUpperCase()) return result[0].toUpperCase() + result.slice(1);
  return result;
}

export function detectScript(text) {
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  const cyrillic = (text.match(/[А-Яа-яЁёЎўҚқҒғҲҳ]/g) ?? []).length;
  if (latin && cyrillic) return 'mixed';
  if (latin) return 'latin';
  if (cyrillic) return 'cyrillic';
  return 'none';
}

export function toLatin(text) {
  return text.replace(/[А-Яа-яЁёЎўҚқҒғҲҳ]+/g, word => {
    const result = latinWord(word);
    return word.length > 1 && word === word.toUpperCase() ? result.toUpperCase() : result;
  });
}

function latinWord(text) {
  let result = '';
  let wordStart = true;
  for (const char of text) {
    const lower = char.toLowerCase();
    if (cyrillicToLatinMap[lower] !== undefined) {
      const mapped = lower === 'е' && wordStart ? 'ye' : cyrillicToLatinMap[lower];
      result += matchCase(char, mapped);
      wordStart = false;
    } else {
      result += char;
      if (!latinLetter.test(char) && !apostrophes.has(char)) wordStart = true;
      else if (latinLetter.test(char)) wordStart = false;
    }
  }
  return result;
}

export function toCyrillic(text) {
  let result = '';
  let wordStart = true;
  for (let i = 0; i < text.length;) {
    const char = text[i];
    const next = text[i + 1];
    if (latinLetter.test(char)) {
      if ((char.toLowerCase() === 'o' || char.toLowerCase() === 'g') && apostrophes.has(next)) {
        result += matchCase(char, char.toLowerCase() === 'o' ? 'ў' : 'ғ');
        i += 2;
        wordStart = false;
        continue;
      }
      const four = text.slice(i, i + 4);
      const two = text.slice(i, i + 2);
      const nextIsApostrophe = apostrophes.has(text[i + 2]);
      const useTwo = latinToCyrillicMap[two.toLowerCase()] && !(two.toLowerCase() === 'yo' && nextIsApostrophe);
      const key = latinToCyrillicMap[four.toLowerCase()] ? four : useTwo ? two : char;
      const mapped = key.toLowerCase() === 'e' && wordStart ? 'э' : latinToCyrillicMap[key.toLowerCase()];
      result += matchCase(key, mapped);
      i += key.length;
      wordStart = false;
    } else {
      result += char;
      if (!cyrillicLetter.test(char) && !apostrophes.has(char)) wordStart = true;
      else if (cyrillicLetter.test(char)) wordStart = false;
      i++;
    }
  }
  return result;
}
