/* =====================================================================
   النهاية: «أغنية سلمى» — لعبة إيقاع غنائية بمقام الحجاز مع طبلة
   ===================================================================== */
const SG={hy:H-54,on:false,t:0,tt:0,notes:[],perf:0,good:0,miss:0,combo:0,best:0,fx:[],judge:null,meter:.5,press:[0,0,0,0],step:-1,endT:0,total:0,fin:0,ghost:0};
const SG_STEP=60/84/2,SG_LEAD=3.4,SG_APPR=1.7;
const SG_LANE=[{c:'#7ad0ff',f:293.66,l:'A'},{c:'#ffd890',f:311.13,l:'S'},{c:'#ff9a7a',f:369.99,l:'D'},{c:'#c8a0ff',f:440,l:'F'}];
const SG_PH=['0-1-2-1-0---1-0-','2-3-2-1-0---1-2-','0-1-2-3-2-1-0---','3-2-1-0-1-2-3---','01-2-3-2-1-0-1-2','3-3-2-1-2-3-2-1-','0-1-2-3-3-2-1-0-','0-1-2-3-----0---'];
const SG_LY=['يا خان يا بيت الغريب...','افتح لمن ضاع الدرب','نامي يا حلوة... نامي','الليل ما يسرق إلا اللي ما يغنّي','ثلاثين سنة وأنا أنادي...','وما ردّ عليّ إلا الصدى','والحين... سمعتوني','اتركوا لي وجهي... وأنا أسمّي لكم الطريق'];
const SG_TAB=['D','T','-','T','D','-','T','-'];
MOODS.song={ch:[73.4,110,146.8,220],dg:.55,lp:900,wind:.04,mel:[999,0],sc:'ph',sh:.07};
/* ---------- sounds ---------- */
function saVoice(f,d,vel){if(!SA.n)return;const n=SA.n,t=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain();
  o.type='sawtooth';o2.type='sawtooth';o.frequency.setValueAtTime(f*.97,t);o.frequency.linearRampToValueAtTime(f,t+.09);o2.frequency.value=f*1.005;
  const vb=AC.createOscillator(),vbg=AC.createGain();vb.frequency.value=5.3;vbg.gain.value=f*.011;vb.connect(vbg);vbg.connect(o.frequency);vbg.connect(o2.frequency);
  [[700,5,1],[1150,7,.55],[2600,10,.22]].forEach(([fr,q,a])=>{const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=fr;bp.Q.value=q;const bg=AC.createGain();bg.gain.value=a;o.connect(bp);o2.connect(bp);bp.connect(bg);bg.connect(g)});
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+.07);g.gain.setTargetAtTime(.0001,t+d*.7,.14);g.connect(n.mus);
  o.start(t);o2.start(t);vb.start(t);const e=t+d+.8;o.stop(e);o2.stop(e);vb.stop(e)}
const saDum=()=>{if(SA.n){saTone(135,52,.24,'sine',.55);saNoise(.04,'lowpass',400,1,.2)}};
const saTak=()=>{if(SA.n){saNoise(.05,'highpass',3200,1,.2);saTone(950,640,.045,'triangle',.07)}};
/* ---------- control ---------- */
function songStart(){const S=SG;ST.rcOn=false;
  S.notes=[];SG_PH.forEach((p,pi)=>{for(let s=0;s<16;s++){const c=p[s];if(c&&c>='0'&&c<='3')S.notes.push({t:SG_LEAD+(pi*16+s)*SG_STEP,l:+c,j:0,sung:0})}});
  S.hy=H-(matchMedia('(pointer:coarse)').matches?104:54);S.total=S.notes.length;S.t=0;S.tt=0;S.perf=S.good=S.miss=S.combo=S.best=0;S.fx=[];S.judge=null;S.meter=.5;S.press=[0,0,0,0];S.step=-1;S.fin=0;S.endT=SG_LEAD+SG_PH.length*16*SG_STEP+2.4;
  rcInitGfx();ST.songOn=true;S.on=true;document.body.classList.add('song');$('#songPad').hidden=false;$('#prompt').hidden=true;$('#tAct').hidden=true;
  if(SA.n)saMood('song')}
function songLane(c){return({KeyA:0,ArrowLeft:0,KeyS:1,ArrowDown:1,KeyD:2,ArrowUp:2,KeyF:3,ArrowRight:3})[c]??-1}
function songBurst(l,col,n){const x=W/2+(l-1.5)*50;for(let i=0;i<n;i++)SG.fx.push({x,y:SG.hy+2,vx:rr(-40,40),vy:rr(-90,-20),life:0,max:rr(.4,.8),c:col})}
function songPress(l){const S=SG;if(!S.on||S.fin||state!=='story')return;S.press[l]=.18;
  let best=null,bd=.22;for(const n of S.notes){if(n.l!==l||n.j)continue;const d=Math.abs(S.t-n.t);if(d<bd){bd=d;best=n}}
  if(!best){S.meter=Math.max(0,S.meter-.012);if(SA.n)saTone(90,60,.08,'sine',.12);return}
  best.j=bd<.075?1:bd<.15?2:3;best.sung=1;const f=SG_LANE[l].f;
  if(best.j===1){S.perf++;S.combo++;S.meter=Math.min(1,S.meter+.04);S.judge={t:0,txt:'ممتاز',c:'#ffe9a0'};if(SA.n){saVoice(f,.9,.16);saBell(f*2,.07,1.2)}songBurst(l,SG_LANE[l].c,12)}
  else if(best.j===2){S.good++;S.combo++;S.meter=Math.min(1,S.meter+.022);S.judge={t:0,txt:'جيد',c:'#9fe8ff'};if(SA.n)saVoice(f,.8,.12);songBurst(l,SG_LANE[l].c,6)}
  else{S.miss++;S.combo=0;S.meter=Math.max(0,S.meter-.04);S.judge={t:0,txt:'متأخر',c:'#ff9a7a'};if(SA.n)saTone(110,70,.1,'sine',.15)}
  S.best=Math.max(S.best,S.combo)}
/* ---------- frame ---------- */
function songFrame(dt){const S=SG;ST.t+=dt;if(ST.flash>0)ST.flash=Math.max(0,ST.flash-dt*1.6);
  saTick(dt,false);
  if(state==='story'&&!S.fin){S.t+=dt;S.tt+=dt;
    const si=Math.floor(S.t/SG_STEP);while(S.step<si){S.step++;const k=SG_TAB[S.step%8];if(k==='D')saDum();else if(k==='T')saTak();if(S.step%8===0&&SA.n)saPluck(73.42,.14);if(S.step%8===4&&SA.n)saPluck(110,.09);if(S.step%16===0&&SA.n&&S.step>0)saVoice(146.83,2.4,.03)}
    for(const n of S.notes){if(!n.sung&&S.t>=n.t){n.sung=1;if(SA.n)saVoice(SG_LANE[n.l].f,.8,.05)}
      if(!n.j&&S.t-n.t>.16){n.j=4;S.miss++;S.combo=0;S.meter=Math.max(0,S.meter-.035);S.judge={t:0,txt:'فات',c:'#ff7a7a'};if(Math.random()<.5)stWhisper(pick(['غنّي…','اسمعني…']),1)}}
    for(let i=0;i<4;i++)S.press[i]=Math.max(0,S.press[i]-dt);
    if(S.t>=S.endT)songEnd()}
  songDraw(dt)}
function songEnd(){const S=SG;if(S.fin)return;S.fin=1;
  const acc=S.total?(S.perf+S.good*.65)/S.total:0,eff=acc+.05*echoCount(),pct=Math.round(acc*100);
  if(SA.n)saChoir([293.66,440,587.33],4,.25);
  const next=()=>{S.on=false;ST.songOn=false;document.body.classList.remove('song');$('#songPad').hidden=true;
    if(eff>=.85)ch2EndTrue();else if(eff>=.5)ch2EndPartial();else stChoice('الصدى ابتلع الأغنية... وش تسوي؟',[['«نحاول مرة ثانية»',()=>songStart()],['«نكمل بما قدرنا»',ch2EndPartial]])};
  showCard('أداؤك في الأغنية',`${pct}% · ممتاز ${S.perf} · أعلى سلسلة ${S.best}`,3600,next)}
/* ---------- draw ---------- */
function songDraw(dt){const S=SG,hitY=S.hy,top=64,spd=(hitY-top)/SG_APPR;
  ctx.setTransform(SS,0,0,SS,0,0);ctx.imageSmoothingEnabled=false;
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tcv.width,tcv.height);tctx.setTransform(tcv.width/W,0,0,tcv.height/H,0,0);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0620');g.addColorStop(.6,'#1a0f30');g.addColorStop(1,'#2e1a2c');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<7;i++){const x=W*(i+.5)/7;ctx.fillStyle='#110a1e';ctx.fillRect(x-9,18,18,H);ctx.fillStyle='#1c1232';ctx.fillRect(x-9,18,3,H);const fl=.6+.4*Math.sin(S.tt*7+i*2);ctx.fillStyle=`rgba(255,190,100,${.28*fl})`;ctx.beginPath();ctx.arc(x,60,9+3*fl,0,7);ctx.fill();ctx.fillStyle=`rgba(255,220,150,${.8*fl})`;ctx.fillRect(x-1,56,2,6)}
  ctx.save();ctx.globalCompositeOperation='lighter';const hg=ctx.createRadialGradient(W/2,96,6,W/2,96,120+S.meter*80);hg.addColorStop(0,`rgba(255,210,140,${.16+S.meter*.3})`);hg.addColorStop(1,'rgba(255,210,140,0)');ctx.fillStyle=hg;ctx.fillRect(0,0,W,H);ctx.restore();
  /* ghosts fade as the voice grows */
  const gs=RC.spr;if(gs){const ga=clamp(1-S.meter*1.15,0,.6);[[44,196],[W-44,200],[W*.26,178],[W*.74,182]].forEach(([x,y],i)=>{ctx.globalAlpha=ga*(.7+.3*Math.sin(S.tt*2+i));const im=gs.echo[(Math.floor(S.tt*3)+i)%4];ctx.drawImage(im,x-40,y-100+Math.sin(S.tt+i)*3,80,108)});ctx.globalAlpha=1}
  /* Salma */
  const bk=ST.flags.c2_true,ocx=cx,ocy=cy;cx=0;cy=0;ST.flags.c2_true=S.meter>.82;ctx.save();ctx.translate(W/2,138);ctx.scale(1.7,1.7);drawTall2({k:'singer',x:0,y:0,o:{}});ctx.restore();ST.flags.c2_true=bk;cx=ocx;cy=ocy;
  /* lanes */
  for(let i=0;i<4;i++){const x=W/2+(i-1.5)*50,c=SG_LANE[i].c;const lg=ctx.createLinearGradient(0,top,0,hitY);lg.addColorStop(0,c+'00');lg.addColorStop(1,c+(S.press[i]>0?'55':'22'));ctx.fillStyle=lg;ctx.fillRect(x-20,top,40,hitY-top+16);
    ctx.strokeStyle=c;ctx.globalAlpha=.4+S.press[i]*2.5;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,hitY,13,0,7);ctx.stroke();ctx.globalAlpha=1;
    tctx.globalAlpha=.9;TX(SG_LANE[i].l,x,hitY+30,c,11,'center');tctx.globalAlpha=1}
  for(const n of S.notes){if(n.j&&n.j<4)continue;const y=hitY-(n.t-S.t)*spd;if(y<top-12||y>H+10)continue;const x=W/2+(n.l-1.5)*50,c=SG_LANE[n.l].c,a=n.j===4?.35:1;
    ctx.globalAlpha=a;ctx.save();ctx.globalCompositeOperation='lighter';const ng=ctx.createRadialGradient(x,y,2,x,y,18);ng.addColorStop(0,c+'cc');ng.addColorStop(1,c+'00');ctx.fillStyle=ng;ctx.fillRect(x-18,y-18,36,36);ctx.restore();
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();ctx.globalAlpha=1}
  for(const p of S.fx){p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt;ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.fillStyle=p.c;ctx.fillRect(p.x-1,p.y-1,2.5,2.5)}ctx.globalAlpha=1;S.fx=S.fx.filter(p=>p.life<p.max);
  if(Math.random()<dt*10)S.fx.push({x:rr(10,W-10),y:H+4,vx:rr(-8,8),vy:rr(-50,-20),life:0,max:rr(1.4,2.6),c:'#ffd890aa'});
  /* UI text */
  const ph=Math.floor((S.t-SG_LEAD)/(16*SG_STEP));
  if(S.t<SG_LEAD){const k=Math.ceil(SG_LEAD-S.t);if(k<=3)TX(String(k),W/2,H*.5,'#ffe9b8',34,'center')}
  else if(ph>=0&&ph<SG_LY.length&&!S.fin){const inP=(S.t-SG_LEAD)/(16*SG_STEP)-ph;tctx.globalAlpha=Math.min(1,inP*5,(1-inP)*5+.3);TX(SG_LY[ph],W/2,26,'#ffe9b8',13,'center');tctx.globalAlpha=1}
  if(S.combo>=3){TX(S.combo+' ×',W/2,hitY-30-0,'#ffe9a0',16,'center')}
  if(S.judge){S.judge.t+=dt;if(S.judge.t<.6){tctx.globalAlpha=1-S.judge.t/.6;TX(S.judge.txt,W/2,hitY-54-S.judge.t*16,S.judge.c,14,'center');tctx.globalAlpha=1}}
  ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W/2-102,8,204,7);const mg=ctx.createLinearGradient(W/2-100,0,W/2+100,0);mg.addColorStop(0,'#7a4a2a');mg.addColorStop(1,'#ffd890');ctx.fillStyle=mg;ctx.fillRect(W/2-100,10,200*S.meter,3);
  if(ST.flash>0){ctx.globalAlpha=Math.min(1,ST.flash);ctx.fillStyle=ST.flashC||'#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}
/* touch pad */
(function(){const pad=$('#songPad');if(!pad)return;SG_LANE.forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.className='sgb';b.textContent=l.l;b.style.setProperty('--c',l.c);b.addEventListener('pointerdown',e=>{e.preventDefault();songPress(i)});pad.appendChild(b)})})();
Object.assign(window.__st,{songStart,songEnd,SG,rcEnter,RC,rcInteract});
