document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------------------
     1. 切換按鈕：控制 Design / Coding 顯示
  --------------------------------------- */
  const designButton = document.querySelector(".block__design");
  const codingButton = document.querySelector(".block__coding");
  const designBlocks = document.querySelectorAll('[data-type="design"]');
  const codeBlocks = document.querySelectorAll('[data-type="code"]');

  designButton.addEventListener("click", function () {
    designButton.classList.add("selected");
    codingButton.classList.remove("selected");
    designBlocks.forEach((block) => block.classList.remove("workHide"));
    codeBlocks.forEach((block) => block.classList.add("workHide"));
  });

  codingButton.addEventListener("click", function () {
    codingButton.classList.add("selected");
    designButton.classList.remove("selected");
    codeBlocks.forEach((block) => block.classList.remove("workHide"));
    designBlocks.forEach((block) => block.classList.add("workHide"));
  });

});

/* ---------------------------------------
   3. jQuery：首頁字幕載入動畫
--------------------------------------- */
$(document).ready(function () {
  $(".media--image").css("opacity", 1);
  setTimeout(function () {
    $("#hero-eyebrow").css("opacity", 1);
    $("#greet").css("opacity", 1);
  }, 100);
  setTimeout(function () {
    $("#intro").css("opacity", 1);
  }, 300);
  setTimeout(function () {
    $("#annotation").css("opacity", 1);
  }, 500);
  setTimeout(function () {
    $(".media--image").css("transition-duration", "0s");
  }, 2500);
});
