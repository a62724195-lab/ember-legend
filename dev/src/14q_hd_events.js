/* =====================================================================
   المشاهد السينمائية بين المراحل: إلزامية + عشوائية. كلها داخل المحرّك وقابلة للتخطّي.
   ===================================================================== */
const hdCv0=()=>{ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=true};
const hdRn=(s,i)=>{const x=Math.sin(s*127.1+i*311.7)*43758.5453;return x-Math.floor(x)};
function hdCastleAlt(bx,t){const g=ctx.createLinearGradient(0,60,0,210);g.addColorStop(0,'#14060c');g.addColorStop(1,'#3a0e12');ctx.fillStyle=g;
  const R_=(x,y,w,h)=>ctx.fillRect(bx+x,y,w,h),cr=(x,y,w)=>{for(let i=0;i<w;i+=7)ctx.fillRect(bx+x+i,y-5,4,5)};
  R_(-190,178,380,40);cr(-190,178,380);
  for(const sx of[-150,-96,96,150]){R_(sx-14,128,28,56);cr(sx-14,128,28);ctx.beginPath();ctx.moveTo(bx+sx-18,128);ctx.lineTo(bx+sx,92);ctx.lineTo(bx+sx+18,128);ctx.fill()}
  R_(-30,70,60,130);cr(-30,70,60);ctx.beginPath();ctx.moveTo(bx-36,70);ctx.lineTo(bx,6);ctx.lineTo(bx+36,70);ctx.fill();R_(-2,-14,4,22);
  for(let i=0;i<5;i++){ctx.fillRect(bx-44+i*4,70+i*10,2,6)}
  /* أعلام حمراء */
  ctx.fillStyle='#b01a20';for(const sx of[-150,-96,96,150,0]){const y0=sx===0?-8:90,w=Math.sin(t*3+sx)*3;ctx.beginPath();ctx.moveTo(bx+sx,y0);ctx.quadraticCurveTo(bx+sx+14,y0+4+w,bx+sx+24,y0+9+w);ctx.lineTo(bx+sx,y0+14);ctx.fill()}
  /* نوافذ */
  ctx.fillStyle='#ff6a30';for(let i=0;i<22;i++){const x=-170+i*16,y=148+(i%3)*10;ctx.globalAlpha=.4+.5*Math.sin(t*3+i);ctx.fillRect(bx+x,y,3,6)}ctx.globalAlpha=1;
  for(const[x,y]of[[-10,90],[2,90],[-10,110],[2,110],[-10,130],[2,130]]){ctx.fillStyle='#ffb050';ctx.fillRect(bx+x,y,5,9)}
  /* البوابة */
  const gg=ctx.createLinearGradient(0,170,0,215);gg.addColorStop(0,'#ff9a40');gg.addColorStop(1,'#b02a10');ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(bx-18,215);ctx.lineTo(bx-18,190);ctx.quadraticCurveTo(bx,164,bx+18,190);ctx.lineTo(bx+18,215);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='lighter';const dg=ctx.createRadialGradient(bx,196,2,bx,196,90);dg.addColorStop(0,`rgba(255,120,50,${.4+.2*Math.sin(t*2)})`);dg.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=dg;ctx.fillRect(bx-100,110,200,170);ctx.restore()}
/* ---- مشهد: الكاتم (ظلّ على جدار الشعلة) ---- */
function hdScnSnuf(t,k){hdCv0();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c0709');g.addColorStop(1,'#1a0c0c');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;for(let y=0;y<H;y+=18){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();for(let x=((y/18)%2)*20;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+18);ctx.stroke()}}
  const on=k<.6,lv=on?1:Math.max(0,1-(k-.6)/.1),fl=.85+.12*Math.sin(t*13)+.05*Math.sin(t*31);
  ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(110,122,4,110,122,230*lv*fl);lg.addColorStop(0,`rgba(255,170,70,${.55*lv})`);lg.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.fillStyle='#2a2018';ctx.fillRect(106,126,8,30);ctx.fillRect(100,122,20,6);if(lv>.05){ctx.save();ctx.globalAlpha=lv;hdFlame(ctx,110,122,1.9,t,3);ctx.restore()}
  /* الظلّ */
  const e=hdEase(Math.min(1,k/.55)),sc=.35+e*2.7,cx=W*.74-e*40,by=H+60;ctx.save();ctx.translate(cx,by);ctx.scale(sc,sc);ctx.fillStyle=`rgba(0,0,0,${.9*Math.min(1,.2+k*2)})`;
  ctx.beginPath();ctx.moveTo(-34,0);ctx.bezierCurveTo(-40,-60,-30,-110,-14,-130);ctx.bezierCurveTo(-26,-150,-12,-176,0,-178);ctx.bezierCurveTo(12,-176,26,-150,14,-130);ctx.bezierCurveTo(30,-110,40,-60,34,0);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-34,-90);ctx.lineTo(-62,-40+Math.sin(t*2)*4);ctx.lineTo(-52,-34);ctx.lineTo(-30,-70);ctx.fill();ctx.beginPath();ctx.moveTo(34,-90);ctx.lineTo(62,-40-Math.sin(t*2)*4);ctx.lineTo(52,-34);ctx.lineTo(30,-70);ctx.fill();ctx.restore();
  /* الظلام يبتلع المشهد */
  if(k>.6){ctx.fillStyle=`rgba(0,0,0,${Math.min(.97,(k-.6)/.12)})`;ctx.fillRect(0,0,W,H)}
  if(k>.42){const a=Math.min(1,(k-.42)/.12)*(k>.9?Math.max(0,1-(k-.9)/.1):1),ex=cx,ey=by-150*sc;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;for(const s of[-1,1]){const x=ex+s*7*sc;glowAdd(x,ey,18*sc,'#9ab0ff',.6);ctx.fillStyle='#e6f0ff';ctx.fillRect(x-1.5*sc,ey-1.5*sc,3*sc,5*sc)}ctx.restore()}}
/* ---- مشهد: تحوّل الباكية ---- */
function hdScnMorph1(t,k){hdCv0();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0508');g.addColorStop(1,'#3a1008');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(W/2,H*.9,10,W/2,H*.9,260);lg.addColorStop(0,`rgba(255,100,30,${.25+k*.4})`);lg.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.fillStyle='#120708';ctx.fillRect(0,H*.86,W,H);const G=HD.gfx,sp=G.weeper[(t*3|0)%4],sc=5,x=W/2-9*sc,y=H*.86-36*sc;ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1;ctx.drawImage(sp,x,y,18*sc,36*sc);ctx.imageSmoothingEnabled=true;
  ctx.save();ctx.globalCompositeOperation='lighter';const n=Math.floor(k*26);for(let i=0;i<n;i++){const a=hdRn(4,i)*Math.PI*2,L=18+hdRn(5,i)*70*Math.min(1,k*1.4);const px=W/2+Math.cos(a)*14,py=H*.58+Math.sin(a)*30;ctx.strokeStyle=`rgba(255,${150+hdRn(6,i)*90|0},60,.9)`;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(px,py);let xx=px,yy=py;for(let j=0;j<4;j++){xx+=Math.cos(a+hdRn(7,i+j)-.5)*L/4;yy+=Math.sin(a+hdRn(8,i+j)-.5)*L/4;ctx.lineTo(xx,yy)}ctx.stroke()}
  glowAdd(W/2,H*.58,40+k*80,'#ff7a20',.2+k*.5);ctx.restore()}
function hdScnMorph2(t,k){hdCv0();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#14060a');g.addColorStop(1,'#5a1a0a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(W/2,H*.7,10,W/2,H*.7,300);lg.addColorStop(0,'rgba(255,120,40,.6)');lg.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.fillStyle='#120708';ctx.fillRect(0,H*.88,W,H);const G=HD.gfx,e=hdEase(Math.min(1,k*2)),sc=4+e*3.4,sp=G.hunter[(t*5|0)%4],x=W/2-12*sc,y=H*.88-30*sc;ctx.imageSmoothingEnabled=false;ctx.drawImage(sp,x,y,24*sc,30*sc);ctx.imageSmoothingEnabled=true;
  ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(W/2-5*sc,y+7*sc,26+e*20,'#ff3a10',.8);glowAdd(W/2+5*sc,y+7*sc,26+e*20,'#ff3a10',.8);
  for(let i=0;i<46;i++){const ph=(t*.7+hdRn(1,i))%1,px=W/2+(hdRn(2,i)-.5)*220*(1-ph*.2),py=H*.8-ph*H*.9;ctx.globalAlpha=Math.sin(ph*Math.PI)*.9;ctx.fillStyle=i%3?'#ff8a30':'#ffe0a0';ctx.fillRect(px,py,2,2)}ctx.restore()}
/* ---- مشهد: كسر القلب (شرخ في الشمس السوداء ثم التاج) ---- */
function hdCrackOverlay(k){ctx.save();ctx.globalCompositeOperation='lighter';const cx=W/2,cy=70;for(let i=0;i<16;i++){const a=i*.4+hdRn(3,i)*.5,L=k*(120+hdRn(9,i)*160);let x=cx,y=cy;ctx.strokeStyle=`rgba(255,${160+hdRn(2,i)*80|0},80,${.5+.5*k})`;ctx.lineWidth=1+hdRn(1,i)*2;ctx.beginPath();ctx.moveTo(x,y);const n=6;for(let j=1;j<=n;j++){x=cx+Math.cos(a+(hdRn(5,i*9+j)-.5)*.7)*L*j/n;y=cy+Math.sin(a+(hdRn(6,i*9+j)-.5)*.7)*L*j/n;ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
function hdCrown(cx,cy,sc,a,t){ctx.save();ctx.globalAlpha=a;ctx.translate(cx,cy);ctx.scale(sc,sc);ctx.fillStyle='#1a0808';ctx.strokeStyle='#d8a838';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-60,0);for(let i=0;i<=6;i++){ctx.lineTo(-60+i*20,i%2?-18:-52)}ctx.lineTo(60,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d8a838';ctx.fillRect(-60,0,120,8);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const x=cx+(-60+i*20)*sc;ctx.save();ctx.translate(0,0);hdFlame(ctx,x,cy-(i%2?18:52)*sc,1.1*sc,t,i);ctx.restore()}glowAdd(cx,cy-30*sc,90*sc,'#ff6a20',.4*a);ctx.restore()}
function hdScnHeartA(t,k){hdVista({x:0,y:-10+k*-20,z:1.1+k*.5,cor:1+k*.6,beam:1.2,dawn:0,ring:0,faces:1});hdCv0();hdCrackOverlay(Math.min(1,k*1.4))}
function hdScnHeartB(t,k){hdVista({x:0,y:-30,z:1.55,cor:1.2,beam:0,dawn:0,sunlift:0});hdCv0();hdCrackOverlay(1);const e=hdEase(Math.min(1,k*1.3));hdCrown(W/2,70+30-e*32,1.5+e*1.2,Math.min(1,k*1.6),t);
  ctx.save();ctx.globalCompositeOperation='lighter';const ey=70;glowAdd(W/2,ey,60+e*80,'#ff3a10',.3+e*.5);ctx.restore()}
function hdScnCastle(t,k,zoom){hdVista({x:0,y:-20+k*-30,z:1.1+k*(zoom||.5),cor:.7,beam:0,dawn:0,alt:1});hdCv0()}
/* ---- المشاهد العشوائية ---- */
function hdScnStorm(t,k){hdCv0();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#080408');g.addColorStop(1,'#2a1008');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(W*.7,H*.35,10,W*.7,H*.35,230);lg.addColorStop(0,'rgba(255,110,40,.4)');lg.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
  for(let i=0;i<150;i++){const sp=120+hdRn(1,i)*220,x=((hdRn(2,i)*W*1.6-t*sp)%(W*1.6)+W*1.6)%(W*1.6)-W*.3,y=(hdRn(3,i)*H+t*sp*.35)%H;ctx.globalAlpha=.25+hdRn(4,i)*.4;ctx.strokeStyle=i%4?'#b8aca0':'#ff9a50';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+14+hdRn(5,i)*12,y-4);ctx.stroke()}ctx.restore();
  ctx.fillStyle='#000';for(let i=0;i<14;i++){const sp=60+hdRn(7,i)*50,x=((t*sp+hdRn(8,i)*W*1.4)%(W*1.4))-W*.2,y=40+hdRn(9,i)*H*.45+Math.sin(t*2+i)*8,fl=Math.sin(t*10+i*2)*5;ctx.beginPath();ctx.moveTo(x-9,y+fl);ctx.quadraticCurveTo(x-3,y-4,x,y);ctx.quadraticCurveTo(x+3,y-4,x+9,y+fl);ctx.quadraticCurveTo(x+3,y+1,x,y+3);ctx.quadraticCurveTo(x-3,y+1,x-9,y+fl);ctx.fill()}
  const fl=(Math.sin(t*3.1)>.97)?.5:0;if(fl){ctx.fillStyle=`rgba(255,200,140,${fl})`;ctx.fillRect(0,0,W,H)}}
let hdPortCv=null;
function hdScnFace(t,k){hdCv0();hdVista({x:0,y:0,z:1,cor:.5,beam:0,dawn:.25});hdCv0();ctx.fillStyle=`rgba(0,0,0,${.55})`;ctx.fillRect(0,0,W,H);
  if(!hdPortCv){hdPortCv=mkCv(320,420)}const a=Math.min(1,k*3)*(k>.88?Math.max(0,(1-k)/.12):1);hdPortrait(hdPortCv,t,.2+.3*Math.sin(t*9),0);
  ctx.save();ctx.globalAlpha=a*.92;const hh=H*.96,ww=hh*320/420;ctx.drawImage(hdPortCv,W/2-ww/2,H*.04,ww,hh);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const ph=(t*.3+hdRn(1,i))%1;ctx.globalAlpha=Math.sin(ph*Math.PI)*.8*a;ctx.fillStyle=i%3?'#ff8a30':'#ffe0a0';ctx.fillRect(W/2+(hdRn(2,i)-.5)*240,H-ph*H,2,2)}ctx.restore()}
function hdScnQuake(t,k){hdCv0();const sh=Math.sin(k*Math.PI)*5;ctx.save();ctx.translate(rr(-sh,sh),rr(-sh,sh));ctx.fillStyle='#0a0506';ctx.fillRect(-20,-20,W+40,H+40);
  const g=ctx.createLinearGradient(0,H*.4,0,H);g.addColorStop(0,'#1a0c0c');g.addColorStop(1,'#3a1408');ctx.fillStyle=g;ctx.fillRect(-20,H*.4,W+40,H);
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){let x=W*(.1+i*.1),y=H*.42;ctx.strokeStyle=`rgba(255,${120+hdRn(1,i)*100|0},50,${Math.min(1,k*3)})`;ctx.lineWidth=1+hdRn(2,i)*3*k;ctx.beginPath();ctx.moveTo(x,y);const L=Math.min(1,k*1.6);for(let j=0;j<8*L;j++){x+=(hdRn(3,i*9+j)-.5)*30;y+=14+hdRn(4,i*9+j)*12;ctx.lineTo(x,y)}ctx.stroke()}glowAdd(W/2,H*.7,200*Math.min(1,k*1.5),'#ff5a20',.3*Math.min(1,k*2));ctx.restore();
  ctx.fillStyle='#050203';for(let i=0;i<9;i++){const ph=(t*.9+hdRn(5,i))%1,x=hdRn(6,i)*W,y=ph*H*1.1-20,s=5+hdRn(7,i)*13;ctx.save();ctx.translate(x,y);ctx.rotate(ph*5+i);ctx.fillRect(-s/2,-s/2,s,s*.8);ctx.restore()}
  ctx.fillStyle='rgba(120,90,70,.15)';ctx.fillRect(0,0,W,H*(.2+.3*Math.sin(t*5)*Math.sin(t*5)));ctx.restore()}
function hdScnEye(t,k){hdCv0();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05030a');g.addColorStop(1,'#1a0a10');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H*.46,open=hdEase(Math.min(1,Math.max(0,(k-.15)/.4))),ew=210,eh=70*open+2;
  ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(cx,cy,250,'#ff5a20',.25*open);ctx.restore();
  ctx.fillStyle='#1a0808';ctx.beginPath();ctx.moveTo(cx-ew,cy);ctx.quadraticCurveTo(cx,cy-eh*1.7,cx+ew,cy);ctx.quadraticCurveTo(cx,cy+eh*1.7,cx-ew,cy);ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(cx-ew,cy);ctx.quadraticCurveTo(cx,cy-eh*1.7,cx+ew,cy);ctx.quadraticCurveTo(cx,cy+eh*1.7,cx-ew,cy);ctx.clip();
  const ix=cx+Math.sin(t*.8)*30,iy=cy+Math.cos(t*.6)*8;const ig=ctx.createRadialGradient(ix,iy,6,ix,iy,70);ig.addColorStop(0,'#fff0b0');ig.addColorStop(.4,'#ff9a30');ig.addColorStop(1,'#7a1a08');ctx.fillStyle=ig;ctx.beginPath();ctx.arc(ix,iy,64,0,7);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(ix,iy,10,34,0,0,7);ctx.fill();
  ctx.globalCompositeOperation='lighter';for(let i=0;i<24;i++){const a=i/24*6.283+t*.4;ctx.strokeStyle='rgba(255,200,100,.35)';ctx.beginPath();ctx.moveTo(ix+Math.cos(a)*14,iy+Math.sin(a)*34);ctx.lineTo(ix+Math.cos(a)*58,iy+Math.sin(a)*58);ctx.stroke()}ctx.restore();
  ctx.strokeStyle='#4a1a14';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-ew,cy);ctx.quadraticCurveTo(cx,cy-eh*1.7,cx+ew,cy);ctx.quadraticCurveTo(cx,cy+eh*1.7,cx-ew,cy);ctx.stroke()}
/* ---- مجموعة المشاهد ---- */
const HD_EV={
 snuf:()=>[{d:9,fn:hdScnSnuf,fi:1,fo:1.2,cap:'خلف الباب... شيء يحب الظلام.',snd:()=>{saMood&&saMood('heart');hdHush&&hdHush(0,1)}}],
 morph:()=>[{d:5.5,fn:hdScnMorph1,fi:1,cap:'الباكية لم تعد تبكي...',snd:()=>saSwell&&saSwell(3)},{d:6.5,fn:hdScnMorph2,fl:[1,'#ffd890'],fo:1,cap:'الرماد لا يموت. يتحوّل.',snd:()=>{saBoom&&saBoom(1);hdVoice&&hdVoice({f0:300,f1:90,dur:1.2,type:'sawtooth',vol:.16,lp:1400,vib:[7,10]})}}],
 heart:()=>{const a=EM.m.arena;return[
  {d:3.6,w:[a.hx,a.hy+1,1,a.hx,a.hy,1.7],fl:[1,'#ffe0a0'],cap:'القلب انكسر... ولم يمت.',snd:()=>{saBoom&&saBoom(1);saChime&&saChime()}},
  {d:6.5,fn:hdScnHeartA,fl:[.8,'#ff8a40'],cap:'لأنّه لم يكن القلب... بل القفل.',snd:()=>saSwell&&saSwell(3)},
  {d:7,fn:hdScnHeartB,fo:1.2,cap:'وتحت الشمس السوداء... فتح السيّد عينيه.',snd:()=>{saBoom&&saBoom(1);saMood&&saMood('heart')}}]},
 garden:()=>[{d:8,fn:(t,k)=>hdScnCastle(t,k,.6),fi:1.4,fo:1.2,cap:'وهناك... خلف حدائق الرماد، قصر الإمبراطور هجير.',snd:()=>saSwell&&saSwell(3)}],
 gate2:()=>[{d:7.5,fn:(t,k)=>hdScnCastle(t,k,1.1),fi:1,fl:[.4,'#ff6a30'],cap:'جئتَ إلى بيتي يا حامل الشرارة... ادخل.',snd:()=>{saBoom&&saBoom(.9);hdVoice&&hdVoice({f0:70,f1:55,dur:2.2,type:'sawtooth',vol:.14,lp:500,vib:[3,6]})}},{d:2,fn:(t,k)=>hdScnCastle(t,k,1.3),fo:1.6,cap:''}],
 storm:()=>[{d:8,fn:hdScnStorm,fi:1,fo:1.2,cap:'عاصفة رماد... والغربان تحمل أسماء من نسيهم الناس.',snd:()=>{saNoise&&saNoise(2.5,'bandpass',500,.8,.35,null,1800);saSwell&&saSwell(2)}}],
 face:()=>[{d:8.5,fn:hdScnFace,fi:1.2,fo:1.4,cap:'«يا ولدي... ما أنت وحدك. ما تحمله ليس جمرة، بل كل من أحبّوك.»',snd:()=>saChoir&&saChoir()}],
 quake:()=>[{d:7,fn:hdScnQuake,fi:.8,fo:1,cap:'القلعة تنهار من الداخل... كل شيء يتساقط.',snd:()=>{saBoom&&saBoom(1);saNoise&&saNoise(3,'lowpass',300,1,.4)}}],
 eye:()=>[{d:8,fn:hdScnEye,fi:1.2,fo:1.4,cap:'ما زال شيء يراقبك... من وراء الجدران.',snd:()=>{saSwell&&saSwell(3);hdHush&&hdHush(0,1)}}]};
const HD_POOL=['storm','face','quake','eye'];
function hdEventFor(from,to){const R=EM;R.evSeen=R.evSeen||[];let id=null;
  if(from===0)id='snuf';else if(from===2)id='morph';else if(from===4)id='heart';else if(from===5)id='gate2';else if(from===6)id='eye';
  else{const c=HD_POOL.filter(e=>!R.evSeen.includes(e));id=pick(c.length?c:HD_POOL)}
  R.evSeen.push(id);if(R.evSeen.length>3)R.evSeen.shift();
  /* حدث الحديقة يُلحَق بكسر القلب */
  const ev=HD_EV[id]();if(id==='heart')return ev.concat(HD_EV.garden());return ev}
/* ---- مقدمات الزعماء ---- */
function hdBossIntro2(){const R=EM,B=R.bs;if(!B)return;const hx=B.x,hy=B.y;
  const shots=B.k==='guard'?[
   {d:4.2,w:[R.x,R.y,1,hx,hy+3,1.45],hero:[R.x,R.y,R.x,R.y,'u',0],fi:1,snd:()=>saBoom&&saBoom(.9),cap:'حارس العرش... واقف منذ عشرة قرون.'},
   {d:3.4,w:[hx,hy+3,1.45,hx,hy+1,1.9],fl:[.5,'#ff8a40'],snd:()=>saSwell&&saSwell(2),cap:'يردّ لمن رماه... ما رماه.'},
   {d:1.8,w:[hx,hy+1,1.9,R.x,R.y-3,1.1],hero:[R.x,R.y,R.x,R.y,'u',0]}]
  :[
   {d:4.6,w:[R.x,R.y,1,hx,hy+6,1.35],hero:[R.x,R.y,R.x,R.y,'u',0],fi:1.2,snd:()=>saSwell&&saSwell(3),cap:'العرش... لم يجلس عليه أحد منذ ابتلع الجمر الأول.'},
   {d:5.2,w:[hx,hy+5,1.4,hx,hy+1,2.1],fl:[.9,'#ff5a20'],snd:()=>{saBoom&&saBoom(1);hdVoice&&hdVoice({f0:80,f1:50,dur:2.4,type:'sawtooth',vol:.15,lp:500,vib:[3,8]})},cap:'«ثلاثة قرون وأنا أنتظر شرارتك... أعطني إياها.»'},
   {d:3.4,w:[hx,hy+1,2.1,R.x,R.y-4,1.1],hero:[R.x,R.y,R.x,R.y,'u',0],fl:[.4,'#ffe0a0'],cap:'«ولن تموت... سيكون لك مكان في ناري.»'}];
  hdCine(shots,()=>{B.intro=0;showCard(B.k==='guard'?'اختبار الحارس':'الإمبراطور هجير',B.k==='guard'?'رُدّ كرات اللهب بالوهج (R)':'رُدّ كراته · اختبئ من موجاته',3200)})}
function hdBossPhaseBeat(B){if(B.dead)return;const p=B.ph;if(B.k!=='emp')return;
  hdCine([{d:4,w:[B.x,B.y+4,1.2,B.x,B.y+1,2],fl:[.7,p===2?'#ff8a40':'#7a8aff'],snd:()=>{saBoom&&saBoom(1);saSwell&&saSwell(2)},cap:p===2?'«كفى لعباً... يا جنودي!»':'«فلتعرف الظلمة اسمك...»'}],()=>{})}
/* ---- النهاية ---- */
function hdEndShots2(true_){const B=EM.bs,x=B?B.x:20,y=B?B.y:6;return[
  {d:4.5,w:[x,y+3,1.3,x,y,2.2],fl:[1,'#ffe0a0'],cap:'سقط التاج... وانطفأت النار الجائعة.',snd:()=>{saBoom&&saBoom(1);saChime&&saChime()}},
  {d:7,v:{y0:30,y1:-30,z0:1.1,z1:1.6,c0:.4,c1:1.3,b0:0,b1:1.6,ring:1.5},fi:.8,cap:'وخرج منه ضوء بلا حرارة... يعلو فوق القلعتين.',fl:[1,'#fff'],snd:()=>saSwell&&saSwell(3)},
  {d:7,v:{y0:-30,y1:-10,z0:1.6,z1:1.2,c0:1.3,c1:.7,b0:1.6,b1:.5,d0:0,d1:.9,s0:0,s1:20},cap:'وتحت الرماد... جمرة صغيرة، ما زالت تتنفّس.',snd:()=>saChime&&saChime()}]
  .concat(true_?[{d:9,v:{y0:-10,y1:0,z0:1.2,z1:1,c0:.7,c1:.9,b0:.5,b1:.9,d0:.9,d1:.7,f:[0,1]},cap:'ورأيت في الجمر وجوههم... وبينهم سالم، يبتسم. هو الجمر الأول... الذي رفض أن يجوع.',snd:()=>saChoir&&saChoir()}]:[])
  .concat([{d:6.5,v:{y0:0,y1:10,z0:1,z1:1.05,c0:.9,c1:.9,b0:.9,b1:.8,d0:.7,d1:.7,f:true_?[1,1]:[0,0],hero:[W/2-40,224,W/2-30,222]},fo:1.8,cap:true_?'...الجمر ما انطفى':'...الجمر الأخير بيدك',title:{t:'أسطورة الجمر',sub:true_?'النهاية الحقيقية':'نهاية الظلام',at:1}}])}
function emWin2(){const R=EM;store.set('ember_em_done',1);if(R.relics>=3)store.set('ember_em_true',1);hdCine(hdEndShots2(R.relics>=3),()=>showCard('جمر الأعماق',R.relics>=3?'النهاية الحقيقية':'نهاية الظلام',4600,()=>stExit(true)))}
/* ---- محفّزات داخل المراحل ---- */
function hdTrigger(it){const R=EM;it.gone=1;
  if(it.ev==='hound'){const h=R.en.find(e=>e.k==='hound'&&e.st!=='dorm');if(!h)return;hdCine([{d:3.8,w:[R.x,R.y,1,h.x,h.y,1.6],hero:[R.x,R.y,R.x,R.y,R.fd,R.flip],snd:()=>{hdVoice&&hdVoice({f0:420,f1:260,dur:1.3,type:'sawtooth',vol:.12,lp:1500,vib:[6,14]});saBoom&&saBoom(.5)},cap:'وحش جديد: كلب الرماد... سريع، ويشمّ خوفك.'},{d:1.6,w:[h.x,h.y,1.6,R.x,R.y,1],hero:[R.x,R.y,R.x,R.y,R.fd,R.flip]}],()=>{emTip('hound','الكلاب أسرع منك... الوهج يطردها، والنار تبطئها')})}
  else if(it.ev==='court'){hdCine([{d:3.6,w:[R.x,R.y,1,R.m.boss.hx,R.m.boss.hy+3,1.3],hero:[R.x,R.y,R.x,R.y,'u',0],snd:()=>saSwell&&saSwell(2),cap:'خلف الأبراج والعمود... ينتظر حارس العرش.'},{d:1.6,w:[R.m.boss.hx,R.m.boss.hy+3,1.3,R.x,R.y,1],hero:[R.x,R.y,R.x,R.y,'u',0]}],()=>{})}}
Object.assign(window.__hd,{hdEventFor,HD_EV,emNext,hdBossHurt,hdTrigger,hdBossIntro2,hdEndShots2,emWin2,hdBossUpdate,hdBossFlare,hdBossPhaseBeat,emPzSolved,hdPzOpen,PZ});
