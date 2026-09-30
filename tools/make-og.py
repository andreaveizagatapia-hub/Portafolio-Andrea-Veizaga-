# Genera imágenes Open Graph (1200x630) a partir de los recursos reales.
# Uso: node build.mjs && python3 -m http.server 8080 -d dist &  python3 tools/make-og.py
import asyncio, os, json, importlib
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'public','og'); os.makedirs(OUT,exist_ok=True)
T={'es':{'role':'UX/UI Designer','motto':'Entender. Resolver. Diseñar.','about':'Sobre mí','case':'Caso de estudio'},
   'en':{'role':'UX/UI Designer','motto':'Understand. Solve. Design.','about':'About me','case':'Case study'}}
CARDS={'pedidosya':('img_home/fotocard_peya','center 12%',{'es':'Entre la intención y la acción','en':'Between intention and action'},'PedidosYa'),
 'prime':('img_prime/portada_prime','center 3%',{'es':'Una experiencia de compra sin fricciones','en':'A frictionless buying experience'},'Prime Cinemas'),
 'rico':('img_rico/portada_rico','center',{'es':'La mesa perfecta, en menos pasos','en':'The perfect table, in fewer steps'},'Rico'),
 'nestart':('img_nestart/portada_nestart','center',{'es':'Simplificando la búsqueda de un nuevo hogar','en':'Simplifying the search for a new home'},'Nestart')}
BASE='''<!doctype html><meta charset=utf-8><style>
@font-face{font-family:IS;src:url(/fonts/instrument-serif-400.woff2)}@font-face{font-family:IS;font-style:italic;src:url(/fonts/instrument-serif-400-italic.woff2)}
@font-face{font-family:K;font-weight:500;src:url(/fonts/karla-500.woff2)}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;font-family:K;color:#242424}
.s{font-family:IS}</style>'''
def home(l):
    t=T[l]; return BASE+f'''<div style="position:absolute;inset:0;background:#f8f7f1"></div>
<img src="/media/img_home/fotohero1-800.webp" style="position:absolute;right:60px;top:50px;width:420px;height:530px;object-fit:cover;object-position:center 18%;border-radius:6px">
<img src="/img/logo.svg" style="position:absolute;left:70px;top:60px;width:52px">
<div style="position:absolute;left:70px;top:190px"><div style="font-family:monospace;font-size:20px;letter-spacing:.12em;color:#5b5b5b">{'HOLA, SOY' if l=='es' else 'HI, I’M'}</div>
<div class="s" style="font-size:104px;line-height:.92;margin-top:14px;color:#141414">Andrea<br>Veizaga</div>
<div style="font-size:32px;margin-top:24px;color:#141414">— {t['role']}</div>
<div class="s" style="font-size:36px;margin-top:30px;color:#141414">{' '.join(t['motto'].split()[:2])} <i style="color:#967ad1">{t['motto'].split()[2]}</i></div></div>'''
def about(l):
    t=T[l]; return BASE+f'''<div style="position:absolute;inset:0;background:#967ad1"></div>
<img src="/media/sobre_mi/foto_sobremi-800.webp" style="position:absolute;right:70px;top:50px;width:400px;height:530px;object-fit:cover;border-radius:6px">
<img src="/img/logo.svg" style="position:absolute;left:70px;top:60px;width:52px">
<div style="position:absolute;left:70px;top:210px;color:#141414"><div style="font-family:monospace;font-size:20px;letter-spacing:.12em;color:#141414">{t['about'].upper()}</div>
<div class="s" style="font-size:100px;line-height:.95;margin-top:18px">Andrea<br>Veizaga</div><div style="font-size:32px;margin-top:22px">— {t['role']}</div></div>'''
def case(l,k):
    img,pos,title,name=CARDS[k]; t=T[l]; return BASE+f'''<img src="/media/{img}-1200.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{pos}">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.85))"></div>
<div style="position:absolute;left:60px;right:60px;bottom:52px;color:#fdfcfa"><div style="font-size:24px;letter-spacing:.12em;text-transform:uppercase;opacity:.9">{t['case']} · {name}</div>
<div class="s" style="font-size:70px;line-height:1;margin-top:12px">{title[l]}</div><div style="font-size:26px;margin-top:18px;opacity:.9">Andrea Veizaga — {t['role']}</div></div>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1200,'height':630})
        jobs=[]
        for l in ['es','en']:
            jobs+= [(f'og-home-{l}',home(l)),(f'og-about-{l}',about(l)),(f'og-notFound-{l}',home(l))]
            jobs+= [(f'og-{k}-{l}',case(l,k)) for k in CARDS]
        for name,html in jobs:
            open(os.path.join(ROOT,'dist','_og.html'),'w').write(html)
            await pg.goto('http://localhost:8080/_og.html?'+name,wait_until='networkidle'); await pg.evaluate('document.fonts.ready')
            await pg.wait_for_timeout(150)
            await pg.screenshot(path=os.path.join(OUT,name+'.jpg'),type='jpeg',quality=84)
        os.remove(os.path.join(ROOT,'dist','_og.html')); await b.close(); print(len(jobs),'OG images')
asyncio.run(main())
