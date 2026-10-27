/* ---------- story audio: procedural score + soundscape + foley (Web Audio, no files) ---------- */
const SA={n:null,mood:null,tens:0,melT:2,ambT:6,stepT:0,tgt:{}};
const SCALES={ph:[220,233.08,277.18,293.66,329.63,349.23,392,440],maj:[220,246.94,277.18,329.63,369.99,440],dis:[164.81,174.61,185,196,207.65]};
const MOODS={
 road:{ch:[55,82.4,110,164.8],dg:.5,lp:900,wind:.45,mel:[4.2,.55],sc:'ph',sh:.0},
 village:{ch:[55,82.4,98,130.8],dg:.5,lp:760,wind:.5,mel:[5,.45],sc:'ph',sh:.02},
 interior:{ch:[49,73.4,98,116.5],dg:.42,lp:520,wind:.1,mel:[7,.3],sc:'ph',sh:0},
 cave:{ch:[41.2,61.7,87.3,123.5],dg:.6,lp:440,wind:.18,mel:[9,.22],sc:'dis',sh:.05},
 well:{ch:[41.2,61.7,82.4,123.5],dg:.6,lp:640,wind:.14,mel:[6,.4],sc:'ph',sh:.09},
 dawn:{ch:[110,164.8,220,277.2],dg:.5,lp:2600,wind:.14,mel:[3,.55],sc:'maj',sh:.05},
 stars:{ch:[55,82.4,110,164.8],dg:.45,lp:1900,wind:.2,mel:[2.8,.5],sc:'ph',sh:.09},
 desert:{ch:[55,73.4,110,146.8],dg:.5,lp:1100,wind:.7,mel:[4,.5],sc:'ph',sh:.03},
 khan:{ch:[49,73.4,98,123.5],dg:.55,lp:700,wind:.35,mel:[5.5,.4],sc:'dis',sh:.05},
 heart:{ch:[55,82.4,110,130.8],dg:.8,lp:3200,wind:.1,mel:[2.1,.55],sc:'ph',sh:.14}};
const saVol=()=>muted?0:1;
function saStart(){if(!AC||SA.n){return}
  try{const n={};n.out=AC.createGain();n.comp=AC.createDynamicsCompressor();n.comp.threshold.value=-16;n.comp.knee.value=20;n.comp.ratio.value=4;n.comp.attack.value=.008;n.comp.release.value=.3;n.out.connect(n.comp);n.comp.connect(AC.destination);
    const len=AC.sampleRate*3,ir=AC.createBuffer(2,len,AC.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}
    n.conv=AC.createConvolver();n.conv.buffer=ir;n.wet=AC.createGain();n.wet.gain.value=.55;n.conv.connect(n.wet);n.wet.connect(n.out);n.rev=AC.createGain();n.rev.connect(n.conv);
    n.nb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);{const d=n.nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
    n.mus=AC.createGain();n.mus.connect(n.out);const ms=AC.createGain();ms.gain.value=.45;n.mus.connect(ms);ms.connect(n.rev);
    n.sfx=AC.createGain();n.sfx.connect(n.out);const ss=AC.createGain();ss.gain.value=.35;n.sfx.connect(ss);ss.connect(n.rev);
    /* drone */
    n.dl=AC.createBiquadFilter();n.dl.type='lowpass';n.dl.frequency.value=600;n.dg=AC.createGain();n.dg.gain.value=0;n.dl.connect(n.dg);n.dg.connect(n.mus);
    n.dv=[0,1,2,3].map(i=>{const o=AC.createOscillator(),g=AC.createGain();o.type=i%2?'triangle':'sine';o.frequency.value=55*(i+1);g.gain.value=[.5,.35,.25,.15][i];o.connect(g);g.connect(n.dl);o.start();return{o,g}});
    const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.07;lg.gain.value=.12;lfo.connect(lg);lg.connect(n.dg.gain);lfo.start();
    /* tension pair */
    n.tg=AC.createGain();n.tg.gain.value=0;n.tg.connect(n.mus);[55,58.27,110.5].forEach((f,i)=>{const o=AC.createOscillator();o.type=i<2?'sawtooth':'sine';o.frequency.value=f;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=260;o.connect(lp);lp.connect(n.tg);o.start()});
    /* wind */
    n.ws=AC.createBufferSource();n.ws.buffer=n.nb;n.ws.loop=true;n.wf=AC.createBiquadFilter();n.wf.type='bandpass';n.wf.frequency.value=520;n.wf.Q.value=.8;n.wg=AC.createGain();n.wg.gain.value=0;n.ws.connect(n.wf);n.wf.connect(n.wg);n.wg.connect(n.mus);n.ws.start();
    const wl=AC.createOscillator(),wlg=AC.createGain();wl.frequency.value=.11;wlg.gain.value=260;wl.connect(wlg);wlg.connect(n.wf.frequency);wl.start();
    const wl2=AC.createOscillator(),wl2g=AC.createGain();wl2.frequency.value=.17;wl2g.gain.value=.12;wl2.connect(wl2g);wl2g.connect(n.wg.gain);wl2.start();
    /* shimmer */
    n.sg=AC.createGain();n.sg.gain.value=0;n.sg.connect(n.mus);[1760,2349.3,3136].forEach((f,i)=>{const o=AC.createOscillator();o.type='sine';o.frequency.value=f;const t=AC.createGain();t.gain.value=.3;const l=AC.createOscillator(),lgg=AC.createGain();l.frequency.value=.2+i*.13;lgg.gain.value=.3;l.connect(lgg);lgg.connect(t.gain);l.start();o.connect(t);t.connect(n.sg);o.start()});
    SA.n=n;SA.mood=null}catch(e){console.warn('audio',e)}}
function saStop(){const n=SA.n;if(!n)return;try{n.out.gain.setTargetAtTime(0,AC.currentTime,.3);setTimeout(()=>{try{n.dv.forEach(v=>v.o.stop());n.ws.stop();n.out.disconnect()}catch(e){}},900)}catch(e){}SA.n=null}
function saMood(name){const n=SA.n,m=MOODS[name];if(!n||!m)return;SA.mood=name;SA.cur=m;const t=AC.currentTime,tc=1.4;
  n.dv.forEach((v,i)=>v.o.frequency.setTargetAtTime(m.ch[i],t,tc));n.dl.frequency.setTargetAtTime(m.lp,t,tc);
  n.wg.gain.setTargetAtTime(m.wind*.22,t,tc);n.sg.gain.setTargetAtTime(m.sh*.5,t,tc)}
function saScene(){const sc=ST.sc;if(!sc)return;saMood(sc.id==='well'||sc.id==='hall'?'well':sc.id==='desert'?'desert':sc.id==='khan'?'khan':sc.theme==='ext'?'village':sc.theme==='cave'?'cave':'interior')}
/* instruments */
function saPluck(f,vel,dest){const n=SA.n,t=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
  o.type='triangle';o2.type='sawtooth';o.frequency.value=f;o2.frequency.value=f*1.004;const g2=AC.createGain();g2.gain.value=.25;
  lp.type='lowpass';lp.frequency.setValueAtTime(f*7,t);lp.frequency.exponentialRampToValueAtTime(Math.max(300,f*1.4),t+.5);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+2.2);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(lp);lp.connect(dest||n.mus);o.start(t);o2.start(t);o.stop(t+2.3);o2.stop(t+2.3)}
function saBell(f,vel,d,dest){const n=SA.n,t=AC.currentTime;[[1,1],[2.01,.5],[3.02,.28],[4.2,.14]].forEach(([r,a])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f*r;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel*a,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d/r*1.4+.2);o.connect(g);g.connect(dest||n.sfx);o.start(t);o.stop(t+d*1.6+.3)})}
function saNoise(dur,type,f,q,vel,dest,sweepTo,pan){const n=SA.n,t=AC.currentTime,s=AC.createBufferSource();s.buffer=n.nb;s.loop=true;const flt=AC.createBiquadFilter();flt.type=type;flt.frequency.setValueAtTime(f,t);if(sweepTo)flt.frequency.exponentialRampToValueAtTime(sweepTo,t+dur);flt.Q.value=q||1;
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+Math.min(.02,dur*.3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(flt);flt.connect(g);let last=g;if(pan!==undefined&&AC.createStereoPanner){const p=AC.createStereoPanner();p.pan.value=pan;g.connect(p);last=p}last.connect(dest||n.sfx);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
function saTone(f,f2,dur,type,vel,dest,delay){const n=SA.n,t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+Math.min(.02,dur*.2));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest||n.sfx);o.start(t);o.stop(t+dur+.05)}
/* sfx */
function saStep(theme){if(!SA.n)return;const v=.16+Math.random()*.06,p=Math.random()*.4-.2;
  if(theme==='ext')saNoise(.11,'lowpass',620+Math.random()*180,.7,v*1.1,null,260,p);
  else if(theme==='int'){saNoise(.06,'bandpass',300+Math.random()*80,2,v*1.2,null,0,p);saTone(95,60,.09,'sine',v*.8)}
  else{saNoise(.07,'highpass',520,1,v*.8,null,0,p);saTone(150,80,.12,'sine',v*.5)}}
function saDoor(){if(!SA.n)return;const n=SA.n,t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),bp=AC.createBiquadFilter(),v=AC.createOscillator(),vg=AC.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(95,t);o.frequency.linearRampToValueAtTime(150,t+.7);v.frequency.value=7;vg.gain.value=9;v.connect(vg);vg.connect(o.frequency);bp.type='bandpass';bp.frequency.value=480;bp.Q.value=7;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.22,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+.85);o.connect(bp);bp.connect(g);g.connect(n.sfx);o.start(t);v.start(t);o.stop(t+.9);v.stop(t+.9);saTone(110,50,.14,'sine',.3,null,.78);saNoise(.05,'highpass',2500,1,.2,null,0,0,.8)}
function saIgnite(){if(!SA.n)return;saNoise(.55,'bandpass',320,1.2,.4,null,1600);saTone(200,320,.5,'triangle',.07);for(let i=0;i<4;i++)saNoise(.03,'highpass',3500,1,.25,null,0,rr(-.5,.5))}
function saLampOff(){if(!SA.n)return;saTone(190,70,.35,'sine',.18);saNoise(.3,'bandpass',900,1.5,.18,null,200)}
function saPaper(){if(!SA.n)return;for(let i=0;i<4;i++)setTimeout(()=>SA.n&&saNoise(.07,'highpass',2800+Math.random()*1500,1,.2,null,0,rr(-.3,.3)),i*70)}
function saChime(){if(!SA.n)return;[880,1318.5,1760,2637].forEach((f,i)=>setTimeout(()=>SA.n&&saBell(f,.2,1.8),i*90))}
function saKey(){if(!SA.n)return;saBell(1568,.25,1.2);setTimeout(()=>SA.n&&saBell(2093,.2,1),100);saNoise(.08,'highpass',3000,1,.25)}
function saBoom(v){if(!SA.n)return;saTone(70,28,1.3,'sine',.7*(v||1));saNoise(.9,'lowpass',500,.8,.5*(v||1),null,80)}
function saBeat(k){if(!SA.n)return;const v=.35+.5*clamp(k,0,1);saTone(62,38,.16,'sine',v);saTone(52,34,.14,'sine',v*.7,null,.17)}
function saWhisper(){if(!SA.n)return;const p=rr(-.9,.9);saNoise(.55,'bandpass',1100+rr(-200,300),2.2,.5,null,rr(700,1700),p);saNoise(.5,'bandpass',2600,3,.18,null,1800,p);setTimeout(()=>SA.n&&saNoise(.45,'bandpass',900,2,.38,null,1400,p),380)}
function saSwell(d){if(!SA.n)return;const n=SA.n,t=AC.currentTime,s=AC.createBufferSource();s.buffer=n.nb;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(200,t);f.frequency.exponentialRampToValueAtTime(2400,t+d);f.Q.value=1.5;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.7,t+d);g.gain.setValueAtTime(0,t+d+.01);s.connect(f);f.connect(g);g.connect(n.sfx);s.start(t);s.stop(t+d+.05);saTone(40,90,d,'sawtooth',.2);setTimeout(()=>SA.n&&saBoom(.9),d*1000)}
function saJump(){if(!SA.n)return;saNoise(.6,'lowpass',9000,.5,.9,null,300);saTone(1200,70,.7,'sawtooth',.35);saTone(1270,90,.7,'sawtooth',.25);saBoom(1.2)}
function saCaught(){if(!SA.n)return;saBoom(1);saTone(520,60,.9,'sawtooth',.28);saNoise(.7,'bandpass',600,1,.4,null,100)}
function saMusicBox(){if(!SA.n)return;const nt=[784,880,1046.5,880,1318.5,1174.7,1046.5,880,784,659.3];nt.forEach((f,i)=>setTimeout(()=>SA.n&&saBell(f,.16,1.4),600+i*430))}
function saChoir(ch,d,vel){if(!SA.n)return;const n=SA.n,t=AC.currentTime;ch.forEach(f=>{for(let k=0;k<3;k++){const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=f*(1+(k-1)*.004);lp.type='lowpass';lp.frequency.value=1100;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel/3,t+d*.45);g.gain.linearRampToValueAtTime(.0001,t+d);o.connect(lp);lp.connect(g);g.connect(n.mus);o.start(t);o.stop(t+d+.1)}})}
const SA_CINE={road:'road',dawn:'dawn',stars:'stars',heart:'heart'};
function saCineShot(s){if(!SA.n)return;if(s.paint){saMood(SA_CINE[s.paint]);
    if(s.paint==='dawn'&&!s.noChoir)saChoir([220,277.2,329.6,440],6,.5);
    if(s.paint==='stars')saChoir([164.8,220,246.9],6,.3);
    if(s.paint==='heart'){saChoir([110,165,220,330],8,.6);saSwell(5)}}
  else if(s.scene)saMood(s.scene==='well'?'well':'village')}
/* per-frame */
function saTick(dt,moving){const n=SA.n;if(!n)return;const t=AC.currentTime,mv=settings.music*2.4*saVol(),sv=settings.sfx*1.35*saVol();
  n.mus.gain.setTargetAtTime(mv,t,.15);n.sfx.gain.setTargetAtTime(sv,t,.15);
  if(!SA.mood)saScene();const m=SA.cur||MOODS.village;
  n.dg.gain.setTargetAtTime(m.dg*.5,t,.5);
  /* tension from shade distance */
  let tens=0;if(ST.sh&&ST.sh.on){const d=Math.hypot(ST.sh.x-ST.x,ST.sh.y-ST.y);tens=clamp(1-d/170,0,1)}
  if(ST.emOn)tens=EM.tens||0;SA.tens+=(tens-SA.tens)*Math.min(1,dt*2);n.tg.gain.setTargetAtTime(SA.tens*.28,t,.4);
  /* melody */
  SA.melT-=dt;if(SA.melT<=0){SA.melT=m.mel[0]*rr(.7,1.5)*(SA.tens>.4?1.6:1);
    if(state==='story'||ST.cin){const sc=SCALES[SA.tens>.5?'dis':m.sc],cnt=Math.random()<.3?2:1;let i=ri(0,sc.length-1);
      for(let k=0;k<cnt;k++){const f=sc[(i+k*ri(1,2))%sc.length]*(Math.random()<.25?.5:1);setTimeout(()=>SA.n&&saPluck(f,m.mel[1]*.28*(SA.tens>.5?.6:1)),k*rr(260,520))}}}
  /* ambient one-shots */
  SA.ambT-=dt;if(SA.ambT<=0&&state==='story'&&!ST.cin){SA.ambT=rr(6,15);const th=ST.sc.theme,r=Math.random();
    if(th==='ext'){if(r<.4)saNoise(.9,'bandpass',700,3,.1,null,300,rr(-1,1));else if(r<.7)saBell(rr(300,420),.05,3);else saWhisper()}
    else if(th==='int'){if(r<.5){saTone(rr(120,200),rr(70,100),.5,'sawtooth',.05);saNoise(.3,'bandpass',300,6,.1)}else{saTone(75,50,.12,'sine',.4);saTone(70,48,.12,'sine',.3,null,.2)}}
    else{if(r<.6){saBell(rr(900,1400),.08,.5)}else if(r<.8)saNoise(1.2,'lowpass',250,1,.12,null,100);else saWhisper()}}
  /* footsteps */
  if(moving){SA.stepT-=dt;if(SA.stepT<=0){SA.stepT=.34;saStep(ST.sc.theme)}}else SA.stepT=0}
const stAmb=on=>{on?saStart():saStop()};
window.__sa=SA;
