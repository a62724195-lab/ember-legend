/* =====================================================================
   طور القصة: «جمر الأعماق» — HD-2D: قلعة الجمر
   الجمرة بيدك هي نورك وحياتك وسلاحك. تنطفي. والرماد يشتهيها.
   ===================================================================== */
const EM={lv:0,m:null,x:1.5,y:1.5,a:0,fd:'d',flip:0,E:100,t:0,mv:0,bob:0,cover:0,en:[],seen:null,fp:null,fpT:0,ring:0,cd:0,ck:null,relics:0,fx:[],hbT:0,scT:20,dark:0,boost:0,near:null,shards:0,altars:0,tut:{},ghost:null,hp:null,spT:0,hunt:0,done:0,msgs:0,up:0,flags:{},orbs:[],bs:null,pzDone:{},evSeen:[],endless:0,floor:0,lives:3,eSeed:0,etype:''};
const EM_RUNES=['«الجمر لا يموت... ينام.»','«كل من أطفأه الظلام، ما زال يحرسه.»','«النور يجذبهم... والعتمة تخبّيك.»','«ثلاث جمرات، وباب واحد.»','«القلب يفتح عينه ليسمع... فأعطه ما يسمعه.»','«الرماد كان بشرًا يومًا.»'];
const emSolid=(x,y)=>{const r=EM.m.g[Math.floor(y)];return !r||(r[Math.floor(x)]!=='.'&&r[Math.floor(x)]!=='C')};
const emOpaque=(x,y)=>{const r=EM.m.g[Math.floor(y)],c=r&&r[Math.floor(x)];return !c||(c!=='.'&&c!=='C'&&c!=='L'&&c!=='G')};
/* ---------- sound ---------- */
function saFlare(){if(!SA.n)return;saNoise(1,'bandpass',700,1.1,.55,null,5200);saTone(180,900,.55,'sawtooth',.18);saBoom(.35);setTimeout(()=>SA.n&&saChime(),120)}
/* ---------- load / progress ---------- */
function emLoad(lv,keep){const R=EM;R.lv=lv;if(R.endless){R.floor=lv-10;const b=store.get('ember_endless')||{best:0};if(R.floor+1>b.best){b.best=R.floor+1;store.set('ember_endless',b)}}R.m=hdBuild(lv);R.beacons=0;R.seals=0;R.beam=null;R.flags={};R.orbs=[];const m=R.m;hdInitGfx();
  R.x=m.start[0];R.y=m.start[1];R.a=m.start[2];R.E=lv===0?100:85;R.seen=Array.from({length:m.h},()=>Array(m.w).fill(0));R.fp=null;R.fpT=0;R.fx=[];R.shards=0;R.altars=0;R.ring=0;R.cd=0;R.dark=0;R.boost=0;R.ghost=null;R.hunt=0;R.scT=(m.arena||m.boss)?999:18;R.spT=6;
  R.hp=m.arena?{hp:5,t:0,open:0}:null;R.bs=m.boss?hdBossInit(m):null;R.pzDone=R.pzDone||{};m.items.forEach(i=>{if(i.k==='puzzle'&&R.pzDone[lv+':'+i.id]){i.solved=1;if(i.flag)R.flags[i.flag]=1}});R.ck={x:R.x,y:R.y,a:R.a};hdBakeFloor(m);HD.cam.x=R.x*HT-W/2;HD.cam.y=R.y*HT-H/2;R.fd=Math.abs(Math.cos(R.a))>.5?'s':Math.sin(R.a)>0?'d':'u';R.flip=Math.cos(R.a)<0?1:0;R.mv=0;
  R.en=m.en.map(e=>({k:e.k,x:e.x,y:e.y,sx:e.x,sy:e.y,st:e.dorm?'dorm':'patrol',wait:0,lost:0,t:Math.random()*5,wp:null,lx:0,ly:0,fz:0,stun:0,away:0,dorm:!!e.dorm}));
  emSaveProg(lv);SA.mood=null;if(SA.n)saMood(EM_TH[m.th].mood)}
function emSaveProg(lv){const R=EM;if(R.endless)return;store.set('ember_em1',{v:2,lv:lv===undefined?R.lv:lv,relics:R.relics,up:R.up||0,pz:R.pzDone||{},et:R.etype||''})}
const emFlareCost=()=>Math.max(14,22-2*(EM.up||0));
function emStart(fresh,endless){initAudio();const sv=!endless&&!fresh&&store.get('ember_em1');
  ST.flags={};ST.notes=[];ST.mem={};ST.on=true;ST.cin=null;ST.busy=0;ST.wh=[];ST.flash=0;ST.shake=0;ST.heart=0;ST.darkT=0;ST.jump=0;ST._hud='';ST.ec=null;ST.bd=null;ST.snk=0;ST.rcOn=false;ST.songOn=false;ST.emOn=true;
  ST.sc={id:'em',w:1,h:1,g:[[' ']],objs:[],tall:[],bake:null,name:'جمر الأعماق',theme:'cave',dark:1,tint:'#000',spawn:[0,0]};ST.id='em';
  ['#title','#pause','#help','#settings','#coop','#end','#dead','#card','#stJ','#stCh'].forEach(s=>$(s)&&($(s).hidden=true));$('#hud').hidden=true;$('#dlg').hidden=true;$('#cine').hidden=true;
  document.body.classList.add('story');ch2UI(false);emUI(true);stAmb(true);keys={};state='story';EM.relics=sv?sv.relics||0:0;EM.up=sv?sv.up||0:0;EM.etype=sv?(sv.et||''):'';EM.pzDone=sv?(sv.pz||{}):{};EM.tut={};EM.endless=endless?1:0;EM.floor=0;EM.lives=3;EM.eSeed=(Math.random()*1e9)|0;
  const go=()=>{emLoad(sv?(sv.v>=2?sv.lv:[0,3,4][sv.lv]||0):0);if(EM.m.boss)hdBossIntro2();if(!sv)toast('WASD حركة · Space اندفاع · F جامور · R وهج · Shift إخفاء · E تفاعل','#ffb060',true)};
  if(endless){emLoad(10);EM.up=0;showCard('البرج اللانهائي','الطابق 1',2400);toast('WASD حركة · Space اندفاع · F جامور · R وهج · Shift إخفاء · E تفاعل · عندك 3 محاولات','#ffb060',true);return}
  if(sv){go();return}
  emLoad(0);hdCine(hdIntroShots(),()=>{showCard('المرحلة الأولى','بوابة الرماد',2400);toast('WASD حركة · Space اندفاع · F جامور · R وهج · Shift إخفاء · E تفاعل','#ffb060',true)})}
function emUI(on){document.body.classList.toggle('em',!!on);{const p=$('#tPot'),k=$('#tAtk');if(p)p.textContent=on?'اندفاع':'جرعة';if(k)k.textContent=on?'جامور':'اضرب'}const a=$('#tSkill'),b=$('#tDash');if(a)a.textContent=on?'وهج':'هبّة';if(b){b.textContent=on?'إخفاء':(document.body.classList.contains('ch2')?'تسلّل':'دحرجة');b.classList.remove('on')}}
function emNext(){const R=EM;if(ST.busy)return;ST.busy=1;saDoor();$('#fade').classList.add('on');const from=R.lv;
  const doLoad=()=>{emLoad(from+1);$('#fade').classList.remove('on');ST.busy=0;if(R.m.boss)hdBossIntro2();else if(R.m.arena)hdBossIntro();else showCard(R.endless?'الطابق '+(R.floor+1):'المرحلة '+(R.lv+1),R.m.name,2400)};
  setTimeout(()=>{let ev=null;try{ev=R.endless?null:hdEventFor(from,from+1)}catch(e){console.warn(e)}
    if(ev&&ev.length){$('#fade').classList.remove('on');ST.busy=0;hdCine(ev,()=>{ST.busy=1;$('#fade').classList.add('on');setTimeout(doLoad,500)})}else doLoad()},800)}
function emDie(why){const R=EM;if(ST.busy)return;if(R.endless){R.lives--;if(R.lives<=0){emEndRun();return}toast('بقي لك '+R.lives+(R.lives===1?' محاولة':' محاولات'),'#ffb060',true)}ST.busy=1;saCaught();stFlash(.6,'#ff2a2a');ST.shake=1;stWhisper(why==='dark'?'انطفى…':'أمسكتك…',2);
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{R.x=R.ck.x;R.y=R.ck.y;R.a=R.ck.a;R.E=Math.max(R.E,65);R.en.forEach(e=>{e.x=e.sx;e.y=e.sy;e.st=e.dorm?'dorm':'patrol';e.wp=null;e.stun=0;e.away=0});if(R.m.arena||R.bs){R.en=[];R.orbs=[];if(R.bs)R.bs.wave=null}
    R.dark=0;toast(why==='dark'?'الجمر انطفى... وصحيت عند آخر نار':'الرماد أمسك بك... وصحيت عند آخر نار','#a69784',true);$('#fade').classList.remove('on');ST.busy=0},650)},350)}
function emWin(){const R=EM;store.set('ember_em_done',1);if(R.relics>=2)store.set('ember_em_true',1);hdCine(hdEndShots(R.relics>=2),()=>showCard('جمر الأعماق',R.relics>=2?'النهاية الحقيقية':'نهاية الظلام',4600,()=>stExit(true)))}
/* ---------- helpers ---------- */
const emRad=()=>{const R=EM,f=1+Math.sin(R.t*9)*.035+Math.sin(R.t*23)*.02;let r=(2.2+(R.up||0)*.3+(R.E/100)*3.4)*f*(R.cover?.62:1)+R.boost;if(R.dark>0)r*=.3;return Math.max(.9,r)};
function emLosFrom(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.12);for(let i=1;i<n;i++){const t=i/n;if(emOpaque(x0+(x1-x0)*t,y0+(y1-y0)*t))return false}return true}
function emLitZone(x,y,r){for(const it of EM.m.items)if((it.k==='brazier'||it.k==='altar')&&it.lit&&Math.hypot(it.x-x,it.y-y)<r)return true;return false}
function emFloorRandom(minD,from){const m=EM.m,fl=[];for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++)if(m.g[y][x]==='.'&&Math.hypot(x+.5-from[0],y+.5-from[1])>=minD)fl.push([x+.5,y+.5]);return fl.length?fl[(Math.random()*fl.length)|0]:[1.5,1.5]}
function emTip(k,txt){if(EM.tut[k])return;EM.tut[k]=1;toast(txt,'#ffb060',true)}
/* ---------- flare ---------- */
function emFlare(){const R=EM;if(!ST.emOn||state!=='story'||ST.cin||ST.busy||R.cd>0)return;
  if(R.E<emFlareCost()){toast('الجمر أضعف من أن يتّقد','#ff7a4a',true);R.cd=.6;return}
  R.E-=emFlareCost();R.cd=1.1;R.ring=.001;R.boost=5;stFlash(.45,'#ffe0a0');ST.shake=.5;saFlare();if(R.m.mirrors)emBeam();
  const dirA=R.a;let hits=0;hdBossFlare(dirA);
  for(const e of R.en){if(e.st==='dorm'||e.away>0)continue;const dx=e.x-R.x,dy=e.y-R.y,d=Math.hypot(dx,dy);let ad=Math.atan2(dy,dx)-dirA;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;
    if(d<(R.etype==='blue'?8.6:7)&&(Math.abs(ad)<1||d<1.6)&&emLosFrom(R.x,R.y,e.x,e.y)){hits++;if(e.k==='hunter'||e.k==='snuffer'||e.k==='hound'){if((R.m.arena||R.bs)&&e.k==='hunter'){e.dead=1;for(let i=0;i<14;i++)R.fx.push({x:e.x,y:e.y,vx:rr(-1,1),vy:rr(-1,1),life:0,max:rr(.5,1)})}else e.stun=R.etype==='blue'?8:5}else e.away=R.etype==='blue'?13:9}}
  R.en=R.en.filter(e=>!e.dead);
  const m=R.m;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const tx=Math.floor(R.x)+dx,ty=Math.floor(R.y)+dy,c=m.g[ty]&&m.g[ty][tx];if(!c)continue;const cxx=tx+.5-R.x,cyy=ty+.5-R.y,d=Math.hypot(cxx,cyy);let ad=Math.atan2(cyy,cxx)-dirA;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;
    if(d<3.4&&Math.abs(ad)<.95){if(c==='B'){m.g[ty][tx]='.';saDoor();for(let i=0;i<12;i++)R.fx.push({x:tx+.5,y:ty+.5,vx:rr(-1.2,1.2),vy:rr(-1.2,1.2),life:0,max:rr(.6,1.2)});toast('الرماد احترق','#ffb060',true)}else if(c==='K'){m.g[ty][tx]='S';toast('شيء يلمع في الجدار...','#ffd890',true)}}}
  const H_=R.hp;if(H_&&H_.open&&R.m.arena){const hx=R.m.arena.hx,hy=R.m.arena.hy,dx=hx-R.x,dy=hy-R.y,d=Math.hypot(dx,dy);let ad=Math.atan2(dy,dx)-dirA;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;
    if(d<8&&Math.abs(ad)<.9){H_.hp--;H_.open=0;H_.t=0;ST.shake=1.4;stFlash(.7,'#ff8a40');saBoom(1);stWhisper(pick(['لااا…','أطفئوه…','احرقني…']),1);
      for(let i=0;i<3;i++){const p=emFloorRandom(2.5,[hx,hy]);R.m.items.push({k:'coal',x:p[0],y:p[1],id:'cx'+Math.random()})}
      if(H_.hp<=0){setTimeout(emNext,900)}else toast('القلب تصدّع... '+H_.hp+' / 5','#ff8a40',true)}}}
/* ---------- enemies ---------- */
function emEnemyUpdate(dt,moving){const R=EM,m=R.m,pT=[Math.floor(R.x),Math.floor(R.y)];
  R.fpT-=dt;if(!R.fp||R.fpT<=0){R.fp=rcField(m.g,pT[0],pT[1]);R.fpT=.25}
  const rad=emRad(),safeP=emLitZone(R.x,R.y,2.1)||R.inv>0;
  for(const e of R.en){e.t+=dt;if(e.st==='dorm')continue;
    if(e.away>0){e.away-=dt;if(e.away<=0){const p=emFloorRandom(8,[R.x,R.y]);e.x=p[0];e.y=p[1];e.st='patrol';e.wp=null}continue}
    const dx=e.x-R.x,dy=e.y-R.y,d=Math.hypot(dx,dy),eT=[Math.floor(e.x),Math.floor(e.y)];
    let ad=Math.atan2(dy,dx)-R.a;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;const los=d<12&&emLosFrom(R.x,R.y,e.x,e.y);
    const pd=R.fp[eT[1]]&&R.fp[eT[1]][eT[0]]>=0?R.fp[eT[1]][eT[0]]:99;
    if(e.k==='weeper'){
      const seen=los&&d<rad+1.2;e.fz=seen?1:0;
      const hear=moving&&!R.cover?7:(R.cover?1.6:2.2);
      if(!safeP&&(pd<=hear||(d<2&&los))){if(e.st!=='hunt'){saBoom(.4);stWhisper(pick(['سمعتك…','غنّي معي…','أين أنت…']),1)}e.st='hunt';e.lost=0;e.lx=pT[0];e.ly=pT[1]}
      emMoveEnemy(e,dt,e.st==='hunt'?2.45:1.1,!e.fz&&true);
      if(d<.55&&!e.fz&&!safeP&&!ST.busy)emDie('weeper');
    }else if(e.k==='hound'){if(e.stun>0){e.stun-=dt;continue}
      const per=R.cover?3:7;
      if(!safeP&&((los&&d<per)||(moving&&!R.cover&&pd<=6))){if(e.st!=='hunt'){if(SA.n){saBoom(.4);hdVoice&&hdVoice({f0:380,f1:230,dur:.5,type:'sawtooth',vol:.07,lp:1400,vib:[8,12]})}}e.st='hunt';e.lost=0;e.lx=pT[0];e.ly=pT[1]}
      let v=e.st==='hunt'?3.3:1.5;if(emLitZone(e.x,e.y,2.3))v=.35;
      const ox=e.x,oy=e.y;emMoveEnemy(e,dt,v,true);if(Math.hypot(e.x-ox,e.y-oy)>.001)e.dir=Math.atan2(e.y-oy,e.x-ox);
      if(d<.6&&!safeP&&!ST.busy){R.E-=26;e.stun=1.8;stFlash(.5,'#ff3a2a');ST.shake=.9;saCaught();const ang=Math.atan2(R.y-e.y,R.x-e.x),np=[R.x+Math.cos(ang)*1,R.y+Math.sin(ang)*1];if(!emSolid(np[0],np[1])){R.x=np[0];R.y=np[1]}if(R.E<=0){R.E=0;emDie('dark')}}
    }else if(e.k==='snuffer'){emSnufferAI(e,dt,{d,los,pT,safeP});continue}else{
      if(e.stun>0){e.stun-=dt;continue}
      const per=R.cover?2.4:3.2+(R.E/100)*6.5;
      if(!safeP&&((los&&d<per)||(moving&&!R.cover&&pd<=4))){if(e.st!=='hunt'){saBoom(.6);if(!R.tut.hunter){emTip('hunter','اضغط R: الوهج يشلّ الرماد');}}e.st='hunt';e.lost=0;e.lx=pT[0];e.ly=pT[1]}
      let v=e.st==='hunt'?2.35:1.0;if(emLitZone(e.x,e.y,2.3))v=.18;
      emMoveEnemy(e,dt,v,true);
      if(d<.62&&!safeP&&!ST.busy){R.E-=40;e.stun=2;stFlash(.55,'#ff3a2a');ST.shake=1;saCaught();const ang=Math.atan2(R.y-e.y,R.x-e.x);const np=[R.x+Math.cos(ang)*.9,R.y+Math.sin(ang)*.9];if(!emSolid(np[0],np[1])){R.x=np[0];R.y=np[1]}if(R.E<=0){R.E=0;emDie('dark')}}}
    if(d<9){R.hbT-=dt;if(R.hbT<=0){R.hbT=.4+d/9*.8;saBeat(1-d/9)}}}}
function emMoveEnemy(e,dt,v,go){const R=EM,m=R.m,eT=[Math.floor(e.x),Math.floor(e.y)];let tgt;
  if(e.st==='hunt'){tgt=[e.lx,e.ly];if(eT[0]===tgt[0]&&eT[1]===tgt[1]){e.lost+=dt;if(e.lost>3.2){e.st='patrol';e.wp=null}}}
  else{if(!e.wp||(eT[0]===e.wp[0]&&eT[1]===e.wp[1])){if(e.wait>0)e.wait-=dt;else{for(let tr=0;tr<8;tr++){e.wp=emFloorRandom(tr<5?6:2,[e.x,e.y]).map(Math.floor);e.fw=rcField(m.g,e.wp[0],e.wp[1]);if(e.fw[eT[1]]&&e.fw[eT[1]][eT[0]]>=0)break}e.wait=.7}}tgt=e.wp||eT}
  if(!go)return;let field;if(e.st==='hunt'){const k=tgt[0]+','+tgt[1];if(!e.fh||e.fh.k!==k)e.fh={k,f:rcField(m.g,tgt[0],tgt[1])};field=e.fh.f}else field=e.fw;
  if(field&&field[eT[1]]&&field[eT[1]][eT[0]]>0){let best=null,bd=1e9;for(const[ax,ay]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=eT[0]+ax,ny=eT[1]+ay,fv=field[ny]&&field[ny][nx];if(fv>=0&&fv<bd){bd=fv;best=[nx,ny]}}
    if(best){const cx2=best[0]+.5,cy2=best[1]+.5,L=Math.hypot(cx2-e.x,cy2-e.y)||1;e.x+=(cx2-e.x)/L*v*dt;e.y+=(cy2-e.y)/L*v*dt}}}
/* ---------- scares ---------- */
function emScare(kind){const R=EM;
  if(kind==='whisper')stWhisper(pick(['لا تطفئه…','أراك…','الجمر يتذكّر…','نم… نم…','أعطني نورك…']),2);
  else if(kind==='dark'){R.dark=2.8;saBoom(.5);stWhisper('…',1)}
  else if(kind==='breath'){saBoom(.7);ST.shake=.9;stWhisper('هو هنا…',1)}
  else if(kind==='glimpse'){const a=R.a,x=R.x+Math.cos(a)*4.5,y=R.y+Math.sin(a)*4.5;if(!emSolid(x,y)&&emLosFrom(R.x,R.y,x,y)){R.ghost={x,y,t:.9};if(SA.n)saSwell(1.2)}}}
/* ---------- interaction ---------- */
function emNear(){const R=EM;let best=null,bd=1e9;
  for(const it of R.m.items){if(it.gone)continue;const d=Math.hypot(it.x-R.x,it.y-R.y);let ok=false,lab='';
    if(it.k==='brazier'&&!it.lit&&d<1.4){ok=1;lab='أشعل النار'}else if(it.k==='shard'&&d<1.3){ok=1;lab='خذ الجمرة الأم'}else if(it.k==='altar'&&!it.lit&&d<1.4){ok=1;lab='أشعل المذبح'}
    else if(it.k==='relic'&&d<1.3){ok=1;lab='خذ الذخيرة'}else if(it.k==='mirror'&&d<1.7){ok=1;lab='أدِر المرآة'}else if(it.k==='vein'&&it.cd<=0&&d<1.6){ok=1;lab='اشرب من عرق الجمر'}else if(it.k==='rune'&&!it.read&&d<1.4){ok=1;lab='اقرأ النقش'}else if(it.k==='ember'&&!(it.nopick>0)&&d<1.3){ok=1;lab='خذ '+EMB_T[it.t].n}else if(it.k==='puzzle'&&d<1.6){ok=1;lab=it.solved?'القفل مفتوح':'حلّ اللغز'}
    if(ok&&d<bd){bd=d;best={it,lab}}}
  if(!best&&R.m.npc&&Math.hypot(R.m.npc.x-R.x,R.m.npc.y-R.y)<1.7)best={npc:1,lab:'تكلّم مع سالم'};
  if(!best){const tx=Math.floor(R.x),ty=Math.floor(R.y);let bd2=9;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const c=R.m.g[ty+dy]&&R.m.g[ty+dy][tx+dx];if(c!=='S'&&c!=='X')continue;const cx=Math.max(tx+dx,Math.min(R.x,tx+dx+1)),cy=Math.max(ty+dy,Math.min(R.y,ty+dy+1)),d=Math.hypot(cx-R.x,cy-R.y);if(d<.95&&d<bd2){bd2=d;best=c==='S'?{sec:[tx+dx,ty+dy],lab:'ادفع الجدار'}:{exit:1,lab:emGoalDone()?'ادخل الباب':'الباب مقفل'}}}}
  if(!best){const tx=Math.floor(R.x),ty=Math.floor(R.y);let bd3=99,hc=null;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=R.m.g[ty+dy]&&R.m.g[ty+dy][tx+dx];if(c!=='B'&&c!=='K')continue;const d=Math.hypot(tx+dx+.5-R.x,ty+dy+.5-R.y);if(d<bd3){bd3=d;hc=c}}
    if(hc)best={hint:1,lab:hc==='B'?'الرماد يسدّ الطريق · اضغط R (وهج) نحوه':'شيء يلمع خلف الجدار · اضغط R (وهج) نحوه'}}
  return best}
function emInteract(){const R=EM,n=R.near;if(!n||n.hint||ST.cin||ST.busy||state!=='story')return;
  if(n.npc){hdTalk();return}
  if(n.sec){R.m.g[n.sec[1]][n.sec[0]]='.';saDoor();return}
  if(n.exit){const done=emGoalDone();if(!done){toast('الباب مقفل... '+emGoalText(),'#ff9a6a',true);saDoor();return}emNext();return}
  const it=n.it;
  if(it.k==='puzzle'){if(it.solved)toast('هذا القفل انفتح من قبل','#c9a070',true);else hdPzOpen(it);return}
  if(it.k==='mirror'){hdMirrorToggle(it);return}
  if(it.k==='brazier'){if(R.E<8){toast('الجمر ضعيف','#ff7a4a',true);return}R.E-=8;it.lit=true;if(it.bk){R.beacons++;stFlash(.4,'#ffd060');saChime();toast(`منارة ${R.beacons}/${R.m.goal.need}`,'#ffd060',true);if(R.beacons===1)setTimeout(()=>{const h=R.en.find(e=>e.dorm&&e.st==='dorm');if(h){h.st='patrol';h.dorm=false;saBoom(.7);stWhisper('استيقظ…',2)}},900);if(R.beacons>=R.m.goal.need)setTimeout(()=>hdDoorBeat(),1500)}R.ck={x:R.x,y:R.y,a:R.a};saIgnite();toast('نار جديدة... هنا ملاذ','#ffb060',true);
    if(R.m.arena){const lit=R.m.items.filter(i=>i.k==='brazier'&&i.lit).length;if(lit>=4)emTip('allfire','النيران الأربع تحميك... والقلب يفتح عينه')}}
  else if(it.k==='shard'){it.gone=1;R.shards++;R.E=Math.min(100,R.E+15);saChime();stFlash(.4,'#ffb060');toast(`جمرة أمّ ${R.shards}/3`,'#ffb060',true);
    if(R.shards===2){setTimeout(()=>{R.dark=3;saBoom(.8);stWhisper('استيقظ…',2);const h=R.en.find(e=>e.k==='hunter');if(h){h.st='patrol';h.dorm=false;h.sx=h.x;h.sy=h.y;const p=emFloorRandom(10,[R.x,R.y]);h.x=p[0];h.y=p[1]}},900)}
    if(R.shards>=3)setTimeout(()=>hdDoorBeat(),900)}
  else if(it.k==='altar'){if(R.E<15){toast('الجمر ضعيف','#ff7a4a',true);return}R.E-=15;it.lit=true;R.altars++;saChime();saIgnite();stFlash(.4,'#ffd060');toast(`مذبح ${R.altars}/4`,'#ffd060',true);if(R.altars>=4)setTimeout(()=>hdDoorBeat(),1600);
    R.ck={x:R.x,y:R.y,a:R.a};
    setTimeout(()=>{R.dark=2.4;saBoom(.7);stWhisper('كفى…',2);R.en.forEach(e=>{if(e.dorm&&e.st==='dorm'&&Math.random()<.7){e.st='patrol';e.dorm=false;const p=emFloorRandom(9,[R.x,R.y]);e.x=p[0];e.y=p[1]}})},800)}
  else if(it.k==='relic'){it.gone=1;R.relics++;R.E=100;saChime();stFlash(.6,'#ffe9a0');toast('ذخيرة سرّية '+R.relics+'/4','#ffe9a0',true);emSaveProg()}
  else if(it.k==='vein'){R.E=Math.min(100,R.E+45);it.cd=30;saIgnite();stFlash(.3,'#ff9a40');toast('الجمر يسري فيك','#ff9a40',true)}
  else if(it.k==='ember'){hdEmberTake(it)}
  else if(it.k==='rune'){it.read=1;saPaper();stSay([['نقش',it.txt]])}}
/* ---------- update ---------- */
function emUpdate(dt){const R=EM,m=R.m;ST.t+=dt;R.t+=dt;
  if(ST.flash>0)ST.flash=Math.max(0,ST.flash-dt*1.6);ST.shake=Math.max(0,ST.shake-dt*2);ST.wh.forEach(w=>w.t+=dt);ST.wh=ST.wh.filter(w=>w.t<w.life);
  const can=state==='story'&&!ST.cin&&!ST.busy;let moving=false;
  if(R.cd>0)R.cd-=dt;if(R.boost>0)R.boost=Math.max(0,R.boost-dt*6);if(R.dark>0)R.dark-=dt;if(R.ring>0){R.ring+=dt;if(R.ring>.8)R.ring=0}
  R.fx.forEach(p=>{p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt});R.fx=R.fx.filter(p=>p.life<p.max);if(R.ghost){R.ghost.t-=dt;if(R.ghost.t<=0)R.ghost=null}
  m.items.forEach(i=>{if(i.cd>0)i.cd-=dt;if(i.nopick>0)i.nopick-=dt});
  if(can){R.cover=(!(R.dashT>0))&&((keys.shift&&lastInput==='key')||keys.c||ST.snk)?1:0;
    let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tstick.x+padS.x,iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+tstick.y+padS.y;let il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il}if(R.dashT>0){ix=R.dx;iy=R.dy;il=1}
    if(il>.15){moving=true;R.a=Math.atan2(iy,ix);if(Math.abs(ix)>Math.abs(iy)*.7){R.fd='s';R.flip=ix<0?1:0}else R.fd=iy>0?'d':'u';const sp=R.dashT>0?MV.dashSp:(R.cover?1.35:2.85),mx=ix*sp*dt,my=iy*sp*dt,r=.22;let x=R.x,y=R.y;
      if(!emSolid(x+mx+Math.sign(mx)*r,y-r*.5)&&!emSolid(x+mx+Math.sign(mx)*r,y+r*.5))x+=mx;if(!emSolid(x-r,y+my+Math.sign(my)*r*.6)&&!emSolid(x+r,y+my+Math.sign(my)*r*.6))y+=my;R.x=x;R.y=y}
    R.mv+=((moving?1:0)-R.mv)*Math.min(1,dt*8);R.bob+=dt*(moving?(R.cover?6:10):0);
    /* ember economy */
    let dec=R.cover?.22:.55;if(R.etype==='green')dec=Math.max(0,dec-.45);if(emLitZone(R.x,R.y,2.1)){dec=-9}if(m.arena||m.boss)dec*=.6;R.E=clamp(R.E-dec*dt,0,100);
    if(R.E<=0&&!ST.busy)emDie('dark');
    const tx=Math.floor(R.x),ty=Math.floor(R.y);for(let yy=-4;yy<=4;yy++)for(let xx=-4;xx<=4;xx++)if(R.seen[ty+yy]&&R.seen[ty+yy][tx+xx]!==undefined)R.seen[ty+yy][tx+xx]=1;
    for(const it of m.items){if(it.k==='coal'&&!it.gone&&Math.hypot(it.x-R.x,it.y-R.y)<.75){it.gone=1;R.E=Math.min(100,R.E+(R.etype==='green'?38:25));saIgnite();toast('+ جمر','#ffb060')}}
    emCrumble(dt);R.near=emNear();const pr=$('#prompt');if(R.near){$('#promptT').textContent=R.near.lab;pr.hidden=false}else pr.hidden=true;$('#tAct').hidden=!R.near||!!R.near.hint;
    if(tAct&&!ST.tAp)emInteract();ST.tAp=tAct;
    if(m.th===0&&!R.tut.barrier){for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=m.g[ty+dy]&&m.g[ty+dy][tx+dx];if(c==='B')emTip('barrier','الرماد يسدّ الطريق... اضغط R (وهج) لتحرقه')}}
    for(const it of m.items)if(it.k==='trig'&&!it.gone&&Math.hypot(it.x-R.x,it.y-R.y)<2.3){hdTrigger(it);break}
    emEnemyUpdate(dt,moving);hdBossUpdate(dt);
    if(R.E<22&&R.E>0){R.hbT2=(R.hbT2||0)-dt;if(R.hbT2<=0){R.hbT2=.5+R.E/22*.7;saBeat(.5+(1-R.E/22)*.5)}}
    /* scares */
    R.scT-=dt;if(R.scT<=0){R.scT=rr(16,32);emScare(pick(['whisper','whisper','dark','breath','glimpse']))}
    /* arena logic */
    if(R.hp){const H_=R.hp;H_.t+=dt;if(!H_.open&&H_.t>(H_.hp>2?9:6.5)){H_.open=1;H_.t=0;saSwell&&saSwell(2);stWhisper('اسمعني…',1);toast('القلب فتح عينه! اضربه بالوهج','#ff8a40',true)}else if(H_.open&&H_.t>3.6){H_.open=0;H_.t=0}
      R.spT-=dt;if(R.spT<=0){R.spT=rr(7,10);if(R.en.length<3){const c=pick(m.arena.sp);if(Math.hypot(c[0]-R.x,c[1]-R.y)>6)R.en.push({k:'hunter',x:c[0],y:c[1],sx:c[0],sy:c[1],st:'hunt',wait:0,lost:0,t:0,wp:null,lx:Math.floor(R.x),ly:Math.floor(R.y),fz:0,stun:0,away:0,dorm:false})}}}}
  else{R.mv*=.85}
  saTick(dt,moving&&!R.cover);hdAudio(dt);hdNpcTick()}
function emObjective(){const R=EM,m=R.m,k=m.goal.kind||(m.arena?'boss':m.goal.need===3?'shards':'altars');
  if(m.boss&&m.boss.k==='emp')return R.bs&&!R.bs.dead?`الإمبراطور هجير: ${R.bs.hp}/${R.bs.max} · رُدّ كراته بالوهج (R)`:'...';
  if(m.arena)return R.hp?`قلب الرماد: ${R.hp.hp}/5 · اضربه بالوهج حين يفتح عينه`:'...';
  if(emGoalDone())return 'الباب يتّقد... اذهب إليه';
  return k==='shards'?`اجمع الجمرات الأمّ ${R.shards}/${m.goal.need}`:k==='altars'?`أشعل المذابح ${R.altars}/${m.goal.need}`:k==='beacons'?`أشعل المنارات على الجزر ${R.beacons}/${m.goal.need}`:k==='flags'?`${m.goal.label} (${emGoalText()})`:`أشعل الأختام بانعكاس الوهج ${R.seals}/${m.goal.need} · R ثم E للمرايا`}
/* touch hooks + look drag */
(function(){const a=$('#tSkill'),b=$('#tDash');if(a)a.addEventListener('pointerdown',()=>{if(ST.emOn)emFlare()});if(b)b.addEventListener('pointerdown',()=>{if(ST.emOn){ST.snk=ST.snk?0:1;b.classList.toggle('on',!!ST.snk)}});
  const sb=$('#emBtn'),sc=$('#emCont');if(sb)sb.onclick=()=>emStart(true);if(sc)sc.onclick=()=>emStart(false)})();
function emRefreshTitle(){const sv=store.get('ember_em1'),c=$('#emCont');if(c){c.hidden=!sv;const i=$('#emInfo');if(i&&sv)i.textContent='المرحلة '+((sv.v>=2?sv.lv:[0,3,4][sv.lv]||0)+1)}}
emRefreshTitle();
Object.assign(window.__st,{EM,emStart,emLoad,emFlare,emInteract,emWin,emDie,emNear,emObjective});
