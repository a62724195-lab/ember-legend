/* =====================================================================
   الراحة: اهتزاز الجوال · وضع التصوير/البثّ · وضع اليد الواحدة
   ===================================================================== */
const PH={on:0,frozen:0,cfg:Object.assign({hap:1,one:0},store.get('ember_comfort')||{})};
function phSave(){store.set('ember_comfort',PH.cfg)}
/* ---- الاهتزاز ---- */
let _vibT=0;function vib(p){if(!PH.cfg.hap||!navigator.vibrate)return;const n=performance.now();if(n-_vibT<45)return;_vibT=n;try{navigator.vibrate(p)}catch(e){}}
[['saFlare',[22,30,40]],['saChime',12],['saDoor',[30,40,30]],['saCaught',[110,50,200]],['saIgnite',18],['saLampOff',14]].forEach(([n,p])=>{try{const o=eval(n);eval(n+'=function(){vib('+JSON.stringify(p)+');return o.apply(this,arguments)}')}catch(e){console.warn('hap',n,e)}});
try{const o=saBoom;saBoom=function(v){vib(Math.round(30+30*Math.min(1.5,v||1)));return o.apply(this,arguments)}}catch(e){}
try{const o=emDash;emDash=function(){const b=EM.dashT>0;const r=o.apply(this,arguments);if(!b&&EM.dashT>0)vib(16);return r}}catch(e){}
try{const o=emThrow;emThrow=function(){const b=!!EM.jm;const r=o.apply(this,arguments);if(!b&&EM.jm)vib(12);return r}}catch(e){}
try{const o=hdBossHurt;hdBossHurt=function(){vib([50,30,70]);return o.apply(this,arguments)}}catch(e){}
try{const o=emDie;emDie=function(){vib([120,60,220]);return o.apply(this,arguments)}}catch(e){}
/* ---- وضع التصوير ---- */
(function(){const st=document.createElement('style');st.textContent=`
html body.photo #hud,html body.photo #stHud,html body.photo #stBtns,html body.photo #toasts,html body.photo #prompt,html body.photo #touch,html body.photo #embBadge,html body.photo #mm,html body.photo #obj,html body.photo #updBn{display:none!important}
#phBar{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));inset-inline-start:8px;z-index:60;display:flex;gap:6px;direction:rtl;opacity:.9;transition:opacity .5s}
#phBar[hidden]{display:none}#phBar.dim{opacity:.18}
#phBar button{font:inherit;font-size:13px;cursor:pointer;background:rgba(20,12,8,.82);color:#f2dcc0;border:1px solid #6a3c1c;border-radius:10px;padding:7px 11px}
#phBar button.on{background:#ff9a40;color:#2a1206;border-color:#ffd9a0}
#phFl{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:70;transition:opacity .35s}`;document.head.appendChild(st);
  const b=document.createElement('div');b.id='phBar';b.hidden=true;b.innerHTML='<button id="phX" type="button">✕ خروج</button><button id="phS" type="button">📷 حفظ صورة</button><button id="phF" type="button">❄ تجميد</button>';document.body.appendChild(b);
  const fl=document.createElement('div');fl.id='phFl';document.body.appendChild(fl);
  let dimT=0;const wake=()=>{b.classList.remove('dim');clearTimeout(dimT);dimT=setTimeout(()=>b.classList.add('dim'),3000)};
  window.phSet=function(on){PH.on=on?1:0;if(!on)PH.frozen=0;document.body.classList.toggle('photo',!!on);b.hidden=!on;$('#phF').classList.toggle('on',!!PH.frozen);$('#phF').textContent=PH.frozen?'▶ تحرير':'❄ تجميد';if(on){['#pause','#settings'].forEach(s=>{const e=$(s);if(e&&!e.hidden)e.hidden=true});if(state==='pause')state='story';wake();toast&&0}};
  b.addEventListener('pointerdown',e=>e.stopPropagation());addEventListener('pointerdown',()=>{if(PH.on)wake()},true);
  $('#phX').onclick=()=>phSet(0);
  $('#phF').onclick=()=>{if(!ST.emOn)return;PH.frozen=!PH.frozen;$('#phF').classList.toggle('on',!!PH.frozen);$('#phF').textContent=PH.frozen?'▶ تحرير':'❄ تجميد'};
  $('#phS').onclick=()=>{try{const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const q=c.getContext('2d');q.drawImage(cv,0,0);q.drawImage(tcv,0,0,c.width,c.height);
    c.toBlob(bl=>{const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='ember-legend-'+Date.now()+'.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)},'image/png');
    fl.style.opacity=.85;setTimeout(()=>fl.style.opacity=0,120)}catch(e){console.warn(e)}};
  addEventListener('keydown',e=>{const t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    if(e.key==='Escape'&&PH.on){e.stopPropagation();e.preventDefault();phSet(0);return}
    if((e.key==='p'||e.key==='P')&&(state==='story'||state==='play')&&!e.ctrlKey&&!e.metaKey){e.preventDefault();phSet(!PH.on)}},true);
})();
/* خفي الواجهة المرسومة بالكانفس */
const _emUpPH=emUpdate;emUpdate=function(dt){if(PH.frozen)return;return _emUpPH.apply(this,arguments)};
/* ---- وضع اليد الواحدة ---- */
function oneApply(){const m=PH.cfg.one;
  if(!m){const pv=store.get('ember_ctl_prev');if(CTL.cfg&&CTL.cfg._one){CTL.cfg=pv||null;CTL.cfg?store.set('ember_ctl',CTL.cfg):store.del('ember_ctl');ctlApply();ctlInit&&0}return}
  if(CTL.cfg&&!CTL.cfg._one)store.set('ember_ctl_prev',CTL.cfg);
  const L=innerWidth>innerHeight*1.15,P=L?{stick:[.82,.72],tAct:[.60,.50],tSkill:[.62,.80],tDash:[.74,.44],tPot:[.46,.66],tAtk:[.50,.88]}:{stick:[.78,.84],tAct:[.52,.64],tSkill:[.52,.86],tDash:[.80,.62],tPot:[.28,.74],tAtk:[.30,.9]};
  CTL.cfg={ss:.88,bs:1.05,op:.92,pos:{},_one:1};CTL.ids.forEach(id=>{const p=P[id];CTL.cfg.pos[id]={x:m===2?1-p[0]:p[0],y:p[1]}});ctlSave();ctlApply()}
/* ---- أزرار الإعدادات ---- */
(function(){const set=document.querySelector('#settings .set');if(!set)return;
  const row=(lbl,node)=>{const s=document.createElement('span');s.innerHTML=lbl;set.appendChild(s);set.appendChild(node)};
  const hb=document.createElement('button');hb.type='button';hb.className='tg';hb.setAttribute('aria-label','اهتزاز الجوال');hb.classList.toggle('on',!!PH.cfg.hap);hb.onclick=()=>{PH.cfg.hap=PH.cfg.hap?0:1;hb.classList.toggle('on',!!PH.cfg.hap);phSave();if(PH.cfg.hap){_vibT=0;vib([30,40,30])}};
  row('اهتزاز الجوال <small style="color:var(--dim)">(للجوال فقط)</small>',hb);
  const sg=document.createElement('div');sg.className='seg';sg.innerHTML='<button type="button" data-o="0">إيقاف</button><button type="button" data-o="1">يمين</button><button type="button" data-o="2">يسار</button>';
  const sync=()=>sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.o===PH.cfg.one));
  sg.querySelectorAll('button').forEach(x=>x.onclick=()=>{PH.cfg.one=+x.dataset.o;phSave();sync();oneApply()});sync();
  row('وضع اليد الواحدة <small style="color:var(--dim)">(كل الأزرار قرب إبهامك)</small>',sg);
  const pb=document.createElement('button');pb.type='button';pb.className='mbtn';pb.textContent='وضع التصوير والبث (P)';pb.onclick=()=>phSet(1);
  const ps=$('#pSet');if(ps&&ps.parentNode)ps.parentNode.insertBefore(pb.cloneNode(true),ps.nextSibling).onclick=()=>phSet(1);
  const sc=$('#setClose');if(sc&&sc.parentNode)sc.parentNode.insertBefore(pb,sc)})();
setTimeout(()=>{if(PH.cfg.one)oneApply()},400);
Object.assign(window.__hd||{},{PH,phSet,vib,oneApply});
