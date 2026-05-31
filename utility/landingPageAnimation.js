(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const designButton = document.querySelector('.block__design');
    const codingButton = document.querySelector('.block__coding');
    const designBlocks = Array.from(
      document.querySelectorAll('[data-type="design"]'),
    );
    const codeBlocks = Array.from(
      document.querySelectorAll('[data-type="code"]'),
    );

    if (!designButton || !codingButton) return;

    function setVisible(targetBlocks, hiddenBlocks) {
      const motion = window.PortfolioMotion;
      const canAnimate =
        window.gsap &&
        motion &&
        !motion.isReducedMotion() &&
        window.__portfolioPageReady;

      hiddenBlocks.forEach((block) => {
        if (!canAnimate) {
          block.classList.add('workHide');
          return;
        }

        window.gsap.to(block, {
          autoAlpha: 0,
          y: 16,
          duration: 0.22,
          onComplete: () => {
            block.classList.add('workHide');
          },
        });
      });

      targetBlocks.forEach((block, index) => {
        block.classList.remove('workHide');

        if (!canAnimate) return;

        window.gsap.fromTo(
          block,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            delay: index * 0.04,
            clearProps: 'visibility,opacity,transform',
          },
        );
      });

      window.setTimeout(() => {
        motion?.refreshScrollTrigger();
      }, canAnimate ? 260 : 0);
    }

    designButton.addEventListener('click', function () {
      designButton.classList.add('selected');
      codingButton.classList.remove('selected');
      setVisible(designBlocks, codeBlocks);
    });

    codingButton.addEventListener('click', function () {
      codingButton.classList.add('selected');
      designButton.classList.remove('selected');
      setVisible(codeBlocks, designBlocks);
    });
  });
})();
