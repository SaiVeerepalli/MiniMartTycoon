// Mini Mart Tycoon — original lightweight canvas game.
// Core loop inspired by the tycoon genre, with original objects and presentation.
const c=document.getElementById('game'),ctx=c.getContext('2d'); let W,H,dpr;
const state={cash:120,level:1,zoom:1,camX:0,camY:0,customers:[],particles:[],items:[],builds:[],
 products:{veggie:{name:'Veggie Box',price:8,color:'#63E6BE'},bread:{name:'Bread',price:12,color:'#F6C76B'},juice:{name:'Juice',price:16,color:'#FF8FA3'}},
 unlocked:['veggie'], stock:{veggie:8,bread:0,juice:0}, selected:'veggie'};
const world={w:1200,h:820};
function resize(){dpr=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize);resize();
state.builds=[{type:'shelf',x:410,y:300,lvl:1},{type:'checkout',x:650,y:510,lvl:1},{type:'farm',x:210,y:330,lvl:1}];
for(let i=0;i<4;i++) state.customers.push({x:780+i*55,y:390+i*35,t:Math.random()*5,wait:0});
function sx(x){return (x-state.camX)*state.zoom+W/2-world.w*state.zoom/2}
function sy(y){return (y-state.camY)*state.zoom+H/2-world.h*state.zoom/2}
function worldPoint(x,y){return {x:(x-W/2+world.w*state.zoom/2)/state.zoom+state.camX,y:(y-H/2+world.h*state.zoom/2)/state.zoom+state.camY}}
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1218';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(sx(0),sy(0));ctx.scale(state.zoom,state.zoom);
 // floor
 ctx.fillStyle='#dfe8e3';ctx.fillRect(0,0,world.w,world.h);
 for(let x=0;x<world.w;x+=60)for(let y=0;y<world.h;y+=60){ctx.fillStyle=(x/60+y/60)%2?'#d9e2dd':'#e4ece7';ctx.fillRect(x,y,60,60)}
 // building
 rounded(70,90,900,650,28,'#fffaf0'); rounded(90,110,860,610,20,'#edf4f1');
 // road/entrance
 ctx.fillStyle='#8b949e';ctx.fillRect(980,280,220,220);ctx.fillStyle='#4c5661';ctx.fillRect(1040,320,160,140);
 // farm
 const farm=state.builds.find(b=>b.type==='farm'); if(farm) drawFarm(farm);
 state.builds.filter(b=>b.type!=='farm').forEach(drawBuild);
 state.customers.forEach(drawCustomer);
 ctx.restore();
 requestAnimationFrame(draw)
}
function drawFarm(b){let x=b.x,y=b.y;rounded(x-85,y-70,170,140,18,'#8ec07c');for(let i=0;i<3;i++)for(let j=0;j<3;j++){ctx.fillStyle='#5f9f63';ctx.beginPath();ctx.arc(x-55+i*55,y-35+j*35,8,0,7);ctx.fill()}rounded(x-34,y+48,68,24,10,'#c28f57');}
function drawBuild(b){let x=b.x,y=b.y;if(b.type==='shelf'){rounded(x-70,y-45,140,90,16,'#6f7a88');for(let i=0;i<3;i++){ctx.fillStyle='#33404c';ctx.fillRect(x-55,y-28+i*25,110,4)}for(let i=0;i<5;i++){ctx.fillStyle=['#63E6BE','#F6C76B','#FF8FA3','#74C0FC','#C8A2FF'][i];ctx.beginPath();ctx.arc(x-42+i*21,y-10,7,0,7);ctx.fill()}}else{rounded(x-65,y-35,130,70,16,'#9a6b45');ctx.fillStyle='#f7d77c';ctx.fillRect(x-45,y-15,90,30);}}
function drawCustomer(a){a.t+=.01;a.wait+=.01;let x=a.x+Math.sin(a.t)*18,y=a.y+Math.cos(a.t*1.4)*12;ctx.fillStyle='#44546a';ctx.beginPath();ctx.arc(x,y-18,12,0,7);ctx.fill();rounded(x-12,y-6,24,34,9,['#e6a36a','#8bc5a0','#d88ca4'][Math.floor(a.t)%3]);}
function tick(){ // simple autonomous sales
 state.customers.forEach(a=>{if(Math.random()<.012 && state.stock[state.selected]>0){state.stock[state.selected]--;state.cash+=state.products[state.selected].price;state.particles.push({x:650,y:510,life:1,text:'+$'+state.products[state.selected].price})}});
 if(state.cash>500 && state.level===1){state.level=2;state.unlocked.push('bread');state.stock.bread=4;document.getElementById('tip').textContent='Level 2! Bread is now unlocked.'}
 if(state.cash>1200 && state.level===2){state.level=3;state.unlocked.push('juice');state.stock.juice=4;document.getElementById('tip').textContent='Level 3! Juice is now unlocked.'}
 document.getElementById('cash').textContent=Math.floor(state.cash);document.getElementById('level').textContent=state.level;
 state.particles.forEach(p=>{p.life-=.02;p.y-=.5});state.particles=state.particles.filter(p=>p.life>0);
 save();
}
function save(){localStorage.setItem('mmt-save',JSON.stringify({cash:state.cash,level:state.level,stock:state.stock,unlocked:state.unlocked,builds:state.builds}))}
function load(){try{let s=JSON.parse(localStorage.getItem('mmt-save'));if(s){Object.assign(state,s)}}catch(e){}}
load();setInterval(tick,1000);
document.querySelectorAll('[data-build]').forEach(btn=>btn.onclick=()=>{let type=btn.dataset.build,cost={shelf:60,checkout:100,farm:140}[type];if(state.cash>=cost){state.cash-=cost;state.builds.push({type,x:350+Math.random()*500,y:200+Math.random()*400,lvl:1})}});
document.getElementById('zoomReset').onclick=()=>{state.zoom=1;state.camX=0;state.camY=0};
let lastDist=0,lastMid=null;
c.addEventListener('pointerdown',e=>{c.setPointerCapture(e.pointerId);lastMid={x:e.clientX,y:e.clientY}});
c.addEventListener('pointermove',e=>{if(!lastMid)return;let dx=e.clientX-lastMid.x,dy=e.clientY-lastMid.y;state.camX-=dx/state.zoom;state.camY-=dy/state.zoom;lastMid={x:e.clientX,y:e.clientY}});
c.addEventListener('pointerup',()=>lastMid=null);
c.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.65,Math.min(2.3,state.zoom*(e.deltaY<0?1.1:.9)))},{passive:false});
let touch1=null,touch2=null;
c.addEventListener('touchstart',e=>{if(e.touches.length===2){touch1=e.touches[0];touch2=e.touches[1]}},{passive:true});
c.addEventListener('touchmove',e=>{if(e.touches.length===2&&touch1&&touch2){let a=e.touches[0],b=e.touches[1],old=Math.hypot(touch1.clientX-touch2.clientX,touch1.clientY-touch2.clientY),now=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(old)state.zoom=Math.max(.65,Math.min(2.3,state.zoom*now/old));touch1=a;touch2=b;}},{passive:true});
c.addEventListener('touchend',()=>{touch1=touch2=null},{passive:true});
draw();
