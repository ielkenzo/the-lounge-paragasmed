let installPrompt=null;
const booking=document.getElementById('booking'),chat=document.getElementById('chat'),toast=document.getElementById('toast');
function openBooking(){booking.classList.add('show')}
function closeBooking(){booking.classList.remove('show')}
function openChat(){chat.classList.add('show')}
function closeChat(){chat.classList.remove('show')}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
booking.addEventListener('click',e=>{if(e.target===booking)closeBooking()});
chat.addEventListener('click',e=>{if(e.target===chat)closeChat()});
document.getElementById('bookingForm').addEventListener('submit',e=>{e.preventDefault();closeBooking();showToast('Appointment request saved in this demo ✓');e.target.reset()});
const replies=[
  [/sofwave|softwave/i,'Sofwave uses ultrasound energy to support collagen stimulation and non-invasive lifting. Suitability, settings and expected results require an in-person medical assessment.'],
  [/xerf|radiofrequency|rf/i,'XERF is a radiofrequency-based treatment designed for skin tightening and contouring. Treatment plans vary based on skin condition and goals.'],
  [/alma|laser|pigment|acne mark/i,'Alma Harmony is a versatile laser and light platform that may be used for concerns such as pigmentation, redness and texture. A dermatologist should determine the right module and settings.'],
  [/botox|wrinkle|inject/i,'Botox consultations review facial movement, goals, medical history and dosing. Results and duration vary by patient.'],
  [/hair|exosome|pdrn/i,'Hair restoration starts with identifying the cause of shedding or thinning. Options may include medical treatment and regenerative protocols depending on assessment.'],
  [/downtime|recovery/i,'Downtime depends on the treatment. Many non-invasive procedures have minimal downtime, while some lasers may require several recovery days.'],
  [/price|cost|how much/i,'Pricing depends on the treatment area, number of sessions and personalized plan. The clinic can confirm pricing after assessment.'],
  [/book|schedule|appointment/i,'Tap the gold Book button to submit an appointment request. In the production version, available slots and email reminders will be connected automatically.']
];
document.getElementById('chatForm').addEventListener('submit',e=>{
  e.preventDefault();
  const input=document.getElementById('chatInput'),q=input.value.trim();
  if(!q)return;
  addBubble(q,'user');input.value='';
  setTimeout(()=>{
    let answer='I can help with general treatment information and booking. For diagnosis, urgent concerns or personalized medical advice, please consult the clinic directly.';
    for(const [r,a] of replies){if(r.test(q)){answer=a;break}}
    addBubble(answer,'bot')
  },450)
});
function addBubble(text,type){
  const b=document.createElement('div');
  b.className='bubble '+type;b.textContent=text;
  document.getElementById('chatBody').appendChild(b);
  b.scrollIntoView({behavior:'smooth',block:'end'})
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.getElementById('installBtn').style.display='block'});
document.getElementById('installBtn').addEventListener('click',async()=>{
  if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null}
  else showToast('On iPhone: Share → Add to Home Screen')
});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
const menuToggle=document.querySelector('[data-menu-toggle]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
if(menuToggle&&mobileMenu){
  const closeMenu=()=>{mobileMenu.classList.remove('show');menuToggle.setAttribute('aria-expanded','false')};
  menuToggle.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')==='true';
    mobileMenu.classList.toggle('show',!open);
    menuToggle.setAttribute('aria-expanded',String(!open));
  });
  mobileMenu.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
}

document.querySelectorAll('[data-machine-carousel]').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('.machine-slide')];
  const dotsWrap=carousel.querySelector('.machine-dots');
  let current=0;
  const dots=slides.map((_,index)=>{
    const dot=document.createElement('button');
    dot.className='machine-dot'+(index===0?' active':'');
    dot.setAttribute('aria-label',`Show machine photo ${index+1} of ${slides.length}`);
    dot.addEventListener('click',()=>show(index));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function show(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
    dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
  }
  carousel.querySelector('[data-machine-prev]').addEventListener('click',()=>show(current-1));
  carousel.querySelector('[data-machine-next]').addEventListener('click',()=>show(current+1));
  let startX=0;
  carousel.addEventListener('touchstart',event=>startX=event.changedTouches[0].clientX,{passive:true});
  carousel.addEventListener('touchend',event=>{
    const distance=event.changedTouches[0].clientX-startX;
    if(Math.abs(distance)>45)show(current+(distance<0?1:-1));
  },{passive:true});
});
