/* ---------- story: frame, drawing, UI wiring ---------- */
function stSay(lines,cb){say(lines,()=>{if(ST.on&&state==='play')state='story';cb&&cb()})}
const INTRO=()=>[{d:6.5,paint:'road',rp:[0,.5],cap:'قرية الغدير... ثلاثة أيام على ظهر الجمل.'},
  {d:7,paint:'road',rp:[.5,1],cap:'وصلتني ورقة من أختي ريم: «الصوت يناديني يا راشد... تعال قبل لا أنسى اسمي».'},
  {d:11,scene:'village',walk:[50,184,326,184],cap:'الليلة وصلت... وما استقبلني أحد.',on:()=>{ST.x=50;ST.y=184;ST.fx=1;if(ST.cin)ST.cin.sceneChanged=0}}];
function stCineUpdate(dt){const c=ST.cin;if(!c)return;c.t+=dt;const s=c.shots[c.i];if(!s)return;
  if(c.t>=(s.d||5)){stCineNext();return}
  if(s.walk){const k=clamp(c.t/s.d,0,1),e=k<.08?k/.08*.08:k;ST.x=s.walk[0]+(s.walk[2]-s.walk[0])*k;ST.y=s.walk[1]+(s.walk[3]-s.walk[1])*k;ST.mv=1;ST.wt+=dt;ST.fx=s.walk[2]>=s.walk[0]?1:-1;{const sc=ST.sc,lead=s.lead||0;ST.cam.x=clamp(ST.x-W*.25,0,sc.w*T-W);ST.cam.y=clamp(ST.y-H/2,0,Math.max(0,sc.h*T-H))}}
  else if(s.a){const k=clamp(c.t/s.d,0,1),e=k*k*(3-2*k),sc=ST.sc,mw=sc.w*T,mh=sc.h*T;
    let tx=s.a[0]+(s.b[0]-s.a[0])*e-W/2,ty=s.a[1]+(s.b[1]-s.a[1])*e-H/2;
    tx=mw<=W?(mw-W)/2:clamp(tx,0,mw-W);ty=mh<=H?(mh-H)/2:clamp(ty,0,mh-H);ST.cam.x=tx;ST.cam.y=ty}}
function stUpdate(dt){
  ST.t+=dt;
  if(ST.flash>0)ST.flash=Math.max(0,ST.flash-dt*1.6);ST.shake=Math.max(0,ST.shake-dt*2);if(ST.jump>0)ST.jump-=dt;if(ST.darkT>0)ST.darkT-=dt;
  ST.wh.forEach(w=>w.t+=dt);ST.wh=ST.wh.filter(w=>w.t<w.life);
  saTick(dt,ST.mv>.5&&!sneaking()&&state==='story'&&!ST.cin&&!ST.busy||!!(ST.cin&&ST.cin.shots[ST.cin.i]&&ST.cin.shots[ST.cin.i].walk));
  if(ST.cin){stCineUpdate(dt);if(ST.bd)rbUpdate(dt);return}
  if(state!=='story'||ST.busy){ST.mv*=.85;return}
  let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tstick.x+padS.x,iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+tstick.y+padS.y;
  const il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il}const moving=il>.12;
  ST.mv+=((moving?1:0)-ST.mv)*Math.min(1,dt*10);
  const sn=sneaking();if(moving){const sp=sn?28:58;stMove(ix*sp*dt,iy*sp*dt);if(Math.abs(ix)>.1)ST.fx=ix>0?1:-1;ST.wt+=dt}
  if(ST.id==='village'&&ST.x<2.6*T){ST.x=2.6*T;if(!ST.bT||ST.t-ST.bT>6){ST.bT=ST.t;toast('ما أقدر أرجع... ريم تحتاجني','#a69784')}}
  ST.near=stNear();
  const pr=$('#prompt');if(ST.near){const o=ST.near,lb=o.lab||{lamp:'أشعل الفانوس',mem:'المس الذكرى',note:'اقرأ',key:'خذ',trap:'افتح الفتحة',closet:'افتح الخزانة',pool:'ناد ريم'}[o.k]||'تفاعل';$('#promptT').textContent=lb;pr.hidden=false}else pr.hidden=true;
  $('#tAct').hidden=!ST.near;
  if(tAct&&!ST.tAp)stInteract();ST.tAp=tAct;
  for(const o of ST.sc.objs){if(o.k!=='door')continue;if(o.ok&&!o.ok())continue;if(moving&&Math.hypot(o.x-ST.x,o.y-ST.y)<o.r){saDoor();stGoto(o.to,o.sx,o.sy);break}}
  if(ST.sh.on)stShadeUpdate(dt);
  if(ST.ec)ecUpdate(dt,moving,sn);if(ST.bd)rbUpdate(dt);
  for(const k in ST.bellT)if(ST.bellT[k]>0)ST.bellT[k]-=dt;
  stClampCam(false)}
/* ---------- drawing ---------- */
const _vg={};
function stLights(dt){const sc=ST.sc,L=[],t=ST.t,fl=Math.sin(t*11)*.03+Math.sin(t*23)*.02;
  L.push({x:ST.x,y:ST.y,r:ST.sc.theme==='ext'?56:60,a:1,col:'#ffc878',gl:.2});
  for(const o of sc.objs){
    if(o.k==='lamp'&&ST.lit[o.id])L.push({x:o.x,y:o.y-10,r:56*(1+fl+.03*Math.sin(t*3+o.x)),a:1,col:'#ffcf80',gl:.28});
    else if(o.k==='glow')L.push({x:o.x,y:o.y,r:o.lr*(1+fl*1.5),a:.95,col:o.col,gl:.2})}
  if(sc.id==='village'&&ST.act>=2)L.push({x:23*T,y:12*T,r:38,a:.5,col:'#6ae0ff',gl:.2});
  if(ST.bd)L.push({x:ST.bd.x,y:ST.bd.y-4,r:46,a:.9,col:'#cfeaff',gl:.22});
  for(const o of sc.objs)if(o.k==='brazier'&&(ST.lit[o.id]||o.on))L.push({x:o.x,y:o.y-6,r:60*(1+fl),a:1,col:'#ffb060',gl:.3});
  if(sc.id==='well'&&ST.heart)for(let i=0;i<7;i++){const a=i/7*6.28+t*.4;L.push({x:11*T+Math.cos(a)*54,y:8*T+Math.sin(a)*40,r:34,a:.9,col:'#ffd890',gl:.3})}
  return L}
function stDraw(dt){
  const sc=ST.sc;if(!sc)return;
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=false;
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);
  const c0=ST.cin&&ST.cin.shots[ST.cin.i];
  if(c0&&c0.paint){paintSky(c0,clamp(ST.cin.t/c0.d,0,1),ST.t);ST.cinPaint=1;return}
  ST.cinPaint=0;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const shk=ST.shake>0?ST.shake*3:0;
  cx=rp(ST.cam.x+(shk?rr(-shk,shk):0));cy=rp(ST.cam.y+(shk?rr(-shk,shk):0));
  ctx.drawImage(sc.bake,-cx,-cy);
  /* door visuals for interior scenes */
  for(const o of sc.objs){if(o.k!=='door'||sc.theme==='ext'||o.nv)continue;const sx=rp(o.x-cx),sy=rp(o.y-cy);
    if(o.to==='village'||o.to==='hD'||o.to==='cellar'||o.to==='well'){ctx.fillStyle='#1a0f08';ctx.fillRect(sx-9,sy-14,18,18);ctx.fillStyle='#5a3a22';ctx.fillRect(sx-8,sy-13,16,17);ctx.fillStyle='#3a2414';ctx.fillRect(sx-1,sy-13,2,17);ctx.fillStyle='#c8a050';ctx.fillRect(sx+4,sy-5,2,2)}}
  /* drowned shadows + glints */
  const glint=(x,y,col)=>{const a=.55+.45*Math.sin(ST.t*4+x),sx=rp(x-cx),sy=rp(y-cy);ctx.globalAlpha=a;ctx.fillStyle=col;ctx.fillRect(sx-1,sy-3,2,6);ctx.fillRect(sx-3,sy-1,6,2);ctx.globalAlpha=1};
  /* y-sorted entities */
  const E=[];sc.tall.forEach(t=>E.push({y:t.y,f:()=>t.k==='p'?drawPalm(t.x,t.y,ST.t):t.k==='W'?drawWellBig(sc):t.k==='L'?drawLampPost(t.x,t.y,!!ST.lit[t.id]):drawTall2(t)}));
  E.push({y:ST.y+8,f:stHero});if(ST.bd)E.push({y:ST.bd.y+8,f:drawBuddy});
  E.sort((a,b)=>a.y-b.y);E.forEach(e=>e.f());
  /* lights / fog */
  const Ls=stLights(dt),dk=Math.max(ST.darkT>0?.965:0,ST.dark!==null?ST.dark:sc.dark)*(ST.heart&&sc.id==='well'?.6:1),f=fctx,tc3=rgb(sc.tint);
  f.setTransform(FOGS,0,0,FOGS,0,0);f.globalCompositeOperation='source-over';f.clearRect(0,0,W,H);
  f.fillStyle=`rgba(${tc3[0]|0},${tc3[1]|0},${tc3[2]|0},${dk})`;f.fillRect(0,0,W,H);f.globalCompositeOperation='destination-out';
  for(const l of Ls)light(f,l.x-cx,l.y-cy,l.r,l.a);
  f.globalCompositeOperation='source-over';
  ctx.imageSmoothingEnabled=true;ctx.drawImage(fogCv,0,0,fogCv.width,fogCv.height,0,0,W,H);ctx.imageSmoothingEnabled=false;
  ctx.save();ctx.globalCompositeOperation='lighter';for(const l of Ls)glowAdd(l.x-cx,l.y-cy,l.r*.8,l.col,l.gl);ctx.restore();
  /* glints (visible in the dark) */
  for(const o of sc.objs){if(!o.r||o.k==='glow'||o.k==='door')continue;if(o.ok&&!o.ok())continue;if(o.k==='mem'&&ST.mem[o.id])continue;
    if(o.k==='lamp'){if(!ST.lit[o.id])glint(o.x,o.y-4,'#ffd890');continue}
    if(o.k==='note'&&ST.flags['u_'+o.id])continue;if(o.k==='key'||o.k==='trap'&&ST.flags.key&&!ST.flags.open)glint(o.x,o.y,'#ffd24a');else if(o.k==='mem')glint(o.x,o.y,'#9fe8ff');else if(o.k==='note')glint(o.x,o.y,'#fff0c8');else if(o.k==='pool')glint(o.x,o.y-20,'#9fe8ff')}
  /* ghost girl */
  if(sc.id==='well')drawReem();
  if(ST.flags.c2)ch2Post();
  if(ST.sh.on||ST.sh.show)drawShade();
  if(ST.jump>0)drawJump();
  /* post */
  const vk=W+'x'+H;if(!_vg[vk]){const c=mkCv(W,H),q=c.getContext('2d'),g=q.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,Math.max(W,H)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');q.fillStyle=g;q.fillRect(0,0,W,H);_vg[vk]=c}
  ctx.drawImage(_vg[vk],0,0);
  if(ST.sh.on){const d=Math.hypot(ST.sh.x-ST.x,ST.sh.y-ST.y);if(d<130){ctx.fillStyle=`rgba(130,0,10,${(1-d/130)*.3*(.6+.4*Math.sin(ST.t*9))})`;ctx.fillRect(0,0,W,H)}}
  if(ST.flash>0){ctx.globalAlpha=Math.min(1,ST.flash);ctx.fillStyle=ST.flashC||'#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  /* whispers + labels (crisp overlay) */
  ST.wh.forEach(w=>{if(w.t<0)return;const k=w.t/w.life,a=Math.sin(k*Math.PI);tctx.globalAlpha=a*.85;TX(w.txt,w.x+Math.sin(w.t*2)*3,w.y-w.t*4,'#b9c6ff',12);tctx.globalAlpha=1});
  const nm=sc.name;if(ST.t<4&&ST.nameT!==nm){ST.nameT=nm;ST.nameAt=ST.t}
}
function stHero(){const X=ST.x,Y=ST.y,w=Math.sin(ST.wt*13)*ST.mv,f=ST.fx,sx=rp(X-cx),sy=rp(Y-cy),bob=-Math.abs(w)*1.2,lean=w*.5,P_=(x,y,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,ww,hh)};
  ctx.fillStyle='#00000040';ctx.beginPath();ctx.ellipse(sx,sy+7,6,2.3,0,0,7);ctx.fill();
  const l1=-Math.max(0,w)*2,l2=-Math.max(0,-w)*2;
  P_(sx-4-w*1.1,sy+3+l1,3,5-l1*.4,'#4a3a2a');P_(sx+1+w*1.1,sy+3+l2,3,5-l2*.4,'#4a3a2a');
  const bx=sx+lean,by=sy+bob;
  P_(bx-5,by-4,10,9,'#efe6d2');P_(bx-5,by+2,10,3,'#d8cdb4');P_(bx-5,by-4,2,9,'#00000012');P_(bx-5,by+1,10,1,'#8a6a40');
  P_(bx-6,by-1+w*1.5,2,4,'#e0b08a');P_(bx+4,by-1-w*1.5,2,4,'#e0b08a');
  P_(bx-4,by-11,8,7,'#d9a47e');P_(bx-5,by-12,10,5,'#f4efe2');P_(bx-5,by-12,10,1,'#fff');P_(bx-5,by-8,10,1,'#1a1612');P_(bx-6,by-10,2,7,'#f4efe2');P_(bx+4,by-10,2,7,'#f4efe2');
  P_(bx+(f>0?1:-3),by-8,2,2,'#1a1210');
  /* lantern in hand */
  const lx=bx+f*7,ly=by+1+Math.sin(ST.t*7)*.6*ST.mv;P_(lx-1,ly-4,2,3,'#4a3a2a');P_(lx-2,ly-1,4,5,'#ffcf7a');P_(lx-1,ly,2,3,'#fff4c8')}
function drawShade(){const s=ST.sh,d=Math.hypot(s.x-ST.x,s.y-ST.y),a=s.show?.9:clamp(1.2-d/180,.22,.95),sx=rp(s.x-cx),sy=rp(s.y-cy),t=ST.t*3+(s.wt||0);
  ctx.save();ctx.globalAlpha=a*.5;const g=ctx.createRadialGradient(sx,sy-10,2,sx,sy-10,26);g.addColorStop(0,'rgba(60,10,110,.55)');g.addColorStop(1,'rgba(60,10,110,0)');ctx.fillStyle=g;ctx.fillRect(sx-28,sy-38,56,56);
  ctx.globalAlpha=a;ctx.fillStyle='#07040c';ctx.beginPath();ctx.moveTo(sx-4,sy-27);ctx.quadraticCurveTo(sx-7,sy-20,sx-8,sy-8);
  for(let i=0;i<5;i++){const x=sx-8+i*4,y=sy+2+Math.sin(t*1.4+i*1.7)*2.4;ctx.lineTo(x,y);ctx.lineTo(x+2,y-4)}
  ctx.lineTo(sx+8,sy-8);ctx.quadraticCurveTo(sx+7,sy-20,sx+4,sy-27);ctx.quadraticCurveTo(sx,sy-31,sx-4,sy-27);ctx.fill();
  ctx.strokeStyle='#3a1260';ctx.lineWidth=.7;ctx.stroke();
  ctx.fillStyle='#07040c';ctx.fillRect(sx-12,sy-18+Math.sin(t)*1.5,5,1.6);ctx.fillRect(sx+7,sy-17+Math.cos(t)*1.5,5,1.6);
  const ef=.6+.4*Math.sin(t*5);ctx.globalAlpha=Math.min(1,a+.1)*ef;ctx.fillStyle='#d8f4ff';ctx.fillRect(sx-3,sy-22,2,2);ctx.fillRect(sx+1,sy-22,2,2);
  ctx.restore()}
function drawJump(){const k=ST.jump/.7,sx=W/2,sy=H*.55,sc=1+(1-k)*1.6;ctx.save();ctx.globalAlpha=Math.min(1,k*2);ctx.fillStyle='#030106';ctx.beginPath();ctx.ellipse(sx,sy,26*sc,48*sc,0,0,7);ctx.fill();ctx.fillStyle='#e8fbff';ctx.fillRect(sx-12*sc,sy-14*sc,7*sc,4*sc);ctx.fillRect(sx+5*sc,sy-14*sc,7*sc,4*sc);ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx,sy+12*sc,8*sc,14*sc,0,0,7);ctx.fill();ctx.restore()}
function drawReem(){if(ST.flags.fin&&!ST.cin)return;const sx=rp(11*T-cx),sy=rp(7.4*T-cy+Math.sin(ST.t*1.6)*2),a=.7+.2*Math.sin(ST.t*2);
  ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-8,2,sx,sy-8,30);g.addColorStop(0,'rgba(150,230,255,.55)');g.addColorStop(1,'rgba(150,230,255,0)');ctx.fillStyle=g;ctx.fillRect(sx-32,sy-40,64,64);ctx.restore();
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#1a1624';ctx.fillRect(sx-5,sy-17,10,6);ctx.fillRect(sx-6,sy-14,2,12+Math.sin(ST.t*2)*1.5);ctx.fillRect(sx+4,sy-14,2,12+Math.cos(ST.t*2)*1.5);
  ctx.fillStyle='#e8f6ff';ctx.fillRect(sx-4,sy-11,8,4);ctx.fillRect(sx-5,sy-8,10,9);ctx.fillRect(sx-6,sy+1,12,3+Math.sin(ST.t*3));ctx.fillStyle='#d9a47e';ctx.fillRect(sx-3,sy-14,6,4);ctx.fillStyle='#1a1210';ctx.fillRect(sx-2,sy-13,1,1);ctx.fillRect(sx+1,sy-13,1,1);ctx.restore()}
function stFrame(dt){
  if(ST.emOn){hdFrame(dt)}else if(ST.rcOn){rcUpdate(dt);rcDraw(dt)}else if(ST.songOn)songFrame(dt);else{stUpdate(dt);stDraw(dt)}
  if(ST.cinPaint)return;
  /* HUD */
  const sh=ST.cin||state!=='story';$('#stHud').hidden=!!ST.cin||!!ST.songOn;$('#stBtns').hidden=!!ST.cin;
  const tx=`${ST.emOn?EM.m.name:ST.rcOn?'سراديب الخان':ST.songOn?'أغنية سلمى':ST.sc.name}\n${stObjective()}${sneaking()?'  · تسلّل':''}\n${ST.emOn?'ذخائر سرّية '+EM.relics+'/4':ST.flags.c2?'أصداء '+echoCount()+'/3':'ذكريات '+memCount()+'/7'}`;if(tx!==ST._hud){ST._hud=tx;const p=tx.split('\n');$('#stHn').textContent=p[0];$('#stHo').textContent=p[1];$('#stHm').textContent=p[2]}
}
/* ---------- start / exit / pause / journal ---------- */
function stRefreshTitle(){emRefreshTitle();const sv=store.get(STKEY);{const b=$('#story2Btn');if(b)b.hidden=!store.get('ember_story_done')}$('#storyCont').hidden=!sv;if(sv)$('#storyInfo').textContent=`ذكريات ${Object.keys(sv.mem||{}).length}/7`}
function stStart(fresh){initAudio();
  const sv=!fresh&&store.get(STKEY);
  ST.flags=sv?sv.flags:{};ST.notes=sv?sv.notes:[];ST.mem=sv?sv.mem:{};ST.act=sv?sv.act:1;ST.lit=sv?sv.lit:{l0:1,l1:1,l2:1,l3:1,l4:1,l5:1};
  ST.emOn=false;emUI(false);ST.rcOn=false;ST.songOn=false;ST.ec=null;ST.bd=null;ST.snk=0;ST.bellT={};ST.on=true;ST.cin=null;ST.busy=0;ST.wh=[];ST.flash=0;ST.heart=0;ST.darkT=0;ST.jump=0;ST._hud='';
  ['#title','#pause','#help','#settings','#coop','#end','#dead','#card','#stJ','#stCh'].forEach(s=>$(s)&&($(s).hidden=true));$('#hud').hidden=true;$('#dlg').hidden=true;$('#cine').hidden=true;
  document.body.classList.add('story');ch2UI(!!ST.flags.c2);stAmb(true);keys={};
  if(sv){stLoad(sv.id,sv.x,sv.y,1);ST.ck=sv.ck||{id:sv.id,x:sv.x,y:sv.y};state='story';toast('رجعت للغدير','#f1e7d6',true)}
  else{stLoad('village');state='story';
    stCine(INTRO(),()=>{showCard('الفصل الأول','الغدير الصامت',2600,()=>{stSay([['راشد','قرية الغدير... الفوانيس مشتعلة، بس ما في صوت. ولا نفس.'],['راشد','ريم! ...ريم؟ السلام عليكم! أحد هنا؟'],['راشد','ما في جواب. أبدأ بالبيوت... بيت أم سعيد أول.']],()=>stSave())})})}
}
function stExit(done){HD.cine=null;ch2UI(false);emUI(false);ST.emOn=false;ST.rcOn=false;ST.songOn=false;SG.on=false;document.body.classList.remove('song');$('#songPad').hidden=true;ST.on=false;ST.cin=null;stAmb(false);document.body.classList.remove('story');
  ['#stJ','#stCh','#pause','#prompt','#dlg','#cine'].forEach(s=>$(s)&&($(s).hidden=true));$('#stHud').hidden=true;$('#stBtns').hidden=true;$('#tAct').hidden=true;
  $('#fade').classList.remove('on');state='title';keys={};refreshCont();stRefreshTitle();$('#title').hidden=false}
function stPause(){if(state!=='story'||ST.cin||ST.busy)return;state='pause';keys={};$('#pause').hidden=false}
function stJournal(){if(state!=='story'||ST.cin||ST.busy)return;
  const N={},M={};Object.keys(SCENES).forEach(k=>{try{SCENES[k]().objs.forEach(o=>{if(o.k==='note')N[o.id]=o;if(o.k==='mem')M[o.id]=o})}catch(e){}});
  let h='';ST.notes.forEach(id=>{const o=N[id];if(o)h+=`<div class="jn"><b>${o.lines[0][0]}</b><p>${o.lines[0][1]}</p></div>`});
  Object.keys(ST.mem).forEach(id=>{const o=M[id];if(o)h+=`<div class="jn mm"><b>ذكرى</b><p>${o.lines[0][1]}</p></div>`});
  $('#stJl').innerHTML=h||'<p class="hint">ما لقيت شي بعد. استكشف البيوت.</p>';state='journal';$('#stJ').hidden=false}
function stKey(e,c){
  if(state==='talk'){hdTalkKey(c);return true}
  if(state==='puzzle'){hdPzKey(c);return true}
  if(state==='ctl'){if(c==='Escape')ctlClose();return true}
  if(state==='dialog')return false;
  if(ST.cin){if(c==='Escape'||c==='Enter'||c==='Space')stCineSkip();return true}
  if(state==='choice'){const n=+(c.replace('Digit',''));const b=$('#stChB').children[n-1];if(b)b.click();return true}
  if(state==='journal'){if(c==='Escape'||c==='KeyJ'||c==='Enter'||c==='Space'||c==='KeyI'||c==='Tab'){$('#stJ').hidden=true;state='story'}return true}
  if(state==='pause'){if(c==='Escape'){$('#pause').hidden=true;state='story'}return c==='Escape'}
  if(state==='story'){
    if(ST.emOn){if(c==='KeyR'){emFlare();return true}if(c==='Space'){if(EM.near&&!EM.near.hint)stInteract();else emDash();return true}if(c==='KeyQ'){emDash();return true}if(c==='KeyF'||c==='KeyJ'){emThrow();return true}if(c==='KeyE'||c==='Enter'){stInteract();return true}if(c==='Escape'){stPause();return true}return false}
    if(ST.songOn){const l=songLane(c);if(l>=0){songPress(l);return true}if(c==='Escape'){stPause();return true}return true}
    if(c==='KeyE'||c==='Space'||c==='Enter'){stInteract();return true}
    if(c==='Escape'){stPause();return true}
    if(c==='KeyJ'||c==='KeyI'||c==='Tab'){stJournal();return true}
    return false}
  return false}
$('#storyBtn').onclick=()=>stStart(true);
$('#storyCont').onclick=()=>stStart(false);
$('#stJb').onclick=stJournal;$('#stPb').onclick=stPause;$('#stJc').onclick=()=>{$('#stJ').hidden=true;state='story'};
stRefreshTitle();
window.__st={ST,SCENES,stStart,stLoad,stCine,stCineSkip,stUse,stNear,stGoto,stFrame,stUpdate,stDraw,stScareLamps,stFinal,stEndGood,stEndRun,memCount,stObjective,stShadeSpawn,stSave};
