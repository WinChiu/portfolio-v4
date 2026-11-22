(function () {
  const section = document.querySelector('.section--life');
  if (!section) return;
  const viewport = section.querySelector('.life__viewport');
  const strip = section.querySelector('.life__strip');
  const cards = [...strip.querySelectorAll('.photo-card--strip')];
  if (!cards.length) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  let active = 0;
  let animation;
  let frame;
  let refreshTimer;
  const distance = () => Math.max(0, strip.scrollWidth - viewport.clientWidth);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tracks the card nearest the centre, for arrow-key stepping.
  function update() {
    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearest = Infinity;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const delta = Math.abs(rect.left + rect.width / 2 - center);
      if (delta < nearest) { nearest = delta; active = index; }
    });
  }
  function scheduleUpdate() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = null; update(); });
  }
  function measure() {
    // Endpoint spacing comes from the prototype's responsive page gutter.
    scheduleUpdate();
  }
  function refresh() {
    measure();
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { setupPin(); ScrollTrigger?.refresh(); }, 100);
  }
  strip.querySelectorAll('img').forEach((image) => {
    const sync = () => {
      image.closest('.photo-card--strip').classList.toggle('photo-card--landscape', image.naturalWidth > image.naturalHeight);
      refresh();
    };
    image.addEventListener('load', sync);
    image.addEventListener('error', refresh);
    if (image.complete) sync();
  });
  viewport.addEventListener('scroll', scheduleUpdate, { passive: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const next = cards[Math.max(0, Math.min(cards.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1)))];
    if (animation) {
      const target = Math.max(0, Math.min(distance(), next.offsetLeft + next.offsetWidth / 2 - viewport.clientWidth / 2));
      const trigger = animation.scrollTrigger;
      const y = trigger.start + target;
      if (window.lenis) window.lenis.scrollTo(y, { immediate: reduced() });
      else window.scrollTo({ top: y, behavior: reduced() ? 'instant' : 'smooth' });
    } else next.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced() ? 'instant' : 'smooth' });
  });
  // Phones fire 'resize' when the browser's address/tool bars show or hide; only a width change is a real relayout.
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth && matchMedia('(pointer: coarse)').matches) return;
    lastWidth = window.innerWidth;
    refresh();
  });
  measure();
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.addEventListener('refreshInit', measure);
  const desktop = matchMedia('(min-width: 48.0625rem) and (min-height: 50rem) and (hover: hover) and (pointer: fine)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  function setupPin() {
    if (!gsap || !ScrollTrigger) return;
    if (animation) {
      animation.scrollTrigger?.kill(true);
      animation.revert();
      animation = null;
    }
    section.classList.remove('is-pinned');
    viewport.scrollLeft = 0;
    measure();
    if (!desktop.matches || motion.matches || section.scrollHeight > window.innerHeight) { update(); return; }
    section.classList.add('is-pinned');
    animation = gsap.to(strip, {
      x: () => -distance(), ease: 'none', onUpdate: update,
      scrollTrigger: {
        trigger: section, start: 'top top', pin: true,
        scrub: 0.6,
        end: () => `+=${distance()}`, invalidateOnRefresh: true,
        onUpdate: scheduleUpdate, onRefresh: scheduleUpdate,
      },
    });
  }
  desktop.addEventListener('change', refresh);
  motion.addEventListener('change', refresh);
  document.fonts?.ready.then(refresh);
  setupPin();
})();
