(function () {
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

  document.documentElement.dataset.homeAnimation = hasGsap ? 'gsap' : 'fallback';

  function getVisibleProjectCards() {
    return Array.from(
      document.querySelectorAll('.section--work .container--content'),
    ).filter((card) => !card.classList.contains('workHide'));
  }

  function setCardsVisibility(cards, isVisible) {
    cards.forEach((card) => {
      card.classList.toggle('workHide', !isVisible);
      card.setAttribute('aria-hidden', String(!isVisible));
    });
  }

  function setupWorkSwitcher() {
    const designButton = document.querySelector('.block__design');
    const codingButton = document.querySelector('.block__coding');
    const designBlocks = Array.from(
      document.querySelectorAll('[data-type="design"]'),
    );
    const codeBlocks = Array.from(
      document.querySelectorAll('[data-type="code"]'),
    );

    if (!designButton || !codingButton) return;

    function switchWorkView(nextType) {
      const isDesign = nextType === 'design';
      const currentBlocks = isDesign ? codeBlocks : designBlocks;
      const nextBlocks = isDesign ? designBlocks : codeBlocks;

      designButton.classList.toggle('selected', isDesign);
      codingButton.classList.toggle('selected', !isDesign);

      if (!hasGsap) {
        setCardsVisibility(currentBlocks, false);
        setCardsVisibility(nextBlocks, true);
        return;
      }

      window.gsap.killTweensOf([...currentBlocks, ...nextBlocks]);

      window.gsap.to(currentBlocks, {
        autoAlpha: 0,
        y: 18,
        duration: 0.22,
        ease: 'power2.in',
        stagger: 0.035,
        onComplete: () => {
          setCardsVisibility(currentBlocks, false);
          setCardsVisibility(nextBlocks, true);

          window.gsap.fromTo(
            nextBlocks,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              ease: 'power3.out',
              stagger: 0.08,
              clearProps: 'transform,visibility,opacity',
              onComplete: () => {
                if (hasScrollTrigger) {
                  window.ScrollTrigger.refresh();
                }
              },
            },
          );
        },
      });
    }

    designButton.addEventListener('click', () => switchWorkView('design'));
    codingButton.addEventListener('click', () => switchWorkView('code'));
  }

  function setupHeroAnimation() {
    const hero = document.querySelector('.section--main');
    if (!hero) return;

    const avatar = hero.querySelector('.media--image');
    const heroItems = [
      hero.querySelector('#hero-eyebrow'),
      hero.querySelector('#greet'),
      hero.querySelector('#intro'),
      hero.querySelector('#annotation'),
    ].filter(Boolean);

    if (!hasGsap) {
      [avatar, ...heroItems].filter(Boolean).forEach((element) => {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
      });
      return;
    }

    const tl = window.gsap.timeline({
      paused: true,
      defaults: { duration: 0.72, ease: 'power3.out' },
    });

    if (avatar) {
      tl.fromTo(
        avatar,
        { autoAlpha: 0, y: 24, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform,visibility' },
        0,
      );
    }

    tl.fromTo(
      heroItems,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.12,
        clearProps: 'transform,visibility',
      },
      avatar ? 0.18 : 0,
    );

    const loader = document.querySelector('.loading-mask');
    if (loader) {
      window.addEventListener('portfolio:assets-ready', () => tl.play(0), {
        once: true,
      });
      return;
    }

    tl.play(0);
  }

  function setupProjectCardReveal() {
    if (!hasGsap || !hasScrollTrigger) {
      document.documentElement.dataset.homeScrollAnimation = 'fallback';
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.dataset.homeScrollAnimation = 'gsap';

    getVisibleProjectCards().forEach((card, index) => {
      const cover = card.querySelector('.media--workCover');
      const content = card.querySelector('.block--introduction');
      const targets = [cover, content].filter(Boolean);

      if (!targets.length) return;

      window.gsap.set(targets, { willChange: 'transform, opacity' });

      window.gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          y: (itemIndex) => (itemIndex === 0 ? 48 : 32),
          scale: (itemIndex) => (itemIndex === 0 ? 0.985 : 1),
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform,visibility,opacity,willChange',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            once: true,
            refreshPriority: index,
          },
        },
      );
    });
  }

  function setupKitchenReveal() {
    if (!hasGsap || !hasScrollTrigger) return;

    const kitchen = document.querySelector('.section--kitchen');
    if (!kitchen) return;

    window.gsap.fromTo(
      [
        kitchen.querySelector('.kitchen__intro'),
        kitchen.querySelector('.kitchen__panel'),
      ].filter(Boolean),
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,visibility,opacity',
        scrollTrigger: {
          trigger: kitchen,
          start: 'top 78%',
          once: true,
        },
      },
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupWorkSwitcher();
    setupHeroAnimation();
    setupProjectCardReveal();
    setupKitchenReveal();
  });
})();
