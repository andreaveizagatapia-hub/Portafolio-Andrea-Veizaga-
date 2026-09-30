# Portfolio de Andrea Maria · UX/UI Designer

Sitio estático (HTML + CSS + JS sin frameworks) generado desde tu diseño de Figma “Portfolio / con autolayout”.

## Estructura

```
src/
  config.mjs          ← enlaces externos (LinkedIn, WhatsApp, CV, prototipos, dominio)
  i18n/es.mjs         ← TODOS los textos en español (fuente: Figma)
  i18n/en.mjs         ← los mismos textos en inglés (mismas claves)
  lib/components.mjs  ← componentes reutilizables: header, footer, card, botón, carrusel, antes/después…
  lib/icons.mjs       ← íconos de herramientas (mismos sets de Iconify que en Figma)
  pages/*.mjs         ← una plantilla por página
  data/media.json     ← dimensiones de cada imagen optimizada (generado)
public/
  css/styles.css      ← tokens de Figma (colores, tipografías), modo claro/oscuro
  js/main.js          ← interacciones (menú, tema, lightbox, carruseles, índice…)
  media/              ← imágenes AVIF/WebP y videos MP4 optimizados
  og/                 ← imágenes para compartir en LinkedIn/WhatsApp
recursos-originales/  ← tus archivos originales, intactos (no se publican)
tools/                ← scripts de optimización de medios y de imágenes Open Graph
```

## Comandos

```bash
npm install          # una sola vez
npm run build        # genera /dist
npm run serve        # vista previa en http://localhost:8080
npm run media        # re-optimiza imágenes/videos si cambias algo en recursos-originales (requiere ffmpeg)
npm run og           # regenera imágenes Open Graph (con el servidor corriendo; requiere Python + Playwright)
```

## Editar contenido

- **Un texto:** búscalo en `src/i18n/es.mjs` y su par en `en.mjs`. El build avisa si falta una traducción.
- **Un enlace:** completa `src/config.mjs`. Mientras un enlace esté vacío, su botón no se muestra.
- **Colores o tipografías:** variables al inicio de `public/css/styles.css` (claro en `:root`, oscuro en `[data-theme="dark"]`).

## Publicar en Vercel

1. Sube la carpeta a GitHub (sin `node_modules/` ni `dist/`; ya están en `.gitignore`).
2. En Vercel: **Add New → Project → importar el repo**. `vercel.json` ya define build (`node build.mjs`) y salida (`dist`).
3. Cambia `site.url` en `src/config.mjs` por tu dominio final para que canonical, sitemap y Open Graph apunten bien.

## URLs

| Página | Español | English |
|---|---|---|
| Inicio | `/` | `/en/` |
| Sobre mí | `/sobre-mi/` | `/en/about/` |
| PedidosYa | `/proyectos/pedidosya/` | `/en/projects/pedidosya/` |
| Prime Cinemas | `/proyectos/prime-cinemas/` | `/en/projects/prime-cinemas/` |
| Rico | `/proyectos/rico/` | `/en/projects/rico/` |
| Nestart | `/proyectos/nestart/` | `/en/projects/nestart/` |

## Recursos sin uso (conservados en `recursos-originales/`, no publicados)

- `img_home/foto_compu.webp`, `foto_feliz.webp`, `foto_libro.webp`, `foto_parada.webp`
- `img_rico/foto_amigos.jpg`
- `img_pedidos/mapaempatia_valentina.png` (duplicado de la versión `.webp`, que sí se usa)

Para usar alguno, agrégalo a la lista `UNUSED` de `tools/optimize-media.mjs` (quitándolo), corre `npm run media` y referencia su clave (p. ej. `img_home/foto_libro`) con `pic()` en la página.
