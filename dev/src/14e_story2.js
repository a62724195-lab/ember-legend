/* =====================================================================
   الفصل الثاني: «صدى الرمل» — خان مدفون، أجراس، وكائن يسمع خطواتك
   ===================================================================== */
SOL.add('O');
PAL.des={a:['#c9a468','#b58f55','#dbb87c'],wall:['#a8844f','#86653a','#c9a56c'],p:'#e0c690'};
const BELL_ORDER=[2,0,1];
const BELL_INFO=[{n:'جرس الريح',f:523.25,c:'#bfe6ff'},{n:'جرس الرمل',f:392,c:'#e0b050'},{n:'جرس الماء',f:659.25,c:'#4a9ae0'}];
const echoCount=()=>Object.keys(ST.mem).filter(k=>k[0]==='e').length;
const sneaking=()=>!!(ST.flags.c2&&((keys.shift&&lastInput==='key')||keys.c||ST.snk));
/* ---------- scenes ---------- */
SCENES.desert=function(){const w=48,h=20,g=mkGrid(w,h,'.');
  for(let x=0;x<w;x++){g[0][x]=g[1][x]=g[h-1][x]=g[h-2][x]='^'}
  for(let y=0;y<h;y++){g[y][0]=g[y][1]=g[y][w-1]='^'}
  gbox(g,2,9,44,2,',');
  [[8,3,5,3],[20,14,6,3],[31,3,5,3],[12,15,4,2],[38,14,5,3],[4,16,4,2]].forEach(a=>gbox(g,a[0],a[1],a[2],a[3],'^'));
  gbox(g,16,5,3,1,'#');gbox(g,16,5,1,3,'#');gbox(g,27,12,1,3,'#');gbox(g,27,14,3,1,'#');
  gbox(g,44,2,2,15,'#');gbox(g,44,9,2,2,',');
  [[5,7],[4,12],[10,12],[34,12],[40,6],[22,6]].forEach(([x,y])=>{if(g[y][x]==='.')g[y][x]='p'});
  [[7,8],[31,8],[36,11]].forEach(([x,y])=>{if(g[y][x]==='.')g[y][x]='J'});
  const O=[{k:'brazier',id:'camp',on:1,x:6*T+8,y:8*T+8,r:0,lab:''},
   {k:'glow',x:6*T+8,y:8*T+8,col:'#ffa040',lr:70,safe:1},
   {k:'door',x:45*T+8,y:10*T,to:'khan',sx:3*T,sy:12*T+8,lab:'ادخل الخان',r:14,nv:1,side:'n'},
   {k:'note',id:'n6',x:19*T+8,y:8*T+8,r:26,lab:'اقرأ اللوح',lines:[['لوح حجري على الطريق','«خان الصدى. من دخله غنّى، ومن غنّى ما خرج. والأجراس الثلاثة تعرف الترتيب.»'],['ريم','هذا اللحن... أعرفه يا راشد. كأني سمعته قبل ما أنولد.']]},
   {k:'mem',id:'e1',x:24*T+8,y:12*T+8,r:24,lines:[['صدى','جرس جمل مكسور مدفون بالرمل. كل قافلة كانت تعلّق جرسها على باب الخان وتغنّي: «يا خان يا بيت الغريب... افتح لمن ضاع الدرب».']]}];
  return{id:'desert',w,h,g,objs:O,theme:'des',dark:.74,tint:'#120c22',spawn:[3*T,10*T],name:'طريق الصدى'}};
SCENES.khan=function(){const w=36,h=24,g=mkGrid(w,h,'#');
  gbox(g,1,2,34,21,'.');gbox(g,1,11,34,2,',');gbox(g,17,2,2,21,',');
  [[8,6],[8,16],[25,6],[25,16]].forEach(([x,y])=>gbox(g,x,y,2,2,'#'));
  gbox(g,12,4,5,1,'#');gbox(g,21,18,5,1,'#');gbox(g,17,11,2,2,'O');
  [[3,4],[4,4],[31,4],[32,4],[30,20],[31,20],[3,19]].forEach(([x,y])=>g[y][x]='J');
  const O=[{k:'door',x:1*T+4,y:12*T,to:'desert',sx:42*T,sy:10*T,lab:'اخرج',r:12,nv:1,side:'l'},
   {k:'door',x:8*T+8,y:2*T+4,to:'stable',sx:7*T+8,sy:8*T,lab:'الإسطبل',r:12,nv:1,side:'t'},
   {k:'door',x:34*T+8,y:6*T+8,to:'maze',sx:0,sy:0,lab:'الدرج',r:13,nv:1,side:'r',ok:()=>!!ST.flags.c2_hall},
   {k:'seal',x:35*T,y:7*T},
   {k:'brazier',id:'br1',x:3*T+8,y:14*T+8,r:20,lab:'أشعل الجمرة',on:1},
   {k:'brazier',id:'br2',x:12*T+8,y:14*T+8,r:20,lab:'أشعل الجمرة'},
   {k:'brazier',id:'br3',x:30*T+8,y:14*T+8,r:20,lab:'أشعل الجمرة'},
   {k:'bell',id:'b0',i:0,x:5*T+8,y:6*T+8,r:22,lab:'ارنّ جرس الريح'},
   {k:'bell',id:'b1',i:1,x:30*T+8,y:18*T+8,r:22,lab:'ارنّ جرس الرمل'},
   {k:'bell',id:'b2',i:2,x:14*T+8,y:9*T+8,r:22,lab:'ارنّ جرس الماء'},
   {k:'glow',x:17.5*T+8,y:11.5*T+8,col:'#5ab8ff',lr:56,safe:1},
   {k:'glow',x:3*T+8,y:14*T+8,col:'#ffa040',lr:50,safe:1},
   {k:'mem',id:'e3',x:31*T+8,y:3*T+8,r:24,lines:[['صدى','دمية طفلة من خزف، عليها خيط أحمر. غنّت لها أمها آخر ليلة: «نامي يا حلوة... الليل ما يسرق إلا اللي ما يغنّي».']]}];
  return{id:'khan',w,h,g,objs:O,theme:'des',dark:.8,tint:'#0e0a1e',spawn:[3*T,12*T+8],name:'خان الصدى',
    echo:[[8,12],[18,5],[28,8],[28,16],[17,20],[6,18]]}};
SCENES.stable=function(){const w=14,h=10,g=groom(w,h,'=',[['J',1,1,3,2],['J',10,1,3,2],['S',5,1,4,1],['J',11,6,2,2],['F',2,6,2,1]]);g[h-1][7]='D';
  const O=[{k:'door',x:7*T+8,y:9*T+8,to:'khan',sx:8*T+8,sy:3.7*T,lab:'اخرج',r:11},
   {k:'note',id:'n7',x:7*T+8,y:3*T+8,r:26,lab:'اقرأ اللوح',lines:[['لوح الأغنية','«أول ما يُسمع الماء في الجرن... ثم تعبر الريح من الباب... وآخر ما ينام الرمل في الحضن. هكذا غنّتها سلمى لكل قافلة.»'],['ريم','الماء... ثم الريح... ثم الرمل. ما أنسى هالترتيب.']]},
   {k:'mem',id:'e2',x:3*T+8,y:4*T+8,r:24,lines:[['صدى','رحّالة قديمة، عليها اسم محفور: «سلمى». كانت مغنّية القوافل... وكانت تخاف الصمت أكثر من الصحراء.']]},
   {k:'glow',x:7*T,y:5*T,col:'#ffb060',lr:46,safe:1}];
  return{id:'stable',w,h,g,objs:O,theme:'int',dark:.7,tint:'#140a08',spawn:[7*T+8,8*T],name:'إسطبل الخان'}};
SCENES.hall=function(){const w=24,h=14,g=mkGrid(w,h,'#');gbox(g,1,1,22,12,',');
  [[5,4],[18,4],[5,9],[18,9]].forEach(([x,y])=>gbox(g,x,y,1,1,'#'));
  const O=[{k:'door',x:12*T+8,y:12*T+6,to:'khan',sx:32*T,sy:6*T+8,lab:'اخرج',r:12,nv:1,side:'b',ok:()=>!ST.flags.c2_fin},
   {k:'singer',x:12*T+8,y:6*T+8,r:50,lab:'ناد سلمى'},
   {k:'glow',x:12*T+8,y:6*T,col:'#ffd890',lr:96,safe:1}];
  return{id:'hall',w,h,g,objs:O,theme:'des',dark:.8,tint:'#0a0614',spawn:[12*T+8,11*T],name:'قاعة الصدى'}};
/* ---------- Reem follows ---------- */
function rbReset(){ST.bd={x:ST.x-14,y:ST.y+4,wt:0,mv:0,fx:1}}
function rbUpdate(dt){const b=ST.bd;if(!b)return;const tx=ST.x-ST.fx*16,ty=ST.y+3,dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);
  if(d>90){b.x=tx;b.y=ty;return}
  if(d>5){const v=Math.min(84,d*5),mx=dx/d*v*dt,my=dy/d*v*dt;if(stFree(b.x+mx,b.y))b.x+=mx;if(stFree(b.x,b.y+my))b.y+=my;b.mv+=(1-b.mv)*Math.min(1,dt*10);b.wt+=dt;if(Math.abs(dx)>3)b.fx=dx>0?1:-1}
  else b.mv*=.85}
function drawBuddy(){const b=ST.bd,w=Math.sin(b.wt*13)*b.mv,sx=rp(b.x-cx),sy=rp(b.y-cy),bob=-Math.abs(w)*1.1,P_=(x,y,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,ww,hh)};
  ctx.fillStyle='#00000040';ctx.beginPath();ctx.ellipse(sx,sy+6,5,2,0,0,7);ctx.fill();
  P_(sx-3-w,sy+2,2,4,'#3a2a1c');P_(sx+1+w,sy+2,2,4,'#3a2a1c');
  const by=sy+bob;P_(sx-4,by-3,8,7,'#b0485a');P_(sx-4,by+2,8,2,'#8a3446');P_(sx-4,by-3,8,1,'#d9788a');
  P_(sx-3,by-9,6,6,'#d9a47e');P_(sx-4,by-10,8,4,'#2a1a14');P_(sx-4,by-8,2,7,'#2a1a14');P_(sx+2,by-8,2,5,'#2a1a14');
  P_(sx+(b.fx>0?1:-2),by-7,1,1,'#1a1210');
  const lx=sx+b.fx*6,ly=by+1;P_(lx-1,ly-3,2,2,'#4a3a2a');P_(lx-2,ly-1,4,4,'#cfeaff');P_(lx-1,ly,2,2,'#fff')}
/* ---------- the Echo ---------- */
function ecSpawn(){const p=ST.sc.echo;ST.ec={x:p[3][0]*T+8,y:p[3][1]*T+8,pi:4,st:'patrol',lost:0,wait:0,t:0,lx:0,ly:0}}
function ecSafeObj(x,y){for(const o of ST.sc.objs){if(o.k==='brazier'&&(ST.lit[o.id]||o.on)&&Math.hypot(o.x-x,o.y-y)<46)return o;if(o.k==='glow'&&o.safe&&Math.hypot(o.x-x,o.y-y)<o.lr*.8)return o}return null}
function ecAlert(x,y){const e=ST.ec;if(!e)return;e.st='hunt';e.lx=x;e.ly=y;e.lost=0}
function ecUpdate(dt,moving,sn){const e=ST.ec;if(!e)return;e.t+=dt;
  const dx=ST.x-e.x,dy=ST.y-e.y,d=Math.hypot(dx,dy)||1,safeP=ecSafeObj(ST.x,ST.y);
  const hear=moving?(sn?38:130):0;
  if(!safeP&&(d<hear||d<26)){if(e.st!=='hunt'){saBoom(.35);stWhisper(pick(['سمعتك…','أين أنت…','غنّي معي…']),1)}ecAlert(ST.x,ST.y)}
  let tx,ty,v;
  if(e.st==='hunt'){tx=e.lx;ty=e.ly;v=48;if(Math.hypot(tx-e.x,ty-e.y)<7){e.lost+=dt;v=0;if(e.lost>2.4){e.st='patrol'}}}
  else{const P=ST.sc.echo,p=P[e.pi%P.length];tx=p[0]*T+8;ty=p[1]*T+8;v=28;if(e.wait>0){e.wait-=dt;v=0}else if(Math.hypot(tx-e.x,ty-e.y)<8){e.pi=(e.pi+1)%P.length;e.wait=1.4}}
  const L=Math.hypot(tx-e.x,ty-e.y)||1;if(v>0){e.x+=(tx-e.x)/L*v*dt;e.y+=(ty-e.y)/L*v*dt}
  const so=ecSafeObj(e.x,e.y);if(so){const sx=e.x-so.x,sy=e.y-so.y,sl=Math.hypot(sx,sy)||1;e.x+=sx/sl*50*dt;e.y+=sy/sl*50*dt;if(e.st==='hunt'&&!safeP)e.lost+=dt}
  if(d<120){ST.hbT=(ST.hbT||0)-dt;if(ST.hbT<=0){ST.hbT=.45+d/120*.7;saBeat(1-d/120)}}
  if(d<9&&!safeP&&!ST.busy)stCaught()}
function drawEcho(){const s=ST.ec,d=Math.hypot(s.x-ST.x,s.y-ST.y),a=clamp(1.15-d/190,.25,.95),sx=rp(s.x-cx),sy=rp(s.y-cy),t=ST.t*3,hunt=s.st==='hunt';
  ctx.save();ctx.globalAlpha=a*.55;const g=ctx.createRadialGradient(sx,sy-12,2,sx,sy-12,30);g.addColorStop(0,hunt?'rgba(255,120,40,.6)':'rgba(255,200,90,.5)');g.addColorStop(1,'rgba(255,190,80,0)');ctx.fillStyle=g;ctx.fillRect(sx-32,sy-44,64,64);
  ctx.globalAlpha=a;ctx.fillStyle='#120b04';ctx.beginPath();ctx.moveTo(sx-3,sy-32);ctx.quadraticCurveTo(sx-8,sy-22,sx-9,sy-6);
  for(let i=0;i<5;i++){const x=sx-9+i*4.5,y=sy+3+Math.sin(t*1.3+i*1.9)*2.6;ctx.lineTo(x,y);ctx.lineTo(x+2.2,y-5)}
  ctx.lineTo(sx+9,sy-6);ctx.quadraticCurveTo(sx+8,sy-22,sx+3,sy-32);ctx.quadraticCurveTo(sx,sy-36,sx-3,sy-32);ctx.fill();
  ctx.strokeStyle=hunt?'#ff8a30':'#c89a40';ctx.lineWidth=.8;ctx.stroke();
  const m=3+Math.sin(t*2.2)*1.6+(hunt?2:0);ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx,sy-20,2.6,m,0,0,7);ctx.fill();ctx.strokeStyle=hunt?'#ffb060':'#e8c070';ctx.lineWidth=.6;ctx.stroke();
  ctx.fillStyle=hunt?'#ffd0a0':'#fff0c0';ctx.fillRect(sx-4,sy-27,2,1.6);ctx.fillRect(sx+2,sy-27,2,1.6);
  ctx.restore()}
/* ---------- tall objects (y-sorted) ---------- */
function drawTall2(t){const sx=rp(t.x-cx),sy=rp(t.y-cy),o=t.o,P_=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
  if(t.k==='brazier'){const lit=ST.lit[o.id]||o.on;ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(sx,sy+3,7,2.5,0,0,7);ctx.fill();
    P_(sx-5,sy-6,10,3,'#3a2a1c');P_(sx-4,sy-3,8,3,'#241a10');P_(sx-1,sy,2,3,'#3a2a1c');P_(sx-4,sy+2,8,1,'#241a10');
    if(lit){const f=Math.sin(ST.t*13+o.x)*1.2,h=7+Math.sin(ST.t*9+o.x*.3)*2;P_(sx-3,sy-6-h+2,6,h,'#ff8a2a');P_(sx-2,sy-6-h+4+f*.3,4,h-2,'#ffc860');P_(sx-1,sy-6-h+6,2,h-4,'#fff2c0')}else P_(sx-3,sy-8,6,2,'#4a3a2a')}
  else if(t.k==='bell'){const i=o.i,c=BELL_INFO[i].c,r=(ST.bellT[o.id]||0),sw=Math.sin(ST.t*16)*3.5*Math.min(1,r);
    ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(sx,sy+3,9,3,0,0,7);ctx.fill();
    P_(sx-9,sy-26,2,29,'#4a3220');P_(sx+7,sy-26,2,29,'#4a3220');P_(sx-10,sy-28,20,3,'#6a4a2c');P_(sx-10,sy-28,20,1,'#8a6238');
    P_(sx+sw-1,sy-25,1,4,'#2a1c10');ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(sx+sw-3,sy-21);ctx.quadraticCurveTo(sx+sw-6,sy-12,sx+sw-7,sy-8);ctx.lineTo(sx+sw+7,sy-8);ctx.quadraticCurveTo(sx+sw+6,sy-12,sx+sw+3,sy-21);ctx.closePath();ctx.fill();
    P_(sx+sw-1,sy-8,2,2,'#2a1c10');P_(sx+sw-5,sy-17,3,1,'#ffffff55');
    if(r>0){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14,2,sx,sy-14,26);g.addColorStop(0,c+'88');g.addColorStop(1,c+'00');ctx.fillStyle=g;ctx.fillRect(sx-28,sy-42,56,56);ctx.restore()}}
  else if(t.k==='seal'){if(ST.flags.c2_hall){P_(sx-12,sy-22,10,38,'#050308')}else{P_(sx-14,sy-22,14,38,'#6a6050');P_(sx-14,sy-22,14,2,'#8a8070');P_(sx-14,sy+14,14,2,'#3a3428');
      [['#bfe6ff',-14],['#e0b050',-4],['#4a9ae0',6]].forEach(([c,y])=>{ctx.fillStyle=c;ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(sx-7,sy+y,2.2,0,7);ctx.fill();ctx.globalAlpha=1});P_(sx-14,sy-4,14,1,'#2a2418')}}
  else if(t.k==='singer'){const sw=Math.sin(ST.t*1.4)*1.5,tr=ST.flags.c2_true;
    ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-16,3,sx,sy-16,44);g.addColorStop(0,'rgba(255,216,140,.4)');g.addColorStop(1,'rgba(255,216,140,0)');ctx.fillStyle=g;ctx.fillRect(sx-46,sy-60,92,92);ctx.restore();
    ctx.fillStyle='#00000040';ctx.beginPath();ctx.ellipse(sx,sy+3,12,3.5,0,0,7);ctx.fill();
    ctx.fillStyle='#1a1030';ctx.beginPath();ctx.moveTo(sx-4+sw,sy-34);ctx.quadraticCurveTo(sx-10,sy-18,sx-13,sy+2);ctx.lineTo(sx+13,sy+2);ctx.quadraticCurveTo(sx+10,sy-18,sx+4+sw,sy-34);ctx.closePath();ctx.fill();
    P_(sx-13,sy,26,2,'#c8a050');P_(sx-5+sw,sy-26,10,2,'#c8a050');
    ctx.fillStyle='#e8dcc8';ctx.beginPath();ctx.ellipse(sx+sw,sy-38,4.2,5,0,0,7);ctx.fill();
    ctx.fillStyle='#0c0818';ctx.beginPath();ctx.moveTo(sx-5+sw,sy-40);ctx.quadraticCurveTo(sx+sw,sy-47,sx+5+sw,sy-40);ctx.lineTo(sx+7+sw,sy-14);ctx.lineTo(sx-7+sw,sy-14);ctx.closePath();ctx.globalCompositeOperation='destination-over';ctx.fill();ctx.globalCompositeOperation='source-over';
    if(tr){P_(sx-2+sw,sy-39,1,1,'#1a1210');P_(sx+1+sw,sy-39,1,1,'#1a1210');P_(sx-1+sw,sy-36,2,1,'#b0485a')}
    P_(sx+9,sy-14,3,4,'#ffd890');P_(sx+9,sy-13,3,2,'#fff4c8')}}
function ch2Post(){/* glints + the echo (drawn above the fog) */
  const gl=(x,y,c)=>{const a=.55+.45*Math.sin(ST.t*4+x),sx=rp(x-cx),sy=rp(y-cy);ctx.globalAlpha=a;ctx.fillStyle=c;ctx.fillRect(sx-1,sy-3,2,6);ctx.fillRect(sx-3,sy-1,6,2);ctx.globalAlpha=1};
  for(const o of ST.sc.objs){if(o.k==='bell')gl(o.x,o.y-14,BELL_INFO[o.i].c);else if(o.k==='brazier'&&!ST.lit[o.id]&&!o.on)gl(o.x,o.y-8,'#ffb060');else if(o.k==='singer'&&!ST.flags.c2_fin)gl(o.x,o.y-34,'#9fe8ff')}
  if(ST.ec)drawEcho();
  if(ST.ec){const d=Math.hypot(ST.ec.x-ST.x,ST.ec.y-ST.y);if(d<130){ctx.fillStyle=`rgba(160,70,0,${(1-d/130)*.26*(.6+.4*Math.sin(ST.t*9))})`;ctx.fillRect(0,0,W,H)}}}
/* ---------- interaction ---------- */
function ch2Use(o){const f=ST.flags;
  if(o.k==='brazier'){ST.lit[o.id]=1;saIgnite();ST.ck={id:ST.id,x:o.x,y:o.y+16};toast('أشعلت جمرة... منطقة آمنة','#ffb060',true);stSave();return true}
  if(o.k==='mem'&&o.id[0]==='e'){ST.mem[o.id]=1;stFlash(.35,'#ffe0a0');saChime();toast(`صدى ${echoCount()}/3`,'#ffd890',true);stSay(o.lines,()=>stSave());return true}
  if(o.k==='note'&&(o.id==='n6'||o.id==='n7')){if(!ST.notes.includes(o.id))ST.notes.push(o.id);saPaper();stSay(o.lines,()=>{if(o.id==='n7')f.c2_song=1;stSave()});return true}
  if(o.k==='bell'){ch2Bell(o);return true}
  if(o.k==='singer'){ch2Final();return true}
  return false}
function ch2Bell(o){if(ST.cin)return;const inf=BELL_INFO[o.i];ST.bellT[o.id]=1.4;
  if(SA.n){saBell(inf.f,.34,2.6);saBell(inf.f*.5,.2,3)}
  const seq=f2seq();seq.push(o.i);
  if(seq[seq.length-1]!==BELL_ORDER[seq.length-1]){ST.flags.c2_seq=[];stWhisper(pick(['غلط…','مو هكذا…']),1);toast('الترتيب خطأ... والصدى سمع!','#ff7a2f',true);ecAlert(o.x,o.y);
    if(!ST.flags.c2_song&&!ST.flags.c2_hint){ST.flags.c2_hint=1;setTimeout(()=>stSay([['ريم','لا... فيه ترتيب. أحس إن في لوح بالإسطبل (الباب فوق) يقوله.']]),600)}return}
  toast(`${inf.n} ✓ (${seq.length}/3)`,inf.c,true);
  if(seq.length>=3){ST.flags.c2_seq=[];ST.flags.c2_hall=1;stSave();
    setTimeout(()=>stCine([{d:5,cap:'الأجراس الثلاثة رنّت معًا... والجدار الشرقي بدأ ينزلق.',a:[34*T,6*T],b:[34*T,6*T+4],on:()=>{saBoom(.8);stFlash(.4,'#ffe0a0')}}],()=>{ST.sc&&(ST.bellT={});toast('انفتح درج تحت الخان (الجدار الشرقي)','#ffd24a',true);stSave()}),1400)}}
const f2seq=()=>ST.flags.c2_seq||(ST.flags.c2_seq=[]);
function ch2Enter(id,from){const f=ST.flags,k='c2_v_'+id;if(f[k])return false;
  if(id==='khan'){f[k]=1;setTimeout(()=>stSay([['ريم','هذا هو... خان الصدى. أحس الصوت يتنفس من الجدران.'],['راشد','ابقي قريبة مني. ولا تردّين على أي صوت.'],['ريم','الصدى يسمع خطواتك يا راشد. امشِ بهدوء: اضغط Shift أو C (أو زر «تسلّل»). واختبئ عند الجمر.']],()=>stSave()),450);return true}
  if(id==='stable'){f[k]=1;setTimeout(()=>stSay([['راشد','إسطبل قديم... والحبر على اللوح لسا طري.']]),450);return true}
  if(id==='hall'){f[k]=1;ST.busy=1;setTimeout(()=>{ST.busy=0;stCine([{d:4.6,cap:'القاعة... وفي وسطها امرأة طويلة بلا وجه، تغنّي.',a:[192,160],b:[192,112]}],()=>stSay([['سلمى','...أخيرًا. أحد يسمع. ثلاثين سنة وأنا أغنّي للجدران.'],['ريم','هي مو شرّ يا راشد... هي بس ما أحد ردّ عليها.'],['سلمى','لحني ناقص... ضاع آخره. ساعدوني أكمّله.']],()=>stSave()))},500);return true}
  return false}
function stObjective2(){const f=ST.flags;
  if(f.c2_fin)return '...';
  if(ST.id==='hall')return 'اقترب من سلمى وناديها';
  if(ST.songOn)return 'غنّ مع سلمى: A S D F أو الأسهم';
  if(ST.rcOn)return rcStones()>=3?'الأحجار غنّت... اذهب للباب (الزاوية الجنوبية الشرقية)':`ابحث عن أحجار الصدى ${rcStones()}/3 · لا تدر ظهرك للصدى`;
  if(f.c2_hall)return 'انزل الدرج في الجدار الشرقي للخان';
  if(ST.id==='desert')return 'امش شرقًا حتى باب خان الصدى';
  if(!f.c2_song)return 'ابحث عن لوح الأغنية (باب الإسطبل في الجدار الشمالي)... وانتبه للصدى';
  return `ارنّ الأجراس بالترتيب: الماء ← الريح ← الرمل (${f2seq().length}/3)`}
/* ---------- finale ---------- */
function ch2Final(){const full=echoCount()>=3;
  stSay([['راشد','سلمى... سمعتك. نسمع لحنك.'],['سلمى',full?'جمعتوا أصداء لحني الثلاثة... الجرس، والرحّالة، والدمية. اعطوني آخر الأغنية.':'ما جمعتوا أصدائي كلها... بس غنّوا معي ما تيسّر.']],()=>{
    stChoice('وش تسوي؟',[['«نغنّيها معك... من أولها لآخرها»',songStart],['«كفاية... أطفئ الفانوس»',ch2EndDark]])})}
function ch2EndTrue(){ST.flags.c2_fin=1;ST.flags.c2_true=1;stSave();
  stCine([{d:5.5,a:[192,120],b:[192,100],cap:'غنّيتوا الأغنية كاملة... من الجرس الأول للأخير.',on:()=>{ST.heart=1;saChime();stFlash(.5,'#ffd890')}},
   {d:6,paint:'stars',moon:1,cap:'وسلمى، لأول مرة منذ سنين... سكتت. بابتسامة.'},
   {d:6.5,paint:'dawn',ph:[.1,.6],crowd:1,cap:'ورجع الخان حيّ... قوافل، وفوانيس، وكل واحد يغنّي.'},
   {d:7,paint:'heart',cap:'وجمر الواحة التالي... كان ينتظر في مكان أبعد.'},
   {d:5,paint:'heart',title:1,cap:'...ويتبع الصدى'}],()=>{store.set('ember_story_ch2',2);ch2End('صدى الرمل','النهاية الكاملة — الجمر غنّى')})}
function ch2EndPartial(){ST.flags.c2_fin=1;stSave();
  stCine([{d:5.5,a:[192,120],b:[192,104],cap:'غنّيتوا ما حفظتوه... ولحنها بقي بلا آخر.'},
   {d:6,paint:'stars',cap:'سلمى نامت... بس الصدى ما زال يبحث عن بقية الأغنية.'},
   {d:5,paint:'road',cap:'طلعتوا من الخان. والأصداء الثلاثة تنتظر من يجمعها.'}],()=>{store.set('ember_story_ch2',1);ch2End('صدى الرمل',`الأصداء ${echoCount()}/3 — فيه نهاية كاملة ما انكشفت`)})}
function ch2EndDark(){
  stCine([{d:4.5,paint:'heart',cap:'انطفى الفانوس... وسكت الخان كله.'},{d:4.5,paint:'road',cap:'وصار الصمت... هو اللي يغنّي.'}],()=>{ST.flags.c2_fin=0;stSave();stSay([['ريم','لا يا راشد... مو هكذا. لازم نغنّيها.']])})}
function ch2End(a,b){showCard('نهاية الفصل الثاني',b,5200,()=>{stExit(true)})}
/* ---------- start ---------- */
function ch2UI(on){document.body.classList.toggle('ch2',!!on);const b=$('#tDash');if(b){b.textContent=on?'تسلّل':'دحرجة';b.classList.remove('on')}}
const INTRO2=()=>[{d:6,paint:'dawn',ph:[.05,.4],cap:'تركنا الغدير مع أول ضوء... وريم ما فارقت يدي.'},
  {d:6.5,paint:'stars',moon:1,cap:'لكن الليلة الثانية... ريم قامت تغنّي بلا ما تدري. نفس اللحن.'},
  {d:9,scene:'desert',walk:[3*T,10*T,27*T,10*T],cap:'الصوت ما كان في الغدير وحده... كان يناديها من بعيد: خان الصدى.',on:()=>{ST.x=3*T;ST.y=10*T;ST.fx=1;rbReset();if(ST.cin)ST.cin.sceneChanged=0}}];
function stStart2(){initAudio();
  const sv=store.get(STKEY),f={},mem={},notes=[];
  if(sv){Object.keys(sv.flags||{}).forEach(k=>{if(!/^c2|^u_n[67]$/.test(k))f[k]=sv.flags[k]});Object.keys(sv.mem||{}).forEach(k=>{if(k[0]==='m')mem[k]=1});(sv.notes||[]).forEach(n=>{if(n!=='n6'&&n!=='n7')notes.push(n)})}
  ST.flags=f;ST.flags.c2=1;ST.notes=notes;ST.mem=mem;ST.act=3;ST.lit={};
  ST.emOn=false;emUI(false);ST.rcOn=false;ST.songOn=false;ST.on=true;ST.cin=null;ST.busy=0;ST.wh=[];ST.flash=0;ST.heart=0;ST.darkT=0;ST.jump=0;ST._hud='';ST.ec=null;ST.bd=null;ST.snk=0;ST.bellT={};
  ['#title','#pause','#help','#settings','#coop','#end','#dead','#card','#stJ','#stCh'].forEach(s=>$(s)&&($(s).hidden=true));$('#hud').hidden=true;$('#dlg').hidden=true;$('#cine').hidden=true;
  document.body.classList.add('story');ch2UI(true);stAmb(true);keys={};
  stLoad('desert');state='story';
  stCine(INTRO2(),()=>{showCard('الفصل الثاني','صدى الرمل',2600,()=>{stSay([['راشد','الصوت يشدّنا لهناك... بس هالمرة ما أنا بروح لحالي.'],['ريم','أنا معك يا راشد. امشِ شرقًا... الخان ينتظر.']],()=>stSave())})})}
$('#story2Btn').onclick=()=>stStart2();
(function(){const b=$('#tDash');if(b)b.addEventListener('pointerdown',()=>{if(ST.on&&ST.flags.c2){ST.snk=ST.snk?0:1;b.classList.toggle('on',!!ST.snk)}})})();
stRefreshTitle();
Object.assign(window.__st,{stStart2,ch2Use,ch2Final,ch2EndTrue,ecSpawn,rbReset,echoCount,BELL_ORDER,ch2Bell});
