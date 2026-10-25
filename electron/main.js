const {app,BrowserWindow,Menu,ipcMain,net,shell}=require('electron');const path=require('path'),fs=require('fs');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const REL='https://github.com/a62724195-lab/ember-legend/releases/download/';
function make(){const w=new BrowserWindow({width:1280,height:720,minWidth:640,minHeight:360,backgroundColor:'#0a0605',autoHideMenuBar:true,title:'أسطورة الجمر',icon:path.join(__dirname,'..','build','icon.png'),webPreferences:{contextIsolation:true,backgroundThrottling:false,preload:path.join(__dirname,'preload.js')}});
  Menu.setApplicationMenu(null);w.loadFile(path.join(__dirname,'..','www','index.html'));
  w.webContents.on('before-input-event',(e,i)=>{if(i.type==='keyDown'&&i.key==='F11'){w.setFullScreen(!w.isFullScreen());e.preventDefault()}});
  w.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\/(www\.youtube\.com|github\.com)\//.test(url))shell.openExternal(url);return{action:'deny'}})}
ipcMain.handle('upd-info',()=>({portable:!!process.env.PORTABLE_EXECUTABLE_FILE}));
ipcMain.handle('upd-run',async(e,url,name)=>{
  if(typeof url!=='string'||!url.startsWith(REL))throw new Error('bad url');
  const file=path.join(app.getPath('downloads'),path.basename(String(name)));
  const res=await net.fetch(url,{redirect:'follow'});if(!res.ok)throw new Error('الخادم رد برمز '+res.status);
  const total=+res.headers.get('content-length')||0;let got=0;const ws=fs.createWriteStream(file),rd=res.body.getReader();let werr=null;ws.on('error',e=>{werr=e});
  for(;;){const {done,value}=await rd.read();if(done||werr)break;ws.write(Buffer.from(value));got+=value.length;try{e.sender.send('upd-progress',total?got/total:0)}catch(_){}}
  await new Promise(r=>ws.end(r));if(werr)throw new Error('تعذّر حفظ الملف ('+(werr.code||'خطأ')+')');
  const err=await shell.openPath(file);if(err)throw new Error('تعذّر فتح المثبّت: '+err);
  setTimeout(()=>app.quit(),1200);return true});
app.whenReady().then(make);app.on('window-all-closed',()=>app.quit());
