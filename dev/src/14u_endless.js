/* =====================================================================
   البرج اللانهائي: طوابق عشوائية بذرة، صعوبة تصاعدية، 3 محاولات
   ===================================================================== */
function enRng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hdEndless(fl){
  for(let attempt=0;attempt<40;attempt++){const m=hdEndlessTry(fl,attempt);if(m)return m}
  return hdEndlessTry(fl,999,true)}
function hdEndlessTry(fl,att,safe){
  const rnd=enRng((EM.eSeed||1)+fl*7919+att*104729),ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
  const w=62,h=44,g=hdGrid(w,h),want=Math.min(5+(fl>>1),9),rooms=[];
  for(let n=0;n<400&&rooms.length<want;n++){const rw=ri(7,13),rh=ri(7,10),rx=ri(3,w-rw-4),ry=ri(4,h-rh-4);
    if(rooms.some(o=>rx<o.x+o.w+4&&rx+rw+4>o.x&&ry<o.y+o.h+4&&ry+rh+4>o.y))continue;rooms.push({x:rx,y:ry,w:rw,h:rh,cx:rx+(rw>>1),cy:ry+(rh>>1)})}
  if(rooms.length<4)return null;
  rooms.sort((a,b)=>a.cx-b.cx);
  rooms.forEach(o=>hdRoom(g,o.x,o.y,o.w,o.h));
  const link=(a,b)=>{hdH(g,a.cx,b.cx,a.cy,2);hdV(g,a.cy,b.cy,b.cx,2)};
  for(let i=0;i<rooms.length-1;i++)link(rooms[i],rooms[i+1]);
  for(let i=0;i<rooms.length-2;i+=2)if(rnd()<.6)link(rooms[i],rooms[i+2]);
  const first=rooms[0],last=rooms[rooms.length-1];
  // الباب في الجدار العلوي للغرفة الأخيرة (يسار المنتصف حتى لا يصادف ممرّاً)
  const dx=last.x+1,dy=last.y-1;g[dy][dx]='X';g[dy][dx+1]='X';
  // أعمدة
  if(!safe)rooms.forEach((o,i)=>{if(o.w>=9&&o.h>=8&&rnd()<.7){[[o.x+2,o.y+2],[o.x+o.w-3,o.y+2],[o.x+2,o.y+o.h-3],[o.x+o.w-3,o.y+o.h-3]].forEach(([x,y])=>{if(g[y][x]==='.'&&!(i===rooms.length-1&&y<=last.y+2&&x<=dx+3)&&!(i===0&&Math.abs(x-first.cx)<3&&Math.abs(y-first.cy)<3))g[y][x]='P'})}});
  // منابع الطاقة
  const veins=[];rooms.forEach((o,i)=>{if(i>0&&i<rooms.length-1&&rnd()<.4&&g[o.y-1][o.x+o.w-3]==='#'){g[o.y-1][o.x+o.w-3]='V';veins.push(o)}});
  const floorIn=(o,m)=>[o.x+(m||1)+rnd()*(o.w-2*(m||1)),o.y+(m||1)+rnd()*(o.h-2*(m||1))].map(v=>Math.floor(v)+.5);
  const free=(x,y)=>g[Math.floor(y)][Math.floor(x)]==='.';
  const items=[];let idn=0;const id=p=>p+(idn++);
  const shardFloor=fl%2===0,mid=rooms.slice(1);
  const pickRooms=(n)=>{const a=mid.slice().sort(()=>rnd()-.5);const r=[];for(let i=0;i<n;i++)r.push(a[i%a.length]);return r};
  if(shardFloor)pickRooms(3).forEach(o=>{let p,t=0;do{p=floorIn(o,2)}while(!free(p[0],p[1])&&t++<30);items.push(hdIt('shard',p[0],p[1],{id:id('s')}))});
  else pickRooms(3).forEach(o=>items.push(hdIt('altar',o.cx+.5,o.cy+.5,{id:id('a'),lit:false})));
  // نيران
  items.push(hdIt('brazier',first.x+1.5,first.y+1.5,{id:id('b'),lit:true}));
  rooms.forEach((o,i)=>{if(i>0&&rnd()<.55)items.push(hdIt('brazier',o.x+o.w-1.5,o.y+o.h-1.5,{id:id('b'),lit:false}))});
  veins.forEach(o=>items.push(hdIt('vein',o.x+o.w-2.5,o.y+.6,{id:id('v'),cd:0,tx:o.x+o.w-3,ty:o.y-1})));
  // جمرات صغيرة
  for(let i=0,n=8+Math.min(fl,8);i<n;i++){const o=rooms[ri(0,rooms.length-1)];let p,t=0;do{p=floorIn(o,1)}while(!free(p[0],p[1])&&t++<30);items.push(hdIt('coal',p[0],p[1],{id:id('c')}))}
  // نقوش
  for(let i=0;i<2;i++){const o=rooms[ri(1,rooms.length-1)],p=floorIn(o,1);if(free(p[0],p[1]))items.push(hdIt('rune',p[0],p[1],{id:id('r'),txt:EM_RUNES[ri(0,EM_RUNES.length-1)]}))}
  // لغز اختياري
  if(fl%2===1&&rooms.length>3){const o=rooms[ri(1,rooms.length-2)],p=floorIn(o,2),T=['lights','pipes','slide','code'];if(free(p[0],p[1]))items.push(hdIt('puzzle',p[0],p[1],{id:'pu',pz:T[fl%T.length],seed:ri(1,9999),reward:'up'}))}
  // أعداء
  const far=(o)=>o!==first,spots=rooms.filter(far);const epos=()=>{const o=spots[ri(0,spots.length-1)];let p,t=0;do{p=floorIn(o,1)}while((!free(p[0],p[1])||Math.hypot(p[0]-first.cx,p[1]-first.cy)<10)&&t++<40);return p};
  const en=[];for(let i=0,n=Math.min(1+(fl>>1),5);i<n;i++){const p=epos();en.push({k:'weeper',x:p[0],y:p[1]})}
  for(let i=0,n=fl>=1?Math.min(1+(fl>>2),3):0;i<n;i++){const p=epos();en.push({k:'hunter',x:p[0],y:p[1],dorm:(shardFloor&&i===0)?1:0})}
  for(let i=0,n=fl>=3?Math.min((fl-1)>>1,3):0;i<n;i++){const p=epos();en.push({k:'hound',x:p[0],y:p[1]})}
  // التحقق من الوصول
  const sx=Math.floor(first.cx),sy=Math.floor(first.cy),seen=Array.from({length:h},()=>Array(w).fill(0)),q=[[sx,sy]];seen[sy][sx]=1;
  while(q.length){const[x,y]=q.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const nx=x+a,ny=y+b;if(g[ny]&&g[ny][nx]&&!seen[ny][nx]&&(g[ny][nx]==='.')){seen[ny][nx]=1;q.push([nx,ny])}})}
  const reach=(x,y)=>seen[Math.floor(y)]&&seen[Math.floor(y)][Math.floor(x)];
  for(const it of items)if(['shard','altar','brazier','puzzle'].includes(it.k)&&!reach(it.x,it.y))return null;
  if(!reach(dx+.5,dy+1.5))return null;
  const th=fl%6;
  return{w,h,g,items,en,start:[first.cx+.5,first.cy+.5,0],npc:{x:first.cx+1.7,y:first.cy+.5},th,name:EM_TH[th].name,goal:{kind:shardFloor?'shards':'altars',need:3,label:shardFloor?'اجمع 3 جمرات أمّ':'أشعل 3 مذابح'},door:[dx,dy]}}
/* ---------- نهاية الرحلة ---------- */
function emEndRun(){const R=EM;if(ST.busy)return;ST.busy=1;saCaught();stFlash(.7,'#ff2a2a');ST.shake=1;
  const b=store.get('ember_endless')||{best:0};
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{$('#fade').classList.remove('on');ST.busy=0;showCard('انتهت الرحلة','وصلت الطابق '+(R.floor+1)+' · أفضل رقم: '+Math.max(b.best,R.floor+1),4200,()=>stExit(true))},700)},450)}
/* ---------- هدف الشاشة + زر القائمة ---------- */
const __eo=emObjective;emObjective=function(){const t=__eo();return EM.endless?`الطابق ${EM.floor+1} · ❤×${Math.max(0,EM.lives)} · `+t:t};
function enRefresh(){const b=$('#enBtn');if(!b)return;const v=store.get('ember_endless');$('#enInfo').textContent=v&&v.best?'أفضل طابق وصلت له: '+v.best:'طوابق عشوائية بلا نهاية'}
(function(){const c=$('#emCont');if(!c||!c.parentNode)return;const b=document.createElement('button');b.type='button';b.className='mbtn s1';b.id='enBtn';b.innerHTML='البرج اللانهائي <small id="enInfo"></small>';c.parentNode.insertBefore(b,c.nextSibling);b.addEventListener('click',()=>emStart(true,true));
  const old=emRefreshTitle;emRefreshTitle=function(){old();enRefresh()};enRefresh()})();
Object.assign(window.__hd||{},{hdEndless,emEndRun,enRefresh});
