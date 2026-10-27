/* =====================================================================
   زعيم البرج: كل 5 طوابق (5، 10، 15...) حارس يشتدّ مع كل ظهور، ومكافأته جمرة خاصة
   ===================================================================== */
function enIsBoss(fl){return(fl+1)%5===0}
function hdEndBoss(fl){const w=40,h=28,g=hdGrid(w,h);
  hdRoom(g,4,6,32,17);hdRoom(g,14,23,12,4);hdRoom(g,16,3,8,3);
  hdSet(g,[[9,12],[9,18],[30,12],[30,18],[15,15],[24,15],[20,19],[17,11],[22,11]],'P');g[2][19]='X';g[2][20]='X';
  const it=[hdIt('rune',17.5,25.5,{id:'r0',txt:'«حارس البرج يعود أقوى كلّما صعدت. ردّ إليه ما يرميه.»'})];
  [[20.5,24.5,1],[6.5,20.5,0],[33.5,20.5,1],[6.5,8.5,0],[33.5,8.5,0]].forEach(([x,y,l],i)=>it.push(hdIt('brazier',x,y,{id:'b'+i,lit:!!l})));
  const tier=Math.floor((fl+1)/5);
  return{w,h,g,items:it,en:tier>1?[{k:'weeper',x:8.5,y:17.5}]:[],boss:{k:'guard',hx:20.5,hy:9.5,sp:[],tier},noEmb:1,start:[20.5,25.5,-Math.PI/2],npc:{x:18.2,y:25.8},th:fl%6,name:'قاعة الحارس',goal:{kind:'flags',req:['guard'],txt:'الحارس',label:'اهزم حارس البرج'},door:[19,2]}}
const _enT=hdEndless;hdEndless=function(fl){return enIsBoss(fl)?hdEndBoss(fl):_enT(fl)};
/* تشتدّ الصعوبة حسب الشريحة */
const _bsI=hdBossInit;hdBossInit=function(m){const B=_bsI(m);if(EM.endless&&m.boss.tier){const t=m.boss.tier;B.hp=B.max=4+t*2;B.tier=t;B.xc=Math.min(t-1,3)}return B};
const _bsF=hdBossFire;hdBossFire=function(B){_bsF(B);if(B.xc){const R=EM;for(let k=0;k<B.xc;k++){const a=Math.atan2(R.y-B.y,R.x-B.x)+(k%2?1:-1)*(.5+.3*Math.floor(k/2));R.orbs.push({x:B.x+Math.cos(a)*1.2,y:B.y+Math.sin(a)*1.2+.3,vx:Math.cos(a),vy:Math.sin(a),sp:3.3+B.tier*.15,rf:0,age:0,tr:[]})}}};
/* مكافأة: جمرتان للاختيار عند سقوط الزعيم */
const _bsD=hdBossDie;hdBossDie=function(B){_bsD(B);if(EM.endless){const R=EM,ts=['blue','green','violet','gold'].sort(()=>Math.random()-.5).slice(0,2);
  ts.forEach((t,i)=>R.m.items.push(hdIt('ember',B.x+(i?1.6:-1.6),B.y+2.2,{id:'bw'+i,t})));toast('الحارس ترك جمرتين... اختر واحدة','#ffd890',true)}};
const _bsG=hdBossIntro2;hdBossIntro2=function(){const R=EM;if(R.endless&&R.bs){const B=R.bs;B.intro=0;showCard('حارس البرج · الطابق '+(R.floor+1),'رُدّ كرات اللهب بالوهج (R)',2600);return}_bsG()};
Object.assign(window.__hd||{},{hdEndBoss,enIsBoss,hdBossHurt:(B,b)=>hdBossHurt(B,b),hdBossFire:B=>hdBossFire(B)});
