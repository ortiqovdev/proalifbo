import { toNewAlphabet } from '../../shared/new-alphabet.js';

const latin = {
  settings: '⚙️ Sozlamalar', help: 'ℹ️ Yordam', share: '↗️ Ulashish',
  ui: 'Bot interfeysi', target: 'Natija alifbosi',
  latin: 'Lotin', kirill: 'Kirill', new: 'Yangi alifbo',
  settingsHint: '💬 Bot tili — menyu va xabarlar yozuvi.\n🔄 Natija — yuborgan matningiz o‘giriladigan alifbo.\n\nQuyidagi tugmalardan tanlang:',
  ready: 'Tayyor! Matningizni yuboring 🌿', saved: 'Tanlov saqlandi.',
  helpText: 'Lotin, kirill yoki yangi alifboda matn yuboring. Men uni tanlagan natija alifbosiga o‘giraman.\n\nSozlamalarda bot interfeysi va natija alifbosini alohida tanlang.\n\nNatija ostidagi “Ulashish” orqali matnni boshqa chatga yuborishingiz mumkin.\n\nYangi alifbo: Sh → Ş, Ch → Ç, G‘ → Ğ, O‘ → Ö.',
  unknown: 'Buyruq topilmadi. Pastdagi Yordam tugmasini bosing.',
  empty: 'Iltimos, o‘girish uchun matn yuboring.',
  long: 'Iltimos, matnni 12 000 belgidan kichik bo‘laklarda yuboring.',
  media: 'Iltimos, matningizni yozib yuboring 🌿',
  expired: 'Bu tugma eskirgan. Sozlamalarni qayta oching.',
  choose: 'Avval bot tilini tanlang.',
  productsTitle: '🌿 Pro Alifbo dasturlari', planned: 'Tayyorlanmoqda',
  mobile: 'Mobil ilova', desktop: 'Desktop dastur', website: 'Web sayt', extension: 'kengaytmasi',
};
const kirill = {
  settings: '⚙️ Созламалар', help: 'ℹ️ Ёрдам', share: '↗️ Улашиш',
  ui: 'Бот интерфейси', target: 'Натижа алифбоси',
  latin: 'Лотин', kirill: 'Кирилл', new: 'Янги алифбо',
  settingsHint: '💬 Бот тили — меню ва хабарлар ёзуви.\n🔄 Натижа — юборган матнингиз ўгириладиган алифбо.\n\nҚуйидаги тугмалардан танланг:',
  ready: 'Тайёр! Матнингизни юборинг 🌿', saved: 'Танлов сақланди.',
  helpText: 'Лотин, кирилл ёки янги алифбода матн юборинг. Мен уни танлаган натижа алифбосига ўгираман.\n\nСозламаларда бот интерфейси ва натижа алифбосини алоҳида танланг.\n\nНатижа остидаги “Улашиш” орқали матнни бошқа чатга юборишингиз мумкин.\n\nЯнги алифбо: Ш → Ş, Ч → Ç, Ғ → Ğ, Ў → Ö.',
  unknown: 'Буйруқ топилмади. Пастдаги Ёрдам тугмасини босинг.',
  empty: 'Илтимос, ўгириш учун матн юборинг.',
  long: 'Илтимос, матнни 12 000 белгидан кичик бўлакларда юборинг.',
  media: 'Илтимос, матнингизни ёзиб юборинг 🌿',
  expired: 'Бу тугма эскирган. Созламаларни қайта очинг.',
  choose: 'Аввал бот тилини танланг.',
  productsTitle: '🌿 Pro Alifbo дастурлари', planned: 'Тайёрланмоқда',
  mobile: 'Мобил илова', desktop: 'Десктоп дастур', website: 'Веб сайт', extension: 'кенгайтмаси',
};

export function tr(ui, key) {
  let value = ui === 'kirill' ? kirill[key] : ui === 'new' ? toNewAlphabet(latin[key]) : latin[key];
  if (ui === 'new' && key === 'helpText') {
    const [explanation] = latin[key].split('Yangi alifbo:');
    value = `${toNewAlphabet(explanation)}Yangi alifbo: Sh → Ş, Ch → Ç, G‘ → Ğ, O‘ → Ö.`;
  }
  if (key === 'helpText') value += `\n\n${tr(ui, 'productsTitle')}\n${tr(ui, 'planned')}:\n\n📱 ${tr(ui, 'mobile')} — iOS, Android\n💻 ${tr(ui, 'desktop')} — Windows, macOS, Linux\n🌐 ${tr(ui, 'website')}\n🧩 Chrome ${tr(ui, 'extension')}`;
  return value;
}

export function isMenu(text, key) {
  return ['latin', 'kirill', 'new'].some(ui => tr(ui, key) === text);
}
