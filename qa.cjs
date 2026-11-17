const {chromium}=require('playwright');const fs=require('fs');const assert=require('assert');
const base='http://127.0.0.1:8137/';const product=base+'26.11.13-bolohi/bolohi-website-preview/dist/';const ola=base+encodeURIComponent('26.11.05-官网优化')+'/ola-hosted-preview/dist/';
const selectors=['.header-inner','.brand','.desktop-nav','.recharge','.language','.header-download','#menu-toggle','.home-window','#hello h1','#hello .hero-description','#hello .desktop-downloads','#hello .hero-media','#hello .hero-media-video','.screen-nav','.entity-name','.entity-address','.compact-footer','#download-dock-slot','.page-intro','.contact-layout','.form-panel','#contact-form','.support-layout','.footer-grid','.footer-bottom'];
async function state(p){return p.evaluate((sels)=>({rects:Object.fromEntries(sels.map(s=>{const e=document.querySelector(s);if(!e)return [s,null];const r=e.getBoundingClientRect();return [s,{x:r.x,y:r.y,w:r.width,h:r.height}]})),issues:window.BOLOHI_ALIGNMENT?.issues||[],overflow:document.documentElement.scrollWidth>innerWidth}),selectors)}
async function ready(p,url){await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(170);await p.evaluate(()=>{document.body.classList.remove('opening');document.querySelectorAll('.hero-loop-video').forEach(v=>v.pause());});}
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report={time:new Date().toISOString(),comparisons:[],errors:[],interactions:[]};
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});const p=await ctx.newPage();const ref=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));
for(const lang of ['en','zh','hi','id']){console.log('Checking',viewport.width,lang);
 await ready(ref,ola+'?lang='+lang);await ready(p,product+'?lang='+lang);
 const a=await state(ref),b=await state(p);let differences=[];
 for(const s of selectors){if(!a.rects[s]||!b.rects[s])continue;for(const k of ['x','y','w','h'])if(!(k==='w'&&s.startsWith('.entity-'))&&Math.abs(a.rects[s][k]-b.rects[s][k])>1)differences.push({selector:s,axis:k,baseline:a.rects[s][k],product:b.rects[s][k]});}
 for(let i=0;i<6;i++){await p.locator(`[data-slide="${i}"]`).click({force:true});await p.waitForTimeout(30);}
 await p.locator('[data-slide="0"]').click({force:true});await p.waitForTimeout(60);
 const issues=await p.evaluate(()=>window.BOLOHI_ALIGNMENT?.issues);report.comparisons.push({viewport,lang,differences,issues,overflow:b.overflow});
 await p.screenshot({path:`screenshots/${viewport.width===1440?'desktop':'mobile'}-${lang}.png`});
 if(lang==='zh'){
  const more=viewport.width>680?p.locator('#hello [data-action="more-downloads"]'):p.locator('#mobile-home-downloads [data-action="more-downloads"]');await more.click();assert.deepEqual(await p.locator('#more-download-panel [data-channel]').evaluateAll(es=>es.map(e=>e.dataset.channel)),['xiaomi','oppo','vivo','huawei']);await p.locator('#more-download-panel [data-channel="xiaomi"]').click();assert((await p.locator('#toast').innerText()).includes('待确认'));await p.keyboard.press('Escape');
  await p.locator('.recharge').click();assert((await p.locator('#toast').innerText()).includes('待确认'));
  if(viewport.width<680){await p.locator('#menu-toggle').click();assert(await p.locator('#mobile-nav').evaluate(e=>e.classList.contains('open')));await p.locator('#menu-toggle').click();}
  if(viewport.width<680){await p.locator('#menu-toggle').click();await p.locator('#mobile-nav [data-action="cookies"]').click();}else await p.locator('#site-footer [data-action="cookies"]').click();await p.locator('#analytics-choice').check();await p.locator('[data-action="cookie-save"]').click();assert(JSON.parse(await p.evaluate(()=>localStorage.getItem('bolohi-preview-cookies'))).analytics);if(viewport.width<680)await p.locator('#menu-toggle').click();
  const popupPromise=p.waitForEvent('popup');const google=viewport.width>680?p.locator('#hello [data-channel="google"]'):p.locator('#mobile-home-downloads [data-channel="google"]');await google.click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded').catch(()=>{});assert(popup.url().includes('com.live.hey'));await popup.close();
  report.interactions.push({viewport,channels:true,rechargePending:true,cookiePersistence:true,mobileMenu:true,googleDestination:true});
 }
 for(const route of ['about','help','contact','safety','policy/terms','policy/privacy','policy/children','policy/community','policy/bullying','policy/cookies','law-enforcement']){
  await ready(p,product+'?lang='+lang+'#/'+route);assert(await p.locator('#main-content').innerText());
  if(['about','help','contact'].includes(route)){
   await ready(ref,ola+'?lang='+lang+'#/'+route);const ar=await state(ref),br=await state(p);const dif=[];for(const s of selectors){if(!ar.rects[s]||!br.rects[s])continue;for(const k of ['x','y','w','h'])if(!(k==='w'&&s.startsWith('.entity-'))&&Math.abs(ar.rects[s][k]-br.rects[s][k])>1)dif.push({s,k,a:ar.rects[s][k],b:br.rects[s][k]});}report.comparisons.push({viewport,lang,route,differences:dif,issues:br.issues,overflow:br.overflow});
  }
  if(lang==='zh'&&route==='help'){await p.locator('#faq-search').fill('no-such-query-928');assert(await p.locator('.empty-state').count());await p.locator('#faq-search').fill('');assert(await p.locator('.faq-item').count());report.interactions.push({viewport,faqSearch:true});}
  if(lang==='zh'&&route==='contact'){assert(!(await p.locator('#contact-form').evaluate(f=>f.checkValidity())));await p.locator('[name="name"]').fill('评审用户');await p.locator('[name="email"]').fill('review@example.com');await p.locator('[name="message"]').fill('这是用于验证官网表单的测试内容。');await p.locator('[name="consent"]').check();await p.locator('#contact-form button[type="submit"]').click();assert((await p.locator('#form-result').innerText()).includes('预览'));await p.screenshot({path:`screenshots/contact-${viewport.width}.png`,fullPage:true});report.interactions.push({viewport,formValidation:true,previewOnly:true});}
 }
}
await ctx.close();}
fs.writeFileSync('qa-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({comparisons:report.comparisons.length,layoutDifferences:report.comparisons.filter(x=>x.differences.length),textIssues:report.comparisons.filter(x=>x.issues?.length),errors:report.errors,interactions:report.interactions},null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
