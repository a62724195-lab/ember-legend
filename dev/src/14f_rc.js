/* =====================================================================
   سراديب الخان — منظور الشخص الأول (raycasting 3D حقيقي)
   الصدى يتحرك فقط حين لا تنظر إليه... ونورك يوقفه
   ===================================================================== */
const RC={m:null,x:1.5,y:1.5,a:0,bob:0,t:0,mv:0,sn:0,tex:null,zb:null,ec:null,near:null,seen:null,map:true,spr:null,ck:null,fp:null,fpT:0,fw:null,bgk:'',bg:null,vg:null,drag:null,hbT:0};
const rcRnd=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function rcField(g,tx,ty){const h=g.length,w=g[0].length,d=Array.from({length:h},()=>Array(w).fill(-1));if(!g[ty]||g[ty][tx]!=='.')return d;d[ty][tx]=0;const q=[[tx,ty]];
  for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(g[ny]&&g[ny][nx]==='.'&&d[ny][nx]<0){d[ny][nx]=d[y][x]+1;q.push([nx,ny])}}}return d}
function rcBuildMap(){const cw=10,ch=10,w=21,h=21,rnd=rcRnd(20261017);
  const g=Array.from({length:h},()=>Array(w).fill('#'));
  const vis=Array.from({length:ch},()=>Array(cw).fill(0)),st=[[0,0]];vis[0][0]=1;g[1][1]='.';
  while(st.length){const[x0,y0]=st[st.length-1];const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[x0+dx,y0+dy,dx,dy]).filter(([x,y])=>x>=0&&y>=0&&x<cw&&y<ch&&!vis[y][x]);
    if(!nb.length){st.pop();continue}const[nx,ny,dx,dy]=nb[(rnd()*nb.length)|0];vis[ny][nx]=1;g[y0*2+1+dy][x0*2+1+dx]='.';g[ny*2+1][nx*2+1]='.';st.push([nx,ny])}
  for(let i=0;i<26;i++){const x=1+((rnd()*(w-2))|0),y=1+((rnd()*(h-2))|0);if(g[y][x]==='#'&&((x%2===0)!==(y%2===0)))g[y][x]='.'}
  for(let y=9;y<=11;y++)for(let x=9;x<=11;x++)g[y][x]='.';
  for(let y=15;y<=17;y++)for(let x=3;x<=5;x++)g[y][x]='.';
  const dist=rcField(g,1,1),open=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>g[y+dy]&&g[y+dy][x+dx]==='.').length;
  const de=[];for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(g[y][x]==='.'&&open(x,y)===1&&dist[y][x]>10)de.push([x,y,dist[y][x]]);
  de.sort((a,b)=>b[2]-a[2]);const stones=[];
  for(const c of de){if(stones.every(s=>Math.abs(s[0]-c[0])+Math.abs(s[1]-c[1])>=10))stones.push([c[0],c[1]]);if(stones.length>=3)break}
  for(const c of de){if(stones.length>=3)break;if(!stones.some(s=>s[0]===c[0]&&s[1]===c[1]))stones.push([c[0],c[1]])}
  g[19][20]='X';
  const jn=[];for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(g[y][x]==='.'&&open(x,y)>=3&&dist[y][x]>4&&!(x>=9&&x<=11&&y>=9&&y<=11))jn.push([x,y]);
  for(let i=jn.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[jn[i],jn[j]]=[jn[j],jn[i]]}
  const torches=[[10,10],[4,16],[18,19]];for(const c of jn){if(torches.length>=11)break;if(torches.every(t=>Math.hypot(t[0]-c[0],t[1]-c[1])>=4))torches.push(c)}
  for(const c of stones)torches.push([c[0],c[1]]);
  const a0=g[1][2]==='.'?0:Math.PI/2;
  return{w,h,g,stones,torches,echo:[10.5,10.5],start:[1.5,1.5,a0],door:[20,19]}}
/* ---------- textures & sprites (procedural, cached) ---------- */
function rcMakeTex(){const rnd=rcRnd(77),mk=fn=>{const c=mkCv(64,64);fn(c.getContext('2d'));return c};
  const brick=(c,base,mort,var_)=>{c.fillStyle=mort;c.fillRect(0,0,64,64);for(let r=0;r<4;r++){const off=r%2?8:0;for(let k=-1;k<4;k++){const x=k*16+off,t=rnd()*var_;c.fillStyle=base(t);c.fillRect(x+1,r*16+1,14,14);c.fillStyle='rgba(255,230,170,.16)';c.fillRect(x+1,r*16+1,14,1);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x+1,r*16+14,14,1);for(let s=0;s<4;s++){c.fillStyle=rnd()>.5?'rgba(0,0,0,.14)':'rgba(255,230,170,.1)';c.fillRect(x+2+rnd()*11,r*16+2+rnd()*11,2,1)}}}};
  const base=t=>`rgb(${(168+t*30)|0},${(132+t*26)|0},${(84+t*20)|0})`;
  const wall=mk(c=>brick(c,base,'#4a3820',1));
  const carve=mk(c=>{brick(c,base,'#4a3820',1);c.strokeStyle='#e8c060';c.lineWidth=2;c.globalAlpha=.85;c.beginPath();c.arc(32,34,13,0,6.3);c.stroke();c.beginPath();c.moveTo(32,16);c.lineTo(32,50);c.moveTo(20,34);c.lineTo(44,34);c.stroke();c.beginPath();c.arc(32,34,5,0,6.3);c.stroke();c.globalAlpha=1;c.fillStyle='#ffe9a0';c.fillRect(31,33,2,2)});
  const door=mk(c=>{c.fillStyle='#2a180c';c.fillRect(0,0,64,64);for(let i=0;i<4;i++){c.fillStyle=i%2?'#3a2414':'#4a2e18';c.fillRect(i*16,0,15,64);c.fillStyle='#00000040';c.fillRect(i*16+15,0,1,64)}c.fillStyle='#6a6a70';c.fillRect(0,10,64,4);c.fillRect(0,50,64,4);c.fillStyle='#ffd890';c.globalAlpha=.9;c.beginPath();c.moveTo(32,18);c.quadraticCurveTo(22,30,20,42);c.lineTo(44,42);c.quadraticCurveTo(42,30,32,18);c.fill();c.fillRect(30,42,4,4);c.globalAlpha=1;c.strokeStyle='#ffe9a0';c.lineWidth=2;c.strokeRect(2,2,60,60)});
  return{wall,carve,door}}
function rcEchoImg(f,hunt){const c=mkCv(56,76),q=c.getContext('2d'),t=f*1.57,sx=28,sy=66;
  const g=q.createRadialGradient(sx,sy-30,3,sx,sy-30,34);g.addColorStop(0,hunt?'rgba(255,120,40,.5)':'rgba(255,200,90,.42)');g.addColorStop(1,'rgba(255,190,80,0)');q.fillStyle=g;q.fillRect(0,0,56,76);
  q.fillStyle='#0e0803';q.beginPath();q.moveTo(sx-6,sy-60);q.quadraticCurveTo(sx-15,sy-40,sx-17,sy-10);
  for(let i=0;i<5;i++){const x=sx-17+i*8.5,y=sy+3+Math.sin(t+i*1.9)*3;q.lineTo(x,y);q.lineTo(x+4.2,y-8)}
  q.lineTo(sx+17,sy-10);q.quadraticCurveTo(sx+15,sy-40,sx+6,sy-60);q.quadraticCurveTo(sx,sy-68,sx-6,sy-60);q.fill();
  q.strokeStyle=hunt?'#ff8a30':'#c89a40';q.lineWidth=1.4;q.stroke();
  const m=5+Math.sin(t*1.6)*2.6+(hunt?4:0);q.fillStyle='#000';q.beginPath();q.ellipse(sx,sy-36,4.6,m,0,0,7);q.fill();q.strokeStyle=hunt?'#ffb060':'#e8c070';q.lineWidth=1;q.stroke();
  q.fillStyle=hunt?'#ffd8a8':'#fff2c8';q.fillRect(sx-8,sy-50,4,3);q.fillRect(sx+4,sy-50,4,3);return c}
function rcStoneImg(f){const c=mkCv(34,52),q=c.getContext('2d'),p=.5+.5*Math.sin(f*1.57);
  const g=q.createRadialGradient(17,26,2,17,26,20);g.addColorStop(0,`rgba(120,220,255,${.35+p*.3})`);g.addColorStop(1,'rgba(120,220,255,0)');q.fillStyle=g;q.fillRect(0,0,34,52);
  q.fillStyle='#4a4e5c';q.beginPath();q.moveTo(8,50);q.lineTo(9,12);q.quadraticCurveTo(17,2,25,12);q.lineTo(26,50);q.closePath();q.fill();q.fillStyle='#6a6e80';q.fillRect(9,12,3,38);q.fillStyle='#00000040';q.fillRect(22,14,4,36);
  q.strokeStyle=`rgba(150,235,255,${.7+p*.3})`;q.lineWidth=1.6;q.beginPath();q.arc(17,26,6,0,6.3);q.moveTo(17,15);q.lineTo(17,37);q.stroke();q.fillStyle='#e8fbff';q.fillRect(16,25,2,2);return c}
function rcTorchImg(f){const c=mkCv(30,60),q=c.getContext('2d'),fl=Math.sin(f*1.7)*1.4,h=11+Math.sin(f*2.3)*2.6;
  const g=q.createRadialGradient(15,20,2,15,20,24);g.addColorStop(0,'rgba(255,170,70,.45)');g.addColorStop(1,'rgba(255,170,70,0)');q.fillStyle=g;q.fillRect(0,0,30,60);
  q.fillStyle='#2a1c10';q.fillRect(14,28,3,30);q.fillRect(9,56,13,3);q.fillStyle='#3a2a1c';q.beginPath();q.moveTo(7,24);q.lineTo(24,24);q.lineTo(20,32);q.lineTo(11,32);q.closePath();q.fill();
  q.fillStyle='#ff8a2a';q.beginPath();q.moveTo(15+fl,24-h-4);q.quadraticCurveTo(24,24-h*.4,23,24);q.lineTo(8,24);q.quadraticCurveTo(7,24-h*.4,15+fl,24-h-4);q.fill();
  q.fillStyle='#ffc860';q.beginPath();q.moveTo(15+fl*.6,24-h);q.quadraticCurveTo(21,24-h*.3,20,24);q.lineTo(11,24);q.quadraticCurveTo(10,24-h*.3,15+fl*.6,24-h);q.fill();q.fillStyle='#fff2c0';q.fillRect(13,17,4,7);return c}
function rcInitGfx(){const R=RC;if(!R.tex)R.tex=rcMakeTex();
  if(!R.spr){R.spr={echo:[0,1,2,3].map(f=>rcEchoImg(f,0)),echoH:[0,1,2,3].map(f=>rcEchoImg(f,1)),stone:[0,1,2,3].map(rcStoneImg),torch:[0,1,2,3,4,5].map(rcTorchImg)}}
  const k=W+'x'+H;if(R.bgk!==k){R.bgk=k;const c=mkCv(W,H),q=c.getContext('2d');
    let g=q.createLinearGradient(0,0,0,H/2);g.addColorStop(0,'#05030a');g.addColorStop(1,'#1c1220');q.fillStyle=g;q.fillRect(0,0,W,H/2);
    g=q.createLinearGradient(0,H/2,0,H);g.addColorStop(0,'#0c0806');g.addColorStop(.55,'#2a2014');g.addColorStop(1,'#5a4630');q.fillStyle=g;q.fillRect(0,H/2,W,H/2);
    for(let y=H/2+3;y<H;y+=3){const t=(y-H/2)/(H/2),sp=Math.max(2,Math.round(40*t));q.fillStyle='rgba(0,0,0,.10)';q.fillRect(0,y,W,1)}R.bg=c;
    const v=mkCv(W,H),vq=v.getContext('2d'),vg=vq.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,Math.max(W,H)*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.72)');vq.fillStyle=vg;vq.fillRect(0,0,W,H);R.vg=v}}
/* ---------- enter / exit ---------- */
function rcEnter(){const R=RC;if(!R.m)R.m=rcBuildMap();const m=R.m;
  R.x=m.start[0];R.y=m.start[1];R.a=m.start[2];R.ck={x:R.x,y:R.y,a:R.a};R.bob=0;R.mv=0;R.seen=Array.from({length:m.h},()=>Array(m.w).fill(0));
  R.ec={x:m.echo[0],y:m.echo[1],st:'patrol',wait:0,lost:0,t:0,wp:null,lx:0,ly:0,fz:0,hit:0};R.fp=null;R.fw=null;R.fpT=0;R.near=null;
  ST.rcOn=true;ST.ec=null;ST.bd=null;rcInitGfx();
  ST.busy=1;$('#fade').classList.add('on');setTimeout(()=>{ST.busy=0;$('#fade').classList.remove('on');SA.mood=null;if(SA.n)saMood('cave');
    if(!ST.flags.c2_v_maze){ST.flags.c2_v_maze=1;stSay([['ريم','(بصوت خافت) الدرج انغلق وراءنا... نورك يا راشد، لا تطفّيه.'],['راشد','الصدى هنا... أحس فيه. ما يتحرك لين أدير ظهري. لازم أبقي عيني عليه.'],['ريم','ابحث عن ثلاثة أحجار تغني... وكل ما سمعتَ أغنيتها، قرّبنا من القاعة.']],()=>{toast('A/D للدوران · W/S للمشي · Shift تسلّل · E تفاعل','#ffd890',true);stSave()})}},700)}
function rcExit(){ST.rcOn=false}
const rcStones=()=>RC.m.stones.filter((s,i)=>ST.flags['c2_s'+i]).length;
/* ---------- helpers ---------- */
const rcSolid=(x,y)=>{const c=RC.m.g[Math.floor(y)]&&RC.m.g[Math.floor(y)][Math.floor(x)];return c!=='.'};
function rcLos(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.12);for(let i=1;i<n;i++){const t=i/n;if(rcSolid(x0+(x1-x0)*t,y0+(y1-y0)*t))return false}return true}
function rcNearTorch(x,y,r){const m=RC.m;for(const t of m.torches)if(Math.hypot(t[0]+.5-x,t[1]+.5-y)<r)return true;return false}
function rcStep(x,y,dx,dy){const r=.22;if(!rcSolid(x+dx+Math.sign(dx)*r,y-r)&&!rcSolid(x+dx+Math.sign(dx)*r,y+r))x+=dx;if(!rcSolid(x-r,y+dy+Math.sign(dy)*r)&&!rcSolid(x+r,y+dy+Math.sign(dy)*r))y+=dy;return[x,y]}
/* ---------- the Echo (first person): freezes while you look, creeps when you don't ---------- */
function rcEchoUpdate(dt,moving,sn){const R=RC,e=R.ec,m=R.m;e.t+=dt;
  const dx=e.x-R.x,dy=e.y-R.y,d=Math.hypot(dx,dy);
  let ad=Math.atan2(dy,dx)-R.a;ad=((ad+Math.PI*3)%(Math.PI*2))-Math.PI;
  const los=d<8&&rcLos(R.x,R.y,e.x,e.y),seen=los&&Math.abs(ad)<.62;
  const pT=[Math.floor(R.x),Math.floor(R.y)],eT=[Math.floor(e.x),Math.floor(e.y)];
  R.fpT-=dt;if(!R.fp||R.fpT<=0){R.fp=rcField(m.g,pT[0],pT[1]);R.fpT=.3}
  const pd=R.fp[eT[1]]&&R.fp[eT[1]][eT[0]]!==undefined?R.fp[eT[1]][eT[0]]:99;
  const safe=rcNearTorch(R.x,R.y,1.7);
  const hear=moving?(sn?2.2:7):0;
  if(!safe&&pd>=0&&(pd<=hear||(d<1.7&&los))){if(e.st!=='hunt'){saBoom(.45);stWhisper(pick(['سمعتك…','غنّي معي…','أين أنت…']),1)}e.st='hunt';e.lost=0;e.lx=pT[0];e.ly=pT[1]}
  e.fz=seen&&e.st!=='idle'?1:0;
  let tgt;
  if(e.st==='hunt'){tgt=[e.lx,e.ly];if(eT[0]===tgt[0]&&eT[1]===tgt[1]){e.lost+=dt;if(e.lost>3){e.st='patrol';e.wp=null}}}
  else{if(!e.wp||(eT[0]===e.wp[0]&&eT[1]===e.wp[1])){if(e.wait>0)e.wait-=dt;else{const fl=[];for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++)if(m.g[y][x]==='.'&&Math.hypot(x-eT[0],y-eT[1])>6)fl.push([x,y]);e.wp=fl[(Math.random()*fl.length)|0];R.fw=rcField(m.g,e.wp[0],e.wp[1]);e.wait=.8}}
    tgt=e.wp||eT}
  if(!e.fz){const field=e.st==='hunt'?(R.efh&&R.efh.k===tgt[0]+','+tgt[1]?R.efh.f:(R.efh={k:tgt[0]+','+tgt[1],f:rcField(m.g,tgt[0],tgt[1])}).f):R.fw;
    let v=e.st==='hunt'?2.5:1.1;if(rcNearTorch(e.x,e.y,1.5))v*=.25;
    if(field&&field[eT[1]]&&field[eT[1]][eT[0]]>0){let best=null,bd=1e9;for(const[ax,ay]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=eT[0]+ax,ny=eT[1]+ay;const fv=field[ny]&&field[ny][nx];if(fv>=0&&fv<bd){bd=fv;best=[nx,ny]}}
      if(best){const cx2=best[0]+.5,cy2=best[1]+.5,L=Math.hypot(cx2-e.x,cy2-e.y)||1;e.x+=(cx2-e.x)/L*v*dt;e.y+=(cy2-e.y)/L*v*dt}}}
  else{e.hit+=dt}
  if(d<9){R.hbT-=dt;if(R.hbT<=0){R.hbT=.4+d/9*.8;saBeat(1-d/9)}}
  if(d<.55&&!e.fz&&!safe&&!ST.busy)rcCaught()}
function rcCaught(){const R=RC;ST.busy=1;saCaught();stFlash(.6,'#ff2a2a');ST.shake=1;stWhisper('أمسكتك…',2);
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{R.x=R.ck.x;R.y=R.ck.y;R.a=R.ck.a;const m=R.m;R.ec.x=m.echo[0];R.ec.y=m.echo[1];R.ec.st='patrol';R.ec.wp=null;R.fp=null;
    toast('الصدى أمسك بك... وصحيت عند آخر حجر','#a69784',true);$('#fade').classList.remove('on');ST.busy=0},650)},350)}
/* ---------- update ---------- */
function rcUpdate(dt){const R=RC,m=R.m;ST.t+=dt;R.t+=dt;
  if(ST.flash>0)ST.flash=Math.max(0,ST.flash-dt*1.6);ST.shake=Math.max(0,ST.shake-dt*2);ST.wh.forEach(w=>w.t+=dt);ST.wh=ST.wh.filter(w=>w.t<w.life);
  const can=state==='story'&&!ST.cin&&!ST.busy;let moving=false;
  const sn=sneaking();
  if(can){let turn=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tstick.x+padS.x,fwd=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-tstick.y-padS.y;
    turn=clamp(turn,-1.4,1.4);fwd=clamp(fwd,-1,1);R.a+=turn*2.1*dt;
    if(Math.abs(fwd)>.12){moving=true;const sp=(sn?.95:2.0)*fwd,mx=Math.cos(R.a)*sp*dt,my=Math.sin(R.a)*sp*dt;const p=rcStep(R.x,R.y,mx,my);R.x=p[0];R.y=p[1]}
    R.sn=sn;R.mv+=((moving?1:0)-R.mv)*Math.min(1,dt*8);R.bob+=dt*(moving?(sn?6:10):0);
    const tx=Math.floor(R.x),ty=Math.floor(R.y);if(R.seen[ty])for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)if(R.seen[ty+yy]&&R.seen[ty+yy][tx+xx]!==undefined)R.seen[ty+yy][tx+xx]=1;
    /* nearest interactable */
    let best=null,bd=1e9;m.stones.forEach((s,i)=>{if(ST.flags['c2_s'+i])return;const d=Math.hypot(s[0]+.5-R.x,s[1]+.5-R.y);if(d<1.35&&d<bd){bd=d;best={k:'stone',i,lab:'المس حجر الصدى'}}});
    const dd=Math.hypot(m.door[0]+.5-R.x,m.door[1]+.5-R.y);if(dd<1.5&&dd<bd)best={k:'door',lab:'ادفع الباب'};
    R.near=best;const pr=$('#prompt');if(best){$('#promptT').textContent=best.lab;pr.hidden=false}else pr.hidden=true;$('#tAct').hidden=!best;
    if(tAct&&!ST.tAp)rcInteract();ST.tAp=tAct;
    rcEchoUpdate(dt,moving,sn)}
  else{R.mv*=.85;ST.mv=0}
  saTick(dt,moving&&!sn)}
function rcInteract(){const R=RC,n=R.near;if(!n||ST.cin||ST.busy||state!=='story')return;
  if(n.k==='stone'){const i=n.i;ST.flags['c2_s'+i]=1;const s=R.m.stones[i];R.ck={x:s[0]+.5,y:s[1]+.5+0,a:R.a};
    const mot=[[0,2,1],[1,3,2],[2,1,0]][i],fs=[311.13,369.99,440,587.33];if(SA.n){mot.forEach((k,j)=>setTimeout(()=>SA.n&&(saPluck(fs[k]*.5,.28),saBell(fs[k],.18,2)),j*420));saChime()}
    stFlash(.35,'#9fe8ff');toast(`حجر الصدى ${rcStones()}/3`,'#7ad0ff',true);
    if(rcStones()>=3)setTimeout(()=>stSay([['ريم','الأحجار الثلاثة غنّت... الباب في الزاوية الجنوبية الشرقية يتحرك. قلبي يدق يا راشد.']],()=>stSave()),1500);else stSave()}
  else if(n.k==='door'){if(rcStones()<3){toast('الباب مقفل... ينقصه '+(3-rcStones())+' من الأحجار','#ff9a6a',true);saDoor();return}
    saDoor();rcExit();$('#prompt').hidden=true;$('#tAct').hidden=true;
    stCine([{d:5.2,scene:'hall',a:[192,170],b:[192,104],cap:'القاعة... وفي وسطها امرأة طويلة بلا وجه، تغنّي.',on:()=>{saBoom(.5)}}],()=>stSay([['سلمى','...أخيرًا. أحد يسمع. ثلاثين سنة وأنا أغنّي للجدران.'],['ريم','هي مو شرّ يا راشد... هي بس ما أحد ردّ عليها.'],['سلمى','لحني ناقص... ضاع آخره. غنّوا معي... وأنا أرجع لكم وجهي.']],()=>ch2Final()))}}
/* ---------- render ---------- */
function rcDraw(dt){const R=RC,m=R.m;
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=false;
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);
  const fl=1+Math.sin(R.t*9)*.035+Math.sin(R.t*23)*.02,bobY=Math.sin(R.bob)*2.2*R.mv,shk=ST.shake>0?rr(-ST.shake*3,ST.shake*3):0;
  ctx.drawImage(R.bg,0,0,W,H);
  const cols=(W/2)|0;if(!R.zb||R.zb.length!==cols)R.zb=new Float32Array(cols);
  const dirX=Math.cos(R.a),dirY=Math.sin(R.a),plX=-dirY*.66,plY=dirX*.66,px=R.x,py=R.y,T_=R.tex,torches=m.torches,rad=5.4*fl;
  for(let i=0;i<cols;i++){const camX=2*i/cols-1,rdx=dirX+plX*camX,rdy=dirY+plY*camX;let mx=px|0,my=py|0;const ddx=Math.abs(1/(rdx||1e-6)),ddy=Math.abs(1/(rdy||1e-6));let sx,sy,sdx,sdy;
    if(rdx<0){sx=-1;sdx=(px-mx)*ddx}else{sx=1;sdx=(mx+1-px)*ddx}
    if(rdy<0){sy=-1;sdy=(py-my)*ddy}else{sy=1;sdy=(my+1-py)*ddy}
    let side=0,hit=null,n=0;while(!hit&&n++<48){if(sdx<sdy){sdx+=ddx;mx+=sx;side=0}else{sdy+=ddy;my+=sy;side=1}const c=m.g[my]&&m.g[my][mx];if(c!=='.')hit=c||'#'}
    const perp=Math.max(.05,side?sdy-ddy:sdx-ddx);R.zb[i]=perp;
    let wx=side?px+perp*rdx:py+perp*rdy;wx-=Math.floor(wx);let tx=(wx*64)|0;if(side===0&&rdx>0)tx=63-tx;if(side===1&&rdy<0)tx=63-tx;
    const lh=H*.95/perp,ds=(H-lh)/2+bobY+shk;
    const tex=hit==='X'?T_.door:(((mx*7+my*13)%6===0)?T_.carve:T_.wall);
    ctx.drawImage(tex,tx,0,1,64,i*2,ds,2,lh);
    const hx=px+perp*rdx,hy=py+perp*rdy;let b=Math.max(0,1.08-perp/rad);b=b*b;
    for(const t of torches){const d=Math.hypot(t[0]+.5-hx,t[1]+.5-hy);if(d<3.4){const k=1-d/3.4;b+=k*k*.95*fl}}
    if(hit==='X')b+=.25;if(side)b*=.8;b=Math.min(1,b);
    ctx.fillStyle=`rgba(5,2,12,${(1-b).toFixed(3)})`;ctx.fillRect(i*2,ds-.5,2,lh+1)}
  /* sprites */
  const sp=[];m.torches.forEach((t,k)=>{sp.push({x:t[0]+.5,y:t[1]+.5,k:'torch',s:.62,em:1,ph:k*1.3})});
  m.stones.forEach((s,i)=>{if(!ST.flags['c2_s'+i])sp.push({x:s[0]+.5,y:s[1]+.5,k:'stone',s:.55,em:.85,ph:i})});
  if(R.ec)sp.push({x:R.ec.x,y:R.ec.y,k:'echo',s:.96,em:.2,ph:0});
  const invDet=1/(plX*dirY-dirX*plY);
  sp.forEach(o=>{const dx=o.x-px,dy=o.y-py;o.tx=invDet*(dirY*dx-dirX*dy);o.ty=invDet*(-plY*dx+plX*dy);o.d=o.tx*o.tx+o.ty*o.ty});
  sp.sort((a,b)=>b.d-a.d);
  for(const o of sp){if(o.ty<.25)continue;
    const scrX=(W/2)*(1+o.tx/o.ty),size=H*.95/o.ty,hs=size*o.s,floorY=(H+size)/2+bobY+shk;
    let img;const fr=Math.floor(R.t*8+o.ph*3);
    if(o.k==='echo'){const hunt=R.ec.st==='hunt';img=(hunt?R.spr.echoH:R.spr.echo)[R.ec.fz?0:fr%4]}else if(o.k==='torch')img=R.spr.torch[fr%6];else img=R.spr.stone[fr%4];
    const wdt=hs*img.width/img.height,left=scrX-wdt/2;
    let b=Math.max(0,1.08-Math.sqrt(o.d)/rad);b=b*b;for(const t of torches){const d=Math.hypot(t[0]+.5-o.x,t[1]+.5-o.y);if(d<3.4){const k=1-d/3.4;b+=k*k*.9}}
    const al=Math.min(1,b+o.em);const flick=o.k==='echo'&&R.ec.fz?(.55+.45*Math.sin(R.t*38)):1;
    for(let s=Math.max(0,Math.floor(left/2)*2);s<Math.min(W,left+wdt);s+=2){const ci=(s/2)|0;if(ci<0||ci>=cols||o.ty>=R.zb[ci])continue;
      const srcX=Math.min(img.width-1,Math.max(0,((s-left)/wdt*img.width)|0));ctx.globalAlpha=al*flick;ctx.drawImage(img,srcX,0,1,img.height,s,floorY-hs,2,hs)}
    ctx.globalAlpha=1}
  /* lantern in hand + warm light */
  ctx.save();ctx.globalCompositeOperation='lighter';const wg=ctx.createRadialGradient(W/2,H*.72,10,W/2,H*.72,H*.9);wg.addColorStop(0,`rgba(255,170,80,${.13*fl})`);wg.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.drawImage(R.vg,0,0,W,H);
  const lx=W*.8+Math.sin(R.bob*.5)*5*R.mv,ly=H*.84+Math.abs(Math.sin(R.bob))*4*R.mv+(R.sn?10:0);
  ctx.save();ctx.globalCompositeOperation='lighter';const lg=ctx.createRadialGradient(lx,ly-14,2,lx,ly-14,44*fl);lg.addColorStop(0,'rgba(255,200,110,.55)');lg.addColorStop(1,'rgba(255,200,110,0)');ctx.fillStyle=lg;ctx.fillRect(lx-50,ly-60,100,90);ctx.restore();
  ctx.fillStyle='#2a1c10';ctx.fillRect(lx-1,ly-34,2,10);ctx.fillRect(lx-6,ly-26,12,2);ctx.fillStyle='#4a3a2a';ctx.fillRect(lx-7,ly-24,14,3);ctx.fillRect(lx-7,ly-4,14,3);ctx.fillStyle='#ffcf7a';ctx.fillRect(lx-5,ly-21,10,17);ctx.fillStyle='#fff0b8';ctx.fillRect(lx-3,ly-18,6,11);ctx.fillStyle='#ff9a3a';ctx.fillRect(lx-5,ly-21,2,17);ctx.fillRect(lx+3,ly-21,2,17);ctx.fillStyle='#3a2a1c';ctx.fillRect(lx-7,ly-3,14,2);
  /* danger tint */
  if(R.ec){const d=Math.hypot(R.ec.x-R.x,R.ec.y-R.y);if(d<7){ctx.fillStyle=`rgba(150,50,0,${(1-d/7)*.3*(.6+.4*Math.sin(R.t*9))})`;ctx.fillRect(0,0,W,H)}}
  if(ST.flash>0){ctx.globalAlpha=Math.min(1,ST.flash);ctx.fillStyle=ST.flashC||'#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  /* minimap */
  if(R.map){const ms=3,ox=8,oy=H-m.h*ms-8;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(ox-3,oy-3,m.w*ms+6,m.h*ms+6);
    for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(R.seen[y][x]){ctx.fillStyle=m.g[y][x]==='.'?'#6a5a3c':m.g[y][x]==='X'?'#ffd890':'#2a2218';ctx.fillRect(ox+x*ms,oy+y*ms,ms,ms)}
    m.stones.forEach((s,i)=>{if(R.seen[s[1]][s[0]]&&!ST.flags['c2_s'+i]){ctx.fillStyle='#7ad0ff';ctx.fillRect(ox+s[0]*ms,oy+s[1]*ms,ms,ms)}});
    ctx.fillStyle='#fff';ctx.fillRect(ox+R.x*ms-1,oy+R.y*ms-1,3,3);ctx.fillStyle='#ffd890';ctx.fillRect(ox+(R.x+Math.cos(R.a)*1.3)*ms-.5,oy+(R.y+Math.sin(R.a)*1.3)*ms-.5,1.5,1.5)}
  ST.wh.forEach(w=>{if(w.t<0)return;const k=w.t/w.life,a=Math.sin(k*Math.PI);tctx.globalAlpha=a*.85;TX(w.txt,w.x+Math.sin(w.t*2)*3,w.y-w.t*4,'#b9c6ff',12);tctx.globalAlpha=1});
  if(R.ec&&R.ec.fz){tctx.globalAlpha=.7;TX('نورك يوقفه',W/2,H*.2,'#ffd890',11,'center');tctx.globalAlpha=1}}
/* look with the pointer (drag) */
(function(){let id=null,lx=0;cv.addEventListener('pointerdown',e=>{if(!ST.on||!ST.rcOn)return;id=e.pointerId;lx=e.clientX});
  addEventListener('pointermove',e=>{if(id===e.pointerId&&ST.rcOn&&state==='story'&&!ST.cin){RC.a+=(e.clientX-lx)*.006;lx=e.clientX}});
  ['pointerup','pointercancel'].forEach(n=>addEventListener(n,e=>{if(e.pointerId===id)id=null}))})();
