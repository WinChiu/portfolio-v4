function indent(text, spaces = 8) {
  const prefix = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

function renderImage(image) {
  const zoomAttribute = image.zoom === false ? '' : ' data-zoom-image';
  const styleAttribute = image.style ? ` style="${image.style}"` : '';
  return `<img src="${image.src}" alt="${image.alt || ''}"${zoomAttribute}${styleAttribute} />`;
}

function normalizeContentClass(className, fallback) {
  const classMap = {
    'module__text': 'project-module__text',
    'module__button': 'project-module__button',
    'module__content--content': 'project-module__list',
  };

  return classMap[className] || className || fallback;
}

function renderOrderedList(items, className = 'project-module__list') {
  return `<ol class="${normalizeContentClass(className, 'project-module__list')}">
${items.map((item) => `  <li>${item}</li>`).join('\n')}
</ol>`;
}

function renderContentItem(item) {
  switch (item.type) {
    case 'paragraph':
      return `<p class="${normalizeContentClass(item.className, 'project-module__text')}">${item.html}</p>`;
    case 'orderedList':
      return renderOrderedList(item.items, item.className);
    case 'button':
      return `<div class="${normalizeContentClass(item.className, 'project-module__button')}">
  <a href="${item.href}"${item.target ? ` target="${item.target}"` : ''}><p>${item.label}</p></a>
</div>`;
    case 'callOut':
      return `<div class="project-module__callout">
  <p class="project-module__callout-title">${item.title}</p>
  <p class="project-module__text">${item.text}</p>
</div>`;
    case 'linkParagraph':
      return `<a href="${item.href}"${item.target ? ` target="${item.target}"` : ''}>
  <p class="${normalizeContentClass(item.className, 'project-module__text')}">${item.html}</p>
</a>`;
    default:
      throw new Error(`Unsupported content item type: ${item.type}`);
  }
}

function renderPureText(module) {
  if (module.items) {
    return `<div class="project-module project-module--text">
${module.items.map((item) => renderContentItem(item)).join('\n')}
</div>`;
  }

  const paragraphs = (module.paragraphs || [])
    .map((paragraph) => `<p class="project-module__text">${paragraph}</p>`)
    .join('\n');

  const orderedList = module.orderedList
    ? renderOrderedList(module.orderedList)
    : '';

  return `<div class="project-module project-module--text">
${paragraphs}
${orderedList}
</div>`;
}

function renderQuote(module) {
  const extraClasses = module.paragraphClass ? ` ${module.paragraphClass}` : '';
  const paragraphClass = ` class="project-module__text${extraClasses}"`;

  return `<div class="project-module project-module--quote">
<p${paragraphClass}>${module.html}</p>
</div>`;
}

function renderBgQuote(module) {
  const headingStyle = module.headingStyle
    ? ` style="${module.headingStyle}"`
    : '';
  const callOutListStyle = module.callOutListStyle
    ? ` style="${module.callOutListStyle}"`
    : '';

  return `<div class="project-module project-module--feature-quote">
<${module.headingTag || 'h3'} class="project-module__heading"${headingStyle}>${module.headingHtml}</${module.headingTag || 'h3'}>
<div class="project-module__callout-list"${callOutListStyle}>
${module.callOuts.map((item) => renderContentItem({ ...item, type: 'callOut' })).join('\n')}
</div>
</div>`;
}

function renderVerticalIconList(module) {
  const items = module.items
    .map((item) => {
      const title = item.title
        ? `<h6 class="project-module__item-title">${item.title}</h6>`
        : '';
      const paragraphs = (item.paragraphs || [])
        .map(
          (paragraph) =>
            `<p class="project-module__item-text">${paragraph}</p>`
        )
        .join('\n');

      return `<div class="project-module__item">
${item.image ? renderImage(item.image) : ''}
<div class="project-module__item-content">
${title}
${paragraphs}
</div>
</div>`;
    })
    .join('\n');

  return `<div class="project-module project-module--icon-list-vertical">
${items}
</div>`;
}

function renderHorizontalIconList(module) {
  const items = module.items
    .map(
      (item) => `<div class="project-module__item">
${renderImage(item.image)}
<div class="project-module__item-content">
<h6 class="project-module__item-title">${item.title}</h6>
<p class="project-module__item-text">${item.content}</p>
</div>
</div>`
    )
    .join('\n');

  return `<div class="project-module project-module--icon-list-horizontal">
${items}
</div>`;
}

function renderImgAndContentBlock(module) {
  const entries = module.entries
    .map((entry) => {
      const paragraphs = (entry.paragraphs || [])
        .map((paragraph) => `<p class="project-module__text">${paragraph}</p>`)
        .join('\n');
      const orderedList = entry.orderedList
        ? `<ol class="project-module__list">
${entry.orderedList.map((item) => `  <li>${item}</li>`).join('\n')}
</ol>`
        : '';

      return `<h6 class="project-module__item-title">${entry.title}</h6>
${paragraphs}
${orderedList}`;
    })
    .join('\n');

  return `<div class="project-module project-module--media-content">
${renderImage(module.image)}
<div class="project-module__content">
${entries}
</div>
</div>`;
}

function renderBigQuote(module) {
  return `<div class="project-module project-module--feature-quote">
${module.icon ? `<img class="project-module__icon" src="${module.icon}" alt="" />` : ''}
<h3 class="project-module__heading">${module.content}</h3>
</div>`;
}

function renderModule(module) {
  switch (module.type) {
    case 'bgTitle':
      return `<div class="project-module project-module--section-title">
<h3 class="project-module__heading">${module.html || module.text}</h3>
<div class="project-module__line"></div>
</div>`;
    case 'mdTitle':
      return `<div class="project-module project-module--eyebrow">
<h6 class="project-module__eyebrow">${module.html || module.text}</h6>
</div>`;
    case 'pureTitle':
      return `<div class="project-module project-module--subsection-title">
<h6 class="project-module__subheading">${module.html || module.text}</h6>
</div>`;
    case 'pureText':
      return renderPureText(module);
    case 'quote':
      return renderQuote(module);
    case 'bgQuote':
      return renderBgQuote(module);
    case 'singleImage':
      return `<div class="project-module project-module--image">
${renderImage(module.image)}
</div>`;
    case 'doubleImage':
      return `<div class="project-module project-module--image-pair">
${module.images.map((image) => renderImage(image)).join('\n')}
</div>`;
    case 'bigQuote':
      return renderBigQuote(module);
    case 'verticalIconList':
      return renderVerticalIconList(module);
    case 'horizontalIconList':
      return renderHorizontalIconList(module);
    case 'imgAndContentBlock':
      return renderImgAndContentBlock(module);
    case 'orderedList':
      return renderOrderedList(module.items, module.className);
    default:
      throw new Error(`Unsupported module type: ${module.type}`);
  }
}

function renderSection(section) {
  const classMap = {
    specialSection: 'project-page__section--featured',
    'specialSection--gray': 'project-page__section--featured-gray',
    'specialSection--yellow': 'project-page__section--featured-yellow',
    'specialSection--narrow': 'project-page__section--narrow',
  };
  const classes = [
    'project-page__section',
    ...(section.classes || []).map((className) => classMap[className] || className),
  ].join(' ').trim();

  return `<div class="${classes}">
${section.modules.map((module) => renderModule(module)).join('\n')}
</div>`;
}

function renderSections(sections) {
  return sections.map((section) => indent(renderSection(section))).join('\n');
}

module.exports = {
  renderSections,
};
