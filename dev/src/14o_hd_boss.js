/* =====================================================================
   الزعماء: حارس العرش (مصغّر) + الإمبراطور هجير (ثلاث مراحل)
   القاعدة: كرات اللهب تُرَدّ بالوهج نحو الزعيم. الموجات تُتّقى بعمود أو بنار مشتعلة.
   ===================================================================== */
const HD_BOSS={
  guard:{name:'حارس العرش',hp:4,orb:[3.3,3.3,3.3],spd:[2.3,2.3,2.3],cnt:[1,1,1]},
  emp:{name:'الإمبراطور هجير',hp:9,orb:[3.4,2.7,2.1],spd:[2.4,2.8,3.2],cnt:[1,2,3]}};
function hdBossInit(m){const b=m.boss,d=HD_BOSS[b.k];return{k:b.k,x:b.hx,y:b.hy,hp:d.hp,max:d.hp,t:0,ph:1,orbT:3.5,wvT:7,wave:null,spT:9,snT:8,hurt:0,dead:0,intro:1,sp:b.sp||[],flash:0}}
function hdBossPhase(B){if(B.k!=='emp')return 1;return B.hp>6?1:B.hp>3?2:3}
function hdBossFire(B){const R=EM,d=HD_BOSS[B.k],ph=B.ph,n=d.cnt[ph-1],a0=Math.atan2(R.y-B.y,R.x-B.x);
  for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.42;R.orbs.push({x:B.x+Math.cos(a)*1.2,y:B.y+Math.sin(a)*1.2+.3,vx:Math.cos(a),vy:Math.sin(a),sp:d.spd[ph-1],rf:0,age:0,tr:[]})}
  if(SA.n){saNoise(.35,'bandpass',900,2,.16,null,300);hdVoice&&hdVoice({f0:200,f1:90,dur:.4,type:'sawtooth',vol:.09,lp:900})}}
function hdBossHurt(B,by){const R=EM;B.hp--;B.hurt=.7;B.flash=1;ST.shake=1.2;stFlash(.55,'#ffd890');if(SA.n){saBoom(.9);saChime&&saChime()}
  for(let i=0;i<14;i++)R.fx.push({x:B.x+rr(-.8,.8),y:B.y+rr(-.6,.4),vx:rr(-2,2),vy:rr(-2,.5),life:0,max:rr(.5,1.1)});
  const nm=HD_BOSS[B.k].name;
  if(B.hp<=0){B.dead=1;R.orbs=[];B.wave=null;hdBossDie(B);return}
  const np=hdBossPhase(B);toast(`${nm}: ${B.hp} / ${B.max}`,'#ff9a50',true);
  if(np!==B.ph){B.ph=np;B.snT=6;B.spT=4;B.wave=null;B.orbT=4;R.orbs=[];setTimeout(()=>hdBossPhaseBeat(B),500)}}
function hdBossDie(B){const R=EM;stWhisper(B.k==='emp'?'…أنا… الجمر…':'…',2);
  if(B.k==='guard'){R.flags.guard=1;setTimeout(()=>{hdCine([{d:3.6,w:[B.x,B.y,1.5,B.x,B.y,1.9],fl:[.8,'#ffe0a0'],snd:()=>{saBoom&&saBoom(1);saDoor&&saDoor()},cap:'تصدّع الحارس... وسقط سيفه من يده.'}],()=>{if(emGoalDone())hdDoorBeat()})},700)}
  else setTimeout(()=>emWin2(),900)}
function hdBossUpdate(dt){const R=EM,B=R.bs,m=R.m;if(!B||B.dead||B.intro)return;B.t+=dt;if(B.hurt>0)B.hurt-=dt;if(B.flash>0)B.flash=Math.max(0,B.flash-dt*2);
  const d=HD_BOSS[B.k],ph=B.ph,safeP=emLitZone(R.x,R.y,2.1)||R.inv>0;
  B.orbT-=dt;if(B.orbT<=0){B.orbT=d.orb[ph-1]+rr(0,.8);if(B.k==='emp'||Math.hypot(R.x-B.x,R.y-B.y)<11)hdBossFire(B)}
  if(B.k==='emp'){
    B.wvT-=dt;if(B.wvT<=0&&!B.wave){B.wave={t:-1.4,r:0,hit:0};B.wvT=[10,8,6.5][ph-1];if(SA.n)saSwell&&saSwell(1.4);stWhisper(pick(['احترقوا…','ارتجفي يا جمرة…','لا ملاذ…']),1);emTip('wave','موجة نار! اختبئ خلف عمود أو قف قرب نار مشتعلة')}
    if(B.wave){const W_=B.wave;W_.t+=dt;if(W_.t>0){W_.r=W_.t*7.5;const dist=Math.hypot(R.x-B.x,R.y-B.y);if(!W_.hit&&Math.abs(dist-W_.r)<.9&&!safeP&&emLosFrom(B.x,B.y,R.x,R.y)&&!ST.busy){W_.hit=1;R.E=Math.max(0,R.E-28);stFlash(.6,'#ff5a20');ST.shake=1;saCaught&&saCaught();const a=Math.atan2(R.y-B.y,R.x-B.x),np=[R.x+Math.cos(a)*.9,R.y+Math.sin(a)*.9];if(!emSolid(np[0],np[1])){R.x=np[0];R.y=np[1]}if(R.E<=0)emDie('dark')}
        if(W_.r>22)B.wave=null}}
    if(ph>=2){B.spT-=dt;if(B.spT<=0){B.spT=ph===2?12:9;if(R.en.length<2&&B.sp.length){const c=pick(B.sp);if(Math.hypot(c[0]-R.x,c[1]-R.y)>5)R.en.push({k:'hunter',x:c[0],y:c[1],sx:c[0],sy:c[1],st:'hunt',wait:0,lost:0,t:0,wp:null,lx:Math.floor(R.x),ly:Math.floor(R.y),fz:0,stun:0,away:0,dorm:false})}}}
    if(ph>=3){B.snT-=dt;if(B.snT<=0){B.snT=7;const lit=m.items.filter(i=>i.k==='brazier'&&i.lit);if(lit.length>1){const b=pick(lit);b.lit=false;if(SA.n)saLampOff&&saLampOff();toast('الإمبراطور أطفأ ناراً! أعد إشعالها (E)','#a0a8d0',true)}}}}
  /* الكرات */
  for(const o of R.orbs){o.age+=dt;if(!o.rf){const ta=Math.atan2(R.y-o.y,R.x-o.x),ca=Math.atan2(o.vy,o.vx);let da=((ta-ca+Math.PI*3)%(Math.PI*2))-Math.PI;const tr=(B.k==='emp'?1.25:.9)*dt;ca;const na=ca+clamp(da,-tr,tr);o.vx=Math.cos(na);o.vy=Math.sin(na)}
    else{const ta=Math.atan2(B.y-o.y,B.x-o.x);o.vx=Math.cos(ta);o.vy=Math.sin(ta)}
    const sp=o.rf?8:o.sp;o.x+=o.vx*sp*dt;o.y+=o.vy*sp*dt;o.tr.push([o.x,o.y]);if(o.tr.length>7)o.tr.shift();
    if(emOpaque(o.x,o.y)){o.dead=1;for(let i=0;i<4;i++)R.fx.push({x:o.x,y:o.y,vx:rr(-1,1),vy:rr(-1,1),life:0,max:rr(.3,.6)});continue}
    if(o.rf){if(Math.hypot(o.x-B.x,o.y-B.y)<1.25){o.dead=1;hdBossHurt(B)}}
    else if(Math.hypot(o.x-R.x,o.y-R.y)<.5&&!ST.busy&&!(R.inv>0)){o.dead=1;R.E=Math.max(0,R.E-20);stFlash(.5,'#ff7a30');ST.shake=.8;saCaught&&saCaught();if(R.E<=0)emDie('dark')}
    if(o.age>11)o.dead=1}
  R.orbs=R.orbs.filter(o=>!o.dead)}
/* الوهج يرد الكرات */
function hdBossFlare(dirA){const R=EM;if(!R.bs||R.bs.dead||!R.orbs)return;let n=0;
  for(const o of R.orbs){if(o.rf)continue;const dx=o.x-R.x,dy=o.y-R.y,d=Math.hypot(dx,dy);let ad=Math.atan2(dy,dx)-dirA;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;if(d<5.4&&(Math.abs(ad)<1.05||d<1.6)){o.rf=1;n++;for(let i=0;i<5;i++)R.fx.push({x:o.x,y:o.y,vx:rr(-1.4,1.4),vy:rr(-1.4,1.4),life:0,max:rr(.3,.6)})}}
  if(n){if(SA.n)saChime&&saChime();emTip('refl','رددتَ كرة اللهب نحوه!')}}
/* ---------- الرسم ---------- */
function hdBossDraw(B,sx,sy,t){const fl=B.flash>0,hit=B.hurt>0;
  if(B.k==='guard'){hdShadow(sx,sy+2,20,.5);const bob=Math.sin(t*1.6)*1;ctx.save();ctx.translate(Math.round(sx),Math.round(sy+bob));
    const c1=fl?'#ffffff':'#6a625a',c2=fl?'#ffe0c0':'#3a342e',c3=fl?'#fff':'#8a8176';
    ctx.fillStyle=c2;ctx.fillRect(-10,-14,8,16);ctx.fillRect(2,-14,8,16);ctx.fillStyle='#1c1814';ctx.fillRect(-12,0,10,4);ctx.fillRect(2,0,10,4);
    ctx.fillStyle=c1;ctx.fillRect(-14,-40,28,28);ctx.fillStyle=c3;ctx.fillRect(-14,-40,28,3);ctx.fillRect(-16,-42,8,8);ctx.fillRect(8,-42,8,8);ctx.fillStyle=c2;ctx.fillRect(-14,-24,28,3);
    ctx.fillStyle=c1;ctx.fillRect(-8,-56,16,17);ctx.fillStyle=c3;ctx.fillRect(-8,-56,16,3);ctx.fillRect(-2,-62,4,8);ctx.fillStyle='#0a0806';ctx.fillRect(-6,-48,12,4);
    ctx.fillStyle=c2;ctx.fillRect(-20,-38,6,22);ctx.fillRect(14,-38,6,22);
    ctx.fillStyle='#2a2622';ctx.fillRect(18,-70,3,44);ctx.fillStyle='#8a8478';ctx.fillRect(17,-74,5,6);ctx.fillRect(15,-50,9,3);
    ctx.restore()}
  else{/* الإمبراطور: عرش + شخصية عائمة */
    const x=sx,y=sy;hdShadow(x,y+6,34,.55);
    ctx.fillStyle='#120608';ctx.beginPath();ctx.moveTo(x-34,y+4);ctx.lineTo(x-30,y-70);ctx.lineTo(x-22,y-52);ctx.lineTo(x-14,y-86);ctx.lineTo(x-6,y-58);ctx.lineTo(x,y-96);ctx.lineTo(x+6,y-58);ctx.lineTo(x+14,y-86);ctx.lineTo(x+22,y-52);ctx.lineTo(x+30,y-70);ctx.lineTo(x+34,y+4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#2a0c0c';ctx.fillRect(x-34,y-6,68,10);
    const fl2=Math.sin(t*1.5)*3,cy=y-30+fl2,cast=B.wave&&B.wave.t<0?1:0;
    const rb=fl?'#fff':'#5a1018',rb2=fl?'#ffd0b0':'#2e080e';
    ctx.fillStyle=rb2;ctx.beginPath();ctx.moveTo(x-26,cy+26);ctx.lineTo(x-14,cy-20);ctx.lineTo(x+14,cy-20);ctx.lineTo(x+26,cy+26);ctx.closePath();ctx.fill();
    ctx.fillStyle=rb;ctx.beginPath();ctx.moveTo(x-18,cy+26);ctx.lineTo(x-10,cy-16);ctx.lineTo(x+10,cy-16);ctx.lineTo(x+18,cy+26);ctx.closePath();ctx.fill();
    ctx.fillStyle='#c9a03a';ctx.fillRect(x-12,cy-18,24,3);ctx.fillRect(x-1,cy-16,2,36);
    const ay=cast?-18:-4;ctx.fillStyle=rb2;ctx.fillRect(x-30,cy+ay,8,20);ctx.fillRect(x+22,cy+ay,8,20);ctx.fillStyle=hit?'#fff':'#e0b070';ctx.fillRect(x-30,cy+ay-4,8,5);ctx.fillRect(x+22,cy+ay-4,8,5);
    ctx.fillStyle=fl?'#fff':'#d8b060';ctx.beginPath();ctx.ellipse(x,cy-30,9,11,0,0,7);ctx.fill();ctx.fillStyle='#1a0a0a';ctx.fillRect(x-5,cy-33,3,4);ctx.fillRect(x+2,cy-33,3,4);ctx.fillStyle='#ff6a20';ctx.fillRect(x-4,cy-32,1.5,2);ctx.fillRect(x+3,cy-32,1.5,2);
    ctx.fillStyle='#c9a03a';for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(x+i*3-1.5,cy-38);ctx.lineTo(x+i*3,cy-38-(i%2?10:15));ctx.lineTo(x+i*3+1.5,cy-38);ctx.fill()}
    for(let i=-2;i<=2;i++)hdFlame(ctx,x+i*5,cy-42-Math.abs(i)*1.5,.5+(3-Math.abs(i))*.12,t,i*3)}}
function hdBossGlow(ox,oy,t){const R=EM,B=R.bs;if(!B)return;const sx=B.x*HT-ox,sy=B.y*HT-oy;
  if(!B.dead){ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(sx,sy-30,B.k==='emp'?(B.wave&&B.wave.t<0?110:70):38,B.flash>0?'#ffffff':(B.k==='emp'?'#ff5a30':'#ff8a40'),B.flash>0?.8:.3+.1*Math.sin(t*3));ctx.restore()}
  if(B.wave){const W_=B.wave;ctx.save();ctx.globalCompositeOperation='lighter';if(W_.t<0){const k=1+W_.t/1.4;ctx.strokeStyle=`rgba(255,${120+k*100|0},60,${.25+.4*(1-k)})`;ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.arc(sx,sy-6,40+(1-k)*30,0,7);ctx.stroke();ctx.setLineDash([])}
    else{const r=W_.r*HT;ctx.strokeStyle='rgba(255,140,50,.35)';ctx.lineWidth=14;ctx.beginPath();ctx.arc(sx,sy-6,r,0,7);ctx.stroke();ctx.strokeStyle='rgba(255,220,140,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,sy-6,r,0,7);ctx.stroke()}ctx.restore()}
  for(const o of R.orbs){const x=o.x*HT-ox,y=o.y*HT-oy-8;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<o.tr.length;i++){const p=o.tr[i],a=i/o.tr.length;ctx.globalAlpha=a*.5;ctx.fillStyle=o.rf?'#aaf0ff':'#ff8a30';ctx.fillRect(p[0]*HT-ox-1.5,p[1]*HT-oy-8-1.5,3*a+1,3*a+1)}ctx.globalAlpha=1;glowAdd(x,y,o.rf?24:20,o.rf?'#9ae8ff':'#ff7a20',.85);ctx.fillStyle=o.rf?'#e8ffff':'#fff0b8';ctx.beginPath();ctx.arc(x,y,3.4,0,7);ctx.fill();ctx.restore()}}
function hdBossLights(cam,L){const R=EM,B=R.bs;if(!B)return;if(!B.dead)L.push({x:B.x*HT-cam.x,y:B.y*HT-cam.y-28,r:B.k==='emp'?(B.wave&&B.wave.t<0?220:150):90,a:.85,gl:0,col:'#ff6a30'});
  for(const o of R.orbs)L.push({x:o.x*HT-cam.x,y:o.y*HT-cam.y-8,r:46,a:.85,gl:0,col:o.rf?'#9ae8ff':'#ff8a30'})}
