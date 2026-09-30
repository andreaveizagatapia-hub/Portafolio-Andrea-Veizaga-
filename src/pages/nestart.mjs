import { pic, video, caseIntro, sectionHead, list, caseEnd, carousel, button } from '../lib/components.mjs';
import { site } from '../config.mjs';

export const meta = { key: 'nestart', section: 'projects', og: 'og-nestart', bodyClass: 'p-nestart' };

// Recorte con la silueta del celular: quita el fondo blanco que viene dentro de cada grabación.
const PHONE_CLIP = [
  'inset(1.6% 2.9% 1.5% 2.1% round 16.5% / 8.1%)',
  'inset(1.1% 2.9% 1.5% 2.1% round 16.5% / 8.1%)',
  'inset(1.2% 2.1% 1.1% 1.9% round 16.7% / 8.1%)',
  'inset(0.5% 2.3% 1.4% 4.6% round 16.2% / 8.2%)',
];

export default function nestart(ctx) {
  const t = ctx.t; const p = (k) => t('nestart.' + k);
  const P = 'img_nestart/';
  const bar = (label, v) => `<div class="bar"><div class="bar__top"><span>${label}</span><strong data-count="${v}" data-suffix="%">${v}%</strong></div><div class="bar__track"><div class="bar__fill" style="--v:${v / 100}"></div></div></div>`;
  const avatars = ['frustraciones', 'motivaciones', 'necesidades'];

  return `
${caseIntro(ctx, 'nestart', { cover: P + 'portada_nestart' })}
<div class="cs">

<section class="cs-section" aria-labelledby="n-method">
  <div class="container">
    ${sectionHead(p('methodTitle'), '', { id: 'n-method' })}
    <div class="phases">${p('phases').map((ph, i) => `<article class="phase-card" data-reveal style="--i:${i % 3}">
      <div class="phase-card__box"><h3>${ph.t}</h3><ul>${ph.l.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <span class="phase-card__n" aria-hidden="true">${i + 1}</span></article>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-label="${p('stat')}">
  <div class="container" style="max-width:1100px">
    <div class="n-card" data-reveal>
      <div class="stack" style="--stack:14px"><p class="h4">${p('stat')}</p><p class="lead">${p('statQ')}</p><p>${p('statP')}</p></div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-interview">
  <div class="container">
    ${sectionHead(p('interviewTitle'), p('interview'), { id: 'n-interview' })}
    <div class="insight-head" style="margin-top:40px" data-reveal><h3 class="h4">${p('insightsTitle')}</h3>${pic(ctx, P + 'pajarito2', { alt: p('bird2Alt'), sizes: '200px', cls: 'media--plain' })}</div>
    <div class="insights-n">${p('insights').map((ins, i) => `<div data-reveal style="--i:${i}"><span class="n">${i + 1}</span><h4>${ins.t}</h4>${ins.p ? ins.p.map((x) => `<p>${x}</p>`).join('') : list(ins.l)}</div>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-persona">
  <div class="container stack" style="--stack:40px">
    ${sectionHead(p('personaTitle'), p('personaIntro'), { id: 'n-persona' })}
    <div class="persona">
      <div class="persona__side" data-reveal>
        <div class="persona__name"><h3 class="h3">${p('personaName')}</h3><p class="h4">${p('personaAge')}</p></div>
        <div class="persona__photo">${pic(ctx, P + 'mariana', { alt: p('personaAlt'), sizes: '300px', cls: 'media--plain' })}</div>
        <div class="persona__data">${pic(ctx, P + 'datos_mariana', { alt: p('personaDataAlt'), sizes: '300px', cls: 'media--plain' })}</div>
      </div>
      <div class="persona__cards">${p('pcards').map((c, i) => `<div class="p-card" data-reveal style="--i:${i}">
        <div class="p-card__av">${pic(ctx, P + avatars[i], { alt: '', sizes: '84px' })}</div>
        <div class="p-card__box"><h3 class="h4">${c.t}</h3><p>${c.p}</p></div></div>`).join('')}</div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-ia">
  <div class="container stack" style="--stack:40px">
    ${sectionHead(p('iaTitle'), p('ia'), { id: 'n-ia' })}
    <div class="shot" data-reveal>${pic(ctx, P + 'arquitectura_nestart', { alt: p('iaAlt'), lightbox: true })}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-flow">
  <div class="container stack" style="--stack:28px">
    ${sectionHead(p('flowTitle'), p('flow'), { id: 'n-flow' })}
    ${site.projects.nestart.userflow ? `<div data-reveal>${button(p('flowBtn'), site.projects.nestart.userflow, { iconName: 'material-symbols-light:open-in-new', external: true })}</div>` : ''}
  </div>
</section>

<section class="cs-section" aria-labelledby="n-wf">
  <div class="container">${sectionHead(p('wfTitle'), p('wf'), { id: 'n-wf' })}</div>
  <div style="margin-top:32px" data-reveal>${carousel(ctx, [1, 2, 3, 4, 5, 6, 7].map((n) => `<div class="shot" style="background:#fff">${pic(ctx, P + 'boceto' + n, { alt: `${p('sketchAlt')} ${n}`, lightbox: true, group: 'sketch', sizes: '300px' })}</div>`), { label: p('sketchesLabel'), cls: 'carousel--sketch', loop: true, speed: 5 })}</div>
  <div class="container stack" style="--stack:40px;margin-top:40px">
    <p data-reveal style="max-width:80ch">${p('wf2')}</p>
    <div class="shot" data-reveal>${pic(ctx, P + 'wire_nestart', { alt: p('wireAlt'), lightbox: true })}</div>
    <div class="prose" data-reveal style="max-width:900px">${p('heur').map((x) => `<p>${x}</p>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-test">
  <div class="container stack" style="--stack:40px">
    ${sectionHead(p('testTitle'), p('test'), { id: 'n-test' })}
    <div class="bars">
      <div class="bars__group" data-reveal><h3 class="h4">${p('successTitle')}</h3>${p('acts').map((a, i) => bar(a, p('success')[i])).join('')}</div>
      <div class="bars__group" data-reveal style="--i:1"><h3 class="h4">${p('npsTitle')}</h3>${p('acts').map((a, i) => bar(a, p('nps')[i])).join('')}</div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-present">
  <div class="container">
    ${sectionHead(p('presentTitle'), '', { id: 'n-present' })}
    <div style="margin-top:48px">${p('features').map((f, i) => `<div class="feature" data-reveal>
      <div class="feature__text"><h3 class="h4">${f.t}</h3><p>${f.p}</p></div>
      ${video(ctx, P + 'grabacion' + (i + 1) + '_nestart', { alt: f.t, cls: 'video--phone video--bare video--clip', clip: PHONE_CLIP[i] })}</div>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="n-concl">
  <div class="container" style="max-width:1100px">
    <div class="n-close" data-reveal>
      <div><h2 class="h4" id="n-concl" data-toc>${p('conclTitle')}</h2><p>${p('concl')}</p></div>
      <div><h2 class="h4" id="n-learn" data-toc>${p('learnTitle')}</h2>${p('learn').map((x) => `<p>${x}</p>`).join('')}</div>
      <div><h2 class="h4" id="n-next" data-toc>${p('nextTitle')}</h2>${list(p('next'))}</div>
    </div>
  </div>
</section>
</div>
${caseEnd(ctx, 'nestart', { cta: site.projects.nestart.prototype, ctaLabel: p('exploreBtn'), ctaText: p('exploreText') })}`;
}
