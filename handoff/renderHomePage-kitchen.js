// ─────────────────────────────────────────────────────────────
// 取代 utility/renderHomePage.js 裡的 renderKitchenItems / renderKitchenSection
// （renderKitchenStars 不變，直接沿用）。
// 差異：表頭 ITEM/NOTE/EFFORT 與上下箭頭控制列移除；清單改成資料來源
// （.kitchen__data，隱藏但保留 data-kitchen-image-src 讓 loadingPage.js
// 的預載仍可運作）；面板改成 rolodex（上下卡緣 + 主卡）。
// ─────────────────────────────────────────────────────────────

function renderKitchenData(items) {
  return items
    .map(
      (item, index) => `
        <li class="kitchen__dataItem"
          data-kitchen-index="${index}"
          data-kitchen-name-zh="${escapeAttribute(item.nameZh)}"
          data-kitchen-name-en="${escapeAttribute(item.nameEn)}"
          data-kitchen-note="${escapeAttribute(item.note)}"
          data-kitchen-effort="${item.effort}"
          data-kitchen-image-src="${escapeAttribute(resolveAssetPath(item.imageSrc))}"
          data-kitchen-image-alt="${escapeAttribute(item.imageAlt)}"
          data-kitchen-image-class="${escapeAttribute(item.imageClass || '')}"
        ></li>`,
    )
    .join('\n');
}

function renderKitchenSection(kitchen) {
  const firstItem = kitchen.items[0];
  const total = String(kitchen.items.length).padStart(2, '0');

  return `
    <section class="section section--kitchen" id="kitchen">
      <img class="kitchen__bg" src="./img/image-kitchenBg.webp" alt="" aria-hidden="true" />
      <div class="container container--content">
        <article class="kitchen__intro">
          <h1 class="kitchen__title">${kitchen.title}</h1>
          <p class="kitchen__description">${kitchen.description}</p>
        </article>
        <div class="kitchen__panel">
          <ol class="kitchen__data" hidden>
            ${renderKitchenData(kitchen.items)}
          </ol>
          <div class="kitchen__rolodex" data-kitchen-rolodex>
            <div class="kitchen__edges kitchen__edges--above" data-kitchen-edges="above"></div>
            <article class="kitchen__card" data-kitchen-card>
              <div class="kitchen__cardMeta">
                <span data-kitchen-card-no>NO. 01</span>
                <span data-kitchen-card-counter>01 / ${total}</span>
              </div>
              <div class="kitchen__cardBody">
                <button type="button" class="kitchen__cardPhoto" data-kitchen-zoom aria-label="${kitchen.previewLabel}">
                  <img
                    class="kitchen__photo ${firstItem.imageClass || ''}"
                    src="${resolveAssetPath(firstItem.imageSrc)}"
                    alt="${firstItem.imageAlt}"
                    data-kitchen-preview
                  />
                </button>
                <div class="kitchen__cardText">
                  <div class="kitchen__cardNames">
                    <p class="kitchen__nameZh" data-kitchen-card-name-zh>${firstItem.nameZh}</p>
                    <p class="kitchen__nameEn" data-kitchen-card-name-en>${firstItem.nameEn}</p>
                  </div>
                  <div class="kitchen__cardNote">
                    <p class="kitchen__cardLabel">NOTE</p>
                    <p class="kitchen__note" data-kitchen-card-note>${firstItem.note}</p>
                  </div>
                  <div class="kitchen__cardEffort">
                    <p class="kitchen__cardLabel">EFFORT</p>
                    <span class="ui-rating kitchen__effort" data-kitchen-card-effort aria-label="Effort level ${firstItem.effort} out of 3">
                      ${renderKitchenStars(firstItem.effort)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
            <div class="kitchen__edges kitchen__edges--below" data-kitchen-edges="below"></div>
          </div>
        </div>
      </div>
      <div class="ui-modal kitchen__lightbox" data-kitchen-lightbox hidden>
        <div class="ui-modal__backdrop kitchen__lightboxBackdrop" data-kitchen-lightbox-close></div>
        <div class="ui-modal__dialog kitchen__lightboxDialog" role="dialog" aria-modal="true" aria-label="${kitchen.previewLabel}" tabindex="-1">
          <img class="kitchen__lightboxImage" src="${resolveAssetPath(firstItem.imageSrc)}" alt="${firstItem.imageAlt}" data-kitchen-lightbox-image />
        </div>
      </div>
    </section>`;
}
