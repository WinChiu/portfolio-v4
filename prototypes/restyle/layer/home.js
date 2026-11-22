/* Add navigation context without replacing content or owning site animations. */
(() => {
  function enhance() {
    const nav = document.querySelector('.nav--main');
    if (!nav || nav.dataset.rsHomeReady) return;
    nav.dataset.rsHomeReady = 'true';

    const name = document.createElement('div');
    name.className = 'rs-name';
    const title = document.createElement('span');
    title.className = 'rs-name__title';
    title.textContent = 'Win Chiu';
    const role = document.createElement('span');
    role.className = 'rs-name__role';
    role.textContent = 'Product Designer';
    name.append(title, role);
    nav.prepend(name);

    const chapters = [];
    nav.querySelectorAll('.block__navItem a').forEach((link, index) => {
      const hash = link.getAttribute('href')?.split('#')[1];
      const section = hash ? document.getElementById(hash) : null;
      if (!section) return;
      link.classList.add(`rs-c-${section.id}`);
      const number = document.createElement('span');
      number.className = 'rs-nav-number';
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');
      const progress = document.createElement('span');
      progress.className = 'rs-nav-progress';
      progress.setAttribute('aria-hidden', 'true');
      link.prepend(number);
      link.append(progress);
      chapters.push({ link, section });
    });

    let frame = 0;
    function update() {
      frame = 0;
      const middle = window.innerHeight / 2;
      let active = null;
      chapters.forEach((chapter) => {
        const rect = chapter.section.getBoundingClientRect();
        // Include ScrollTrigger's pin spacer in Life's chapter extent.
        const spacer = chapter.section.parentElement;
        const extent = spacer?.classList.contains('pin-spacer')
          ? spacer.getBoundingClientRect() : rect;
        if (extent.top <= middle && extent.bottom > middle) active = chapter;
        chapter.link.style.setProperty('--rs-chapter-progress',
          String(Math.max(0, Math.min(1, (middle - extent.top) / Math.max(1, extent.height)))));
      });
      chapters.forEach(({ link }) => {
        if (link === active?.link) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', schedule, { once: true });
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(schedule);
      chapters.forEach(({ section }) => observer.observe(section));
    }
    document.fonts?.ready.then(schedule);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
  } else enhance();
})();
