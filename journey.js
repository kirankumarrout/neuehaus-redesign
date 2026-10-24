/* Scroll-scrubbed visual sequence from the client-supplied design reference. */
function createDesignJourney(){
 const section=document.querySelector('.design-journey');if(!section)return ()=>{};
 const video=section.querySelector('video'),label=section.querySelector('.journey-label'),counter=section.querySelector('.journey-count'),meter=section.querySelector('.journey-meter i');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 const chapters=[[0,'Form & light'],[.17,'Bold'],[.48,'Confident'],[.64,'Quiet'],[.81,'Engineering as Foundation'],[.92,'Detail as Discipline']];
 let frame=0,ready=false,loaded=false,desired=0,smoothed=0,lastTick=0,destroyed=false;
 function load(){if(loaded||motion.matches)return;loaded=true;video.src=video.dataset.src;video.load();}
 function seek(){if(!ready||video.seeking||destroyed)return;if(Math.abs(video.currentTime-smoothed)>1/60)video.currentTime=smoothed;}
 function draw(now=performance.now()){frame=0;const dt=Math.min(64,now-(lastTick||now));lastTick=now;const r=section.getBoundingClientRect(),range=Math.max(1,section.offsetHeight-innerHeight),p=Math.max(0,Math.min(1,-r.top/range));
  let index=0;chapters.forEach((c,i)=>{if(p>=c[0])index=i});label.textContent=chapters[index][1];counter.textContent=`0${index+1} / 06`;meter.style.transform=`scaleX(${p})`;
  section.classList.toggle('journey-light',p>.63);if(motion.matches)return;
  desired=p*Math.max(0,(video.duration||32)-.05);if(r.top<innerHeight*1.5&&r.bottom>0)load();
  const gap=desired-smoothed;smoothed=Math.abs(gap)<1/60?desired:smoothed+gap*(1-Math.exp(-dt/85));seek();
  if(Math.abs(desired-smoothed)>1/60)schedule();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
 video.addEventListener('loadedmetadata',()=>{ready=true;schedule()},{signal:abort.signal});
 video.addEventListener('seeked',seek,{signal:abort.signal});
 video.addEventListener('error',()=>{section.classList.add('journey-failed');section.querySelector('.journey-error').hidden=false;},{signal:abort.signal});
 addEventListener('scroll',schedule,{passive:true,signal:abort.signal});addEventListener('resize',schedule,{passive:true,signal:abort.signal});
 motion.addEventListener('change',schedule,{signal:abort.signal});
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){load();schedule();}},{rootMargin:'100% 0px'});observer.observe(section);draw();
 return ()=>{destroyed=true;cancelAnimationFrame(frame);abort.abort();observer.disconnect();video.pause();video.removeAttribute('src');video.load();};
}
