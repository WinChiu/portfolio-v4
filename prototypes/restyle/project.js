/* Standalone English project renderer. Existing content is trusted editorial HTML. */
(() => {
  'use strict';
  const projects = window.__PROJECTS__ || {};
  const requested = new URLSearchParams(location.search).get('p') || 'keepwell';
  const slug = Object.hasOwn(projects, requested) ? requested : 'keepwell';
  const project = projects[slug];
  const main = document.querySelector('main');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const html = value => String(value ?? '');
  const palette = key => ({designSystem:'c-work', keepwell:'c-about', rfid:'c-about', ba:'c-about', pos:'c-life', bizpro:'c-kitchen', childcare:'c-sage', forest:'c-sage', gongChi:'c-plum'}[key] || 'c-work');
  const plain = value => { const el = document.createElement('div'); el.innerHTML = html(value); return el.textContent.replace(/==/g, '').replace(/\s+/g, ' ').trim(); };
  const paragraphs = values => (values || []).map(p => `<p class="body">${html(p)}</p>`).join('');
  const image = (value, zoom = true) => {
    if (!value) return '';
    const i = typeof value === 'string' ? {src:value} : value;
    const img = `<img src="${esc(i.src)}" alt="${esc(i.alt)}" loading="lazy" decoding="async" />`;
    return zoom && i.zoom !== false ? `<button class="zoom-trigger" type="button" aria-label="${esc(i.alt ? `Enlarge: ${i.alt}` : 'Enlarge project image')}">${img}</button>` : img;
  };
  const list = (items, ordered = false) => `<${ordered ? 'ol' : 'ul'} class="body project-list">${(items || []).map(i => `<li>${typeof i === 'object' ? block(i) : html(i)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
  const callout = m => `<aside class="callout"><h3>${html(m.title)}</h3><p class="body">${html(m.text)}</p></aside>`;
  function block(m) {
    switch (m.type) {
      case 'pureTitle': return `<h3 class="pure-title">${html(m.html || m.text)}</h3>`;
      case 'mdTitle': return `<h3 class="md-title mono">${html(m.html || m.text)}</h3>`;
      case 'mediaCaption': return `<p class="media-caption mono">${html(m.html || m.text)}</p>`;
      case 'pureText': return m.items ? m.items.map(i => typeof i === 'object' ? block(i) : `<p class="body">${html(i)}</p>`).join('') : paragraphs(m.paragraphs) + (m.orderedList ? list(m.orderedList, true) : '') + (m.html || m.text ? `<p class="body">${html(m.html || m.text)}</p>` : '');
      case 'paragraph': return m.items ? list(m.items) : `<p class="body">${html(m.html || m.text)}</p>`;
      case 'orderedList': return list(m.items, true);
      case 'unorderedList': return list(m.items);
      case 'quote': return `<blockquote class="nda"><p>${html(m.html || m.text)}</p></blockquote>`;
      case 'bgQuote': return `<div class="sec--dark"><h3>${html(m.headingHtml)}</h3><div class="problems">${(m.callOuts || []).map(callout).join('')}</div></div>`;
      case 'bigQuote': return `<blockquote class="big-quote">${m.icon ? image({src:m.icon,alt:''}, false) : ''}<h3>${html(m.content)}</h3></blockquote>`;
      case 'singleImage': return `<figure class="figure">${image(m.image)}${m.caption ? `<figcaption>${html(m.caption)}</figcaption>` : ''}</figure>`;
      case 'doubleImage': return `<div class="media-grid">${(m.images || []).map(i => `<figure>${image(i)}</figure>`).join('')}</div>`;
      case 'captionedMediaGrid': return `<div class="media-grid" style="--columns:${Math.max(1, Math.min(3, Number(m.columns) || 2))}">${(m.items || []).map(i => `<figure>${i.image ? image(i.image) : `<div class="media-placeholder mono">${html(i.placeholder || 'Media placeholder')}</div>`}${i.label ? `<figcaption>${html(i.label)}</figcaption>` : ''}</figure>`).join('')}</div>`;
      case 'horizontalIconList':
      case 'verticalIconList': return `<div class="goals">${(m.items || []).map(i => `<article>${i.image || i.icon ? `<div class="goal-icon">${image(i.image || i.icon, false)}</div>` : ''}${i.label ? `<p class="mono hl">${html(i.label)}</p>` : ''}${i.title ? `<h3>${html(i.title)}</h3>` : ''}${paragraphs(i.paragraphs || (i.content || i.text ? [i.content || i.text] : []))}</article>`).join('')}</div>`;
      case 'imgAndContentBlock': return `<div class="media-aside">${image(m.image)}<div>${(m.entries || []).map(e => `<article><h3>${html(e.title)}</h3>${paragraphs(e.paragraphs)}${e.orderedList ? list(e.orderedList,true) : ''}</article>`).join('')}</div></div>`;
      case 'mediaAside': return `<div class="media-aside${m.image ? '' : ' media-aside--text'}">${image(m.image)}<div><h3>${html(m.title)}</h3>${paragraphs(m.paragraphs)}</div></div>`;
      case 'callOut': return callout(m);
      case 'button': return `<p><a class="link-arrow" href="${esc(m.href)}"${m.target ? ` target="${esc(m.target)}" rel="noopener noreferrer"` : ''}>Visit site ↗</a></p>`;
      case 'linkParagraph': return `<p class="body"><a class="text-link" href="${esc(m.href)}"${m.target ? ` target="${esc(m.target)}" rel="noopener noreferrer"` : ''}>${html(m.html || m.text)}</a></p>`;
      case 'processFlow': return `<ol class="process-flow" aria-label="${esc(m.label || 'Process')}">${(m.steps || []).map((s,i) => `<li><span class="mono hl">${esc(s.number || i+1)}</span><div><h3>${html(s.title)}</h3>${paragraphs(s.description ? [s.description] : [])}</div></li>`).join('')}</ol>`;
      case 'methodList': return `<ul class="method-list">${(m.items || []).map(i => `<li><span class="mono hl" aria-hidden="true">${html(i.icon)}</span><div><h3>${html(i.title)}</h3>${paragraphs([i.content])}</div></li>`).join('')}</ul>`;
      default: return `<p class="body">${html(m.html || m.text || m.content || m.title || '')}</p>` + paragraphs(m.paragraphs);
    }
  }
  if (!project) { main.innerHTML = '<p class="p-head">Project unavailable. <a href="home.html#work">All work →</a></p>'; return; }
  document.body.classList.remove('c-about');
  document.body.classList.add(palette(slug));
  const title = project.header?.title || project.title;
  document.title = `${plain(title)} — Win Chiu`;
  const colon = title.indexOf(':');
  const titleMarkup = colon < 0 ? esc(title) : `${esc(title.slice(0, colon))}<span class="ink">${esc(title.slice(colon))}</span>`;
  let output = `<header class="p-head"><div class="p-titleblock"><h1 class="p-title">${titleMarkup}</h1><p class="p-tags mono">${esc(project.tags)}</p></div><dl class="p-facts">${['duration','role','responsibility','company'].map(k => `<div><dt>${k[0].toUpperCase()+k.slice(1)}</dt><dd>${esc(project.header?.[k] || '—')}</dd></div>`).join('')}</dl></header>`;
  // A chapter continues across source sections until the next bgTitle.
  const chapters = [];
  let chapter = null;
  let preamble = '';
  for (const section of project.sections || []) {
    for (const m of section.modules || []) {
      if (m.type === 'bgTitle') {
        chapter = {id:`section-${chapters.length+1}`, number:String(chapters.length+1).padStart(2,'0'), heading:m.html || m.text, content:''};
        chapters.push(chapter);
      } else if (chapter) chapter.content += `<div class="project-block">${block(m)}</div>`;
      else preamble += `<div class="project-block">${block(m)}</div>`;
    }
  }
  output += preamble ? `<div class="p-preamble">${preamble}</div>` : '';
  output += chapters.map(c => `<section class="sec" id="${c.id}" aria-labelledby="${c.id}-title"><div class="sec__grid"><span class="sec__num" aria-hidden="true">${c.number}</span><div class="sec__content"><h2 id="${c.id}-title">${html(c.heading)}</h2>${c.content}</div></div></section>`).join('');
  const home = window.__HOME_PAGE_CONTENT__?.en?.projects || [];
  const slugOf = p => /(?:^|\/)pages\/en\/([^/?#]+)\.html(?:[?#].*)?$/.exec(p.projectUrl || '')?.[1];
  const visible = home.filter(p => p.type === 'design' && !p.hidden).sort((a,b) => (a.order ?? Infinity)-(b.order ?? Infinity));
  const current = visible.findIndex(p => slugOf(p) === slug);
  const next = visible[(current+1) % visible.length];
  if (next) {
    const nextSlug = slugOf(next);
    const href = nextSlug && projects[nextSlug] ? `project.html?p=${encodeURIComponent(nextSlug)}` : next.projectUrl;
    output += `<a class="next ${palette(nextSlug)}" href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="mono mute">Next project →</span><p class="p-title">${esc(next.title)}</p></a>`;
  }
  main.innerHTML = output;
  // Convert markers only in text nodes, preserving authored HTML and attributes.
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('==') && !walker.currentNode.parentElement.closest('.highlight, script, style, textarea')) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/(==[\s\S]+?==)/g)) {
      const match = /^==([\s\S]+)==$/.exec(part);
      if (match && match[1].trim()) { const span = document.createElement('span'); span.className='highlight'; span.textContent=match[1].trim(); fragment.append(span); }
      else fragment.append(document.createTextNode(part));
    }
    node.replaceWith(fragment);
  }
  const nav = document.querySelector('.index');
  const toc = document.querySelector('.index__list');
  const toggle = document.querySelector('.sections-toggle');
  toc.innerHTML = chapters.map(c => `<li><a href="#${c.id}" title="${esc(plain(c.heading))}"><span class="n">${c.number}</span><span class="t">${esc(plain(c.heading))}</span></a></li>`).join('');
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open',open); toggle.setAttribute('aria-expanded',String(open)); });
  toc.addEventListener('click', e => { if (e.target.closest('a')) { closeMenu(); if (matchMedia('(max-width: 48rem)').matches) toggle.focus({preventScroll:true}); } });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  const links = [...toc.querySelectorAll('a')];
  const sections = chapters.map(c => document.getElementById(c.id));
  let scheduled = false;
  function updateProgress() {
    scheduled = false;
    const offset = matchMedia('(max-width:48rem)').matches ? 80 : 40;
    let active = -1;
    sections.forEach((s,i) => { if (s.getBoundingClientRect().top <= offset) active=i; });
    links.forEach((a,i) => {
      a.classList.toggle('is-active',i===active);
      if (i===active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
      const end = sections[i+1]?.offsetTop ?? document.querySelector('.next')?.offsetTop ?? document.documentElement.scrollHeight;
      a.style.setProperty('--p', String(Math.max(0,Math.min(1,(scrollY+offset-sections[i].offsetTop)/Math.max(1,end-sections[i].offsetTop)))));
    });
    document.querySelector('.mobile-current').textContent = active < 0 ? 'Overview' : `${chapters[active].number} ${plain(chapters[active].heading)}`;
    const distance = document.documentElement.scrollHeight-innerHeight;
    nav.style.setProperty('--page-progress',String(distance > 0 ? Math.max(0,Math.min(1,scrollY/distance)) : 1));
    // desktop rail: the bar fills top-to-bottom in the project color as the page is read
    const pageP = distance > 0 ? Math.max(0,Math.min(1,scrollY/distance)) : 1;
    const color = getComputedStyle(document.body).getPropertyValue('--accent-ink').trim();
    nav.style.setProperty('--fill-gradient', `linear-gradient(to bottom, ${color} 0% ${(pageP*100).toFixed(2)}%, transparent ${(pageP*100).toFixed(2)}% 100%)`);
    nav.classList.add('is-filled');
    const nr = nav.getBoundingClientRect();
    const limit = nr.height * pageP;
    nav.querySelectorAll('.index__list a, .index__back, .index__foot a').forEach(el => { const r = el.getBoundingClientRect(); el.classList.toggle('on-fill', r.top - nr.top + r.height/2 <= limit); });
  }
  const schedule = () => { if (!scheduled) { scheduled=true; requestAnimationFrame(updateProgress); } };
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  new ResizeObserver(schedule).observe(main);
  updateProgress();
  const zoom = document.querySelector('.zoom');
  let zoomOrigin;
  main.addEventListener('click', e => {
    const button = e.target.closest('.zoom-trigger');
    if (!button) return;
    zoomOrigin=button;
    const source=button.querySelector('img');
    zoom.querySelector('img').src=source.currentSrc || source.src;
    zoom.querySelector('img').alt=source.alt;
    zoom.querySelector('p').textContent=source.alt;
    zoom.showModal();
    document.body.classList.add('zoom-open');
  });
  zoom.addEventListener('click', () => zoom.close());
  zoom.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); zoom.close(); }
  });
  zoom.addEventListener('close', () => { document.body.classList.remove('zoom-open'); zoomOrigin?.focus({preventScroll:true}); });
  if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
