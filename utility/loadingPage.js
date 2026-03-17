(function () {
  'use strict';

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
    document.addEventListener('DOMContentLoaded', () => {
      applyHighlightMarkers();
      setTimeout(removeLoader, 500); // 小延遲讓動畫不突兀
    });
  } else {
    applyHighlightMarkers();
    setTimeout(removeLoader, 500);
  }
})();
