const {chromium}=require('playwright');const fs=require('fs'),assert=require('assert');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const rows=[];
for(const width of [1440,390]){const c=await b.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:'reduce'});const p=await c.newPage(),q=await c.newPage();
for(const lang of ['en','zh','hi','id']){for(const [tab,path] of [[p,'26.11.13-bolohi/bolohi-website-preview'],[q,encodeURIComponent('26.11.05-官网优化')+'/ola-hosted-preview']]){await tab.goto('http://127.0.0.1:8137/'+path+'/dist/?lang='+lang,{waitUntil:'domcontentloaded'});await tab.evaluate(()=>document.fonts.ready);await tab.waitForTimeout(120);}
const measure=()=>[...document.querySelectorAll('.home-slide:not(.loop-clone)')].filter(e=>e.id!=='hello').map(s=>{const r=s.getBoundingClientRect();return {id:s.id,rects:['.scene-grid','.scene-artwork','.scene-copy h2','.scene-copy>p','.desktop-downloads'].map(sel=>{const e=s.querySelector(sel),a=e.getBoundingClientRect();return [sel,a.x-r.x,a.y-r.y,a.width,a.height]})}});
const a=await p.evaluate(measure),r=await q.evaluate(measure);let dif=[];for(let i=0;i<a.length;i++)for(let j=0;j<a[i].rects.length;j++)for(let k=1;k<5;k++)if(Math.abs(a[i].rects[j][k]-r[i].rects[j][k])>1)dif.push([a[i].id,a[i].rects[j][0],k,a[i].rects[j][k],r[i].rects[j][k]]);
rows.push({width,lang,differences:dif});if(lang==='zh'){await p.locator('[data-slide="1"]').click({force:true});await p.waitForTimeout(250);await p.screenshot({path:`screenshots/scene-${width}.png`});}}
await c.close();}
fs.writeFileSync('qa-scenes.json',JSON.stringify(rows,null,2));console.log(rows);await b.close();})().catch(e=>{console.error(e);process.exit(1)});
