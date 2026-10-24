const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('emberDesktop',{
  portable:()=>ipcRenderer.invoke('upd-info').then(i=>!!i.portable),
  update:(url,name)=>ipcRenderer.invoke('upd-run',url,name),
  onProgress:cb=>{ipcRenderer.removeAllListeners('upd-progress');ipcRenderer.on('upd-progress',(e,p)=>cb(p))}
});
