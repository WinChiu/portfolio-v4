// Site-wide smooth scroll via Lenis, driven off GSAP's own ticker so every
// ScrollTrigger-based reveal elsewhere on the site (kitchen, project cards,
// project pages, ...) keeps tracking the real scroll position.
// https://lenis.darkroom.engineering/ -- GSAP ScrollTrigger integration.
(function () {
  const gsap = window.gsap;
  const LenisCtor = window.Lenis;
  if (!gsap || !LenisCtor) return;

  // Kitchen's menu and Life's photo stack are both infinite/looping widgets
  // -- unlike a normal nested-scroll region, they have no edge to reach and
  // hand control back at, so they always want every wheel event the instant
  // the cursor is over them. Left unconditional, that means: scroll down
  // from the section above with the cursor resting anywhere over that (very
  // large) area, and the moment a wheel tick lands, the page's smooth glide
  // cuts out mid-motion and gets swapped for the widget's own inertia --
  // a jolt, even though the visitor was just passing through.
  //
  // The fix is to only let a widget claim the wheel once its section has
  // actually arrived (fills the viewport) -- while merely passing through,
  // wheel events fall through to Lenis like anywhere else on the page.
  // kitchenFanAnimation.js / lifeStackAnimation.js call this same function
  // before deciding whether to preventDefault(), so both sides agree on the
  // handoff point instead of one silently disagreeing with the other.
  function isScrollSectionEngaged(section, tolerance = 4) {
    if (!section) return true; // fail open -- never create a dead zone
    const rect = section.getBoundingClientRect();
    return rect.top <= tolerance && rect.bottom >= window.innerHeight - tolerance;
  }
  window.isScrollSectionEngaged = isScrollSectionEngaged;

  const lenis = new LenisCtor({
    // See isScrollSectionEngaged above -- Lenis only steps back for these
    // widgets once their section has actually arrived; while the visitor is
    // merely scrolling past, Lenis keeps driving the page as normal.
    prevent: (node) => {
      if (!node.closest) return false;
      const stage = node.closest('.kitchenFan__stage');
      if (stage) {
        return isScrollSectionEngaged(stage.closest('.section--kitchenFan'));
      }
      const stack = node.closest('.life__stack');
      if (stack) {
        return isScrollSectionEngaged(stack.closest('.section--life'));
      }
      return false;
    },
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
    lenis.on('scroll', ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // gsap.ticker time is seconds; Lenis wants ms
  });
  gsap.ticker.lagSmoothing(0);
})();
