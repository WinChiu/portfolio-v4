document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  // 先選取所有可能要動畫的區塊
  const animatedElements = document.querySelectorAll(
    '.module, .block, .container--contentSection'
  );
  // 過濾掉屬於 #navbar 的元素（包括其子元素）
  const filteredElements = Array.from(animatedElements).filter((el) => {
    return !el.closest('#navbar') && !el.closest('.block__translator');
  });

  // 對過濾後的元素套用入場動畫
  filteredElements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
    });
  });
});
