(function () {
  'use strict';

  const DESIGN_VIEWPORT_WIDTH = 1440;
  const initialDevicePixelRatio = window.devicePixelRatio || 1;
  let layoutScaleAnimationFrame = null;

  function getZoomNeutralViewportWidth() {
    const viewportWidth =
      document.documentElement.clientWidth || window.innerWidth || 0;
    const currentDevicePixelRatio = window.devicePixelRatio || 1;
    const devicePixelRatioScale =
      currentDevicePixelRatio / initialDevicePixelRatio;
    const dprAdjustedViewportWidth = viewportWidth * devicePixelRatioScale;

    if (window.outerWidth && window.outerWidth > viewportWidth) {
      return window.outerWidth;
    }

    return dprAdjustedViewportWidth || viewportWidth;
  }

  function applyLayoutResolutionScale() {
    const zoomNeutralViewportWidth = getZoomNeutralViewportWidth();
    const scale = Math.max(1, zoomNeutralViewportWidth / DESIGN_VIEWPORT_WIDTH);
    const rootFontSize = 16 * scale;

    document.documentElement.style.setProperty(
      '--layout-resolution-scale',
      scale.toFixed(4),
    );
    document.documentElement.style.setProperty(
      '--layout-root-font-size',
      `${rootFontSize.toFixed(2)}px`,
    );
  }

  function scheduleLayoutResolutionScale() {
    if (layoutScaleAnimationFrame) {
      window.cancelAnimationFrame(layoutScaleAnimationFrame);
    }

    layoutScaleAnimationFrame = window.requestAnimationFrame(() => {
      layoutScaleAnimationFrame = null;
      applyLayoutResolutionScale();
    });
  }

  applyLayoutResolutionScale();
  window.addEventListener('resize', scheduleLayoutResolutionScale);
  window.visualViewport?.addEventListener(
    'resize',
    scheduleLayoutResolutionScale,
  );

  function applyHighlightMarkers(root = document.body) {
    if (!root) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.includes('==')) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;
          if (
            !parent ||
            parent.closest('script, style, noscript, textarea, .highlight')
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const textNodes = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    textNodes.forEach((node) => {
      const parts = node.nodeValue.split(/(==[\s\S]+?==)/g);

      if (parts.length === 1) return;

      const fragment = document.createDocumentFragment();
      let hasReplacement = false;

      parts.forEach((part) => {
        const match = part.match(/^==([\s\S]+)==$/);

        if (match) {
          const highlightText = match[1].trim();

          if (!highlightText) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }

          const span = document.createElement('span');
          span.className = 'highlight';
          span.textContent = highlightText;
          fragment.appendChild(span);
          hasReplacement = true;
          return;
        }

        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      if (hasReplacement && node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  window.__applyHighlightMarkers__ = applyHighlightMarkers;

  const loader =
    document.querySelector('.page-loader') ||
    document.querySelector('.loading-mask');

  function waitForImageElement(image) {
    if (!image || !image.currentSrc && !image.src) {
      return Promise.resolve();
    }

    if (image.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const finalize = () => {
        image.removeEventListener('load', finalize);
        image.removeEventListener('error', finalize);
        resolve();
      };

      image.addEventListener('load', finalize, { once: true });
      image.addEventListener('error', finalize, { once: true });
    });
  }

  function preloadImage(src) {
    if (!src) return Promise.resolve();

    return new Promise((resolve) => {
      const image = new Image();

      const finalize = () => {
        image.onload = null;
        image.onerror = null;
        resolve();
      };

      image.onload = finalize;
      image.onerror = finalize;
      image.src = src;

      if (image.complete) {
        finalize();
      }
    });
  }

  async function waitForPageAssets() {
    const domImages = Array.from(document.images);
    const kitchenPreviewSources = Array.from(
      document.querySelectorAll('[data-kitchen-image-src]'),
    )
      .map((item) => item.dataset.kitchenImageSrc)
      .filter(Boolean);

    const preloadSources = [...new Set(kitchenPreviewSources)];

    await Promise.all([
      ...domImages.map(waitForImageElement),
      ...preloadSources.map(preloadImage),
    ]);
  }

  function removeLoader() {
    if (!loader) return;

    if (loader.classList.contains('page-loader')) {
      loader.classList.add('page-loader--hidden');
    } else {
      loader.classList.add('hidden');
    }

    setTimeout(() => {
      loader.remove();
    }, 1000);
  }

  // DOM 載入完成後執行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      applyHighlightMarkers();
      await waitForPageAssets();
      setTimeout(removeLoader, 500); // 小延遲讓動畫不突兀
    });
  } else {
    applyHighlightMarkers();
    waitForPageAssets().then(() => {
      setTimeout(removeLoader, 500);
    });
  }
})();
