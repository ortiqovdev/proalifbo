import { convert } from './lib/new-alphabet.js';

const source = document.querySelector('#source');
const result = document.querySelector('#result');
const copy = document.querySelector('#copy');
const clear = document.querySelector('#clear');
const feedback = document.querySelector('#feedback');
const choices = [...document.querySelectorAll('input[name="target"]')];
let target = 'new';
let selectedByUser = false;
let copyTimer;

function render() {
  result.value = convert(source.value, target);
  document.querySelector('#count').textContent = `${[...result.value].length.toLocaleString('en-US')} belgi`;
  copy.disabled = !result.value.trim();
  clear.disabled = !source.value;
  document.querySelector('#copy-label').textContent = 'Nusxa olish';
  feedback.textContent = '';
}

source.addEventListener('input', render);
for (const choice of choices) choice.addEventListener('change', () => {
  selectedByUser = true;
  target = choice.value;
  render();
  chrome.storage.local.set({ target }).catch(() => { feedback.textContent = 'Tanlovni saqlab bo‘lmadi.'; });
});
clear.addEventListener('click', () => { source.value = ''; render(); source.focus(); });
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    document.querySelector('#copy-label').textContent = 'Nusxalandi ✓';
    feedback.textContent = 'Matn nusxalandi.';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { document.querySelector('#copy-label').textContent = 'Nusxa olish'; }, 1800);
  } catch {
    result.focus(); result.select();
    feedback.textContent = 'Matn belgilandi. Ctrl+C yoki ⌘C tugmalarini bosing.';
  }
});

chrome.storage.local.get('target').then(saved => {
  if (!selectedByUser && ['new', 'latin', 'kirill'].includes(saved.target)) {
    target = saved.target;
    choices.find(choice => choice.value === target).checked = true;
    render();
  }
}).catch(() => {});
render();
