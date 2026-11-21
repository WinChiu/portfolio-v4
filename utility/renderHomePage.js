(function () {
  const contentMap = window.__HOME_PAGE_CONTENT__;
  const root = document.getElementById('home-page-root');

  if (!contentMap || !root) return;

  const lang = document.documentElement.lang === 'zh' ? 'zh' : 'en';
  const content = contentMap[lang];

  function resolveAssetPath(value) {
    if (typeof value !== 'string') return value;
    if (!value.startsWith('/')) return value;
    return `.${value}`;
  }

  function escapeAttribute(value) {
    return String(value).replace(/"/g, '&quot;');
  }

  function renderProjects(projects) {
    return projects
      .filter((project) => !project.hidden)
      .sort(
        (projectA, projectB) =>
          (projectA.order ?? Number.MAX_SAFE_INTEGER) -
          (projectB.order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((project) => {
        const attributes = [
          `number="${escapeAttribute(project.number)}"`,
          `title="${escapeAttribute(project.title)}"`,
          `tag="${escapeAttribute(project.tag)}"`,
          `description="${escapeAttribute(project.description)}"`,
          `image-url="${escapeAttribute(resolveAssetPath(project.imageUrl))}"`,
          `project-url="${escapeAttribute(project.projectUrl)}"`,
          `type="${escapeAttribute(project.type)}"`,
          `lang="${escapeAttribute(project.lang)}"`,
        ];

        if (project.siteUrl) {
          attributes.push(`site-url="${escapeAttribute(project.siteUrl)}"`);
        }
        if (project.coverType) {
          attributes.push(`cover-type="${escapeAttribute(project.coverType)}"`);
        }

        return `<project-card ${attributes.join(' ')}></project-card>`;
      })
      .join('\n');
  }

  function renderJobs(jobs) {
    return jobs
      .map((job) => {
        const pastClass = job.isPast ? ' block__jobDescription--past' : '';
        return `
            <div class="block__jobDescription${pastClass}">
              <p class="block__jobDescription--title">${job.title}</p>
              <div class="block__jobDescription--dotLine"></div>
              <p class="block__jobDescription--company">${job.company}</p>
            </div>`;
      })
      .join('\n');
  }

  function renderAboutParagraphs(paragraphs) {
    return paragraphs
      .map((paragraph) => `<p class="block__content">${paragraph}</p>`)
      .join('\n');
  }

  function renderKitchenMenuSection(kitchen) {
    const flame = '<svg viewBox="0 0 11 14" aria-hidden="true"><path d="M5.5 13C2.5 13 1 11 1 8.6 1 6 3.4 4.6 4 1.2c2.4 1.6 3.3 3.4 3 5.4.8-.5 1.4-1.3 1.6-2.2C9.6 5.6 10 7 10 8.6 10 11 8.5 13 5.5 13Z"/></svg>';
    return `<section class="section section--kitchenMenu" id="kitchen">
      <div class="container container--content">
        <header class="kitchenMenu__head"><h1 class="kitchenMenu__title">${kitchen.title}</h1><p class="kitchenMenu__description">${kitchen.description}</p></header>
        <div class="kitchenMenu__menu">${kitchen.courses.map((course) => {
          const items = kitchen.items.map((item, index) => ({ ...item, index })).filter((item) => item.course === course.key);
          if (!items.length) return '';
          return `<section class="kitchenMenu__course"><h2 class="kitchenMenu__courseHead"><span class="kitchenMenu__courseZh">${course.zh}</span><span class="kitchenMenu__courseEn">${course.en}</span><span class="kitchenMenu__courseLine" aria-hidden="true"></span></h2>
            ${items.map((item) => `<button type="button" class="kitchenMenu__dish" data-index="${item.index}" aria-haspopup="dialog" aria-controls="kitchen-recipe">
              <span class="kitchenMenu__names"><span class="kitchenMenu__zh">${item.nameZh}</span><span class="kitchenMenu__en">${item.nameEn}</span></span><span class="kitchenMenu__leader" aria-hidden="true"></span><span class="kitchenMenu__effort" role="img" aria-label="Effort ${item.effort} of 3">${[1, 2, 3].map((n) => `<span class="${n > item.effort ? 'is-off' : ''}">${flame}</span>`).join('')}</span>
            </button>`).join('')}</section>`;
        }).join('')}</div>
      </div>
      <div class="kitchenMenu__overlay" inert aria-hidden="true"><div class="kitchenMenu__scrim"></div><aside class="kitchenMenu__sheet" id="kitchen-recipe" role="dialog" aria-modal="true" aria-labelledby="kitchen-recipe-name" tabindex="-1" data-lenis-prevent></aside></div>
    </section>`;
  }

  function renderLifeCard(item, index) {
    return `
        <article class="life__card" data-index="${index}">
          <div class="life__cardPhoto">
            <img class="life__photo" src="${resolveAssetPath(item.imageSrc)}"
              alt="${escapeAttribute(item.imageAlt)}" loading="${index < 4 ? 'eager' : 'lazy'}" />
          </div>
          <p class="life__note">${item.note}</p>
          <div class="life__cardMeta">
            <span class="life__location">${item.location}</span>
            ${item.date?.trim() ? `<span class="life__date">${item.date}</span>` : ''}
          </div>
        </article>`;
  }

  function renderLifeSection(life) {
    return `
      <section class="section section--life" id="life">
        <div class="container container--content">
          <header class="life__intro">
            <h1 class="life__title">${life.title}</h1>
            <p class="life__description">${life.description}</p>
          </header>
          <div class="life__viewport" tabindex="0" role="region"
            aria-label="${lang === 'zh' ? '生活照片' : 'Life photos'}" data-lenis-prevent-horizontal>
            <div class="life__strip">
              ${life.items.map(renderLifeCard).join('\n')}
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderNav(items) {
    return items
      .map(
        (item) =>
          `<h6 class="block__navItem"><a class="ui-link ui-link--nav" href="${item.href}">${item.label}</a></h6>`,
      )
      .join('\n');
  }

  function renderHeroDetails(details) {
    if (!details || !details.length) return '';

    return `
          <div class="block__heroDetails" id="annotation">
            ${details
              .map(
                (item) => `
              <div class="block__heroDetail">
                <p class="block__heroDetailTitle">${item.title}</p>
                <p class="block__heroDetailSubtitle">${item.subtitle}</p>
              </div>`,
              )
              .join('\n')}
          </div>`;
  }

  root.innerHTML = `
    <main class="section section--main">
      <div class="container container--content">
        <article class="block block--introduction">
          <div class="block__heroCopy">
            <header class="block__header">
              ${
                content.hero.eyebrow
                  ? `<p class="block__eyebrow" id="hero-eyebrow">${content.hero.eyebrow}</p>`
                  : ''
              }
              <h1 class="block__title" id="greet">${content.hero.title}</h1>
            </header>
            <h4 class="block__description${lang === 'zh' ? ' block__description--zh' : ''}" id="intro">
              ${content.hero.description}
            </h4>
          </div>
          ${renderHeroDetails(content.hero.details)}
          <div class="block__bgImage"></div>
        </article>
        <figure class="media media--image">
          <img src="./img/image-landingAvatar.webp" alt="" class="media__img--body" />
          <img
            src="./img/image-landingAvatarEyebrow-left.webp"
            alt=""
            class="media__img--facial media__img--eyebrowLeft"
          />
          <img
            src="./img/image-landingAvatarEyebrow-right.webp"
            alt=""
            class="media__img--facial media__img--eyebrowRight"
          />
          <div class="media__img--facial media__img--eyeLeft media__img--eyeLeftFix"></div>
          <div class="media__img--facial media__img--eyeRight media__img--eyeRightFix"></div>
          <img
            src="./img/image-landingAvatarEye1-left.webp"
            alt=""
            class="media__img--facial media__img--eyeLeft media__img--eye1Left"
          />
          <img
            src="./img/image-landingAvatarEye2-left.webp"
            alt=""
            class="media__img--facial media__img--eyeLeft media__img--eye2Left"
          />
          <img
            src="./img/image-landingAvatarEye3-left.webp"
            alt=""
            class="media__img--facial media__img--eyeLeft media__img--eye3Left"
          />
          <img
            src="./img/image-landingAvatarEye1-right.webp"
            alt=""
            class="media__img--facial media__img--eyeRight media__img--eye1Right"
          />
          <img
            src="./img/image-landingAvatarEye2-right.webp"
            alt=""
            class="media__img--facial media__img--eyeRight media__img--eye2Right"
          />
          <img
            src="./img/image-landingAvatarEye3-right.webp"
            alt=""
            class="media__img--facial media__img--eyeRight media__img--eye3Right"
          />
          <img
            src="./img/image-landingAvatarEye1Socket-left.webp"
            alt=""
            class="media__img--facial media__img--eye1SocketLeft"
          />
          <img
            src="./img/image-landingAvatarEye1Socket-right.webp"
            alt=""
            class="media__img--facial media__img--eye1SocketRight"
          />
          <img
            src="./img/image-landingAvatarMouth-smile.webp"
            alt=""
            class="media__img--facial media__img--mouth media__img--mouthSmile"
          />
          <img
            src="./img/image-landingAvatarMouth-strange.webp"
            alt=""
            class="media__img--facial media__img--mouth media__img--mouthStrange"
          />
        </figure>
        <div class="block block__translator">
          <a class="ui-link ui-link--nav" href="${content.translatorHref}"><p>${content.translatorLabel}</p></a>
        </div>
      </div>
    </main>
    <section class="section section--work" id="work">
      <article class="ui-segmented-control block block--switcher" aria-label="Project type">
        <button type="button" class="ui-segmented-control__item block__design selected is-selected" aria-pressed="true">
          <h4>${content.workTabs.design}</h4>
        </button>
        <button type="button" class="ui-segmented-control__item block__coding" aria-pressed="false">
          <h4>${content.workTabs.code}</h4>
        </button>
      </article>
      ${renderProjects(content.projects)}
    </section>
    <section class="section section--about" id="about">
      <div class="container container--content">
        <figure class="media media--avatar">
          <img class="media__img" src="${resolveAssetPath(content.about.imageSrc)}" alt="${content.about.imageAlt}" />
        </figure>
        <article class="block block--introduction">
          <h1 class="block__title">${content.about.title}</h1>
          ${renderAboutParagraphs(content.about.paragraphs)}
          <div class="block__jobs">
            ${renderJobs(content.about.jobs)}
          </div>
        </article>
      </div>
    </section>
    ${renderKitchenMenuSection(content.kitchen)}
    ${renderLifeSection(content.life)}
    <nav class="nav nav--main" id="navbar">
      <div class="block block--navList">
        ${renderNav(content.nav)}
      </div>
      <div class="nav__actions">
        <figure class="media media--socialList">
          <a class="ui-link" href="https://www.linkedin.com/in/wei-chen-win-chiu" target="_blank" rel="noopener noreferrer">
            <img class="media__img" src="./img/icon-linkedin.svg" alt="" />
          </a>
        </figure>
        <a class="ui-link ui-link--nav nav__language" href="${content.translatorHref}">${content.navLanguageLabel || content.translatorLabel}</a>
      </div>
    </nav>
  `;

  root
    .querySelectorAll('.block__descriptionLink')
    .forEach((link) => link.classList.add('ui-link'));
})();
