/* ---------- world generation (deterministic per chapter) + ground baking ---------- */
const SOLID=[0,1,1,1,0,1,0];  // 0 floor,1 prop,2 wall,3 liquid,4 path,5 gate,6 arena floor
const POOLS=[[4,1,0],[1,2,2],[0,1,3],[0,0,0],[4,3,3]];
const FACE={cliff:['#a39c8a','#726b5e','#c4bdab'],cave:['#4a4654','#322e3a','#6a6478'],ruin:['#5d535d','#3a3238','#7a6f7a'],tomb:['#c8b080','#8e7a52','#e6d2a0'],ash:['#403840','#241e26','#5a505c']};
const WSTYLE=['cliff','cliff','cave','tomb','ash'];
const zoneIdx=(L,x,aX)=>{const f=x/aX;for(let i=0;i<L.zones.length;i++)if(f<=L.zones[i].to)return i;return L.zones.length-1};
function buildLevel(li,seed){
  const L=LV[li];MW=L.w;MH=L.h;const aX=MW-24,r=rng(seed*7919+li*131+17),sd=seed+li*13;
  const m=[],v=[];for(let y=0;y<MH;y++){m.push(new Array(MW).fill(0));v.push(new Array(MW).fill(0))}
  const ph1=r()*6.28,ph2=r()*6.28,A1=MH*.2,A2=MH*.07;
  const cyf=x=>{const t=clamp((x-4)/14,0,1)*clamp((aX-3-x)/12,0,1);return Math.round(clamp(MH/2+t*(A1*Math.sin(x/9+ph1)+A2*Math.sin(x/3.3+ph2)),9,MH-10))};
  const cy=new Array(MW).fill(0).map((_,x)=>cyf(x));
  const sp=[],spi=k=>{let i=sp.indexOf(k);if(i<0){i=sp.length;sp.push(k)}return i};
  const zi=(x,y)=>zoneIdx(L,x+(vnoise(y/6,x/9,sd)-.5)*7,aX);
  const bordProp=li<2,res=[];for(let y=0;y<MH;y++)res.push(new Uint8Array(MW));
  const pathD=(x,y)=>Math.abs(y-cy[clamp(x,0,MW-1)]);
  const inb=(x,y)=>x>=2&&y>=2&&x<MW-2&&y<MH-2;
  const pickW=(list,x,y,off)=>{let tot=0;const ws=list.map((e,i)=>{const w=e[1]*(.35+1.3*vnoise(x/6+i*13.7,y/6+off,sd+i));tot+=w;return w});let q=r()*tot;for(let i=0;i<list.length;i++){if((q-=ws[i])<0)return list[i][0]}return list[0][0]};
  /* arena */
  const aw=MW-2-aX,acy=cy[aX-4];
  for(let y=1;y<MH-1;y++){for(let x=aX+1;x<MW-1;x++){m[y][x]=6}m[y][aX]=2}
  for(let y=acy-2;y<=acy+1;y++)m[y][aX]=5;
  for(let y=1;y<MH-1;y++)for(let x=aX+1;x<MW-1;x++){const dx=(x-(aX+1+aw/2))/(aw/2),dy=(y-MH/2)/(MH/2-1);if(dx*dx+dy*dy>1.05)m[y][x]=2}
  /* borders */
  for(let x=0;x<MW;x++){m[0][x]=m[MH-1][x]=2;if(x<aX){m[1][x]=m[MH-2][x]=bordProp?1:2}}
  for(let y=0;y<MH;y++){m[y][0]=2;m[y][MW-1]=2;if(y>0&&y<MH-1)m[y][1]=bordProp?1:2}
  if(bordProp){const k0=L.zones[0].p[0][0];for(let y=1;y<MH-1;y++)for(let x=1;x<aX;x++)if(m[y][x]===1&&(x===1||y===1||y===MH-2)){const z=L.zones[zi(x,y)];v[y][x]=(spi(pickW(z.p.filter(e=>!['reeds','shrub','mushroom','log','thornBush','dryShrub'].includes(e[0])),x,y,3)||k0)<<4)|ri(0,15)}}
  /* path network */
  const clearBlob=(cx,cyy,rad,t)=>{for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){const x=cx+dx,y=cyy+dy;if(!inb(x,y)||x>=aX||dx*dx+dy*dy>rad*rad+(r()<.3?1:0))continue;if(m[y][x]===1||m[y][x]===2||m[y][x]===3||t!==null){m[y][x]=t===null?0:t;res[y][x]=1}}};
  for(let x=2;x<aX;x++)for(let d=-2;d<=2;d++){const y=cy[x]+d;if(inb(x,y)){m[y][x]=4;res[y][x]=1}}
  for(let x=2;x<aX;x++)for(let d=-4;d<=4;d++){const y=cy[x]+d;if(inb(x,y))res[y][x]=1}
  for(let dy=-5;dy<=5;dy++)for(let dx=-6;dx<=6;dx++)if(dx*dx/1.4+dy*dy<=26){const x=6+dx,y=cy[6]+dy;if(inb(x,y)){m[y][x]=4;res[y][x]=1}}
  for(let dy=-4;dy<=4;dy++)for(let dx=-5;dx<=0;dx++){const x=aX+dx,y=acy+dy;if(inb(x,y)){m[y][x]=4;res[y][x]=1}}
  /* bonfires + merchant spots */
  const bfX=[7,Math.round(aX*.34),Math.round(aX*.67),aX-5],bonfires=bfX.map((x,i)=>({x:x*T+8,y:(cy[x]+(i===0?3:-3))*T+8,i,lit:i===0}));
  bonfires.forEach(b=>clearBlob(Math.floor(b.x/T),Math.floor(b.y/T),3,null));
  /* mini-boss clearing */
  const mbX=Math.round(aX*.52),mbY=clamp(cy[mbX]+(r()<.5?-8:8),6,MH-7);
  const mbPath=[];for(let y=Math.min(mbY,cy[mbX]);y<=Math.max(mbY,cy[mbX]);y++)mbPath.push([mbX,y]);
  clearBlob(mbX,mbY,6,0);mbPath.forEach(([x,y])=>{for(let d=-1;d<=1;d++)if(inb(x+d,y)){m[y][x+d]=4;res[y][x+d]=1}});
  /* terrain: walls and pools */
  L.zones.forEach((z,i)=>{
    const x0=Math.round((i?L.zones[i-1].to:0)*aX),x1=Math.round(z.to*aX);
    const nw=Math.round((z.walls||0)*(x1-x0)/48);
    for(let k=0;k<nw;k++){const cx=ri(x0+3,x1-3),cyy=ri(4,MH-5),rad=ri(3,5);if(Math.abs(cyy-cy[cx])<rad+5||res[clamp(cyy,0,MH-1)][cx])continue;
      for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){const x=cx+dx,y=cyy+dy;if(!inb(x,y)||x>=aX||res[y][x]||dx*dx+dy*dy>rad*rad+(r()<.4?2:0))continue;m[y][x]=2}}
    const np=POOLS[li][i];
    for(let k=0;k<np;k++){let cx=0,cyy=0,ok=false,rad=ri(2,4);for(let t=0;t<30&&!ok;t++){cx=ri(x0+4,x1-4);cyy=ri(5,MH-6);ok=Math.abs(cyy-cy[cx])>rad+4&&!res[cyy][cx]&&m[cyy][cx]===0}
      if(!ok)continue;for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad-1;dx<=rad+1;dx++){const x=cx+dx,y=cyy+dy;if(!inb(x,y)||x>=aX||res[y][x])continue;if(dx*dx/1.5+dy*dy<=rad*rad+(r()<.35?1:0))m[y][x]=3}}
  });
  /* props: clustered by noise, species patches differ by location */
  const key=(x,y)=>{const z=L.zones[zi(x,y)];return z};
  for(let y=2;y<MH-2;y++)for(let x=2;x<aX;x++){
    if(m[y][x]!==0||res[y][x])continue;
    const z=key(x,y),n=fbm(x/8,y/8,sd),thr=.84-z.pd*.7;let placed=false;
    if(n>thr&&r()>.1){const k=pickW(z.p,x,y,1);
      if(k==='ancient'||k==='bigRock'){if(r()<.5&&m[y][x+1]===0&&!res[y][x+1]&&x+1<aX){m[y][x]=1;m[y][x+1]=1;v[y][x]=(spi(k)<<4)|ri(0,15);v[y][x+1]=-1;placed=true}}
      else{m[y][x]=1;v[y][x]=(spi(k)<<4)|ri(0,15);placed=true}}
    if(!placed&&r()<z.rd*.3){const k=pickW(z.r,x,y,2);m[y][x]=1;v[y][x]=(spi(k)<<4)|ri(0,15);
      if(r()<.35){const [ax,ay]=[[1,0],[-1,0],[0,1],[0,-1]][ri(0,3)];if(m[y+ay]&&m[y+ay][x+ax]===0&&!res[y+ay][x+ax]){m[y+ay][x+ax]=1;v[y+ay][x+ax]=(spi(pick(['rubbleSand','rubbleGrey']))<<4)|ri(0,15)}}}
    else if(!placed&&n>thr-.08&&r()<z.pd*.04){const k=pickW(z.p.concat(z.r),x,y,3);if(k!=='ancient'&&k!=='bigRock'){m[y][x]=1;v[y][x]=(spi(k)<<4)|ri(0,15)}}
  }
  /* arena dressing */
  const ax0=aX+4,ax1=MW-5,ay0=Math.round(MH/2-9),ay1=Math.round(MH/2+9);
  const ap=L.arena.props;[[ax0,ay0],[ax0,ay1],[ax1,ay0],[ax1,ay1],[ax0,Math.round(MH/2)],[ax1,Math.round(MH/2)]].forEach(([x,y],i)=>{if(m[y][x]===6){m[y][x]=1;v[y][x]=(spi(ap[i%ap.length][0])<<4)|ri(0,15)}});
  /* reachability */
  const reach=new Uint8Array(MW*MH),q=[[6,cy[6]]];reach[cy[6]*MW+6]=1;
  while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=MW||ny>=MH||reach[ny*MW+nx]||SOLID[m[ny][nx]])continue;reach[ny*MW+nx]=1;q.push([nx,ny])}}
  const freeAt=(x,y,rad=1)=>{for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=MW||yy>=MH||!reach[yy*MW+xx]||SOLID[m[yy][xx]])return false}return true};
  const taken=[...bonfires.map(b=>[b.x,b.y,40])];
  const near=(x,y,d)=>taken.some(t=>Math.hypot(t[0]-x,t[1]-y)<(d||t[2]));
  /* chests */
  const chests=[],tierPlan=[[0,.12],[1,.22],[1,.38],[2,.5],[2,.64],[3,.84]];
  tierPlan.forEach(([tier,f],i)=>{
    for(let t=0;t<200;t++){const x=ri(Math.round(aX*(f-.08)),Math.round(aX*(f+.08))),y=cy[clamp(x,0,MW-1)]+ri(4,11)*(r()<.5?-1:1);
      if(y<3||y>MH-4||!freeAt(x,y,1))continue;const px_=x*T+8,py_=y*T+8;if(near(px_,py_,48))continue;
      taken.push([px_,py_,48]);chests.push({x:px_,y:py_,tier,open:false,t:0,hid:pathD(x,y)>6});
      /* open a small nook path toward the chest so hidden chests are findable */
      const dir=y>cy[x]?-1:1;for(let yy=y;Math.abs(yy-cy[x])>3;yy+=dir){if(m[yy][x]===0)m[yy][x]=4}break}});
  /* breakables */
  const brks=[];for(let t=0,n=0;t<1500&&n<22+L.w/6;t++){const x=ri(4,aX-3),y=cy[x]+ri(-10,10);if(y<3||y>MH-4||!freeAt(x,y,0)||pathD(x,y)>11)continue;const px_=x*T+8,py_=y*T+8;if(near(px_,py_,22)||Math.hypot(px_-bonfires[0].x,py_-bonfires[0].y)<60)continue;
    taken.push([px_,py_,22]);brks.push({x:px_,y:py_,kind:pick(L.brk),hp:ri(1,2),dead:false,id:n,flash:0});n++}
  /* enemies in packs */
  const enemies=[];let eid=0;
  L.zones.forEach((z,i)=>{
    const x0=Math.round((i?L.zones[i-1].to:0)*aX)+2,x1=Math.round(z.to*aX)-2;
    z.en.forEach(([type,count,mult])=>{
      let left=Math.ceil(count*1.25);
      while(left>0){const size=Math.min(left,type==='scarab'||type==='bat'||type==='jackal'?ri(2,3):1+(r()<.25?1:0));
        let cx=0,cyy=0,ok=false;
        for(let t=0;t<120&&!ok;t++){cx=ri(x0,x1);cyy=cy[cx]+ri(-12,12);ok=cyy>3&&cyy<MH-4&&freeAt(cx,cyy,1)&&Math.hypot(cx*T-bonfires[0].x,cyy*T-bonfires[0].y)>190&&!bonfires.some(b=>Math.hypot(b.x-cx*T,b.y-cyy*T)<110)&&!(Math.abs(cx-mbX)<8&&Math.abs(cyy-mbY)<8)}
        if(!ok){left--;continue}
        for(let k=0;k<size;k++){const ex=cx*T+8+(k?ri(-14,14):0),ey=cyy*T+8+(k?ri(-14,14):0);
          const elite=i>0&&r()<.14;enemies.push({id:eid++,type,x:ex,y:ey,mult,elite,zone:i});left--}}
    })});
  const mini={id:eid++,type:L.mini,x:mbX*T+8,y:mbY*T+8,mult:LV[li].zones[1].en[0][2]*1.1,mini:true,zone:1};
  /* lights from glowing species */
  const boss={x:(aX+1+aw/2)*T,y:Math.round(MH/2)*T+8};
  return{L,li,m,v,sp,reach,chests,bonfires,enemies,mini,brks,cy,aX,acy,boss,seed,mbX,mbY,aw,zi:(x,y)=>zi(x,y)};
}

/* ---------- ground baking ---------- */
function drawDeco(c,k,x,y,h,pal){
  const px0=x*T,py0=y*T,a=pal,r=(i)=>((h*997*(i+1))%1),X=i=>px0+2+Math.floor(r(i)*11),Y=i=>py0+2+Math.floor(r(i+5)*11);
  const P=(xx,yy,w,hh,col)=>{c.fillStyle=col;c.fillRect(xx,yy,w,hh)};
  switch(k){
   case'tuft':case'grass':{const g=k==='tuft'?['#8a9a4a','#a8b85a']:['#3e7a3a','#5aa04a'];const x0=X(0),y0=Y(0);P(x0,y0-3,1,4,g[0]);P(x0+2,y0-4,1,5,g[1]);P(x0+4,y0-2,1,3,g[0]);P(x0-2,y0-2,1,3,g[1]);break}
   case'dry':{const x0=X(0),y0=Y(0);P(x0,y0-3,1,4,'#8a7a3a');P(x0+2,y0-2,1,3,'#a8964a');P(x0-2,y0-1,1,2,'#6a5a2a');break}
   case'pebble':{const x0=X(0),y0=Y(0);P(x0,y0,3,2,lite(a[0],-.28));P(x0,y0,2,1,lite(a[0],.2));P(x0+5,y0+3,2,1,lite(a[0],-.2));break}
   case'flower':{const x0=X(0),y0=Y(0),f=['#f4f0e0','#f0a0b8','#f2d24a','#d98aff'][(h*40|0)%4];P(x0,y0,1,3,'#4a7a2a');P(x0-1,y0-1,3,2,f);P(x0,y0-1,1,1,'#f2d24a');break}
   case'shell':{const x0=X(0),y0=Y(0);P(x0,y0,3,2,'#f0e6d0');P(x0+1,y0-1,1,1,'#fff');break}
   case'bone':{const x0=X(0),y0=Y(0);P(x0,y0,6,1,'#e8e0cc');P(x0-1,y0-1,2,3,'#e8e0cc');P(x0+5,y0-1,2,3,'#e8e0cc');break}
   case'crack':{const x0=X(0),y0=Y(0);c.fillStyle=lite(a[0],-.45);c.fillRect(x0,y0,4,1);c.fillRect(x0+3,y0+1,1,3);c.fillRect(x0+4,y0+3,3,1);c.fillRect(x0+1,y0-2,1,2);break}
   case'ember':{const x0=X(0),y0=Y(0);P(x0,y0,5,1,'#ff7a2f');P(x0+2,y0-2,1,5,'#ff7a2f');P(x0-1,y0-1,7,3,'#ff7a2f40');P(x0+2,y0,1,1,'#ffe0a0');break}
   case'moss':{const x0=X(0),y0=Y(0);P(x0,y0,5,3,'#3a6a3a');P(x0+1,y0-1,3,1,'#4f8a48');P(x0+3,y0+2,3,1,'#2c5a30');break}
   case'mush':{const x0=X(0),y0=Y(0),f=['#c490f0','#6ae0d0','#f0a050'][(h*30|0)%3];P(x0,y0,1,3,'#d8d0b8');P(x0-1,y0-1,3,2,f);P(x0+4,y0+2,1,2,'#d8d0b8');P(x0+3,y0+1,3,1,f);break}
   case'leaf':{const x0=X(0),y0=Y(0),f=['#c0602a','#e8a040','#8aa04a'][(h*30|0)%3];P(x0,y0,3,2,f);P(x0+3,y0+3,2,1,f);break}
   case'root':{const x0=X(0),y0=Y(0);P(x0,y0,6,1,'#4a3622');P(x0+2,y0+1,1,3,'#4a3622');P(x0+5,y0-1,1,2,'#5e4a30');break}
   case'crystal':{const x0=X(0),y0=Y(0),f=['#58d0ff','#e060d8','#58e080'][(h*30|0)%3];P(x0,y0-2,1,3,f);P(x0+1,y0-1,1,2,lite(f,.5));P(x0-1,y0,1,1,f);break}
   case'rail':{const x0=py0+4;P(px0,py0+5,T,1,'#6a4a2a');P(px0,py0+10,T,1,'#6a4a2a');for(let i=0;i<T;i+=4)P(px0+i,py0+4,2,8,'#4a3220');break}
   case'rune':{const x0=X(0),y0=Y(0);c.fillStyle=lite(a[0],-.35);c.fillRect(x0,y0,5,1);c.fillRect(x0+2,y0,1,5);c.fillRect(x0,y0+4,5,1);c.fillStyle='#ffd24a50';c.fillRect(x0+2,y0+2,1,1);break}
   case'gold':{const x0=X(0),y0=Y(0);P(x0,y0,2,2,'#e8b64a');P(x0+4,y0+2,2,2,'#f6d070');P(x0+1,y0+4,2,1,'#c89a30');break}
  }
}
function bakeGround(B){
  const L=B.L,{m,v}=B;const cvn=mkCv(MW*T,MH*T),c=cvn.getContext('2d');
  const sd=B.seed+B.li*13,F=FACE[WSTYLE[B.li]];
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    const t=m[y][x],h=hsh(x,y,B.seed),pxx=x*T,pyy=y*T;
    const zn=x>B.aX?null:L.zones[B.zi(x,y)];
    if(!zn){const g=L.arena.g;c.fillStyle=g[0];c.fillRect(pxx,pyy,T,T);
      if(t===6||t===1){c.fillStyle=g[1];c.fillRect(pxx,pyy+T-1,T,1);c.fillRect(pxx+T-1,pyy,1,T);if((x+y)%2)c.fillStyle=g[2],c.fillRect(pxx+1,pyy+1,T-3,1);
        if(h>.7){c.fillStyle=g[1];c.fillRect(pxx+4,pyy+5,6,1);c.fillRect(pxx+8,pyy+6,1,5)}
        if(h<.1&&B.li===4){c.fillStyle='#ff7a2f';c.fillRect(pxx+4,pyy+7,7,1);c.fillRect(pxx+7,pyy+4,1,7)}}
      else{c.fillStyle='#1a1418';c.fillRect(pxx,pyy,T,T)}continue}
    const a=zn.g.a,n=fbm(x/5,y/5,sd+2);
    let base=n<.4?a[1]:n>.62?a[2]:a[0];
    if(t===4){base=mix(a[0],B.li===2?'#9a94a8':B.li===4?'#a08a80':'#e8d8b0',.28)}
    c.fillStyle=base;c.fillRect(pxx,pyy,T,T);
    for(let i=0;i<3;i++){const hx=hsh(x,y,i+3);c.fillStyle=hx>.5?a[1]:a[2];c.fillRect(pxx+((hx*977)|0)%13,pyy+((hsh(x,y,i+9)*911)|0)%13,i===2?1:2,i===2?1:2)}
    if(t===4){const hx=hsh(x,y,7);c.fillStyle=lite(base,-.12);c.fillRect(pxx+((hx*13)|0)%12,pyy+((hx*70)|0)%12,3,2);c.fillRect(pxx,pyy+T-1,T,1);
      if(B.li===2&&hsh(x,y,31)>.5)drawDeco(c,'rail',x,y,h,a)}
    else if(t===0&&zn.g.dec&&h<.2){const k=zn.g.dec[(h*100|0)%zn.g.dec.length];drawDeco(c,k,x,y,h,a)}
    if(t===1){c.fillStyle='#00000026';c.fillRect(pxx+1,pyy+8,T-2,T-6)}
    /* soft stone floor look in cave/tomb zones */
    if((B.li===2||B.li===4)&&t===0&&h>.7){c.fillStyle=lite(base,-.1);c.fillRect(pxx,pyy+T-1,T,1);c.fillRect(pxx+T-1,pyy,1,T)}
    if(B.li===3&&t===0&&((x+y)%2)){c.fillStyle=lite(base,.04);c.fillRect(pxx,pyy,T,T)}
    if(t===3){
      const lava=L.liq==='lava',up=y>0&&m[y-1][x]!==3,dn=y<MH-1&&m[y+1][x]!==3;
      c.fillStyle=lava?'#7a1a0c':'#2b7e98';c.fillRect(pxx,pyy,T,T);
      c.fillStyle=lava?'#c8381a':'#3f9bb4';c.fillRect(pxx+2,pyy+4+((h*5)|0),6,1);c.fillRect(pxx+8,pyy+10,5,1);
      c.fillStyle=lava?'#561008':'#1f6a84';c.fillRect(pxx,pyy+T-2,T,2);
      if(up){c.fillStyle=lava?'#2a0a08':'#17566b';c.fillRect(pxx,pyy,T,4);c.fillStyle='#0000003a';c.fillRect(pxx,pyy+4,T,2)}
      if(dn){c.fillStyle=lava?'#ff9a3a':'#ecdcae';c.fillRect(pxx,pyy+T-2,T,2)}
      if(lava&&h>.6){c.fillStyle='#ffd070';c.fillRect(pxx+((h*13)|0)%10+2,pyy+6,2,1)}
    }
    if(t===2||t===5){c.fillStyle=F[1];c.fillRect(pxx,pyy,T,T)}
  }
  B.mapCv=cvn;
}
const MMC={0:null,1:'#2f5a2c',2:'#59544c',3:'#2b7e98',4:'#c8b27c',5:'#ff7a2f',6:'#4a424a'};
function renderMini(B,G){
  if(!G.mm){G.mm=mkCv(MW*2,MH*2);G.mmSeen=mkCv(MW*2,MH*2)}
  G.mm.width=MW*2;G.mm.height=MH*2;G.mmSeen.width=MW*2;G.mmSeen.height=MH*2;
  const c=G.mm.getContext('2d');
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=B.m[y][x];let col=MMC[t];if(t===0||t===1&&!col){col=B.L.zones[x>B.aX?2:B.zi(x,y)].g.a[0]}
    if(t===3)col=B.L.liq==='lava'?'#d8431a':'#2b7e98';if(t===1)col=mix(B.L.zones[x>B.aX?2:B.zi(x,y)].g.a[0],'#1a3a1a',.55);
    c.fillStyle=col;c.fillRect(x*2,y*2,2,2)}
}
