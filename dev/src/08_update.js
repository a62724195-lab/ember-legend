/* ---------- per-frame update, chests, bonfires, shop, save ---------- */
function openChest(c){
  c.open=true;G.dirty=true;SFX.chest();burst(c.x,c.y-6,18+c.tier*8,['#ffd24a','#58b8ff','#ffe27a','#ff9a3a'][c.tier],80,.6);
  G.rings.push({x:c.x,y:c.y,t:0,life:.6,c:['#ffd24a','#58b8ff','#ffe27a','#ff9a3a'][c.tier],r0:6,r1:30});
  const il=ilvlNow(),t=c.tier,mk=(rar,bias)=>addDrop({x:c.x,y:c.y-4,z:10,vz:rr(120,190),item:genItem(rar,il,bias)});
  if(t===0){mk(1,null);addDrop({x:c.x,y:c.y,pot:1})}
  else if(t===1){mk(1,null);mk(Math.max(1,rollRar(rarW(1))),null)}
  else if(t===2){mk(Math.max(1,rollRar(rarW(3))),{weapon:3});mk(Math.max(1,rollRar(rarW(2))),null);mk(1,null)}
  else{mk(Math.max(2,rollRar(rarW(6))),{weapon:3});mk(Math.max(2,rollRar(rarW(5))),null);mk(Math.max(1,rollRar(rarW(3))),null);if(Math.random()<.4)mk(3,null);G.shake=3}
  dropGold(c.x,c.y,Math.round((8+t*14)*(1+CAMP.ch*.6)*(1+P.s.gold)));
  toast(['صندوق خشبي','صندوق حديدي','صندوق ذهبي','صندوق الجمر!'][t],['#c9a060','#8ab8e8','#ffd24a','#ff7a2f'][t],t>=2);
}
function interactables(){
  const out=[];
  G.bonfires.forEach(b=>{const d=Math.hypot(b.x-P.x,b.y-P.y);if(d<26)out.push({k:'bonfire',o:b,d})});
  G.npcs.forEach(n=>{const d=Math.hypot(n.x-P.x,n.y-P.y);if(d<28)out.push({k:n.kind,o:n,d})});
  if(NET.pl.vis&&NET.pl.dn&&!P.down){const d=Math.hypot(NET.pl.x-P.x,NET.pl.y-P.y);if(d<28)out.push({k:'revive',o:NET.pl,d:d-30})}
  out.sort((a,b)=>a.d-b.d);return out[0]||null;
}
function interact(){
  if(state!=='play'||!P.near)return;const n=P.near;
  if(n.k==='bonfire')restAt(n.o);
  else if(n.k==='merchant'){const k='mer'+CAMP.ch;if(!flags[k]&&MERCH[CAMP.ch]){flags[k]=1;const t=MERCH[CAMP.ch].split(': ');say([[t[0],t[1]]],openShop)}else openShop()}
  else if(n.k==='quest')talkQuest();
  else if(n.k==='salem')say([['العم سالم','اكسر الختم يا ولدي، وخذ حذرك من العقارب.']]);
}
function lightBonfire(b){b.lit=true;G.resp=b.i;SFX.fire&&SFX.fire();G.rings.push({x:b.x,y:b.y,t:0,life:.8,c:'#ffb067',r0:4,r1:40});toast('أشعلت نار المعسكر: نقطة عودتك. اضغط E للاستراحة','#ffb067',true);saveGame(true)}
function restAt(b){
  b.lit=true;G.resp=b.i;P.hp=P.maxhp;if(G.pots<2)G.pots=2;SFX.fire&&SFX.fire();G.rings.push({x:b.x,y:b.y,t:0,life:.8,c:'#ffb067',r0:4,r1:40});
  if(NET.role!=='guest'){const mini=G.enemies.find(e=>e.mini&&!e.dead);G.enemies=B.enemies.map(mkEnemy).filter(e=>!e.mini);if(mini)G.enemies.push(mini)}G.projs.length=0;G.haz.length=0;G.pshots.length=0;
  toast('استرحت عند النار. صحتك كاملة... والوحوش رجعت','#ffb067');burst(b.x,b.y-6,16,'#ffb067',50,.8);syncCamp();saveGame(true);hud();
}
function update(dt){
  G.time+=dt;CAMP.time+=dt;
  let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tstick.x+padS.x;
  let iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+tstick.y+padS.y;
  if(NET.noInput){ix=0;iy=0}if(P.down){ix*=.25;iy*=.25}
  const il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il}
  P.moving=il>.12;
  const spd=62*(1+P.s.mspd);
  if(P.dash>0){P.dash-=dt;move(P,P.dx*190*dt,P.dy*190*dt);G.ghosts.push({x:P.x,y:P.y,t:1})}
  else if(P.moving){move(P,ix*spd*dt,iy*spd*dt);P.dx=ix/il;P.dy=iy/il;P.face=Math.atan2(iy,ix);if(Math.abs(ix)>.1)P.fx=ix>0?1:-1;P.wt+=dt;G.dustT=(G.dustT||0)-dt;
    if(G.dustT<=0){G.dustT=.15;const zn=curL().zones[zoneNow()];G.parts.push({x:P.x-P.dx*3,y:P.y+6,vx:rr(-6,6),vy:rr(-9,-2),t:0,life:.35,c:mix(zn.g.a[0],'#ffffff',.2),s:2})}}
  P.skillCd=(P.skillCd||0)-dt;P.recoil=(P.recoil||0)-dt;P.atk-=dt;P.anim-=dt;P.inv-=dt;P.dashCd-=dt;P.flash-=dt;P.potCd-=dt;
  if((keys[' ']||keys.j||tAtk||pad.atk)&&P.atk<=0&&P.dash<=0&&!NET.noInput&&!P.down)playerAttack();
  if((keys.shift||pad.dash)&&P.dashCd<=0&&P.dash<=0&&!NET.noInput&&!P.down){P.dash=.17;P.dashCd=.75;P.inv=Math.max(P.inv,.2);SFX.dash();
    if(!P.moving){P.dx=Math.cos(P.face);P.dy=Math.sin(P.face)}burst(P.x,P.y+4,6,'#dcc48e',40,.3)}
  if(P.s.regen>0)P.hp=Math.min(P.maxhp,P.hp+P.s.regen*dt);
  /* chests & breakables */
  for(const c of G.chests){if(c.open){c.t+=dt;continue}if(Math.hypot(c.x-P.x,c.y-P.y)<16)openChest(c)}
  for(const k of G.brks)if(k.flash>0)k.flash-=dt;
  /* interaction prompt */
  const nr=interactables();P.near=nr;
  if(nr&&nr.k==='bonfire'&&!nr.o.lit)lightBonfire(nr.o);
  const pr=$('#prompt');
  if(nr&&!(nr.k==='bonfire'&&!nr.o.lit)){const txt=nr.k==='bonfire'?'استراحة':nr.k==='merchant'?'تجارة مع ياقوت':nr.k==='quest'?'كلّم '+curL().q.n:nr.k==='revive'?'اضغط E مطولاً لإحياء '+(NET.pl.nm||'شريكك'):'كلّم العم سالم';if(pr.dataset.t!==txt){pr.dataset.t=txt;$('#promptT').textContent=txt}pr.hidden=false}else pr.hidden=true;
  $('#tAct').hidden=pr.hidden;
  if((tAct||pad.act)&&!P.actHeld){P.actHeld=true;interact()}else if(!(tAct||pad.act))P.actHeld=false;
  questTick();doorTick();extraTick(dt);reviveTick(dt);
  /* drops with bounce physics */
  for(let i=G.drops.length-1;i>=0;i--){const d=G.drops[i];d.t+=dt;
    if(!d.landed){d.vz-=430*dt;d.z+=d.vz*dt;
      const nx=d.x+d.vx*dt,ny=d.y+d.vy*dt;if(!blocked(nx,d.y,2))d.x=nx;else d.vx*=-.4;if(!blocked(d.x,ny,2))d.y=ny;else d.vy*=-.4;
      if(d.z<=0){d.z=0;if(d.vz<-45&&d.bounced<2){d.vz=-d.vz*.46;d.vx*=.6;d.vy*=.6;d.bounced++;if(d.bounced===1)lootLanded(d)}else{d.vz=0;d.landed=true;d.vx=d.vy=0;if(d.bounced===0)lootLanded(d)}}}
    const dd=Math.hypot(d.x-P.x,d.y-P.y);
    if(d.t>.35){const mag=d.gold?36:d.item?20:18;
      if(dd<mag||d.fly){d.fly=true;const k=Math.min(1,dt*(d.gold?9:7));d.x+=(P.x-d.x)*k;d.y+=(P.y-d.y)*k;d.z=Math.max(0,d.z-dt*60);if(Math.hypot(d.x-P.x,d.y-P.y)<6){pickup(d);G.drops.splice(i,1)}}}
  }
  /* enemies */
  if(NET.role==='guest'&&NET.on)guestWorld(dt);else if(NET.on)hostAiStep(dt);else for(const e of G.enemies)if(!e.dead)updateEnemy(e,dt);
  G.enemies=G.enemies.filter(e=>!e.dead);
  const b=G.boss;
  if(!b.dead){
    if(NET.role!=='guest'&&b.state==='sleep'&&bossWakeNear()){b.state='idle';b.t=1.4;b.cd=0;$('#bossbar').hidden=false;$('#bossn').textContent=b.D.n;hudObj();SFX.roar&&SFX.roar();G.shake=4;
      {const D=b.D;if(coopOn()){b.t=1.2;showCard('زعيم الفصل',D.n,2800)}else{runCine([{d:3.4,t:`${D.n}: «${D.intro}»`,a:[P.x,P.y],b:[b.x,b.y-16]}],()=>{b.t=1.2});showCard('زعيم الفصل',D.n,2800)}}}
    if(NET.role!=='guest'){NET.on?hostBossStep(b,dt*1.15):updateBoss(b,dt*1.15)}
  }
  /* projectiles */
  for(let i=G.projs.length-1;i>=0;i--){const p=G.projs[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(Math.random()<.5)G.parts.push({x:p.x,y:p.y,vx:rr(-8,8),vy:rr(-8,8),t:0,life:.25,c:p.c,s:1.5});
    if(p.life<=0||solidT(Math.floor(p.x/T),Math.floor(p.y/T))){G.projs.splice(i,1);continue}
    if(NET.role!=='guest'&&Math.hypot(p.x-P.x,p.y-P.y)<p.r+P.r-1){hurtPlayer(p.dmg);G.projs.splice(i,1)}
    else if(NET.role==='host'&&NET.live&&NET.pl.vis&&!NET.pl.down&&Math.hypot(p.x-NET.pl.x,p.y-NET.pl.y)<p.r+NET.pl.r-1){hostHurtGuest(p.dmg);G.projs.splice(i,1)}}
  updatePshots(dt);updateHazards(dt);
  for(let i=G.rings.length-1;i>=0;i--){G.rings[i].t+=dt;if(G.rings[i].t>G.rings[i].life)G.rings.splice(i,1)}
  for(let i=G.parts.length-1;i>=0;i--){const p=G.parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.g)p.vy+=p.g*dt;p.vx*=.94;if(!p.g)p.vy*=.94;if(p.t>p.life)G.parts.splice(i,1)}
  for(let i=G.texts.length-1;i>=0;i--){const t=G.texts[i];t.t+=dt;t.y-=18*dt;if(t.t>.8)G.texts.splice(i,1)}
  G.shake=Math.max(0,G.shake-dt*14);G.flash=Math.max(0,G.flash-dt);
  for(let i=G.ghosts.length-1;i>=0;i--){G.ghosts[i].t-=dt*4;if(G.ghosts[i].t<=0)G.ghosts.splice(i,1)}
  ambient(dt);reveal();
  /* zone announcements */
  const zi=zoneNow();if(G.zoneShown!==zi){G.zoneShown=zi;toast(curL().zones[zi].nm,'#f1e7d6',true)}
  if(!flags['arena'+CAMP.ch]&&P.x>B.aX*T){flags['arena'+CAMP.ch]=1;toast('عرين '+b.D.n,'#ff7a2f',true)}
  /* camera */
  G.lx+=((P.moving?P.dx*28:0)-G.lx)*Math.min(1,dt*2.5);G.ly+=((P.moving?P.dy*20:0)-G.ly)*Math.min(1,dt*2.5);
  const tx=clamp(P.x+G.lx-W/2,0,MW*T-W),ty=clamp(P.y+G.ly-H/2,0,MH*T-H);
  G.cam.x+=(tx-G.cam.x)*Math.min(1,dt*8);G.cam.y+=(ty-G.cam.y)*Math.min(1,dt*8);
  hud();hudFast();
  if(G.dirty&&(G.saveT=(G.saveT||0)+dt)>2.5){G.saveT=0;G.dirty=false;saveGame()}
}
function reveal(){
  const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T),Rr=9,c=G.mmSeen.getContext('2d');
  for(let dy=-Rr;dy<=Rr;dy++)for(let dx=-Rr;dx<=Rr;dx++){if(dx*dx+dy*dy>Rr*Rr)continue;const x=tx+dx,y=ty+dy;if(x<0||y<0||x>=MW||y>=MH)continue;const i=y*MW+x;if(!G.seen[i]){G.seen[i]=1;c.drawImage(G.mm,x*2,y*2,2,2,x*2,y*2,2,2)}}
}
const AMBP={motes:{c:'#fff4cf',s:1,vx:[5,16],vy:[-3,3],a:.5},fireflies:{c:'#d6f26a',s:2,vx:[-5,5],vy:[-5,5],a:.95,wob:1},spores:{c:'#b8f0ff',s:2,vx:[-4,4],vy:[-14,-5],a:.8,wob:1},embers:{c:'#ff8a3a',s:2,vx:[-6,6],vy:[-20,-8],a:.95,up:20},dust:{c:'#e8dcc0',s:1,vx:[8,22],vy:[-2,4],a:.4},glints:{c:'#ffffff',s:1,vx:[-2,2],vy:[-2,2],a:1,tw:1}};
const ambient=dt=>{
  const A=G.amb;
  if(A.length<(LIGHTQ?8:LOWQ?28:HIQ?150:80)&&Math.random()<dt*30){
    const x=G.cam.x+rr(0,W),y=G.cam.y+rr(0,H),zn=x>B.aX*T?curL().zones[2]:curL().zones[clamp(B.zi(Math.floor(x/T),Math.floor(y/T)),0,2)],p=AMBP[zn.amb]||AMBP.dust;
    A.push({x,y:y+(p.up||0),vx:rr(...p.vx),vy:rr(...p.vy),t:0,life:rr(2.5,5.5),c:zn.amb==='spores'&&Math.random()<.4?'#e8a0ff':p.c,s:p.s,a:p.a,wob:p.wob,tw:p.tw})}
  for(let i=A.length-1;i>=0;i--){const a=A[i];a.t+=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.wob){a.vx+=rr(-30,30)*dt;a.vy+=rr(-30,30)*dt}if(a.t>a.life)A.splice(i,1)}
};
/* ---------- shop ---------- */
function genShop(){
  const il=curL().ilv+1,r=(n)=>Math.round(n);
  const it=(rar,k,slot)=>{const o=k==='weapon'?makeItem(rar,il,'weapon'):makeItem(rar,il,'armor',slot);o.price=r(o.value*(rar===1?2.6:rar===2?3.2:4));return o};
  const slots=['helm','chest','gloves','boots','amulet'];
  G.shopStock={items:[it(1,'weapon'),it(1,'armor',pick(slots)),it(2,'weapon'),it(2,'armor',pick(slots)),it(2,'armor',pick(slots)),it(3,'weapon')].map(o=>{if(o.rar===3)o.price=r(o.price*1.3);return o}),sold:{}};
}
function openShop(){state='card';$('#shop').hidden=false;renderShop()}
function closeShop(){$('#shop').hidden=true;if(state==='card')state='play'}
const potPrice=()=>20+CAMP.ch*8;
function renderShop(){
  const s=G.shopStock;
  $('#shopGold').textContent=G.gold;
  $('#shopGoods').innerHTML=`<div class="goodrow"><div class="gd"><b>جرعة شفاء</b><span class="hint">تشفي 45% من صحتك</span></div><button class="btn" type="button" data-buy="pot1">${potPrice()} ذهب</button></div>
  <div class="goodrow"><div class="gd"><b>ثلاث جرعات</b><span class="hint">وفّر قليل</span></div><button class="btn" type="button" data-buy="pot3">${potPrice()*3-10} ذهب</button></div>`+
  s.items.map((o,i)=>{const sold=s.sold[i],cur=eq[o.slot],better=score(o)>score(cur)+.01;
    const main=o.kind==='weapon'?`ضرر ${o.dmg}`:o.armor?`دفاع ${o.armor}`:'';
    const st=Object.keys(o.stats).map(k=>STATL[k](o.stats[k])).join(' · ');
    return `<div class="goodrow r${o.rar}">${ico(o.type,o.rar)}<div class="gd"><b style="color:${RCOL[o.rar]}">${o.name}</b><span class="hint">${SLOTN[o.slot]} · ${main} ${better?'<span class="up">▲ أفضل من ملبوسك</span>':''}</span><span class="hint">${st}</span></div>
    <button class="btn" type="button" data-buy="${i}" ${sold||G.gold<o.price?'disabled':''}>${sold?'تم الشراء':o.price+' ذهب'}</button></div>`}).join('');
}
function buy(k){
  const s=G.shopStock;
  if(k==='pot1'||k==='pot3'){const n=k==='pot1'?1:3,p=k==='pot1'?potPrice():potPrice()*3-10;if(G.gold<p)return;G.gold-=p;G.pots+=n;SFX.buy();hud();renderShop();return}
  const i=+k,o=s.items[i];if(s.sold[i]||G.gold<o.price)return;
  if(bag.length>=30){toast('الحقيبة ممتلئة','#ff6b5e');return}
  G.gold-=o.price;s.sold[i]=1;bag.push(o);G.found[o.rar]++;SFX.buy();toast('اشتريت '+o.name,RCOL[o.rar]);updBadge();hud();renderShop();G.dirty=true;
}
/* ---------- save v2 ---------- */
function saveGame(force){
  if(!G||NET.role==='guest'||state==='title'||state==='dead'||state==='end'||state==='cine')return;
  syncCamp();
  const bossAwake=G.boss.state!=='sleep'&&!G.boss.dead&&!G.won,rb=G.bonfires[G.resp]||G.bonfires[0];
  store.set('ember_save2',{v:2,camp:CAMP,eq,bag,uid,flags,
    lv:{dead:G.enemies.length?B.enemies.concat([B.mini]).filter(s=>!G.enemies.some(e=>e.id===s.id)).map(s=>s.id):[],chests:G.chests.map(c=>c.open),brks:G.brks.filter(k=>k.dead).map(k=>k.id),bf:G.bonfires.map(b=>b.lit),gate:G.gate,won:G.won,key:G.hasKey,q:{st:G.q.st,got:G.q.got,rg:G.q.relics.map(r=>r.got?1:0),dg:G.q.diary.got?1:0},kills:G.kills,resp:G.resp,seen:Array.prototype.join.call(G.seen,''),
      P:{x:bossAwake?rb.x:P.x,y:bossAwake?rb.y:P.y,hp:P.hp},shop:G.shopStock}});
}
function applyLevelSave(o){
  const lv=o.lv;if(!lv)return;
  const dead=new Set(lv.dead);G.enemies=G.enemies.filter(e=>!dead.has(e.id));G.mini=G.enemies.find(e=>e.mini)||null;
  G.chests.forEach((c,i)=>{c.open=!!lv.chests[i]});
  const bd=new Set(lv.brks);G.brks.forEach(k=>{if(bd.has(k.id))k.dead=true});
  G.bonfires.forEach((b,i)=>{b.lit=!!lv.bf[i]});G.gate=!!lv.gate;G.kills=lv.kills||0;G.resp=lv.resp||0;
  if(G.gate){for(let y=B.acy-2;y<=B.acy+1;y++)G.map[y][B.aX]=4}
  if(lv.seen){for(let i=0;i<G.seen.length;i++)G.seen[i]=lv.seen[i]==='1'?1:0;renderMini(B,G);G.mmSeen.getContext('2d').clearRect(0,0,1e4,1e4);const c=G.mmSeen.getContext('2d');for(let i=0;i<G.seen.length;i++)if(G.seen[i]){const x=i%MW,y=(i/MW)|0;c.drawImage(G.mm,x*2,y*2,2,2,x*2,y*2,2,2)}}
  if(lv.shop)G.shopStock=lv.shop;
  if(lv.q){const q=G.q;q.st=lv.q.st;q.got=lv.q.got;q.relics.forEach((r,i)=>r.got=!!lv.q.rg[i]);q.diary.got=!!lv.q.dg}
  if(lv.won){G.won=true;G.hasKey=!!lv.key;const b=G.boss;b.dead=true;b.hp=0;b.state='dead';$('#bossbar').hidden=true;G.enemies=[];G.mini=null;
    if(!G.hasKey)addDrop({x:b.x,y:b.y+16,key:1,z:0,vz:0,landed:true,bounced:3,vx:0,vy:0})}
  P.x=lv.P.x;P.y=lv.P.y;P.hp=Math.min(lv.P.hp,P.maxhp);
}
function loadGame(){
  const o=store.get('ember_save2');if(!o||o.v!==2)return false;
  try{CAMP=o.camp;eq=o.eq;bag=o.bag;uid=Math.max(uid,o.uid||1);flags=o.flags||{};
    P={x:0,y:0,r:5,hp:100,maxhp:100,face:0,fx:1,atk:0,anim:0,animA:0,inv:0,dash:0,dashCd:0,dx:1,dy:0,moving:false,wt:0,flash:0,potCd:0,regenT:0,z:0};
    G={lvl:CAMP.lvl,xp:0,gold:0,pots:0,found:CAMP.found};
    loadLevel(CAMP.ch,o);return true}
  catch(e){console.error(e);store.del('ember_save2');return false}
}
