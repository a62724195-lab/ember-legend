/* =====================================================================
   حركات سريعة: اندفاع (Space/Q) + الجامور (F) يُرمى ويرجع
   ===================================================================== */
const MV={dashT:.2,dashSp:9.6,dashCd:.85,dashCost:4,invT:.34,jmRange:7.5,jmOut:15,jmBack:19,jmCost:3,jmCd:.3};
function mvInput(){let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tstick.x+padS.x,iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+tstick.y+padS.y;const l=Math.hypot(ix,iy);return l>.15?[ix/l,iy/l]:null}
function mvOk(){return ST.emOn&&state==='story'&&!ST.cin&&!ST.busy&&!HD.cine}
function emDash(){const R=EM;if(!mvOk()||(R.dashCd||0)>0||R.dashT>0)return;
  if(R.E<MV.dashCost+2){toast('الجمر أضعف من أن يندفع','#ff7a4a',true);R.dashCd=.4;return}
  const v=mvInput()||[Math.cos(R.a),Math.sin(R.a)];R.dx=v[0];R.dy=v[1];R.a=Math.atan2(v[1],v[0]);const vi=R.etype==='violet';R.dashT=MV.dashT*(vi?1.15:1);R.dashCd=vi?.5:MV.dashCd;R.inv=vi?.62:MV.invT;R.E-=vi?2:MV.dashCost;
  if(Math.abs(v[0])>Math.abs(v[1])*.7){R.fd='s';R.flip=v[0]<0?1:0}else R.fd=v[1]>0?'d':'u';
  if(SA.n){saNoise(.28,'bandpass',900,1.2,.38,null,3600);saTone(240,90,.2,'triangle',.08)}
  stFlash(.12,'#ffcf8a');emTip('dash','الاندفاع يجعلك تعبر الأعداء لحظة قصيرة. Space أو Q')}
function emThrow(){const R=EM;if(!mvOk()||R.jm||(R.jmCd||0)>0)return;
  if(R.E<MV.jmCost+6){toast('الجمر أضعف من أن يُرمى','#ff7a4a',true);R.jmCd=.4;return}
  const a=R.a;R.jm={x:R.x,y:R.y,vx:Math.cos(a),vy:Math.sin(a),d:0,back:0,hit:{},got:0,tr:[]};R.E-=MV.jmCost;
  if(SA.n){saNoise(.22,'highpass',2200,.8,.3,null,6000);saTone(520,220,.15,'triangle',.06)}
  emTip('jam','الجامور: F ترميه فيرجع لك. يشلّ الأعداء ويلمّ الجمرات ويشعل النيران')}
function mvTick(dt){const R=EM,m=R.m;if(!R.m)return;
  if(R.dashT>0){R.dashT-=dt;R.fx.push({x:R.x,y:R.y,vx:rr(-.4,.4),vy:rr(-.4,.4),life:0,max:rr(.35,.6)})}
  if(R.dashCd>0)R.dashCd-=dt;if(R.inv>0)R.inv-=dt;if(R.jmCd>0)R.jmCd-=dt;
  const J=R.jm;
  if(J){J.tr.push([J.x,J.y]);if(J.tr.length>8)J.tr.shift();
    if(!J.back){const sp=MV.jmOut*dt,nx=J.x+J.vx*sp,ny=J.y+J.vy*sp;J.d+=sp;if(emSolid(nx,ny)||J.d>=MV.jmRange*(R.etype==='gold'?1.6:1)){J.back=1;if(SA.n&&emSolid(nx,ny))saTone(900,500,.08,'square',.05)}else{J.x=nx;J.y=ny}}
    else{const dx=R.x-J.x,dy=R.y-J.y,d=Math.hypot(dx,dy)||1,sp=Math.min(d,MV.jmBack*dt);J.x+=dx/d*sp;J.y+=dy/d*sp;if(d<.65){R.jm=null;R.jmCd=MV.jmCd;if(J.got){R.E=Math.min(100,R.E+J.got*(R.etype==='green'?38:25));saChime&&saChime()}return}}
    for(const e of R.en){if(e.st==='dorm'||e.away>0||J.hit[e.t.toFixed(3)+e.k])continue;if(Math.hypot(e.x-J.x,e.y-J.y)<.85){J.hit[e.t.toFixed(3)+e.k]=1;
      if(e.k==='weeper'){e.away=6}else if(e.k==='hunter'||e.k==='snuffer'||e.k==='hound'){e.stun=Math.max(e.stun||0,R.etype==='blue'?6:3.2)}
      stFlash(.25,'#ffd890');ST.shake=Math.max(ST.shake,.4);if(SA.n){saBoom&&saBoom(.3);saTone(700,300,.1,'square',.07)}
      for(let i=0;i<8;i++)R.fx.push({x:e.x,y:e.y,vx:rr(-1.4,1.4),vy:rr(-1.4,1.4),life:0,max:rr(.4,.9)});if(R.etype!=='gold')J.back=1}}
    for(const it of m.items){if(it.gone)continue;
      if(it.k==='coal'&&Math.hypot(it.x-J.x,it.y-J.y)<.9){it.gone=1;J.got++;if(SA.n)saIgnite&&saIgnite()}
      else if(it.k==='brazier'&&!it.lit&&!it.bk&&Math.hypot(it.x-J.x,it.y-J.y)<1.1){it.lit=true;if(SA.n)saIgnite&&saIgnite();toast('الجامور أشعل النار','#ffb060',true);J.back=1}}}}
function hdJamGlow(ox,oy,t){const R=EM,J=R.jm;if(!J)return;const x=J.x*HT-ox,y=J.y*HT-oy-8,px=R.x*HT-ox,py=R.y*HT-oy-14;
  ctx.save();ctx.globalCompositeOperation='lighter';
  // السلسلة
  const n=9;for(let i=1;i<n;i++){const k=i/n,cx=px+(x-px)*k,cy=py+(y-py)*k+Math.sin(k*Math.PI)*2.5;ctx.fillStyle=`rgba(255,${170+k*60|0},90,${.35+.4*k})`;ctx.fillRect(cx-1,cy-1,2.4,2.4)}
  for(let i=0;i<J.tr.length;i++){const p=J.tr[i],a=i/J.tr.length;ctx.globalAlpha=a*.55;ctx.fillStyle='#ffb050';ctx.fillRect(p[0]*HT-ox-2,p[1]*HT-oy-10,4*a+1,4*a+1)}
  ctx.globalAlpha=1;glowAdd(x,y,26,'#ff8a2a',.9);ctx.fillStyle='#fff3c8';ctx.beginPath();ctx.arc(x,y,3.6,0,7);ctx.fill();
  ctx.strokeStyle='rgba(255,230,160,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,5.4+Math.sin(t*30)*.6,0,7);ctx.stroke();ctx.restore()}
/* دمج مع الحلقة الرئيسية */
const __mvu=emUpdate;emUpdate=function(dt){__mvu(dt);if(EM.m){mvTick(dt);const a=$('#tPot'),b=$('#tAtk');if(a&&ST.emOn)a.classList.toggle('cd',(EM.dashCd||0)>0);if(b&&ST.emOn)b.classList.toggle('cd',!!EM.jm||(EM.jmCd||0)>0)}};
(function(){const st=document.createElement('style');st.textContent='html body.story.em #tPot,html body.story.em #tAtk{display:block!important;width:62px;height:62px;font-size:13px}html body.story.em #tPot.cd,html body.story.em #tAtk.cd{filter:brightness(.55) saturate(.7)}';document.head.appendChild(st);
  const hook=(id,fn)=>{const el=$(id);if(!el)return;['pointerdown','click'].forEach(ev=>el.addEventListener(ev,e=>{if(!ST.emOn)return;e.stopImmediatePropagation();e.preventDefault();if(ev==='pointerdown')fn()},true))};
  hook('#tPot',emDash);hook('#tAtk',emThrow)})();
Object.assign(window.__hd||{},{MV,emDash,emThrow,mvTick});
