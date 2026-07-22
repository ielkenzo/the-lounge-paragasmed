document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('.slide')];
  const dotsWrap=carousel.querySelector('.dots');
  let current=0;
  const dots=slides.map((_,index)=>{
    const dot=document.createElement('button');
    dot.className='dot'+(index===0?' active':'');
    dot.setAttribute('aria-label',`Show photo ${index+1} of ${slides.length}`);
    dot.addEventListener('click',()=>show(index));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function show(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
    dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
  }
  carousel.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));
  carousel.querySelector('[data-next]').addEventListener('click',()=>show(current+1));
  carousel.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft')show(current-1);
    if(event.key==='ArrowRight')show(current+1);
  });
  let startX=0;
  carousel.addEventListener('touchstart',event=>startX=event.changedTouches[0].clientX,{passive:true});
  carousel.addEventListener('touchend',event=>{
    const distance=event.changedTouches[0].clientX-startX;
    if(Math.abs(distance)>45)show(current+(distance<0?1:-1));
  },{passive:true});
});

const menuToggle=document.querySelector('[data-menu-toggle]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
if(menuToggle&&mobileMenu){
  const closeMenu=()=>{mobileMenu.classList.remove('show');menuToggle.setAttribute('aria-expanded','false')};
  menuToggle.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')==='true';
    mobileMenu.classList.toggle('show',!open);
    menuToggle.setAttribute('aria-expanded',String(!open));
  });
  mobileMenu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
}
