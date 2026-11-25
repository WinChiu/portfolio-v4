(function () {
  const gsap = window.gsap;
  let refreshWorkReveal = () => {};
  document.documentElement.dataset.homeAnimation = gsap ? 'gsap' : 'fallback';

  function duration(name) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--sys-motion-duration-${name}`).trim();
    return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
  }

  // Instant character steps, shared by every text block in the hero and work.
  // Reserve the complete text layout and preserve links inside rich text.
  function addTypedText(tl, element, position, splits, maxDuration = duration('loading'), stepOverride) {
    if (!element) return position;
    if (!window.SplitText) return position;
    const split = window.SplitText.create(element, {
      type: 'words,chars', smartWrap: true,
      charsClass: 'split-char', wordsClass: 'split-word',
      aria: element.querySelector('a') ? 'none' : 'auto',
    });
    splits.push(split);
    const step = stepOverride || Math.min(duration('stagger') / 2, maxDuration / Math.max(1, split.chars.length));
    gsap.set(split.chars, { visibility: 'hidden' });
    split.chars.forEach((char, index) => {
      const at = position + index * step;
      tl.set(char, { visibility: 'visible' }, at);
      tl.call(() => {
        if (index) split.chars[index - 1].classList.remove('is-typing-char');
        char.classList.add('is-typing-char');
      }, [], at);
    });
    const end = position + Math.max(0, split.chars.length - 1) * step + duration('stagger');
    tl.call(() => {
      split.chars.forEach((char) => char.classList.remove('is-typing-char'));
    }, [], end);
    return end;
  }

  // Content layer: a quiet fade-up. Typing is reserved for the hero headline; lines draw, everything else fades.
  function addReveal(tl, targets, position, { y = 14, stagger = duration('stagger'), time = duration('slow') } = {}) {
    const items = Array.from(targets && targets.length !== undefined ? targets : [targets]).filter(Boolean);
    if (!items.length) return position;
    tl.fromTo(items, { autoAlpha: 0, y }, {
      autoAlpha: 1, y: 0, duration: time, stagger, ease: 'power2.out', clearProps: 'transform',
    }, position);
    return position + time + (items.length - 1) * stagger;
  }

  function setupWorkSwitcher() {
    const buttons = Array.from(document.querySelectorAll('.block--switcher button'));
    const cards = Array.from(document.querySelectorAll('.section--work [data-type]'));
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
        refreshWorkReveal();
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

  function setupHeroAnimation(context) {
    const hero = document.querySelector('.section--main');
    if (!hero) return;
    const avatar = hero.querySelector('.media--image');
    const eyebrow = hero.querySelector('#hero-eyebrow');
    const title = hero.querySelector('#greet');
    const bigLines = Array.from(hero.querySelectorAll('.hero__big .line1, .hero__big .line2'));
    const cards = Array.from(hero.querySelectorAll('.photo-card--floating'));
    const intro = hero.querySelector('#intro');
    const targets = [avatar, eyebrow, title, intro, ...bigLines, ...cards].filter(Boolean);
    // Typed glyphs appear instantly, without the old CSS opacity transition.
    gsap.set(targets, { autoAlpha: 1, transition: 'none' });
    const splits = [];
    const tl = gsap.timeline({ paused: true });
    let position = 0;
    // In order: "Product", then "Designer", then the greeting. Everything else joins in alongside.
    bigLines.forEach((line) => {
      position = addTypedText(tl, line, position, splits, undefined, duration('stagger') * 1.4);
    });
    position = addTypedText(tl, title, position, splits);
    // Content layer: everything below the headline fades up together, one beat.
    addReveal(tl, eyebrow, 0);
    // Photo cards are dealt onto the page one by one from off the left edge, like a casino dealer's cards.
    // Afterwards the throwing continues: every new card lands on the
    // oldest one's spot and the oldest is taken away, so four stay on the table. Cards animate the CSS
    // variables dragging uses (--dx, --dy, --r) so a landed card is a normal draggable card.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onTable = cards.slice(0, 4);
    const slots = onTable.map((card) => {
      const read = (name) => card.style.getPropertyValue(name);
      return { x: read('--x'), y: read('--y'), mx: read('--mx'), my: read('--my'), r: parseFloat(read('--r')) || 0 };
    });
    cards.slice(4).forEach((card) => gsap.set(card, { autoAlpha: 0 }));
    // Phone: the cards live in the empty space above the headline and must never cover it. A card is moved up (and,
    // on very short screens, made narrower) until its bottom edge is above the headline.
    const phone = window.matchMedia('(max-width: 48rem)');
    const bigTitle = hero.querySelector('.hero__big');
    function fitAbove(card) {
      card.style.removeProperty('width');
      if (!phone.matches || !bigTitle) return;
      const MARGIN = 8;
      const room = bigTitle.offsetTop - MARGIN * 2;
      if (card.offsetHeight > room) card.style.width = `${Math.max(64, card.offsetWidth * (room / card.offsetHeight))}px`;
      const maxTop = Math.max(MARGIN, bigTitle.offsetTop - MARGIN - card.offsetHeight);
      if (card.offsetTop > maxTop) card.style.setProperty('--my', `${maxTop}px`);
    }
    onTable.forEach(fitAbove);
    const num = (card, name) => parseFloat(card.style.getPropertyValue(name)) || 0;
    const rand = (min, max) => min + Math.random() * (max - min);

    // Throw `card` onto `slot`, like a dealer: the card is flicked flat across the felt in a straight line.
    // Only sliding friction acts on it (constant deceleration = a quadratic ease-out), so there is no arc,
    // no scaling and no hop. It leaves the hand with a small spin that dies out as it stops.
    function throwCard(card, slot, rest) {
      card.dataset.dx = '0';
      card.dataset.dy = '0';
      ['--x', '--y', '--mx', '--my'].forEach((name, i) => card.style.setProperty(name, [slot.x, slot.y, slot.mx, slot.my][i]));
      fitAbove(card);
      const fromX = -card.offsetLeft - card.offsetWidth - 40;
      const fromY = rand(-60, 60);
      const spin = (Math.random() < 0.5 ? -1 : 1) * rand(25, 45);
      const t = gsap.timeline();
      t.set(card, { '--dx': `${fromX}px`, '--dy': `${fromY}px`, '--r': `${rest + spin}deg`, '--s': 1, autoAlpha: 1, zIndex: ++window.heroCardTop }, 0);
      t.to(card, { '--dx': '0px', '--dy': '0px', duration: 0.5, ease: 'power2.out' }, 0);
      t.to(card, { '--r': `${rest}deg`, duration: 0.5, ease: 'power2.out' }, 0);
      t.land = 0.5;
      return t;
    }

    // Taken away: the dealer sweeps it off the way it came, straight and accelerating.
    function takeAway(card) {
      const heroRect = hero.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const t = gsap.timeline();
      t.to(card, {
        '--dx': `${num(card, '--dx') - (rect.right - heroRect.left) - 40}px`,
        '--r': `${num(card, '--r') - 8}deg`,
        duration: 0.4, ease: 'power2.in',
      }, 0);
      t.set(card, { autoAlpha: 0 }, 0.4);
      return t;
    }

    if (cards.length) {
      const dealAt = duration('standard');
      if (reduced) {
        tl.fromTo(onTable, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: duration('loading'), stagger: duration('stagger') * 2, ease: 'power2.out',
        }, dealAt);
      } else {
        onTable.forEach((card, index) => gsap.set(card, { autoAlpha: 0 }));
        const gap = 0.45;
        onTable.forEach((card, index) => tl.add(throwCard(card, slots[index], slots[index].r), dealAt + index * gap));
        // Keep throwing: queue = cards on the table, oldest first.
        let started = false;
        let loop;
        const queue = onTable.slice();
        let next = 4;
        const period = 3;
        const busy = () => document.hidden || getComputedStyle(cards[0]).display === 'none' || hero.querySelector('.is-dragging') || !inView;
        let inView = true;
        const observer = 'IntersectionObserver' in window
          ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }) : null;
        if (observer) observer.observe(hero);
        const step = () => {
          loop = gsap.delayedCall(period, step);
          if (busy() || cards.length <= 4) return;
          const oldest = queue.shift();
          const slotIndex = slots.findIndex((slot, i) => i === step.n % 4);
          const slot = slots[slotIndex];
          const card = cards[next % cards.length];
          next += 1;
          step.n += 1;
          const rest = slot.r + rand(-3, 3);
          const throwTl = throwCard(card, slot, rest);
          const round = gsap.timeline();
          round.add(throwTl, 0);
          round.add(takeAway(oldest), throwTl.land + 0.1);
          queue.push(card);
        };
        step.n = 0;
        const startLoop = () => {
          if (started) return;
          started = true;
          loop = gsap.delayedCall(1.2, step);
        };
        tl.call(startLoop, [], dealAt + 3 * gap + 0.6);
        context.add(() => () => {
          if (loop) loop.kill();
          if (observer) observer.disconnect();
        });
      }
    }
    const introStart = position;
    addReveal(tl, intro, introStart);
    if (avatar) addReveal(tl, avatar, 0, { y: 0, time: duration('loading') });
    let startCall;
    // The loader fades for one loading-duration after assets-ready. Start
    // typing after that fade so the first sentence isn't typed underneath it.
    const play = () => {
      startCall = gsap.delayedCall(duration('loading'), () => tl.play(0));
    };
    if (document.querySelector('.loading-mask:not(.is-hidden)')) {
      window.addEventListener('portfolio:assets-ready', play, { once: true });
    } else tl.play(0);
    const finish = () => {
      if (startCall) startCall.kill();
      tl.progress(1);
    };
    hero.addEventListener('focusin', finish);
    context.add(() => () => {
      window.removeEventListener('portfolio:assets-ready', play);
      if (startCall) startCall.kill();
      hero.removeEventListener('focusin', finish);
      splits.forEach((split) => split.revert());
    });
  }

  function setupProjectCardReveal(context) {
    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);
    const timelines = new Map();
    const work = document.querySelector('.section--work');
    if (!work) return;
    const tabSplits = [];
    const tabTimeline = gsap.timeline({
      scrollTrigger: { trigger: work.querySelector('.block--switcher'), start: 'top 90%', once: true },
    });
    addReveal(tabTimeline, work.querySelectorAll('.block--switcher h4'), 0, { y: 8 });
    tabTimeline.fromTo(work, { '--section-line-progress': 0 }, {
      '--section-line-progress': 1, duration: duration('loading'), ease: 'power2.inOut',
    }, 0);
    // Category changes are synchronous; no stale completion callback can
    // reveal the wrong category after rapid clicks.
    context.add('rebuildWork', () => {
      timelines.forEach(({ tl, splits }) => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.revert();
        splits.forEach((split) => split.revert());
      });
      timelines.clear();
      const visibleCards = work.querySelectorAll('.project-card:not(.workHide)');
      visibleCards.forEach((card, cardIndex) => {
        card.classList.toggle('is-last-visible', cardIndex === visibleCards.length - 1);
        const cover = card.querySelector('.project-card__cover');
        const content = card.querySelector('.project-card__body');
        const texts = content ? content.querySelectorAll('h1, h3, h4, p') : [];
        const number = card.querySelector('.project-card__number');
        const buttons = card.querySelectorAll('.button');
        const splits = [];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        });
        tl.fromTo(card, { '--work-line-progress': 0, '--work-accent-progress': 0 }, {
          '--work-line-progress': 1, duration: duration('loading'), ease: 'power2.inOut',
        }, 0);
        // Cover and copy rise together as one beat; the line draws underneath.
        if (cover) addReveal(tl, cover, 0, { y: 20, time: duration('loading') / 2 });
        tl.to(card, { '--work-accent-progress': 1,
          duration: duration('slow'), ease: 'power2.inOut',
        }, duration('standard'));
        const copy = [number, ...texts].filter((element) => element && !element.closest('a'));
        addReveal(tl, copy, duration('fast'));
        if (buttons.length) addReveal(tl, buttons, duration('standard'), { y: 8 });
        timelines.set(card, { tl, splits });
      });
    });
    refreshWorkReveal = () => context.rebuildWork();
    refreshWorkReveal();
    const finishFocusedCard = (event) => {
      if (event.target.closest('.block--switcher')) tabTimeline.progress(1);
      const entry = timelines.get(event.target.closest('.project-card'));
      if (entry) entry.tl.progress(1);
    };
    work.addEventListener('focusin', finishFocusedCard);
    context.add(() => () => {
      refreshWorkReveal = () => {};
      work.removeEventListener('focusin', finishFocusedCard);
      tabSplits.forEach((split) => split.revert());
      timelines.forEach(({ splits }) => splits.forEach((split) => split.revert()));
      timelines.clear();
    });
  }

  function setupRemainingHomeReveal(context) {
    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);
    const splits = [];
    const focusHandlers = [];
    function group(root, textSelector, mediaSelector, lineSelector, afterLoader = false) {
      if (!root) return;
      const tl = gsap.timeline({
        paused: afterLoader,
        scrollTrigger: afterLoader ? undefined : { trigger: root, start: 'top 86%', once: true },
      });
      // Overlapping stagger keeps the whole section readable quickly.
      addReveal(tl, root.querySelectorAll(textSelector), 0, { stagger: duration('stagger') * 1.5 });
      const media = mediaSelector ? root.querySelectorAll(mediaSelector) : [];
      if (media.length) addReveal(tl, media, duration('fast'), { y: 0, time: duration('loading') / 2 });
      if (lineSelector) {
        const lines = root.querySelectorAll(lineSelector);
        if (lines.length) tl.fromTo(lines, { scaleX: 0, transformOrigin: 'left' }, {
          scaleX: 1, duration: duration('loading'), ease: 'power2.inOut',
          clearProps: 'transform,transformOrigin',
        }, 0);
      }
      if (root.matches('.section--about, .section--kitchenMenu, .section--life')) {
        tl.fromTo(root, { '--section-line-progress': 0 }, {
          '--section-line-progress': 1, duration: duration('loading'), ease: 'power2.inOut',
        }, 0);
      }
      let startCall;
      const play = () => {
        startCall = gsap.delayedCall(duration('loading'), () => tl.play(0));
      };
      const stopWaiting = () => {
        window.removeEventListener('portfolio:assets-ready', play);
        if (startCall) startCall.kill();
      };
      if (afterLoader) {
        if (document.querySelector('.loading-mask:not(.is-hidden)')) {
          window.addEventListener('portfolio:assets-ready', play, { once: true });
        } else tl.play(0);
        focusHandlers.push(stopWaiting);
      }
      const finish = () => {
        stopWaiting();
        tl.progress(1);
      };
      root.addEventListener('focusin', finish);
      focusHandlers.push(() => root.removeEventListener('focusin', finish));
    }
    group(document.querySelector('.section--about'),
      '.block__title, .block__content, .block__jobs p', '.media--avatar', '.block__jobDescription--dotLine');
    group(document.querySelector('.section--kitchenMenu'),
      '.kitchenMenu__title, .kitchenMenu__description', null);
    group(document.querySelector('.section--life'),
      '.life__title, .life__description');
    group(document.querySelector('.nav--main'), '.block__navItem a', '.index__social', null, true);

    // Kitchen: each course reveals as it scrolls in. Heading types, its rule draws alongside, then the dishes
    // wipe in row by row. Courses in view start together.
    document.querySelectorAll('.kitchenMenu__course').forEach((course) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: course, start: 'top 90%', once: true } });
      const line = course.querySelector('.kitchenMenu__courseLine');
      addReveal(tl, course.querySelectorAll('.kitchenMenu__courseZh, .kitchenMenu__courseEn'), 0, { y: 8 });
      if (line) tl.fromTo(line, { scaleX: 0, transformOrigin: 'left' }, {
        scaleX: 1, duration: duration('slow'), ease: 'power2.inOut', clearProps: 'transform,transformOrigin',
      }, 0);
      const dishes = course.querySelectorAll('.menu-item');
      addReveal(tl, dishes, duration('fast'), { y: 10, stagger: duration('stagger') / 2 });
      const finish = () => tl.progress(1);
      course.addEventListener('focusin', finish);
      focusHandlers.push(() => course.removeEventListener('focusin', finish));
    });

    // Life: the film strip's cards open top-down, one after another, when the chapter comes into view.
    const lifeCards = Array.from(document.querySelectorAll('.photo-card--strip'));
    const life = document.querySelector('.section--life');
    if (life && lifeCards.length) {
      const lifeTl = gsap.timeline({ scrollTrigger: { trigger: life, start: 'top 75%', once: true } });
      // Life cards carry a CSS rotation, so they fade without a transform.
      lifeTl.fromTo(lifeCards, { autoAlpha: 0 }, {
        autoAlpha: 1, duration: duration('slow'), stagger: duration('stagger'), ease: 'power2.out',
      }, duration('standard'));
      const finishLife = () => lifeTl.progress(1);
      life.addEventListener('focusin', finishLife);
      focusHandlers.push(() => life.removeEventListener('focusin', finishLife));
    }

    context.add(() => () => {
      focusHandlers.forEach((remove) => remove());
      splits.forEach((split) => split.revert());
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupWorkSwitcher();
    if (!gsap) return;
    if (window.SplitText) gsap.registerPlugin(window.SplitText);
    gsap.matchMedia().add({
      animate: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions.reduce) return;
      setupHeroAnimation(context);
      setupProjectCardReveal(context);
      setupRemainingHomeReveal(context);
    });
  });
})();
