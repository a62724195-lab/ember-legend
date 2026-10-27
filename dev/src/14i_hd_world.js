/* =====================================================================
   HD-2D: «قلعة الجمر» — العالم (مستويات مصمّمة يدوياً) + خبز الأرضية والجدران
   ===================================================================== */
const HT=24,HHW=20; /* tile px / wall height px */
const HD={gfx:null,cam:{x:0,y:0,z:1},cine:null,parts:null,lava:[],fl:null,fogOn:1,t:0};
const EM_TH=[
 {name:'بوابة الرماد',seed:11,floor:[46,40,38],wall:[118,92,78],top:[150,124,104],glow:'#ff7a2a',amb:[16,9,14],ambA:.8,mood:'ember',rune:'#ff9a4a'},
 {name:'قاعة المذابح',seed:22,floor:[38,42,60],wall:[88,100,142],top:[124,138,182],glow:'#ffd060',amb:[8,12,30],ambA:.78,mood:'ember',rune:'#ffd878'},
 {name:'قلب الرماد',seed:33,floor:[54,26,26],wall:[130,58,52],top:[168,82,68],glow:'#ff4a2a',amb:[14,3,5],ambA:.76,mood:'heart',rune:'#ff6a3a'},
 {name:'المكتبة المحروقة',seed:44,floor:[60,46,34],wall:[118,90,60],top:[156,122,84],glow:'#ffc060',amb:[16,11,6],ambA:.8,mood:'ember',rune:'#ffd890'},
 {name:'جسور الرماد',seed:55,floor:[40,26,24],wall:[84,46,40],top:[122,70,56],glow:'#ff6a2a',amb:[14,5,4],ambA:.78,mood:'heart',rune:'#ff8a50'},
 {name:'حدائق الرماد',seed:66,floor:[40,52,44],wall:[34,70,54],top:[52,104,76],glow:'#9affc0',amb:[6,16,26],ambA:.7,mood:'ember',rune:'#9affd0',hedge:1},
 {name:'ساحة الهجير',seed:77,floor:[44,30,44],wall:[96,52,56],top:[140,80,84],glow:'#ff5a3a',amb:[18,5,12],ambA:.78,mood:'heart',rune:'#ff7a5a'},
 {name:'عرش الجمر',seed:88,floor:[34,22,28],wall:[110,48,40],top:[176,100,60],glow:'#ffb050',amb:[20,4,6],ambA:.74,mood:'heart',rune:'#ffc060'}];
const hdGrid=(w,h)=>Array.from({length:h},()=>Array(w).fill('#'));
const hdRoom=(g,x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]='.'};
const hdH=(g,x1,x2,y,wd)=>{for(let i=Math.min(x1,x2);i<=Math.max(x1,x2);i++)for(let k=0;k<(wd||2);k++)g[y+k][i]='.'};
const hdV=(g,y1,y2,x,wd)=>{for(let j=Math.min(y1,y2);j<=Math.max(y1,y2);j++)for(let k=0;k<(wd||2);k++)g[j][x+k]='.'};
const hdSet=(g,cells,c)=>cells.forEach(([x,y])=>{g[y][x]=c});
const hdIt=(k,x,y,o)=>Object.assign({k,x,y},o||{});

function hdBuild(lv){const m=EM.endless?hdEndless(lv-10):HD_LEVELS[lv]();try{hdPlaceEmbers(m,lv)}catch(e){console.warn('embers',e)}return m}
/* ---- المستوى 1: بوابة الرماد ---- */
function hdL0(){const w=48,h=32,g=hdGrid(w,h);
  hdRoom(g,2,21,12,9);hdRoom(g,17,19,14,11);hdRoom(g,2,5,12,8);hdRoom(g,17,5,14,9);hdRoom(g,34,17,12,12);hdRoom(g,36,3,10,7);
  hdH(g,13,17,25,2);hdV(g,12,21,7,2);hdV(g,13,19,23,2);hdH(g,13,17,8,2);hdH(g,30,34,25,2);hdV(g,9,17,44,1);
  for(let y=18;y<28;y++)for(let x=39;x<=40;x++)g[y][x]=(y===22||y===23)?'.':'L';
  hdSet(g,[[20,22],[20,26],[27,22],[27,26],[5,24],[10,24],[20,8],[27,8],[36,20],[36,26],[43,6],[38,6]],'P');
  g[13][44]='B';g[4][23]='K';g[3][23]='.';g[4][8]='V';g[22][46]='V';g[2][41]='X';
  const it=[
   hdIt('shard',27.5,7.5,{id:'s0'}),hdIt('shard',4.5,7.5,{id:'s1'}),hdIt('shard',38.5,5.5,{id:'s2'}),hdIt('relic',23.5,3.5,{id:'relic'}),
   hdIt('vein',8.5,5.6,{id:'v0',cd:0,tx:8,ty:4}),hdIt('vein',45.4,22.5,{id:'v1',cd:0,tx:46,ty:22}),
   hdIt('rune',5.5,27.5,{id:'r0',txt:EM_RUNES[0]}),hdIt('rune',26.5,28.2,{id:'r1',txt:EM_RUNES[2]}),hdIt('rune',20.5,11.5,{id:'r2',txt:EM_RUNES[3]})];
  [[3.5,22.5,1],[24.5,20.5,0],[19.5,6.5,0],[11.5,6.5,0],[36.5,18.5,0],[43.5,4.5,0]].forEach(([x,y,l],i)=>it.push(hdIt('brazier',x,y,{id:'b'+i,lit:!!l})));
  [[9.5,27.5],[12.5,22.5],[19.5,23.5],[28.5,21.5],[24.5,16.5],[21.5,9.5],[10.5,10.5],[5.5,10.5],[36.5,22.5],[42.5,25.5],[44.5,20.5],[41.5,6.5]].forEach(([x,y],i)=>it.push(hdIt('coal',x,y,{id:'c'+i})));
  return{w,h,g,items:it,en:[{k:'weeper',x:23.5,y:24.5},{k:'hunter',x:10.5,y:10.5,dorm:1}],start:[5.5,25.5,0],npc:{x:4.3,y:23.9},th:0,name:EM_TH[0].name,goal:{need:3,label:'اجمع 3 جمرات أمّ'},door:[41,2]}}
/* ---- المستوى 2: قاعة المذابح ---- */
function hdL1(){const w=56,h=36,g=hdGrid(w,h);
  hdRoom(g,14,10,28,16);hdRoom(g,6,2,10,8);hdRoom(g,40,2,10,8);hdRoom(g,6,26,10,8);hdRoom(g,40,26,10,8);hdRoom(g,24,28,8,6);hdV(g,26,27,27,2);
  for(let y=10;y<26;y++)for(const x of[21,22,33,34])g[y][x]=([12,13,16,17].includes(y))?'.':'L';
  hdSet(g,[[25,13],[30,13],[25,21],[30,21],[17,13],[17,21],[38,13],[38,21],[10,7],[45,7],[10,31],[45,31]],'P');
  g[9][27]='X';g[9][28]='X';g[9][17]='V';g[9][38]='V';g[30][23]='K';g[30][22]='.';
  const it=[
   hdIt('altar',10.5,5.5,{id:'a0',lit:false}),hdIt('altar',44.5,5.5,{id:'a1',lit:false}),hdIt('altar',10.5,29.5,{id:'a2',lit:false}),hdIt('altar',44.5,29.5,{id:'a3',lit:false}),
   hdIt('relic',22.5,30.5,{id:'relic'}),hdIt('vein',17.5,10.6,{id:'v0',cd:0,tx:17,ty:9}),hdIt('vein',38.5,10.6,{id:'v1',cd:0,tx:38,ty:9}),
   hdIt('rune',26.5,31.5,{id:'r0',txt:EM_RUNES[4]}),hdIt('rune',27.5,19.5,{id:'r1',txt:EM_RUNES[1]}),hdIt('rune',17.5,23.5,{id:'r2',txt:EM_RUNES[5]})];
  [[25.5,29.5,1],[16.5,18.5,0],[39.5,18.5,0],[24.5,11.5,0],[7.5,3.5,0],[48.5,32.5,0]].forEach(([x,y,l],i)=>it.push(hdIt('brazier',x,y,{id:'b'+i,lit:!!l})));
  [[28.5,31.5],[17.5,16.5],[16.5,22.5],[26.5,15.5],[30.5,24.5],[38.5,16.5],[39.5,23.5],[12.5,8.5],[46.5,8.5],[12.5,27.5],[46.5,28.5],[28.5,12.5]].forEach(([x,y],i)=>it.push(hdIt('coal',x,y,{id:'c'+i})));
  it.push(hdIt('puzzle',14.5,4.5,{id:'pu',pz:'lights',seed:41,reward:'up'}));
  return{w,h,g,items:it,en:[{k:'weeper',x:28.5,y:14.5},{k:'weeper',x:12.5,y:6.5},{k:'hunter',x:12.5,y:29.5,dorm:1},{k:'hunter',x:44.5,y:8.5,dorm:1}],start:[27.5,31.5,-Math.PI/2],npc:{x:26.6,y:29.9},th:1,name:EM_TH[1].name,goal:{need:4,label:'أشعل 4 مذابح'},door:[27,9]}}
/* ---- المستوى 3: قلب الرماد (حلبة) ---- */
function hdL2(){const w=36,h=30,g=hdGrid(w,h),cx=18,cy=15;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy);if(d<=13.4){g[y][x]='.';if(d>=6.3&&d<=8.1&&Math.abs(dx)>1.6&&Math.abs(dy)>1.6)g[y][x]='L'}}
  [[17,14],[18,14],[17,15],[18,15]].forEach(([x,y])=>g[y][x]='H');
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,x=Math.round(cx+Math.cos(a)*11.6-.5),y=Math.round(cy+Math.sin(a)*11.6-.5);if(g[y][x]==='.')g[y][x]='P'}
  const it=[];[[10.5,7.5],[25.5,7.5],[10.5,22.5],[25.5,22.5]].forEach(([x,y],i)=>it.push(hdIt('brazier',x,y,{id:'b'+i,lit:i===2})));
  [[14.5,12.5],[21.5,17.5],[14.5,17.5],[21.5,12.5]].forEach(([x,y],i)=>it.push(hdIt('coal',x,y,{id:'c'+i})));
  return{w,h,g,items:it,en:[],start:[18.5,26.5,-Math.PI/2],npc:{x:21.2,y:26.6},th:2,name:EM_TH[2].name,goal:{need:5,label:'اضرب قلب الرماد'},arena:{hx:18,hy:15,sp:[[5.5,15.5],[30.5,15.5],[18.5,3.5],[18.5,26.5],[8.5,6.5],[27.5,23.5]]}}}

/* ---------- baking ---------- */
const hdSolidT=c=>c!=='.'&&c!=='C';
function hdRnd(s){return rcRnd(s)}
function hdMkFloor(th,seed){const rnd=hdRnd(seed),[r,g,b]=th.floor,c=mkCv(HT*2,HT*2),q=c.getContext('2d');
  for(let ty=0;ty<2;ty++)for(let tx=0;tx<2;tx++){const k=.82+rnd()*.3;q.fillStyle=`rgb(${r*k|0},${g*k|0},${b*k|0})`;q.fillRect(tx*HT,ty*HT,HT,HT);
    for(let i=0;i<46;i++){const v=rnd();q.fillStyle=v<.5?'rgba(0,0,0,.14)':'rgba(255,230,200,.06)';q.fillRect(tx*HT+(rnd()*HT|0),ty*HT+(rnd()*HT|0),1+(rnd()*2|0),1)}
    q.fillStyle='rgba(0,0,0,.42)';q.fillRect(tx*HT,ty*HT,HT,1);q.fillRect(tx*HT,ty*HT,1,HT);q.fillStyle='rgba(255,220,190,.07)';q.fillRect(tx*HT+1,ty*HT+1,HT-1,1);q.fillRect(tx*HT+1,ty*HT+1,1,HT-1);
    if(rnd()<.35){q.strokeStyle='rgba(0,0,0,.4)';q.lineWidth=1;q.beginPath();let x=tx*HT+rnd()*HT,y=ty*HT+rnd()*HT;q.moveTo(x,y);for(let i=0;i<4;i++){x+=rr(-5,5);y+=rr(-5,5);q.lineTo(x,y)}q.stroke()}}
  return c}
function hdMkWallFace(th,seed,kind,lit){const rnd=hdRnd(seed),[r,g,b]=th.wall,c=mkCv(HT,HHW),q=c.getContext('2d');
  const rowH=5;if(th.hedge){q.fillStyle=`rgb(${r*.7|0},${g*.7|0},${b*.7|0})`;q.fillRect(0,0,HT,HHW);for(let i=0;i<150;i++){const k=.6+rnd()*.8;q.fillStyle=`rgb(${r*k|0},${g*k*1.1|0},${b*k|0})`;const x=rnd()*HT,y=rnd()*HHW;q.beginPath();q.ellipse(x,y,1+rnd()*3.2,1+rnd()*2,rnd()*3,0,7);q.fill()}for(let i=0;i<10;i++){q.fillStyle=rnd()<.5?'#e8d8a0':'#ff9a7a';q.fillRect(rnd()*HT|0,rnd()*HHW|0,1,1)}q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,HHW-3,HT,3)}else for(let row=0;row*rowH<HHW;row++){const off=(row%2)*6;for(let x=-6;x<HT+6;x+=12){const k=.8+rnd()*.38;q.fillStyle=`rgb(${r*k|0},${g*k|0},${b*k|0})`;q.fillRect(x+off,row*rowH,12,rowH);
      for(let i=0;i<5;i++){q.fillStyle=rnd()<.5?'rgba(0,0,0,.16)':'rgba(255,230,200,.07)';q.fillRect(x+off+(rnd()*11|0),row*rowH+(rnd()*4|0),1+(rnd()*3|0),1)}
      q.fillStyle='rgba(0,0,0,.45)';q.fillRect(x+off,row*rowH+rowH-1,12,1);q.fillRect(x+off,row*rowH,1,rowH)}}
  const gr=q.createLinearGradient(0,0,0,HHW);gr.addColorStop(0,th.hedge?'rgba(200,255,220,.10)':'rgba(255,230,200,.10)');gr.addColorStop(.25,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.5)');q.fillStyle=gr;q.fillRect(0,0,HT,HHW);
  if(rnd()<.5){q.fillStyle='rgba(0,0,0,.28)';const sx=rnd()*HT|0;q.fillRect(sx,0,2,6+(rnd()*8|0));q.fillRect(sx+1,0,1,12+(rnd()*6|0))}
  if(kind==='V'||kind==='S'){q.strokeStyle=kind==='V'?'#ff8a30':'#ffd890';q.lineWidth=1.4;q.beginPath();let x=rnd()*8+4,y=0;q.moveTo(x,y);while(y<HHW){x+=rr(-4,4);y+=rr(3,6);q.lineTo(x,y)}q.stroke();q.strokeStyle='#fff0b0';q.lineWidth=.6;q.stroke();
    q.fillStyle=kind==='V'?'rgba(255,120,30,.25)':'rgba(255,220,140,.3)';q.fillRect(0,0,HT,HHW)}
  if(kind==='G'){q.fillStyle='#090605';q.fillRect(0,0,HT,HHW);for(let i=0;i<5;i++){q.fillStyle='#51483f';q.fillRect(2+i*5,0,2,HHW);q.fillStyle='#8a7a68';q.fillRect(2+i*5,0,1,HHW)}q.fillStyle='#3a332c';q.fillRect(0,2,HT,2);q.fillRect(0,HHW-5,HT,2)}
  if(kind==='K'){q.fillStyle='rgba(255,220,140,.16)';q.fillRect(HT/2-2,HHW/2-5,4,10);q.fillRect(HT/2-5,HHW/2-2,10,4)}
  if(kind==='B'){q.fillStyle='#5a5148';q.fillRect(0,0,HT,HHW);for(let i=0;i<70;i++){const k=.5+rnd()*.7;q.fillStyle=`rgb(${110*k|0},${100*k|0},${92*k|0})`;q.beginPath();q.arc(rnd()*HT,rnd()*HHW,1+rnd()*3,0,7);q.fill()}
    q.fillStyle='rgba(255,120,40,.5)';for(let i=0;i<7;i++)q.fillRect(rnd()*HT|0,rnd()*HHW|0,1,1)}
  if(kind==='X'){q.fillStyle='#0b0706';q.fillRect(0,0,HT,HHW);q.fillStyle=lit?'#ffcf70':'#3b2a22';q.fillRect(2,0,HT-4,HHW);q.fillStyle='#0b0706';for(let i=0;i<4;i++)q.fillRect(4+i*5,0,2,HHW);q.fillRect(2,HHW/2|0,HT-4,2);
    q.fillStyle=lit?'#fff2b8':'#6a4a38';q.fillRect(HT/2-2,4,4,4);q.fillRect(HT/2-1,2,2,8)}
  return c}
function hdMkWallTop(th,seed,kind){const rnd=hdRnd(seed),[r,g,b]=th.top,c=mkCv(HT,HT),q=c.getContext('2d');
  for(let y=0;y<2;y++)for(let x=0;x<2;x++){const k=.82+rnd()*.3;q.fillStyle=`rgb(${r*k|0},${g*k|0},${b*k|0})`;q.fillRect(x*12,y*12,12,12);q.fillStyle='rgba(0,0,0,.3)';q.fillRect(x*12,y*12+11,12,1);q.fillRect(x*12+11,y*12,1,12)}
  for(let i=0;i<40;i++){q.fillStyle=rnd()<.5?'rgba(0,0,0,.14)':'rgba(255,240,220,.1)';q.fillRect(rnd()*HT|0,rnd()*HT|0,1+(rnd()*2|0),1)}
  q.fillStyle='rgba(255,240,220,.18)';q.fillRect(0,HT-1,HT,1);q.fillStyle='rgba(0,0,0,.3)';q.fillRect(0,0,HT,1);
  if(kind==='V'){q.fillStyle='rgba(255,140,50,.35)';q.fillRect(0,0,HT,HT)}if(kind==='B'){q.fillStyle='#7a7168';q.fillRect(0,0,HT,HT);for(let i=0;i<30;i++){q.fillStyle=`rgba(${150+rnd()*60|0},${140+rnd()*50|0},${130+rnd()*40|0},.8)`;q.fillRect(rnd()*HT|0,rnd()*HT|0,2,2)}}
  if(kind==='X'){q.fillStyle='rgba(255,200,100,.18)';q.fillRect(0,0,HT,HT)}return c}
function hdInitGfx(){if(HD.gfx&&HD.gfx.ok)return;const G={ok:1,fl:[],wf:[],wt:[],kf:{},kt:{}};
  EM_TH.forEach((th,i)=>{G.fl[i]=hdMkFloor(th,th.seed*7);G.wf[i]=[0,1,2,3].map(v=>hdMkWallFace(th,th.seed*31+v,'w'));G.wt[i]=[0,1,2,3].map(v=>hdMkWallTop(th,th.seed*57+v,'w'));
    G.kf[i]={};G.kt[i]={};['V','K','S','B','G'].forEach(k=>{G.kf[i][k]=hdMkWallFace(th,th.seed*13,k);G.kt[i][k]=hdMkWallTop(th,th.seed*17,k)});
    G.kf[i].X0=hdMkWallFace(th,th.seed*19,'X',false);G.kf[i].X1=hdMkWallFace(th,th.seed*19,'X',true);G.kt[i].X=hdMkWallTop(th,th.seed*23,'X')});
  HD.gfx=G;hdSprites()}
/* floor canvas of the whole level */
function hdBakeFloor(m){const th=EM_TH[m.th],G=HD.gfx,c=mkCv(m.w*HT,m.h*HT),q=c.getContext('2d'),rnd=hdRnd(th.seed*101+m.w),pat=G.fl[m.th];
  q.fillStyle='#050304';q.fillRect(0,0,c.width,c.height);HD.lava=[];
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const ch=m.g[y][x],px=x*HT,py=y*HT;
    if(ch==='.'||ch==='B'||ch==='S'||ch==='K'||ch==='X'||ch==='C'||ch==='P'||ch==='M'||ch==='H'){q.drawImage(pat,((x+y*3)%2)*HT,((x*5+y)%2)*HT,HT,HT,px,py,HT,HT);
      if(ch==='C'){q.fillStyle='rgba(30,14,8,.45)';q.fillRect(px,py,HT,HT);for(let i=0;i<4;i++){q.fillStyle='rgba(120,70,40,.55)';q.fillRect(px,py+i*6,HT,1)}q.fillStyle='rgba(255,110,40,.5)';q.fillRect(px,py,HT,1);q.fillRect(px,py+HT-1,HT,1);for(let i=0;i<3;i++)q.fillRect(px+(rnd()*HT|0),py+(rnd()*HT|0),1,3)}
      if(ch==='.'&&th.hedge){for(let i=0;i<7;i++){q.fillStyle=rnd()<.5?'rgba(120,190,130,.35)':'rgba(20,50,34,.5)';const gx=px+rnd()*HT,gy=py+rnd()*HT;q.fillRect(gx,gy,1,2+(rnd()*3|0))}if(rnd()<.06){q.fillStyle=rnd()<.5?'#e8d8a0':'#ff9a8a';q.fillRect(px+rnd()*HT|0,py+rnd()*HT|0,2,2)}if(rnd()<.08){q.fillStyle='rgba(150,150,140,.45)';q.fillRect(px+rnd()*HT|0,py+rnd()*HT|0,3,2)}}
      if(ch==='.'){if(rnd()<.05){q.fillStyle='rgba(180,170,160,.5)';q.beginPath();q.ellipse(px+rnd()*HT,py+rnd()*HT,2+rnd()*3,1+rnd()*1.5,0,0,7);q.fill();q.fillStyle='rgba(60,54,50,.7)';q.fillRect(px+rnd()*HT,py+rnd()*HT,2,1)}
        if(rnd()<.04){q.fillStyle='rgba(30,20,18,.6)';q.beginPath();q.ellipse(px+rnd()*HT,py+rnd()*HT,3+rnd()*4,2+rnd()*2,rnd(),0,7);q.fill()}
        if(rnd()<.05){q.fillStyle=th.glow+'66';q.fillRect(px+rnd()*HT|0,py+rnd()*HT|0,1+(rnd()*3|0),1)}}}
    else if(ch==='L'){HD.lava.push([x,y]);const g2=q.createLinearGradient(px,py,px,py+HT);g2.addColorStop(0,'#7a1d06');g2.addColorStop(1,'#c4410d');q.fillStyle=g2;q.fillRect(px,py,HT,HT);
      for(let i=0;i<9;i++){q.fillStyle=i%2?'#ff9a30':'#ffd060';q.fillRect(px+rnd()*HT|0,py+rnd()*HT|0,2+(rnd()*5|0),1)}q.fillStyle='rgba(20,6,4,.55)';for(let i=0;i<4;i++)q.fillRect(px+rnd()*HT|0,py+rnd()*HT|0,4+(rnd()*6|0),2+(rnd()*3|0))}}
  /* contact shadows */
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){if(m.g[y][x]!=='.'&&m.g[y][x]!=='L')continue;const px=x*HT,py=y*HT,N=y>0&&hdSolidT(m.g[y-1][x])&&m.g[y-1][x]!=='L',Wl=x>0&&hdSolidT(m.g[y][x-1])&&m.g[y][x-1]!=='L',E=x<m.w-1&&hdSolidT(m.g[y][x+1])&&m.g[y][x+1]!=='L';
    if(N){const gg=q.createLinearGradient(0,py,0,py+9);gg.addColorStop(0,'rgba(0,0,0,.65)');gg.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gg;q.fillRect(px,py,HT,9)}
    if(Wl){const gg=q.createLinearGradient(px,0,px+5,0);gg.addColorStop(0,'rgba(0,0,0,.45)');gg.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gg;q.fillRect(px,py,5,HT)}
    if(E){const gg=q.createLinearGradient(px+HT,0,px+HT-5,0);gg.addColorStop(0,'rgba(0,0,0,.45)');gg.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gg;q.fillRect(px+HT-5,py,5,HT)}
    if(m.g[y][x]==='L'){q.fillStyle='rgba(0,0,0,.3)';if(y>0&&m.g[y-1][x]==='.')q.fillRect(px,py,HT,2)}}
  /* rune circles under altars + the heart */
  const circ=(cx2,cy2,r,col,n)=>{q.save();q.strokeStyle=col;q.globalAlpha=.55;q.lineWidth=1;for(let i=0;i<3;i++){q.beginPath();q.arc(cx2,cy2,r-i*3,0,7);q.stroke()}
    for(let i=0;i<n;i++){const a=i/n*Math.PI*2;q.fillStyle=col;q.fillRect(cx2+Math.cos(a)*(r-1.5)-1,cy2+Math.sin(a)*(r-1.5)-1,2,2);q.beginPath();q.moveTo(cx2+Math.cos(a)*(r-6),cy2+Math.sin(a)*(r-6));q.lineTo(cx2+Math.cos(a+.18)*(r-3),cy2+Math.sin(a+.18)*(r-3));q.stroke()}q.restore()};
  m.items.forEach(it=>{if(it.k==='altar')circ(it.x*HT,it.y*HT+4,22,th.rune,12);if(it.k==='shard')circ(it.x*HT,it.y*HT+4,13,th.rune,8);if(it.k==='seal')circ(it.x*HT,it.y*HT,11,th.rune,8)});
  if(m.arena){const hx=m.arena.hx*HT,hy=m.arena.hy*HT;circ(hx,hy,150,th.rune,32);circ(hx,hy,98,th.rune,24);circ(hx,hy,52,th.rune,16)}
  HD.fl=c}
