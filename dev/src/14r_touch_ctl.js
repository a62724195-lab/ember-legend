/* =====================================================================
   تخصيص أزرار اللمس: اسحب العصا والأزرار لأي مكان، غيّر الحجم والشفافية، بدّل اليد
   ===================================================================== */
const CTL={ids:['stick','tAct','tSkill','tDash','tPot','tAtk'],base:{stick:104,tAct:70,tSkill:62,tDash:62,tPot:56,tAtk:66},names:{stick:'العصا',tAct:'تفاعل',tSkill:'وهج',tDash:'إخفاء',tPot:'جرعة',tAtk:'اضرب'},cfg:null,edit:0,drag:null,prev:null,prevState:null};
(function(){const st=document.createElement('style');st.textContent=`
#ctlEd{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:70;width:min(94vw,460px);direction:rtl;background:linear-gradient(180deg,rgba(40,22,12,.96),rgba(16,9,6,.97));border:1px solid #ff9a40;border-radius:14px;padding:10px 14px;box-shadow:0 10px 40px #000c;color:#f6e3c6;font-family:inherit;display:grid;gap:8px}
#ctlEd[hidden]{display:none}
#ctlEd.min{width:min(70vw,250px);padding:6px 8px}#ctlEd.min label,#ctlEd.min small,#ctlEd.min #ceSw,#ctlEd.min #ceRs,#ctlEd.min b{display:none}
#ctlEd b{color:#ffd9a0;font-size:16px}#ctlEd small{color:#c9a070;font-size:12px;display:block}
#ctlEd label{display:grid;grid-template-columns:86px 1fr;align-items:center;gap:8px;font-size:13px}
#ctlEd input[type=range]{width:100%;accent-color:#ff9a40;height:26px}
#ctlEd .rw{display:flex;gap:8px;flex-wrap:wrap}
#ctlEd button{font:inherit;cursor:pointer;background:rgba(50,28,16,.95);border:1px solid #6a3c1c;color:#f2dcc0;border-radius:10px;padding:8px 12px;font-size:13px;flex:1}
#ctlEd button.ok{background:linear-gradient(90deg,#ff8a3a,#ffc070);color:#2a1206;border-color:#ffd9a0;font-weight:700}
html body.ctl-edit #touch{display:flex!important;pointer-events:none}
html body.ctl-edit #stick,html body.ctl-edit .tb[data-ce]{outline:2px dashed #ffb060;outline-offset:3px;cursor:grab}
html body.ctl-edit .tb:not([data-ce]){display:none!important}
html body.ctl-edit #tAct[data-ce],html body.ctl-edit #tSkill[data-ce],html body.ctl-edit #tDash[data-ce],html body.ctl-edit #tPot[data-ce],html body.ctl-edit #tAtk[data-ce]{display:block!important}
html body.ctl-edit #stick::after,html body.ctl-edit .tb[data-ce]::after{content:attr(data-nm);position:absolute;left:50%;top:-20px;transform:translateX(-50%);font-size:11px;color:#ffd9a0;background:#000b;padding:1px 7px;border-radius:8px;white-space:nowrap;pointer-events:none}
`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='ctlEd';d.hidden=true;d.innerHTML='<div><b>تخصيص أزرار اللمس</b><small>اسحب العصا أو أي زر لمكانه. التغييرات تنحفظ تلقائياً.</small></div><label>حجم العصا<input type="range" id="ceS" min="70" max="170" value="100"></label><label>حجم الأزرار<input type="range" id="ceB" min="70" max="170" value="100"></label><label>الشفافية<input type="range" id="ceO" min="25" max="100" value="100"></label><div class="rw"><button id="ceTg" type="button">▲ صغّر</button><button id="ceSw" type="button">⇄ بدّل اليد</button><button id="ceRs" type="button">الأصل</button><button id="ceOk" class="ok" type="button">تم</button></div>';document.body.appendChild(d)})();
function ctlLoad(){CTL.cfg=store.get('ember_ctl')||null}
function ctlSave(){if(CTL.cfg)store.set('ember_ctl',CTL.cfg);else store.del('ember_ctl')}
function ctlRel(){const b=document.body.classList;if(b.contains('story')){if(b.contains('em'))return['stick','tAct','tSkill','tDash','tPot','tAtk'];if(b.contains('ch2'))return['stick','tAct','tDash'];return['stick','tAct']}return['stick','tAct','tSkill','tDash','tPot','tAtk']}
function ctlApply(){const c=CTL.cfg;
  for(const id of CTL.ids){const el=document.getElementById(id);if(!el)continue;
    if(!c){el.removeAttribute('style');if(id==='stick'){const t=document.getElementById('thumb');if(t)t.removeAttribute('style')}continue}
    const isS=id==='stick',sz=Math.round(CTL.base[id]*(isS?c.ss:c.bs)),p=c.pos&&c.pos[id];
    el.style.width=el.style.height=sz+'px';el.style.opacity=c.op;
    if(!isS){el.style.fontSize=Math.max(10,Math.round(sz*.22))+'px';el.style.padding='0'}
    else{const t=document.getElementById('thumb');if(t){const ts=Math.round(sz*.44);t.style.width=t.style.height=ts+'px';t.style.margin=`${-ts/2}px 0 0 ${-ts/2}px`}}
    if(p){el.style.position=CTL.edit&&!isS?'fixed':'fixed';el.style.left=Math.round(p.x*innerWidth-sz/2)+'px';el.style.top=Math.round(p.y*innerHeight-sz/2)+'px';el.style.right='auto';el.style.bottom='auto';el.style.margin='0';el.style.zIndex=4;el.style.gridArea='auto'}}}
function ctlPos(id,x,y){if(!CTL.cfg)CTL.cfg={ss:1,bs:1,op:1,pos:{}};if(!CTL.cfg.pos)CTL.cfg.pos={};CTL.cfg.pos[id]={x:Math.min(.95,Math.max(.05,x)),y:Math.min(.95,Math.max(.08,y))};ctlApply()}
function ctlDef(id){const L=innerWidth>innerHeight*1.15,b=document.body.classList,st=b.contains('story');
  const T={stick:L?[.1,.72]:[.2,.86],tAct:L?[.8,.56]:[.7,.7],tSkill:L?[.91,.74]:[.86,.86],tDash:L?[.79,.84]:[.67,.9],tPot:L?[.7,.62]:[.52,.76],tAtk:L?[.91,.56]:[.86,.66]};
  if(!st){T.tAtk=L?[.91,.7]:[.86,.84];T.tSkill=L?[.79,.84]:[.67,.9];T.tDash=L?[.68,.72]:[.5,.9];T.tAct=L?[.8,.54]:[.7,.7]}
  const p=T[id];return{x:p[0],y:p[1]}}
function ctlInit(){CTL.cfg=CTL.cfg||{ss:1,bs:1,op:1,pos:{}};const rel=ctlRel();CTL.ids.forEach(id=>{const el=document.getElementById(id);if(!el)return;if(rel.includes(id)){el.dataset.ce='1';el.dataset.nm=(document.body.classList.contains('em')&&{tPot:'اندفاع',tAtk:'جامور'}[id])||CTL.names[id]}else delete el.dataset.ce});ctlSync();
  rel.forEach(id=>{if(!CTL.cfg.pos[id]){const d=ctlDef(id);ctlPos(id,d.x,d.y)}});ctlApply()}
function ctlOpen(){if(CTL.edit)return;CTL.edit=1;CTL.dirty=0;CTL.hadCfg=!!CTL.cfg;CTL.prevState=state;CTL.prev=['#pause','#settings','#title','#help'].filter(s=>$(s)&&!$(s).hidden);CTL.prev.forEach(s=>$(s).hidden=true);state='ctl';keys={};
  document.body.classList.add('ctl-edit');$('#ctlEd').hidden=false;ctlInit()}
function ctlSync(){const c=CTL.cfg||{ss:1,bs:1,op:1};$('#ceS').value=Math.round(c.ss*100);$('#ceB').value=Math.round(c.bs*100);$('#ceO').value=Math.round(c.op*100)}
function ctlClose(){if(!CTL.edit)return;CTL.edit=0;CTL.drag=null;if(!CTL.dirty&&!CTL.hadCfg)CTL.cfg=null;ctlSave();document.body.classList.remove('ctl-edit');$('#ctlEd').hidden=true;CTL.ids.forEach(id=>{const el=document.getElementById(id);if(el)delete el.dataset.ce});
  (CTL.prev||[]).forEach(s=>$(s).hidden=false);if(state==='ctl')state=CTL.prevState||'pause';ctlApply()}
document.addEventListener('pointerdown',e=>{if(!CTL.edit)return;const el=e.target.closest&&e.target.closest('#stick,.tb[data-ce]');if(!el)return;e.stopPropagation();e.preventDefault();CTL.drag={id:el.id,pid:e.pointerId}},true);
document.addEventListener('pointermove',e=>{const d=CTL.drag;if(!CTL.edit||!d||e.pointerId!==d.pid)return;e.preventDefault();CTL.dirty=1;ctlPos(d.id,e.clientX/innerWidth,e.clientY/innerHeight)},true);
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,e=>{if(CTL.drag&&e.pointerId===CTL.drag.pid){CTL.drag=null;ctlSave()}},true));
$('#ceS').addEventListener('input',e=>{CTL.dirty=1;CTL.cfg.ss=+e.target.value/100;ctlApply();ctlSave()});
$('#ceB').addEventListener('input',e=>{CTL.dirty=1;CTL.cfg.bs=+e.target.value/100;ctlApply();ctlSave()});
$('#ceO').addEventListener('input',e=>{CTL.dirty=1;CTL.cfg.op=+e.target.value/100;ctlApply();ctlSave()});
$('#ceSw').addEventListener('click',()=>{CTL.dirty=1;const p=(CTL.cfg&&CTL.cfg.pos)||{};for(const k in p)p[k].x=1-p[k].x;ctlApply();ctlSave()});
$('#ceRs').addEventListener('click',()=>{CTL.cfg=null;CTL.dirty=0;CTL.hadCfg=0;ctlApply();store.del('ember_ctl');ctlInit()});
$('#ceOk').addEventListener('click',ctlClose);
$('#ceTg').addEventListener('click',()=>{const d=$('#ctlEd');d.classList.toggle('min');$('#ceTg').textContent=d.classList.contains('min')?'▼ كبّر':'▲ صغّر'});
/* أزرار الدخول: القائمة الموقوفة + الإعدادات */
(function(){const mk=()=>{const b=document.createElement('button');b.type='button';b.className='mbtn';b.id='';b.textContent='تخصيص أزرار اللمس';b.addEventListener('click',ctlOpen);return b};
  const ps=$('#pSet');if(ps&&ps.parentNode)ps.parentNode.insertBefore(mk(),ps.nextSibling);
  const sc=$('#setClose');if(sc&&sc.parentNode)sc.parentNode.insertBefore(mk(),sc)})();
ctlLoad();addEventListener('resize',()=>ctlApply());addEventListener('orientationchange',()=>setTimeout(ctlApply,200));
if(CTL.cfg){requestAnimationFrame(ctlApply)}
Object.assign(window.__hd||{},{CTL,ctlOpen,ctlClose,ctlApply});window.__ctl={CTL,ctlOpen,ctlClose,ctlApply,ctlPos};
