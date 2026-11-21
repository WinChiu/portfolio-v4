(function () {
  const section = document.querySelector('.section--life');
  if (!section) return;
  const viewport = section.querySelector('.life__viewport');
  const strip = section.querySelector('.life__strip');
  const cards = [...strip.querySelectorAll('.life__card')];
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
    // Centre the endpoint cards, including after orientation changes.
    strip.style.paddingLeft = `${Math.max(0, (viewport.clientWidth - cards[0].offsetWidth) / 2)}px`;
    strip.style.paddingRight = `${Math.max(0, (viewport.clientWidth - cards.at(-1).offsetWidth) / 2)}px`;
    scheduleUpdate();
  }
  function refresh() {
    measure();
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger?.refresh(), 100);
  }
  strip.querySelectorAll('img').forEach((image) => {
    const sync = () => {
      image.closest('.life__card').classList.toggle('life__card--landscape', image.naturalWidth > image.naturalHeight);
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
  window.addEventListener('resize', refresh);
  measure();
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.addEventListener('refreshInit', measure);
  // Mirrors $bp-mobile-wide from style/_tokens.scss.
  gsap.matchMedia().add({
    desktop: '(min-width: 50rem) and (hover: hover) and (pointer: fine)',
    reduce: '(prefers-reduced-motion: reduce)',
    all: 'all',
  }, (context) => {
    viewport.scrollLeft = 0;
    measure();
    if (!context.conditions.desktop) { update(); return; }
    section.classList.add('is-pinned');
    animation = gsap.to(strip, {
      x: () => -distance(), ease: 'none', onUpdate: update,
      scrollTrigger: {
        trigger: section, start: 'top top', pin: true,
        scrub: context.conditions.reduce ? true : 0.6,
        end: () => `+=${distance()}`, invalidateOnRefresh: true,
        onUpdate: scheduleUpdate, onRefresh: scheduleUpdate,
      },
    });
    return () => { animation = null; section.classList.remove('is-pinned'); };
  });
})();
