/* =====================================================================
   طور القصة: «الغدير الصامت» — مغامرة رعب سينمائية، استكشاف بدون قتال
   ===================================================================== */
const ST={on:false,id:null,sc:null,x:0,y:0,fx:1,wt:0,mv:0,t:0,flags:{},notes:[],mem:{},act:1,lit:{},cin:null,
  sh:{on:0,x:0,y:0,v:26,hid:0},flash:0,shake:0,wh:[],cam:{x:0,y:0},near:null,tAp:false,fade:0,heart:0,ck:null,busy:0,ch:null,dark:null,endK:0};
const SOL=new Set([...'#RpLFWBTScJw^ ']);
const memCount=()=>Object.keys(ST.mem).filter(k=>k[0]==='m').length;
const STKEY='ember_story2';
/* ---------- scene building ---------- */
const mkGrid=(w,h,c)=>Array.from({length:h},()=>Array(w).fill(c));
const gbox=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(g[j]&&g[j][i]!==undefined)g[j][i]=c};
const ghouse=(g,x,y,w,h,dx)=>{gbox(g,x,y,w,h-3,'R');gbox(g,x,y+h-3,w,3,'#');g[y+h-1][dx]='D'};
const tc=(x,y)=>[x*T+8,y*T+8];
function groom(w,h,floor,furn){const g=mkGrid(w,h,'#');gbox(g,1,1,w-2,h-2,floor);(furn||[]).forEach(f=>gbox(g,f[1],f[2],f[3],f[4],f[0]));return g}
const SCENES={
 village(){const w=46,h=28,g=mkGrid(w,h,'.');
  gbox(g,0,11,w,2,',');gbox(g,22,2,2,24,',');gbox(g,4,22,38,2,',');
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(Math.hypot(x-22.5,y-11.5)<=5.2)g[y][x]=',';
  ghouse(g,3,2,10,5,8);ghouse(g,33,2,10,5,38);ghouse(g,3,15,10,5,8);ghouse(g,33,15,10,5,38);
  gbox(g,8,7,2,4,',');gbox(g,38,7,2,4,',');gbox(g,8,20,2,2,',');gbox(g,38,20,2,2,',');
  gbox(g,22,11,2,2,'W');
  for(let x=0;x<w;x++){g[0][x]=g[1][x]=g[h-1][x]=g[h-2][x]='^'}
  for(let y=0;y<h;y++){g[y][0]='^';g[y][w-1]='^';g[y][1]=(y===11||y===12)?',':'^'}
  [[19,9],[26,9],[19,14],[26,14],[10,10],[36,10]].forEach(([x,y])=>g[y][x]='L');
  [[15,4],[15,6],[30,4],[30,6],[15,17],[15,19],[30,17],[30,19],[20,5],[25,5],[20,18],[25,18],[3,9],[3,13],[43,9],[43,13],[12,24],[34,24]].forEach(([x,y])=>{if(g[y][x]==='.')g[y][x]='p'});
  gbox(g,13,25,2,1,'J');gbox(g,31,25,2,1,'J');
  const lampDefs=[[19,9],[26,9],[19,14],[26,14],[10,10],[36,10]];
  /* door objects (center of the D tile) */
  const O=[];
  const door=(tx,ty,to,sx,sy,lab)=>O.push({k:'door',x:tx*T+8,y:ty*T+8,to,sx:sx*T+8,sy:sy*T+8,lab,r:11});
  door(8,6,'hA',8,9,'بيت أم سعيد');door(38,6,'hB',9,9,'مجلس الشيخ');door(8,19,'hC',7,8,'بيت ريم');door(38,19,'hD',8,9,'المخزن');
  lampDefs.forEach(([x,y],i)=>O.push({k:'lamp',id:'l'+i,x:x*T+8,y:y*T+8,r:20}));
  O.push({k:'mem',id:'m5',x:14*T+8+8,y:24*T+8,r:20,lines:[['ذكرى','عربة الحليب. أبو سعيد كان يوقفها هنا كل فجر ويصيح: «يا ناس! اللبن اللي ما يتأخر!» والكل يضحك لأنه كل يوم متأخر.']]});
  O.push({k:'mem',id:'m6',x:43*T,y:11*T+8,r:20,lines:[['ذكرى','فوانيس الأعياد. الأولاد كانوا يعلقونها على النخل ويغنون لين يطلع الفجر. آخر عيد... ما علّقها أحد.']]});
  return{id:'village',w,h,g,objs:O,theme:'ext',dark:.8,tint:'#080e2c',spawn:[3*T,11.5*T],name:'الغدير الصامت'}},
 hA(){const w=16,h=11,g=groom(w,h,'=',[['S',2,1,5,1],['S',10,1,3,1],['T',6,4,4,2],['J',13,3,1,1],['J',14,3,1,1]]);gbox(g,5,6,6,3,'r');g[h-1][8]='D';
  const O=[{k:'door',x:8*T+8,y:10*T+8,to:'village',sx:8*T+8,sy:7.6*T,lab:'اخرج',r:11},
   {k:'note',id:'n1',x:8*T,y:5*T+4,r:26,lab:'اقرأ الورقة',lines:[['ورقة على السفرة','«الليلة السابعة. الصوت يغني من البئر كل ما تطفّي الفانوس. أم سعيد قالت: لا تردّون عليه... بس صغيرنا ردّ.»'],['راشد','سبع ليالي... وكلهم تركوا العشا وراحوا؟']],done:()=>{ST.flags.n1=1}},
   {k:'mem',id:'m1',x:3*T+8,y:2*T+8,r:24,lines:[['ذكرى','ملعقة أم سعيد الخشب. كانت تغني وهي تطبخ: «يا غدير يا زين الغدير... ما تجف إلا يوم نسكت».']]},
   {k:'glow',x:12*T,y:2*T,col:'#ffb060',lr:46,safe:1},{k:'glow',x:8*T,y:4*T,col:'#ffb060',lr:40}];
  return{id:'hA',w,h,g,objs:O,theme:'int',dark:.7,tint:'#140a08',spawn:[8*T+8,9*T],name:'بيت أم سعيد'}},
 hB(){const w=18,h=11,g=groom(w,h,'=',[['S',9,1,3,1],['T',14,2,3,2],['S',1,1,3,1],['J',16,6,1,2]]);gbox(g,4,3,9,5,'r');[[2,5],[2,6],[15,5]].forEach(([x,y])=>g[y][x]='u');g[h-1][9]='D';
  const O=[{k:'door',x:9*T+8,y:10*T+8,to:'village',sx:38*T+8,sy:7.6*T,lab:'اخرج',r:11},
   {k:'note',id:'n2',x:15*T+8,y:4*T+4,r:28,lab:'افتح الدفتر',lines:[['دفتر الشيخ عبدالله','«أسماء أهل الغدير... ثلاث وعشرون اسم. وكل ليلة أشطب اسمًا ما عاد يردّ لمّا أناديه. الليلة بقي لي اسمي وحدي.»'],['دفتر الشيخ عبدالله','«المفتاح تحت وسادة المجلس. المخزن فيه الفتحة... لا تنزل لين تعرف ليش يغنّون.»'],['راشد','مفتاح؟ تحت وسادة المجلس...']],done:()=>{ST.flags.ledger=1}},
   {k:'key',id:'key',x:2*T+8,y:5.5*T,r:22,lab:'ارفع الوسادة',ok:()=>ST.flags.ledger&&!ST.flags.key,lines:[['راشد','مفتاح نحاسي... مكتوب عليه «المخزن». الشيخ كان يعرف كل شي.']],done:()=>{ST.flags.key=1;toast('أخذت مفتاح المخزن','#ffd24a',true);saKey()}},
   {k:'mem',id:'m2',x:10*T+8,y:2*T+8,r:24,lines:[['ذكرى','فنجان الشيخ المكسور. كل مساء يجمع الرجال ويقول: «اللي ما يسمع حكاية الغدير ما يعرف يحب الماي».']]},
   {k:'glow',x:15*T,y:4*T,col:'#ffb060',lr:44,safe:1},{k:'glow',x:3*T,y:2*T,col:'#ffb060',lr:36}];
  return{id:'hB',w,h,g,objs:O,theme:'int',dark:.72,tint:'#140a08',spawn:[9*T+8,9*T],name:'مجلس الشيخ'}},
 hC(){const w=14,h=10,g=groom(w,h,'=',[['B',1,2,3,2],['c',10,1,3,1],['T',6,5,2,1],['J',2,6,2,1]]);gbox(g,4,3,6,4,'r');g[h-1][7]='D';
  const O=[{k:'door',x:7*T+8,y:9*T+8,to:'village',sx:8*T+8,sy:21.6*T,lab:'اخرج',r:11},
   {k:'note',id:'n3',x:7*T,y:6*T+6,r:26,lab:'انظر للرسمة',lines:[['رسمة بالفحم','رسمة طفلة: بئر، وامرأة طويلة بلا وجه... وتحتها كتبت بخط مرتجف: «ما تخاف يا راشد. هو بس وحيد.»'],['راشد','ريم... كانت تعرف إني جاي.']],done:()=>{ST.flags.n3=1}},
   {k:'mem',id:'m3',x:3*T,y:7.2*T,r:24,lines:[['ذكرى','صندوق الموسيقى. تذكر؟ هذا الصندوق أنت اللي أرسلته لريم من أول سفرة. لسا يلعب نفس اللحن... بس أبطأ.']],done:()=>{stScare('music')}},
   {k:'closet',id:'closet',x:11*T+8,y:2*T,r:24,lab:'افتح الخزانة',lines:[],done:()=>{stScare('closet')}},
   {k:'glow',x:6*T,y:2*T,col:'#ffd090',lr:42,safe:1},{k:'glow',x:2*T,y:3*T,col:'#ffd090',lr:28}];
  return{id:'hC',w,h,g,objs:O,theme:'int',dark:.74,tint:'#100a14',spawn:[7*T+8,8*T],name:'غرفة ريم'}},
 hD(){const w=16,h=11,g=groom(w,h,'=',[['J',1,1,3,2],['J',12,1,3,2],['J',1,7,2,2],['S',6,1,4,1],['J',13,7,2,2]]);g[h-1][8]='D';g[5][8]='X';
  const O=[{k:'door',x:8*T+8,y:10*T+8,to:'village',sx:38*T+8,sy:21.6*T,lab:'اخرج',r:11},
   {k:'note',id:'n4',x:3.5*T,y:3.2*T,r:26,lab:'اقرأ الورقة',lines:[['ورقة ملصوقة على الصندوق','«إذا وصلت لهنا... فنحن فتحنا الفتحة الليلة الأولى بدافع الفضول. تحتها بئر أقدم من الغدير. الصوت ما ينادي ليؤذي... ينادي ليدلّنا. بس حنّا ما فهمنا.»'],['راشد','يدلّنا على إيش؟']],done:()=>{ST.flags.n4=1;stScare('lights')}},
   {k:'mem',id:'m4',x:7.5*T,y:2*T+4,r:24,lines:[['ذكرى','قارورة زيت الفوانيس. هذي اللي كان يسقيها الأطفال لكل فانوس بالقرية، ويحسبونها «طعام النور».']]},
   {k:'trap',id:'trap',x:8*T+8,y:5*T+8,r:22,lab:'افتح الفتحة',ok:()=>true,lines:[],done:()=>{}},
   {k:'glow',x:13*T,y:5*T,col:'#ffb060',lr:40,safe:1}];
  return{id:'hD',w,h,g,objs:O,theme:'int',dark:.8,tint:'#0e0a10',spawn:[8*T+8,9*T],name:'المخزن'}},
 cellar(){const w=30,h=11,g=mkGrid(w,h,'#');gbox(g,1,2,28,7,'~');[[6,2],[7,2],[14,6],[15,6],[21,2],[22,2]].forEach(([x,y])=>g[y][x]='J');
  const O=[{k:'door',x:2*T,y:5*T+8,to:'hD',sx:8*T+8,sy:6.6*T,lab:'اصعد',r:12},
   {k:'door',x:28*T,y:5*T+8,to:'well',sx:11*T+8,sy:13*T,lab:'انزل أكثر',r:12,ok:()=>true},
   {k:'note',id:'n5',x:10*T,y:3*T,r:24,lab:'اقرأ الكتابة',lines:[['نقش على الجدار','«من ردّ على الصوت صار منه. ومن غنّى معه صار له. والغدير كله غنّى.»']],done:()=>{ST.flags.n5=1}},
   {k:'mem',id:'m7',x:18*T,y:2.2*T,r:24,lines:[['ذكرى','فانوس ريم الأخير. كانت تقول: «النور ما يخوّف الظلام يا راشد... النور يقول له: أنا هنا، لا تخاف».']]},
   {k:'glow',x:9*T,y:5*T,col:'#7ad0ff',lr:44,safe:1},{k:'glow',x:20*T,y:5*T,col:'#7ad0ff',lr:44,safe:1},{k:'glow',x:27*T,y:5*T,col:'#7ad0ff',lr:34,safe:1}];
  return{id:'cellar',w,h,g,objs:O,theme:'cave',dark:.9,tint:'#04060f',spawn:[3*T,5*T+8],name:'السرداب',chase:1}},
 well(){const w=22,h=16,g=mkGrid(w,h,'#');for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(Math.hypot((x-10.5)*1,(y-7.5)*1.1)<8.2)g[y][x]='~';
  gbox(g,9,5,4,4,'w');
  const O=[{k:'door',x:11*T+8,y:14*T+8,to:'cellar',sx:27*T,sy:5*T+8,lab:'ارجع',r:12,ok:()=>!ST.flags.fin},
   {k:'pool',id:'pool',x:11*T,y:10*T,r:40,lab:'ناد ريم',lines:[],done:()=>stFinal()},
   {k:'glow',x:11*T,y:7*T,col:'#6ae0ff',lr:90,safe:1}];
  return{id:'well',w,h,g,objs:O,theme:'cave',dark:.82,tint:'#03060e',spawn:[11*T+8,12.6*T],name:'قاع الغدير'}}
};
/* ---------- tile art (baked once per scene) ---------- */
const PAL={ext:{a:['#c8a86c','#b99a60','#d6b97e'],p:'#e3cb98',wall:['#b9996c','#98794f','#d4b585'],roof:['#a07c52','#876440','#bd966a']},
 int:{a:['#6a4a30','#5b3f28','#7a5638'],wall:['#c4b090','#a69070','#dac6a6'],rug:['#7a2a2a','#a8483a','#e0b070']},
 cave:{a:['#3a3e50','#2e3242','#4a4f64'],wall:['#232634','#181a26','#34384a']}};
function bakeScene(sc){
  const cvn=mkCv(sc.w*T,sc.h*T),c=cvn.getContext('2d'),P=PAL[sc.theme],g=sc.g,seed=sc.id.length*7+3;
  const R_=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
  const at=(x,y)=>(g[y]&&g[y][x])||' ';
  for(let y=0;y<sc.h;y++)for(let x=0;x<sc.w;x++){
    const ch=g[y][x],px=x*T,py=y*T,h=hsh(x,y,seed),n=fbm(x/4,y/4,seed);
    const ground=()=>{const a=P.a;R_(px,py,T,T,n<.4?a[1]:n>.62?a[2]:a[0]);for(let i=0;i<3;i++){const hx=hsh(x,y,i+3);R_(px+((hx*977)|0)%13,py+((hsh(x,y,i+9)*911)|0)%13,2,1,hx>.5?a[1]:a[2])}};
    if(sc.theme==='ext'){
      if(ch==='.'||ch==='p'||ch==='L'||ch==='J'||ch==='W'||ch==='u'){ground();if(h<.07){R_(px+4,py+9,3,2,'#9a845a');R_(px+4,py+9,2,1,'#c8b080')}else if(h>.95){R_(px+6,py+8,1,3,'#7a8a3a');R_(px+8,py+6,1,5,'#8a9a4a')}}
      else if(ch===','){R_(px,py,T,T,mix(P.a[0],P.p,.7));R_(px+((h*13)|0)%12,py+((h*70)|0)%12,3,2,'#00000014');if(!(at(x,y+1)===','||at(x,y+1)==='W'))R_(px,py+T-1,T,1,'#0000001c')}
      else if(ch==='^'){ground();R_(px,py,T,T,'#243a22');R_(px+2,py+3,12,9,'#2e4a2a');R_(px+5,py+1,6,6,'#3a5c34');R_(px+3,py+9,3,4,'#1c2e1a')}
      else if(ch==='D'){R_(px,py,T,T,mix(P.a[0],P.p,.7))}
      else if(ch==='R'){R_(px,py,T,T,P.roof[0]);if(at(x,y-1)!=='R')R_(px,py,T,3,P.roof[2]);R_(px,py+T-2,T,2,P.roof[1]);if(h>.5)R_(px+3,py+5,8,1,P.roof[1]);if(at(x-1,y)!=='R')R_(px,py,1,T,P.roof[2]);if(at(x+1,y)!=='R')R_(px+T-1,py,1,T,P.roof[1])}
      else if(ch==='#'){R_(px,py,T,T,P.wall[0]);R_(px,py,T,1,P.wall[2]);if(h>.6)R_(px+2,py+4,5,1,P.wall[1]);R_(px,py+T-1,T,1,P.wall[1]);
        if(at(x,y-1)==='R'||at(x,y-1)==='#'){const wx=((x*5+y)%4)===1;if(wx&&at(x,y+1)==='#'&&at(x-1,y)==='#'&&at(x+1,y)==='#'){R_(px+3,py+3,10,9,'#2a1d14');R_(px+4,py+4,8,7,'#ffcf7a');R_(px+4,py+7,8,1,'#2a1d14');R_(px+7,py+4,1,7,'#2a1d14');R_(px+2,py+12,12,2,P.wall[2])}}}
    }else if(sc.theme==='int'){
      if(ch==='#'){R_(px,py,T,T,P.wall[0]);if(at(x,y-1)!=='#')R_(px,py,T,2,P.wall[2]);if(at(x,y+1)!=='#'){R_(px,py+T-5,T,5,'#7a5a3a');R_(px,py+T-5,T,1,'#9a7a52')}if(at(x+1,y)!=='#')R_(px+T-2,py,2,T,'#00000030');if(at(x-1,y)!=='#')R_(px,py,2,T,'#00000030');if(h>.7)R_(px+4,py+3,6,1,P.wall[1])}
      else{R_(px,py,T,T,P.a[(y%2)?0:1]);R_(px,py+T-1,T,1,'#00000030');if(h>.5)R_(px+((h*13)|0)%10,py+((h*70)|0)%12,5,1,P.a[2]);if(((x*3+y*2)%5)===0)R_(px+((h*7)|0)%12,py+2,1,12,'#00000018');
        if(ch==='r'){R_(px,py,T,T,P.rug[1]);if(at(x,y-1)!=='r')R_(px,py,T,2,P.rug[2]);if(at(x,y+1)!=='r')R_(px,py+T-2,T,2,P.rug[2]);if(at(x-1,y)!=='r')R_(px,py,2,T,P.rug[2]);if(at(x+1,y)!=='r')R_(px+T-2,py,2,T,P.rug[2]);if((x+y)%2===0){R_(px+7,py+5,2,6,P.rug[0]);R_(px+5,py+7,6,2,P.rug[0])}else R_(px+7,py+7,2,2,P.rug[2])}
        if(ch==='u'){R_(px+2,py+3,12,10,'#8a3a3a');R_(px+3,py+4,10,8,'#b0524a');R_(px+3,py+4,10,2,'#d27a6a')}
        if(ch==='X'){R_(px+1,py+1,T-2,T-2,'#5a3a22');R_(px+1,py+1,T-2,1,'#8a6238');R_(px+2,py+6,T-4,1,'#2e1c10');R_(px+6,py+3,4,9,'#3a2414');R_(px+7,py+7,2,2,'#c8a050')}}
    }else if(sc.theme==='des'){
      if(ch==='#'){R_(px,py,T,T,P.wall[0]);if(at(x,y-1)!=='#')R_(px,py,T,2,P.wall[2]);if(at(x,y+1)!=='#')R_(px,py+T-3,T,3,P.wall[1]);if(at(x+1,y)!=='#')R_(px+T-2,py,2,T,'#00000030');if(h>.6)R_(px+3,py+5,5,1,P.wall[1]);if(h<.15)R_(px+9,py+9,3,3,P.wall[2])}
      else if(ch==='^'){R_(px,py,T,T,P.a[2]);R_(px,py+T-6,T,6,P.a[0]);R_(px,py+T-2,T,2,P.a[1]);if(h>.4)R_(px+2,py+4,9,1,P.a[0]);R_(px+((h*13)|0)%8,py+8,6,1,P.a[1])}
      else if(ch==='O'){R_(px,py,T,T,'#8a8272');if(at(x,y-1)!=='O')R_(px,py,T,3,'#a89f8c');if(at(x,y+1)!=='O')R_(px,py+T-3,T,3,'#5a5444');R_(px+3,py+5,T-6,T-8,'#07101c');R_(px+5,py+7,T-10,2,'#2a6a98')}
      else if(ch===','){R_(px,py,T,T,mix(P.a[0],P.p,.75));R_(px+((h*13)|0)%12,py+((h*70)|0)%12,3,2,'#00000014');R_(px,py+T-1,T,1,'#0000001c');R_(px+T-1,py,1,T,'#00000010')}
      else{ground();if(h<.06){R_(px+4,py+9,3,2,'#9a845a')}}
    }else{
      if(ch==='#'){R_(px,py,T,T,P.wall[0]);R_(px,py,T,2,P.wall[2]);if(h>.5)R_(px+3,py+6,7,1,P.wall[1]);R_(px,py+T-1,T,1,P.wall[1])}
      else if(ch==='w'){R_(px,py,T,T,'#0c3a58');R_(px+2,py+4,8,1,'#2a8ab0');R_(px+7,py+10,6,1,'#1a6a90')}
      else{R_(px,py,T,T,n<.45?P.a[1]:P.a[0]);R_(px,py+T-1,T,1,'#00000040');R_(px+T-1,py,1,T,'#00000030');if(h>.8){R_(px+4,py+4,5,1,P.a[2]);R_(px+7,py+5,1,4,P.a[2])}}
    }
    /* furniture */
    if(ch==='S'){R_(px,py+2,T,T-2,'#5a3c22');R_(px,py+2,T,2,'#8a6238');R_(px,py+7,T,1,'#2e1c10');R_(px+2,py+3,3,4,'#c8a050');R_(px+7,py+4,3,3,'#a05a4a');R_(px+11,py+3,2,4,'#7aa0b0');R_(px+2,py+9,4,4,'#d8c8a0')}
    if(ch==='T'){R_(px,py+3,T,T-6,'#7a5230');R_(px,py+3,T,2,'#a8773f');R_(px,py+T-3,T,3,'#00000028');if(at(x-1,y)!=='T')R_(px,py+3,1,T-3,'#4a2e18');if(h>.5)R_(px+5,py+6,4,3,'#e8dcc0')}
    if(ch==='B'){R_(px,py+2,T,T-3,'#d8cdb0');R_(px,py+2,T,3,'#e8e0c8');R_(px,py+T-3,T,3,'#6a4a2a');if(at(x-1,y)!=='B'){R_(px,py+2,4,T-5,'#f0e8d0');R_(px,py+2,1,T-3,'#6a4a2a')}if((x+y)%2)R_(px+5,py+7,6,1,'#b8a888')}
    if(ch==='c'){R_(px,py,T,T,'#4a3220');R_(px+1,py+1,T-2,T-2,'#6a4a2c');R_(px+T/2,py+2,1,T-3,'#2e1c10');R_(px+T/2-3,py+8,2,2,'#c8a050');R_(px+T/2+2,py+8,2,2,'#c8a050')}
    if(ch==='J'){const crate=sc.theme!=='ext';if(crate){R_(px+1,py+2,T-2,T-3,'#8a6338');R_(px+1,py+2,T-2,2,'#b07a40');R_(px+1,py+8,T-2,1,'#5a3c20');R_(px+T/2,py+2,1,T-3,'#5a3c20')}else{R_(px+2,py+5,12,9,'#8a6338');R_(px+2,py+5,12,2,'#b07a40');R_(px+7,py+5,1,9,'#5a3c20')}R_(px+1,py+T-2,T-2,2,'#00000030')}
    if(ch==='F'){R_(px,py+6,T,2,'#7a5a3a');R_(px+2,py+3,2,10,'#5a3c22');R_(px+T-4,py+3,2,10,'#5a3c22')}
  }
  /* ground shadows under houses */
  if(sc.theme==='ext'){for(let y=0;y<sc.h;y++)for(let x=0;x<sc.w;x++)if(g[y][x]==='#'&&at(x,y+1)!=='#'&&at(x,y+1)!=='D'){R_(x*T,(y+1)*T,T,3,'#00000026')}
    /* door frames */
    for(let y=0;y<sc.h;y++)for(let x=0;x<sc.w;x++)if(g[y][x]==='D'){const px=x*T,py=y*T;R_(px,py,T,T,mix(P.a[0],P.p,.7));R_(px+1,py-14,T-2,15,'#2e1c10');R_(px+2,py-13,T-4,14,'#5a3a22');R_(px+T/2-1,py-13,2,14,'#3a2414');R_(px+T-5,py-6,2,2,'#c8a050');R_(px,py-16,T,3,'#6a4a2c')}}
  if(sc.theme==='des')sc.objs.forEach(o=>{if(o.k!=='door'||o.side==='n')return;const sd=o.side,r=sd==='t'?[o.x-8,o.y-16,16,18]:sd==='l'?[o.x-12,o.y-9,10,20]:sd==='r'?[o.x+2,o.y-9,10,20]:[o.x-8,o.y,16,14];
    R_(r[0]-1,r[1]-1,r[2]+2,r[3]+2,'#4a3a20');R_(r[0],r[1],r[2],r[3],'#07040e');R_(r[0]+1,r[1]+1,2,2,'#2a1e3a')});
  sc.bake=cvn}
/* ---------- tall objects drawn y-sorted ---------- */
function drawPalm(x,y,t){const sx=rp(x-cx),sy=rp(y-cy),sw=Math.sin(t*1.2+x*.07)*1.4;
  ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(sx,sy+2,8,3,0,0,7);ctx.fill();
  ctx.fillStyle='#6a4a2a';ctx.fillRect(sx-2,sy-18,4,20);ctx.fillStyle='#8a6a3e';ctx.fillRect(sx-2,sy-18,1,20);
  for(let i=0;i<6;i++){const a=i/6*6.28+.3,l=11+(i%2)*3;ctx.strokeStyle=i%2?'#2e6a34':'#3d8a44';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(sx,sy-19);ctx.quadraticCurveTo(sx+Math.cos(a)*l*.6+sw,sy-24+Math.sin(a)*3,sx+Math.cos(a)*l+sw*1.5,sy-17+Math.sin(a)*6);ctx.stroke()}
  ctx.fillStyle='#8a5a2a';ctx.fillRect(sx-2,sy-20,2,2);ctx.fillRect(sx+1,sy-19,2,2)}
function drawLampPost(x,y,lit){const sx=rp(x-cx),sy=rp(y-cy);
  ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(sx,sy+3,5,2,0,0,7);ctx.fill();
  ctx.fillStyle='#3a2a1c';ctx.fillRect(sx-1,sy-17,2,19);ctx.fillRect(sx-4,sy-17,8,2);
  ctx.fillStyle=lit?'#ffd890':'#4a4038';ctx.fillRect(sx-3,sy-15,6,7);ctx.fillStyle=lit?'#fff4c8':'#2c2620';ctx.fillRect(sx-2,sy-14,4,4);ctx.fillStyle='#2a1c10';ctx.fillRect(sx-4,sy-8,8,1);ctx.fillRect(sx-4,sy-16,8,1)}
function drawWellBig(sc){const x=22*T,y=11*T,sx=rp(x-cx),sy=rp(y-cy),W2=2*T;
  ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(sx+16,sy+W2-2,19,5,0,0,7);ctx.fill();
  ctx.fillStyle='#8a8272';ctx.fillRect(sx+1,sy+5,W2-2,W2-6);ctx.fillStyle='#a89f8c';ctx.fillRect(sx+1,sy+5,W2-2,4);ctx.fillStyle='#6a6252';ctx.fillRect(sx+1,sy+W2-3,W2-2,3);
  ctx.fillStyle='#050810';ctx.fillRect(sx+5,sy+8,W2-10,10);
  const a=ST.act>=2?.5+.2*Math.sin(ST.t*3):.12;ctx.fillStyle=`rgba(90,200,255,${a})`;ctx.fillRect(sx+7,sy+10,W2-14,5);
  ctx.fillStyle='#4a3220';ctx.fillRect(sx+3,sy-12,2,19);ctx.fillRect(sx+W2-5,sy-12,2,19);ctx.fillRect(sx+1,sy-14,W2-2,3);ctx.fillStyle='#8a6238';ctx.fillRect(sx+1,sy-14,W2-2,1);
  ctx.fillStyle='#c8b080';ctx.fillRect(sx+W2/2-1,sy-11,1,10)}
