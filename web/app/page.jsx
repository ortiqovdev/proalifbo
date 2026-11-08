import Script from 'next/script';
export default function Home() {
  return (<>
  <a className="skip" href="#source">Konvertorga o‘tish</a>

  <main>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="eyebrow"><span className="dot"></span> O‘ZBEKCHA YOZISH, YANADA OSON</div>
      <h1 id="hero-title">So‘zlaringiz -<br /><em>siz tanlagan alifboda.</em></h1>
      <p>Lotin, kirill va yangi alifbo o‘rtasida erkin o‘ting.<br />Matningizni kiriting, kerakli yozuvni tanlang — qolganini bizga qo‘ying.</p>
      <div className="hero-note"><span aria-hidden="true">✓</span> Bepul <span className="note-separator">·</span> Ro‘yxatdan o‘tishsiz <span className="note-separator">·</span> Qurilmangizda ishlaydi</div>
    </section>

    <section id="konvertor" className="container converter-section" aria-labelledby="converter-title">
      <div className="section-small-head"><h2 id="converter-title">Matn konvertori</h2><button className="text-button" id="sample">Namuna bilan sinab ko‘rish <span aria-hidden="true">↗</span></button></div>
      <div className="converter-grid">
        <div className="editor input-editor">
          <div className="editor-head"><label htmlFor="source">Matningiz</label><span className="badge"><span className="dot"></span> Avtomatik</span></div>
          <textarea id="source" maxLength="12000" spellCheck={false} placeholder="Matningizni shu yerga yozing yoki joylang…" aria-describedby="input-hint source-count"></textarea>
          <div className="editor-foot"><span id="input-hint">Lotin · Кирилл · Yangi alifbo</span><div><span id="source-count">0 / 12 000</span><button id="clear" className="icon-button" type="button" aria-label="Matnni tozalash" title="Tozalash" disabled>×</button></div></div>
        </div>
        <span className="bridge-arrow" aria-hidden="true">→</span>
        <div className="editor result-editor">
          <div className="editor-head"><label htmlFor="result">Natija</label><fieldset className="target-options"><legend className="sr-only">Natija alifbosi</legend><label><input type="radio" name="target" value="latin" /><span>Lotin</span></label><label><input type="radio" name="target" value="kirill" /><span>Кирилл</span></label><label><input type="radio" name="target" value="new" defaultChecked /><span>Yangi alifbo</span></label></fieldset></div>
          <textarea id="result" readOnly spellCheck={false} placeholder="O‘girilgan matn shu yerda paydo bo‘ladi…" aria-label="O‘girilgan natija"></textarea>
          <div className="editor-foot"><span id="result-count">0 belgi</span><button className="copy-button" id="copy" disabled><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><span id="copy-label">Nusxa olish</span></button></div>
        </div>
      </div>
      <div className="converter-caption"><span>Sh → Ş <i>·</i> Ch → Ç <i>·</i> G‘ → Ğ <i>·</i> O‘ → Ö</span><span id="feedback" role="status" aria-live="polite">Matn avtomatik o‘giriladi.</span></div>
    </section>

    <section className="intro-strip container" aria-label="Pro Alifbo haqida">
      <div className="intro-label"><span className="small-mark">A<span>↔</span>А</span><p>Yozuv o‘zgaradi.<br /><strong>Ma’no sizniki bo‘lib qoladi.</strong></p></div>
      <p>Pro Alifbo — o‘zbekcha matn bilan ishlash uchun qulay yordamchi. Kundalik xabar, dars yoki ish hujjatini o‘zingizga kerakli alifboda tayyorlang.</p>
      <a href="/dasturlar">Bizni yaqinroq biling <span aria-hidden="true">↗</span></a>
    </section>

    <section className="articles-section" id="maqolalar" aria-labelledby="articles-title">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">O‘QING. O‘RGANING. YOZING.</span><h2 id="articles-title">Til va yozuv olamidan</h2></div><p>Alifbo haqida sodda tushuntirishlar,<br />foydali tavsiyalar va bizdan yangiliklar.</p></div>
        <div className="article-filters" role="group" aria-label="Maqola turini tanlash"><button data-filter="all" className="selected" aria-pressed="true">Barchasi</button><button data-filter="guide" aria-pressed="false">Qo‘llanmalar</button><button data-filter="alphabet" aria-pressed="false">Alifbo</button><button data-filter="news" aria-pressed="false">Yangiliklar</button></div>
        <div className="articles-grid">
          <article className="article-card" data-category="guide"><button className="article-open" data-article="writing"><div className="article-image"><img src="assets/article-writing.png" alt="Yashil stol ustida ochiq kitob, qalam va zaytun novdasi" loading="lazy" width="1536" height="1024" /><span>QO‘LLANMA</span></div><div className="article-meta">Pro Alifbo tahririyati <span>· 2 daqiqa</span></div><h3>Kirilldan lotinga: nimaga e’tibor berish kerak?</h3><p>Harflar almashganda bosh harflar, tutuq belgilari va matn ma’nosini saqlash haqida.</p><span className="read-more">Maqolani o‘qish <span aria-hidden="true">↗</span></span></button></article>
          <article className="article-card" data-category="alphabet"><button className="article-open" data-article="alphabet"><div className="article-image"><img src="assets/article-alphabet.png" alt="Yashil Ş, Ç, Ğ va Ö harflari" loading="lazy" width="1536" height="1024" /><span>ALIFBO</span></div><div className="article-meta">Pro Alifbo tahririyati <span>· 2 daqiqa</span></div><h3>Ş, Ç, Ğ, Ö: to‘rtta belgi bilan tanishamiz</h3><p>Pro Alifbodagi yangi yozuv rejimi qanday ishlaydi? Oddiy misollar bilan tanishing.</p><span className="read-more">Maqolani o‘qish <span aria-hidden="true">↗</span></span></button></article>
          <article className="article-card" data-category="news"><button className="article-open" data-article="extension"><div className="article-image"><img src="assets/article-extension.png" alt="Yashil daftar yonida oq klaviatura" loading="lazy" width="1536" height="1024" /><span>YANGILIK</span></div><div className="article-meta">Mahsulot yangiligi <span>· 1 daqiqa</span></div><h3>Pro Alifbo endi brauzeringiz yonida</h3><p>Chrome kengaytmasining dastlabki versiyasi: uchta yozuv va birgina kichik oyna.</p><span className="read-more">Batafsil tanishish <span aria-hidden="true">↗</span></span></button></article>
        </div>
      </div>
    </section>


    <section className="closing container"><span className="closing-glyphs" aria-hidden="true">Ş Ç Ğ Ö</span><div><h2>O‘zbekcha yozing. O‘zingizga qulay yozing.</h2><p>Har bir so‘z uchun kerakli alifbo — Pro Alifboda.</p></div><a href="#konvertor">Yozishni boshlash <span aria-hidden="true">↑</span></a></section>
  </main><Script src="/interactions.js" type="module" strategy="afterInteractive" />
  <footer className="container"><a className="brand" href="#"><img src="assets/logo.png" alt="" width="32" height="32" /><span>Pro Alifbo.</span></a><p>O‘zbekcha so‘zlar uchun yaratilgan.</p><button className="text-button" data-article="privacy">Maxfiylik</button><a href="https://t.me/proalifbobot" target="_blank" rel="noopener noreferrer">Telegram ↗</a></footer>
  <dialog id="article-dialog" aria-labelledby="dialog-title"><div className="dialog-top"><span className="eyebrow">PRO ALIFBO · FOYDALI BILIMLAR</span><button id="close-dialog" aria-label="Yopish">×</button></div><div id="dialog-content"></div></dialog>
</>);
}

