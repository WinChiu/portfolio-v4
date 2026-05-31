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
        '[data-animate="hero-copy"]',
        '[data-animate="hero-media"]',
        '[data-animate="fade-up"]',
        '[data-animate="work-card"]',
      ],
      { autoAlpha: 0 },
    );

    gsap.set('[data-animate="hero-copy"]', {
      y: motion.getDistance(28, 18),
      willChange: 'transform, opacity',
    });
    gsap.set('[data-animate="hero-media"]', {
      y: motion.getDistance(24, 16),
      willChange: 'transform, opacity',
    });
    gsap.set('[data-animate="fade-up"], [data-animate="work-card"]', {
      y: motion.getDistance(42, 24),
      willChange: 'transform, opacity',
    });
  }

  function animateHero() {
    const heroItems = document.querySelectorAll('[data-animate="hero-copy"]');
    const heroMedia = document.querySelector('[data-animate="hero-media"]');

    if (motion.isReducedMotion()) {
      motion.revealElements([...heroItems, heroMedia]);
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (heroMedia) {
      timeline.to(heroMedia, { autoAlpha: 1, y: 0, duration: 0.85 }, 0);
    }

    if (heroItems.length) {
      timeline.to(
        heroItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          clearProps: 'willChange',
        },
        heroMedia ? 0.12 : 0,
      );
    }

    if (heroMedia) {
      timeline.set(heroMedia, { clearProps: 'willChange' });
    }
  }

  function initWorkCards() {
    const cards = document.querySelectorAll('[data-animate="work-card"]');
    if (!cards.length) return;

    if (!ScrollTrigger || motion.isReducedMotion()) {
      motion.revealElements(cards);
      return;
    }

    ScrollTrigger.batch(cards, {
      start: 'top 82%',
      once: true,
      onEnter: (batch) => {
        batch.forEach((card, index) => {
          const image = card.querySelector('[data-animate-child="media"]');
          const content = card.querySelectorAll('[data-animate-child="copy"]');
          const delay = index * 0.08;

          gsap
            .timeline({ delay })
            .to(card, { autoAlpha: 1, y: 0, duration: 0.01 })
            .fromTo(
              image,
              { autoAlpha: 0, scale: 0.96 },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'willChange',
              },
              0,
            )
            .fromTo(
              content,
              { autoAlpha: 0, y: motion.getDistance(24, 16) },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                clearProps: 'willChange',
              },
              0.08,
            );
        });
      },
    });
  }

  function initSectionReveals() {
    const elements = document.querySelectorAll('[data-animate="fade-up"]');
    if (!elements.length) return;

    if (!ScrollTrigger || motion.isReducedMotion()) {
      motion.revealElements(elements);
      return;
    }

    ScrollTrigger.batch(elements, {
      start: 'top 84%',
      once: true,
      onEnter: (batch) => motion.revealElements(batch, { stagger: 0.08 }),
    });
  }

  function initParallax() {
    if (!ScrollTrigger || motion.isReducedMotion() || !motion.isDesktop()) {
      return;
    }

    const aboutImage = document.querySelector('[data-parallax="about-avatar"]');
    const kitchenBg = document.querySelector('[data-parallax="kitchen-bg"]');

    if (aboutImage) {
      gsap.to(aboutImage, {
        y: -32,
        ease: 'none',
        scrollTrigger: {
          trigger: '.section--about',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    if (kitchenBg) {
      gsap.to(kitchenBg, {
        y: -48,
        ease: 'none',
        scrollTrigger: {
          trigger: '.section--kitchen',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  function init() {
    setInitialStates();
    motion.onPageReady(() => {
      animateHero();
      initWorkCards();
      initSectionReveals();
      initParallax();
      motion.refreshScrollTrigger();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
