import { convert } from './lib/new-alphabet.js';

const source = document.querySelector('#source');
const result = document.querySelector('#result');
const copy = document.querySelector('#copy');
const clear = document.querySelector('#clear');
const feedback = document.querySelector('#feedback');
const radios = [...document.querySelectorAll('input[name="target"]')];
let target = 'new';
try { const saved = localStorage.getItem('pro-alifbo-target'); if (['latin', 'kirill', 'new'].includes(saved)) target = saved; } catch {}
radios.find(radio => radio.value === target).checked = true;

function render() {
  result.value = convert(source.value, target);
  document.querySelector('#source-count').textContent = `${source.value.length.toLocaleString('fr-FR')} / 12 000`;
  document.querySelector('#result-count').textContent = `${[...result.value].length.toLocaleString('fr-FR')} belgi`;
  document.querySelector('#copy-label').textContent = 'Nusxa olish';
  copy.disabled = !result.value.trim(); clear.disabled = !source.value;
  feedback.textContent = 'Matn avtomatik o‘giriladi.';
}
source.addEventListener('input', render);
radios.forEach(radio => radio.addEventListener('change', () => {
  target = radio.value; render();
  try { localStorage.setItem('pro-alifbo-target', target); } catch {}
}));
clear.addEventListener('click', () => { source.value = ''; render(); source.focus(); });
function useSample() {
  target = 'new'; radios.find(radio => radio.value === 'new').checked = true;
  source.value = 'Salom, dunyo!\nШаҳар, чой, ғалаба.\nO‘zbekiston — yangi alifboda.';
  render(); document.querySelector('#konvertor').scrollIntoView({ block: 'center' }); source.focus({ preventScroll: true });
}
document.querySelector('#sample').addEventListener('click', useSample);
copy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(result.value); document.querySelector('#copy-label').textContent = 'Nusxalandi ✓'; feedback.textContent = 'Matn nusxalandi.'; }
  catch { result.focus(); result.select(); feedback.textContent = 'Matn belgilandi. Ctrl+C yoki ⌘C bilan nusxalang.'; }
});

const articles = {
  writing: `<img src="assets/article-writing.png" alt="Kitob va qalam"><h2 id="dialog-title">Kirilldan lotinga: nimaga e’tibor berish kerak?</h2><p>Bir matnni boshqa yozuvda o‘qish yoki jo‘natish kerak bo‘lsa, konvertor ishni yengillashtiradi. Transliteratsiyada matnning yozuvi o‘zgaradi; u boshqa tilga tarjima qilinmaydi.</p><h3>1. Kerakli natijani tanlang</h3><p>Matn maydoniga lotin, kirill yoki yangi alifboda yozishingiz mumkin. Natija yonidagi tugmalar bilan kerakli yozuvni tanlang. Aralash yozuvdagi matn ham qayta ishlanadi.</p><h3>2. Ismlar va nozik holatlarni ko‘zdan kechiring</h3><p>Ism-shariflar, qisqartmalar va o‘zlashma so‘zlar alohida e’tibor talab qilishi mumkin. Rasmiy hujjatga qo‘yishdan oldin natijani bir marta o‘qib chiqing.</p><h3>3. Natijani nusxalang</h3><p>“Nusxa olish” tugmasi natijani oddiy matn sifatida oladi. Uni xabar, hujjat yoki boshqa dasturga joylashingiz mumkin.</p><p class="article-example">Шаҳар, чой, ғалаба → Shahar, choy, gʻalaba</p><button class="try-example">Konvertorda sinab ko‘rish ↗</button>`,
  alphabet: `<img src="assets/article-alphabet.png" alt="Ş, Ç, Ğ, Ö harflari"><h2 id="dialog-title">Ş, Ç, Ğ, Ö: to‘rtta belgi bilan tanishamiz</h2><p>Pro Alifbodagi “Yangi alifbo” rejimi to‘rtta belgi almashinuviga asoslanadi. Quyidagi misollar aynan dasturimizda ishlatiladigan qoidalarni tushuntiradi.</p><p class="article-example">Sh → Ş &nbsp; · &nbsp; Ch → Ç<br>G‘ → Ğ &nbsp; · &nbsp; O‘ → Ö</p><h3>So‘z ichida qanday ko‘rinadi?</h3><p>“Shahar” — “Şahar”, “choy” — “çoy”, “g‘alaba” — “ğalaba”, “O‘zbekiston” — “Özbekiston” shaklida chiqadi. Kirill matnini yuborsangiz ham shu natijaga o‘tkazish mumkin.</p><h3>Qayta o‘girish ham mumkin</h3><p>Yangi alifbodagi matnni asosiy maydonga joylab, natijadan Lotin yoki Кириллni tanlang. Kerakli yozuvni istalgan payt o‘zgartira olasiz.</p><button class="try-example">Misol bilan sinab ko‘rish ↗</button>`,
  extension: `<img src="assets/article-extension.png" alt="Klaviatura va yashil daftar"><h2 id="dialog-title">Pro Alifbo endi brauzeringiz yonida</h2><p>Chrome kengaytmasining dastlabki 0.1.3 versiyasi tayyor. Oq-yashil ixcham oynada matn kiriting, natija alifbosini tanlang va bir tugma bilan nusxalang.</p><h3>Kichik oynada kerakli imkoniyatlar</h3><p>Kiruvchi yozuvni alohida tanlash shart emas. Lotin, kirill va yangi alifbo qabul qilinadi. Natija Times New Roman shriftida ko‘rinadi, tanlagan alifbo esa keyingi foydalanish uchun saqlanadi.</p><p>Kengaytma internetsiz ishlaydi va matnni tashqi konvertatsiya xizmatiga yubormaydi. Hozircha uni mahalliy o‘rnatish uchun ZIP ko‘rinishida taqdim etamiz; Chrome Web Store’da hali nashr qilinmagan.</p><p><a href="downloads/pro-alifbo-chrome-v0.1.3.zip" download>Chrome kengaytmasini yuklab olish ↓</a></p><button class="try-install text-button">O‘rnatish ko‘rsatmasi →</button>`,
  install: `<h2 id="dialog-title">Chrome kengaytmasini o‘rnatish</h2><p>ZIP paketni yuklab oling va kompyuteringizdagi alohida papkaga oching.</p><ol><li>Chrome manzil satriga <strong>chrome://extensions</strong> yozing.</li><li><strong>Developer mode</strong> tugmasini yoqing.</li><li><strong>Load unpacked</strong>ni bosib, manifest.json joylashgan papkani tanlang.</li><li>Kengaytmalar menyusidan Pro Alifbo’ni panelga mahkamlang.</li></ol><p>Yangilangan fayllarni o‘rnatgach, Extensions sahifasidagi Reload tugmasini bosing.</p><p><a href="downloads/pro-alifbo-chrome-v0.1.3.zip" download>ZIP paketini yuklab olish ↓</a></p>`,
  privacy: `<h2 id="dialog-title">Matningiz haqida</h2><p>Konvertatsiya shu sahifada, brauzeringiz ichida bajariladi. Kiritilgan matn tashqi konvertatsiya API’siga yuborilmaydi va bizning dasturimiz uni bazaga yozmaydi.</p><p>Faqat tanlagan natija alifbosi brauzer xotirasida saqlanadi. Sahifani qayta ochganda matn maydoni bo‘sh bo‘ladi.</p><p>“Nusxa olish” tugmasini bosganingizda natija qurilmangiz clipboardiga ko‘chiriladi. Telegram havolasi orqali esa Telegram xizmatiga o‘tasiz.</p>`
};
const dialog = document.querySelector('#article-dialog');
const content = document.querySelector('#dialog-content');
function openArticle(id) {
  if (!Object.hasOwn(articles, id)) return;
  content.innerHTML = articles[id];
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  content.querySelector('.try-example')?.addEventListener('click', () => { dialog.close(); useSample(); });
  content.querySelector('.try-install')?.addEventListener('click', () => openArticle('install'));
}
document.querySelectorAll('[data-article]').forEach(button => button.addEventListener('click', () => openArticle(button.dataset.article)));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', selected); });
  document.querySelectorAll('.article-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
render();
