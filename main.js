(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const t = $('.head__toggle'), nav = $('#menu');
  const setMenu = o => { t.setAttribute('aria-expanded', String(o)); nav.classList.toggle('is-open', o); };
  t.addEventListener('click', () => setMenu(t.getAttribute('aria-expanded') !== 'true'));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  const fmt = n => n.toLocaleString('es-AR');
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), d = 1400;
    const step = now => { const p = Math.min(1, (now - t0) / d); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // #TeamCozy: filtros + ver todos
  const grid = $('#grid'), more = $('#more'), items = $$('.ath');
  const filter = f => {
    $$('.filter').forEach(x => { const on = x.dataset.f === f; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    if (f !== 'all') { grid.classList.add('is-all'); more.hidden = true; } else { more.hidden = false; }
    items.forEach(li => li.classList.toggle('is-hidden', f !== 'all' && li.dataset.k !== f));
  };
  $$('.filter').forEach(b => b.addEventListener('click', () => filter(b.dataset.f)));
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => filter(a.dataset.filter)));
  more.addEventListener('click', () => {
    const open = !grid.classList.contains('is-all');
    grid.classList.toggle('is-all', open);
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'Ver menos' : 'Ver todos (15)';
  });

  const v = $('#reel-video');
  if (v) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.dataset.loaded = 1;
          [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => { const s = document.createElement('source'); s.src = v.dataset[k]; s.type = type; v.appendChild(s); });
          v.load();
        }
        if (!reduce) v.play().catch(() => {});
      } else v.pause();
    }), { threshold: .35 });
    vio.observe(v);
  }

  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
