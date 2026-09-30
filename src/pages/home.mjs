import { pic, projectGrid, button } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';

export const meta = { key: 'home', section: 'home', og: 'og-home' };

// Divide el nombre en palabras para la animación de entrada.
const words = (s) => s.split(' ').map((w, i) => `<span class="word" style="--w:${i}">${w}</span>`).join(' ');

export default function home(ctx) {
  const t = ctx.t;
  const motto = t('home.motto');
  return `
<section class="hero4" data-hero data-spy="home" aria-labelledby="hero-title">
  <div class="hero4__pin">
    <!-- Escena 1: saludo + "UX/UI  [foto]  Designer" -->
    <div class="hero4__scene1 container" data-scene1>
      <h1 class="hero4__h1" id="hero-title">
        <span class="hero4__greet">${t('home.hello')}</span>
        <span class="hero4__big"><span class="hero4__w1">UX/UI</span><span class="hero4__gap" data-hero-slot1 aria-hidden="true"></span><span class="hero4__w2">Designer</span></span>
      </h1>
    </div>
    <!-- Escena 2: entra desde abajo mientras la tarjeta gira -->
    <div class="hero4__scene2 container" data-scene2>
      <div class="hero4__copy">
        <p class="hero4__greet2" aria-hidden="true">${t('home.hello')}</p>
        <p class="hero__role" aria-hidden="true">${t('home.role')}</p>
        <p class="motto"><span class="visually-hidden">${motto.join(' ')}</span>${motto.map((w, i) => `<span class="motto__w" style="--w:${i}" aria-hidden="true">${w}</span>`).join(' ')}</p>
        <a class="hero__scroll" href="#proyectos"><span class="dot">${icon('ri:arrow-down-line', { size: 18 })}</span>${t('home.projects')}</a>
      </div>
      <div class="hero4__slot2" data-hero-slot2 aria-hidden="true"></div>
    </div>
    <!-- Tarjeta con dos caras: foto 1 (frente) y foto 2 (reverso) -->
    <div class="hero4__card" data-hero-card>
      <div class="hero4__flip">
        <figure class="hero4__face hero4__face--front">${pic(ctx, 'img_home/fotohero1', { alt: t('home.photoA'), eager: true, sizes: '(min-width: 900px) 800px, 100vw', pos: 'center 20%' })}</figure>
        <figure class="hero4__face hero4__face--back">${pic(ctx, 'img_home/fotohero2', { alt: t('home.photoB'), eager: true, sizes: '(min-width: 900px) 800px, 100vw' })}</figure>
      </div>
    </div>
  </div>
</section>

<section class="projects" id="proyectos" data-spy="projects" aria-labelledby="projects-title">
  <div class="container">
    <div class="projects__head" data-reveal><h2 class="h2" id="projects-title">${t('home.projects')}</h2></div>
    ${projectGrid(ctx, { level: 3 })}
  </div>
</section>

<section class="about-teaser" data-mask aria-labelledby="about-title">
  <div class="about-card">
    <h2 class="h2" id="about-title">${t('home.aboutTitle')}</h2>
    <p>${t('home.aboutText')}</p>
    ${button(t('home.aboutBtn'), ctx.href('about'), { variant: 'light' })}
  </div>
</section>`;
}
