// Life section: scroll-driven stack of Polaroid-style cards.
//
// Each card keeps a small, permanent tilt/offset assigned once below --
// it never changes, even when that card becomes the front card. Scrolling
// up over the stack places the next photo on top; scrolling down removes
// the current one, bringing the previous photo back. Either way the moving
// card travels all the way off the top of the viewport (no fade -- opacity
// stays 1 throughout) so it's genuinely gone, not just peeking at the edge
// of the stack. A click/tap always advances one photo (for touch, which has
// no wheel event) -- and once the last photo is reached, clicking again
// restacks every photo back to the start instead of doing nothing.
//
// Exactly one card moves in a normal step: the one leaving. Every card still
// waiting its turn sits at the exact same spot the front card sits at (see
// applyPositions below) -- promoting one to front is a no-op for its
// transform, it was already there, just hidden under the one now leaving.
// So nothing behind the front card ever moves, no matter how many steps
// happen or how deep the pile is.
//
// Every qualifying wheel event steps exactly one card -- there's no
// scroll-distance dragging or in-between resting position -- but nothing
// is locked out while a transition plays: a fast scroll fires many wheel
// events in quick succession, each one immediately retargeting the CSS
// transition already in flight, so the cards cascade through fluidly
// instead of queueing up one-at-a-time.
(function () {
  const stack = document.querySelector('.life__stack');
  if (!stack) return;

  const section = stack.closest('.section--life');
  // See utility/smoothScroll.js's isScrollSectionEngaged for why this
  // exists: without it, this stack swallows the wheel gesture that was
  // supposed to keep scrolling the page toward it, the instant the cursor
  // happens to be over it while merely passing through. Falls open (treats
  // every wheel as engaged) if smoothScroll.js hasn't loaded for some
  // reason, matching the old unconditional behavior.
  function isEngaged() {
    return window.isScrollSectionEngaged
      ? window.isScrollSectionEngaged(section)
      : true;
  }

  const cards = Array.from(stack.querySelectorAll('.life__card'));
  if (!cards.length) return;

  function syncCardOrientation(card) {
    const image = card.querySelector('.life__photo');
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    card.classList.toggle(
      'life__card--landscape',
      image.naturalWidth > image.naturalHeight,
    );
  }

  cards.forEach((card) => {
    const image = card.querySelector('.life__photo');
    if (!image) return;

    if (image.complete) syncCardOrientation(card);
    image.addEventListener('load', () => syncCardOrientation(card), {
      once: true,
    });
  });

  const MAX = cards.length - 1;
  const EXIT_Y = '-150vh'; // always clears the viewport, wherever the stack sits on the page
  const ENTER_DELAY_MS = 60; // small pause before a returning (scroll-back) card slides back into place
  const STEP_THRESHOLD = 100; // deltaY of one physical wheel/trackpad notch (was 60, which let a single notch of ~100 cross the threshold ~1.5x and skip a card)

  // Fixed per-card tilt & horizontal jitter -- assigned once, never
  // touched again. Hardcoded for the first few cards for a hand-picked
  // "tossed down" look; any extra cards fall back to a deterministic
  // formula so the section keeps working if more photos are added later.
  const HAND_PICKED_TILT = [-3, 4, -6, 2.5, -3.5];
  const HAND_PICKED_JITTER_X = [4, -9, 10, -6, 5];

  function tiltFor(index) {
    if (index < HAND_PICKED_TILT.length) return HAND_PICKED_TILT[index];
    const dir = index % 2 === 0 ? 1 : -1;
    return dir * (3 + (index % 3) * 1.5);
  }

  function jitterXFor(index) {
    if (index < HAND_PICKED_JITTER_X.length) return HAND_PICKED_JITTER_X[index];
    const dir = index % 2 === 0 ? -1 : 1;
    return dir * (5 + (index % 3) * 2);
  }

  const tilt = cards.map((_, index) => tiltFor(index));
  const jitterX = cards.map((_, index) => jitterXFor(index));

  // Stacking order is assigned ONCE, here, and never touched again for the
  // rest of the page's life -- earlier cards permanently sit above later
  // ones. That single fixed order already produces every state this needs
  // with zero runtime z-index changes: the current front card has a lower
  // index than everything still resting behind it, so it's already above
  // them; and a card that's leaving has a LOWER index than the card taking
  // its place, so it's already above that one too and visibly lifts off
  // over the top rather than ducking behind anything as it exits.
  cards.forEach((card, index) => {
    card.style.zIndex = String(cards.length - index);
  });

  let currentIndex = 0;

  function applyPositions() {
    cards.forEach((card, index) => {
      const depth = index - currentIndex;
      // Only two positions exist: "gone" (already dismissed, off past the
      // top) or "here" (0px -- front AND every still-to-come card in the
      // pile share this exact same spot). There's no separate peek offset
      // for the resting pile any more, so promoting a resting card to
      // front is not a move at all -- it's already sitting where "front"
      // is, just covered by the (fixed, permanent) stacking order below,
      // until the card in front of it exits.
      const y = depth < 0 ? EXIT_Y : '0px';
      card.style.transform = `translate(${jitterX[index]}px, ${y}) rotate(${tilt[index]}deg)`;
    });
  }

  function step(direction) {
    const next = Math.min(MAX, Math.max(0, currentIndex + direction));
    if (next === currentIndex) return;
    currentIndex = next;

    cards.forEach((card, index) => {
      card.style.transitionDelay = index === currentIndex ? `${ENTER_DELAY_MS}ms` : '0ms';
    });

    applyPositions();
  }

  // Every card moves at once here (front goes back into the pile, every
  // exited card returns), so each one gets a small index-based stagger --
  // without it the whole restack would snap into place as one synced block.
  function resetStack() {
    currentIndex = 0;
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 40}ms`;
    });
    applyPositions();
  }

  // Small trackpad grazes fire many wheel events with a tiny deltaY each --
  // treating every one of those as its own step is what made a card arrive
  // at the front and get bumped straight back off again within the same
  // gentle gesture (it briefly becomes "front", then "front" again for the
  // next card, all before the eye can register it as one settled state).
  // Accumulating deltaY and only stepping once it crosses STEP_THRESHOLD
  // makes one mouse-wheel click (or one deliberate trackpad tick) resolve
  // to one step, while a genuinely fast fling still crosses the threshold
  // several times in a row and cascades through multiple cards.
  let deltaAccumulator = 0;

  stack.addEventListener(
    'wheel',
    (event) => {
      if (!isEngaged()) return; // let the page keep scrolling while just passing through
      event.preventDefault();
      deltaAccumulator += event.deltaY;
      while (Math.abs(deltaAccumulator) >= STEP_THRESHOLD) {
        const accumulatorSign = deltaAccumulator > 0 ? 1 : -1;
        deltaAccumulator -= accumulatorSign * STEP_THRESHOLD;
        // Reversed: scrolling up (negative deltaY) advances, scrolling down retreats.
        step(accumulatorSign > 0 ? -1 : 1);
      }
    },
    { passive: false },
  );

  stack.addEventListener('click', () => {
    if (currentIndex >= MAX) {
      resetStack();
    } else {
      step(1);
    }
  });

  applyPositions();
})();
