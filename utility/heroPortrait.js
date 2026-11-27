// Hero portrait: a card lying on a table that can be picked up, swung round and tossed. It is a flat rigid body with a
// height above the table: held off-centre it swings round the held point as that point speeds up or slows down; let go,
// it flies (the harder the throw, the higher and longer), keeping its speed and spin, falls under gravity, and once it
// lands friction stops it quickly. Hitting an edge of the screen area the hero fills (the chapter bars count as walls)
// bounces it and changes both. Close to where it came from (the dashed outline) it snaps back into place. While off
// the table it casts a solid shadow as far away as it is high, lit from the top left at 45 degrees however it is turned.
// Mouse and pen only: on touch screens a swipe has to scroll the page. With reduced motion it can only be moved: no
// turning and no throw.
(() => {
  const hero = document.querySelector('.hero');
  const card = hero?.querySelector('.photo-card--portrait');
  if (!card) return;

  const SPOT_INSET = 6; // px the outline sits inside the card's edge
  // A dashed outline lies where the card came from, a little smaller than it, so the card covers it while it is home.
  const spot = document.createElement('div');
  spot.className = 'photo-card__spot';
  spot.setAttribute('aria-hidden', 'true');
  // drawn as SVG: a CSS dashed border cannot set the length of its dashes
  spot.innerHTML = '<svg><rect width="100%" height="100%"/></svg>';
  card.before(spot);
  // a handwritten nudge next to it (shown only where it can be dragged, see _photoCard.scss)
  const hint = document.createElement('p');
  hint.className = 'photo-card__hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Drag & Throw!';
  card.before(hint);
  // above the card's right half; beside it when there is no room above
  function placeHint() {
    const gap = 12;
    const above = card.offsetTop - hint.offsetHeight - gap;
    const beside = card.offsetLeft + card.offsetWidth + gap;
    const fitsBeside = above < 0 && beside + hint.offsetWidth <= hero.clientWidth;
    const left = fitsBeside ? beside : card.offsetLeft + card.offsetWidth - hint.offsetWidth * 0.8;
    hint.style.left = `${Math.max(0, Math.min(hero.clientWidth - hint.offsetWidth, left))}px`;
    hint.style.top = `${fitsBeside ? card.offsetTop + gap : Math.max(0, above)}px`;
  }
  const place = () => Object.assign(spot.style, {
    left: `${card.offsetLeft + SPOT_INSET}px`,
    top: `${card.offsetTop + SPOT_INSET}px`,
    width: `${card.offsetWidth - SPOT_INSET * 2}px`,
    height: `${card.offsetHeight - SPOT_INSET * 2}px`,
  });
  const resized = new ResizeObserver(() => { place(); placeHint(); });
  document.fonts?.ready.then(placeHint);
  resized.observe(card);
  resized.observe(hero);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const REST_ANGLE = (5 * Math.PI) / 180; // the tilt set in components/PhotoCard/_photoCard.scss
  const FOLLOW = 900; // how tightly the held point tracks the pointer
  const HELD_SPIN_DRAG = 3.5; // per second: how fast swinging dies down in the hand
  const AIR_DRAG = 0.5; // per second, in the air: speed and spin carry almost unchanged
  const TABLE_FRICTION = 9; // per second, once it is down: a short scrape and it stops
  const LANDING = 0.5; // share of speed and spin kept on touching down
  // height is measured in "hands": 1 is how high a held card is
  const GRAVITY = 14; // hands per second squared
  const TOSS = 0.0025; // upward speed per px/s of throw
  const MAX_TOSS = 6;
  const BOUNCE = 0.65; // speed kept after hitting an edge
  const GRIP = 0.2; // how much an edge drags along itself, turning the card
  const MAX_SPEED = 4000; // px per second
  const MAX_SPIN = 18; // radians per second
  const SNAP_RANGE = 90; // px between the card and its outline within which it snaps back
  const SNAP_SPEED = 900; // px per second: faster than this it flies past
  const SNAP = 220; // stiffness of the pull
  const HOVER_LIFT = 0.75; // how high the shadow suggests the card is while hovered
  const HOVER_SHIFT = 10; // px the hovered card moves up and to the left, away from its shadow
  const SHADOW = 1; // shadow offset as a share of --sys-space-md
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // centre (offset from where the layout puts it) and velocity, angle and spin, height above the table and its speed
  const state = { x: 0, y: 0, vx: 0, vy: 0, angle: REST_ANGLE, spin: 0, z: 0, vz: 0 };
  // while held: the held point in the card's own directions, and that point's smoothed position and velocity
  let held = null;
  let snapping = false;
  const raised = { by: 0 }; // 0 to 1: how far the mouse or pen over the card has picked it up
  let frame = 0;
  let last = 0;

  const turn = (x, y, angle) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
  });
  const home = () => ({ x: card.offsetLeft + card.offsetWidth / 2, y: card.offsetTop + card.offsetHeight / 2 });
  const inertia = () => (card.offsetWidth ** 2 + card.offsetHeight ** 2) / 12; // per unit of mass
  const local = (clientX, clientY) => {
    const box = hero.getBoundingClientRect();
    return { x: clientX - box.left, y: clientY - box.top };
  };

  // Keeps the four corners inside the hero. A moving card gets an impulse at the corner that hit, so a glancing or
  // off-centre hit changes its spin as well as its direction.
  function walls() {
    const origin = home();
    const halfW = card.offsetWidth / 2;
    const halfH = card.offsetHeight / 2;
    const corners = () => [[-halfW, -halfH], [halfW, -halfH], [halfW, halfH], [-halfW, halfH]]
      .map(([x, y]) => turn(x, y, state.angle));
    // inward normal of each edge and how far a point at (x, y) is past it
    [
      { nx: 1, ny: 0, past: (x) => -x },
      { nx: -1, ny: 0, past: (x) => x - hero.clientWidth },
      { nx: 0, ny: 1, past: (x, y) => -y },
      { nx: 0, ny: -1, past: (x, y) => y - hero.clientHeight },
    ].forEach(({ nx, ny, past }) => {
      let deepest = 0;
      let contact = null;
      corners().forEach((corner) => {
        const depth = past(origin.x + state.x + corner.x, origin.y + state.y + corner.y);
        if (depth > deepest) { deepest = depth; contact = corner; }
      });
      if (!contact) return;
      state.x += nx * deepest;
      state.y += ny * deepest;
      if (held) return;
      // velocity of the corner = velocity of the centre + spin
      const cx = state.vx - state.spin * contact.y;
      const cy = state.vy + state.spin * contact.x;
      const into = cx * nx + cy * ny;
      if (into >= 0) return;
      const push = (axisX, axisY, size) => {
        state.vx += axisX * size;
        state.vy += axisY * size;
        state.spin += ((contact.x * axisY - contact.y * axisX) * size) / inertia();
      };
      const mass = (axisX, axisY) => 1 / (1 + (contact.x * axisY - contact.y * axisX) ** 2 / inertia());
      const hit = -(1 + BOUNCE) * into * mass(nx, ny);
      push(nx, ny, hit);
      const along = cx * -ny + cy * nx;
      push(-ny, nx, clamp(-along * mass(-ny, nx), -GRIP * hit, GRIP * hit));
      state.spin = clamp(state.spin, -MAX_SPIN, MAX_SPIN);
    });
  }

  function paint() {
    const space = parseFloat(getComputedStyle(card).paddingTop) * 0.8 || 16;
    const height = Math.max(state.z, raised.by * HOVER_LIFT);
    // the hover shift fades out as a pick-up takes over
    const shift = HOVER_SHIFT * raised.by * Math.max(0, 1 - state.z);
    const offset = space * SHADOW * height;
    // the light is fixed (top left), the shadow is drawn in the card's own directions: turn the offset back
    const shadow = turn(offset, offset, -state.angle);
    card.style.setProperty('--dx', `${state.x - shift}px`);
    card.style.setProperty('--dy', `${state.y - shift}px`);
    card.style.setProperty('--angle', `${state.angle}rad`);
    card.style.setProperty('--lift', height.toFixed(3));
    card.style.setProperty('--shadow-x', `${shadow.x.toFixed(2)}px`);
    card.style.setProperty('--shadow-y', `${shadow.y.toFixed(2)}px`);
    card.classList.toggle('is-up', height > 0);
  }

  // One small time step of the card in the hand: the held point chases the pointer, and the card, which has its weight
  // at its centre, swings round that point as it accelerates.
  function carry(dt) {
    const damping = 2 * Math.sqrt(FOLLOW);
    const ax = (held.targetX - held.px) * FOLLOW - held.pvx * damping;
    const ay = (held.targetY - held.py) * FOLLOW - held.pvy * damping;
    held.pvx += ax * dt;
    held.pvy += ay * dt;
    held.px += held.pvx * dt;
    held.py += held.pvy * dt;
    if (!reduced.matches) {
      const arm = turn(-held.x, -held.y, state.angle); // from the held point to the centre
      const swing = -(arm.x * ay - arm.y * ax) / (inertia() + arm.x ** 2 + arm.y ** 2);
      state.spin = clamp((state.spin + swing * dt) * Math.exp(-HELD_SPIN_DRAG * dt), -MAX_SPIN, MAX_SPIN);
      state.angle += state.spin * dt;
    }
    const arm = turn(-held.x, -held.y, state.angle);
    const origin = home();
    state.x = held.px + arm.x - origin.x;
    state.y = held.py + arm.y - origin.y;
    // the centre moves with the held point plus the swing round it
    state.vx = held.pvx - state.spin * arm.y;
    state.vy = held.pvy + state.spin * arm.x;
  }

  // let go: in the air until gravity brings it down, then scraping on the table
  function fly(dt) {
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    state.angle += state.spin * dt;
    const airborne = state.z > 0;
    const slow = Math.exp(-(airborne ? AIR_DRAG : TABLE_FRICTION) * dt);
    state.vx *= slow;
    state.vy *= slow;
    state.spin *= slow;
    if (!airborne) return;
    state.vz -= GRAVITY * dt;
    state.z += state.vz * dt;
    if (state.z <= 0) { // touch down: paper does not bounce back up
      state.z = 0;
      state.vz = 0;
      state.vx *= LANDING;
      state.vy *= LANDING;
      state.spin *= LANDING;
    }
  }

  const nearHome = () => Math.hypot(state.x, state.y) < SNAP_RANGE;
  // the resting angle, the whole turn closest to how the card lies now
  const restAngle = () => REST_ANGLE + Math.round((state.angle - REST_ANGLE) / (2 * Math.PI)) * 2 * Math.PI;

  // pulled into its outline: position, angle and height ease home together
  function snap(dt) {
    const damping = 2 * Math.sqrt(SNAP);
    state.vx += (-state.x * SNAP - state.vx * damping) * dt;
    state.vy += (-state.y * SNAP - state.vy * damping) * dt;
    state.spin += ((restAngle() - state.angle) * SNAP - state.spin * damping) * dt;
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    state.angle += state.spin * dt;
    state.z *= Math.exp(-14 * dt);
  }
  function snapped() {
    Object.assign(state, { x: 0, y: 0, vx: 0, vy: 0, angle: REST_ANGLE, spin: 0, z: 0, vz: 0 });
    snapping = false;
  }

  function step(now) {
    const elapsed = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
    last = now;
    const parts = 4;
    for (let i = 0; i < parts; i += 1) {
      if (held) carry(elapsed / parts);
      else if (snapping) snap(elapsed / parts);
      else {
        fly(elapsed / parts);
        snapping = !reduced.matches && nearHome() && Math.hypot(state.vx, state.vy) < SNAP_SPEED;
      }
      walls();
    }
    if (snapping && Math.hypot(state.x, state.y) < 0.5 && Math.abs(restAngle() - state.angle) < 0.005
      && Math.hypot(state.vx, state.vy) < 5) snapped();
    spot.classList.toggle('is-near', Boolean(held) && nearHome());
    // picked up quickly, into the hand
    if (held) state.z += (1 - state.z) * (1 - Math.exp(-18 * elapsed));
    const moving = snapping || state.z > 0 || Math.hypot(state.vx, state.vy) > 10 || Math.abs(state.spin) > 0.08;
    if (!held && !moving) Object.assign(state, { vx: 0, vy: 0, spin: 0 });
    paint();
    frame = held || moving ? requestAnimationFrame(step) : 0;
  }
  const run = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  // Under the pointer it is picked up a little: the card eases up and to the left, away from the light, and its shadow
  // opens up to the lower right.
  const hover = (over) => (event) => {
    if (event.pointerType === 'touch') return;
    const to = over ? 1 : 0;
    if (!window.gsap || reduced.matches) {
      raised.by = to;
      paint();
    } else window.gsap.to(raised, { by: to, duration: over ? 0.22 : 0.3, ease: over ? 'back.out(2)' : 'power2.out', onUpdate: paint, overwrite: true });
  };
  card.addEventListener('pointerenter', hover(true));
  card.addEventListener('pointerleave', hover(false));

  card.addEventListener('pointerdown', (event) => {
    if (event.button > 0 || event.pointerType === 'touch') return;
    event.preventDefault();
    card.setPointerCapture(event.pointerId);
    place();
    snapping = false;
    const point = local(event.clientX, event.clientY);
    const origin = home();
    const grip = turn(point.x - origin.x - state.x, point.y - origin.y - state.y, -state.angle);
    held = {
      id: event.pointerId,
      x: grip.x,
      y: grip.y,
      targetX: point.x,
      targetY: point.y,
      px: point.x,
      py: point.y,
      pvx: 0,
      pvy: 0,
    };
    state.vx = 0;
    state.vy = 0;
    state.spin = 0;
    card.classList.add('is-held');
    run();
  });
  card.addEventListener('pointermove', (event) => {
    if (!held || event.pointerId !== held.id) return;
    const point = local(event.clientX, event.clientY);
    held.targetX = point.x;
    held.targetY = point.y;
  });
  // let go: the card keeps the speed and spin it has at that moment
  const release = (event) => {
    if (!held || event.pointerId !== held.id) return;
    held = null;
    const speed = Math.hypot(state.vx, state.vy);
    const thrown = event.type !== 'pointercancel' && !reduced.matches;
    if (!thrown) Object.assign(state, { vx: 0, vy: 0, spin: 0 });
    else if (speed > MAX_SPEED) {
      state.vx *= MAX_SPEED / speed;
      state.vy *= MAX_SPEED / speed;
    }
    state.vz = thrown ? Math.min(MAX_TOSS, speed * TOSS) : 0;
    if (reduced.matches) {
      state.z = 0;
      if (nearHome()) snapped();
    } else snapping = nearHome() && speed < SNAP_SPEED;
    card.classList.remove('is-held');
    run();
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
  card.addEventListener('lostpointercapture', release);

  // a smaller window must not leave the card outside it
  window.addEventListener('resize', () => {
    if (!card.style.getPropertyValue('--dx')) return;
    walls();
    paint();
  });
})();
