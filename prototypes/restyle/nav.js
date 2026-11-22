// Index nav: the bar is always one or two colors.
// Every chapter fills from the top. Work fills the empty bar; from then on the bar stays full: the previous color keeps the
// bottom, and the current chapter's color grows in from the top and takes over as the chapter scrolls by.
(() => {
  const nav = document.querySelector('.index');
  const links = [...document.querySelectorAll('.index__list a[href^="#"]')];
  const social = document.querySelector('.index__social');
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const mobile = matchMedia('(max-width: 48rem)');
  let fill = nav.querySelector('.index__fill');
  if (!fill) { fill = document.createElement('span'); fill.className = 'index__fill'; fill.setAttribute('aria-hidden', 'true'); nav.prepend(fill); }
  nav.style.setProperty('--fill', '1');

  const colorOf = (a) => getComputedStyle(a).getPropertyValue('--accent-ink').trim();

  const update = () => {
    const mid = innerHeight * 0.5;
    let active = -1;
    let p = 0;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { active = i; p = Math.min(1, Math.max(0, (mid - r.top) / (r.height || 1))); }
    });
    if (active < 0 && sections.length && sections[0].getBoundingClientRect().top > mid) { p = 0; }

    const dir = mobile.matches ? 'to right' : 'to bottom';
    let gradient = 'none';
    let covered = 0; // share of the bar (0..1) that is colored
    if (active === 0) {
      const c = colorOf(links[0]);
      gradient = `linear-gradient(${dir}, ${c} 0% ${(p * 100).toFixed(2)}%, transparent ${(p * 100).toFixed(2)}% 100%)`;
      covered = p;
    } else if (active > 0) {
      const prev = colorOf(links[active - 1]);
      const cur = colorOf(links[active]);
      const edge = (p * 100).toFixed(2); // current color grows from the top, pushing the previous color down
      gradient = `linear-gradient(${dir}, ${cur} 0% ${edge}%, ${prev} ${edge}% 100%)`;
      covered = 1;
    }
    nav.style.setProperty('--fill-gradient', gradient);

    links.forEach((a, i) => {
      a.classList.toggle('is-active', i === active);
      if (i === active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    // links / icon that sit on a colored part switch to paper-colored text
    const n = nav.getBoundingClientRect();
    const limit = (mobile.matches ? n.width : n.height) * covered;
    [...links, social].forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = mobile.matches ? r.left - n.left + r.width / 2 : r.top - n.top + r.height / 2;
      el.classList.toggle('on-fill', center <= limit);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  const observer = new ResizeObserver(update);
  sections.forEach((section) => observer.observe(section));
  update();
})();
