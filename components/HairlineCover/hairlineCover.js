// Shadow DOM isolates the supplied SVG engine from the site's global reset.
class HairlineCover extends HTMLElement {
  connectedCallback() {
    if (this.observer) return;
    const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
    const delivery = this.getAttribute('figure') === 'delivery';
    this.style.setProperty('--hairline-stage-offset', delivery ? '-50%' : '-57.5%');
    shadow.innerHTML = `<style>
      :host { display: block; position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; }
      [hidden] { display: none !important; }
      /* Crop the original canvas, keeping its coordinates and pointer hit
         testing intact. The visible artwork sits below the SVG's midpoint. */
      .stage { position: absolute; left: 0; top: 50%; width: 100%; height: auto; aspect-ratio: 5 / 4; transform: translateY(var(--hairline-stage-offset)); }
      .stage:focus-visible { outline: var(--space-hairline) solid var(--color-focus); outline-offset: var(--space-xs); }
      .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
      ::slotted(img) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    </style><div class="stage" hidden data-hairline="component-tray" data-hairline-theme="light"
      tabindex="0" role="group" aria-describedby="instructions"></div>
      <span class="sr-only" id="instructions"></span><span class="sr-only" id="state" aria-live="polite"></span>
      <slot></slot>`;
    const stage = shadow.querySelector('.stage');
    stage.dataset.hairline = delivery ? 'delivery' : 'component-tray';
    const isZh = this.getAttribute('lang') === 'zh';
    stage.setAttribute('aria-label', delivery
      ? (isZh ? 'KeepWell 醫療設備配送插畫' : 'KeepWell medical device delivery')
      : (isZh ? '可互動的設計系統元件插畫' : 'Interactive design system components'));
    shadow.querySelector('#instructions').textContent = delivery
      ? (isZh ? '設備會自動配送。使用左右方向鍵選擇工廠或醫院，按 Enter 或空白鍵查看閒置時的庫存。'
        : 'Delivery runs automatically. Use left and right arrows to choose the factory or hospital. Press Enter or Space to inspect stock when its loading bay is free.')
      : isZh
      ? '使用左右方向鍵選擇卡片、按鈕或開關，按 Enter 或空白鍵操作。'
      : 'Use left and right arrow keys to select the card, button or switch. Press Enter or Space to interact.';
    const session = {};
    this.session = session;
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.observer.disconnect();
        this.mountFigure(stage, shadow, session);
      }
    }, { rootMargin: '200px' });
    this.observer.observe(this);
  }

  async mountFigure(stage, shadow, session) {
    try {
      const delivery = this.getAttribute('figure') === 'delivery';
      const { HL, mount } = delivery ? await import('./delivery.js?v=acc34d04') : await import('./componentTray.js?v=d36714da');
      if (!this.isConnected || this.session !== session) return;
      HL.inject(shadow);
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
      let keyboard = false;
      const state = shadow.querySelector('#state');
      const read = { set textContent(value) { if (keyboard && state.textContent !== value) state.textContent = value; } };
      this.figure = mount({ stage, svg, read }, delivery ? 2.6 : 12);
      // Projected centres of the card, button and switch in this figure.
      const stops = delivery ? [[153, 92], [294, 124]] : [[161, 145], [278, 169], [218, 210]];
      let selected = 0;
      const point = (type) => {
        const [x, y] = stops[selected];
        const rect = stage.getBoundingClientRect();
        stage.dispatchEvent(new PointerEvent(type, {
          pointerType: 'mouse', pointerId: 1, bubbles: true,
          clientX: rect.left + x / 400 * rect.width,
          clientY: rect.top + y / 320 * rect.height,
        }));
      };
      const focus = () => { keyboard = true; point('pointermove'); };
      const blur = () => { keyboard = false; stage.dispatchEvent(new PointerEvent('pointerleave')); };
      const keydown = (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        keyboard = true;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          selected = (selected + (event.key === 'ArrowRight' ? 1 : stops.length - 1)) % stops.length;
          point('pointermove');
        } else point('pointerdown');
      };
      const pointer = (event) => { if (event.isTrusted) keyboard = false; };
      stage.addEventListener('focus', focus);
      stage.addEventListener('blur', blur);
      stage.addEventListener('keydown', keydown);
      stage.addEventListener('pointermove', pointer, true);
      this.removeInput = () => {
        stage.removeEventListener('focus', focus);
        stage.removeEventListener('blur', blur);
        stage.removeEventListener('keydown', keydown);
        stage.removeEventListener('pointermove', pointer, true);
      };
      stage.hidden = false;
      shadow.querySelector('slot').hidden = true;
      if (!delivery) {
        // Match the updated source's automatic demo; real pointer/keyboard
        // input takes over, then the engine resumes when the user leaves.
        this.tour = HL.tour(stage, [[284, 170], [220, 216], [160, 146], null], null, 1.3);
      }
      this.dataset.ready = 'true';
    } catch (error) {
      // Keep the existing project image usable if the optional figure fails.
      this.tour?.stop();
      this.tour = null;
      this.figure?.destroy();
      this.figure = null;
      stage.hidden = true;
      shadow.querySelector('slot').hidden = false;
      console.warn('Hairline cover could not load; showing project image.', error);
    }
  }

  disconnectedCallback() {
    this.session = null;
    this.observer?.disconnect();
    this.observer = null;
    this.removeInput?.();
    this.tour?.stop();
    this.tour = null;
    this.figure?.destroy();
    this.figure = null;
    delete this.dataset.ready;
  }
}

if (!customElements.get('hairline-cover')) customElements.define('hairline-cover', HairlineCover);
export default HairlineCover;
