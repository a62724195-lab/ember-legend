/* =====================================================================
   التحديث من داخل اللعبة: يفحص آخر إصدار على GitHub ويعرض زر "حدّث الآن"
   ===================================================================== */
const APP_VERSION='1.9.0';
const UPD={repo:'a62724195-lab/ember-legend',info:null,busy:0,dismissed:0,checking:0,pct:0,err:''};
(function(){
const st=document.createElement('style');st.textContent=`
#updBn{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:60;width:min(94vw,520px);direction:rtl;background:linear-gradient(180deg,rgba(60,30,12,.97),rgba(22,11,6,.98));border:1px solid #ff9a40;border-radius:14px;padding:10px 14px;box-shadow:0 8px 30px #000c,0 0 24px #ff7a2f55;color:#f6e3c6;display:grid;gap:8px;font-family:inherit}
#updBn[hidden]{display:none}
#updBn b{color:#ffd9a0;font-size:15px}#updBn small{color:#d9b88a;font-size:12px;display:block;margin-top:2px}
#updBn .rw{display:flex;gap:8px}
#updBn button{font:inherit;cursor:pointer;flex:1;background:rgba(50,28,16,.95);border:1px solid #6a3c1c;color:#f2dcc0;border-radius:10px;padding:9px 12px;font-size:14px}
#updBn button.ok{background:linear-gradient(90deg,#ff8a3a,#ffc070);color:#2a1206;border-color:#ffd9a0;font-weight:700}
#updBn .pb{height:8px;border-radius:5px;background:#000a;overflow:hidden;display:none}#updBn .pb i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff7a2f,#ffd27a);transition:width .25s}
#updBn.bz .pb{display:block}#updBn.bz .rw{display:none}
#title .ytb,#settings .ytb{display:flex!important;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:6px;padding:10px 14px;font-size:14px;color:#e8c898;background:rgba(40,22,12,.55);border:1px solid #5a3a22;border-radius:10px;text-align:center;line-height:1.3;transform:none;animation:none}
#title .ytb:hover,#settings .ytb:hover{background:rgba(70,36,16,.75);border-color:#ff9a40;color:#ffd9a0}
#title .ytb::before,#title .ytb::after,#settings .ytb::before,#settings .ytb::after{display:none!important}
.ytb .yi{display:inline-grid;place-items:center;width:26px;height:18px;border-radius:5px;background:#e8281a;color:#fff;font-size:9px;line-height:1;padding-inline-start:1px}
#updVer{position:fixed;bottom:6px;right:10px;z-index:5;font-size:11px;color:#a69784aa;pointer-events:none}
`;document.head.appendChild(st);
const d=document.createElement('div');d.id='updBn';d.hidden=true;d.innerHTML='<div><b id="ubT"></b><small id="ubS"></small></div><div class="pb"><i id="ubP"></i></div><div class="rw"><button id="ubL" type="button">لاحقاً</button><button id="ubPg" type="button" hidden>صفحة التحميل</button><button id="ubGo" class="ok" type="button">حدّث الآن</button></div>';document.body.appendChild(d);
const v=document.createElement('div');v.id='updVer';v.textContent='v'+APP_VERSION;document.body.appendChild(v)})();
function updCmp(a,b){const x=String(a).replace(/^v/,'').split('.').map(Number),y=String(b).replace(/^v/,'').split('.').map(Number);for(let i=0;i<3;i++){const p=x[i]||0,q=y[i]||0;if(p!==q)return p>q?1:-1}return 0}
function updPlat(){if(window.emberDesktop)return'desktop';try{if(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())return'android'}catch(e){}return'web'}
async function updCheck(manual){if(UPD.checking||UPD.busy)return;UPD.checking=1;
  try{const r=await fetch('https://api.github.com/repos/'+UPD.repo+'/releases/latest',{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),tag=String(j.tag_name||'').replace(/^v/,'');
    if(tag&&updCmp(tag,APP_VERSION)>0){UPD.info={tag,html:j.html_url,assets:(j.assets||[]).map(a=>({name:a.name,url:a.browser_download_url})),notes:String(j.body||'').split('\n')[0].slice(0,90)};UPD.dismissed=0;updShow()}
    else{UPD.info=null;if(manual)toast('أنت على آخر نسخة (v'+APP_VERSION+')','#9fe39f')}}
  catch(e){if(manual)toast('ما قدرت أفحص التحديث. تأكد من الإنترنت','#ff9a8a')}
  UPD.checking=0}
function updShow(){const b=$('#updBn'),i=UPD.info;if(!i){b.hidden=true;return}$('#ubT').textContent='تحديث جديد متوفر: v'+i.tag;$('#ubS').textContent=UPD.err||('نسختك v'+APP_VERSION+(i.notes?' · '+i.notes:''));b.classList.toggle('bz',!!UPD.busy);b.hidden=!!UPD.dismissed&&!UPD.busy}
function updVisible(){const intro=document.getElementById('intro'),t=document.getElementById('title');return(!intro||intro.hidden)&&t&&!t.hidden}
async function updGo(){const i=UPD.info;if(!i||UPD.busy)return;const pl=updPlat();UPD.err='';
  const pick=re=>i.assets.find(a=>re.test(a.name));
  if(pl==='desktop'){const port=await window.emberDesktop.portable().catch(()=>false),a=pick(port?/Portable.*\.exe$/i:/Setup.*\.exe$/i)||pick(/\.exe$/i);if(!a){updOpen(i.html);return}
    UPD.busy=1;$('#ubT').textContent='جاري تحميل التحديث...';$('#ubP').style.width='2%';updShow();
    window.emberDesktop.onProgress(p=>{$('#ubP').style.width=Math.max(2,Math.round(p*100))+'%';$('#ubS').textContent=Math.round(p*100)+'%'});
    try{await window.emberDesktop.update(a.url,a.name);$('#ubT').textContent='يفتح المثبّت... اللعبة راح تُغلق';$('#ubS').textContent='كمّل خطوات التثبيت'}catch(e){UPD.busy=0;const why=String((e&&e.message)||e||'').replace(/^Error invoking remote method '[^']*':\s*(Error:\s*)?/,'').slice(0,70);UPD.err='تعذّر التحميل'+(why?' ('+why+')':'')+' · جرّب «صفحة التحميل»';$('#ubPg').hidden=false;updShow()}return}
  if(pl==='android'){updOpen(i.html);$('#ubPg').hidden=false;UPD.err='نزّل ملف Ember-Legend-Android.apk من الصفحة ثم افتحه واضغط "تثبيت"';updShow();return}
  updOpen(i.html)}
const YT_URL='https://www.youtube.com/@ASk-o7i3v';
function updOpen(url){try{if(updPlat()==='android'){const B=Capacitor.registerPlugin('Browser');B.open({url});return}}catch(e){}window.open(url,'_blank')}
$('#ubGo').addEventListener('click',updGo);$('#ubPg').addEventListener('click',()=>updOpen((UPD.info&&UPD.info.html)||('https://github.com/'+UPD.repo+'/releases/latest')));$('#ubL').addEventListener('click',()=>{UPD.dismissed=1;updShow()});
setInterval(()=>{const b=$('#updBn');if(!UPD.info){if(!b.hidden)b.hidden=true;return}const vis=updVisible();if(!vis&&!b.hidden)b.hidden=true;else if(vis&&b.hidden&&(!UPD.dismissed||UPD.busy))updShow()},500);
setInterval(()=>{if(updVisible()&&!UPD.busy)updCheck(false)},30*60*1000);
(function(){const tryFirst=()=>{if(updVisible()){updCheck(false)}else setTimeout(tryFirst,1500)};setTimeout(tryFirst,2500);
  const mk=()=>{const b=document.createElement('button');b.type='button';b.className='mbtn';b.textContent='تحقق من التحديث (v'+APP_VERSION+')';b.addEventListener('click',()=>{updCheck(true)});return b};
  const yt=()=>{const b=document.createElement('button');b.type='button';b.className='ytb';b.innerHTML='<span class="yi">▶</span><span>قناة شربكلي على يوتيوب</span>';b.addEventListener('click',()=>updOpen(YT_URL));return b};
  const tc=document.querySelector('#title .card');if(tc)tc.appendChild(yt());
  const sc2=$('#setClose');if(sc2&&sc2.parentNode)sc2.parentNode.insertBefore(yt(),sc2);
  const sc=$('#setClose');if(sc&&sc.parentNode)sc.parentNode.insertBefore(mk(),sc)})();
window.__upd={UPD,updCheck,updCmp,updGo,updShow};
