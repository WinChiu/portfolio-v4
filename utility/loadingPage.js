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

  // ---------------------------------------------------------------------
  // Loader: a hairline fills as real assets load, then lifts like a curtain.
  // Moving between pages: a line draws, the curtain drops, and the next page
  // lifts it again (a shorter loader, flagged through sessionStorage).
  // ---------------------------------------------------------------------
  const COVER_FLAG = 'portfolio:cover';
  const rootStyle = getComputedStyle(document.documentElement);
  const EASE = rootStyle.getPropertyValue('--sys-motion-ease-curtain').trim() || 'ease-in-out';
  // Durations are tokens in tokens.css ("800ms"); read them as milliseconds.
  const ms = (name, fallback) => parseFloat(rootStyle.getPropertyValue(name)) || fallback;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader =
    document.querySelector('.page-loader') ||
    document.querySelector('.loading-mask');

  let arrivedByCover = false;
  try {
    arrivedByCover = sessionStorage.getItem(COVER_FLAG) === '1';
    sessionStorage.removeItem(COVER_FLAG);
  } catch (error) { /* storage can be blocked */ }

  // Styles live in style/_page-transition.scss; timings come from the tokens read above.

  const ui = { digits: [], panels: [], stage: null };
  const startedAt = performance.now();
  const minimumMs = reduceMotion ? 0
    : arrivedByCover ? ms('--sys-motion-duration-standard', 350) : ms('--sys-motion-duration-loading', 1300);
  let realProgress = 0;
  let shown = 0;

  if (loader) {
    loader.querySelectorAll('dotlottie-wc').forEach((node) => node.remove());
    loader.classList.add('pl');
    if (arrivedByCover) loader.classList.add('pl--short');
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading');
    loader.insertAdjacentHTML('beforeend', `
      <div class="pl__panels" aria-hidden="true"><i class="pl__panel"></i></div>
      <div class="pl__stage">
        <div class="pl__top">
          <div class="pl__big"><span class="pl__count" aria-hidden="true"><span>0</span><span>0</span><span>0</span></span></div>
          <span>Win Chiu</span><span>Product Designer</span><span>Portfolio</span><span>Loading</span>
        </div>
      </div>`);
    ui.stage = loader.querySelector('.pl__stage');
    ui.panels = Array.from(loader.querySelectorAll('.pl__panel'));
    ui.digits = Array.from(loader.querySelectorAll('.pl__count span'));
  }

  function render() {
    if (!ui.digits.length) return;
    const text = String(Math.round(shown * 100)).padStart(3, '0');
    ui.digits.forEach((digit, i) => { if (digit.textContent !== text[i]) digit.textContent = text[i]; });
  }

  // Resolves once the displayed number has really reached 100, so a fast cache hit
  // still reads as a deliberate beat instead of a flash.
  const displayDone = new Promise((resolve) => {
    if (!loader) return resolve();
    const timer = setInterval(() => {
      const elapsed = minimumMs ? Math.min(1, (performance.now() - startedAt) / minimumMs) : 1;
      const target = Math.min(realProgress, elapsed);
      shown += (target - shown) * 0.2;
      if (target >= 1 && shown > 0.995) shown = 1;
      render();
      if (shown >= 1) { clearInterval(timer); resolve(); }
    }, 16);
  });

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

  async function waitForPageAssets() {
    // Images marked loading="lazy" (e.g. the Kitchen grid's 40+ dish photos)
    // are deliberately deferred by the browser until they scroll near the
    // viewport -- waiting for their load/error event here would block the
    // loading screen for as long as it takes the visitor to scroll down,
    // sometimes indefinitely. Only gate on eagerly-loaded images.
    const domImages = Array.from(document.images).filter(
      (image) => image.loading !== 'lazy',
    );

    let loaded = 0;
    const total = domImages.length;
    await Promise.all(domImages.map((image) => waitForImageElement(image).then(() => {
      loaded += 1;
      realProgress = loaded / total;
    })));
    realProgress = 1;
  }

  function animate(element, keyframes, options) {
    if (reduceMotion || !element.animate) return Promise.resolve();
    return element.animate(keyframes, { fill: 'forwards', easing: EASE, ...options }).finished.catch(() => {});
  }

  async function removeLoader() {
    await displayDone;
    if (!loader) {
      window.dispatchEvent(new CustomEvent('portfolio:assets-ready'));
      return;
    }
    await animate(ui.stage, [{ opacity: 1 }, { opacity: 0 }], { duration: ms('--sys-motion-duration-fast', 220), easing: 'ease-out' });
    // The page's own entrance waits for this event, so it starts as the curtain lifts.
    window.dispatchEvent(new CustomEvent('portfolio:assets-ready'));
    // the sheet of paper lifts away
    const lift = arrivedByCover ? ms('--sys-motion-duration-long', 600) : ms('--sys-motion-duration-curtain', 800);
    await Promise.all(ui.panels.map((panel, i) => animate(panel,
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-101%)' }],
      { duration: lift, delay: reduceMotion ? 0 : i * 90 })));

    loader.classList.add('is-hidden');
    loader.classList.add(loader.classList.contains('page-loader') ? 'page-loader--hidden' : 'hidden');
    setTimeout(() => loader.remove(), 50);
  }

  // Leaving for another page: line, then curtain, then navigate.
  function coverAndGo(url) {
    const curtain = document.createElement('div');
    curtain.className = 'pl-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = '<i></i>';
    document.body.appendChild(curtain);
    try { sessionStorage.setItem(COVER_FLAG, '1'); } catch (error) { /* ignore */ }
    const go = () => { window.location.href = url; };
    if (reduceMotion || !curtain.animate) return go();
    Promise.all(Array.from(curtain.children).map((column, i) => column.animate(
      [{ transform: 'translateY(-101%)' }, { transform: 'translateY(0)' }],
      { duration: ms('--sys-motion-duration-slow', 420), delay: i * 70, easing: EASE, fill: 'forwards' },
    ).finished)).then(go, go);
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === window.location.pathname) return; // in-page anchors and same-page links
    event.preventDefault();
    coverAndGo(url.href);
  });

  // Back/forward can restore a page frozen mid-cover from the bfcache.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) document.querySelectorAll('.pl-curtain').forEach((node) => node.remove());
  });

  // DOM 載入完成後執行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      applyHighlightMarkers();
      await waitForPageAssets();
      removeLoader();
    });
  } else {
    applyHighlightMarkers();
    waitForPageAssets().then(removeLoader);
  }
})();
