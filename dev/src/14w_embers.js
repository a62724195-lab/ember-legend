/* =====================================================================
   جمرات بقدرات: تُلتقط من المراحل والبرج، وحدة نشطة في كل مرة
   ===================================================================== */
const EMB_T={
  blue:{n:'جمرة الصقيع',c:'#7ad8ff',d:'الوهج والجامور يجمّدان الأعداء أطول ومدى أبعد'},
  green:{n:'جمرة الحياة',c:'#7dff9a',d:'الجمرات الصغيرة تعطيك طاقة أكثر، ونارك تنطفئ ببطء'},
  violet:{n:'جمرة الظل',c:'#c58bff',d:'اندفاع أسرع وحماية أطول وتكلفة أقل'},
  gold:{n:'جمرة الصاعقة',c:'#ffd24a',d:'الجامور أبعد ويخترق كل الأعداء'}};
const EMB_PLAN={1:['blue','green'],2:['green','violet'],3:['violet','gold'],4:['blue','gold'],5:['gold','blue'],6:['violet','green'],7:['blue','gold']};
function hdPlaceEmbers(m,lv){if(m.noEmb)return;
  const endless=EM.endless,fl=lv-10,types=endless?[['blue','green','violet','gold'][(((EM.eSeed||0)>>3)+fl*3+Math.abs(fl))%4]]:(EMB_PLAN[lv]||[]);
  if(!types.length||!m.start)return;
  const g=m.g,sx=Math.floor(m.start[0]),sy=Math.floor(m.start[1]),seen=Array.from({length:m.h},()=>Array(m.w).fill(-1)),q=[[sx,sy]];seen[sy][sx]=0;
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(g[ny]&&(g[ny][nx]==='.'||g[ny][nx]==='C')&&seen[ny][nx]<0){seen[ny][nx]=seen[y][x]+1;q.push([nx,ny])}}}
  const solid=(x,y)=>{const c=g[Math.floor(y)]&&g[Math.floor(y)][Math.floor(x)];return c!=='.'};
  const clear=(x,y)=>{for(let r=.3;r<=1.2;r+=.15)for(let a=0;a<8;a++)if(solid(x+Math.cos(a*.785)*r,y+Math.sin(a*.785)*r))return r;return 2};
  const arena=!!(m.arena||m.boss),lo=arena?5:13,hi=arena?10:999,rnd=enRng(4242+lv*31+(endless?(EM.eSeed|0):0));
  const near=(x,y,r)=>m.items.some(i=>Math.hypot(i.x-x,i.y-y)<r)||m.en.some(e=>Math.hypot(e.x-x,e.y-y)<4);
  let cand=[];for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++){const d=seen[y][x];if(g[y][x]!=='.'||d<lo||d>hi)continue;const cx=x+.5,cy=y+.5;if(clear(cx,cy)<1.0||near(cx,cy,2.2))continue;cand.push([cx,cy])}
  if(!cand.length)for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++){const d=seen[y][x];if(g[y][x]!=='.'||d<4)continue;const cx=x+.5,cy=y+.5;if(clear(cx,cy)>=.8&&!near(cx,cy,1.6))cand.push([cx,cy])}
  const used=[];types.forEach((t,i)=>{let tries=0,p;do{p=cand[Math.floor(rnd()*cand.length)];tries++}while(p&&used.some(u=>Math.hypot(u[0]-p[0],u[1]-p[1])<9)&&tries<40);if(p){used.push(p);m.items.push(hdIt('ember',p[0],p[1],{id:'em'+i,t}))}})}
function hdEmberTake(it){const R=EM,old=R.etype;it.gone=1;R.etype=it.t;const T=EMB_T[it.t];
  if(old&&old!==it.t)R.m.items.push(hdIt('ember',R.x+(Math.cos(R.a)*-.9),R.y+(Math.sin(R.a)*-.9),{id:'ed'+Math.random(),t:old,nopick:1.2}));
  saChime&&saChime();stFlash(.5,T.c);ST.shake=.4;toast(T.n+' · '+T.d,T.c,true);emSaveProg&&emSaveProg()}
function hdEmberPick(o,sx,sy,t){const T=EMB_T[o.t],c=T.c,b=Math.sin(t*3+o.x)*2.2;hdShadow(sx,sy+2,9,.4);ctx.save();ctx.translate(sx,sy-12+b);
  ctx.strokeStyle=c;ctx.globalAlpha=.55;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,9,3.5,t*1.5,0,7);ctx.stroke();ctx.globalAlpha=1;
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-8);ctx.bezierCurveTo(6,-3,6,5,0,8);ctx.bezierCurveTo(-6,5,-6,-3,0,-8);ctx.fill();ctx.fillStyle='#ffffffcc';ctx.beginPath();ctx.moveTo(0,-4);ctx.bezierCurveTo(2.5,-1,2.5,3,0,4.5);ctx.bezierCurveTo(-2.5,3,-2.5,-1,0,-4);ctx.fill();ctx.restore()}
function hdSecGlow(ox,oy,t){const R=EM;for(const o of R.m.items){if(o.k!=='ember'||o.gone)continue;const x=o.x*HT-ox,y=o.y*HT-oy-12;if(x<-60||x>W+60||y<-60||y>H+60)continue;ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(x,y,34+Math.sin(t*4+o.x)*4,EMB_T[o.t].c,.55);for(let i=0;i<4;i++){const a=t*1.4+i*1.57,r=11+Math.sin(t*2+i)*3;ctx.fillStyle=EMB_T[o.t].c;ctx.globalAlpha=.7;ctx.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r*.6-4,1.5,1.5)}ctx.restore()}}
function hdSecLights(cam,L){for(const o of EM.m.items){if(o.k==='ember'&&!o.gone)L.push({x:o.x*HT-cam.x,y:o.y*HT-cam.y-12,r:56,a:.7,gl:.25,col:EMB_T[o.t].c})}}
/* شارة الجمرة الحالية */
(function(){const st=document.createElement('style');st.textContent='#embBadge{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom) + 52px);z-index:6;display:flex;align-items:center;gap:8px;padding:4px 12px;border-radius:14px;background:#000a;border:1px solid var(--ec,#ff9a40);color:#fff2d8;font-size:13px;pointer-events:none;box-shadow:0 0 12px var(--ec,#ff9a40)55}#embBadge[hidden]{display:none}#embBadge i{width:10px;height:10px;border-radius:50%;background:var(--ec,#ff9a40);box-shadow:0 0 8px var(--ec,#ff9a40)}';document.head.appendChild(st);
  const d=document.createElement('div');d.id='embBadge';d.hidden=true;d.innerHTML='<i></i><span></span>';document.body.appendChild(d)})();
function ebUpdate(){const b=$('#embBadge'),t=EM.etype;if(!b)return;if(!t||!ST.emOn||state!=='story'||ST.cin||HD.cine){b.hidden=true;return}if(b.dataset.t!==t){b.dataset.t=t;b.style.setProperty('--ec',EMB_T[t].c);b.lastChild.textContent=EMB_T[t].n}b.hidden=false}
const __ew=emUpdate;emUpdate=function(dt){__ew(dt);ebUpdate()};
Object.assign(window.__hd||{},{EMB_T,hdPlaceEmbers,hdEmberTake});
try{HD_TOPICS.push({id:'embs',q:'وش هالجمرات الملوّنة اللي بالأرض؟',ok:e=>e.lv>=1||e.endless,lines:()=>[['سالم','هذي شرارات من الجمر الأول يا ولدي، كل وحدة تحمل طبعاً غير الثانية.'],['سالم','الزرقاء تجمّد من يلمسها نورها، والخضراء تسقيك الحياة، والبنفسجية تخفّ بك كالظل، والذهبية ترمي جامورك كالصاعقة.'],['سالم','تحمل وحدة بس. إذا لقيت غيرها وبدّلت، الأولى تنتظرك على الأرض.']]})}catch(e){}
