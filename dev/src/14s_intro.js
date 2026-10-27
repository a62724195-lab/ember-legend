/* =====================================================================
   المقدمة: شعار الاستوديو ثم مشهد سينمائي ثم الشاشة الرئيسية
   لتغيير الاسم: عدّل INTRO_CFG
   ===================================================================== */
const INTRO_CFG={studio:'شربكلي',tag:'تقدّم',credit1:'فكرة وإخراج',credit2:'برمجة',credit2v:'Claude · Anthropic',yt:'يوتيوب · <bdi dir="ltr">@ASk-o7i3v</bdi>'};
const INTR={on:0,ph:'',t:0,last:0,raf:0,cv:null,cx:null,ps:[],au:null,fired:{},stars:[],clouds:[],lastCap:-1,flash:0,done:0};
(function(){
const css=document.createElement('style');css.textContent=`
#intro{position:fixed;inset:0;z-index:9999;background:#000;overflow:hidden;font-family:var(--font-display,'Reem Kufi','Tajawal',system-ui,sans-serif);color:#f6e3c6;direction:rtl;touch-action:none;cursor:pointer;opacity:1;transition:opacity .7s}
#intro.out{opacity:0}#intro.dead{pointer-events:none}
#intro canvas{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,177.78vh);height:min(56.25vw,100vh);background:#000}
#intro .st{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.2vh;opacity:0;transition:opacity .9s}
#intro .st.on{opacity:1}
#intro .st img{max-width:78vw;max-height:60vh;object-fit:contain}
#intro .st.bd img{border-radius:50%;filter:drop-shadow(0 0 28px #ffb02ecc) drop-shadow(0 0 70px #ff7a2f88);animation:inBd 3.6s ease-out both}
#intro .st.mc img{filter:drop-shadow(0 0 22px #ff9a3caa);animation:inMc 3.4s ease-out both}
@keyframes inBd{from{transform:scale(.88)}to{transform:scale(1.02)}}
@keyframes inMc{from{transform:scale(.94) translateY(10px)}to{transform:scale(1) translateY(0)}}
#intro .st h2{margin:0;font-size:clamp(22px,4.6vh,44px);font-weight:700;letter-spacing:.04em;background:linear-gradient(#fff2c4,#ffb02e 60%,#d86a14);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 12px #ff8a3a88)}
#intro .st p{margin:0;font-size:clamp(13px,2.5vh,22px);color:#d9b88a;letter-spacing:.08em}
#intro .st p b{color:#ffd9a0;font-weight:700}
#intro .bar{position:absolute;left:0;right:0;height:11vh;background:#000;z-index:3;display:none}
#intro.cn .bar{display:block}#intro .bar.t{top:0}#intro .bar.b{bottom:0}
#intro .cap{position:absolute;left:6vw;right:6vw;bottom:15vh;text-align:center;font-size:clamp(17px,4vh,36px);line-height:1.6;color:#ffe9c4;text-shadow:0 2px 14px #000,0 0 22px #000;opacity:0;transition:opacity 1.1s;z-index:4;pointer-events:none}
#intro .cap.on{opacity:1}
#intro .ttl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:13vh;gap:1.4vh;z-index:5;pointer-events:none;opacity:0}
#intro .ttl.on{opacity:1;transition:opacity 1.6s}
#intro .ttl h1{margin:0;font-size:min(15vh,14vw);white-space:nowrap;font-weight:700;line-height:1.1;background:linear-gradient(#fffbe0,#ffd25a 38%,#ff8a2a 75%,#c93d0c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 26px #ff7a2fcc) drop-shadow(0 4px 0 #3a1204);transform:scale(1.18);transition:transform 3.2s cubic-bezier(.16,.8,.2,1)}
#intro .ttl.on h1{transform:scale(1)}
#intro .ttl p{margin:0;font-size:clamp(14px,3.3vh,30px);color:#ffcf94;letter-spacing:.35em;text-shadow:0 0 16px #000}
#intro .ttl i{position:absolute;bottom:13vh;font-style:normal;font-size:clamp(14px,2.9vh,26px);color:#fff0d4;animation:inBl 1.3s ease-in-out infinite;opacity:0}
#intro .ttl.go i{opacity:1}
@keyframes inBl{50%{opacity:.25}}
#intro .skip{position:absolute;bottom:2.2vh;left:2.2vh;z-index:8;background:#000a;border:1px solid #8a5a2a;color:#e8c898;border-radius:20px;padding:.7vh 2.2vh;font:inherit;font-size:clamp(12px,2.2vh,18px);cursor:pointer}
`;document.head.appendChild(css);
const d=document.createElement('div');d.id='intro';d.hidden=true;
d.innerHTML=`<canvas id="inCv" width="1280" height="720"></canvas>
<div class="st bd" id="inBd"><img alt=""><div><h2></h2></div><p></p></div>
<div class="st mc" id="inMc"><img alt=""><p class="a"></p><p class="b"></p><p class="c"></p></div>
<div class="bar t"></div><div class="bar b"></div><div class="cap" id="inCap"></div>
<div class="ttl" id="inTtl"><h1>أسطورة الجمر</h1><p>جمر الأعماق</p><i>المس الشاشة للبدء</i></div>
<button class="skip" id="inSkip" type="button">تخطي ›</button>`;
document.body.appendChild(d)})();
const $i=s=>document.querySelector('#intro '+s);

/* ---------- صوت المقدمة (مستقل عن صوت اللعبة) ---------- */
function inAu(){if(INTR.au)return INTR.au;try{const A=new (window.AudioContext||window.webkitAudioContext)();const m=A.createGain();m.gain.value=(typeof muted!=='undefined'&&muted)?0:Math.min(1,(settings&&settings.sfx||.8)*1.15);m.connect(A.destination);
  const nb=A.createBuffer(1,A.sampleRate*2,A.sampleRate),dt=nb.getChannelData(0);for(let i=0;i<dt.length;i++)dt[i]=Math.random()*2-1;INTR.au={A,m,nb};return INTR.au}catch(e){return null}}
function inOk(){const a=INTR.au;return a&&a.A.state==='running'}
function inTone(f,f2,dur,type,vel,delay){const a=INTR.au;if(!inOk())return;const A=a.A,t=A.currentTime+(delay||0),o=A.createOscillator(),g=A.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+Math.min(.03,dur*.25));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.m);o.start(t);o.stop(t+dur+.05)}
function inNoise(dur,f,f2,q,vel,type,delay){const a=INTR.au;if(!inOk())return;const A=a.A,t=A.currentTime+(delay||0),s=A.createBufferSource();s.buffer=a.nb;s.loop=true;const fl=A.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q||1;const g=A.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+dur*.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(g);g.connect(a.m);s.start(t);s.stop(t+dur+.05)}
function inBell(f,vel,d,delay){[[1,1],[2.01,.45],[3.02,.25]].forEach(([r,k])=>inTone(f*r,0,d,'sine',vel*k,delay))}
function inDrone(){const a=INTR.au;if(!inOk()||INTR.drone)return;const A=a.A,t=A.currentTime,g=A.createGain(),lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.2,t+5);[55,55.4,82.5].forEach(f=>{const o=A.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(lp);o.start(t);INTR.drone=INTR.drone||[];INTR.drone.push(o)});lp.connect(g);g.connect(a.m);INTR.dg=g}
function inDroneStop(sec){const a=INTR.au;if(!a||!INTR.dg)return;try{INTR.dg.gain.setTargetAtTime(0,a.A.currentTime,sec||.8);const o=INTR.drone;setTimeout(()=>o.forEach(x=>{try{x.stop()}catch(e){}}),(sec||.8)*5000)}catch(e){}INTR.drone=null;INTR.dg=null}
const IN_SND={
  wind(){inNoise(5,300,900,1.2,.18);inDrone()},
  wind2(){inNoise(5,700,250,1.4,.2)},
  beat(){inTone(62,38,.2,'sine',.8);inTone(52,34,.18,'sine',.55,.19)},
  gong(){inTone(110,0,3.2,'sine',.5);inBell(220,.14,2.6)},
  rise(){inNoise(2.6,200,3200,1.6,.5);inTone(50,170,2.6,'sawtooth',.14)},
  boom(){inTone(78,26,1.8,'sine',.95);inNoise(1.4,600,70,.8,.8,'lowpass');inBell(523.25,.2,3.4);inBell(784,.15,3.4,.06);inBell(1046.5,.1,3.4,.12);inTone(130.8,0,4,'triangle',.18)},
  chime(){inBell(880,.12,2);inBell(1318.5,.09,2.2,.12)}
};
function inSnd(k){try{IN_SND[k]&&IN_SND[k]()}catch(e){}}

/* ---------- عالم المشهد السينمائي ---------- */
const IW=960,IH=540;
const CASTLE=[[600,330],[600,230],[612,230],[612,200],[624,200],[624,230],[650,230],[650,170],[662,170],[662,150],[676,150],[676,128],[700,84],[724,128],[724,150],[738,150],[738,170],[750,170],[750,230],[776,230],[776,200],[788,200],[788,230],[800,230],[800,260],[830,260],[830,330]];
const WIN=[[620,250],[636,262],[664,200],[700,160],[686,210],[714,210],[664,250],[700,250],[736,250],[764,252],[790,278],[612,284]];
function inSeed(){let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;INTR.stars=[];for(let i=0;i<110;i++)INTR.stars.push([r()*IW,r()*300,r()*1.4+.3,r()*6]);INTR.clouds=[];for(let i=0;i<9;i++)INTR.clouds.push([r()*IW*1.4-100,40+r()*230,120+r()*170,.5+r()*.9,r()<.35?1:0])}
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lr=(a,b,k)=>a+(b-a)*k;
function inPart(x,y,o){INTR.ps.push(Object.assign({x,y,vx:(Math.random()-.5)*14,vy:-10-Math.random()*26,l:0,m:2.5+Math.random()*3.5,s:.8+Math.random()*1.8,h:22+Math.random()*24},o||{}))}
function inParts(dt,cx,vis){const P=INTR.ps;for(let i=P.length-1;i>=0;i--){const p=P[i];p.l+=dt;if(p.l>p.m){P.splice(i,1);continue}p.x+=(p.vx+Math.sin(p.l*2+p.h)*7)*dt;p.y+=p.vy*dt;if(!vis)continue;const k=1-p.l/p.m;cx.fillStyle=`hsla(${p.h},100%,${58+k*30}%,${k})`;cx.beginPath();cx.arc(p.x,p.y,p.s*(.4+k*.8),0,6.3);cx.fill()}}
const FLAME=new Path2D('M512 160 C560 270 700 330 700 520 C700 650 610 740 512 740 C414 740 324 650 324 520 C324 440 370 400 400 340 C410 400 440 420 460 420 C440 330 470 230 512 160 Z'),FCORE=new Path2D('M512 330 C545 400 616 440 616 540 C616 625 570 690 512 690 C454 690 408 625 408 540 C408 490 436 462 452 424 C462 460 486 470 496 468 C486 420 494 370 512 330 Z');
function inFlame(cx,x,y,h,al,fl){cx.save();cx.translate(x,y);const s=h/580;cx.scale(s,s);cx.translate(-512,-740);cx.globalAlpha=al;
  let g=cx.createLinearGradient(0,740,0,160);g.addColorStop(0,'#d8300f');g.addColorStop(.5,'#ff7a1f');g.addColorStop(1,'#ffd27a');cx.fillStyle=g;cx.fill(FLAME);
  g=cx.createLinearGradient(0,690,0,330);g.addColorStop(0,'#ffb347');g.addColorStop(1,'#fff3c4');cx.fillStyle=g;cx.fill(FCORE);
  cx.globalCompositeOperation='lighter';g=cx.createRadialGradient(512,640,0,512,640,120+40*fl);g.addColorStop(0,'rgba(255,240,200,.9)');g.addColorStop(1,'rgba(255,160,60,0)');cx.fillStyle=g;cx.fillRect(250,420,520,420);cx.restore()}
function inCrown(cx,x,y,w,al){cx.save();cx.translate(x,y);cx.scale(w/100,w/100);cx.globalAlpha=al;const g=cx.createLinearGradient(0,-40,0,10);g.addColorStop(0,'#fff0a0');g.addColorStop(.6,'#ffb81e');g.addColorStop(1,'#b86a0a');cx.fillStyle=g;cx.beginPath();cx.moveTo(-50,10);cx.lineTo(-56,-34);cx.lineTo(-28,-12);cx.lineTo(-14,-44);cx.lineTo(0,-14);cx.lineTo(14,-44);cx.lineTo(28,-12);cx.lineTo(56,-34);cx.lineTo(50,10);cx.closePath();cx.fill();cx.fillStyle='#e8281a';cx.beginPath();cx.arc(0,-2,5,0,6.3);cx.fill();cx.fillStyle='#3a7bff';[-26,26].forEach(px=>{cx.beginPath();cx.arc(px,0,3.5,0,6.3);cx.fill()});cx.globalCompositeOperation='lighter';const gl=cx.createRadialGradient(0,-14,0,0,-14,70);gl.addColorStop(0,'rgba(255,200,90,.5)');gl.addColorStop(1,'rgba(255,140,40,0)');cx.fillStyle=gl;cx.fillRect(-80,-90,160,150);cx.restore()}

function inDrawWorld(cx,T,dt){
  const E=[480,468];
  // الكاميرا
  let z,fx,fy,dim=1;
  if(T<9){const e=ease(cl(T/9,0,1));z=lr(6,1,e);fx=480;fy=lr(468,270,e);dim=1}
  else if(T<14.2){const e=ease(cl((T-9)/5.2,0,1));z=lr(1,1.4,e);fx=lr(480,640,e);fy=lr(270,240,e)}
  else{const e=ease(cl((T-14.2)/3.2,0,1));z=lr(1.4,3,e);fx=lr(640,480,e);fy=lr(240,430,e)}
  if(T>=18.6){const e=cl((T-18.6)/3,0,1);z=lr(3,1.5,e);fy=lr(430,360,e)}
  cx.save();cx.fillStyle='#02040a';cx.fillRect(0,0,IW,IH);
  cx.translate(IW/2,IH/2);cx.scale(z,z);cx.translate(-fx,-fy);
  // السماء
  let g=cx.createLinearGradient(0,-200,0,420);g.addColorStop(0,'#03060c');g.addColorStop(.45,'#0a1a24');g.addColorStop(.8,'#2a1810');g.addColorStop(1,'#4a1c0a');cx.fillStyle=g;cx.fillRect(-500,-300,IW+1000,900);
  INTR.stars.forEach(s=>{const tw=.5+.5*Math.sin(T*2+s[3]);cx.fillStyle=`rgba(255,240,220,${.25+.5*tw})`;cx.fillRect(s[0],s[1],s[2],s[2])});
  // غيوم
  INTR.clouds.forEach(c=>{const x=((c[0]+T*c[3]*5+400)%(IW+500))-250,col=c[4]?'180,70,40':'40,120,140';const rg=cx.createRadialGradient(x,c[1],0,x,c[1],c[2]);rg.addColorStop(0,`rgba(${col},${c[4]?.22:.2})`);rg.addColorStop(1,`rgba(${col},0)`);cx.fillStyle=rg;cx.fillRect(x-c[2],c[1]-c[2],c[2]*2,c[2]*2)});
  // وهج الأفق
  g=cx.createLinearGradient(0,250,0,340);g.addColorStop(0,'rgba(255,90,20,0)');g.addColorStop(1,'rgba(255,90,20,.28)');cx.fillStyle=g;cx.fillRect(-500,250,IW+1000,100);
  // الصخور البعيدة + القلعة
  cx.fillStyle='#0a0709';cx.beginPath();cx.moveTo(-500,340);cx.lineTo(-100,330);cx.lineTo(200,350);cx.lineTo(420,336);cx.lineTo(600,330);cx.lineTo(830,330);cx.lineTo(1100,342);cx.lineTo(1500,360);cx.lineTo(1500,700);cx.lineTo(-500,700);cx.fill();
  cx.fillStyle='#07050a';cx.beginPath();CASTLE.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();cx.fill();
  // أضواء النوافذ تنطفئ
  cx.globalCompositeOperation='lighter';WIN.forEach((w,i)=>{const off=lr(9.6,13.4,i/WIN.length);let a=T<off?1:cl(1-(T-off)*2.5,0,1);if(a<=0)return;a*=.75+.25*Math.sin(T*5+i);cx.fillStyle=`rgba(255,150,50,${a})`;cx.fillRect(w[0]-3,w[1]-5,6,10);const rg=cx.createRadialGradient(w[0],w[1],0,w[0],w[1],16);rg.addColorStop(0,`rgba(255,120,30,${a*.4})`);rg.addColorStop(1,'rgba(255,120,30,0)');cx.fillStyle=rg;cx.fillRect(w[0]-16,w[1]-16,32,32)});
  // العين الحمراء
  if(T>11){const a=cl((T-11)/1.6,0,1)*(.8+.2*Math.sin(T*3.1));const rg=cx.createRadialGradient(700,112,0,700,112,60+30*a);rg.addColorStop(0,`rgba(255,40,20,${.9*a})`);rg.addColorStop(.3,`rgba(220,20,10,${.4*a})`);rg.addColorStop(1,'rgba(200,0,0,0)');cx.fillStyle=rg;cx.fillRect(600,30,200,170);cx.fillStyle=`rgba(255,200,160,${a})`;cx.beginPath();cx.ellipse(700,112,9,3.5,0,0,6.3);cx.fill();cx.fillStyle=`rgba(40,0,0,${a})`;cx.fillRect(699,108,2,8)}
  cx.globalCompositeOperation='source-over';
  // الأرض الأمامية
  cx.fillStyle='#050305';cx.beginPath();cx.moveTo(-500,480);cx.lineTo(-100,470);cx.lineTo(120,452);cx.lineTo(260,474);cx.lineTo(400,478);cx.lineTo(560,478);cx.lineTo(700,466);cx.lineTo(880,480);cx.lineTo(1100,462);cx.lineTo(1500,490);cx.lineTo(1500,800);cx.lineTo(-500,800);cx.fill();
  cx.fillStyle='#0a0608';[[250,470,40],[320,476,26],[640,470,34],[760,474,22]].forEach(([x,y,w])=>{cx.beginPath();cx.moveTo(x-w,y+14);cx.lineTo(x-w*.4,y-w*.55);cx.lineTo(x+w*.5,y-w*.4);cx.lineTo(x+w,y+14);cx.fill()});
  // الجمرة
  const heart=T>14.2,pulse=heart?1:.5+.5*Math.sin(T*4);let er=T<9?lr(3,9,ease(cl(T/6,0,1))):9;
  if(T>=14.5&&T<17.2){const bt=(T-14.5)%.9;er*=1+.5*Math.exp(-bt*6)}
  const fl=.8+.2*Math.sin(T*23)+.1*Math.sin(T*37);
  cx.globalCompositeOperation='lighter';
  let rg=cx.createRadialGradient(E[0],E[1],0,E[0],E[1],er*9*fl+30);rg.addColorStop(0,'rgba(255,200,110,.85)');rg.addColorStop(.25,'rgba(255,110,30,.35)');rg.addColorStop(1,'rgba(255,60,10,0)');cx.fillStyle=rg;cx.fillRect(E[0]-300,E[1]-300,600,600);
  cx.fillStyle='#ffe9b0';cx.beginPath();cx.arc(E[0],E[1],er*.55*fl+1.6,0,6.3);cx.fill();
  cx.globalCompositeOperation='source-over';
  // اللهب والتاج
  if(T>=17.2){const k=ease(cl((T-17.2)/1.8,0,1));inFlame(cx,E[0],E[1]+8,lr(8,110,k)*(1+.015*Math.sin(T*9)),k,fl);const ck=cl((T-18.4)/1.4,0,1);if(ck>0)inCrown(cx,E[0],E[1]-lr(80,135,ease(ck)),52,ease(ck))}
  // جمرات
  const src=T<14.2?.5:T<17.2?1.5:(T<18.6?5:4);if(Math.random()<src*dt*18)inPart(E[0]+(Math.random()-.5)*8,E[1]-4,{vy:-14-Math.random()*(T>17.2?60:22),vx:(Math.random()-.5)*(T>17.2?60:14)});
  if(T>11&&T<14&&Math.random()<dt*6)inPart(640+Math.random()*120,280+Math.random()*50,{vy:-8-Math.random()*10,h:10+Math.random()*10,vx:(Math.random()-.5)*24});
  cx.globalCompositeOperation='lighter';inParts(dt,cx,true);cx.globalCompositeOperation='source-over';
  cx.restore();
  // بداية/نهاية: تعتيم
  let a=0;if(T<1.2)a=1-T/1.2;a=1-a;if(a<1){cx.fillStyle=`rgba(0,0,0,${1-a})`;cx.fillRect(0,0,IW,IH)}
  if(T>=18.6){const e=cl((T-18.6)/2.5,0,1);cx.fillStyle=`rgba(0,0,0,${.5*e})`;cx.fillRect(0,0,IW,IH)}
  // وميض
  if(INTR.flash>0){cx.fillStyle=`rgba(255,240,210,${Math.min(1,INTR.flash)})`;cx.fillRect(0,0,IW,IH);INTR.flash=Math.max(0,INTR.flash-dt*1.6)}
  // خطوط الرؤية (فينييت)
  const vg=cx.createRadialGradient(IW/2,IH/2,IH*.35,IW/2,IH/2,IH*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');cx.fillStyle=vg;cx.fillRect(0,0,IW,IH)}

/* ---------- المخرج ---------- */
const CAPS=[[.9,3.8,'في البدء... كانت جمرة واحدة تحرس العالم.'],[4.6,8.4,'حتى أتى الإمبراطور، فأطفأ كل نار.'],[9.6,13.6,'وصارت قلعته عيناً لا تنام.'],[14.6,17.4,'لكنّ الجمر... لا يموت.']];
const EVT=[[0.3,'wind'],[4.4,'wind2'],[9.5,'gong'],[11,'beat'],[11.9,'beat'],[12.8,'beat'],[14.5,'beat'],[15.4,'beat'],[16.3,'beat'],[17.1,'rise'],[17.2,'FLASH'],[18.3,'boom'],[18.4,'TITLE'],[20.6,'chime'],[21.5,'GO']];
function inStudio(T){const bd=$i('#inBd'),mc=$i('#inMc');
  const f=(k,t0,t1)=>{const on=T>=t0&&T<t1;if(INTR.fired[k]!==on){INTR.fired[k]=on;k==='bd'?bd.classList.toggle('on',on):mc.classList.toggle('on',on);if(on&&k==='bd')inSnd('chime')}};
  f('bd',.7,4.4);f('mc',5.1,8.9);
  if(T>=9.5)inEnter('cine')}
function inEnter(ph){if(INTR.ph===ph)return;INTR.ph=ph;INTR.t=0;INTR.fired={};INTR.lastCap=-1;$i('#inBd').classList.remove('on');$i('#inMc').classList.remove('on');
  if(ph==='cine'){$('#intro').classList.add('cn');inSeed();INTR.ps=[];inDrone()}}
function inTick(ts){if(!INTR.on)return;const dt=Math.min(.05,(ts-INTR.last)/1000||0);INTR.last=ts;INTR.t+=dt;const T=INTR.t;
  if(INTR.ph==='studio'){inStudio(T);const cx=INTR.cx;cx.clearRect(0,0,IW,IH);if(T<9){if(Math.random()<dt*7)inPart(IW*(.15+Math.random()*.7),IH*(.5+Math.random()*.5),{vy:-18-Math.random()*26,h:36+Math.random()*10,m:3+Math.random()*3,s:.5+Math.random()*1.2});cx.save();cx.scale(1,1);cx.globalCompositeOperation='lighter';inParts(dt,cx,true);cx.restore()}}
  else if(INTR.ph==='cine'){const cx=INTR.cx;cx.setTransform(1280/IW,0,0,720/IH,0,0);inDrawWorld(cx,T,dt);
    EVT.forEach(([t,k])=>{if(T>=t&&!INTR.fired['e'+t]){INTR.fired['e'+t]=1;if(k==='FLASH')INTR.flash=1;else if(k==='TITLE'){$i('#inTtl').classList.add('on');INTR.flash=.9}else if(k==='GO'){$i('#inTtl').classList.add('go');INTR.go=1}else inSnd(k)}});
    let ci=-1;CAPS.forEach((c,i)=>{if(T>=c[0]&&T<c[1])ci=i});if(ci!==INTR.lastCap){INTR.lastCap=ci;const el=$i('#inCap');if(ci>=0){el.textContent=CAPS[ci][2];el.classList.add('on')}else el.classList.remove('on')}
    if(T>29.5&&!INTR.fin)inFinish()}
  INTR.raf=requestAnimationFrame(inTick)}
function inStart(){const el=$('#intro');INTR.on=1;INTR.ph='';INTR.t=0;INTR.fired={};INTR.done=0;INTR.fin=0;INTR.go=0;el.hidden=false;el.classList.remove('out','cn','dead');
  $i('#inBd img').src=INTRO_IMG.badge;$i('#inMc img').src=INTRO_IMG.mascot;$i('#inBd h2').textContent=INTRO_CFG.studio;$i('#inBd p').textContent=INTRO_CFG.tag;
  $i('#inMc .a').innerHTML=INTRO_CFG.credit1+' · <b>'+INTRO_CFG.studio+'</b>';$i('#inMc .c').innerHTML=INTRO_CFG.yt;$i('#inMc .b').innerHTML=INTRO_CFG.credit2+' · <b>'+INTRO_CFG.credit2v+'</b>';
  inAu();if(INTR.au&&INTR.au.A.state==='suspended')INTR.au.A.resume().catch(()=>{});
  INTR.cv=$i('#inCv');INTR.cx=INTR.cv.getContext('2d');inSeed();INTR.ph='studio';INTR.last=performance.now();INTR.raf=requestAnimationFrame(inTick)}
function inFinish(){if(INTR.fin)return;INTR.fin=1;INTR.on=0;cancelAnimationFrame(INTR.raf);inDroneStop(.6);const el=$('#intro');el.classList.add('out');
  setTimeout(()=>{el.classList.add('dead');el.hidden=true;$i('#inTtl').classList.remove('on','go');$i('#inCap').classList.remove('on');INTR.ps=[];const a=INTR.au;if(a){try{a.A.close()}catch(e){}INTR.au=null}removeEventListener('keydown',inKey,true)},750);store&&store.set&&store.set('ember_intro_seen',1)}
function inNext(){if(!INTR.on)return;const au=INTR.au;if(au&&au.A.state==='suspended')au.A.resume().catch(()=>{});
  if(INTR.ph==='studio'){INTR.t=Math.max(INTR.t,9.5);return}
  if(INTR.ph==='cine'){if(INTR.t<18.6){INTR.t=19;EVT.forEach(([t])=>{if(t<=19)INTR.fired['e'+t]=1});inSnd('boom');INTR.flash=.9;$i('#inCap').classList.remove('on');INTR.lastCap=-1;$i('#inTtl').classList.add('on')}
    else if(INTR.go)inFinish();else INTR.t=Math.max(INTR.t,21.5)}}
function inKey(e){if(!INTR.on)return;e.stopPropagation();e.preventDefault();if(e.key==='Escape')inFinish();else if(!e.repeat)inNext()}
(function(){const el=$('#intro');
  el.addEventListener('pointerdown',e=>{if(!INTR.on)return;e.preventDefault();e.stopPropagation();if(e.target.id==='inSkip')inFinish();else inNext()});
  if(/[?&]nointro\b/.test(location.search))return;
  addEventListener('keydown',inKey,true);
  window.__intro={INTR,inStart,inNext,inFinish};
  inStart()})();
