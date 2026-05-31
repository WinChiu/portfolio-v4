(function () {
  'use strict';

  const motion = window.PortfolioMotion;

  if (!motion || !motion.hasGSAP()) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  function setInitialStates() {
    if (motion.isReducedMotion()) return;

    gsap.set(
      [
        '[data-animate="project-header-media"]',
        '[data-animate="project-header-copy"]',
        '[data-animate="project-module"]',
      ],
      {
        autoAlpha: 0,
        y: motion.getDistance(36, 20),
        willChange: 'transform, opacity',
      },
    );

    gsap.set('[data-animate="project-line"]', {
      scaleX: 0,
      transformOrigin: 'left center',
      willChange: 'transform',
    });
  }

  function animateHeader() {
    const media = document.querySelector('[data-animate="project-header-media"]');
    const copy = document.querySelector('[data-animate="project-header-copy"]');

    if (motion.isReducedMotion()) {
      motion.revealElements([media, copy]);
      return;
    }

    gsap
      .timeline()
      .to(media, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        clearProps: 'willChange',
      })
      .to(
        copy,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          clearProps: 'willChange',
        },
        0.12,
      );
  }

  function initHeaderParallax() {
    const bg = document.querySelector('[data-parallax="project-header-bg"]');

    if (!bg || !ScrollTrigger || motion.isReducedMotion() || !motion.isDesktop()) {
      return;
    }

    gsap.to(bg, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.project-header',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  function initModuleReveals() {
    const modules = document.querySelectorAll('[data-animate="project-module"]');

    if (!modules.length) return;

    if (!ScrollTrigger || motion.isReducedMotion()) {
      motion.revealElements(modules);
      gsap.set('[data-animate="project-line"]', { scaleX: 1 });
      return;
    }

    ScrollTrigger.batch(modules, {
      start: 'top 84%',
      once: true,
      onEnter: (batch) => {
        batch.forEach((module, index) => {
          const line = module.querySelector('[data-animate="project-line"]');
          const processSteps = module.querySelectorAll(
            '[data-animate-child="process-step"]',
          );
          const image = module.matches(
            '.project-module--image, .project-module--image-pair',
          )
            ? module.querySelectorAll('img')
            : [];
          const timeline = gsap.timeline({ delay: index * 0.04 });

          timeline.to(module, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            clearProps: 'willChange',
          });

          if (line) {
            timeline.to(
              line,
              {
                scaleX: 1,
                duration: 0.65,
                ease: 'power3.out',
                clearProps: 'willChange',
              },
              0.08,
            );
          }

          if (image.length) {
            timeline.fromTo(
              image,
              { autoAlpha: 0, y: motion.getDistance(18, 10), scale: 0.98 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.08,
                clearProps: 'willChange',
              },
              0.04,
            );
          }

          if (processSteps.length) {
            timeline.fromTo(
              processSteps,
              { autoAlpha: 0, y: motion.getDistance(24, 14) },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.08,
                clearProps: 'willChange',
              },
              0.1,
            );
          }
        });
      },
    });
  }

  function init() {
    setInitialStates();
    motion.onPageReady(() => {
      animateHeader();
      initHeaderParallax();
      initModuleReveals();
      motion.refreshScrollTrigger();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
