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
              <p class="block__jobDescription--company">${job.company}</p>
              <div class="block__jobDescription--dotLine"></div>
              <p class="block__jobDescription--title">${job.title}</p>
            </div>`;
      })
      .join('\n');
  }

  function renderAboutParagraphs(paragraphs) {
    return paragraphs
      .map((paragraph) => `<p class="block__content">${paragraph}</p>`)
      .join('\n');
  }

  // Interactive recipe index. One dish opens in place while the others remain
  // compact jump targets in the infinitely looping list.
  function renderKitchenFanStars(effort) {
    return Array.from({ length: 3 }, (_, index) => {
      const isFilled = index < effort;
      const src = isFilled
        ? './img/icon-starFilled.svg'
        : './img/icon-star.svg';
      return `<img class="kitchenFan__star" src="${src}" alt="" aria-hidden="true" />`;
    }).join('');
  }

  function renderKitchenFanCard(item, index) {
    const no = String(index + 1).padStart(2, '0');
    return `
        <article class="kitchenFan__item" data-index="${index}">
          <button
            class="kitchenFan__summary"
            type="button"
            aria-expanded="false"
          >
            <span class="kitchenFan__summaryZh">${item.nameZh}</span>
            <span class="kitchenFan__summaryEn">${item.nameEn}</span>
          </button>
          <div class="kitchenFan__panel" aria-hidden="true">
            <div class="kitchenFan__cardInner">
              <div class="kitchenFan__cardPhoto">
                <img
                  src="${resolveAssetPath(item.imageSrc)}"
                  alt="${escapeAttribute(item.imageAlt)}"
                  loading="lazy"
                />
              </div>
              <div class="kitchenFan__cardText">
                <div class="kitchenFan__cardNames">
                  <p class="kitchenFan__nameZh">${item.nameZh}</p>
                  <p class="kitchenFan__nameEn">${item.nameEn}</p>
                  <img class="kitchenFan__divider" src="./img/icon-kitchenFanDivider.svg?v=2" alt="" aria-hidden="true" />
                </div>

                <p class="kitchenFan__note">${item.note}</p>
                <div class="kitchenFan__cardMeta">
                  <span class="kitchenFan__effort">Effort ${renderKitchenFanStars(item.effort)}</span>
                  <span>No.${no}</span>
                </div>
              </div>
            </div>
          </div>
        </article>`;
  }

  function renderKitchenFanSection(kitchen) {
    return `
      <section class="section section--kitchenFan" id="kitchen">
        <div class="container container--content">
          <div
            class="kitchenFan__stage"
            role="region"
            aria-label="Kitchen recipe index"
            tabindex="0"
          >
            ${kitchen.items.map((item, index) => renderKitchenFanCard(item, index)).join('\n')}
          </div>
          <article class="kitchenFan__intro">
            <h1 class="kitchenFan__title">${kitchen.title}</h1>
            <p class="kitchenFan__description">${kitchen.description}</p>
          </article>
        </div>
      </section>`;
  }

  // Stacked-Polaroid style card, one per photo. Positioning/tilt/scroll
  // behaviour is owned by utility/lifeStackAnimation.js -- this only emits
  // the static markup it hooks into.
  function renderLifeCard(item, index) {
    return `
        <article class="life__card" data-index="${index}">
          <div class="life__cardPhoto">
            <img
              class="life__photo"
              src="${resolveAssetPath(item.imageSrc)}"
              alt="${escapeAttribute(item.imageAlt)}"
              loading="lazy"
            />
          </div>
          <p class="life__note">${item.note}</p>
          <div class="life__cardMeta">
            <span class="life__location">${item.location}</span>
            <span class="life__date">${item.date}</span>
          </div>
        </article>`;
  }

  function renderLifeSection(life) {
    return `
      <section class="section section--life" id="life">
        <div class="container container--content">
          <article class="life__intro">
            <h1 class="life__title">${life.title}</h1>
            <p class="life__description">${life.description}</p>
          </article>
          <div class="life__stack">
            ${life.items.map((item, index) => renderLifeCard(item, index)).join('\n')}
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
    ${renderKitchenFanSection(content.kitchen)}
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
