import { pic, video, caseIntro, sectionHead, list, caseEnd, carousel, button } from '../lib/components.mjs';
import { site } from '../config.mjs';

export const meta = { key: 'prime', section: 'projects', og: 'og-prime', bodyClass: 'p-prime' };

export default function prime(ctx) {
  const t = ctx.t; const p = (k) => t('prime.' + k);
  const P = 'img_prime/';
  const phases = p('phases');
  const phase = (n, id, text) => `<div class="phase" data-reveal><span class="phase__num" aria-hidden="true">0${n}</span><h2 class="phase__title" id="${id}" data-toc>${phases[n - 1]}</h2>${text ? `<div class="phase__text">${text}</div>` : ''}</div>`;
  const shot = (k, alt, o = {}) => `<div class="shot${o.clear ? ' shot--clear' : ''}">${pic(ctx, P + k, { alt, lightbox: true, sizes: o.sizes || '(min-width: 1280px) 1280px, 100vw', group: o.group || '' })}</div>`;
  const metricCards = (m) => `<div class="grid-3">${m.map(([n, d]) => `<div class="metric light-metric"><span class="stat-num">${n}</span><span>${d}</span></div>`).join('')}</div>`;

  return `
${caseIntro(ctx, 'prime', { cover: P + 'portada_prime', coverPos: 'center 3%' })}
<div class="cs prime-dark">

<section class="cs-section" aria-labelledby="prime-process">
  <div class="container center" data-reveal>
    <h2 class="h3" id="prime-process" data-toc style="text-align:left">${p('processTitle')}</h2>
    <p class="lead" style="margin-top:24px">${p('processBy')}</p>
    <ol class="steps">${phases.map((ph, i) => `<li><a href="#fase-${i + 1}"><span class="n">${i + 1}</span>${ph}</a></li>`).join('')}</ol>
  </div>
</section>

<section class="cs-section" aria-labelledby="fase-1">
  <div class="container stack" style="--stack:clamp(40px,5vw,72px)">
    ${phase(1, 'fase-1')}
    <div class="stack" data-reveal>
      <h3 class="h3">${p('whyTitle')}</h3>
      <div class="grid-2">
        <div><h4 class="h4">${p('problemTitle')}</h4><div class="prose" style="margin-top:14px">${p('problem').map((x) => `<p>${x}</p>`).join('')}</div></div>
        <div><h4 class="h4">${p('goalTitle')}</h4><p style="margin-top:14px">${p('goal')}</p></div>
      </div>
    </div>
    <div class="stack">
      <div data-reveal><h3 class="h3">${p('researchTitle')}</h3><h4 class="h4" style="margin-top:14px">${p('reviewsTitle')}</h4></div>
      <div class="grid-2" style="align-items:start">${[1, 2, 3, 4].map((n, i) => `<div data-reveal style="--i:${i % 2}">${shot('fotoredes' + n, p('reviewsAlt')[i], { sizes: '(min-width: 700px) 50vw, 100vw', group: 'reviews' })}</div>`).join('')}</div>
    </div>
    <div data-reveal><h4 class="h4">${p('methodsTitle')}</h4><p style="margin-top:14px;max-width:80ch">${p('methods')}</p></div>
    <div class="stack">
      <h4 class="h4" data-reveal>${p('surveyTitle')}</h4>
      <div class="survey">
        <div class="survey__photo" data-reveal>${pic(ctx, P + 'foto_mauricio', { alt: p('surveyAlt'), sizes: '(min-width: 760px) 45vw, 100vw' })}</div>
        <div class="survey__cards">${p('survey').map((s, i) => `<p class="dark-card" data-reveal style="--i:${i}">${s}</p>`).join('')}</div>
      </div>
    </div>
    <div class="stack">
      <div data-reveal><h4 class="h4">${p('heurTitle')}</h4><p style="margin-top:14px">${p('heurIntro')}</p></div>
      <div class="insights">${p('insights').map(([b, x], i) => `<div class="insight" data-reveal style="--i:${i}"><span class="n">${i + 1}</span><b>${b}</b>${x}</div>`).join('')}</div>
    </div>
    <div class="stack" style="--stack:32px">
      <p data-reveal style="max-width:80ch">${p('persona')}</p>
      <div class="grid-2">
        <div class="insight" data-reveal><h4 class="h4" style="margin-bottom:12px">${p('scenarioTitle')}</h4><p>${p('scenario')}</p></div>
        <div class="insight" data-reveal style="--i:1"><h4 class="h4" style="margin-bottom:12px">${p('expectTitle')}</h4><p>${p('expect')}</p></div>
      </div>
      <div data-reveal>${shot('journey_prime', p('journeyAlt'), { clear: true })}</div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="fase-2">
  <div class="container stack" style="--stack:40px">
    ${phase(2, 'fase-2', `<p>${p('scope')}</p>`)}
    <div data-reveal style="max-width:620px;margin-inline:auto">${shot('matriz_prime', p('matrixAlt'), { sizes: '620px', clear: true })}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="fase-3">
  <div class="container stack" style="--stack:clamp(40px,5vw,64px)">
    ${phase(3, 'fase-3', p('structure').map((x) => `<p>${x}</p>`).join(''))}
    <div class="stack" data-reveal><h3 class="h4">${p('newIaTitle')}</h3>${shot('arquitectura_prime', p('iaAlt'), { clear: true })}</div>
    <div class="stack">
      <div data-reveal><h3 class="h3">${p('flowTitle')}</h3><p style="margin-top:14px;max-width:80ch">${p('flow')}</p></div>
      <div class="scroll-frame" data-reveal tabindex="0" role="region" aria-label="${p('flowAlt')}">
        ${pic(ctx, P + 'user_prime', { alt: p('flowAlt'), lightbox: true, sizes: '700px', cls: 'media--plain' })}
        <p class="scroll-frame__hint" aria-hidden="true">↓ ${t('common.scrollHint')}</p>
      </div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="fase-4">
  <div class="container">${phase(4, 'fase-4', `<p>${p('skeleton')}</p>`)}</div>
  <div style="margin-top:40px" data-reveal>${carousel(ctx, [1, 2, 3, 4].map((n, i) => `<div class="shot" style="background:#fdfcfa">${pic(ctx, P + 'wire_prime' + n, { alt: p('wiresAlt')[i], lightbox: true, group: 'wires', sizes: '600px', cls: 'media--contain' })}</div>`), { label: p('wiresLabel'), cls: 'marquee--steady marquee--wires', loop: true, speed: 9 })}</div>
</section>

<section class="cs-section" aria-labelledby="fase-5">
  <div class="container stack" style="--stack:clamp(40px,5vw,72px)">
    ${phase(5, 'fase-5', `<p class="lead">${p('surface')}</p>`)}
    <div class="stack" data-reveal><div class="ds-img">${shot('sistema_diseno', p('dsAlt'), { sizes: '(min-width: 900px) 860px, 100vw' })}</div>
      ${site.projects.prime.designSystem ? `<div class="cs-cta-row">${button(p('dsBtn'), site.projects.prime.designSystem, { variant: 'outline', iconName: 'material-symbols-light:open-in-new', external: true })}</div>` : ''}</div>
    ${sectionHead(p('solTitle'), p('sol'), { id: 'prime-sol' })}
    <div class="stack" data-reveal>
      <h3 class="h4">${p('navTitle')}</h3><p style="max-width:80ch">${p('nav')}</p>
      <p class="lead">${p('mainImprovements')}</p>${list(p('navList'))}
    </div>
  </div>
  <div style="margin-top:40px" data-reveal>${carousel(ctx, [
    `<div class="shot">${video(ctx, P + 'gif1', { alt: p('navMediaAlt')[0] })}</div>`,
    `<div class="shot">${pic(ctx, P + 'gif_imagen2', { alt: p('navMediaAlt')[1], lightbox: true, sizes: '600px' })}</div>`,
    `<div class="shot">${video(ctx, P + 'gif3', { alt: p('navMediaAlt')[2] })}</div>`,
  ], { label: p('navMediaLabel'), cls: 'carousel--wide', side: true })}</div>
  <div class="container stack" style="--stack:clamp(40px,5vw,72px);margin-top:clamp(40px,5vw,72px)">
    <div class="stack" data-reveal><h3 class="h4">${p('buyTitle')}</h3>${list(p('buyList'))}</div>
    <div class="grid-2" style="align-items:start">
      <div data-reveal><span class="tag">${t('case.before')}</span>${video(ctx, P + 'gif4_antes', { alt: p('buyAlt').before, cls: 'video--match' })}</div>
      <div data-reveal style="--i:1"><span class="tag tag--after" style="background:#fdfcfa;color:#8b0a1b">${t('case.after')}</span>${video(ctx, P + 'gif5', { alt: p('buyAlt').after, cls: 'video--match' })}</div>
    </div>
    <div class="stack" data-reveal><h3 class="h4">${p('payTitle')}</h3>${list(p('payList'))}</div>
    <div class="grid-2" style="align-items:start">
      <div data-reveal>${shot('inicio_sesion', p('payAlt')[0], { sizes: '(min-width: 700px) 50vw, 100vw', group: 'pay' })}</div>
      <div data-reveal style="--i:1">${shot('resumen_compra', p('payAlt')[1], { sizes: '(min-width: 700px) 50vw, 100vw', group: 'pay' })}</div>
    </div>
    <div class="grid-2" style="align-items:center">
      <div class="stack" data-reveal><h3 class="h4">${p('postTitle')}</h3><p>${p('post')}</p><p class="lead">${p('postSub')}</p>${list(p('postList'))}</div>
      <div data-reveal style="--i:1">${video(ctx, P + 'gif_poscompra', { alt: p('postAlt') })}</div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="prime-test">
  <div class="container stack" style="--stack:40px">
    ${sectionHead(p('testTitle'), p('test'), { id: 'prime-test' })}
    ${p('tasks').map((k) => `<div class="stack" data-reveal style="--stack:20px"><h3 class="h4">${k.t}</h3>${metricCards(k.m)}</div>`).join('')}
  </div>
</section>

<section class="cs-section" aria-labelledby="prime-concl">
  <div class="container stack" style="--stack:clamp(40px,5vw,64px)">
    <div class="grid-2">
      <div data-reveal><h2 class="h3" id="prime-concl" data-toc>${p('conclTitle')}</h2><p style="margin-top:16px">${p('concl')}</p></div>
      <div data-reveal style="--i:1"><h2 class="h3" id="prime-learn" data-toc>${p('learnTitle')}</h2>
        <div class="learn" style="margin-top:16px">${p('learn').map(([b, x]) => `<p><b>${b}</b>${x}</p>`).join('')}</div></div>
    </div>
  </div>
</section>
</div>
${caseEnd(ctx, 'prime', { cta: site.projects.prime.prototype, ctaLabel: p('exploreBtn'), ctaText: p('exploreText') })}`;
}
