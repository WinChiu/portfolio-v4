const { renderSections } = require('./projectBlocks');

function indent(text, spaces = 4) {
  const prefix = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

function renderTranslator(project, lang) {
  const head = project.head[lang];

  if (!head.translatorHref) {
    return indent('<div class="project-translator"></div>');
  }

  return indent(`<div class="project-translator">
  <a href="${head.translatorHref}"><p>${project.languageLabel}</p></a>
</div>`);
}

function renderNavigation(language) {
  const backLink = language === 'zh' ? '../../home-zh.html#work' : '/#work';

  return `<nav class="project-nav" id="navbar">
      <div class="project-nav__group">
        <h6 class="project-nav__item">
          <a href="${backLink}">Back</a>
        </h6>
      </div>
      <div class="project-nav__group">
        <h6 class="project-nav__item">
          <a href="#top">Top</a>
        </h6>
      </div>
    </nav>`;
}

function renderHeader(project, header) {
  const tags = (project.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map(
      (tag) => `          <div class="project-header__tag">
            <p>${tag}</p>
          </div>`
    )
    .join('\n');

  const tagsBlock = tags
    ? `        <div class="project-header__tags">
${tags}
        </div>
`
    : '';

  return `    <main class="project-header" id="top">
      <div class="project-header__inner">
        <div class="project-header__content">
${tagsBlock}          <h2 class="project-header__title">${header.title}</h2>
          <div class="project-header__metadata">
            <div class="project-header__meta-item">
              <p class="project-header__meta-label">Duration</p>
              <p class="project-header__meta-value">${header.duration}</p>
            </div>
            <div class="project-header__meta-item">
              <p class="project-header__meta-label">Role</p>
              <p class="project-header__meta-value">${header.role}</p>
            </div>
            <div class="project-header__meta-item">
              <p class="project-header__meta-label">Responsibility</p>
              <p class="project-header__meta-value">${header.responsibility}</p>
            </div>
            <div class="project-header__meta-item">
              <p class="project-header__meta-label">Company</p>
              <p class="project-header__meta-value">${header.company}</p>
            </div>
          </div>
        </div>
      </div>
    </main>`;
}

function renderIntroSummary(title, content) {
  if (!content) {
    return '';
  }

  return `        <div class="project-intro__summary">
          <p class="project-intro__summary-title">${title}</p>
          <p class="project-intro__summary-content">${content}</p>
        </div>`;
}

function renderIntroduction(project, head, introduction) {
  const purpose = introduction.purpose;
  const challenge = introduction.challenge;
  const production = introduction.production;
  const outcome = introduction.outcome;

  const hasAllSections = purpose && challenge && production && outcome;
  const hasPurposeProductionOnly =
    purpose && production && !challenge && !outcome;

  let topRightSections = '';
  let bottomSections = '';

  if (hasAllSections) {
    topRightSections = [
      renderIntroSummary('Purpose', purpose),
      renderIntroSummary('Challenge', challenge),
    ].join('\n');

    bottomSections = [
      renderIntroSummary('Production', production),
      renderIntroSummary('Outcome', outcome),
    ].join('\n');
  } else if (hasPurposeProductionOnly) {
    topRightSections = [
      renderIntroSummary('Purpose', purpose),
      renderIntroSummary('Production', production),
    ].join('\n');
  } else {
    topRightSections = [
      renderIntroSummary('Purpose', purpose),
      renderIntroSummary('Challenge', challenge),
      renderIntroSummary('Production', production),
      renderIntroSummary('Outcome', outcome),
    ]
      .filter(Boolean)
      .join('\n');
  }

  return `    <section class="project-intro">
      <div class="project-intro__inner">
        <div class="project-intro__top">
          <div class="project-intro__media">
            <img
              src="${project.coverImage}"
              alt="${head.imageAlt}"
              class="project-intro__image"
            />
          </div>
${topRightSections ? `          <div class="project-intro__summary-grid">
${topRightSections}
          </div>` : ''}
        </div>
${bottomSections ? `        <div class="project-intro__bottom">
${bottomSections}
        </div>` : ''}
      </div>
    </section>`;
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

  throw new Error(`No content found for project "${project.slug}" in lang "${lang}"`);
}

function renderProjectPage(project, lang) {
  const head = project.head[lang];
  const header = project.header[lang];
  const introduction = project.introduction[lang];

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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.dotdotdot/4.1.0/dotdotdot.min.js"></script>
    <script
      src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js"
      type="module"
    ></script>
    <link rel="stylesheet" href="../../style/image-zoom.css" />
    <link rel="stylesheet" href="../../style/workStyle.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"
      rel="stylesheet"
    />
    <title>${head.title}</title>
    <link rel="icon" href="./img/favicon.ico" type="image/x-icon" />
  </head>
  <body class="project-page">
    <!-- Generated from project content data -->
    <div class="page-loader">
      <dotlottie-wc
        src="https://lottie.host/5d48cdf2-9cfc-4b40-8a88-807eb0ffee03/ejEDoHb0VS.lottie"
        autoplay
        loop
      ></dotlottie-wc>
    </div>

${renderTranslator(project, lang)}
${renderHeader(project, header)}
${renderIntroduction(project, head, introduction)}
    <section class="project-page__content">
      <div class="project-page__content-inner">
${renderContent(project, lang)}
      </div>
    </section>
    ${renderNavigationWrapper(head.navigationLanguage)}
    <script src="../../utility/image-zoom.js"></script>
    <script src="../../utility/createToc.js"></script>
    <script src="../../utility/hideTranslator.js"></script>
    <script src="../../utility/workScrollAnimation.js"></script>
    <script src="../../utility/loadingPage.js"></script>
  </body>
</html>
`;
}

module.exports = {
  renderProjectPage,
};
