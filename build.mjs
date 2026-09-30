// Generador estático sin dependencias: src → dist
// Uso: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { site } from './src/config.mjs';
import es from './src/i18n/es.mjs';
import en from './src/i18n/en.mjs';
import { header, contact, footer } from './src/lib/components.mjs';
import * as home from './src/pages/home.mjs';
import * as about from './src/pages/about.mjs';
import * as pedidosya from './src/pages/pedidosya.mjs';
import * as prime from './src/pages/prime.mjs';
import * as rico from './src/pages/rico.mjs';
import * as nestart from './src/pages/nestart.mjs';
import * as notfound from './src/pages/notfound.mjs';

// PREVIEW=1 genera una versión liviana para vista previa (un tamaño por imagen, enlaces a index.html)
const PREVIEW = !!process.env.PREVIEW;
const DIST = PREVIEW ? 'dist-preview' : 'dist';
const dict = { es, en };
const media = JSON.parse(readFileSync('src/data/media.json', 'utf8'));
if (PREVIEW) for (const m of Object.values(media)) if (m.type === 'img') {
  const w = [...m.widths].reverse().find((x) => x <= 1600) || m.widths[0];
  m.h = Math.round(m.h * w / m.w); m.w = w; m.widths = [w]; m.noAvif = true;
}
const cssVer = Date.now().toString(36);

// Rutas limpias por idioma
const routes = {
  home: { es: '', en: 'en/' },
  about: { es: 'sobre-mi/', en: 'en/about/' },
  pedidosya: { es: 'proyectos/pedidosya/', en: 'en/projects/pedidosya/' },
  prime: { es: 'proyectos/prime-cinemas/', en: 'en/projects/prime-cinemas/' },
  rico: { es: 'proyectos/rico/', en: 'en/projects/rico/' },
  nestart: { es: 'proyectos/nestart/', en: 'en/projects/nestart/' },
};
const pages = [home, about, pedidosya, prime, rico, nestart];

// ── Verificación de traducciones: mismas claves en ES y EN ──
function keys(o, pre = '') {
  return Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, pre + k + '.') : [pre + k]));
}
const kEs = new Set(keys(es)), kEn = new Set(keys(en));
const missing = [...kEs].filter((k) => !kEn.has(k)).concat([...kEn].filter((k) => !kEs.has(k)).map((k) => k + ' (solo EN)'));
if (missing.length) { console.error('Faltan traducciones:\n  ' + missing.join('\n  ')); process.exit(1); }

function makeT(lang) {
  return (path) => {
    const v = path.split('.').reduce((o, k) => (o == null ? o : o[k]), dict[lang]);
    if (v === undefined) throw new Error(`Texto no encontrado: ${lang}:${path}`);
    return v;
  };
}

function makeCtx(lang, path, { absolute = false } = {}) {
  const rel = (target) => {
    if (absolute) return '/' + target;
    const r = relative('/' + path, '/' + target) || '.';
    return (r + (target.endsWith('/') || target === '' ? '/' : '')).replace(/\/\/$/, '/');
  };
  return {
    lang, t: makeT(lang), media, path, rel,
    asset: (p) => rel(p),
    href: (key, hash) => rel(routes[key][lang]) + (PREVIEW ? 'index.html' : '') + (hash ? '#' + hash : ''),
  };
}

const abs = (p) => site.url + '/' + p;

function layout(ctx, meta, body, { alt = null, noindex = false } = {}) {
  const t = ctx.t, m = t('meta.' + meta.key);
  const url = abs(ctx.path);
  const og = abs(`og/${meta.og || 'og-home'}-${ctx.lang}.jpg`);
  const altLinks = alt ? `
<link rel="alternate" hreflang="es" href="${abs(alt.es)}">
<link rel="alternate" hreflang="en" href="${abs(alt.en)}">
<link rel="alternate" hreflang="x-default" href="${abs(alt.es)}">` : '';
  const ld = meta.key === 'home' ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: 'UX/UI Designer', email: 'mailto:' + site.email, url: site.url,
    address: { '@type': 'PostalAddress', addressLocality: 'Cochabamba', addressCountry: 'BO' },
    ...(site.links.linkedin ? { sameAs: [site.links.linkedin] } : {}),
  })}</script>` : '';
  const preload = (meta.preload || []).join('');
  return `<!doctype html>
<html lang="${ctx.lang}" class="no-js" data-theme="light" data-alt-es="${alt ? ctx.rel(alt.es) + (PREVIEW ? 'index.html' : '') : ''}" data-alt-en="${alt ? ctx.rel(alt.en) + (PREVIEW ? 'index.html' : '') : ''}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${m.title}</title>
<meta name="description" content="${m.desc}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}${altLinks}
<meta name="author" content="${site.name}">
<meta name="theme-color" content="#fdfcfa">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="${meta.key === 'home' || meta.key === 'about' ? 'website' : 'article'}">
<meta property="og:site_name" content="${site.name} · UX/UI Designer">
<meta property="og:title" content="${m.title}">
<meta property="og:description" content="${m.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${m.title}">
<meta property="og:locale" content="${t('meta.ogLocale')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${m.title}">
<meta name="twitter:description" content="${m.desc}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${ctx.asset('favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${ctx.asset('apple-touch-icon.png')}">
<link rel="preload" href="${ctx.asset('fonts/instrument-serif-400.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${ctx.asset('fonts/karla-400.woff2')}" as="font" type="font/woff2" crossorigin>
${preload}
<script>
(function(){var d=document.documentElement;d.className=d.className.replace('no-js','js');var s,l;
try{s=localStorage.getItem('theme');l=localStorage.getItem('lang')}catch(e){}
d.dataset.theme=s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
var r=document.referrer,same=false;try{same=r&&new URL(r).origin===location.origin}catch(e){}
if(l&&l!==d.lang&&!same){var a=d.getAttribute('data-alt-'+l);if(a)location.replace(a+location.hash)}
if(!d.dataset.altEs&&l)d.lang=l;})();
</script>
<link rel="stylesheet" href="${ctx.asset('css/styles.css')}?v=${cssVer}">
<script src="${ctx.asset('js/main.js')}?v=${cssVer}" defer></script>
${ld}
</head>
<body class="${meta.bodyClass || ''}${meta.section === 'projects' ? ' has-progress' : ''}">
${header(ctx)}
<main id="main" tabindex="-1">
${body}
</main>
${contact(ctx)}
${footer(ctx)}
</body>
</html>`;
}

// ── Build ──
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync('public', DIST, { recursive: true });

// Fuentes (auto-hospedadas desde @fontsource)
mkdirSync(join(DIST, 'fonts'), { recursive: true });
const fs = 'node_modules/@fontsource';
const fonts = {
  'instrument-serif-400.woff2': 'instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  'instrument-serif-400-italic.woff2': 'instrument-serif/files/instrument-serif-latin-400-italic.woff2',
  'karla-400.woff2': 'karla/files/karla-latin-400-normal.woff2',
  'karla-500.woff2': 'karla/files/karla-latin-500-normal.woff2',
  'karla-600.woff2': 'karla/files/karla-latin-600-normal.woff2',
  'karla-700.woff2': 'karla/files/karla-latin-700-normal.woff2',
  'plex-mono-400.woff2': 'ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
  'plex-mono-500.woff2': 'ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
};
for (const [to, from] of Object.entries(fonts)) cpSync(join(fs, from), join(DIST, 'fonts', to));

const sitemap = [];
for (const lang of ['es', 'en']) {
  for (const P of pages) {
    const key = P.meta.key;
    const path = routes[key][lang];
    const ctx = makeCtx(lang, path);
    ctx.section = P.meta.section;
    const ix = PREVIEW ? 'index.html' : '';
    ctx.langHref = { es: ctx.rel(routes[key].es) + ix, en: ctx.rel(routes[key].en) + ix };
    // Precarga de la imagen principal (LCP)
    const html = layout(ctx, P.meta, P.default(ctx), { alt: routes[key] });
    const out = join(DIST, path, 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    sitemap.push({ loc: abs(path), es: abs(routes[key].es), en: abs(routes[key].en) });
  }
}

// 404 (rutas absolutas para que funcione en cualquier URL)
if (!PREVIEW) {
  const ctx = makeCtx('es', '', { absolute: true });
  ctx.section = '';
  ctx.langHref = { es: '/', en: '/en/' };
  writeFileSync(join(DIST, '404.html'), layout(ctx, notfound.meta, notfound.default(ctx), { noindex: true }));
}

// sitemap + robots
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><xhtml:link rel="alternate" hreflang="es" href="${u.es}"/><xhtml:link rel="alternate" hreflang="en" href="${u.en}"/></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Avisos de enlaces pendientes
const pend = [];
for (const [k, v] of Object.entries(site.links)) if (!v) pend.push('links.' + k);
for (const [p, o] of Object.entries(site.projects)) for (const [k, v] of Object.entries(o)) if (!v) pend.push(`projects.${p}.${k}`);
if (pend.length) console.warn('⚠ Enlaces pendientes en src/config.mjs (sus botones se ocultan):\n  ' + pend.join('\n  '));
if (PREVIEW) { // quitar medios no referenciados
  const { readdirSync, statSync, unlinkSync } = await import('node:fs');
  const html = pages.flatMap((P) => ['es', 'en'].map((l) => readFileSync(join(DIST, routes[P.meta.key][l], 'index.html'), 'utf8'))).join('');
  const walk = (d) => readdirSync(d).flatMap((f) => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);
  for (const f of walk(join(DIST, 'media'))) if (!html.includes(f.slice(DIST.length + 1))) unlinkSync(f);
  for (const f of walk(join(DIST, 'og'))) unlinkSync(f);
}
console.log(`✓ ${pages.length * 2 + 1} páginas generadas en /${DIST}`);
