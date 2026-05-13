const fs = require('fs');
const path = require('path');
const { renderSections } = require('./projectBlocks');

function indent(text, spaces = 4) {
  const prefix = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

function renderTranslator(project, lang) {
  return '';
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

function getProjectHeaderImages(project) {
  const imageMap = {
    ba: {
      bg: '../../img/projects/ba/image-ba-projectHeader-bg.webp',
      main: '../../img/projects/ba/image-ba-projectHeader-main.webp',
    },
    bizpro: {
      bg: '../../img/projects/bizpro/image-bp-projectHeader-bg.webp',
      main: '../../img/projects/bizpro/image-bp-projectHeader-main.webp',
    },
    childcare: {
      bg: '../../img/projects/childcare/image-cc-projectHeader-bg.webp',
      main: '../../img/projects/childcare/image-cc-projectHeader-main.webp',
    },
    designSystem: {
      bg: '../../img/projects/designSystem/image-ds-projectHeader-bg.webp',
      main: '../../img/projects/designSystem/image-ds-projectHeader-main.webp',
    },
    forest: {
      bg: '../../img/projects/forest/image-forest-projectHeader-bg.webp',
      main: '../../img/projects/forest/image-forest-projectHeader-main.webp',
    },
    gongChi: {
      bg: '../../img/projects/gongChi/image-gongChi-projectHeader-bg.webp',
      main: '../../img/projects/gongChi/image-gongChi-projectHeader-main.webp',
    },
    pos: {
      bg: '../../img/projects/pos/image-pos-projectHeader-bg.webp',
      main: '../../img/projects/pos/image-pos-projectHeader-main.webp',
    },
    rfid: {
      bg: '../../img/projects/rfid/image-rfid-projectHeader-bg.webp',
      main: '../../img/projects/rfid/image-rfid-projectHeader-main.png',
    },
  };

  const images = imageMap[project.slug] || {};
  const resolveLocalReference = (src) =>
    path.join(__dirname, '..', src.replace(/^(\.\.\/)+/, ''));
  const existingOrCover = (src) =>
    src && fs.existsSync(resolveLocalReference(src)) ? src : project.coverImage;

  return {
    bg: existingOrCover(images.bg),
    main: existingOrCover(images.main),
  };
}

function renderHeader(project, header) {
  const headerImages = getProjectHeaderImages(project);
  const tags = (project.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map(
      (tag) => `          <div class="project-header__tag">
            <p>${tag}</p>
          </div>`,
    )
    .join('\n');

  const tagsBlock = tags
    ? `        <div class="project-header__tags">
${tags}
        </div>
`
    : '';

  return `    <main class="project-header" id="top">
      <img
        src="${headerImages.bg}"
        alt=""
        class="project-header__bg"
        aria-hidden="true"
      />
      <div class="project-header__inner">
        <img
          src="${headerImages.main}"
          alt="${header.title}"
          class="project-header__image"
        />
        <div class="project-header__content">
${tagsBlock}          <h3 class="project-header__title">${header.title}</h3>
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
      href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&family=DM+Serif+Text:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <title>${head.title}</title>
    <link rel="icon" href="../../img/favicon.ico" type="image/x-icon" />
  </head>
  <body class="project-page project-page--${project.slug}">
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
    <section class="project-page__content">
      <div class="project-page__content-inner">
${renderContent(project, lang)}
      </div>
    </section>
    ${renderNavigationWrapper(head.navigationLanguage)}
    <script src="../../utility/image-zoom.js"></script>
    <script src="../../utility/createToc.js"></script>
    <script src="../../utility/loadingPage.js"></script>
  </body>
</html>
`;
}

module.exports = {
  renderProjectPage,
};
