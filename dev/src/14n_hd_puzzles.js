/* =====================================================================
   ألغاز الشاشة: ستة ألغاز بواجهة مستقلة (أنوار، مجرى، ذاكرة، أبراج، شفرة، مرايا)
   كل لغز يتولّد من بذرة، وحلّه مضمون بالبناء (يُتحقَّق منه بالمحاكاة)
   ===================================================================== */
const PZ={on:0,def:null,it:null,t0:0,cl:null,api:null,solved:0};
(function(){const st=document.createElement('style');st.textContent=`
#pz{position:fixed;inset:0;z-index:62;display:flex;align-items:center;justify-content:center;direction:rtl;background:radial-gradient(ellipse at 50% 40%,rgba(60,28,10,.7),rgba(3,2,2,.96) 72%);backdrop-filter:blur(3px);animation:tkIn .35s ease both;font-family:inherit;color:#f6e3c6}
#pz[hidden]{display:none}
#pz .bx{width:min(94vw,620px);max-height:96vh;display:flex;flex-direction:column;gap:10px;padding:14px 16px;background:linear-gradient(180deg,rgba(36,20,12,.94),rgba(14,8,6,.96));border:1px solid #6a3c1c;border-radius:16px;box-shadow:0 20px 70px #000c,0 0 0 1px #2a1408 inset,0 0 60px #ff7a2a22}
#pz .hd{display:flex;align-items:baseline;gap:10px;justify-content:space-between}
#pz h2{margin:0;font-size:clamp(18px,3.4vw,26px);color:#ffd9a0;text-shadow:0 0 18px #ff8a30}
#pz .mv{font-size:13px;color:#c9a070;white-space:nowrap}
#pz .ds{font-size:clamp(12px,2.2vw,15px);color:#d9bd98;line-height:1.7}
#pz .pb{display:flex;align-items:center;justify-content:center;min-height:0;overflow:auto;padding:4px}
#pz .ft{display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap}
#pz .bt{font:inherit;cursor:pointer;background:rgba(40,22,12,.9);border:1px solid #6a3c1c;color:#f2dcc0;border-radius:10px;padding:8px 14px;font-size:14px;transition:.15s}
#pz .bt:hover,#pz .bt:focus{background:linear-gradient(90deg,#ff8a3a,#ffc070);color:#2a1206;outline:none}
#pz .bt[hidden]{display:none}
#pz.ok .bx{box-shadow:0 0 0 2px #ffd070,0 0 90px #ffb04088;animation:pzok .8s ease}
@keyframes pzok{0%{filter:brightness(1)}40%{filter:brightness(1.7)}100%{filter:brightness(1)}}
#pz .msg{min-height:1.4em;font-size:14px;color:#ffd890;text-align:center}
#pz canvas{touch-action:none;max-width:100%;border-radius:10px;background:#0a0605;border:1px solid #4a2a14;cursor:pointer}
.lg{display:grid;gap:6px;direction:ltr}
.lg button{width:clamp(44px,12.5vw,72px);aspect-ratio:1;border-radius:12px;border:1px solid #4a2a14;background:#150d09;cursor:pointer;position:relative;transition:.15s;padding:0}
.lg button::after{content:'';position:absolute;inset:22%;border-radius:50%;background:#2a1a12;transition:.2s}
.lg button.on{background:#3a1c0c;border-color:#ff9a40;box-shadow:0 0 18px #ff8a3066}
.lg button.on::after{background:radial-gradient(circle,#fff3c0,#ffa040 55%,#c24a14);box-shadow:0 0 16px #ffa040}
.lg button.hint{outline:2px dashed #9affc0}
.sl{display:grid;gap:6px;direction:ltr}
.sl button{width:clamp(52px,16vw,84px);aspect-ratio:1;border-radius:12px;border:1px solid #6a3c1c;background:linear-gradient(145deg,#4a2a16,#24140c);color:#ffd9a0;font:inherit;font-size:clamp(20px,6vw,32px);cursor:pointer;box-shadow:0 3px 0 #120a06}
.sl button.ok{background:linear-gradient(145deg,#7a4a20,#3a2010);color:#fff0c8}
.sl button.bl{visibility:hidden}
.hn{width:100%;display:flex;gap:clamp(8px,3vw,28px);align-items:flex-end;justify-content:center;direction:ltr;height:clamp(190px,36vh,260px)}
.hn .pg{flex:1;max-width:190px;height:100%;position:relative;display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding-bottom:6px;border-radius:12px;cursor:pointer;background:linear-gradient(180deg,transparent,rgba(80,40,16,.25));border:1px solid transparent}
.hn .pg::before{content:'';position:absolute;bottom:0;top:12%;left:calc(50% - 4px);width:8px;border-radius:4px;background:#3a2a1c}
.hn .pg.sel{border-color:#ffb060;background:linear-gradient(180deg,transparent,rgba(255,150,60,.2))}
.hn .dk{height:clamp(18px,3.8vh,26px);border-radius:8px;position:relative;z-index:1;border:1px solid #1a0c06;box-shadow:inset 0 2px 0 #ffffff30}
.cd{display:flex;flex-direction:column;gap:10px;align-items:center;width:100%}
.cd .hist{display:flex;flex-direction:column;gap:6px;width:100%;max-height:34vh;overflow:auto}
.cd .row{display:flex;gap:8px;align-items:center;justify-content:center;direction:ltr;background:rgba(30,16,10,.7);border-radius:10px;padding:5px 8px}
.cd .gm{width:clamp(30px,8vw,42px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-weight:700;color:#1a0c06;border:2px solid #0006;font-size:clamp(14px,3.4vw,20px)}
.cd .fb{margin-inline-start:8px;display:flex;gap:4px;min-width:90px;align-items:center;font-size:13px;color:#d9bd98;direction:rtl}
.cd .fb i{width:12px;height:12px;border-radius:50%;display:inline-block}
.cd .pal{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;direction:ltr}
.cd .pal button{padding:0;cursor:pointer}
.cd .cur button{cursor:pointer;padding:0}
`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='pz';d.hidden=true;d.innerHTML='<div class="bx"><div class="hd"><h2></h2><span class="mv"></span></div><div class="ds"></div><div class="pb"></div><div class="msg"></div><div class="ft"><button class="bt" data-a="reset" type="button">إعادة</button><button class="bt" data-a="hint" type="button">ساعدني الجمر (−١٠)</button><button class="bt" data-a="skip" type="button" hidden>تخطّي (بدون مكافأة)</button><button class="bt" data-a="exit" type="button">خروج</button></div></div>';document.body.appendChild(d);
  d.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;if(k==='exit')hdPzClose(0);else if(k==='reset')hdPzRestart();else if(k==='skip')hdPzClose(2);else if(k==='hint')hdPzHint()})})();
const PZ_GEM=['#ff5a4a','#ffc23a','#5ad07a','#4aa8ff','#c47aff','#f2f2f2'];
/* ---------- العام: فتح/إغلاق ---------- */
function hdPzOpen(it){if(PZ.on||state!=='story')return;const def=PZ_DEFS[it.pz];if(!def)return;PZ.on=1;PZ.def=def;PZ.it=it;PZ.t0=performance.now();PZ.solved=0;keys={};state='puzzle';
  $('#prompt').hidden=true;$('#tAct').hidden=true;const d=$('#pz');d.classList.remove('ok');d.hidden=false;
  d.querySelector('h2').textContent=def.title;d.querySelector('.ds').textContent=def.desc;
  const sk=d.querySelector('[data-a=skip]');sk.hidden=true;clearTimeout(PZ.skT);if(it.flag)PZ.skT=setTimeout(()=>{if(PZ.on)sk.hidden=false},60000);
  hdPzRestart();if(SA.n)saPaper&&saPaper()}
function hdPzRestart(){const d=$('#pz'),b=d.querySelector('.pb');if(PZ.cl){try{PZ.cl()}catch(e){}}PZ.cl=null;b.innerHTML='';d.querySelector('.msg').textContent='';d.querySelector('.mv').textContent='';d.classList.remove('ok');PZ.solved=0;
  const it=PZ.it,seed=(it.seed||1)*977+13;PZ.api={body:b,seed,rnd:rcRnd(seed),moves:0,msg:t=>{d.querySelector('.msg').textContent=t},mv:t=>{d.querySelector('.mv').textContent=t},win:()=>hdPzWin()};
  PZ.cl=PZ.def.build(PZ.api)||null}
function hdPzWin(){if(PZ.solved)return;PZ.solved=1;const d=$('#pz');d.classList.add('ok');d.querySelector('.msg').textContent='انفتح القفل...';if(SA.n){saChime&&saChime();setTimeout(()=>saDoor&&saDoor(),250)}stFlash&&stFlash(.5,'#ffe0a0');setTimeout(()=>hdPzClose(1),1300)}
function hdPzClose(res){if(!PZ.on)return;PZ.on=0;clearTimeout(PZ.skT);if(PZ.cl){try{PZ.cl()}catch(e){}}PZ.cl=null;$('#pz').hidden=true;if(state==='puzzle')state='story';const it=PZ.it;PZ.it=null;keys={};
  if(res){it.solved=1;emPzSolved(it,res===2)}}
function hdPzHint(){const A=PZ.api,R=EM;if(!PZ.on||PZ.solved||!A||!A.hint)return;if(R.E<10){A.msg('الجمر ضعيف... اشرب من عرق جمر أو اقترب من نار أول.');return}if(A.hint()!==false){R.E=Math.max(0,R.E-10);if(SA.n)saChime&&saChime();stFlash&&stFlash(.2,'#ffc070')}}
function hdPzKey(c){if(c==='Escape')hdPzClose(0)}
/* ---------- أدوات ---------- */
const pzRint=(r,n)=>Math.floor(r()*n);
const pzEl=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const PZ_AR='٠١٢٣٤٥٦٧٨٩';const pzAr=n=>String(n).split('').map(c=>PZ_AR[+c]).join('');
/* ====== 1) أنوار الختم: 5×5، الضغط يبدّل الخلية وجيرانها الأربعة ====== */
function pzLightsGen(r,n,presses){const set=new Set();while(set.size<presses)set.add(pzRint(r,n*n));const g=Array(n*n).fill(0);
  const tog=(i,gg)=>{const x=i%n,y=(i/n)|0;for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<n&&b<n)gg[b*n+a]^=1}};
  set.forEach(i=>tog(i,g));return{g,sol:[...set],tog}}
function pzLights(A){const n=4,{g,sol,tog}=pzLightsGen(A.rnd,n,5),pr=Array(n*n).fill(0);const lamps=[];
  const grid=pzEl('div','lg');grid.style.gridTemplateColumns=`repeat(${n},auto)`;
  const paint=()=>{lamps.forEach((b,i)=>b.classList.toggle('on',!!g[i]));A.mv('الحركات: '+pzAr(A.moves)+' · مضاءة: '+pzAr(g.reduce((a,b)=>a+b,0)))};
  for(let i=0;i<n*n;i++){const b=pzEl('button');b.type='button';b.onclick=()=>{if(PZ.solved)return;tog(i,g);pr[i]^=1;A.moves++;if(SA.n)saTone&&saTone(300+g[i]*160,420,.1,'triangle',.08);paint();if(g.every(v=>!v))A.win()};lamps.push(b);grid.appendChild(b)}
  A.body.appendChild(grid);paint();A.sol=sol;A.g=g;A.lamps=lamps;A.hint=()=>{const need=[];for(let i=0;i<n*n;i++)if((sol.includes(i)?1:0)^pr[i])need.push(i);if(!need.length)return false;const i=need[0];lamps.forEach(l=>l.classList.remove('hint'));lamps[i].classList.add('hint');setTimeout(()=>lamps[i].classList.remove('hint'),3500);A.msg('الجمر يشير إلى الخلية المحدّدة: اضغطها.')};A.msg('اضغط خلية فتنقلب هي وجاراتها الأربع. أطفئ كل الأنوار.')}
/* ====== 2) مجرى الجمر: أدِر القطع لتصل النار إلى كل العقد ====== */
function pzPipesGen(r,n){const m=Array(n*n).fill(0),seen=Array(n*n).fill(0),B=[1,2,4,8],DX=[0,1,0,-1],DY=[-1,0,1,0];let s=pzRint(r,n*n);seen[s]=1;const fr=[s];
  const edges=[];const open=[];const addF=i=>{for(let d=0;d<4;d++){const x=(i%n)+DX[d],y=((i/n)|0)+DY[d];if(x>=0&&y>=0&&x<n&&y<n&&!seen[y*n+x])open.push([i,y*n+x,d])}};addF(s);
  while(open.length){const k=pzRint(r,open.length),[a,b,d]=open.splice(k,1)[0];if(seen[b])continue;seen[b]=1;m[a]|=B[d];m[b]|=B[(d+2)%4];addF(b)}
  return{m,src:s}}
const pzRot=m=>((m<<1)|(m>>3))&15;
function pzPipesCheck(cur,n,src){const DX=[0,1,0,-1],DY=[-1,0,1,0],B=[1,2,4,8];let ok=true;const lit=Array(n*n).fill(0);
  for(let i=0;i<n*n;i++)for(let d=0;d<4;d++)if(cur[i]&B[d]){const x=(i%n)+DX[d],y=((i/n)|0)+DY[d];if(x<0||y<0||x>=n||y>=n||!(cur[y*n+x]&B[(d+2)%4]))ok=false}
  const q=[src];lit[src]=1;while(q.length){const i=q.pop();for(let d=0;d<4;d++)if(cur[i]&B[d]){const x=(i%n)+DX[d],y=((i/n)|0)+DY[d];if(x>=0&&y>=0&&x<n&&y<n&&(cur[y*n+x]&B[(d+2)%4])&&!lit[y*n+x]){lit[y*n+x]=1;q.push(y*n+x)}}}
  return{ok:ok&&lit.every(v=>v),lit}}
function pzPipes(A){const n=5,{m,src}=pzPipesGen(A.rnd,n),cur=m.map(v=>{let k=pzRint(A.rnd,4);while(k--)v=pzRot(v);return v});if(pzPipesCheck(cur,n,src).ok){cur[(src+1)%(n*n)]=pzRot(cur[(src+1)%(n*n)])}
  const S=56,c=pzEl('canvas');c.width=c.height=n*S;c.style.width='min(88vw,58vh,470px)';const q=c.getContext('2d');A.cur=cur;A.src=src;A.n=n;A.solm=m;
  const draw=()=>{const ck=pzPipesCheck(cur,n,src);q.clearRect(0,0,c.width,c.height);q.fillStyle='#0a0605';q.fillRect(0,0,c.width,c.height);
    for(let i=0;i<n*n;i++){const x=(i%n)*S,y=((i/n)|0)*S,lit=ck.lit[i];q.fillStyle=(i%n+((i/n)|0))%2?'#140c08':'#190f0a';q.fillRect(x,y,S,S);q.strokeStyle='#2a1a10';q.strokeRect(x+.5,y+.5,S-1,S-1);
      q.lineCap='round';for(const[w,col]of[[11,lit?'#6a2a0a':'#2a2220'],[5,lit?'#ffb040':'#5a4a40']]){q.strokeStyle=col;q.lineWidth=w;q.beginPath();const cx=x+S/2,cy=y+S/2;for(let d=0;d<4;d++)if(cur[i]&(1<<d)){q.moveTo(cx,cy);q.lineTo(cx+[0,1,0,-1][d]*S/2,cy+[-1,0,1,0][d]*S/2)}q.stroke()}
      q.fillStyle=lit?'#ffe9a0':'#6a5a4a';q.beginPath();q.arc(x+S/2,y+S/2,i===src?10:4.5,0,7);q.fill();if(i===src){q.strokeStyle='#ff7a20';q.lineWidth=3;q.stroke()}}
    A.mv('الحركات: '+pzAr(A.moves)+' · موصولة: '+pzAr(ck.lit.reduce((a,b)=>a+b,0))+'/'+pzAr(n*n));if(ck.ok)A.win()};
  c.onpointerdown=e=>{if(PZ.solved)return;const r=c.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*n),y=Math.floor((e.clientY-r.top)/r.height*n);if(x<0||y<0||x>=n||y>=n)return;cur[y*n+x]=pzRot(cur[y*n+x]);A.moves++;if(SA.n)saTone&&saTone(240,300,.07,'square',.05);draw()};
  A.hint=()=>{for(let i=0;i<n*n;i++)if(cur[i]!==A.solm[i]){let k=0;while(cur[i]!==A.solm[i]&&k++<4)cur[i]=pzRot(cur[i]);A.moves++;draw();return}return false};A.body.appendChild(c);draw();A.msg('اضغط القطعة لتدويرها. صِل نار المركز بكل العقد دون أطراف مفتوحة.')}
/* ====== 3) لوحة الذاكرة: انزلاق 4×4 ====== */
function pzSlideGen(r,n,steps){const t=[];for(let i=1;i<n*n;i++)t.push(i);t.push(0);let b=n*n-1,last=-1;
  for(let s=0;s<steps;s++){const x=b%n,y=(b/n)|0,nb=[];if(x>0)nb.push(b-1);if(x<n-1)nb.push(b+1);if(y>0)nb.push(b-n);if(y<n-1)nb.push(b+n);const c=nb.filter(v=>v!==last),p=c[pzRint(r,c.length)];t[b]=t[p];t[p]=0;last=b;b=p}return t}
function pzSlideSolve(t,n){const goal=t.map((v,i)=>i===n*n-1?0:i+1).join(),start=t.join();if(start===goal)return null;const par=new Map([[start,null]]);let q=[t.slice()];while(q.length){const nx=[];for(const s of q){const bl=s.indexOf(0),x=bl%n,y=(bl/n)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a<0||b<0||a>=n||b>=n)continue;const p=b*n+a,u=s.slice();u[bl]=u[p];u[p]=0;const k=u.join();if(par.has(k))continue;par.set(k,[s.join(),p]);if(k===goal){let cur=k,mv=null;while(par.get(cur)){const[pk,pp]=par.get(cur);mv=pp;cur=pk}return mv}nx.push(u)}}q=nx}return null}
function pzSlide(A){const n=3,t=pzSlideGen(A.rnd,n,70),g=pzEl('div','sl');g.style.gridTemplateColumns=`repeat(${n},auto)`;A.t=t;const bs=[];
  const paint=()=>{t.forEach((v,i)=>{const b=bs[i];b.textContent=v?pzAr(v):'';b.className=v?(v===i+1?'ok':''):'bl'});A.mv('الحركات: '+pzAr(A.moves))};
  const solved=()=>t.every((v,i)=>i===n*n-1?v===0:v===i+1);
  for(let i=0;i<n*n;i++){const b=pzEl('button');b.type='button';b.onclick=()=>{if(PZ.solved)return;const bl=t.indexOf(0),x=i%n,y=(i/n)|0,bx=bl%n,by=(bl/n)|0;
    if(x===bx&&y!==by){const st=y<by?n:-n;for(let p=bl;p!==i;p-=st)t[p]=t[p-st];t[i]=0;A.moves++}else if(y===by&&x!==bx){const st=x<bx?1:-1;for(let p=bl;p!==i;p-=st)t[p]=t[p-st];t[i]=0;A.moves++}else return;
    if(SA.n)saTone&&saTone(180,220,.06,'square',.06);paint();if(solved())A.win()};bs.push(b);g.appendChild(b)}
  A.hint=()=>{const mv=pzSlideSolve(t,n);if(mv===null||mv===undefined)return false;bs.forEach(x=>{x.style.outline=''});const b=bs[mv];b.style.outline='3px dashed #9affc0';setTimeout(()=>{b.style.outline=''},3500);A.msg('الجمر يشير إلى اللوح المحدّد: اضغطه.')};A.body.appendChild(g);paint();A.msg('رتّب اللوح من ١ إلى ٨ والفراغ في الزاوية السفلى. اضغط أي لوح في صف أو عمود الفراغ.')}
/* ====== 4) أبراج الصمت: هانوي بخمسة أقراص ====== */
function pzHanoi(A){const N=4,pegs=[[4,3,2,1],[],[]];let sel=-1;const box=pzEl('div','hn'),els=[];
  const cols=['#ff5a4a','#ffa23a','#ffd24a','#7ad06a','#5aa8ff'];
  const paint=()=>{els.forEach((p,i)=>{p.innerHTML='';p.classList.toggle('sel',i===sel);pegs[i].forEach(dv=>{const d=pzEl('div','dk');d.style.width=(30+dv*13)+'%';d.style.background=`linear-gradient(180deg,${cols[dv-1]},#00000055)`;p.appendChild(d)})});A.mv('الحركات: '+pzAr(A.moves)+' (الأقل ١٥)')};
  for(let i=0;i<3;i++){const p=pzEl('div','pg');p.onclick=()=>{if(PZ.solved)return;if(sel<0){if(pegs[i].length)sel=i}else{if(sel!==i){const a=pegs[sel],b=pegs[i],dv=a[a.length-1];if(!b.length||b[b.length-1]>dv){b.push(a.pop());A.moves++;if(SA.n)saTone&&saTone(260,200,.08,'triangle',.07)}else A.msg('لا يوضع قرص كبير على صغير.')}sel=-1}paint();if(pegs[2].length===N)A.win()};els.push(p);box.appendChild(p)}
  A.hint=()=>{const where=d=>{for(let i=0;i<3;i++)if(pegs[i].includes(d))return i};const st=[];for(let d=1;d<=N;d++)st.push(where(d));const goal=Array(N).fill(2).join(),start=st.join();if(start===goal)return false;const par=new Map([[start,null]]);let q=[st];let mv=null;outer:while(q.length){const nx=[];for(const s of q){const tops=[-1,-1,-1];for(let d=N;d>=1;d--)tops[s[d-1]]=d;for(let a=0;a<3;a++){const dv=tops[a];if(dv<0)continue;for(let b=0;b<3;b++){if(a===b)continue;if(tops[b]>=0&&tops[b]<dv)continue;const u=s.slice();u[dv-1]=b;const k=u.join();if(par.has(k))continue;par.set(k,[s.join(),a,b]);if(k===goal){let cur=k;while(par.get(cur)){const[pk,pa,pb]=par.get(cur);mv=[pa,pb];cur=pk}break outer}nx.push(u)}}}q=nx}if(!mv)return false;sel=-1;paint();els[mv[0]].classList.add('sel');A.msg('انقل القرص العلوي من العمود الأول المضاء إلى العمود '+(['الأيسر','الأوسط','الأيمن'][mv[1]]))};A.body.appendChild(box);paint();A.msg('انقل الأقراص الأربعة إلى العمود الأيمن: قرص واحد كل مرة، ولا كبير فوق صغير.')}
/* ====== 5) قفل الكتبة: استنتاج الشفرة من محاولات سابقة ====== */
function pzScore(secret,g){let a=0,b=0;for(let i=0;i<4;i++){if(secret[i]===g[i])a++;else if(secret.includes(g[i]))b++}return[a,b]}
function pzCodeGen(r){const all=[];for(let a=0;a<6;a++)for(let b=0;b<6;b++)if(b!==a)for(let c=0;c<6;c++)if(c!==a&&c!==b)for(let d=0;d<6;d++)if(d!==a&&d!==b&&d!==c)all.push([a,b,c,d]);
  const secret=all[pzRint(r,all.length)];let cand=all.slice(),cl=[];
  for(let it=0;it<9&&cand.length>1;it++){let best=null,bs=1e9;for(let k=0;k<14;k++){const g=all[pzRint(r,all.length)];if(cl.some(c=>c.g.join()===g.join())||g.join()===secret.join())continue;const f=pzScore(secret,g),n=cand.filter(c=>{const s=pzScore(c,g);return s[0]===f[0]&&s[1]===f[1]}).length;if(n<bs){bs=n;best={g,f}}}
    if(!best)break;cl.push(best);cand=cand.filter(c=>{const s=pzScore(c,best.g);return s[0]===best.f[0]&&s[1]===best.f[1]})}
  return{secret,clues:cl,left:cand.length}}
function pzCode(A){const G=pzCodeGen(A.rnd);A.secret=G.secret;A.clues=G.clues;const box=pzEl('div','cd'),hist=pzEl('div','hist'),cur=pzEl('div','row cur'),pal=pzEl('div','pal'),go=pzEl('button','bt','جرّب هذه الشفرة');go.type='button';let slots=[];
  const gem=(v,small)=>{const e=pzEl('div','gm',pzAr(v+1));e.style.background=`radial-gradient(circle at 35% 30%,#fff9,${PZ_GEM[v]} 55%)`;return e};
  const addRow=(g,f,cls)=>{const r=pzEl('div','row');g.forEach(v=>r.appendChild(gem(v)));const fb=pzEl('div','fb');for(let i=0;i<f[0];i++){const k=pzEl('i');k.style.background='#ffd070';fb.appendChild(k)}for(let i=0;i<f[1];i++){const k=pzEl('i');k.style.border='2px solid #ffd070';fb.appendChild(k)}if(!f[0]&&!f[1])fb.textContent='لا شيء';r.appendChild(fb);hist.appendChild(r)};
  G.clues.forEach(c=>addRow(c.g,c.f));
  const paintCur=()=>{cur.innerHTML='';for(let i=0;i<4;i++){const b=pzEl('button');b.type='button';if(slots[i]!==undefined){const e=gem(slots[i]);b.appendChild(e)}else{const e=pzEl('div','gm','·');e.style.background='#2a1a12';e.style.color='#6a4a38';b.appendChild(e)}b.style.background='none';b.style.border='0';b.onclick=()=>{slots.splice(i,1);paintCur()};cur.appendChild(b)}};
  for(let v=0;v<6;v++){const b=pzEl('button');b.type='button';b.style.background='none';b.style.border='0';b.appendChild(gem(v));b.onclick=()=>{if(PZ.solved||slots.length>=4||slots.includes(v))return;slots.push(v);paintCur()};pal.appendChild(b)}
  go.onclick=()=>{if(PZ.solved||slots.length<4)return;const f=pzScore(G.secret,slots);A.moves++;if(f[0]===4){A.win();return}addRow(slots.slice(),f);hist.scrollTop=hist.scrollHeight;slots=[];paintCur();A.mv('المحاولات: '+pzAr(A.moves));if(SA.n)saTone&&saTone(160,120,.14,'sawtooth',.06)};
  box.append(hist,cur,pal,go);A.body.appendChild(box);paintCur();A.msg('الشفرة أربع جواهر مختلفة. ● في مكانها · ○ موجودة في مكان آخر. استنتجها من المحاولات.');A.go=go;A.hints=0;A.hint=()=>{if(A.hints>=3)return false;const p=A.hints++;A.msg(`الجمر يهمس: الجوهرة رقم ${pzAr(p+1)} (من اليسار) هي ${pzAr(G.secret[p]+1)}.`)};A.set=v=>{slots=v.slice();paintCur()}}
/* ====== 6) ممرّ الضوء: دوّر المرايا ليمرّ الشعاع على كل البلّورات ====== */
const PZ_DIR=[[1,0],[0,-1],[-1,0],[0,1]];
function pzMirrorSim(P){const{n,sr,mir,rocks,crys}=P;let x=0,y=sr,dx=1,dy=0;const path=[[-.5,sr]],hit=new Set();
  for(let s=0;s<120;s++){if(x<0||y<0||x>=n||y>=n)break;const k=y*n+x;if(rocks.has(k)){break}path.push([x,y]);if(crys.has(k))hit.add(k);if(mir.has(k)){const o=mir.get(k);const ndx=o?-dy:dy,ndy=o?-dx:dx;dx=ndx;dy=ndy}x+=dx;y+=dy}path.push([x,y]);return{path,hit}}
function pzMirrorGen(r){const n=7;for(let tries=0;tries<400;tries++){const sr=1+pzRint(r,n-2),vis=new Set();let x=0,y=sr,dx=1,dy=0;const mir=new Map(),segs=[];vis.add(y*n+x);let turns=0,ok=true,cells=[[x,y]];
    for(let seg=0;seg<9&&ok;seg++){const maxL=(()=>{let L=0,xx=x,yy=y;while(true){xx+=dx;yy+=dy;if(xx<0||yy<0||xx>=n||yy>=n||vis.has(yy*n+xx))break;L++}return L})();
      if(seg>=5||maxL<1){break}const L=1+pzRint(r,Math.min(maxL,4));for(let i=0;i<L;i++){x+=dx;y+=dy;vis.add(y*n+x);cells.push([x,y])}
      const turnLeft=r()<.5;let ndx,ndy;if(dx!==0){ndx=0;ndy=turnLeft?-1:1}else{ndy=0;ndx=turnLeft?-1:1}
      const nx=x+ndx,ny=y+ndy;if(nx<0||ny<0||nx>=n||ny>=n||vis.has(ny*n+nx)){if(turns>=3)break;ok=false;break}
      /* المرآة عند (x,y): '/'=0 يحوّل (dx,dy)->(dy,dx)؟ نحسبها بالمحاكاة */
      let o=-1;for(const cand of[0,1]){const t1=cand?[-dy,-dx]:[dy,dx];if(t1[0]===ndx&&t1[1]===ndy)o=cand}if(o<0){ok=false;break}mir.set(y*n+x,o);dx=ndx;dy=ndy;turns++}
    if(!ok||turns<3)continue;
    /* الخروج من الحافة: امدد حتى الحدّ إن أمكن */
    while(true){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=n||yy>=n)break;if(vis.has(yy*n+xx)){ok=false;break}x=xx;y=yy;vis.add(y*n+x);cells.push([x,y])}if(!ok)continue;
    const free=cells.filter(c=>!mir.has(c[1]*n+c[0])&&!(c[0]===0));if(free.length<4)continue;
    const crys=new Set();const last=cells[cells.length-1];crys.add(last[1]*n+last[0]);while(crys.size<3){const c=free[pzRint(r,free.length)];crys.add(c[1]*n+c[0])}
    const sol=new Map(mir);const rocks=new Set(),decoy=[];let guard=0;while(decoy.length<2&&guard++<80){const c=pzRint(r,n*n),cx=c%n,cy=(c/n)|0;if(vis.has(c)||mir.has(c)||cx===0)continue;decoy.push(c)}
    decoy.forEach(c=>mir.set(c,pzRint(r,2)));let kr=0;guard=0;while(kr<2&&guard++<120){const c=pzRint(r,n*n),cx=c%n;if(vis.has(c)||mir.has(c)||rocks.has(c)||cx===0)continue;rocks.add(c);kr++}
    const P={n,sr,mir,rocks,crys,sol,solSet:new Set(sol.keys())};
    /* تشويش مرايا المسار: خلاف الحل */
    for(const k of sol.keys())mir.set(k,pzRint(r,2));const ss=pzMirrorSim(P);if(ss.hit.size===crys.size){const k=[...sol.keys()][0];mir.set(k,mir.get(k)^1)}
    /* تحقّق: الحل يعمل */const keep=new Map(mir);for(const[k,v]of sol)mir.set(k,v);const ok2=pzMirrorSim(P).hit.size===crys.size;P.mir=keep;if(!ok2)continue;P.solved=sol;return P}
  return null}
function pzMirror(A){let P=null;for(let k=0;k<20&&!P;k++)P=pzMirrorGen(A.rnd);if(!P){A.msg('تعذّر توليد اللغز');return}A.P=P;const n=P.n,S=60,c=pzEl('canvas');c.width=c.height=n*S+S;c.style.width='min(88vw,58vh,500px)';const q=c.getContext('2d'),oX=S/2,oY=S/2;
  const draw=()=>{const sim=pzMirrorSim(P);q.clearRect(0,0,c.width,c.height);q.fillStyle='#0a0605';q.fillRect(0,0,c.width,c.height);
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){const k=y*n+x,px=oX+x*S,py=oY+y*S;q.fillStyle=(x+y)%2?'#140c08':'#190f0a';q.fillRect(px,py,S,S);q.strokeStyle='#2a1a10';q.strokeRect(px+.5,py+.5,S-1,S-1);
      if(P.rocks.has(k)){q.fillStyle='#3a322c';q.beginPath();q.moveTo(px+8,py+S-8);q.lineTo(px+14,py+12);q.lineTo(px+S-14,py+10);q.lineTo(px+S-8,py+S-10);q.closePath();q.fill();q.fillStyle='#4e463e';q.fillRect(px+14,py+14,10,6)}}
    /* الشعاع */q.save();q.lineCap='round';q.lineJoin='round';for(const[w,col]of[[10,'rgba(255,140,40,.25)'],[4,'rgba(255,210,120,.9)'],[1.6,'#fff']]){q.strokeStyle=col;q.lineWidth=w;q.beginPath();sim.path.forEach((p,i)=>{const X=oX+(p[0]+.5)*S,Y=oY+(p[1]+.5)*S;i?q.lineTo(X,Y):q.moveTo(X,Y)});q.stroke()}q.restore();
    for(const k of P.crys){const x=k%n,y=(k/n)|0,cx=oX+x*S+S/2,cy=oY+y*S+S/2,lit=sim.hit.has(k);q.fillStyle=lit?'#fff2b0':'#3a2c4a';q.strokeStyle=lit?'#ffb040':'#7a5aa0';q.lineWidth=2;q.beginPath();q.moveTo(cx,cy-16);q.lineTo(cx+12,cy);q.lineTo(cx,cy+16);q.lineTo(cx-12,cy);q.closePath();q.fill();q.stroke();if(lit){const g=q.createRadialGradient(cx,cy,2,cx,cy,34);g.addColorStop(0,'rgba(255,220,130,.6)');g.addColorStop(1,'rgba(255,160,60,0)');q.fillStyle=g;q.fillRect(cx-34,cy-34,68,68)}}
    for(const[k,o]of P.mir){const x=k%n,y=(k/n)|0,cx=oX+x*S+S/2,cy=oY+y*S+S/2;q.strokeStyle='#2a1c10';q.lineWidth=9;q.lineCap='round';q.beginPath();if(o){q.moveTo(cx-18,cy-18);q.lineTo(cx+18,cy+18)}else{q.moveTo(cx-18,cy+18);q.lineTo(cx+18,cy-18)}q.stroke();q.strokeStyle='#bfe0ff';q.lineWidth=4;q.stroke()}
    q.fillStyle='#ffb040';q.beginPath();q.moveTo(oX-14,oY+P.sr*S+S/2-12);q.lineTo(oX-2,oY+P.sr*S+S/2);q.lineTo(oX-14,oY+P.sr*S+S/2+12);q.closePath();q.fill();
    A.mv('البلّورات: '+pzAr(sim.hit.size)+'/'+pzAr(P.crys.size));if(sim.hit.size===P.crys.size)A.win()};
  c.onpointerdown=e=>{if(PZ.solved)return;const r=c.getBoundingClientRect(),sc=c.width/r.width,x=Math.floor(((e.clientX-r.left)*sc-oX)/S),y=Math.floor(((e.clientY-r.top)*sc-oY)/S);if(x<0||y<0||x>=n||y>=n)return;const k=y*n+x;if(!P.mir.has(k))return;P.mir.set(k,P.mir.get(k)^1);A.moves++;if(SA.n){saTone&&saTone(520,700,.1,'triangle',.08)}draw()};
  A.hint=()=>{for(const[k,v]of P.solved)if(P.mir.get(k)!==v){P.mir.set(k,v);A.moves++;draw();return}return false};A.body.appendChild(c);draw();A.msg('المرايا تنقلب بالضغط. مرّر الشعاع القادم من اليسار على كل البلّورات. بعض المرايا وهميّة تخرّب الطريق.')}
const PZ_DEFS={
  lights:{title:'قفل الأنوار',desc:'ختم قديم يرتبط بست عشرة شعلة. كل ضغطة تقلب شعلة وجاراتها الأربع. أطفئها كلها. (زر المساعدة يدلّك على الخطوة)',build:pzLights},
  pipes:{title:'مجرى الجمر',desc:'قنوات الجمر انكسرت وتبعثرت. أدِر القطع حتى تصل النار من المركز إلى كل عقدة.',build:pzPipes},
  slide:{title:'لوحة الذاكرة',desc:'لوحة منقوشة بذكريات أهل القلعة تفرّقت. أعد ترتيبها بالانزلاق.',build:pzSlide},
  hanoi:{title:'أبراج الصمت',desc:'أربعة أقراص من الرماد المصهور. انقلها إلى العمود الأخير بلا خطأ، وهي لعنة الملك الأول.',build:pzHanoi},
  code:{title:'قفل الكتبة',desc:'الأرشيفي ترك شفرة الخزنة، لكنه محاها وأبقى محاولاته. استنتجها.',build:pzCode},
  mirror:{title:'ممرّ الضوء',desc:'مصفوفة مرايا وبلّورات. الشعاع يدخل من اليسار. اجعله يضيء كل البلّورات.',build:pzMirror}};
/* ---------- نتيجة الحل ---------- */
function emPzSolved(it,skipped){const R=EM;R.pzDone=R.pzDone||{};R.pzDone[R.lv+':'+it.id]=1;
  if(it.flag){R.flags[it.flag]=1;const hh=R.en.find(e=>e.dorm&&e.st==='dorm');if(hh){hh.st='patrol';hh.dorm=false;const pp=emFloorRandom(9,[R.x,R.y]);hh.x=pp[0];hh.y=pp[1];if(SA.n)saBoom(.6);stWhisper('استيقظ…',2)}}
  emSaveProg();
  if(it.reward==='up'&&!skipped){R.up=Math.min(5,(R.up||0)+1);emSaveProg();stFlash(.6,'#ffe9a0');saChime&&saChime();toast(`ترقية الوهج ${R.up}/5: تكلفته ${emFlareCost()} وإضاءته أوسع`,'#ffe9a0',true)}
  else if(skipped)toast('تجاوزت القفل... بلا مكافأة','#c9a070',true);
  else toast('انفتح القفل','#ffd890',true);
  if(it.flag&&emGoalDone())setTimeout(()=>hdDoorBeat(),900)}
window.__pz={PZ,PZ_DEFS,pzLightsGen,pzPipesGen,pzPipesCheck,pzRot,pzSlideGen,pzCodeGen,pzScore,pzMirrorGen,pzMirrorSim,hdPzOpen,hdPzClose,hdPzRestart};
