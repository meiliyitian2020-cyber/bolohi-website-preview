from pathlib import Path
import base64,mimetypes,zipfile,shutil
root=Path(__file__).resolve().parent;out=root/'delivery';out.mkdir(exist_ok=True)
s=(root/'dist/index.html').read_text('utf-8')
for p in (root/'dist/assets').iterdir():
 mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
 s=s.replace('assets/'+p.name,'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode())
(out/'BoloHi-offline.html').write_text(s,'utf-8')
for n in ['baseline/assets/Noto-OFL.txt','README.md','SOURCES-AND-HANDOFF.md','DEPLOYMENT.md','brand-config.json','product-copy.json','qa-report.json','qa-scenes.json','release-verification.json','release-status.json','VALIDATION.md']:
 if (root/n).exists():shutil.copy2(root/n,out/Path(n).name)
with zipfile.ZipFile(out/'BoloHi-review-offline.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in out.iterdir():
  if p.suffix!='.zip':z.write(p,p.name)
 for p in (root/'screenshots').glob('*.png'):z.write(p,'screenshots/'+p.name)
print(out/'BoloHi-review-offline.zip')
