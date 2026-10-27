/* ---------- rendering ---------- */
let cx=0,cy=0,SIGHT=150;
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(rp(x-cx),rp(y-cy),w,h)};
const GC=['#8a7a68','#4aa3ff','#b872ff','#ffb02e'];
function shadow(x,y,w,a=.32){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(rp(x-cx),rp(y-cy),w*1.1,w*.42,0,0,7);ctx.fill()}
const spr=(s,x,y,flip,sc=1,al=1)=>{const c=s.cv||s,w=Math.round(c.width*sc),h=Math.round(c.height*sc);ctx.save();if(al!==1)ctx.globalAlpha=al;
  if(flip){ctx.translate(rp(x-cx),rp(y-cy));ctx.scale(-1,1);ctx.drawImage(c,-w+Math.round((s.ax||0)*sc),-Math.round((s.ay||0)*sc),w,h)}
  else ctx.drawImage(c,rp(x-cx-(s.ax||0)*sc),rp(y-cy-(s.ay||0)*sc),w,h);ctx.restore()};
/* hero */
function drawHero(){
  const x=P.x,y=P.y;if(P.inv>0&&((G.time*30)|0)%2&&P.dash<=0)return;
  const z=P.dash>0?Math.sin(Math.max(0,1-P.dash/.17)*Math.PI)*7:0,yy=y-z;
  shadow(x,y+7,6-z*.3);
  const w=(P.mw=(P.mw||0)+((P.moving?1:0)-(P.mw||0))*.25)*Math.sin(P.wt*13),f=P.fx,fl=P.flash>0,idl=(1-(P.mw||0))*(Math.sin(G.time*2.6)*.5+.5);
  const atkP=P.anim>0?P.anim/.16:0,lean=rp((P.anim>0?Math.cos(P.animA)*2.4*Math.sin(atkP*Math.PI):0)+(P.moving?w*.6:0)),bob=-Math.abs(w)*1.4;
  const X=x+lean,Y=rp(yy+bob);
  const bc=eq.boots?(eq.boots.rar?GC[eq.boots.rar]:'#7a5a40'):'#5a4636',cc=fl?'#fff':eq.chest?(eq.chest.rar?GC[eq.chest.rar]:'#c9b58a'):'#c9b58a',hc=eq.helm?(eq.helm.rar?GC[eq.helm.rar]:'#8a8a94'):'#2b1d14';
  const sw=w*2.2,lg1=-Math.max(0,w)*2.2,lg2=-Math.max(0,-w)*2.2;
  R(x-4-sw*.5,yy+3+lg1,3,5+lg1*.5,bc);R(x+1+sw*.5,yy+3+lg2,3,5+lg2*.5,bc);
  R(X-5,Y-4,10,8,cc);R(X-5,Y+2,10,2,'#00000030');if(eq.chest&&eq.chest.rar)R(X-1,Y-4,2,8,'#ffffff40');
  if(eq.gloves){const gc=eq.gloves.rar?GC[eq.gloves.rar]:'#7a5a40';R(X-6,Y-1+(w*1.6),2,3,gc);R(X+4,Y-1-(w*1.6),2,3,gc)}
  else{R(X-6,Y-1+(w*1.6),2,3,'#e0b08a');R(X+4,Y-1-(w*1.6),2,3,'#e0b08a')}
  if(eq.amulet)R(X-1,Y-5,2,2,eq.amulet.rar?GC[eq.amulet.rar]:'#d8a830');
  const hdy=Y-idl*1.2-Math.abs(w)*.4;
  R(X-4,hdy-11,8,7,fl?'#fff':'#e0b08a');R(X-5,hdy-12,10,4,hc);if(eq.helm){R(X-5,hdy-9,2,5,hc);R(X+3,hdy-9,2,5,hc);R(X-1,hdy-14,2,2,GC[eq.helm.rar])}
  R(X+(f>0?1:-3),hdy-8,2,2,'#1a1210');
  const w0=eq.weapon,wc=w0.rar?RCOL[w0.rar]:'#d9d2c0';
  const hx=rp(X+f*5-cx),hy=rp(Y-cy);
  if(w0.ranged&&w0.type==='bow'){const aa=(P.anim>0||P.recoil>0||P.atk>0)?P.animA:(f>0?.25:Math.PI-.25),rec=P.recoil>0?-3:0;ctx.save();ctx.translate(hx+Math.cos(aa)*(8+rec),hy+Math.sin(aa)*(8+rec));ctx.rotate(aa+Math.PI/4);if(w0.rar>=2&&!LOWQ){ctx.shadowColor=wc;ctx.shadowBlur=5}ctx.drawImage(itemSprite('bow',w0.rar),-8,-8);ctx.restore();return}
  const a=w0.ranged?(P.anim>0?P.animA:(f>0?-1.0:Math.PI+1.0)):P.anim>0?P.animA-w0.arc*Math.PI/360+(1-P.anim/.16)*w0.arc*Math.PI/180:(f>0?.9:Math.PI-.9);
  if(P.anim>0&&!w0.ranged){ctx.save();ctx.strokeStyle=wc;ctx.globalAlpha=.45*(P.anim/.16);ctx.lineWidth=4;ctx.beginPath();ctx.arc(x-cx,yy-cy,w0.rng*.8,P.animA-w0.arc*Math.PI/360,a);ctx.stroke();ctx.restore()}
  ctx.save();ctx.translate(hx,hy);ctx.rotate(a+Math.PI/4);const ws=itemSprite(w0.type,w0.rar);
  if(w0.rar>=2&&!LOWQ){ctx.shadowColor=wc;ctx.shadowBlur=5}
  ctx.drawImage(ws,-2,-14);ctx.restore();
}
const FLY={wisp:1,bat:1,shardling:1,wraith:1};
function drawEnemy(e){
  const fl=e.flash>0||(e.wind>0&&((G.time*24)|0)%2),s=enemySprite(e.type),fy=FLY[e.type]?3+Math.sin(G.time*5+e.ph)*2:Math.sin(G.time*8+e.x)*.8;
  if(e.elite&&!e.mini){ctx.fillStyle='#ffb02e30';ctx.beginPath();ctx.arc(rp(e.x-cx),rp(e.y-cy-4),e.r+6+Math.sin(G.time*6),0,7);ctx.fill()}
  if(e.mini){ctx.fillStyle=`rgba(255,80,40,${.14+.06*Math.sin(G.time*5)})`;ctx.beginPath();ctx.arc(rp(e.x-cx),rp(e.y-cy-6),e.r+10,0,7);ctx.fill()}
  shadow(e.x,e.y+e.r*.6,e.r*(FLY[e.type]?.75:1));
  const flip=faceFlip(e,P.x),sc=e.sc,w=rp(34*sc),h=rp(34*sc);
  if(e.wind>0){R(e.x-1,e.y-e.r-18,2,5,'#ff4a3a');R(e.x-1,e.y-e.r-11,2,2,'#ff4a3a')}
  ctx.save();ctx.translate(rp(e.x-cx),rp(e.y+e.r*.6-cy-fy));if(flip)ctx.scale(-1,1);
  const mv=gait(e),fs=FLY[e.type]?s.cv:s.cv;let src=pickFrame(e,s.cv,mv,e.wind>0,false,!!FLY[e.type]);if(fl){src=pickFrame(e,s.fl,mv,e.wind>0,false,!!FLY[e.type])}
  if(!FLY[e.type])sunShadow(src,flip,-rp(17*sc),-rp(29*sc),w,h);
  ctx.drawImage(src,-rp(17*sc),-rp(29*sc),w,h);ctx.restore();
  if(e.hp<e.mhp||e.mini){const bw=e.r*2+8;R(e.x-bw/2,e.y-e.r-17*sc-fy,bw,3,'#000');R(e.x-bw/2,e.y-e.r-17*sc-fy,bw*Math.max(0,e.hp/e.mhp),3,e.mini?'#ff4a2a':e.elite?'#ffb02e':'#d8392f')}
  if(e.mini){TX(e.D.n,e.x-cx,e.y-cy-e.r-21*sc-fy,'#ffb067',9.5)}
}
function drawBoss(b){
  const D=b.D,s=bossSprite(D.id),rage=b.rage,bob=Math.sin(G.time*2.4)*1.6,fl=b.flash>0;
  if(b.state==='charge'){ctx.save();ctx.strokeStyle='#ff3b1f';ctx.globalAlpha=.35+.3*Math.sin(G.time*30);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(b.x-cx,b.y-cy);ctx.lineTo(b.x-cx+Math.cos(b.ang)*170,b.y-cy+Math.sin(b.ang)*170);ctx.stroke();ctx.restore()}
  const g=ctx.createRadialGradient(b.x-cx,b.y-cy-10,4,b.x-cx,b.y-cy-10,46);const cc=rage?'255,50,20':'255,140,60';g.addColorStop(0,`rgba(${cc},${.26+.1*Math.sin(G.time*5)})`);g.addColorStop(1,`rgba(${cc},0)`);ctx.fillStyle=g;ctx.fillRect(b.x-cx-50,b.y-cy-60,100,100);
  shadow(b.x,b.y+b.r*.8,b.r+8,.38);
  const sc=.92,flip=false;ctx.save();ctx.translate(rp(b.x-cx),rp(b.y+b.r*.8-cy+bob));
  const mv=gait(b),wind=/w$|charge/.test(b.state),cast=['ring','shots','summon','spiral'].includes(b.state);
  ctx.save();if(faceFlip(b,P.x))ctx.scale(-1,1);b._ph=b._ph||0;const bs=fl?s.fl:s.cv;const src=pickFrame(b,bs,mv,wind,cast,false);
  sunShadow(src,faceFlip(b,P.x),-rp(44*sc),-rp(80*sc),rp(88*sc),rp(88*sc),.3);
  ctx.drawImage(src,-rp(44*sc),-rp(80*sc),rp(88*sc),rp(88*sc));ctx.restore();ctx.restore();
}
function drawNpc(n){
  if(n.kind==='quest'){const q=curL().q,s=npcSprite(q.id),st=G.q.st;shadow(n.x,n.y+8,7);
    {const fl=faceFlip(n,P.x);ctx.save();ctx.translate(rp(n.x-cx),rp(n.y-cy+10));if(fl)ctx.scale(-1,1);ctx.drawImage(animCv(s.cv,'idle',Math.floor(((G.time*.45+n.x*.013)%1)*IN)),-s.ax,-s.ay,s.cv.width,s.cv.height);ctx.restore()}
    const mk=st===0?'!':(st===1&&G.q.got>=q.item.count)?'?':'';
    if(mk){TX(mk,n.x-cx,n.y-cy-30+Math.sin(G.time*4)*2,mk==='!'?'#ffd24a':'#6fd36f',13)}
    return}
  const s=n.kind==='salem'?salemSprite():merchantSprite();shadow(n.x,n.y+8,7);
  const w=s.width;ctx.save();ctx.translate(rp(n.x-cx),rp(n.y-cy+10));if(faceFlip(n,P.x))ctx.scale(-1,1);ctx.drawImage(animCv(s,'idle',Math.floor(((G.time*.45+n.x*.013)%1)*IN)),-w/2,-s.height,s.width,s.height);ctx.restore();
  if(n.kind==='merchant'&&!n.seenIcon){}
}
function drawChest(c){
  const x=c.x,y=c.y;shadow(x,y+8,9);
  const s=chestSprite(c.tier,c.open);ctx.drawImage(s,rp(x-cx-12),rp(y-cy-18));
  if(c.open){ctx.fillStyle='#ffd24a28';ctx.beginPath();ctx.arc(x-cx,y-cy-6,10+Math.sin(c.t*4)*2,0,7);ctx.fill()}
  else{const pc=['#ffd24a','#58b8ff','#ffe27a','#ff7a2f'][c.tier];ctx.fillStyle=pc+(Math.floor(30+24*Math.sin(G.time*4+x)).toString(16).padStart(2,'0'));ctx.beginPath();ctx.arc(x-cx,y-cy-4,12+c.tier*2,0,7);ctx.fill();
    if(c.tier>=2&&((G.time*6+x)|0)%9===0)R(x+Math.sin(G.time*3)*7,y-14-((G.time*20)%8),1,1,'#fff')}
}
function drawBrk(k){shadow(k.x,k.y+6,5);const s=brkSprite(k.kind);ctx.save();if(k.flash>0){ctx.translate(Math.round(rr(-1,1)),0)}ctx.drawImage(s,rp(k.x-cx-8),rp(k.y-cy-14));ctx.restore()}
function drawBonfire(b){
  const x=b.x,y=b.y;shadow(x,y+5,9);
  R(x-8,y,16,5,'#3a3238');R(x-9,y-1,4,4,'#5a5058');R(x+5,y-1,4,4,'#5a5058');R(x-3,y+2,6,3,'#2a2228');R(x-7,y-2,3,3,'#6a606a');R(x+4,y-2,3,3,'#6a606a');
  R(x-6,y-3,12,3,'#4a3019');R(x-4,y-5,8,3,'#6b4a2b');ln2(x-5,y-3,x+5,y-5,'#4a3019');
  if(b.lit){const f=G.time*10+b.i;for(let i=0;i<5;i++){const h=8+Math.sin(f+i*1.7)*3+(i===2?4:0);R(x-5+i*2.5,y-5-h,3,h,i%2?'#ff9a3a':'#ff7a2f')}R(x-2,y-12,4,8,'#ffe27a');R(x-1,y-8,2,5,'#fff6c8');
    if(((G.time*8)|0)%3===0)G.parts.length<400&&G.parts.push({x:x+rr(-3,3),y:y-12,vx:rr(-6,6),vy:rr(-26,-14),t:0,life:.8,c:'#ffb067',s:1.5})}
  else{R(x-2,y-8,4,4,'#4a4048');R(x-1,y-7,2,2,'#2a2228')}
}
function ln2(x0,y0,x1,y1,c){ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-cx,y0-cy);ctx.lineTo(x1-cx,y1-cy);ctx.stroke()}
function drawDrop(d){
  const bob=d.landed?Math.sin(G.time*3.4+d.b)*1.2:0,x=d.x,gy=d.y,y=d.y-d.z-6-bob;
  if(d.item){
    const r=d.item.rar,c=RCOL[r];shadow(x,gy+1,4+(d.z>0?-d.z*.02:0),d.z>0?.2:.3);
    const s=itemSprite(d.item.type,r);
    if(r>=1){ctx.save();ctx.globalAlpha=.55+.25*Math.sin(G.time*5+d.ph);ctx.drawImage(sil(s,c),rp(x-cx-9),rp(y-cy-9),18,18);ctx.restore()}
    ctx.drawImage(s,rp(x-cx-8),rp(y-cy-8));
  }else if(d.pot){shadow(x,gy+1,3);ctx.drawImage(potSprite(),rp(x-cx-6),rp(y-cy-8));if(((G.time*5+d.b)|0)%4===0)R(x+2,y-6,1,1,'#fff')}
  else if(d.key){shadow(x,gy+1,5);glowAdd(rp(x-cx),rp(y-cy),24,'#ffd24a',.55+.2*Math.sin(G.time*5));ctx.drawImage(keySprite(),rp(x-cx-8),rp(y-cy-8))}
  else{shadow(x,gy+1,3);const f=((G.time*8+d.b)|0)%4;ctx.drawImage(coinSprite(f,d.sz),rp(x-cx-5),rp(y-cy-6))}
}
function drawDropGround(d){
  if(!d.item||d.item.rar<1)return;const r=d.item.rar,c=RCOL[r],x=d.x-cx,y=d.y-cy;
  ctx.save();const pul=.5+.5*Math.sin(G.time*3+d.ph);
  ctx.globalAlpha=(.25+.25*pul)*(d.landed?1:.4);ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y+1),8+r*3+pul*2,3.5+r*1.2,0,0,7);ctx.fill();
  ctx.globalAlpha=.9;ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y+1),6+r*2.5,2.6+r,0,0,7);ctx.stroke();
  ctx.restore();
  if(d.landed||d.z<20){const h=22+r*14,w=r>=3?6:r===2?4:3,g=ctx.createLinearGradient(0,y-h,0,y);g.addColorStop(0,c+'00');g.addColorStop(1,c+(r>=3?'dd':'99'));ctx.fillStyle=g;ctx.fillRect(Math.round(x-w/2),Math.round(y-h),w,h);
    if(r>=3){ctx.fillStyle='#ffffffaa';ctx.fillRect(Math.round(x-1),Math.round(y-h*.8),2,h*.8)}}
  if(r>=2&&d.landed&&Math.random()<.2&&G.parts.length<420)G.parts.push({x:d.x+rr(-6,6),y:d.y-rr(2,10),vx:rr(-4,4),vy:rr(-22,-10),t:0,life:.8,c,s:1.4});
}
function TX(t,x,y,col,sz,al){tctx.font='700 '+(sz||9)+'px "Reem Kufi","Tajawal",sans-serif';tctx.textAlign=al||'center';tctx.lineJoin='round';tctx.lineWidth=2.8;tctx.strokeStyle='#000e';tctx.strokeText(t,x,y);tctx.fillStyle=col;tctx.fillText(t,x,y)}
function drawLabels(){
  tctx.font='700 9.5px "Reem Kufi","Tajawal",sans-serif';tctx.textAlign='center';const used=[];
  const ds=G.drops.filter(d=>d.item&&d.landed).map(d=>({d,dist:Math.hypot(d.x-P.x,d.y-P.y)})).filter(o=>o.d.item.rar>=1?o.dist<190:o.dist<46).sort((a,b)=>b.d.item.rar-a.d.item.rar);
  for(const {d} of ds){let lx=d.x-cx,ly=d.y-cy-d.item.rar*5-18;const t=d.item.name,w=tctx.measureText(t).width+10;
    for(let k=0;k<8;k++){if(used.some(u=>Math.abs(u[0]-lx)<(u[2]+w)/2&&Math.abs(u[1]-ly)<13))ly-=13;else break}
    used.push([lx,ly,w]);
    tctx.fillStyle='#000000cc';tctx.beginPath();tctx.roundRect(lx-w/2,ly-9.5,w,13,2);tctx.fill();tctx.strokeStyle=RCOL[d.item.rar];tctx.lineWidth=.7;tctx.stroke();
    tctx.fillStyle='#fff';tctx.fillText(t,lx,ly)}
}
/* tall objects */
function visibleTall(fn){
  const x0=Math.max(0,Math.floor(cx/T)-4),x1=Math.min(MW-1,Math.floor((cx+W)/T)+4),y0=Math.max(0,Math.floor(cy/T)-3),y1=Math.min(MH-1,Math.floor((cy+H)/T)+8);
  for(let y=y0;y<=y1;y++){const row=G.map[y];for(let x=x0;x<=x1;x++){const t=row[x];if(t===1||t===2||t===5)fn(t,x,y)}}
}
function propSpr(tx,ty){const vv=G.v[ty][tx];if(vv<0)return null;return getSpr(G.sp[vv>>4],vv&15)}
function drawShadows(){
  ctx.fillStyle='rgba(0,0,0,.30)';ctx.beginPath();
  const dap=[];
  visibleTall((t,x,y)=>{
    const px_=x*T-cx,py_=y*T-cy;
    if(t===1){const s=propSpr(x,y);if(!s)return;const sh=s.sh||[10,3,5,-1],bx=px_+8,by=py_+T-2;ctx.moveTo(bx+sh[2]+sh[0],by+sh[3]);ctx.ellipse(bx+sh[2],by+sh[3],sh[0],sh[1],0,0,7);if(s.dap)dap.push([bx,by-3,s.dap[0],s.dap[1]])}
    else{const d=7;ctx.moveTo(px_,py_+T);ctx.lineTo(px_+T,py_+T);ctx.lineTo(px_+T+d,py_+T+d*.6);ctx.lineTo(px_+d,py_+T+d*.6);
      ctx.moveTo(px_+T,py_);ctx.lineTo(px_+T+d,py_+d*.6);ctx.lineTo(px_+T+d,py_+T+d*.6);ctx.lineTo(px_+T,py_+T)}
  });
  ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.17)';ctx.beginPath();dap.forEach(([x,y,rx,ry])=>{ctx.moveTo(x+rx,y);ctx.ellipse(x,y,rx,ry,0,0,7)});ctx.fill();
}
const _wc={};
function wallSpr(h,st){
  const hb=(h*9)|0,k=st+':'+(h>.5?1:0)+hb+(h>.6?1:0);let c=_wc[k];if(c)return c;
  const F=FACE[st],hh=8,cv=mkCv(T,T+hh),x=cv.getContext('2d'),f=(a,b,w,hhh,col)=>{x.fillStyle=col;x.fillRect(a,b+hh,w,hhh)};
  const front=F[1],top=F[0],edge=F[2];
  f(0,T-hh,T,hh,front);f(0,T-hh+3,T,1,'#0000003a');f(0,T-2,T,2,'#0000004a');if(h>.5)f(3+hb,T-hh+1,3,1,lite(front,.14));
  f(0,-hh,T,T,top);f(0,-hh,T,1,edge);f(0,-hh,1,T,edge);f(T-1,-hh,1,T,'#0000003a');if(h>.6)f(4,-hh+4,5,2,lite(top,.1));
  return _wc[k]=cv}
function drawWall(t,tx,ty){
  const px_=tx*T-cx,py_=ty*T-cy,h=hsh(tx,ty,3),hh=8;
  if(t!==5){ctx.drawImage(wallSpr(h,WSTYLE[CAMP.ch]),Math.round(px_),Math.round(py_-hh));return}
  const f=(x,y,w,hhh,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(px_+x),Math.round(py_+y),w,hhh)};
  const F=FACE[WSTYLE[CAMP.ch]],fl=(.55+.45*Math.sin(G.time*7+ty));
  const front=fl>.7?'#ff8a3a':'#e9631f',top='#34272a',edge='#ffb067';
  f(0,T-hh,T,hh,front);f(3,T-hh,T-6,hh,fl>.6?'#ffe2a8':'#ffd08a');
  f(0,-hh,T,T,top);f(0,-hh,T,1,edge);f(0,-hh,1,T,edge);f(T-1,-hh,1,T,'#0000003a');f(2,-hh+2,T-4,2,'#ff7a2f');
}
function drawProp(tx,ty){
  const s=propSpr(tx,ty);if(!s)return;const bx=tx*T+8,by=(ty+1)*T-2,t=s.trunk;
  ctx.drawImage(t.cv,rp(bx-cx-t.ax),rp(by-cy-t.ay));
  if(s.fire){const fx=bx,fy=by+s.fire.oy,f=G.time*11+tx;for(let i=0;i<3;i++){const h=5+Math.sin(f+i*2)*2;R(fx-4+i*3,fy-h,3,h,i%2?'#ffb040':'#ff7a2f')}R(fx-1,fy-7,2,5,'#ffe27a')}
}
function drawCrowns(){
  visibleTall((t,x,y)=>{if(t!==1)return;const s=propSpr(x,y);if(!s||!s.crown)return;
    const bx=x*T+8,by=(y+1)*T-2,c=s.crown,sw=Math.round(Math.sin(G.time*(s.sway?1.5:0)+x*1.7+y)*(s.sway||0));
    const k=x+y*MW,ca=G.ca||(G.ca={});
    const left=bx-c.ax,top=by-c.ay,w=c.cv.width,h=c.cv.height;
    const under=P.x>left+w*.2&&P.x<left+w*.8&&P.y>top+h*.25&&P.y<by+4;
    const near=Math.hypot(P.x-bx,P.y-(top+h*.55))<w*.6;
    let a=ca[k]===undefined?1:ca[k];a+=((under?.34:1)-a)*.12;ca[k]=a;
    ctx.save();ctx.globalAlpha=a;ctx.drawImage(c.cv,rp(left-cx+sw*.6),rp(top-cy));ctx.restore();
    if(under&&s.over&&state==='play'){ctx.fillStyle='rgba(0,0,0,.10)';ctx.beginPath();ctx.ellipse(rp(bx-cx),rp(by-cy-3),s.dap?s.dap[0]+8:16,s.dap?s.dap[1]+4:6,0,0,7);ctx.fill()}
  });
}
/* fog */
const fogCv=document.createElement('canvas'),fctx=fogCv.getContext('2d');
function zoneParams(px){
  const L=curL(),x=px/T,aX=B.aX;
  if(x>aX+1)return L.arena.fog;
  const zs=L.zones,f=x/aX;let i=0;while(i<zs.length-1&&f>zs[i].to)i++;
  const bound=(i>0?zs[i-1].to:0),blend=4/aX;let a=zs[i].fog,b=a,t=0;
  if(i>0&&f-bound<blend){b=zs[i-1].fog;t=1-(f-bound)/blend;t=t*.5;a=zs[i].fog}
  else if(i<zs.length-1&&zs[i].to-f<blend){b=zs[i+1].fog;t=(1-(zs[i].to-f)/blend)*.5}
  else if(f>zs[zs.length-1].to-blend&&x<=aX){b=L.arena.fog;t=Math.max(0,1-(aX-x)/6)*.5}
  return{a:a.a+(b.a-a.a)*t,r:a.r+(b.r-a.r)*t,c:a.c.map((v,k)=>v+(b.c[k]-v)*t)};
}
/* quality: LOWQ trims the costly extras on phones / slow GPUs (auto-detected) */
let autoQ=((typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||(navigator.hardwareConcurrency||8)<=4)?1:0,LOWQ=autoQ>=1,LIGHTQ=false,HIQ=false,FOGS=.5;
function setQ(){const q=settings.q|0,l=q===0?autoQ:q===1?0:q===2?1:q===3?2:-1;LOWQ=l>=1;LIGHTQ=l>=2;HIQ=l<0;const fs=HIQ?1:.5;if(fs!==FOGS){FOGS=fs;fogCv.width=Math.ceil(W*fs);fogCv.height=Math.ceil(H*fs)}if(wantSS()!==SS)fit()}
function wantSS(){return (LOWQ||W*H>420000)?1:2}
const _ls=new Map();
function lightSpr(r,s){r=Math.max(4,Math.round(r/3)*3);s=Math.round(s*20)/20;const k=r+'_'+s;let c=_ls.get(k);if(c)return c;
  c=mkCv(r*2,r*2);const x=c.getContext('2d'),g=x.createRadialGradient(r,r,r*.15,r,r,r);g.addColorStop(0,`rgba(0,0,0,${s})`);g.addColorStop(.6,`rgba(0,0,0,${s*.7})`);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,r*2,r*2);_ls.set(k,c);return c}
function light(c,x,y,r,s){const sp=lightSpr(r,s),h=sp.width/2;c.drawImage(sp,Math.round(x-h),Math.round(y-h))}
const _gs=new Map();
function glowAdd(x,y,r,col,a){r=Math.max(4,Math.round(r/3)*3);a=Math.round(a*40)/40;const k=col+r+'_'+a;let c=_gs.get(k);
  if(!c){c=mkCv(r*2,r*2);const q=c.getContext('2d'),g=q.createRadialGradient(r,r,1,r,r,r);g.addColorStop(0,col+Math.round(a*255).toString(16).padStart(2,'0'));g.addColorStop(1,col+'00');q.fillStyle=g;q.fillRect(0,0,r*2,r*2);if(_gs.size>400)_gs.clear();_gs.set(k,c)}
  ctx.drawImage(c,Math.round(x-r),Math.round(y-r))}
function drawFog(sx,sy,zp){
  if(LIGHTQ){ctx.fillStyle=`rgba(${zp.c[0]|0},${zp.c[1]|0},${zp.c[2]|0},${zp.a*.55})`;ctx.fillRect(0,0,W,H);return}
  const f=fctx,fw=sx+cx,fh=sy+cy,d=(x,y)=>Math.hypot(x-fw,y-fh);
  f.setTransform(FOGS,0,0,FOGS,0,0);f.globalCompositeOperation='source-over';f.clearRect(0,0,W,H);
  f.fillStyle=`rgba(${zp.c[0]|0},${zp.c[1]|0},${zp.c[2]|0},${zp.a})`;f.fillRect(0,0,W,H);
  f.globalCompositeOperation='destination-out';
  light(f,sx,sy,zp.r,1);
  if(P.anim>0&&state==='play')light(f,P.x-cx,P.y-cy,70,.4);
  G.chests.forEach(c=>{if(d(c.x,c.y)<SIGHT*1.8)light(f,c.x-cx,c.y-cy,c.open?22:38,c.open?.4:.65)});
  G.bonfires.forEach(b=>{if(d(b.x,b.y)<SIGHT*2.2)light(f,b.x-cx,b.y-cy,b.lit?95:34,b.lit?.95:.4)});
  G.npcs.forEach(n=>light(f,n.x-cx,n.y-cy,40,.55));
  G.drops.forEach(q=>{if(q.item&&q.item.rar>=1)light(f,q.x-cx,q.y-cy,28+q.item.rar*10,.75)});
  G.enemies.forEach(e=>{if(e.dead||d(e.x,e.y)>SIGHT*1.25)return;light(f,e.x-cx,e.y-cy,e.mini?46:e.elite?30:e.type==='mage'||e.ai==='kite'?26:20,e.mini?.7:e.elite?.55:.35)});
  G.projs.forEach(p=>light(f,p.x-cx,p.y-cy,26,.85));G.pshots.forEach(p=>light(f,p.x-cx,p.y-cy,22,.7));
  G.haz.forEach(h=>light(f,h.x-cx,h.y-cy,h.r+16,.6));
  const b=G.boss;if(!b.dead&&d(b.x,b.y)<SIGHT*2.6)light(f,b.x-cx,b.y-cy,b.state==='sleep'?60:110,b.state==='sleep'?.4:.85);
  if(d(B.aX*T,B.acy*T)<SIGHT*2)light(f,B.aX*T+8-cx,B.acy*T-cy,80,.55);
  visibleTall((t,x,y)=>{if(t!==1)return;const s=propSpr(x,y);if(!s)return;const g=s.glow||(s.fire&&{r:70,a:.8});if(g)light(f,x*T+8-cx,y*T+8-cy,g.r*(s.fire?1.2:1),Math.min(.9,(g.a||.4)+.25))});
  f.globalCompositeOperation='source-over';
  ctx.imageSmoothingEnabled=true;ctx.drawImage(fogCv,0,0,fogCv.width,fogCv.height,0,0,W,H);ctx.imageSmoothingEnabled=false;
}
function drawGlows(){
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(!LOWQ)visibleTall((t,x,y)=>{if(t!==1)return;const s=propSpr(x,y);if(!s)return;const g=s.glow||(s.fire&&{c:'#ff8a2f',r:48,a:.34});if(g)glowAdd(rp(x*T+8-cx),rp(y*T+4-cy),g.r*.8,g.c,Math.min(.5,(g.a||.3)*.55+Math.sin(G.time*3+x)*.04))});
  G.bonfires.forEach(b=>{if(b.lit)glowAdd(rp(b.x-cx),rp(b.y-cy-8),70,'#ff8a2f',.3+Math.sin(G.time*9+b.i)*.05)});
  if(HIQ){G.projs.forEach(p=>glowAdd(rp(p.x-cx),rp(p.y-cy),18,p.c.length===7?p.c:'#ff7a2f',.5));G.pshots.forEach(p=>glowAdd(rp(p.x-cx),rp(p.y-cy),16,p.c.length===7?p.c:'#ffe27a',.45));
    G.enemies.forEach(e=>{if(!e.dead&&(e.elite||e.mini)&&Math.hypot(e.x-P.x,e.y-P.y)<SIGHT*1.3)glowAdd(rp(e.x-cx),rp(e.y-cy-6),e.mini?34:22,e.mini?'#ff3a1a':'#ffb02e',.28)});
    G.drops.forEach(d=>{if(d.item&&d.item.rar>=2&&d.landed)glowAdd(rp(d.x-cx),rp(d.y-cy-4),20,RCOL[d.item.rar].length===7?RCOL[d.item.rar]:'#ffd24a',.4)});
    if(P.anim>0)glowAdd(rp(P.x-cx),rp(P.y-cy-4),26,'#ffe9b0',.25*(P.anim/.16))}
  ctx.restore();
}
function drawLiquidFx(){
  const lava=curL().liq==='lava',x0=Math.max(0,Math.floor(cx/T)),x1=Math.min(MW-1,Math.floor((cx+W)/T)),y0=Math.max(0,Math.floor(cy/T)),y1=Math.min(MH-1,Math.floor((cy+H)/T));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(G.map[y][x]===3){
    const o=Math.sin(G.time*(lava?1.2:1.8)+x*1.3+y*.7);ctx.fillStyle=lava?'#ffb04a55':'#ffffff40';ctx.fillRect(rp(x*T-cx+3+o*3),rp(y*T-cy+5+((x+y)%3)*3),6,1);
    if(lava&&((x*7+y*3+((G.time*2)|0))%11===0))ctx.fillRect(rp(x*T-cx+6),rp(y*T-cy+10),2,2)}
}
function drawTelegraphs(){
  G.haz.forEach(h=>{if(h.t<0)return;const k=h.t/h.dur,x=h.x-cx,y=h.y-cy;ctx.save();ctx.fillStyle=`rgba(255,60,30,${.12+.22*k})`;ctx.beginPath();ctx.ellipse(x,y,h.r,h.r*.8,0,0,7);ctx.fill();
    ctx.strokeStyle=`rgba(255,${120-80*k|0},60,${.6+.3*Math.sin(G.time*20)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,h.r,h.r*.8,0,0,7);ctx.stroke();
    ctx.fillStyle=`rgba(255,200,120,${.2+.3*k})`;ctx.beginPath();ctx.ellipse(x,y,h.r*k,h.r*.8*k,0,0,7);ctx.fill();ctx.restore()});
  G.rings.forEach(r=>{const k=r.t/r.life,rad=r.r0+(r.r1-r.r0)*k;ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle=r.c;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(rp(r.x-cx),rp(r.y-cy),rad,rad*.6,0,0,7);ctx.stroke();ctx.restore()});
}
let vigCv=null,_fT=0,_fN=0,bloomCv=null;
function bloomPass(){
  const bw=Math.ceil(W/4),bh=Math.ceil(H/4);if(!bloomCv||bloomCv.width!==bw){bloomCv=mkCv(bw,bh)}
  const b=bloomCv.getContext('2d');b.imageSmoothingEnabled=true;b.clearRect(0,0,bw,bh);b.drawImage(cv,0,0,bw,bh);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.2;ctx.imageSmoothingEnabled=true;ctx.drawImage(bloomCv,0,0,bw,bh,0,0,W,H);ctx.restore();ctx.imageSmoothingEnabled=false}
function draw(){
  { /* adaptive quality: sample frame time */
    const now=performance.now();if(_fT){const d=now-_fT;if(d<200)_fN=_fN*.95+d*.05;if(!draw.chk||now-draw.chk>3000){draw.chk=now;if(state==='play'&&(settings.q|0)===0){if(_fN>38&&autoQ<2){autoQ=2;toast('خففت الرسوميات تلقائيًا لتسريع اللعب','#a69784')}else if(_fN>27&&autoQ<1)autoQ=1}}}_fT=now;setQ()}
  const sh=settings.shake?G.shake:0;cx=rp(G.cam.x+(sh?rr(-sh,sh):0));cy=rp(G.cam.y+(sh?rr(-sh,sh):0));
  const free=state==='cine'||state==='title';
  const fxw=free?cx+W/2:P.x,fyw=free?cy+H/2:P.y;
  const zp=zoneParams(fxw);SIGHT=zp.r;
  ctx.setTransform(SS,0,0,SS,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);
  ctx.drawImage(B.mapCv,cx,cy,W,H,0,0,W,H);
  drawLiquidFx();drawShadows();drawTelegraphs();
  G.drops.forEach(drawDropGround);
  G.ghosts.forEach(g=>{ctx.globalAlpha=g.t*.45;R(g.x-5,g.y-11,10,18,'#bfe0ff')});ctx.globalAlpha=1;
  const ents=[];
  visibleTall((t,x,y)=>{if(t===1){if(G.v[y][x]>=0)ents.push({y:(y+1)*T-1,f:()=>drawProp(x,y)})}else ents.push({y:(y+1)*T,f:()=>drawWall(t,x,y)})});
  if(G.q)ents.push({y:-1,f:drawQuestWorld});if(G.exit)ents.push({y:G.exit.y+6,f:drawExit});
  G.chests.forEach(c=>ents.push({y:c.y+6,f:()=>drawChest(c)}));
  G.brks.forEach(k=>{if(!k.dead)ents.push({y:k.y+6,f:()=>drawBrk(k)})});
  G.bonfires.forEach(b=>ents.push({y:b.y+4,f:()=>drawBonfire(b)}));
  G.npcs.forEach(n=>ents.push({y:n.y+6,f:()=>drawNpc(n)}));
  G.drops.forEach(d=>ents.push({y:d.y+1,f:()=>drawDrop(d)}));
  ents.push({y:P.y,f:drawHeroR});if(NET.on&&NET.live&&NET.pl.vis)ents.push({y:NET.pl.y,f:drawPartner});
  const near=(x,y,k)=>Math.hypot(x-fxw,y-fyw)<SIGHT*k;
  G.enemies.forEach(e=>{if(!e.dead&&near(e.x,e.y,1.25))ents.push({y:e.y,f:()=>drawEnemy(e)})});
  if(!G.boss.dead&&(G.boss.state!=='sleep'||near(G.boss.x,G.boss.y,1.6)))ents.push({y:G.boss.y,f:()=>drawBoss(G.boss)});
  ents.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  drawCrowns();drawGlows();
  G.projs.forEach(p=>{ctx.save();ctx.fillStyle=p.c;if(!LOWQ){ctx.shadowColor=p.c;ctx.shadowBlur=8}if(p.k===1){ctx.strokeStyle=p.c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-cx,p.y-cy);ctx.lineTo(p.x-cx-Math.cos(p.a)*7,p.y-cy-Math.sin(p.a)*7);ctx.stroke()}else{ctx.beginPath();ctx.arc(p.x-cx,p.y-cy,p.r,0,7);ctx.fill()}ctx.restore()});
  G.pshots.forEach(p=>{ctx.save();if(!LOWQ){ctx.shadowColor=p.c;ctx.shadowBlur=8}if(p.magic){ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x-cx,p.y-cy,3.4,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x-cx,p.y-cy,1.5,0,7);ctx.fill()}else{ctx.strokeStyle='#e8e0cc';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(p.x-cx,p.y-cy);ctx.lineTo(p.x-cx-Math.cos(p.a)*10,p.y-cy-Math.sin(p.a)*10);ctx.stroke();ctx.fillStyle=p.c;ctx.fillRect(rp(p.x-cx-1),rp(p.y-cy-1),3,3)}ctx.restore()});
  G.parts.forEach(p=>{ctx.globalAlpha=1-p.t/p.life;R(p.x,p.y,p.s,p.s,p.c)});ctx.globalAlpha=1;
  drawFog(fxw-cx,fyw-cy,zp);
  G.amb.forEach(a=>{ctx.globalAlpha=Math.sin(Math.PI*a.t/a.life)*a.a*(a.tw?(.4+.6*Math.abs(Math.sin(a.t*9))):1);ctx.fillStyle=a.c;ctx.fillRect(rp(a.x-cx),rp(a.y-cy),a.s,a.s)});ctx.globalAlpha=1;
  if(state!=='cine'&&state!=='title')drawLabels();
  drawNetOverlay();
  G.texts.forEach(t=>{tctx.globalAlpha=Math.max(0,1-t.t/.8);TX(t.txt,t.x-cx,t.y-cy,t.c,10.5)});tctx.globalAlpha=1;
  if(mouse.on&&lastInput==='mouse'&&state==='play'){ctx.strokeStyle='#fff';ctx.globalAlpha=.8;ctx.lineWidth=1;const mx=Math.round(mouse.sx),my=Math.round(mouse.sy);ctx.beginPath();ctx.moveTo(mx-5,my);ctx.lineTo(mx-2,my);ctx.moveTo(mx+2,my);ctx.lineTo(mx+5,my);ctx.moveTo(mx,my-5);ctx.lineTo(mx,my-2);ctx.moveTo(mx,my+2);ctx.lineTo(mx,my+5);ctx.stroke();ctx.globalAlpha=1}
  if(HIQ&&state!=='title')bloomPass();
  if(!vigCv||vigCv.width!==W||vigCv.height!==H){vigCv=mkCv(W,H);const q=vigCv.getContext('2d'),g=q.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H*.9);g.addColorStop(0,'#0000');g.addColorStop(1,'#00000070');q.fillStyle=g;q.fillRect(0,0,W,H)}
  ctx.drawImage(vigCv,0,0);
  if(P.hp<P.maxhp*.3&&state==='play'){ctx.fillStyle=`rgba(200,20,20,${.08+.06*Math.sin(G.time*6)})`;ctx.fillRect(0,0,W,H)}
  drawExtra();
  if(G.flash>0){ctx.fillStyle=`rgba(255,240,200,${G.flash*.5})`;ctx.fillRect(0,0,W,H)}
}
let _mmT=0;
function drawMini(){
  const el=$('#mm'),show=settings.map&&state!=='title'&&state!=='cine';if(el.hidden===show)el.hidden=!show;if(!show)return;
  const nowM=performance.now();if(nowM-_mmT<(LOWQ?280:130))return;_mmT=nowM;
  if(el.width!==MW*2||el.height!==MH*2){el.width=MW*2;el.height=MH*2}
  const c=el.getContext('2d');c.clearRect(0,0,el.width,el.height);c.drawImage(G.mmSeen,0,0);
  const S=(x,y)=>G.seen[Math.floor(y/T)*MW+Math.floor(x/T)];
  G.bonfires.forEach(b=>{if(S(b.x,b.y)){c.fillStyle=b.lit?'#ff9a3a':'#8a7a6a';c.fillRect(b.x/8-1,b.y/8-1,3,3)}});
  G.chests.forEach(q=>{if(!q.open&&S(q.x,q.y)){c.fillStyle='#ffd24a';c.fillRect(q.x/8-1,q.y/8-1,3,3)}});
  G.npcs.forEach(n=>{if(n.kind==='merchant'&&S(n.x,n.y)){c.fillStyle='#b872ff';c.fillRect(n.x/8-1,n.y/8-1,3,3)}});
  G.enemies.forEach(e=>{if(!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<170){c.fillStyle=e.mini?'#ff2a00':e.elite?'#ffb02e':'#ff4a3a';c.fillRect(e.x/8-1,e.y/8-1,e.mini?3:2,e.mini?3:2)}});
  const b=G.boss;if(!b.dead&&(b.state!=='sleep'||S(b.x,b.y))){c.fillStyle=b.state==='sleep'?'#a03020':'#ff2a00';const r=3+(b.state!=='sleep'?Math.sin(G.time*8):0);c.fillRect(b.x/8-r/2,b.y/8-r/2,r+1,r+1)}
  c.fillStyle='#fff';c.fillRect(P.x/8-1.5,P.y/8-1.5,4,4);c.fillStyle='#000';c.fillRect(P.x/8-.5,P.y/8-.5,2,2);if(NET.on&&NET.live&&NET.pl.vis){c.fillStyle='#7affd0';c.fillRect(NET.pl.x/8-1.5,NET.pl.y/8-1.5,4,4)}
  c.strokeStyle='#ffffff90';c.lineWidth=1;c.strokeRect(G.cam.x/8+.5,G.cam.y/8+.5,W/8,H/8);
}
