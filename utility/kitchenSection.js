(function () {
  const section = document.querySelector('.section--kitchen');

  if (!section) return;

  const items = Array.from(section.querySelectorAll('[data-kitchen-index]'));
  const rows = Array.from(section.querySelectorAll('.kitchen__row'));
  const preview = section.querySelector('[data-kitchen-preview]');
  const previousButton = section.querySelector('[data-kitchen-prev]');
  const nextButton = section.querySelector('[data-kitchen-next]');
  const lightbox = section.querySelector('[data-kitchen-lightbox]');
  const lightboxImage = section.querySelector('[data-kitchen-lightbox-image]');
  const lightboxClosers = Array.from(
    section.querySelectorAll('[data-kitchen-lightbox-close]'),
  );
  const mobileMediaQuery = window.matchMedia('(max-width: 62.5rem)');

  if (
    !items.length ||
    !rows.length ||
    !preview ||
    !previousButton ||
    !nextButton
  )
    return;

  let activeIndex = items.findIndex((item) =>
    item.classList.contains('kitchen__item--active'),
  );
  let currentPage = 0;
  let hoverTimer = null;
  const hoverPreviewDelay = 90;
  const hasGsap = typeof window.gsap !== 'undefined';
  const totalPages =
    Math.max(
      ...rows.map((row) => Number.parseInt(row.dataset.kitchenPage || '0', 10)),
    ) + 1;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  function getVisibleItems() {
    return items.filter(
      (item) =>
        Number.parseInt(item.dataset.kitchenPage || '0', 10) === currentPage,
    );
  }

  function clearHoverTimer() {
    if (hoverTimer) {
      window.clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }

  function updatePreview(item) {
    const nextSrc = item.dataset.kitchenImageSrc;
    const nextAlt = item.dataset.kitchenImageAlt;
    const nextClass = item.dataset.kitchenImageClass || '';

    if (!hasGsap) {
      preview.src = nextSrc;
      preview.alt = nextAlt;
      preview.className = `kitchen__photo ${nextClass}`.trim();
      return;
    }

    window.gsap.killTweensOf(preview);
    window.gsap.to(preview, {
      autoAlpha: 0,
      scale: 0.97,
      rotation: -1,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => {
        preview.src = nextSrc;
        preview.alt = nextAlt;
        preview.className = `kitchen__photo ${nextClass}`.trim();

        window.gsap.fromTo(
          preview,
          { autoAlpha: 0, scale: 0.97, rotation: 1 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.28,
            ease: 'power3.out',
            clearProps: 'transform,visibility,opacity',
          },
        );
      },
    });
  }

  function animateActiveItem(item) {
    if (!hasGsap) return;

    window.gsap.killTweensOf(item);
    window.gsap.fromTo(
      item,
      { x: 0 },
      {
        x: 4,
        duration: 0.16,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        clearProps: 'transform',
      },
    );
  }

  function animateLightboxIn() {
    if (!hasGsap || !lightbox) return;

    const backdrop = lightbox.querySelector('.kitchen__lightboxBackdrop');
    const dialog = lightbox.querySelector('.kitchen__lightboxDialog');

    window.gsap.fromTo(
      backdrop,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2 },
    );
    window.gsap.fromTo(
      dialog,
      { autoAlpha: 0, yPercent: -50, y: 18, scale: 0.98 },
      {
        autoAlpha: 1,
        yPercent: -50,
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power3.out',
      },
    );
  }

  function animateLightboxOut(onComplete) {
    if (!hasGsap || !lightbox) {
      onComplete();
      return;
    }

    const backdrop = lightbox.querySelector('.kitchen__lightboxBackdrop');
    const dialog = lightbox.querySelector('.kitchen__lightboxDialog');

    window.gsap.to(backdrop, {
      autoAlpha: 0,
      duration: 0.18,
      ease: 'power2.in',
    });

    window.gsap.to(dialog, {
      autoAlpha: 0,
      yPercent: -50,
      y: 12,
      scale: 0.98,
      duration: 0.18,
      ease: 'power2.in',
      onComplete,
    });
  }

  function resetLightboxStyles() {
    if (!hasGsap || !lightbox) return;

    const backdrop = lightbox.querySelector('.kitchen__lightboxBackdrop');
    const dialog = lightbox.querySelector('.kitchen__lightboxDialog');

    window.gsap.set([backdrop, dialog], {
      clearProps: 'transform,visibility,opacity',
    });
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = item.dataset.kitchenImageSrc;
    lightboxImage.alt = item.dataset.kitchenImageAlt;
    lightbox.hidden = false;
    document.body.classList.add('kitchen-lightbox-open');
    animateLightboxIn();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;

    animateLightboxOut(() => {
      lightbox.hidden = true;
      document.body.classList.remove('kitchen-lightbox-open');
      resetLightboxStyles();
    });
  }

  function setActive(index) {
    clearHoverTimer();
    activeIndex = (index + items.length) % items.length;

    items.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.classList.toggle('kitchen__item--active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    updatePreview(items[activeIndex]);
    animateActiveItem(items[activeIndex]);
  }

  function setPage(pageIndex) {
    currentPage = Math.min(Math.max(pageIndex, 0), totalPages - 1);

    rows.forEach((row) => {
      const isVisible =
        Number.parseInt(row.dataset.kitchenPage || '0', 10) === currentPage;
      row.classList.toggle('kitchen__row--hidden', !isVisible);
      row.setAttribute('aria-hidden', String(!isVisible));
    });

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    previousButton.classList.toggle('kitchen__control--disabled', isFirstPage);
    previousButton.setAttribute('aria-disabled', String(isFirstPage));
    nextButton.classList.toggle('kitchen__control--disabled', isLastPage);
    nextButton.setAttribute('aria-disabled', String(isLastPage));

    const firstVisibleItem = getVisibleItems()[0];

    if (firstVisibleItem) {
      const nextActiveIndex = Number.parseInt(
        firstVisibleItem.dataset.kitchenIndex || '0',
        10,
      );
      setActive(nextActiveIndex);
    }
  }

  items.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        clearHoverTimer();
        hoverTimer = window.setTimeout(() => {
          setActive(index);
        }, hoverPreviewDelay);
      }
    });

    item.addEventListener('mouseleave', clearHoverTimer);

    item.addEventListener('focus', () => {
      setActive(index);
    });

    item.addEventListener('click', () => {
      setActive(index);
      if (mobileMediaQuery.matches) {
        openLightbox(item);
      }
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(index);
        if (mobileMediaQuery.matches) {
          openLightbox(item);
        }
      }
    });
  });

  previousButton.addEventListener('click', () => {
    if (currentPage === 0) return;
    setPage(currentPage - 1);
  });

  nextButton.addEventListener('click', () => {
    if (currentPage === totalPages - 1) return;
    setPage(currentPage + 1);
  });

  lightboxClosers.forEach((closer) => {
    closer.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  currentPage = Number.parseInt(
    items[activeIndex].dataset.kitchenPage || '0',
    10,
  );
  setPage(currentPage);
})();
