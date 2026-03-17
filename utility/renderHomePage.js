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
      const src = isFilled ? './img/icon-starFilled.svg' : './img/icon-star.svg';
      return `<img class="kitchen__star" src="${src}" alt="" aria-hidden="true" />`;
    }).join('');
  }

  function renderKitchenItems(items, pageSize) {
    return items
      .map((item, index) => {
        const activeClass = index === 0 ? ' kitchen__item--active' : '';
        const pressed = index === 0 ? 'true' : 'false';
        const pageIndex = Math.floor(index / pageSize);
        const hiddenClass = pageIndex === 0 ? '' : ' kitchen__row--hidden';
        const ariaHidden = pageIndex === 0 ? 'false' : 'true';

        return `
          <li class="kitchen__row${hiddenClass}" data-kitchen-page="${pageIndex}" aria-hidden="${ariaHidden}">
            <div
              class="kitchen__item${activeClass}"
              data-kitchen-index="${index}"
              data-kitchen-page="${pageIndex}"
              data-kitchen-image-src="${escapeAttribute(item.imageSrc)}"
              data-kitchen-image-alt="${escapeAttribute(item.imageAlt)}"
              data-kitchen-image-class="${escapeAttribute(item.imageClass || '')}"
              role="button"
              tabindex="0"
              aria-pressed="${pressed}"
            >
              <span class="kitchen__topRow">
                <span class="kitchen__nameZh">${item.nameZh}</span>
                <span class="kitchen__effort" aria-label="Effort level ${item.effort} out of 3">
                  ${renderKitchenStars(item.effort)}
                </span>
              </span>
              <span class="kitchen__nameEn">${item.nameEn}</span>
              <span class="kitchen__note">${item.note}</span>
            </div>
          </li>`;
      })
      .join('\n');
  }

  function renderKitchenSection(kitchen) {
    const firstItem = kitchen.items[0];
    const pageSize = kitchen.pageSize || 7;

    return `
      <section class="section section--kitchen" id="kitchen">
        <img class="kitchen__bg" src="./img/image-kitchenBg.webp" alt="" aria-hidden="true" />
        <div class="container container--content">
          <article class="kitchen__intro">
            <h1 class="kitchen__title">${kitchen.title}</h1>
            <p class="kitchen__description">${kitchen.description}</p>
            <figure class="kitchen__preview">
              <div class="kitchen__photoStack">
                <img
                  class="kitchen__photo ${firstItem.imageClass || ''}"
                  src="${firstItem.imageSrc}"
                  alt="${firstItem.imageAlt}"
                  data-kitchen-preview
                />
              </div>
            </figure>
          </article>
          <div class="kitchen__panel">
            <header class="kitchen__header">
              <p class="kitchen__headerItem">
                ITEM
                <span class="kitchen__headerHint">${kitchen.mobileHint}</span>
              </p>
              <p class="kitchen__headerNote">NOTE</p>
              <p class="kitchen__headerEffort">EFFORT</p>
            </header>
            <ol class="kitchen__list">
              ${renderKitchenItems(kitchen.items, pageSize)}
            </ol>
            <div class="kitchen__controls">
              <button type="button" class="kitchen__control kitchen__control--prev" data-kitchen-prev aria-label="Show previous dish">
                <img class="kitchen__controlIcon" src="./img/icon-leftArrow.svg" alt="" aria-hidden="true" />
              </button>
              <button type="button" class="kitchen__control kitchen__control--next" data-kitchen-next aria-label="Show next dish">
                <img class="kitchen__controlIcon" src="./img/icon-rightArrow.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div class="kitchen__lightbox" data-kitchen-lightbox hidden>
          <div class="kitchen__lightboxBackdrop" data-kitchen-lightbox-close></div>
          <div class="kitchen__lightboxDialog" role="dialog" aria-modal="true" aria-label="${kitchen.previewLabel}">
            <img class="kitchen__lightboxImage" src="${firstItem.imageSrc}" alt="${firstItem.imageAlt}" data-kitchen-lightbox-image />
          </div>
        </div>
      </section>`;
  }

  function renderNav(items) {
    return items
      .map(
        (item) =>
          `<h6 class="block__navItem"><a href="${item.href}">${item.label}</a></h6>`,
      )
      .join('\n');
  }

  root.innerHTML = `
    <main class="section section--main">
      <div class="container container--content">
        <article class="block block--introduction">
          <header class="block__header">
            <h1 class="block__title" id="greet">${content.hero.title}</h1>
          </header>
          <h4 class="block__description${lang === 'zh' ? ' block__description--zh' : ''}" id="intro">
            ${content.hero.description}
          </h4>
          <h5 class="block__annotation" id="annotation">
            ${content.hero.annotation}
          </h5>
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
        <img class="media media--downImage" src="img/image-down.svg" alt="" id="down" />
        <div class="block block__translator">
          <a href="${content.translatorHref}"><p>${content.translatorLabel}</p></a>
        </div>
      </div>
    </main>
    <section class="section section--work" id="work">
      <article class="block block--switcher">
        <a href="#work">
          <div class="block__design selected">
            <h4>${content.workTabs.design}</h4>
          </div>
        </a>
        <a href="#work">
          <div class="block__coding">
            <h4>${content.workTabs.code}</h4>
          </div>
        </a>
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
      <figure class="media media--socialList">
        <a href="https://www.linkedin.com/in/wei-chen-win-chiu" target="_blank">
          <img class="media__img" src="./img/icon-linkedin.svg" alt="" />
        </a>
      </figure>
    </nav>
  `;
})();
