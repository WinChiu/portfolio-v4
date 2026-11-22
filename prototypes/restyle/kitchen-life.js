// Mockup version of the kitchen-menu branch: Kitchen as a restaurant menu with a
// hover photo and recipe sheet, Life as a film strip scrubbed by page scroll.
(() => {
  const home = (window.__HOME_PAGE_CONTENT__ || {}).en || {};
  const dishes = window.__KITCHEN_MENU__ || [];
  const courses = (home.kitchen && home.kitchen.courses) || [];
  const lifeItems = (home.life && home.life.items) || [];

  const flame = '<svg viewBox="0 0 11 14" aria-hidden="true"><path d="M5.5 13C2.5 13 1 11 1 8.6 1 6 3.4 4.6 4 1.2c2.4 1.6 3.3 3.4 3 5.4.8-.5 1.4-1.3 1.6-2.2C9.6 5.6 10 7 10 8.6 10 11 8.5 13 5.5 13Z"/></svg>';
  const effort = (n) => [1, 2, 3].map((i) => `<span class="${i > n ? 'is-off' : ''}">${flame}</span>`).join('');
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- menu ---------- */
  const menu = document.getElementById('menu');
  const courseHtml = courses.map((c) => {
    const items = dishes.map((d, i) => ({ ...d, i })).filter((d) => d.course === c.key);
    if (!items.length) return '';
    return `<section class="course">
      <h3 class="course__head"><span class="course__zh" lang="zh-Hant">${esc(c.zh)}</span><span class="course__en">${esc(c.en)}</span><span class="course__line" aria-hidden="true"></span></h3>
      ${items.map((d) => `<button type="button" class="dish" data-i="${d.i}" aria-haspopup="dialog">
        <span class="dish__name"><span class="dish__zh" lang="zh-Hant">${esc(d.nameZh)}</span><span class="dish__en">${esc(d.nameEn)}</span></span>
        <span class="dish__leader" aria-hidden="true"></span>
        <span class="effort" role="img" aria-label="Effort ${d.effort} of 3">${effort(d.effort)}</span>
      </button>`).join('')}
    </section>`;
  });
  // Two columns: the first half of the courses on the left, the rest on the right.
  const split = Math.ceil(courseHtml.length / 2);
  menu.innerHTML = [courseHtml.slice(0, split), courseHtml.slice(split)].map((col) => `<div class="menu__col">${col.join('')}</div>`).join('');

  /* ---------- hover photo (mouse only) ---------- */
  const peek = document.getElementById('peek');
  const peekImg = peek.querySelector('img');
  if (matchMedia('(hover: hover)').matches) {
    menu.addEventListener('pointerover', (e) => {
      const b = e.target.closest('.dish');
      if (!b) return;
      peekImg.src = dishes[b.dataset.i].imageSrc;
      peek.classList.add('is-on');
    });
    menu.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('.dish')) peek.classList.remove('is-on');
    });
    addEventListener('scroll', () => peek.classList.remove('is-on'), { passive: true });
    menu.addEventListener('pointermove', (e) => {
      peek.style.transform = `translate(${Math.max(8, Math.min(e.clientX + 24, innerWidth - peek.offsetWidth - 8))}px, ${Math.max(8, Math.min(e.clientY - 80, innerHeight - peek.offsetHeight - 8))}px)`;
    });
  }

  /* ---------- recipe sheet ---------- */
  const wrap = document.getElementById('sheet-wrap');
  // Keep the fixed dialog outside the inert page content.
  document.body.append(wrap);
  const sheet = wrap.querySelector('.sheet');
  const $ = (id) => document.getElementById(id);
  let current = 0;
  let opener = null;
  let savedOverflow = null;
  let scrollbarPad = 0;
  let background = [];
  let revealFrame;

  const fill = (i) => {
    current = (i + dishes.length) % dishes.length;
    const d = dishes[current];
    const course = courses.find((c) => c.key === d.course);
    $('sheet-no').textContent = `No.${String(current + 1).padStart(2, '0')}`;
    const image = $('sheet-img');
    image.classList.remove('is-revealed');
    image.src = d.imageSrc;
    image.alt = d.imageAltEn || d.nameEn;
    $('sheet-title').textContent = d.nameZh;
    $('sheet-en').textContent = d.nameEn;
    $('sheet-note').textContent = d.noteEn || '';
    $('sheet-meta').innerHTML = `<div><dt class="mono">Course</dt><dd>${esc(course?.en || d.course)}</dd></div>${d.time ? `<div><dt class="mono">Time</dt><dd>${esc(d.time)}</dd></div>` : ''}<div><dt class="mono">Effort</dt><dd class="effort" role="img" aria-label="Effort ${d.effort} of 3">${effort(d.effort)}</dd></div>`;
    const ingredients = d.ingredients?.length ? `<section class="recipe__section"><h4 class="recipe__heading">Ingredients</h4><ul class="recipe__ingredients">${d.ingredients.map((it) => `<li><span>${esc(it.name)}</span><span class="recipe__leader" aria-hidden="true"></span><span class="mono">${esc(it.qty)}</span></li>`).join('')}</ul></section>` : '';
    const method = d.steps?.length ? `<section class="recipe__section"><h4 class="recipe__heading">Method</h4><ol class="recipe__steps">${d.steps.map((step, n) => `<li><button type="button" data-step="${n}" aria-pressed="false"><span class="recipe__node">${String(n + 1).padStart(2, '0')}</span><span>${esc(step)}</span></button></li>`).join('')}</ol></section>` : '';
    $('sheet-recipe').innerHTML = ingredients + method || '<p class="recipe__empty mono mute">Recipe coming soon.</p>';
    sheet.scrollTop = 0;
    cancelAnimationFrame(revealFrame);
    image.getBoundingClientRect();
    revealFrame = requestAnimationFrame(() => image.classList.add('is-revealed'));
  };
  const open = (i, from) => {
    if (!dishes.length) return;
    fill(i);
    opener = from;
    savedOverflow = [document.body.style.overflow, document.documentElement.style.overflow];
    // locking scroll removes the scrollbar; pad by its width so the page does not change size under the drawer
    scrollbarPad = innerWidth - document.documentElement.clientWidth;
    if (scrollbarPad > 0) document.body.style.paddingRight = `${scrollbarPad}px`;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    background = [...document.body.children].filter((el) => el !== wrap && !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName)).map((el) => [el, el.inert]);
    background.forEach(([el]) => { el.inert = true; });
    wrap.inert = false;
    peek.classList.remove('is-on');
    wrap.classList.add('is-open');
    wrap.setAttribute('aria-hidden', 'false');
    sheet.focus();
  };
  const close = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    wrap.inert = true;
    background.forEach(([el, inert]) => { el.inert = inert; });
    [document.body.style.overflow, document.documentElement.style.overflow] = savedOverflow;
    document.body.style.paddingRight = '';
    wrap.setAttribute('aria-hidden', 'true');
    if (opener) opener.focus();
  };

  menu.addEventListener('click', (e) => {
    const b = e.target.closest('.dish');
    if (b) open(+b.dataset.i, b);
  });
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
    const go = e.target.closest('[data-go]');
    if (go) fill(current + +go.dataset.go);
    const step = e.target.closest('[data-step]');
    if (step) sheet.querySelectorAll('[data-step]').forEach((button, n) => {
      const done = n <= Number(step.dataset.step);
      button.setAttribute('aria-pressed', String(done));
      button.closest('li').classList.toggle('is-done', done);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (!wrap.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowRight') fill(current + 1);
    if (e.key === 'ArrowLeft') fill(current - 1);
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    if (e.key === 'Tab') {
      const buttons = [...sheet.querySelectorAll('button')];
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && [sheet, first].includes(document.activeElement)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && [sheet, last].includes(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });

  let touch = null;
  sheet.addEventListener('touchstart', (e) => {
    touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  sheet.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
  sheet.addEventListener('touchend', (e) => {
    if (!touch || !wrap.classList.contains('is-open')) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) >= 56 && Math.abs(dx) > Math.abs(dy) * 1.5) { fill(current + (dx < 0 ? 1 : -1)); sheet.focus(); }
  }, { passive: true });

  /* ---------- life film strip ---------- */
  const strip = document.getElementById('strip');
  const intro = document.querySelector('.life__intro');
  intro.innerHTML = esc(home.life.description).replace('enjoy my work and cherish my life', '<span class="hl">enjoy my work and cherish my life</span>');
  strip.innerHTML = lifeItems.map((it, i) => `<figure class="card">
    <img src="${it.imageSrc}" alt="${esc(it.imageAlt)}" loading="${i < 4 ? 'eager' : 'lazy'}" />
    <figcaption class="card__cap"><p class="card__note">${esc(it.note)}</p>
    <p class="card__loc mono">${esc(it.location)}${it.date ? ` <span aria-hidden="true">&middot;</span> ${esc(it.date)}` : ''}</p></figcaption>
  </figure>`).join('');

  // Desktop: pin the section and move the strip sideways as the page scrolls.
  // Touch / small screens: plain horizontal swipe.
  const section = strip.closest('.life');
  const desktop = matchMedia('(min-width: 48.0625rem) and (min-height: 50rem) and (hover: hover) and (prefers-reduced-motion: no-preference)');
  let pin = null;

  const setup = () => {
    if (pin) { section.replaceChildren(...pin.children); pin = null; section.style.height = ''; strip.style.transform = ''; strip.style.overflow = ''; }
    if (!desktop.matches) return;
    pin = document.createElement('div');
    pin.className = 'life__pin';
    pin.style.cssText = 'position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start;';
    pin.append(...section.children);
    section.append(pin);
    // Use the swipeable strip when the full chapter cannot fit vertically.
    if (pin.scrollHeight > innerHeight) {
      section.replaceChildren(...pin.children);
      pin = null;
      return;
    }
    strip.style.overflow = 'visible';
    update();
  };
  const update = () => {
    if (!pin) return;
    const travel = Math.max(0, strip.scrollWidth - section.clientWidth);
    section.style.height = `${innerHeight + travel}px`;
    const r = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (travel || 1)));
    strip.style.transform = `translateX(${-p * travel}px)`;
  };

  strip.querySelectorAll('img').forEach((img) => {
    const classify = () => { img.closest('.card').classList.toggle('is-landscape', img.naturalWidth > img.naturalHeight); update(); };
    img.addEventListener('load', classify);
    if (img.complete) classify();
  });
  desktop.addEventListener('change', setup);
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', setup);
  addEventListener('load', setup);
  setup();
})();
