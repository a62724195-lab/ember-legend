/* =====================================================================
   التحدّي اليومي: نفس طوابق البرج اللانهائي لكل اللاعبين في نفس التاريخ (بذرة = تاريخ اليوم)
   يحفظ أفضل طابق لليوم + سلسلة الأيام المتتالية، ولا يلمس رقم «أفضل طابق» الخاص بالبرج العادي
   ===================================================================== */
const DL={pend:0,seed:0};
function dlToday(){const t=new Date(),n=t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate(),y=new Date(t.getFullYear(),t.getMonth(),t.getDate()-1),p=y.getFullYear()*10000+(y.getMonth()+1)*100+y.getDate();
  return{n,prev:p,seed:(Math.imul(n,2654435761)>>>0)%999999937+1,txt:t.getDate()+'/'+(t.getMonth()+1)+'/'+t.getFullYear()}}
/* بداية محاولة: تحديث السلسلة وتصفير رقم اليوم لو تغيّر التاريخ */
function dlBegin(){const t=dlToday(),d=store.get('ember_daily')||{};
  if(d.last!==t.n){d.streak=d.last===t.prev?(d.streak||0)+1:1;d.last=t.n;d.bestStreak=Math.max(d.bestStreak||0,d.streak)}
  if(d.day!==t.n){d.day=t.n;d.best=0}store.set('ember_daily',d)}
function dlNote(fl){const t=dlToday(),d=store.get('ember_daily')||{};if(d.day!==t.n){d.day=t.n;d.best=0}
  if(fl>(d.best||0))d.best=fl;d.allBest=Math.max(d.allBest||0,fl);store.set('ember_daily',d)}
/* السلسلة تُعرض فقط لو لسا حيّة (لعبت اليوم أو أمس) */
function dlStreak(){const t=dlToday(),d=store.get('ember_daily')||{};return d.last===t.n||d.last===t.prev?(d.streak||0):0}
/* كل المراحل في وضع اليومي تأخذ بذرة اليوم المثبّتة عند البداية (حتى لو عدى منتصف الليل أثناء اللعب) */
const _dlHe=hdEndless;hdEndless=function(fl){if(EM.daily&&DL.seed)EM.eSeed=DL.seed;return _dlHe.apply(this,arguments)};
const _dlStart=emStart;emStart=function(){EM.daily=DL.pend?1:0;DL.pend=0;if(EM.daily){DL.seed=dlToday().seed;dlBegin()}
  const r=_dlStart.apply(this,arguments);if(EM.daily)showCard('التحدّي اليومي',dlToday().txt+' · الطابق 1',2400);return r};
/* رقم «أفضل طابق» للبرج العادي ما يتأثر بالتحدّي اليومي */
const _dlLoad=emLoad;emLoad=function(){if(!EM.daily)return _dlLoad.apply(this,arguments);
  const keep=store.get('ember_endless'),r=_dlLoad.apply(this,arguments);keep?store.set('ember_endless',keep):store.del('ember_endless');dlNote(EM.floor+1);return r};
const _dlEnd=emEndRun;emEndRun=function(){if(!EM.daily)return _dlEnd.apply(this,arguments);const R=EM;if(ST.busy)return;ST.busy=1;saCaught();stFlash(.7,'#ff2a2a');ST.shake=1;
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{$('#fade').classList.remove('on');ST.busy=0;const d=store.get('ember_daily')||{};
    showCard('انتهى تحدّي اليوم','وصلت الطابق '+(R.floor+1)+' · أفضل رقم اليوم: '+Math.max(d.best||0,R.floor+1)+(dlStreak()>1?' · سلسلتك: '+dlStreak()+' أيام':''),4600,()=>stExit(true))},700)},450)};
const _dlObj=emObjective;emObjective=function(){const t=_dlObj();return EM.daily?'يومي · '+t:t};
/* زر القائمة */
function dlRefresh(){const b=$('#dlBtn');if(!b)return;const t=dlToday(),d=store.get('ember_daily')||{},s=dlStreak();
  $('#dlInfo').textContent=(d.day===t.n&&d.best?'أفضل طابق اليوم: '+d.best:'نفس الطوابق لكل اللاعبين اليوم')+(s>1?' · 🔥'+s:'')}
(function(){const c=$('#enBtn')||$('#emCont');if(!c||!c.parentNode)return;const b=document.createElement('button');b.type='button';b.className='mbtn s1';b.id='dlBtn';b.innerHTML='التحدّي اليومي <small id="dlInfo"></small>';c.parentNode.insertBefore(b,c.nextSibling);
  b.addEventListener('click',()=>{DL.pend=1;emStart(true,true)});
  const old=emRefreshTitle;emRefreshTitle=function(){old();dlRefresh()};dlRefresh()})();
Object.assign(window.__hd||{},{DL,dlToday,dlBegin,dlNote,dlStreak,dlRefresh,emDie:w=>emDie(w),emEndRun:()=>emEndRun(),emNext:()=>emNext(),emStartNow:(f,e)=>emStart(f,e)});
