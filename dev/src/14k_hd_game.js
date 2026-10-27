/* =====================================================================
   HD-2D: الإطار + المخرج السينمائي + المناظر الملحمية + الواجهة
   ===================================================================== */
const hdEase=k=>k*k*(3-2*k);
const HDV={stars:null,mt:null};
function hdVista(p){const t=HD.t,cor=p.cor===undefined?.6:p.cor,beam=p.beam||0,dawn=p.dawn||0,Zm=p.z||1;
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=true;
  if(!HDV.stars){const r=rcRnd(41);HDV.stars=Array.from({length:90},()=>[r()*W*1.4-W*.2,r()*H*.6,r()*1.2+.3,r()*9]);
    const mk=(n,base,amp,seed)=>{const rr_=rcRnd(seed),a=[];let y=0;for(let i=0;i<=n;i++){y+=(rr_()-.5)*amp;y=clamp(y,-amp*2,amp*2);a.push(base+y+Math.sin(i*.5)*amp*.6)}return a};HDV.mt=[mk(40,0,18,3),mk(40,0,12,8)]}
  const lay=(f,fn)=>{ctx.save();const zf=1+(Zm-1)*f;ctx.translate(W/2,H/2);ctx.scale(zf,zf);ctx.translate(-W/2-p.x*f,-H/2-p.y*f);fn();ctx.restore()};
  /* sky */
  const sk=ctx.createLinearGradient(0,0,0,H);
  if(dawn>0){const d=dawn;sk.addColorStop(0,`rgb(${8+d*30|0},${6+d*24|0},${22+d*40|0})`);sk.addColorStop(.55,`rgb(${40+d*150|0},${22+d*90|0},${40+d*40|0})`);sk.addColorStop(.82,`rgb(${90+d*160|0},${40+d*120|0},${30+d*40|0})`);sk.addColorStop(1,'#1a0c08')}
  else{sk.addColorStop(0,'#020208');sk.addColorStop(.5,'#0f0818');sk.addColorStop(.8,`rgb(${40+cor*40|0},${14+cor*10|0},${14})`);sk.addColorStop(1,'#140806')}
  ctx.fillStyle=sk;ctx.fillRect(0,0,W,H);
  lay(.05,()=>{for(const s of HDV.stars){ctx.globalAlpha=(.4+.5*Math.sin(t*1.5+s[3]))*(1-dawn*.9);ctx.fillStyle='#fff';ctx.fillRect(s[0],s[1],s[2],s[2])}ctx.globalAlpha=1});
  /* the black sun with its corona */
  lay(.15,()=>{const cx=W/2,cy=70-(p.sunlift||0);ctx.save();ctx.globalCompositeOperation='lighter';
    for(const[r,a,c]of[[190,.14,'255,100,30'],[120,.22,'255,150,50'],[64,.4,'255,200,110']]){const g=ctx.createRadialGradient(cx,cy,r*.2,cx,cy,r);g.addColorStop(0,`rgba(${c},${a*cor*1.4})`);g.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,r*2,r*2)}
    ctx.strokeStyle=`rgba(255,220,150,${.6*cor})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(cx,cy,38+Math.sin(t*2)*.6,0,7);ctx.stroke();
    ctx.strokeStyle=`rgba(255,150,60,${.25*cor})`;ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,41,0,7);ctx.stroke();
    ctx.fillStyle=`rgba(255,200,120,${.18*cor})`;ctx.fillRect(cx-170,cy-.6,340,1.2);ctx.restore();
    ctx.fillStyle=dawn>.5?'#3a1a10':'#030206';ctx.beginPath();ctx.arc(cx,cy,37,0,7);ctx.fill();
    if(p.ring){const k=p.ring;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,230,170,${.7*(1-k)})`;ctx.lineWidth=3*(1-k)+.5;ctx.beginPath();ctx.arc(cx,cy,40+k*420,0,7);ctx.stroke();ctx.restore()}});
  /* mountains */
  lay(.3,()=>{ctx.fillStyle=dawn?'#2a1418':'#120a18';ctx.beginPath();ctx.moveTo(-80,H);HDV.mt[0].forEach((y,i)=>ctx.lineTo(-80+i*(W+160)/40,150+y));ctx.lineTo(W+80,H);ctx.fill()});
  /* castle + beam */
  lay(.6,()=>{const bx=W/2;
    if(beam>0){ctx.save();ctx.globalCompositeOperation='lighter';const bw=14+beam*16;let g=ctx.createLinearGradient(bx-bw,0,bx+bw,0);g.addColorStop(0,'rgba(255,120,30,0)');g.addColorStop(.5,`rgba(255,200,110,${Math.min(.9,.5*beam)})`);g.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=g;ctx.fillRect(bx-bw,-400,bw*2,560);
      g=ctx.createLinearGradient(bx-bw*.3,0,bx+bw*.3,0);g.addColorStop(0,'rgba(255,255,230,0)');g.addColorStop(.5,`rgba(255,250,225,${Math.min(1,.7*beam)})`);g.addColorStop(1,'rgba(255,255,230,0)');ctx.fillStyle=g;ctx.fillRect(bx-bw*.3,-400,bw*.6,560);
      const gl=ctx.createRadialGradient(bx,160,4,bx,160,70+beam*50);gl.addColorStop(0,`rgba(255,180,80,${.5*Math.min(1,beam)})`);gl.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=gl;ctx.fillRect(bx-160,60,320,200);
      for(let i=0;i<90;i++){const sp=.4+(i%5)/5,y=170-((t*16*sp+i*23)%380),x=bx+Math.sin(t*.9+i*1.7)*(5+(i%9)*2.2)*(1+(170-y)/260),a=Math.max(0,Math.min(1,(170-y)/60))*Math.min(1,beam);ctx.globalAlpha=a*.9;ctx.fillStyle=i%3?'#ff9a40':'#ffe6a0';ctx.fillRect(x,y,i%4?1.4:2.2,i%4?1.4:2.2)}ctx.restore();ctx.globalAlpha=1}
    if(p.faces){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const ph=(t*.07+i/14)%1,x=bx+Math.sin(i*2.3+t*.3)*(30+ph*60),y=165-ph*300,a=Math.sin(ph*Math.PI)*p.faces*.45,s=1+ph*.9;ctx.fillStyle=`rgba(255,225,160,${a})`;ctx.beginPath();ctx.arc(x,y,4*s,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x,y+9*s,8*s,6*s,0,Math.PI,0);ctx.fill();ctx.fillStyle=`rgba(40,20,10,${a*1.5})`;ctx.fillRect(x-2*s,y-1*s,1.2*s,1.2*s);ctx.fillRect(x+1*s,y-1*s,1.2*s,1.2*s)}ctx.restore()}
    if(p.alt){hdCastleAlt(bx,t);return}
    const cg=ctx.createLinearGradient(0,70,0,200);cg.addColorStop(0,dawn?'#2a1210':'#090610');cg.addColorStop(1,dawn?'#4a2014':'#2a0e08');ctx.fillStyle=cg;
    const R_=(x,y,w,h)=>ctx.fillRect(bx+x,y,w,h),cren=(x,y,w)=>{for(let i=0;i<w;i+=6)ctx.fillRect(bx+x+i,y-4,3.5,4)};
    R_(-150,170,300,40);cren(-150,170,300);R_(-130,138,34,40);cren(-130,138,34);R_(96,138,34,40);cren(96,138,34);R_(-84,150,22,30);R_(62,150,22,30);
    R_(-20,100,40,110);cren(-20,100,40);ctx.beginPath();ctx.moveTo(bx-24,100);ctx.lineTo(bx,56);ctx.lineTo(bx+24,100);ctx.fill();
    for(const sx of[-113,113]){ctx.beginPath();ctx.moveTo(bx+sx-22,138);ctx.lineTo(bx+sx,108);ctx.lineTo(bx+sx+22,138);ctx.fill()}
    ctx.fillStyle='#ff9a40';for(const[x,y]of[[-6,112],[3,112],[-6,128],[3,128],[-118,150],[112,150],[-74,162],[70,162],[-6,146],[3,146]]){ctx.globalAlpha=.6+.4*Math.sin(t*3+x);ctx.fillRect(bx+x,y,3,5)}ctx.globalAlpha=1;
    const gg=ctx.createLinearGradient(0,175,0,210);gg.addColorStop(0,'#ffcf70');gg.addColorStop(1,'#ff6a20');ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(bx-12,210);ctx.lineTo(bx-12,184);ctx.quadraticCurveTo(bx,168,bx+12,184);ctx.lineTo(bx+12,210);ctx.fill();
    ctx.save();ctx.globalCompositeOperation='lighter';const dg=ctx.createRadialGradient(bx,196,2,bx,196,60);dg.addColorStop(0,`rgba(255,170,70,${.35+.25*Math.sin(t*2)})`);dg.addColorStop(1,'rgba(255,110,30,0)');ctx.fillStyle=dg;ctx.fillRect(bx-70,130,140,120);ctx.restore()});
  /* near cliffs + steps + hero */
  lay(1,()=>{ctx.fillStyle='#050306';ctx.beginPath();ctx.moveTo(-200,H+60);ctx.lineTo(-200,230);ctx.lineTo(60,222);ctx.lineTo(160,238);ctx.lineTo(W/2-40,224);ctx.lineTo(W/2,214);ctx.lineTo(W/2+40,224);ctx.lineTo(W-120,238);ctx.lineTo(W-30,222);ctx.lineTo(W+200,230);ctx.lineTo(W+200,H+60);ctx.fill();
    ctx.fillStyle='#14090a';for(let i=0;i<7;i++){ctx.fillRect(W/2-60+i*3,238-i*3.6,120-i*6,3.2)}
    if(p.hero){const hx=p.hero[0],hy=p.hero[1],bob=Math.sin(t*7)*.6;ctx.fillStyle='#020104';ctx.fillRect(hx-3,hy-14+bob,6,14);ctx.beginPath();ctx.arc(hx,hy-17+bob,3.6,0,7);ctx.fill();ctx.fillRect(hx-5,hy-12+bob,10,3);
      ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(hx+5,hy-8,1,hx+5,hy-8,26);lg.addColorStop(0,'rgba(255,190,90,.7)');lg.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=lg;ctx.fillRect(hx-25,hy-40,60,60);ctx.restore();ctx.fillStyle='#ffd070';ctx.fillRect(hx+4,hy-9+bob,2,2)}});
  /* fog bands */
  ctx.save();for(let i=0;i<3;i++){const y=170+i*34,x=((t*(6+i*4))%(W*2))-W;const g=ctx.createLinearGradient(0,y-18,0,y+18);g.addColorStop(0,'rgba(60,30,30,0)');g.addColorStop(.5,`rgba(70,40,36,${.2+.06*i})`);g.addColorStop(1,'rgba(60,30,30,0)');ctx.fillStyle=g;ctx.fillRect(x,y-18,W,36);ctx.fillRect(x-W*2,y-18,W,36)}ctx.restore();
  /* ember motes everywhere */
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const x=(i*97+t*(4+i%5))%W,y=H-((t*(10+i%7*3)+i*31)%(H+20));ctx.globalAlpha=.5*(.4+.6*Math.sin(t*4+i));ctx.fillStyle=i%3?'#ff8a30':'#ffe0a0';ctx.fillRect(x,y,1.5,1.5)}ctx.restore();ctx.globalAlpha=1}

/* ---------- cinematic director ---------- */
function hdCine(shots,cb){HD.cine={shots,i:-1,t:0,cb,flash:0};ST.cin={hd:1,shots:[],i:0,t:0,cb:()=>{const c=HD.cine;HD.cine=null;c&&c.cb&&c.cb()}};
  $('#cine').hidden=false;$('#ccap').style.top='70%';$('#stHud').hidden=true;$('#stBtns').hidden=true;$('#prompt').hidden=true;ST.busy=0;hdCineNext()}
function hdCineNext(){const c=HD.cine;if(!c)return;c.i++;if(c.i>=c.shots.length){hdCineFinish();return}const s=c.shots[c.i];c.t=0;
  const cap=$('#ccap');cap.textContent=s.cap||'';cap.style.animationDuration=(s.d||5)+'s';cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in');
  if(s.snd&&SA.n)try{s.snd()}catch(e){}if(s.fl)stFlash(s.fl[0],s.fl[1]);s.on&&s.on()}
function hdCineFinish(){const c=HD.cine;if(!c)return;HD.cine=null;ST.cin=null;$('#cine').hidden=true;$('#ccap').textContent='';ST.flash=0;c.cb&&c.cb()}
function hdCineSkip(){const c=HD.cine;if(!c)return;for(let i=c.i+1;i<c.shots.length;i++)c.shots[i].on&&c.shots[i].on();c.i=c.shots.length;hdCineFinish()}
function hdCineDraw(dt){const c=HD.cine,s=c.shots[c.i];if(!s)return;c.t+=dt;const R=EM,k=clamp(c.t/s.d,0,1),e=hdEase(k);
  if(c.t>=s.d){hdCineNext();return}
  if(ST.flash>0)ST.flash=Math.max(0,ST.flash-dt*1.2);
  if(s.v){const v=s.v,L=(a,b)=>a+(b-a)*e,p={x:L(v.x0||0,v.x1||0),y:L(v.y0||0,v.y1||0),z:L(v.z0||1,v.z1||1),cor:L(v.c0===undefined?.6:v.c0,v.c1===undefined?.6:v.c1),beam:L(v.b0||0,v.b1||0),dawn:L(v.d0||0,v.d1||0),faces:v.f?L(v.f[0],v.f[1]):0,ring:v.ring?clamp((c.t-v.ring)/3,0,1)||0:0,sunlift:L(v.s0||0,v.s1||0),hero:v.hero?[L(v.hero[0],v.hero[2]),L(v.hero[1],v.hero[3])]:null};
    if(v.dark){ctx.setTransform(SS,0,0,SS,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H)}else hdVista(p);
    if(v.spark){ctx.save();ctx.globalCompositeOperation='lighter';const sx=W/2+Math.sin(c.t*.9)*26,sy=H*.7-c.t*18;glowAdd(sx,sy,34+Math.sin(c.t*9)*4,'#ff9a40',.6);ctx.fillStyle='#fff0b8';ctx.fillRect(sx-1,sy-1,2,2);ctx.restore()}}
  else if(s.fn){s.fn(c.t,k,e,s)}
  else if(s.w){const w=s.w,L=(a,b)=>a+(b-a)*e,cm=HD.cam,Z=L(w[2],w[5]);cm.x=L(w[0],w[3])*HT-W/2;cm.y=L(w[1],w[4])*HT-H/2;
    let hp=null;if(s.hero){const hh=s.hero;hp={x:L(hh[0],hh[2]),y:L(hh[1],hh[3]),mv:1,d:hh[4]||'u',fl:hh[5]||0}}
    R.t+=dt;R.ring=R.ring>0?(R.ring+dt>.8?0:R.ring+dt):0;
    hdWorld(dt,cm,Z,!!s.hero,hp)}
  /* fades */
  const fi=s.fi||0,fo=s.fo||0;let a=0;if(fi&&c.t<fi)a=1-c.t/fi;if(fo&&c.t>s.d-fo)a=Math.max(a,(c.t-(s.d-fo))/fo);
  if(a>0){ctx.setTransform(SS,0,0,SS,0,0);ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  /* film vignette + grain */
  ctx.setTransform(SS,0,0,SS,0,0);const vk='hdv'+W;if(!_vg[vk]){const cc=mkCv(W,H),q=cc.getContext('2d'),g=q.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.7)');q.fillStyle=g;q.fillRect(0,0,W,H);_vg[vk]=cc}ctx.drawImage(_vg[vk],0,0);
  if(s.title){const ta=clamp((c.t-(s.title.at||1))/1.6,0,1);tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);tctx.globalAlpha=ta;tctx.shadowColor='#ff8a30';tctx.shadowBlur=18;TX(s.title.t,W/2,H*.46,'#fff0c8',30,'center');tctx.shadowBlur=0;TX(s.title.sub||'',W/2,H*.46+22,'#ffb060',11,'center');tctx.globalAlpha=1}
  else{tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height)}
  if(ST.flash>0){ctx.globalAlpha=Math.min(1,ST.flash);ctx.fillStyle=ST.flashC||'#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}
/* ---- shot lists ---- */
function hdIntroShots(){const R=EM;return[
  {d:5.5,v:{dark:1,spark:1},fi:1.2,cap:'قبل الضوء... كان الجمر.',snd:()=>saMood&&saMood('heart')},
  {d:8,v:{y0:60,y1:0,z0:1,z1:1.08,c0:.2,c1:.8,b0:0,b1:.55},fi:1.5,cap:'في قلعة الرماد... نام الجمر الأول.',fl:[.25,'#ffcf90']},
  {d:8,v:{y0:0,y1:-40,z0:1.08,z1:1.75,c0:.8,c1:1,b0:.55,b1:1.1},cap:'وكل من دخل ليوقظه... عاد رمادًا.',snd:()=>saBoom&&saBoom(.8)},
  {d:7.5,v:{y0:-40,y1:-20,z0:1.5,z1:1.3,c0:1,c1:1,b0:1,b1:1,hero:[W/2-70,238,W/2-40,224]},cap:'وأنت... الجمرة الأخيرة.',fo:1.2,title:{t:'جمر الأعماق',sub:'أسطورة الجمر',at:1.5}},
  {d:4.5,w:[R.x+2,R.y-1,1.35,R.x,R.y,1],hero:[R.x,R.y,R.x,R.y,'s',0],fi:1.4,fl:[0,'#fff'],cap:''}]}
function hdEndShots(true_){const R=EM,a=R.m.arena;return[
  {d:4.2,w:[a.hx,a.hy+1,1,a.hx,a.hy,1.6],fl:[.9,'#ffe0a0'],cap:'القلب انفتح...',snd:()=>{saBoom&&saBoom(1);saChime&&saChime()}},
  {d:7,v:{y0:30,y1:-30,z0:1.1,z1:1.6,c0:.4,c1:1.3,b0:0,b1:1.6,ring:1.5},fi:.8,cap:'وخرج منه ضوء بلا حرارة... يعلو فوق القلعة.',fl:[1,'#fff'],snd:()=>saSwell&&saSwell(3)},
  {d:7,v:{y0:-30,y1:-10,z0:1.6,z1:1.2,c0:1.3,c1:.7,b0:1.6,b1:.5,d0:0,d1:.9,s0:0,s1:20},cap:'وتحت الرماد... جمرة صغيرة، ما زالت تتنفّس.',snd:()=>saChime&&saChime()}]
  .concat(true_?[{d:8.5,v:{y0:-10,y1:0,z0:1.2,z1:1,c0:.7,c1:.9,b0:.5,b1:.9,d0:.9,d1:.7,f:[0,1]},cap:'ورأيت في الجمر وجوههم... وبينهم سالم، يبتسم. كل من أطفأه الظلام قبلك.',snd:()=>saChoir&&saChoir()}]:[])
  .concat([{d:6,v:{y0:0,y1:10,z0:1,z1:1.05,c0:.9,c1:.9,b0:.9,b1:.8,d0:.7,d1:.7,f:true_?[1,1]:[0,0],hero:[W/2-40,224,W/2-30,222]},fo:1.8,cap:true_?'...الجمر ما انطفى':'...الجمر الأخير بيدك',title:{t:'أسطورة الجمر',sub:true_?'النهاية الحقيقية':'نهاية الظلام',at:1}}])}
function hdDoorBeat(){const R=EM,m=R.m;if(!m.door||ST.cin||state!=='story')return;const dx=m.door[0]+.5,dy=m.door[1]+2;
  hdCine([{d:4.2,w:[R.x,R.y,1,dx,dy,1.35],hero:[R.x,R.y,R.x,R.y,R.fd,R.flip],fl:[.5,'#ffe0a0'],snd:()=>{saDoor&&saDoor();saChime&&saChime()},cap:'الباب يتّقد... الطريق انفتح.'},{d:1.4,w:[dx,dy,1.35,R.x,R.y,1],hero:[R.x,R.y,R.x,R.y,R.fd,R.flip]}],()=>{})}
function hdBossIntro(){const R=EM,a=R.m.arena;hdCine([{d:4.6,w:[R.x,R.y,1,a.hx,a.hy+2,1.5],hero:[R.x,R.y,R.x,R.y,'u',0],fi:1,snd:()=>saBoom&&saBoom(1),cap:'هنا ينبض القلب... قلب الرماد.'},{d:2.6,w:[a.hx,a.hy+2,1.5,R.x,R.y-3,1.1],hero:[R.x,R.y,R.x,R.y,'u',0],fl:[.7,'#ff6a30'],snd:()=>saSwell&&saSwell(2)}],()=>showCard('المرحلة الأخيرة','قلب الرماد',2200))}
/* ---------- camera + frame ---------- */
function hdCamFollow(dt){const R=EM,m=R.m,c=HD.cam,B=R.bs&&!R.bs.dead&&!R.bs.intro?R.bs:null;let px=R.x,py=R.y;if(B){const bk=B.k==='emp'?.58:.45;px+=(B.x-R.x)*bk;py+=(B.y-R.y)*bk}
  let tx=px*HT+Math.cos(R.a)*(R.mv>.1?14:0)-W/2,ty=py*HT-HHW*.4-H/2+Math.sin(R.a)*(R.mv>.1?8:0);
  tx=m.w*HT<=W?(m.w*HT-W)/2:clamp(tx,-60,m.w*HT-W+60);ty=m.h*HT<=H?(m.h*HT-H)/2:clamp(ty,-80,m.h*HT-H+60);
  const k=Math.min(1,dt*5);c.x+=(tx-c.x)*k;c.y+=(ty-c.y)*k;const tz=B?(B.k==='emp'?.72:.8):1;c.z=(c.z||1)+(tz-(c.z||1))*Math.min(1,dt*3)}
function hdFrame(dt){const R=EM;HD.t+=dt;
  if(ST.cin&&ST.cin.hd&&HD.cine){hdCineDraw(dt);return}
  emUpdate(dt);hdCamFollow(dt);
  const shk=ST.shake>0?[rr(-ST.shake*3,ST.shake*3),rr(-ST.shake*3,ST.shake*3)]:[0,0],cm={x:HD.cam.x+shk[0],y:HD.cam.y+shk[1]};
  hdWorld(dt,cm,HD.cam.z||1,true);hdHud()}
/* ---------- HUD ---------- */
function hdHud(){const R=EM,m=R.m,lowE=R.E<22;
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);
  const vk='hdv'+W;if(!_vg[vk]){const cc=mkCv(W,H),q=cc.getContext('2d'),g=q.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.7)');q.fillStyle=g;q.fillRect(0,0,W,H);_vg[vk]=cc}ctx.drawImage(_vg[vk],0,0);
  if(lowE){ctx.fillStyle=`rgba(120,10,0,${(1-R.E/22)*.3*(.6+.4*Math.sin(R.t*8))})`;ctx.fillRect(0,0,W,H)}
  if(ST.flash>0){ctx.globalAlpha=Math.min(1,ST.flash);ctx.fillStyle=ST.flashC||'#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  /* minimap */
  if(!PH.on){const ms=m.w>50?2:3,ox=8,oy=34;ctx.globalAlpha=.8;
    for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(R.seen[y][x]){const c=m.g[y][x];ctx.fillStyle=c==='.'?'#6a5a3c':c==='X'?'#ffd890':c==='V'?'#ff8a30':c==='B'?'#9a9088':c==='L'?'#c4410d':c==='H'?'#ff4a2a':c==='P'?'#4a4038':c==='C'?'#a07040':c==='G'?'#6a6a7a':c==='M'?'#9ad0ff':'#2a2218';ctx.fillRect(ox+x*ms,oy+y*ms,ms,ms)}
    m.items.forEach(i=>{if(i.gone||!R.seen[Math.floor(i.y)]||!R.seen[Math.floor(i.y)][Math.floor(i.x)])return;if(i.k==='shard'||i.k==='altar'||i.k==='relic'||(i.k==='puzzle'&&!i.solved)){ctx.fillStyle=i.k==='puzzle'?'#9affc0':'#ffd24a';ctx.fillRect(ox+Math.floor(i.x)*ms,oy+Math.floor(i.y)*ms,ms,ms)}else if(i.k==='brazier'&&i.lit){ctx.fillStyle='#ff8a30';ctx.fillRect(ox+Math.floor(i.x)*ms,oy+Math.floor(i.y)*ms,ms,ms)}});
    ctx.fillStyle='#fff';ctx.fillRect(ox+R.x*ms-1,oy+R.y*ms-1,3,3);ctx.globalAlpha=1}
  /* ember bar */
  if(!PH.on){const bw=140,bx=W/2-bw/2,by=H-14;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx-2,by-2,bw+4,9);const g2=ctx.createLinearGradient(bx,0,bx+bw,0);g2.addColorStop(0,lowE?'#8a1a0a':'#c24a14');g2.addColorStop(1,lowE?'#ff4a2a':'#ffd070');ctx.fillStyle=g2;ctx.fillRect(bx,by,bw*R.E/100,5);ctx.fillStyle='#ffffff30';ctx.fillRect(bx,by,bw*R.E/100,1);
    ctx.fillStyle='#ffb060';ctx.beginPath();ctx.moveTo(bx-9,by+6);ctx.quadraticCurveTo(bx-14,by-2,bx-8,by-8);ctx.quadraticCurveTo(bx-6,by-3,bx-3,by-4);ctx.quadraticCurveTo(bx-2,by+2,bx-3,by+6);ctx.closePath();ctx.fill()}
  if(!PH.on&&R.bs&&!R.bs.dead&&!R.bs.intro){const B=R.bs,bw=150,bx=W/2-bw/2,nm=HD_BOSS[B.k].name;ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(bx-2,10,bw+4,9);ctx.fillStyle=B.flash>0?'#fff':(B.k==='emp'?'#c01a2a':'#a8321a');ctx.fillRect(bx,12,bw*B.hp/B.max,5);for(let i=1;i<B.max;i++){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx+bw*i/B.max-.5,12,1,5)}tctx.globalAlpha=.95;TX(nm,W/2,32,'#ff8a60',11,'center');tctx.globalAlpha=1}
  if(!PH.on&&R.hp){const bw=120,bx=W/2-bw/2;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx-2,10,bw+4,8);ctx.fillStyle=R.hp.open?'#ffe9a0':'#a82a1a';ctx.fillRect(bx,12,bw*R.hp.hp/5,4);tctx.globalAlpha=.9;TX('قلب الرماد',W/2,32,'#ff8a60',11,'center');tctx.globalAlpha=1}
  ST.wh.forEach(w=>{if(w.t<0)return;const kk=w.t/w.life,a=Math.sin(kk*Math.PI);tctx.globalAlpha=a*.85;TX(w.txt,w.x+Math.sin(w.t*2)*3,w.y-w.t*4,'#ffb89a',12);tctx.globalAlpha=1});
  const wk=R.en.find(e=>e.k==='weeper'&&e.fz);if(wk){tctx.globalAlpha=.7;TX('جمرتك توقفه',W/2,H*.2,'#ffd890',11,'center');tctx.globalAlpha=1}}
window.__hd={HD,EM,hdCine,hdBuild,hdFrame,emStart,emLoad,emUpdate,emFlare,emInteract,emWin,hdIntroShots,hdEndShots,ST};
