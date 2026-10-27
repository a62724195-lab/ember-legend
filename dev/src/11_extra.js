/* ---------- extras: سلسلة الجمر (kill chain) + عاصفة الجمر (loot storm) + volume shadows ---------- */
function chainKill(e){
  if(e.type==='boss')return;
  G.chain=(G.chain||0)+1;G.chainT=4.5;G.chainMax=Math.max(G.chainMax||0,G.chain);const c=G.chain;
  if(c>=5)gainXp(Math.round(e.xp*Math.min(.5,c*.02)));
  if(c%10===0){const g=Math.round(c*3*(1+CAMP.ch*.4));G.gold+=g;P.hp=Math.min(P.maxhp,P.hp+P.maxhp*.06);
    burst(P.x,P.y,26,'#ffb02e',110,.8);G.flash=Math.max(G.flash,.12);toast(`سلسلة الجمر ×${c}! +${g} ذهب وشفاء`,'#ffb02e',true);try{SFX.boom()}catch(_){}}
}
function extraTick(dt){
  if(state!=='play')return;
  if(P.pdCd>0)P.pdCd-=dt;if(P.pdT>0)P.pdT-=dt;
  if(G.chainT>0){G.chainT-=dt;if(G.chainT<=0)G.chain=0}
  if(NET.on)return;
  if(G.storm>0){G.storm-=dt;const n=(LIGHTQ?10:LOWQ?20:40)*dt;let k=n;while(k>0){if(k>=1||Math.random()<k)G.parts.push({x:G.cam.x+rr(0,W+60),y:G.cam.y-4,vx:rr(-26,-8),vy:rr(30,70),g:40,t:0,life:rr(1.4,2.4),c:Math.random()<.5?'#ff8a3a':'#ffd070',s:rr(1,2.2)});k--}
    if(G.storm<=0)toast('هدأت عاصفة الجمر','#a69784')}
  else{G.evT=(G.evT===undefined?rr(70,110):G.evT)-dt;
    if(G.evT<=0&&!G.boss){G.storm=28;G.evT=rr(120,180);toast('عاصفة جمر! الغنائم مضاعفة لمدة قصيرة','#ff7a2f',true);G.shake=4;try{SFX.boom()}catch(_){}}}
}
function drawExtra(){
  if(P.pdT>0&&state==='play'){ctx.strokeStyle='#7affd0';ctx.globalAlpha=.35+.2*Math.sin(G.time*10);ctx.lineWidth=1;ctx.beginPath();ctx.arc(rp(P.x-cx),rp(P.y-cy-2),12,0,7);ctx.stroke();ctx.globalAlpha=1}
  if(G.storm>0){ctx.fillStyle=`rgba(255,70,10,${.05+.025*Math.sin(G.time*3)})`;ctx.fillRect(0,0,W,H)}
  if(G.chain>=2&&state==='play'){const c=G.chain,a=Math.min(1,G.chainT/1.2);tctx.globalAlpha=a;
    TX('سلسلة الجمر',W-10,H*.42,'#ffd9a0',9.5,'right');TX('×'+c,W-10,H*.42+17,c>=10?'#ffb02e':'#ffffff',17+Math.min(6,c*.15),'right');
    tctx.fillStyle='#000a';tctx.fillRect(W-58,H*.42+21,48,2.5);tctx.fillStyle='#ff9a3a';tctx.fillRect(W-58,H*.42+21,48*Math.max(0,G.chainT/4.5),2.5);tctx.globalAlpha=1}
  if(G.storm>0)TX('عاصفة الجمر '+Math.ceil(G.storm)+'ث',W/2,H-10,'#ff9a5a',9.5)
}
const _sil=new WeakMap();
function silOf(f){let s=_sil.get(f);if(s)return s;s=mkCv(f.width,f.height);const c=s.getContext('2d');c.drawImage(f,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#000';c.fillRect(0,0,f.width,f.height);_sil.set(f,s);return s}
function sunShadow(src,flip,x,y,w,h,al){ /* projected shadow, fixed sun direction (towards lower-left) */
  if(LOWQ)return;const s=silOf(src);ctx.save();ctx.globalAlpha=al||.26;ctx.transform(1,0,flip?.55:-.55,-.3,0,0);ctx.drawImage(s,x,y,w,h);ctx.restore()}
