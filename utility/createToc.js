document.addEventListener("DOMContentLoaded", function () {
  function applyHighlightMarkers(root = document.body) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.includes("==")) {
          return NodeFilter.FILTER_REJECT;
        }

        const parent = node.parentElement;
        if (
          !parent ||
          parent.closest("script, style, noscript, textarea, .highlight")
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    textNodes.forEach((node) => {
      const parts = node.nodeValue.split(/(==[\s\S]+?==)/g);

      if (parts.length === 1) return;

      const fragment = document.createDocumentFragment();
      let hasReplacement = false;

      parts.forEach((part) => {
        const match = part.match(/^==([\s\S]+)==$/);

        if (match) {
          const highlightText = match[1].trim();

          if (!highlightText) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }

          const span = document.createElement("span");
          span.className = "highlight";
          span.textContent = highlightText;
          fragment.appendChild(span);
          hasReplacement = true;
          return;
        }

        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      if (hasReplacement && node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  if (typeof window.__applyHighlightMarkers__ === "function") {
    window.__applyHighlightMarkers__();
  } else {
    applyHighlightMarkers();
  }


  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const toc = navbar.querySelector('.project-nav__toc');
  const toggle = navbar.querySelector('.sections-toggle');
  const current = navbar.querySelector('.mobile-current');
  const headings = [...document.querySelectorAll('.project-module__chapter-title, .project-module--section-title .project-module__heading')];
  const sections = headings.map(heading => heading.closest('.project-page__section') || heading);
  const links = headings.map((heading, index) => {
    heading.id ||= `toc${index + 1}`;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'project-toc ui-toc-item';
    link.href = `#${sections[index].id || heading.id}`;
    link.title = heading.dataset.toc || heading.textContent.trim();
    const number = document.createElement('span');
    number.className = 'n project-toc__number';
    // The printed section number wins, so a page that opens with the 00 summary stays in step.
    number.textContent = sections[index].querySelector('.sec__num')?.textContent || String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.className = 't project-toc__label';
    label.textContent = link.title;
    link.append(number, label);
    item.append(link);
    toc.append(item);
    return link;
  });
  const phone = matchMedia('(max-width: 48rem)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const closeMenu = () => {
    navbar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    navbar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    // the mask behind the open menu belongs to the bar itself, so a tap on it targets the bar
    if (!navbar.contains(event.target) || event.target === navbar) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navbar.classList.contains('is-open')) {
      closeMenu();
      toggle.focus({ preventScroll: true });
    }
  });
  // Own these anchors so Lenis and native smooth scrolling never compete.
  navbar.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    closeMenu();
    if (phone.matches && link.classList.contains('project-toc')) toggle.focus({ preventScroll: true });
    const offset = phone.matches ? 76 : 32;
    // Lenis already reads scroll-margin-top from chapter sections.
    if (window.lenis) window.lenis.scrollTo(target, { offset: target.matches('.sec') ? 0 : -offset, immediate: reducedMotion.matches });
    else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', link.hash);
  });
  let scheduled = false;
  // Runs once per frame while scrolling. All layout reads come first and all writes after them, so the browser
  // lays the page out once per frame instead of once per read.
  function updateProgress() {
    scheduled = false;
    // ---- reads
    const line = phone.matches ? 80 : 40;
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= line) active = index;
    });
    // ---- writes
    links.forEach((link, index) => {
      const selected = index === active;
      link.classList.toggle('project-toc--active', selected);
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const label = active < 0 ? 'Overview' : `${links[active].firstChild.textContent} ${links[active].title}`;
    if (current.textContent !== label) current.textContent = label;
    if (toggle.textContent !== label) toggle.textContent = label; // the phone button names the current section
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateProgress);
  }
  addEventListener('scroll', schedule, { passive: true });
  let lastWidth = innerWidth;
  addEventListener('resize', () => {
    // Height-only resizes on phones come from the browser bars; they shouldn't close the section menu.
    if (innerWidth !== lastWidth) closeMenu();
    lastWidth = innerWidth;
    schedule();
  });
  toc.addEventListener('scroll', schedule, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(document.querySelector('.with-nav'));
  document.fonts?.ready.then(schedule);
  window.lenis?.on('scroll', schedule);
  updateProgress();
});
