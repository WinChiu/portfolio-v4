(function () {
  const section = document.querySelector('.section--kitchenMenu');
  if (!section) return;
  const kitchen = window.__HOME_PAGE_CONTENT__.en.kitchen;
  const { items, courses, labels } = kitchen;
  const overlay = section.querySelector('.kitchenMenu__overlay');
  const sheet = overlay.querySelector('.kitchenMenu__sheet');
  // Keep the fixed overlay outside any entrance-animation stacking context.
  document.body.append(overlay);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const pad = (n) => String(n).padStart(2, '0');
  const flames = (level) => UI.EffortMeter({ level });
  const leader = UI.Leader();
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

  function render(index, focusAction) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const course = courses.find((entry) => entry.key === item.course);
    const ingredients = item.ingredients?.length ? `<div><h3 class="kitchenMenu__h">${escape(labels.ingredients)}</h3><ul class="kitchenMenu__ings">${item.ingredients.map((entry) => `<li class="kitchenMenu__ingRow"><span>${escape(entry.name)}</span>${leader}<span class="kitchenMenu__qty">${escape(entry.qty)}</span></li>`).join('')}</ul></div>` : '';
    const method = item.steps?.length ? `<div><h3 class="kitchenMenu__h">${escape(labels.method)}</h3><ol class="kitchenMenu__steps">${item.steps.map((step, i) => `<li class="kitchenMenu__step"><div class="kitchenMenu__stepRow"><span class="kitchenMenu__node">${pad(i + 1)}</span><span>${escape(step)}</span></div></li>`).join('')}</ol></div>` : '';
    sheet.innerHTML = `<div class="kitchenMenu__sheetIn">
      <div class="kitchenMenu__sheetTop"><div class="kitchenMenu__nav"><button type="button" class="kitchenMenu__iconBtn" data-go="-1" aria-label="${escape(labels.prev)}">${icon('chevronLeft')}</button><button type="button" class="kitchenMenu__iconBtn" data-go="1" aria-label="${escape(labels.next)}">${icon('chevronRight')}</button></div><button type="button" class="kitchenMenu__iconBtn kitchenMenu__close" aria-label="${escape(labels.close)}">${icon('x')}</button></div>
      <div class="kitchenMenu__hero"><div class="kitchenMenu__photo"><img src="${escape(item.imageSrc.replace(/^\//, './'))}" alt="${escape(item.imageAlt)}"></div><div>
        <h2 class="kitchenMenu__sZh" lang="zh-Hant" id="kitchen-recipe-name">${escape(item.nameZh)}</h2><p class="kitchenMenu__sEn">${escape(item.nameEn)}</p>
        <dl class="kitchenMenu__meta">${row(labels.course, escape(course.en))}${item.time ? row(labels.time, escape(item.time)) : ''}${row(labels.effort, flames(item.effort))}</dl>
      </div></div>
      <p class="kitchenMenu__sNote">${escape(item.note)}</p>
      ${ingredients || method ? `<div class="kitchenMenu__cols">${ingredients}${method}</div>` : `<div class="kitchenMenu__empty"><img class="kitchenMenu__emptyArt" src="./img/sketch-chef-slicing.svg" alt=""><p class="kitchenMenu__comingSoon">${escape(labels.comingSoon)}</p><p class="kitchenMenu__emptyHint">Cleaning up the kitchen</p></div>`}
    </div>`;
    sheet.scrollTop = 0;
    (focusAction ? sheet.querySelector(focusAction) : sheet).focus({ preventScroll: true });
  }

  function open(index, button) {
    trigger = button;
    const body = document.body;
    const html = document.documentElement;
    savedScroll = { body: body.style.overflow, html: html.style.overflow, paddingRight: body.style.paddingRight, lenisStopped: window.lenis?.isStopped };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    if (scrollbarWidth > 0 && !getComputedStyle(html).scrollbarGutter.startsWith('stable')) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
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
    document.body.style.paddingRight = savedScroll.paddingRight;
    document.documentElement.style.overflow = savedScroll.html;
    if (!savedScroll.lenisStopped) window.lenis?.start();
    background.forEach(([node, inert]) => { node.inert = inert; });
    current = null;
    trigger?.focus({ preventScroll: true });
  }

  // The dish being looked at ("focus") gets its row inverted and its photo shown:
  //  - wide window with a mouse: the row under the cursor, with the photo following the cursor;
  //  - narrow window or touch screen: the row nearest the middle of the screen, with a photo card in the corner
  //    (tap it to open the recipe).
  // The row is worked out from the pointer position / scroll position on every frame, not from hover events:
  // browsers only refresh :hover and mouseover after scrolling stops, which made the photo lag behind.
  const menuEl = section.querySelector('.kitchenMenu__menu');
  const narrow = window.matchMedia('(max-width: 48rem)');
  const touch = window.matchMedia('(hover: none), (pointer: coarse)');
  const useDock = () => narrow.matches || touch.matches;
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rows = [...menuEl.querySelectorAll('.menu-item')];
  const srcOf = (row) => items[Number(row.dataset.index)].imageSrc.replace(/^\//, './');

  // Photos load a little before their row is reached, so they are ready when the row gets focus.
  const preloaded = new Set();
  const preload = (row) => {
    const src = srcOf(row);
    if (preloaded.has(src)) return;
    preloaded.add(src);
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  };
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { preload(entry.target); watcher.unobserve(entry.target); }
    }), { rootMargin: '900px 0px' });
    rows.forEach((row) => watcher.observe(row));
  } else rows.forEach(preload);

  const peek = hasMouse ? document.createElement('div') : null;
  let peekImg = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const OFFSET_X = 24;
  let target = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };
  let raf = null;
  let pointer = null; // last known cursor position, null when the cursor is outside the menu
  if (peek) {
    peek.className = 'kitchenMenu__peek';
    peek.setAttribute('aria-hidden', 'true');
    peek.innerHTML = '<img alt="">';
    document.body.append(peek);
    peekImg = peek.querySelector('img');
  }
  const place = () => { peek.style.transform = `translate(${pos.x}px, ${pos.y}px)`; };
  const loop = () => {
    const ease = reduceMotion.matches ? 1 : 0.2;
    pos.x += (target.x - pos.x) * ease;
    pos.y += (target.y - pos.y) * ease;
    place();
    raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5 ? requestAnimationFrame(loop) : null;
  };
  const aim = () => {
    if (!pointer) return;
    const w = peek.offsetWidth, h = peek.offsetHeight;
    let x = pointer.x + OFFSET_X;
    if (x + w > window.innerWidth) x = pointer.x - OFFSET_X - w;
    target = { x: Math.max(8, Math.min(x, window.innerWidth - w - 8)), y: Math.max(8, Math.min(pointer.y - 80, window.innerHeight - h - 8)) };
  };

  const dock = document.createElement('button');
  dock.type = 'button';
  dock.className = 'kitchenMenu__dock';
  dock.setAttribute('aria-hidden', 'true');
  dock.tabIndex = -1;
  dock.innerHTML = '<img alt=""><span class="kitchenMenu__peekHint mono">Tap for recipe →</span>';
  document.body.append(dock);
  const dockImg = dock.querySelector('img');

  let focused = null;
  const setFocus = (row) => {
    if (row === focused) return;
    if (focused) focused.classList.remove('is-focus');
    focused = row;
    if (!row) return;
    row.classList.add('is-focus');
    preload(row);
    const src = srcOf(row);
    [peekImg, dockImg].forEach((image) => {
      if (!image || image.getAttribute('src') === src) return;
      image.src = src;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !image.animate) return;
      image.animate([{ clipPath: 'inset(0 100% 0 0)', scale: '1.12' }, { clipPath: 'inset(0 0 0 0)', scale: '1' }],
        { duration: 320, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    });
  };

  // Page positions of the menu and each row; measured lazily and again whenever the menu's size changes.
  const rowSpots = { stale: true, top: 0, bottom: 0, centers: [] };
  function measureRows() {
    const offset = window.scrollY;
    const box = menuEl.getBoundingClientRect();
    rowSpots.top = box.top + offset;
    rowSpots.bottom = box.bottom + offset;
    rowSpots.centers = rows.map((candidate) => {
      const r = candidate.getBoundingClientRect();
      return r.top + offset + r.height / 2;
    });
    rowSpots.stale = false;
  }
  const staleRows = () => { rowSpots.stale = true; };
  window.addEventListener('resize', staleRows);
  if ('ResizeObserver' in window) { const watcher = new ResizeObserver(staleRows); watcher.observe(menuEl); watcher.observe(document.body); } // the page above may also change height

  const update = () => {
    let row = null;
    // the preview and the dock live in <body>: they must go when another page is shown (utility/homeNavigation.js)
    const offPage = document.body.classList.contains('is-paged') && !section.classList.contains('is-current');
    if (current === null && !offPage) {
      if (useDock()) {
        // Row positions are measured once (see measureRows) and compared with the scroll position, so scrolling
        // costs no layout reads at all.
        if (rowSpots.stale) measureRows();
        const mid = window.scrollY + window.innerHeight * 0.5;
        if (rowSpots.top < mid && rowSpots.bottom > mid) {
          let nearest = Infinity;
          rowSpots.centers.forEach((center, i) => {
            const distance = Math.abs(center - mid);
            if (distance < nearest) { nearest = distance; row = rows[i]; }
          });
        }
      } else if (pointer) {
        const hit = document.elementFromPoint(pointer.x, pointer.y);
        row = hit ? hit.closest('.menu-item') : null;
        if (row && !menuEl.contains(row)) row = null;
      }
    }
    setFocus(row);
    dock.classList.toggle('is-on', Boolean(row) && useDock());
    if (peek) {
      const show = Boolean(row) && !useDock();
      if (show && !peek.classList.contains('is-on')) { aim(); pos = { ...target }; place(); }
      peek.classList.toggle('is-on', show);
    }
  };
  let frame = 0;
  const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };

  if (peek) {
    menuEl.addEventListener('mousemove', (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
      if (!raf) raf = requestAnimationFrame(loop);
      schedule();
    });
    menuEl.addEventListener('mouseleave', () => { pointer = null; schedule(); });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  if (window.lenis && window.lenis.on) window.lenis.on('scroll', schedule);
  window.addEventListener('resize', schedule);
  // turning a page moves nothing by scrolling, so look again here
  document.addEventListener('home:page', () => { pointer = null; rowSpots.stale = true; schedule(); });
  dock.addEventListener('click', () => { if (focused) open(Number(focused.dataset.index), focused); });
  new MutationObserver(schedule).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  schedule();

  menuEl.addEventListener('click', (event) => {
    const button = event.target.closest('.menu-item');
    if (button) open(Number(button.dataset.index), button);
  });
  overlay.querySelector('.kitchenMenu__scrim').addEventListener('click', close);
  sheet.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('.kitchenMenu__close')) close();
    else if (button.hasAttribute('data-go')) render(current + Number(button.dataset.go), `[data-go="${button.dataset.go}"]`);
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
