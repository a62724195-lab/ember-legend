/* =====================================================================
   HD-2D: الرندر — بكسل آرت داخل عالم بعمق: جدران مائلة، إضاءة، توهّج، عمق ميدان
   ===================================================================== */
const hdP=(q,x,y,w,h,c)=>{q.fillStyle=c;q.fillRect(x,y,w,h)};
function hdSprites(){const G=HD.gfx,mk=(w,h,fn)=>{const c=mkCv(w,h);fn(c.getContext('2d'));return c};
  const heroPx=(q,dir,fr)=>{const C='#3b2f2a',CL='#5e473a',CD='#241b19',SC='#b3401f',SL='#e66a2c',DK='#120c0a';
    const st=fr===1?1:fr===2?-1:0;
    if(dir==='s'){hdP(q,5,23+(st>0?-1:0),3,3,'#1a1210');hdP(q,9,23+(st<0?-1:0),3,3,'#1a1210');hdP(q,4+st,22,3,1,'#1a1210')}
    else{hdP(q,5,st>0?22:23,3,3,'#1a1210');hdP(q,10,st<0?22:23,3,3,'#1a1210')}
    if(dir==='s'){hdP(q,3,12,3,10,CD);hdP(q,5,10,9,12,C);hdP(q,5,11,2,10,CL);hdP(q,5,10,9,2,SC);hdP(q,4,12,2,5,SL);hdP(q,5,3,9,8,C);hdP(q,6,2,6,1,C);hdP(q,10,6,4,4,DK);hdP(q,11,7,1,1,'#ffe9a8');hdP(q,6,4,5,2,CL);hdP(q,13,14,3,4,'#2a1a10');hdP(q,14,15,2,2,'#ffb040');hdP(q,14,15,1,1,'#fff0b8')}
    else{hdP(q,5,10,8,3,C);hdP(q,4,13,10,6,C);hdP(q,3,19,12,3,C);hdP(q,5,11,2,9,CL);hdP(q,12,12,2,9,CD);hdP(q,3,21,2,1,'#050304');hdP(q,8,22,2,1,'#050304');hdP(q,13,21,2,1,'#050304');
      hdP(q,5,10,8,2,SC);hdP(q,11,12,2,5,SL);hdP(q,5,3,8,8,C);hdP(q,6,2,6,1,C);
      if(dir==='d'){hdP(q,6,6,6,4,DK);hdP(q,7,7,1,1,'#ffe9a8');hdP(q,10,7,1,1,'#ffe9a8');hdP(q,7,9,4,1,'#6a4a38');hdP(q,13,14,3,5,'#2a1a10');hdP(q,14,15,2,3,'#ffb040');hdP(q,14,15,1,1,'#fff0b8');hdP(q,12,13,2,3,C)}
      else{hdP(q,6,4,6,3,CL);hdP(q,2,13,3,5,'#2a1a10');hdP(q,2,14,2,2,'#ff9a30')}}};
  G.hero={};['d','u','s'].forEach(d=>{G.hero[d]=[0,1,2].map(fr=>mk(18,26,q=>heroPx(q,d,fr)))});
  const hunter=(q,fr,stun)=>{const A=stun?'#8ea6bd':'#5e5851',D=stun?'#51647a':'#2b2825',L=stun?'#d6ecff':'#8c857b',E=stun?'#d8f2ff':'#ff4a14',s=fr%2?1:-1;
    hdP(q,7,19,4,9+(s>0?-1:0),A);hdP(q,12,19,4,9+(s<0?-1:0),A);hdP(q,6,27,5,2,D);hdP(q,12,27,5,2,D);
    hdP(q,5,10,13,10,A);hdP(q,4,9,15,4,L);hdP(q,6,19,11,2,D);hdP(q,8,6,3,3,D);hdP(q,12,6,3,3,D);hdP(q,8,3,8,7,A);hdP(q,9,2,6,2,L);hdP(q,8,9,8,2,D);
    hdP(q,9,5,2,1,E);hdP(q,13,5,2,1,E);hdP(q,9,4,1,1,'#fff');hdP(q,13,4,1,1,'#fff');
    hdP(q,10,12,1,6,E);hdP(q,13,13,1,4,E);hdP(q,11,15,3,1,E);hdP(q,8,14,2,1,E);
    hdP(q,2,11+s,3,13,A);hdP(q,19,11-s,3,13,A);hdP(q,1,24+s,5,4,D);hdP(q,18,24-s,5,4,D);hdP(q,0,27+s,2,1,L);hdP(q,22,27-s,2,1,L)};
  G.hunter=[0,1,2,3].map(f=>mk(24,30,q=>hunter(q,f,0)));G.hunterS=mk(24,30,q=>hunter(q,0,1));
  const weeper=(q,fr,fz)=>{const R_=fz?'#55555f':'#14101a',RL=fz?'#7a7a86':'#2a2236',SK=fz?'#a0a0ac':'#ddd6e6',sw=fz?0:(fr%2?1:0);
    hdP(q,4,12,10,6,R_);hdP(q,3,18,12,13,R_);hdP(q,2,31,14,3,R_);for(let i=0;i<7;i++)hdP(q,2+i*2,33+((i+fr)%2),2,2,R_);hdP(q,4,13,2,16,RL);hdP(q,12,15,2,14,'#00000040');
    hdP(q,3+sw,4,12,6,R_);hdP(q,4+sw,2,10,3,R_);hdP(q,5+sw,6,8,6,SK);hdP(q,6+sw,7,2,4,'#00000050');hdP(q,10+sw,7,2,4,'#00000050');hdP(q,2,11,3,9,SK);hdP(q,13,11,3,9,SK);hdP(q,4,7,3,6,SK);hdP(q,11,7,3,6,SK);
    if(!fz){hdP(q,7,12,1,6,'#bfe6ff');hdP(q,10,12,1,8,'#bfe6ff');hdP(q,7,12,1,2,'#fff');hdP(q,10,12,1,2,'#fff')}};
  G.npc=mk(20,30,q=>{const R_='#5a3d22',RL='#8a5e32',RD='#33200f',SK='#d9b48c',WH='#f2ece0';hdP(q,5,10,10,14,R_);hdP(q,4,16,12,10,R_);hdP(q,3,25,14,3,RD);hdP(q,6,11,2,13,RL);hdP(q,13,13,2,12,RD);hdP(q,5,3,10,8,R_);hdP(q,6,2,8,2,RL);hdP(q,7,6,6,5,SK);hdP(q,7,9,6,5,WH);hdP(q,6,12,8,4,WH);hdP(q,8,7,1,1,'#2a1a10');hdP(q,11,7,1,1,'#2a1a10');hdP(q,8,5,4,1,WH);hdP(q,16,6,1,22,'#3b2a18');hdP(q,15,4,3,3,'#ffb040');hdP(q,16,5,1,1,'#fff0b8');hdP(q,13,15,3,3,SK)});
  const snuff=(q,fr)=>{const R_='#241c3a',RL='#3c305a',MK='#e8e4f0',s=fr%2;hdP(q,6,12,10,8,R_);hdP(q,4,18,14,10,R_);hdP(q,3,27,16,3,R_);for(let i=0;i<8;i++)hdP(q,3+i*2,29+((i+fr)%3),2,3,i%2?R_:RL);hdP(q,5,3,12,10,R_);hdP(q,7,1,8,3,R_);hdP(q,7,5,8,8,MK);hdP(q,8,8,2,3,'#0a0612');hdP(q,12,8,2,3,'#0a0612');hdP(q,9,12,4,1,'#0a0612');hdP(q,5,13,3,10,RL);hdP(q,2,15+s,3,9,R_);hdP(q,17,15-s,3,9,R_);hdP(q,0,22+s,5,3,'#8a8aa8');hdP(q,17,22-s,5,3,'#8a8aa8')};
  G.snuffer=[0,1,2,3].map(f=>mk(22,34,q=>snuff(q,f)));
  const hound=(q,fr,st)=>{const A=st?'#8ea6bd':'#4a4038',D=st?'#51647a':'#1e1814',E=st?'#d8f2ff':'#ff3a14',s=fr%2;hdP(q,2,10,18,8,A);hdP(q,3,9,14,2,D);hdP(q,17,8,7,8,A);hdP(q,22,11,4,4,D);hdP(q,18,5,2,4,D);hdP(q,22,5,2,4,D);hdP(q,20,10,1,1,E);hdP(q,22,10,1,1,E);hdP(q,23,14,3,1,'#e8e0d0');hdP(q,0,9+s,3,2,A);hdP(q,2,17,3,7+s,D);hdP(q,7,17,3,7-s,D);hdP(q,13,17,3,7+s,D);hdP(q,18,17,3,7-s,D);hdP(q,4,11,2,5,E);hdP(q,9,11,1,4,E);hdP(q,13,12,2,3,E)};
  G.hound=[0,1,2,3].map(f=>mk(28,26,q=>hound(q,f,0)));G.houndS=mk(28,26,q=>hound(q,0,1));
  G.weeper=[0,1,2,3].map(f=>mk(18,36,q=>weeper(q,f,0)));G.weeperF=mk(18,36,q=>weeper(q,0,1))}

function hdFlame(q,x,y,s,t,seed){const f1=Math.sin(t*11+seed)*.5+Math.sin(t*17+seed*2)*.5;
  for(const[col,k]of[['rgba(255,100,20,.92)',1],['rgba(255,180,60,.95)',.68],['rgba(255,244,196,1)',.36]]){q.fillStyle=col;q.beginPath();const w=5*s*k,h=(12+f1*3)*s*k;q.moveTo(x-w,y);q.quadraticCurveTo(x-w*1.2,y-h*.5,x+f1*1.6*k,y-h);q.quadraticCurveTo(x+w*1.2,y-h*.5,x+w,y);q.closePath();q.fill()}}
function hdShadow(sx,sy,w,a){ctx.fillStyle=`rgba(0,0,0,${a||.4})`;ctx.beginPath();ctx.ellipse(sx,sy,w,w*.38,0,0,7);ctx.fill()}
function hdTile(x,y){const r=EM.m.g[y];return r?r[x]:'#'}
/* ---- wall tile: top face (scaled with perspective) + front face trapezoid in bands ---- */
function hdNearOpen(x,y){const g=EM.m.g;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const c=g[y+j]&&g[y+j][x+i];if(c==='.'||c==='L'||c==='P'||c==='H'||c==='C'||c==='M')return true}return false}
function hdWall(x,y,ch,cam,alpha){const m=EM.m,G=HD.gfx,ti=m.th,sx=x*HT-cam.x,sy=y*HT-cam.y,LN=.07,LY=.025;
  const topX=(sx-W/2)*(1+LN)+W/2,topY=(sy-HHW-H/2)*(1+LY)+H/2,TW=HT*(1+LN),TH_=HT*(1+LY),v=(x*7+y*13)&3;
  const open=ch==='X'&&emGoalDone();
  if(alpha<1)ctx.globalAlpha=alpha;
  {const s=hdTile(x,y+1);
    if(s!=='#'&&s!=='V'&&s!=='K'&&s!=='S'&&s!=='B'&&s!=='X'&&s!=='G'){const tex=ch==='#'?G.wf[ti][v]:ch==='X'?(open?G.kf[ti].X1:G.kf[ti].X0):G.kf[ti][ch],yb=sy+HT,yt=topY+TH_,N=4,bh=HHW/N;
      for(let b=0;b<N;b++){const t0=b/N,t1=(b+1)/N,ya=yb+(yt-yb)*t0,yb2=yb+(yt-yb)*t1,tm=(t0+t1)/2,Lx=sx+(topX-sx)*tm,Rw=HT+(TW-HT)*tm;
        ctx.drawImage(tex,0,HHW-(b+1)*bh,HT,bh,Lx,yb2-.4,Rw+.4,ya-yb2+.9)}}}
  const tt=ch==='#'?G.wt[ti][v]:G.kt[ti][ch==='K'||ch==='S'?'K':ch]||G.wt[ti][v];
  ctx.drawImage(tt||G.wt[ti][v],topX,topY,TW+.5,TH_+.5);
  if(alpha<1)ctx.globalAlpha=1}
/* props */
function hdPillar(sx,sy){const hh=44;ctx.save();hdShadow(sx,sy+1,10,.45);
  const g=ctx.createLinearGradient(sx-7,0,sx+7,0);g.addColorStop(0,'#6a5e54');g.addColorStop(.35,'#4e443c');g.addColorStop(1,'#1e1814');
  ctx.fillStyle='#2a2320';ctx.fillRect(sx-9,sy-5,18,6);ctx.fillStyle=g;ctx.fillRect(sx-7,sy-hh+6,14,hh-8);ctx.fillStyle='#352c26';ctx.fillRect(sx-9,sy-hh+2,18,5);ctx.fillStyle='#7a6d60';ctx.fillRect(sx-9,sy-hh+2,18,1);
  ctx.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<5;i++)ctx.fillRect(sx-7,sy-hh+12+i*7,14,1);ctx.fillStyle='rgba(255,230,200,.1)';ctx.fillRect(sx-7,sy-hh+7,2,hh-12);ctx.restore()}
function hdBrazier(it,sx,sy,k){const lit=it.lit;hdShadow(sx,sy+1,8,.4);ctx.fillStyle='#1c1512';ctx.fillRect(sx-5,sy-8,2,9);ctx.fillRect(sx+3,sy-8,2,9);ctx.fillRect(sx-1,sy-6,2,7);
  ctx.fillStyle='#38302a';ctx.beginPath();ctx.ellipse(sx,sy-11,8,3.2,0,0,7);ctx.fill();ctx.fillStyle='#262019';ctx.fillRect(sx-8,sy-11,16,4);ctx.fillStyle='#4a4038';ctx.fillRect(sx-8,sy-12,16,1);
  ctx.fillStyle=lit?'#ff7a20':'#15100c';ctx.beginPath();ctx.ellipse(sx,sy-12,6,2.2,0,0,7);ctx.fill()}
function hdAltar(it,sx,sy,k){hdShadow(sx,sy+1,13,.45);ctx.fillStyle='#27211e';ctx.fillRect(sx-11,sy-5,22,6);ctx.fillStyle='#3a322c';ctx.fillRect(sx-8,sy-17,16,13);ctx.fillStyle='#4c423a';ctx.fillRect(sx-8,sy-17,16,1);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(sx-8,sy-5,16,1);
  ctx.fillStyle='#2a2420';ctx.beginPath();ctx.ellipse(sx,sy-20,10,3.6,0,0,7);ctx.fill();ctx.fillStyle='#1a1512';ctx.fillRect(sx-10,sy-20,20,4);ctx.fillStyle='#524840';ctx.fillRect(sx-10,sy-21,20,1);
  ctx.fillStyle=it.lit?'#ff8a30':'#0e0a08';ctx.beginPath();ctx.ellipse(sx,sy-21,7,2.4,0,0,7);ctx.fill()}
function hdRune(it,sx,sy,k){hdShadow(sx,sy+1,7,.4);ctx.fillStyle='#2e2824';ctx.fillRect(sx-6,sy-20,12,21);ctx.fillStyle='#3c342e';ctx.fillRect(sx-6,sy-20,12,2);ctx.fillStyle='#1c1816';ctx.fillRect(sx+3,sy-18,3,19);ctx.fillStyle='rgba(255,230,200,.1)';ctx.fillRect(sx-6,sy-20,1,21)}
function hdHeart(sx,sy,open,t,hpf){const pul=1+Math.sin(t*3.2)*.035+(open?Math.sin(t*14)*.02:0),w=34*pul;ctx.save();hdShadow(sx,sy+2,36,.5);
  ctx.fillStyle='#120708';ctx.beginPath();ctx.moveTo(sx-w,sy-8);ctx.bezierCurveTo(sx-w*1.15,sy-46,sx-w*.4,sy-62*pul,sx,sy-44*pul);ctx.bezierCurveTo(sx+w*.4,sy-62*pul,sx+w*1.15,sy-46,sx+w,sy-8);ctx.bezierCurveTo(sx+w*.7,sy+8,sx+w*.2,sy+10,sx,sy+14);ctx.bezierCurveTo(sx-w*.2,sy+10,sx-w*.7,sy+8,sx-w,sy-8);ctx.fill();
  const g=ctx.createLinearGradient(sx-w,0,sx+w,0);g.addColorStop(0,'rgba(120,40,30,.5)');g.addColorStop(.5,'rgba(30,8,8,.0)');g.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=open?'#ffcf70':'#a8321a';ctx.lineWidth=1.3;for(let i=0;i<7;i++){ctx.beginPath();let x=sx+(i-3)*8,y=sy-40*pul+(i%3)*4;ctx.moveTo(x,y);for(let j=0;j<4;j++){x+=Math.sin(i*5+j*2)*5;y+=8;ctx.lineTo(x,y)}ctx.stroke()}
  ctx.fillStyle='#0a0405';ctx.beginPath();ctx.ellipse(sx,sy-20,13,open?10:3.2,0,0,7);ctx.fill();ctx.strokeStyle='#3a0e0a';ctx.lineWidth=2;ctx.stroke();ctx.restore()}
/* ---- lights ---- */
function hdTree(sx,sy,sd){hdShadow(sx,sy+1,10,.4);ctx.save();ctx.fillStyle='#1e1410';ctx.fillRect(sx-2,sy-26,4,27);ctx.strokeStyle='#241812';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sy-18);ctx.lineTo(sx-9,sy-30);ctx.moveTo(sx,sy-22);ctx.lineTo(sx+10,sy-34);ctx.moveTo(sx,sy-26);ctx.lineTo(sx-3,sy-40);ctx.stroke();
  for(let i=0;i<14;i++){const a=hdRn(sd,i),b=hdRn(sd+1,i);ctx.fillStyle=i%3?'#1f4a34':'#2f6a46';ctx.fillRect(sx-12+a*24,sy-44+b*22,3,2)}ctx.fillStyle='rgba(120,200,150,.12)';ctx.fillRect(sx-1,sy-26,1,26);ctx.restore()}
function hdPuzzleProp(o,sx,sy,t){hdShadow(sx,sy+1,11,.45);ctx.fillStyle='#241c1a';ctx.fillRect(sx-9,sy-4,18,5);ctx.fillStyle='#3a302a';ctx.fillRect(sx-7,sy-17,14,14);ctx.fillStyle='#4c4038';ctx.fillRect(sx-7,sy-17,14,1);
  ctx.fillStyle='#14100e';ctx.beginPath();ctx.moveTo(sx-9,sy-17);ctx.lineTo(sx+9,sy-17);ctx.lineTo(sx+6,sy-25);ctx.lineTo(sx-6,sy-25);ctx.closePath();ctx.fill();ctx.fillStyle=o.solved?'#5a4a30':'#1c3a30';ctx.beginPath();ctx.moveTo(sx-7,sy-18);ctx.lineTo(sx+7,sy-18);ctx.lineTo(sx+5,sy-24);ctx.lineTo(sx-5,sy-24);ctx.closePath();ctx.fill()}
function hdFountain(o,sx,sy,t){ctx.save();ctx.fillStyle='#2c2622';ctx.beginPath();ctx.ellipse(sx,sy,30,17,0,0,7);ctx.fill();ctx.fillStyle='#4a423a';ctx.beginPath();ctx.ellipse(sx,sy-1,28,15,0,0,7);ctx.fill();ctx.fillStyle='#142a38';ctx.beginPath();ctx.ellipse(sx,sy-1,24,12,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba(140,210,255,.35)';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(sx,sy-1,6+((t*8+i*8)%22),3+((t*4+i*4)%10),0,0,7);ctx.stroke()}ctx.fillStyle='#5a5148';ctx.fillRect(sx-2,sy-14,4,12);ctx.restore()}
function hdLights(cam,t){const R=EM,m=R.m,L=[],hx=R.x*HT-cam.x,hy=R.y*HT-cam.y-8;const fl=1+Math.sin(t*9)*.035+Math.sin(t*23)*.02,rad=emRad()*HT*.85;
  L.push({x:hx,y:hy,r:rad,a:1,gl:.22,col:R.etype&&EMB_T[R.etype]?EMB_T[R.etype].c:'#ff9a40'});
  for(const it of m.items){if(it.gone)continue;const x=it.x*HT-cam.x,y=it.y*HT-cam.y;if(x<-130||x>W+130||y<-130||y>H+130)continue;
    if((it.k==='brazier'||it.k==='altar')&&it.lit)L.push({x,y:y-14,r:(it.k==='altar'?96:86)*(1+Math.sin(t*8+it.x)*.03),a:.95,gl:.28,col:'#ff8a30'});
    else if(it.k==='coal')L.push({x,y:y-3,r:34,a:.55,gl:.2,col:'#ff7a20'});
    else if(it.k==='shard'||it.k==='relic')L.push({x,y:y-8,r:44,a:.75,gl:.3,col:'#ffd070'});
    else if(it.k==='vein'&&it.cd<=0)L.push({x,y,r:40,a:.55,gl:.25,col:'#ff8a30'});
    else if(it.k==='seal'&&it.lit)L.push({x,y:y-8,r:80,a:.95,gl:.3,col:'#ffd070'});
    else if(it.k==='puzzle')L.push({x,y:y-14,r:it.solved?36:58,a:.7,gl:.2,col:it.solved?'#ffd070':'#9affc0'});
    else if(it.k==='fountain')L.push({x,y:y-8,r:70,a:.6,gl:.25,col:'#7ad0ff'});
    else if(it.k==='rune'&&!it.read)L.push({x,y:y-10,r:26,a:.3,gl:.12,col:m.th===2?'#ff6a3a':'#ffc070'})}
  if(R.beam){const a=Math.max(0,1-R.beam.t/1.4);R.beam.pts.forEach((p,i)=>{if(i%2===0)L.push({x:p[0]*HT-cam.x,y:p[1]*HT-cam.y-8,r:44,a:.8*a,gl:0,col:'#ffd890'})})}
  if(m.npc)L.push({x:m.npc.x*HT-cam.x,y:m.npc.y*HT-cam.y-12,r:54,a:.7,gl:.22,col:'#ffb060'});
  hdBossLights(cam,L);hdSecLights(cam,L);
  if(m.arena){const hxp=m.arena.hx*HT-cam.x,hyp=m.arena.hy*HT-cam.y,op=R.hp&&R.hp.open;L.push({x:hxp,y:hyp-12,r:(op?210:130)+Math.sin(t*3)*8,a:op?1:.75,gl:op?.4:.26,col:op?'#ffcf70':'#ff3a1a'})}
  if(R.ring>0){const k=R.ring/.8;L.push({x:hx,y:hy,r:60+k*260,a:(1-k)*1,gl:.2,col:'#ffd890'})}
  return L}
/* ---- particles (screen-space, parallax) ---- */
function hdParts(dt,cam,m){let P=HD.parts;if(!P){P=HD.parts=[];const r=rcRnd(9);for(let i=0;i<110;i++)P.push({x:r()*W,y:r()*H,d:.4+r()*1.2,ph:r()*9,k:r()<.55?0:1,v:6+r()*18})}
  const heavy=m.th===2?1.6:1;
  for(const p of P){const ash=p.k===1;p.y+=(ash?p.v*.5:-p.v*heavy)*dt;p.x+=Math.sin(HD.t*.8+p.ph)*8*dt-(ash?0:2*dt);if(p.y<-4)p.y=H+4;if(p.y>H+4)p.y=-4;if(p.x<-4)p.x+=W+8;if(p.x>W+4)p.x-=W+8}
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const p of P){if(p.k===1){ctx.globalAlpha=.35*p.d;ctx.fillStyle='#b8aca0';ctx.fillRect((p.x-cam.x*.15*p.d+W*9)%W,p.y,1.2,1.2)}
    else{const fl=.5+.5*Math.sin(HD.t*5+p.ph);ctx.globalAlpha=(.4+.5*fl)*Math.min(1,p.d);ctx.fillStyle=fl>.7?'#ffe0a0':'#ff8a30';ctx.fillRect((p.x-cam.x*.25*p.d+W*9)%W,p.y,p.d>1?2:1.4,p.d>1?2:1.4)}}
  ctx.restore();ctx.globalAlpha=1}
/* ---- post: bloom + tilt-shift ---- */
let hdB1=null,hdB2=null,hdBm=null;
function hdPost(){if(!hdB1){hdB1=mkCv(192,108);hdB2=mkCv(64,36);hdBm=mkCv(192,108)}
  const a=hdB1.getContext('2d'),b=hdB2.getContext('2d'),c=hdBm.getContext('2d');
  a.imageSmoothingEnabled=true;a.globalCompositeOperation='source-over';a.drawImage(cv,0,0,cv.width,cv.height,0,0,192,108);
  b.imageSmoothingEnabled=true;b.globalCompositeOperation='source-over';b.clearRect(0,0,64,36);b.drawImage(hdB1,0,0,192,108,0,0,64,36);b.globalCompositeOperation='multiply';b.drawImage(hdB2,0,0);b.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=true;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55;ctx.drawImage(hdB2,0,0,64,36,0,0,W,H);ctx.globalAlpha=.16;ctx.drawImage(hdB1,0,0,192,108,0,0,W,H);ctx.restore();
  if(!LOWQ){c.globalCompositeOperation='source-over';c.clearRect(0,0,192,108);c.drawImage(hdB1,0,0);c.globalCompositeOperation='destination-in';const g=c.createLinearGradient(0,0,0,108);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.2,'rgba(0,0,0,0)');g.addColorStop(.8,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=g;c.fillRect(0,0,192,108);
    ctx.save();ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(hdBm,0,0,192,108,0,0,W,H);ctx.restore()}}
/* ---- the main world draw ---- */
function hdWorld(dt,cam,Z,heroOn,heroPose){const R=EM,m=R.m,th=EM_TH[m.th],G=HD.gfx,t=HD.t;
  const ox=Math.round(cam.x),oy=Math.round(cam.y),cm={x:ox,y:oy};
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#030203';ctx.fillRect(0,0,W,H);
  ctx.save();if(Z!==1){ctx.translate(W/2,H/2);ctx.scale(Z,Z);ctx.translate(-W/2,-H/2)}
  ctx.drawImage(HD.fl,-ox,-oy);hdDynFloor(ox,oy,t);
  /* entities */
  const E=[],fr=Math.floor(t*8),hxp=R.x,hyp=R.y;
  const push=(y,f)=>E.push({y,f});
  m.items.forEach((o,k)=>{if(o.gone)return;const sx=o.x*HT-ox,sy=o.y*HT-oy;if(sx<-40||sx>W+40||sy<-60||sy>H+60)return;
    if(o.k==='mirror')push(o.y,()=>hdMirror(o,sx,sy,t));else if(o.k==='brazier')push(o.y,()=>hdBrazier(o,sx,sy,k));else if(o.k==='altar')push(o.y,()=>hdAltar(o,sx,sy,k));else if(o.k==='rune')push(o.y,()=>hdRune(o,sx,sy,k));else if(o.k==='puzzle')push(o.y,()=>hdPuzzleProp(o,sx,sy,t));else if(o.k==='fountain')push(o.y-1.4,()=>hdFountain(o,sx,sy,t));else if(o.k==='ember')push(o.y,()=>hdEmberPick(o,sx,sy,t))});
  const c0=Math.max(0,Math.floor(ox/HT)-2),c1=Math.min(m.w-1,Math.ceil((ox+W/Z)/HT)+2),r0=Math.max(0,Math.floor(oy/HT)-3),r1=Math.min(m.h-1,Math.ceil((oy+H/Z)/HT)+3);
  for(let y=r0;y<=r1;y++)for(let x=c0;x<=c1;x++)if(m.g[y][x]==='P')push(y+.5,()=>m.th===5?hdTree((x+.5)*HT-ox,(y+.75)*HT-oy,x*7+y):hdPillar((x+.5)*HT-ox,(y+.75)*HT-oy));
  if(R.bs&&!R.bs.dead)push(R.bs.y+.9,()=>hdBossDraw(R.bs,R.bs.x*HT-ox,R.bs.y*HT-oy,t));
  if(m.arena)push(m.arena.hy+.9,()=>hdHeart(m.arena.hx*HT-ox,m.arena.hy*HT-oy+8,R.hp&&R.hp.open,t));
  R.en.forEach(e=>{if(e.st==='dorm'||e.away>0)return;const sx=e.x*HT-ox,sy=e.y*HT-oy;if(sx<-40||sx>W+40||sy<-50||sy>H+50)return;
    if(e.k==='weeper')push(e.y,()=>{hdShadow(sx,sy+1,8,.4);const img=e.fz?G.weeperF:G.weeper[fr%4];ctx.globalAlpha=e.fz?(.7+.3*Math.sin(t*38)):1;ctx.drawImage(img,Math.round(sx-9),Math.round(sy-34+(e.fz?0:Math.sin(t*3+e.t)*1.2)));ctx.globalAlpha=1});
    else if(e.k==='hound')push(e.y,()=>{hdShadow(sx,sy+1,10,.45);const img=e.stun>0?G.houndS:G.hound[fr%4],fl=Math.cos(e.dir||0)<0;ctx.save();ctx.translate(Math.round(sx),Math.round(sy-24));if(fl){ctx.scale(-1,1);ctx.drawImage(img,-14,0)}else ctx.drawImage(img,-14,0);ctx.restore()});
    else if(e.k==='snuffer')push(e.y,()=>{hdShadow(sx,sy+1,9,.35);ctx.globalAlpha=e.stun>0?.55:.96;ctx.drawImage(G.snuffer[fr%4],Math.round(sx-11),Math.round(sy-33+Math.sin(t*2.4+e.t)*1.5));ctx.globalAlpha=1});
    else push(e.y,()=>{hdShadow(sx,sy+1,9,.45);const img=e.stun>0?G.hunterS:G.hunter[fr%4];ctx.drawImage(img,Math.round(sx-12+(e.fx||0)),Math.round(sy-29))})});
  if(m.npc)push(m.npc.y,()=>{const N=m.npc,sx=N.x*HT-ox,sy=N.y*HT-oy,bob=Math.sin(t*1.8)*1.1,fl=R.x<N.x;hdShadow(sx,sy+1,8,.35);ctx.save();ctx.globalAlpha=R.lv>=1?.8:.94;ctx.translate(Math.round(sx),Math.round(sy-29+bob));if(fl){ctx.scale(-1,1);ctx.drawImage(G.npc,-10,0)}else ctx.drawImage(G.npc,-10,0);ctx.restore()});
  if(R.ghost)push(R.ghost.y,()=>{const sx=R.ghost.x*HT-ox,sy=R.ghost.y*HT-oy;ctx.globalAlpha=(.3+.5*Math.sin(t*40))*Math.min(1,R.ghost.t*3);ctx.drawImage(G.hunter[fr%4],Math.round(sx-12),Math.round(sy-29));ctx.globalAlpha=1});
  if(heroOn){const p=heroPose||{};const hx=p.x!==undefined?p.x:R.x,hy=p.y!==undefined?p.y:R.y,sx=hx*HT-ox,sy=hy*HT-oy,mv=p.mv!==undefined?p.mv:R.mv,dr=p.d||R.fd||'d',fl=p.fl!==undefined?p.fl:R.flip;
    push(hy,()=>{hdShadow(sx,sy+1,7,.45);const fi=mv>.2?(1+((Math.floor(HD.t*8))%2)):0,img=G.hero[dr][fi],bob=mv>.2?Math.abs(Math.sin(HD.t*14))*-1.3:0;
      ctx.save();ctx.translate(Math.round(sx),Math.round(sy-25+bob));if(fl){ctx.scale(-1,1);ctx.drawImage(img,-9,0)}else ctx.drawImage(img,-9,0);ctx.restore()})}
  E.sort((a,b)=>a.y-b.y);
  const hrow=Math.floor(hyp),hcol=Math.floor(hxp);let ei=0;
  for(let y=r0;y<=r1;y++){
    for(let x=c0;x<=c1;x++){const ch=m.g[y][x];if((ch==='#'||ch==='V'||ch==='B'||ch==='K'||ch==='S'||ch==='X'||ch==='G')&&hdNearOpen(x,y)){let al=1;if(heroOn&&y>hrow&&y<=hrow+2&&Math.abs(x-hcol)<=1)al=.32;hdWall(x,y,ch,cm,al)}}
    while(ei<E.length&&Math.floor(E[ei].y)<=y){E[ei].f();ei++}}
  while(ei<E.length){E[ei].f();ei++}
  ctx.restore();
  /* fog + light */
  const Ls=hdLights(cm,t),f=fctx,fs=FOGS,am=th.amb;
  f.setTransform(fs*Z,0,0,fs*Z,fs*W/2*(1-Z),fs*H/2*(1-Z));f.globalCompositeOperation='source-over';f.clearRect(-W,-H,3*W,3*H);
  f.fillStyle=`rgba(${am[0]},${am[1]},${am[2]},${R.dark>0?.985:th.ambA})`;f.fillRect(-W,-H,3*W,3*H);f.globalCompositeOperation='destination-out';
  for(const l of Ls)light(f,l.x,l.y,l.r*(R.dark>0&&l===Ls[0]?.4:1),l.a);f.globalCompositeOperation='source-over';
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(fogCv,0,0,fogCv.width,fogCv.height,0,0,W,H);ctx.imageSmoothingEnabled=false;
  /* emissive */
  ctx.save();if(Z!==1){ctx.translate(W/2,H/2);ctx.scale(Z,Z);ctx.translate(-W/2,-H/2)}
  ctx.globalCompositeOperation='lighter';
  for(const l of Ls)glowAdd(l.x,l.y,l.r*.75,l.col,l.gl);
  for(const[lx,ly]of HD.lava){const sx=lx*HT-ox,sy=ly*HT-oy;if(sx<-HT||sx>W+HT||sy<-HT||sy>H+HT)continue;const k=.5+.5*Math.sin(t*1.7+lx*.9+ly*1.3);ctx.fillStyle=`rgba(255,${110+k*80|0},30,${.14+.1*k})`;ctx.fillRect(sx,sy,HT,HT);ctx.fillStyle='rgba(255,240,150,.4)';ctx.fillRect(sx+((t*9+ly*7+lx*3)%HT),sy+((lx*5+ly*3)%HT),4,1);ctx.fillRect(sx+((t*6+ly*11)%HT),sy+((lx*7)%HT)+9,3,1);if((lx+ly)%2===0)glowAdd(sx+HT/2,sy+HT/2,26,'#ff7a20',.1)}
  ctx.globalCompositeOperation='source-over';hdDynEmis(ox,oy,t);
  m.items.forEach((o,k)=>{if(o.gone)return;const sx=o.x*HT-ox,sy=o.y*HT-oy;if(sx<-40||sx>W+40||sy<-60||sy>H+60)return;
    if((o.k==='brazier'||o.k==='altar')&&o.lit){const by=o.k==='altar'?sy-21:sy-12;hdFlame(ctx,sx,by,o.k==='altar'?1.15:1,t,k)}
    else if(o.k==='coal'){ctx.fillStyle='#2a1208';ctx.fillRect(sx-4,sy-3,8,4);const p=.6+.4*Math.sin(t*5+k);ctx.fillStyle=`rgba(255,${100+p*90|0},30,1)`;ctx.fillRect(sx-3,sy-3,3,2);ctx.fillRect(sx,sy-2,3,2);ctx.fillRect(sx-1,sy-4,2,1);ctx.fillStyle='#fff0b0';ctx.fillRect(sx-1,sy-3,1,1)}
    else if(o.k==='shard'){const by=sy-14+Math.sin(t*2+k)*2.5;ctx.fillStyle='#ffb040';ctx.beginPath();ctx.moveTo(sx,by-9);ctx.lineTo(sx+5,by);ctx.lineTo(sx,by+9);ctx.lineTo(sx-5,by);ctx.fill();ctx.fillStyle='#fff0b8';ctx.beginPath();ctx.moveTo(sx,by-9);ctx.lineTo(sx+2,by);ctx.lineTo(sx,by+4);ctx.lineTo(sx-2,by);ctx.fill();glowAdd(sx,by,22,'#ffb040',.5)}
    else if(o.k==='relic'){const by=sy-12+Math.sin(t*2.4+k)*2;ctx.strokeStyle='#ffe9a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,by,5,0,7);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(sx-1,by-8,2,2);glowAdd(sx,by,24,'#ffe9a0',.55)}
    else if(o.k==='rune'){ctx.globalAlpha=o.read?.35:.55+.35*Math.sin(t*2.5+k);ctx.fillStyle=th.rune;ctx.fillRect(sx-1,sy-17,2,9);ctx.fillRect(sx-3,sy-14,6,2);ctx.fillRect(sx-2,sy-10,1,3);ctx.fillRect(sx+1,sy-10,1,3);ctx.globalAlpha=1}
    else if(o.k==='puzzle'){const gy=sy-21,pu=.6+.4*Math.sin(t*2.4+k);glowAdd(sx,gy,o.solved?16:22,o.solved?'#ffd070':'#9affc0',(o.solved?.4:.55)*pu+.2);ctx.fillStyle=o.solved?'#ffe9a0':'#bfffd8';ctx.fillRect(sx-1,gy-2,2,4);ctx.fillRect(sx-3,gy,6,1)}
    else if(o.k==='fountain'){glowAdd(sx,sy-3,34,'#7ad0ff',.22+.06*Math.sin(t*2));ctx.fillStyle='rgba(180,230,255,.7)';for(let i=0;i<7;i++){const ph=(t*.8+i/7)%1,a=i/7*6.283;ctx.fillRect(sx+Math.cos(a)*ph*9,sy-14+ph*(1-ph)*-26+ph*14,1.5,1.5)}}
    else if(o.k==='vein'&&o.cd<=0){const vx=o.tx*HT-ox,vy=o.ty*HT-oy;ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(vx+HT/2,vy+HHW*.4+4,26,'#ff8a30',.28+.12*Math.sin(t*3+k));ctx.restore()}});
  R.en.forEach(e=>{if(e.st==='dorm'||e.away>0)return;const sx=e.x*HT-ox,sy=e.y*HT-oy;if(sx<-40||sx>W+40||sy<-50||sy>H+50)return;
    if(e.k==='hound'){const hu=e.st==='hunt'&&e.stun<=0,c=e.stun>0?'#cfeaff':'#ff3a10';glowAdd(sx+(Math.cos(e.dir||0)<0?-7:7),sy-17,hu?14:8,c,hu?.55:.3)}
    else if(e.k==='snuffer'){ctx.fillStyle='#e6f0ff';const ex=sx-11;ctx.fillRect(ex+8,sy-26,2,2);ctx.fillRect(ex+12,sy-26,2,2);glowAdd(sx,sy-24,e.st==='hunt'?18:11,'#9ab0ff',.4)}
    else if(e.k==='hunter'){const hu=e.st==='hunt'&&e.stun<=0,c=e.stun>0?'#cfeaff':'#ff3a10';ctx.fillStyle=c;const ex=sx-12+(e.fx||0);ctx.fillRect(ex+9,sy-25,2,1);ctx.fillRect(ex+13,sy-25,2,1);glowAdd(sx,sy-24,hu?15:9,c,hu?.55:.3)}
    else if(!e.fz){ctx.fillStyle='#bfe6ff';glowAdd(sx,sy-20,9,'#bfe6ff',.2)}});
  hdBossGlow(ox,oy,t);hdJamGlow(ox,oy,t);hdSecGlow(ox,oy,t);
  if(m.arena){const op=R.hp&&R.hp.open,hx=m.arena.hx*HT-ox,hy=m.arena.hy*HT-oy;const pu=.6+.4*Math.sin(t*3);glowAdd(hx,hy-12,op?120:70,op?'#ffd070':'#ff3010',op?.7:.35*pu+.15);
    ctx.fillStyle=op?'#fff0b0':'#ff4a1a';ctx.beginPath();ctx.ellipse(hx,hy-12,op?9:2.6,op?7:1.6,0,0,7);ctx.fill();
    if(op){ctx.strokeStyle='rgba(255,220,130,.4)';ctx.lineWidth=1;for(let i=0;i<14;i++){const a=i/14*Math.PI*2+t*.5;ctx.beginPath();ctx.moveTo(hx+Math.cos(a)*14,hy-12+Math.sin(a)*10);ctx.lineTo(hx+Math.cos(a)*(60+Math.sin(t*6+i)*14),hy-12+Math.sin(a)*(44+Math.sin(t*6+i)*10));ctx.stroke()}}}
  if(m.npc){const N=m.npc,sx=N.x*HT-ox,sy=N.y*HT-oy,fl=R.x<N.x;if(!N.met){ctx.globalCompositeOperation='source-over';const by=sy-40+Math.sin(t*3)*2;ctx.fillStyle='#ffd070';ctx.beginPath();ctx.arc(sx,by,6,0,7);ctx.fill();ctx.fillStyle='#2a1206';ctx.fillRect(sx-1,by-3.5,2,4.5);ctx.fillRect(sx-1,by+2,2,1.6);ctx.globalCompositeOperation='lighter';glowAdd(sx,by,16,'#ffb040',.5)}glowAdd(sx+(fl?-6:6),sy-24,13,'#ffb040',.5);glowAdd(sx,sy-14,22,'#ffb060',.14);if(R.lv>=1){glowAdd(sx,sy-18,30,'#ff9a50',.22+.08*Math.sin(t*2));for(let i=0;i<5;i++){const ph=(t*.5+i*.2)%1;ctx.globalAlpha=Math.sin(ph*Math.PI)*.8;ctx.fillStyle='#ffc070';ctx.fillRect(sx+Math.sin(i*2+t)*5,sy-12-ph*26,1.5,1.5)}ctx.globalAlpha=1}}
  /* hero ember */
  if(heroOn){const p=heroPose||{},hx=(p.x!==undefined?p.x:R.x)*HT-ox,hy=(p.y!==undefined?p.y:R.y)*HT-oy,dr=p.d||R.fd||'d',fl=p.fl!==undefined?p.fl:R.flip;
    const lx=hx+(dr==='s'?(fl?-8:8):dr==='d'?5:-6),ly=hy-11+Math.sin(t*7)*.6;glowAdd(lx,ly,16+(R.E||60)*.1,'#ffb050',.5)}
  /* flare */
  if(R.ring>0&&heroOn){const k=R.ring/.8,hx=R.x*HT-ox,hy=R.y*HT-oy-8;ctx.strokeStyle=`rgba(255,210,130,${.7*(1-k)})`;ctx.lineWidth=2.4*(1-k)+.6;ctx.beginPath();ctx.arc(hx,hy,k*HT*7,0,7);ctx.stroke();
    if(k<.5){const kk=k/.5,rg=ctx.createRadialGradient(hx,hy,2,hx,hy,HT*7);rg.addColorStop(0,`rgba(255,220,150,${.5*(1-kk)})`);rg.addColorStop(1,'rgba(255,160,60,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(hx,hy);ctx.arc(hx,hy,HT*7*Math.min(1,kk*2+.2),R.a-1,R.a+1);ctx.closePath();ctx.fill()}}
  R.fx.forEach(p=>{const sx=p.x*HT-ox,sy=p.y*HT-oy-p.life*18;ctx.globalAlpha=1-p.life/p.max;ctx.fillStyle='#ffa040';ctx.fillRect(sx,sy,2,2);ctx.fillStyle='#fff0b0';ctx.fillRect(sx,sy,1,1)});ctx.globalAlpha=1;
  ctx.restore();
  /* god rays for the first two halls */
  if(m.th<2){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const bx=(i*190+60-ox*.2)%(W+160)-40,sw=40+i*14,a=.045+.02*Math.sin(t*.4+i);const gr=ctx.createLinearGradient(bx,0,bx-90,H);gr.addColorStop(0,`rgba(${m.th?'150,180,255':'255,190,120'},${a})`);gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(bx,0);ctx.lineTo(bx+sw,0);ctx.lineTo(bx+sw-110,H);ctx.lineTo(bx-110,H);ctx.closePath();ctx.fill()}ctx.restore()}
  hdParts(dt,cm,m);
  hdPost();
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=false}
