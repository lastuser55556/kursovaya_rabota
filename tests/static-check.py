#!/usr/bin/env python3
"""Reproducible offline checks. Run with Python 3 from any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, shutil, subprocess, struct
ROOT=Path(__file__).resolve().parents[1]
NODE=shutil.which('node') or str(Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node')
BASE='https://lastuser55556.github.io/kursovaya_rabota/'
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(); self.path=path;self.ids=set();self.refs=[];self.meta={};self.title='';self.in_title=False;self.tags=[];self.feed(path.read_text())
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append((tag,a))
        if a.get('id'):self.ids.add(a['id'])
        if tag=='title':self.in_title=True
        if tag=='meta':self.meta[a.get('name') or a.get('property')]=a.get('content','')
        for key in ('href','src'):
            if a.get(key):self.refs.append((tag,key,a[key]))
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data
pages={p.name:Page(p) for p in sorted(ROOT.glob('*.html'))}
checks=[]
def check(name,ok,evidence):checks.append({'check':name,'status':'PASS' if ok else 'FAIL','evidence':evidence})
expected={'index.html','tires.html','storage.html','services.html','winter-tips.html','contacts.html','thanks.html','privacy.html','404.html'}
check('nine_required_html',set(pages)==expected,sorted(pages))
links=[];bad_links=[]
for name,page in pages.items():
    for tag,attr,ref in page.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc:
            if not ref.startswith(BASE):continue
            relative=ref[len(BASE):];url=urlsplit(relative)
        target=(ROOT/unquote(url.path)) if url.path else page.path
        if not target.is_file():bad_links.append({'page':name,'reference':ref,'reason':'missing_file'})
        elif url.fragment and target.suffix=='.html':
            other=pages.get(target.name)
            if other and unquote(url.fragment) not in other.ids:bad_links.append({'page':name,'reference':ref,'reason':'missing_fragment'})
        links.append({'page':name,'reference':ref})
check('internal_links_and_fragments',not bad_links,{'checked':len(links),'errors':bad_links,'method':'existing local files; external services not fetched'})
for name,page in pages.items():
    required=['description','og:title','og:description','og:image','viewport']
    missing=[k for k in required if not page.meta.get(k)]
    check(name+':seo_metadata',bool(page.title.strip()) and not missing,{'title':page.title,'description':page.meta.get('description'),'missing':missing})
    check(name+':language_h1',any(t=='html' and a.get('lang')=='ru' for t,a in page.tags) and sum(t=='h1' for t,a in page.tags)==1,{'language':'ru' if any(t=='html' and a.get('lang')=='ru' for t,a in page.tags) else None,'h1_count':sum(t=='h1' for t,a in page.tags)})
    check(name+':favicon',any(t=='link' and a.get('rel')=='icon' and (ROOT/a.get('href','')).is_file() for t,a in page.tags),[a.get('href') for t,a in page.tags if t=='link' and a.get('rel')=='icon'])
    check(name+':image_alts',all('alt' in a for t,a in page.tags if t=='img'),{'images':sum(t=='img' for t,a in page.tags),'missing':[a.get('src') for t,a in page.tags if t=='img' and 'alt' not in a]})
    check(name+':ga4_head_tag',any(t=='script' and 'googletagmanager.com/gtag/js?id=G-' in a.get('src','') for t,a in page.tags),{'method':'static script presence only; resource ownership/DebugView not proven'})
check('unique_titles',len({p.title for p in pages.values()})==len(pages),{n:p.title for n,p in pages.items()})
check('unique_descriptions',len({p.meta.get('description') for p in pages.values()})==len(pages),{n:p.meta.get('description') for n,p in pages.items()})
def jpeg_size(path):
    with path.open('rb') as f:
        if f.read(2)!=b'\xff\xd8':return None
        while True:
            b=f.read(1)
            if not b:return None
            if b!=b'\xff':continue
            while b==b'\xff':b=f.read(1)
            marker=b[0]
            if marker in (0xd8,0xd9):continue
            size=struct.unpack('>H',f.read(2))[0]
            if marker in (0xc0,0xc1,0xc2):
                chunk=f.read(5);height,width=struct.unpack('>HH',chunk[1:]);return width,height
            f.seek(size-2,1)
og=ROOT/'img/og.jpg';dimensions=jpeg_size(og) if og.is_file() else None
check('og_asset_1200x630',dimensions==(1200,630),{'path':'img/og.jpg','dimensions':dimensions,'bytes':og.stat().st_size if og.exists() else None})
rasters=[p for p in (ROOT/'img').glob('*') if p.suffix.lower() in ('.jpg','.jpeg','.webp','.png')]
check('raster_size_format',all(p.stat().st_size<=300*1024 and p.suffix.lower() in ('.jpg','.jpeg','.webp') for p in rasters),[{'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size} for p in rasters])
for p in sorted((ROOT/'js').glob('*.js')):
    result=subprocess.run([NODE,'--check',str(p)],capture_output=True,text=True)
    check('syntax:'+str(p.relative_to(ROOT)),result.returncode==0,{'command':f'node --check {p.relative_to(ROOT)}','exit_code':result.returncode,'stderr':result.stderr})
result=subprocess.run([NODE,str(ROOT/'tests/analytics.test.cjs')],cwd=ROOT,capture_output=True,text=True)
check('analytics_local_vm_contract',result.returncode==0,{'command':'node tests/analytics.test.cjs','exit_code':result.returncode,'stdout':result.stdout,'stderr':result.stderr,'limitation':'Local browser mocks only; not GA4 delivery or DebugView evidence'})
result=subprocess.run([NODE,str(ROOT/'tests/backend.test.cjs')],cwd=ROOT,capture_output=True,text=True)
check('apps_script_local_vm_tests',result.returncode==0,{'command':'node tests/backend.test.cjs','exit_code':result.returncode,'stdout':result.stdout,'stderr':result.stderr,'limitation':'VM mocks Google services; not a real Sheets integration'})
report={'scope':'Offline static HTML/assets/syntax checks and local Apps Script VM tests; not acceptance or live analytics verification.','summary':{'pass':sum(x['status']=='PASS' for x in checks),'fail':sum(x['status']=='FAIL' for x in checks)},'checks':checks}
output=ROOT/'tests/static-report.json';output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report['summary']));print('Report: tests/static-report.json')
for item in checks:
    if item['status']=='FAIL':print('FAIL:',item['check'],json.dumps(item['evidence'],ensure_ascii=False))
raise SystemExit(1 if report['summary']['fail'] else 0)
