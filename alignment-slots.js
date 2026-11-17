// Keep source text slots and navigation widths fixed when product copy changes.
function alignProductSlots(){
 const reference=ALIGN_REFERENCE[lang];if(!reference)return;
 const issues=[];
 function reserve(element,referenceHtml){
  if(!element)return;
  element.style.removeProperty('height');element.style.removeProperty('min-height');
  const width=element.classList.contains('entity-address')?element.parentElement.clientWidth:element.getBoundingClientRect().width;if(!width)return;
  const probe=element.cloneNode(false);probe.innerHTML=referenceHtml;
  probe.setAttribute('aria-hidden','true');probe.inert=true;
  Object.assign(probe.style,{position:'fixed',left:'0',top:'-99999px',width:width+'px',height:'auto',minHeight:'0',maxHeight:'none',visibility:'hidden',pointerEvents:'none'});
  element.parentElement.appendChild(probe);
  const height=probe.getBoundingClientRect().height,referenceScrollHeight=probe.scrollHeight;probe.remove();
  element.style.height=height+'px';element.style.minHeight=height+'px';
  if(element.scrollHeight>referenceScrollHeight+2)issues.push({selector:element.tagName+'.'+element.className,text:element.textContent,referenceHeight:height,actualHeight:element.scrollHeight});
 }
 reserve($('.entity-name'),'Rambojoy Technology Pte. Ltd.');
 reserve($('.entity-address'),ALIGN_IDENTITY.address);
 if(activePage==='home'){
  reserve($('#hello h1'),reference.home.title);reserve($('#hello .hero-description'),reference.home.description);
  reference.home.scenes.forEach(s=>{
   reserve($('#'+s.id+' .scene-copy h2'),s.title);reserve($('#'+s.id+' .scene-copy>p'),s.description);
  });
  const referenceLabels=[reference.nav.home,...reference.home.scenes.map(s=>s.title)];
  $$('.screen-nav button').forEach((button,i)=>{
   button.style.removeProperty('width');button.style.removeProperty('min-width');
   const probe=button.cloneNode(true);$('span',probe).textContent=referenceLabels[i];
   probe.setAttribute('aria-hidden','true');probe.inert=true;
   Object.assign(probe.style,{position:'fixed',left:'0',top:'-99999px',width:'auto',visibility:'hidden',pointerEvents:'none'});
   button.parentElement.appendChild(probe);const width=probe.getBoundingClientRect().width;probe.remove();
   button.style.width=width+'px';button.style.minWidth=width+'px';
   if(i>0)$('span',button).textContent=reference.home.scenes[i-1].title;
  });
  fitMobileHome(true);
 }else{
  let introText=reference[activePage]?.intro;
  if(activePage.startsWith('policy/'))introText=reference.policyDescriptions[activePage.split('/')[1]];
  if(activePage==='law-enforcement')introText=reference.policyDescriptions.law;
  if(introText)reserve($('.page-intro>.wrap>p'),introText);
  if(activePage==='about'){
   reserve($('.about-copy h2'),reference.about.heading);
   $$('.about-copy>p').forEach((p,i)=>reserve(p,reference.about.paragraphs[i]));
   $$('.about-values article').forEach((article,i)=>{reserve($('h3',article),reference.about.values[i][0]);reserve($('p',article),reference.about.values[i][1]);});
  }
  reserve($('.footer-brand>p'),reference.footer.tagline);
  if(activePage==='help'){
   const rows=reference.faqs.filter(f=>(helpCategory==='all'||f[0]===helpCategory)&&(!searchQuery||(f[1]+' '+f[2]).toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())));
   $$('.faq-item').forEach((el,i)=>{if(rows[i])reserve($('summary',el),escape(rows[i][1]));});
   $$('.support-guide li').forEach((el,i)=>reserve(el,reference.help.preparation[helpCategory][i]));
  }
  if(activePage==='contact'){
   const email=$('.contact-choice a[href^="mailto:"]');
   if(email){
    email.style.removeProperty('width');const probe=email.cloneNode(true);
    const text=[...probe.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(text)text.textContent='bolohiservice@gmail.com';
    probe.setAttribute('aria-hidden','true');probe.inert=true;
    Object.assign(probe.style,{position:'fixed',left:'0',top:'-99999px',width:'auto',visibility:'hidden'});
    email.parentElement.appendChild(probe);const width=probe.getBoundingClientRect().width;probe.remove();
    email.style.width=width+'px';email.style.justifyContent='space-between';
   }
  }
 }
 window.BOLOHI_ALIGNMENT={sourceVersion:19,issues};
 document.documentElement.setAttribute('data-alignment-issues',JSON.stringify(issues));
 document.documentElement.setAttribute('data-alignment-language',lang);
 document.documentElement.setAttribute('data-alignment-width',String(window.innerWidth));
}
const renderAlignedProduct=render;
render=function(){renderAlignedProduct();requestAnimationFrame(alignProductSlots);document.fonts?.ready.then(alignProductSlots);};
window.addEventListener('resize',()=>requestAnimationFrame(alignProductSlots));
