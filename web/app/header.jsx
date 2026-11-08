export default function Header() {return (  <header className="site-header">
    <div className="container nav-wrap">
      <a className="brand" href="/" aria-label="Pro Alifbo bosh sahifa"><img src="/assets/logo.png" width="44" height="44" alt="" /><span>Pro Alifbo<span className="brand-dot">.</span></span></a>
      <nav aria-label="Asosiy navigatsiya"><a href="/">Konvertor</a><a href="/#maqolalar">Maqolalar</a><a href="/fayllar">Fayllar</a><a href="/dasturlar">Dasturlarimiz</a></nav>
      <a className="nav-telegram" href="https://t.me/proalifbobot" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> Telegram bot</a>
    </div>
  </header>);}
