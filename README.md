# Pro Alifbo

O‘zbek lotin, kirill va yangi alifbo orasida matn konvertatsiyasi. Yangi alifbo foydalanuvchi tasdiqlagan to‘rt o‘zgarishdan iborat: Sh/sh → Ş/ş, Ch/ch → Ç/ç, G‘/g‘ → Ğ/ğ, O‘/o‘ → Ö/ö. Bu tarjima emas, yozuvni almashtirishdir.

## Tuzilma

- `bot/` — Telegram bot, birinchi bosqich.
- `api/` — uch yozuvli mahalliy HTTP API; `npm run api`, batafsil `api/README.md`.
- `extension/` — Chrome kengaytmasi; `npm run extension:build`, o‘rnatish uchun `extension/README.md`.
- `web/` — web dastur uchun joy.
- `mobile/` — iOS va Android uchun joy.
- `desktop/` — desktop dastur uchun joy.
- `shared/` — barcha ilovalar ishlatadigan konvertatsiya qoidalari.
- `assets/brand/` — logo variantlari.

Tanlangan logo konsepti: `assets/brand/pro-alifbo-minimal-green-3.png`.

## Botni ishga tushirish

Node.js 20 yoki yangiroq versiya kerak. Telegramdagi [@BotFather](https://t.me/BotFather) orqali bot oching va token oling. Tokenni hech kimga yubormang.

PowerShell:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
# .env faylida TELEGRAM_BOT_TOKEN qiymatini o‘zgartiring
node --env-file=.env bot/src/index.js
```

Sinov: `npm test`. Bot `/start`, `/help`, `/settings`, `/new`, `/latin`, `/kirill` buyruqlarini qabul qiladi. `/auto` eski buyruq uchun saqlangan va yangi alifbo rejimini yoqadi. Odatiy natija — yangi alifbo. Kirill va lotin aralash matnlar ham qabul qilinadi.

`/start` til tanlamagan foydalanuvchiga ismi bilan salomlashuv va Lotin / Кирилл tanlovini chiqaradi. Til bir marta tanlangach, keyingi `/start` buyruqlari saqlangan interfeys yozuvida “Tayyor! Matningizni yuboring 🌿” xabarini chiqaradi; bot qayta ishga tushganda ham til qayta so‘ralmaydi. Doimiy oddiy klaviaturada Sozlamalar va Yordam tugmalari ko‘rinadi. Sozlamalarda ikkita mustaqil tanlov bor: 💬 bot interfeysi va 🔄 natija alifbosi. Ikkalasida ham lotin, kirill va yangi alifbo mavjud. Interfeys o‘zgarsa, menyu va xabarlar ham shu yozuvga o‘tadi. Kiruvchi yozuv avtomatik qayta ishlanadi.

Tanlovlar `.data/preferences.json` faylida `{ ui, target }` shaklida saqlanadi. Eski formatdagi natija tanlovlari ham o‘qiladi. Kiruvchi matnlar diskka yozilmaydi. 12 000 belgigacha matnlar qabul qilinadi; uzun javoblar Telegram limitiga mos bo‘linadi. Bot shaxsiy chatlarda ishlaydi. Salomlashuv START bosilganda keladi.

Natija kod blokida chiqadi va ostida faqat “↗️ Ulashish” inline tugmasi bor. Nusxa olish va yozuvni almashtirish inline tugmalari olib tashlangan. Ulashish chat tanlash oynasini ochadi; matn oxiriga faqat `@proalifbobot` qo‘shiladi, alohida bot URL havolasi qo‘shilmaydi. Telegram Desktop bo‘sh `url` parametrini rad etgani sababli to‘liq matn va imzo shu parametrga kodlanadi. `@` bilan boshlanuvchi matnda inline so‘rovni ishga tushirmaslik uchun ko‘rinmas U+2060 belgi qo‘shiladi. Yuborishdan oldin foydalanuvchi matnni tahrirlashi mumkin. Eski yuborilgan xabarlarning tugmalari tarixda qolishi mumkin; yangi tugma uchun matnni qayta yuboring.
