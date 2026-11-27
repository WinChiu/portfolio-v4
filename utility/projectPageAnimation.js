// Project page entrance animations, in the same language as the home page (utility/landingPageAnimation.js).
//
// A shared, editorial base: titles rise from behind a mask, section numbers roll up like a counter, copy fades up
// lightly, and pictures are laid down (and lifted off their shadow if they have one). Signature moves: pictures shown
// side by side are dealt in like cards, goal and list icons pop one by one, quotes are written out left to right,
// problem and summary points are ruled off in turn, and the summary's outcome is laid on the page like a sheet.
// Every move plays once, when it first comes into view. With reduced motion everything is simply there.
(function () {
  const gsap = window.gsap;

  document.documentElement.dataset.projectAnimation = gsap ? 'gsap' : 'fallback';

  if (window.lenis) window.lenis.options.respectReducedMotion = true;

  if (!gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function duration(name) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--sys-motion-duration-${name}`).trim();
    return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
  }

  const list = (targets) => Array.from(targets && targets.length !== undefined ? targets : [targets]).filter(Boolean);

  // ---------------------------------------------------------------- moves
  function fade(tl, targets, at, { y = 12, stagger = duration('stagger'), time = duration('slow') } = {}) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, stagger, duration: time, ease: 'power2.out', clearProps: 'transform' }, at);
    }
  }

  function rise(tl, targets, at) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { clipPath: 'inset(0% -5% 100% -5%)', yPercent: 55 },
        { clipPath: 'inset(-20% -5% -30% -5%)', yPercent: 0, duration: duration('long'), ease: 'power3.out', clearProps: 'clipPath,transform' }, at);
    }
  }

  function wipe(tl, targets, at, { time = duration('long'), stagger = 0 } = {}) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { clipPath: 'inset(-8% 100% -8% -2%)' },
        { clipPath: 'inset(-8% -2% -8% -2%)', duration: time, stagger, ease: 'power3.inOut', clearProps: 'clipPath' }, at);
    }
  }

  function roll(tl, number, at) {
    if (!number) return;
    tl.fromTo(number, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 60 },
      { clipPath: 'inset(-10% 0% -10% 0%)', yPercent: 0, duration: duration('long'), ease: 'back.out(1.6)', clearProps: 'clipPath,transform' }, at);
  }

  function layAndLift(tl, element, at = 0) {
    if (!element) return;
    const shadow = getComputedStyle(element).boxShadow;
    const offset = /(-?[\d.]+)px (-?[\d.]+)px/.exec(shadow);
    const [x, y] = offset ? [Number(offset[1]), Number(offset[2])] : [0, 0];
    const flat = offset ? shadow.replace(offset[0], '0px 0px') : 'none';
    tl.fromTo(element, { autoAlpha: 0, x, y: y - 24, scale: 1.03, ...(offset && { boxShadow: flat }) },
      { autoAlpha: 1, x, y, scale: 1, duration: duration('long'), ease: 'power3.out', ...(!offset && { clearProps: 'transform' }) }, at);
    if (offset) {
      tl.to(element, { x: 0, y: 0, boxShadow: shadow, duration: duration('slow'), ease: 'power2.out', clearProps: 'transform,boxShadow' }, at + duration('long'));
    }
  }

  // pictures shown together arrive from the right one after another, each settling from a slight turn
  function deal(tl, images, at) {
    tl.fromTo(images, { autoAlpha: 0, x: 80, rotation: 5 },
      { autoAlpha: 1, x: 0, rotation: 0, duration: duration('curtain'), stagger: duration('stagger') * 2.5, ease: 'power3.out', clearProps: 'transform' }, at);
  }

  function pop(tl, icons, at) {
    if (!icons.length) return;
    tl.fromTo(icons, { scale: 0, transformOrigin: '50% 100%' },
      { scale: 1, duration: duration('slow'), stagger: duration('stagger') * 2.5, ease: 'back.out(2.2)', clearProps: 'transform,transformOrigin' }, at);
  }

  // ---------------------------------------------------------------- what each kind of block does
  const PICTURES = 'img.ui-zoomable-media, video';
  const ICONS = '.goal-icon, .project-module__icon, .big-quote > img';

  // one block of a section: it fades up as a whole, and whatever is special inside it makes its own move
  function block(tl, element) {
    if (element.matches('h2')) { rise(tl, element, 0); return; }
    const quotes = element.matches('.ui-quote, .big-quote') ? [element] : Array.from(element.querySelectorAll('.ui-quote, .big-quote h3'));
    const points = Array.from(element.querySelectorAll('.callout'));
    const pictures = element.matches(PICTURES) ? [element] : Array.from(element.querySelectorAll(PICTURES));
    const alone = element.matches(PICTURES);
    if (!alone) fade(tl, element, 0);
    if (pictures.length > 1) deal(tl, pictures, duration('stagger'));
    else pictures.forEach((picture) => layAndLift(tl, picture, duration('stagger')));
    pop(tl, Array.from(element.querySelectorAll(ICONS)), duration('fast'));
    wipe(tl, quotes, duration('fast'), { time: duration('curtain') });
    wipe(tl, points, duration('fast'), { stagger: duration('stagger') * 3 });
  }

  function summary(tl, slide) {
    fade(tl, slide.querySelector('.summary__label'), 0);
    rise(tl, slide.querySelector('h2'), duration('stagger'));
    const points = Array.from(slide.querySelectorAll('.summary__point'));
    const outcome = points.pop();
    wipe(tl, points, duration('fast'), { stagger: duration('stagger') * 3 });
    layAndLift(tl, outcome, duration('slow'));
  }

  // ---------------------------------------------------------------- when they play
  function setup() {
    const units = new Map(); // watched element -> its timeline

    function unit(element, build) {
      if (!element) return;
      const tl = gsap.timeline({ paused: true });
      build(tl, element);
      units.set(element, tl);
      element.addEventListener('focusin', () => tl.progress(1), { once: true });
    }

    unit(document.querySelector('.project-header'), (tl, header) => {
      rise(tl, header.querySelector('.project-header__title'), 0);
      fade(tl, header.querySelectorAll('.p-facts__line > span'), duration('fast'), { stagger: duration('stagger') * 2 });
      fade(tl, header.querySelectorAll('.p-scope__list li'), duration('slow'), { stagger: duration('stagger') * 1.5 });
    });

    document.querySelectorAll('.sec--summary').forEach((slide) => unit(slide, summary));

    document.querySelectorAll('.project-page__section').forEach((section) => {
      if (section.matches('.sec--summary')) return;
      unit(section.querySelector('.sec__num'), (tl, number) => roll(tl, number, 0));
      const content = section.querySelector('.sec__content') || section.querySelector('.sec--dark') || section;
      Array.from(content.children)
        .filter((child) => !child.matches('.sec__num, .sec__grid, script, style'))
        .forEach((child) => {
          const items = child.querySelectorAll('.project-module__item');
          if (items.length > 1) items.forEach((item) => unit(item, block));
          else unit(child, block);
        });
    });

    unit(document.querySelector('.next'), (tl, next) => {
      fade(tl, next.querySelector('.mono'), 0);
      rise(tl, next.querySelector('.p-title'), duration('stagger') * 2);
    });

    // Positions are checked directly on scroll. An IntersectionObserver will not do: several of these elements start
    // fully clipped (that is the move), and a clipped element never counts as in view, so it would stay blank.
    const pending = new Map(units);
    let frame = 0;
    const check = () => {
      frame = 0;
      pending.forEach((tl, element) => {
        const box = element.getBoundingClientRect();
        if (!box.height && !box.width) return; // not laid out
        // also true for what has already been scrolled past (a jump from the index)
        if (box.top < window.innerHeight - 48) {
          pending.delete(element);
          tl.play();
        }
      });
    };
    const schedule = () => { if (!frame && pending.size) frame = requestAnimationFrame(check); };

    // nothing starts behind the loading screen
    const start = () => {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      window.lenis?.on('scroll', schedule);
      if (window.ResizeObserver) new ResizeObserver(schedule).observe(document.body); // images arriving move things
      schedule();
    };
    if (document.querySelector('.page-loader:not(.is-hidden)')) {
      window.addEventListener('portfolio:assets-ready', start, { once: true });
    } else start();
  }

  document.addEventListener('DOMContentLoaded', setup);
})();

// The section number shares a baseline with the chapter title's LAST line. CSS grid can only align the first line
// (the title sits inside the content column), so measure how far a wrapped title runs and hand that to the number.
(function () {
  const apply = (title) => {
    const number = title.closest('.sec__grid')?.querySelector('.sec__num');
    if (!number) return;
    const extra = title.offsetHeight - parseFloat(getComputedStyle(title).lineHeight);
    number.style.setProperty('--title-extra', `${Math.max(0, Math.round(extra))}px`);
  };
  const titles = document.querySelectorAll('.sec__content > h2');
  const observer = new ResizeObserver((entries) => entries.forEach((entry) => apply(entry.target)));
  titles.forEach((title) => observer.observe(title));
})();

// The "Next project" block fills with its colour on reaching the end of the page, as it does under the mouse.
(function () {
  const next = document.querySelector('.next');
  if (!next) return;
  let frame = 0;
  const update = () => {
    frame = 0;
    next.classList.toggle('is-reached', window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.lenis?.on('scroll', schedule);
})();
