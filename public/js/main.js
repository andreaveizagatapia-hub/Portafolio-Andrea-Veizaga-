/* Andrea Maria — interacciones (sin dependencias) */
(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];

  /* ---------- Cada página nueva abre desde arriba ----------
     Al navegar entre páginas (sin #ancla) siempre se empieza en el top.
     El botón "atrás/adelante" conserva la posición anterior del navegador. */
  const navType = performance.getEntriesByType?.('navigation')[0]?.type;
  let userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, () => { userMoved = true; }, { once: true, passive: true }));
  const goTop = () => {
    if (location.hash || navType === 'back_forward' || userMoved) return;
    root.style.scrollBehavior = 'auto';
    scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Si la página está dentro de un visor/iframe que también hace scroll, llevarlo arriba
    try { root.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch {}
    requestAnimationFrame(() => { root.style.scrollBehavior = ''; });
  };
  if (navType !== 'back_forward' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
  goTop();
  addEventListener('load', goTop, { once: true });
  addEventListener('pageshow', (e) => { if (!e.persisted) goTop(); });
  // Al salir hacia otra página del sitio, restablecer para que "atrás" funcione normal
  addEventListener('pagehide', () => { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; });

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtns = $$('[data-theme-toggle]');
  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtns.forEach((b) => b.setAttribute('aria-label', dark ? b.dataset.labelLight : b.dataset.labelDark));
    $$('[data-theme-text]').forEach((s) => (s.textContent = dark ? s.dataset.textLight : s.dataset.textDark));
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = dark ? '#161413' : '#fdfcfa';
  };
  const setTheme = (next, origin) => {
    const apply = () => { root.dataset.theme = next; store.set('theme', next); syncTheme(); };
    if (!reduce.matches && d.startViewTransition && origin) {
      const r = origin.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = d.startViewTransition(apply);
      vt.ready.then(() => root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    } else {
      root.classList.add('theme-anim'); apply();
      setTimeout(() => root.classList.remove('theme-anim'), 500);
    }
  };
  themeBtns.forEach((b) => b.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', b)));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!store.get('theme')) { root.dataset.theme = e.matches ? 'dark' : 'light'; syncTheme(); } });
  syncTheme();

  /* ---------- Idioma: recordar la elección ---------- */
  $$('[data-set-lang]').forEach((a) => a.addEventListener('click', () => store.set('lang', a.dataset.setLang)));

  /* ---------- Header: ocultar al bajar, mostrar al subir + progreso ---------- */
  const header = $('[data-header]');
  const progress = $('[data-progress]');
  const main = $('main');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (!root.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 320 && y > lastY + 4);
    if (y < lastY - 4 || y < 320) header.classList.remove('is-hidden');
    lastY = y;
    if (progress && d.body.classList.contains('has-progress')) {
      const h = main.offsetTop + main.offsetHeight - innerHeight;
      progress.style.setProperty('--p', Math.min(1, Math.max(0, y / Math.max(1, h))).toFixed(4));
    }
    parallax(y);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  /* ---------- Parallax muy sutil ---------- */
  const px = reduce.matches ? [] : $$('[data-parallax]');
  const cover = reduce.matches ? null : $('.case-cover__pic');
  const hero = $('[data-hero]');
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const easeInOut = (x) => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const H = hero && {
    pin: $('.hero4__pin', hero), card: $('[data-hero-card]', hero),
    s1: $('[data-hero-slot1]', hero), s2: $('[data-hero-slot2]', hero),
  };
  function heroProgress() {
    if (!hero) return;
    const pinH = H.pin.clientHeight;
    const R = Math.max(1, hero.offsetHeight - pinH);
    const d = reduce.matches ? R : Math.min(R, Math.max(0, -hero.getBoundingClientRect().top));
    const p = d / R;
    const y2 = reduce.matches ? 0 : Math.max(0, R * .55 - d);        // la escena 2 sube hasta asentarse
    const f = reduce.matches ? 1 : easeInOut(clamp01((p - .04) / .4)); // giro de la tarjeta
    const t = reduce.matches ? 1 : clamp01((p - .5) / .25);          // aparece el lema
    hero.style.setProperty('--d', d.toFixed(1));
    hero.style.setProperty('--y2', y2.toFixed(1));
    hero.style.setProperty('--f', f.toFixed(4));
    hero.style.setProperty('--t', t.toFixed(4));
    // Posición de la tarjeta: del hueco de la escena 1 al hueco de la escena 2
    const pr = H.pin.getBoundingClientRect(), a = H.s1.getBoundingClientRect(), b = H.s2.getBoundingClientRect();
    const ax = a.left - pr.left + a.width / 2, ay = a.top - pr.top + a.height / 2 + d;      // escena 1 sin su desplazamiento
    const bx = b.left - pr.left + b.width / 2, by = b.top - pr.top + b.height / 2 - y2;     // escena 2 ya asentada
    const cw = H.card.offsetWidth, ch = H.card.offsetHeight;
    const x = ax + (bx - ax) * f - cw / 2, y = ay + (by - ay) * f - ch / 2;
    const sc = 1 + (b.width / cw - 1) * f;
    const tilt = Math.sin(f * Math.PI) * -6 + f * 3;                   // leve inclinación durante el giro
    H.card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
  }
  if (hero) { addEventListener('resize', () => requestAnimationFrame(heroProgress)); reduce.addEventListener?.('change', heroProgress); addEventListener('load', heroProgress); }
  const masks = $$('[data-mask]');
  function maskProgress() {
    masks.forEach((el) => {
      if (reduce.matches) { el.style.setProperty('--q', 1); return; }
      const r = el.getBoundingClientRect();
      const q = clamp01((innerHeight - r.top) / (innerHeight * .85));
      el.style.setProperty('--q', q.toFixed(4));
    });
  }
  function parallax(y) {
    heroProgress();
    maskProgress();
    if (y > innerHeight * 1.5) return;
    px.forEach((el) => { el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`; });
    if (cover) cover.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0) scale(1.02)`;
  }

  /* ---------- Menú móvil ---------- */
  const menuBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  const openMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen);
    root.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      $$('.mobile-menu__link', menu).forEach((a, i) => a.style.setProperty('--d', i));
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      setTimeout(() => $('a', menu)?.focus(), 60);
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduce.matches ? 0 : 320);
    }
  };
  menuBtn?.addEventListener('click', () => openMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) openMenu(false); });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { openMenu(false); menuBtn.focus(); }
    if (e.key === 'Tab' && root.classList.contains('menu-open')) { // trampa de foco
      const f = [menuBtn, ...$$('a, button', menu)];
      const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) openMenu(false); });

  /* ---------- Imágenes: estado de carga y error ---------- */
  $$('.media img').forEach((img) => {
    const pic = img.closest('.media');
    const done = () => { img.classList.add('is-loaded'); pic.classList.add('is-done'); };
    const fail = () => { pic.classList.add('is-error', 'is-done'); pic.dataset.alt = img.alt || ''; };
    if (img.complete && img.naturalWidth) done();
    else if (img.complete && !img.naturalWidth && img.currentSrc) fail();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', fail, { once: true }); }
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); onReveal(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el) => revealIO.observe(el));

  function onReveal(el) {
    $$('[data-count]', el).concat(el.matches('[data-count]') ? [el] : []).forEach(countUp);
    $$('[data-donut]', el).forEach((c) => (c.style.strokeDashoffset = c.dataset.donut));
  }
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '', sep = el.dataset.sep || '.';
    const fmt = (v) => v.toFixed(dec).replace('.', sep) + suffix;
    if (reduce.matches) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = fmt(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- Navegación activa (scroll-spy en Home) ---------- */
  const spy = $$('[data-spy]');
  if (spy.length) {
    const navLinks = $$('[data-nav]');
    const set = (k) => navLinks.forEach((a) => (a.dataset.nav === k ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) set(e.target.dataset.spy); }), { rootMargin: '-45% 0px -50% 0px' });
    spy.forEach((s) => io.observe(s));
  }

  /* ---------- Videos: reproducir solo en pantalla ---------- */
  $$('.video').forEach((fig) => {
    const v = $('video', fig), btn = $('.video__toggle', fig);
    let userPaused = false;
    const sync = () => { const on = !v.paused; fig.classList.toggle('is-playing', on); btn.setAttribute('aria-label', on ? btn.dataset.labelPause : btn.dataset.labelPlay); };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    btn.addEventListener('click', () => { if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); } });
    if (reduce.matches) return; // sin autoplay con movimiento reducido
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }, { threshold: 0.35 }).observe(v);
  });

  /* ---------- Carruseles ---------- */
  $$('[data-carousel]').forEach((c) => {
    const track = $('[data-carousel-track]', c), prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
    const step = () => Math.max(240, track.clientWidth * 0.8);
    const upd = () => { prev.disabled = track.scrollLeft < 8; next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8; };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce.matches ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce.matches ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd); upd();
    if (track.scrollWidth <= track.clientWidth + 8) $('.carousel__nav', c).hidden = true;
  });

  /* ---------- Antes / Después ---------- */
  $$('[data-ba]').forEach((ba) => {
    const r = $('input', ba);
    r.addEventListener('input', () => ba.style.setProperty('--pos', r.value + '%'));
  });

  /* ---------- Lightbox ---------- */
  const lb = $('[data-lightbox]');
  if (lb) {
    const img = $('[data-lb-img]', lb), cap = $('[data-lb-caption]', lb), stage = $('[data-lb-stage]', lb);
    const prevB = $('[data-lb-prev]', lb), nextB = $('[data-lb-next]', lb);
    let group = [], idx = 0, opener = null;
    const show = (i) => {
      idx = (i + group.length) % group.length;
      const b = group[idx], alt = $('img', b)?.alt || '';
      const tall = +b.dataset.lbH / +b.dataset.lbW > 2.2;
      stage.classList.toggle('is-tall', tall); stage.scrollTop = 0;
      img.src = b.dataset.lb; img.alt = alt; cap.textContent = b.dataset.lbCaption || alt;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      prevB.hidden = nextB.hidden = group.length < 2;
    };
    d.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb]'); if (!b) return;
      opener = b;
      group = b.dataset.lbGroup ? $$(`[data-lb-group="${b.dataset.lbGroup}"]`).filter((x) => !x.closest('[data-dup]')) : [b];
      let i = group.indexOf(b);
      if (i < 0) i = Math.max(0, group.findIndex((x) => x.dataset.lb === b.dataset.lb));
      lb.classList.toggle('lightbox--flip', !!b.closest('[data-flip]'));
      show(i); lb.showModal(); root.classList.add('lb-open');
    });
    const close = () => lb.close();
    lb.addEventListener('close', () => { root.classList.remove('lb-open'); img.removeAttribute('src'); opener?.focus(); });
    $('[data-lb-close]', lb).addEventListener('click', close);
    prevB.addEventListener('click', () => show(idx - 1)); nextB.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === stage || e.target === lb) close(); });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft' && group.length > 1) show(idx - 1); if (e.key === 'ArrowRight' && group.length > 1) show(idx + 1); });
  }

  /* ---------- Índice del caso de estudio ---------- */
  const tocRoot = $('[data-toc-root]');
  if (tocRoot) {
    const heads = $$('main [data-toc]');
    const list = $('[data-toc-list]', tocRoot), btn = $('[data-toc-btn]', tocRoot), panel = $('[data-toc-panel]', tocRoot);
    if (heads.length < 3) tocRoot.remove();
    else {
      heads.forEach((h, i) => { if (!h.id) h.id = 's-' + (i + 1); list.insertAdjacentHTML('beforeend', `<li><a href="#${h.id}">${h.textContent.trim()}</a></li>`); });
      const links = $$('a', list);
      const toggle = (open) => { btn.setAttribute('aria-expanded', open); panel.hidden = !open; };
      btn.addEventListener('click', () => toggle(panel.hidden));
      list.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
      d.addEventListener('click', (e) => { if (!tocRoot.contains(e.target)) toggle(false); });
      d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { toggle(false); btn.focus(); } });
      const io = new IntersectionObserver((en) => en.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => (a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      }), { rootMargin: '0px 0px -70% 0px' });
      heads.forEach((h) => io.observe(h));
      const intro = $('.case-intro');
      new IntersectionObserver(([e]) => tocRoot.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(intro);
    }
  }

  /* ---------- Línea de la historia (Sobre mí) ---------- */
  const story = $('[data-story]');
  if (story) {
    const upd = () => { const r = story.getBoundingClientRect(); const p = (innerHeight * 0.6 - r.top) / r.height; story.style.setProperty('--story', Math.min(1, Math.max(0, p)).toFixed(3)); };
    addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  }

  /* ---------- Copiar e-mail ---------- */
  const toast = $('[data-toast]');
  let tt;
  const say = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2200); };
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch {
      const ta = d.createElement('textarea'); ta.value = b.dataset.copy; d.body.append(ta); ta.select(); d.execCommand('copy'); ta.remove();
    }
    say(b.dataset.copied);
    // Confirmación en el propio botón (tooltip cambia a "E-mail copiado")
    if (b.dataset.tip) {
      const tip = b.dataset.tip; b.dataset.tip = b.dataset.copied; b.classList.add('is-copied');
      clearTimeout(b._t); b._t = setTimeout(() => { b.dataset.tip = tip; b.classList.remove('is-copied'); }, 1800);
    }
  }));

  onScroll();
})();
