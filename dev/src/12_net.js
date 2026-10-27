/* ---------- co-op: two players over the artifact "room" capability ----------
   host = authoritative world (enemies, boss, projectiles). guest = own hero, own loot, sees host world via snapshots.
   presence ~12Hz carries each hero; topic "s" carries host snapshots ~8Hz; topic "m" carries events. */
const NET={on:false,role:null,room:null,code:'',name:store.get('ember_name')||'',live:false,pt0:null,welcomed:false,
  pl:{x:0,y:0,r:5,vis:false,fx:1,moving:false,wt:0,anim:0,animA:0,inv:0,dash:0,flash:0,recoil:0,atk:0,hp:100,maxhp:100,down:false,dn:false,nm:'',lv:1,invT:0,rvp:0,s:{}},
  peq:null,hits:[],bub:{},pings:[],emap:new Map(),bmap:new Map(),acc:{p:0,s:0,h:0,j:0,c:0},scaled:false,fromGuest:false,offs:[],lastSnap:0,hostGone:0,err:''};
const COOP_F=1.7,QPH=['ساعدني!','تعال هنا','احذر!','شكرًا يا بطل','أحييني!','ممتاز!'];
const netAvail=()=>typeof claude!=='undefined'&&claude&&typeof claude.use==='function';
const coopOn=()=>NET.on&&NET.live&&!!NET.pt0;
const selfDown=()=>P.down||state==='dead';
function netCode(n=4){const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<n;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
function netStatus(t,bad){const e=$('#cStatus');if(e){e.textContent=t;e.style.color=bad?'#ff8a7a':''}}
async function netOpen(role,code){
  netClose(true);
  const R=netAvail()?await claude.use('room'):null;
  if(!R){netStatus('الاتصال الجماعي غير متاح في هذه النسخة. لازم تفتح الصفحة من claude.ai وأنت مسجّل دخول.',true);return false}
  let rm;try{rm=await R.join('ember-'+code.toLowerCase())}catch(e){netStatus('ما قدرت أفتح الغرفة ('+((e&&e.code)||'خطأ')+')',true);return false}
  return netAttach(role,code,rm)}
function netAttach(role,code,rm){
  Object.assign(NET,{on:true,role,room:rm,code,live:false,pt0:null,welcomed:false,scaled:false,hits:[],pings:[],bub:{},hostGone:0});
  const er=e=>{NET.err=e&&e.code;if(NET.on){toast('انقطع الاتصال الجماعي','#ff8a7a',true);netClose()}};
  NET.offs=[rm.on('m',onNetMsg,er),rm.on('s',onSnap,er)];
  rm.presence({a:0,nm:NET.name,c:-1});
  return true}
function netClose(quiet){NET.p2p=false;
  NET.offs.forEach(f=>{try{f()}catch(e){}});NET.offs=[];
  if(NET.room){try{NET.room.presence({a:0});NET.room.leave()}catch(e){}}
  if(NET.on&&NET.role==='guest')netSaveChar();
  const was=NET.on;if(NET.scaled&&NET.role==='host')scaleHp(1/COOP_F);
  Object.assign(NET,{on:false,room:null,live:false,pt0:null,role:null,scaled:false,welcomed:false});NET.pl.vis=false;
  if(G&&G.enemies&&!quiet&&was)hud();
  uiNet()}
const emitM=(o)=>{if(NET.room&&NET.room.connected())NET.room.emit('m',o).catch(()=>{})};
function netSaveChar(){if(!G||!eq)return;store.set('ember_coopchar',{eq,bag,lvl:G.lvl,xp:G.xp,gold:G.gold,pots:G.pots,found:G.found,uid})}
/* ---------- host/guest messages ---------- */
function onNetMsg(m){
  if(m.sameTab||!m.data||!NET.on)return;const d=m.data;
  switch(d.t){
    case 'join':if(NET.role==='host'){if(NET.live)emitM({t:'welcome',seed:CAMP.seed,ch:CAMP.ch,k:G.kills,x:P.x|0,y:P.y|0});else emitM({t:'wait'})}break;
    case 'wait':if(NET.role==='guest')netStatus('المضيف لسا ما بدأ اللعب… ننتظر',false);break;
    case 'welcome':if(NET.role==='guest'&&!NET.welcomed){NET.welcomed=true;guestEnter(d)}break;
    case 'hit':if(NET.role==='host'&&NET.live)hostApplyHits(d.a);break;
    case 'kill':if(NET.role==='guest'&&NET.live)guestKill(d.id);break;
    case 'hurt':if(NET.live&&typeof d.d==='number'&&!P.down){hurtPlayer(Math.min(400,d.d))}break;
    case 'rev':if(P.down){P.down=false;P.hp=Math.round(P.maxhp*.5);P.inv=2.2;G.flash=.3;SFX.level&&SFX.level();toast('أحياك '+(NET.pl.nm||'شريكك')+'!','#7affd0',true);burst(P.x,P.y,22,'#7affd0',80,.7)}break;
    case 'ping':NET.pings.push({x:d.x,y:d.y,t:G.time,by:'pp'});if(NET.pings.length>4)NET.pings.shift();tone&&tone(880,.18,'sine',.05,200);break;
    case 'em':NET.bub.pp={t:QPH[d.i]||'',ts:G.time};break;
    case 'door':if(NET.role==='host'&&G.won&&state==='play')enterDoor();break;
  }}
function hostApplyHits(a){
  if(!Array.isArray(a)||!G||!NET.pt0)return;NET.fromGuest=true;
  for(const h of a.slice(0,24)){const e=h[0]<0?G.boss:G.enemies.find(q=>q.id===h[0]);if(!e||e.dead||e.state==='sleep')continue;
    const dmg=clamp(+h[1]||0,0,9999);hitEnemy(e,dmg,!!h[2],(+h[3]||0)/100)}
  NET.fromGuest=false}
function netKillEvent(e){if(NET.role==='host'&&NET.live)emitM({t:'kill',id:e.type==='boss'?-1:e.id})}
function guestKill(id){
  let e=id<0?G.boss:NET.emap.get(id);
  if(!e&&id>=0){const sp=NET.bmap.get(id);if(sp){e=mkEnemy(sp);e.x=sp.x;e.y=sp.y;G.enemies.push(e)}}
  if(!e||e.dead)return;e.dead=true;NET.emap.delete(id);killEnemy(e)}
/* ---------- snapshots ---------- */
function sendSnap(){
  if(!NET.room||!NET.room.connected())return;
  const pts=[P];if(NET.pl.vis)pts.push(NET.pl);
  const near=o=>pts.some(p=>Math.hypot(p.x-o.x,p.y-o.y)<330),e=[];
  for(const o of G.enemies){if(o.dead||!near(o))continue;if(e.length>=34)break;e.push([o.id,o.x|0,o.y|0,Math.ceil(o.hp),Math.ceil(o.mhp),(o.wind>0?1:0)|(o.aggro?2:0)])}
  const b=G.boss,s={c:CAMP.ch,k:G.kills,e,b:[b.x|0,b.y|0,Math.ceil(b.hp),Math.ceil(b.mhp),b.state,b.rage?1:0,+(b.ang||0).toFixed(2),b.dead?1:0],
    pj:G.projs.slice(0,26).map(p=>[p.x|0,p.y|0,+p.vx.toFixed(0),+p.vy.toFixed(0),p.r,p.c,p.k||0]),
    hz:G.haz.slice(0,10).map(h=>[h.x|0,h.y|0,h.r|0,+h.t.toFixed(2),+h.dur.toFixed(2),h.kind])};
  NET.room.emit('s',s).catch(()=>{})}
function onSnap(m){
  if(m.sameTab||NET.role!=='guest'||!NET.live||!G)return;const s=m.data;if(!s)return;NET.lastSnap=G.time;NET.hostGone=0;
  if(s.c!==CAMP.ch){if(!NET.moving)guestFollow(s.c);return}
  const seen=new Set();
  for(const a of s.e){let e=NET.emap.get(a[0]);
    if(!e){const sp=NET.bmap.get(a[0]);if(!sp)continue;e=mkEnemy(sp);e.x=a[1];e.y=a[2];G.enemies.push(e);NET.emap.set(a[0],e)}
    e.tx=a[1];e.ty=a[2];e.hp=a[3];e.mhp=a[4];e.wind=a[5]&1?.2:0;e.aggro=!!(a[5]&2);e.flash=Math.max(0,e.flash);seen.add(e)}
  for(const e of G.enemies){if(!seen.has(e)&&!e.dead){e.dead=true;NET.emap.delete(e.id)}}
  G.enemies=G.enemies.filter(e=>!e.dead);G.mini=G.enemies.find(e=>e.mini)||null;
  const b=G.boss,sb=s.b;b.tx=sb[0];b.ty=sb[1];b.hp=sb[2];b.mhp=sb[3];b.ang=sb[6];
  if(b.state==='sleep'&&sb[4]!=='sleep'&&!sb[7]){b.state=sb[4];$('#bossbar').hidden=false;$('#bossn').textContent=b.D.n;hudObj();SFX.roar&&SFX.roar();G.shake=4;showCard('زعيم الفصل',b.D.n,2800)}
  else if(!b.dead)b.state=sb[4];
  if(sb[5]&&!b.rage){b.rage=true;G.shake=6;toast(`${b.D.n} غضب!`,'#ff5a3a',true)}
  if(sb[7]&&!b.dead&&!G.won){b.dead=true;b.hp=0;b.state='dead';G.won=true;$('#bossbar').hidden=true;addDrop({x:b.x,y:b.y+16,key:1,z:0,vz:0,landed:true,bounced:3,vx:0,vy:0});hudObj()}
  G.kills=Math.max(G.kills,s.k);if(G.kills>=G.goal&&!G.gate)silentGate();
  G.projs=s.pj.map(p=>({x:p[0],y:p[1],vx:p[2],vy:p[3],r:p[4],c:p[5],k:p[6],a:Math.atan2(p[3],p[2]),dmg:0,life:.5}));
  G.haz=s.hz.map(h=>({x:h[0],y:h[1],r:h[2],t:h[3],dur:h[4],kind:h[5],dmg:0}))}
function silentGate(){G.gate=true;for(let y=B.acy-2;y<=B.acy+1;y++)G.map[y][B.aX]=4;renderMini(B,G);hudObj()}
/* guest world step (replaces enemy AI): ease stubs toward snapshot positions */
function guestWorld(dt){
  const k=Math.min(1,dt*12);
  for(const e of G.enemies){if(e.tx!==undefined){e.x+=(e.tx-e.x)*k;e.y+=(e.ty-e.y)*k}e.flash-=dt}
  const b=G.boss;if(b.tx!==undefined){b.x+=(b.tx-b.x)*k;b.y+=(b.ty-b.y)*k}b.flash-=dt;
  if(G.time-NET.lastSnap>8&&NET.lastSnap>0&&!NET.moving){NET.hostGone+=dt;if(NET.hostGone>1){toast('المضيف غادر أو انقطع. ترجع للقائمة…','#ff8a7a',true);NET.hostGone=-99;setTimeout(()=>{netLeaveToMenu()},2500)}}}
/* ---------- guest entry / follow ---------- */
function guestInit(){
  G.enemies=[];G.mini=null;NET.emap=new Map();NET.bmap=new Map();B.enemies.forEach(s=>NET.bmap.set(s.id,s));NET.bmap.set(B.mini.id,B.mini);
  G.boss.tx=G.boss.x;G.boss.ty=G.boss.y}
function guestEnter(w){
  const sv=store.get('ember_coopchar'),ch=w.ch;
  CAMP={seed:w.seed,ch,lvl:1,xp:0,gold:0,pots:2,shards:ch,found:[0,0,0,0],time:0,kills:0};
  eq=eqStart();bag=[];flags={};uid=1;
  P={x:0,y:0,r:5,hp:100,maxhp:100,face:0,fx:1,atk:0,anim:0,animA:0,inv:0,dash:0,dashCd:0,dx:1,dy:0,moving:false,wt:0,flash:0,potCd:0,regenT:0,z:0};
  if(sv&&sv.eq){eq=sv.eq;bag=sv.bag||[];uid=Math.max(1,sv.uid||1);CAMP.lvl=sv.lvl;CAMP.xp=sv.xp;CAMP.gold=sv.gold;CAMP.pots=Math.max(2,sv.pots);CAMP.found=sv.found||[0,0,0,0]}
  if(!sv||CAMP.lvl<1+ch*3){ /* catch-up kit so a friend can join any chapter */
    CAMP.lvl=Math.max(CAMP.lvl,1+ch*4);const il=LV[ch].ilv,rr_=ch>=2?2:1;
    eq.weapon=makeItem(rr_,il,'weapon');['helm','chest','gloves','boots','amulet'].forEach(s=>{if(!eq[s]||eq[s].rar<rr_)eq[s]=makeItem(rr_,il,'armor',s)});CAMP.gold+=ch*60}
  loadLevel(ch);guestInit();G.kills=w.k||0;if(G.kills>=G.goal)silentGate();
  P.x=w.x+14;P.y=w.y+6;P.hp=P.maxhp;NET.live=true;NET.lastSnap=0;NET.moving=false;
  ['#title','#coop'].forEach(s=>$(s).hidden=true);$('#hud').hidden=false;$('#cine').hidden=true;G.cam.x=clamp(P.x-W/2,0,MW*T-W);G.cam.y=clamp(P.y-H/2,0,MH*T-H);
  state='play';lastHud='';hud();uiNet();const L=curL();showCard(L.sub,L.name,1800);toast('انضممت لمغامرة '+(NET.pl.nm||'صديقك'),'#7affd0',true)}
function guestFollow(ch){
  NET.moving=true;state='card';keys={};$('#fade').classList.add('on');
  setTimeout(()=>{CAMP.ch=ch;loadLevel(ch);guestInit();if(NET.pl.vis){P.x=NET.pl.x+12;P.y=NET.pl.y+6}P.hp=P.maxhp;lastHud='';G.cam.x=clamp(P.x-W/2,0,MW*T-W);G.cam.y=clamp(P.y-H/2,0,MH*T-H);
    $('#fade').classList.remove('on');state='play';NET.moving=false;const L=curL();showCard(L.sub,L.name,2000);toast('انتقلت مع الفريق','#7affd0')},900)}
function netLeaveToMenu(){if(NET.role==="host"&&G)saveGame();const wasGuest=NET.role==='guest';netClose();$('#pause').hidden=true;$('#dead').hidden=true;$('#end').hidden=true;$('#hud').hidden=true;
  state='title';newCampaign();hud();$('#hud').hidden=true;refreshCont();$('#title').hidden=false;if(wasGuest)toast('رجعت للقائمة. شخصيتك محفوظة للمرة الجاية','#f1e7d6')}
/* ---------- difficulty scaling ---------- */
function scaleHp(f){if(!G)return;for(const e of G.enemies){e.hp*=f;e.mhp*=f}if(G.boss&&!G.boss.dead){G.boss.hp*=f;G.boss.mhp*=f}}
function onPartnerSeen(){
  if(NET.role==='host'&&!NET.scaled){NET.scaled=true;scaleHp(COOP_F)}
  toast((NET.pl.nm||'لاعب')+' دخل الغرفة','#7affd0',true);uiNet()}
function onPartnerGone(){
  if(NET.role==='host'&&NET.scaled){NET.scaled=false;scaleHp(1/COOP_F)}
  NET.pl.vis=false;toast((NET.pl.nm||'الشريك')+' غادر','#ff8a7a',true);
  if(NET.role==='guest'){setTimeout(()=>{if(NET.on&&!NET.pt0)netLeaveToMenu()},2500)}
  if(P.down){P.down=false;P.hp=Math.round(P.maxhp*.4);P.inv=2}uiNet()}
/* ---------- per-frame ---------- */
function equipPres(){const w=eq.weapon||{},f=k=>eq[k]?eq[k].rar|0:-1;return{wp:w.type||'sword',wr:w.rar|0,rg:w.ranged?1:0,wa:w.arc|0,wg:w.rng|0,hr:f('helm'),cr:f('chest'),br:f('boots'),gr:f('gloves'),ar:f('amulet')}}
function sendPresence(){
  const live=NET.role==='host'?(state!=='title'&&state!=='cine'&&state!=='end'):NET.live;
  if(!live||!G||!P){NET.room.presence({a:0,nm:NET.name,c:-1});return}
  NET.room.presence(Object.assign({a:1,c:CAMP.ch,x:P.x|0,y:P.y|0,f:P.fx,mv:P.moving?1:0,wt:+(P.wt%100).toFixed(2),an:P.anim>0?1:0,aa:+P.animA.toFixed(2),hp:Math.ceil(P.hp),mh:P.maxhp,lv:G.lvl,nm:NET.name,
    dn:selfDown()?1:0,rv:+(P.rvT||0).toFixed(2),dh:P.dash>0?1:0,iv:P.inv>0?1:0,fl:P.flash>0?1:0},equipPres()))}
function readPartner(pr,dt){
  const o=NET.pl,k=Math.min(1,dt*14),vis=!!pr.a&&pr.c===CAMP.ch&&NET.live;
  if(vis&&!o.vis){o.x=pr.x;o.y=pr.y}
  o.vis=vis;o.nm=pr.nm||o.nm||'';
  if(!vis&&pr.a===0&&!NET.live&&NET.role==='host')return;
  o.x+=(pr.x-o.x)*k;o.y+=(pr.y-o.y)*k;o.fx=pr.f||1;o.moving=!!pr.mv;o.wt=pr.wt||0;o.anim=pr.an?.1:0;o.animA=pr.aa||0;o.inv=pr.iv?.2:0;o.dash=pr.dh?.15:0;o.flash=pr.fl?.1:0;
  o.hp=pr.hp||0;o.maxhp=pr.mh||100;o.lv=pr.lv||1;o.dn=!!pr.dn;o.down=o.dn;o.rvp=pr.rv||0;o.atk=o.anim;o.recoil=0;
  const f=v=>v>=0?{rar:v}:null;
  NET.peq={weapon:{type:pr.wp||'sword',rar:pr.wr|0,ranged:!!pr.rg,arc:pr.wa||90,rng:pr.wg||20},helm:f(pr.hr),chest:f(pr.cr),boots:f(pr.br),gloves:f(pr.gr),amulet:f(pr.ar)}}
function netTick(dt){
  if(!NET.on||!NET.room||!G)return;const rm=NET.room;
  if(NET.role==='host')NET.live=state!=='title'&&state!=='cine'&&state!=='end';
  if(NET.p2p&&!rm.connected()){NET.pdead=(NET.pdead||0)+dt;if(NET.pdead>3){toast('انقطع الاتصال المباشر','#ff8a7a',true);const g=NET.role==='guest';NET.pdead=0;NET.p2p=false;if(g)netLeaveToMenu();else netClose()}return}else NET.pdead=0;
  const ps=rm.peers(),pt=ps.find(p=>!p.sameTab&&p.kind==='viewer')||null;
  if(pt&&pt.presence&&pt.presence.nm)NET.pl.nm=pt.presence.nm;
  const live=pt&&pt.presence&&pt.presence.a;
  if(pt&&NET.role==='host'&&live&&!NET.pt0){NET.pt0=pt;onPartnerSeen()}
  else if(pt&&NET.role==='guest'&&live&&!NET.pt0){NET.pt0=pt;onPartnerSeen()}
  else if(!pt&&NET.pt0){NET.pt0=null;onPartnerGone()}
  if(pt&&pt.presence)readPartner(pt.presence,dt);
  NET.acc.p+=dt;if(NET.acc.p>.085){NET.acc.p=0;sendPresence()}
  /* guest: ask to join until welcomed */
  if(NET.role==='guest'&&!NET.welcomed){NET.acc.j+=dt;if(NET.acc.j>1.6){NET.acc.j=0;if(pt)emitM({t:'join',nm:NET.name});else netStatus('نبحث عن الغرفة '+NET.code+'… تأكد أن المضيف فتحها',false)}}
  if(NET.role==='host'&&NET.live&&NET.pt0){NET.acc.s+=dt;if(NET.acc.s>.125){NET.acc.s=0;sendSnap()}}
  if(NET.role==='guest'&&NET.live&&NET.hits.length){NET.acc.h+=dt;if(NET.acc.h>.07){NET.acc.h=0;emitM({t:'hit',a:NET.hits.splice(0,20)})}}
  NET.pl.invT=Math.max(0,NET.pl.invT-dt);
  NET.pings=NET.pings.filter(p=>G.time-p.t<6);
  NET.acc.c+=dt;if(NET.acc.c>.2){NET.acc.c=0;uiParty()}}
/* ---------- actions: ping, quick chat, revive, damage ---------- */
function netPing(){
  if(!coopOn()||state==='title')return;
  const x=lastInput==='mouse'&&mouse.on?G.cam.x+mouse.sx:P.x+Math.cos(P.face)*70,y=lastInput==='mouse'&&mouse.on?G.cam.y+mouse.sy:P.y+Math.sin(P.face)*70;
  NET.pings.push({x,y,t:G.time,by:'me'});if(NET.pings.length>4)NET.pings.shift();emitM({t:'ping',x:x|0,y:y|0});tone&&tone(660,.15,'sine',.05,120)}
function netChat(i){if(!coopOn()||!QPH[i])return;NET.bub.me={t:QPH[i],ts:G.time};emitM({t:'em',i});$('#qchat').hidden=true}
function hostHurtGuest(raw){const g=NET.pl;if(g.invT>0||g.dash>0||g.down)return;g.invT=.45;emitM({t:'hurt',d:+raw.toFixed(1)})}
function nearestTarget(o){
  const g=NET.pl;if(!NET.live||!NET.pt0||!g.vis||g.down)return P;
  if(selfDown())return g;
  return Math.hypot(g.x-o.x,g.y-o.y)<Math.hypot(P.x-o.x,P.y-o.y)?g:P}
function hostAiStep(dt){
  const real=P;
  for(const e of G.enemies){if(e.dead)continue;P=nearestTarget(e);try{updateEnemy(e,dt)}finally{P=real}}
}
function hostBossStep(b,dt){const real=P;P=nearestTarget(b);try{updateBoss(b,dt)}finally{P=real}}
function bossWakeNear(){return P.x>(B.aX+3)*T||(NET.live&&NET.pl.vis&&NET.pl.x>(B.aX+3)*T)}
/* revive: hold E near a downed partner */
function reviveTick(dt){
  const g=NET.pl;
  if(coopOn()&&g.vis&&g.dn&&!P.down&&Math.hypot(g.x-P.x,g.y-P.y)<28){
    if(keys.e||tAct||pad.act){P.rvT=(P.rvT||0)+dt;if(P.rvT>=1.5){P.rvT=0;emitM({t:'rev'});toast('أحييت '+(g.nm||'شريكك'),'#7affd0');SFX.potion()}}else P.rvT=0}
  else P.rvT=0;
  if(P.down){P.downT-=dt;if(P.downT<=0||g.dn&&g.vis){P.down=false;netDie()}}}
function netDie(){P.hp=0;state='dead';$('#dead').hidden=false;$('#deadMsg').textContent=G.boss.state!=='sleep'&&!G.boss.dead?`سقطت أمام ${G.boss.D.n}. ارجع أقوى.`:'سقطت في المعركة. غنائمك محفوظة.'}
/* ---------- drawing ---------- */
function drawPartner(){
  const g=NET.pl;if(!g.vis||!NET.peq)return;
  const sx=rp(g.x-cx),sy=rp(g.y-cy);
  if(g.down){ctx.save();ctx.translate(sx,sy);ctx.rotate(1.45);ctx.globalAlpha=.7;ctx.translate(-sx,-sy);const sP=P,sE=eq;P=g;eq=NET.peq;try{drawHero()}finally{P=sP;eq=sE}ctx.restore();
    ctx.strokeStyle='#7affd0';ctx.lineWidth=2;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(sx,sy-4,12+Math.sin(G.time*5)*2,0,7);ctx.stroke();
    if(P.rvT>0){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,sy-4,16,-1.57,-1.57+6.28*Math.min(1,P.rvT/1.5));ctx.stroke()}ctx.globalAlpha=1}
  else{const sP=P,sE=eq;P=g;eq=NET.peq;try{drawHero()}finally{P=sP;eq=sE}}
  const nm=(g.nm||'شريك'),bw=18;
  ctx.fillStyle='#000a';ctx.fillRect(sx-bw/2-1,sy-27,bw+2,4);ctx.fillStyle='#e04a3a';ctx.fillRect(sx-bw/2,sy-26,bw*Math.max(0,g.hp/g.maxhp),2);
  TX(nm,sx,sy-31,'#7affd0',9.5)}
function drawHeroR(){
  if(!P.down){drawHero();return}
  const sx=rp(P.x-cx),sy=rp(P.y-cy);ctx.save();ctx.translate(sx,sy);ctx.rotate(1.45);ctx.globalAlpha=.7;ctx.translate(-sx,-sy);drawHero();ctx.restore();
  ctx.strokeStyle='#ff6b5e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy-4,12+Math.sin(G.time*5)*2,0,7);ctx.stroke()}
function bubble(txt,x,y,col){tctx.font='700 9.5px "Reem Kufi","Tajawal",sans-serif';tctx.textAlign='center';const w=tctx.measureText(txt).width+10,bx=x-w/2,by=y-10;
  tctx.fillStyle='#000d';tctx.beginPath();tctx.roundRect(bx,by,w,13,2);tctx.fill();tctx.strokeStyle=col;tctx.lineWidth=.8;tctx.stroke();tctx.fillStyle='#fff';tctx.fillText(txt,x,by+10)}
function drawNetOverlay(){
  if(!coopOn())return;const g=NET.pl;
  /* chat bubbles */
  if(NET.bub.me&&G.time-NET.bub.me.ts<3.2)bubble(NET.bub.me.t,P.x-cx,P.y-cy-26,'#ffd24a');
  if(g.vis&&NET.bub.pp&&G.time-NET.bub.pp.ts<3.2)bubble(NET.bub.pp.t,g.x-cx,g.y-cy-36,'#7affd0');
  /* pings */
  for(const p of NET.pings){const a=1-(G.time-p.t)/6,x=rp(p.x-cx),y=rp(p.y-cy),pul=Math.sin(G.time*8)*2;
    ctx.save();ctx.globalAlpha=Math.min(1,a*2);const c=p.by==='me'?'#ffd24a':'#7affd0';ctx.fillStyle=c+'55';ctx.fillRect(x-1,y-60,2,60);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,9+pul,4+pul*.4,0,0,7);ctx.stroke();
    ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y-26-pul);ctx.lineTo(x+5,y-32-pul);ctx.lineTo(x,y-38-pul);ctx.lineTo(x-5,y-32-pul);ctx.fill();ctx.restore()
    if(x<6||x>W-6||y<6||y>H-6){const ax=clamp(x,12,W-12),ay=clamp(y,14,H-14);ctx.fillStyle=c;ctx.beginPath();ctx.arc(ax,ay,4,0,7);ctx.fill()}}
  /* offscreen partner arrow */
  if(g.vis){const sx=g.x-cx,sy=g.y-cy;if(sx<4||sx>W-4||sy<4||sy>H-4){
    const ax=clamp(sx,14,W-14),ay=clamp(sy,18,H-14),an=Math.atan2(sy-H/2,sx-W/2);ctx.save();ctx.translate(ax,ay);ctx.rotate(an);ctx.fillStyle='#7affd0';ctx.strokeStyle='#000';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-6);ctx.lineTo(-2,0);ctx.lineTo(-5,6);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
    TX(g.nm||'شريك',ax,ay-10,'#7affd0',9.5)}}
  /* downed vignette */
  if(P.down){ctx.fillStyle=`rgba(120,0,0,${.18+.08*Math.sin(G.time*4)})`;ctx.fillRect(0,0,W,H)}}
/* ---------- DOM ---------- */
function uiParty(){
  const on=coopOn(),g=NET.pl;$('#party').hidden=!on||!g.vis&&!NET.pt0;$('#ctools').hidden=!on;
  if(!on){$('#downbar').hidden=true;return}
  $('#pName').textContent=g.nm||'شريك';$('#pLv').textContent='م '+g.lv;$('#pHp').style.width=Math.max(0,g.hp/g.maxhp*100)+'%';$('#party').classList.toggle('dn',!!g.dn);
  const db=$('#downbar');db.hidden=!P.down&&!(g.vis&&g.dn);
  if(P.down)db.textContent=`طحت! ${g.nm||'شريكك'} يقدر يحييك — ${Math.max(0,Math.ceil(P.downT))} ث`+(g.rvp>0?'  (يحييك الحين…)':'');
  else if(g.vis&&g.dn)db.textContent=`${g.nm||'شريكك'} طاح! اقترب واضغط E مطولاً لإحيائه`}
function uiNet(){
  const on=NET.on;$('#pLeave').hidden=!on;$('#pRestart').hidden=on;$('#pCode').hidden=!on;$('#pCode').textContent=on?`غرفة اللعب الجماعي: ${NET.code}`:'';
  $('#party').hidden=!coopOn();$('#ctools').hidden=!coopOn()}
/* ---------- lobby wiring ---------- */
function showCoop(){
  initAudio();$('#cName').value=NET.name||'';
  const hosting=NET.on&&NET.role==='host';
  $('#cHome').hidden=hosting||NET.on;$('#cHost').hidden=!hosting;
  if(hosting)$('#cCodeBig').textContent=NET.code;
  $('#cNew').hidden=state!=='title';$('#cCont').hidden=state!=='title';$('#cBackGame').hidden=state==='title';
  $('#cGuestWait').hidden=!(NET.on&&NET.role==='guest');
  netStatus('');
  $('#coop').hidden=false}
function nameOk(){const n=($('#cName').value||'').trim().slice(0,14)||('لاعب'+(10+Math.floor(Math.random()*89)));NET.name=n;store.set('ember_name',n);return n}
$('#coopbtn').onclick=showCoop;$('#pCoop').onclick=()=>{$('#pause').hidden=true;showCoop()};
$('#cCreate').onclick=async()=>{nameOk();netStatus('نفتح الغرفة…');const code=netCode();
  if(await netOpen('host',code)){$('#cHome').hidden=true;$('#cHost').hidden=false;$('#cCodeBig').textContent=code;uiNet();netStatus('الغرفة جاهزة. أعطِ صديقك الكود وشاركه رابط اللعبة (بصلاحية مساهم).')}};
$('#cJoin').onclick=async()=>{nameOk();const code=($('#cCode').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4){netStatus('اكتب كود الغرفة (4 خانات)',true);return}
  netStatus('نتصل بالغرفة…');if(await netOpen('guest',code)){$('#cHome').hidden=true;$('#cGuestWait').hidden=false;netStatus('تم الاتصال. ننتظر المضيف…')}};
$('#cCopy').onclick=()=>{const t=NET.code;try{navigator.clipboard.writeText(t).then(()=>netStatus('انسخ الكود: '+t),()=>netStatus('الكود: '+t))}catch(e){netStatus('الكود: '+t)}};
$('#cNew').onclick=()=>{$('#coop').hidden=true;begin()};
$('#cCont').onclick=()=>{$('#coop').hidden=true;$('#contBtn').click()};
const cClose=()=>{$('#coop').hidden=true;if(state==='title'&&NET.on&&!NET.pt0&&NET.role==='guest')netClose();else if(state!=='title')resumeGame&&0};
$('#cBack').onclick=()=>{if(state==='title'&&NET.on&&NET.role==='guest'&&!NET.welcomed)netClose();$('#coop').hidden=true};
$('#cBackGame').onclick=()=>{$('#coop').hidden=true;if(state==='pause')resumeGame()};
$('#cLeaveRoom').onclick=()=>{netClose();$('#cHome').hidden=false;$('#cHost').hidden=true;netStatus('أغلقت الغرفة')};
$('#pLeave').onclick=()=>netLeaveToMenu();
$('#cPing').onclick=netPing;$('#cChat').onclick=()=>{$('#qchat').hidden=!$('#qchat').hidden};
document.querySelectorAll('#qchat button').forEach((b,i)=>b.onclick=()=>netChat(i));
if(!window.RTCPeerConnection&&!netAvail())$('#coopbtn').hidden=true;
