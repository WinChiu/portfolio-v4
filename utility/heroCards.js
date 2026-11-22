// Hero photo cards: drag them around with the mouse, pen, finger or the arrow keys. They stay inside the hero.
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const cards = Array.from(hero.querySelectorAll('.photo-card--floating'));
  window.heroCardTop = window.heroCardTop || 10;

  function place(card, dx, dy) {
    const maxX = hero.clientWidth - card.offsetLeft - card.offsetWidth;
    const maxY = hero.clientHeight - card.offsetTop - card.offsetHeight;
    const x = Math.min(maxX, Math.max(-card.offsetLeft, dx));
    const y = Math.min(maxY, Math.max(-card.offsetTop, dy));
    card.dataset.dx = String(x);
    card.dataset.dy = String(y);
    card.style.setProperty('--dx', `${x}px`);
    card.style.setProperty('--dy', `${y}px`);
  }

  cards.forEach((card) => {
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let dragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.button > 0) return;
      dragging = true;
      if (window.gsap) window.gsap.killTweensOf(card);
      startX = event.clientX;
      startY = event.clientY;
      originX = Number(card.dataset.dx || 0);
      originY = Number(card.dataset.dy || 0);
      card.style.zIndex = String(++window.heroCardTop);
      card.classList.add('is-dragging');
      card.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    card.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      place(card, originX + event.clientX - startX, originY + event.clientY - startY);
    });
    const stop = () => {
      dragging = false;
      card.classList.remove('is-dragging');
    };
    card.addEventListener('pointerup', stop);
    card.addEventListener('pointercancel', stop);
    card.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 48 : 16;
      const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
      if (!move) return;
      event.preventDefault();
      card.style.zIndex = String(++window.heroCardTop);
      place(card, Number(card.dataset.dx || 0) + move[0], Number(card.dataset.dy || 0) + move[1]);
    });
  });

  // Keep cards inside the hero when the layout changes.
  window.addEventListener('resize', () => cards.forEach((card) => place(card, Number(card.dataset.dx || 0), Number(card.dataset.dy || 0))));
})();
