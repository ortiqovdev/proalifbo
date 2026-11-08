const {app,BrowserWindow,Menu,Tray,ipcMain,nativeImage,dialog}=require('electron');
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
let popup,selected,window,tray,helper,quitting=false;
const settings=path.join(app.getPath('userData'),'preferences.json');
let enabled=false;
function store(value){fs.mkdirSync(path.dirname(settings),{recursive:true});fs.writeFileSync(settings,JSON.stringify({auto:value}));}
function show(){window.show();window.restore();window.focus();}
function update(){
  tray.setToolTip('Pro Alifbo · Avtoyozuv '+(enabled?'yoqilgan':'o‘chirilgan'));
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Pro Alifbo’ni ochish',click:show},
    {type:'separator'},
    {label:'Avtoyozuv',type:'checkbox',checked:enabled,click:item=>toggle(item.checked)},
    {label:'Chiqish',click:()=>app.quit()}
  ]));
  window.webContents.send('auto-state',enabled);
  if(popup)popup.webContents.send('auto-state',enabled);
}
function toggle(value){
  if(process.platform!=='win32'){
    const integration=require('./unix-auto.cjs');
    try{
      if(value)integration.enable();else integration.disable();
      enabled=value;store(value);
    }catch(error){enabled=false;store(false);dialog.showErrorBox('Avtoyozuv',error.message);}
    update();return;
  }
  if(!value){const old=helper;helper=null;if(old)old.kill();enabled=false;store(false);update();return;}
  if(helper)return;
  const child=spawn(path.join(__dirname,'AutoWrite.exe'),[],{windowsHide:true,stdio:['pipe','pipe','ignore']});
  helper=child;
  child.stdout.once('data',()=>{if(helper===child){enabled=true;store(true);update();}});
  function failed(){
    if(helper!==child || quitting)return;
    helper=null;enabled=false;store(false);update();
    dialog.showErrorBox('Avtoyozuv','Klaviaturaga ulanish uzildi. Avtoyozuvni qayta yoqing.');
  }
  child.on('error',failed);child.on('exit',failed);
}
if(!app.requestSingleInstanceLock())app.quit();
else {
  app.on('second-instance',()=>{if(window)show()});
  app.whenReady().then(()=>{
    app.setAppUserModelId('uz.proalifbo.desktop');
    const icon=nativeImage.createFromPath(path.join(__dirname,'logo.png'));
    window=new BrowserWindow({title:'Pro Alifbo',width:680,height:710,minWidth:450,minHeight:540,backgroundColor:'#f0f6f2',icon,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,sandbox:true}});
    window.webContents.setWindowOpenHandler(({url})=>{
      if(['https://t.me/proalifbobot','http://127.0.0.1:3000/'].includes(url))require('electron').shell.openExternal(url);
      return {action:'deny'};
    });
    window.removeMenu();
    window.on('close',e=>{if(!quitting){e.preventDefault();window.hide();}});
    tray=new Tray(icon.resize({width:32,height:32}));tray.on('click',()=>{
      if(popup.isVisible()){popup.hide();return;}
      const screen=require('electron').screen, point=screen.getCursorScreenPoint(),area=screen.getDisplayNearestPoint(point).workArea;
      popup.setPosition(Math.max(area.x,Math.min(point.x-140,area.x+area.width-280)),Math.max(area.y,Math.min(point.y-218,area.y+area.height-218)));
      popup.show();popup.focus();
    });
    popup=new BrowserWindow({width:280,height:218,show:false,frame:false,resizable:false,skipTaskbar:true,alwaysOnTop:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true}});
    popup.loadFile(path.join(__dirname,'popup.html'));popup.on('blur',()=>popup.hide());
    ipcMain.on('tray-action',(e,action)=>{if(e.sender!==popup.webContents)return;popup.hide();if(action==='open')show();if(action==='quit')app.quit();});
    const files=require('./files.cjs');
    ipcMain.handle('file-pick',async e=>{
      if(e.sender!==window.webContents)return;
      const r=await dialog.showOpenDialog(window,{properties:['openFile'],filters:[{name:'Hujjatlar',extensions:files.formats}]});
      if(r.canceled)return null;
      const file=r.filePaths[0],data=await files.readFile(file);selected={file,ext:data.ext};
      return {...data,name:path.basename(file)};
    });
    ipcMain.handle('file-save',async(e,bytes,mode)=>{
      if(e.sender!==window.webContents||!selected||!['new','latin','kirill'].includes(mode))return false;
      const {file,ext}=selected;
      const r=await dialog.showSaveDialog(window,{defaultPath:path.join(path.dirname(file),path.parse(file).name+'-'+mode+'.'+ext),filters:[{name:ext,extensions:[ext]}]});
      if(r.canceled)return false;
      if(path.resolve(r.filePath).toLowerCase()===path.resolve(file).toLowerCase())throw Error('Nusxa uchun boshqa nom tanlang.');
      await fs.promises.writeFile(r.filePath,bytes);return true;
    });
    ipcMain.handle('extension-save',async e=>{
      if(e.sender!==window.webContents)return false;
      const zip='pro-alifbo-chrome-v0.1.3.zip';
      const target=await dialog.showSaveDialog(window,{defaultPath:zip,filters:[{name:'ZIP',extensions:['zip']}]});
      if(target.canceled)return false;
      await fs.promises.copyFile(path.join(__dirname,zip),target.filePath);
      return true;
    });
    ipcMain.handle('get-auto',()=>enabled);
    ipcMain.on('set-auto',(_,value)=>toggle(value===true));
    update();window.loadFile(path.join(__dirname,'index.html'));
    try{if(JSON.parse(fs.readFileSync(settings)).auto)toggle(true);}catch{}
  });
  app.on('before-quit',()=>{quitting=true;if(process.platform!=='win32')require('./unix-auto.cjs').disable();if(helper)helper.kill();});
}




