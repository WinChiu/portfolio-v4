// Index nav: entering a chapter fills the whole bar with that chapter's color, wiping in from the top.
// Between two chapters the old color wipes out downward first and the new one wipes in afterwards, so the
// page background shows through for a beat in between.
(() => {
  const nav = document.querySelector('.index');
  const links = [...document.querySelectorAll('.index__list a[href^="#"]')];
  const social = document.querySelector('.index__social');
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const mobile = matchMedia('(max-width: 48rem)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let fill = nav.querySelector('.index__fill');
  if (!fill) { fill = document.createElement('span'); fill.className = 'index__fill'; fill.setAttribute('aria-hidden', 'true'); nav.prepend(fill); }

  const GAP = 150; // bare page shows through between the two colors
  const WIPE = 800; // a color wipes in or out (matches --nav-wipe-duration in _nav.scss)
  const items = [...links, social].filter(Boolean);
  const colorOf = (a) => getComputedStyle(a).getPropertyValue('--accent-ink').trim();
  const heroColor = () => getComputedStyle(document.documentElement).getPropertyValue('--sys-color-brand').trim();
  const hiddenClip = () => (mobile.matches ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)');
  const exitClip = () => (mobile.matches ? 'inset(0 0 0 100%)' : 'inset(100% 0 0 0)');

  // -2: nothing shown yet, -1: the hero (brand green), 0..n: a chapter
  let current = -2;
  let timers = [];
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const cancel = () => { timers.forEach(clearTimeout); timers = []; };

  // run fn for each label at the moment the wipe edge reaches it
  function eachAtEdge(fn) {
    const box = nav.getBoundingClientRect();
    const size = mobile.matches ? box.width : box.height;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const center = mobile.matches ? r.left - box.left + r.width / 2 : r.top - box.top + r.height / 2;
      later(() => fn(el), reduced.matches ? 0 : (center / size) * WIPE);
    });
  }

  function wipeIn(color) {
    fill.style.transition = 'none';
    nav.style.setProperty('--fill-color', color);
    nav.style.setProperty('--fill-clip', hiddenClip());
    fill.style.opacity = '1';
    fill.getBoundingClientRect();
    fill.style.transition = '';
    nav.style.setProperty('--fill-clip', 'inset(0)');
    eachAtEdge((el) => el.classList.add('on-fill'));
  }

  function wipeOut() {
    nav.style.setProperty('--fill-clip', exitClip());
    eachAtEdge((el) => el.classList.remove('on-fill'));
  }

  function show(index, previous) {
    cancel();
    const color = index < 0 ? heroColor() : colorOf(links[index]);
    if (previous > -2 && !reduced.matches) {
      wipeOut();
      later(() => wipeIn(color), WIPE + GAP);
    } else {
      wipeIn(color);
    }
  }

  const update = () => {
    const mid = innerHeight * 0.5;
    let active = -1;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) active = i;
    });
    links.forEach((a, i) => {
      a.classList.toggle('is-active', i === active);
      if (i === active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    if (active === current) return;
    const previous = current;
    current = active;
    show(active, previous);
  };

  window.addEventListener('scroll', update, { passive: true });
  if (window.lenis && window.lenis.on) window.lenis.on('scroll', update); // smooth scroll reports its own position too
  window.addEventListener('resize', update);
  const observer = new ResizeObserver(update);
  sections.forEach((section) => observer.observe(section));
  update();
})();
