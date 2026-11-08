const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const marker='# Managed by Pro Alifbo desktop';
let activeFile;
function disable(){
  if(activeFile && fs.existsSync(activeFile) && fs.readFileSync(activeFile,'utf8').startsWith(marker))fs.unlinkSync(activeFile);
  activeFile=null;
}
function enable(){
  const mac=process.platform==='darwin';
  const bins=mac?['/Applications/Espanso.app/Contents/MacOS/espanso','/opt/homebrew/bin/espanso','/usr/local/bin/espanso','espanso']:['espanso'];
  let config;
  for(const bin of bins){
    try{
      const run=args=>execFileSync(bin,args,{encoding:'utf8',timeout:3500,stdio:['ignore','pipe','pipe']}).trim();
      const dir=run(['path','config']);
      if(!path.isAbsolute(dir)||!fs.existsSync(dir))continue;
      if(!/is running/i.test(run(['status'])))run(['start']);
      config=dir;break;
    }catch{}
  }
  if(!config)throw Error('Avtoyozuv uchun Espanso dasturini o‘rnating va ishga tushiring.');
  if(!fs.existsSync('/usr/bin/perl'))throw Error('Avtoyozuv uchun Perl o‘rnatilishi kerak.');
  const file=path.join(config,'match','pro-alifbo-desktop.yml');
  if(fs.existsSync(file)&&!fs.readFileSync(file,'utf8').startsWith(marker))throw Error('Espanso sozlamasida shu nomli boshqa qoida bor.');
  const pattern="(?P<word>[A-Za-z’ʻ‘ʼ`']*(?i:sh|ch|[go][’ʻ‘ʼ`'])[A-Za-z’ʻ‘ʼ`']*) ";
  const script=path.join(__dirname,'expand.pl');
  const rule=[marker,'matches:','  - regex: '+JSON.stringify(pattern),'    replace: "{{converted}} "','    vars:','      - name: converted','        type: script','        params:','          args: '+JSON.stringify(['/usr/bin/perl',script])].join('\n')+'\n';
  fs.writeFileSync(file,rule,{mode:0o600});activeFile=file;
}
module.exports={enable,disable};
