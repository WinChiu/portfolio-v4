// PhotoCard: a photo in a paper frame. Two variants share the frame.
//
//   floating  a small card that sits loose on the hero and can be dragged (position comes from --x --y --r; the
//             drag behavior itself lives in utility/heroCards.js)
//             UI.PhotoCard({ variant: 'floating', src, alt, caption, style: '--x:47%;--y:3rem;--r:-2deg', kind: 'dish', index: 3 })
//             `kind` ('dish' | 'life') and `index` (position in that list) tell utility/heroCards.js where a click goes.
//   strip     a card in the Life film strip, with a note and a location / date line
//             UI.PhotoCard({ variant: 'strip', src, alt, note, location, date, index, loading: 'eager' })
//
// Text is escaped here, except `note`, which may carry markup.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../escape.js'));
  else { root.UI = root.UI || {}; root.UI.PhotoCard = factory(root.UI.escape); }
})(typeof self !== 'undefined' ? self : this, function (escape) {
  function floating({ src, alt, caption, style = '', kind = '', index = null }) {
    const link = kind && index !== null;
    const label = link ? `${caption} (click to open, drag to move)` : `${caption} (drag to move)`;
    const data = link ? ` data-kind="${escape(kind)}" data-index="${Number(index)}"` : '';
    return `<figure class="photo-card photo-card--floating" tabindex="0"${data} style="${escape(style)}" aria-label="${escape(label)}">
          <div class="photo-card__frame"><img class="photo-card__photo" src="${escape(src)}" alt="${escape(alt || caption)}" loading="eager" draggable="false" /></div>
          <figcaption class="photo-card__caption">${escape(caption)}</figcaption>
        </figure>`;
  }

  function strip({ src, alt, note, location = '', date = '', index = 0, loading = 'eager' }) {
    const hasDate = typeof date === 'string' && date.trim();
    return `
        <article class="photo-card photo-card--strip" data-index="${Number(index)}">
          <div class="photo-card__frame"><img class="photo-card__photo" src="${escape(src)}"
              alt="${escape(alt)}" loading="${escape(loading)}" /></div>
          <p class="photo-card__note">${note}</p>
          <div class="photo-card__meta">
            <span class="photo-card__meta-item mono">${escape(location)}</span>
            ${hasDate ? `<span class="photo-card__meta-item mono">${escape(date)}</span>` : ''}
          </div>
        </article>`;
  }

  return function PhotoCard(props) {
    const { variant = 'strip' } = props;
    if (variant === 'floating') return floating(props);
    if (variant === 'strip') return strip(props);
    throw new Error(`PhotoCard: unknown variant "${variant}"`);
  };
});
