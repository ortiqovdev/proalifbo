const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {execFile}=require('node:child_process');
const run=require('node:util').promisify(execFile);
const legacy={doc:'docx',dot:'docx',rtf:'docx',xls:'xlsx',xlt:'xlsx',xlsb:'xlsx',ppt:'pptx',pps:'pptx',pot:'pptx'};
const formats='docx docm dotx dotm xlsx xlsm xltx xltm pptx pptm ppsx ppsm potx potm odt ods odp ott ots otp txt'.split(' ');
async function readFile(file){
  if((await fs.stat(file)).size>50*1024*1024)throw Error('50 MB gacha fayl tanlang.');
  const ext=path.extname(file).slice(1).toLowerCase();
  if(formats.includes(ext))return {bytes:await fs.readFile(file),ext};
  if(!legacy[ext])throw Error('Bu format qo‘llanmaydi.');
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'pro-alifbo-'));
  try{
    const bin=process.platform==='win32'?path.join(process.env.ProgramFiles,'LibreOffice','program','soffice.exe'):process.platform==='darwin'?'/Applications/LibreOffice.app/Contents/MacOS/soffice':'/usr/bin/libreoffice';
    try{await fs.access(bin);}catch{throw Error('Bu eski format uchun LibreOffice o‘rnating yoki faylni Office’da zamonaviy formatda saqlang.');}
    await run(bin,['-env:UserInstallation='+require('node:url').pathToFileURL(path.join(temp,'profile')).href,'--headless','--convert-to',legacy[ext],'--outdir',temp,file],{windowsHide:true,timeout:90000});
    return {ext:legacy[ext],bytes:await fs.readFile(path.join(temp,path.parse(file).name+'.'+legacy[ext]))};
  }finally{await fs.rm(temp,{recursive:true,force:true});}
}
module.exports={readFile,formats:[...formats,...Object.keys(legacy)]};

