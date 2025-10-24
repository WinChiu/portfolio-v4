/**
 * Loading Page with Lottie Animation
 * 等待 Lottie 動畫載入完成後再移除遮罩
 */

(function () {
  'use strict';

  // 找到已經存在的 loading mask
  const loader = document.querySelector('.loading-mask');
  const lottieElement = document.querySelector('dotlottie-wc');

  if (!loader) {
    console.warn('Loading mask not found');
    return;
  }

  let isRemoving = false; // 防止重複移除

  // 等待頁面和 Lottie 動畫載入完成後移除
  function removeLoader() {
    if (isRemoving) return; // 防止重複執行
    isRemoving = true;

    loader.classList.add('hidden');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 300);
  }

  // 檢查 Lottie 動畫是否載入完成
  function checkLottieLoaded() {
    if (lottieElement) {
      // 監聽 Lottie 動畫的 ready 事件
      lottieElement.addEventListener('ready', function () {
        // 動畫準備好後，等待 1 秒讓它播放
        setTimeout(removeLoader, 1000);
      });

      // 備用方案：如果 5 秒後還沒 ready，就直接移除
      setTimeout(removeLoader, 5000);
    } else {
      // 如果沒有 Lottie 元素，等待 DOM 載入後快速移除
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(removeLoader, 500);
        });
      } else {
        setTimeout(removeLoader, 500);
      }
    }
  }

  // 開始檢查
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkLottieLoaded);
  } else {
    checkLottieLoaded();
  }
})();
