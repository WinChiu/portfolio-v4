(function () {
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

  document.documentElement.dataset.projectAnimation = hasGsap
    ? 'gsap'
    : 'fallback';

  if (!hasGsap) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.dataset.projectScrollAnimation = 'gsap';
  }

  function waitForAssetsReady(callback) {
    const loader = document.querySelector('.page-loader');

    if (!loader) {
      callback();
      return;
    }

    window.addEventListener('portfolio:assets-ready', callback, { once: true });
  }

  function setupHeaderIntro() {
    const header = document.querySelector('.project-header');
    if (!header) return;

    const image = header.querySelector('.project-header__image');
    const title = header.querySelector('.project-header__title');
    const metaItems = Array.from(
      header.querySelectorAll('.project-header__meta-item'),
    );
    const targets = [image, title, ...metaItems].filter(Boolean);

    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.72, ease: 'power3.out' },
    });

    if (image) {
      tl.fromTo(
        image,
        { autoAlpha: 0, y: 26, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform,visibility' },
        0,
      );
    }

    if (title) {
      tl.fromTo(
        title,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, clearProps: 'transform,visibility' },
        image ? 0.14 : 0,
      );
    }

    if (metaItems.length) {
      tl.fromTo(
        metaItems,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          clearProps: 'transform,visibility',
        },
        title ? '-=0.42' : 0,
      );
    }

    waitForAssetsReady(() => tl.play(0));
  }

  function setupHeaderParallax() {
    if (!hasScrollTrigger) return;

    const header = document.querySelector('.project-header');
    const bg = document.querySelector('.project-header__bg');
    const image = document.querySelector('.project-header__image');

    if (!header) return;

    if (bg) {
      gsap.to(bg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }

    if (image) {
      gsap.to(image, {
        yPercent: -4,
        scale: 1.035,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }
  }

  function setupContentReveal() {
    if (!hasScrollTrigger) return;

    const sections = Array.from(
      document.querySelectorAll('.project-page__section'),
    );

    sections.forEach((section, index) => {
      const modules = Array.from(section.querySelectorAll('.project-module'));
      const targets = modules.length ? modules : [section];

      gsap.set(targets, { willChange: 'transform, opacity' });

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out',
          stagger: 0.075,
          clearProps: 'transform,visibility,opacity,willChange',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
            refreshPriority: index + 1,
          },
        },
      );
    });
  }

  function setupTocActiveAnimation() {
    const tocLinks = Array.from(document.querySelectorAll('.project-toc'));
    if (!tocLinks.length) return;

    tocLinks.forEach((link) => {
      const label = link.querySelector('.project-toc__label');

      const animateState = () => {
        const isActive = link.classList.contains('project-toc--active');

        gsap.to(label, {
          x: isActive ? 4 : 0,
          duration: 0.22,
          ease: 'power2.out',
        });
      };

      animateState();

      new MutationObserver(animateState).observe(link, {
        attributes: true,
        attributeFilter: ['class'],
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupHeaderIntro();
    setupHeaderParallax();
    setupContentReveal();
    setupTocActiveAnimation();
  });
})();
