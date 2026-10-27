/* =====================================================================
   الأسرار: غرفة المونتاج السرّية في المكتبة (خلف شق الجدار الجنوبي)
   ===================================================================== */
const _libS=hdLib;hdLib=function(){const m=_libS(),g=m.g;
  while(g.length<36)g.push(Array(m.w).fill('#'));m.h=36;
  hdRoom(g,4,28,10,6);g[26][8]='K';g[27][8]='.';
  m.items.push(hdIt('rune',12.5,24.5,{id:'r9',txt:'«خلف الرفوف الجنوبية... ضوء شاشة يومض في الظلام. شخص ما يشتغل لساعات متأخرة.»'}));
  m.items.push(hdIt('rune',8.5,30.4,{id:'office',office:1,lines:[
   ['شربكلي','إيه؟! كيف دخلت هنا؟ هذي غرفة المونتاج... ما أحد يدخلها!'],
   ['شربكلي','من أمس وأنا أرندر الفيديو... صار لي ٣٠ ساعة وما نمت، والشريط واقف على ٩٩٪ من ساعتين.'],
   ['شربكلي','وبعدين اللعبة هذي كلها ببلاش، فلا تنسى تشترك بالقناة. هههه'],
   ['شربكلي','خذ، جمرة من عندي. مكافأة للفضوليين اللي يفحصون الجدران.']]}));
  m.items.push(hdIt('brazier',12.5,29.5,{id:'bo',lit:true}));
  m.items.push(hdIt('coal',5.5,32.5,{id:'co0'}),hdIt('coal',12.5,32.5,{id:'co1'}));
  return m};
const _nr=emNear;emNear=function(){const b=_nr.apply(this,arguments);if(b&&b.it&&b.it.office)b.lab='كلّم شربكلي';return b};
let _offImg=null;function offImg(){if(!_offImg&&typeof INTRO_IMG!=='undefined'){_offImg=new Image();_offImg.src=INTRO_IMG.mascot}return _offImg}
const _hdRuneS=hdRune;hdRune=function(it,sx,sy,k){if(!it.office)return _hdRuneS(it,sx,sy,k);
  const t=performance.now()/1000;hdShadow(sx,sy+2,22,.5);
  ctx.fillStyle='#3a2a1c';ctx.fillRect(sx-22,sy-8,44,9);ctx.fillStyle='#5a4028';ctx.fillRect(sx-22,sy-8,44,2);ctx.fillStyle='#241810';ctx.fillRect(sx-20,sy+1,3,5);ctx.fillRect(sx+17,sy+1,3,5);
  const im=offImg();if(im&&im.complete&&im.naturalWidth){ctx.imageSmoothingEnabled=true;const hh=26,ww=hh*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,sx-ww/2,sy-8-hh+5,ww,hh)}
  [[-27,0],[11,1]].forEach(([dx,n])=>{const mx=sx+dx,my=sy-22;ctx.fillStyle='#111';ctx.fillRect(mx,my,16,12);ctx.fillStyle='#0c1a2a';ctx.fillRect(mx+1,my+1,14,9);
    for(let r=0;r<3;r++){const w=4+((Math.sin(t*(1+r*.7)+n*2+r)+1)*3.5);ctx.fillStyle=['#ff8a40','#7ad8ff','#c58bff'][(r+n)%3];ctx.fillRect(mx+2,my+2+r*3,w,2)}
    ctx.fillStyle='#111';ctx.fillRect(mx+6,my+12,4,3)});
  ctx.fillStyle='#d8d0c0';ctx.fillRect(sx+3,sy-10,5,4);ctx.fillStyle='#ffe070';ctx.fillRect(sx-8,sy-11,4,3);
  ctx.save();ctx.globalCompositeOperation='lighter';glowAdd(sx-19,sy-16,16,'#4aa8ff',.12);glowAdd(sx+19,sy-16,16,'#ff9a50',.1);ctx.restore()};
const _secL=hdSecLights;hdSecLights=function(cam,L){_secL(cam,L);for(const o of EM.m.items)if(o.office)L.push({x:o.x*HT-cam.x,y:o.y*HT-cam.y-14,r:60,a:.4,gl:.05,col:'#6ab4ff'})};
/* التفاعل: حوار الغرفة + مكافأة مرّة واحدة */
const _emInt=emInteract;emInteract=function(){const R=EM,n=R.near;
  if(n&&!n.hint&&!ST.cin&&!ST.busy&&state==='story'&&n.it&&n.it.office){const it=n.it;saPaper&&saPaper();const first=!it.read;it.read=0;
    stSay(it.lines,()=>{if(first&&!store.get('ember_office')){store.set('ember_office',1);R.E=100;hdEmberTake({k:'ember',t:'gold',x:it.x,y:it.y});toast('سرّ مكتشف: غرفة المونتاج!','#ffd890',true)}it.read=0});it.rdOnce=1;return}
  return _emInt.apply(this,arguments)};
/* سالم يلمّح */
try{HD_TOPICS.push({id:'secret',q:'في أسرار هنا؟',ok:e=>e.lv>=1&&!e.endless,lines:()=>[['سالم','الجدران يا ولدي ليست كلها صمّاء. ألقِ وهجك عليها... بعضها يتشقق ويفتح.'],['سالم','وسمعت أن في المكتبة غرفة خلف الرفوف الجنوبية، فيها شاب ما نام من أيام... لا تسألني.']]})}catch(e){}
