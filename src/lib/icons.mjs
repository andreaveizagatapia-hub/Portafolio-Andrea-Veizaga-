// Íconos SVG en línea, generados en build desde los mismos sets de Iconify usados en Figma.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sets = {};
function getSet(prefix) {
  if (!sets[prefix]) sets[prefix] = JSON.parse(readFileSync(require.resolve(`@iconify-json/${prefix}/icons.json`), 'utf8'));
  return sets[prefix];
}

// Íconos propios (marcas simples dibujadas a mano cuando no existen en Iconify)
const custom = {
  uxtweak: { w: 24, h: 24, body: '<path fill="currentColor" d="M12 1.8 21 7v10l-9 5.2L3 17V7z"/>' },
  stitch: { w: 42, h: 19, body: '<rect width="42" height="19" rx="9.5" fill="currentColor"/><circle cx="13" cy="9.5" r="4.6" fill="#fff"/><circle cx="29" cy="9.5" r="4.6" fill="#fff"/>' },
  arrowUpRight: { w: 24, h: 24, body: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9"/>' },
  sun: { w: 24, h: 24, body: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></g>' },
  moon: { w: 24, h: 24, body: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M20.3 14.6A8.5 8.5 0 0 1 9.4 3.7a8.5 8.5 0 1 0 10.9 10.9Z"/>' },
  menu: { w: 24, h: 24, body: '<g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path class="l1" d="M4 8h16"/><path class="l2" d="M4 16h16"/></g>' },
  close: { w: 24, h: 24, body: '<path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="m6 6 12 12M18 6 6 18"/>' },
  play: { w: 24, h: 24, body: '<path fill="currentColor" d="M8 5.5v13l11-6.5z"/>' },
  pause: { w: 24, h: 24, body: '<path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>' },
  expand: { w: 24, h: 24, body: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>' },
  list: { w: 24, h: 24, body: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>' },
  compare: { w: 24, h: 24, body: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m9 8-4 4 4 4M15 8l4 4-4 4"/>' },
};

export function icon(name, { size = 24, label = '', cls = '' } = {}) {
  let w, h, body;
  if (custom[name]) ({ w, h, body } = custom[name]);
  else {
    const [prefix, id] = name.split(':');
    const set = getSet(prefix);
    let ic = set.icons[id];
    if (!ic && set.aliases?.[id]) ic = set.icons[set.aliases[id].parent];
    if (!ic) throw new Error('Icono no encontrado: ' + name);
    body = ic.body; w = ic.width || set.width || 16; h = ic.height || set.height || 16;
  }
  const height = size;
  const width = Math.round((size * w) / h);
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon ${cls}" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}" ${a11y}>${body}</svg>`;
}

// Herramientas: nombre visible + ícono (mismo set que en Figma)
export const tools = {
  figma: { name: 'Figma', icon: 'material-icon-theme:figma' },
  surveymonkey: { name: 'SurveyMonkey', icon: 'selfhst:surveymonkey-dark', invert: true },
  googleforms: { name: 'Google Forms', icon: 'arcticons:google-forms' },
  gemini: { name: 'Gemini', icon: 'ri:gemini-fill' },
  perplexity: { name: 'Perplexity', icon: 'selfhst:perplexity-ai-dark', invert: true },
  photoshop: { name: 'Photoshop', icon: 'devicon-plain:photoshop' },
  illustrator: { name: 'Illustrator', icon: 'devicon-plain:illustrator' },
  chatgpt: { name: 'ChatGPT', icon: 'selfhst:chatgpt-dark', invert: true },
  uxtweak: { name: 'UXtweak', icon: 'uxtweak' },
  maze: { name: 'Maze', icon: 'arcticons:maze' },
  googletranslate: { name: 'Google Translate', icon: 'mdi:google-translate' },
};
