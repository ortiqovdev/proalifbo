export const metadata = { title: 'Dasturlar · Pro Alifbo' };

const groups = [
  ['Ish stoli', [
    ['macOS', 'Mac kompyuterlari uchun', '⌘'],
    ['Windows', 'Windows kompyuterlari uchun', '⊞'],
    ['Linux', 'Linux kompyuterlari uchun', '>_']
  ]],
  ['Mobil', [
    ['iOS', 'iPhone va iPad uchun', '▯'],
    ['Android', 'Telefon va planshetlar uchun', '▣']
  ]],
  ['Brauzer va messenjer', [
    ['Web konvertor', 'Matnni brauzerda uch yozuv orasida o‘giring.', 'Aa', '/', 'Ochish'],
    ['Telegram bot', 'Matnni @proalifbobot bilan suhbatda o‘giring.', '➤', 'https://t.me/proalifbobot', 'Botga o‘tish'],
    ['Chrome kengaytmasi', '0.1.3 versiya · Brauzer panelidagi ixcham konvertor.', '◎', '/downloads/pro-alifbo-chrome-v0.1.3.zip', 'ZIP yuklab olish']
  ]]
];

export default function Apps() {
  return <main className="catalog">
    <header className="route-title"><h1>Pro Alifbo dasturlari</h1><p>O‘zingiz ishlatadigan platformani tanlang.</p></header>
    {groups.map(([group, items]) => <section className="platform-section" key={group}>
      <h2>{group}</h2><div className="platform-grid">{items.map(([name, description, icon, href, action]) =>
        <article className="platform-card" key={name}><span aria-hidden="true" className="platform-icon">{icon}</span><div><h3>{name}</h3><p>{description}</p></div>
        {href ? <a className="green-action" href={href} download={href.endsWith('.zip') || undefined}>{action}</a> : <small>Rejada</small>}</article>)}</div>
    </section>)}
  </main>;
}
