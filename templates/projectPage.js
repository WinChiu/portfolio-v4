const { renderSections } = require('./projectBlocks');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function indent(text, spaces = 4) {
  const prefix = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

function renderNavigation(language) {
  const backLink = language === 'zh' ? '../../home-zh.html#work' : '/#work';

  return `<nav class="project-nav index" id="navbar" aria-label="Project sections">
      <span class="index__fill" aria-hidden="true"></span>
      <a class="index__back mono" href="${backLink}">Back</a>
      <span class="mobile-current mono" aria-live="polite">Overview</span>
      <button class="sections-toggle mono" type="button" aria-label="Sections" aria-expanded="false" aria-controls="section-list">Sections</button>
      <ol class="project-nav__toc index__list" id="section-list" data-lenis-prevent></ol>
      <div class="index__foot"><a class="mono" href="#top">Top</a></div>
      <span class="page-progress" aria-hidden="true"></span>
    </nav>`;
}

// Splits "A, B (C, D), and E" (or the Chinese "A、B（C、D）") into ["A", "B (C, D)", "E"]: separators inside
// parentheses stay, and a leading "and" is dropped.
function splitScope(text) {
  const items = [];
  let depth = 0;
  let current = '';
  for (const char of String(text)) {
    if ('(（'.includes(char)) depth += 1;
    if (')）'.includes(char)) depth = Math.max(0, depth - 1);
    if (depth === 0 && ',，、'.includes(char)) { items.push(current); current = ''; continue; }
    current += char;
  }
  items.push(current);
  return items.map((item) => item.trim().replace(/^and\s+/i, '')).filter(Boolean);
}

function renderHeader(project, header, lang) {
  const colon = header.title.indexOf(':');
  const title = colon < 0 ? header.title : `${header.title.slice(0, colon)}<span class="ink">${header.title.slice(colon)}</span>`;
  return `<header class="project-header p-head" id="top" tabindex="-1">
      <div class="p-titleblock">
        <h1 class="project-header__title p-title">${title}</h1>
      </div>
      <div class="project-header__metadata p-facts">
        <p class="p-facts__line project-header__meta-item">${['role', 'company', 'duration'].filter(key => header[key]).map(key => `<span>${header[key]}</span>`).join('')}</p>
        ${header.responsibility ? `<div class="p-scope project-header__meta-item"><ul class="p-scope__list" aria-label="${lang === 'zh' ? '負責內容' : 'Scope'}">${splitScope(header.responsibility).map((item) => `<li>${item}</li>`).join('')}</ul></div>` : ''}
      </div>
    </header>`;
}

function renderNextProject(project, lang) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../content/homeContent.js'), 'utf8'), context);
  const visible = context.window.__HOME_PAGE_CONTENT__[lang].projects
    .filter(item => item.type === 'design' && !item.hidden)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  const slugOf = item => /pages\/(?:en|zh)\/([^/?#]+)\.html/.exec(item.projectUrl)?.[1];
  const index = visible.findIndex(item => slugOf(item) === project.slug);
  const next = visible[(index + 1) % visible.length];
  if (!next) return '';
  const slug = slugOf(next);
  const href = slug ? `${slug}.html` : next.projectUrl;
  return `<a class="next project-page--${slug || 'designSystem'}" href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="mono mute">Next project</span><p class="p-title">${next.title}</p></a>`;
}

function renderNavigationWrapper(language) {
  if (language === 'zh') {
    return renderNavigation('zh');
  }

  return renderNavigation('en');
}

function renderContent(project, lang) {
  if (project.sections && project.sections[lang]) {
    return renderSections(project.sections[lang]);
  }

  if (project.rawContentHtml && project.rawContentHtml[lang]) {
    return indent(project.rawContentHtml[lang].trim(), 8);
  }

  throw new Error(
    `No content found for project "${project.slug}" in lang "${lang}"`,
  );
}

function renderProjectPage(project, lang) {
  const head = project.head[lang];
  const header = project.header[lang];

  return `<!DOCTYPE html>
<html lang="${head.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      src="https://code.jquery.com/jquery-3.7.1.min.js"
      integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
      crossorigin="anonymous"
    ></script>
    <script src="../../utility/gsap.min.js"></script>
    <script src="../../utility/ScrollTrigger.min.js"></script>
    <script src="../../utility/lenis.min.js"></script>
    <script src="../../utility/smoothScroll.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.dotdotdot/4.1.0/dotdotdot.min.js"></script>
    <link rel="stylesheet" href="../../style/image-zoom.css" />
    <link rel="stylesheet" href="../../style/workStyle.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
      rel="stylesheet"
    />
    <title>${head.title}</title>
    <link rel="icon" href="../../img/favicon.ico" type="image/x-icon" />
  </head>
  <body class="project-page project-page--${project.slug}">
    <!-- Generated from project content data -->
    <div class="ui-loader page-loader"></div>

<a class="skip-link mono" href="#top">Skip to project</a>
    <main class="with-nav">
${renderHeader(project, header, lang)}
    <section class="project-page__content">
      <div class="project-page__content-inner">
${renderContent(project, lang)}
      </div>
    </section>
    ${renderNextProject(project, lang)}
    </main>
    ${renderNavigationWrapper(head.navigationLanguage)}
    <script src="../../utility/image-zoom.js"></script>
    <script src="../../utility/createToc.js"></script>
    <script src="../../utility/projectPageAnimation.js"></script>
    <script src="../../utility/loadingPage.js"></script>
  </body>
</html>
`;
}

module.exports = {
  renderProjectPage,
};
