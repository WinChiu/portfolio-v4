document.addEventListener('DOMContentLoaded', function () {
  /* ---------------------------------------
     1. 切換按鈕：控制 Design / Coding 顯示
  --------------------------------------- */
  const designButton = document.querySelector('.block__design');
  const codingButton = document.querySelector('.block__coding');
  const designBlocks = document.querySelectorAll('[data-type="design"]');
  const codeBlocks = document.querySelectorAll('[data-type="code"]');

  designButton.addEventListener('click', function () {
    designButton.classList.add('selected');
    codingButton.classList.remove('selected');
    designBlocks.forEach((block) => block.classList.remove('workHide'));
    codeBlocks.forEach((block) => block.classList.add('workHide'));
  });

  codingButton.addEventListener('click', function () {
    codingButton.classList.add('selected');
    designButton.classList.remove('selected');
    codeBlocks.forEach((block) => block.classList.remove('workHide'));
    designBlocks.forEach((block) => block.classList.add('workHide'));
  });

  /* ---------------------------------------
     2. IntersectionObserver：滾動入場動畫
  --------------------------------------- */

  // (a) 選取所有容器（但排除不需要動畫的區域）
  const allContainers = document.querySelectorAll(
    '.block, .container--content, .media'
  );
  const filteredContainers = Array.from(allContainers).filter((el) => {
    return (
      // 排除主視覺 (main.section--main)
      !el.closest('main.section--main') &&
      // 排除導覽列 (#navbar)
      !el.closest('#navbar') &&
      // 排除切換按鈕 .block--switcher
      !el.classList.contains('block--switcher') &&
      !el.closest('.block--switcher')
    );
  });

  // (b) 對容器的「直接子元素」加入 .animate-item 類，作為動畫起始狀態
  filteredContainers.forEach((container) => {
    const children = Array.from(container.children);
    children.forEach((child) => {
      child.classList.add('animate-item');
    });
  });

  // (c) 建立 IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 加上 .visible 後觸發 CSS 動畫
          entry.target.classList.add('visible');
          // 若只想動畫一次，就 unobserve
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // 元素至少 20% 進入視窗時觸發
    }
  );

  // (d) 將所有子元素加入觀察
  filteredContainers.forEach((container) => {
    const children = Array.from(container.children);
    children.forEach((child) => {
      observer.observe(child);
    });
  });
});

/* ---------------------------------------
   3. jQuery：你原本的載入時小效果
--------------------------------------- */
$(document).ready(function () {
  $('.media__img').addClass('active');
  setTimeout(function () {
    $('#greet').css('opacity', 1);
  }, 100);
  setTimeout(function () {
    $('#intro').css('opacity', 1);
  }, 300);
  setTimeout(function () {
    $('#annotation').css('opacity', 1);
  }, 500);
  setTimeout(function () {
    $('#down').css('opacity', 1);
  }, 700);
});
