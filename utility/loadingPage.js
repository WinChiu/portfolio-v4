(function () {
  'use strict';

  const loader = document.querySelector('.loading-mask');
  if (!loader) return;

  function removeLoader() {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.remove();
    }, 1000);
  }

  // DOM 載入完成後執行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(removeLoader, 500); // 小延遲讓動畫不突兀
    });
  } else {
    setTimeout(removeLoader, 500);
  }
})();
