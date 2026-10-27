/* ---------- game state, campaign, combat, loot ---------- */
let lastInput='key',mouse={x:0,y:0,on:false,sx:0,sy:0},padS={x:0,y:0},pad={},G,P,B,eq,bag,CAMP,state='title',dlg=null,keys={},tstick={x:0,y:0},tAct=false,tAtk=false,flags={};
const solidT=(x,y)=>x<0||y<0||x>=MW||y>=MH||SOLID[G.map[y][x]];
function blocked(x,y,r){const x0=Math.floor((x-r)/T),x1=Math.floor((x+r)/T),y0=Math.floor((y-r)/T),y1=Math.floor((y+r)/T);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(solidT(tx,ty))return true;return false}
function move(e,dx,dy){if(!blocked(e.x+dx,e.y,e.r))e.x+=dx;if(!blocked(e.x,e.y+dy,e.r))e.y+=dy}
const DC={imp:'#ff7a2f',jackal:'#c8a470',sandMage:'#e0b060',scarab:'#58b8d8',spider:'#8a52c0',fungus:'#d890d8',wisp:'#7affd0',sapling:'#68c25a',bat:'#6a5a80',golem:'#9aa8c0',shardling:'#58d0ff',mummy:'#e8d8b0',skeleton:'#e8e0cc',scorpion:'#d08a40',wraith:'#a8a0ff',knight:'#8a84a0',cinder:'#ff7a2f',brute:'#ff7a2f',hound:'#ff7a2f'};
const curL=()=>LV[CAMP.ch];
const zoneNow=()=>P.x>B.aX*T?2:clamp(B.zi(Math.floor(P.x/T),Math.floor(P.y/T)),0,2);
const ilvlNow=()=>curL().ilv+zoneNow()+(G.lvl>8?1:0);

/* ---------- campaign ---------- */
function eqStart(){return{weapon:{id:0,kind:'weapon',slot:'weapon',type:'dagger',name:'قبضة اليد',rar:0,ilvl:1,dmg:4,cd:.45,rng:17,arc:90,stats:{},value:1},helm:null,chest:{id:0,kind:'armor',slot:'chest',type:'chest',name:'ثوب قماش',rar:0,ilvl:1,armor:2,stats:{},value:1},gloves:null,boots:null,amulet:null}}
const WOODSW=()=>({id:0,kind:'weapon',slot:'weapon',type:'sword',name:'سيف خشبي',rar:0,ilvl:1,dmg:8,cd:.4,rng:23,arc:100,stats:{},value:1});
function newCampaign(){
  CAMP={seed:(Math.random()*1e6)|0,ch:0,lvl:1,xp:0,gold:0,pots:1,shards:0,found:[0,0,0,0],time:0,kills:0};
  eq=eqStart();bag=[];flags={};uid=1;
  P={x:0,y:0,r:5,hp:100,maxhp:100,face:0,fx:1,atk:0,anim:0,animA:0,inv:0,dash:0,dashCd:0,dx:1,dy:0,moving:false,wt:0,flash:0,potCd:0,regenT:0,z:0};
  loadLevel(0);
}
function hpMult(){return DIFF[settings.diff].hp*(NET.on&&NET.scaled?COOP_F:1)}
function mkEnemy(s){
  const D=ENM[s.type],elite=s.elite||s.mini;
  const hp=D.hp*s.mult*(s.mini?4.5:s.elite?2.4:1)*hpMult();
  return{id:s.id,type:s.type,ai:D.ai,x:s.x,y:s.y,sx:s.x,sy:s.y,r:D.r+(s.mini?4:s.elite?1:0),hp,mhp:hp,sp:D.sp*(s.mini?.9:1),dmg:D.dmg*s.mult*(s.mini?1.3:s.elite?1.4:1),xp:D.xp*s.mult*(s.mini?6:s.elite?2.5:1),mult:s.mult,
    elite:!!elite,mini:!!s.mini,sc:s.mini?1.4:s.elite?1.12:1,t:rr(0,2),cd:rr(0,1),kx:0,ky:0,flash:0,aggro:false,wx:0,wy:0,wt:0,lunge:0,ldx:0,ldy:0,wind:0,dead:false,ph:rr(0,6.28),D}
}
function loadLevel(ch,saved){
  CAMP.ch=ch;B=buildLevel(ch,CAMP.seed);placeStory(B);bakeGround(B);
  const L=B.L;
  /* pre-render every species/variant used on this map */
  const seen=new Set();for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=B.m[y][x],vv=B.v[y][x];if(t===1&&vv>=0)seen.add(vv)}
  seen.forEach(vv=>getSpr(B.sp[vv>>4],vv&15));
  G={map:B.m,sp:B.sp,v:B.v,chests:B.chests.map(c=>Object.assign({},c)),bonfires:B.bonfires.map(b=>Object.assign({},b)),enemies:B.enemies.map(mkEnemy),mini:null,brks:B.brks.map(b=>Object.assign({},b)),drops:[],projs:[],pshots:[],parts:[],texts:[],haz:[],rings:[],
    kills:0,goal:L.goal,gate:false,boss:null,time:0,shake:0,stop:0,cam:{x:0,y:0},flash:0,won:false,ghosts:[],amb:[],lx:0,ly:0,seen:new Uint8Array(MW*MH),resp:0,lvl:CAMP.lvl,xp:CAMP.xp,gold:CAMP.gold,pots:CAMP.pots,found:CAMP.found,dirty:false,intro:false,shopStock:null,
    npcs:[],hasKey:false,q:null,exit:null};
  G.q=mkQuest(B);G.exit=Object.assign({},B.exit);
  G.mini=mkEnemy(B.mini);G.enemies.push(G.mini);
  const bd=BOSSES[L.boss],bh=bd.hp*1.5*hpMult();
  G.boss={type:'boss',id:bd.id,D:bd,x:B.boss.x,y:B.boss.y,sx:B.boss.x,sy:B.boss.y,r:bd.r,hp:bh,mhp:bh,sp:bd.sp,dmg:bd.dmg*1.25,state:'sleep',t:0,n:0,kx:0,ky:0,flash:0,aggro:false,dead:false,mult:1,xp:bd.xp,cd:0,ang:0,rage:false,sc:1};
  const b0=G.bonfires[0];
  P.x=b0.x-26;P.y=b0.y;P.hp=Math.min(P.hp,P.maxhp);G.resp=0;
  if(ch===0)G.npcs.push({kind:'salem',x:b0.x-8,y:b0.y-30});
  G.npcs.push({kind:'merchant',x:b0.x+34,y:b0.y+2});
  G.npcs.push({kind:'quest',x:B.story.npc.x,y:B.story.npc.y});
  recompute();renderMini(B,G);genShop();
  if(saved)applyLevelSave(saved);
  G.cam.x=clamp(P.x-W/2,0,MW*T-W);G.cam.y=clamp(P.y-H/2,0,MH*T-H);
  curMus=L.mus;
  hudObj();
}
function recompute(){
  const s={crit:0,steal:0,aspd:0,hp:0,mspd:0,regen:0,bdmg:0,xp:0,gold:0};let armor=0;
  SLOTS.forEach(k=>{const it=eq[k];if(!it)return;if(it.armor)armor+=it.armor;for(const q in it.stats)s[q]=(s[q]||0)+it.stats[q]});
  P.armor=armor;P.s=s;P.maxhp=100+9*(G.lvl-1)+s.hp;P.hp=Math.min(P.hp,P.maxhp);
  if(typeof drawPortrait==='function')drawPortrait();
}
const xpNeed=()=>20+22*(G.lvl-1)+(G.lvl>10?(G.lvl-10)*12:0);
function gainXp(x){x=Math.round(x*(1+P.s.xp));G.xp+=x;
  while(G.xp>=xpNeed()){G.xp-=xpNeed();G.lvl++;recompute();P.hp=P.maxhp;SFX.level();G.flash=.35;toast(`ارتفع مستواك إلى ${G.lvl}`,'#4fb5a3',true);burst(P.x,P.y,24,'#4fb5a3',90,.8)}}
function syncCamp(){CAMP.lvl=G.lvl;CAMP.xp=G.xp;CAMP.gold=G.gold;CAMP.pots=G.pots;CAMP.found=G.found;CAMP.time+=0}

/* ---------- loot ---------- */
const RW0=[62,29,7.5,1.5];
function rarW(bonus=0){const ch=CAMP.ch;return[Math.max(20,RW0[0]-5*ch-bonus*6),RW0[1]+ch,RW0[2]+1.3*ch+bonus*2.5,RW0[3]+.7*ch+bonus*1.4]}
function rollSlot(bias){const sl=['weapon','helm','chest','gloves','boots','amulet'],w=sl.map(s=>(s==='weapon'?1.1:1)*((bias&&bias[s])||1));let t=w.reduce((a,b)=>a+b,0),q=Math.random()*t;for(let i=0;i<sl.length;i++)if((q-=w[i])<0)return sl[i];return'weapon'}
function genItem(rar,il,bias){const s=rollSlot(bias);return s==='weapon'?makeItem(rar,il,'weapon'):makeItem(rar,il,'armor',s)}
function addDrop(d){const a=rr(0,6.28),s=rr(18,52);G.drops.push(Object.assign({t:0,vx:Math.cos(a)*s,vy:Math.sin(a)*s,z:d.z||6,vz:d.vz||rr(95,150),b:rr(0,6),bounced:0,landed:false,fly:false,ph:rr(0,6.28)},d));
  if(G.drops.length>90){const i=G.drops.findIndex(q=>q.gold&&!q.item);G.drops.splice(i<0?0:i,1)}}
function dropGold(x,y,g){if(g<=0)return;
  if(g<=9)addDrop({x,y,gold:g,sz:0});else if(g<=34){addDrop({x,y,gold:g,sz:1})}else{const n=Math.ceil(g/30);for(let i=0;i<n;i++)addDrop({x,y,gold:Math.round(g/n),sz:i%2?1:2})}}
function dropItem(x,y,rar,bias,il){addDrop({x,y,item:genItem(rar,il||ilvlNow(),bias)})}
function pickup(d){
  G.dirty=true;
  if(d.item){
    const it=d.item;G.found[it.rar]++;
    if(bag.length>=30){G.gold+=it.value;toast(`الحقيبة ممتلئة، بعت ${it.name} بـ ${it.value}`,'#a69784');return}
    bag.push(it);const better=score(it)>score(eq[it.slot])+.01;
    SFX.loot(it.rar);toast(`${it.name}${better?'  ▲ أفضل من ملبوسك':''}`,RCOL[it.rar],it.rar>=2);
    if(better&&!flags.hintBag){flags.hintBag=1;setTimeout(()=>toast('اضغط I لفتح الحقيبة وألبس القطعة الأفضل','#f1e7d6'),700)}
    if(it.rar===3){G.flash=.45;G.shake=4}
    burst(P.x,P.y-6,it.rar*4+4,RCOL[it.rar],60,.5);updBadge();
  }else if(d.key){G.hasKey=true;SFX.shard&&SFX.shard();G.flash=.3;toast('أخذت مفتاح البوابة! اذهب للباب في آخر العرين','#ffd24a',true);burst(P.x,P.y-8,20,'#ffd24a',70,.7);hudObj();saveGame(true)}
  else if(d.pot){G.pots++;SFX.potion();toast('جرعة شفاء +1','#ff6b6b')}
  else if(d.gold){G.gold+=d.gold;SFX.coin();floatText(P.x,P.y-16,'+'+d.gold,'#e8b64a')}
}
function lootLanded(d){
  if(!d.item)return;const r=d.item.rar;
  SFX.land&&SFX.land();
  if(r>=1)G.rings.push({x:d.x,y:d.y,t:0,life:.7,c:RCOL[r],r0:4,r1:14+r*8});
  if(r>=2){burst(d.x,d.y-4,10+r*4,RCOL[r],70+r*20,.7);G.shake=Math.max(G.shake,r===3?5:2)}
  if(r===3){G.flash=Math.max(G.flash,.3);SFX.shard&&SFX.shard()}
}

/* ---------- effects ---------- */
function floatText(x,y,txt,c){if(settings.dmg)G.texts.push({x,y,txt,c,t:0})}
function burst(x,y,n,c,sp=60,life=.5){for(let i=0;i<n;i++){const a=rr(0,6.28),s=rr(sp*.3,sp);G.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,life:rr(life*.6,life),c,s:rr(1,2.5)})}}
function debris(x,y,cols,n=10){for(let i=0;i<n;i++){const a=rr(0,6.28),s=rr(25,80);G.parts.push({x,y:y-4,vx:Math.cos(a)*s,vy:Math.sin(a)*s-35,g:260,t:0,life:rr(.4,.8),c:pick(cols),s:rr(1.5,3)})}}
function shoot(x,y,ang,sp,dmg,c='#ff7a2f',r=3,k=0){G.projs.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,dmg,c,r,life:3.4,k,a:ang})}
function hazard(x,y,r,dur,dmg,kind){G.haz.push({x,y,r,t:0,dur,dmg,kind:kind||'slam'})}
function hurtPlayer(raw){
  if(P===NET.pl){hostHurtGuest(raw);return}
  if(P.dash>0&&state==='play'&&!(P.pdCd>0)){P.pdCd=.9;P.pdT=4;floatText(P.x,P.y-22,'إفلات!','#7affd0');burst(P.x,P.y,12,'#7affd0',80,.5);G.flash=Math.max(G.flash,.06)}
  if(P.inv>0||P.dash>0||state!=='play')return;
  const dmg=Math.max(1,raw*DIFF[settings.diff].dmg*(1-P.armor/(P.armor+45+CAMP.ch*10)));
  P.hp-=dmg;P.inv=.45;P.flash=.15;G.shake=3;SFX.hurt();
  floatText(P.x,P.y-12,Math.round(dmg),'#ff6b5e');burst(P.x,P.y,8,'#d8392f');
  if(P.hp<=0){P.hp=0;if(coopOn()&&!P.down&&!(NET.pl.vis&&NET.pl.dn)){P.down=true;P.downT=30;P.rvT=0;toast('طحت! شريكك يقدر يحييك','#ff6b5e',true);G.shake=5}else netDie()}
}
const allEnemies=()=>G.boss&&!G.boss.dead?G.enemies.concat([G.boss]):G.enemies;
function playerAttack(){
  const w=eq.weapon,cd=w.cd/(1+P.s.aspd);P.atk=cd;P.anim=.16;
  let best=null,bd=w.rng+22;
  for(const e of allEnemies()){if(e.dead||e.state==='sleep')continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd){bd=d;best=e}}
  if(lastInput==='mouse'&&mouse.on)P.face=Math.atan2(G.cam.y+mouse.sy-P.y,G.cam.x+mouse.sx-P.x);
  else if(best)P.face=Math.atan2(best.y-P.y,best.x-P.x);
  if(Math.cos(P.face)!==0)P.fx=Math.cos(P.face)>0?1:-1;
  P.animA=P.face;
  if(w.ranged){fireRanged(w);return}
  SFX.swing();move(P,Math.cos(P.face)*3,Math.sin(P.face)*3);
  let hit=false,critHit=false;
  const arcOK=(e)=>{const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy);if(d>w.rng+e.r)return false;return Math.abs(wrapA(Math.atan2(dy,dx)-P.face))<=w.arc/2*Math.PI/180+Math.atan2(e.r,Math.max(d,1))};
  for(const e of allEnemies()){
    if(e.dead||e.state==='sleep'||!arcOK(e))continue;
    let dmg=w.dmg*(1+.06*(G.lvl-1))*(1+P.s.bdmg)*rr(.9,1.1);
    const crit=Math.random()<.05+P.s.crit;if(crit){dmg*=1.8;critHit=true}
    hitEnemy(e,dmg,crit,Math.atan2(e.y-P.y,e.x-P.x));hit=true;
  }
  for(const k of G.brks){if(k.dead)continue;const dx=k.x-P.x,dy=k.y-P.y,d=Math.hypot(dx,dy);if(d>w.rng+6)continue;if(Math.abs(wrapA(Math.atan2(dy,dx)-P.face))>w.arc/2*Math.PI/180+.5)continue;hitBrk(k);hit=true}
  if(hit){G.stop=critHit?.075:.035;if(critHit)G.shake=Math.max(G.shake,2.5)}
}
/* ranged weapons + skill */
function fireRanged(w){
  let ang=P.face;
  if(lastInput==='mouse'&&mouse.on)ang=Math.atan2(G.cam.y+mouse.sy-P.y,G.cam.x+mouse.sx-P.x);
  else{let bd=w.rng+30,best=null;for(const e of allEnemies()){if(e.dead||e.state==='sleep')continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd){bd=d;best=e}}if(best)ang=Math.atan2(best.y-P.y,best.x-P.x);else ang=P.moving?P.face:(P.fx>0?0:Math.PI)}
  P.face=ang;P.animA=ang;if(Math.cos(ang)!==0)P.fx=Math.cos(ang)>0?1:-1;
  const n=w.rar>=3?3:w.rar>=2?2:1,magic=!!w.magic;
  for(let i=0;i<n;i++){const a=ang+(i-(n-1)/2)*.16;
    let dmg=w.dmg*(1+.06*(G.lvl-1))*(1+P.s.bdmg)*rr(.9,1.1)*(n>1?.75:1);
    const crit=Math.random()<.05+P.s.crit;if(crit)dmg*=1.8;
    G.pshots.push({x:P.x+Math.cos(a)*8,y:P.y-2+Math.sin(a)*8,vx:Math.cos(a)*(magic?190:270),vy:Math.sin(a)*(magic?190:270),dmg,crit,magic,a,life:w.rng/(magic?190:270)+.1,c:RCOL[w.rar]||'#e8e0cc',pierce:!magic&&w.rar>=3,hit:[]})}
  magic?(tone(260,.2,'sine',.05,300),tone(520,.15,'triangle',.03,-100,.05)):SFX.swing();
  P.recoil=.08;
}
function updatePshots(dt){
  for(let i=G.pshots.length-1;i>=0;i--){const p=G.pshots[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(Math.random()<.6)G.parts.push({x:p.x,y:p.y,vx:rr(-6,6),vy:rr(-6,6),t:0,life:.25,c:p.c,s:p.magic?2:1});
    let dead=p.life<=0||solidT(Math.floor(p.x/T),Math.floor(p.y/T));
    if(!dead){for(const e of allEnemies()){if(e.dead||e.state==='sleep'||p.hit.includes(e))continue;if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+3){p.hit.push(e);hitEnemy(e,p.dmg,p.crit,p.a);G.stop=Math.max(G.stop,.02);
        if(p.magic){burst(p.x,p.y,12,p.c,80,.4);G.rings.push({x:p.x,y:p.y,t:0,life:.35,c:p.c,r0:4,r1:24});for(const o of allEnemies()){if(o.dead||o===e||o.state==='sleep')continue;if(Math.hypot(o.x-p.x,o.y-p.y)<26)hitEnemy(o,p.dmg*.6,false,Math.atan2(o.y-p.y,o.x-p.x))}}
        if(!p.pierce){dead=true;break}}}}
    if(!dead)for(const k of G.brks){if(!k.dead&&Math.hypot(k.x-p.x,k.y-p.y)<9){hitBrk(k);dead=true;break}}
    if(dead){if(!p.magic)burst(p.x,p.y,3,'#d8c8a0',30,.2);G.pshots.splice(i,1)}}
}
const SKILL_CD=8;
function useSkill(){
  if(state!=='play'||P.skillCd>0||P.dash>0)return;
  P.skillCd=SKILL_CD;P.anim=.2;P.inv=Math.max(P.inv,.25);SFX.boom();G.shake=4;
  G.rings.push({x:P.x,y:P.y,t:0,life:.5,c:'#ffb067',r0:6,r1:66},{x:P.x,y:P.y,t:0,life:.7,c:'#ffe27a',r0:2,r1:50});burst(P.x,P.y,28,'#ffb067',120,.6);
  const base=eq.weapon.dmg*(1+.06*(G.lvl-1))*(1+P.s.bdmg)*2.4;
  for(const e of allEnemies()){if(e.dead||e.state==='sleep')continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<66+e.r){const a=Math.atan2(e.y-P.y,e.x-P.x);hitEnemy(e,base*rr(.9,1.1),false,a);if(e.type!=='boss'){e.kx=Math.cos(a)*260;e.ky=Math.sin(a)*260;e.stun=.7;e.wind=0}}}
  for(let i=G.projs.length-1;i>=0;i--)if(Math.hypot(G.projs[i].x-P.x,G.projs[i].y-P.y)<70){burst(G.projs[i].x,G.projs[i].y,3,G.projs[i].c,30,.3);G.projs.splice(i,1)}
  for(const k of G.brks)if(!k.dead&&Math.hypot(k.x-P.x,k.y-P.y)<60)hitBrk(k);
}
function hitBrk(k){
  k.hp--;k.flash=.12;SFX.hit();if(k.hp>0){burst(k.x,k.y-4,4,'#c8a878',40,.3);return}
  k.dead=true;G.dirty=true;SFX.brk();
  const cols={jar:['#a8643a','#6a3a22','#d89a62'],crate:['#8a6338','#6b4a2b','#b07a40'],pod:['#35923f','#68c25a','#1f5a2e'],ore:['#6a6878','#3a3844','#e8c04a'],urn:['#3e5e86','#2a3e5a','#e8c04a']}[k.kind];
  debris(k.x,k.y,cols,12);
  const r=Math.random();
  if(r<.58)dropGold(k.x,k.y,Math.round(rr(2,6)*(1+CAMP.ch*.6)*(1+P.s.gold)));
  if(r>.96)addDrop({x:k.x,y:k.y,pot:1});
  if(r<.05)dropItem(k.x,k.y,rollRar(rarW(0)),null);
}
function hitEnemy(e,dmg,crit,ang){
  if(P.pdT>0&&!(NET.on&&NET.role==='guest'&&NET.live)){dmg*=1.4}
  if(NET.on&&NET.role==='guest'&&NET.live){
    e.hp=Math.max(1,e.hp-dmg);e.flash=.1;floatText(e.x,e.y-e.r-6,Math.round(dmg),crit?'#ffd24a':'#fff');burst(e.x,e.y,crit?9:5,crit?'#ffd24a':'#ffb067',70,.35);crit?SFX.crit():SFX.hit();
    if(P.s.steal>0)P.hp=Math.min(P.maxhp,P.hp+dmg*P.s.steal);NET.hits.push([e.type==='boss'?-1:e.id,Math.round(dmg),crit?1:0,Math.round(ang*100)]);return}
  e.hp-=dmg;e.flash=.1;e.aggro=true;
  if(e.type!=='boss'){const kb=e.mini?60:e.D.ai==='slam'?70:140;e.kx=Math.cos(ang)*kb;e.ky=Math.sin(ang)*kb;e.wind=0;if(e.slamT)e.slamT=0}
  floatText(e.x,e.y-e.r-6,Math.round(dmg),crit?'#ffd24a':'#fff');
  burst(e.x,e.y,crit?9:5,crit?'#ffd24a':'#ffb067',70,.35);
  crit?SFX.crit():SFX.hit();
  if(P.s.steal>0&&!NET.fromGuest)P.hp=Math.min(P.maxhp,P.hp+dmg*P.s.steal);
  if(e.hp<=0)killEnemy(e);
}
function killEnemy(e){
  netKillEvent(e);
  e.dead=true;G.dirty=true;SFX.kill();
  const isBoss=e.type==='boss',col=isBoss?e.D.col:(DC[e.type]||'#ff7a2f');
  burst(e.x,e.y,isBoss?70:16,col,100,.7);if(!isBoss)debris(e.x,e.y,[col,'#2a2020',lite(col,-.4)],8);
  gainXp(e.xp);chainKill(e);
  if(isBoss){bossDown();return}
  G.kills+=e.mini?5:1;CAMP.kills++;
  const il=ilvlNow(),D=e.D;
  if(e.mini){dropItem(e.x,e.y,Math.max(2,rollRar(rarW(2))),D.bias,il+1);dropItem(e.x,e.y,Math.max(2,rollRar(rarW(2))),D.bias,il+1);dropItem(e.x,e.y,Math.max(1,rollRar(rarW(1))),null,il);
    dropGold(e.x,e.y,Math.round(rr(30,60)*(1+CAMP.ch*.5)*(1+P.s.gold)));toast(`سقط ${D.n}! غنائم ثمينة`,'#ffb02e',true);G.flash=.25;G.shake=5;SFX.boom()}
  else if(e.elite){dropItem(e.x,e.y,Math.max(1,rollRar(rarW(1))),D.bias,il);dropItem(e.x,e.y,Math.max(1,rollRar(rarW(0))),D.bias,il);toast('وحش نخبة سقط وفلّ لك غنيمة','#ffb02e')}
  else if(Math.random()<(D.ai==='kite'?.42:.3)*(G.storm>0?2:1))dropItem(e.x,e.y,rollRar(rarW(0)),D.bias,il);
  if(Math.random()<.07)addDrop({x:e.x,y:e.y,pot:1});
  dropGold(e.x,e.y,Math.round(rr(2,6)*(G.storm>0?2:1)*e.mult*(D.gold||1)*(e.mini?3:1)*(1+P.s.gold)));
  if(G.kills>=G.goal&&!G.gate)openGate();
  hudObj();
}
function openGate(){
  G.gate=true;for(let y=B.acy-2;y<=B.acy+1;y++)G.map[y][B.aX]=4;G.shake=6;SFX.door();hudObj();renderMini(B,G);
  say([['الراوي','انكسر الختم، والبوابة الشرقية انفتحت وطلع منها هواء ثقيل.'],['الراوي',`${BOSSES[curL().boss].n} ينتظرك بالداخل. اذهب لنار المعسكر قبل البوابة، وجهز نفسك.`]]);
}
function bossDown(){
  G.won=true;G.slowT=1.6;G.shake=8;G.flash=.6;SFX.boom();hudObj();
  const b=G.boss,il=ilvlNow()+2,ch=CAMP.ch;
  dropItem(b.x-14,b.y,3,{weapon:2},il);dropItem(b.x+14,b.y,Math.max(2,rollRar(rarW(4))),null,il);dropItem(b.x,b.y+12,2,{amulet:3},il);
  if(ch>=2)dropItem(b.x,b.y-12,Math.max(2,rollRar(rarW(5))),null,il);
  dropGold(b.x,b.y,Math.round(70*(1+ch*.8)*(1+P.s.gold)));addDrop({x:b.x,y:b.y,pot:1});addDrop({x:b.x,y:b.y,pot:1});
  $('#bossbar').hidden=true;
  G.enemies.forEach(e=>{if(!e.dead){e.dead=true;burst(e.x,e.y,8,'#ff7a2f')}});G.projs.length=0;G.haz.length=0;
  CAMP.shards=Math.max(CAMP.shards||0,CAMP.ch+1);syncCamp();
  addDrop({x:b.x,y:b.y+16,key:1,z:16,vz:170,vx:0,vy:20});
  setTimeout(()=>{if(state!=='play')return;const L=curL(),b=G.boss;
    const segs=L.outroCine.map((t,i)=>({d:5.2,t,a:[b.x+(i?60*i:0),b.y-20],b:[b.x+60*(i+1),b.y-30+(i?-10:0)]}));
    const fin=()=>say(L.outro,()=>{toast('المفتاح سقط من الزعيم. خذه وادخل الباب في آخر العرين','#ffd24a',true);hudObj();saveGame(true)});coopOn()?fin():runCine(segs,fin)},2200);
}

/* ---------- enemy AI ---------- */
function updateEnemy(e,dt){
  e.flash-=dt;e.cd-=dt;
  if(e.kx||e.ky){move(e,e.kx*dt,e.ky*dt);e.kx*=.82;e.ky*=.82;if(Math.abs(e.kx)<4)e.kx=0;if(Math.abs(e.ky)<4)e.ky=0}
  const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,D=e.D;
  if(e.stun>0){e.stun-=dt;return}
  if(d<(e.mini?150:125))e.aggro=true;
  if(!e.aggro){
    e.wt-=dt;if(e.wt<=0){e.wt=rr(1,3);const a=rr(0,6.28),on=Math.random()<.5;e.wx=on?Math.cos(a)*10:0;e.wy=on?Math.sin(a)*10:0}
    if(Math.hypot(e.x+e.wx*dt-e.sx,e.y+e.wy*dt-e.sy)<70)move(e,e.wx*dt,e.wy*dt);return}
  const ai=e.ai;
  if(ai==='melee'){
    if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(Math.hypot(P.x-e.x,P.y-e.y)<e.r+P.r+11)hurtPlayer(e.dmg);e.cd=.9;burst(e.x+ux*6,e.y+uy*6,5,'#ffb067',45,.25)}}
    else{move(e,ux*e.sp*dt,uy*e.sp*dt);if(d<e.r+P.r+8&&e.cd<=0){e.wind=e.mini?.34:.26;e.cd=99}}
  }else if(ai==='lunge'){
    if(e.lunge>0){e.lunge-=dt;move(e,e.ldx*135*dt,e.ldy*135*dt)}
    else{e.t-=dt;const ca=Math.atan2(dy,dx)+1.2*(e.t>0?1:-1);
      move(e,Math.cos(ca)*e.sp*.35*dt+ux*e.sp*.5*dt,Math.sin(ca)*e.sp*.35*dt+uy*e.sp*.5*dt);
      if(e.t<-1.1||(e.t<0&&d<70)){e.t=rr(.8,1.4);if(d<150){e.lunge=.32;e.ldx=ux;e.ldy=uy}}}
    if(d<e.r+P.r+3&&e.cd<=0){hurtPlayer(e.dmg);e.cd=.8}
  }else if(ai==='kite'||ai==='archer'){
    const near=ai==='archer'?95:72,far=ai==='archer'?130:105;
    if(d<near)move(e,-ux*e.sp*dt,-uy*e.sp*dt);else if(d>far)move(e,ux*e.sp*dt,uy*e.sp*dt);else{e.ph+=dt;move(e,-uy*e.sp*.5*dt*Math.sign(Math.sin(e.ph*.7)),ux*e.sp*.5*dt*Math.sign(Math.sin(e.ph*.7)))}
    e.t-=dt;if(e.t<=0&&d<175){e.t=ai==='archer'?rr(1.2,1.8):rr(1.5,2.1);const a=Math.atan2(dy,dx),n=D.fan||1;
      for(let i=0;i<n;i++)shoot(e.x,e.y,a+(i-(n-1)/2)*.24,ai==='archer'?125:78,e.dmg,D.pc||'#c477ff',ai==='archer'?2:3,ai==='archer'?1:0);e.flash=.04;SFX.warn&&SFX.warn()}
    if(d<e.r+P.r+2&&e.cd<=0){hurtPlayer(e.dmg*.6);e.cd=1}
  }else if(ai==='swarm'){
    if(e.lunge>0){e.lunge-=dt;move(e,e.ldx*150*dt,e.ldy*150*dt)}
    else{e.ph+=dt*3;const tx=P.x+Math.cos(e.ph+e.id)*38,ty=P.y+Math.sin(e.ph*1.3+e.id)*30;const ax=tx-e.x,ay=ty-e.y,al=Math.hypot(ax,ay)||1;move(e,ax/al*e.sp*dt,ay/al*e.sp*dt);
      e.t-=dt;if(e.t<=0){e.t=rr(1.5,2.5);e.lunge=.3;e.ldx=ux;e.ldy=uy}}
    if(d<e.r+P.r+2&&e.cd<=0){hurtPlayer(e.dmg);e.cd=.9}
  }else if(ai==='slam'){
    if(e.slamT>0){e.slamT-=dt}
    else{if(d>e.r+P.r+14)move(e,ux*e.sp*dt,uy*e.sp*dt);
      if(d<e.r+P.r+30&&e.cd<=0){e.slamT=.7;e.cd=2.4;hazard(P.x,P.y,e.mini?30:26,.7,e.dmg,'slam')}}
    if(d<e.r+P.r+1&&e.cd<=0&&!e.slamT){hurtPlayer(e.dmg*.7);e.cd=1}
  }
}
/* ---------- bosses ---------- */
function bossAct(b,a,rage,dx,dy){
  const D=b.D;
  switch(a){
   case'charge':b.state='charge';b.t=rage?.6:.85;b.fired=0;break;
   case'ring':b.state='ring';b.t=.6;break;
   case'shots':b.state='shots';b.t=.35;break;
   case'summon':b.state='summon';b.t=.7;break;
   case'slam':b.state='slamw';b.t=.35;break;
   case'rain':b.state='rainw';b.t=.5;break;
   case'spiral':b.state='spiral';b.t=2.2;b.fired=0;b.sa=rr(0,6.28);break;
  }
}
function updateBoss(b,dt){
  b.flash-=dt;b.t-=dt;b.cd-=dt;
  const D=b.D,dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,rage=b.hp<b.mhp*.5;
  if(b.state==='sleep')return;
  if(rage&&!b.rage){b.rage=true;G.shake=7;SFX.roar&&SFX.roar();G.flash=.25;toast(`${D.n} غضب!`,'#ff5a3a',true);burst(b.x,b.y,30,D.col,100,.8)}
  const rm=rage?.72:1;
  if(b.state==='idle'){
    if(b.sp>0&&d>46)move(b,ux*b.sp*(rage?1.35:1)*dt,uy*b.sp*(rage?1.35:1)*dt);
    if(d<b.r+P.r+2&&b.cd<=0){hurtPlayer(b.dmg*1.2);b.cd=1}
    if(b.t<=0){b.n++;let a=D.atk[b.n%D.atk.length];
      if(a==='summon'&&G.enemies.filter(e=>!e.dead&&e.summoned).length>=(rage?5:3))a='shots';
      b.ang=Math.atan2(dy,dx);bossAct(b,a,rage,dx,dy);b.t*=rm}
  }else if(b.state==='charge'){
    if(b.t>.22)b.ang=Math.atan2(dy,dx);
    if(b.t<=0){b.state='dash';b.t=.5;b.hit=false;SFX.dash()}
  }else if(b.state==='dash'){
    move(b,Math.cos(b.ang)*200*dt,Math.sin(b.ang)*200*dt);
    if(!b.hit&&d<b.r+P.r+2){b.hit=true;hurtPlayer(b.dmg*1.8)}
    if(b.t<=0){b.state='idle';b.t=(rage?.7:1.1)}
  }else if(b.state==='ring'){
    if(b.t<=0){const n=rage?22:15,o=rr(0,6.28);for(let i=0;i<n;i++)shoot(b.x,b.y,o+i*6.283/n,72,b.dmg*.9,D.col,3.5);SFX.boom();
      if(rage)setTimeout(()=>{if(state==='play'&&!b.dead)for(let i=0;i<n;i++)shoot(b.x,b.y,o+(i+.5)*6.283/n,60,b.dmg*.9,D.col,3.5)},380);
      b.state='idle';b.t=rage?.8:1.2}
  }else if(b.state==='shots'){
    if(b.t<=0){const a=Math.atan2(dy,dx),n=rage?5:3;for(let i=0;i<n;i++)shoot(b.x,b.y,a+(i-(n-1)/2)*.2,108,b.dmg,D.col,3);b.state='idle';b.t=rage?.6:1}
  }else if(b.state==='summon'){
    if(b.t<=0){const n=rage?3:2;for(let i=0;i<n;i++){const a=rr(0,6.28),x=b.x+Math.cos(a)*34,y=b.y+Math.sin(a)*34;
      if(!blocked(x,y,7)){const e=mkEnemy({id:-1,type:D.sum,x,y,mult:1.5+CAMP.ch*.35});e.summoned=true;e.aggro=true;G.enemies.push(e)}}burst(b.x,b.y,16,D.col);SFX.roar&&SFX.roar();
      b.state='idle';b.t=1.3}
  }else if(b.state==='slamw'){
    if(b.t<=0){const n=rage?3:1;for(let i=0;i<n;i++){const a=rr(0,6.28),o=i?rr(26,46):0;hazard(P.x+Math.cos(a)*o,P.y+Math.sin(a)*o,i?26:32,.8,b.dmg*1.5,'slam')}b.state='idle';b.t=rage?1.2:1.6}
  }else if(b.state==='rainw'){
    if(b.t<=0){const n=rage?9:6;for(let i=0;i<n;i++){const a=rr(0,6.28),o=i?rr(10,70):0;const h=hazard(P.x+Math.cos(a)*o,P.y+Math.sin(a)*o,15,.9,b.dmg,'rain');G.haz[G.haz.length-1].t=-i*.16}b.state='idle';b.t=1.6}
  }else if(b.state==='spiral'){
    b.sa+=dt*2.2;b.fired-=dt;if(b.fired<=0){b.fired=rage?.07:.1;const arms=rage?3:2;for(let i=0;i<arms;i++)shoot(b.x,b.y,b.sa+i*6.283/arms,70,b.dmg*.8,D.col,3)}
    if(b.t<=0){b.state='idle';b.t=1}
  }
}
function updateHazards(dt){
  for(let i=G.haz.length-1;i>=0;i--){const h=G.haz[i];h.t+=dt;
    if(NET.role==='guest'){if(h.t>=h.dur+.3)G.haz.splice(i,1);continue}
    if(h.t>=h.dur){
      if(Math.hypot(P.x-h.x,P.y-h.y)<h.r+P.r*.5)hurtPlayer(h.dmg);
      if(NET.on&&NET.role==='host'&&NET.live&&NET.pl.vis&&Math.hypot(NET.pl.x-h.x,NET.pl.y-h.y)<h.r+NET.pl.r*.5)hostHurtGuest(h.dmg);
      burst(h.x,h.y,h.kind==='rain'?10:18,h.kind==='rain'?(G.boss.D.col):'#e8d8b0',h.kind==='rain'?60:90,.5);G.rings.push({x:h.x,y:h.y,t:0,life:.45,c:'#ffffff',r0:h.r*.6,r1:h.r*1.5});G.shake=Math.max(G.shake,h.kind==='rain'?1.5:3.5);SFX.boom();G.haz.splice(i,1)}}
}
