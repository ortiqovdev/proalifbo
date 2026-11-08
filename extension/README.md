# Pro Alifbo — Chrome kengaytmasi

Oq-yashil popup: matn yozing, natija alifbosini tanlang, natijani nusxalang. Kiruvchi matn lotin, kirill, yangi alifbo yoki ularning aralashmasi bo‘lishi mumkin. Natija avtomatik yangilanadi. Dastlab yangi alifbo tanlangan; keyingi tanlovlar saqlanadi.

Natija matni Times New Roman shriftida ko‘rinadi. Pro Alifbo sarlavhasi yengil kirish animatsiyasi bilan ochiladi; qurilmaning animatsiyalarni kamaytirish sozlamasi hurmat qilinadi. Nusxalash natijani oddiy matn ko‘rinishida beradi — shrift clipboardga qo‘shilmaydi.

## O‘rnatish

1. Loyiha papkasida `npm run extension:build` bajaring. Tarqatma ZIP ichida tayyor fayllar bor.
2. Chrome manzil satrida `chrome://extensions` ni oching.
3. **Developer mode** ni yoqing.
4. **Load unpacked** ni bosib `D:\coding\alifbopro\extension` papkasini tanlang (ZIP bo‘lsa, avval alohida papkaga oching).
5. Kengaytmalar menyusidan Pro Alifbo’ni panelga mahkamlang.

`assets/logo.png` — tanlangan yashil belgi asosida tayyorlangan yozuvsiz, fonsiz PNG logo. Asl manba: `assets/brand/pro-alifbo-mark-transparent.png`. Chrome uni kerakli ikonka o‘lchamiga moslashtiradi. Tepa qism ixcham, uzun matn maydonlarida ingichka yashil scrollbar bor. Tashqi shriftlar, API yoki xizmatlar yuklanmaydi. Matn qurilmada qayta ishlanadi va saqlanmaydi; faqat natija alifbosi `chrome.storage.local`da saqlanadi. `clipboardWrite` ruxsati nusxa olish tugmasi uchun kerak. Sahifalarni o‘qish ruxsati so‘ralmaydi.

`lib/` fayllari `shared/` modulidan build vaqtida nusxalanadi. Qoidalar o‘zgarsa buildni qayta bajaring va Chrome Extensions sahifasida Reload bosing.

Bu mahalliy o‘rnatiladigan dastlabki versiya; Chrome Web Store’da nashr qilinmagan.

## Dasturchi tekshiruvi

`npm ci`, `npx playwright install chromium --no-shell`, `npm run extension:build`, so‘ng `npm run extension:test`. Sinov kengaytmani alohida Chromium profiliga haqiqiy o‘rnatib, konvertatsiya, clipboard, tanlov saqlanishi va popup o‘lchamlarini tekshiradi. Ko‘rinish `artifacts/extension-preview.png`ga saqlanadi.
