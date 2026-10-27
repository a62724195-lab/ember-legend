/* ---------- direct WebRTC link (no server, no account): players swap two text codes ---------- */
const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478']},{urls:['turn:openrelay.metered.ca:80','turn:openrelay.metered.ca:443','turn:openrelay.metered.ca:443?transport=tcp'],username:'openrelayproject',credential:'openrelayproject'}]};
async function codeEnc(str){
  if(typeof CompressionStream==='function'){const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(new TextEncoder().encode(str));w.close();
    const buf=new Uint8Array(await new Response(cs.readable).arrayBuffer());let b='';buf.forEach(c=>b+=String.fromCharCode(c));return 'Z'+btoa(b)}
  return 'P'+btoa(unescape(encodeURIComponent(str)))}
async function codeDec(s){
  s=(s||'').trim().replace(/\s+/g,'');const t=s[0],b=atob(s.slice(1));
  if(t==='Z'){const u=Uint8Array.from(b,c=>c.charCodeAt(0)),ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u);w.close();return new TextDecoder().decode(await new Response(ds.readable).arrayBuffer())}
  return decodeURIComponent(escape(b))}
const gathered=pc=>new Promise(res=>{if(pc.iceGatheringState==='complete')return res();const t=setTimeout(res,5000);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(t);res()}})});
/* a link exposes the same surface as the claude.ai "room": emit/on/presence/peers/connected/leave */
function mkLink(pc){
  const L={},mine={},dcs={};let other=null,opened=0,cur,resolveOpen;const id='me'+Math.random().toString(36).slice(2,8);
  const rebuild=()=>{const a=[{peer:id,sameTab:true,isMe:true,kind:'viewer',guest:false,by:null,presence:mine,updatedAt:Date.now()}];if(other)a.push(other);cur=Object.freeze(a)};rebuild();
  const send=(k,m)=>{const dc=dcs[k];if(dc&&dc.readyState==='open'){try{dc.send(m)}catch(e){}}};
  const opened_=new Promise(r=>resolveOpen=r);
  const room={emit:async(t,d)=>{send(t==='s'?'u':'r',JSON.stringify({k:'ev',t,d}))},
    on:(t,f)=>{(L[t]=L[t]||[]).push(f);return()=>{L[t]=(L[t]||[]).filter(x=>x!==f)}},
    presence:async p=>{Object.assign(mine,p);send('u',JSON.stringify({k:'pr',p:mine}))},
    peers:()=>cur,onPeers:()=>()=>{},connected:()=>opened>=2&&pc.connectionState!=='failed'&&pc.connectionState!=='closed'&&pc.connectionState!=='disconnected',onConnection:()=>()=>{},
    leave:async()=>{try{pc.close()}catch(e){}}};
  const onMsg=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}
    if(m.k==='pr'){other={peer:'friend',sameTab:false,isMe:false,kind:'viewer',guest:false,by:null,presence:m.p,updatedAt:Date.now()};rebuild()}
    else if(m.k==='ev')(L[m.t]||[]).forEach(f=>f({topic:m.t,data:m.d,peer:'friend',by:null,isMe:false,sameTab:false,kind:'viewer',guest:false}))};
  const bind=(dc,k)=>{dcs[k]=dc;dc.onmessage=onMsg;dc.onopen=()=>{opened++;if(opened>=2)resolveOpen(true)};dc.onclose=()=>{opened=Math.max(0,opened-1);other=null;rebuild()}};
  pc.addEventListener('connectionstatechange',()=>{if(['failed','closed','disconnected'].includes(pc.connectionState)){other=null;rebuild()}});
  return{room,bind,opened:opened_,pc,isP2P:true}}
async function p2pHostStart(){
  const pc=new RTCPeerConnection(ICE),link=mkLink(pc);
  link.bind(pc.createDataChannel('r'),'r');link.bind(pc.createDataChannel('u',{ordered:false,maxRetransmits:0}),'u');
  await pc.setLocalDescription(await pc.createOffer());await gathered(pc);
  link.code=await codeEnc(JSON.stringify(pc.localDescription));return link}
async function p2pGuestAnswer(offer){
  const pc=new RTCPeerConnection(ICE),link=mkLink(pc);pc.ondatachannel=e=>link.bind(e.channel,e.channel.label==='u'?'u':'r');
  await pc.setRemoteDescription(JSON.parse(await codeDec(offer)));await pc.setLocalDescription(await pc.createAnswer());await gathered(pc);
  link.code=await codeEnc(JSON.stringify(pc.localDescription));return link}
async function p2pHostFinish(link,answer){await link.pc.setRemoteDescription(JSON.parse(await codeDec(answer)))}
const waitLink=(link,ms)=>Promise.race([link.opened,new Promise(r=>setTimeout(()=>r(false),ms))]);
/* ---------- direct-link lobby UI ---------- */
let LINK=null;
function dMode(m){$('#cHome').hidden=true;$('#cDirect').hidden=false;$('#dHost').hidden=m!=='host';$('#dGuest').hidden=m!=='guest'}
function dDone(role){$('#coop').hidden=true;NET.p2p=true;netAttach(role,'مباشر',LINK.room);uiNet();
  if(role==='guest'){$('#title').hidden=false;$('#coop').hidden=false;$('#cDirect').hidden=true;$('#cGuestWait').hidden=false;netStatus('تم الاتصال! ننتظر المضيف يبدأ اللعب…')}
  else{$('#coop').hidden=false;$('#cDirect').hidden=true;$('#cHost').hidden=false;$('#cCodeBig').textContent='متصل';$('#cCopy').hidden=true;netStatus('صديقك متصل. ابدأ اللعب وهو ينزل عندك.')}}
$('#dHostBtn').onclick=async()=>{nameOk();dMode('host');netStatus('نجهّز الدعوة…');try{LINK=await p2pHostStart();$('#dOffer').value=LINK.code;netStatus('أرسل النص لصديقك، ولما يرد عليك الصقه تحت.')}catch(e){netStatus('تعذّر إنشاء الاتصال: '+e,true)}};
$('#dGuestBtn').onclick=()=>{nameOk();dMode('guest');netStatus('الصق النص اللي أرسله لك المضيف.')};
$('#dCopyOffer').onclick=()=>{try{navigator.clipboard.writeText($('#dOffer').value)}catch(e){$('#dOffer').select();document.execCommand('copy')}netStatus('تم النسخ. أرسله لصديقك.')};
$('#dCopyAns').onclick=()=>{try{navigator.clipboard.writeText($('#dAns').value)}catch(e){$('#dAns').select();document.execCommand('copy')}netStatus('تم النسخ. أرسله للمضيف.')};
$('#dMake').onclick=async()=>{try{netStatus('نجهّز الرد…');LINK=await p2pGuestAnswer($('#dOfferIn').value);$('#dAns').value=LINK.code;netStatus('أرسل هذا الرد للمضيف وانتظر…');
  if(await waitLink(LINK,90000))dDone('guest');else netStatus('ما تم الاتصال. جرّب من جديد (أو شبكتك ما تسمح).',true)}catch(e){netStatus('النص غير صحيح: '+e,true)}};
$('#dConnect').onclick=async()=>{try{netStatus('نتصل…');await p2pHostFinish(LINK,$('#dAnsIn').value);if(await waitLink(LINK,30000))dDone('host');else netStatus('ما تم الاتصال. جرّب دعوة جديدة (أو الشبكة ما تسمح).',true)}catch(e){netStatus('الرد غير صحيح: '+e,true)}};
$('#dBack').onclick=()=>{try{LINK&&LINK.pc.close()}catch(e){}LINK=null;$('#cDirect').hidden=true;$('#cHome').hidden=false;netStatus('')};

/* ---------- automatic code rooms: free public pub/sub (ntfy.sh) used only to swap the WebRTC handshake ---------- */
const SIG=()=>window.__SIG||'https://ntfy.sh';
const rid=()=>Math.random().toString(36).slice(2,10);
function sigOpen(topic,onMsg){return new Promise((res,rej)=>{
  let ok=false,es;try{es=new EventSource(SIG()+'/'+topic+'/sse')}catch(e){rej(e);return}
  es.onopen=()=>{ok=true;res(es)};
  es.onmessage=e=>{try{const d=JSON.parse(e.data);if(d.event==='message')onMsg(JSON.parse(d.message))}catch(x){}};
  es.onerror=()=>{if(!ok){es.close();rej(new Error('sig'))}};
  setTimeout(()=>{if(!ok){es.close();rej(new Error('timeout'))}},9000)})}
const sigPub=(topic,o)=>fetch(SIG()+'/'+topic,{method:'POST',body:JSON.stringify(o)});
const SESS={es:null,pending:null};
function sigStop(){try{SESS.es&&SESS.es.close()}catch(e){}SESS.es=null;SESS.pending=null}
async function autoCreate(){
  nameOk();netClose(true);sigStop();netStatus('نفتح الغرفة…');
  const code=netCode(6),topic='ember-'+code.toLowerCase()+'g',hid=rid();let busy=false;
  try{SESS.es=await sigOpen(topic,async m=>{
    if(m.t==='join'&&!busy){busy=true;try{const link=await p2pHostStart();SESS.pending=link;await sigPub(topic,{t:'offer',to:m.id,from:hid,sdp:link.code});netStatus('صديقك يتصل…')}catch(e){busy=false}}
    else if(m.t==='answer'&&m.to===hid&&SESS.pending){const link=SESS.pending;try{await p2pHostFinish(link,m.sdp);if(await waitLink(link,25000)){LINK=link;sigStop();dDone('host')}else{busy=false;SESS.pending=null;netStatus('ما اكتمل الاتصال. صديقك يعيد المحاولة.',true)}}catch(e){busy=false;SESS.pending=null}}})}
  catch(e){netStatus('ما قدرت أتصل بخدمة الغرف (الإنترنت؟). استخدم الاتصال اليدوي تحت.',true);return}
  $('#cHome').hidden=true;$('#cHost').hidden=false;$('#cCodeBig').textContent=code;$('#cCopy').hidden=false;$('#cNew').hidden=state!=='title';$('#cCont').hidden=state!=='title';$('#cBackGame').hidden=state==='title';
  NET.pending=code;netStatus('الغرفة جاهزة. أعطِ صديقك الكود وهو يكتبه في "انضمام".')}
async function autoJoin(code){
  nameOk();netClose(true);sigStop();netStatus('نتصل بالغرفة…');
  const topic='ember-'+code.toLowerCase()+'g',gid=rid();let got=false;
  try{SESS.es=await sigOpen(topic,async m=>{
    if(m.t==='offer'&&m.to===gid&&!got){got=true;try{netStatus('نبني الاتصال…');const link=await p2pGuestAnswer(m.sdp);await sigPub(topic,{t:'answer',to:m.from,from:gid,sdp:link.code});
      if(await waitLink(link,25000)){LINK=link;sigStop();dDone('guest')}else{got=false;netStatus('ما اكتمل الاتصال. جرّب مرة ثانية.',true)}}catch(e){got=false;netStatus('تعذّر الاتصال: '+e,true)}}})}
  catch(e){netStatus('ما قدرت أتصل بخدمة الغرف (الإنترنت؟). استخدم الاتصال اليدوي تحت.',true);return}
  $('#cHome').hidden=true;$('#cGuestWait').hidden=false;
  await sigPub(topic,{t:'join',id:gid,nm:NET.name}).catch(()=>netStatus('تعذّر الإرسال',true));
  netStatus('ننتظر المضيف…');
  setTimeout(()=>{if(!got&&!NET.on){netStatus('ما لقيت المضيف. تأكد من الكود وأن المضيف فتح الغرفة.',true);$('#cGuestWait').hidden=true;$('#cHome').hidden=false;sigStop()}},30000)}
{const oc=$('#cCreate').onclick,oj=$('#cJoin').onclick;
 $('#cCreate').onclick=()=>netAvail()?oc():autoCreate();
 $('#cJoin').onclick=()=>{if(netAvail())return oj();const code=($('#cCode').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4){netStatus('اكتب كود الغرفة',true);return}autoJoin(code)}}
