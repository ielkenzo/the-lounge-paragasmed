const escapeHtml=value=>String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const loadJson=async path=>{
  const response=await fetch(path,{headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`Could not load ${path}`);
  return response.json();
};
const replaceContent=(selector,html)=>{
  const element=document.querySelector(selector);
  if(element)element.innerHTML=html;
};

async function loadHomeContent(){
  try{
    const [machines,technologies,services,content]=await Promise.all([
      loadJson('data/machines.json'),loadJson('data/technologies.json'),
      loadJson('data/services.json'),loadJson('data/content.json')
    ]);
    replaceContent('.machine-grid',machines.map(machine=>`<article class="machine-card" data-machine-carousel aria-label="${escapeHtml(machine.label)}"><div class="machine-slides">${machine.images.map((item,index)=>`<figure class="machine-slide${item.product?' product-shot':''}${index===0?' active':''}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}"${index?' loading="lazy"':''}></figure>`).join('')}</div><div class="machine-controls"><button data-machine-prev aria-label="Previous ${escapeHtml(machine.name)} photo">‹</button><div class="machine-dots"></div><button data-machine-next aria-label="Next ${escapeHtml(machine.name)} photo">›</button></div><div class="machine-info"><div class="machine-badges">${machine.badges.map(item=>`<span class="badge">${escapeHtml(item)}</span>`).join('')}</div><h4>${escapeHtml(machine.name)}</h4><p>${escapeHtml(machine.description)}</p><div class="machine-focus">${machine.focus.map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div></div></article>`).join(''));
    replaceContent('.tech-grid',technologies.map(item=>`<article class="tech-card ${escapeHtml(item.classes)}" style="background-image:url('${escapeHtml(item.image)}')"><div class="tech-copy"><small>${escapeHtml(item.category)}</small><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.description)}</p></div></article>`).join(''));
    replaceContent('.service-grid',services.home.map(item=>`<article class="service-card"><div class="service-icon">${escapeHtml(item.icon)}</div><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.description)}</p></article>`).join(''));
    replaceContent('.trust',content.home.trust.map(item=>`<div><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></div>`).join(''));
    document.dispatchEvent(new CustomEvent('content:updated'));
  }catch(error){console.info('Using built-in home content fallback.',error.message)}
}

async function loadTreatmentContent(){
  try{
    const services=await loadJson('data/services.json');
    const intro=document.querySelector('#catalog > .catalog-intro');
    if(!intro)return;
    document.querySelectorAll('#catalog > .treatment-row').forEach(item=>item.remove());
    intro.insertAdjacentHTML('afterend',services.treatments.map((item,index)=>`<article class="treatment-row${index%2?' reverse':''}" id="${escapeHtml(item.id)}"><div class="treatment-copy"><span class="number">${escapeHtml(item.number)}</span><div class="eyebrow">${escapeHtml(item.eyebrow)}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><h4>${escapeHtml(item.listTitle)}</h4><ul>${item.items.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ul><div class="meta">${item.meta.map(value=>`<span><b>${escapeHtml(value[0])}</b>${escapeHtml(value[1])}</span>`).join('')}</div></div><div class="carousel" data-carousel aria-label="${escapeHtml(item.name)} gallery"><div class="slides">${item.images.map((image,imageIndex)=>`<figure class="slide${imageIndex===0?' active':''}${image[3]?' '+escapeHtml(image[3]):''}"><img src="${escapeHtml(image[0])}" alt="${escapeHtml(image[1])}"${imageIndex?' loading="lazy"':''}><figcaption>${escapeHtml(image[2])}</figcaption></figure>`).join('')}</div><div class="carousel-controls"><button data-prev aria-label="Previous ${escapeHtml(item.name)} photo">‹</button><div class="dots"></div><button data-next aria-label="Next ${escapeHtml(item.name)} photo">›</button></div></div></article>`).join(''));
    document.dispatchEvent(new CustomEvent('content:updated'));
  }catch(error){console.info('Using built-in treatment content fallback.',error.message)}
}

async function loadAboutContent(){
  try{
    const {about}=await loadJson('data/content.json');
    replaceContent('.mission-grid',about.mission.map(item=>`<article class="mission-card"><div class="mission-icon">${escapeHtml(item.icon)}</div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.description)}</p></article>`).join(''));
    replaceContent('.locations-grid',about.locations.map(item=>`<article class="location-card"><div class="eyebrow">${escapeHtml(item.eyebrow)}</div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.description)}</p></article>`).join(''));
  }catch(error){console.info('Using built-in about content fallback.',error.message)}
}

if(document.querySelector('.machine-grid'))loadHomeContent();
if(document.querySelector('#catalog'))loadTreatmentContent();
if(document.querySelector('.mission-grid'))loadAboutContent();
