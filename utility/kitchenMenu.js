(function () {
  const section = document.querySelector('.section--kitchenMenu');
  if (!section) return;
  const kitchen = window.__HOME_PAGE_CONTENT__[document.documentElement.lang === 'zh' ? 'zh' : 'en'].kitchen;
  const { items, courses, labels } = kitchen;
  const overlay = section.querySelector('.kitchenMenu__overlay');
  const sheet = overlay.querySelector('.kitchenMenu__sheet');
  // Keep the fixed overlay outside any entrance-animation stacking context.
  document.body.append(overlay);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const pad = (n) => String(n).padStart(2, '0');
  const flame = '<svg viewBox="0 0 11 14" aria-hidden="true"><path d="M5.5 13C2.5 13 1 11 1 8.6 1 6 3.4 4.6 4 1.2c2.4 1.6 3.3 3.4 3 5.4.8-.5 1.4-1.3 1.6-2.2C9.6 5.6 10 7 10 8.6 10 11 8.5 13 5.5 13Z"/></svg>';
  const flames = (n) => `<span class="kitchenMenu__effort" role="img" aria-label="Effort ${n} of 3">${[1, 2, 3].map((k) => `<span class="${k > n ? 'is-off' : ''}">${flame}</span>`).join('')}</span>`;
  const leader = '<span class="kitchenMenu__leader" aria-hidden="true"></span>';
  // Tabler Icons (outline): chevron-left, chevron-right, x.
  const ICON_PATHS = {
    chevronLeft: '<path d="M15 6l-6 6l6 6"/>',
    chevronRight: '<path d="M9 6l6 6l-6 6"/>',
    x: '<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>',
  };
  const icon = (name) => `<svg class="kitchenMenu__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
  const row = (label, value) => `<div class="kitchenMenu__metaRow"><dt>${escape(label)}</dt><dd>${leader}${value}</dd></div>`;
  let current = null;
  let trigger = null;
  let savedScroll;
  let background = [];
  let frame;

  function render(index, focusAction) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const course = courses.find((entry) => entry.key === item.course);
    const ingredients = item.ingredients?.length ? `<div><h3 class="kitchenMenu__h">${escape(labels.ingredients)}</h3><ul class="kitchenMenu__ings">${item.ingredients.map((entry) => `<li class="kitchenMenu__ingRow"><span>${escape(entry.name)}</span>${leader}<span class="kitchenMenu__qty">${escape(entry.qty)}</span></li>`).join('')}</ul></div>` : '';
    const method = item.steps?.length ? `<div><h3 class="kitchenMenu__h">${escape(labels.method)}</h3><ol class="kitchenMenu__steps">${item.steps.map((step, i) => `<li class="kitchenMenu__step"><button type="button" data-step="${i}" aria-pressed="false"><span class="kitchenMenu__node">${pad(i + 1)}</span><span>${escape(step)}</span></button></li>`).join('')}</ol></div>` : '';
    sheet.innerHTML = `<div class="kitchenMenu__sheetIn">
      <div class="kitchenMenu__sheetTop"><div class="kitchenMenu__nav"><button type="button" class="kitchenMenu__iconBtn" data-go="-1" aria-label="${escape(labels.prev)}">${icon('chevronLeft')}</button><button type="button" class="kitchenMenu__iconBtn" data-go="1" aria-label="${escape(labels.next)}">${icon('chevronRight')}</button></div><button type="button" class="kitchenMenu__iconBtn kitchenMenu__close" aria-label="${escape(labels.close)}">${icon('x')}</button></div>
      <div class="kitchenMenu__hero"><div class="kitchenMenu__photo"><img src="${escape(item.imageSrc.replace(/^\//, './'))}" alt="${escape(item.imageAlt)}"></div><div>
        <h2 class="kitchenMenu__sZh" id="kitchen-recipe-name">${escape(item.nameZh)}</h2><p class="kitchenMenu__sEn">${escape(item.nameEn)}</p><p class="kitchenMenu__sNote">${escape(item.note)}</p>
        <dl class="kitchenMenu__meta">${row(labels.effort, flames(item.effort))}${item.time ? row(labels.time, escape(item.time)) : ''}${row(labels.course, escape(`${course.zh} ${course.en}`))}</dl>
      </div></div>
      ${ingredients || method ? `<div class="kitchenMenu__cols">${ingredients}${method}</div>` : `<p class="kitchenMenu__comingSoon">${escape(labels.comingSoon)}</p>`}
    </div>`;
    sheet.scrollTop = 0;
    if (frame) cancelAnimationFrame(frame);
    const image = sheet.querySelector('.kitchenMenu__photo img');
    // Commit the concealed state before starting each new photo wipe.
    image.getBoundingClientRect();
    frame = requestAnimationFrame(() => image.classList.add('is-revealed'));
    (focusAction ? sheet.querySelector(focusAction) : sheet).focus({ preventScroll: true });
  }

  function open(index, button) {
    trigger = button;
    const body = document.body;
    const html = document.documentElement;
    savedScroll = { body: body.style.overflow, html: html.style.overflow, lenisStopped: window.lenis?.isStopped };
    window.lenis?.stop();
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    // Isolate the dialog from both pointer and assistive-technology navigation.
    background = [...body.children].filter((node) => node !== overlay && !['SCRIPT', 'STYLE', 'LINK'].includes(node.tagName)).map((node) => [node, node.inert]);
    background.forEach(([node]) => { node.inert = true; });
    overlay.inert = false;
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    render(index);
  }

  function close() {
    if (current === null) return;
    overlay.classList.remove('is-open');
    overlay.inert = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = savedScroll.body;
    document.documentElement.style.overflow = savedScroll.html;
    if (!savedScroll.lenisStopped) window.lenis?.start();
    background.forEach(([node, inert]) => { node.inert = inert; });
    current = null;
    trigger?.focus({ preventScroll: true });
  }

  // Hover preview: the dish photo follows the cursor (mouse only; touch has
  // no hover, so phones go straight to the sheet).
  const menuEl = section.querySelector('.kitchenMenu__menu');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const peek = document.createElement('div');
    peek.className = 'kitchenMenu__peek';
    peek.setAttribute('aria-hidden', 'true');
    peek.innerHTML = '<img alt="">';
    document.body.append(peek);
    const peekImg = peek.querySelector('img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const OFFSET_X = 96; // gap between cursor and the preview's near edge, so it clears the dish name
    let target = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let raf = null;
    const place = () => { peek.style.transform = `translate(${pos.x}px, ${pos.y}px)`; };
    const loop = () => {
      const ease = reduceMotion.matches ? 1 : 0.2;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      place();
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5 ? requestAnimationFrame(loop) : null;
    };
    const aim = (event) => {
      const w = peek.offsetWidth, h = peek.offsetHeight;
      let x = event.clientX + OFFSET_X;
      if (x + w > window.innerWidth) x = event.clientX - OFFSET_X - w;
      target = { x, y: Math.min(Math.max(event.clientY - h / 2, 0), window.innerHeight - h) };
    };
    const hide = () => peek.classList.remove('is-on');
    menuEl.addEventListener('mousemove', (event) => {
      aim(event);
      if (!raf) raf = requestAnimationFrame(loop);
    });
    menuEl.addEventListener('mouseover', (event) => {
      const dish = event.target.closest('.kitchenMenu__dish');
      if (!dish || current !== null) return hide();
      const item = items[Number(dish.dataset.index)];
      const src = item.imageSrc.replace(/^\//, './');
      if (peekImg.getAttribute('src') !== src) peekImg.src = src;
      if (!peek.classList.contains('is-on')) { aim(event); pos = { ...target }; place(); }
      peek.classList.add('is-on');
    });
    menuEl.addEventListener('mouseleave', hide);
    menuEl.addEventListener('click', hide);
    window.addEventListener('scroll', hide, { passive: true });
  }

  menuEl.addEventListener('click', (event) => {
    const button = event.target.closest('.kitchenMenu__dish');
    if (button) open(Number(button.dataset.index), button);
  });
  overlay.querySelector('.kitchenMenu__scrim').addEventListener('click', close);
  sheet.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('.kitchenMenu__close')) close();
    else if (button.hasAttribute('data-go')) render(current + Number(button.dataset.go), `[data-go="${button.dataset.go}"]`);
    else if (button.hasAttribute('data-step')) {
      const steps = [...sheet.querySelectorAll('.kitchenMenu__step')];
      const index = Number(button.dataset.step);
      steps.forEach((step, i) => {
        step.classList.toggle('is-past', i <= index);
        step.classList.toggle('is-current', i === index);
        step.querySelector('button').setAttribute('aria-pressed', String(i <= index));
      });
    }
  });
  // Horizontal swipe on the sheet moves to the previous/next dish. Only a
  // clearly horizontal gesture counts, so vertical scrolling stays untouched.
  const SWIPE_MIN_PX = 56;
  let touchStart = null;
  sheet.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  sheet.addEventListener('touchend', (event) => {
    if (!touchStart || current === null) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    render(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (current === null) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      render(current + (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === 'Tab') {
      const buttons = [...sheet.querySelectorAll('button')];
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === sheet)) { event.preventDefault(); first.focus(); }
    }
  });
})();
