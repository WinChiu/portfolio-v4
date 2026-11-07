import HL from './kernel.js?v=a41f71cc';

/** UI components demonstrate their own states: elevation, press and toggle. */
const {
  Cam, clamp, facing, fit, hull, open, poly, proj, ringAt, rrect, run, seg,
  prism, solid, put, tween, tset, tval, tdone, disposer, mk, pointer, register, unproj,
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, active = -1, switchOn = false, preview = false, pulsing = false;
  const C = Cam(45, 0.5, 1.82);
  fit(C, [[0, 0, 0], [150, 0, 0], [0, 108, 0], [150, 108, 0],
    [0, 0, 33], [150, 108, 33]], 200, 166);
  const P = proj(C), front = facing(C), root = mk("g", {}, svg);
  const outer = rrect(0, 0, 150, 108, 9, 12);
  const inner = rrect(4, 4, 146, 104, 5, 12);
  // Back of the shallow tray, followed by its inset floor.
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, 10)))), class: "sil" }, root);
  mk("path", { d: poly(ringAt(P, inner, 10)), class: "nf lo" }, root);
  mk("path", { d: open(ringAt(P, run(inner, (q) => !front(q)), 4)), class: "nf lo" }, root);

  const parts = [
    { name: "card", box: [14, 14, 70, 88], z: [7, 15] },
    { name: "button", box: [86, 17, 136, 42], z: [9, 19] },
    { name: "switch", box: [88, 65, 136, 89], z: [7, 13] },
  ].map((spec) => ({ ...spec, g: mk("g", {}, root), motion: tween(0), drawn: NaN }));
  parts.forEach((p) => { p.body = solid(p.g); });
  const card = parts[0], button = parts[1], toggle = parts[2];
  // A card has a media well, two text grooves and a small inset action.
  card.media = mk("path", { class: "lo" }, card.g);
  card.lines = mk("path", { class: "nf lo" }, card.g);
  card.action = mk("path", { class: "lo" }, card.g);
  // A button's inset face and a toggle's raised circular thumb distinguish them.
  button.face = mk("path", { class: "nf lo" }, button.g);
  toggle.thumb = solid(toggle.g);

  // Paint the near wall last: it hides the lower portions of its contents.
  const lr = (a) => a[0][0] <= a[a.length - 1][0] ? a : a.slice().reverse();
  const iF = lr(ringAt(P, run(inner, front), 10));
  const oT = lr(ringAt(P, run(outer, front), 10));
  const oB = lr(ringAt(P, run(outer, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, root);
  mk("path", { d: open(oT), class: "nf lo" }, root);
  mk("path", { d: open(iF), class: "nf lo" }, root);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, root);

  function outline(box, r, z) {
    return poly(ringAt(P, rrect(...box, r, 14), z));
  }
  function block(body, box, r, z0, z1) {
    const [x0, y0, x1, y1] = box, b = 1.1;
    const rr = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
    put(body, prism(P, front, rrect(...box, rr, 14),
      rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.6, rr - b), 14), z0, z1));
  }
  function draw(p, amount) {
    if (Math.abs(amount - p.drawn) < 0.00001) return;
    p.drawn = amount;
    if (p === card) {
      block(p.body, p.box, 8, 7 + amount, 15 + amount);
      card.media.setAttribute("d", outline([20, 20, 64, 49], 6, 15.1 + amount));
      card.lines.setAttribute("d", seg(P(22, 58, 15.2 + amount), P(59, 58, 15.2 + amount)) +
        seg(P(22, 64, 15.2 + amount), P(49, 64, 15.2 + amount)));
      card.action.setAttribute("d", outline([22, 72, 44, 81], 4.5, 15.2 + amount));
    } else if (p === button) {
      block(p.body, p.box, 12.5, 9, 19 - amount);
      button.face.setAttribute("d", outline([89, 20, 133, 39], 9.5, 19.1 - amount));
    } else {
      block(p.body, p.box, 12, 7, 13);
      const x = 91 + 24 * clamp(amount, 0, 1);
      block(toggle.thumb, [x, 68, x + 18, 86], 9, 13.1, 20);
    }
  }
  function highlight() {
    parts.forEach((p, i) => p.body.sil.classList.toggle("hi", i === (active < 0 ? 1 : active)));
  }
  function caption() {
    read.textContent = active < 0 ? "rest" : active === 0 ? "card · raised" :
      active === 1 ? "button · pressed" : "switch · " + (switchOn || preview ? "on" : "off");
  }
  const loop = register(stage, (_dt, now) => {
    if (pulsing && tdone(button.motion, now)) {
      pulsing = false; tset(button.motion, 0, now, 0);
      if (active === 1) read.textContent = "button · released";
    }
    let moving = false;
    parts.forEach((p) => { draw(p, tval(p.motion, now)); if (!tdone(p.motion, now)) moving = true; });
    return moving;
  });
  bag.add(loop.unregister);

  function hit([sx, sy]) {
    // Every hit uses the component's own fixed rest top, never its animated edge.
    let nearest = -1, distance = Infinity;
    parts.forEach((p, i) => {
      const [x, y] = unproj(C, sx, sy, p.z[1]);
      const [x0, y0, x1, y1] = p.box;
      const d = Math.hypot((x - (x0 + x1) / 2) / (x1 - x0), (y - (y0 + y1) / 2) / (y1 - y0));
      if (x >= x0 - 9 && x <= x1 + 9 && y >= y0 - 9 && y <= y1 + 9 && d < distance) {
        nearest = i; distance = d;
      }
    });
    return nearest;
  }
  function select(next) {
    if (next === active) return;
    active = next; preview = next === 2 && !switchOn; pulsing = false;
    const now = performance.now();
    tset(card.motion, next === 0 ? reach : 0, now, 0);
    tset(button.motion, next === 1 ? clamp(reach / 2, 3, 7) : 0, now, 0);
    tset(toggle.motion, switchOn || preview ? 1 : 0, now, 0);
    caption(); highlight(); loop.wake();
  }
  function down(point) {
    const next = hit(point);
    select(next);
    const now = performance.now();
    if (next === 2) {
      switchOn = !switchOn; preview = false;
      tset(toggle.motion, switchOn ? 1 : 0, now, 0);
    } else if (next === 1) {
      pulsing = true;
      tset(button.motion, clamp(reach / 2, 3, 7), now, 0);
    }
    caption(); highlight(); loop.wake();
  }
  bag.add(pointer(stage, { move: (p) => select(hit(p)), down, leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  parts.forEach((p) => draw(p, 0)); caption(); highlight();
  return {
    set: (v) => {
      reach = v;
      const now = performance.now();
      tset(card.motion, active === 0 ? reach : 0, now, 0);
      if (active === 1) tset(button.motion, clamp(reach / 2, 3, 7), now, 0);
      loop.wake();
    },
    destroy: bag.dispose,
  };
}

export { mount };
export { HL };
