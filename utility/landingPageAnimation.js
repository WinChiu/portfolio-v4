(function () {
  const gsap = window.gsap;
  let refreshWorkReveal = () => {};
  document.documentElement.dataset.homeAnimation = gsap ? 'gsap' : 'fallback';

  function duration(name) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--motion-duration-${name}`).trim();
    return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
  }

  // Instant character steps, shared by every text block in the hero and work.
  // Reserve the complete text layout and preserve links inside rich text.
  function addTypedText(tl, element, position, splits, maxDuration = duration('loading')) {
    if (!element) return position;
    if (!window.SplitText) return position;
    const split = window.SplitText.create(element, {
      type: 'words,chars', smartWrap: true,
      charsClass: 'split-char', wordsClass: 'split-word',
      aria: element.querySelector('a') ? 'none' : 'auto',
    });
    splits.push(split);
    const step = Math.min(duration('stagger') / 2, maxDuration / Math.max(1, split.chars.length));
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
  }

  function setupHeroAnimation(context) {
    const hero = document.querySelector('.section--main');
    if (!hero) return;
    const avatar = hero.querySelector('.media--image');
    const eyebrow = hero.querySelector('#hero-eyebrow');
    const title = hero.querySelector('#greet');
    const intro = hero.querySelector('#intro');
    const annotation = hero.querySelector('#annotation');
    const targets = [avatar, eyebrow, title, intro, annotation].filter(Boolean);
    // Typed glyphs appear instantly, without the old CSS opacity transition.
    gsap.set(targets, { autoAlpha: 1, transition: 'none' });
    const splits = [];
    const tl = gsap.timeline({ paused: true });
    let position = 0;
    position = addTypedText(tl, eyebrow, position, splits);
    position = addTypedText(tl, title, position, splits);
    const introStart = position;
    addTypedText(tl, intro, introStart, splits);
    hero.querySelectorAll('.block__heroDetailTitle, .block__heroDetailSubtitle')
      .forEach((element, index) => {
        addTypedText(tl, element, introStart + duration('standard') + index * duration('stagger'), splits);
      });
    if (avatar) tl.fromTo(avatar, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: duration('loading'), ease: 'power3.inOut',
      clearProps: 'clipPath',
    }, 0);
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
    work.querySelectorAll('.block--switcher h4').forEach((element, index) => {
      addTypedText(tabTimeline, element, index * duration('stagger'), tabSplits);
    });
    // Category changes are synchronous; no stale completion callback can
    // reveal the wrong category after rapid clicks.
    context.add('rebuildWork', () => {
      timelines.forEach(({ tl, splits }) => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.revert();
        splits.forEach((split) => split.revert());
      });
      timelines.clear();
      work.querySelectorAll('.container--content:not(.workHide)').forEach((card) => {
        const cover = card.querySelector('.media--workCover');
        const content = card.querySelector('.block--introduction');
        const texts = content ? content.querySelectorAll('h1, h3, h4, p') : [];
        const buttons = card.querySelectorAll('.block__button, .block__button--viewSite');
        const splits = [];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        });
        tl.fromTo(card, { '--work-line-progress': 0, '--work-accent-progress': 0 }, {
          '--work-line-progress': 1, duration: duration('loading'), ease: 'power2.inOut',
        }, 0);
        if (cover) tl.fromTo(cover, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: duration('loading'),
          ease: 'power3.inOut', clearProps: 'clipPath',
        }, 0);
        tl.to(card, { '--work-accent-progress': 1,
          duration: duration('slow'), ease: 'power2.inOut',
        }, duration('standard'));
        texts.forEach((element, index) => {
          const start = element.closest('a')
            ? duration('standard') + duration('slow')
            : duration('fast') + index * duration('stagger');
          addTypedText(tl, element, start, splits);
        });
        if (buttons.length) tl.fromTo(buttons, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: duration('slow'),
          stagger: duration('stagger'), ease: 'power3.inOut', clearProps: 'clipPath',
        }, duration('standard'));
        timelines.set(card, { tl, splits });
      });
    });
    refreshWorkReveal = () => context.rebuildWork();
    refreshWorkReveal();
    const finishFocusedCard = (event) => {
      if (event.target.closest('.block--switcher')) tabTimeline.progress(1);
      const entry = timelines.get(event.target.closest('.container--content'));
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
      root.querySelectorAll(textSelector).forEach((element, index) => {
        // Overlap paragraphs to keep the whole section readable quickly.
        addTypedText(tl, element, Math.min(index, 6) * duration('stagger'), splits);
      });
      const media = mediaSelector ? root.querySelectorAll(mediaSelector) : [];
      if (media.length) tl.fromTo(media, { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: duration('loading'),
        ease: 'power3.inOut', clearProps: 'clipPath',
      }, 0);
      if (lineSelector) {
        const lines = root.querySelectorAll(lineSelector);
        if (lines.length) tl.fromTo(lines, { scaleX: 0, transformOrigin: 'left' }, {
          scaleX: 1, duration: duration('loading'), ease: 'power2.inOut',
          clearProps: 'transform,transformOrigin',
        }, 0);
      }
      if (root.matches('.section--about, .section--life')) {
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
    group(document.querySelector('.section--kitchenFan'),
      '.kitchenFan__title, .kitchenFan__description', '.kitchenFan__stage');
    group(document.querySelector('.section--life'),
      '.life__title, .life__description');
    group(document.querySelector('.nav--main'), '.block__navItem a', '.media--socialList', null, true);

    // Animate recipe details only when opened, and Life captions when their
    // card comes forward. Never touch either component's layout transforms.
    const seen = new WeakSet();
    context.add('typeActiveDetails', (root, selector) => {
      if (!root || seen.has(root)) return;
      seen.add(root);
      const tl = gsap.timeline();
      root.querySelectorAll(selector).forEach((element, index) => {
        const maxDuration = root.matches('.kitchenFan__panel') ? duration('slow') : duration('loading');
        addTypedText(tl, element, index * duration('stagger'), splits, maxDuration);
      });
    });
    const observers = [];
    const kitchen = document.querySelector('.kitchenFan__stage');
    const recipeTextSelector = '.kitchenFan__nameZh, .kitchenFan__nameEn, .kitchenFan__note, .kitchenFan__cardMeta > span:not(.kitchenFan__effort)';
    const typeRecipe = (event) => context.typeActiveDetails(event.detail.panel, recipeTextSelector);
    if (kitchen) kitchen.addEventListener('portfolio:kitchen-text-ready', typeRecipe);
    const stack = document.querySelector('.life__stack');
    function watch(root, callback, options) {
      if (!root) return;
      let entered = false;
      const observer = new MutationObserver((records) => {
        if (entered && records.some(({ target }) => target === root ||
          target.matches('.kitchenFan__item, .kitchenFan__panel'))) callback();
      });
      observer.observe(root, options);
      observers.push(observer);
      const intersection = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        entered = true;
        intersection.disconnect();
        callback();
      }, { threshold: 0.1 });
      intersection.observe(root);
      observers.push(intersection);
    }
    watch(kitchen, () => {
      const panel = kitchen.querySelector('.is-expanded .kitchenFan__panel[aria-hidden="false"]');
      context.typeActiveDetails(panel,
        '.kitchenFan__nameZh, .kitchenFan__nameEn, .kitchenFan__note, .kitchenFan__cardMeta > span:not(.kitchenFan__effort)');
    }, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-hidden'] });
    watch(stack, () => {
      const index = Number(stack.dataset.activeIndex || 0);
      context.typeActiveDetails(stack.querySelectorAll('.life__card')[index],
        '.life__note, .life__location, .life__date');
    }, { attributes: true, attributeFilter: ['data-active-index'] });
    context.add(() => () => {
      observers.forEach((observer) => observer.disconnect());
      if (kitchen) kitchen.removeEventListener('portfolio:kitchen-text-ready', typeRecipe);
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
