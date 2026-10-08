/* Shared architectural concept renderer. Inspired by the portfolio's vocabulary;
   not a surveyed BIM model of The Affluence. Three.js is vendored locally. */
function createBuildingScene(host){
 let api=null,dead=false;const state={active:true,paused:matchMedia('(prefers-reduced-motion: reduce)').matches,roof:0,warm:0,wire:false,yaw:0};
 const abort=new AbortController();
 const control={setActive(v){state.active=v;api?.refresh()},setPaused(v){state.paused=v;api?.refresh()},setRoof(v){state.roof=v;api?.refresh()},setWarm(v){state.warm=v;api?.refresh()},setWireframe(v){state.wire=v;api?.wire(v)},rotate(v){state.yaw+=v;api?.refresh()},reset(){Object.assign(state,{roof:0,warm:0,wire:false,yaw:0});api?.wire(false);api?.refresh()},destroy(){dead=true;abort.abort();api?.destroy()}};
 const fallback=host.querySelector('.building-fallback');
 import('./assets/three.module.min.js').then(T=>{
 if(dead)return;
 let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch{host.classList.add('model-unavailable');return}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.outputColorSpace=T.SRGBColorSpace;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.set(10,8,12);camera.lookAt(0,1.4,0);
 const world=new T.Group(),roofGroup=new T.Group();scene.add(world);world.add(roofGroup);
 const sky=new T.HemisphereLight(0xeaf2ff,0x76745b,2.4);scene.add(sky);
 const sun=new T.DirectionalLight(0xfff1dd,3.5);sun.position.set(-6,10,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun);
 const fill=new T.DirectionalLight(0xe0ebff,1);fill.position.set(7,5,-4);scene.add(fill);
 let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 function texture(base,grain){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,256);for(let i=0;i<12000;i++){g.fillStyle=`rgba(70,61,42,${random()*.09})`;g.fillRect(random()*256,random()*256,grain?1+random()*8:1,1)}if(grain){g.strokeStyle='#9f967a25';for(let i=0;i<20;i++){g.beginPath();g.moveTo(0,i*14);g.bezierCurveTo(70,i*14-5,170,i*14+6,256,i*14);g.stroke()}}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,2);return t}
 const stoneMap=texture('#e2dbc8',true),paveMap=texture('#aaa798',false),woodMap=texture('#716047',true);
 const stone=new T.MeshStandardMaterial({map:stoneMap,roughness:.82}),trim=new T.MeshStandardMaterial({color:0xf0ebdc,roughness:.7}),paving=new T.MeshStandardMaterial({map:paveMap,roughness:.94}),wood=new T.MeshStandardMaterial({map:woodMap,roughness:.7}),metal=new T.MeshStandardMaterial({color:0x323a39,roughness:.3,metalness:.75}),glass=new T.MeshPhysicalMaterial({color:0x344b58,roughness:.12,metalness:.32,clearcoat:1,clearcoatRoughness:.08}),grass=new T.MeshStandardMaterial({color:0x78864b,roughness:1}),leaf=new T.MeshStandardMaterial({color:0x52683a,roughness:.9,side:T.DoubleSide}),dark=new T.MeshStandardMaterial({color:0x222722,roughness:.8});
 const materials=[stone,trim,paving,wood,metal,glass,grass,leaf,dark];
 function box(x,y,z,w,h,d,mat=stone,parent=world){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),mat);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
 box(0,-.25,0,9,.25,8,paving);box(0,0,-.5,6.8,.2,4.7,trim);
 // Three connected two-storey volumes, with a recessed central entry.
 box(-2.15,.2,-.7,2.3,3.8,3.8);box(2.15,.2,-.7,2.3,3.8,3.8);box(0,.2,-1.25,2,4.15,2.7);
 box(0,.2,.13,1.45,3.55,.08,dark);box(0,.2,.21,.8,2.15,.10,wood);box(.29,1.02,.28,.025,.55,.025,trim);
 function windowBay(x,y,z,w,h){box(x,y,z,w,h,.055,glass);for(const dx of [-w/2,0,w/2])box(x+dx,y,z+.05,.035,h,.08,metal);for(const dy of [0,h])box(x,y+dy,z+.05,w,.035,.08,metal);box(x,y-.05,z+.07,w+.18,.065,.18,trim);for(let i=0;i<4;i++)box(x-w*.43+i*w*.27,y+.07,z+.034,.015,h-.12,.02,trim)}
 for(const x of [-2.15,2.15]){windowBay(x,.43,1.215,1.48,1.35);windowBay(x,2.1,1.215,1.48,1.35);box(x,1.82,1.31,1.77,.13,.22,trim);for(const dx of [-1,1])box(x+dx*.99,.2,1.35,.16,3.9,.35,trim);box(x,3.92,1.35,2.15,.18,.35,trim)}
 for(const x of [-.97,.97]){box(x,.2,.65,.21,4.05,.38,trim);box(x*1.15,.2,.51,.075,4.2,.2,trim)}box(0,4.15,.65,2.3,.2,.38,trim);
 for(let i=0;i<14;i++)box(-.87+i*.135,3.64,.86,.035,.47,.10,wood);
 // Side windows and shallow reveals.
 for(const side of [-1,1])for(const z of [-1.5,0])for(const y of [.5,2.2]){box(side*3.31,y,z,.035,1.15,.8,glass);box(side*3.33,y-.06,z,.09,.07,1,trim)}
 // Removable roof plate with parapets and fine cornice shadows.
 for(const x of [-2.15,0,2.15]){const w=x===0?2.3:2.55,top=x===0?4.43:4.12;box(x,top,-.65,w,.16,4.02,trim,roofGroup);for(const z of [-2.6,1.3])box(x,top+.16,z,w,.17,.1,stone,roofGroup);for(const dx of [-w/2,w/2])box(x+dx,top+.16,-.65,.1,.17,4,stone,roofGroup)}
 // Courtyard paving, planted beds and entrance stairs.
 for(let x=-4;x<4;x+=.65)for(let z=1.65;z<3.7;z+=.65)box(x,.006,z,.62,.025,.62,paving);
 for(let i=0;i<4;i++)box(0,.02+i*.045,2.15-i*.21,1.8,.06,.26,trim);
 for(const x of [-2.3,2.3]){box(x,.04,2.85,1.8,.035,.95,grass);for(let i=0;i<6;i++){const bush=new T.Mesh(new T.SphereGeometry(.18+random()*.08,8,6),leaf);bush.position.set(x-.7+i*.28,.23,2.7+random()*.3);bush.scale.y=.7;world.add(bush);bush.castShadow=true}}
 function palm(x,z,h){const trunk=new T.Mesh(new T.CylinderGeometry(.05,.085,h,8),wood);trunk.position.set(x,h/2,z);trunk.castShadow=true;world.add(trunk);for(let j=0;j<8;j++){const a=j*Math.PI/4;const curve=new T.QuadraticBezierCurve3(new T.Vector3(x,h,z),new T.Vector3(x+Math.cos(a)*.5,h+.4,z+Math.sin(a)*.5),new T.Vector3(x+Math.cos(a)*1.1,h-.25,z+Math.sin(a)*1.1));const frond=new T.Mesh(new T.TubeGeometry(curve,10,.04,4,false),leaf);world.add(frond);for(let k=2;k<9;k++){const t=k/10,p=curve.getPoint(t);for(const dir of [-1,1]){const shape=new T.Mesh(new T.ConeGeometry(.09,.55*(1-t)+.2,3),leaf);shape.position.copy(p);shape.rotation.set(Math.PI/3,a+dir*.7,dir*.9);world.add(shape)}}}}
 palm(-3.8,-1.8,3.4);palm(3.8,-2.2,3.7);
 const ground=new T.Mesh(new T.PlaneGeometry(35,35),new T.ShadowMaterial({opacity:.18}));ground.rotation.x=-Math.PI/2;ground.position.y=-.26;ground.receiveShadow=true;scene.add(ground);
 let frame=0,last=0,phase=0,yaw=state.yaw,roof=0,warm=0,inView=true,drag=null,velocity=0;
 function draw(dt=0){const ease=state.paused?1:1-Math.exp(-5*Math.max(dt,.016));yaw+=(state.yaw-yaw)*ease;roof+=(state.roof-roof)*ease;warm+=(state.warm-warm)*ease;world.rotation.y=yaw+Math.sin(phase*.16)*.10;roofGroup.position.y=roof*1.1;sun.color.set(0xfff1dd).lerp(new T.Color(0xffb86d),warm*.75);sun.position.set(-6+warm*4,10-warm*6,7);sky.intensity=2.4-warm*.65;renderer.render(scene,camera)}
 function tick(t){frame=0;if(dead||!state.active||!inView||document.hidden)return;const dt=Math.min((t-last)/1000||.016,.05);last=t;if(!state.paused){phase+=dt;if(!drag){state.yaw+=velocity;velocity*=Math.pow(.92,dt*60)}}draw(dt);if(!state.paused)frame=requestAnimationFrame(tick)}
 function refresh(){if(frame)cancelAnimationFrame(frame);frame=0;if(dead||!state.active||!inView||document.hidden)return;last=performance.now();draw();if(!state.paused)frame=requestAnimationFrame(tick)}
 const resize=()=>{const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;const distance=camera.aspect<1?19:16;camera.position.set(distance*.53,distance*.44,distance*.68);camera.lookAt(0,1.6,0);camera.updateProjectionMatrix();refresh()};
 const observer=new ResizeObserver(resize);observer.observe(host);const visibility=new IntersectionObserver(es=>{inView=es[0].isIntersecting;refresh()});visibility.observe(host);
 const options={signal:abort.signal};host.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=e.clientX;velocity=0;host.setPointerCapture(e.pointerId);host.classList.add('dragging')},options);host.addEventListener('pointermove',e=>{if(drag===null)return;velocity=(e.clientX-drag)*.006;state.yaw+=velocity;drag=e.clientX;refresh()},options);const release=()=>{drag=null;host.classList.remove('dragging')};for(const name of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(name,release,options);host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();control.rotate(e.key==='ArrowLeft'?-.2:.2)}},options);document.addEventListener('visibilitychange',refresh,options);
 api={refresh,wire(v){materials.forEach(m=>m.wireframe=v);refresh()},destroy(){cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();const geometries=new Set(),mats=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m))});geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());[stoneMap,paveMap,woodMap].forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()}};
 if(fallback)fallback.hidden=true;host.classList.add('model-ready');resize();api.wire(state.wire);
 }).catch(()=>{if(!dead)host.classList.add('model-unavailable')});
 return control;
}
