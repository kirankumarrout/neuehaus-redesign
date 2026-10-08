/* Cinematic video first, with a shared interactive architectural concept. */
function createHero(hero){
 const stage=hero.querySelector('.hero-scene'),video=hero.querySelector('video'),status=hero.querySelector('.hero-media-status'),pause=hero.querySelector('.motion-toggle');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let stopped=preference.matches,visible=true,disposed=false,mode='film',building=null;
 const abort=new AbortController(),events={signal:abort.signal};
 function sync(){pause.textContent=stopped?'▷':'Ⅱ';pause.setAttribute('aria-label',stopped?'Play animation':'Pause animation');hero.classList.toggle('hero-paused',stopped);building?.setPaused(stopped);building?.setActive(mode==='model'&&visible&&!document.hidden);if(stopped||!visible||document.hidden||mode!=='film')video.pause();else video.play().catch(()=>{if(!disposed&&mode==='film')status.textContent='Tap play to start the film.'})}
 function selectView(next){mode=next;hero.dataset.view=next;stage.inert=next!=='model';hero.querySelectorAll('[data-hero-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.heroView===next)));status.textContent='';if(next==='model'&&!building)building=createBuildingScene(stage);sync()}
 hero.querySelectorAll('[data-hero-view]').forEach(b=>b.addEventListener('click',()=>selectView(b.dataset.heroView),events));pause.addEventListener('click',()=>{stopped=!stopped;sync()},events);
 const roof=hero.querySelector('[data-scene="roof"]'),light=hero.querySelector('[data-scene="light"]');
 roof.addEventListener('click',()=>{const open=roof.getAttribute('aria-pressed')!=='true';roof.setAttribute('aria-pressed',String(open));roof.innerHTML=open?'<span>↡</span> Close roof':'<span>↟</span> Lift roof';building?.setRoof(open?1:0)},events);
 light.addEventListener('click',()=>{const warm=light.getAttribute('aria-pressed')!=='true';light.setAttribute('aria-pressed',String(warm));hero.classList.toggle('golden-hour',warm);building?.setWarm(warm?1:0)},events);
 hero.querySelector('[data-scene="reset"]').addEventListener('click',()=>{building?.reset();roof.setAttribute('aria-pressed','false');roof.innerHTML='<span>↟</span> Lift roof';light.setAttribute('aria-pressed','false');hero.classList.remove('golden-hour')},events);
 document.addEventListener('visibilitychange',sync,events);preference.addEventListener('change',e=>{stopped=e.matches;sync()},events);video.addEventListener('playing',()=>status.textContent='',events);video.addEventListener('error',()=>status.textContent='The film could not load. You can still explore the 3D concept.',events);
 const visibility=new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()},{threshold:.05});visibility.observe(hero);selectView('film');
 return()=>{disposed=true;abort.abort();visibility.disconnect();video.pause();building?.destroy()};
}
