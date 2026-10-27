/* ---------- items ---------- */
const RAR=[
  {n:'عادي',m:1,aff:0,val:4},
  {n:'نادر',m:1.35,aff:1,val:14},
  {n:'ملحمي',m:1.8,aff:2,val:40},
  {n:'أسطوري',m:2.5,aff:3,val:130}];
const RCOL=['#b9b1a3','#4aa3ff','#b872ff','#ffb02e'];
const WT=[
  {id:'sword',n:'سيف',dmg:10,cd:.38,rng:25,arc:110},
  {id:'scimitar',n:'سيف مقوّس',dmg:9,cd:.30,rng:24,arc:120},
  {id:'axe',n:'فأس',dmg:16,cd:.62,rng:27,arc:135},
  {id:'mace',n:'هراوة',dmg:18,cd:.70,rng:22,arc:150},
  {id:'dagger',n:'خنجر',dmg:6,cd:.2,rng:18,arc:80},
  {id:'spear',n:'رمح',dmg:11,cd:.46,rng:40,arc:40},
  {id:'bow',n:'قوس',dmg:8.5,cd:.5,rng:170,arc:0,ranged:1},
  {id:'staff',n:'عصا السحر',dmg:13,cd:.78,rng:150,arc:0,ranged:1,magic:1}];
const AT=[{slot:'helm',n:'خوذة',a:3,f:1},{slot:'chest',n:'درع',a:6,f:0},{slot:'gloves',n:'قفازات',a:2,f:1},{slot:'boots',n:'حذاء',a:2,f:0},{slot:'amulet',n:'تميمة',a:0,f:1}];
const SLOTN={weapon:'السلاح',helm:'الخوذة',chest:'الدرع',gloves:'القفازات',boots:'الحذاء',amulet:'التميمة'};
const SLOTS=['weapon','helm','chest','gloves','boots','amulet'];
const SUF=[null,['الحارس','الفولاذ','الصياد','الريح','الواحة','القافلة'],['الظلام','العاصفة','الثعبان','الصقر الأسود','الغروب','الأشباح'],['الجمر الأبدي','ملك الرماد','الفجر الأحمر','التنين الأخير','قلب الواحة','الشمس السوداء']];
const ADJ=[['صدئ','صدئة'],['قديم','قديمة'],['خشن','خشنة'],['بالٍ','بالية']];
const WAFF=[['crit',3,8],['steal',2,5],['aspd',8,20],['bdmg',6,16]];
const AFF={
  helm:[['hp',10,30],['regen',.5,1.5],['crit',2,5],['bdmg',3,8]],
  chest:[['hp',12,34],['regen',.5,1.8],['mspd',3,7]],
  gloves:[['aspd',5,14],['crit',2,6],['bdmg',4,10],['steal',1,3]],
  boots:[['mspd',5,12],['hp',8,22],['regen',.4,1.2]],
  amulet:[['xp',6,16],['gold',12,34],['hp',10,26],['bdmg',4,10],['crit',2,6],['steal',1,4],['regen',.5,1.5]]};
let uid=1;
function rollRar(w){let s=w.reduce((a,b)=>a+b,0),r=Math.random()*s;for(let i=0;i<w.length;i++){if((r-=w[i])<0)return i}return 0}
function makeItem(rar,ilvl,kind,slot){
  kind=kind||(Math.random()<.32?'weapon':'armor');
  const R=RAR[rar],sc=R.m*(1+.13*(ilvl-1))*rr(.9,1.12);
  const it={id:uid++,kind,rar,ilvl,stats:{}};
  let pool;
  if(kind==='weapon'){
    const t=pick(WT);Object.assign(it,{slot:'weapon',type:t.id,dmg:+(t.dmg*sc).toFixed(1),cd:t.cd,rng:t.rng,arc:t.arc,ranged:t.ranged,magic:t.magic});
    it.name=t.n+' '+(rar?pick(SUF[rar]):ADJ[ri(0,3)][0]);pool=WAFF.slice();
  }else{
    const t=slot?AT.find(a=>a.slot===slot):pick(AT);Object.assign(it,{slot:t.slot,type:t.slot,armor:t.a?Math.max(1,Math.round(t.a*sc)):0});
    it.name=t.n+' '+(rar?pick(SUF[rar]):ADJ[ri(0,3)][t.f?1:0]);pool=AFF[t.slot].slice();
  }
  for(let i=0;i<R.aff&&pool.length;i++){
    const [k,a,b]=pool.splice(ri(0,pool.length-1),1)[0];
    const v=rr(a,b)*(1+.04*ilvl)*(1+rar*.08);
    it.stats[k]=k==='regen'?+v.toFixed(1):k==='hp'?Math.round(v*(1+ilvl*.1)):+(v/100).toFixed(3);
  }
  it.value=Math.round(R.val*(1+.25*ilvl)*rr(.85,1.2));
  return it;
}
const LR=t=>'⁦'+t+'⁩';
const STATL={crit:v=>`${LR('+'+Math.round(v*100)+'%')} فرصة ضربة حرجة`,steal:v=>`${LR('+'+Math.round(v*100)+'%')} سرقة الحياة`,aspd:v=>`${LR('+'+Math.round(v*100)+'%')} سرعة الهجوم`,bdmg:v=>`${LR('+'+Math.round(v*100)+'%')} ضرر`,hp:v=>`${LR('+'+v)} صحة`,mspd:v=>`${LR('+'+Math.round(v*100)+'%')} سرعة الحركة`,regen:v=>`${LR('+'+v)} تجدد صحة بالثانية`,xp:v=>`${LR('+'+Math.round(v*100)+'%')} خبرة`,gold:v=>`${LR('+'+Math.round(v*100)+'%')} ذهب`};
function score(it){
  if(!it)return 0;const s=it.stats;
  if(it.kind==='weapon')return it.dmg/it.cd*(1+(s.crit||0)*.8)*(1+(s.aspd||0))*(1+(s.bdmg||0))*(1+(s.steal||0)*2);
  return it.armor*3+(s.hp||0)/5+(s.mspd||0)*60+(s.regen||0)*6+(s.crit||0)*60+(s.aspd||0)*50+(s.bdmg||0)*60+(s.steal||0)*80+(s.xp||0)*30+(s.gold||0)*12;
}
/* ---------- item sprites (16x16 pixel art, one design per type, tinted by rarity) ---------- */
const RPAL=[
 {M:'#a9a39a',m:'#6d675f',H:'#dcd7cc',G:'#8a8478',Y:'#a58a4a',C:'#8b7355',c:'#5e4a33'},
 {M:'#6fb2ff',m:'#2f6fb8',H:'#d4ebff',G:'#4aa3ff',Y:'#d9c27a',C:'#3d6fa8',c:'#264a78'},
 {M:'#b88aff',m:'#6a3fb0',H:'#eadcff',G:'#e0b0ff',Y:'#f0d27a',C:'#7a4fc0',c:'#4a2f80'},
 {M:'#ffc34a',m:'#b86a14',H:'#fff3c0',G:'#ff6a1f',Y:'#fff2a0',C:'#d9852a',c:'#8a4a14'}];
const WOOD='#8a5a2e',WOODD='#5a3a1c',WOODL='#b07a40';
function band(c,x0,y0,n,sx,sy,cols,ax=1,ay=0){const off=cols.length>>1;for(let i=0;i<n;i++)cols.forEach((col,k)=>{if(col!=='.')px(c,x0+sx*i+ax*(k-off),y0+sy*i+ay*(k-off),1,1,col)})}
const ISPR={
 sword:(c,P)=>{
  band(c,4,11,10,1,-1,[OUT,P.H,P.M,P.m,OUT]);px(c,13,0,2,2,OUT);px(c,13,1,1,1,P.H);px(c,14,1,1,1,P.M);px(c,14,0,1,1,OUT);
  ln(c,2,8,8,14,OUT,3);ln(c,3,9,7,13,P.Y,1);ln(c,1,15,4,12,OUT,3);ln(c,2,14,4,12,WOOD,1);px(c,0,14,3,3,OUT);px(c,1,15,1,1,P.G)},
 scimitar:(c,P)=>{
  const pts=[[4,12],[5,10],[7,8],[9,6],[11,4],[13,3],[14,2]];
  for(let i=0;i<pts.length-1;i++)ln(c,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],OUT,4);
  for(let i=0;i<pts.length-1;i++)ln(c,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],P.M,2);
  for(let i=0;i<pts.length-1;i++)ln(c,pts[i][0]-1,pts[i][1]-1,pts[i+1][0]-1,pts[i+1][1]-1,P.H,1);
  px(c,14,1,1,1,P.H);
  ln(c,1,10,6,15,OUT,3);ln(c,2,11,5,14,P.Y,1);ln(c,3,13,1,15,OUT,3);ln(c,3,13,1,15,WOODL,1);px(c,0,14,2,2,P.G)},
 axe:(c,P)=>{
  ln(c,3,14,12,5,OUT,3);ln(c,3,14,12,5,WOOD,1);ln(c,4,14,12,6,WOODD,1);
  poly(c,[[8,1],[14,0],[15,5],[13,8],[10,8],[9,5]],OUT);poly(c,[[9,2],[14,1],[14,5],[12,7],[10,7],[10,5]],P.M);
  poly(c,[[9,2],[12,2],[11,4],[10,5]],P.H);ln(c,12,4,13,6,P.m,1);px(c,10,9,2,2,P.Y);px(c,1,15,2,1,OUT);px(c,2,15,1,1,P.G)},
 mace:(c,P)=>{
  ln(c,3,14,10,7,OUT,3);ln(c,3,14,10,7,WOOD,1);
  ell(c,11,5,5,5,OUT);ell(c,11,5,4,4,P.m);ell(c,10,4,3,3,P.M);px(c,9,3,2,1,P.H);
  [[11,-1],[16,5],[11,11],[5,5],[15,1],[15,9],[7,1]].forEach(([x,y])=>{if(x<16&&y>=0&&y<16)px(c,Math.min(14,x),Math.max(0,y),1,1,P.H)});
  px(c,8,8,2,2,P.Y);px(c,1,15,2,1,OUT);px(c,2,14,1,1,P.G)},
 dagger:(c,P)=>{
  band(c,6,10,7,1,-1,[OUT,P.H,P.M,OUT]);px(c,13,3,2,2,OUT);px(c,13,3,1,1,P.H);
  ln(c,3,8,8,13,OUT,3);ln(c,4,9,7,12,P.Y,1);ln(c,3,13,1,15,OUT,3);ln(c,3,13,1,15,WOODL,1);px(c,0,14,2,2,P.G)},
 bow:(c,P)=>{
  const pts=[[3,4],[7,2],[11,4],[13,8],[12,13]];
  for(let i=0;i<4;i++)ln(c,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],OUT,4);
  for(let i=0;i<4;i++)ln(c,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],P.C,2);
  for(let i=0;i<4;i++)ln(c,pts[i][0]-1,pts[i][1]-1,pts[i+1][0]-1,pts[i+1][1]-1,P.Y,1);
  ln(c,3,4,12,13,OUT,1);ln(c,3,4,12,13,P.H,1);
  ln(c,6,10,14,2,OUT,3);ln(c,6,10,14,2,WOODL,1);px(c,13,1,2,2,P.M);px(c,14,1,1,1,P.H);px(c,5,9,2,2,P.G)},
 staff:(c,P)=>{
  ln(c,2,14,11,5,OUT,3);ln(c,2,14,11,5,WOOD,1);ln(c,3,14,11,6,WOODL,1);px(c,5,10,3,1,P.Y);
  ell(c,12.5,3.5,3.4,3.4,OUT);ell(c,12.5,3.5,2.4,2.4,P.G);ell(c,11.5,2.5,1,1,P.H);px(c,9,2,1,2,P.Y);px(c,15,6,1,2,P.Y);px(c,10,6,2,1,P.Y)},
 spear:(c,P)=>{
  ln(c,1,15,11,5,OUT,3);ln(c,1,15,11,5,WOOD,1);ln(c,2,15,11,6,WOODD,1);
  poly(c,[[15,0],[9,2],[10,6],[14,5]],OUT);poly(c,[[14,1],[10,3],[11,5],[13,4]],P.M);ln(c,13,1,11,4,P.H,1);
  px(c,9,6,3,3,P.Y);px(c,10,6,1,1,OUT)},
 helm:(c,P)=>{
  ell(c,8,8,7,7,OUT);ell(c,8,8,6,6,P.m);ell(c,8,7,5,5,P.M);ell(c,6,5,3,2,P.H);
  px(c,1,9,14,1,OUT);px(c,2,10,12,3,P.m);px(c,4,10,8,2,OUT);px(c,5,10,6,1,'#0a0605');
  px(c,7,6,2,7,P.m);px(c,2,12,3,3,OUT);px(c,3,12,2,2,P.M);px(c,11,12,3,3,OUT);px(c,11,12,2,2,P.m);
  px(c,6,0,4,3,OUT);px(c,7,0,2,2,P.G);px(c,7,2,2,1,P.Y)},
 chest:(c,P)=>{
  poly(c,[[0,4],[4,1],[6,3],[10,3],[12,1],[16,4],[15,8],[12,8],[12,15],[4,15],[4,8],[1,8]],OUT);
  poly(c,[[1,4],[4,2],[6,4],[10,4],[12,2],[15,4],[14,7],[11,7],[11,14],[5,14],[5,7],[2,7]],P.M);
  px(c,5,4,6,3,P.m);px(c,6,5,4,8,P.m);px(c,6,5,2,7,P.M);px(c,2,3,3,2,P.H);px(c,5,7,6,1,P.Y);px(c,5,11,6,1,P.Y);px(c,7,8,2,3,P.G);px(c,7,8,1,1,P.H);px(c,12,3,2,1,P.H)},
 gloves:(c,P)=>{
  [[1],[9]].forEach(([x])=>{
   px(c,x,5,6,10,OUT);px(c,x+1,6,4,8,P.C);px(c,x+1,2,1,5,OUT);px(c,x+3,1,1,5,OUT);px(c,x+5,2,1,5,OUT);
   px(c,x+1,3,1,3,P.C);px(c,x+2,1,1,5,P.C);px(c,x+4,2,1,4,P.C);px(c,x+1,6,1,2,P.H);
   px(c,x,11,6,3,OUT);px(c,x+1,11,4,2,P.M);px(c,x+1,11,4,1,P.H);px(c,x+2,8,2,2,P.m);px(c,x+2,8,1,1,P.G)})},
 boots:(c,P)=>{
  [[1],[8]].forEach(([x])=>{
   px(c,x,2,6,9,OUT);px(c,x+1,3,4,8,P.C);px(c,x,10,8,5,OUT);px(c,x+1,10,7,4,P.C);
   px(c,x+1,2,4,2,P.M);px(c,x+1,2,4,1,P.H);px(c,x+5,10,3,3,P.M);px(c,x+1,13,7,1,P.c);px(c,x+1,5,1,3,P.H);px(c,x+3,6,2,1,P.Y)})},
 amulet:(c,P)=>{
  [[2,0],[3,2],[4,4],[5,6],[6,8]].forEach(([x,y])=>{px(c,x,y,1,1,P.Y);px(c,15-x,y,1,1,P.Y)});
  px(c,2,0,1,1,OUT);px(c,13,0,1,1,OUT);
  ell(c,8,11,4,4,OUT);ell(c,8,11,3,3,P.Y);ell(c,8,11,2,2,P.G);px(c,7,10,1,1,P.H);px(c,8,7,1,2,P.Y)}
};
const _sprC={},_icoC={};
function itemSprite(type,rar){const k=type+rar;if(_sprC[k])return _sprC[k];const c=mkCv(16,16);ISPR[type](c.getContext('2d'),RPAL[rar]);return _sprC[k]=c}
function itemIcon(type,rar){const k=type+rar;return _icoC[k]||(_icoC[k]=itemSprite(type,rar).toDataURL())}
const ico=(type,rar)=>`<img class="ico" alt="" src="${itemIcon(type,rar)}">`;
