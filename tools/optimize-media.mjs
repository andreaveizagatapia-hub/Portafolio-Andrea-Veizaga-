// Optimiza los recursos originales para web.
// - Imágenes → AVIF + WebP en varios anchos (srcset) + manifest con dimensiones.
// - GIF animados → MP4 (H.264) + póster WebP.
// - Videos → MP4 H.264 comprimido, sin audio, + póster WebP.
// Los originales en /recursos-originales NO se modifican.
// Uso: node tools/optimize-media.mjs  (requiere ffmpeg en el PATH)
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

sharp.cache(false);
const SRC = 'recursos-originales/img';
const OUT = 'public/media';
const WIDTHS = [480, 800, 1200, 1600, 2400];
// Diagramas con mucho detalle: versión extra grande para el visor (lightbox)
const DETAIL = /journey|mapaempatia|user_valentina|afinidad|arquitectura|matriz|mapa_tonos|wire_nestart|sistema_dis/;

// Recursos que se conservan pero no se publican (sin uso evidente en Figma o duplicados).
const UNUSED = new Set([
  'img_home/foto_compu', 'img_home/foto_feliz', 'img_home/foto_libro', 'img_home/foto_parada',
  'img_rico/foto_amigos', 'img_pedidos/mapaempatia_valentina.png',
]);

// Nombres con tildes/ñ → ASCII para URLs seguras (solo en la copia optimizada).
const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/g, 'n').toLowerCase();

const manifest = {};
const folders = readdirSync(SRC).filter((f) => statSync(join(SRC, f)).isDirectory());
const jobs = [];
for (const folder of folders) {
  for (const file of readdirSync(join(SRC, folder))) jobs.push([folder, file]);
}
jobs.push(['', 'logo.png']);

const only = process.argv[2]; // filtro opcional
for (const [folder, file] of jobs) {
  const { name, ext } = parse(file);
  const e = ext.toLowerCase();
  const key = (folder ? folder + '/' : '') + ascii(name);
  if (UNUSED.has((folder ? folder + '/' : '') + name) || UNUSED.has((folder ? folder + '/' : '') + file)) continue;
  if (only && !key.includes(only)) continue;
  const input = join(SRC, folder, file);
  const outDir = join(OUT, folder);
  mkdirSync(outDir, { recursive: true });
  const base = join(outDir, ascii(name));

  if (e === '.mp4' || e === '.gif') {
    const out = base + '.mp4';
    if (!existsSync(out)) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-an',
        '-vf', "scale='min(1600,iw)':-2:flags=lanczos,fps=30,format=yuv420p",
        '-c:v', 'libx264', '-preset', 'slow', '-crf', e === '.gif' ? '24' : '27',
        '-movflags', '+faststart', out]);
    }
    const poster = base + '-poster.webp';
    if (!existsSync(poster)) {
      const tmp = base + '-poster.png';
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '0.5', '-i', out, '-frames:v', '1', tmp]);
      await sharp(tmp).webp({ quality: 72 }).toFile(poster);
      execFileSync('rm', [tmp]);
    }
    const m = await sharp(poster).metadata();
    manifest[key] = { type: 'video', w: m.width, h: m.height, src: key + '.mp4', poster: key + '-poster.webp',
      kb: Math.round(statSync(out).size / 1024) };
    console.log('video', key, manifest[key].kb + 'KB');
    continue;
  }
  if (e === '.svg') {
    execFileSync('cp', [input, base + '.svg']);
    manifest[key] = { type: 'svg', src: key + '.svg' };
    continue;
  }
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(e)) continue;

  const img = sharp(input, { limitInputPixels: false });
  const meta = await img.metadata();
  const max = DETAIL.test(key) ? 3600 : 2400;
  const ws = DETAIL.test(key) ? [...WIDTHS, 3600] : WIDTHS;
  const widths = ws.filter((w) => w < meta.width && w <= max);
  if (meta.width <= max) widths.push(meta.width);
  const h = (w) => Math.round((meta.height * w) / meta.width);
  for (const w of widths) {
    for (const fmt of ['avif', 'webp']) {
      const out = `${base}-${w}.${fmt}`;
      if (existsSync(out)) continue;
      let p = sharp(input, { limitInputPixels: false }).resize({ width: w, withoutEnlargement: true });
      p = fmt === 'avif' ? p.avif({ quality: 52, effort: 4 }) : p.webp({ quality: 78, effort: 5 });
      await p.toFile(out);
    }
  }
  manifest[key] = { type: 'img', w: Math.max(...widths), h: h(Math.max(...widths)), widths, alpha: !!meta.hasAlpha };
  console.log('img', key, widths.join(','));
}

const mf = 'src/data/media.json';
mkdirSync('src/data', { recursive: true });
let prev = {};
if (only && existsSync(mf)) prev = JSON.parse((await import('node:fs')).readFileSync(mf, 'utf8'));
writeFileSync(mf, JSON.stringify({ ...prev, ...manifest }, null, 1));
console.log('manifest:', Object.keys(manifest).length);
