const Button = require('../components/Button/button.js');

function indent(text, spaces = 8) {
  const prefix = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

function renderImage(image) {
  const zoomAttribute = image.zoom === false ? '' : ' data-zoom-image';
  const classAttribute = image.zoom === false ? '' : ' class="ui-zoomable-media"';
  const styleAttribute = image.style ? ` style="${image.style}"` : '';
  return `<img src="${image.src}" alt="${image.alt || ''}"${classAttribute}${zoomAttribute}${styleAttribute} />`;
}

function normalizeContentClass(className, fallback) {
  const classMap = {
    'module__text': 'project-module__text body',
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

function renderUnorderedList(items, className = 'project-module__list') {
  return `<ul class="${normalizeContentClass(className, 'project-module__list')}">
${items.map((item) => `  <li>${item}</li>`).join('\n')}
</ul>`;
}

function renderContentItem(item) {
  switch (item.type) {
    case 'paragraph':
      return `<p class="${normalizeContentClass(item.className, 'project-module__text body')}">${item.html}</p>`;
    case 'orderedList':
      return renderOrderedList(item.items, item.className);
    case 'unorderedList':
      return renderUnorderedList(item.items, item.className);
    case 'button':
      return `<div class="${normalizeContentClass(item.className, 'project-module__button')}">
  ${Button({ label: item.label, href: item.href, variant: 'bordered', target: item.target || '' })}
</div>`;
    case 'callOut':
      return `<div class="ui-callout project-module__callout callout">
  <p class="project-module__callout-title">${item.title}</p>
  <p class="project-module__text body">${item.text}</p>
</div>`;
    case 'linkParagraph':
      return `<a class="ui-link" href="${item.href}"${item.target ? ` target="${item.target}"` : ''}>
  <p class="${normalizeContentClass(item.className, 'project-module__text body')}">${item.html}</p>
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
    .map((paragraph) => `<p class="project-module__text body">${paragraph}</p>`)
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
  const paragraphClass = ` class="project-module__text body${extraClasses}"`;

  return `<div class="ui-quote project-module project-module--quote nda">
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

  return `<div class="ui-quote project-module project-module--feature-quote project-module--bg-quote sec--dark">
<${module.headingTag || 'h3'} class="project-module__heading"${headingStyle}>${module.headingHtml}</${module.headingTag || 'h3'}>
<div class="project-module__callout-list problems"${callOutListStyle}>
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
            `<p class="project-module__item-text body">${paragraph}</p>`
        )
        .join('\n');

      return `<article class="project-module__item">
${item.image ? `<div class="goal-icon">${renderImage({ ...item.image, zoom: false })}</div>` : ''}
<div class="project-module__item-content">
${title}
${paragraphs}
</div>
</article>`;
    })
    .join('\n');

  return `<div class="project-module project-module--icon-list-vertical goals">
${items}
</div>`;
}

function renderHorizontalIconList(module) {
  const items = module.items
    .map(
      (item) => `<article class="project-module__item">
<div class="goal-icon">${renderImage({ ...item.image, zoom: false })}</div>
<div class="project-module__item-content">
<h6 class="project-module__item-title">${item.title}</h6>
<p class="project-module__item-text body">${item.content}</p>
</div>
</article>`
    )
    .join('\n');

  return `<div class="project-module project-module--icon-list-horizontal goals">
${items}
</div>`;
}

function renderImgAndContentBlock(module) {
  const entries = module.entries
    .map((entry) => {
      const paragraphs = (entry.paragraphs || [])
        .map((paragraph) => `<p class="project-module__text body">${paragraph}</p>`)
        .join('\n');
      const orderedList = entry.orderedList
        ? `<ol class="project-module__list">
${entry.orderedList.map((item) => `  <li>${item}</li>`).join('\n')}
</ol>`
        : '';

      return `<div class="project-module__entry">
<h6 class="project-module__item-title">${entry.title}</h6>
${paragraphs}
${orderedList}
</div>`;
    })
    .join('\n');

  return `<div class="project-module project-module--media-content media-aside">
${renderImage(module.image)}
<div class="project-module__content">
${entries}
</div>
</div>`;
}

function renderBigQuote(module) {
  const extraClass = module.className ? ` ${module.className}` : '';

  return `<div class="ui-quote project-module project-module--feature-quote big-quote${extraClass}">
${module.icon ? `<img class="project-module__icon" src="${module.icon}" alt="" />` : ''}
<h3 class="project-module__heading">${module.content}</h3>
</div>`;
}

function renderMediaAside(module) {
  const variantClass = module.variant
    ? ` project-module--media-aside-${module.variant}`
    : '';
  const textOnlyClass = module.image
    ? ''
    : ' project-module--media-aside-text-only';
  const media = module.image
    ? `<div class="project-module__media">
${renderImage(module.image)}
</div>
`
    : '';
  const paragraphs = (module.paragraphs || [])
    .map((paragraph) => `<p class="project-module__text body">${paragraph}</p>`)
    .join('\n');

  return `<div class="project-module project-module--media-aside media-aside${variantClass}${textOnlyClass}">
${media}<div class="project-module__aside">
<h3 class="project-module__heading">${module.title}</h3>
${paragraphs}
</div>
</div>`;
}

function renderProcessFlow(module) {
  const steps = (module.steps || [])
    .map((step) => {
      const description = step.description
        ? `<p class="project-module__process-description">${step.description}</p>`
        : '';

      return `<li class="project-module__process-step">
<div class="project-module__process-content">
<div class="project-module__process-heading">
<span class="project-module__process-number">${step.number}</span>
<h3 class="project-module__process-title">${step.title}</h3>
</div>
${description}
</div>
</li>`;
    })
    .join('\n');

  return `<div class="project-module project-module--process-flow" aria-label="${module.label || ''}">
<ol class="project-module__process-list">
${steps}
</ol>
</div>`;
}

function renderCaptionedMediaGrid(module) {
  const items = (module.items || [])
    .map((item) => {
      const media = item.image
        ? renderImage(item.image)
        : `<div class="project-module__media-placeholder">${item.placeholder || 'Media placeholder'}</div>`;

      const caption = item.label ? `<figcaption>${item.label}</figcaption>\n` : '';

      return `<figure class="project-module__captioned-media">
${caption}
${media}
</figure>`;
    })
    .join('\n');

  return `<div class="project-module project-module--captioned-media-grid media-grid" style="--media-grid-columns: ${module.columns || 2}">
${items}
</div>`;
}

function renderMethodList(module) {
  const items = (module.items || [])
    .map(
      (item) => `<li class="project-module__method-item">
<span class="project-module__method-icon" aria-hidden="true">${item.icon}</span>
<div>
<h6 class="project-module__method-title">${item.title}</h6>
<p class="project-module__method-text">${item.content}</p>
</div>
</li>`,
    )
    .join('\n');

  return `<ul class="project-module project-module--method-list">
${items}
</ul>`;
}

function renderModule(module) {
  switch (module.type) {
    case 'bgTitle': {
      const line = module.line === false ? '' : '\n<div class="project-module__line"></div>';
      return `<div class="project-module project-module--section-title">
<h3 class="project-module__heading">${module.html || module.text}</h3>
${line}
</div>`;
    }
    case 'mdTitle':
      return `<div class="project-module project-module--eyebrow">
<h6 class="project-module__eyebrow">${module.html || module.text}</h6>
</div>`;
    case 'mediaCaption':
      return `<p class="project-module project-module__media-caption">${module.html || module.text}</p>`;
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
    case 'mediaAside':
      return renderMediaAside(module);
    case 'processFlow':
      return renderProcessFlow(module);
    case 'captionedMediaGrid':
      return renderCaptionedMediaGrid(module);
    case 'methodList':
      return renderMethodList(module);
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

function renderSections(sections) {
  const chapters = [];
  let current = null;
  let preamble = '';
  for (const section of sections) {
    for (const module of section.modules) {
      if (module.type === 'bgTitle') {
        current = { title: module.html || module.text, blocks: [], dark: false };
        chapters.push(current);
      } else if (current) {
        current.blocks.push(renderModule(module));
        if (module.type === 'bgQuote') current.dark = true;
      } else {
        preamble += renderModule(module);
      }
    }
  }
  return indent((preamble ? `<div class="p-preamble">${preamble}</div>` : '') + chapters.map((chapter, index) => {
    const id = `toc${index + 1}`;
    return `<section class="project-page__section sec${chapter.dark ? ' sec--problem' : ''}" id="${id}" aria-labelledby="${id}-title">
      <div class="sec__grid">
        <span class="sec__num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <div class="sec__content">
          <h2 class="project-module__chapter-title" id="${id}-title">${chapter.title}</h2>
          ${chapter.blocks.join('\n')}
        </div>
      </div>
    </section>`;
  }).join('\n'));
}

module.exports = { renderSections };
