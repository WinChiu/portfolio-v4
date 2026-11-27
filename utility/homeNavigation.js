// Chapter navigation.
//
// The hero and each chapter are separate pages, one shown at a time. Pushing on past the bottom of a page (past the top,
// to go back) a little further turns it: the page and its bar slide across by themselves,
// so a bar ends up on the side reached or the side ahead and never rests in between. Over 1024px the bars are vertical (left
// and right), below that horizontal (top and bottom). Very short narrow screens keep one long page instead, with the
// bars stacked by CSS; there this only marks the current one (aria-current).
(() => {
  const bars = [...document.querySelectorAll('.chapter-bar')];
  const pages = [document.querySelector('.hero'), ...bars.map((bar) => document.querySelector(bar.getAttribute('href')))];
  if (!bars.length || pages.some((page) => !page)) return;

  if (window.lenis) window.lenis.options.lerp = 0.2; // the default 0.1 takes long to settle
  const body = document.body;
  const wide = matchMedia('(min-width: 64.0625rem)'); // vertical bars
  const paged = matchMedia('(min-width: 64.0625rem), (min-height: 30.0625rem)');
  const QUIET_MS = 220; // a pause this long ends a wheel gesture (trackpad momentum keeps sending events)
  const PULL_WHEEL = 200; // wheel travel past an edge that turns the page (about two notches of a mouse wheel)
  const PULL_TOUCH = 110; // finger travel for the same
  const PULL_STEP = 120; // most one wheel event can add, so a single hard flick is not enough
  const PULL_RELEASE_MS = 420; // after this long without a push the count starts over
  const PULL_ABSORB = 600; // wheel travel at the edge ignored for the gesture that scrolled there (about five notches)
  const PUSH = 40; // within a gesture that scrolled to the edge, smaller or fading steps are momentum, not a push
  const NEAR = 24; // px from the edge at which the page counts as there (the glide's last few pixels)
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let turning = false;

  const markBar = (index) => bars.forEach((bar, i) => {
    if (i === index) bar.setAttribute('aria-current', 'location');
    else bar.removeAttribute('aria-current');
  });

  const jump = (top) => {
    if (window.lenis) {
      window.lenis.resize();
      window.lenis.scrollTo(top, { immediate: true, force: true });
    }
    window.scrollTo({ top, behavior: 'instant' });
  };

  // Marks the page being shown.
  function render() {
    pages.forEach((page, i) => page.classList.toggle('is-current', i === current));
    bars.forEach((bar, i) => bar.classList.toggle('is-passed', i < current));
    body.style.setProperty('--passed', current);
    markBar(current - 1);
  }
  // Tells the scripts that measure the layout.
  function relayout() {
    document.dispatchEvent(new CustomEvent('home:page'));
    window.ScrollTrigger?.refresh();
  }

  function show(index, { end = false } = {}) {
    if (turning || index === current || index < 0 || index >= pages.length) return;
    const from = current;
    const swap = () => {
      jump(0);
      current = index;
      render();
      relayout();
      jump(end ? root.scrollHeight - window.innerHeight : 0);
      history.replaceState(null, '', index ? bars[index - 1].getAttribute('href') : location.pathname + location.search);
    };
    // no slide for reduced motion, or where view transitions are not supported
    if (reduced.matches || !document.startViewTransition) { swap(); clearPull(); return; }
    clearTimeout(release);
    const vertical = wide.matches;
    const size = vertical ? bars[0].offsetWidth : bars[0].offsetHeight;
    root.dataset.turn = index > from ? 'forward' : 'back';
    root.style.setProperty('--turn-gutter', `${Math.max(0, window.innerWidth - body.getBoundingClientRect().right)}px`);
    root.dataset.axis = vertical ? 'x' : 'y';
    root.style.setProperty('--turn-distance', `${(vertical ? body.getBoundingClientRect().right : window.innerHeight) - bars.length * size}px`);
    root.style.setProperty('--turn-clip', `${Math.max(from, index) * size}px`);
    turning = true;
    const done = () => { turning = false; delete root.dataset.turn; clearPull(); };
    document.startViewTransition(swap).finished.then(done, done);
  }

  const atTop = () => window.scrollY <= NEAR;
  const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - NEAR;
  const canTurn = (direction) => (direction > 0
    ? current < pages.length - 1 && atBottom()
    : direction < 0 && current > 0 && atTop());

  // How far the page has been pushed past an edge, 0 to 1. Nothing is drawn for it: it only decides when the push has
  // been enough to turn the page.
  const pull = { amount: 0, direction: 0 };
  let release = 0;
  function clearPull() {
    clearTimeout(release);
    pull.amount = 0;
    pull.direction = 0;
  }
  // returns true once the push is enough
  function addPull(direction, share) {
    if (pull.direction !== direction) pull.amount = 0;
    pull.direction = direction;
    pull.amount = Math.min(1, pull.amount + share);
    clearTimeout(release);
    if (pull.amount < 1) release = setTimeout(clearPull, PULL_RELEASE_MS);
    return pull.amount >= 1;
  }
  const turn = (direction) => show(current + direction, { end: direction < 0 });
  // Dialogs and zoomed images scroll by themselves.
  const inOverlay = (target) => Boolean(target.closest?.('.kitchenMenu__overlay, [data-zoom-clone]'));

  // Only pushes made at the edge count. A gesture that begins there counts at once. The one that scrolled to the edge
  // first has some of its travel soaked up, so a hard spin stops at the bottom with the end of the page in view while a
  // wheel kept turning still gets through; fading trackpad momentum never counts.
  // (Registered after utility/lifeStrip.js, which takes the wheel first while the Life strip still has somewhere to go.)
  let lastWheel = 0;
  let lastSize = 0;
  let began = 0; // the direction of the edge this gesture began at, if any
  let absorbed = 0; // wheel travel at an edge soaked up from a gesture that did not begin there
  window.addEventListener('wheel', (event) => {
    if (!paged.matches || event.ctrlKey || inOverlay(event.target)) return;
    if (turning) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const now = event.timeStamp;
    const size = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 33 : 1);
    const direction = Math.sign(event.deltaY);
    const fresh = now - lastWheel > QUIET_MS;
    const pushing = size >= PUSH && size >= lastSize;
    lastWheel = now;
    lastSize = size;
    const vertical = direction !== 0 && Math.abs(event.deltaY) >= Math.abs(event.deltaX);
    if (fresh) {
      began = vertical && canTurn(direction) ? direction : 0;
      absorbed = 0;
    }
    if (!vertical || !canTurn(direction)) {
      if (vertical && pull.amount) clearPull();
      return;
    }
    if (began !== direction) {
      if (!pushing) return;
      absorbed += Math.min(size, PULL_STEP);
      if (absorbed <= PULL_ABSORB) return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (addPull(direction, Math.min(size, PULL_STEP) / PULL_WHEEL)) {
      began = 0;
      absorbed = 0;
      turn(direction);
    }
  }, { passive: false, capture: true });

  let touchStart = null;
  window.addEventListener('touchstart', (event) => {
    touchStart = paged.matches && !turning && event.touches.length === 1 && !inOverlay(event.target)
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, top: canTurn(-1), bottom: canTurn(1) }
      : null;
  }, { passive: true });
  const swipe = (touch) => {
    const dx = touch.clientX - touchStart.x;
    const dy = touchStart.y - touch.clientY;
    const direction = Math.sign(dy);
    const fromEdge = direction > 0 ? touchStart.bottom : touchStart.top;
    return fromEdge && Math.abs(dy) > Math.abs(dx) ? { direction, share: Math.min(1, Math.abs(dy) / PULL_TOUCH) } : null;
  };
  window.addEventListener('touchmove', (event) => {
    if (!touchStart) return;
    const move = swipe(event.touches[0]);
    if (!move) { if (pull.amount) clearPull(); return; }
    pull.amount = 0;
    addPull(move.direction, move.share);
    clearTimeout(release); // the finger is still down
  }, { passive: true });
  window.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const move = swipe(event.changedTouches[0]);
    if (move && move.share >= 1) {
      addPull(move.direction, 1);
      turn(move.direction);
    } else clearPull();
    touchStart = null;
  }, { passive: true });
  window.addEventListener('touchcancel', () => { touchStart = null; clearPull(); }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (!paged.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (inOverlay(event.target) || event.target.closest?.('button, a, input, textarea, select')) return;
    const down = event.key === 'PageDown' || event.key === 'ArrowDown' || (event.key === ' ' && !event.shiftKey);
    const up = event.key === 'PageUp' || event.key === 'ArrowUp' || (event.key === ' ' && event.shiftKey);
    const direction = down ? 1 : up ? -1 : 0;
    if (!canTurn(direction)) return;
    event.preventDefault();
    turn(direction);
  });

  // The bars, and any other link to a chapter, switch pages instead of scrolling (capture: ahead of Lenis anchors).
  const indexOfHash = (hash) => (hash === '#top' ? 0 : pages.findIndex((page) => page.id && `#${page.id}` === hash));
  document.addEventListener('click', (event) => {
    if (!paged.matches || event.button || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = event.target.closest('a[href^="#"]');
    const index = link ? indexOfHash(link.getAttribute('href')) : -1;
    if (index < 0) return;
    event.preventDefault();
    event.stopPropagation();
    show(index);
  }, true);
  window.addEventListener('hashchange', () => {
    const index = indexOfHash(location.hash);
    if (paged.matches && index >= 0 && index !== current) show(index);
  });

  // The long page: the current chapter is the one in the middle of the screen.
  let navFrame = 0;
  const update = () => {
    navFrame = 0;
    if (paged.matches) return;
    const mid = innerHeight * 0.5;
    markBar(pages.slice(1).findIndex((page) => {
      const r = page.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    }));
  };
  const schedule = () => { if (!navFrame) navFrame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  function setMode() {
    body.classList.toggle('is-paged', paged.matches);
    bars.forEach((bar, i) => { bar.style.viewTransitionName = paged.matches ? `chapter-bar-${i}` : ''; });
    if (paged.matches) render();
    relayout();
    schedule();
  }
  paged.addEventListener('change', setMode);
  wide.addEventListener('change', relayout);
  // arriving on a chapter link (the project pages' "Back" goes to /#work)
  current = Math.max(0, indexOfHash(location.hash));
  setMode();
  // the browser's own jump to the #hash would leave the page part-way down
  if (paged.matches && current) window.addEventListener('load', () => jump(0), { once: true });
})();
