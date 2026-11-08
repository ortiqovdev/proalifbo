'use client';

import { useMemo, useRef, useState } from 'react';
import { convert } from '../../../shared/new-alphabet.js';

export default function Files() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('new');
  const [message, setMessage] = useState('');
  const request = useRef(0);
  const result = useMemo(() => file ? convert(file.text, target) : '', [file, target]);

  async function openFile(item) {
    if (!item) return;
    const id = ++request.current;
    setFile(null);
    try {
      if (!/\.txt$/i.test(item.name)) throw Error('TXT formatidagi faylni tanlang.');
      if (item.size > 1024 * 1024) throw Error('Fayl hajmi 1 MB dan oshmasligi kerak.');
      setMessage('Fayl o‘qilmoqda…');
      const text = new TextDecoder('utf-8', { fatal: true }).decode(await item.arrayBuffer());
      if (id !== request.current) return;
      if (!text.trim() || text.includes('\0')) throw Error('Faylda o‘qiladigan matn topilmadi.');
      setFile({ name: item.name, text });
      setMessage('');
    } catch (error) {
      if (id === request.current) setMessage(error instanceof TypeError ? 'Faylni UTF-8 kodlashida saqlab, yana tanlang.' : error.message);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([result], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.txt$/i, '') + '-' + target + '.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="catalog"><header className="route-title"><h1>Fayl yozuvini o‘girish</h1><p>Matnli hujjatingizni lotin, kirill yoki yangi alifboda saqlang.</p></header>
    <div className="file-panel">
      <label className="drop-area" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); openFile(e.dataTransfer.files[0]); }}>
        <span aria-hidden="true" className="platform-icon">↑</span><strong>{file?.name || 'Faylni tanlang yoki shu yerga tashlang'}</strong>
        <span>TXT · UTF-8 · 1 MB gacha</span><input aria-label="TXT faylni tanlash" type="file" accept=".txt,text/plain" onChange={e => {openFile(e.target.files[0]); e.target.value = '';}} />
      </label>
      <p role="status">{message}</p>
      <label className="file-target">Natija alifbosi <select value={target} onChange={e => setTarget(e.target.value)}><option value="latin">Lotin</option><option value="kirill">Кирилл</option><option value="new">Yangi alifbo</option></select></label>
      <textarea className="file-result" aria-label="Fayl natijasi" placeholder="Faylni tanlaganingizdan keyin natija shu yerda ko‘rinadi." value={result} readOnly />
      <button className="green-action" disabled={!file} onClick={download}>Natijani yuklab olish ↓</button>
    </div></main>;
}
