// ProjectCard: one case study in the Work list: number, tag, title, description, links and a cover.
//   UI.ProjectCard({ number: '01', tag: 'UX', title: 'RFID', description: '…', imageUrl: 'img/…',
//                    projectUrl: 'pages/en/rfid.html', type: 'design', coverType: 'delivery', lang: 'en' })
//
// type       'design' | 'code'. A code project starts hidden (the Work tabs show and hide cards by [data-type]) and may
//            carry a `siteUrl`, which adds a "View site" button.
// coverType  'component-tray' | 'delivery' draws the cover with <hairline-cover> (the image is its fallback).
// tag, title, description may contain markup; everything else is escaped.
// Composes Button.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../escape.js'), require('../Button/button.js'));
  else { root.UI = root.UI || {}; root.UI.ProjectCard = factory(root.UI.escape, root.UI.Button); }
})(typeof self !== 'undefined' ? self : this, function (escape, Button) {
  const DRAWN_COVERS = ['component-tray', 'delivery'];

  return function ProjectCard({ number, tag, title, description, imageUrl, coverType = '', lang = 'en', type = 'design', projectUrl, siteUrl = '' }) {
    const external = /^https?:\/\//.test(projectUrl);
    const isCode = type === 'code';
    const image = `<img src="${escape(imageUrl)}" alt="${escape(title)}" loading="lazy" />`;
    const cover = DRAWN_COVERS.includes(coverType)
      ? `<hairline-cover figure="${escape(coverType)}" lang="${escape(lang)}">${image}</hairline-cover>`
      : image;
    const site = isCode && siteUrl
      ? Button({ label: 'View site', href: siteUrl, variant: 'outline', icon: '↗', external: true })
      : '';
    return `<article class="project-card${isCode ? ' workHide' : ''}" data-type="${escape(type)}" aria-hidden="${isCode}">
          <span class="project-card__number">${escape(number)}</span>
          <div class="project-card__body"><div class="project-card__header">
            <p class="project-card__tags mono">${tag}</p><h3 class="project-card__title">${title}</h3>
            <p class="project-card__description">${description}</p></div>
            <div class="project-card__links">${Button({ label: 'View project', href: projectUrl, variant: 'outline', icon: '→', external })}
            ${site}</div>
          </div><div class="project-card__cover">${cover}</div></article>`;
  };
});
