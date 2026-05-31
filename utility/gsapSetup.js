(function () {
  'use strict';

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = window.matchMedia('(min-width: 62.5625rem)');
  const motionStorageKey = 'portfolioMotionPreference';

  function readMotionPreference() {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get('motion');

    if (queryValue === 'full' || queryValue === 'reduce') {
      window.localStorage?.setItem(motionStorageKey, queryValue);
      return queryValue;
    }

    if (queryValue === 'system') {
      window.localStorage?.removeItem(motionStorageKey);
      return 'system';
    }

    return window.localStorage?.getItem(motionStorageKey) || 'system';
  }

  function hasGSAP() {
    return Boolean(window.gsap);
  }

  function isReducedMotion() {
    const preference = readMotionPreference();

    if (preference === 'full') return false;
    if (preference === 'reduce') return true;

    return motionQuery.matches;
  }

  function isDesktop() {
    return desktopQuery.matches;
  }

  function getDistance(desktopDistance, mobileDistance) {
    return isDesktop() ? desktopDistance : mobileDistance;
  }

  function refreshScrollTrigger() {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  function onPageReady(callback) {
    if (window.__portfolioPageReady) {
      callback();
      return;
    }

    window.addEventListener('portfolio:page-ready', callback, { once: true });
  }

  function revealElements(elements, options = {}) {
    if (!hasGSAP()) return;

    const targets = Array.from(elements).filter(Boolean);
    if (!targets.length) return;

    if (isReducedMotion()) {
      window.gsap.set(targets, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clearProps: 'willChange',
      });
      return;
    }

    window.gsap.to(targets, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: options.duration ?? 0.7,
      ease: options.ease || 'power2.out',
      stagger: options.stagger ?? 0.08,
      clearProps: options.clearProps || 'willChange',
    });
  }

  if (hasGSAP()) {
    document.documentElement.classList.add('motion-enabled');

    if (isReducedMotion()) {
      document.documentElement.classList.add('motion-reduce');
    } else {
      document.documentElement.classList.remove('motion-reduce');
    }

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    window.gsap.defaults({
      duration: 0.7,
      ease: 'power2.out',
    });
  }

  window.PortfolioMotion = {
    hasGSAP,
    isReducedMotion,
    isDesktop,
    getDistance,
    onPageReady,
    refreshScrollTrigger,
    revealElements,
  };
})();
