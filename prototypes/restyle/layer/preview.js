// Keeps navigation inside the preview: the copies use <base>, so links would
// otherwise jump to the production pages (and "#x" anchors to "/#x").
(() => {
  const PREVIEW = '/prototypes/restyle/preview';
  const here = location.pathname;

  const fix = (a) => {
    const raw = a.getAttribute('href');
    if (!raw || a.dataset.previewFixed) return;
    a.dataset.previewFixed = '1';
    if (raw.startsWith('#') || /^(https?:|mailto:|tel:)/.test(raw)) return;
    const url = new URL(raw, document.baseURI);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html') && url.pathname !== '/') return;
    const target = url.pathname === '/' ? '/index.html' : url.pathname;
    a.setAttribute('href', PREVIEW + target + url.hash);
  };

  // "#x" links resolve against <base>, so handle the ones no script took over.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    const top = el ? el.getBoundingClientRect().top + scrollY : 0;
    if (window.lenis) window.lenis.scrollTo(top); else scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', here + '#' + id);
  });

  const run = () => document.querySelectorAll('a[href]').forEach(fix);
  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
