// PhotoCard: a photo in a paper frame. Two variants share the frame.
//
//   portrait  the tilted photo on the home hero, with a handwritten caption
//             UI.PhotoCard({ variant: 'portrait', src, alt, caption })
//   strip     a card in the Life film strip, with a note and a location / date line
//             UI.PhotoCard({ variant: 'strip', src, alt, note, location, date, index, loading: 'eager' })
//
// Text is escaped here, except `note`, which may carry markup.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../escape.js'));
  else { root.UI = root.UI || {}; root.UI.PhotoCard = factory(root.UI.escape); }
})(typeof self !== 'undefined' ? self : this, function (escape) {
  function portrait({ src, alt, caption }) {
    return `<figure class="photo-card photo-card--portrait">
          <div class="photo-card__frame"><img class="photo-card__photo" src="${escape(src)}" alt="${escape(alt || caption)}" loading="eager" /></div>
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
    if (variant === 'portrait') return portrait(props);
    if (variant === 'strip') return strip(props);
    throw new Error(`PhotoCard: unknown variant "${variant}"`);
  };
});
