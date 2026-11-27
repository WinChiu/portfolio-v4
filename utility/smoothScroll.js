// Site-wide smooth scroll via Lenis, driven off GSAP's own ticker so every
// ScrollTrigger-based reveal elsewhere on the site (kitchen, project cards,
// project pages, ...) keeps tracking the real scroll position.
// https://lenis.darkroom.engineering/ -- GSAP ScrollTrigger integration.

// No scrolling while the loading screen (utility/loadingPage.js) is up: wheel, swipe and scroll keys are stopped here.
// This script runs first (in <head>), so nothing else -- smooth scroll, page turns -- gets to see them.
(function () {
  const KEYS = [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
  const TYPES = ['wheel', 'touchstart', 'touchmove', 'touchend', 'keydown'];
  const loading = () => Boolean(document.querySelector('.loading-mask:not(.is-hidden), .page-loader:not(.is-hidden)'));
  function block(event) {
    if (!loading() || (event.type === 'keydown' && !KEYS.includes(event.key))) return;
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation();
  }
  const options = { capture: true, passive: false };
  TYPES.forEach((type) => window.addEventListener(type, block, options));
  const unlock = () => TYPES.forEach((type) => window.removeEventListener(type, block, options));
  window.addEventListener('portfolio:assets-ready', () => {
    // the curtain is still lifting when this fires
    const timer = setInterval(() => { if (!loading()) { clearInterval(timer); unlock(); } }, 100);
  }, { once: true });
  // a loader that fails must never leave the page stuck
  setTimeout(unlock, 15000);
})();

(function () {
  const gsap = window.gsap;
  const LenisCtor = window.Lenis;
  if (!gsap || !LenisCtor) return;

  const lenis = new LenisCtor({
    // Lenis owning the scroll means the browser's native `scroll-behavior:
    // smooth` (style/home/_globals.scss) can no longer be trusted to
    // animate an anchor jump on its own -- Lenis's rAF loop is also writing
    // to the scroll position every frame, and the two fighting over it is
    // what made anchor clicks (nav links AND the in-copy "cooking" link
    // alike) start landing instantly instead of sliding. `anchors: true` is
    // Lenis's own built-in handling for every `<a href="#...">` on the
    // page, so it's the one thing actually driving the scroll instead of
    // fighting the CSS for it.
    anchors: true,
    // respectReducedMotion (default true) makes scrollTo -- including the
    // anchors handling above -- jump instantly for anyone with the OS
    // "reduce motion" setting on. Turned off deliberately: this site wants
    // the slide effect for every visitor, not just when that preference
    // happens to be off.
    respectReducedMotion: false,
  });

  // Exposed so other scripts can drive Lenis directly if they need to.
  window.lenis = lenis;

  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) {
    // Phone browser bars showing/hiding resize the viewport; that must not re-measure the whole page.
    ScrollTrigger.config({ ignoreMobileResize: true });
    lenis.on('scroll', ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // gsap.ticker time is seconds; Lenis wants ms
  });
  gsap.ticker.lagSmoothing(0);
})();
