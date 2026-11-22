/* Additive project-page chrome. Wait a task beyond DOMContentLoaded so
   createToc.js and the site's animation setup finish before reading the TOC. */
(() => {
  'use strict';

  function enhance() {
    const nav = document.querySelector('.project-nav');
    if (!nav || nav.dataset.rsWorkReady) return;
    const toc = nav.querySelector('.project-nav__toc');
    if (!toc) return;
    nav.dataset.rsWorkReady = 'true';
    const links = Array.from(toc.querySelectorAll('a.project-toc'));
    const mobile = window.matchMedia('(max-width: 50rem)');
    const make = (tag, className, text) => {
      const node = document.createElement(tag);
      node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const items = links.map((link, index) => {
      const label = link.querySelector('.project-toc__label');
      const text = label ? label.textContent.trim() : link.textContent.trim();
      const number = String(index + 1).padStart(2, '0');
      const target = document.getElementById((link.getAttribute('href') || '').slice(1));
      link.title = text;
      const badge = make('span', 'rs-toc-number', number);
      badge.setAttribute('aria-hidden', 'true');
      link.prepend(badge);
      if (target) {
        const sectionNumber = make('span', 'rs-section-number', number);
        sectionNumber.setAttribute('aria-hidden', 'true');
        target.before(sectionNumber);
      }
      return { link, target, text, number };
    });

    // Absolute preview paths deliberately ignore the production <base>.
    const route = location.pathname.match(/\/pages\/(en|zh)\/([^/]+\.html)$/);
    if (route) {
      const other = route[1] === 'en' ? 'zh' : 'en';
      const language = make('a', 'rs-work-language', '繁 / EN');
      language.href = `/prototypes/restyle/preview/pages/${other}/${route[2]}`;
      language.hreflang = other;
      language.lang = other === 'zh' ? 'zh-Hant' : 'en';
      language.title = other === 'zh' ? 'Read this project in Traditional Chinese' : 'Read this project in English';
      // preview.js observes added links; this URL is already preview-relative.
      language.dataset.previewFixed = '1';
      const bottom = nav.querySelector('.project-nav__group:last-of-type');
      if (bottom) bottom.prepend(language);
      const panelLanguage = language.cloneNode(true);
      panelLanguage.classList.add('rs-panel-language');
      toc.append(panelLanguage);
    }
    toc.id = toc.id || 'rs-work-sections-panel';
    toc.setAttribute('aria-label', 'Project sections');
    const current = make('div', 'rs-work-current');
    const currentNumber = make('span', 'rs-work-current-number');
    const currentLabel = make('span', 'rs-work-current-label');
    current.append(currentNumber, currentLabel);
    const button = make('button', 'rs-work-sections', 'Sections');
    button.type = 'button';
    button.setAttribute('aria-controls', toc.id);
    button.setAttribute('aria-expanded', 'false');
    const progress = make('div', 'rs-work-progress');
    progress.setAttribute('aria-hidden', 'true');
    nav.append(current, button, progress);

    function setOpen(open, returnFocus = false) {
      nav.classList.toggle('rs-sections-open', open);
      button.setAttribute('aria-expanded', String(open));
      if (returnFocus) button.focus();
    }
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      if (open) (links[0] || toc.querySelector('a'))?.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (!nav.contains(event.target)) setOpen(false);
    });
    nav.addEventListener('focusout', () => {
      queueMicrotask(() => {
        if (!nav.contains(document.activeElement)) setOpen(false);
      });
    });
    // Let the original click handler run. On mobile, correct its 24px offset
    // for the 56px fixed bar, without stopping any original listener.
    items.forEach(({ link, target }) => {
      link.addEventListener('click', () => {
        if (!mobile.matches) return;
        setOpen(false, true);
        if (target) {
          const sectionTitle = target.closest('.project-module--section-title') || target;
          // Reveal animations translate modules while scrolling. Sum layout
          // offsets so their temporary transform cannot hide the number/bar.
          let top = 0;
          for (let node = sectionTitle; node; node = node.offsetParent) {
            top += node.offsetTop;
          }
          window.scrollTo({
            top: top - 72,
            behavior: 'smooth',
          });
        }
      });
    });
    let frame = 0;
    function update() {
      frame = 0;
      const active = items.find(({ link }) => link.classList.contains('project-toc--active')) || items[0];
      currentNumber.textContent = active?.number || '';
      currentLabel.textContent = active?.text || 'Project';
      current.title = active ? `${active.number} ${active.text}` : 'Project';
      items.forEach(({ link }) => {
        if (link === active?.link) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      nav.style.setProperty('--rs-work-progress', String(ratio));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    new MutationObserver(schedule).observe(toc, {
      subtree: true, attributes: true, attributeFilter: ['class'],
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('portfolio:assets-ready', schedule);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(document.body);
    mobile.addEventListener('change', () => { setOpen(false); schedule(); });
    update();
  }

  const afterToc = () => window.setTimeout(enhance, 0);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterToc, { once: true });
  } else {
    afterToc();
  }
})();
