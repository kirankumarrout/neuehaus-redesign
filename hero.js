/* A lightweight original 3D pavilion, projected and shaded on a 2D canvas.
   This is a concept study, not a model of a completed Neuehaus project. */
function createHero(hero){
 const canvas=hero.querySelector('canvas'),ctx=canvas.getContext('2d');
 const stage=hero.querySelector('.hero-scene'),video=hero.querySelector('video');
 const status=hero.querySelector('.hero-media-status'),pause=hero.querySelector('.motion-toggle');
 const mediaQuery=matchMedia('(prefers-reduced-motion: reduce)');
 let stopped=mediaQuery.matches,visible=true,disposed=false,mode='model',raf=0;
 let width=1,height=1,angle=-.65,targetX=0,pointerX=0,lastTime=0,time=0;
 const faces=[];
 function box(x,y,z,w,h,d,color,glass=false){
  const a=[x,y,z],b=[x+w,y,z],c=[x+w,y+h,z],d0=[x,y+h,z],e=[x,y,z+d],f=[x+w,y,z+d],g=[x+w,y+h,z+d],h0=[x,y+h,z+d];
  faces.push({p:[a,b,c,d0],c:color,k:.81,glass},{p:[e,h0,g,f],c:color,k:.94,glass},{p:[a,d0,h0,e],c:color,k:.69,glass},{p:[b,f,g,c],c:color,k:.88,glass},{p:[d0,c,g,h0],c:color,k:1.08,glass});
 }
 box(-2.8,-.22,-1.9,5.6,.22,3.8,[168,174,153]);
 box(-2.25,0,-1.45,4.5,.17,2.9,[212,208,191]);
 box(-2.05,.17,-1.25,4.1,.14,2.5,[230,225,211]);
 // Central stone service core, open glass walls and slender columns.
 box(-.65,.31,-.8,1.2,1.7,1.5,[176,172,154]);
 box(-1.94,.31,-1.14,.10,1.76,2.28,[151,176,166],true);
 box(1.84,.31,-1.14,.10,1.76,2.28,[151,176,166],true);
 box(-1.94,.31,-1.14,3.88,1.76,.055,[164,185,174],true);
 box(-1.94,.31,1.085,3.88,1.76,.055,[164,185,174],true);
 for(const x of [-1.9,-.95,0,.95,1.9])for(const z of [-1.1,1.1])box(x,.31,z,.045,1.76,.045,[87,101,90]);
 box(-2.15,2.07,-1.37,4.3,.16,2.74,[232,228,213]);
 box(-2.32,2.23,-1.51,4.64,.10,3.02,[221,217,199]);
 // Floating roof blades, a planted courtyard and approach steps.
 for(let i=0;i<11;i++)box(-2.15+i*.41,2.36,-1.42,.12,.065,2.84,[207,203,184]);
 for(let i=0;i<3;i++)box(-.75,-.02-i*.045,1.4+i*.23,1.5,.10,.26,[220,215,198]);
 box(1.35,.17,1.32,.7,.25,.32,[102,117,88]);
 const rotate=p=>{const a=angle+pointerX*.20,c=Math.cos(a),s=Math.sin(a);return[p[0]*c-p[2]*s,p[1],p[0]*s+p[2]*c]};
 function project(p){const r=rotate(p),scale=Math.min(width/7.4,height/5.3),depth=1+r[2]*.035;return[width/2+r[0]*scale/depth,height*.61+(-r[1]*.94+r[2]*.39)*scale/depth]}
 function draw(){
  if(!ctx)return;ctx.clearRect(0,0,width,height);
  // A fine ground grid anchors the object without obscuring it.
  ctx.strokeStyle='rgba(100,113,88,.09)';ctx.lineWidth=.6;
  for(let n=-6;n<=6;n++){for(const line of [[[n*.65,-.25,-4],[n*.65,-.25,4]],[[-4,-.25,n*.65],[4,-.25,n*.65]]]){const a=project(line[0]),b=project(line[1]);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}}
  const shadow=project([.3,-.23,.3]);ctx.save();ctx.translate(...shadow);ctx.scale(1,.35);const radius=Math.min(width*.38,260);const g=ctx.createRadialGradient(0,0,5,0,0,radius);g.addColorStop(0,'rgba(49,61,39,.23)');g.addColorStop(1,'rgba(49,61,39,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.restore();
  const sorted=faces.map(f=>({...f,depth:f.p.reduce((s,p)=>s+rotate(p)[2]-p[1]*.43,0)/4})).sort((a,b)=>a.depth-b.depth);
  for(const f of sorted){const points=f.p.map(project);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=`rgba(${f.c.map(c=>Math.min(255,Math.round(c*f.k))).join(',')},${f.glass?.25:1})`;ctx.fill();ctx.strokeStyle=f.glass?'rgba(100,131,114,.25)':'rgba(82,89,70,.15)';ctx.lineWidth=.6;ctx.stroke()}
 }
 function resize(){const r=stage.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);draw()}
 function tick(t){if(disposed)return;raf=0;if(stopped||!visible||document.hidden||mode!=='model')return;const dt=Math.min((t-lastTime)/1000||0,.05);lastTime=t;time+=dt;angle=-.65+Math.sin(time*.15)*.28;pointerX+=(targetX-pointerX)*.055;draw();raf=requestAnimationFrame(tick)}
 function schedule(){if(!raf&&!disposed&&!stopped&&visible&&!document.hidden&&mode==='model'){lastTime=performance.now();raf=requestAnimationFrame(tick)}}
 function sync(){pause.textContent=stopped?'▷':'Ⅱ';pause.setAttribute('aria-label',stopped?'Play animation':'Pause animation');hero.classList.toggle('hero-paused',stopped);if(stopped||!visible||document.hidden){cancelAnimationFrame(raf);raf=0;video.pause()}else if(mode==='model')schedule();else video.play().catch(()=>{status.textContent='Select Project film again to start playback.'})}
 async function selectView(next){mode=next;hero.dataset.view=next;hero.querySelectorAll('[data-hero-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.heroView===next)));status.textContent='';if(next==='film'){cancelAnimationFrame(raf);raf=0;video.preload='auto';if(video.readyState===0)video.load();if(!stopped&&visible&&!document.hidden){try{await video.play()}catch{if(!disposed&&mode==='film')status.textContent='Tap play to start the project film.'}}}else{video.pause();draw();schedule()}}
 const abort=new AbortController(),events={signal:abort.signal};
 hero.querySelectorAll('[data-hero-view]').forEach(b=>b.addEventListener('click',()=>selectView(b.dataset.heroView),events));
 pause.addEventListener('click',()=>{stopped=!stopped;sync()},events);
 stage.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!stopped){const r=stage.getBoundingClientRect();targetX=(e.clientX-r.left)/r.width*2-1}},events);
 stage.addEventListener('pointerleave',()=>targetX=0,events);
 video.addEventListener('error',()=>{status.textContent='The film could not load. The 3D study is still available.'},events);
 document.addEventListener('visibilitychange',sync,events);
 mediaQuery.addEventListener('change',e=>{stopped=e.matches;sync()},events);
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
 const visibilityObserver=new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()},{threshold:.05});visibilityObserver.observe(hero);
 resize();sync();
 return()=>{disposed=true;abort.abort();cancelAnimationFrame(raf);resizeObserver.disconnect();visibilityObserver.disconnect();video.pause();video.removeAttribute('src');};
}
