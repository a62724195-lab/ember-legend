/* =====================================================================
   أوضاع البرج اللانهائي: عادي · ظلام · أسراب · حياة واحدة
   تنطبق على البرج العادي فقط (التحدّي اليومي يبقى ثابتاً وعادلاً). لكل وضع رقم قياسي مستقل.
   ===================================================================== */
const MODES=[{id:'n',n:'عادي',d:'طوابق عشوائية بلا نهاية'},{id:'dark',n:'ظلام',d:'النار تخبو أسرع، لا تبقى واقف'},{id:'swarm',n:'أسراب',d:'ضعف عدد الأعداء'},{id:'one',n:'حياة واحدة',d:'محاولة واحدة فقط'}];
const MD={cur:store.get('ember_mode')||'n'};if(!MODES.some(m=>m.id===MD.cur))MD.cur='n';
const mdInfo=id=>MODES.find(m=>m.id===id)||MODES[0];
const mdBestKey=id=>'ember_endless_'+id;
/* بداية: نثبّت الوضع ونطبّق أثره على المحاولات */
const _mdStart=emStart;emStart=function(fresh,endless){EM.mode=(endless&&!DL.pend)?MD.cur:'n';const r=_mdStart.apply(this,arguments);
  if(EM.mode==='one')EM.lives=1;
  if(EM.mode!=='n')setTimeout(()=>toast('وضع «'+mdInfo(EM.mode).n+'»: '+mdInfo(EM.mode).d,'#ff9a6a',true),1800);
  return r};
/* ظلام: تخبو النار أسرع (ما عدا ساحات الزعماء) */
const _mdUp=emUpdate;emUpdate=function(dt){_mdUp.apply(this,arguments);const R=EM;
  if(R.endless&&R.mode==='dark'&&!ST.cin&&!HD.cine&&R.m&&!(R.m.arena||R.m.boss)&&!ST.busy&&R.E>1)R.E=Math.max(1,R.E-.32*dt)};
/* أسراب: كل عدو معه توأم قريب منه في خانة فاضية */
const _mdEn=hdEndless;hdEndless=function(fl){const m=_mdEn.apply(this,arguments);
  if(EM.endless&&EM.mode==='swarm'&&m&&!m.boss&&!m.arena&&m.en){const free=(x,y)=>m.g[Math.floor(y)]&&m.g[Math.floor(y)][Math.floor(x)]==='.';const extra=[];
    m.en.forEach(e=>{for(const[dx,dy]of[[.9,0],[-.9,0],[0,.9],[0,-.9]])if(free(e.x+dx,e.y+dy)){extra.push({k:e.k,x:e.x+dx,y:e.y+dy,dorm:e.dorm});break}});m.en=m.en.concat(extra)}return m};
/* رقم قياسي مستقل لكل وضع (ما نلمس رقم «عادي») */
const _mdLoad=emLoad;emLoad=function(){if(!(EM.endless&&!EM.daily&&EM.mode&&EM.mode!=='n'))return _mdLoad.apply(this,arguments);
  const keep=store.get('ember_endless'),r=_mdLoad.apply(this,arguments);keep?store.set('ember_endless',keep):store.del('ember_endless');
  const k=mdBestKey(EM.mode),b=store.get(k)||{best:0};if(EM.floor+1>b.best)store.set(k,{best:EM.floor+1});return r};
const _mdEnd=emEndRun;emEndRun=function(){if(!(EM.endless&&!EM.daily&&EM.mode&&EM.mode!=='n'))return _mdEnd.apply(this,arguments);const R=EM;if(ST.busy)return;ST.busy=1;saCaught();stFlash(.7,'#ff2a2a');ST.shake=1;
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{$('#fade').classList.remove('on');ST.busy=0;const b=store.get(mdBestKey(R.mode))||{best:0};
    showCard('انتهت الرحلة · '+mdInfo(R.mode).n,'وصلت الطابق '+(R.floor+1)+' · أفضل رقم بهذا الوضع: '+Math.max(b.best,R.floor+1),4400,()=>stExit(true))},700)},450)};
const _mdObj=emObjective;emObjective=function(){const t=_mdObj();return EM.endless&&EM.mode&&EM.mode!=='n'?mdInfo(EM.mode).n+' · '+t:t};
/* زر اختيار الوضع (ينقّل بين الأوضاع) */
function mdRefresh(){const b=$('#mdBtn');if(!b)return;const m=mdInfo(MD.cur),best=(store.get(MD.cur==='n'?'ember_endless':mdBestKey(MD.cur))||{}).best;
  $('#mdName').textContent=m.n;$('#mdInfo').textContent=m.d+(best?' · أفضل: '+best:'')}
(function(){const c=$('#enBtn');if(!c||!c.parentNode)return;const b=document.createElement('button');b.type='button';b.className='mbtn s1';b.id='mdBtn';b.innerHTML='وضع البرج: <b id="mdName"></b> <small id="mdInfo"></small>';c.parentNode.insertBefore(b,c.nextSibling);
  b.addEventListener('click',()=>{MD.cur=MODES[(MODES.findIndex(m=>m.id===MD.cur)+1)%MODES.length].id;store.set('ember_mode',MD.cur);mdRefresh()});
  const old=emRefreshTitle;emRefreshTitle=function(){old();mdRefresh()};mdRefresh()})();
Object.assign(window.__hd||{},{MD,MODES,mdRefresh,emUpdate:(...a)=>emUpdate(...a)});
