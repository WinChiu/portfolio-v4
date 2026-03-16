function getAttributes(tag) {
  const attrs = {};
  const attrPattern = /([\w:-]+)="([\s\S]*?)"/g;
  let match = attrPattern.exec(tag);

  while (match) {
    attrs[match[1]] = match[2];
    match = attrPattern.exec(tag);
  }

  return attrs;
}

function getClassList(tag) {
  const attrs = getAttributes(tag);
  return (attrs.class || '').split(/\s+/).filter(Boolean);
}

function hasAnyClass(classList, candidates) {
  return candidates.some((className) => classList.includes(className));
}

function getOuterTag(element) {
  const match = element.match(/^<([\w-]+)([\s\S]*?)>/);

  if (!match) {
    throw new Error(`Cannot parse opening tag from element: ${element.slice(0, 80)}`);
  }

  return {
    name: match[1],
    raw: match[0],
    attrs: getAttributes(match[0]),
  };
}

function getInnerHtml(element) {
  const { name } = getOuterTag(element);
  const openTag = element.match(/^<[\w-]+[\s\S]*?>/)[0];
  const closeTag = new RegExp(`</${name}>\\s*$`);
  return element.replace(openTag, '').replace(closeTag, '');
}

function decodeWhitespace(html) {
  return html.replace(/\r\n/g, '\n').trim();
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function splitTopLevelElements(html) {
  const content = decodeWhitespace(html);
  const elements = [];
  let index = 0;

  while (index < content.length) {
    while (/\s/.test(content[index] || '')) {
      index += 1;
    }

    if (index >= content.length) {
      break;
    }

    if (content.startsWith('<!--', index)) {
      const commentEnd = content.indexOf('-->', index);
      if (commentEnd === -1) {
        throw new Error('Unclosed comment while splitting HTML elements.');
      }
      index = commentEnd + 3;
      continue;
    }

    if (content[index] !== '<') {
      const nextIndex = content.indexOf('<', index);
      index = nextIndex === -1 ? content.length : nextIndex;
      continue;
    }

    const openMatch = content.slice(index).match(/^<([\w-]+)([\s\S]*?)>/);
    if (!openMatch) {
      throw new Error(`Unable to parse HTML near: ${content.slice(index, index + 120)}`);
    }

    const tagName = openMatch[1];
    const start = index;
    const firstTag = openMatch[0];
    index += firstTag.length;

    const selfClosing =
      firstTag.endsWith('/>') ||
      ['img', 'br', 'hr', 'meta', 'link', 'input'].includes(tagName);

    if (selfClosing) {
      elements.push(content.slice(start, index));
      continue;
    }

    let depth = 1;
    const tagPattern = /<!--[\s\S]*?-->|<\/?([\w-]+)([\s\S]*?)>/g;
    tagPattern.lastIndex = index;

    while (depth > 0) {
      const tagMatch = tagPattern.exec(content);
      if (!tagMatch) {
        throw new Error(`Unclosed <${tagName}> element.`);
      }

      const fullTag = tagMatch[0];
      if (fullTag.startsWith('<!--')) {
        continue;
      }

      const currentTag = tagMatch[1];
      const isClosing = fullTag.startsWith('</');
      const isSelfClosing =
        fullTag.endsWith('/>') ||
        ['img', 'br', 'hr', 'meta', 'link', 'input'].includes(currentTag);

      if (currentTag === tagName && !isSelfClosing) {
        depth += isClosing ? -1 : 1;
      }

      index = tagPattern.lastIndex;
    }

    elements.push(content.slice(start, index));
  }

  return elements;
}

function extractTextByClass(element, className, tag = '[\\w-]+') {
  const pattern = new RegExp(
    `<${tag}[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/${tag}>`
  );
  const match = element.match(pattern);
  return match ? decodeWhitespace(match[1]) : '';
}

function extractTextByClasses(element, classNames, tag = '[\\w-]+') {
  for (const className of classNames) {
    const text = extractTextByClass(element, className, tag);
    if (text) {
      return text;
    }
  }

  return '';
}

function parseImage(element) {
  const tag = getOuterTag(element);
  return {
    src: tag.attrs.src,
    alt: tag.attrs.alt || '',
    zoom: /data-zoom-image/.test(tag.raw),
    ...(tag.attrs.style ? { style: tag.attrs.style } : {}),
  };
}

function parseOrderedList(element) {
  return {
    type: 'orderedList',
    className: 'module__content--content',
    items: [...element.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((match) =>
      decodeWhitespace(match[1])
    ),
  };
}

function parseButton(element) {
  const href = element.match(/<a[^>]*href="([^"]+)"/)?.[1] || '';
  const target = element.match(/<a[^>]*target="([^"]+)"/)?.[1];
  const label = decodeWhitespace(element.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || '');

  return {
    type: 'button',
    href,
    ...(target ? { target } : {}),
    label,
  };
}

function parseCallOut(element) {
  return {
    type: 'callOut',
    title: extractTextByClasses(element, ['module__title', 'project-module__callout-title'], 'p'),
    text: extractTextByClasses(element, ['module__text', 'project-module__text'], 'p'),
  };
}

function parseLinkParagraph(element) {
  const href = element.match(/<a[^>]*href="([^"]+)"/)?.[1] || '';
  const target = element.match(/<a[^>]*target="([^"]+)"/)?.[1];
  const paragraphHtml = element.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || '';

  return {
    type: 'linkParagraph',
    href,
    ...(target ? { target } : {}),
    html: decodeWhitespace(paragraphHtml),
  };
}

function parsePureText(element) {
  const inner = getInnerHtml(element);
  const children = splitTopLevelElements(inner);
  const items = children.map((child) => {
    if (child.startsWith('<p')) {
      const tag = getOuterTag(child);
      return {
        type: 'paragraph',
        className: tag.attrs.class || 'project-module__text',
        html: decodeWhitespace(getInnerHtml(child)),
      };
    }

    if (child.startsWith('<ol')) {
      return parseOrderedList(child);
    }

    if (child.includes('module__button') || child.includes('project-module__button')) {
      return parseButton(child);
    }

    if (child.includes('module__callOut') || child.includes('project-module__callout')) {
      return parseCallOut(child);
    }

    if (child.startsWith('<a')) {
      return parseLinkParagraph(child);
    }

    throw new Error(`Unsupported pureText child: ${child.slice(0, 120)}`);
  });

  return {
    type: 'pureText',
    items,
  };
}

function parseQuote(element) {
  const paragraphMatch = element.match(/<p([^>]*)>([\s\S]*?)<\/p>/);
  const attrs = paragraphMatch ? getAttributes(`<p${paragraphMatch[1]}>`) : {};

  return {
    type: 'quote',
    html: decodeWhitespace(paragraphMatch?.[2] || ''),
    ...(attrs.class ? { paragraphClass: attrs.class } : {}),
  };
}

function parseBgQuote(element) {
  const children = splitTopLevelElements(getInnerHtml(element));
  const headingElement = children.find((child) => /^<h\d/i.test(child));
  const callOutListElement = children.find((child) =>
    child.includes('module__callOutList') ||
    child.includes('project-module__callout-list')
  );
  const headingTagInfo = headingElement
    ? getOuterTag(headingElement)
    : { name: 'h3', attrs: {}, raw: '<h3>' };
  const callOutListTagInfo = callOutListElement
    ? getOuterTag(callOutListElement)
    : { attrs: {} };
  const callOutItems = callOutListElement
    ? splitTopLevelElements(getInnerHtml(callOutListElement)).filter((child) =>
        child.includes('module__callOut')
      )
    : [];

  return {
    type: 'bgQuote',
    headingTag: headingTagInfo.name || 'h3',
    headingHtml: headingElement ? decodeWhitespace(getInnerHtml(headingElement)) : '',
    ...(headingTagInfo.attrs.style ? { headingStyle: headingTagInfo.attrs.style } : {}),
    ...(callOutListTagInfo.attrs.style
      ? { callOutListStyle: callOutListTagInfo.attrs.style }
      : {}),
    callOuts: callOutItems.map((item) => parseCallOut(item)),
  };
}

function parseVerticalIconList(element) {
  const items = splitTopLevelElements(getInnerHtml(element)).map((item) => {
    const cleanItem = stripComments(item);
    const imageMatch = cleanItem.match(/<img[\s\S]*?\/>/);
    const contentMatch = cleanItem.match(
      /<div class="(?:module__content|project-module__item-content)">([\s\S]*?)<\/div>\s*$/
    );
    const contentHtml = contentMatch ? contentMatch[1] : '';
    const titleMatch = contentHtml.match(
      /<(h[36])[^>]*class="(?:module__content--title|project-module__item-title)"[^>]*>([\s\S]*?)<\/\1>/
    );
    const paragraphs = [
      ...contentHtml.matchAll(
        /<p[^>]*class="(?:module__content--content|project-module__item-text)"[^>]*>([\s\S]*?)<\/p>/g
      ),
    ].map((match) => decodeWhitespace(match[1]));

    return {
      ...(imageMatch ? { image: parseImage(imageMatch[0]) } : {}),
      ...(titleMatch ? { title: decodeWhitespace(titleMatch[2]), titleTag: titleMatch[1] } : {}),
      paragraphs,
    };
  });

  return {
    type: 'verticalIconList',
    items,
  };
}

function parseHorizontalIconList(element) {
  const items = splitTopLevelElements(getInnerHtml(element)).map((item) => ({
    image: parseImage(item.match(/<img[\s\S]*?\/>/)[0]),
    title: extractTextByClasses(item, ['module__content--title', 'project-module__item-title'], 'h6'),
    content: extractTextByClasses(item, ['module__content--content', 'project-module__item-text'], 'p'),
  }));

  return {
    type: 'horizontalIconList',
    items,
  };
}

function parseImgAndContentBlock(element) {
  const imageMatch = element.match(/<img[\s\S]*?\/>/);
  const contentHtml =
    element.match(/<div class="(?:module__content|project-module__content)">([\s\S]*?)<\/div>\s*$/)?.[1] ||
    '';
  const children = splitTopLevelElements(contentHtml);
  const entries = [];
  let currentEntry = null;

  children.forEach((child) => {
    if (child.startsWith('<h6')) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = {
        title: decodeWhitespace(getInnerHtml(child)),
      };
      return;
    }

    if (!currentEntry) {
      return;
    }

    if (child.startsWith('<p')) {
      currentEntry.paragraphs = currentEntry.paragraphs || [];
      currentEntry.paragraphs.push(decodeWhitespace(getInnerHtml(child)));
      return;
    }

    if (child.startsWith('<div') && child.includes('module__pureText')) {
      const parsed = parsePureText(child);
      const paragraphs = parsed.items
        .filter((item) => item.type === 'paragraph')
        .map((item) => item.html);
      currentEntry.paragraphs = [...(currentEntry.paragraphs || []), ...paragraphs];
      return;
    }

    if (child.startsWith('<ol')) {
      currentEntry.orderedList = parseOrderedList(child).items;
    }
  });

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return {
    type: 'imgAndContentBlock',
    image: parseImage(imageMatch[0]),
    entries,
  };
}

function parseBigQuote(element) {
  const attrs = getAttributes(
    element.match(/^<project-content-bigquote([\s\S]*?)><\/project-content-bigquote>$/)?.[0] ||
      element
  );
  return {
    type: 'bigQuote',
    icon: attrs.icon,
    content: attrs.content,
  };
}

function parseRenderedBigQuote(element) {
  const iconMatch = element.match(/<img[^>]*class="project-module__icon"[^>]*src="([^"]+)"/);
  const headingHtml = extractTextByClass(element, 'project-module__heading', 'h3');

  return {
    type: 'bigQuote',
    ...(iconMatch ? { icon: iconMatch[1] } : {}),
    content: headingHtml,
  };
}

function parseModule(element) {
  if (element.startsWith('<project-content-bigquote')) {
    return parseBigQuote(element);
  }

  if (element.startsWith('<ol')) {
    return parseOrderedList(element);
  }

  const classList = getClassList(getOuterTag(element).raw);

  if (hasAnyClass(classList, ['module__bgTitle', 'project-module--section-title'])) {
    return {
      type: 'bgTitle',
      html: extractTextByClasses(element, ['module__bgText', 'project-module__heading'], 'h3'),
    };
  }
  if (hasAnyClass(classList, ['module__mdTitle', 'project-module--eyebrow'])) {
    return {
      type: 'mdTitle',
      html: extractTextByClasses(element, ['module__mdText', 'project-module__eyebrow'], 'h6'),
    };
  }
  if (hasAnyClass(classList, ['module__pureTitle', 'project-module--subsection-title'])) {
    return {
      type: 'pureTitle',
      html: extractTextByClasses(element, ['module__semiTitle', 'project-module__subheading'], 'h6'),
    };
  }
  if (hasAnyClass(classList, ['module__pureText', 'project-module--text'])) {
    return parsePureText(element);
  }
  if (classList.includes('module_pureText')) {
    return parsePureText(element);
  }
  if (hasAnyClass(classList, ['module__quote', 'project-module--quote'])) {
    return parseQuote(element);
  }
  if (
    classList.includes('project-module--feature-quote') &&
    element.includes('project-module__icon') &&
    !element.includes('project-module__callout-list')
  ) {
    return parseRenderedBigQuote(element);
  }
  if (hasAnyClass(classList, ['module__bgQuote', 'project-module--feature-quote'])) {
    return parseBgQuote(element);
  }
  if (hasAnyClass(classList, ['module__singleImage', 'project-module--image'])) {
    return {
      type: 'singleImage',
      image: parseImage(element.match(/<img[\s\S]*?\/>/)[0]),
    };
  }
  if (hasAnyClass(classList, ['module__doubleImage', 'project-module--image-pair'])) {
    return {
      type: 'doubleImage',
      images: [...element.matchAll(/<img[\s\S]*?\/>/g)].map((match) =>
        parseImage(match[0])
      ),
    };
  }
  if (hasAnyClass(classList, ['module__verticalIconList', 'project-module--icon-list-vertical'])) {
    return parseVerticalIconList(element);
  }
  if (hasAnyClass(classList, ['module__horizontalIconList', 'project-module--icon-list-horizontal'])) {
    return parseHorizontalIconList(element);
  }
  if (hasAnyClass(classList, ['module__imgAndContentBlock', 'project-module--media-content'])) {
    return parseImgAndContentBlock(element);
  }

  throw new Error(`Unsupported module element: ${element.slice(0, 120)}`);
}

function parseSection(element) {
  const outerTag = getOuterTag(element);
  const classList = getClassList(outerTag.raw);
  const classes = classList
    .filter(
      (className) =>
        className !== 'container' &&
        className !== 'container--contentSection' &&
        className !== 'project-page__section'
    )
    .map((className) => {
      const classMap = {
        'project-page__section--featured': 'specialSection',
        'project-page__section--featured-gray': 'specialSection--gray',
        'project-page__section--featured-yellow': 'specialSection--yellow',
        'project-page__section--narrow': 'specialSection--narrow',
      };

      return classMap[className] || className;
    });
  const modules = splitTopLevelElements(getInnerHtml(element)).map((child) =>
    parseModule(child)
  );

  return {
    ...(classes.length ? { classes } : {}),
    modules,
  };
}

function convertProject(project) {
  if (project.sections && !project.rawContentHtml) {
    return project;
  }

  const nextProject = { ...project, sections: {} };

  ['en', 'zh'].forEach((lang) => {
    nextProject.sections[lang] = splitTopLevelElements(
      project.rawContentHtml[lang]
    ).map((sectionHtml) => parseSection(sectionHtml));
  });

  delete nextProject.rawContentHtml;

  return nextProject;
}

module.exports = {
  convertProject,
};
