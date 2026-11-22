// Image zoom for project pages.
//
// Tap an image: it grows from its place to fit the screen (the clone is moved with one transform, so the
// animation is a cheap FLIP). Once it is open you can keep zooming: pinch with two fingers, scroll the wheel
// (or pinch on a trackpad) to zoom at the cursor, drag to pan. Tap / click the picture at fit size, tap the
// dark area, press Escape or use the close button to put it back. Tapping a zoomed picture returns to fit size.
"use strict";

(function () {
  const MARGIN = 16; // gap between a fitted picture and the screen edge
  const MAX_ZOOM = 4; // times the fitted size
  const OPEN_MS = 380;
  const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
  const TAP_SLOP = 6; // px a finger may move and still count as a tap

  let backdrop = null;
  let closeButton = null;
  let active = null; // the viewer currently open

  function ensureChrome() {
    if (!backdrop) {
      backdrop = document.querySelector("[data-zoom-backdrop]");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.setAttribute("data-zoom-backdrop", "");
        document.body.appendChild(backdrop);
      }
    }
    if (!closeButton) {
      closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.setAttribute("data-zoom-close", "");
      closeButton.setAttribute("aria-label", "Close image");
      closeButton.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
      document.body.appendChild(closeButton);
    }
  }

  class Viewer {
    constructor(image) {
      this.image = image;
      this.clone = null;
      this.pointers = new Map();
      this.state = { s: 1, x: 0, y: 0 }; // clone transform: translate(x, y) scale(s), origin top left
      this.fit = 1;
      this.rect = null;
      this.gesture = null;
      this.frame = 0;
      this.onKey = this.onKey.bind(this);
      this.onResize = this.onResize.bind(this);
      this.onScroll = this.onScroll.bind(this);
      this.onWheel = this.onWheel.bind(this);
      this.close = this.close.bind(this);
      image.addEventListener("click", () => this.open());
    }

    get vw() {
      return window.innerWidth;
    }
    get vh() {
      return window.innerHeight;
    }

    open() {
      if (active) return;
      active = this;
      ensureChrome();
      this.rect = this.image.getBoundingClientRect();
      const { left, top, width, height } = this.rect;

      const clone = this.image.cloneNode(true);
      clone.removeAttribute("data-zoom-image");
      clone.removeAttribute("id");
      clone.setAttribute("data-zoom-clone", "");
      clone.setAttribute("aria-hidden", "true");
      clone.draggable = false;
      Object.assign(clone.style, {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: "none",
      });
      document.body.appendChild(clone);
      this.clone = clone;
      this.image.style.visibility = "hidden";
      this.scrollAtOpen = window.scrollY;
      if (window.lenis) window.lenis.stop(); // the page behind must not scroll while the picture is open
      this.lastWidth = this.vw;

      this.measure();
      backdrop.setAttribute("data-zoom-backdrop", "active");
      closeButton.setAttribute("data-zoom-close", "active");

      // Start the transition on the next frame so the browser has painted the starting position.
      requestAnimationFrame(() => {
        if (active !== this) return;
        this.animate(this.fitState());
      });

      clone.addEventListener("pointerdown", (event) => this.onPointerDown(event));
      clone.addEventListener("pointermove", (event) => this.onPointerMove(event));
      clone.addEventListener("pointerup", (event) => this.onPointerUp(event));
      clone.addEventListener("pointercancel", (event) => this.onPointerUp(event, true));
      clone.addEventListener("wheel", this.onWheel, { passive: false });
      backdrop.addEventListener("wheel", this.onWheel, { passive: false });
      backdrop.addEventListener("click", this.close);
      closeButton.addEventListener("click", this.close);
      document.addEventListener("keydown", this.onKey);
      window.addEventListener("resize", this.onResize);
      window.addEventListener("scroll", this.onScroll, { passive: true });
    }

    // The size the picture has when it is fitted to the screen, and the matching transform.
    measure() {
      const { width, height } = this.rect;
      this.fit = Math.min((this.vw - MARGIN * 2) / width, (this.vh - MARGIN * 2) / height);
    }

    fitState() {
      return this.clamp({ s: this.fit, x: 0, y: 0 }, true);
    }

    // Keep the picture on screen: centred while smaller than the screen, edge-to-edge otherwise.
    clamp(state, center) {
      const { left, top, width, height } = this.rect;
      const s = Math.min(this.fit * MAX_ZOOM, Math.max(this.fit * 0.6, state.s));
      const w = width * s;
      const h = height * s;
      let x = state.x;
      let y = state.y;
      const fitted = s <= this.fit * 1.001;
      if (center || fitted || w <= this.vw) x = (this.vw - w) / 2 - left;
      else x = Math.min(-left, Math.max(this.vw - w - left, x));
      if (center || fitted || h <= this.vh) y = (this.vh - h) / 2 - top;
      else y = Math.min(-top, Math.max(this.vh - h - top, y));
      return { s, x, y };
    }

    paint() {
      this.frame = 0;
      const { s, x, y } = this.state;
      this.clone.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    }

    // Immediate (during a gesture).
    set(state) {
      this.state = state;
      if (!this.frame) this.frame = requestAnimationFrame(() => this.paint());
    }

    // Animated (open, reset to fit, close).
    animate(state, done) {
      this.state = state;
      const clone = this.clone;
      clone.style.transition = `transform ${OPEN_MS}ms ${EASE}`;
      clone.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.s})`;
      const finish = () => {
        clone.removeEventListener("transitionend", finish);
        clone.style.transition = "none";
        if (done) done();
      };
      clone.addEventListener("transitionend", finish);
    }

    // Zoom by `factor` keeping the screen point (cx, cy) fixed under the finger / cursor.
    zoomAt(cx, cy, factor, base = this.state) {
      const { left, top } = this.rect;
      const s = Math.min(this.fit * MAX_ZOOM, Math.max(this.fit, base.s * factor));
      const k = s / base.s;
      return this.clamp({
        s,
        x: cx - left - k * (cx - left - base.x),
        y: cy - top - k * (cy - top - base.y),
      });
    }

    onWheel(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.clone) return;
      this.clone.style.transition = "none";
      // Trackpad pinch arrives as ctrl+wheel with small deltas, a mouse wheel as larger steps.
      const speed = event.ctrlKey ? 0.01 : 0.0018;
      const factor = Math.exp(-event.deltaY * speed);
      if (!event.ctrlKey && this.state.s <= this.fit * 1.001 && event.deltaY > 0) return; // already fitted
      this.set(this.zoomAt(event.clientX, event.clientY, factor));
    }

    onPointerDown(event) {
      if (event.button > 0) return;
      event.preventDefault();
      this.clone.setPointerCapture(event.pointerId);
      this.clone.style.transition = "none";
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, sx: event.clientX, sy: event.clientY });
      this.beginGesture();
      this.gesture.startedAt = performance.now();
    }

    beginGesture() {
      const points = [...this.pointers.values()];
      this.gesture = {
        base: { ...this.state },
        moved: this.gesture ? this.gesture.moved : false,
        startedAt: this.gesture ? this.gesture.startedAt : performance.now(),
        a: points[0],
        b: points[1] || null,
        startDist: points[1] ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0,
        startMid: points[1] ? { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 } : null,
        origin: points[0] ? { x: points[0].x, y: points[0].y } : null,
      };
    }

    onPointerMove(event) {
      const point = this.pointers.get(event.pointerId);
      if (!point || !this.gesture) return;
      point.x = event.clientX;
      point.y = event.clientY;
      if (Math.hypot(point.x - point.sx, point.y - point.sy) > TAP_SLOP) this.gesture.moved = true;
      const points = [...this.pointers.values()];
      const g = this.gesture;
      if (points.length >= 2 && g.startDist) {
        // Pinch: scale by the change of finger distance, move with the midpoint.
        const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        const mid = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
        const zoomed = this.zoomAt(g.startMid.x, g.startMid.y, dist / g.startDist, g.base);
        this.set(this.clamp({ s: zoomed.s, x: zoomed.x + (mid.x - g.startMid.x), y: zoomed.y + (mid.y - g.startMid.y) }));
      } else if (points.length === 1 && this.state.s > this.fit * 1.001) {
        // Pan, only when zoomed in.
        this.set(this.clamp({ s: g.base.s, x: g.base.x + (point.x - g.origin.x), y: g.base.y + (point.y - g.origin.y) }));
      }
    }

    onPointerUp(event, cancelled) {
      if (!this.pointers.has(event.pointerId)) return;
      const wasMoved = this.gesture && this.gesture.moved;
      const wasPinch = this.pointers.size > 1;
      this.pointers.delete(event.pointerId);
      if (this.pointers.size) {
        this.beginGesture(); // one finger left after a pinch: carry on panning from here
        this.gesture.moved = true;
        return;
      }
      this.gesture = null;
      if (cancelled || wasMoved || wasPinch) {
        // Springs back into bounds; a pinch that ended smaller than fit snaps to fit.
        const next = this.clamp(this.state);
        if (next.s <= this.fit * 1.02) this.animate(this.fitState());
        return;
      }
      // A plain tap: at fit size it closes, when zoomed it returns to fit size.
      if (this.state.s <= this.fit * 1.02) this.close();
      else this.animate(this.fitState());
    }

    onKey(event) {
      if (event.key === "Escape") this.close();
    }

    onResize() {
      // Phones fire "resize" when their address bar shows or hides; only a real width change re-fits.
      if (this.lastWidth === this.vw) return;
      this.lastWidth = this.vw;
      this.rect = this.image.getBoundingClientRect();
      this.measure();
      this.clone.style.transition = "none";
      this.state = this.fitState();
      this.paint();
    }

    onScroll() {
      // The page can still move with the keyboard; a long scroll means the reader left the picture.
      if (Math.abs(window.scrollY - this.scrollAtOpen) > 120) this.close();
    }

    close() {
      if (active !== this || this.closing) return;
      this.closing = true;
      backdrop.setAttribute("data-zoom-backdrop", "");
      closeButton.setAttribute("data-zoom-close", "");
      window.removeEventListener("resize", this.onResize);
      window.removeEventListener("scroll", this.onScroll);
      document.removeEventListener("keydown", this.onKey);
      backdrop.removeEventListener("click", this.close);
      backdrop.removeEventListener("wheel", this.onWheel);
      closeButton.removeEventListener("click", this.close);
      cancelAnimationFrame(this.frame);
      // Back to where the picture came from (its page may have moved a little since it opened).
      const now = this.image.getBoundingClientRect();
      const home = { s: now.width / this.rect.width, x: now.left - this.rect.left, y: now.top - this.rect.top };
      this.animate(home, () => this.cleanup());
    }

    cleanup() {
      if (this.clone) this.clone.remove();
      this.clone = null;
      this.image.style.visibility = "";
      this.pointers.clear();
      this.gesture = null;
      this.closing = false;
      active = null;
      if (window.lenis) window.lenis.start();
    }
  }

  document.querySelectorAll("[data-zoom-image]").forEach((image) => new Viewer(image));
})();
