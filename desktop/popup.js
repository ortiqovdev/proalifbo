const auto=document.querySelector('#auto');
window.alifbo.getAuto().then(value=>auto.checked=value);
window.alifbo.onAuto(value=>auto.checked=value);
auto.onchange=()=>window.alifbo.setAuto(auto.checked);
document.querySelector('#open').onclick=()=>window.alifbo.action('open');
document.querySelector('#quit').onclick=()=>window.alifbo.action('quit');
document.onkeydown=e=>{if(e.key==='Escape')window.alifbo.action('hide')};
