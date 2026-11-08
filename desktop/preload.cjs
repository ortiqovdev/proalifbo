const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('alifbo',{
  pick:()=>ipcRenderer.invoke('file-pick'),save:(bytes,mode)=>ipcRenderer.invoke('file-save',bytes,mode),
  action:name=>ipcRenderer.send('tray-action',name),
  saveExtension:()=>ipcRenderer.invoke('extension-save'),
  getAuto:()=>ipcRenderer.invoke('get-auto'),
  setAuto:value=>ipcRenderer.send('set-auto',value),
  onAuto:fn=>ipcRenderer.on('auto-state',(_,value)=>fn(value))
});


