import {convert} from './lib/new-alphabet.js';
const ns={
  word:'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  drawing:'http://schemas.openxmlformats.org/drawingml/2006/main',
  sheet:'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  odf:'urn:oasis:names:tc:opendocument:xmlns:text:1.0'
};
export function convertFile(bytes,ext,target){
  const text=raw=>new TextDecoder('utf-8',{fatal:true}).decode(raw);
  if(ext==='txt')return new TextEncoder().encode(convert(text(bytes),target));
  let size=0;
  const parts=fflate.unzipSync(bytes,{filter:entry=>{
    size+=entry.originalSize;
    if(size>150*1024*1024)throw Error('Ochilgan hujjat hajmi 150 MB dan katta.');
    return true;
  }});
  if(!parts['[Content_Types].xml']&&!parts.mimetype)throw Error('Hujjat formati tanilmadi.');
  for(const [name,data] of Object.entries(parts)){
    if(!/^(word\/|ppt\/|xl\/|content\.xml$|styles\.xml$)/.test(name)||!name.endsWith('.xml'))continue;
    const xml=new DOMParser().parseFromString(text(data),'application/xml');
    if(xml.getElementsByTagName('parsererror').length)throw Error('Hujjat XML matnini o‘qib bo‘lmadi.');
    let dirty=false;
    function replace(node){const before=node.textContent,after=convert(before,target);if(after!==before){node.textContent=after;dirty=true;}}
    for(const type of ['word','drawing','sheet']){
      for(const node of xml.getElementsByTagNameNS(ns[type],'t')){
        if(type==='sheet' && node.parentElement?.localName==='rPh')continue;
        replace(node);
      }
    }
    // Plain string cells may store text in v; never change cached formula values.
    for(const cell of xml.getElementsByTagNameNS(ns.sheet,'c')){
      if(cell.getAttribute('t')==='str'&&!cell.getElementsByTagNameNS(ns.sheet,'f').length){
        const v=cell.getElementsByTagNameNS(ns.sheet,'v')[0];if(v)replace(v);
      }
    }
    for(const tag of ['p','h']){
      for(const p of xml.getElementsByTagNameNS(ns.odf,tag)){
        const walker=xml.createTreeWalker(p,NodeFilter.SHOW_TEXT);let node;
        while((node=walker.nextNode()))replace(node);
      }
    }
    if(dirty)parts[name]=fflate.strToU8(new XMLSerializer().serializeToString(xml));
  }
  if(parts.mimetype)parts.mimetype=[parts.mimetype,{level:0}];
  return fflate.zipSync(parts,{level:5});
}
