import { pic, button } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../config.mjs';

export const meta = { key: 'about', section: 'about', og: 'og-about' };

const toolList = [
  ['figma', 'Figma', 'material-icon-theme:figma'],
  ['maze', 'Maze', 'arcticons:maze'],
  ['uxtweak', 'UXtweak', 'uxtweak'],
  ['lovable', 'Lovable', 'devicon:lovable'],
  ['stitch', 'Stitch', 'stitch'],
  ['claude', 'Claude', 'material-icon-theme:claude'],
  ['gemini', 'Gemini', 'selfhst:google-gemini'],
  ['vscode', 'Visual Studio Code', 'logos:visual-studio-code'],
  ['forms', 'Google Forms', 'arcticons:google-forms'],
  ['perplexity', 'Perplexity', 'selfhst:perplexity-ai-dark', true],
  ['photoshop', 'Photoshop', 'skill-icons:photoshop'],
  ['antigravity', 'Antigravity', 'bxl:google-antigravity'],
];

export default function about(ctx) {
  const t = ctx.t;
  const a = (k) => t('about.' + k);
  return `
<div class="about">
<section class="about-hero" aria-labelledby="about-h1">
  <div class="container about-hero__grid">
    <div class="about-photo" data-reveal>
      <div class="about-photo__frame">${pic(ctx, 'sobre_mi/foto_sobremi', { alt: a('photo'), eager: true, sizes: '(min-width: 900px) 40vw, 88vw' })}</div>
    </div>
    <div class="about-intro">
      <div data-reveal>
        <h1 class="eyebrow" id="about-h1">${a('eyebrow')}</h1>
        <h2 class="h2">${a('why')}</h2>
      </div>
      <div class="story" data-story>
        <span class="story__fill" aria-hidden="true"></span>
        <article class="chapter" data-reveal>
          <h3 class="h4">${a('ch1.title')}</h3>
          ${t('about.ch1.p').map((p) => `<p>${p}</p>`).join('')}
        </article>
        <article class="chapter" data-reveal>
          <h3 class="h4">${a('ch2.title')}</h3>
          ${t('about.ch2.p').map((p) => `<p>${p}</p>`).join('')}
          <p class="highlight">${a('ch2.highlight')}</p>
          <p class="closing">${a('ch2.closing')}</p>
        </article>
      </div>
    </div>
  </div>
</section>

<section class="work" aria-labelledby="work-title">
  <div class="container">
    <h2 class="h2" id="work-title" data-reveal>${a('howTitle')}</h2>
    <div class="work__grid">
      ${t('about.how').map((w, i) => `<article class="principle" data-reveal style="--i:${i}"><h3 class="h4">${w.t}</h3><p>${w.p}</p></article>`).join('')}
    </div>
    <div class="seeking" data-reveal>
      <div><h3 class="h3">${a('seekTitle')}</h3><p>${a('seek')}</p></div>
      ${site.links.cv ? button(a('cv'), /^https?:/.test(site.links.cv) ? site.links.cv : ctx.asset(site.links.cv), { variant: 'light', iconName: 'material-symbols-light:download', download: true }) : ''}
    </div>
  </div>
</section>

<section class="toolset" aria-labelledby="tools-title">
  <div class="container">
    <h2 class="h2" id="tools-title" data-reveal>${a('toolsTitle')}</h2>
    <ul class="toolset__grid">
      ${toolList.map(([k, name, ic, inv], i) => `<li class="toolcard toolcard--${k}${inv ? ' toolcard--invert' : ''}" data-reveal style="--i:${i % 4}"><span class="toolcard__ic">${icon(ic, { size: k === 'stitch' ? 19 : 26 })}</span><strong>${name}</strong><span>${a('tools.' + k)}</span></li>`).join('')}
    </ul>
  </div>
</section>
</div>`;
}
