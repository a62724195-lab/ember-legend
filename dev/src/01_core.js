'use strict';
let W=512,H=288;const T=16;let MW=100,MH=50;
const $=s=>document.querySelector(s);
const cv=$('#cv'),ctx=cv.getContext('2d'),tcv=$('#tcv'),tctx=tcv.getContext('2d');
cv.width=W;cv.height=H;
let SS=1;const rp=v=>Math.round(v*SS)/SS;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rr=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rr(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const wrapA=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hsh(x,y,s=0){let h=Math.imul(x*374761393+y*668265263+s*982451653,1274126177);h^=h>>>13;h=Math.imul(h,1274126177);h^=h>>>16;return(h>>>0)/4294967296}
function strHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hsh(xi,yi,s),b=hsh(xi+1,yi,s),c=hsh(xi,yi+1,s),d=hsh(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const fbm=(x,y,s)=>vnoise(x,y,s)*.65+vnoise(x*2.1,y*2.1,s+7)*.35;
/* colors */
const _hc={};
function rgb(h){let r=_hc[h];if(r)return r;const n=parseInt(h.slice(1,7),16);return _hc[h]=[n>>16&255,n>>8&255,n&255]}
function toHex(r,g,b){return'#'+((1<<24)+(Math.round(r)<<16)+(Math.round(g)<<8)+Math.round(b)).toString(16).slice(1)}
function mix(a,b,t){const A=rgb(a),B=rgb(b);return toHex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)}
const lite=(c,k)=>k>=0?mix(c,'#ffffff',k):mix(c,'#000000',-k);
/* pixel helpers (crisp, no antialiasing) */
const mkCv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const S_=(w,h,ax,ay,fn)=>{const c=mkCv(w,h);fn(c.getContext('2d'));return{cv:c,ax,ay}};
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)}
function ln(c,x0,y0,x1,y1,col,w=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;c.fillStyle=col;const o=w>>1;
  for(let n=0;n<400;n++){c.fillRect(x0-o,y0-o,w,w);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx}if(e2<dx){e+=dx;y0+=sy}}}
function ell(c,cx,cy,rx,ry,col){c.fillStyle=col;ry=Math.max(ry,.5);for(let y=-Math.round(ry);y<=Math.round(ry);y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry+.01))));c.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}}
function blob(c,cx,cy,rx,ry,pal,rnd){
  ell(c,cx,cy,rx,ry,pal[0]);ell(c,cx-1,cy-1,Math.max(1,rx-1.5),Math.max(1,ry-1.5),pal[1]);ell(c,cx-2,cy-2,Math.max(1,rx*.55),Math.max(1,ry*.5),pal[2]);
  if(rnd)for(let i=0;i<rx*ry/5;i++){const a=rnd()*6.28,d=Math.sqrt(rnd());c.fillStyle=rnd()<.5?pal[2]:pal[0];c.fillRect(Math.round(cx+Math.cos(a)*rx*d*.9),Math.round(cy+Math.sin(a)*ry*d*.9),1,1)}}
function poly(c,pts,col){c.fillStyle=col;let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}y0=Math.floor(y0);y1=Math.ceil(y1);
  for(let y=y0;y<y1;y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
    xs.sort((p,q)=>p-q);for(let i=0;i+1<xs.length;i+=2){const x0=Math.round(xs[i]),x1=Math.round(xs[i+1]);if(x1>x0)c.fillRect(x0,y,x1-x0,1)}}}
const OUT='#1a1210';

/* ---------- settings / storage ---------- */
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const settings=Object.assign({music:.5,sfx:.8,diff:1,q:0,shake:true,dmg:true,map:true},store.get('ember_settings')||{});
const DIFF=[{hp:.9,dmg:.9},{hp:1.2,dmg:1.35},{hp:1.7,dmg:1.9}];

/* ---------- audio ---------- */
let AC=null,muted=false,sfxG=null,musG=null,curMus=0;
function applyVol(){if(sfxG)sfxG.gain.value=settings.sfx;if(musG)musG.gain.value=settings.music*.32}
function initAudio(){
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume&&AC.resume();
    if(!sfxG){sfxG=AC.createGain();sfxG.connect(AC.destination);musG=AC.createGain();musG.connect(AC.destination);applyVol();setInterval(musicTick,110)}}catch(e){}
}
const MUS=[
 {sc:[146.83,155.56,185,196,220,233.08,261.63,293.66,311.13,369.99,392],bpm:88,calm:70,boss:128,wave:'triangle',bwave:'sawtooth',drone:[73.4],kick:'x..t..x.t.x..t..',mel:.55},
 {sc:[164.81,196,220,246.94,293.66,329.63,392,440,493.88],bpm:64,calm:54,boss:112,wave:'sine',bwave:'triangle',drone:[82.4,123.5],kick:'x.......t.......',mel:.4,bell:true},
 {sc:[146.83,164.81,174.61,196,220,246.94,261.63,293.66,329.63],bpm:58,calm:50,boss:104,wave:'triangle',bwave:'square',drone:[73.4,110],kick:'x.......x.t.....',mel:.3,echo:true},
 {sc:[146.83,155.56,185,196,220,233.08,277.18,293.66,311.13,369.99],bpm:98,calm:76,boss:132,wave:'triangle',bwave:'sawtooth',drone:[73.4],kick:'x.tt.x..t.x.tt..',mel:.6},
 {sc:[82.4,87.3,110,123.5,130.8,164.81,174.61,220,246.94],bpm:104,calm:70,boss:140,wave:'sawtooth',bwave:'sawtooth',drone:[41.2,82.4],kick:'x.x.t.x.x.t.x.tt',mel:.5}];
let mStep=0,mNext=0,mIdx=3;
function mnote(f,t,d,type,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(musG);o.start(t);o.stop(t+d+.05)}
function mkick(t,f0,v){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(48,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(musG);o.start(t);o.stop(t+.2)}
function musicTick(){
  if(typeof ST!=='undefined'&&ST.on)return;
  if(!AC||muted||!musG||settings.music<=0||AC.state!=='running'||document.hidden)return;
  const M=MUS[curMus]||MUS[0];
  const boss=!!(typeof G!=='undefined'&&G&&G.boss&&G.boss.state!=='sleep'&&!G.boss.dead&&state!=='title');
  const calm=state==='title'||state==='pause'||state==='cine'||state==='dialog'||state==='card';
  const spb=60/(boss?M.boss:calm?M.calm:M.bpm)/2;
  if(mNext<AC.currentTime)mNext=AC.currentTime+.05;
  while(mNext<AC.currentTime+.45){
    const t=mNext,s=mStep%16;
    if(s===0)M.drone.forEach(f=>mnote(f,t,spb*15,'sine',.45));
    const k=M.kick[s];
    if(!calm&&k==='x')mkick(t,s%8===0?110:140,.5);
    else if(!calm&&k==='t')mnote(900+Math.random()*200,t,.03,'square',.05);
    if(Math.random()<(boss?.85:calm?M.mel*.7:M.mel)){const jump=[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)];mIdx=Math.max(0,Math.min(M.sc.length-1,mIdx+jump));if(s===15)mIdx=Math.floor(M.sc.length/3);
      const f=M.sc[mIdx];mnote(f,t,spb*(M.bell?5:calm?3:1.8),boss?M.bwave:M.wave,boss?.08:.2);
      if(M.echo)mnote(f,t+spb*1.5,spb*3,'sine',.08);if(M.bell)mnote(f*2,t,spb*2,'sine',.05)}
    if(boss&&s%4===2)mnote(M.sc[0]/2,t,spb*1.5,'square',.1);
    mStep++;mNext+=spb;
  }
}
function tone(f,d,type='square',v=.045,slide=0,delay=0){
  if(!AC||muted)return;
  try{const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(sfxG||AC.destination);o.start(t);o.stop(t+d+.02);}catch(e){}
}
const SFX={
  swing:()=>tone(320,.08,'triangle',.04,-140),
  hit:()=>tone(170,.09,'square',.06,-90),
  crit:()=>{tone(520,.07,'square',.06,200);tone(260,.12,'sawtooth',.05,-120,.03)},
  hurt:()=>tone(120,.22,'sawtooth',.07,-70),
  dash:()=>tone(200,.14,'triangle',.04,300),
  coin:()=>tone(880,.06,'square',.03,400),
  potion:()=>{tone(400,.1,'sine',.06,300);tone(600,.12,'sine',.06,300,.08)},
  chest:()=>[392,523,659,784].forEach((f,i)=>tone(f,.12,'square',.05,0,i*.07)),
  loot:r=>{const b=[[440],[440,587],[440,587,740],[523,659,784,1047,1319]][r];b.forEach((f,i)=>tone(f,.14,r>1?'square':'triangle',.05,0,i*.07))},
  land:r=>{tone(150-r*10,.1,'triangle',.05+r*.01,-60);if(r>=2)tone(660+r*110,.3,'sine',.04,0,.05);if(r>=3){tone(990,.5,'sine',.05,0,.12);tone(1320,.6,'sine',.04,0,.2)}},
  level:()=>[392,494,587,784].forEach((f,i)=>tone(f,.16,'square',.05,0,i*.09)),
  kill:()=>tone(240,.12,'square',.05,-150),
  boom:()=>tone(80,.5,'sawtooth',.09,-40),
  brk:()=>{tone(260,.08,'square',.05,-120);tone(180,.1,'triangle',.05,-60,.04)},
  fire:()=>{tone(300,.3,'sawtooth',.04,200);tone(500,.4,'triangle',.04,200,.1)},
  seal:()=>[330,440,554,659,880].forEach((f,i)=>tone(f,.25,'triangle',.05,0,i*.08)),
  shard:()=>[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.4,'sine',.06,0,i*.12)),
  roar:()=>{tone(90,.7,'sawtooth',.1,-40);tone(60,.8,'square',.06,-20,.1)},
  warn:()=>tone(700,.12,'square',.03),
  door:()=>{tone(70,.9,'sawtooth',.09,-20);tone(110,.6,'square',.05,-40,.2)},
  buy:()=>{tone(660,.08,'square',.04);tone(880,.1,'square',.04,0,.07)},
};
