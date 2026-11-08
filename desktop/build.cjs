const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=__dirname;
process.chdir(root);
cp.execFileSync(path.join(process.env.WINDIR,'Microsoft.NET/Framework64/v4.0.30319/csc.exe'),['/nologo','/platform:x64','/r:System.Windows.Forms.dll','/out:AutoWrite.exe','AutoWrite.cs']);
fs.mkdirSync('lib',{recursive:true});
for(const f of ['new-alphabet.js','transliterate.js'])fs.copyFileSync('../shared/'+f,'lib/'+f);
fs.copyFileSync('../assets/brand/pro-alifbo-mark-transparent.png','logo.png');
const out=path.join(root,'dist','ProAlifbo');
fs.cpSync(path.dirname(require('electron')),out,{recursive:true,force:true});
fs.copyFileSync(path.join(root,'node_modules','fflate','umd','index.js'),'fflate.js');
const dest=path.join(out,'resources','app');
fs.mkdirSync(dest,{recursive:true});
for(const f of ['main.cjs','preload.cjs','renderer.js','office.js','files.cjs','unix-auto.cjs','expand.pl','fflate.js','popup.html','popup.js','pro-alifbo-chrome-v0.1.3.zip','index.html','style.css','logo.png','AutoWrite.exe','package.json','lib'])fs.cpSync(f,path.join(dest,f),{recursive:true});
fs.renameSync(path.join(out,'electron.exe'),path.join(out,'ProAlifbo.exe'));
console.log(path.join(out,'ProAlifbo.exe'));



