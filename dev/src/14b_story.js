/* ---------- story engine: movement, light, shade, events, cinematics, UI ---------- */
function stTall(sc){const t=[];for(let y=0;y<sc.h;y++)for(let x=0;x<sc.w;x++){const ch=sc.g[y][x];
  if(ch==='p')t.push({k:'p',x:x*T+8,y:(y+1)*T-1});
  else if(ch==='L'){const o=sc.objs.find(o=>o.k==='lamp'&&o.x===x*T+8&&o.y===y*T+8);t.push({k:'L',x:x*T+8,y:(y+1)*T-1,id:o&&o.id})}}
  if(sc.id==='village')t.push({k:'W',x:23*T,y:13*T});
  sc.objs.forEach(o=>{if(o.k==='brazier'||o.k==='bell'||o.k==='seal'||o.k==='singer')t.push({k:o.k,x:o.x,y:o.y+(o.k==='singer'?8:o.k==='seal'?8:6),id:o.id,o})});
  sc.tall=t}
const tchAt=(sc,px,py)=>{const tx=Math.floor(px/T),ty=Math.floor(py/T);return(sc.g[ty]&&sc.g[ty][tx])||' '};
const stFree=(x,y)=>{const sc=ST.sc;for(const [ox,oy] of [[-4,2],[4,2],[-4,7],[4,7]])if(SOL.has(tchAt(sc,x+ox,y+oy)))return false;return true};
function stMove(dx,dy){if(stFree(ST.x+dx,ST.y))ST.x+=dx;if(stFree(ST.x,ST.y+dy))ST.y+=dy}
/* ---------- whispers, scares ---------- */
const WHISPERS=['راشد…','تعال…','غنّي معي…','لا تطفّي النور…','ريم تناديك…','ارجع…','أنا وحدي…','اسمعني…'];
function stWhisper(txt,n){const k=n||1;for(let i=0;i<k;i++){ST.wh.push({txt:txt||pick(WHISPERS),x:rr(.12,.88)*W,y:rr(.18,.8)*H,t:-i*.5,life:3.4});setTimeout(()=>saWhisper(),i*500)}}
function stFlash(a,col){ST.flash=a;ST.flashC=col||'#ffffff'}
function stScare(kind){
  if(ST.flags['sc_'+kind])return;ST.flags['sc_'+kind]=1;
  if(kind==='lights'){ST.darkT=4;stWhisper('لا تقرأ أكثر…',2);saSwell(2.2)}
  else if(kind==='music'){saMusicBox();setTimeout(()=>{if(ST.on){stWhisper('ريم…',1);ST.darkT=1.6;saBoom(.5)}},3900)}
  else if(kind==='closet'){
    saDoor();stSay([['راشد','الخزانة... ملابس أطفال. ودب صغير ملفوف بورقة: «ريم ما راحت. هي تحت.»']],()=>{
      ST.jump=.7;ST.shake=1.2;stFlash(.7);saJump();stWhisper('ما راح تلحقها…',2);
      setTimeout(()=>{if(ST.on)stSay([['راشد','قلبي بيطلع من صدري... لازم أوصل للبئر. لازم.']],()=>stSave())},1200)})}
}
/* ---------- shade ---------- */
function stShadeSpawn(){const sc=ST.sc;let c;
  if(sc.id==='village'){const cs=[[23,12],[8,13],[38,13],[23,4],[23,24],[40,23],[5,23]].map(([x,y])=>[x*T+8,y*T+8]);cs.sort((a,b)=>Math.hypot(b[0]-ST.x,b[1]-ST.y)-Math.hypot(a[0]-ST.x,a[1]-ST.y));c=cs[0]}
  else c=[22*T,5*T];
  ST.sh={on:1,x:c[0],y:c[1],v:sc.chase?34:27,t:0,wt:rr(0,6)}}
function stSafeAt(x,y){const sc=ST.sc;
  for(const o of sc.objs){if(o.k==='lamp'&&ST.lit[o.id]&&Math.hypot(o.x-x,o.y-y)<42)return o;if(o.k==='glow'&&o.safe&&Math.hypot(o.x-x,o.y-y)<o.lr*.8)return o}
  if(sc.id==='village'&&ST.act>=2&&Math.hypot(23*T-x,12*T-y)<0)return null;return null}
function stShadeUpdate(dt){const s=ST.sh;if(!s.on)return;s.t+=dt;
  const dx=ST.x-s.x,dy=ST.y-s.y,d=Math.hypot(dx,dy)||1,safeS=stSafeAt(s.x,s.y),safeP=stSafeAt(ST.x,ST.y);
  let vx=0,vy=0;
  if(safeS){vx=(s.x-safeS.x)/(Math.hypot(s.x-safeS.x,s.y-safeS.y)||1)*s.v*1.4;vy=(s.y-safeS.y)/(Math.hypot(s.x-safeS.x,s.y-safeS.y)||1)*s.v*1.4}
  else if(!safeP||d<120){vx=dx/d*s.v;vy=dy/d*s.v}
  const nx=s.x+vx*dt,ny=s.y+vy*dt;if(!SOL.has(tchAt(ST.sc,nx,s.y)))s.x=nx;else s.y+=Math.sign(dy)*s.v*dt*.8;if(!SOL.has(tchAt(ST.sc,s.x,ny)))s.y=ny;else s.x+=Math.sign(dx)*s.v*dt*.8;
  if(d<120){ST.hbT=(ST.hbT||0)-dt;if(ST.hbT<=0){ST.hbT=.45+d/120*.7;saBeat(1-d/120)}
    ST.whT=(ST.whT||0)-dt;if(ST.whT<=0){ST.whT=rr(2.4,5);stWhisper(null,1)}}
  if(d<9&&!safeP&&!ST.busy)stCaught()}
function stCaught(){ST.busy=1;saCaught();stFlash(.6,'#ff2a2a');ST.shake=1;stWhisper('أمسكتك…',2);
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{const k=ST.ck||{id:ST.id,x:ST.sc.spawn[0],y:ST.sc.spawn[1]};
    if(k.id!==ST.id)stLoad(k.id,k.x,k.y,1);else{ST.x=k.x;ST.y=k.y}
    if(ST.sh.on)stShadeSpawn();if(ST.ec)ecSpawn();ST.cam.x=ST.x-W/2;ST.cam.y=ST.y-H/2;toast('الظل أمسك بك... وصحيت عند آخر نور','#a69784',true);
    $('#fade').classList.remove('on');ST.busy=0},650)},350)}
/* ---------- scene / save ---------- */
function stSave(){store.set(STKEY,{id:ST.id,x:Math.round(ST.x),y:Math.round(ST.y),flags:ST.flags,notes:ST.notes,mem:ST.mem,act:ST.act,lit:ST.lit,ck:ST.ck})}
function stLoad(id,sx,sy,keepCk){
  const sc=SCENES[id]();bakeScene(sc);stTall(sc);ST.sc=sc;ST.id=id;
  ST.x=sx!==undefined?sx:sc.spawn[0];ST.y=sy!==undefined?sy:sc.spawn[1];
  ST.sh.on=0;ST.dark=null;ST.near=null;ST.jump=0;
  if(sc.id==='village'&&ST.act>=2)stShadeSpawn();
  if(sc.chase&&!ST.flags.cellarDone)stShadeSpawn();
  if(ST.flags.c2&&sc.echo)ecSpawn();else ST.ec=null;
  if(ST.flags.c2)rbReset();else ST.bd=null;
  if(!keepCk)ST.ck={id,x:ST.x,y:ST.y};
  ST.cam.x=ST.x-W/2;ST.cam.y=ST.y-H/2;stClampCam(true);SA.mood=null}
function stClampCam(snap){const sc=ST.sc;let tx=ST.x-W/2,ty=ST.y-H/2;const mw=sc.w*T,mh=sc.h*T;
  tx=mw<=W?(mw-W)/2:clamp(tx,0,mw-W);ty=mh<=H?(mh-H)/2:clamp(ty,0,mh-H);
  if(snap){ST.cam.x=tx;ST.cam.y=ty}else{ST.cam.x+=(tx-ST.cam.x)*.14;ST.cam.y+=(ty-ST.cam.y)*.14}}
function stFade(fn){ST.busy=1;$('#fade').classList.add('on');setTimeout(()=>{fn();setTimeout(()=>{$('#fade').classList.remove('on');ST.busy=0},320)},520)}
function stGoto(to,sx,sy){const from=ST.id;
  if(to==='maze'){stCine([{d:5,paint:'heart',cap:'الدرج ينزل تحت الرمل... والصدى يرتفع من تحت.'}],()=>rcEnter());return}stFade(()=>{stLoad(to,sx,sy);stEnter(to,from);stSave()})}
const STF={hA:['راشد','بيت أم سعيد... الأكل على السفرة لسا يبخّر. أهل البيت كانوا هنا قبل دقايق!'],
 hB:['راشد','مجلس الشيخ... الفناجين مصبوبة، والقهوة فيها بخار. والباب كان مفتوح.'],
 hC:['راشد','غرفة ريم. دبّها على السرير... هذا الدب اللي خيّطته أمي بإيدها. ريم، وينج؟'],
 hD:['راشد','المخزن. ريحة زيت وخشب قديم... وفي الأرض فتحة بقفل نحاسي.'],
 cellar:['راشد','السرداب بارد... والصوت صار أوضح. فيه أحد يغنّي... وفيه أحد خلفي.'],
 well:['راشد','قاع الغدير...']};
function stEnter(id,from){
  const f=ST.flags;
  if(f.c2&&ch2Enter(id,from))return;
  if(id==='village'&&from==='hA'&&f.n1&&ST.act===1)return setTimeout(stScareLamps,500);
  if(id==='cellar'&&!f.cellarSeen){f.cellarSeen=1;setTimeout(()=>{stSay([STF.cellar],()=>stWhisper('تعال…',2))},500);return}
  if(id==='well'&&!f.wellSeen){f.wellSeen=1;setTimeout(stWellIntro,300);return}
  if(STF[id]&&!f['v_'+id]){f['v_'+id]=1;setTimeout(()=>stSay([STF[id]]),450)}}
function stScareLamps(){
  const names=Object.keys(ST.lit);
  stCine([{d:3.6,cap:'الفوانيس بدأت تنطفي... وحدة وحدة.',a:[368,190],b:[368,175],on:()=>{names.forEach((n,i)=>setTimeout(()=>{ST.lit[n]=0;saLampOff()},700+i*420))}},
   {d:4.2,cap:'وفي آخر الساحة... كان أحد واقف.',a:[368,175],b:[368,150],on:()=>{ST.shade0=1;ST.sh={on:0,x:23*T,y:9*T,v:0,t:0,wt:0,show:1};stWhisper('راشد…',1)}}],
   ()=>{ST.act=2;ST.sh.show=0;stShadeSpawn();ST.ck={id:'village',x:ST.x,y:ST.y};stSave();toast('الظل يطاردك! أشعل الفوانيس... النور يوقفه','#ff7a2f',true);saBoom(.7)})}
function stWellIntro(){
  stCine([{d:4.2,cap:'القاع... ماي أسود، وهدوء يخنق.',a:[176,170],b:[176,150],on:()=>{saBoom(.6)}},
   {d:4.5,cap:'وفوق الماي... كانت واقفة.',a:[176,150],b:[176,120]}],()=>{stSay([['ريم','راشد... جيت.'],['راشد','ريم! الحمد لله... تعالي، خلينا نمشي من هنا.'],['ريم','ما أقدر. الغدير كله غنّى معي... ما أعرف أطلع. إذا ناديتني باسمي... بيرجعون.']],()=>stSave())})}
/* ---------- interaction ---------- */
function stObjective(){const f=ST.flags;
  if(ST.emOn)return emObjective();
  if(f.c2)return stObjective2();
  if(ST.id==='well')return f.fin?'...':'اقترب من ريم وناديها باسمها';
  if(ST.act<2)return f.n1?'اخرج إلى الساحة':'ادخل بيت أم سعيد (الباب فوق جهة اليسار)';
  if(!f.key)return 'الظل يطاردك! أشعل الفوانيس، وابحث عن مفتاح المخزن في مجلس الشيخ';
  if(!f.open)return 'اذهب للمخزن (جنوب شرق) وافتح الفتحة';
  return 'انزل السرداب وتتبّع الصوت';}
function stNear(){const sc=ST.sc;let best=null,bd=1e9;
  for(const o of sc.objs){if(!o.r||o.k==='glow'||o.k==='door')continue;if(o.ok&&!o.ok())continue;if(o.k==='mem'&&ST.mem[o.id])continue;if(o.k==='lamp'&&ST.lit[o.id])continue;if(o.k==='brazier'&&(ST.lit[o.id]||o.on))continue;if(o.k==='seal')continue;
    const d=Math.hypot(o.x-ST.x,o.y-ST.y);if(d<o.r+4&&d<bd){bd=d;best=o}}
  return best}
function stUse(o){
  if(ST.flags.c2&&ch2Use(o))return;
  if(o.k==='lamp'){ST.lit[o.id]=1;saIgnite();ST.ck={id:ST.id,x:o.x,y:o.y+14};const n=Object.values(ST.lit).filter(Boolean).length;toast(`أشعلت فانوس (${n}/6)`,'#ffd890');stSave();return}
  const onceDone=()=>{if(!ST.flags['u_'+o.id]){ST.flags['u_'+o.id]=1;o.done&&o.done()}stSave()};
  if(o.k==='mem'){ST.mem[o.id]=1;stFlash(.35,'#9fe8ff');saChime();toast(`ذكرى ${memCount()}/7`,'#7ad0ff',true);stSay(o.lines,()=>{o.done&&o.done();stSave()});return}
  if(o.k==='note'){if(!ST.notes.includes(o.id))ST.notes.push(o.id);saPaper();stSay(o.lines,onceDone);return}
  if(o.k==='key'){saKey();stSay(o.lines,onceDone);return}
  if(o.k==='closet'){if(ST.flags.sc_closet){stSay([['راشد','الخزانة فاضية الحين.']]);return}stScare('closet');return}
  if(o.k==='trap'){const f=ST.flags;
    if(!f.key){stSay([['راشد','مقفلة بقفل نحاسي... أحتاج المفتاح.']]);return}
    if(!f.open){f.open=1;saDoor();stSay([['راشد','الفتحة تنفتح... ريحة رطوبة وماي قديم. وصوت... بعيد... يغنّي.']],()=>stGoto('cellar'));return}
    stGoto('cellar');return}
  if(o.k==='pool'){stFinal();return}}
function stInteract(){if(state!=='story'||ST.cin||ST.busy)return;if(ST.emOn){emInteract();return}if(ST.rcOn){rcInteract();return}if(ST.near)stUse(ST.near)}
/* ---------- finale ---------- */
function stChoice(title,opts){state='choice';$('#stChT').textContent=title;const b=$('#stChB');b.innerHTML='';
  opts.forEach((o,i)=>{const x=document.createElement('button');x.type='button';x.className='mbtn'+(i?'':' main');x.textContent=o[0];x.onclick=()=>{$('#stCh').hidden=true;state='story';o[1]()};b.appendChild(x)});$('#stCh').hidden=false}
function stFinal(){
  stSay([['راشد','ريم... سمعتك. اسمعي صوتي.'],['ريم','الصوت قريب... يبي يسمع اسمي. اسمي الحقيقي، مو اللي ناداني فيه.']],()=>{
    stChoice('ريم فوق الماي... وش تسوي؟',[['«ريم بنت أبوي... أنا أخوك راشد. ارجعي معي.»',stEndGood],['«اهرب... هذا أكبر منك!»',stEndRun]])})}
function stEndGood(){ST.flags.fin=1;stSave();
  if(memCount()>=7)return stCine(SECRET_SHOTS(),stEndDone2);
  stCine([{d:5.5,paint:'dawn',ph:[.05,.3],cap:'الصوت سكت... لأول مرة منذ سبع ليالٍ.'},{d:5.5,paint:'dawn',ph:[.3,.6],cap:'ريم فتحت عيونها، وهمست: «ليش تأخرت يا راشد؟»'},{d:6,paint:'dawn',ph:[.6,.9],cap:'طلعت الشمس على الغدير... لكن بيوته بقيت صامتة.'}],stEndDone)}
function stEndRun(){stCine([{d:5,paint:'road',cap:'هربت... وصوت ريم ينادي باسمك مع كل خطوة.'},{d:4.5,paint:'road',cap:'وفي النهاية... ما قدرت. رجعت.'}],()=>{ST.flags.fin=0;stSave();stSay([['راشد','ما أقدر أتركها. مرة ثانية... وهالمرة أناديها.']])})}
function stEndDone(){const n=memCount();ST.flags.fin=0;stSave();store.set('ember_story_done',1);
  showCard('نهاية الفصل',n<7?`الذكريات: ${n}/7 — فيه سر ما انكشف بعد`:'الغدير الصامت',4200,()=>{stExit(true)})}
function stEndDone2(){ST.flags.fin=0;stSave();store.set('ember_story_done',1);store.set('ember_story_secret',1);
  showCard('النهاية السرية','الجمر ما انطفى',5200,()=>{stExit(true)})}
function SECRET_SHOTS(){return[
  {d:5.5,scene:'well',a:[176,130],b:[176,100],cap:'الذكريات السبع... اشتعلت فوق الماي، فانوسًا فانوس.',on:()=>{ST.heart=1;saChime();stFlash(.5,'#9fe8ff')}},
  {d:6,paint:'stars',cap:'وطلع منها نور... مو للغدير وحده.'},
  {d:6,paint:'dawn',ph:[.15,.55],crowd:1,cap:'ورجع أهل الغدير، واحد واحد، يحملون فوانيسهم... وأم سعيد تغنّي.'},
  {d:6.5,paint:'stars',moon:1,cap:'قال الصوت: «القلب ما انطفى. هو ينتظر من يسمع.»'},
  {d:8,paint:'heart',cap:'وفي مكان بعيد... جمر الواحة يلمع من جديد.'},
  {d:5,paint:'heart',title:1,cap:'...تبدأ من هنا'}]}
/* ---------- cinematics ---------- */
function stCine(shots,cb){ST.cin={shots,i:-1,t:0,cb,cam:[0,0]};$('#cine').hidden=false;$('#stHud').hidden=true;$('#stBtns').hidden=true;$('#prompt').hidden=true;ST.busy=0;stCineNext()}
function stCineNext(){const c=ST.cin;if(!c)return;c.i++;if(c.i>=c.shots.length){stCineEnd();return}const s=c.shots[c.i];c.t=0;
  if(s.scene&&s.scene!==ST.id){stLoad(s.scene,undefined,undefined,1);c.sceneChanged=1}
  const cap=$('#ccap');cap.textContent=s.cap||'';cap.style.animationDuration=(s.d||5)+'s';cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in');
  saCineShot(s);s.on&&s.on()}
function stCineEnd(){const c=ST.cin;if(!c)return;ST.cin=null;$('#cine').hidden=true;$('#ccap').textContent='';const cb=c.cb;
  if(ST.sc){stClampCam(!!c.sceneChanged);saScene()}cb&&cb()}
function stCineSkip(){const c=ST.cin;if(!c)return;if(c.hd){hdCineSkip();return}for(let i=c.i+1;i<c.shots.length;i++){c.shots[i].on&&c.shots[i].on()}c.i=c.shots.length;stCineEnd()}
/* ---------- painted cinematic backdrops ---------- */
function paintSky(s,p,t){
  const kind=s.paint,ph=s.ph?s.ph[0]+(s.ph[1]-s.ph[0])*p:0,dawn=kind==='dawn'?clamp(ph,0,1):0;
  const top=mix(kind==='heart'?'#05030a':'#04061a',kind==='dawn'?'#3a5a9a':'#0a1030',dawn*1.1),mid=mix(kind==='heart'?'#1a0a12':'#10153a',kind==='dawn'?'#ee8a6a':'#2a1a50',dawn),bot=mix(kind==='heart'?'#4a1a10':'#2a1a40',kind==='dawn'?'#ffd9a0':'#7a3a4a',dawn);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(.6,mid);g.addColorStop(1,bot);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const hor=H*.62;
  /* stars */
  const sa=(1-dawn*1.3);if(sa>0){for(let i=0;i<110;i++){const x=hsh(i,1,5)*W,y=hsh(i,2,5)*hor*.95,tw=.5+.5*Math.sin(t*(1+hsh(i,3,5)*3)+i);ctx.globalAlpha=sa*(.25+.6*tw)*(y<hor*.2?1:.8);ctx.fillStyle=hsh(i,4,5)>.85?'#ffd9b0':'#dfe8ff';const z=hsh(i,5,5)>.9?2:1;ctx.fillRect(Math.round(x),Math.round(y),z,z)}ctx.globalAlpha=1}
  /* moon / sun */
  if(kind==='stars'||kind==='road'||kind==='heart'&&0){const mx=W*.72,my=H*.26,mr=Math.min(W,H)*.075;const gm=ctx.createRadialGradient(mx,my,mr*.4,mx,my,mr*4);gm.addColorStop(0,'rgba(190,210,255,.32)');gm.addColorStop(1,'rgba(190,210,255,0)');ctx.fillStyle=gm;ctx.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);ctx.fillStyle='#e8eeff';ctx.beginPath();ctx.arc(mx,my,mr,0,7);ctx.fill();ctx.fillStyle='#c4cde8';ctx.beginPath();ctx.arc(mx-mr*.3,my-mr*.2,mr*.28,0,7);ctx.arc(mx+mr*.35,my+mr*.3,mr*.2,0,7);ctx.fill()}
  if(kind==='dawn'){const sy=hor-Math.min(1,dawn*1.4)*H*.22,gs=ctx.createRadialGradient(W*.5,sy,2,W*.5,sy,H*.7);gs.addColorStop(0,`rgba(255,220,150,${.15+.6*dawn})`);gs.addColorStop(.35,`rgba(255,140,90,${.12+.3*dawn})`);gs.addColorStop(1,'rgba(255,120,80,0)');ctx.fillStyle=gs;ctx.fillRect(0,0,W,H);ctx.fillStyle=`rgba(255,235,190,${.4+.6*dawn})`;ctx.beginPath();ctx.arc(W*.5,sy,H*.05,0,7);ctx.fill()}
  /* aurora (stars) */
  if(kind==='stars'){for(let b=0;b<3;b++){ctx.beginPath();ctx.moveTo(0,H*.2);for(let x=0;x<=W;x+=8)ctx.lineTo(x,H*(.18+b*.07)+Math.sin(x*.02+t*.5+b*2)*H*.05);for(let x=W;x>=0;x-=8)ctx.lineTo(x,H*(.3+b*.07)+Math.sin(x*.025+t*.4+b)*H*.06);ctx.closePath();const ga=ctx.createLinearGradient(0,H*.15,0,H*.45);ga.addColorStop(0,`rgba(${b?150:60},${b?90:240},${b?255:180},0)`);ga.addColorStop(.5,`rgba(${b?150:60},${b?90:240},${b?255:180},.16)`);ga.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ga;ctx.fill()}}
  /* dunes */
  const lay=[[hor,.04,'#2a2040','#1a1430',.012],[hor+H*.1,.05,'#1c1630','#120e22',.017],[hor+H*.22,.07,'#0e0c18','#08060e',.02]];
  lay.forEach(([by,amp,c0,c1,fq],i)=>{const cc=mix(mix(c0,'#6a3a30',dawn*.6),'#000000',0),c2=mix(c1,'#2a1a20',dawn*.4);ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=6)ctx.lineTo(x,by+Math.sin(x*fq*3+i*2+t*.02*(i+1))*H*amp);ctx.lineTo(W,H);ctx.closePath();const gd=ctx.createLinearGradient(0,by-H*amp,0,H);gd.addColorStop(0,cc);gd.addColorStop(1,c2);ctx.fillStyle=gd;ctx.fill()});
  /* village silhouette on ridge */
  const vx=W*.28,vy=hor+H*.045;ctx.fillStyle='#0c0a14';for(let i=0;i<7;i++){const hx=vx+i*13+(i%2)*3,hw=9+hsh(i,1,9)*5,hh=7+hsh(i,2,9)*6;ctx.fillRect(hx,vy-hh,hw,hh);if(hsh(i,3,9)>.4){ctx.fillRect(hx+hw*.3,vy-hh-2,2,3)}
    const lit=kind==='dawn'?(dawn>.3&&p>hsh(i,5,9)*.5):(Math.sin(t*(.6+i*.2)+i)>-.5);if(lit){ctx.fillStyle=kind==='dawn'?'#ffcf7a':'#ffb060';ctx.globalAlpha=.9;ctx.fillRect(hx+2,vy-hh+2,2,2);ctx.globalAlpha=1;ctx.fillStyle='#0c0a14'}}
  [[vx-12,0],[vx+98,1]].forEach(([px,i])=>{ctx.fillStyle='#0c0a14';ctx.fillRect(px,vy-16,1.6,16);for(let k=0;k<5;k++){const a=k/5*6.28;ctx.beginPath();ctx.moveTo(px+.8,vy-16);ctx.quadraticCurveTo(px+Math.cos(a)*6,vy-21,px+Math.cos(a)*9,vy-13+Math.sin(a)*3);ctx.lineWidth=1.4;ctx.strokeStyle='#0c0a14';ctx.stroke()}});
  /* well glow */
  if(kind==='stars'||kind==='heart'){const gx=vx+48,gy=vy-2,gg=ctx.createRadialGradient(gx,gy,1,gx,gy,34);gg.addColorStop(0,'rgba(110,210,255,.5)');gg.addColorStop(1,'rgba(110,210,255,0)');ctx.fillStyle=gg;ctx.fillRect(gx-34,gy-34,68,68);
    for(let i=0;i<24;i++){const q=(t*.25+i/24)%1,sx=gx+Math.sin(i*7+t*.6)*10*(q+.2),sy=gy-q*H*.5;ctx.globalAlpha=(1-q)*.8;ctx.fillStyle=i%3?'#9fe8ff':'#ffd890';ctx.fillRect(sx,sy,1.6,1.6)}ctx.globalAlpha=1}
  /* traveler (road) */
  if(kind==='road'){const q0=s.rp?s.rp[0]+(s.rp[1]-s.rp[0])*p:p,q=q0*q0*(3-2*q0)*.4+q0*.6,rx=W*.1+q*W*.27,ry=hor+H*.2-q*H*.2,sc=1-.6*q;ctx.save();ctx.translate(rx,ry);ctx.scale(sc,sc);ctx.fillStyle='#050408';ctx.fillRect(-3,-14,6,10);ctx.fillRect(-2,-18,4,4);ctx.fillRect(-3,-4,2,6+Math.sin(t*6)*1.5);ctx.fillRect(1,-4,2,6-Math.sin(t*6)*1.5);ctx.fillStyle='#ffcf7a';ctx.fillRect(5,-8,3,4);const gl=ctx.createRadialGradient(6.5,-6,1,6.5,-6,28);gl.addColorStop(0,'rgba(255,200,120,.55)');gl.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=gl;ctx.fillRect(-24,-34,60,60);ctx.restore()}
  /* returning villagers (dawn secret) */
  if(s.crowd){const n=Math.floor(3+p*12);for(let i=0;i<n;i++){const q=clamp(p*1.4-i*.05,0,1),x=W*.9-q*W*.6-i*3,y=hor+H*.1+(i%3)*H*.03,bob=Math.sin(t*5+i)*.6;ctx.fillStyle='#08060c';ctx.fillRect(x-1.5,y-9+bob,3,8);ctx.fillRect(x-1,y-12+bob,2,3);ctx.fillStyle='#ffcf7a';ctx.fillRect(x+2,y-6+bob,1.6,2)}}
  /* ember heart */
  if(kind==='heart'){const cx0=W/2,cy0=H*.42,pulse=1+.08*Math.sin(t*2.4),r=Math.min(W,H)*.1*pulse*(.4+.6*Math.min(1,p*2));
    for(let k=0;k<4;k++){const q=((t*.4+k/4)%1);ctx.strokeStyle=`rgba(255,${140+k*20},70,${(1-q)*.5})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx0,cy0,r*(1+q*3.2),0,7);ctx.stroke()}
    const go=ctx.createRadialGradient(cx0,cy0,1,cx0,cy0,r*3.2);go.addColorStop(0,'rgba(255,230,170,.95)');go.addColorStop(.18,'rgba(255,150,60,.65)');go.addColorStop(.5,'rgba(255,80,30,.22)');go.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=go;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff6dc';ctx.beginPath();ctx.arc(cx0,cy0,r*.35,0,7);ctx.fill();
    for(let i=0;i<46;i++){const q=(t*.3+hsh(i,1,7))%1,a=hsh(i,2,7)*6.28+t*.3,rr_=r*(.8+q*5);ctx.globalAlpha=(1-q)*.9;ctx.fillStyle=i%2?'#ffb060':'#ffe0a0';ctx.fillRect(cx0+Math.cos(a)*rr_,cy0+Math.sin(a)*rr_*.7-q*20,1.6,1.6)}ctx.globalAlpha=1;
    if(s.title){tctx.save();TX('أسطورة الجمر',W/2,H*.3,'#ffd9a0',24);tctx.restore()}}
  const vg=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,Math.max(W,H)*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
