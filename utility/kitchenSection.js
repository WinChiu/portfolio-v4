(function () {
  const section = document.querySelector('.section--kitchen');

  if (!section) return;

  const items = Array.from(section.querySelectorAll('[data-kitchen-index]'));
  const rows = Array.from(section.querySelectorAll('.kitchen__row'));
  const previews = Array.from(section.querySelectorAll('[data-kitchen-preview]'));
  const previousButton = section.querySelector('[data-kitchen-prev]');
  const nextButton = section.querySelector('[data-kitchen-next]');
  const lightbox = section.querySelector('[data-kitchen-lightbox]');
  const lightboxImage = section.querySelector('[data-kitchen-lightbox-image]');
  const lightboxClosers = Array.from(
    section.querySelectorAll('[data-kitchen-lightbox-close]'),
  );
  const mobileMediaQuery = window.matchMedia('(max-width: 62.5rem)');

  if (!items.length || !rows.length || previews.length !== 2 || !previousButton || !nextButton) return;

  let activeIndex = items.findIndex((item) =>
    item.classList.contains('kitchen__item--active'),
  );
  let currentPage = 0;
  let activePreviewIndex = 0;
  const totalPages =
    Math.max(
      ...rows.map((row) => Number.parseInt(row.dataset.kitchenPage || '0', 10)),
    ) + 1;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  function getVisibleItems() {
    return items.filter(
      (item) => Number.parseInt(item.dataset.kitchenPage || '0', 10) === currentPage,
    );
  }

  function updatePreview(item) {
    const nextSrc = item.dataset.kitchenImageSrc;
    const nextAlt = item.dataset.kitchenImageAlt;
    const nextClass = item.dataset.kitchenImageClass || '';
    const currentPreview = previews[activePreviewIndex];
    const nextPreview = previews[activePreviewIndex === 0 ? 1 : 0];

    nextPreview.src = nextSrc;
    nextPreview.alt = nextAlt;
    nextPreview.className = `kitchen__photo ${nextClass}`.trim();

    currentPreview.classList.remove('kitchen__photo--active');
    currentPreview.setAttribute('aria-hidden', 'true');
    nextPreview.classList.add('kitchen__photo--active');
    nextPreview.removeAttribute('aria-hidden');

    activePreviewIndex = activePreviewIndex === 0 ? 1 : 0;
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = item.dataset.kitchenImageSrc;
    lightboxImage.alt = item.dataset.kitchenImageAlt;
    lightbox.hidden = false;
    document.body.classList.add('kitchen-lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.hidden = true;
    document.body.classList.remove('kitchen-lightbox-open');
  }

  function setActive(index) {
    activeIndex = (index + items.length) % items.length;

    items.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.classList.toggle('kitchen__item--active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    updatePreview(items[activeIndex]);
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
        setActive(index);
      }
    });

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

  currentPage = Number.parseInt(items[activeIndex].dataset.kitchenPage || '0', 10);
  setPage(currentPage);
})();
