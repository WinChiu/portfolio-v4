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

  function renderKitchenStars(effort) {
    return Array.from({ length: 3 }, (_, index) => {
      const isFilled = index < effort;
      const src = isFilled
        ? './img/icon-starFilled.svg'
        : './img/icon-star.svg';
      return `<img class="ui-rating__icon kitchen__star" src="${src}" alt="" aria-hidden="true" />`;
    }).join('');
  }

  function renderKitchenData(items) {
    return items
      .map(
        (item, index) => `
        <li class="kitchen__dataItem"
          data-kitchen-index="${index}"
          data-kitchen-name-zh="${escapeAttribute(item.nameZh)}"
          data-kitchen-name-en="${escapeAttribute(item.nameEn)}"
          data-kitchen-note="${escapeAttribute(item.note)}"
          data-kitchen-effort="${item.effort}"
          data-kitchen-image-src="${escapeAttribute(resolveAssetPath(item.imageSrc))}"
          data-kitchen-image-alt="${escapeAttribute(item.imageAlt)}"
          data-kitchen-image-class="${escapeAttribute(item.imageClass || '')}"
        ></li>`,
      )
      .join('\n');
  }

  function renderKitchenSection(kitchen) {
    const firstItem = kitchen.items[0];
    const total = String(kitchen.items.length).padStart(2, '0');

    return `
      <section class="section section--kitchen" id="kitchen">
        <img class="kitchen__bg" src="./img/image-kitchenBg.webp" alt="" aria-hidden="true" />
        <div class="container container--content">
          <article class="kitchen__intro">
            <h1 class="kitchen__title">${kitchen.title}</h1>
            <p class="kitchen__description">${kitchen.description}</p>
            <p class="kitchen__hint">${kitchen.rolodexHint || ''}</p>
          </article>
          <div class="kitchen__panel">
            <ol class="kitchen__data" hidden>
              ${renderKitchenData(kitchen.items)}
            </ol>
            <div class="kitchen__rolodex" data-kitchen-rolodex>
              <div class="kitchen__edges kitchen__edges--above" data-kitchen-edges="above"></div>
              <article class="kitchen__card" data-kitchen-card>
                <div class="kitchen__cardMeta">
                  <span data-kitchen-card-no>NO. 01</span>
                  <span data-kitchen-card-counter>01 / ${total}</span>
                </div>
                <div class="kitchen__cardBody">
                  <button type="button" class="kitchen__cardPhoto" data-kitchen-zoom aria-label="${kitchen.previewLabel}">
                    <img
                      class="kitchen__photo ${firstItem.imageClass || ''}"
                      src="${resolveAssetPath(firstItem.imageSrc)}"
                      alt="${firstItem.imageAlt}"
                      data-kitchen-preview
                    />
                  </button>
                  <div class="kitchen__cardText">
                    <div class="kitchen__cardNames">
                      <p class="kitchen__nameZh" data-kitchen-card-name-zh>${firstItem.nameZh}</p>
                      <p class="kitchen__nameEn" data-kitchen-card-name-en>${firstItem.nameEn}</p>
                    </div>
                    <div class="kitchen__cardNote">
                      <p class="kitchen__note" data-kitchen-card-note>${firstItem.note}</p>
                    </div>
                    <div class="kitchen__cardEffort">
                      <p class="kitchen__cardLabel">EFFORT</p>
                      <span class="ui-rating kitchen__effort" data-kitchen-card-effort aria-label="Effort level ${firstItem.effort} out of 3">
                        ${renderKitchenStars(firstItem.effort)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              <div class="kitchen__edges kitchen__edges--below" data-kitchen-edges="below"></div>
            </div>
          </div>
        </div>
        <div class="ui-modal kitchen__lightbox" data-kitchen-lightbox hidden>
          <div class="ui-modal__backdrop kitchen__lightboxBackdrop" data-kitchen-lightbox-close></div>
          <div class="ui-modal__dialog kitchen__lightboxDialog" role="dialog" aria-modal="true" aria-label="${kitchen.previewLabel}" tabindex="-1">
            <img class="kitchen__lightboxImage" src="${resolveAssetPath(firstItem.imageSrc)}" alt="${firstItem.imageAlt}" data-kitchen-lightbox-image />
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
    ${renderKitchenSection(content.kitchen)}
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

  root.querySelectorAll('.block__descriptionLink').forEach((link) =>
    link.classList.add('ui-link'));
})();
