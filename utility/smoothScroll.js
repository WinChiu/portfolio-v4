// Site-wide smooth scroll via Lenis, driven off GSAP's own ticker so every
// ScrollTrigger-based reveal elsewhere on the site (kitchen, project cards,
// project pages, ...) keeps tracking the real scroll position.
// https://lenis.darkroom.engineering/ -- GSAP ScrollTrigger integration.
(function () {
  const gsap = window.gsap;
  const LenisCtor = window.Lenis;
  if (!gsap || !LenisCtor) return;

  const lenis = new LenisCtor({
    // .kitchenFan__stage (utility/kitchenFanAnimation.js) and .life__stack
    // (utility/lifeStackAnimation.js) already run their own custom
    // wheel-driven inertia/scroll logic and call preventDefault() on their
    // own wheel events. If Lenis also grabbed those same events to
    // smooth-scroll the page underneath, the two would fight over one
    // gesture -- so Lenis is told to leave anything inside them alone.
    prevent: (node) =>
      Boolean(
        node.closest &&
          (node.closest('.kitchenFan__stage') || node.closest('.life__stack')),
      ),
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
