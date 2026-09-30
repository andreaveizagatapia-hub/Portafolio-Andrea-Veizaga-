import { pic, caseIntro, sectionHead, caseEnd, carousel } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../config.mjs';

export const meta = { key: 'rico', section: 'projects', og: 'og-rico', bodyClass: 'p-rico' };

export default function rico(ctx) {
  const t = ctx.t; const p = (k) => t('rico.' + k);
  const P = 'img_rico/';
  const phone = (k, alt, group) => `<div class="phone">${pic(ctx, P + k, { alt, lightbox: true, group, sizes: '300px' })}</div>`;
  const benchIcons = ['gala:search', 'mdi:silverware-fork-knife', 'gis:map-user'];
  const voiceImgs = ['selecta', 'cercana', 'directa', 'apasionada'];
  const onb = ['onboarding1', 'onboarding2', 'onboarding3', 'onboarding4', 'onboarding5', 'onboarding6'];

  return `
${caseIntro(ctx, 'rico', { cover: P + 'portada_rico', coverPos: '18% center' })}
<div class="cs">

<section class="cs-section" aria-labelledby="rico-problem">
  <div class="container" style="max-width:1100px">
    <div class="sec-head" data-reveal><h2 class="h3" id="rico-problem" data-toc>${p('problemTitle')}</h2>${p('problem').map((x) => `<p>${x}</p>`).join('')}</div>
    <div class="born">
      <h2 class="h3 born__title" id="rico-born" data-toc data-reveal>${p('bornTitle')}</h2>
      <ul class="purpose">${p('born').map(([b, x], i) => `<li data-reveal style="--i:${i}"><b>${b}</b>${x}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-research">
  <div class="container">
    ${sectionHead(p('researchTitle'), '', { id: 'rico-research' })}
    <h3 class="h4 accent2" style="margin-top:32px" data-reveal>${p('benchTitle')}</h3>
    <ul class="bench">${p('bench').map((b, i) => `<li data-reveal style="--i:${i}"><span class="ic">${icon(benchIcons[i], { size: 28 })}</span><span>${b}</span></li>`).join('')}</ul>
    <div data-reveal class="shot shot--clear comp-img">${pic(ctx, P + 'foto_competencia', { alt: p('benchAlt'), lightbox: true, sizes: '(min-width: 900px) 760px, 100vw' })}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-who">
  <div class="container">
    ${sectionHead(p('whoTitle'), '', { id: 'rico-who' })}
    <div class="grid-2" style="margin-top:32px">${['user1_rico', 'user2_rico'].map((k, i) => `<div class="shot" data-reveal style="--i:${i}">${pic(ctx, P + k, { alt: p('whoAlt')[i], lightbox: true, group: 'who', sizes: '(min-width: 700px) 50vw, 100vw' })}</div>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-voice">
  <div class="container">
    ${sectionHead(p('voiceTitle'), p('voiceIntro'), { id: 'rico-voice' })}
    <div class="voices">${p('voices').map(([a, b], i) => `<article class="voice">
      <div class="voice__screen">${pic(ctx, P + voiceImgs[i], { alt: p('voiceAlt')[i], sizes: '240px' })}</div>
      <p class="voice__label"><span class="label-serif">${a}</span>${b}</p></article>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-tone">
  <div class="container">
    ${sectionHead(p('toneTitle'), '', { id: 'rico-tone' })}
    <div class="shot" style="margin-top:32px" data-reveal>${pic(ctx, P + 'mapa_tonos', { alt: p('toneAlt'), lightbox: true })}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-cp">
  <div class="container">
    ${sectionHead(p('cpTitle'), p('cp'), { id: 'rico-cp' })}
    <div class="phones" style="margin-top:40px">${['content1', 'content2', 'content3'].map((k, i) => `<div data-reveal style="--i:${i}">${phone(k, p('cpAlt')[i], 'cp')}</div>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-proposal">
  <div class="container">${sectionHead(p('proposalTitle'), '', { id: 'rico-proposal' })}
    <h3 class="h4 accent2" style="margin-top:32px" data-reveal>${p('onbTitle')}</h3></div>
  <div style="margin-top:24px" data-reveal>${carousel(ctx, onb.map((k, i) => phone(k, p('onbAlt')[i], 'onb')), { label: p('onbLabel'), cls: 'carousel--phones', loop: true })}</div>
  <div class="container stack" style="--stack:clamp(40px,5vw,72px);margin-top:clamp(40px,5vw,72px)">
    <div class="stack" data-reveal><h3 class="h4 accent2">${p('searchTitle')}</h3><div class="shot">${pic(ctx, P + 'buscador', { alt: p('searchAlt'), lightbox: true })}</div></div>
    <div class="stack" data-reveal><h3 class="h4 accent2">${p('errTitle')}</h3><p style="max-width:80ch">${p('err')}</p>
      <div class="err-band"><div class="phones">${['error1', 'error2'].map((k, i) => `<div>${phone(k, p('errAlt')[i], 'err')}</div>`).join('')}</div></div></div>
    <h3 class="h4 accent2" data-reveal>${p('bookTitle')}</h3>
  </div>
  <div style="margin-top:24px" data-reveal>${carousel(ctx, ['proceso1', 'proceso2', 'proceso3', 'proceso4', 'proceso5'].map((k, i) => phone(k, p('bookAlt')[i], 'book')), { label: p('bookLabel'), cls: 'carousel--phones carousel--center', side: true })}</div>
  <div class="container" style="margin-top:clamp(40px,5vw,72px)">
    <div class="terra-band" data-reveal><h3 class="h4">${p('faqTitle')}</h3><div style="width:min(300px,100%)"><div class="phone phone--bare">${pic(ctx, P + 'faqs', { alt: p('faqAlt'), lightbox: true, group: 'faq', sizes: '300px', cls: 'media--plain' })}</div></div></div>
  </div>
</section>

<section class="cs-section" aria-labelledby="rico-learn">
  <div class="container">
    <div class="learned" data-reveal><h2 class="h3" id="rico-learn" data-toc>${p('learnTitle')}</h2>
      <ol>${p('learn').map(([b, x]) => `<li><p><b>${b}</b>${x}</p></li>`).join('')}</ol></div>
  </div>
</section>
</div>
${caseEnd(ctx, 'rico', { cta: site.projects.rico.prototype, ctaLabel: p('exploreBtn'), ctaText: p('exploreText') })}`;
}
