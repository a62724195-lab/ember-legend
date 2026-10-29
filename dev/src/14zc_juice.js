/* =====================================================================
   إحساس القتال: توقّف لحظي عند الضربة، دفعة كاميرا، موجة صدمة، شرر، صوت أثقل،
   وأثر للاندفاع، و«نجاة بالاندفاع» (تباطؤ + مكافأة صغيرة). كله طبقة فوق الموجود بدون تغيير القواعد
   (ما عدا مكافأة النجاة: يرجع لك جمر الاندفاع).
   ===================================================================== */
const JU={fr:0,slow:0,pcd:0,rings:[],ghosts:[],on:()=>ST.emOn&&state==='story'&&!ST.cin&&!HD.cine&&EM.m};
const JU_K={ /* fr=توقّف · sh=اهتزاز · r=نصف قطر الموجة · n=شرر · z=دفعة زوم */
  jam:{fr:.05,sh:.55,r:34,n:10,z:.025,c:'#ffd890',snd:.4},
  flare:{fr:.07,sh:.7,r:46,n:12,z:.03,c:'#ffe0a0',snd:.55},
  boss:{fr:.13,sh:1.5,r:78,n:26,z:.07,c:'#ffb060',snd:1},
  heart:{fr:.2,sh:1.7,r:110,n:34,z:.09,c:'#ff8a40',snd:1.2},
  perfect:{fr:0,sh:.2,r:40,n:8,z:.04,c:'#9fe8ff',snd:.3}};
function juImpact(kind,x,y){const K=JU_K[kind],R=EM;if(!K)return;
  JU.fr=Math.max(JU.fr,K.fr);ST.shake=Math.max(ST.shake||0,K.sh);if(HD.cam)HD.cam.z=(HD.cam.z||1)+K.z;
  JU.rings.push({x,y,t:0,max:.38,r:K.r,c:K.c});JU.rings.push({x,y,t:0,max:.22,r:K.r*.55,c:'#ffffff'});
  for(let i=0;i<K.n;i++){const a=Math.random()*6.283,s=rr(1.2,3.6);R.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0,max:rr(.3,.8)})}
  if(SA.n){const v=K.snd;saTone(150,40,.22,'sine',.55*v);saNoise(.25,'bandpass',2600,1.4,.3*v,null,700);saTone(880,330,.09,'square',.05*v)}}
/* حلقة التحديث: توقّف الضربة + التباطؤ + كشف الأحداث */
const _juU=emUpdate;emUpdate=function(dt){const R=EM;
  if(!JU.on()||!ST.emOn){return _juU.call(this,dt)}
  JU.rings=JU.rings.filter(r=>(r.t+=dt)<r.max);JU.ghosts=JU.ghosts.filter(g=>(g.t+=dt)<g.max);if(JU.pcd>0)JU.pcd-=dt;
  if(JU.fr>0){JU.fr-=dt;return}
  let sd=dt;if(JU.slow>0){JU.slow-=dt;sd=dt*.35}
  const J=R.jm,n0=J?Object.keys(J.hit).length:0,B=R.bs,bhp=B?B.hp:0,H=R.hp,hhp=H?H.hp:0;
  _juU.call(this,sd);
  if(!R.m)return;
  if(J&&R.jm===J||J&&!R.jm){if(Object.keys(J.hit).length>n0)juImpact('jam',J.x,J.y)}
  if(H&&R.hp===H&&H.hp<hhp&&R.m.arena)juImpact('heart',R.m.arena.hx,R.m.arena.hy);
  /* أثر الاندفاع */
  if(R.dashT>0)JU.ghosts.push({x:R.x,y:R.y,t:0,max:.28});
  /* نجاة بالاندفاع: عدو متحرّك لامسك وأنت في لحظة الحصانة */
  if(R.inv>0&&R.dashT>0&&JU.pcd<=0&&!ST.busy){const e=R.en.find(e=>e.st!=='dorm'&&!(e.stun>0)&&!(e.away>0)&&Math.hypot(e.x-R.x,e.y-R.y)<.95);
    if(e){JU.pcd=1.4;JU.slow=.45;R.dashCd=0;R.E=Math.min(100,R.E+MV.dashCost+1);juImpact('perfect',R.x,R.y);stFlash(.25,'#9fe8ff');if(SA.n&&saChime)saChime();toast('نجاة!','#9fe8ff',true)}}};
/* الوهج: توقّف أطول بقدر عدد من أصابهم */
const _juF=emFlare;emFlare=function(){const R=EM,snap=R.en.map(e=>({e,x:e.x,y:e.y,s:e.stun||0,a:e.away||0}));_juF.apply(this,arguments);
  if(!(R.cd>=1.0))return;let n=0;
  for(const o of snap){if(!R.en.includes(o.e)||(o.e.stun||0)>o.s||(o.e.away||0)>o.a){n++;juImpact('flare',o.x,o.y)}}
  if(n>1)JU.fr=Math.min(.14,JU.fr+.02*n)};
/* ضرب الزعيم */
const _juB=hdBossHurt;hdBossHurt=function(B,by){const r=_juB.apply(this,arguments);juImpact('boss',B.x,B.y);return r};
/* الرسم: موجات الصدمة وأثر الاندفاع (داخل نفس إحداثيات الوهج) */
const _juG=hdJamGlow;hdJamGlow=function(ox,oy,t){_juG.apply(this,arguments);
  if(!JU.rings.length&&!JU.ghosts.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const g of JU.ghosts){const k=1-g.t/g.max;glowAdd(g.x*HT-ox,g.y*HT-oy-10,14+6*k,'#ffb060',.5*k)}
  for(const r of JU.rings){const k=r.t/r.max,e=1-(1-k)*(1-k);ctx.globalAlpha=Math.max(0,1-k);ctx.strokeStyle=r.c;ctx.lineWidth=3*(1-k)+1;ctx.beginPath();ctx.arc(r.x*HT-ox,r.y*HT-oy-8,r.r*e,0,7);ctx.stroke();
    if(k<.35){glowAdd(r.x*HT-ox,r.y*HT-oy-8,r.r*.8*(1-k),r.c,.55*(1-k/.35))}}
  ctx.restore()};
/* ضربة الجامور على الجدار + بداية الاندفاع: صوت/غبار أخف */
const _juD=emDash;emDash=function(){const R=EM,d0=R.dashT||0;_juD.apply(this,arguments);if((R.dashT||0)>d0){for(let i=0;i<6;i++)R.fx.push({x:R.x,y:R.y,vx:-R.dx*rr(.6,1.6)+rr(-.5,.5),vy:-R.dy*rr(.6,1.6)+rr(-.5,.5),life:0,max:rr(.25,.5)});if(HD.cam)HD.cam.z=(HD.cam.z||1)+.012}};
Object.assign(window.__hd||{},{JU,juImpact});
