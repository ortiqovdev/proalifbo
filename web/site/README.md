# Pro Alifbo web

Statik sayt `dist/` ichida. Bosh sahifa, mahalliy konvertor, o‘qiladigan uchta maqola, dasturlar bo‘limi va Chrome ZIP tarqatmasi mavjud. Rasmlar AI yordamida ushbu loyiha uchun yaratilgan. Maqolalar tahririy boshlang‘ich materiallar; rasmiy alifbo islohoti yoki qonunlar haqida da’vo qilinmaydi.

`dist/lib/` umumiy `shared/` modulidan nusxalangan. Asosiy loyihadan `npm run web:sync` bajarib modul, logo va kengaytma tarqatmasini yangilang. `npm run web` — mahalliy preview. `npm run web:test` — desktop/mobil brauzer tekshiruvi.

Tashqi transliteratsiya API yo‘q. Faqat natija alifbosi localStorage’da saqlanadi. Yozilgan matn saqlanmaydi. Telegram bot va Chrome ZIP ishlaydi; mobil va desktop versiyalari hali tayyorlanmoqda.
