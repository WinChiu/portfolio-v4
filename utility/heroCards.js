// Hero photo cards: drag them around with the mouse, pen, finger or the arrow keys (they stay inside the hero), or
// click / press Enter to jump to that dish or Life photo.
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

  // Where a click goes: a dish opens its recipe in the Kitchen menu, a Life photo is shown in the Life strip.
  // The page scrolls to that section first (smoothly), then the section is told what to open.
  function activate(card) {
    const kind = card.dataset.kind;
    const index = Number(card.dataset.index);
    if (!kind || !Number.isFinite(index) || index < 0) return;
    const target = document.querySelector(kind === 'dish' ? '#kitchen' : '#life');
    if (!target) return;
    const arrive = () => document.dispatchEvent(new CustomEvent(kind === 'dish' ? 'kitchen:open' : 'life:show', { detail: { index } }));
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.4, onComplete: arrive });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(arrive, 800);
    }
  }

  // A press is a click until the pointer has travelled more than DRAG_SLOP px; after that it is a drag and the
  // card moves with the pointer. A drag never opens anything, and a click never moves the card.
  const DRAG_SLOP = 6;

  cards.forEach((card) => {
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let pressed = false;
    let dragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.button > 0) return;
      pressed = true;
      dragging = false;
      startX = event.clientX;
      startY = event.clientY;
      card.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    card.addEventListener('pointermove', (event) => {
      if (!pressed) return;
      if (!dragging) {
        if (Math.hypot(event.clientX - startX, event.clientY - startY) <= DRAG_SLOP) return;
        dragging = true; // from here on it is a drag
        if (window.gsap) window.gsap.killTweensOf(card);
        originX = Number(card.dataset.dx || 0);
        originY = Number(card.dataset.dy || 0);
        card.style.zIndex = String(++window.heroCardTop);
        card.classList.add('is-dragging');
      }
      place(card, originX + event.clientX - startX, originY + event.clientY - startY);
    });
    const release = (event, cancelled) => {
      if (!pressed) return;
      const wasDrag = dragging;
      pressed = false;
      dragging = false;
      card.classList.remove('is-dragging');
      if (!wasDrag && !cancelled) activate(card);
    };
    card.addEventListener('pointerup', (event) => release(event, false));
    card.addEventListener('pointercancel', (event) => release(event, true));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(card);
        return;
      }
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
