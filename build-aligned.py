"""Rebuild BoloHi from the frozen, verified v19 baseline. Python 3 + Pillow."""
from pathlib import Path
import base64,copy,hashlib,html,json,re,shutil,colorsys
from PIL import Image
root=Path(__file__).resolve().parent
source=(root/'baseline/index.html').read_text('utf-8')
cfg=json.loads((root/'brand-config.json').read_text('utf-8'))
product=json.loads((root/'product-copy.json').read_text('utf-8'))
out=root/'dist';assets=out/'assets';assets.mkdir(parents=True,exist_ok=True)
def obj(s,name):
 a=s.index('const '+name+'=')+len('const '+name+'=');v,n=json.JSONDecoder().raw_decode(s[a:]);return v,a,a+n
def replace_obj(s,name,value):
 _,a,b=obj(s,name);return s[:a]+json.dumps(value,ensure_ascii=False,indent=2)+s[b:]
reference,_,_=obj(source,'CONTENT')
page=source.replace('Ola Party','BoloHi').replace('OlaParty','BoloHi').replace('ola-preview-','bolohi-preview-').replace('olapartyservice@gmail.com',cfg['links']['email']).replace('HAGO SINGAPORE PTE. LTD.',cfg['company']).replace('30 PASIR PANJANG ROAD #15-31A MAPLETREE BUSINESS CITY SINGAPORE 117440',cfg['address'])
content=product
expected=json.loads(json.dumps(reference,ensure_ascii=False).replace('Ola Party','BoloHi').replace('OlaParty','BoloHi').replace('olapartyservice@gmail.com',cfg['links']['email']).replace('HAGO SINGAPORE PTE. LTD.',cfg['company']).replace('30 PASIR PANJANG ROAD #15-31A MAPLETREE BUSINESS CITY SINGAPORE 117440',cfg['address']))
assert content==expected, 'All display copy must match the confirmed v19 baseline, except brand facts.'
# User confirmed on 2026-11-17: reuse all v19 display copy; substitute brand facts only.
page=replace_obj(page,'CONTENT',content)
page=replace_obj(page,'LINKS',cfg['links'])
policies={}
for k in ['terms','privacy','children']:
 body=json.loads((root/'sources'/f'{k}-policy.json').read_text('utf-8'))['data']['acticle_content']
 body=re.sub(r'<script\b[^>]*>.*?</script>','',body,flags=re.S|re.I)
 body=re.sub(r'\son\w+="[^"]*"','',body,flags=re.I)
 policies[k]=body.replace('target="_blank"','target="_blank" rel="noopener noreferrer"')
# Official wording is preserved, including its documented legacy-brand typo.
page=replace_obj(page,'POLICIES',policies)
# Paint-only transformation: preserve every layout declaration, selector and breakpoint.
TOKEN=re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)')
exact={'#146d58':'#25251c','#d1ff69':'#ffed00','#ddfaec':'#fff8c7','#fffdf4':'#fffef5','#19264b':'#171714','#ffe476':'#ffed00','#526b60':'#646147','#111':'#fff8c7'}
def color(m):
 t=m[0];low=t.lower()
 if low in exact:return exact[low]
 if low.startswith('rgb'):
  nums=re.findall(r'[\d.]+',low)
  if len(nums)>=3 and int(float(nums[1]))>int(float(nums[0])):return 'rgba(93,85,30,'+(nums[3] if len(nums)>3 else '1')+')'
  return t
 v=low[1:];v=''.join(c*2 for c in v) if len(v)==3 else v
 if len(v) not in [6,8]:return t
 r,g,b=[int(v[i:i+2],16)/255 for i in (0,2,4)];h,l,s=colorsys.rgb_to_hls(r,g,b)
 if s>.04 and (l>.65 or 30/360<h<330/360):
  r,g,b=colorsys.hls_to_rgb(54/360,l,min(s,.75));return '#'+''.join(f'{round(x*255):02x}' for x in (r,g,b))+v[6:]
 return t
page=re.sub(r'<style>(.*?)</style>',lambda m:'<style>'+TOKEN.sub(color,m[1])+'</style>',page,flags=re.S)
assert [TOKEN.sub('<color>',x) for x in re.findall('<style>(.*?)</style>',source,re.S)]==[TOKEN.sub('<color>',x) for x in re.findall('<style>(.*?)</style>',page,re.S)]
# Assets: only generic baseline badges/fonts, real brand marks and named placeholders.
assetmap={}
original_assets,_,_=obj(source,'ASSETS')
for f in (root/'baseline/assets').iterdir():
 shutil.copy2(f,assets/f.name);assetmap[f.name]='assets/'+f.name
for f in (root/'brand').iterdir():shutil.copy2(f,assets/f.name)
def placeholder(name,w,h,label):
 text=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="#fff6bd"/><rect x="{w*.07}" y="{h*.07}" width="{w*.86}" height="{h*.86}" rx="28" fill="none" stroke="#e7dca3" stroke-width="2" stroke-dasharray="8 12"/><text x="50%" y="49%" text-anchor="middle" font-family="sans-serif" font-size="{max(16,w*.035)}" fill="#8d845b">{label}</text><text x="50%" y="54%" text-anchor="middle" font-family="sans-serif" font-size="{max(12,w*.021)}" fill="#9f9672">{w} × {h}</text></svg>'
 (assets/name).write_text(text,'utf-8');return 'assets/'+name
placeholder('placeholder-hero-desktop.svg',1600,900,'首屏素材待替换 · Hero placeholder')
placeholder('placeholder-hero-mobile.svg',900,1600,'首屏素材待替换')
for i,s in enumerate(reference['en']['home']['scenes'],1):assetmap[s['image']]=placeholder(f'placeholder-scene-{i}.svg',720,1280,'功能素材待替换 · '+str(i))
assetmap['p1_youngs-38ed979a0c.png']=placeholder('placeholder-about.svg',822,756,'素材待替换 · About placeholder')
# Keep original logo canvas ratios. Complete transparent original is centered without cropping.
def logo(name,w,h):
 uri='data:image/png;base64,'+base64.b64encode((root/'brand/logo-dark.png').read_bytes()).decode()
 (assets/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><image width="100%" height="100%" preserveAspectRatio="xMidYMid meet" href="{uri}"/></svg>','utf-8');return 'assets/'+name
assetmap['ola-share-icon.png']=logo('bolohi-logo.svg',500,170)
assetmap['hero-brand-logo.png']=assetmap['ola-share-icon.png']
Image.open(root/'brand/app-icon.webp').resize((64,64)).save(assets/'favicon.png')
assetmap['favicon-32x32-new.png']='assets/favicon.png';assetmap['company-app-logo.png']='assets/app-icon.webp'
bg='<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="b"><stop stop-color="#fffde9"/><stop offset="1" stop-color="#fff4aa"/></linearGradient></defs><rect width="1600" height="900" fill="url(#b)"/><g fill="none" stroke="#eddb58" stroke-width="4" opacity=".28"><path d="M1230 100h190q70 0 70 70v90q0 70-70 70h-90l-55 45 12-45h-57q-70 0-70-70v-90q0-70 70-70Z"/><path d="M70 620q60-75 130 0t130 0M90 660q60-75 130 0t130 0"/></g></svg>'
(assets/'bolohi-background.svg').write_text(bg,'utf-8');assetmap['p1_bg-105ed6b6c9.png']='assets/bolohi-background.svg'
# Resolve unused old artwork keys to neutral placeholders too; no old artwork is shipped.
for k in original_assets:
 if k not in assetmap:assetmap[k]='assets/placeholder-about.svg'
# Clear obsolete branded asset keys without changing event/slot identifiers.
for old,new in [('ola-share-icon.png','bolohi-logo'),('p1_bg-105ed6b6c9.png','bolohi-background'),('p1_youngs-38ed979a0c.png','bolohi-about')]:
 page=page.replace(old,new);assetmap[new]=assetmap.pop(old)
page=replace_obj(page,'ASSETS',assetmap)
page=page.replace('href="assets/favicon-32x32-new.png"','href="assets/favicon.png"')
poster='''function heroVideoPlaceholder(){return `<div class="hero-media-video"><div class="hero-video-stage"><picture><source media="(max-width:680px)" srcset="assets/placeholder-hero-mobile.svg"><img class="hero-loop-freeze" src="assets/placeholder-hero-desktop.svg" alt="BoloHi media placeholder" loading="eager" decoding="async"></picture></div></div>`;}'''
page=re.sub(r'function heroVideoPlaceholder\(\)\{.*?\n(?=function homePage)',lambda _:poster+'\n',page,flags=re.S)
page=re.sub(r'const HERO_MEDIA=\{[^\n]*\};','const HERO_MEDIA={};',page)
scene='''function sceneBackground(){return `<div class="scene-backdrop" aria-hidden="true"><i></i><svg viewBox="0 0 720 420" fill="none"><g stroke="var(--scene-line)" stroke-width="3" opacity=".5"><path d="M420 100h170q55 0 55 55v90q0 55-55 55h-60l-45 35 9-35h-74q-55 0-55-55v-90q0-55 55-55Z"/><path d="M100 310q40-50 90 0t90 0M115 340q40-50 90 0t90 0"/></g></svg></div>`;}'''
page=re.sub(r'function sceneBackground\(\)\{[^\n]*',lambda _:scene,page)
page=re.sub(r'name="theme-color" content="[^"]+"','name="theme-color" content="#ffed00"',page)
# Preserve delegated action identifiers and channel order; resolve verified destinations.
page=page.replace("if(action==='preview-download'){toast(downloadCopy().note);return;}","if(action==='preview-download'){const key=event.target.closest('[data-channel]')?.dataset.channel;if(LINKS[key])window.open(LINKS[key],'_blank','noopener,noreferrer');else toast(pendingCopy());return;}")
pending='''
function pendingCopy(){return ({zh:'该渠道链接待确认，当前未接通。请使用已核对的 Google Play 或联系官方客服。',en:'This destination is awaiting confirmation. Please use the verified Google Play listing or contact official support.',hi:'इस लिंक की पुष्टि बाकी है। सत्यापित Google Play पेज या आधिकारिक सहायता का उपयोग करें।',id:'Tautan ini menunggu konfirmasi. Gunakan Google Play terverifikasi atau hubungi dukungan resmi.'})[lang];}
document.addEventListener('click',event=>{const a=event.target.closest('a');if(a&&a.getAttribute('href')===''){event.preventDefault();toast(pendingCopy());}});
'''
ref=reference
slots=(root/'alignment-slots.js').read_text('utf-8')
page=page.replace('\nrender();\n})();',pending+'\nconst ALIGN_IDENTITY='+json.dumps({'address':'30 PASIR PANJANG ROAD #15-31A MAPLETREE BUSINESS CITY SINGAPORE 117440'})+';\nconst ALIGN_REFERENCE='+json.dumps(ref,ensure_ascii=False)+';\n'+slots+'\nrender();\n})();')
(out/'index.html').write_text(page,'utf-8');(out/'robots.txt').write_text('User-agent: *\nDisallow: /\n','utf-8');(out/'.nojekyll').touch()
(root/'check-script.js').write_text('\n'.join(re.findall(r'<script[^>]*>(.*?)</script>',page,re.S)),'utf-8')
(root/'alignment-reference.json').write_text(json.dumps({'version':19,'commit':'f8026d91802eb907a54d9f84c349aa306ef098cd','sha256':hashlib.sha256((root/'baseline/index.html').read_bytes()).hexdigest(),'layout_css_identical_except_colors':True,'scene_ids':[s['id'] for s in reference['en']['home']['scenes']],'hero_ratios':['16:9','9:16'],'scene_canvas':[720,1280]},indent=2),'utf-8')
print('BoloHi built: five placeholder scenes, real marks, v19 CSS layout preserved.')
