// Home entrance animations, designed for pages that slide in (utility/homeNavigation.js).
//
// A shared, editorial base: chapter titles rise from behind a mask, lines draw, body copy stays put or fades lightly,
// and pictures are laid down and then lifted off their shadow. Each chapter adds one signature move: the hero portrait drops onto the table, the Work
// numbers roll up, Kitchen flames light one by one, Life photos are
// dealt in like cards. Every move plays once, when its part of the page first comes into view; while a page is sliding,
// it starts part-way through the slide. With reduced motion everything is simply there.
(function () {
  const gsap = window.gsap;
  document.documentElement.dataset.homeAnimation = gsap ? 'gsap' : 'fallback';

  function duration(name) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--sys-motion-duration-${name}`).trim();
    return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
  }

  function setupWorkSwitcher() {
    const buttons = Array.from(document.querySelectorAll('.block--switcher button'));
    const cards = Array.from(document.querySelectorAll('.section--work [data-type]'));
    // the last card on show leaves its line to the next chapter
    const markLast = () => {
      const shown = cards.filter((card) => !card.classList.contains('workHide'));
      cards.forEach((card) => card.classList.toggle('is-last-visible', card === shown[shown.length - 1]));
    };
    markLast();
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        const type = button.classList.contains('block__design') ? 'design' : 'code';
        buttons.forEach((item) => {
          const selected = item === button;
          item.classList.toggle('selected', selected);
          item.classList.toggle('is-selected', selected);
          item.classList.toggle('is-on', selected);
          item.setAttribute('aria-pressed', String(selected));
        });
        cards.forEach((card) => {
          const hidden = card.dataset.type !== type;
          card.classList.toggle('workHide', hidden);
          card.setAttribute('aria-hidden', String(hidden));
        });
        markLast();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
    buttons.forEach((button, index) => button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].click();
      buttons[next].focus();
    }));
  }

  // ---------------------------------------------------------------- shared moves
  const list = (targets) => Array.from(targets && targets.length !== undefined ? targets : [targets]).filter(Boolean);

  function fade(tl, targets, at, { y = 10, stagger = duration('stagger'), time = duration('slow') } = {}) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, stagger, duration: time, ease: 'power2.out', clearProps: 'transform' }, at);
    }
  }

  // a title rising from behind a mask (the final inset is generous, so descenders are never cut)
  function rise(tl, targets, at) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { clipPath: 'inset(0% -5% 100% -5%)', yPercent: 55 },
        { clipPath: 'inset(-20% -5% -30% -5%)', yPercent: 0, duration: duration('long'), ease: 'power3.out', clearProps: 'clipPath,transform' }, at);
    }
  }

  // uncovered from left to right, with room for an offset shadow
  function wipe(tl, targets, at, { time = duration('long'), stagger = 0 } = {}) {
    const items = list(targets);
    if (items.length) {
      tl.fromTo(items, { clipPath: 'inset(-24px 100% -24px -24px)' },
        { clipPath: 'inset(-24px -24px -24px -24px)', duration: time, stagger, ease: 'power3.inOut', clearProps: 'clipPath' }, at);
    }
  }

  // A picture is laid down, then picked up a little: it moves up and to the left while its solid shadow opens by the
  // same amount, so the shadow stays where the picture lay. `element` is whatever carries the shadow; one without a
  // shadow is only laid down.
  function layAndLift(tl, element, at = 0) {
    if (!element) return;
    const shadow = getComputedStyle(element).boxShadow;
    const offset = /(-?[\d.]+)px (-?[\d.]+)px/.exec(shadow);
    const [x, y] = offset ? [Number(offset[1]), Number(offset[2])] : [0, 0];
    const flat = offset ? shadow.replace(offset[0], '0px 0px') : 'none';
    tl.fromTo(element, { autoAlpha: 0, x, y: y - 28, scale: 1.04, ...(offset && { boxShadow: flat }) },
      { autoAlpha: 1, x, y, scale: 1, duration: duration('long'), ease: 'power3.out' }, at);
    const lift = { x: 0, y: 0, duration: duration('slow'), ease: 'power2.out', clearProps: offset ? 'transform,boxShadow' : 'transform' };
    if (offset) lift.boxShadow = shadow;
    tl.to(element, lift, at + duration('long'));
  }

  // ---------------------------------------------------------------- hero
  function typeIn(tl, element, at, splits) {
    if (!element || !window.SplitText) return at;
    const split = window.SplitText.create(element, { type: 'words,chars', smartWrap: true, charsClass: 'split-char', wordsClass: 'split-word' });
    splits.push(split);
    const step = duration('stagger') * 1.2;
    gsap.set(split.chars, { visibility: 'hidden' });
    split.chars.forEach((char, index) => {
      tl.set(char, { visibility: 'visible' }, at + index * step);
      tl.call(() => {
        if (index) split.chars[index - 1].classList.remove('is-typing-char');
        char.classList.add('is-typing-char');
      }, [], at + index * step);
    });
    const end = at + split.chars.length * step;
    tl.call(() => split.chars.forEach((char) => char.classList.remove('is-typing-char')), [], end);
    return end;
  }

  // The portrait falls onto the table, using the same height, shadow and light as when it is thrown
  // (utility/heroPortrait.js drives these properties during a drag).
  function dropPortrait(tl, card, at) {
    const props = ['--dy', '--lift', '--shadow-x', '--shadow-y'];
    const tilt = (5 * Math.PI) / 180;
    const fall = { z: 1.6 };
    const clear = () => {
      props.forEach((name) => card.style.removeProperty(name));
      card.classList.remove('is-up');
    };
    const paint = () => {
      const offset = 16 * fall.z;
      card.style.setProperty('--dy', `${-34 * fall.z}px`);
      card.style.setProperty('--lift', fall.z.toFixed(3));
      card.style.setProperty('--shadow-x', `${offset * (Math.cos(tilt) + Math.sin(tilt))}px`);
      card.style.setProperty('--shadow-y', `${offset * (Math.cos(tilt) - Math.sin(tilt))}px`);
      card.classList.toggle('is-up', fall.z > 0.01);
    };
    tl.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration('fast') }, at);
    const drop = gsap.to(fall, { z: 0, duration: duration('long'), ease: 'power2.in', onStart: paint, onUpdate: paint, onComplete: clear });
    tl.add(drop, at);
    // picking it up mid-fall hands it over to the drag
    card.addEventListener('pointerdown', () => { if (drop.progress() < 1) { drop.kill(); clear(); } });
  }

  function hero(tl, root, splits) {
    const card = root.querySelector('.photo-card--portrait');
    const hint = root.querySelector('.photo-card__hint');
    const lines = Array.from(root.querySelectorAll('.hero__big .line1, .hero__big .line2'));
    if (card) {
      gsap.set(card, { transition: 'none' });
      dropPortrait(tl, card, 0);
    }
    let at = 0;
    lines.forEach((line) => { at = typeIn(tl, line, at, splits); });
    // "Drag & Throw!" is written once the card has landed
    if (hint) {
      tl.fromTo(hint, { clipPath: 'inset(-30% 100% -30% -5%)' },
        { clipPath: 'inset(-30% -5% -30% -5%)', duration: duration('curtain'), ease: 'none', clearProps: 'clipPath' }, duration('long') + duration('fast'));
    }
    fade(tl, root.querySelector('#intro'), at);
  }

  // ---------------------------------------------------------------- chapters
  function workCard(tl, card) {
    const number = card.querySelector('.project-card__number');
    tl.fromTo(card, { '--work-line-progress': 0 }, { '--work-line-progress': 1, duration: duration('long'), ease: 'power2.inOut' }, 0);
    // the number rolls up into place, like a counter
    if (number) {
      tl.fromTo(number, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 100 },
        { clipPath: 'inset(-10% 0% -10% 0%)', yPercent: 0, duration: duration('long'), ease: 'back.out(1.6)', clearProps: 'clipPath,transform' }, duration('stagger'));
    }
    layAndLift(tl, card.querySelector('.project-card__cover'));
    fade(tl, card.querySelectorAll('.project-card__tags, .project-card__title, .project-card__description, .project-card__links'), duration('stagger'));
  }

  function kitchenCourse(tl, course) {
    const line = course.querySelector('.kitchenMenu__courseLine');
    rise(tl, course.querySelector('.kitchenMenu__courseEn'), 0);
    if (line) tl.fromTo(line, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: duration('long'), ease: 'power2.inOut', clearProps: 'transform,transformOrigin' }, 0);
    // dishes are served row by row, and each one's flames light after it
    course.querySelectorAll('.menu-item').forEach((dish, index) => {
      const at = duration('fast') + index * duration('stagger');
      fade(tl, dish, at, { y: 8 });
      const flames = dish.querySelectorAll('.effort-meter__flame');
      if (flames.length) {
        tl.fromTo(flames, { scale: 0, transformOrigin: '50% 100%' },
          { scale: 1, duration: duration('standard'), stagger: duration('stagger') * 2, ease: 'back.out(2.5)', clearProps: 'transform,transformOrigin' }, at + duration('fast'));
      }
    });
  }

  // Life photos are dealt in from the right, each coming to rest at its own tilt
  function dealLife(tl, root) {
    const cards = Array.from(root.querySelectorAll('.photo-card--strip')).slice(0, 7); // the rest are off screen
    if (!cards.length) return;
    tl.from(cards, {
      x: () => window.innerWidth * 0.6, rotation: '+=16', autoAlpha: 0,
      duration: duration('curtain'), stagger: duration('stagger') * 2, ease: 'power3.out', clearProps: 'transform',
    }, 0);
  }

  // ---------------------------------------------------------------- when they play
  function setup(context) {
    const splits = [];
    const units = new Map(); // watched element -> its timeline and how long after the page arrives it starts
    const cleanups = [];

    function unit(root, build, { watch = root, after = 0 } = {}) {
      if (!root || !watch) return;
      const tl = gsap.timeline({ paused: true });
      build(tl, root);
      if (!units.has(watch)) units.set(watch, []);
      units.get(watch).push({ tl, after });
      const finish = () => tl.progress(1);
      root.addEventListener('focusin', finish);
      cleanups.push(() => root.removeEventListener('focusin', finish));
    }

    unit(document.querySelector('.section--main'), (tl, root) => hero(tl, root, splits));
    document.querySelectorAll('.project-card').forEach((card) => unit(card, workCard));

    const about = document.querySelector('.section--about');
    if (about) {
      unit(about.querySelector('.about__intro'), (tl, root) => {
        rise(tl, root.querySelector('.chapter__title'), 0);
        fade(tl, root.querySelectorAll('.about__paragraphs p'), duration('fast'), { stagger: duration('stagger') * 2 });
      });
      unit(about.querySelector('.about__photo'), (tl, figure) => layAndLift(tl, figure.querySelector('img')));
      // the experience list is ruled off one line at a time
      unit(about.querySelector('.jobs'), (tl, root) => {
        wipe(tl, root.querySelectorAll('.block__jobDescription'), 0, { stagger: duration('stagger') * 2 });
      }, { after: duration('slow') });
    }

    const kitchenHead = document.querySelector('.kitchenMenu__head');
    unit(kitchenHead, (tl, root) => {
      rise(tl, root.querySelector('.chapter__title'), 0);
      fade(tl, root.querySelector('.kitchenMenu__description'), duration('fast'));
    });
    document.querySelectorAll('.kitchenMenu__course').forEach((course) => unit(course, kitchenCourse, { after: duration('fast') }));

    const life = document.querySelector('.section--life');
    if (life) {
      unit(life.querySelector('.life__head'), (tl, root) => {
        rise(tl, root.querySelector('.chapter__title'), 0);
        fade(tl, root.querySelector('.life__intro'), duration('fast'));
      });
      unit(life.querySelector('.life__viewport'), (tl) => dealLife(tl, life), { after: duration('fast') });
    }

    // Pages that are not shown wait far below the screen, so "in view" also means "this page has been turned to".
    const observer = new IntersectionObserver((entries) => {
      const turning = Boolean(document.documentElement.dataset.turn);
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        units.get(entry.target).forEach(({ tl, after }) => {
          gsap.delayedCall((turning ? duration('curtain') * 0.35 : 0) + after, () => tl.play());
        });
      });
    }, { rootMargin: '0px 0px -24px 0px' });

    // nothing starts behind the loading screen
    const start = () => units.forEach((_, element) => observer.observe(element));
    if (document.querySelector('.loading-mask:not(.is-hidden)')) {
      window.addEventListener('portfolio:assets-ready', start, { once: true });
    } else start();

    context.add(() => () => {
      observer.disconnect();
      window.removeEventListener('portfolio:assets-ready', start);
      cleanups.forEach((remove) => remove());
      splits.forEach((split) => split.revert());
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupWorkSwitcher();
    if (!gsap || !('IntersectionObserver' in window)) return;
    if (window.SplitText) gsap.registerPlugin(window.SplitText);
    gsap.matchMedia().add({
      animate: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions.reduce) return;
      setup(context);
    });
  });
})();
