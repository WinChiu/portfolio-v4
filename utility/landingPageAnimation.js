(function () {
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasSplitText = hasGsap && typeof window.SplitText !== 'undefined';
  if (hasSplitText) window.gsap.registerPlugin(window.SplitText);

  document.documentElement.dataset.homeAnimation = hasGsap
    ? 'gsap'
    : 'fallback';

  // One-shot split only (no autoSplit): autoSplit's internal ResizeObserver
  // re-splits shortly after the first split even with fonts already fully
  // loaded, replacing the char/word elements a timeline was about to
  // animate and instantly revealing the fresh ones via plain CSS before the
  // timeline ever plays. A plain one-time split has no such re-split step,
  // so nothing can race it -- the tradeoff is a harmless
  // "SplitText called before fonts loaded" console warning when fonts
  // genuinely aren't ready yet.
  //
  // charsClass/wordsClass tag the generated wrapper elements so
  // style/home/_globals.scss can force them to `color: inherit` -- the
  // site's global `* { color: ... }` reset otherwise colors every new
  // element directly, which wins over (silently erases) any color a split
  // char/word would have inherited from an ancestor like a highlighted
  // span, a link, or a stroked/transparent-fill heading.
  function splitText(el, type) {
    return hasSplitText && el
      ? window.SplitText.create(el, {
          type,
          smartWrap: true,
          charsClass: 'split-char',
          wordsClass: 'split-word',
        })
      : null;
  }

  // Reveals one split target's chars/words on `tl` at `position`. `target`
  // may be a single element or an array of elements (whatever was passed to
  // splitText/SplitText.create). Falls back to a plain fade+rise on
  // `target` itself when it wasn't split (no SplitText available).
  function revealSplitText(tl, target, splitResult, position, vars) {
    if (!target || (Array.isArray(target) && !target.length)) return;
    const units = splitResult && (splitResult.chars || splitResult.words);
    if (units && units.length) {
      tl.fromTo(
        units,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, clearProps: 'transform,visibility', ...vars },
        position,
      );
    } else {
      tl.fromTo(
        target,
        { y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          clearProps: 'transform,visibility',
          duration: vars.duration,
        },
        position,
      );
    }
  }

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

      designButton.classList.toggle('is-selected', isDesign);
      codingButton.classList.toggle('is-selected', !isDesign);
      designButton.setAttribute('aria-pressed', String(isDesign));
      codingButton.setAttribute('aria-pressed', String(!isDesign));
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
    const greet = hero.querySelector('#greet');
    const eyebrow = hero.querySelector('#hero-eyebrow');
    const intro = hero.querySelector('#intro');
    const annotation = hero.querySelector('#annotation');
    const annotationTexts = annotation
      ? Array.from(
          annotation.querySelectorAll(
            '.block__heroDetailTitle, .block__heroDetailSubtitle',
          ),
        )
      : [];
    const allHeroText = [greet, eyebrow, intro, ...annotationTexts].filter(
      Boolean,
    );

    if (!hasGsap) {
      [avatar, ...allHeroText].filter(Boolean).forEach((element) => {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
      });
      return;
    }

    const gsap = window.gsap;

    // Hide everything up front, synchronously -- the full-page loading
    // screen (if present) already covers this the whole time regardless,
    // but this also closes the gap below where each char-split build has
    // to wait on fonts.ready and could otherwise render unsplit-and-visible
    // for a moment if the loader finishes first.
    gsap.set([avatar, ...allHeroText].filter(Boolean), { autoAlpha: 0 });

    const greetSplit = splitText(greet, 'chars');
    const eyebrowSplit = splitText(eyebrow, 'chars');
    // The description stays a plain fade+rise (no split) -- requested
    // directly, rather than the word-by-word reveal used until now.
    const introSplit = null;
    const annotationSplit =
      hasSplitText && annotationTexts.length
        ? window.SplitText.create(annotationTexts, {
            type: 'chars',
            smartWrap: true,
            charsClass: 'split-char',
          })
        : null;

    // Once split, an element's own opacity is no longer what hides it --
    // its individual char/word spans are (set below, inside revealSplitText)
    // -- so every split parent can come back to full opacity now.
    // #annotation additionally has its own `opacity: 0` in
    // style/home/_hero.scss (a CSS-only default meant to be cleared by JS,
    // independent of anything GSAP set above) -- so it needs the same
    // treatment even though it isn't itself one of the split targets, only
    // a container for them.
    const splitParents = [];
    if (greetSplit) splitParents.push(greet);
    if (eyebrowSplit) splitParents.push(eyebrow);
    if (introSplit) splitParents.push(intro);
    if (annotationSplit) splitParents.push(...annotationTexts, annotation);
    if (splitParents.length) gsap.set(splitParents, { autoAlpha: 1 });

    function buildTimeline() {
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.72, ease: 'power3.out' },
      });

      if (avatar) {
        tl.fromTo(
          avatar,
          { y: 24, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform,visibility' },
          0,
        );
      }

      // Each block starts once the previous one is a little more than half
      // revealed, so the whole hero cascades as one continuous read instead
      // of either strictly waiting turn-by-turn or all firing at once.
      const greetStart = avatar ? 0.18 : 0;
      revealSplitText(tl, greet, greetSplit, greetStart, {
        duration: 0.5,
        stagger: 0.02,
      });

      const eyebrowStart = greetSplit ? greetStart + 0.14 : greetStart;
      revealSplitText(tl, eyebrow, eyebrowSplit, eyebrowStart, {
        duration: 0.45,
        stagger: 0.018,
      });

      const introStart = eyebrowSplit ? eyebrowStart + 0.2 : eyebrowStart;
      revealSplitText(tl, intro, introSplit, introStart, {
        duration: 0.5,
        stagger: 0.035,
      });

      const annotationStart = introSplit ? introStart + 0.3 : introStart;
      revealSplitText(tl, annotation, annotationSplit, annotationStart, {
        duration: 0.4,
        stagger: 0.008,
      });

      return tl;
    }

    function playWhenReady(tl) {
      const loader = document.querySelector('.loading-mask');
      if (loader) {
        window.addEventListener('portfolio:assets-ready', () => tl.play(0), {
          once: true,
        });
        return;
      }
      tl.play(0);
    }

    playWhenReady(buildTimeline());
  }

  function setupProjectCardReveal() {
    if (!hasGsap || !hasScrollTrigger) {
      document.documentElement.dataset.homeScrollAnimation = 'fallback';
      return;
    }

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.dataset.homeScrollAnimation = 'gsap';

    getVisibleProjectCards().forEach((card, index) => {
      const cover = card.querySelector('.media--workCover');
      const content = card.querySelector('.block--introduction');
      const targets = [cover, content].filter(Boolean);

      if (!targets.length) return;

      gsap.set(targets, { willChange: 'transform, opacity' });

      gsap.fromTo(
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

    const kitchen = document.querySelector('.section--kitchenFan');
    if (!kitchen) return;

    window.gsap.fromTo(
      [
        kitchen.querySelector('.kitchenFan__stage'),
        kitchen.querySelector('.kitchenFan__intro'),
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
    // Nav-link (#work/#about/#kitchen/#life) scrolling used to be a
    // hand-rolled GSAP scrollTo tween here, then briefly routed through
    // Lenis's scrollTo(). Both ended up worse than just leaving these as
    // plain anchor links: the site already sets `scroll-behavior: smooth`
    // on <html> (style/home/_globals.scss), which is exactly what makes
    // the in-copy "cooking" link (content/homeContent.js) smooth-scroll to
    // #kitchen with zero JS. Lenis's scrollTo(), on the other hand, honors
    // prefers-reduced-motion and jumps instantly for anyone with that OS
    // setting on -- which plain CSS scroll-behavior does not do the same
    // way in practice, so routing nav through it made nav feel broken for
    // exactly the visitors it was supposed to help. No handler needed here.
  });
})();
