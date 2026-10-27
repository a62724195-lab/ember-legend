/* =====================================================================
   مراحل جديدة: المكتبة المحروقة (مرايا + أختام + الكاتم) · جسور الرماد (جسور تنهار + منارات)
   ===================================================================== */
const HD_LEVELS=[()=>hdL0(),()=>hdLib(),()=>hdBridge(),()=>hdL1(),()=>hdL2(),()=>hdGarden(),()=>hdCourt(),()=>hdThrone()];
const HD_LAST=7;
function hdLib(){const w=44,h=30,g=hdGrid(w,h);
  hdRoom(g,4,5,32,21);
  [[10,18],[18,18]].forEach(([y])=>{g[y][36]='G';g[y][37]='G';g[y][38]='.'});g[10][35]='M';g[18][35]='M';hdSet(g,[[35,19],[35,20]],'P');
  for(let x=21;x<=29;x++)g[5][x]='G';g[5][20]='M';g[5][30]='M';g[4][20]='G';g[3][20]='G';g[2][20]='.';
  hdSet(g,[[10,10],[10,16],[10,21],[16,9],[16,14],[16,20],[24,9],[24,15],[24,21],[28,12],[28,18],[32,8],[32,14],[32,22]],'P');
  g[14][3]='X';g[15][3]='X';g[26][22]='K';g[27][22]='.';g[4][14]='V';
  const it=[hdIt('seal',38.5,10.5,{id:'sl0',lit:0}),hdIt('seal',38.5,18.5,{id:'sl1',lit:0}),hdIt('seal',20.5,2.5,{id:'sl2',lit:0}),
   hdIt('mirror',35.5,10.5,{id:'m0',o:0}),hdIt('mirror',35.5,18.5,{id:'m1',o:0}),hdIt('mirror',20.5,5.5,{id:'m2',o:0}),hdIt('mirror',30.5,5.5,{id:'m3',o:0}),
   hdIt('relic',22.5,27.5,{id:'relic'}),hdIt('vein',14.5,5.6,{id:'v0',cd:0,tx:14,ty:4}),
   hdIt('rune',7.5,24.5,{id:'r0',txt:'«المرآة تحني الضوء... ولا تكسره.»'}),hdIt('rune',22.5,23.5,{id:'r1',txt:'«المفتاح في الانحناء: من فوق... أو من تحت.»'}),hdIt('rune',12.5,6.5,{id:'r2',txt:'«سلسلة المرايا: كل واحدة تسلّم النور للتي بعدها.»'})];
  [[5.5,22.5,1],[20.5,12.5,0],[33.5,23.5,0],[9.5,7.5,0]].forEach(([x,y,l],i)=>it.push(hdIt('brazier',x,y,{id:'b'+i,lit:!!l})));
  [[8.5,19.5],[13.5,12.5],[19.5,17.5],[26.5,23.5],[31.5,10.5],[33.5,16.5],[12.5,23.5],[27.5,7.5]].forEach(([x,y],i)=>it.push(hdIt('coal',x,y,{id:'c'+i})));
  it.push(hdIt('puzzle',6.5,12.5,{id:'pu',pz:'code',seed:21,reward:'up'}));
  return{w,h,g,items:it,en:[{k:'weeper',x:18.5,y:17.5},{k:'snuffer',x:30.5,y:22.5,dorm:1}],start:[7.5,23.5,0],npc:{x:4.8,y:22.2},th:3,name:EM_TH[3].name,mirrors:1,goal:{kind:'seals',need:3,label:'أشعل الأختام الثلاثة بانعكاس الوهج'},door:[3,14]}}
function hdBridge(){const w=48,h=32,g=hdGrid(w,h);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)g[y][x]='L';
  [[2,22,9,8],[17,23,8,6],[4,9,9,8],[21,10,8,8],[34,22,10,8],[34,5,11,9],[6,3,5,4]].forEach(a=>hdRoom(g,...a));
  const br=(x1,x2,y1,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)g[y][x]='C'};
  br(11,16,25,26);br(6,7,17,21);br(13,20,12,13);br(22,23,18,22);br(25,33,25,26);br(29,33,11,12);br(38,39,14,21);br(7,8,7,8);
  g[8][45]='V';g[4][39]='X';g[4][40]='X';hdSet(g,[[30,26],[6,12],[27,12],[37,9]],'.');
  const cr=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y][x]==='C')cr.push({x,y,st:0,t:0});
  const it=[hdIt('brazier',8.5,12.5,{id:'k0',lit:false,bk:1}),hdIt('brazier',24.5,13.5,{id:'k1',lit:false,bk:1}),hdIt('brazier',38.5,25.5,{id:'k2',lit:false,bk:1}),
   hdIt('brazier',3.5,23.5,{id:'b0',lit:true}),hdIt('brazier',20.5,25.5,{id:'b1',lit:false}),hdIt('brazier',36.5,7.5,{id:'b2',lit:false}),
   hdIt('relic',8.5,4.5,{id:'relic'}),hdIt('vein',44.4,8.5,{id:'v0',cd:0,tx:45,ty:8}),
   hdIt('rune',7.5,24.5,{id:'r0',txt:'«الجسور من رماد... تتهاوى بعد خطوتك، وتنبت من جديد.»'}),hdIt('rune',22.5,27.5,{id:'r1',txt:'«لا تقف. من وقف سقط.»'}),hdIt('rune',40.5,10.5,{id:'r2',txt:'«ثلاث نيران على ثلاث جزر... ثم يُفتح الباب.»'})];
  [[9.5,27.5],[19.5,24.5],[6.5,14.5],[23.5,16.5],[26.5,11.5],[36.5,26.5],[41.5,24.5],[38.5,9.5],[42.5,12.5],[10.5,10.5]].forEach(([x,y],i)=>it.push(hdIt('coal',x,y,{id:'c'+i})));
  it.push(hdIt('puzzle',5.5,10.5,{id:'pu',pz:'slide',seed:31,reward:'up'}));
  return{w,h,g,items:it,cr,en:[{k:'weeper',x:21.5,y:26.5},{k:'hunter',x:26.5,y:15.5,dorm:1},{k:'hunter',x:40.5,y:27.5}],start:[5.5,26.5,0],npc:{x:4.5,y:27.5},th:4,name:EM_TH[4].name,goal:{kind:'beacons',need:3,label:'أشعل المنارات الثلاث'},door:[39,4]}}
/* ---------- الأهداف ---------- */
function emGoalDone(){const R=EM,k=R.m.goal.kind||(R.m.goal.k==='x'?'x':(R.m.arena?'boss':R.m.goal.need===3?'shards':'altars'));
  return k==='shards'?R.shards>=R.m.goal.need:k==='altars'?R.altars>=R.m.goal.need:k==='beacons'?R.beacons>=R.m.goal.need:k==='seals'?R.seals>=R.m.goal.need:k==='flags'?R.m.goal.req.every(f=>R.flags[f]):false}
function emGoalText(){const R=EM,k=R.m.goal.kind||(R.m.arena?'boss':R.m.goal.need===3?'shards':'altars'),n=R.m.goal.need;
  return k==='shards'?`${R.shards}/${n} جمرات`:k==='altars'?`${R.altars}/${n} مذابح`:k==='beacons'?`${R.beacons}/${n} منارات`:k==='flags'?`${R.m.goal.req.filter(f=>R.flags[f]).length}/${R.m.goal.req.length} ${R.m.goal.txt||''}`:`${R.seals}/${n} أختام`}
/* ---------- شعاع الوهج والمرايا ---------- */
function emBeam(){const R=EM,m=R.m;if(!m.mirrors)return;let dx=0,dy=0;if(Math.abs(Math.cos(R.a))>=Math.abs(Math.sin(R.a)))dx=Math.cos(R.a)>0?1:-1;else dy=Math.sin(R.a)>0?1:-1;
  let x=Math.floor(R.x),y=Math.floor(R.y);const pts=[[R.x,R.y]];let hit=0;
  for(let n=0;n<70;n++){x+=dx;y+=dy;const c=m.g[y]&&m.g[y][x];if(c===undefined)break;pts.push([x+.5,y+.5]);
    if(c==='M'){const it=m.items.find(i=>i.k==='mirror'&&Math.floor(i.x)===x&&Math.floor(i.y)===y),o=it&&it.o?1:0,ndx=o?dy:-dy,ndy=o?dx:-dx;dx=ndx;dy=ndy;if(it)it.hit=1;continue}
    if(c==='G'||c==='.'||c==='C'||c==='L'){const sl=m.items.find(i=>i.k==='seal'&&Math.floor(i.x)===x&&Math.floor(i.y)===y);if(sl&&!sl.lit){sl.lit=true;R.seals++;hit++;saChime();stFlash(.35,'#ffe0a0');toast(`ختم مضاء ${R.seals}/${m.goal.need}`,'#ffd890',true);for(let i=0;i<10;i++)R.fx.push({x:sl.x,y:sl.y,vx:rr(-1,1),vy:rr(-1,1),life:0,max:rr(.6,1.2)})}continue}
    break}
  R.beam={pts,t:0};if(hit&&R.seals>=m.goal.need)setTimeout(()=>hdDoorBeat(),1100);else if(!hit&&pts.length>2&&pts.some((p,i)=>i&&m.items.some(it=>it.k==='mirror'&&Math.floor(it.x)===Math.floor(p[0])&&Math.floor(it.y)===Math.floor(p[1]))))emTip('mir2','الشعاع انعكس... بس ما وصل ختم. جرّب تدير المرآة (E) أو غيّر وقفتك.')}
function hdMirrorToggle(it){it.o=it.o?0:1;saDoor&&saTone(520,700,.12,'triangle',.1);saNoise&&saNoise(.08,'highpass',3000,1,.1);R_fx(it)}
function R_fx(it){for(let i=0;i<5;i++)EM.fx.push({x:it.x,y:it.y,vx:rr(-.8,.8),vy:rr(-.8,.8),life:0,max:rr(.3,.6)})}
/* ---------- الجسور المنهارة ---------- */
function emCrumble(dt){const R=EM,m=R.m;if(!m.cr)return;const px=Math.floor(R.x),py=Math.floor(R.y);
  for(const c of m.cr){if(c.st===0){if(c.x===px&&c.y===py){c.st=1;c.t=.62;if(SA.n)saNoise(.25,'bandpass',500,2,.2,null,200)}}
    else if(c.st===1){c.t-=dt;if(c.t<=0){c.st=2;c.t=7;m.g[c.y][c.x]='L';for(let i=0;i<5;i++)R.fx.push({x:c.x+.5,y:c.y+.5,vx:rr(-.8,.8),vy:rr(-.8,.8),life:0,max:rr(.4,.9)});if(SA.n)saBoom(.25);if(c.x===px&&c.y===py)emFall()}}
    else if(c.t-=dt,c.t<=0){c.st=0;m.g[c.y][c.x]='C'}}}
function emFall(){const R=EM;if(ST.busy)return;ST.busy=1;saCaught();stFlash(.6,'#ff6a20');ST.shake=.8;R.E=Math.max(25,R.E-12);stWhisper('سقطت…',1);
  setTimeout(()=>{$('#fade').classList.add('on');setTimeout(()=>{R.x=R.ck.x;R.y=R.ck.y;toast('وقعت في الحمم... ارجع لآخر نار ولا توقف على الجسر','#ff9a6a',true);$('#fade').classList.remove('on');ST.busy=0},550)},300)}
/* ---------- رسم ديناميكي ---------- */
function hdDynFloor(ox,oy,t){const R=EM,m=R.m;if(!m.cr)return;
  for(const c of m.cr){if(c.st===0)continue;const sx=c.x*HT-ox,sy=c.y*HT-oy;if(sx<-HT||sx>W+HT||sy<-HT||sy>H+HT)continue;
    if(c.st===2){const g2=ctx.createLinearGradient(sx,sy,sx,sy+HT);g2.addColorStop(0,'#7a1d06');g2.addColorStop(1,'#c4410d');ctx.fillStyle=g2;ctx.fillRect(sx,sy,HT,HT)}
    else{ctx.fillStyle=`rgba(255,${80+Math.sin(t*40)*30|0},20,.28)`;ctx.fillRect(sx,sy,HT,HT);ctx.strokeStyle='rgba(20,8,4,.9)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(sx+3,sy+2);ctx.lineTo(sx+11,sy+11);ctx.lineTo(sx+7,sy+22);ctx.moveTo(sx+20,sy+1);ctx.lineTo(sx+14,sy+13);ctx.lineTo(sx+22,sy+20);ctx.stroke()}}}
function hdDynEmis(ox,oy,t){const R=EM,m=R.m;
  if(m.cr)for(const c of m.cr){if(c.st!==2)continue;const sx=c.x*HT-ox,sy=c.y*HT-oy;if(sx<-HT||sx>W+HT||sy<-HT||sy>H+HT)continue;const k=.5+.5*Math.sin(t*1.7+c.x*.9+c.y*1.3);ctx.fillStyle=`rgba(255,${110+k*80|0},30,${.14+.1*k})`;ctx.fillRect(sx,sy,HT,HT);ctx.fillStyle='rgba(255,240,150,.4)';ctx.fillRect(sx+((t*9+c.y*7)%HT),sy+((c.x*5)%HT),4,1)}
  m.items.forEach(o=>{if(o.k!=='seal')return;const sx=o.x*HT-ox,sy=o.y*HT-oy;if(sx<-40||sx>W+40||sy<-40||sy>H+40)return;
    if(o.lit){glowAdd(sx,sy-8,34,'#ffd070',.7);ctx.fillStyle='#fff0b8';ctx.beginPath();ctx.arc(sx,sy-8,4,0,7);ctx.fill();ctx.strokeStyle='#ffd070';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(sx,sy-8,8+Math.sin(t*4)*1,0,7);ctx.stroke()}
    else{ctx.globalAlpha=.35+.25*Math.sin(t*2+o.x);ctx.strokeStyle='#ffb060';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(sx,sy-8,7,0,7);ctx.stroke();ctx.fillStyle='#ffb060';ctx.fillRect(sx-1,sy-12,2,8);ctx.globalAlpha=1}});
  const B=R.beam;if(B){B.t+=1/60;const a=Math.max(0,1-B.t/1.4);if(a<=0){R.beam=null}else{ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineJoin='round';
    const P=B.pts.map(p=>[p[0]*HT-ox,p[1]*HT-oy-8]);for(const[w_,al,col]of[[9,.22,'255,150,50'],[4,.6,'255,210,120'],[1.6,1,'255,255,235']]){ctx.strokeStyle=`rgba(${col},${al*a})`;ctx.lineWidth=w_;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
    P.forEach((p,i)=>{if(i%2===0)glowAdd(p[0],p[1],18,'#ffc070',.35*a)});ctx.restore()}}}
function hdMirror(it,sx,sy,t){hdShadow(sx,sy+1,9,.4);ctx.fillStyle='#2a2420';ctx.fillRect(sx-6,sy-4,12,5);ctx.fillStyle='#4a4038';ctx.fillRect(sx-1,sy-22,2,19);
  ctx.save();ctx.translate(sx,sy-20);ctx.rotate(it.o?.62:-.62);const g=ctx.createLinearGradient(-9,0,9,0);g.addColorStop(0,'#bfe0ff');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#8aa8c8');ctx.fillStyle='#6a5030';ctx.beginPath();ctx.ellipse(0,0,6.6,13.5,0,0,7);ctx.fill();ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,5,12,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(-2.4,-8,1.4,8);ctx.restore();
  ctx.strokeStyle=it.hit?'#ffd070':'rgba(255,190,100,.55)';ctx.lineWidth=1.4;ctx.beginPath();if(it.o){ctx.moveTo(sx-8,sy+3);ctx.lineTo(sx+8,sy+9)}else{ctx.moveTo(sx-8,sy+9);ctx.lineTo(sx+8,sy+3)}ctx.stroke()}
/* ---------- الكاتم: يطفئ نيرانك ---------- */
function emSnufferAI(e,dt,ctxv){const R=EM,m=R.m,{d,los,pT,safeP}=ctxv;
  if(e.stun>0){e.stun-=dt;return}
  if(d<4.6&&los&&!safeP){R.E=Math.max(0,R.E-dt*2.4);if(R.E<=0&&!ST.busy)emDie('dark')}
  if(!safeP&&los&&d<6.5){e.st='hunt';e.lx=pT[0];e.ly=pT[1];e.lost=0;e.tg=null}
  else if(e.st!=='hunt'||e.lost>2.2){if(!e.tg||!e.tg.lit){let best=null,bd=1e9;for(const i of m.items)if((i.k==='brazier'||i.k==='altar')&&i.lit){const dd=Math.hypot(i.x-e.x,i.y-e.y);if(dd<bd){bd=dd;best=i}}e.tg=best;if(best){e.st='hunt';e.lx=Math.floor(best.x);e.ly=Math.floor(best.y);e.lost=0}else if(e.st==='hunt'){e.st='patrol';e.wp=null}}}
  if(e.tg&&e.tg.lit){const dd=Math.hypot(e.tg.x-e.x,e.tg.y-e.y);if(dd<1.15){e.ext=(e.ext||0)+dt;if(e.ext>1.7){e.tg.lit=false;e.ext=0;if(SA.n)saLampOff();toast('الكاتم أطفأ ناراً!','#a0a8d0',true);e.tg=null;e.st='patrol';e.wp=null}}else e.ext=0}
  emMoveEnemy(e,dt,e.st==='hunt'?1.8:1.0,true);
  if(d<.62&&!safeP&&!ST.busy){R.E=Math.max(0,R.E-30);e.stun=2.2;stFlash(.5,'#7a8aff');ST.shake=.9;saCaught();const ang=Math.atan2(R.y-e.y,R.x-e.x),np=[R.x+Math.cos(ang)*.9,R.y+Math.sin(ang)*.9];if(!emSolid(np[0],np[1])){R.x=np[0];R.y=np[1]}if(R.E<=0)emDie('dark')}}
function hdHush(pan,v){saNoise(1,'bandpass',2400,2,.22*v,null,500,pan);hdVoice({f0:90,f1:60,dur:.9,type:'sine',vol:.14*v,pan,lp:300,vib:[9,6]})}
