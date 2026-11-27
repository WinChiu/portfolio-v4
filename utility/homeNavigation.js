// Chapter navigation.
//
// The hero and each chapter are separate pages, one shown at a time. Scrolling or swiping past the bottom of a page
// turns to the next one (past the top, back to the previous one): the page and its bar slide across by themselves, so a
// bar ends up on the side reached or the side ahead and never rests in between. Over 1024px the bars are vertical (left
// and right), below that horizontal (top and bottom). Very short narrow screens keep one long page instead, with the
// bars stacked by CSS; there this only marks the current one (aria-current).
(() => {
  const bars = [...document.querySelectorAll('.chapter-bar')];
  const pages = [document.querySelector('.hero'), ...bars.map((bar) => document.querySelector(bar.getAttribute('href')))];
  if (!bars.length || pages.some((page) => !page)) return;

  const body = document.body;
  const wide = matchMedia('(min-width: 64.0625rem)'); // vertical bars
  const paged = matchMedia('(min-width: 64.0625rem), (min-height: 30.0625rem)');
  const QUIET_MS = 220; // a pause this long ends a wheel gesture (trackpad momentum keeps sending events)
  const TURN_GAP_MS = 900; // at least this long between two turns, so a short page is not skipped over
  const PUSH = 40; // smaller wheel steps are the tail of a fading gesture
  const SWIPE = 60;
  const DWELL_MS = 400; // how long a page must rest at its edge before it can be turned, so its end gets seen
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
      reachedAt[1] = reachedAt[-1] = null;
      track();
      history.replaceState(null, '', index ? bars[index - 1].getAttribute('href') : location.pathname + location.search);
    };
    // no slide for reduced motion, or where view transitions are not supported
    if (reduced.matches || !document.startViewTransition) { swap(); return; }
    const vertical = wide.matches;
    const size = vertical ? bars[0].offsetWidth : bars[0].offsetHeight;
    root.dataset.turn = index > from ? 'forward' : 'back';
    root.style.setProperty('--turn-gutter', `${Math.max(0, window.innerWidth - body.getBoundingClientRect().right)}px`);
    root.dataset.axis = vertical ? 'x' : 'y';
    root.style.setProperty('--turn-distance', `${(vertical ? body.getBoundingClientRect().right : window.innerHeight) - bars.length * size}px`);
    root.style.setProperty('--turn-clip', `${Math.max(from, index) * size}px`);
    turning = true;
    const done = () => { turning = false; delete root.dataset.turn; };
    document.startViewTransition(swap).finished.then(done, done);
  }

  // The edge counts once the page has actually arrived there and stayed a moment: a hard scroll that runs into the
  // bottom does not carry straight on to the next page before the last of this one has been seen.
  const atTop = () => window.scrollY <= 1;
  const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const reachedAt = { 1: null, '-1': null }; // when the bottom (1) and top (-1) were reached
  function track() {
    const now = performance.now();
    reachedAt[1] = atBottom() ? reachedAt[1] ?? now : null;
    reachedAt[-1] = atTop() ? reachedAt[-1] ?? now : null;
  }
  const rested = (direction) => reachedAt[direction] !== null && performance.now() - reachedAt[direction] >= DWELL_MS;
  window.addEventListener('scroll', track, { passive: true });
  const canTurn = (direction) => {
    track();
    if (direction > 0) return current < pages.length - 1 && rested(1);
    return direction < 0 && current > 0 && rested(-1);
  };
  const turn = (direction) => show(current + direction, { end: direction < 0 });
  // Dialogs and zoomed images scroll by themselves.
  const inOverlay = (target) => Boolean(target.closest?.('.kitchenMenu__overlay, [data-zoom-clone]'));

  // A page turns on a wheel push past an edge it has rested at: a new gesture, or one that is still being pushed. Trackpad
  // momentum fades out, so it does not count as a push and scrolling down to the bottom never carries on into the next
  // page. Scrolling is only held while a page is sliding. (Registered after utility/lifeStrip.js, which takes the wheel
  // first while the Life strip still has somewhere to go.)
  let lastWheel = 0;
  let lastSize = 0;
  let turnedAt = -TURN_GAP_MS;
  let spent = false; // the gesture has turned a page and what is left of it is fading
  window.addEventListener('wheel', (event) => {
    if (!paged.matches || event.ctrlKey || inOverlay(event.target)) return;
    const now = event.timeStamp;
    const size = Math.abs(event.deltaY);
    const direction = Math.sign(event.deltaY);
    const fresh = now - lastWheel > QUIET_MS;
    const pushing = size >= PUSH && size >= lastSize;
    lastWheel = now;
    lastSize = size;
    // after a turn, a pause or a wheel that is still being pushed frees the gesture to scroll the new page
    if (spent && !turning && (fresh || pushing)) spent = false;

    const vertical = direction !== 0 && size >= Math.abs(event.deltaX);
    const starts = vertical && !turning && !spent && (fresh || (pushing && now - turnedAt > TURN_GAP_MS))
      && canTurn(direction);
    if (!spent && !turning && !starts) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (starts) {
      spent = true;
      turnedAt = now;
      turn(direction);
    }
  }, { passive: false, capture: true });

  let touchStart = null;
  window.addEventListener('touchstart', (event) => {
    touchStart = paged.matches && event.touches.length === 1 && !inOverlay(event.target)
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, top: canTurn(-1), bottom: canTurn(1) }
      : null;
  }, { passive: true });
  window.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = touchStart.y - event.changedTouches[0].clientY;
    const direction = Math.sign(dy);
    const fromEdge = direction > 0 ? touchStart.bottom : touchStart.top;
    if (Math.abs(dy) > SWIPE && Math.abs(dy) > Math.abs(dx) && fromEdge) turn(direction);
    touchStart = null;
  }, { passive: true });

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
  track();
  // the browser's own jump to the #hash would leave the page part-way down
  if (paged.matches && current) window.addEventListener('load', () => jump(0), { once: true });
})();
