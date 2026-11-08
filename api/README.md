# Pro Alifbo API

Mahalliy ishga tushirish: `npm run api`. Manzil: `http://127.0.0.1:3001`.
Bu server bot bilan bir xil `shared/` modulidan foydalanadi; tashqi transliteratsiya API ishlatilmaydi.

## POST /v1/transliterate

`Content-Type: application/json`

```json
{ "text": "Шаҳар, чой, ғалаба, Ўзбекистон", "target": "new" }
```

```json
{
  "text": "Şahar, çoy, ğalaba, Özbekiston",
  "detectedScript": "cyrillic",
  "target": "new"
}
```

`target` qiymatlari:
- `cyrillic` — kirill (`kirill` ham qabul qilinadi).
- `latin` — o‘zbek lotin (`uzbek` ham qabul qilinadi).
- `new` — Ş, Ç, Ğ, Ö harfli yangi alifbo; odatiy qiymat.

Uchala yozuvdan ham matn qabul qilinadi, kiruvchi yozuv avtomatik aniqlanadi. Aralash matn ham o‘giriladi. `detectedScript`: `cyrillic`, `latin`, `new`, `mixed`, `unknown`. Faqat umumiy lotin harflari bo‘lsa eski va yangi alifboni aniq ajratib bo‘lmaydi, shuning uchun `latin` qaytadi. Noaniqliklar tahlili va `flags` maydoni hali mavjud emas.

Limit: 12 000 UTF-16 belgi; JSON tanasi 64 KiB gacha. 400 — noto‘g‘ri parametr/JSON, 413 — katta matn, 415 — noto‘g‘ri content-type. Xatolar `{ "error": "..." }` shaklida.

`GET /health` server holatini beradi. Brauzer POST so‘rovlari uchun CORS mavjud. API standart holatda faqat shu kompyuterda ochiq, internetga joylanmagan. `API_PORT` va `API_HOST` orqali manzil sozlanadi.

```javascript
const response = await fetch('http://127.0.0.1:3001/v1/transliterate', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ text: 'Şahar', target: 'cyrillic' })
});
const result = await response.json(); // text: "Шаҳар"
```
