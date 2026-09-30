import { pic, video, caseIntro, sectionHead, list, caseEnd, beforeAfter } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../config.mjs';

export const meta = { key: 'pedidosya', section: 'projects', og: 'og-pedidosya', bodyClass: 'p-pedidosya' };

const C = 2 * Math.PI * 42;
const donut = (pct, label) => `<div class="donut">
  <div class="donut__wrap"><svg class="donut__svg" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="donut__track" cx="50" cy="50" r="42" fill="none" stroke-width="14"/>
    <circle class="donut__bar" cx="50" cy="50" r="42" fill="none" stroke-width="14" stroke-dasharray="${C.toFixed(2)}" style="stroke-dashoffset:${C.toFixed(2)}" data-donut="${(C * (1 - pct / 100)).toFixed(2)}"/>
  </svg><span class="donut__num">${pct}%</span></div>
  <p>${label}</p></div>`;

export default function pedidosya(ctx) {
  const t = ctx.t; const p = (k) => t('pedidosya.' + k);
  const P = 'img_pedidos/';
  const phone = (k, alt, group = 'hmw') => `<div class="phone">${pic(ctx, P + k, { alt, sizes: '300px', lightbox: true, group })}</div>`;
  const hmw = (i) => `<div class="hmw" data-reveal><span class="hmw__pill">HMW<br>${i + 1}</span><span class="hmw__line" aria-hidden="true"></span><p class="hmw__q">${p('hmw')[i]}</p></div>`;
  const solLabel = `<span class="label-serif">${t('case.solution')}</span>`;
  const colors = [['var(--celeste)', '#242424'], ['var(--morado)', '#fdfcfa'], ['var(--rosa-p)', '#242424'], ['#e0004a', '#fdfcfa']];

  return `
${caseIntro(ctx, 'pedidosya', { cover: P + 'portadapeya', coverPos: 'center 8%' })}
<div class="cs">

<section class="soft cs-section" aria-labelledby="peya-problem">
  <div class="container stack" style="--stack:clamp(40px,5vw,64px)">
    <div class="peya-problem">
      <div data-reveal><h2 class="h3 plain" id="peya-problem" data-toc>${p('problemTitle')}</h2>
        <div class="prose" style="margin-top:16px">${p('problem').map((x) => `<p>${x}</p>`).join('')}</div></div>
      <div class="peya-logos" data-reveal style="--i:1">
        <span class="peya-logos__iso">${pic(ctx, P + 'isologo_pedidosya', { alt: p('logosAlt').peya, cls: 'media--plain', sizes: '100px' })}</span>
        ${icon('mdi:plus-thick', { size: 56 })}
        <span class="peya-logos__aldeas">${pic(ctx, P + 'logo_aldeas', { alt: p('logosAlt').aldeas, cls: 'media--plain', sizes: '90px' })}</span>
      </div>
    </div>
    <div class="grid-3">${[1, 2, 3].map((n, i) => `<div class="rounded" data-reveal style="--i:${i}">${pic(ctx, P + 'fotosonrisas' + n, { alt: p('smiles')[i], sizes: '(min-width: 900px) 400px, 100vw', lightbox: true, group: 'smiles' })}</div>`).join('')}</div>
    <div class="sec-head center" data-reveal><h3 class="h3 plain">${p('howTitle')}</h3><p>${p('how')}</p></div>
    <div class="donuts" data-reveal>${donut(87.5, p('stat1'))}${donut(12.5, p('stat2'))}</div>
    <div class="stack" data-reveal>
      <h3 class="h3 plain">${p('proposeTitle')}</h3>
      <div class="center" style="max-width:850px;margin-inline:auto"><h4 class="h4">${p('goalTitle')}</h4><p style="margin-top:16px">${p('goal')}</p></div>
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="peya-methods">
  <div class="container">
    ${sectionHead(p('methodsTitle'), p('methodsIntro'), { id: 'peya-methods' })}
    <div class="methods">${p('methods').map((m, i) => `<article class="method" data-reveal style="--i:${i % 2};--dot:${colors[i][0]}">
      <h3 class="h4">${m.t}</h3>
      <ul class="chips">${m.chips.map((c) => `<li class="chip" style="--c:${colors[i][0]};--cf:${colors[i][1]}">${c}</li>`).join('')}</ul>
      <p>${m.p}</p></article>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="peya-synth">
  <div class="container">
    ${sectionHead(p('synthTitle'), '', { id: 'peya-synth' })}
    <div class="synth" data-flip style="margin-top:32px">
      ${['user_valentina', 'mapaempatia_valentina', 'journey_valentina', 'afinidad_valentina'].map((k, i) => `<figure class="synth__item" data-reveal style="--i:${i % 2}">
        <div class="synth__img">${pic(ctx, P + k, { alt: p('synth')[i], sizes: '(min-width: 700px) 50vw, 100vw', lightbox: true, group: 'synth', cls: 'media--contain' })}</div>
        <figcaption class="synth__label">${p('synth')[i]}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<section class="cs-section" aria-labelledby="peya-findings">
  <div class="container" style="max-width:1072px">
    ${sectionHead(p('findingsTitle'), '', { id: 'peya-findings' })}
    <div style="margin-top:40px">${p('findings').map((f, i) => `<div class="finding" data-reveal>
      <div class="finding__img">${pic(ctx, P + 'hallazgo' + (i + 1), { alt: p('findingAlt')[i], sizes: '320px' })}</div>
      <div><span class="finding__num" aria-hidden="true">0${i + 1}</span><p>${f}</p></div></div>`).join('')}</div>
  </div>
</section>

<section class="cs-section" aria-labelledby="peya-hmw">
  <div class="container stack" style="--stack:clamp(48px,6vw,88px)">
    ${sectionHead(p('hmwTitle'), p('hmwIntro'), { id: 'peya-hmw' })}

    ${hmw(0)}
    <div class="sol" data-reveal>
      <div class="sol__text"><span class="tag">${t('case.before')}</span><div class="prose">${p('s1').before.map((x) => `<p>${x}</p>`).join('')}</div></div>
      <div class="sol__imgs">${phone('wire1', p('s1').alt[0])}${phone('wire2', p('s1').alt[1])}</div>
    </div>
    <div class="sol sol--rev" data-reveal>
      <div class="sol__text"><span class="tag tag--after">${t('case.after')}</span><p>${solLabel}${p('s1').sol}</p><p>${p('s1').extra}</p></div>
      <div class="sol__imgs">${phone('wire3', p('s1').alt[2])}</div>
    </div>

    ${hmw(1)}
    <div class="sol" data-reveal>
      <div class="sol__text"><p>${solLabel}${p('s2').sol}</p><p>${p('s2').extra}</p></div>
      <div class="sol__imgs">${phone('wire4', p('s2').alt[0])}${phone('wire5', p('s2').alt[1])}</div>
    </div>

    ${hmw(2)}
    <div class="sol sol--rev" data-reveal>
      <div class="sol__text"><p>${solLabel}${p('s3').sol}</p><p>${p('s3').extra}</p></div>
      <div class="sol__imgs">${phone('wire6', p('s3').alt[0])}${phone('wire7', p('s3').alt[1])}</div>
    </div>

    ${hmw(3)}
    <div class="sol" data-reveal>
      <div class="sol__text"><p>${solLabel}${p('s4').sol}</p><p>${p('s4').extra}</p></div>
      ${beforeAfter(ctx, P + 'wire8', P + 'wire9', { before: t('case.before'), after: t('case.after'), alt: p('s4').alt })}
    </div>
  </div>
</section>

<section class="soft cs-section" aria-label="${p('videoAlt')}">
  <div class="container" data-reveal style="max-width:1100px">${video(ctx, P + 'video_peya1', { alt: p('videoAlt') })}</div>
</section>

<section class="cs-section" aria-labelledby="peya-valid">
  <div class="container stack" style="--stack:40px">
    <div class="sec-head" data-reveal><h2 class="h3" id="peya-valid" data-toc>${p('validTitle')}</h2>${p('valid').map((x) => `<p>${x}</p>`).join('')}</div>
    <div class="grid-2">${p('tasks').map((k, i) => `<div class="task" data-reveal style="--i:${i}"><strong>${k.t}</strong><p>${k.p}</p></div>`).join('')}</div>
    <div class="results stack" style="--stack:40px">
      ${sectionHead(p('resultsTitle'), '', { id: 'peya-results' })}
      ${p('results').map((r) => `<div data-reveal><h3 class="h4">${r.t}</h3><div class="grid-3">${r.m.map(([n, l, d]) => {
        const num = parseFloat(n); const suf = n.replace(/^[\d.]+/, '');
        return `<div class="metric"><span class="stat-num" data-count="${num}" data-suffix="${suf}">${n}</span><strong>${l}</strong><span>${d}</span></div>`;
      }).join('')}</div></div>`).join('')}
    </div>
  </div>
</section>

<section class="soft cs-section" aria-labelledby="peya-concl">
  <div class="container stack" style="--stack:clamp(40px,5vw,64px);max-width:1100px">
    <div data-reveal style="max-width:592px;margin-inline:auto">${video(ctx, P + 'video_peya2', { alt: p('video2Alt') })}</div>
    <div class="sec-head" data-reveal><h2 class="h3" id="peya-concl" data-toc>${p('conclTitle')}</h2>
      <div class="prose" style="margin-top:16px"><p>${p('conclIntro')}</p>${list(p('conclList'))}${p('concl').map((x) => `<p>${x}</p>`).join('')}</div></div>
    <div class="sec-head" data-reveal><h2 class="h3" id="peya-learn" data-toc>${p('learnTitle')}</h2>
      <div class="prose" style="margin-top:16px">${list(p('learn'))}</div></div>
  </div>
</section>
</div>
${caseEnd(ctx, 'pedidosya', { cta: site.projects.pedidosya.prototype, ctaLabel: p('exploreBtn'), ctaText: p('exploreText') })}`;
}
