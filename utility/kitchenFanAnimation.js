// Infinite Kitchen recipe index, animated with GSAP core.
// Wheel input feeds a momentum engine. At rest the nearest compact row snaps
// to centre, then that same row physically grows inside the looping list.
(function () {
  const stage = document.querySelector('.kitchenFan__stage');
  const gsap = window.gsap;
  if (!stage || !gsap) return;

  const section = stage.closest('.section--kitchenFan');
  // See utility/smoothScroll.js's isScrollSectionEngaged for why this
  // exists: without it, this stage swallows the wheel gesture that was
  // supposed to keep scrolling the page toward it, the instant the cursor
  // happens to be over it while merely passing through. Falls open (treats
  // every wheel as engaged) if smoothScroll.js hasn't loaded for some
  // reason, matching the old unconditional behavior.
  function isEngaged() {
    return window.isScrollSectionEngaged
      ? window.isScrollSectionEngaged(section)
      : true;
  }

  // Flip is optional -- if it failed to load for some reason, expandCard/
  // collapseCard fall back to plain gsap tweens further down.
  const Flip = window.Flip;
  if (Flip) gsap.registerPlugin(Flip);

  const originals = Array.from(stage.querySelectorAll('.kitchenFan__item'));
  if (!originals.length) return;

  const INITIAL_INDEX = Math.min(14, originals.length - 1);
  const NATIVE_SETTLE_DELAY_MS = 180;
  const SNAP_DURATION = 0.48;
  const CLICK_SCROLL_DURATION = 0.78;
  const CENTRE_PAUSE_MS = 260;
  const OPEN_DURATION = 0.72;
  const CLOSE_DURATION = 0.36;
  const WHEEL_FORCE = 0.18;
  const MAX_VELOCITY = 92;
  const INERTIA_FRICTION = 0.88;
  const MIN_VELOCITY = 0.38;
  const HORIZONTAL_QUERY = '(max-width: 72rem)';

  function makeClone(item, batch) {
    const clone = item.cloneNode(true);
    clone.dataset.loopClone = batch;
    clone.setAttribute('aria-hidden', 'true');
    const button = clone.querySelector('.kitchenFan__summary');
    if (button) button.tabIndex = -1;
    return clone;
  }

  const beforeBatch = document.createDocumentFragment();
  const afterBatch = document.createDocumentFragment();
  originals.forEach((item) => beforeBatch.append(makeClone(item, 'before')));
  originals.forEach((item) => afterBatch.append(makeClone(item, 'after')));
  stage.insertBefore(beforeBatch, stage.firstChild);
  stage.append(afterBatch);

  const items = Array.from(stage.querySelectorAll('.kitchenFan__item'));
  const buttons = items.map((item) => item.querySelector('.kitchenFan__summary'));
  let axis = null;
  let reduceMotion = false;
  let cycleSize = 0;
  let cycleStart = 0;
  let activeLogicalIndex = INITIAL_INDEX;
  let activePhysicalItem = null;
  let settleTimer = null;
  let openTimer = null;
  let snapTween = null;
  let openTimeline = null;
  let closeTimeline = null;
  let afterCollapse = null;
  let suppressScrollEvent = false;
  let isSnapping = false;
  let isExpanding = false;
  let isCollapsing = false;
  let cardVisible = false;
  let inertiaActive = false;
  let wheelVelocity = 0;
  let resizeFrame = null;

  function logicalIndex(item) {
    return Number(item.dataset.index);
  }

  function matchingItems(logical) {
    return items.filter((item) => logicalIndex(item) === logical);
  }

  function itemStart(item) {
    return axis.mobile ? item.offsetLeft : item.offsetTop;
  }

  function itemSize(item) {
    return axis.mobile ? item.offsetWidth : item.offsetHeight;
  }

  function stageSize() {
    return axis.mobile ? stage.clientWidth : stage.clientHeight;
  }

  function targetPosition(item) {
    return itemStart(item) + itemSize(item) / 2 - stageSize() / 2;
  }

  function currentPosition() {
    return stage[axis.scrollProperty];
  }

  function writePosition(value) {
    stage[axis.scrollProperty] = value;
  }

  function setPosition(value) {
    suppressScrollEvent = true;
    writePosition(value);
    requestAnimationFrame(() => {
      suppressScrollEvent = false;
    });
  }

  function measureLoop() {
    const middleFirst = items[originals.length];
    const afterFirst = items[originals.length * 2];
    cycleStart = targetPosition(middleFirst);
    cycleSize = itemStart(afterFirst) - itemStart(middleFirst);
  }

  function normalizeLoop() {
    if (!cycleSize || isSnapping || isExpanding || isCollapsing) return;
    const position = currentPosition();
    if (position < cycleStart) {
      writePosition(position + cycleSize);
    } else if (position >= cycleStart + cycleSize) {
      writePosition(position - cycleSize);
    }
  }

  function setExpandedState(logical, expanded) {
    originals.forEach((item, index) => {
      const button = item.querySelector('.kitchenFan__summary');
      if (button) button.setAttribute('aria-expanded', String(expanded && index === logical));
    });
  }

  function itemCentre(item) {
    const rect = item.getBoundingClientRect();
    return axis.mobile ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
  }

  function collapseCard({ animate = false, onComplete = null, preserveCentre = true } = {}) {
    if (openTimer) {
      window.clearTimeout(openTimer);
      openTimer = null;
    }
    if (isCollapsing && closeTimeline) {
      if (onComplete) afterCollapse = onComplete;
      return;
    }
    if (!cardVisible && !isExpanding && !openTimeline) {
      stage.classList.add('is-browsing');
      delete stage.dataset.activeIndex;
      if (onComplete) onComplete();
      return;
    }

    const anchor = activePhysicalItem;
    const beforeCentre = anchor ? itemCentre(anchor) : null;
    if (openTimeline) {
      openTimeline.kill();
      openTimeline = null;
    }

    const expandedItems = items.filter(
      (item) => item.classList.contains('is-expanded') || item.classList.contains('is-expanding'),
    );
    const panels = expandedItems.map((item) => item.querySelector('.kitchenFan__panel')).filter(Boolean);
    setExpandedState(activeLogicalIndex, false);
    cardVisible = false;
    isExpanding = false;
    stage.classList.add('is-browsing');
    delete stage.dataset.activeIndex;

    const finishCollapse = () => {
      gsap.set(expandedItems, { clearProps: 'height,width,flexBasis,transform' });
      expandedItems.forEach((item) => item.classList.remove('is-expanded', 'is-expanding'));
      panels.forEach((panel) => panel.setAttribute('aria-hidden', 'true'));
      gsap.set(panels, { clearProps: 'transform,opacity,visibility,clipPath' });
      activePhysicalItem = null;
      isCollapsing = false;
      closeTimeline = null;
      measureLoop();
      normalizeLoop();
      const callback = afterCollapse || onComplete;
      afterCollapse = null;
      if (callback) callback();
    };

    if (!animate || !anchor || beforeCentre === null) {
      expandedItems.forEach((item) => item.classList.remove('is-expanded', 'is-expanding'));
      if (preserveCentre && anchor && beforeCentre !== null) {
        const afterCentre = itemCentre(anchor);
        writePosition(currentPosition() + afterCentre - beforeCentre);
      }
      finishCollapse();
      return;
    }

    isCollapsing = true;
    afterCollapse = onComplete;
    // Same flex-basis caveat as expandCard: Flip needs it named explicitly on
    // the horizontal axis or the resize tween is a no-op (flex-basis wins
    // over width for main-axis sizing on that axis).
    const extentProperty = axis.mobile ? 'flexBasis' : 'height';
    const flipProps = axis.mobile ? 'flexBasis' : undefined;
    const collapsedClip = axis.mobile ? 'inset(0% 48% 0% 48%)' : 'inset(48% 0% 48% 0%)';
    const closeDuration = reduceMotion ? 0.28 : CLOSE_DURATION;

    // Capture the CURRENT (still expanded) layout before anything moves --
    // classes stay "expanded" for the whole close so the panel keeps
    // display:block and can fade out; only the size is snapped back to
    // compact right after this, and Flip animates that visual jump away.
    const flipState = Flip
      ? Flip.getState(expandedItems, flipProps ? { props: flipProps } : undefined)
      : null;
    if (flipState) gsap.set(expandedItems, { [extentProperty]: axis.compactExtent });

    const centeringUpdate = preserveCentre
      ? () => {
          const currentCentre = itemCentre(anchor);
          writePosition(currentPosition() + currentCentre - beforeCentre);
        }
      : null;

    closeTimeline = gsap.timeline({ onComplete: finishCollapse });
    closeTimeline.to(
      panels,
      {
        autoAlpha: 0,
        clipPath: collapsedClip,
        duration: reduceMotion ? 0.2 : CLOSE_DURATION * 0.72,
        ease: 'power2.in',
      },
      0,
    );

    if (flipState) {
      closeTimeline.add(
        Flip.from(flipState, {
          targets: expandedItems,
          props: flipProps,
          scale: false,
          absolute: false,
          duration: closeDuration,
          ease: 'power3.inOut',
          onUpdate: centeringUpdate,
        }),
        0,
      );
    } else {
      closeTimeline.to(
        expandedItems,
        {
          [extentProperty]: axis.compactExtent,
          duration: closeDuration,
          ease: 'power3.inOut',
          onUpdate: centeringUpdate,
        },
        0,
      );
    }
  }

  function finishExpanded(item, copies, panel) {
    gsap.set(copies, { clearProps: 'height,width,flexBasis,transform' });
    copies.forEach((copy) => {
      copy.classList.remove('is-expanding');
      copy.classList.add('is-expanded');
    });
    isExpanding = false;
    cardVisible = true;
    openTimeline = null;
    measureLoop();
    setPosition(targetPosition(item));
    panel.setAttribute('aria-hidden', 'false');
  }

  function expandCard(item, animate) {
    if (!item || !axis) return;
    const logical = logicalIndex(item);
    const copies = matchingItems(logical);
    const panel = item.querySelector('.kitchenFan__panel');
    if (!panel) return;

    activeLogicalIndex = logical;
    activePhysicalItem = item;
    stage.dataset.activeIndex = String(logical);
    stage.dataset.targetIndex = String(logical);
    stage.classList.remove('is-browsing');
    setExpandedState(logical, true);

    copies.forEach((copy) => {
      const copyPanel = copy.querySelector('.kitchenFan__panel');
      if (copyPanel) copyPanel.setAttribute('aria-hidden', String(copy !== item));
    });

    if (!animate) {
      copies.forEach((copy) => copy.classList.add('is-expanded'));
      gsap.set(panel, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      cardVisible = true;
      measureLoop();
      setPosition(targetPosition(item));
      return;
    }

    isExpanding = true;
    // On the horizontal (mobile) axis, flex-basis is what actually drives the
    // item's main-axis size (width is just a redundant hint in the CSS) --
    // Flip only tracks width/height out of the box, so flex-basis has to be
    // requested explicitly via `props` on BOTH getState and from() or the
    // item would silently jump to full size the instant the class lands.
    const extentProperty = axis.mobile ? 'flexBasis' : 'height';
    const flipProps = axis.mobile ? 'flexBasis' : undefined;

    // Capture the CURRENT (compact) layout of every clone as the Flip
    // "before" state -- this replaces the old manual
    // `gsap.set(copies, { [extentProperty]: axis.compactExtent })` snap-back,
    // Flip measures the real compact rect itself instead of relying on a
    // cached constant.
    const flipState = Flip
      ? Flip.getState(copies, flipProps ? { props: flipProps } : undefined)
      : null;

    copies.forEach((copy) => {
      copy.classList.remove('is-expanded');
      copy.classList.add('is-expanding');
    });
    gsap.set(panel, {
      autoAlpha: 0,
      clipPath: axis.mobile ? 'inset(0% 48% 0% 48%)' : 'inset(48% 0% 48% 0%)',
    });

    const duration = reduceMotion ? 0.44 : OPEN_DURATION;

    openTimeline = flipState
      ? Flip.from(flipState, {
          targets: copies,
          props: flipProps,
          scale: false, // real height/flexBasis, not transform scale -- text must not stretch
          absolute: false, // stay in flow so sibling rows keep reflowing live, matching the old behavior
          duration,
          ease: 'power3.inOut',
          onUpdate: () => writePosition(targetPosition(item)),
          onComplete: () => finishExpanded(item, copies, panel),
        })
      : gsap.timeline({ onComplete: () => finishExpanded(item, copies, panel) }).fromTo(
          copies,
          { [extentProperty]: axis.compactExtent },
          {
            [extentProperty]: itemSize(item),
            duration,
            ease: 'power3.inOut',
            onUpdate: () => writePosition(targetPosition(item)),
          },
        );

    openTimeline.to(
      panel,
      {
        autoAlpha: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: reduceMotion ? 0.24 : 0.3,
      },
      reduceMotion ? 0.04 : 0.1,
    );
  }

  function closestItem() {
    const stageRect = stage.getBoundingClientRect();
    const centre = axis.mobile
      ? stageRect.left + stageRect.width / 2
      : stageRect.top + stageRect.height / 2;
    let nearest = items[0];
    let nearestDistance = Infinity;
    items.forEach((item) => {
      const distance = Math.abs(itemCentre(item) - centre);
      if (distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function closestCopyOf(logical) {
    return matchingItems(logical).reduce((nearest, item) => {
      if (!nearest) return item;
      return Math.abs(targetPosition(item) - currentPosition()) <
        Math.abs(targetPosition(nearest) - currentPosition())
        ? item
        : nearest;
    }, null);
  }

  function stopInertia() {
    if (!inertiaActive) return;
    inertiaActive = false;
    wheelVelocity = 0;
    gsap.ticker.remove(updateInertia);
  }

  function startInertia() {
    if (inertiaActive || Math.abs(wheelVelocity) <= MIN_VELOCITY) return;
    inertiaActive = true;
    gsap.ticker.add(updateInertia);
  }

  function snapTo(item, animateCard, duration = SNAP_DURATION) {
    if (!item || !axis) return;
    if (settleTimer) {
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }
    stopInertia();
    if (snapTween) snapTween.kill();
    collapseCard();
    isSnapping = true;
    stage.dataset.targetIndex = String(logicalIndex(item));
    const startPosition = currentPosition();
    const scrollProgress = { value: 0 };
    const scrollEase = gsap.parseEase('power3.out');
    snapTween = gsap.to(scrollProgress, {
      value: 1,
      duration: reduceMotion ? Math.min(duration, 0.46) : duration,
      ease: 'none',
      onUpdate: () => {
        const progress = scrollEase(scrollProgress.value);
        const liveTarget = targetPosition(item);
        writePosition(startPosition + (liveTarget - startPosition) * progress);
      },
      onComplete: () => {
        setPosition(targetPosition(item));
        isSnapping = false;
        snapTween = null;
        openTimer = window.setTimeout(
          () => {
            openTimer = null;
            expandCard(item, animateCard);
          },
          reduceMotion ? 140 : CENTRE_PAUSE_MS,
        );
      },
    });
  }

  function settle() {
    settleTimer = null;
    normalizeLoop();
    snapTo(closestItem(), true);
  }

  function scheduleSettle(delay = NATIVE_SETTLE_DELAY_MS) {
    if (settleTimer) window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, delay);
  }

  function beginBrowsing({ animateClose = false, onCollapsed = null, preserveCentre = true } = {}) {
    if (settleTimer) {
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }
    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }
    if (openTimer) {
      window.clearTimeout(openTimer);
      openTimer = null;
    }
    isSnapping = false;
    collapseCard({
      animate: animateClose,
      onComplete: onCollapsed,
      preserveCentre,
    });
  }

  function updateInertia() {
    const frameRatio = gsap.ticker.deltaRatio(60);
    writePosition(currentPosition() + wheelVelocity * frameRatio);
    normalizeLoop();
    wheelVelocity *= Math.pow(INERTIA_FRICTION, frameRatio);
    if (Math.abs(wheelVelocity) <= MIN_VELOCITY) {
      stopInertia();
      scheduleSettle(70);
    }
  }

  function wheelDelta(event) {
    const raw = axis.mobile
      ? event.deltaX
      : event.deltaY;
    if (event.deltaMode === 1) return raw * 16;
    if (event.deltaMode === 2) return raw * stageSize();
    return raw;
  }

  stage.addEventListener(
    'wheel',
    (event) => {
      if (!isEngaged() || event.ctrlKey) return; // let the page keep scrolling while just passing through (or pinch-zooming)
      // Claim the WHOLE gesture the instant it's engaged, before looking at
      // delta -- a real trackpad/mouse sends many wheel sub-events per
      // gesture, and some land with a near-zero (or, on the "wrong" axis,
      // exactly zero) delta. Bailing out on those without calling
      // preventDefault() used to let that one sub-event fall through to the
      // browser's native scroll -- invisible on its own, but it nudges the
      // page position by a hair each time. Over a real, sustained scroll
      // session that drift adds up until the section no longer lines up
      // with the viewport within isEngaged()'s tolerance, and the menu
      // stops responding to wheel input at all, page-permanently, since the
      // page (now misaligned) is never able to get "engaged" again either.
      event.preventDefault();
      const delta = wheelDelta(event);
      if (!delta) return;
      wheelVelocity = gsap.utils.clamp(
        -MAX_VELOCITY,
        MAX_VELOCITY,
        wheelVelocity + delta * WHEEL_FORCE,
      );
      beginBrowsing({ animateClose: true, preserveCentre: false });
      startInertia();
    },
    { passive: false },
  );

  stage.addEventListener(
    'pointerdown',
    (event) => {
      if (event.target.closest('.kitchenFan__summary')) return;
      stopInertia();
      beginBrowsing({
        animateClose: true,
        onCollapsed: scheduleSettle,
        preserveCentre: false,
      });
    },
    { passive: true },
  );

  stage.addEventListener(
    'scroll',
    () => {
      if (suppressScrollEvent || isSnapping || isExpanding || isCollapsing || inertiaActive) return;
      beginBrowsing();
      normalizeLoop();
      scheduleSettle();
    },
    { passive: true },
  );

  buttons.forEach((button, physicalIndex) => {
    if (!button) return;
    button.addEventListener('click', () => {
      stopInertia();
      beginBrowsing({ animateClose: true, preserveCentre: false });
      snapTo(items[physicalIndex], true, CLICK_SCROLL_DURATION);
    });
  });

  stage.addEventListener('keydown', (event) => {
    const backwardKeys = axis.mobile ? ['ArrowLeft', 'ArrowUp'] : ['ArrowUp', 'ArrowLeft'];
    const forwardKeys = axis.mobile ? ['ArrowRight', 'ArrowDown'] : ['ArrowDown', 'ArrowRight'];
    const nearest = closestItem();
    const physicalIndex = items.indexOf(nearest);
    let target = null;
    if (backwardKeys.includes(event.key)) target = items[physicalIndex - 1];
    if (forwardKeys.includes(event.key)) target = items[physicalIndex + 1];
    if (event.key === 'Home') target = closestCopyOf(0);
    if (event.key === 'End') target = closestCopyOf(originals.length - 1);
    if (!target) return;
    event.preventDefault();
    beginBrowsing({ animateClose: true, preserveCentre: false });
    snapTo(target, true, CLICK_SCROLL_DURATION);
  });

  function initialiseAxis() {
    if (!axis) return;
    if (settleTimer) window.clearTimeout(settleTimer);
    stopInertia();
    if (snapTween) snapTween.kill();
    if (openTimeline) openTimeline.kill();
    if (closeTimeline) {
      closeTimeline.kill();
      closeTimeline = null;
      isCollapsing = false;
    }
    collapseCard();
    isSnapping = false;
    isExpanding = false;
    axis.compactExtent = itemSize(items[originals.length]);
    measureLoop();
    const initialItem = items[originals.length + activeLogicalIndex];
    setPosition(targetPosition(initialItem));
    expandCard(initialItem, false);
  }

  const media = gsap.matchMedia();
  media.add(
    {
      desktop: '(min-width: 72.0001rem)',
      horizontal: HORIZONTAL_QUERY,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      axis = context.conditions.horizontal
        ? {
            mobile: true,
            scrollProperty: 'scrollLeft',
            compactExtent: 0,
          }
        : { mobile: false, scrollProperty: 'scrollTop', compactExtent: 0 };
      reduceMotion = context.conditions.reduceMotion;
      requestAnimationFrame(initialiseAxis);
      return () => {
        stopInertia();
        if (snapTween) snapTween.kill();
        if (openTimeline) openTimeline.kill();
        if (closeTimeline) closeTimeline.kill();
      };
    },
  );

  function handleResize() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      initialiseAxis();
      resizeFrame = null;
    });
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(handleResize).observe(stage);
  } else {
    window.addEventListener('resize', handleResize);
  }
})();
