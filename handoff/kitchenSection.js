// ─────────────────────────────────────────────────────────────
// 完整取代 utility/kitchenSection.js
// 行為：上下各露 EDGE_COUNT 張卡緣；↑↓ 鍵翻卡；點卡緣跳到該張；
// 點卡片照片開 lightbox（Esc / 點背景關閉）。
// ─────────────────────────────────────────────────────────────
(function () {
  const EDGE_COUNT = 2;
  const FLIP_MS = 130;

  const section = document.querySelector('.section--kitchen');
  if (!section) return;

  const rolodex = section.querySelector('[data-kitchen-rolodex]');
  const card = section.querySelector('[data-kitchen-card]');
  const edgesAbove = section.querySelector('[data-kitchen-edges="above"]');
  const edgesBelow = section.querySelector('[data-kitchen-edges="below"]');
  if (!rolodex || !card || !edgesAbove || !edgesBelow) return;

  const items = Array.from(section.querySelectorAll('.kitchen__dataItem')).map(
    (node) => ({
      nameZh: node.dataset.kitchenNameZh || '',
      nameEn: node.dataset.kitchenNameEn || '',
      note: node.dataset.kitchenNote || '',
      effort: Number.parseInt(node.dataset.kitchenEffort || '0', 10),
      imageSrc: node.dataset.kitchenImageSrc || '',
      imageAlt: node.dataset.kitchenImageAlt || '',
      imageClass: node.dataset.kitchenImageClass || '',
    }),
  );
  if (!items.length) return;

  const preview = section.querySelector('[data-kitchen-preview]');
  const zoomButton = section.querySelector('[data-kitchen-zoom]');
  const cardNo = section.querySelector('[data-kitchen-card-no]');
  const cardCounter = section.querySelector('[data-kitchen-card-counter]');
  const cardNameZh = section.querySelector('[data-kitchen-card-name-zh]');
  const cardNameEn = section.querySelector('[data-kitchen-card-name-en]');
  const cardNote = section.querySelector('[data-kitchen-card-note]');
  const cardEffort = section.querySelector('[data-kitchen-card-effort]');
  const lightbox = section.querySelector('[data-kitchen-lightbox]');
  const lightboxImage = section.querySelector('[data-kitchen-lightbox-image]');
  const lightboxClosers = Array.from(
    section.querySelectorAll('[data-kitchen-lightbox-close]'),
  );

  const total = String(items.length).padStart(2, '0');
  let index = 0;
  let busy = false;

  function starsMarkup(effort) {
    return Array.from({ length: 3 }, (_, i) => {
      const src = i < effort ? './img/icon-starFilled.svg' : './img/icon-star.svg';
      return `<img class="ui-rating__icon kitchen__star" src="${src}" alt="" aria-hidden="true" />`;
    }).join('');
  }

  function edgeMarkup(item, position, depth, targetIndex) {
    const width = 100 - depth * 3.5;
    const opacity = 1 - depth * 0.22;
    return `
      <button type="button" class="kitchen__edge" data-kitchen-jump="${targetIndex}"
        style="--kitchen-edge-width:${width}%; --kitchen-edge-opacity:${opacity}"
        aria-label="Show ${item.nameEn}">
        <span class="kitchen__edgeNameZh">${item.nameZh}</span>
        <span class="kitchen__edgeNameEn">${item.nameEn}</span>
      </button>`;
  }

  function renderEdges() {
    const above = [];
    for (let depth = EDGE_COUNT; depth >= 1; depth -= 1) {
      const target = index - depth;
      if (target >= 0) above.push(edgeMarkup(items[target], 'above', depth, target));
    }
    const below = [];
    for (let depth = 1; depth <= EDGE_COUNT; depth += 1) {
      const target = index + depth;
      if (target < items.length) below.push(edgeMarkup(items[target], 'below', depth, target));
    }
    edgesAbove.innerHTML = above.join('\n');
    edgesBelow.innerHTML = below.join('\n');
  }

  function renderCard() {
    const item = items[index];
    if (preview) {
      preview.src = item.imageSrc;
      preview.alt = item.imageAlt;
      preview.className = `kitchen__photo ${item.imageClass}`.trim();
    }
    if (cardNo) cardNo.textContent = `NO. ${String(index + 1).padStart(2, '0')}`;
    if (cardCounter) cardCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${total}`;
    if (cardNameZh) cardNameZh.textContent = item.nameZh;
    if (cardNameEn) cardNameEn.textContent = item.nameEn;
    if (cardNote) cardNote.textContent = item.note;
    if (cardEffort) {
      cardEffort.innerHTML = starsMarkup(item.effort);
      cardEffort.setAttribute('aria-label', `Effort level ${item.effort} out of 3`);
    }
  }

  function render() {
    renderCard();
    renderEdges();
  }

  function goTo(next) {
    const target = Math.max(0, Math.min(items.length - 1, next));
    if (busy || target === index) return;
    const backwards = target < index;
    busy = true;

    card.classList.toggle('kitchen__card--reverse', backwards);
    card.classList.add('kitchen__card--out');

    window.setTimeout(() => {
      index = target;
      render();
      card.classList.remove('kitchen__card--out');
      card.classList.add('kitchen__card--in');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          card.classList.remove('kitchen__card--in');
          card.classList.remove('kitchen__card--reverse');
          busy = false;
        });
      });
    }, FLIP_MS);
  }

  function openLightbox() {
    if (!lightbox || !lightboxImage) return;
    const item = items[index];
    lightboxImage.src = item.imageSrc;
    lightboxImage.alt = item.imageAlt;
    lightbox.hidden = false;
    document.body.classList.add('kitchen-lightbox-open');
    const dialog = lightbox.querySelector('.kitchen__lightboxDialog');
    if (dialog) dialog.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('kitchen-lightbox-open');
    if (zoomButton) zoomButton.focus();
  }

  rolodex.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-kitchen-jump]');
    if (!trigger) return;
    goTo(Number.parseInt(trigger.dataset.kitchenJump || '0', 10));
  });

  if (zoomButton) zoomButton.addEventListener('click', openLightbox);
  lightboxClosers.forEach((node) => node.addEventListener('click', closeLightbox));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
      return;
    }
    if (lightbox && !lightbox.hidden) return;
    const withinView = section.getBoundingClientRect();
    const isVisible = withinView.top < window.innerHeight && withinView.bottom > 0;
    if (!isVisible) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(index - 1);
    }
  });

  render();
})();
