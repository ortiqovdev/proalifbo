import { convert } from './lib/new-alphabet.js';
const el=id=>document.getElementById(id);
const source=el('source'),result=el('result'),mode=el('mode'),auto=el('auto');
mode.value=localStorage.getItem('alphabet')||'new';
function render(){result.value=convert(source.value,mode.value);el('clear').disabled=!source.value;el('copy').disabled=!result.value;el('copy').textContent='Nusxa olish';}
source.oninput=render;
mode.onchange=()=>{localStorage.setItem('alphabet',mode.value);render();};
el('clear').onclick=()=>{source.value='';render();source.focus();};
el('copy').onclick=async()=>{try{await navigator.clipboard.writeText(result.value);el('copy').textContent='Nusxalandi ✓';}catch{result.focus();result.select();}};
window.alifbo.onAuto(value=>auto.checked=value);
auto.checked=await window.alifbo.getAuto();
auto.onchange=()=>window.alifbo.setAuto(auto.checked);
render();
import {convertFile} from './office.js';
let selection;
function tab(page){
  for(const [name,id] of [['text','editor'],['file','files'],['about','about']]){
    el(id).hidden=name!==page;
    el(name+'-tab').setAttribute('aria-pressed',String(name===page));
  }
}
for(const name of ['text','file','about'])el(name+'-tab').onclick=()=>tab(name);
document.querySelector('[data-page="text"]').onclick=()=>tab('text');
el('pick').onclick=async()=>{
  try{
    el('status').classList.remove('saved');
    const next=await window.alifbo.pick();
    if(next){selection=next;el('pick-label').textContent='Boshqa fayl tanlash';el('filename').textContent=next.name;el('status').textContent='';el('save').disabled=false;}
  }catch(e){el('status').textContent=e.message;}
};
el('save').onclick=async()=>{
  const button=el('save');button.disabled=true;el('pick').disabled=true;
  try{
    const status=el('status');
    status.classList.remove('saved');
    status.textContent='Fayl tayyorlanmoqda…';
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const target=el('file-mode').value;
    const output=convertFile(selection.bytes,selection.ext,target);
    const saved=await window.alifbo.save(output,target);
    status.textContent=saved?'Tayyor! Fayl nusxasi saqlandi.':'';
    status.classList.toggle('saved',saved);
  }catch(e){el('status').textContent=e.message;}
  finally{button.disabled=false;el('pick').disabled=false;}
};


el('extension-save').onclick=async()=>{
  try{el('extension-status').textContent=await window.alifbo.saveExtension()?' Saqlandi.':'';}
  catch{el('extension-status').textContent=' Saqlab bo‘lmadi.';}
};

