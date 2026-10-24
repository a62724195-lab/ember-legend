const {app,BrowserWindow,Menu,globalShortcut}=require('electron');const path=require('path');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
function make(){const w=new BrowserWindow({width:1280,height:720,minWidth:640,minHeight:360,backgroundColor:'#0a0605',autoHideMenuBar:true,title:'أسطورة الجمر',icon:path.join(__dirname,'..','build','icon.png'),webPreferences:{contextIsolation:true,backgroundThrottling:false}});
  Menu.setApplicationMenu(null);w.loadFile(path.join(__dirname,'..','www','index.html'));
  w.webContents.on('before-input-event',(e,i)=>{if(i.type==='keyDown'&&i.key==='F11'){w.setFullScreen(!w.isFullScreen());e.preventDefault()}});
  w.webContents.setWindowOpenHandler(()=>({action:'deny'}))}
app.whenReady().then(make);app.on('window-all-closed',()=>app.quit());
