/* =====================================================================
   أصوات القصة أثناء اللعب (وضع القصة فقط، مو التحدّي اليومي)
   - سالم يهمس من النار ومن الجمرة: تلميحات ملائمة لحقيقته (يعيش في اللهب ثم تنكشف في مرحلة ٦)
   - الرماديون يهمسون بأصوات أهل القلعة لما يلاحظونك
   كل جملة تظهر مرة واحدة فقط (تُحفظ)، والهمسات المتكرّرة لها فترة تبريد
   ===================================================================== */
const VO={seen:store.get('ember_vo')||{},cd:0,lv:-1,t:0,ek:{},fireLv:{},lastE:100,low:0,rel:0,pz:0,half:{}};
const voSave=()=>store.set('ember_vo',VO.seen);
const voOn=()=>ST.emOn&&state==='story'&&!ST.cin&&!HD.cine&&!ST.busy&&EM.m&&!EM.endless&&!EM.daily;
/* سالم: يظهر نصّه كإشعار ذهبي. id فريد لكل جملة */
function voSalem(id,txt,force){if(VO.seen[id]||(VO.cd>0&&!force))return false;VO.seen[id]=1;voSave();VO.cd=9;toast('سالم: «'+txt+'»','#ffd9a0',true);if(SA.n&&saChime)saChime();return true}
/* مراحل القصة: جمل عند أول اقتراب من نار موقدة (سالم لا يظهر إلا عند النيران) */
const VO_FIRE=[ /* بحسب رقم المرحلة: ٠ البوابة · ١ المكتبة · ٢ الجسور · ٣ المذابح · ٤ قلب الرماد · ٥ الحدائق · ٦ ساحة الهجير · ٧ العرش */
 ['يا ولدي... أنت حي. كان لي زمن ما شفت أحد يمشي هنا.','قدّامك ممرات الرماد. لا تركض في العراء.'],
 ['المكتبة... كان الحرف هنا يضيء. ما بقي إلا الدخان.','المرايا تحفظ كل ضوء مرّ عليها. خلّها تحني وهجك.'],
 ['الجسور رماد جمر قديم... تحمل الخفيف، لا تقعد عليها.','ثلاث منارات على ثلاث جزر. من يشعلها يفتح الباب.'],
 ['قاعة المذابح... هنا كانوا يقدّمون الضوء للجمر.','أشعل المذابح الثلاثة بنفسك... هالمرة بدون ما تعطيه أحد.'],
 ['القلب قريب... أحسّه ينبض من تحت الأرض.','لا تخاف النبض. خاف الجوع اللي وراه.'],
 ['حدائق الأميرات... كنت أسمع الغناء من هنا.','النار تبطئ الكلاب. لا تنسى جمرتك.'],
 ['ساحة الهجير... ما فيها إلا الصدى.','حارس العرش ما ينطفي، بس وهجك يردّ نارَه عليه.'],
 ['وصلت لعرش الجمر... كل شي كان ينتظرك.','أنا معك... أقرب مما تتصور.']];
/* جمرتك تهمس لما تضعف (تلميح مبكر: نبضها فيه إنسان) */
const VO_LOW=['جمرتك تضعف... دوّر على نار قبل لا تظلم.','لا تخلّيها تنطفي يا ولدي. أنا ما أطلّ إلا بنورها.','أحس بنبضها يبرد... اشرب من العروق، أو ارجع للنار.'];
/* أول مرة تشلّ كل نوع من الأعداء */
const VO_EN={hunter:'الصياد الرمادي كان حارس السوق... شلّه بالنور وكمّل، لا تقاتله.',weeper:'هذي الباكية... أم تدوّر على ولدها. ابعد عنها بالوهج، لا تؤذيها.',hound:'كلاب الصيد الملكية... تشمّ الخوف. اركض، والنار تبطئها.',snuffer:'الكاتم يطفّي كل نار... أشعل غيرها قبل لا يخلّص.',guard:'حارس الهجير... قديم ومخلص. الوهج يردّه.'};
/* همسات الرماديين لما يلاحظونك (من أهل القلعة) */
const VO_ASH={weeper:['ولدي...؟','وينك يا قلبي...','ضوء... ولدي كان عنده ضوء...'],hunter:['الضوء... أعطنا الضوء...','كنت أخبز... كنت أخبز لهم...','ما أبي أكون كذا...'],hound:['…','(نحيب بعيد)'],snuffer:['ينتهي الدوام... أطفئوا الشموع...','تأخّر الوقت...'],guard:['باسم الهجير...','حراسة... ما نامت عيني...']};
/* ذخائر سرّية: كل واحدة لها ذكرى */
const VO_REL=['هذي كانت لأم أحمد... الخيّاطة. خبّت فيها غناء وليدها.','وهذي مفتاح بيت المؤذّن... ما زال فيه صوت الأذان.','هذي لعبة صغيرة... بنت الحداد كانت تحبها.','وهذي... آخر ضحكة في القلعة. حطّها كل أهلها هنا.'];
const VO_PZ='الصبر يفتح كل قفل يا ولدي. الأرشيفيين فخورين فيك.';
const VO_HALF={6:'قربت منه... لا توقف، ردّ كل كرة!',7:'التاج بدأ يتشقق... هذا مو وحش، هذا جوع. كمّل.'};
/* حلقة التحديث */
const _voU=emUpdate;emUpdate=function(dt){_voU.apply(this,arguments);const R=EM;
  if(!voOn()){return}
  VO.t+=dt;if(VO.cd>0)VO.cd-=dt;
  if(VO.lv!==R.lv){VO.lv=R.lv;VO.low=0;VO.fireT=0}
  /* ١) أول اقتراب من نار موقدة في هذه المرحلة */
  if(!VO.fireLv[R.lv]&&VO.cd<=0){const f=R.m.items.find(i=>i.k==='brazier'&&i.lit&&Math.hypot(i.x-R.x,i.y-R.y)<3);
    if(f){const L=VO_FIRE[Math.min(R.lv,VO_FIRE.length-1)];if(L){VO.fireLv[R.lv]=1;if(!voSalem('f'+R.lv+'a',L[0]))VO.fireLv[R.lv]=0;else setTimeout(()=>{if(voOn()&&!VO.seen['f'+R.lv+'b'])voSalem('f'+R.lv+'b',L[1],true)},3200)}}}
  /* ٢) جمرتك تضعف */
  if(R.E<22&&R.E<VO.lastE&&!VO.low&&VO.cd<=0){const i=Object.keys(VO.seen).filter(k=>k.startsWith('low')).length;if(i<VO_LOW.length){VO.low=1;voSalem('low'+i,VO_LOW[i])}}
  if(R.E>40)VO.low=0;VO.lastE=R.E;
  /* ٣) أول شلّ لكل نوع + ٤) همسات الرماديين */
  for(const e of R.en){if(e.st==='dorm')continue;
    if((e.stun>0||e.away>0)&&VO_EN[e.k]&&!VO.seen['en_'+e.k]&&VO.cd<=0)voSalem('en_'+e.k,VO_EN[e.k]);
    if(e.st==='hunt'&&!e._vh){e._vh=1;const L=VO_ASH[e.k];if(L&&(VO.ek[e.k]||0)<=VO.t&&Math.hypot(e.x-R.x,e.y-R.y)<9){VO.ek[e.k]=VO.t+30;stWhisper(L[Math.floor(Math.random()*L.length)],1)}}
    if(e.st!=='hunt')e._vh=0}
  /* ٥) ذخيرة سرّية جديدة */
  if(R.relics>VO.rel){const n=R.relics;VO.rel=n;if(n>0&&VO_REL[n-1])setTimeout(()=>voSalem('rel'+n,VO_REL[n-1],true),1800)}if(R.relics<VO.rel)VO.rel=R.relics;
  /* ٦) أول لغز تحلّه */
  const pz=Object.keys(R.pzDone||{}).length;if(pz>VO.pz){if(VO.pz===0)setTimeout(()=>voSalem('pz1',VO_PZ,true),1500);VO.pz=pz}
  /* ٧) نصف صحة الزعيم */
  const B=R.bs;if(B&&!B.dead&&B.hp<=B.max/2&&VO_HALF[R.lv]&&!VO.half[R.lv]){VO.half[R.lv]=1;voSalem('half'+R.lv,VO_HALF[R.lv],true)}};
/* ما نكرّر من البداية لو أعاد اللاعب اللعب من الأول */
const _voS=emStart;emStart=function(fresh,endless){if(fresh&&!endless){VO.fireLv={};VO.half={};VO.rel=0;VO.pz=0;VO.lv=-1}return _voS.apply(this,arguments)};
Object.assign(window.__hd||{},{VO,voSalem});
