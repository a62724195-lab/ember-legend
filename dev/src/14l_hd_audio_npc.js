/* =====================================================================
   جمر الأعماق: أصوات الوحوش + موسيقى تتغيّر مع الخطر + سالم الحارس (شخصية تحكي لك القصة)
   ===================================================================== */
/* ---------- voices ---------- */
function hdVoice(o){const n=SA.n;if(!n)return;const t=AC.currentTime,osc=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter(),pn=AC.createStereoPanner?AC.createStereoPanner():null;
  osc.type=o.type||'sawtooth';osc.frequency.setValueAtTime(o.f0,t);osc.frequency.exponentialRampToValueAtTime(Math.max(20,o.f1||o.f0),t+o.dur);
  if(o.vib){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t);l.stop(t+o.dur+.1)}
  lp.type='lowpass';lp.frequency.value=o.lp||800;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(o.vol,t+(o.att||.04));g.gain.exponentialRampToValueAtTime(.0001,t+o.dur);
  osc.connect(lp);lp.connect(g);let last=g;if(pn){pn.pan.value=clamp(o.pan||0,-1,1);g.connect(pn);last=pn}last.connect(n.sfx);osc.start(t);osc.stop(t+o.dur+.1)}
const hdVol=d=>clamp(1-d/11,0,1)**1.4;
function hdGrowl(pan,v){hdVoice({f0:92,f1:52,dur:.85,type:'sawtooth',vol:.34*v,pan,lp:380,vib:[26,9]});hdVoice({f0:140,f1:70,dur:.6,type:'square',vol:.1*v,pan,lp:260,vib:[19,14]});saNoise(.7,'bandpass',220,1.2,.3*v,null,120,pan)}
function hdRasp(pan,v){saNoise(.8,'bandpass',1100,1.6,.22*v,null,380,pan);saNoise(.5,'highpass',3000,1,.05*v,null,0,pan)}
function hdScreech(pan,v){hdVoice({f0:1500,f1:260,dur:.55,type:'sawtooth',vol:.2*v,pan,lp:2600,vib:[40,60]});saNoise(.5,'bandpass',2400,2,.2*v,null,500,pan)}
function hdSob(pan,v){const f=480+Math.random()*80;[0,.3,.62].forEach((d,i)=>setTimeout(()=>{if(!SA.n)return;hdVoice({f0:f*(1-i*.04),f1:f*(.74-i*.04),dur:.26,type:'triangle',vol:.2*v,pan,lp:1700,vib:[7,14]});hdVoice({f0:f*1.5,f1:f*1.1,dur:.22,type:'sine',vol:.06*v,pan,lp:2600});saNoise(.2,'bandpass',1900,2,.1*v,null,1300,pan)},d*1000))}
function hdWail(pan,v){hdVoice({f0:360,f1:900,dur:1.15,type:'sawtooth',vol:.17*v,pan,lp:1500,vib:[5.5,34],att:.25});hdVoice({f0:540,f1:1350,dur:1.15,type:'sine',vol:.07*v,pan,lp:3000,vib:[6,40],att:.3});saNoise(1,'bandpass',1500,2,.14*v,null,2600,pan)}
function hdDrum(v,f){saTone(f||78,34,.28,'sine',v);saNoise(.07,'lowpass',900,1,v*.5)}
function hdTak(v){saNoise(.06,'bandpass',2100,2,v)}
/* ---------- dynamic score + monster voices ---------- */
const HDA={st:0,acc:0,voc:[0,0,0,0,0,0,0,0]};
function hdAudio(dt){const R=EM;if(!SA.n||!ST.emOn||state!=='story'||ST.cin){return}const n=SA.n,t=AC.currentTime;
  let tt=0,ne=0;
  R.en.forEach((e,i)=>{if(e.st==='dorm'||e.away>0)return;const dx=e.x-R.x,dy=e.y-R.y,d=Math.hypot(dx,dy),pan=clamp(dx/9,-1,1),v=hdVol(d);
    if(e.k==='hunter'||e.k==='snuffer'){const sn=e.k==='snuffer',hunt=e.st==='hunt'&&e.stun<=0;if(hunt)tt=Math.max(tt,clamp(1.15-d/11,.35,1));else tt=Math.max(tt,clamp(.45-d/16,0,.3));
      if(e.stun>0&&!e.sc){e.sc=1;hdScreech(pan,Math.max(.5,v))}if(e.stun<=0)e.sc=0;
      HDA.voc[i]-=dt;if(v>0&&HDA.voc[i]<=0&&e.stun<=0){if(sn){hdHush(pan,v);HDA.voc[i]=rr(3.5,5.5)}else if(hunt){hdGrowl(pan,v);HDA.voc[i]=rr(2.2,3.6)}else{hdRasp(pan,v);HDA.voc[i]=rr(4,7)}}
      if(hunt&&!e.hv){e.hv=1;(sn?hdHush:hdGrowl)(pan,Math.max(.6,v))}if(!hunt)e.hv=0}
    else{const hunt=e.st==='hunt';if(hunt)tt=Math.max(tt,clamp(.95-d/12,.3,.9));else tt=Math.max(tt,clamp(.35-d/16,0,.25));
      HDA.voc[i]-=dt;if(v>0&&HDA.voc[i]<=0&&!e.fz){if(hunt){hdWail(pan,v);HDA.voc[i]=rr(2.8,4)}else{hdSob(pan,v);HDA.voc[i]=rr(3.2,5.5)}}
      if(e.fz&&!e.fzs){e.fzs=1;saNoise(.25,'bandpass',2600,3,.14*Math.max(.4,v),null,900,pan)}if(!e.fz)e.fzs=0}});
  if(R.hp){tt=Math.max(tt,.5+(5-R.hp.hp)*.09+(R.hp.open?.22:0));if(R.hp.open&&!HDA.ho){HDA.ho=1;hdGrowl(0,1);saBoom(.8)}if(!R.hp.open)HDA.ho=0}
  if(R.dark>0)tt=Math.max(tt,.4);
  R.tens=R.tens||0;R.tens+=(tt-R.tens)*Math.min(1,dt*(tt>R.tens?2.4:.45));const k=R.tens;SA.tens=k;
  n.tg.gain.setTargetAtTime(k*.34,t,.3);n.dl.frequency.setTargetAtTime(420+k*1700,t,.5);n.dg.gain.setTargetAtTime(.2+k*.3,t,.5);
  /* sequencer */
  const bpm=82+k*58,sl=60/bpm/2;HDA.acc+=dt;let guard=0;
  while(HDA.acc>=sl&&guard++<4){HDA.acc-=sl;const s=HDA.st++%16,bar=Math.floor((HDA.st-1)/16);
    if(k>.18&&s%8===0)hdDrum(.34+k*.3);
    if(k>.42){if(s===4||s===12)hdTak(.16+k*.14);if(s===10)hdDrum(.24+k*.2,70)}
    if(k>.65){if([3,6,14].includes(s))hdDrum(.22+k*.18,64);if(s%4===2)hdTak(.1);
      const sc=[55,55,58.27,55,65.41,55,58.27,49];if(s%2===0)saTone(sc[(s/2)%8],sc[(s/2)%8]*.99,.22,'sawtooth',.1+.06*k,null)}
    if(k>.82&&s===0&&bar%2===0&&saChoir)saChoir([110,130.8,164.8],1.6,.05)}}
/* ---------- سالم الحارس ---------- */
const HD_TOPICS=[
 {id:'who',q:'من أنت يا سالم؟',ok:()=>true,lines:()=>[['سالم','كنت حارس بوابة قلعة الجمر يا ولدي. وهالقلعة ما كانت مقبرة... كانت بيت النور لكل الصحراء.'],['سالم','فيها الجمر الأول، نار ما تنطفي. من نورها تشعل القرى فوانيسها، ومن حرّها تدفّى في الشتاء.'],['سالم','إلى أن جاء يوم... وصار الجمر يجوع.']]},
 {id:'fall',q:'وش صار للقلعة؟',ok:()=>true,lines:()=>[['سالم','الملوك كانوا يغذّون الجمر بالحطب... وبعدين بالذهب... وبعدين بشيء أغلى: بضوء الناس.'],['سالم','كل واحد يعطيه ذكرى حلوة. والجمر يشبع شوي... وبعدها يجوع أكثر.'],['سالم','واللي انأخذ ضوؤه ما مات. صار رمادًا يمشي، يدوّر على النور اللي ضاع منه، ويهجم على كل جمرة يشوفها.']]},
 {id:'ash',q:'الوحوش اللي برّا... مين هم؟',ok:()=>true,lines:()=>[['سالم','الرماديين؟ هذولا أهل القلعة يا ولدي. ولد الخباز... وبنت المؤذّن... وجيراني.'],['سالم','والباكية اللي تغطّي وجهها؟ أمّ ما زالت تبكي ولدها. لو ضوّت جمرتك عليها تتجمّد... بس لا تطوّل عندها.'],['سالم','لا تكرههم. بس لا تعطيهم ضوءك.']]},
 {id:'ember',q:'وش هالجمرة اللي بيدي؟ وليش أنا؟',ok:()=>true,lines:()=>[['سالم','هالجمرة ما هي من القلعة... هي شرارة من الجمر الأول، هرّبها آخر الملوك قبل لا يقفل البوابة.'],['سالم','وصلت لجدّتك، وبعدها لأبوك... والحين عندك. ما اخترتها يا ولدي. هي اللي اختارتك.'],['سالم','وهذا سبب إنها تضعف لما تبعد عن النار... تبي ترجع للأصل.']]},
 {id:'heart',q:'وش القلب؟ وش يبي؟',ok:e=>e.lv>=3||e.shards>=2,lines:()=>[['سالم','القلب هو الجمر الأول بعد ما انجنّ من الجوع. تحت الأرض يتنفّس... ويسمع.'],['سالم','يسمع كل خطوة وكل نبضة، ولهذا الرماديين يعرفون وين أنت.'],['سالم','ما تقدر تطفيه. بس تقدر تجرحه بوهجك... لين يتذكّر مين كان.']]},
 {id:'relic',q:'قلت شيء عن ذخائر سرّية؟',ok:()=>true,lines:e=>[['سالم','أهالي القلعة خبّوا ذكريات صغيرة ورا الجدران. ما تنفتح إلا بالنور.'],['سالم','إذا شفت شيء يلمع ورا جدار... اضغط الوهج نحوه، وبعدين ادفعه.'],['سالم',e.relics>=1?'وأنت لقيت '+e.relics+'! لو جمعت ثلاثاً من أربع... التاج يشوف الوجوه اللي أكلها.':'لو جمعت ثلاثاً من أربع... التاج يشوف الوجوه اللي أكلها. وهذا يغيّر كل شيء.']]},
 {id:'mirror',q:'وش قصة المرايا والأختام؟',ok:e=>e.lv>=1,lines:()=>[['سالم','كانت المكتبة بيت الأرشيفيين. يعلّمون الضوء يتكلم بالمرايا: ينحني ولا ينكسر.'],['سالم','وهجك يمشي بخط مستقيم. المرآة تحنيه ربع دورة. وإذا وقفت من فوق أو من تحت، يختلف الانحناء... جرّب وأدِرها بـ E.'],['سالم','الأختام وراها قضبان، النور يمرّ والجسد لا. لا تنسى: كل وهج يكلّفك من جمرتك.']]},
 {id:'snuffer',q:'مين الكاتم اللي يطفّي النار؟',ok:e=>e.lv>=1,lines:()=>[['سالم','الكاتم؟ كان خادم المكتبة. وظيفته يطفّي الشموع بعد ما يخلص الناس.'],['سالم','نسي إن الناس راحوا... وصار يطفّي كل نار يشوفها. ويمصّ جمرتك إذا قرّب.'],['سالم','أشعل ناراً ثانية قبل لا ينتهي من الأولى... أو شلّه بالوهج.']]},
 {id:'bridge',q:'الجسور اللي تنهار... كيف أعدّيها؟',ok:e=>e.lv>=2,lines:()=>[['سالم','هالجسور رماد جمر قديم. تتفتّت بعد خطوتك بنصف ثانية، وتنبت من جديد بعد شوي.'],['سالم','لا تقف ولا تتسلل عليها. اركض. والصيادين ما يعدّونها... خلّها حاجزك.'],['سالم','وثلاث منارات على ثلاث جزر. كل وحدة تضيء، تقترب من الباب.']]},
 {id:'why',q:'ليش تطلع لي في كل مكان يا سالم؟',ok:e=>e.lv>=1,lines:()=>[['سالم','شفتني في البوابة، وبعدين في المكتبة، وبعدين هنا... وسؤالك في محلّه.'],['سالم','أنا ما أمشي يا ولدي. جسدي صار رماد من عشرين سنة. اللي تشوفه هو ذكرى مني تعيش في اللهب.'],['سالم','وكل نار توقدها، تشعل معها ذكرى مني. أطلّ منها وأحكي لك... لهذا ما أطلع إلا عند النيران.'],['سالم','وإذا انطفت كل نار حواليك... ما بتلقاني. فلا تخلّي جمرتك تنطفي.']]},
 {id:'puzzles',q:'وش هالأقفال والشاشات اللي فيها رموز؟',ok:e=>e.lv>=1,lines:()=>[['سالم','الأرشيفيين خبّوا أسرارهم بأقفال من ضوء. ما تنفتح بالسيف ولا بالوهج... تنفتح بالعقل.'],['سالم','بعضها اختياري: اللي يحلّه يكبر وهجك، يصير أرخص وأوسع. وبعضها قفل باب، ما تعدّي إلا بحلّه.'],['سالم','وإذا طالت عليك، اخرج وارجع. الصبر يفتح كل قفل.']]},
 {id:'hajeer',q:'من هو الإمبراطور هجير؟',ok:e=>e.lv>=4,lines:()=>[['سالم','هجير؟ كان آخر ملوك القلعة. أول من فهم إن الجمر يشبع إذا غذّاه ملك.'],['سالم','بنى قصره برّا القلعة، وخلّى قلب الرماد قفل على بابه... عشان ما أحد يوصل له.'],['سالم','سمّوه الإمبراطور. وهو ما يبي يقتلك... يبي جمرتك. تاجه ناقص جمرة وحدة.']]},
 {id:'truth',q:'قل لي الحقيقة كاملة يا سالم.',ok:e=>e.lv>=5,lines:()=>[['سالم','تبي الحقيقة؟ لما جاع الجمر الأول، الملوك قدّموا له ضوء الناس. أنا قدّمت نفسي بدلهم.'],['سالم','فصرت جزء منه. نصفي رماد في القلب... ونصفي في جمرتك. يعني أنت ما حملت جمرة يا ولدي... حملتني معك.'],['سالم','ولهذا يسمعونك: جمرتك فيها نبض قلب إنسان.']]},
 {id:'garden',q:'وش قصة هالحدائق؟',ok:e=>e.lv>=5,lines:()=>[['سالم','كانت حديقة الأميرات. زهورها تتفتّح لمن يغنّي. بعد ما جاع الجمر، ما بقي منها إلا الرماد والشجر الميّت.'],['سالم','والكلاب اللي تشوفها... كانت كلاب الصيد الملكية. سريعة، وتشمّ الخوف. النار تبطئها، والوهج يطردها.'],['سالم','ثلاثة أقفال: أنوار، ومجرى، وذاكرة. بعدها يفتح باب الهجير.']]},
 {id:'orbs',q:'كيف أهزم حارس العرش؟',ok:e=>e.lv>=6,lines:()=>[['سالم','كرته ما تنطفي. بس وهجك يردّها له... قرّب منها، وجّه نحوها، واضغط R.'],['سالم','والموجة اللي تطلع من الإمبراطور تقف عند العمود، وعند النار المشتعلة. لا تقف في العراء.'],['سالم','وردّ الكرة هو سلاحك الوحيد. الجمر ما ينكسر إلا بنفسه.']]},
  {id:'tip',q:'عندك نصيحة؟',ok:()=>true,lines:e=>e.m.th===0?[['سالم','الصياد الرمادي لا تركض قدامه بدون وهج. شلّه بالنور وروح.'],['سالم','والرماد اللي يسدّ الممر... احرقه بالوهج. وإذا ضعفت جمرتك، اشرب من العروق المتوهّجة في الجدران.']]:e.m.th===3?[['سالم','جرّب الوقوف بمحاذاة المرآة وتوجّه نحوها ثم R. إذا الشعاع ما وصل، أدِر المرآة (E) وأعد المحاولة.'],['سالم','الختم الأخير في الشمال فيه سلسلة مرايا. ابدأ من الأخيرة...']]:e.m.th===4?[['سالم','اركض على الجسور ولا توقف. إذا سقطت ارجع لآخر نار.'],['سالم','أشعل المنارة الأولى وانتبه: الصياد ينام قريب من الثانية.']]:e.m.th===5?[['سالم','الكلاب أسرع منك. لا تركض في العراء، قف قرب النار وخلّها تبطّئهم.'],['سالم','وإذا عجزت عن لغز، ارجع له بعد ما تهدأ.']]:e.m.th===6?[['سالم','وقف خلف عمود. الكرة تتحطّم عليه، والحارس يتعب.'],['سالم','أبراج الصمت: ابدأ بنقل القرص الأصغر دائماً، وفكّر بالأقل خطوات.']]:e.m.th===7?[['سالم','ثلاثة أطوار. في الثاني يجيك الحشد، وفي الثالث يطفّي لك النار. أعد إشعالها.'],['سالم','لا تبخل بالوهج. ردّ كل كرة.']]:e.m.th===1?[['سالم','في أربع أجنحة، وفي كل جناح مذبح. كل مذبح تشعله يوقظ شيء... لا تشعله وأنت ضعيف.'],['سالم','الجسور على الحمم هي الطريق الوحيد... والرماديين يعرفونها.']]:[['سالم','القلب يفتح عينه كل شوي... هذاك وقتك، وجّه الوهج على قلبه مباشرة.'],['سالم','وإذا ضاقت عليك الدنيا، قرّب من النار. النار تحميك.']]},
 {id:'fin',q:'أنا جاهز للقلب... وش تقول لي؟',ok:e=>e.lv===4,lines:e=>[['سالم','لا تخاف من الظلمة يا ولدي. هي بس ضوء ما لقى من يحمله.'],['سالم','القلب قفل مو أكثر. ولا تظن إن كسره يعني النهاية...'],['سالم','روح. وأنا... أنتظرك عند النار.']]},
 {id:'fin7',q:'أنا جاهز للإمبراطور... وش تقول لي؟',ok:e=>e.lv>=7,lines:e=>[['سالم','لا تخاف منه يا ولدي. هو جوع لابس تاج.'],['سالم',e.relics>=3?'وأنت حملت ذكريات أهل القلعة. التاج بيعرفهم... وبيسمح لهم يرحلون.':'لو التاج انكسر، تروح معه نار الجوع... بس ما أقدر أوعدك بأكثر. لو جمعت ثلاث ذخائر من أربع... تتغيّر النهاية.'],['سالم','روح. وأنا ما راح أنطفي ما دامت جمرتك حيّة.']]}];
function hdTalkSave(){try{store.set('ember_em_talk',EM.talk)}catch(e){}}
/* ---------- شاشة الحوار: سالم على اليسار، والأسئلة على اليمين ---------- */
const HDT={on:0,mode:'',lines:[],i:0,full:'',n:0,after:null,raf:0,t0:0,speak:0};
(function(){const st=document.createElement('style');st.textContent=`
#talk{position:fixed;inset:0;z-index:60;display:flex;direction:ltr;background:radial-gradient(ellipse at 30% 60%,rgba(70,30,10,.55),rgba(4,2,2,.93) 70%);backdrop-filter:blur(3px);animation:tkIn .45s ease both}
@keyframes tkIn{from{opacity:0}to{opacity:1}}
#talk[hidden]{display:none}
#talk .pt{flex:0 0 40%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:3%;min-width:0}
#talk canvas{height:84%;max-width:100%;aspect-ratio:320/420;-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 46%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 62% 58% at 50% 46%,#000 62%,transparent 100%);animation:tkP .6s ease both}
@keyframes tkP{from{transform:translateX(-30px);opacity:0}to{transform:none;opacity:1}}
#talk .nm{margin-top:8px;text-align:center;font-family:var(--font-display,inherit);color:#ffd9a0;font-size:clamp(18px,2.6vw,28px);text-shadow:0 0 18px #ff8a30}
#talk .nm small{display:block;font-size:.5em;color:#b99a7a;letter-spacing:.04em;margin-top:2px}
#talk .pn{flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:4% 5% 4% 2%;direction:rtl;min-width:0}
#talk .sp{min-height:112px;background:linear-gradient(180deg,rgba(40,20,10,.88),rgba(20,10,6,.9));border:1px solid #6a3c1c;border-right:4px solid #ff9a40;border-radius:12px;padding:16px 22px;color:#fff1d8;font-size:clamp(16px,2.1vw,23px);line-height:1.9;box-shadow:0 10px 40px #000a;cursor:pointer;position:relative}
#talk .sp .hn{position:absolute;left:14px;bottom:8px;font-size:12px;color:#c9a070;opacity:.8}
#talk .qs{display:grid;gap:8px}
#talk .q{font:inherit;text-align:right;background:rgba(30,16,10,.85);border:1px solid #5a341c;color:#f2dcc0;padding:11px 16px;border-radius:10px;cursor:pointer;font-size:clamp(14px,1.8vw,19px);transition:.15s;display:flex;gap:10px;align-items:center}
#talk .q:hover,#talk .q:focus{background:linear-gradient(90deg,#ff8a3a,#ffc070);color:#2a1206;border-color:#ffd9a0;outline:none;transform:translateX(-4px)}
#talk .q b{flex:0 0 auto;width:24px;height:24px;border-radius:50%;background:#ff9a40;color:#2a1206;display:grid;place-items:center;font-size:13px}
#talk .q.nw::after{content:'جديد';margin-inline-start:auto;font-size:11px;background:#ffb060;color:#2a1206;border-radius:8px;padding:1px 7px}
#talk .q.bye{opacity:.85}
#talk .pn{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
#talk .q.bye{position:sticky;bottom:0;background:#3a1c0e;border-color:#ff9a40;opacity:1;z-index:2}
#talk .x{position:absolute;top:10px;left:10px;z-index:3;font:inherit;cursor:pointer;background:rgba(40,20,10,.92);color:#ffd9a0;border:1px solid #ff9a40;border-radius:20px;padding:8px 16px;font-size:15px;box-shadow:0 4px 16px #000a}
#talk .x:active{background:#ff9a40;color:#2a1206}
@media (max-aspect-ratio:1/1){#talk{flex-direction:column}#talk .pt{flex:0 0 24%}#talk canvas{height:100%}#talk .nm{display:none}#talk .pn{padding:2% 4% 4%;justify-content:flex-start;gap:8px;min-height:0}#talk .sp{min-height:84px;padding:12px 16px;font-size:clamp(15px,4.2vw,19px)}#talk .q{padding:9px 12px;font-size:clamp(13px,3.8vw,16px)}#talk .qs{gap:6px}}
@media (max-height:520px){#talk .q{padding:6px 12px}#talk .sp{min-height:70px}}
`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='talk';d.hidden=true;d.innerHTML='<div class="pt"><canvas width="320" height="420"></canvas><div class="nm">سالم<small>آخر حارس لبوابة قلعة الجمر</small></div></div><button class="x" type="button">✕ خروج</button><div class="pn"><div class="sp"><span class="tx"></span><span class="hn">▸ متابعة</span></div><div class="qs"></div></div>';document.body.appendChild(d);
  d.querySelector('.sp').addEventListener('pointerdown',e=>{e.preventDefault();hdTalkNext()});d.querySelector('.x').addEventListener('click',e=>{e.stopPropagation();hdTalkClose()})})();
function hdPortrait(cv,t,sp,bl){const q=cv.getContext('2d'),Wp=320,Hp=420;q.clearRect(0,0,Wp,Hp);const br=Math.sin(t*1.5)*2.2,fl=.86+.1*Math.sin(t*9)+.05*Math.sin(t*23);
  let g=q.createRadialGradient(175,200,10,175,200,280);g.addColorStop(0,`rgba(255,150,60,${.3*fl})`);g.addColorStop(1,'rgba(255,100,30,0)');q.fillStyle=g;q.fillRect(0,0,Wp,Hp);
  q.save();q.translate(0,br);
  /* cloak */
  g=q.createLinearGradient(0,260,0,Hp);g.addColorStop(0,'#4a3020');g.addColorStop(1,'#150b06');q.fillStyle=g;q.beginPath();q.moveTo(10,Hp);q.bezierCurveTo(20,340,60,296,120,276);q.lineTo(222,276);q.bezierCurveTo(280,296,318,340,Wp,Hp);q.closePath();q.fill();
  q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=3;for(let i=0;i<6;i++){q.beginPath();q.moveTo(70+i*38,290+Math.abs(i-2.5)*6);q.bezierCurveTo(60+i*40,340,80+i*36,380,70+i*42,Hp);q.stroke()}
  q.strokeStyle='rgba(255,170,90,.12)';q.lineWidth=2;for(let i=0;i<4;i++){q.beginPath();q.moveTo(100+i*44,292);q.bezierCurveTo(96+i*44,340,110+i*44,380,100+i*46,Hp);q.stroke()}
  /* hood */
  g=q.createLinearGradient(0,50,0,300);g.addColorStop(0,'#3b2412');g.addColorStop(1,'#20120a');q.fillStyle=g;q.beginPath();q.moveTo(66,310);q.bezierCurveTo(30,200,60,56,175,46);q.bezierCurveTo(290,56,318,200,280,310);q.bezierCurveTo(250,262,96,262,66,310);q.fill();
  q.fillStyle='#0c0604';q.beginPath();q.ellipse(173,186,72,92,0,0,7);q.fill();
  /* face */
  g=q.createRadialGradient(205,230,10,175,190,100);g.addColorStop(0,'#f0c598');g.addColorStop(.6,'#c99366');g.addColorStop(1,'#7a4c32');q.fillStyle=g;q.beginPath();q.ellipse(173,190,60,78,0,0,7);q.fill();
  q.fillStyle='rgba(60,25,10,.35)';q.beginPath();q.ellipse(142,190,18,70,-.1,0,7);q.fill();
  /* forehead + wrinkles */
  q.strokeStyle='rgba(70,35,18,.5)';q.lineWidth=1.6;for(let i=0;i<3;i++){q.beginPath();q.moveTo(140+i*3,138+i*9);q.quadraticCurveTo(173,132+i*9,206-i*3,138+i*9);q.stroke()}
  /* eyes */
  const ey=q.canvas?0:0;for(const ex of[148,198]){const op=Math.max(.08,1-bl);q.fillStyle='#f4ead6';q.beginPath();q.ellipse(ex,176,12,6.5*op,0,0,7);q.fill();
    q.save();q.beginPath();q.ellipse(ex,176,12,6.5*op,0,0,7);q.clip();q.fillStyle='#4a2c14';q.beginPath();q.arc(ex+(Math.sin(t*.7)*1.5),176,5.2,0,7);q.fill();q.fillStyle='#120804';q.beginPath();q.arc(ex+(Math.sin(t*.7)*1.5),176,2.4,0,7);q.fill();q.fillStyle='rgba(255,200,120,.95)';q.fillRect(ex+1,173.5,2,2);q.restore();
    q.strokeStyle='#3a1e0e';q.lineWidth=2.4;q.beginPath();q.ellipse(ex,176,12.5,6.5*op,0,Math.PI,0);q.stroke();q.lineWidth=1.2;q.strokeStyle='rgba(60,30,15,.5)';q.beginPath();q.moveTo(ex-14,181);q.quadraticCurveTo(ex,187,ex+14,181);q.stroke();
    for(let k=0;k<3;k++){q.beginPath();q.moveTo(ex+(ex<170?-13:13),176+k*3);q.lineTo(ex+(ex<170?-22:22),172+k*6);q.stroke()}}
  /* brows */
  q.fillStyle='#e8e2d6';for(const s of[-1,1]){q.beginPath();q.moveTo(173+s*10,164);q.bezierCurveTo(173+s*26,152,173+s*44,156,173+s*56,166);q.bezierCurveTo(173+s*42,162,173+s*26,162,173+s*10,168);q.fill()}
  /* nose */
  q.strokeStyle='rgba(80,40,20,.55)';q.lineWidth=2.2;q.beginPath();q.moveTo(171,180);q.quadraticCurveTo(165,208,160,214);q.quadraticCurveTo(173,222,188,214);q.stroke();q.fillStyle='rgba(255,215,160,.25)';q.beginPath();q.ellipse(179,200,4,10,0,0,7);q.fill();
  /* mouth (behind the mustache) */
  const mo=2+sp*8;q.fillStyle='#2a0c08';q.beginPath();q.ellipse(173,240,13,mo,0,0,7);q.fill();
  /* beard */
  g=q.createLinearGradient(110,220,230,380);g.addColorStop(0,'#bdb5a6');g.addColorStop(.5,'#f4efe4');g.addColorStop(1,'#d7cdb8');q.fillStyle=g;
  q.beginPath();q.moveTo(116,206);q.bezierCurveTo(100,262,112,322,150,364);q.bezierCurveTo(166,386,182,390,196,366);q.bezierCurveTo(240,326,250,262,232,206);q.bezierCurveTo(222,236,196,250,173,248);q.bezierCurveTo(150,250,126,236,116,206);q.fill();
  q.strokeStyle='rgba(120,105,85,.4)';q.lineWidth=1.3;for(let i=0;i<14;i++){const x=128+i*8;q.beginPath();q.moveTo(x,250);q.bezierCurveTo(x-4+Math.sin(t+i)*2,290,x+3,330,x-2+(i-7)*2,350+Math.abs(i-7)*-3);q.stroke()}
  q.fillStyle='#efe9dc';for(const s of[-1,1]){q.beginPath();q.moveTo(173,232-sp*1.5);q.bezierCurveTo(173+s*20,222,173+s*46,230,173+s*52,246);q.bezierCurveTo(173+s*34,240,173+s*16,244,173,240);q.fill()}
  q.restore();
  /* staff + ember in the foreground */
  q.save();q.translate(0,br*1.4);g=q.createLinearGradient(40,0,70,0);g.addColorStop(0,'#2a1608');g.addColorStop(1,'#6a4220');q.fillStyle=g;q.fillRect(50,236,14,200);q.fillStyle='#e2b88e';q.beginPath();q.ellipse(57,340,17,13,0,0,7);q.fill();q.fillStyle='#b78458';for(let i=0;i<4;i++)q.fillRect(43+i*8,332,5,17);
  q.globalCompositeOperation='lighter';g=q.createRadialGradient(57,226,2,57,226,70*fl);g.addColorStop(0,'rgba(255,230,160,.95)');g.addColorStop(.35,'rgba(255,150,50,.55)');g.addColorStop(1,'rgba(255,100,20,0)');q.fillStyle=g;q.fillRect(-20,150,150,150);
  g=q.createRadialGradient(210,230,10,210,230,170);g.addColorStop(0,`rgba(255,160,70,${.07*fl})`);g.addColorStop(1,'rgba(255,160,70,0)');q.fillStyle=g;q.fillRect(0,100,Wp,260);
  q.globalCompositeOperation='source-over';q.fillStyle='#ffd070';q.beginPath();q.moveTo(46,238);q.quadraticCurveTo(40,214+Math.sin(t*10)*3,57,196);q.quadraticCurveTo(74,214+Math.cos(t*9)*3,68,238);q.closePath();q.fill();q.fillStyle='#fff3c0';q.beginPath();q.ellipse(57,226,5,10,0,0,7);q.fill();q.restore();
  /* sparks */
  q.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const ph=(t*.25+i/16)%1,x=60+Math.sin(i*2.3+t*.8)*46+ph*40*(i%3-1),y=230-ph*220;q.fillStyle=`rgba(255,${150+i*6},60,${Math.sin(ph*Math.PI)*.8})`;q.fillRect(x,y,2,2)}q.globalCompositeOperation='source-over'}
function hdTalkLoop(){const d=$('#talk');if(!HDT.on)return;const t=(performance.now()-HDT.t0)/1000;
  /* typewriter */
  if(HDT.mode==='say'&&HDT.n<HDT.full.length){const k=Math.min(HDT.full.length,Math.floor((t-HDT.ts)*46));if(k!==HDT.n){HDT.n=k;d.querySelector('.tx').textContent=HDT.full.slice(0,k);if(k%3===0&&SA.n)hdVoice({f0:130+Math.random()*50,f1:110+Math.random()*40,dur:.09,type:'triangle',vol:.05,lp:700,att:.01})}HDT.speak=1}else HDT.speak=0;
  const bl=((t%3.6)>3.45)?Math.sin(((t%3.6)-3.45)/.15*Math.PI):0;
  hdPortrait(d.querySelector('canvas'),t,HDT.speak?(.5+.5*Math.sin(t*22)):0,bl);HDT.raf=requestAnimationFrame(hdTalkLoop)}
function hdTalkShow(lines,after){HDT.mode='say';HDT.lines=lines;HDT.i=0;HDT.after=after;hdTalkLine()}
function hdTalkLine(){const d=$('#talk'),l=HDT.lines[HDT.i];HDT.full=l[1];HDT.n=0;HDT.ts=(performance.now()-HDT.t0)/1000;d.querySelector('.tx').textContent='';d.querySelector('.qs').innerHTML='';d.querySelector('.hn').hidden=false}
function hdTalkNext(){if(!HDT.on||HDT.mode!=='say')return;if(HDT.n<HDT.full.length){HDT.n=HDT.full.length;$('#talk .tx').textContent=HDT.full;return}HDT.i++;if(HDT.i>=HDT.lines.length){const a=HDT.after;HDT.after=null;a&&a()}else hdTalkLine()}
function hdTalkMenu(){const R=EM,d=$('#talk');R.talk=R.talk||{};HDT.mode='menu';const ts=HD_TOPICS.filter(t=>t.ok(R)),qs=d.querySelector('.qs');qs.innerHTML='';d.querySelector('.hn').hidden=true;
  d.querySelector('.tx').textContent=pick(['اسأل يا ولدي... وقتي كله لك.','وش يشغل بالك؟','تكلّم... النار تسمعنا.']);HDT.full=d.querySelector('.tx').textContent;HDT.n=HDT.full.length;
  const add=(txt,fn,cls,i)=>{const b=document.createElement('button');b.type='button';b.className='q'+(cls?' '+cls:'');b.innerHTML=`<b>${i}</b><span>${txt}</span>`;b.onclick=fn;qs.appendChild(b)};
  ts.forEach((t,i)=>add(t.q,()=>{const nw=!R.talk[t.id];R.talk[t.id]=1;hdTalkSave();hdTalkShow(t.lines(R),hdTalkMenu)},R.talk[t.id]?'':'nw',i+1));
  add('شكراً يا سالم... أمشي',()=>hdTalkShow([['سالم',pick(['الله يحفظك. وجمرتك لا تنطفي.','روح... وارجع لي يا ولدي.','لا تنسى: النور ما يموت... ينام.'])]],hdTalkClose),'bye',ts.length+1);
  HDT.menuN=ts.length+1}
function hdTalkClose(){HDT.on=0;cancelAnimationFrame(HDT.raf);$('#talk').hidden=true;if(state==='talk')state='story'}
function hdTalkKey(c){if(c==='Escape'){hdTalkClose();return}if(HDT.mode==='say'&&(c==='Enter'||c==='Space'||c==='KeyE')){hdTalkNext();return}
  if(HDT.mode==='menu'){const m=/^Digit(\d)$/.exec(c);if(m){const b=$('#talk .qs').children[+m[1]-1];if(b)b.click()}}}
function hdTalk(){const R=EM,m=R.m,N=m.npc;if(!N||ST.busy||ST.cin||state!=='story')return;N.met=1;R.talk=R.talk||store.get('ember_em_talk')||{};
  let g;if(!R.talk.met){R.talk.met=1;hdTalkSave();g=[['سالم','...لا تقرّب جمرتك مني بسرعة يا ولدي. أنا مو منهم.'],['سالم','أنا سالم... آخر حارس بقى في هالقلعة. من عشرين سنة وأنا قاعد عند هالنار.'],['سالم','ما أحد دخل ورجع... إلا رماد. بس أنت جمرتك حيّة. تعال، دفّ شوي.']]}
  else if(R.E<35)g=[['سالم','جمرتك ضعيفة يا ولدي... اجلس عند النار، واشرب من عروق الجمر في الجدران.']];
  else if(m.th>0&&!N.first){N.first=1;const G={
    3:[['سالم','المكتبة... كنت أجي هنا أسمع صوت الورق. الحين ما يسمع إلا الرماد وهو يتنفّس. انتبه من الكاتم.'],['سالم','وتسأل نفسك: كيف وصلت قبلك؟ أنا ما أمشي يا ولدي... النار هي اللي تمشيني. كل نار توقدها، أطلّ منها.'],['سالم','لو تبي تفهم أكثر، اسألني: ليش تطلع لي في كل مكان؟']],
    4:[['سالم','جسور الرماد... تحتها حمم كانت يوماً نهر ضوء. لا توقف يا ولدي.']],
    1:[['سالم','هالقاعة أكبر مما أتذكّر... كل حجر فيها يهمس. ولا تسمعهم يا ولدي.']],
    2:[['سالم','هنا... تحت هالأرض يدق القلب. أحس بخطواتك من هون. ...إنت جاهز؟']],
    5:[['سالم','برّا القلعة... وحتى هنا النار توصلني. شفت هالسماء؟ هذا ما هو غيم، هذا دخان القلب الأول.'],['سالم','وراء الحدائق قصر الهجير. ما بتدخله إلا إذا فكّيت ثلاثة أقفال. القدماء سمّوها «ألغاز الجمر».']],
    6:[['سالم','هالساحة ما كانت للضيوف. من دخلها ما سمع صوت حذائه ثاني مرة.'],['سالم','حارس العرش ما ينضرب بالسيف... يُردّ عليه اللي يرميه.']],
    7:[['سالم','ما أقدر أقاتل معك... أنا من نارك، مو من لحمي. بس هذا آخر مكان أشوفك فيه قبل ما تختلف الدنيا.'],['سالم','هجير ما هو شرير يا ولدي... هو جوع لابس تاج. لا تكرهه، وردّ عليه ناره.']]};
    g=G[m.th]||[['سالم','أهلاً يا ولدي...']]}
  else g=[['سالم',pick(['رجعت لي؟ الحمد لله إنك سالم.','تعال... النار تنتظرك.','أسمعك تقرّب. خطواتك مو مثل خطواتهم.'])]];
  keys={};state='talk';HDT.on=1;HDT.t0=performance.now();$('#talk').hidden=false;$('#prompt').hidden=true;$('#tAct').hidden=true;hdTalkShow(g,hdTalkMenu);cancelAnimationFrame(HDT.raf);hdTalkLoop()}
function hdNpcTick(){}
