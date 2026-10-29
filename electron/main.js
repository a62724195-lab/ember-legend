const {app,BrowserWindow,Menu,ipcMain,net,shell}=require('electron');const path=require('path'),fs=require('fs');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const REL='https://github.com/a62724195-lab/ember-legend/releases/download/';
function make(){const w=new BrowserWindow({width:1280,height:720,minWidth:640,minHeight:360,backgroundColor:'#0a0605',autoHideMenuBar:true,title:'أسطورة الجمر',icon:path.join(__dirname,'..','build','icon.png'),webPreferences:{contextIsolation:true,backgroundThrottling:false,preload:path.join(__dirname,'preload.js')}});
  Menu.setApplicationMenu(null);w.loadFile(path.join(__dirname,'..','www','index.html'));
  w.webContents.on('before-input-event',(e,i)=>{if(i.type==='keyDown'&&i.key==='F11'){w.setFullScreen(!w.isFullScreen());e.preventDefault()}});
  w.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\/(www\.youtube\.com|github\.com)\//.test(url))shell.openExternal(url);return{action:'deny'}})}
ipcMain.handle('upd-info',()=>({portable:!!process.env.PORTABLE_EXECUTABLE_FILE}));
const {pipeline}=require('stream/promises'),{Readable,Transform}=require('stream');
const logU=m=>{try{fs.appendFileSync(path.join(app.getPath('userData'),'update.log'),new Date().toISOString()+' '+m+'\n')}catch(_){}};
const stepErr=(step,e)=>{const c=e&&(e.code||e.cause&&e.cause.code);return new Error(step+(c?' ('+c+')':e&&e.message?' ('+String(e.message).slice(0,60)+')':''))};
/* ينزّل إلى ملف مؤقت (.part) باسم فريد ثم يعيد التسمية: يتفادى ملف قديم مقفول (مثلاً مثبّت سابق شغّال أو يفحصه مضاد الفيروسات) */
async function dl(url,final,onP){
  const part=final+'.'+process.pid+'.part';let res;
  try{res=await net.fetch(url,{redirect:'follow'})}catch(e){throw stepErr('تعذّر الاتصال',e)}
  if(!res.ok||!res.body)throw new Error('الخادم رد برمز '+res.status);
  const total=+res.headers.get('content-length')||0;let got=0;
  const meter=new Transform({transform(c,_,cb){got+=c.length;try{onP(total?got/total:0)}catch(_){}cb(null,c)}});
  try{await pipeline(Readable.fromWeb(res.body),meter,fs.createWriteStream(part))}catch(e){try{fs.unlinkSync(part)}catch(_){}throw stepErr('انقطع التنزيل',e)}
  if(total&&got!==total){try{fs.unlinkSync(part)}catch(_){}throw new Error('الملف ناقص ('+got+'/'+total+')')}
  try{try{fs.unlinkSync(final)}catch(_){}fs.renameSync(part,final);return final}
  catch(e){const alt=final.replace(/(\.exe)?$/i,'-'+Date.now()+'$1');try{fs.renameSync(part,alt);return alt}catch(e2){throw stepErr('تعذّر حفظ الملف',e2)}}}
ipcMain.handle('upd-run',async(e,url,name)=>{
  if(typeof url!=='string'||!url.startsWith(REL))throw new Error('رابط غير مسموح');
  const final=path.join(app.getPath('downloads'),path.basename(String(name)));let file,last;
  for(let t=1;t<=3;t++){try{logU('try '+t+' '+url);file=await dl(url,final,p=>{try{e.sender.send('upd-progress',p)}catch(_){}});break}catch(err){last=err;logU('fail '+t+' '+err.message);if(/رمز 4\d\d/.test(err.message))break;await new Promise(r=>setTimeout(r,1500*t))}}
  if(!file)throw last;
  const err=await shell.openPath(file);if(err){logU('open fail '+err);throw new Error('تعذّر فتح المثبّت: '+err.slice(0,50)+' · الملف في مجلد التنزيلات')}
  logU('ok '+file);setTimeout(()=>app.quit(),1200);return true});
app.whenReady().then(make);app.on('window-all-closed',()=>app.quit());
