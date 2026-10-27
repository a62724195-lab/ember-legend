/* ---------- UI, cinematic, input, main loop ---------- */
function toast(txt,col,big){
  const t=document.createElement('div');t.className='toast'+(big?' big':'');t.textContent=txt;
  if(col){t.style.borderInlineStartColor=col;t.style.color=col;t.style.setProperty('--tc',col)}
  const box=$('#toasts');box.appendChild(t);while(box.children.length>4)box.firstChild.remove();
  setTimeout(()=>t.remove(),3000);
}
function hudObj(){
  const o=$('#obj'),L=curL(),bd=BOSSES[L.boss];
  const head=`<b>${L.sub}: ${L.name}</b> · `;
  const qd=curL().q,qs=G.q.st===1?` · مهمة ${qd.n}: ${qd.item.n} ${G.q.got}/${qd.item.count}`:G.q.st===0?` · <span style="color:#ffd24a">${qd.n} تحتاج مساعدة</span>`:'';
  if(G.won)o.innerHTML=head+(G.hasKey?'<b>ادخل الباب في آخر العرين</b>':'<b>خذ المفتاح من الزعيم</b>');
  else if(G.boss.state!=='sleep'&&!G.boss.dead)o.innerHTML=head+`اهزم ${bd.n}`+qs;
  else if(G.gate)o.innerHTML=head+`ادخل البوابة الشرقية وواجه ${bd.n}`+qs;
  else o.innerHTML=head+`اكسر الختم: اقتل ${G.goal} وحش (${Math.min(G.kills,G.goal)}/${G.goal})`+qs;
}
let lastHud='';
function hud(){
  const k=[P.hp|0,P.maxhp,G.lvl,G.xp,G.gold,G.pots,G.boss.hp|0,G.kills,CAMP.shards,G.q.st,G.q.got,G.hasKey,G.won].join();
  if(k===lastHud)return;lastHud=k;
  $('#lvl').textContent=G.lvl;$('#hpt').textContent=`${Math.ceil(P.hp)} / ${P.maxhp}`;
  $('#hpf').style.width=(P.hp/P.maxhp*100)+'%';$('#xpf').style.width=(G.xp/xpNeed()*100)+'%';
  $('#gold').textContent=G.gold;$('#pots').textContent=G.pots;$('#shards').textContent=(CAMP.shards||0)+'/5';
  $('#bossf').style.width=(G.boss.hp/G.boss.mhp*100)+'%';hudObj();
}
function hudFast(){$('#dashf').style.width=(P.dashCd>0?(1-P.dashCd/.75)*100:100)+'%';const sk=P.skillCd>0?(1-P.skillCd/SKILL_CD)*100:100;$('#skillf').style.width=sk+'%';$('#skillbtn').classList.toggle('ready',sk>=100)}
function updBadge(){const n=bag.filter(it=>score(it)>score(eq[it.slot])+.01).length;const b=$('#badge');b.hidden=!n;b.textContent=n}
function drawPortrait(){
  const c=$('#face').getContext('2d');c.clearRect(0,0,14,14);
  const hc=eq.helm?GC[eq.helm.rar]:'#2b1d14',cc=eq.chest?(eq.chest.rar?GC[eq.chest.rar]:'#c9b58a'):'#c9b58a';
  c.fillStyle=cc;c.fillRect(2,10,10,4);c.fillStyle='#00000030';c.fillRect(2,13,10,1);
  c.fillStyle='#e0b08a';c.fillRect(4,3,6,7);c.fillStyle=hc;c.fillRect(3,1,8,3);c.fillRect(3,3,1,5);c.fillRect(10,3,1,5);
  if(eq.helm){c.fillStyle='#ffffff55';c.fillRect(4,1,3,1);c.fillStyle=GC[eq.helm.rar];c.fillRect(6,0,2,1)}
  if(eq.amulet){c.fillStyle=GC[eq.amulet.rar];c.fillRect(6,11,2,2)}
  c.fillStyle='#1a1210';c.fillRect(5,6,1,1);c.fillRect(8,6,1,1);c.fillStyle='#a2594a';c.fillRect(6,8,2,1);
}
/* dialogue */
function say(lines,cb){dlg={lines,i:0,cb};state='dialog';keys={};showDlg()}
let tw=null;
function showDlg(){
  const l=dlg.lines[dlg.i];$('#dwho').textContent=l[0];$('#dlg').hidden=false;
  const el=$('#dtxt'),full=l[1];let n=0;clearInterval(tw);el.textContent='';dlg.full=full;dlg.typing=true;
  tw=setInterval(()=>{n+=2;el.textContent=full.slice(0,n);if(n%8===0&&!ST.on)tone(480+Math.random()*80,.03,'square',.012);if(n>=full.length){clearInterval(tw);if(dlg)dlg.typing=false}},26);
}
function nextDlg(){
  if(!dlg)return;
  if(dlg.typing){clearInterval(tw);$('#dtxt').textContent=dlg.full;dlg.typing=false;return}
  dlg.i++;
  if(dlg.i>=dlg.lines.length){$('#dlg').hidden=true;state='play';const cb=dlg.cb;dlg=null;cb&&cb()}else showDlg();
}
$('#dlg').addEventListener('pointerdown',e=>{e.preventDefault();nextDlg()});
/* inventory */
let sel=null;
function itemTile(it,i,src){
  const better=src==='bag'&&score(it)>score(eq[it.slot])+.01;
  const main=it.kind==='weapon'?`ضرر ${it.dmg}`:it.armor?`دفاع ${it.armor}`:'تميمة';
  return `<button type="button" class="it r${it.rar}${sel&&sel.src===src&&sel.i===i?' sel':''}" data-src="${src}" data-i="${i}">${ico(it.type,it.rar)}<span class="n">${it.name}</span><span class="m">${main}</span>${better?'<span class="up">▲</span>':''}</button>`;
}
function renderInv(){
  const s=P.s,dps=eq.weapon.dmg/(eq.weapon.cd/(1+s.aspd))*(1+.06*(G.lvl-1))*(1+s.bdmg);
  $('#sum').innerHTML=`<span>مستوى <b>${G.lvl}</b></span><span>ضرر/ث <b>${dps.toFixed(1)}</b></span><span>دفاع <b>${P.armor}</b></span><span>صحة <b>${P.maxhp}</b></span><span>حرجة <b>${LR(Math.round((.05+s.crit)*100)+'%')}</b></span><span>ذهب <b>${G.gold}</b></span>`;
  $('#eqg').innerHTML=SLOTS.map(k=>eq[k]?itemTile(eq[k],k,'eq'):`<div class="it empty">${SLOTN[k]}: فاضي</div>`).join('');
  $('#bagh').textContent=`الحقيبة (${bag.length}/30)`;
  $('#bagg').innerHTML=bag.length?bag.map((it,i)=>itemTile(it,i,'bag')).join(''):'<div class="hint">الحقيبة فاضية. اقتل الوحوش وافتح الصناديق.</div>';
  renderDetail();updBadge();
}
function renderDetail(){
  const d=$('#detail');let it=null;if(sel)it=sel.src==='bag'?bag[sel.i]:eq[sel.i];
  if(!it){d.removeAttribute('style');d.className='';d.innerHTML='<div class="hint">اختر قطعة عشان تشوف تفاصيلها وتقارنها بالملبوس.</div>';return}
  d.className='r'+it.rar;const cur=eq[it.slot],cmp=sel.src==='bag';
  const diff=(a,b,dec)=>{const x=a-b;if(Math.abs(x)<.05)return'';return` <span class="${x>0?'up':'dn2'}">(${x>0?'+':''}${x.toFixed(dec)})</span>`};
  let lines=[];
  if(it.kind==='weapon'){lines.push(`الضرر <b>${it.dmg}</b>`+(cmp&&cur?diff(it.dmg,cur.dmg||0,1):''));lines.push(`السرعة <b>${(1/it.cd).toFixed(1)}</b> ضربة/ث`+(cmp&&cur?diff(1/it.cd,1/cur.cd,1):''))}
  else if(it.armor)lines.push(`الدفاع <b>${it.armor}</b>`+(cmp?diff(it.armor,cur?cur.armor||0:0,0):''));
  for(const k in it.stats)lines.push(STATL[k](it.stats[k]));
  let verdict='';if(cmp){const a=score(it),b=score(cur);verdict=a>b+.01?'<span class="up">أفضل من الملبوس ▲</span>':'<span class="dn2">أضعف من الملبوس ▼</span>'}
  d.innerHTML=`<div class="dn">${it.name}</div><div class="hint">${RAR[it.rar].n} · ${SLOTN[it.slot]} · مستوى ${it.ilvl}</div>${lines.map(l=>`<div class="dl">${l}</div>`).join('')}<div class="dl">${verdict}</div>`+(cmp?`<div class="dact"><button class="btn primary" style="font-size:15px;padding:6px 18px" type="button" data-act="equip">ألبسه</button><button class="btn" type="button" data-act="sell">بيع بـ ${it.value} ذهب</button></div>`:'');
}
function equip(i){
  const it=bag[i];if(!it)return;const old=eq[it.slot];
  eq[it.slot]=it;G.dirty=true;bag.splice(i,1);if(old&&old.id)bag.push(old);
  sel={src:'eq',i:it.slot};recompute();SFX.chest();renderInv();hud();
}
function autoEquip(){let n=0;
  for(let i=bag.length-1;i>=0;i--){const it=bag[i];if(it&&score(it)>score(eq[it.slot])+.01){equip(i);n++;i=bag.length}}
  if(n)toast('لبست أفضل ما عندك',RCOL[2]);renderInv();
}
function sellWeak(){let g=0,n=0;
  for(let i=bag.length-1;i>=0;i--){const it=bag[i];if(score(it)<=score(eq[it.slot])+.01){g+=it.value;n++;bag.splice(i,1)}}
  if(n){G.gold+=g;SFX.coin();toast(`بعت ${n} قطعة بـ ${g} ذهب`,'#e8b64a');sel=null;G.dirty=true}else toast('ما في قطع أضعف تنباع','#a69784');renderInv();hud();
}
function openInv(){if(state!=='play')return;state='inv';sel=null;$('#inv').hidden=false;renderInv()}
function closeInv(){$('#inv').hidden=true;if(state==='inv')state='play'}
$('#bagbtn').onclick=()=>state==='inv'?closeInv():openInv();
$('#invClose').onclick=closeInv;$('#autoEq').onclick=autoEquip;$('#sellBtn').onclick=sellWeak;
$('#inv').addEventListener('click',e=>{
  const b=e.target.closest('[data-src]');
  if(b){const src=b.dataset.src;sel={src,i:src==='bag'?+b.dataset.i:b.dataset.i};renderInv();return}
  const a=e.target.closest('[data-act]');
  if(a&&sel&&sel.src==='bag'){
    if(a.dataset.act==='equip')equip(sel.i);
    else{const it=bag[sel.i];G.gold+=it.value;bag.splice(sel.i,1);sel=null;SFX.coin();renderInv();hud()}
  }else if(e.target.id==='inv')closeInv();
});
$('#shop').addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(b)buy(b.dataset.buy)});
$('#shopClose').onclick=closeShop;
function setMute(m){muted=m;if(AC){m?AC.suspend():AC.resume()}document.querySelectorAll('.mutebtn').forEach(b=>b.textContent='الصوت: '+(muted?'مكتوم':'يعمل'))}
document.querySelectorAll('.mutebtn').forEach(b=>b.onclick=()=>setMute(!muted));
function drinkPot(){
  if(state!=='play'||G.pots<=0||P.hp>=P.maxhp)return;if(P.potCd>0){toast(`الجرعة جاهزة بعد ${Math.ceil(P.potCd)} ث`,'#a69784');return}
  G.pots--;const h=P.maxhp*.35;P.hp=Math.min(P.maxhp,P.hp+h);P.potCd=4.5;SFX.potion();
  floatText(P.x,P.y-14,'+'+Math.round(h),'#6fd36f');burst(P.x,P.y,10,'#6fd36f');hud();
}
function openPause(){if(state!=='play')return;saveGame();state='pause';keys={};$('#pause').hidden=false}
function resumeGame(){$('#pause').hidden=true;$('#help').hidden=true;if(state==='pause')state=ST.on?'story':'play'}
function toggleFS(){
  const d=document;if(d.fullscreenElement){d.exitFullscreen&&d.exitFullscreen();return}
  const el=d.documentElement;
  try{const p=el.requestFullscreen&&el.requestFullscreen();if(p&&p.catch)p.catch(()=>toast('المتصفح ما سمح بملء الشاشة، جرب F11','#a69784'));else toast('جرب F11 لملء الشاشة','#a69784')}catch(e){toast('جرب F11 لملء الشاشة','#a69784')}
}
/* ---------- cinematic + chapters ---------- */
let cine=null;
function runCine(segs,cb){
  $('#hud').hidden=true;$('#dlg').hidden=true;$('#toasts').innerHTML='';$('#title').hidden=true;$('#pause').hidden=true;$('#prompt').hidden=true;
  state='cine';keys={};cine={segs,i:0,t:0,cb};$('#cine').hidden=false;
  $('#fade').classList.add('on');requestAnimationFrame(()=>requestAnimationFrame(()=>$('#fade').classList.remove('on')));
  cineSeg(0);
}
function cineSeg(i){cine.i=i;cine.t=0;const s=cine.segs[i],cap=$('#ccap');cap.textContent=s.t;cap.style.animationDuration=s.d+'s';cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in')}
function cineNext(){if(!cine)return;cine.i>=cine.segs.length-1?endCine():cineSeg(cine.i+1)}
function updateCine(dt){
  G.time+=dt;cine.t+=dt;ambient(dt);
  const s=cine.segs[cine.i],k=Math.min(1,cine.t/s.d),e=k*k*(3-2*k);
  G.cam.x=clamp(s.a[0]+(s.b[0]-s.a[0])*e-W/2,0,MW*T-W);G.cam.y=clamp(s.a[1]+(s.b[1]-s.a[1])*e-H/2,0,MH*T-H);
  if(cine.t>=s.d)cineNext();
}
function endCine(){
  if(!cine)return;const cb=cine.cb;cine=null;$('#fade').classList.add('on');
  setTimeout(()=>{
    $('#cine').hidden=true;$('#hud').hidden=false;state='play';
    G.cam.x=clamp(P.x-W/2,0,MW*T-W);G.cam.y=clamp(P.y-H/2,0,MH*T-H);
    lastHud='';hud();$('#fade').classList.remove('on');cb&&cb();
  },700);
}
const chapCine=L=>L.cine.map(s=>{const p=f=>{const x=Math.round(B.aX*f);return[x*T,B.cy[x]*T-30]};return{d:s.d,t:s.t,a:p(s.f[0]),b:p(s.f[1])}});
function startCine(){runCine(CINE,()=>{toast('WASD للحركة · مسطرة أو كليك للضرب · Shift للدحرجة · R هبّة الجمر','#f1e7d6',true);setTimeout(()=>{if(state==='play')startChapterTalk()},1600)})}
function startChapterTalk(){
  const L=curL();
  say(L.intro,()=>{if(CAMP.ch===0&&eq.weapon.name==='قبضة اليد'){eq.weapon=WOODSW();recompute();SFX.chest();toast('استلمت سيف خشبي','#f1e7d6')}G.dirty=true;saveGame(true)});
}
function showCard(sub,title,ms,cb){
  $('#cardSub').textContent=sub;$('#cardT').textContent=title;const c=$('#card');c.hidden=false;c.style.opacity=0;c.style.transition='opacity .8s';requestAnimationFrame(()=>c.style.opacity=1);
  setTimeout(()=>{c.style.opacity=0;setTimeout(()=>{c.hidden=true;cb&&cb()},800)},ms);
}
function showChapterEnd(){
  const last=CAMP.ch>=LV.length-1,m=Math.floor(CAMP.time/60),s=Math.floor(CAMP.time%60);
  syncCamp();
  $('#endTitle').textContent=last?'انتصرت يا بطل!':`سقط ${BOSSES[curL().boss].n}`;
  $('#endsum').innerHTML=`الوقت ${m}:${String(s).padStart(2,'0')} · وحوش ${CAMP.kills} · مستوى ${G.lvl}<br>غنائم: <span style="color:${RCOL[0]}">${G.found[0]} عادي</span> · <span style="color:${RCOL[1]}">${G.found[1]} نادر</span> · <span style="color:${RCOL[2]}">${G.found[2]} ملحمي</span> · <span style="color:${RCOL[3]}">${G.found[3]} أسطوري</span>`;
  $('#endTxt').textContent=last?'رجع قلب الواحة، وعاد الماء والنور. الجمر ما انطفى بس صار في صفّك.':`الفصل التالي: ${LV[CAMP.ch+1].sub} · ${LV[CAMP.ch+1].name}`;
  $('#nextBtn').textContent=last?'العب من جديد':'الفصل التالي';
  if(last)store.del('ember_save2');else store.set('ember_save2',{v:2,camp:Object.assign({},CAMP,{ch:CAMP.ch+1}),eq,bag,uid,flags,lv:null});
  $('#end').hidden=false;state='end';
}
function nextChapter(){
  $('#end').hidden=true;
  if(CAMP.ch>=LV.length-1){begin();return}
  $('#fade').classList.add('on');
  setTimeout(()=>{CAMP.ch++;loadLevel(CAMP.ch);P.hp=P.maxhp;lastHud='';const L=curL();
    runCine(chapCine(L),()=>{showCard(L.sub,L.name,2200,()=>{if(state==='play')say(L.intro,()=>{saveGame(true)})})})},900);
}
function begin(){initAudio();lastHud='';$('#end').hidden=true;$('#dead').hidden=true;$('#pause').hidden=true;newCampaign();hud();startCine()}
/* ---------- input ---------- */
let helpFrom='title';
function showHelp(from){helpFrom=from;$('#help').hidden=false}
const CODEMAP={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',KeyR:'r',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright',Space:' ',KeyJ:'j',KeyK:'j',ShiftLeft:'shift',ShiftRight:'shift',KeyC:'c'};
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  const c=e.code,k=CODEMAP[c];
  if(c==='Space'||c==='Tab'||k&&k.startsWith('arrow'))e.preventDefault();
  if(c==='KeyF'&&!e.repeat&&!ST.songOn){toggleFS();return}
  if(ST.on&&!e.repeat&&stKey(e,c))return;
  if(state==='cine'){if(c==='Escape'||c==='Enter')endCine();else if(c==='Space'&&!e.repeat)cineNext();return}
  if(state==='title'){if((c==='Enter'||c==='Space')&&$('#help').hidden&&$('#settings').hidden&&!e.repeat)begin();else if(c==='Escape'){$('#help').hidden=true;$('#settings').hidden=true}return}
  if(state==='dialog'){if((c==='Space'||c==='Enter')&&!e.repeat)nextDlg();return}
  if(state==='card'){if(c==='Escape'||c==='KeyE')closeShop();return}
  if(e.repeat)return;
  if(c==='KeyG'){netPing();return}if(/^Digit[1-6]$/.test(c)&&coopOn()){netChat(+c[5]-1);return}
  if(c==='KeyI'||c==='Tab'){state==='inv'?closeInv():openInv();return}
  if(c==='Escape'){
    if(!$('#settings').hidden){$('#settings').hidden=true;return}
    if(!$('#help').hidden){$('#help').hidden=true;return}
    if(state==='inv')closeInv();else if(state==='play')openPause();else if(state==='pause')resumeGame();return}
  if(c==='KeyQ'){drinkPot();return}
  if(c==='KeyE'){interact();return}
  if(c==='KeyR'){useSkill();return}
  if(k){keys[k]=true;lastInput='key'}
});
addEventListener('keyup',e=>{const k=CODEMAP[e.code];if(k)keys[k]=false;if(e.code==='Space')e.preventDefault()});
addEventListener('blur',()=>{keys={};tAtk=false;tAct=false});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys={};if(state==='play')openPause();else if(ST.on&&state==='story')stPause()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b)b.blur()});
function mpos(e){const r=cv.getBoundingClientRect();mouse.sx=(e.clientX-r.left)/r.width*W;mouse.sy=(e.clientY-r.top)/r.height*H;mouse.on=true}
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){lastInput='mouse';mpos(e)}});
cv.addEventListener('pointerleave',()=>{mouse.on=false});
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){lastInput='mouse';mpos(e);tAtk=true}});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse')tAtk=false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
const stick=$('#stick'),thumb=$('#thumb');let sid=null;
function sv(e){const r=stick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=r.width/2-8,l=Math.hypot(dx,dy)||1,k=Math.min(1,l/m);
  tstick.x=dx/l*k;tstick.y=dy/l*k;thumb.style.transform=`translate(${tstick.x*m*.8}px,${tstick.y*m*.8}px)`}
stick.addEventListener('pointerdown',e=>{sid=e.pointerId;stick.setPointerCapture(sid);sv(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===sid)sv(e)});
const sEnd=e=>{if(e.pointerId===sid){sid=null;tstick.x=tstick.y=0;thumb.style.transform=''}};
stick.addEventListener('pointerup',sEnd);stick.addEventListener('pointercancel',sEnd);
$('#tAtk').addEventListener('pointerdown',e=>{tAtk=true;e.target.setPointerCapture(e.pointerId)});
['pointerup','pointercancel'].forEach(n=>$('#tAtk').addEventListener(n,()=>{tAtk=false}));
$('#tAct').addEventListener('pointerdown',()=>{tAct=true});['pointerup','pointercancel'].forEach(n=>$('#tAct').addEventListener(n,()=>{tAct=false}));
$('#tDash').addEventListener('pointerdown',()=>{keys.shift=true;setTimeout(()=>keys.shift=false,90)});
$('#tPot').addEventListener('pointerdown',drinkPot);$('#tSkill').addEventListener('pointerdown',useSkill);$('#skillbtn').onclick=useSkill;
function pollPad(){
  let gp=[];if(!window.__noPad){try{gp=navigator.getGamepads?navigator.getGamepads():[]}catch(e){window.__noPad=1}}let g=null;for(const q of gp)if(q&&q.connected){g=q;break}
  if(!g){padS.x=padS.y=0;pad={};return}
  const dz=v=>Math.abs(v)<.22?0:v,b=i=>!!(g.buttons[i]&&g.buttons[i].pressed);
  padS.x=dz(g.axes[0])+(b(15)?1:0)-(b(14)?1:0);padS.y=dz(g.axes[1])+(b(13)?1:0)-(b(12)?1:0);
  const edge=i=>{const p=b(i),was=pad['p'+i];pad['p'+i]=p;return p&&!was};
  pad.atk=b(0)||b(7);pad.dash=b(1)||b(5);pad.act=b(4);
  if(padS.x||padS.y||pad.atk)lastInput='pad';
  if(!G)return;
  const e2=edge(2),e3=edge(3),e9=edge(9),e0=edge(0),e6=edge(6);if(e6)useSkill();
  if(e2)drinkPot();if(e3){if(state==='inv')closeInv();else openInv()}
  if(e9){if(state==='play')openPause();else if(state==='pause')resumeGame();else if(state==='inv')closeInv();else if(state==='card')closeShop()}
  if(state==='dialog'&&e0)nextDlg();
  if(state==='title'&&e0&&$('#settings').hidden&&$('#help').hidden)begin();
}
let last=0;
function loop(t){
  const dt=Math.min(.05,(t-last)/1000||0);last=t;pollPad();
  if(ST.on){try{stFrame(dt)}catch(e){console.error(e)}requestAnimationFrame(loop);return}
  if(G){
    if(state==='cine'&&cine)updateCine(dt);
    if(state==='title'){G.time+=dt;ambient(dt);G.cam.x=clamp(420-330*Math.cos(t/9000),0,MW*T-W);G.cam.y=clamp(MH*T/2-H/2+Math.sin(t/4000)*50,0,MH*T-H)}
    if(state==='play'){NET.noInput=false;if(G.stop>0)G.stop-=dt;else{const sd=G.slowT>0?.3:1;if(G.slowT>0)G.slowT-=dt;update(dt*sd)}}
    else if(NET.on&&NET.live&&NET.pt0&&(state==='pause'||state==='inv'||state==='dialog'||state==='card'||state==='dead')){NET.noInput=true;update(dt);NET.noInput=false}
    else if(state==='dialog'||state==='card'||state==='inv'||state==='end'){G.time+=dt*.0}
    netTick(dt);draw();drawMini();
  }
  requestAnimationFrame(loop);
}
function fit(){
  const vw=innerWidth||800,vh=innerHeight||600,a=vw/vh;
  if(a>=1){H=vh>=800?324:288;W=Math.min(1000,Math.round(H*a))}else{W=288;H=Math.min(560,Math.round(W/a))}
  SS=wantSS();cv.width=W*SS;cv.height=H*SS;{const dp=Math.min(devicePixelRatio||1,2.5),k=Math.min(dp*Math.max(vw/W,vh/H),4);tcv.width=Math.round(W*k);tcv.height=Math.round(H*k)}fogCv.width=Math.ceil(W*FOGS);fogCv.height=Math.ceil(H*FOGS);ctx.imageSmoothingEnabled=false;
}
new ResizeObserver(fit).observe(document.body);addEventListener('resize',fit);fit();
/* screens */
$('#startbtn').onclick=begin;$('#cskip').onclick=e=>{e.stopPropagation();ST.on&&ST.cin?stCineSkip():endCine()};
$('#view').addEventListener('pointerdown',()=>{if(state==='cine'&&cine)cineNext()});
function refreshCont(){const o=store.get('ember_save2'),b=$('#contBtn');b.hidden=!(o&&o.v===2);if(o&&o.v===2)$('#contInfo').textContent=`الفصل ${o.camp.ch+1} · مستوى ${o.camp.lvl}`}
$('#contBtn').onclick=()=>{initAudio();if(loadGame()){lastHud='';$('#hud').hidden=false;$('#title').hidden=true;state='play';hud();toast('رجعت لمغامرتك','#f1e7d6',true);const L=curL();setTimeout(()=>showCard(L.sub,L.name,1800),300)}else{refreshCont();begin()}};
function syncSettings(){
  $('#sMusic').value=settings.music*100;$('#sSfx').value=settings.sfx*100;
  document.querySelectorAll('#sDiff button').forEach(b=>b.classList.toggle('on',+b.dataset.d===settings.diff));
  document.querySelectorAll('#sQ button').forEach(b=>b.classList.toggle('on',+b.dataset.q===(settings.q|0)));
  [['sShake','shake'],['sDmg','dmg'],['sMap','map']].forEach(([id,k])=>{$('#'+id).classList.toggle('on',settings[k]);$('#'+id).setAttribute('aria-pressed',settings[k])});
}
function showSettings(){initAudio();syncSettings();$('#settings').hidden=false}
$('#setbtn').onclick=showSettings;$('#pSet').onclick=showSettings;$('#setClose').onclick=()=>{$('#settings').hidden=true};
$('#sMusic').oninput=e=>{settings.music=e.target.value/100;applyVol();store.set('ember_settings',settings)};
$('#sSfx').oninput=e=>{settings.sfx=e.target.value/100;applyVol();store.set('ember_settings',settings)};
$('#sSfx').onchange=()=>SFX.coin();
document.querySelectorAll('#sQ button').forEach(b=>b.onclick=()=>{settings.q=+b.dataset.q;store.set('ember_settings',settings);syncSettings()});
document.querySelectorAll('#sDiff button').forEach(b=>b.onclick=()=>{settings.diff=+b.dataset.d;store.set('ember_settings',settings);syncSettings()});
[['sShake','shake'],['sDmg','dmg'],['sMap','map']].forEach(([id,k])=>$('#'+id).onclick=()=>{settings[k]=!settings[k];store.set('ember_settings',settings);syncSettings()});
addEventListener('pointerdown',initAudio,{once:true});
$('#helpbtn').onclick=()=>showHelp('title');$('#pHelp').onclick=()=>showHelp('pause');$('#helpClose').onclick=()=>{$('#help').hidden=true};
$('#fsbtn').onclick=toggleFS;$('#pFs').onclick=toggleFS;
$('#menubtn').onclick=()=>{state==='pause'?resumeGame():openPause()};
$('#potbtn').onclick=drinkPot;$('#resumeBtn').onclick=resumeGame;
$('#pBag').onclick=()=>{$('#pause').hidden=true;state='play';openInv()};
$('#pRestart').onclick=begin;
$('#pMenu').onclick=()=>{if(ST.on){stSave();stExit();return}if(NET.on){netLeaveToMenu();return}saveGame();$('#pause').hidden=true;$('#end').hidden=true;$('#dead').hidden=true;state='title';newCampaign();hud();$('#hud').hidden=true;refreshCont();$('#title').hidden=false};
$('#reviveBtn').onclick=()=>{
  $('#dead').hidden=true;G.gold=Math.floor(G.gold*.75);const rb=G.bonfires[G.resp]||G.bonfires[0];P.x=rb.x;P.y=rb.y+10;P.hp=P.maxhp;P.inv=1.5;
  G.projs.length=0;G.haz.length=0;G.enemies.forEach(e=>{e.aggro=false});
  if(G.boss.state!=='sleep'&&!G.boss.dead){G.boss.state='sleep';G.boss.hp=G.boss.mhp;G.boss.x=G.boss.sx;G.boss.y=G.boss.sy;G.boss.rage=false;G.boss.n=0;$('#bossbar').hidden=true;G.enemies=G.enemies.filter(e=>!e.summoned);hudObj()}
  G.cam.x=clamp(P.x-W/2,0,MW*T-W);G.cam.y=clamp(P.y-H/2,0,MH*T-H);state='play';lastHud='';hud();
};
$('#nextBtn').onclick=nextChapter;$('#endBag').onclick=()=>{$('#end').hidden=true;state='play';openInv()};
$('#endMenu').onclick=()=>$('#pMenu').click();
newCampaign();hud();refreshCont();
window.__g={get G(){return G},get P(){return P},get eq(){return eq},get bag(){return bag},get B(){return B},get CAMP(){return CAMP},get state(){return state},set state(v){state=v},NET,netOpen,netClose,guestEnter,animCv,enemySprite,bossSprite,ESPR,makeItem,genItem,pickup,get keys(){return keys},update,loadLevel,draw,addDrop,dropItem,killEnemy,openChest,showChapterEnd,nextChapter,recompute,say,endCine,begin,saveGame,loadGame};
requestAnimationFrame(loop);
