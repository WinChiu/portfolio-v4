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
  const maxLeftOf = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
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
  // `active` is only needed when an arrow key is pressed, so it is worked out then (see the keydown handler)
  // instead of reading every card's position on every scroll frame.
  function scheduleUpdate() {}
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
    update();
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
  // Mouse wheel: once the page is scrolled to the very bottom, further scrolling moves the strip sideways (and
  // scrolling back up first returns along the strip). Not used while the strip is pinned (the pin already does this).
  {
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    let goal = 0;
    let wheelFrame = 0;
    // "At the bottom" means the scroll TARGET is at the bottom. Smooth scroll (Lenis) glides toward it for a moment
    // after the wheel has already asked for it, and waiting for the page itself to arrive felt broken.
    const atBottom = () => (window.lenis && Number.isFinite(window.lenis.targetScroll)
      ? window.lenis.targetScroll >= window.lenis.limit - 2
      : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2);
    const maxLeft = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const glide = () => {
      wheelFrame = 0;
      const delta = goal - viewport.scrollLeft;
      if (Math.abs(delta) < 6) { viewport.scrollLeft = goal; return; } // no long, slow tail after the wheel stops
      // Browsers round scrollLeft to whole pixels, so every step moves at least 1px; otherwise the last few
      // pixels never close and the strip would swallow the wheel forever.
      const step = Math.sign(delta) * Math.max(1, Math.abs(delta) * 0.4);
      const before = viewport.scrollLeft;
      viewport.scrollLeft = before + step;
      if (viewport.scrollLeft === before) { viewport.scrollLeft = goal; return; }
      wheelFrame = requestAnimationFrame(glide);
    };
    window.addEventListener('wheel', (event) => {
      if (animation || offPage() || !mouse.matches || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (event.target.closest && event.target.closest('.kitchenMenu__sheet, [data-zoom-clone]')) return;
      const left = viewport.scrollLeft;
      const wantsRight = event.deltaY > 0 && atBottom() && left < maxLeft() - 1;
      const wantsLeft = event.deltaY < 0 && atBottom() && left > 0.5;
      if (!wantsRight && !wantsLeft) return;
      // The strip is already on its way to the very start: let the page scroll up right away instead of waiting
      // for the strip's glide to finish (which felt like a pause when switching from sideways to vertical).
      if (wantsLeft && wheelFrame && goal <= 0) return;
      event.preventDefault();
      event.stopImmediatePropagation(); // keep smooth scroll (Lenis) from also reacting
      if (!wheelFrame) goal = left; // idle: start from where the strip actually is
      goal = Math.max(0, Math.min(maxLeft(), goal + event.deltaY));
      if (!wheelFrame) wheelFrame = requestAnimationFrame(glide);
    }, { passive: false, capture: true });
  }
  measure();
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.addEventListener('refreshInit', measure);
  const desktop = matchMedia('(min-width: 48.0625rem) and (min-height: 32rem) and (hover: hover) and (pointer: fine)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // Wide screens show one page at a time (utility/homeNavigation.js); Life does nothing while another one is shown.
  const offPage = () => document.body.classList.contains('is-paged') && !section.classList.contains('is-current');
  document.addEventListener('home:page', () => setupPin());
  // The horizontal bars held at the top of the screen; Life is the last chapter, so all of them are above it. Vertical
  // bars, and bars that scroll with the page, take no height.
  const barsHeight = () => [...document.querySelectorAll('.chapter-bar')]
    .filter((bar) => bar.offsetWidth > bar.offsetHeight && /sticky|fixed/.test(getComputedStyle(bar).position))
    .reduce((sum, bar) => sum + bar.offsetHeight, 0);
  function setupPin() {
    if (!gsap || !ScrollTrigger) return;
    if (animation) {
      animation.scrollTrigger?.kill(true);
      animation.revert();
      animation = null;
    }
    section.classList.remove('is-pinned');
    measure();
    // Keep the reader's place: refresh() also runs when a lazy photo finishes loading mid-swipe.
    if (!desktop.matches || motion.matches || section.scrollHeight > window.innerHeight - barsHeight() || offPage()) { update(); return; }
    viewport.scrollLeft = 0;
    section.classList.add('is-pinned');
    animation = gsap.to(strip, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: section, start: () => `top ${barsHeight()}px`, pin: true,
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
