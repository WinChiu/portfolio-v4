// Button: a link that looks like a button.
//   UI.Button({ label: 'View project', href: 'pages/en/rfid.html', variant: 'outline', icon: '→' })
//   UI.Button({ label: 'View Website', href: 'https://…', external: true })           // variant defaults to 'solid'
//
// variant   'solid' (filled, the main action) | 'outline' (accent ink, used inside a chapter) | 'bordered' (ink border, accent text,
//           used inside a project page) | 'secondary' | 'text'
// icon      optional glyph after the label (→ ↗); decorative, so it is hidden from screen readers
// external  opens in a new tab with rel="noopener noreferrer"
// className extra classes for the call site's own layout hooks
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../escape.js'));
  else { root.UI = root.UI || {}; root.UI.Button = factory(root.UI.escape); }
})(typeof self !== 'undefined' ? self : this, function (escape) {
  const VARIANTS = ['solid', 'outline', 'bordered', 'secondary', 'text'];
  return function Button({ label, href, variant = 'solid', icon = '', external = false, target = '', className = '' }) {
    if (!VARIANTS.includes(variant)) throw new Error(`Button: unknown variant "${variant}"`);
    const opensNewTab = external || target === '_blank';
    const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ');
    const newTab = opensNewTab ? ' target="_blank" rel="noopener noreferrer"' : (target ? ` target="${escape(target)}"` : '');
    const glyph = icon ? ` <span class="button__icon" aria-hidden="true">${escape(icon)}</span>` : '';
    return `<a class="${escape(classes)}" href="${escape(href)}"${newTab}><span class="button__label">${label}</span>${glyph}</a>`;
  };
});
