/* ---------- procedural sprite animation: limb bands + lean + squash, baked into cached frames ---------- */
const _am=new WeakMap();
function animInfo(src){let o=_am.get(src);if(o)return o;
  const w=src.width,h=src.height,d=src.getContext('2d').getImageData(0,0,w,h).data;let x0=w,x1=0,y0=h,y1=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<x0){x0=0;x1=w-1;y0=0;y1=h-1}
  o={x0,x1,y0,y1:y1+1,f:{}};_am.set(src,o);return o}
/* kind: walk(12) idle(8) atk(0 windup,1 strike,2 recover). Frames are baked at SS x resolution so limb shifts move in sub-pixel steps */
const WN=12,IN=8;
function animCv(src,kind,fr){
  const o=animInfo(src),S=SS,key=kind+fr+'@'+S;if(o.f[key])return o.f[key];
  const w=src.width,h=src.height,bh=o.y1-o.y0,k=Math.max(1,bh/22);
  if(!o.up||o.upS!==S){const u=mkCv(w*S,h*S),uc=u.getContext('2d');uc.imageSmoothingEnabled=false;uc.drawImage(src,0,0,w*S,h*S);o.up=u;o.upS=S}
  const up=o.up,cv=mkCv(w*S,h*S),c=cv.getContext('2d'),R_=v=>Math.round(v*S);
  const midx=Math.round((o.x0+o.x1)/2),legTop=o.y1-bh*.3,
    band=(sy0,sy1,sx0,sx1,dx,dy)=>{sy0=R_(sy0);sy1=R_(sy1);sx0=R_(sx0);sx1=R_(sx1);if(sy1<=sy0||sx1<=sx0)return;c.drawImage(up,sx0,sy0,sx1-sx0,sy1-sy0,sx0+R_(dx),sy0+R_(dy),sx1-sx0,sy1-sy0)};
  const upper=(lean,dy)=>{const a=o.y0,b=o.y0+(legTop-o.y0)*.45,m=o.y0+(legTop-o.y0)*.8;
    band(m,legTop,0,w,lean*.35,dy);band(b,m,0,w,lean*.7,dy);band(a,b,0,w,lean,dy)};
  if(kind==='walk'){
    const p=fr/WN*Math.PI*2,s=Math.sin(p),lift=Math.max(0,s)*1.5*k,lift2=Math.max(0,-s)*1.5*k,st=s*1.3*k;
    band(legTop,o.y1,0,midx,-st,-lift);band(legTop,o.y1,midx,w,st,-lift2);
    upper(s*.6*k,-Math.abs(Math.cos(p))*.9*k);
  }else if(kind==='idle'){
    const b=(Math.sin(fr/IN*Math.PI*2)*.5+.5)*.9*Math.min(1.6,k*.7),n=(legTop-o.y0)*.35;
    band(legTop,o.y1,0,w,0,0);band(o.y0+n,legTop,0,w,0,-b*.3);band(o.y0,o.y0+n,0,w,Math.sin(fr/IN*Math.PI*2)*.15,-b);
  }else{
    const L=[-2,4,1][fr]*k,dy=[k,-k*.6,0][fr];
    band(legTop,o.y1,0,w,L*.2,0);upper(L,dy);
  }
  c.globalCompositeOperation='source-atop';
  let gr=c.createLinearGradient(0,o.y0*S,0,o.y1*S);gr.addColorStop(0,'rgba(255,236,190,.17)');gr.addColorStop(.55,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,0,30,.27)');c.fillStyle=gr;c.fillRect(0,0,w*S,h*S);
  gr=c.createLinearGradient(o.x0*S,0,(o.x1+1)*S,0);gr.addColorStop(0,'rgba(255,230,180,.12)');gr.addColorStop(1,'rgba(0,0,30,.2)');c.fillStyle=gr;c.fillRect(0,0,w*S,h*S);
  c.globalCompositeOperation='source-over';
  return o.f[key]=cv}
function gait(e){ /* time-based: smoothed speed drives a continuous phase (cycles) */
  const t=G.time,dt=Math.min(.05,Math.max(0,t-(e._gt===undefined?t:e._gt)));e._gt=t;
  const dx=e.x-(e._px===undefined?e.x:e._px),dy=e.y-(e._py===undefined?e.y:e._py);e._px=e.x;e._py=e.y;
  if(dt>0){const sp=Math.hypot(dx,dy)/dt;e._sp=(e._sp||0)+(Math.min(sp,260)-(e._sp||0))*Math.min(1,dt*7);e._gph=(e._gph||0)+e._sp*dt/15}
  return (e._sp||0)>7}
function faceFlip(e,tx){const dx=tx-e.x;if(e._ff===undefined)e._ff=dx<0;if(dx<-3)e._ff=true;else if(dx>3)e._ff=false;return e._ff}
function pickFrame(e,src,moving,windup,casting,fast){
  if(windup){e._lw=G.time;return animCv(src,'atk',0)}
  const since=G.time-(e._lw===undefined?-9:e._lw);
  if(since<.16)return animCv(src,'atk',1);if(since<.32)return animCv(src,'atk',2);
  if(casting)return animCv(src,'atk',1);
  if(moving||fast)return animCv(src,'walk',Math.floor(((fast?G.time*1.1+(e.ph||0):(e._gph||0))%1+1)%1*WN));
  return animCv(src,'idle',Math.floor(((G.time*.45+(e.ph||e.x*.013))%1+1)%1*IN))}
