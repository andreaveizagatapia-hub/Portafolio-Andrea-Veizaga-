// Componentes reutilizables (funciones que devuelven HTML).
import { icon, tools } from './icons.mjs';
import { site } from '../config.mjs';

export const PROJECTS = ['pedidosya', 'prime', 'rico', 'nestart'];

// ───────── Medios ─────────
export function pic(ctx, key, o = {}) {
  const m = ctx.media[key];
  if (!m) throw new Error('Imagen no encontrada en manifest: ' + key);
  const { alt = '', sizes = '100vw', cls = '', eager = false, lightbox = false, group = '', imgCls = '' } = o;
  if (m.type === 'svg') return `<img class="${imgCls}" src="${ctx.asset('media/' + m.src)}" alt="${alt}" ${o.w ? `width="${o.w}" height="${o.h}"` : ''} loading="lazy" decoding="async">`;
  const base = ctx.asset('media/' + key);
  const set = (fmt) => m.widths.map((w) => `${base}-${w}.${fmt} ${w}w`).join(', ');
  const mid = m.widths.find((w) => w >= 800) || m.w;
  const img = `<picture class="media ${cls}" style="--ar:${m.w}/${m.h}">`
    + (m.noAvif ? '' : `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">`)
    + `<img class="${imgCls}"${o.pos ? ` style="object-position:${o.pos}"` : ''} src="${base}-${mid}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${alt}"`
    + (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></picture>';
  if (!lightbox) return img;
  return `<button type="button" class="zoom ${o.zoomCls || ''}" data-lb="${base}-${m.w}.webp" data-lb-w="${m.w}" data-lb-h="${m.h}"${group ? ` data-lb-group="${group}"` : ''} aria-label="${ctx.t('common.enlarge')}: ${alt}">${img}<span class="zoom__hint" aria-hidden="true">${icon('expand', { size: 18 })}</span></button>`;
}

export function video(ctx, key, { alt = '', cls = '', clip = '' } = {}) { // cls 'video--bare' = sin marco extra
  const m = ctx.media[key];
  if (!m) throw new Error('Video no encontrado: ' + key);
  return `<figure class="video ${cls}" style="--ar:${m.w}/${m.h}${clip ? `;--clip:${clip}` : ''}">`
    + `<video muted loop playsinline preload="none" poster="${ctx.asset('media/' + m.poster)}" width="${m.w}" height="${m.h}" data-autoplay aria-label="${alt}">`
    + `<source src="${ctx.asset('media/' + m.src)}" type="video/mp4"></video>`
    + `<button type="button" class="video__toggle" data-label-play="${ctx.t('common.play')}" data-label-pause="${ctx.t('common.pause')}" aria-label="${ctx.t('common.play')}">`
    + `<span class="i-play">${icon('play', { size: 18 })}</span><span class="i-pause">${icon('pause', { size: 18 })}</span></button></figure>`;
}

// ───────── UI básica ─────────
export function button(label, href, { variant = 'primary', iconName = '', external = false, download = false, cls = '' } = {}) {
  const ic = iconName ? icon(iconName, { size: 22 }) : '';
  const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="btn btn--${variant} ${cls}" href="${esc(href)}"${ext}${download ? ' download' : ''}>${ic}<span>${label}</span></a>`;
}

export const esc = (u) => String(u).replace(/&(?!amp;)/g, '&amp;');
export const rich = (s) => s; // los textos del diccionario pueden incluir <b>/<em>

export function toolRow(ctx, list) {
  return `<ul class="tools" aria-label="${ctx.t('common.tools')}">`
    + list.map((k) => `<li class="tool${tools[k].invert ? ' tool--invert' : ''}" title="${tools[k].name}">${icon(tools[k].icon, { size: 20, label: tools[k].name })}</li>`).join('')
    + '</ul>';
}

// ───────── Cabecera ─────────
export function header(ctx) {
  const t = ctx.t;
  const nav = [
    ['home', t('nav.home'), ctx.href('home')],
    ['projects', t('nav.projects'), ctx.href('home', 'proyectos')],
    ['about', t('nav.about'), ctx.href('about')],
    ['contact', t('nav.contact'), '#contacto'],
  ];
  const cur = ctx.section; // 'home' | 'projects' | 'about'
  const links = (cls) => nav.map(([k, label, href]) =>
    `<li><a class="${cls}" href="${href}" data-nav="${k}"${k === cur ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  const langSwitch = `<div class="lang" role="group" aria-label="${t('common.language')}">`
    + `<a href="${ctx.langHref.es}" hreflang="es" lang="es" data-set-lang="es"${ctx.lang === 'es' ? ' aria-current="true"' : ''}>ES</a>`
    + `<a href="${ctx.langHref.en}" hreflang="en" lang="en" data-set-lang="en"${ctx.lang === 'en' ? ' aria-current="true"' : ''}>EN</a></div>`;
  const theme = `<button type="button" class="theme-toggle" data-theme-toggle data-label-dark="${t('common.toDark')}" data-label-light="${t('common.toLight')}" aria-label="${t('common.toDark')}">`
    + `<span class="i-moon">${icon('moon', { size: 20 })}</span><span class="i-sun">${icon('sun', { size: 20 })}</span></button>`;
  return `<a class="skip" href="#main">${t('common.skip')}</a>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${ctx.href('home')}" aria-label="${site.name} — ${t('nav.home')}">
      <img src="${ctx.asset('img/logo.svg')}" width="30" height="29" alt="">
    </a>
    <nav class="nav" aria-label="${t('common.mainNav')}"><ul>${links('nav__link')}</ul></nav>
    <div class="header-tools">${langSwitch}${theme}
      <button type="button" class="menu-btn" data-menu-btn aria-expanded="false" aria-controls="mobile-menu" aria-label="${t('common.openMenu')}" data-label-open="${t('common.openMenu')}" data-label-close="${t('common.closeMenu')}">${icon('menu', { size: 24 })}</button>
    </div>
  </div>
  <div class="progress" data-progress aria-hidden="true"></div>
</header>
<div class="mobile-menu" id="mobile-menu" data-menu hidden>
  <nav aria-label="${t('common.mainNav')}"><ul>${links('mobile-menu__link')}</ul></nav>
  <div class="mobile-menu__tools">${langSwitch}${theme.replace('class="theme-toggle"', 'class="theme-toggle theme-toggle--wide"').replace('</button>', `<span class="theme-toggle__text" data-theme-text data-text-dark="${t('common.darkMode')}" data-text-light="${t('common.lightMode')}">${t('common.darkMode')}</span></button>`)}</div>
</div>`;
}

// ───────── Contacto + pie ─────────
export function contact(ctx, { lead = '' } = {}) {
  const t = ctx.t;
  const L = site.links;
  const btn = (href, ic, label, ext = true, dl = false, tip = '') => href
    ? `<li><a class="icon-btn${tip ? ' has-tip' : ''}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}${dl ? ' download' : ''} aria-label="${label}"${tip ? ` data-tip="${tip}"` : ''}>${icon(ic, { size: 24 })}</a></li>` : '';
  const cv = L.cv && !/^https?:/.test(L.cv) ? ctx.asset(L.cv) : L.cv;
  return `<section class="contact" id="contacto"${ctx.section === 'home' ? ' data-spy="contact"' : ''} aria-labelledby="contact-title">
  ${lead}
  <div class="contact__inner" data-reveal>
    <h2 class="h2" id="contact-title">${t('contact.title')}</h2>
    <p class="contact__lead">${t('contact.lead')}</p>
    <a class="contact__mail link-underline" href="mailto:${site.email}">${site.email}</a>
    <ul class="contact__btns">
      ${btn(L.whatsapp, 'ri:whatsapp-fill', 'WhatsApp')}
      <li><button type="button" class="icon-btn has-tip" data-copy="${site.email}" data-copied="${t('contact.copied')}" data-tip="${t('contact.copy')}" aria-label="${t('contact.copy')}: ${site.email}">${icon('material-symbols-light:mail-rounded', { size: 24 })}</button></li>
      ${btn(L.linkedin, 'ri:linkedin-fill', 'LinkedIn')}
      ${btn(cv, 'material-symbols-light:download', t('contact.cv'), true, true, t('contact.cv'))}
    </ul>
  </div>
</section>`;
}

export function footer(ctx) {
  const t = ctx.t;
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <a class="footer-brand" href="${ctx.href('home')}"><img src="${ctx.asset('img/logo.svg')}" width="30" height="29" alt=""><span><span class="serif">Andrea</span>Maria</span></a>
    <ul class="footer-links">
      <li><a href="${ctx.href('home')}">${t('nav.home')}</a></li>
      <li><a href="${ctx.href('about')}">${t('nav.about')}</a></li>
      <li><a href="${ctx.href('home', 'proyectos')}">${t('nav.projects')}</a></li>
      <li><a href="#contacto">${t('nav.contact')}</a></li>
      ${site.links.linkedin ? `<li><a href="${site.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>` : ''}
      <li><button type="button" class="linklike" data-copy="${site.email}" data-copied="${t('contact.copied')}">${t('contact.copy')}</button></li>
    </ul>
  </div>
</footer>
<div class="toast" role="status" aria-live="polite" data-toast></div>
<dialog class="lightbox" data-lightbox aria-label="${t('common.viewer')}">
  <div class="lightbox__stage" data-lb-stage><img alt="" data-lb-img></div>
  <p class="lightbox__caption" data-lb-caption></p>
  <button type="button" class="lightbox__btn lightbox__close" data-lb-close aria-label="${t('common.close')}">${icon('close', { size: 24 })}</button>
  <button type="button" class="lightbox__btn lightbox__prev" data-lb-prev aria-label="${t('common.prev')}">${icon('ri:arrow-left-line', { size: 24 })}</button>
  <button type="button" class="lightbox__btn lightbox__next" data-lb-next aria-label="${t('common.next')}">${icon('ri:arrow-right-line', { size: 24 })}</button>
</dialog>`;
}

// ───────── Tarjeta de proyecto ─────────
export const cardInfo = {
  pedidosya: { img: 'img_home/fotocard_peya', pos: 'center 13%', tools: ['surveymonkey', 'figma', 'googleforms', 'gemini', 'perplexity'] },
  prime: { img: 'img_home/fotocard_prime', pos: 'center top', tools: ['photoshop', 'figma', 'googleforms', 'gemini', 'perplexity', 'uxtweak', 'maze', 'googletranslate'] },
  rico: { img: 'img_home/fotocard_rico', pos: 'center 0%', tools: ['figma', 'chatgpt', 'illustrator', 'photoshop'] },
  nestart: { img: 'img_home/fotocard_nestart', tools: ['figma', 'chatgpt', 'gemini', 'perplexity', 'photoshop', 'googletranslate', 'uxtweak'] },
};

export function projectCard(ctx, key, { level = 3, i = 0 } = {}) {
  const t = ctx.t; const c = cardInfo[key];
  // Toda la tarjeta es un enlace
  return `<a class="card" href="${ctx.href(key)}" data-reveal style="--i:${i}">
  <div class="card__media">
    ${pic(ctx, c.img, { alt: '', pos: c.pos, sizes: '(min-width: 1024px) 600px, (min-width: 700px) 50vw, 100vw' })}
    <span class="card__arrow" aria-hidden="true">${icon('arrowUpRight', { size: 22 })}</span>
  </div>
  <div class="card__body">
    <ul class="card__meta"><li>${t(`cards.${key}.name`)}</li><li>${t('cards.academic')}</li><li>${t(`cards.${key}.role`)}</li></ul>
    <h${level} class="card__title">${t(`cards.${key}.title`)}</h${level}>
    <p class="card__sub">${t(`cards.${key}.sub`)}</p>
    <div class="card__tools"><span>${t('cards.tools')}</span>${toolRow(ctx, c.tools)}</div>
  </div>
</a>`;
}

export function projectGrid(ctx, { exclude = null, level = 3 } = {}) {
  return `<div class="cards">${PROJECTS.filter((p) => p !== exclude).map((p, i) => projectCard(ctx, p, { level, i })).join('')}</div>`;
}

// ───────── Bloques de caso de estudio ─────────
export function caseIntro(ctx, key, { cover, coverPos = 'center' }) {
  const t = ctx.t; const p = (k) => t(`${key}.intro.${k}`);
  return `<div class="case-cover" data-parallax-wrap>${pic(ctx, cover, { alt: p('coverAlt'), eager: true, sizes: '100vw', cls: 'case-cover__pic', pos: coverPos })}</div>
<section class="case-intro" aria-labelledby="case-title">
  <div class="container">
    <a class="back-link" href="${ctx.href('home', 'proyectos')}">${icon('ri:arrow-left-line', { size: 18 })}<span>${t('nav.projects')}</span></a>
    <div class="case-intro__top">
      <div data-reveal><h1 class="h1" id="case-title">${p('title')}</h1><p class="lead-sm">${t('cards.individual')}</p></div>
      <p class="case-intro__desc" data-reveal style="--i:1">${p('desc')}</p>
    </div>
    <dl class="case-facts" data-reveal style="--i:2">
      <div class="case-facts__role"><dt>${t('case.role')}</dt><dd><strong>${p('role')}</strong><span>${p('roleDesc')}</span></dd></div>
      <div><dt>${t('case.platform')}</dt><dd>${p('platform')}</dd></div>
      <div><dt>${t('case.year')}</dt><dd>${p('year')}</dd></div>
    </dl>
  </div>
</section>`;
}

export function sectionHead(title, text = '', { level = 2, id = '', cls = '', toc = true } = {}) {
  return `<div class="sec-head ${cls}" data-reveal><h${level} class="h${level === 2 ? 3 : 4}"${id ? ` id="${id}"` : ''}${toc && level === 2 ? ' data-toc' : ''}>${title}</h${level}>${text ? `<p>${text}</p>` : ''}</div>`;
}

export function list(items, cls = '') {
  return `<ul class="list ${cls}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

// Carrusel. loop: movimiento continuo infinito · side: flechas centradas a los costados
export function carousel(ctx, items, { label, cls = '', loop = false, side = false, speed = 6 } = {}) {
  if (loop) {
    const dup = items.map((it) => `<div class="carousel__item" data-dup aria-hidden="true">${it.replace(/<button /g, '<button tabindex="-1" ')}</div>`).join('');
    return `<div class="marquee ${cls}" role="region" aria-label="${label}" style="--dur:${items.length * speed}s">
  <div class="marquee__track">${items.map((it) => `<div class="carousel__item">${it}</div>`).join('')}${dup}</div>
</div>`;
  }
  const nav = `<button type="button" class="round-btn carousel__prev" data-carousel-prev aria-label="${ctx.t('common.prev')}">${icon('ri:arrow-left-line', { size: 22 })}</button>
    <button type="button" class="round-btn carousel__next" data-carousel-next aria-label="${ctx.t('common.next')}">${icon('ri:arrow-right-line', { size: 22 })}</button>`;
  return `<div class="carousel ${side ? 'carousel--side ' : ''}${cls}" data-carousel>
  <div class="carousel__track" tabindex="0" role="region" aria-label="${label}" data-carousel-track>
    ${items.map((it) => `<div class="carousel__item">${it}</div>`).join('')}
  </div>
  <div class="carousel__nav">${nav}</div>
</div>`;
}

export function beforeAfter(ctx, beforeKey, afterKey, { before, after, alt }) {
  const b = ctx.media[beforeKey];
  return `<div class="ba" data-ba style="--ar:${b.w}/${b.h};--pos:50%">
  <div class="ba__img ba__after">${pic(ctx, afterKey, { alt: alt.after, sizes: '360px' })}<span class="ba__tag ba__tag--r">${after}</span></div>
  <div class="ba__img ba__before">${pic(ctx, beforeKey, { alt: alt.before, sizes: '360px' })}<span class="ba__tag">${before}</span></div>
  <div class="ba__handle" aria-hidden="true"><span>${icon('compare', { size: 20 })}</span></div>
  <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="${ctx.t('common.compare')}">
</div>`;
}

export function caseEnd(ctx, key, { cta = '', ctaLabel = '', ctaText = '' } = {}) {
  const t = ctx.t;
  const idx = PROJECTS.indexOf(key);
  const prev = PROJECTS[(idx + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const explore = cta ? `<section class="explore" aria-labelledby="explore-t"><div class="container narrow" data-reveal>
    <h2 class="h3" id="explore-t">${t('case.explore')}</h2><p>${ctaText}</p>
    ${button(ctaLabel, cta, { iconName: 'material-symbols-light:open-in-new', external: true })}</div></section>` : '';
  return `${explore}
<section class="thanks" aria-labelledby="thanks-t"><div class="container" data-reveal>
  <h2 class="h3" id="thanks-t">${t('case.thanks')}</h2><p>${t('case.thanksText')}</p>
</div></section>
<nav class="case-nav container" aria-label="${t('case.moreProjects')}">
  <a class="case-nav__link" href="${ctx.href(prev)}" rel="prev"><span class="case-nav__dir">${icon('ri:arrow-left-line', { size: 18 })}${t('case.prevProject')}</span><span class="case-nav__name">${t(`cards.${prev}.name`)}</span></a>
  <a class="case-nav__link case-nav__link--next" href="${ctx.href(next)}" rel="next"><span class="case-nav__dir">${t('case.nextProject')}${icon('ri:arrow-right-line', { size: 18 })}</span><span class="case-nav__name">${t(`cards.${next}.name`)}</span></a>
</nav>
<section class="more" aria-labelledby="more-t"><div class="container">
  <h2 class="visually-hidden" id="more-t">${t('case.moreProjects')}</h2>
  ${projectGrid(ctx, { exclude: key, level: 3 })}
</div></section>
<div class="toc" data-toc-root>
  <button type="button" class="toc__btn" data-toc-btn aria-expanded="false" aria-controls="toc-panel">${icon('list', { size: 20 })}<span>${t('case.toc')}</span></button>
  <div class="toc__panel" id="toc-panel" data-toc-panel hidden><p class="toc__title">${t('case.toc')}</p><ol data-toc-list></ol></div>
</div>`;
}
