import es from '../i18n/es.mjs';
import en from '../i18n/en.mjs';

export const meta = { key: 'notFound', section: '', noindex: true };

// Página 404 bilingüe: muestra el idioma guardado por la visitante.
export default function notFound(ctx) {
  return `<section class="nf" aria-labelledby="nf-t">
  <div>
    <p class="nf__code" aria-hidden="true">404</p>
    <h1 class="h2" id="nf-t"><span data-l="es" lang="es">${es.notFound.title}</span><span data-l="en" lang="en">${en.notFound.title}</span></h1>
    <p><span data-l="es" lang="es">${es.notFound.text}</span><span data-l="en" lang="en">${en.notFound.text}</span></p>
    <a class="btn btn--primary" data-l="es" lang="es" href="${ctx.href('home')}">${es.notFound.btn}</a>
    <a class="btn btn--primary" data-l="en" lang="en" href="${ctx.rel('en/')}">${en.notFound.btn}</a>
  </div>
</section>`;
}
