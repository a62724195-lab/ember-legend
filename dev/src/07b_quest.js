/* ---------- houses, quest NPCs, diary pages, exit door ---------- */
function houseMk(r,v){
  const st=v%5,P=[{w:['#b8a070','#d8c490','#e8d8a8'],roof:['#8a6a40','#a8844e','#c8a468'],flat:1},{w:['#5a3c20','#7a5632','#9a7244'],roof:['#2a5a34','#3c7a46','#58a060']},{w:['#4a4654','#6a6678','#8a869a'],roof:['#3a2a1c','#5a4028','#7a5a3a'],beams:1},{tent:1},{w:['#38303c','#524a58','#6e6678'],roof:['#2a1a1e','#4a2a30','#6a3a40'],banner:1}][st];
  const trunk=S_(66,60,33,58,c=>{
    if(P.tent){
      poly(c,[[6,54],[33,10],[60,54]],'#6a1a24');
      for(let i=0;i<6;i++){const a=6+i*9,b=a+9;poly(c,[[33,10],[a,54],[b,54]],i%2?'#e8d8b0':'#b02a3a')}
      poly(c,[[26,54],[33,30],[40,54]],'#1a1010');poly(c,[[29,54],[33,36],[37,54]],'#ffb060');px(c,31,8,4,3,'#ffd24a');px(c,33,2,1,7,'#3a2a1a');poly(c,[[33,3],[42,6],[33,9]],'#ffd24a');
      px(c,4,54,58,3,'#6a5a40');return}
    px(c,8,26,50,32,P.w[0]);px(c,9,26,48,30,P.w[1]);px(c,9,26,48,3,P.w[2]);
    for(let y=32;y<56;y+=6)for(let x=(y/6%2)*5+9;x<56;x+=10)px(c,x,y,9,1,P.w[0]);
    if(P.beams){px(c,8,26,4,32,'#5a3a1c');px(c,54,26,4,32,'#5a3a1c');px(c,8,34,50,3,'#5a3a1c');px(c,8,50,50,3,'#4a2e16')}
    if(P.flat){px(c,5,20,56,8,P.roof[0]);px(c,6,20,54,6,P.roof[1]);px(c,6,20,54,2,P.roof[2]);for(let i=0;i<7;i++)px(c,8+i*8,17,5,4,P.roof[1]);px(c,44,10,8,10,P.w[1]);px(c,44,10,8,2,P.w[2])}
    else{poly(c,[[2,28],[33,4],[64,28]],P.roof[0]);poly(c,[[5,28],[33,8],[61,28]],P.roof[1]);poly(c,[[8,27],[33,11],[40,16],[22,27]],P.roof[2]);for(let i=0;i<5;i++)ln(c,12+i*10,27,33,8+i,P.roof[0],1);px(c,46,8,6,12,P.w[0]);px(c,47,8,4,12,P.w[1])}
    poly(c,[[27,56],[27,40],[33,35],[39,40],[39,56]],'#1a1210');poly(c,[[29,56],[29,41],[33,37],[37,41],[37,56]],'#ffb060');poly(c,[[29,56],[29,45],[37,45],[37,56]],'#2a1810');px(c,35,48,1,1,'#ffd24a');
    [[13,34],[46,34]].forEach(([x,y])=>{px(c,x,y,9,8,'#1a1210');px(c,x+1,y+1,7,6,'#ffcf7a');px(c,x+4,y+1,1,6,'#1a1210');px(c,x+1,y+4,7,1,'#1a1210')});
    px(c,5,56,56,3,'#00000040');
    if(P.banner){px(c,12,8,2,18,'#3a2e30');poly(c,[[14,10],[24,12],[22,20],[14,18]],'#a82a2a');px(c,17,13,3,3,'#d8a830')}
    if(st===2){px(c,41,38,2,4,'#3a2e30');ell(c,42,44,3,3,'#ffb060');ell(c,42,44,1,1,'#fff2b0')}
  });
  return{trunk:{cv:outlined(trunk.cv),ax:33,ay:58},sh:[28,5,0,-1],glow:{c:'#ffb060',r:44,a:.3}};
}
SPECIES.house=houseMk;
const NPCD={
 umkhalid:{robe:'#3a4a8a',trim:'#e8c040',skin:'#c99973',hair:'#2a1a10',hat:'scarf',cl:'#d8503a',item:'jar'},
 layla:{robe:'#2a8a5a',trim:'#c8f0a0',skin:'#e0b08a',hair:'#3a2418',hat:'hair',item:'herb'},
 zayed:{robe:'#6a4a2a',trim:'#2a2a30',skin:'#b88a68',hair:'#2a1a10',hat:'bald',beard:1,item:'hammer'},
 noura:{robe:'#6a2a8a',trim:'#e8c040',skin:'#d8a880',hair:'#1a1018',hat:'veil',cl:'#3a1a5a',item:'lantern'},
 ammar:{robe:'#46485a',trim:'#c0c8d8',skin:'#c99973',hair:'#2a2018',hat:'helmet',item:'spear'}};
const _ns={};
function npcSprite(id){if(_ns[id])return _ns[id];const d=NPCD[id],cv=mkCv(28,34),c=cv.getContext('2d');
  px(c,9,13,10,15,d.robe);px(c,10,13,8,13,lite(d.robe,.12));px(c,9,25,10,3,lite(d.robe,-.25));px(c,9,19,10,2,d.trim);px(c,13,13,2,13,lite(d.robe,.25));
  px(c,10,28,3,3,'#2a1a10');px(c,15,28,3,3,'#2a1a10');
  px(c,10,6,8,8,d.skin);px(c,10,6,8,1,lite(d.skin,.2));px(c,12,9,1,2,'#1a1210');px(c,16,9,1,2,'#1a1210');px(c,13,12,3,1,lite(d.skin,-.3));
  if(d.hat==='scarf'){px(c,9,4,10,5,d.cl);px(c,9,8,2,7,d.cl);px(c,17,8,2,7,d.cl);px(c,9,4,10,1,lite(d.cl,.3))}
  else if(d.hat==='hair'){px(c,9,4,10,4,d.hair);px(c,8,7,3,12,d.hair);px(c,17,7,3,12,d.hair);px(c,11,3,4,1,'#c8f0a0');px(c,16,4,2,2,'#f0a0b8')}
  else if(d.hat==='bald'){px(c,10,5,8,2,lite(d.skin,.1))}
  else if(d.hat==='veil'){px(c,8,3,12,6,d.cl);px(c,8,8,3,14,d.cl);px(c,17,8,3,14,d.cl);px(c,9,3,10,1,d.trim);px(c,11,12,6,1,lite(d.cl,.3))}
  else if(d.hat==='helmet'){px(c,9,3,10,5,'#7a7e92');px(c,9,3,10,1,'#b0b8c8');px(c,13,0,2,4,'#c82a1a');px(c,13,7,2,5,'#7a7e92')}
  if(d.beard){px(c,10,11,8,4,d.hair);px(c,11,10,6,1,d.hair)}
  px(c,7,14,3,9,d.robe);px(c,18,14,3,9,d.robe);px(c,7,22,3,2,d.skin);px(c,18,22,3,2,d.skin);
  if(d.item==='jar'){ell(c,22,23,3,3,'#6a3a22');ell(c,22,22,2,2,'#a8643a')}
  if(d.item==='herb'){px(c,21,18,1,6,'#3a7a2a');px(c,19,18,3,2,'#58a048');px(c,22,17,3,2,'#58a048')}
  if(d.item==='hammer'){ln(c,23,28,23,14,'#5b3d24',2);px(c,20,11,7,5,'#8a8a96');px(c,20,11,7,1,'#c0c0d0')}
  if(d.item==='lantern'){ln(c,23,16,23,20,'#3a2a1a',1);px(c,21,20,5,6,'#3a2a1a');px(c,22,21,3,4,'#ffcf7a')}
  if(d.item==='spear'){ln(c,24,30,24,6,'#6b4a2b',2);poly(c,[[22,8],[24,2],[26,8]],'#c8c8d8')}
  return _ns[id]={cv:outlined(cv),ax:14,ay:31}}
/* chapter quests: fetch 3 relics for a villager who lives in a house; plus one diary page of Jaber per chapter */
LV[0].q={id:'umkhalid',n:'أم خالد',zone:0,item:{n:'جرة ماء الواحة',count:3,kind:'jar'},reward:{gold:70,rar:1,slot:'weapon',pots:1,txt:'سيف ولدي خالد'},
 offer:[['أم خالد','يا ولدي... جمّر الجمر بيتنا وسرق ماءنا. لا تعدّ لي وحوش، أبي بس ثلاث جرار من ماء الواحة الأصلي.'],['أم خالد','ضاعت في الأطراف وفي خرائب النخيل. جيبها وأعطيك سيف ولدي خالد، الله يرجعه.'],['أم خالد','خالد راح مع جابر ابن ناصر قبل سنين، وما رجع. جابر كان أطيب أهل الواحة.']],
 prog:[['أم خالد','لسا ما كملت الجرار؟ دوّر عند النخيل الذابل وخرائب الجمر.']],
 done:[['أم خالد','الله يحفظك! ماء الواحة الأصلي... كأني أشم ريحة بيتنا.'],['أم خالد','خذ سيف خالد. وإذا شفت جابر قول له إن أمه ما نسته.']],
 after:[['أم خالد','الله يعطيك العافية يا بطل.']]};
LV[1].q={id:'layla',n:'ليلى الشفّاءة',zone:0,item:{n:'عشبة شفاء',count:3,kind:'pod'},reward:{gold:110,rar:2,slot:'amulet',pots:2,txt:'تميمة الغابة'},
 offer:[['ليلى','أنت اللي نزلت من الواحة؟ جيت في وقتك. الأرواح المضيئة في الغابة مرّضت اللي بقوا هنا.'],['ليلى','أحتاج ثلاث أعشاب شفاء تنمو بين الفطر. قريبة من القلب، بس خذ حذرك.'],['ليلى','جابر كان يجي هنا يقعد تحت الشجرة الأم ويسكت. قال لي مرة: الحجر يسمع حتى لو سكتّ.']],
 prog:[['ليلى','ما لقيت العشب؟ يلمع بلون أخضر بين الفطر.']],
 done:[['ليلى','ممتاز! بهذا أعالج الجرحى. خذ هذي التميمة، كانت لجابر ولا لبسها.']],
 after:[['ليلى','الغابة هادية شوية. بفضلك.']]};
LV[2].q={id:'zayed',n:'زايد الحداد',zone:0,item:{n:'خام بلور',count:3,kind:'ore'},reward:{gold:150,rar:2,slot:'weapon',pots:2,txt:'سلاح من صنعه'},
 offer:[['زايد','ها! إنسان حي! لي مئة يوم محبوس في هالمنجم بدون خام.'],['زايد','جيب لي ثلاث قطع خام بلور من الكهوف، وأصنع لك سلاح ما لقيته في أي سوق.'],['زايد','أنا اللي صنعت سيف جابر. قال لي: اجعله يقطع الحجر. ما كنت أدري أي حجر يقصد.']],
 prog:[['زايد','الخام يلمع أزرق في الكهوف. لا تعطيني حجر عادي!']],
 done:[['زايد','هذا هو! الآن اسمع: هالسلاح من أحسن ما صنعت.']],
 after:[['زايد','الدخان يخلّي المنجم دافي. وجودك يخلّيه أدفى.']]};
LV[3].q={id:'noura',n:'نورة الراوية',zone:0,item:{n:'تميمة قديمة',count:3,kind:'urn'},reward:{gold:190,rar:2,slot:'chest',pots:2,txt:'درع الراوية'},
 offer:[['نورة','تعال، أنا نورة. أحفظ حكايات هالمدينة. وأعرف ليش دفنوا الفراعنة قلبهم هنا.'],['نورة','قبل ألف سنة صنع الكهنة حجرًا يعطي الأبد. جابر شاف رسمه على الجدران. لقاه ولا عرف ثمنه.'],['نورة','جيب لي ثلاث تمائم قديمة من جرار الدفن، وأعطيك درعًا يحميك من لعنتهم.']],
 prog:[['نورة','التمائم في الجرار المدفونة وسط المدينة. اكسر وما تخاف.']],
 done:[['نورة','سمعتها تغني! خذ الدرع، وقول لسالم إن أخاه لسا يقاوم من داخل الجمر.']],
 after:[['نورة','الحكايات تكمل بك، يا من لا ينسى.']]};
LV[4].q={id:'ammar',n:'الحارس عمار',zone:0,item:{n:'رسالة جندي',count:3,kind:'crate'},reward:{gold:260,rar:3,slot:'weapon',pots:2,txt:'سيف حرس الواحة'},
 offer:[['عمار','أنا آخر من بقي من حرس الواحة. كنا معه، كنا نحميه، وصار هو اللي نخاف منه.'],['عمار','جيب لي رسائل رفاقي الثلاث. أبي أوصلها لأهلهم قبل ما أموت.'],['عمار','وإذا وصلت لعرشه، قول له إن عمار ما كرهه.']],
 prog:[['عمار','الرسائل في الصناديق قريب منك. قريب جدًا.']],
 done:[['عمار','الله يجزيك. سيفي أخذه الجمر مني، بس هذا سيف الحرس المقدّس. خذه.']],
 after:[['عمار','أخبرهم بالحقيقة. وأنهِ هذا الكابوس.']]};
const DIARY=['أنا جابر بن ناصر، حارس الواحة. اليوم وجدت في عمق الرمل حجرًا ينبض كقلب حي. أخي سالم يقول: دعه مكانه. لكنه ينبض!','الحجر يعطي ماء ونورًا لكل البيوت، لكنه يطلب ثمنًا: كل ما أعطى أخذ من ذاكرتي. اليوم نسيت اسم أمي.','أخي سالم يرجوني أن أتوقف. قلت له: لن يعطش أحد بعد اليوم. لم أنظر في عينيه.','الحجر يهمس: اكسرني وأعطيك الأبد. الأموات قالوا قبلي نفس الكلام ورقدوا هنا.','إن قرأتم هذه الصفحات فأنا لم أعد أنا. الجمر يتكلم بفمي. حطّموا الحجر ولو كان آخر ما أرى. وقولوا لسالم: سامحني.'];
const MERCH=['','ياقوت: أنا ياقوت، تاجر القوافل. عرفت جابر قبل ما يتغير. كان يشتري مني كتب بس.','ياقوت: لا تثق بكل ما يلمع في الكهوف... إلا ذهبي. هذا حقيقي.','ياقوت: الفراعنة دفنوا ذهبهم، وأنا أبيعه لك. مو سرقة، تجارة.','ياقوت: أخر محطة يا بطل. إن رجعت حيًا، أول وجبة على حسابي.'];
/* interactions */
function qNow(){return G.q}
function giveReward(q,rw){
  const il=curL().ilv+3;G.gold+=rw.gold;G.pots+=rw.pots;
  const it=rw.slot==='weapon'?makeItem(rw.rar,il,'weapon'):makeItem(rw.rar,il,'armor',rw.slot);
  if(bag.length<30){bag.push(it);G.found[it.rar]++;toast(it.name,RCOL[it.rar],true);SFX.loot(it.rar)}else addDrop({x:P.x,y:P.y,item:it});
  toast(`+${rw.gold} ذهب · جرعات +${rw.pots}`,'#e8b64a');updBadge();G.dirty=true;
}
function talkQuest(){
  const q=G.q,def=curL().q;
  if(q.st===0)say(def.offer,()=>{q.st=1;toast(`مهمة جديدة: ${def.item.n} (0/${def.item.count})`,'#4fb5a3',true);SFX.chest();hudObj();G.dirty=true;saveGame(true)});
  else if(q.st===1){
    if(q.got>=def.item.count)say(def.done,()=>{q.st=3;giveReward(q,def.reward);toast('اكتملت المهمة','#6fd36f',true);hudObj();G.dirty=true;saveGame(true)});
    else say(def.prog);
  }else say(def.after);
}
function readDiary(){
  const d=G.q.diary;if(d.got)return;d.got=true;CAMP.pages=(CAMP.pages||0)+1;G.dirty=true;SFX.shard&&SFX.shard();
  toast(`صفحة من دفتر جابر ${CAMP.pages}/5`,'#7affd0',true);
  say([['دفتر جابر',DIARY[CAMP.ch]]],()=>saveGame(true));
}
function questTick(){
  const q=G.q;if(!q)return;
  if(q.st===1){for(const r of q.relics){if(r.got)continue;if(Math.hypot(r.x-P.x,r.y-P.y)<14){r.got=true;q.got++;SFX.coin();burst(r.x,r.y-6,14,'#bfe8ff',60,.6);const def=curL().q;toast(`${def.item.n} (${q.got}/${def.item.count})`,'#4fb5a3');hudObj();G.dirty=true;if(q.got>=def.item.count)toast(`ارجع إلى ${def.n}`,'#ffd24a',true)}}}
  if(!q.diary.got&&Math.hypot(q.diary.x-P.x,q.diary.y-P.y)<14)readDiary();
}
/* exit door */
function enterDoor(){
  if(state!=='play')return;SFX.door();G.shake=3;syncCamp();state='card';
  if(CAMP.ch>=LV.length-1){$('#fade').classList.add('on');setTimeout(()=>{$('#fade').classList.remove('on');showChapterEnd()},900)}
  else nextChapter();
}
function doorTick(){
  const e=G.exit;if(!e||!G.won)return;const d=Math.hypot(e.x-P.x,e.y-P.y);
  if(d<16){if(G.hasKey)enterDoor();else if((G.doorMsg||0)<G.time){G.doorMsg=G.time+3;toast('الباب مقفل: خذ المفتاح اللي سقط من الزعيم','#ffb067',true);SFX.warn&&SFX.warn()}}
}
let _key=null;function keySprite(){return _key||(_key=(()=>{const cv=mkCv(16,16),c=cv.getContext('2d');ell(c,5,5,4,4,'#a8801a');ell(c,5,5,2,2,'#2a1a08');ln(c,8,8,14,14,'#a8801a',3);px(c,11,12,3,2,'#a8801a');px(c,13,10,2,2,'#a8801a');ell(c,4,4,3,3,'#ffd24a');ell(c,4,4,1,1,'#2a1a08');ln(c,8,8,13,13,'#ffd24a',1);px(c,3,3,1,1,'#fff6c0');return outlined(cv)})())}
function drawExit(){
  const e=G.exit,x=Math.round(e.x-cx),y=Math.round(e.y-cy)+8,open=G.hasKey,t=G.time;if(x<-40||x>W+40||y<-20||y>H+80)return;
  shadow(e.x,e.y+8,16);
  const f=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b,w,h)};
  f(-17,-40,8,40,'#3a3238');f(-16,-40,6,40,'#5a525c');f(-16,-40,2,40,'#7a727c');f(9,-40,8,40,'#2a2228');f(10,-40,6,40,'#4a424c');
  f(-18,-46,36,7,'#4a424c');f(-17,-46,34,3,'#7a727c');f(-18,-40,36,1,'#1a1418');
  if(open){const g=ctx.createLinearGradient(0,y-38,0,y);g.addColorStop(0,'#fff6c8');g.addColorStop(1,'#ffb040');ctx.fillStyle=g;ctx.fillRect(x-9,y-38,18,38);
    for(let i=0;i<3;i++)f(-6+i*5,-36+((t*14+i*9)%34|0),2,2,'#fff')}
  else{f(-9,-38,18,38,'#1a0e12');f(-9,-38,9,38,'#2a1418');f(0,-38,9,38,'#241014');f(-1,-38,2,38,'#3a1a1e');
    const pul=.5+.5*Math.sin(t*3);for(let i=0;i<3;i++)f(-5+i*4,-30+i*9,3,1,`rgba(255,70,60,${.5+.4*pul})`);
    f(-4,-20,8,7,'#8a6a20');f(-3,-19,6,5,'#d8a830');f(-1,-17,2,2,'#2a1a08');f(-3,-23,6,4,'#6a4a10');f(-2,-25,4,3,'#c89a30')}
  if(e.pulse===undefined)e.pulse=0;
}
function drawQuestWorld(){
  const q=G.q;if(!q)return;
  if(q.st===1)q.relics.forEach(r=>{if(r.got)return;const k=curL().q.item.kind,s=brkSprite(k),b=Math.sin(G.time*3+r.x)*1.5;
    glowAdd(Math.round(r.x-cx),Math.round(r.y-cy-6),22,'#bfe8ff',.5);ctx.drawImage(s,Math.round(r.x-cx-8),Math.round(r.y-cy-14+b));
    ctx.fillStyle='#bfe8ffaa';ctx.fillRect(Math.round(r.x-cx-1),Math.round(r.y-cy-34),2,22)});
  if(!q.diary.got){const d=q.diary,b=Math.sin(G.time*2.4)*1.5;glowAdd(Math.round(d.x-cx),Math.round(d.y-cy-6),26,'#7affd0',.5);
    ctx.fillStyle='#4a2a14';ctx.fillRect(Math.round(d.x-cx-6),Math.round(d.y-cy-10+b),12,9);ctx.fillStyle='#8a4a22';ctx.fillRect(Math.round(d.x-cx-5),Math.round(d.y-cy-9+b),10,7);ctx.fillStyle='#e8d8a8';ctx.fillRect(Math.round(d.x-cx-4),Math.round(d.y-cy-8+b),8,5);ctx.fillStyle='#7affd0';ctx.fillRect(Math.round(d.x-cx-1),Math.round(d.y-cy-26),2,14)}
}

/* ---------- story placement ---------- */
function placeStory(B){
  const L=B.L,r=rng(CAMP.seed*13+B.li*977+5),aX=B.aX,m=B.m,v=B.v,cy=B.cy,ri=(a,b)=>a+Math.floor(r()*(b-a+1));
  const inb=(x,y)=>x>3&&y>3&&x<MW-4&&y<MH-4;
  let hi=B.sp.indexOf('house');if(hi<0){hi=B.sp.length;B.sp.push('house')}
  const vx=Math.round(aX*.2),side=r()<.5?-1:1,vy=clamp(cy[vx]+side*9,8,MH-9);
  for(let dy=-7;dy<=7;dy++)for(let dx=-8;dx<=8;dx++){const x=vx+dx,y=vy+dy;if(inb(x,y)&&dx*dx/1.6+dy*dy<=44){m[y][x]=0;v[y][x]=0}}
  const y0=Math.min(vy,cy[vx]),y1=Math.max(vy,cy[vx]);
  for(let y=y0;y<=y1;y++)for(let d=0;d<2;d++){if(inb(vx+d,y)){m[y][vx+d]=4;v[y][vx+d]=0}}
  const px0=vx*T,py0=vy*T;
  B.enemies=B.enemies.filter(e=>Math.hypot(e.x-px0,e.y-py0)>150);
  B.chests=B.chests.filter(c=>Math.hypot(c.x-px0,c.y-py0)>110);B.brks=B.brks.filter(k=>Math.hypot(k.x-px0,k.y-py0)>110);
  const house=(x,y,k)=>{for(let d=-1;d<=1;d++){m[y][x+d]=1;v[y][x+d]=-1}v[y][x]=(hi<<4)|((B.li+k*0)%5)};
  const qx=vx+(side<0?3:-3);
  house(qx,vy-3,0);house(vx-6,vy-1,0);house(vx+6,vy-1,0);
  const npc={x:qx*T+8,y:(vy-2)*T+10};
  for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=0;dy++){const x=qx+dx,y=vy-2+dy;if(y>vy-4&&m[y][x]===1&&v[y][x]===-1&&dy===0)continue}
  /* relics along the road */
  const relics=[],sp0=.34;
  for(let i=0;i<3;i++){let ok=false;for(let t=0;t<200&&!ok;t++){const f=.34+i*.17+r()*.05,x=Math.round(aX*f)+ri(-3,3),y=cy[clamp(x,0,MW-1)]+ri(-9,9);
    if(!inb(x,y)||x>=aX-2||m[y][x]!==0||Math.abs(y-cy[x])<3)continue;let free=true;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(m[y+dy][x+dx]!==0&&m[y+dy][x+dx]!==4)free=false;
    if(!free||B.bonfires.some(b=>Math.hypot(b.x-x*T,b.y-y*T)<60))continue;relics.push({x:x*T+8,y:y*T+8,got:false});ok=true}
    if(!ok){const x=Math.round(aX*(.34+i*.17));relics.push({x:x*T+8,y:cy[x]*T+8+T*4,got:false})}}
  /* Jaber's diary near the arena gate */
  let dx0=aX-9,dy0=cy[aX-9]+5;for(let t=0;t<80;t++){const x=aX-ri(6,12),y=cy[x]+ri(-7,7);if(inb(x,y)&&m[y][x]===0&&Math.abs(y-cy[x])>2){dx0=x;dy0=y;break}}
  B.story={npc,relics,diary:{x:dx0*T+8,y:dy0*T+8,got:false}};
  B.exit={x:(MW-6)*T+8,y:Math.round(MH/2)*T+6};
}
function mkQuest(B){const q={st:0,got:0,relics:B.story.relics.map(o=>Object.assign({},o)),diary:Object.assign({},B.story.diary)};return q}
