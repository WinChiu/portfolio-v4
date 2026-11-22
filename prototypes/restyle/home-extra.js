// Home-only content and small hero interactions; the mockup owns the layout.
(() => {
  const home = window.__HOME_PAGE_CONTENT__.en;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.getElementById('hero-details').innerHTML = home.hero.details.map((d) => `<div><dt>${esc(d.title)}</dt><dd>${esc(d.subtitle)}</dd></div>`).join('');
  document.getElementById('about-paragraphs').innerHTML = home.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  document.getElementById('about-jobs').innerHTML = home.about.jobs.map((j) => `<li class="${j.isPast ? 'past' : ''}"><span class="job__title">${esc(j.title)}</span><span class="job__leader" aria-hidden="true"></span><span class="job__company">${esc(j.company)}</span></li>`).join('');

  const list = document.getElementById('project-list');
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const projects = home.projects.filter((p) => !p.hidden).sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  function render(type) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.type === type;
      tab.classList.toggle('is-on', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    list.setAttribute('aria-labelledby', `tab-${type}`);
    list.innerHTML = projects.filter((p) => p.type === type).map((p) => {
      // The content also includes external studies and live projects with no local case study.
      const external = /^https?:\/\//.test(p.projectUrl);
      const slug = p.projectUrl.split('/').pop().replace(/\.html$/, '');
      const href = external ? p.projectUrl : `project.html?p=${encodeURIComponent(slug)}`;
      const image = `<img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" loading="lazy" />`;
      const cover = ['component-tray', 'delivery'].includes(p.coverType) ? `<hairline-cover figure="${p.coverType}" lang="en">${image}</hairline-cover>` : image;
      return `<article class="project"><span class="project__num">${esc(p.number)}</span><div class="project__copy"><div><p class="project__tags mono">${esc(p.tag)}</p><h3 class="project__title">${esc(p.title)}</h3><p class="project__desc">${esc(p.description)}</p></div><div class="project__links"><a class="link-arrow" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>View project <span>→</span></a>${type === 'code' && p.siteUrl ? `<a class="link-arrow project__site" href="${esc(p.siteUrl)}" target="_blank" rel="noopener noreferrer">View site <span>↗</span></a>` : ''}</div></div><div class="project__img">${cover}</div></article>`;
    }).join('');
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => render(tab.dataset.type));
    tab.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      render(tabs[next].dataset.type);
      tabs[next].focus();
    });
  });
  render('design');

  let started = false;
  function ready() {
    if (started) return;
    started = true;
    const loader = document.querySelector('.page-loader');
    loader.classList.add('is-done');
    loader.setAttribute('aria-hidden', 'true');
    setTimeout(() => loader.remove(), 400);
    const typing = document.getElementById('hero-typing');
    if (reduced.matches) return;
    const letters = Array.from(typing.textContent);
    typing.textContent = '';
    typing.classList.add('is-typing');
    let i = 0;
    const tick = () => {
      typing.textContent += letters[i++];
      if (i < letters.length) setTimeout(tick, 45);
      else typing.classList.remove('is-typing');
    };
    tick();
  }
  if (document.readyState === 'complete') ready();
  else addEventListener('load', ready, { once: true });
  // A failed or stalled third-party loader must never hide the portfolio.
  setTimeout(ready, 4500);

  const eyes = [...document.querySelectorAll('.hero__eye')];
  const avatar = document.querySelector('.hero__avatar');
  if (!avatar || !eyes.length) return;
  addEventListener('pointermove', (e) => {
    if (reduced.matches || e.pointerType === 'touch') return;
    const r = avatar.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const limit = Math.min(8, r.width * 0.018);
    const dx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width * 0.45) / (r.width * 0.6))) * limit;
    const dy = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height * 0.45) / (r.height * 0.6))) * limit;
    eyes.forEach((eye) => { eye.style.translate = `${dx}px ${dy}px`; });
  }, { passive: true });
  function blink() {
    if (!reduced.matches && !document.hidden) {
      eyes.forEach((eye) => { eye.style.scale = '1 0.08'; });
      setTimeout(() => eyes.forEach((eye) => { eye.style.scale = ''; }), 120);
    }
    setTimeout(blink, 2200 + Math.random() * 2600);
  }
  setTimeout(blink, 2200);
})();
