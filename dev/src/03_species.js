/* ---------- obstacle species (trees, rocks, tall props): each returns pre-rendered pixel sprites ---------- */
const GR={emerald:['#1f5a2e','#35923f','#68c25a'],olive:['#34602a','#5a8a34','#8aae4a'],teal:['#1c5e4e','#2f9478','#5ac4a0'],dry:['#4a5e2a','#788a34','#a8a84a'],
  dark:['#12382a','#1f5a3a','#34804c'],corrupt:['#2e2040','#52387a','#8a5ab0'],autumn:['#7a2e16','#c0602a','#e8a040'],dead:['#3a2c20','#5e4c38','#86735a'],sick:['#3a4a22','#66782e','#98a840']};
const BARK=['#3e2a17','#6b4a2b','#8e6a3c'];
const SAND=['#8a7a58','#b8a47a','#dccaa0'],GREY=['#4e4a54','#78727e','#a29cac'],MOSSY=['#3e4a38','#66785a','#8aa078'],DARKR=['#26222c','#443e4c','#6a6474'],
  EMB=['#2c2228','#4a3a42','#76606a'],OBS=['#0e0a14','#241a30','#4a3a66'],TOMB=['#7a6642','#b09a6a','#dac690'];
function frond(c,cx,cy,a,len,droop,pal){
  const pts=[];for(let s=0;s<=len;s++){const t=s/len;pts.push([cx+Math.cos(a)*s,cy+Math.sin(a)*s*.5+droop*t*t*len*.55])}
  pts.forEach(([x,y])=>px(c,x,y,2,2,pal[0]));
  pts.forEach(([x,y],i)=>{px(c,x,y-1,2,1,pal[1]);if(i%3===0){px(c,x+Math.cos(a+1.57)*3,y+Math.sin(a+1.57)*1.6+1,1,2,pal[0]);px(c,x-Math.cos(a+1.57)*3,y-Math.sin(a+1.57)*1.6+1,1,2,pal[2])}if(i%2===0)px(c,x,y-1,1,1,pal[2])})}
function palm(o){return(r,v)=>{
  const pal=o.dead?GR.dead:[GR.emerald,GR.olive,GR.teal,GR.dry][v%4];
  const h=Math.round(o.h[0]+r()*(o.h[1]-o.h[0])),lean=Math.round((o.lean[0]+r()*(o.lean[1]-o.lean[0]))*(r()<.5?-1:1));
  const trunk=S_(32,h+10,16,h+8,c=>{for(let y=0;y<=h;y++){const t=y/h,x=16+lean*Math.pow(t,o.cv||1.6),w=y<3?7:(t<.5?5:4),yy=h+7-y;
    px(c,x-w/2,yy,w,1,(y%4<2)?BARK[1]:'#7b5630');px(c,x-w/2,yy,1,1,BARK[2]);px(c,x+w/2-1,yy,1,1,BARK[0]);if(y%4===0)px(c,x-w/2,yy,w,1,BARK[0])}
    if(o.dead&&r()<.6){px(c,16+lean-2,6,4,2,BARK[0]);px(c,16+lean-1,4,2,3,BARK[0])}});
  const n=o.dead?5+(r()*2|0):o.n[0]+(r()*(o.n[1]-o.n[0]+1)|0);
  const crown=S_(68,52,34-lean,26+h+2,c=>{
    for(let k=0;k<n;k++){const a=(k/n)*6.283+r()*.35-1.57,len=o.L*(.8+r()*.4);frond(c,34,26,a,len,o.dead?1.3:o.droop,pal)}
    if(!o.dead&&r()<.6)for(let i=0;i<4;i++)px(c,31+i*2,29+(i%2),2,2,i%2?'#c27a2a':'#e0a040');
    if(o.dead&&r()<.5){px(c,34,26,3,3,BARK[0])}});
  return{trunk,crown,sway:o.dead?.4:1.3,sh:[10,3.5,6,-1]}}}
function acaciaMk(r,v){
  const h=14+(r()*6|0),pal=[GR.olive,GR.dry,GR.emerald][v%3];
  const trunk=S_(28,h+8,14,h+6,c=>{for(let y=0;y<h;y++){const w=y<4?7:5,x=14+Math.sin(y*.4)*1.5;px(c,x-w/2,h+5-y,w,1,(y%3)?BARK[1]:BARK[0]);px(c,x-w/2,h+5-y,1,1,BARK[2])}
    ln(c,14,h-6,7,h-12,BARK[1],3);ln(c,14,h-6,22,h-13,BARK[1],3)});
  const crown=S_(76,34,38,24+h-4,c=>{
    ell(c,38,22,34,8,pal[0]);for(let i=0;i<7;i++){const x=10+i*9+(r()-.5)*4,y=14+(r()-.5)*5;blob(c,x,y,11,6,pal,r)}
    for(let i=0;i<14;i++){px(c,6+r()*64,12+r()*14,1,1,pal[2])}});
  return{trunk,crown,over:true,sway:.5,sh:[10,3,6,-1],dap:[28,8]}}
function figMk(r,v){
  const pal=[GR.emerald,GR.teal,GR.olive][v%3],h=10+(r()*4|0);
  const trunk=S_(24,h+8,12,h+6,c=>{for(let y=0;y<h;y++)px(c,12-4+(y<3?-1:0),h+5-y,y<3?9:7,1,y%3?BARK[1]:BARK[0]);ln(c,12,h+5,9,h-3,BARK[1],2);ln(c,12,h+5,15,h-3,BARK[1],2)});
  const crown=S_(60,46,30,30+h-2,c=>{blob(c,30,26,27,17,pal,r);blob(c,16,28,14,10,pal,r);blob(c,44,28,14,10,pal,r);for(let i=0;i<8;i++)px(c,12+r()*36,14+r()*22,2,2,r()<.5?'#e07a8a':'#f0c050')});
  return{trunk,crown,over:true,sway:.4,sh:[12,3.5,6,-1],dap:[24,8]}}
function shrubMk(o){return(r,v)=>{
  const pal=o.pal[v%o.pal.length],fl=['#f4f0e0','#f0a0b8','#f2d24a','#d98aff'][(v>>1)%4];
  return{trunk:S_(24,18,12,16,c=>{blob(c,12,10,9,6,pal,r);blob(c,6,12,6,4,pal,r);blob(c,18,12,6,4,pal,r);
    if(o.flower)for(let i=0;i<5;i++)px(c,5+r()*14,6+r()*8,2,2,fl);if(o.thorn)for(let i=0;i<7;i++)ln(c,12+(r()-.5)*14,11,12+(r()-.5)*20,4+r()*4,'#6a4a2a',1);
    if(o.berry)for(let i=0;i<4;i++)px(c,6+r()*12,7+r()*6,2,2,'#c42a3a')}),sh:[9,3,4,-1]}}}
function cactusMk(r,v){const h=18+(r()*10|0),pal=[GR.emerald,GR.olive,GR.teal][v%3];
  return{trunk:S_(26,h+6,13,h+4,c=>{px(c,10,2,6,h,pal[0]);px(c,11,2,4,h,pal[1]);px(c,11,3,1,h-2,pal[2]);ell(c,13,3,3,2,pal[1]);
    if(r()<.8){px(c,3,h*.4,7,3,pal[0]);px(c,3,h*.4-6,3,8,pal[0]);px(c,4,h*.4-6,1,7,pal[1])}if(r()<.8){px(c,16,h*.55,7,3,pal[0]);px(c,20,h*.55-7,3,9,pal[0]);px(c,20,h*.55-7,1,8,pal[1])}
    for(let i=0;i<h;i+=3)px(c,10+(i%2)*5,2+i,1,1,'#e8e0a0');if(r()<.5){px(c,12,0,3,2,'#f070a0')}}),sh:[8,3,4,-1]}}
function reedMk(r,v){const pal=[GR.olive,GR.dry,GR.teal][v%3];
  return{trunk:S_(26,36,13,34,c=>{for(let i=0;i<9;i++){const x=4+i*2.2+(r()-.5),hh=16+r()*16,l=(r()-.5)*5;ln(c,x,33,x+l,33-hh,pal[i%2],1);if(r()<.4)px(c,x+l-1,33-hh-4,2,5,'#7a4a2a')}}),sh:[8,3,3,-1],sway:0}}
const boulder=(pal,extra={})=>(r,v)=>{
  const p=pal[v%pal.length],w=extra.w||24,h=extra.h||20,cw=w+8,ch=h+10,cx=cw/2,base=ch-4;
  const glow=extra.glow;
  return{trunk:S_(cw,ch,cx,ch-2,c=>{
    const form=r()*4|0;
    if(form===0)blob(c,cx,base-h*.4,w*.42,h*.4,p,r);
    else if(form===1){blob(c,cx-w*.14,base-h*.25,w*.3,h*.28,p,r);blob(c,cx+w*.15,base-h*.38,w*.28,h*.36,p,r)}
    else if(form===2){const hh=h*(.85+r()*.25);poly(c,[[cx-w*.3,base],[cx-w*.24,base-hh*.7],[cx-w*.06,base-hh],[cx+w*.2,base-hh*.8],[cx+w*.32,base]],p[0]);
      poly(c,[[cx-w*.25,base-1],[cx-w*.19,base-hh*.7],[cx-w*.05,base-hh+1],[cx+w*.1,base-hh*.78],[cx+w*.14,base-1]],p[1]);poly(c,[[cx-w*.2,base-hh*.6],[cx-w*.05,base-hh+2],[cx+w*.04,base-hh*.7]],p[2])}
    else{blob(c,cx,base-h*.22,w*.48,h*.24,p,r);blob(c,cx-w*.2,base-h*.3,w*.2,h*.2,p,r)}
    for(let i=0;i<2+(r()*3|0);i++){const x0=cx-w*.3+r()*w*.6,y0=base-h*.75+r()*h*.4;ln(c,x0,y0,x0+(r()-.5)*5,y0+3+r()*4,glow||p[0],1)}
    if(glow)for(let i=0;i<5;i++)px(c,cx-w*.3+r()*w*.6,base-h*.7+r()*h*.55,1,1,'#ffd08a');
    if(extra.moss)for(let i=0;i<10;i++)px(c,cx-w*.3+r()*w*.5,base-h*.85+r()*h*.3,2,1,['#4f7a3a','#6a9a48'][i%2]);
    if(extra.ore)for(let i=0;i<7;i++)px(c,cx-w*.3+r()*w*.6,base-h*.7+r()*h*.55,1,1,extra.ore[i%extra.ore.length]);
    if(extra.bones&&r()<.5)ln(c,cx+3,base-1,cx+9,base-3,'#e8e0cc',1)
  }),sh:[w*.45,3.5,4,-1],glow:glow?{c:'#ff8a2f',r:30,a:.45}:null,big:extra.big}};
const rubble=(pal)=>(r,v)=>{const p=pal[v%pal.length];return{trunk:S_(26,16,13,14,c=>{for(let i=0;i<6;i++)blob(c,5+r()*16,7+r()*5,2+r()*3,2+r()*2,p,r)}),sh:[10,2.5,3,-1]}};
const slab=(pal)=>(r,v)=>{const p=pal[v%pal.length],t=(r()-.5)*5;return{trunk:S_(30,28,15,26,c=>{
  poly(c,[[8+t,24],[10,6],[20,4],[23+t,24]],p[0]);poly(c,[[9+t,23],[11,7],[19,5],[21+t,23]],p[1]);poly(c,[[10+t,22],[12,8],[16,6],[15+t,10]],p[2]);ln(c,11,12,18,13,p[0],1);ln(c,13,17,20,18,p[0],1)}),sh:[9,3,5,-1]}};
const spikeMk=(pal,hr,col)=>(r,v)=>{const n=1+(r()*3|0),p=pal,h=hr[1]+8;return{trunk:S_(34,h,17,h-2,c=>{
  for(let i=0;i<n;i++){const x=17+(i-(n-1)/2)*8+(r()-.5)*3,hh=hr[0]+r()*(hr[1]-hr[0]),bw=4+r()*3,by=h-4;
    poly(c,[[x-bw,by],[x-1,by-hh],[x+1,by-hh],[x+bw,by]],p[0]);poly(c,[[x-bw+1,by],[x-1,by-hh+1],[x,by-hh+3],[x,by]],p[2]);poly(c,[[x+.5,by],[x+.5,by-hh+2],[x+1,by-hh+1],[x+bw-1,by]],p[1])}}),sh:[10,3,4,-1]}};
const crystalMk=(cols)=>(r,v)=>{const col=cols[v%cols.length],n=3+(r()*3|0),h=36;
  return{trunk:S_(34,h,17,h-3,c=>{for(let i=0;i<n;i++){const x=17+(i-(n-1)/2)*5+(r()-.5)*3,hh=10+r()*16,bw=2+r()*2,by=h-5-(r()*3|0);
    poly(c,[[x-bw,by],[x-bw+.5,by-hh*.7],[x,by-hh],[x+bw-.5,by-hh*.7],[x+bw,by]],lite(col,-.35));poly(c,[[x-bw+1,by],[x-bw+1.3,by-hh*.7],[x,by-hh+1],[x,by]],col);poly(c,[[x-bw+1,by-1],[x-bw+1.5,by-hh*.6],[x-.5,by-hh+3]],lite(col,.55));px(c,x+bw-2,by-hh*.5,1,hh*.4,lite(col,-.2))}
    ell(c,17,h-4,9,2,lite(col,-.6))}),sh:[10,3,4,-1],glow:{c:col,r:36,a:.5}}};
function columnMk(r,v){const h=20+(r()*16|0),broken=r()<.45,pal=TOMB;
  return{trunk:S_(24,h+8,12,h+6,c=>{px(c,3,h+1,18,4,pal[0]);px(c,4,h+1,16,3,pal[1]);const top=broken?h-(4+(r()*6|0)):2;
    px(c,6,top,12,h-top+1,pal[0]);px(c,7,top,10,h-top+1,pal[1]);px(c,7,top,2,h-top+1,pal[2]);for(let x=10;x<17;x+=3)px(c,x,top,1,h-top+1,pal[0]);
    if(broken){px(c,6,top-1,3,1,pal[0]);px(c,13,top-2,3,2,pal[0]);px(c,15,top-1,3,1,pal[0])}else{px(c,4,2,16,3,pal[0]);px(c,5,2,14,2,pal[2]);px(c,5,4,14,1,pal[1])}
    if(r()<.4)px(c,8,h*.5,2,2,'#5a8a3a')}),sh:[9,3,6,-1]}}
function obeliskMk(r,v){const h=34+(r()*8|0);return{trunk:S_(24,h+8,12,h+6,c=>{px(c,3,h+1,18,4,TOMB[0]);poly(c,[[6,h+1],[8,8],[12,2],[16,8],[18,h+1]],TOMB[0]);poly(c,[[7,h],[9,9],[12,3],[12,h]],TOMB[2]);poly(c,[[12,h],[12,3],[15,9],[17,h]],TOMB[1]);
    for(let y=14;y<h-4;y+=5){px(c,10,y,2,2,'#4a3a22');px(c,13,y+2,1,2,'#4a3a22')}px(c,11,3,2,2,'#e8c04a')}),sh:[8,3,6,-1]}}
function statueMk(r,v){return{trunk:S_(26,52,13,50,c=>{const P=['#1c1a22','#34303c','#5a5468'],G='#e8b84a';
  px(c,3,42,20,6,P[0]);px(c,4,42,18,4,P[1]);px(c,6,40,14,3,P[2]);
  px(c,8,20,10,20,P[0]);px(c,9,20,8,20,P[1]);px(c,9,20,2,20,P[2]);px(c,8,26,10,2,G);px(c,8,32,10,1,G);
  px(c,10,8,6,12,P[0]);px(c,11,8,4,12,P[1]);px(c,7,2,3,10,P[0]);px(c,16,2,3,10,P[0]);px(c,8,3,1,8,P[2]);px(c,12,16,2,3,P[0]);px(c,11,12,1,1,G);px(c,15,12,1,1,G);px(c,10,18,6,1,G);
  px(c,5,22,3,16,P[0]);px(c,18,22,3,16,P[0]);px(c,13,38,2,4,G)}),sh:[10,3,6,-1]}}
function sarcMk(r,v){return{trunk:S_(26,34,13,32,c=>{px(c,5,6,16,26,'#5a4a30');px(c,6,6,14,25,TOMB[1]);px(c,6,6,3,25,TOMB[2]);px(c,10,9,6,5,TOMB[0]);px(c,11,10,4,3,'#e8c04a');px(c,10,18,6,2,TOMB[0]);px(c,10,23,6,2,TOMB[0]);px(c,5,29,16,3,'#4a3a22');px(c,9,6,8,2,'#e8c04a')}),sh:[9,3,5,-1]}}
function urnMk(r,v){const p=[['#6a3a22','#a8643a','#d89a62'],['#2a3e5a','#3e5e86','#6a8ab6'],['#5a3a3a','#8a5a52','#bc8a7a']][v%3];
  return{trunk:S_(20,26,10,24,c=>{ell(c,10,15,7,8,p[0]);ell(c,10,14,6,7,p[1]);ell(c,8,12,2,4,p[2]);px(c,6,5,8,3,p[0]);px(c,7,5,6,2,p[1]);px(c,5,4,10,2,p[0]);px(c,6,13,8,1,p[0]);px(c,6,17,8,1,'#e8c04a')}),sh:[7,2.5,3,-1]}}
function brazierMk(r,v){return{trunk:S_(24,34,12,32,c=>{px(c,5,28,14,3,'#241a20');px(c,10,16,4,13,'#3a2e36');px(c,6,12,12,5,'#241a20');px(c,7,12,10,4,'#4a3a42');px(c,6,11,12,2,'#6a5560');px(c,8,10,8,2,'#2a1a14');px(c,8,10,8,1,'#ff9a3a')}),
  fire:{ox:0,oy:-23,s:1},sh:[8,3,4,-1]}}
function mineSup(r,v){return{trunk:S_(34,44,17,42,c=>{px(c,3,10,5,32,WOODD);px(c,4,10,3,32,WOOD);px(c,4,10,1,32,WOODL);px(c,26,10,5,32,WOODD);px(c,27,10,3,32,WOOD);px(c,27,10,1,32,WOODL);
    px(c,1,6,32,6,WOODD);px(c,2,7,30,4,WOOD);px(c,2,7,30,1,WOODL);px(c,6,12,2,4,WOODD);px(c,26,12,2,4,WOODD);ln(c,8,12,14,7,WOODD,2);ln(c,26,12,20,7,WOODD,2)}),sh:[0,0,0,0]}}
function cartMk(r,v){return{trunk:S_(28,22,14,20,c=>{px(c,3,8,22,10,'#2a2a32');px(c,4,8,20,9,'#4a4a56');px(c,4,8,20,2,'#6a6a78');px(c,3,10,22,1,'#2a2a32');
    for(let i=0;i<7;i++)ell(c,6+i*3,7+(i%2),2,2,['#d8a830','#6ac0e8','#a8a8b8'][i%3]);ell(c,8,19,3,3,OUT);ell(c,8,19,2,2,'#8a8a96');ell(c,20,19,3,3,OUT);ell(c,20,19,2,2,'#8a8a96')}),sh:[10,3,3,-1]}}
function bannerMk(r,v){const col=['#a82a2a','#2a5aa8','#6a2a8a'][v%3];return{trunk:S_(26,52,13,50,c=>{px(c,12,2,3,48,'#3a2e30');px(c,12,2,1,48,'#6a5a5c');px(c,10,0,7,3,'#d8a830');
    poly(c,[[15,6],[24,8],[22,16],[24,24],[21,32],[22,40],[15,36]],lite(col,-.35));poly(c,[[15,6],[22,8],[20,16],[22,24],[19,32],[20,38],[15,35]],col);px(c,16,14,4,4,'#d8a830');px(c,17,22,2,2,'#d8a830');px(c,6,46,14,4,'#241a20')}),sh:[7,2.5,3,-1],sway:0}}
function skullPile(r,v){return{trunk:S_(30,22,15,20,c=>{const sk=(x,y,s)=>{ell(c,x,y,3*s,3*s,'#c8c0a8');ell(c,x,y-.5,2*s,2*s,'#ece6d0');px(c,x-1.5*s,y,1,1,'#2a2020');px(c,x+1*s,y,1,1,'#2a2020');px(c,x,y+2*s-1,1,1,'#2a2020')};
    for(let i=0;i<5;i++)sk(7+i*4+(r()-.5)*2,15+(r()-.5)*2,1);for(let i=0;i<3;i++)sk(10+i*5,10+(r()-.5)*2,1);sk(15,6,1);ln(c,22,18,27,15,'#e8e0cc',1)}),sh:[10,3,3,-1]}}
function charredMk(r,v){const h=24+(r()*12|0);return{trunk:S_(40,h+8,20,h+6,c=>{
    for(let y=0;y<h;y++){const w=y<4?7:(y>h-8?3:5);px(c,20-w/2+Math.sin(y*.3)*1.2,h+5-y,w,1,y%5?'#1e1618':'#2e2226')}
    const br=(x,y,a,l,d)=>{if(d<=0||l<3)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;ln(c,x,y,x2,y2,'#1e1618',d>1?2:1);if(r()<.35)px(c,x2,y2,1,1,'#ff7a2f');br(x2,y2,a-.6-r()*.4,l*.7,d-1);br(x2,y2,a+.6+r()*.4,l*.7,d-1)};
    br(20,h-4,-1.57-.3,h*.45,3);br(20,h-8,-1.57+.5,h*.4,3);for(let i=0;i<5;i++)px(c,18+r()*5,h*.3+r()*h*.5,1,1,'#ff7a2f')}),sh:[8,3,5,-1]}}
function deadTreeMk(r,v){const h=26+(r()*14|0),col=v%2?['#2a2420','#4a403a']:['#3a2e22','#5e4c38'];
  return{trunk:S_(46,h+10,23,h+8,c=>{for(let y=0;y<h*.5;y++){const w=y<4?8:5;px(c,23-w/2,h+7-y,w,1,col[y%4<2?0:1])}
    const br=(x,y,a,l,d)=>{if(d<=0)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;ln(c,x,y,x2,y2,col[0],d>1?3:1);ln(c,x,y-1,x2,y2-1,col[1],1);br(x2,y2,a-.55-r()*.5,l*.75,d-1);br(x2,y2,a+.5+r()*.5,l*.72,d-1)};
    br(23,h-h*.4,-1.57-.2,h*.4,3);br(23,h-h*.3,-1.57+.7,h*.32,3);if(r()<.5)br(23,h-h*.25,-1.57-.9,h*.28,2);
    if(r()<.4){px(c,29,h*.35,3,2,'#16121a');px(c,31,h*.35+1,2,1,'#16121a')}if(r()<.5)for(let i=0;i<3;i++)ln(c,12+i*6,h*.45,12+i*6,h*.45+8+r()*8,'#4a6a3a',1)}),sh:[9,3,5,-1]}}
function cypressMk(r,v){const h=40+(r()*16|0),pal=[GR.dark,GR.emerald,GR.teal][v%3];
  return{trunk:S_(30,h+8,15,h+6,c=>{px(c,13,h-2,4,6,BARK[0]);for(let i=0;i<7;i++){const y=h-4-i*(h-8)/7,w=11-i*1.3;poly(c,[[15-w,y],[15,y-(h-8)/6-3],[15+w,y]],pal[0]);poly(c,[[15-w+1,y-1],[15,y-(h-8)/6-2],[15+w*.2,y-1]],pal[1]);px(c,15-w*.4,y-3,2,1,pal[2])}}),sh:[10,3,5,-1],sway:0}}
function mushMk(r,v){const caps=[['#4a2a6a','#8a52c0','#c490f0'],['#1a5a5a','#2aa0a0','#6ae0d0'],['#7a3a1a','#c0662a','#f0a050'],['#6a2040','#b04070','#f080a8']][v%4],h=14+(r()*12|0),cw=8+(r()*6|0);
  return{trunk:S_(40,h+22,20,h+20,c=>{px(c,18,h*.4+8,5,h,'#d8d0b8');px(c,18,h*.4+8,1,h,'#f4eed8');px(c,22,h*.4+8,1,h,'#a8a088');
    ell(c,20,h*.4+8,cw,cw*.55,caps[0]);ell(c,20,h*.4+7,cw-1,cw*.5,caps[1]);ell(c,17,h*.4+4,cw*.45,cw*.25,caps[2]);
    for(let i=0;i<4;i++)px(c,20-cw+3+r()*(cw*2-6),h*.4+5+r()*3,2,1,caps[2]);ell(c,28,h+16,3,2,caps[0]);px(c,28,h+13,2,3,'#d8d0b8')}),sh:[9,3,3,-1],glow:{c:caps[2],r:24,a:.25}}}
function oakMk(r,v){const pal=[GR.emerald,GR.olive,GR.autumn,GR.dark,GR.sick][v%5],h=12+(r()*6|0);
  return{trunk:S_(26,h+8,13,h+6,c=>{for(let y=0;y<h;y++)px(c,13-(y<4?4:3),h+5-y,y<4?9:7,1,y%3?BARK[1]:BARK[0]);px(c,10,h+5,2,1,BARK[2]);px(c,9,h+2,3,3,BARK[0]);px(c,15,h+2,3,3,BARK[0]);px(c,12,h*.5,2,3,'#16121a')}),
  crown:S_(66,54,33,38+h-6,c=>{blob(c,33,30,29,19,pal,r);blob(c,18,32,15,11,pal,r);blob(c,48,32,15,11,pal,r);blob(c,33,16,17,11,pal,r);for(let i=0;i<10;i++)px(c,10+r()*46,10+r()*34,1,1,pal[0])}),over:true,sway:.5,sh:[12,3.5,6,-1],dap:[26,9]}}
function ancientMk(r,v){const pal=[GR.dark,GR.corrupt,GR.teal][v%3];
  return{trunk:S_(60,70,30,68,c=>{const h=56;for(let y=0;y<h;y++){const w=y<8?(26-y*.6):(y<14?20:15+(y%9<2?1:0));px(c,30-w/2+Math.sin(y*.2),64-y,w,1,y%4<2?BARK[1]:'#5a3a22');px(c,30-w/2+Math.sin(y*.2),64-y,2,1,BARK[2]);px(c,30+w/2-3+Math.sin(y*.2),64-y,3,1,BARK[0])}
    for(let i=0;i<6;i++){const x=10+i*8+(r()-.5)*3;ln(c,x,64,x+(i<3?-4:4),58,BARK[0],3)}ell(c,30,40,3,5,'#12100e');ell(c,30,41,2,4,'#060504');px(c,25,34,2,1,'#e8d8a0');px(c,33,34,2,1,'#e8d8a0');
    ln(c,22,50,16,36,BARK[0],1);ln(c,38,48,44,34,BARK[0],1)}),
  crown:S_(120,84,60,100,c=>{blob(c,60,46,52,30,pal,r);blob(c,28,52,26,18,pal,r);blob(c,92,52,26,18,pal,r);blob(c,60,26,32,20,pal,r);blob(c,38,30,20,14,pal,r);blob(c,82,30,20,14,pal,r);
    for(let i=0;i<18;i++){px(c,10+r()*100,12+r()*60,2,2,['#a8f0e0','#f0e8a0','#c8a0ff'][i%3])}for(let i=0;i<9;i++){const x=20+r()*80;ln(c,x,64,x+(r()-.5)*3,64+8+r()*10,'#3a5a3a',1)}}),
  over:true,big:true,sway:.4,sh:[22,6,8,0],dap:[44,14],glow:{c:'#8affd0',r:30,a:.14}}}
function logMk(r,v){return{trunk:S_(30,20,15,18,c=>{ell(c,15,13,13,5,'#3e2a17');px(c,3,8,24,8,BARK[0]);px(c,3,8,24,6,BARK[1]);px(c,3,8,24,1,BARK[2]);ell(c,3,12,2,4,'#a88a58');ell(c,3,12,1,3,'#c4a66e');px(c,10,9,1,5,BARK[0]);px(c,18,9,1,5,BARK[0]);for(let i=0;i<5;i++)px(c,8+r()*14,7,2,1,'#5a8a3a')}),sh:[12,3,3,-1]}}
function bigRock(r,v){const p=[GREY,SAND,EMB,MOSSY][v%4];return{trunk:S_(52,46,26,44,c=>{poly(c,[[3,42],[6,22],[16,8],[30,4],[44,14],[49,40]],p[0]);poly(c,[[6,41],[9,23],[17,10],[30,6],[40,14],[43,38]],p[1]);poly(c,[[9,28],[17,12],[28,8],[24,18]],p[2]);
    for(let i=0;i<3;i++){const x=12+r()*28;ln(c,x,12+r()*8,x+(r()-.5)*6,26+r()*10,p[0],1)}}),big:true,sh:[24,5,6,0]}}
const SPECIES={
  datePalm:palm({h:[30,52],lean:[0,6],n:[8,10],L:23,droop:.55}),shortPalm:palm({h:[12,22],lean:[0,4],n:[9,11],L:20,droop:.75}),leanPalm:palm({h:[24,38],lean:[9,15],n:[8,9],L:21,droop:.6,cv:1.1}),
  deadPalm:palm({h:[22,40],lean:[0,6],n:[5,6],L:15,droop:1,dead:true}),acacia:acaciaMk,fig:figMk,
  shrub:shrubMk({pal:[GR.emerald,GR.olive,GR.dry,GR.teal],flower:true}),dryShrub:shrubMk({pal:[GR.dry,GR.dead,GR.sick],thorn:true}),thornBush:shrubMk({pal:[GR.dark,GR.corrupt,GR.sick],thorn:true,berry:true}),
  cactus:cactusMk,reeds:reedMk,
  boulderSand:boulder([SAND,['#9a8a68','#c4b088','#e6d6ae']]),boulderGrey:boulder([GREY,DARKR]),boulderMoss:boulder([MOSSY,GREY],{moss:true}),boulderDark:boulder([DARKR,EMB],{bones:true}),
  emberStone:boulder([EMB,DARKR],{glow:'#ff7a2f'}),oreRock:boulder([GREY,DARKR],{ore:['#e8c04a','#6ac0e8','#f080c0']}),obsidian:boulder([OBS],{glow:'#ff4a3a',w:22,h:24}),
  rubbleSand:rubble([SAND]),rubbleGrey:rubble([GREY,DARKR]),slabSand:slab([SAND]),slabGrey:slab([GREY,EMB]),slabTomb:slab([TOMB]),
  stalagmite:spikeMk(GREY,[14,34]),stalagDark:spikeMk(DARKR,[16,36]),obsSpike:spikeMk(OBS,[18,38]),
  crystalCyan:crystalMk(['#4ad8f0','#58a8ff']),crystalPink:crystalMk(['#e060d8','#f070a0']),crystalAmber:crystalMk(['#f0b840','#f08a30']),crystalGreen:crystalMk(['#58e080','#38c8a0']),
  column:columnMk,obelisk:obeliskMk,statue:statueMk,sarcophagus:sarcMk,urn:urnMk,brazier:brazierMk,mineSupport:mineSup,cart:cartMk,banner:bannerMk,skullPile,charred:charredMk,deadTree:deadTreeMk,
  cypress:cypressMk,mushroom:mushMk,oak:oakMk,ancient:ancientMk,log:logMk,bigRock};
const _spc={};
function getSpr(key,v){const k=key+':'+v;let s=_spc[k];if(s)return s;const mk=SPECIES[key];if(!mk){console.warn('missing species',key);return _spc[k]=SPECIES.boulderGrey(rng(1),0)}return _spc[k]=mk(rng(strHash(k)),v)}
