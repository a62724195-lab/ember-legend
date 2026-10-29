/* =====================================================================
   الإعلان الرسمي (تليرر): يعمل من داخل اللعبة بمحرّكها الحقيقي — زر في القائمة، أو ?trailer
   ===================================================================== */
const TRL={on:0};
(function(){const st=document.createElement('style');st.textContent=`
#trl{position:fixed;inset:0;z-index:9000;pointer-events:auto;direction:rtl;font-family:var(--font-display,'Reem Kufi','Tajawal',system-ui,sans-serif);color:#fff0c8;overflow:hidden}
#trl[hidden]{display:none}
#trl .tb1,#trl .tb2{position:absolute;inset-inline:0;height:11%;background:#000;z-index:2}#trl .tb1{top:0}#trl .tb2{bottom:0}
#trT{position:absolute;inset-inline:0;top:50%;transform:translateY(-50%);text-align:center;z-index:3;pointer-events:none;opacity:0}
#trT b{display:block;font-size:min(13vw,11vh);line-height:1.15;letter-spacing:.02em;text-shadow:0 0 22px #ff7a20,0 0 60px #c02a00,0 4px 0 #000}
#trT small{display:block;margin-top:.5em;font-size:min(4.4vw,3.6vh);color:#ffb060;letter-spacing:.14em;text-shadow:0 2px 8px #000}
#trT.go{animation:trIn var(--d,2.6s) ease-out forwards}
@keyframes trIn{0%{opacity:0;transform:translateY(-50%) scale(1.14);filter:blur(8px)}14%{opacity:1;transform:translateY(-50%) scale(1);filter:blur(0)}80%{opacity:1}100%{opacity:0;transform:translateY(-50%) scale(.97)}}
#trT.hit{animation:trHit var(--d,1.2s) ease-out forwards}
@keyframes trHit{0%{opacity:0;transform:translateY(-50%) scale(1.7)}10%{opacity:1;transform:translateY(-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
#trEnd{position:absolute;inset:0;z-index:4;display:none;flex-direction:column;align-items:center;justify-content:center;gap:1.2vh;text-align:center;background:radial-gradient(ellipse at 50% 60%,#4a1606cc,#000 72%);opacity:0;transition:opacity 1.4s}
#trEnd.show{display:flex;opacity:1}
#trEnd img{width:min(22vh,30vw);border-radius:50%;box-shadow:0 0 40px #ff7a2088}
#trEnd .a{font-size:min(4.2vh,5vw);color:#ffb060;letter-spacing:.1em}
#trEnd .b{font-size:min(11vh,13vw);line-height:1.1;text-shadow:0 0 26px #ff7a20,0 0 70px #c02a00}
#trEnd .c{font-size:min(4.6vh,5.4vw);color:#ffe4b0}
#trEnd .d{font-size:min(3.4vh,4vw);color:#e8c898;direction:ltr}
#trSk{position:absolute;top:calc(12% + 8px);inset-inline-end:12px;z-index:5;font-size:12px;color:#c9a070;opacity:.6}
html body.trailer #touch,html body.trailer #stHud,html body.trailer #stBtns,html body.trailer #toasts,html body.trailer #prompt,html body.trailer #updBn,html body.trailer #embBadge,html body.trailer #hud,html body.trailer #card,html body.trailer #cskip,html body.trailer #ccap{display:none!important}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='trl';d.hidden=true;d.innerHTML='<div class="tb1"></div><div class="tb2"></div><div id="trT"></div><div id="trEnd"><img alt=""><div class="a">شربكلي · تقدّم</div><div class="b">أسطورة الجمر</div><div class="c">متاحة الآن · مجاناً</div><div class="d">Windows · Android</div><div class="d">YouTube · @ASk-o7i3v</div></div><div id="trSk">اضغط للتخطي</div>';document.body.appendChild(d);
  d.addEventListener('click',()=>trExit());})();
const _svT=emSaveProg;emSaveProg=function(){if(EM.trailer)return;return _svT.apply(this,arguments)};
function trText(big,small,sec,hit){const t=$('#trT');t.className='';void t.offsetWidth;t.innerHTML='<b>'+big+'</b>'+(small?'<small>'+small+'</small>':'');t.style.setProperty('--d',sec+'s');t.className=hit?'hit':'go'}
/* صوت */
const tr_hit=(v)=>{inNoise(.7,2400,140,1,.55*(v||1),'lowpass');inTone(70,28,1.1,'sine',.8*(v||1));inTone(140,50,.4,'triangle',.25*(v||1))};
const tr_beat=(d)=>{inTone(62,38,.28,'sine',.55,d);inTone(55,34,.3,'sine',.42,d+.24)};
/* موسيقى 120 نبضة/د: كل لقطة تجدول إيقاعها من لحظة بدايتها، فتبقى القطعات على النبض حتى لو تباطأ الإطار */
const TB=.5;
const trKick=(d,v)=>{inTone(160,42,.24,'sine',.95*(v||1),d);inNoise(.04,4000,1200,1,.18,'highpass',d)};
const trSnare=(d,v)=>{inNoise(.2,2200,1000,.8,.45*(v||1),'bandpass',d);inTone(230,120,.12,'triangle',.28*(v||1),d)};
const trHat=(d,v)=>inNoise(.05,7500,9500,2,.1*(v||1),'highpass',d);
const trBassN=(f,d,l)=>{inTone(f,f*.97,l,'sawtooth',.2,d);inTone(f,0,l,'sine',.45,d)};
const TR_BASS=[55,43.65,65.41,49],TR_CH=[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]];
function trPulse(beats,g0,o){for(let b=0;b<beats;b++){const gb=g0+b,bar=(gb>>2)%4,d=b*TB;
  if(o.k&&(o.k===1||b%2===0))trKick(d,.9);
  if(o.s&&b%2===1)trSnare(d);
  if(o.h){trHat(d+TB/2,.8);if(o.h>1)trHat(d+TB/4,.4)}
  if(o.b){trBassN(TR_BASS[bar],d,TB*.42);trBassN(TR_BASS[bar],d+TB/2,TB*.42)}
  if(o.a)for(let j=0;j<4;j++)inTone(TR_CH[bar][j%3]*(j===3?2:1),0,.2,'triangle',.09,d+j*TB/4);
  if(o.p&&b%4===0)TR_CH[bar].forEach(f=>{inTone(f,0,2.1,'triangle',.07,d);inTone(f*1.006,0,2.1,'sawtooth',.025,d)})}}
function trShots(){let G=0;const ring=(x,y)=>{EM.x=x;EM.y=y;EM.ring=.001};
 const ld=n=>{EM.trailer=1;EM.endless=0;emLoad(n)};
 const S=(b,o)=>{const s=Object.assign({d:b*TB},o),g=G,on0=s.on;s.on=()=>{on0&&on0();if(s.m)trPulse(b,g,s.m)};G+=b;return s};
 const lvl=(b,n,w,hero,txt,sub,note,m,fl)=>S(b,{w,hero,fl,m,on:()=>{ld(n);if(txt)trText(txt,sub||'',b*TB*.9,1);tr_hit(.8);note&&inBell(note,.28,2)}});
 const mont=(n,w,h,txt,sub,col,note)=>S(3,{w,hero:h,fl:[.6,col],m:{k:1,s:1,h:1,b:1,a:1},on:()=>{ld(n);ring(h[2],h[3]);trText(txt,sub,1.4,1);tr_hit(.9);inBell(note,.28,1.4)}});
 return[
 S(8,{v:{dark:1},m:{p:1},on:()=>{TRL.t0=1;inDrone();for(let i=0;i<4;i++)tr_beat(i*1.0+.3);trText('قبل الضوء…','',3.4)}}),
 S(4,{v:{dark:1},m:{k:2},on:()=>{tr_hit(1.1);trText('كان الجمر.','',1.8,1)}}),
 lvl(4,0,[6,24,1.9,15,22.5,1.3],[5,25.5,12.5,25.5,'r',0],'قلعة ابتلعها الرماد','',220,{k:1,h:1,b:1}),
 lvl(4,1,[12,22.5,1.8,22,19,1.2],[9,23.5,19,22,'r',0],'ألغاز تنحني لها الأضواء','',261.6,{k:1,s:1,h:1,b:1}),
 lvl(4,2,[9,26,1.7,22,24.5,1.2],[6,26.5,18,26.5,'r',0],'وظلال تطارد الدفء','',196,{k:1,s:1,h:1,b:1,a:1}),
 mont(5,[9,31,1.6,12,29,1.15],[6.5,32.5,10,31,'r',0],'وهج','يكشف المخفيّ','#ffe0a0',329.6),
 mont(3,[27.5,29,1.6,27.5,25,1.15],[27.5,31.5,27.5,26.5,'u',0],'اندفاع','أسرع من الظلّ','#c58bff',392),
 mont(4,[18.5,24,1.6,18.5,20,1.15],[18.5,26.5,18.5,22,'u',0],'جامور','يعود إلى يدك','#ffd24a',440),
 mont(6,[20.5,23,1.6,20.5,19,1.15],[20.5,25.5,20.5,21,'u',0],'جمرات خاصّة','صقيع · حياة · ظلّ · صاعقة','#7ad8ff',523.2),
 lvl(1,0,[15,22.5,1.9,9,23,1.7],[12.5,25.5,8,25.5,'r',1],'','',0,{k:1,s:1,h:2},[.7,'#ff9a40']),
 lvl(1,1,[22,19,1.9,15,21,1.7],[19,22,14,21.5,'r',1],'','',0,{k:1,s:1,h:2},[.7,'#ff9a40']),
 lvl(1,2,[20,24.5,1.9,12,25,1.7],[18,26.5,10,26.5,'r',1],'','',0,{k:1,s:1,h:2},[.7,'#ff6a30']),
 lvl(1,11,[11,31,1.9,16,28,1.7],[8,32,16,29,'r',0],'','',0,{k:1,s:1,h:2},[.9,'#ffffff']),
 S(6,{w:[20.5,15,1.0,20.5,9.2,1.25],hero:[20.5,19.5,20.5,12.8,'u',0],fl:[.5,'#ff6a30'],m:{k:1,s:1,h:2,b:1,a:1},on:()=>{EM.trailer=1;emLoad(6);EM.bs&&(EM.bs.intro=0);EM.boost=9;EM.x=20.5;EM.y=15;EM.ring=.001;tr_hit(1.1);trText('حارس العرش','ردّ ناره إليه',2.6)}}),
 S(8,{w:[20.5,12,1.0,20.5,6.6,1.25],hero:[20.5,16,20.5,10.5,'u',0],fl:[.8,'#ff3a1a'],m:{k:1,s:1,h:2,b:1,a:1},on:()=>{EM.trailer=1;emLoad(7);EM.bs&&(EM.bs.intro=0);EM.boost=9;EM.x=20.5;EM.y=12.5;EM.ring=.001;tr_hit(1.4);inTone(80,50,2.4,'sawtooth',.18);trText('الإمبراطور هجير','ثلاثة أطوار · ثلاث نيران',3.4)}}),
 S(4,{w:[11,31,1.5,20,26,1.2],hero:[8,32,17,28,'r',0],m:{k:1,s:1,h:1,b:1,a:1},on:()=>{EM.endless=1;EM.eSeed=1234;EM.floor=1;EM.trailer=1;emLoad(11);trText('برج لا ينتهي','زعيم كل ٥ طوابق · جمرة لمن ينتصر',1.9);inBell(329.6,.3,2)}}),
 S(2,{v:{dark:1},on:()=>{EM.endless=0;inNoise(1,300,9000,2,.6,'bandpass');inTone(110,1760,1,'sawtooth',.14);$('#trT').className=''}}),
 S(12,{v:{y0:-40,y1:-20,z0:1.5,z1:1.3,c0:1,c1:1,b0:1,b1:1,hero:[W/2-70,238,W/2-40,224]},fl:[.9,'#ffe0a0'],fi:.2,title:{t:'أسطورة الجمر',sub:'جمر الأعماق',at:.8},m:{p:1,a:1,k:2},on:()=>{tr_hit(1.8);inTone(60,30,2.5,'sine',1);inNoise(2.5,2500,500,.6,.3,'bandpass');[220,330,440,660].forEach((f,i)=>inBell(f,.32,4,i*.12))}}),
 S(12,{v:{dark:1},fo:1.4,m:{p:1},on:()=>{inBell(440,.26,3);inBell(660,.2,3.5,.4);const e=$('#trEnd');e.querySelector('img').src=INTRO_IMG.badge;e.classList.add('show');$('#trSk').style.display='none'}})]}
function trStart(){if(TRL.on||(typeof INTR!=='undefined'&&INTR.on))return;TRL.on=1;inAu();const a=INTR.au;if(a&&a.A.state==='suspended')a.A.resume().catch(()=>{});
  EM.trailer=1;emStart(true);EM.trailer=1;HD.cine=null;ST.cin=null;$('#cine').hidden=true;$('#card').hidden=true;$('#toasts')&&($('#toasts').innerHTML='');
  document.body.classList.add('trailer');$('#trl').hidden=false;$('#trEnd').classList.remove('show');$('#trSk').style.display='';
  setTimeout(()=>{if(!TRL.on)return;hdCine(trShots(),()=>trExit())},60)}
function trExit(){if(!TRL.on)return;TRL.on=0;HD.cine=null;ST.cin=null;$('#cine').hidden=true;$('#ccap').textContent='';inDroneStop(.8);EM.trailer=0;EM.endless=0;
  document.body.classList.remove('trailer');$('#trl').hidden=true;$('#trEnd').classList.remove('show');$('#trT').className='';stExit(true)}
addEventListener('keydown',e=>{if(TRL.on&&e.key==='Escape'){e.stopPropagation();e.preventDefault();trExit()}},true);
(function(){const c=$('#dlShare')||$('#dlBtn')||$('#enBtn')||$('#emCont');if(!c||!c.parentNode)return;const b=document.createElement('button');b.type='button';b.className='mbtn s1';b.id='trBtn';b.textContent='▶ شاهد الإعلان';c.parentNode.insertBefore(b,c.nextSibling);b.addEventListener('click',trStart)})();
if(/[?&]trailer/.test(location.search))setTimeout(trStart,700);
Object.assign(window.__hd||{},{trStart,trExit,TRL});
