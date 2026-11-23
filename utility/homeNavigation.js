// Index nav: marks the chapter in the middle of the screen as the current one (bold, darker), for sighted users
// through .is-active and for assistive tech through aria-current.
(() => {
  const links = [...document.querySelectorAll('.index__list a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  let navFrame = 0;
  const schedule = () => { if (!navFrame) navFrame = requestAnimationFrame(() => { navFrame = 0; update(); }); };
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
  };

  window.addEventListener('scroll', schedule, { passive: true });
  if (window.lenis && window.lenis.on) window.lenis.on('scroll', schedule); // smooth scroll reports its own position too
  window.addEventListener('resize', schedule);
  const observer = new ResizeObserver(schedule);
  sections.forEach((section) => observer.observe(section));
  update();
})();
