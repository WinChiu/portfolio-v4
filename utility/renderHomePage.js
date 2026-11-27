(function () {
  const contentMap = window.__HOME_PAGE_CONTENT__;
  const root = document.getElementById('home-page-root');

  if (!contentMap || !root) return;

  const lang = 'en';
  document.documentElement.lang = lang;
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
      .map((project) => UI.ProjectCard({
        number: project.number,
        tag: project.tag,
        title: project.title,
        description: project.description,
        imageUrl: resolveAssetPath(project.imageUrl),
        coverType: project.coverType,
        lang,
        type: project.type,
        projectUrl: project.projectUrl,
        siteUrl: project.siteUrl,
      }))
      .join('\n');
  }

  function renderJobs(jobs) {
    return jobs
      .map((job) => {
        const pastClass = job.isPast ? ' block__jobDescription--past' : '';
        return `
            <div class="block__jobDescription${pastClass}">
              <p class="job__title block__jobDescription--title">${job.title}</p>
              <div class="block__jobDescription--dotLine"></div>
              <p class="job__company block__jobDescription--company">${job.company}</p>
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
    const courses = kitchen.courses;
    const courseMidpoint = Math.ceil(courses.length / 2);
    const courseColumns = [courses.slice(0, courseMidpoint), courses.slice(courseMidpoint)];
    const mainCourse = courses.find((course) => course.key === 'main');
    const dishes = kitchen.items.map((item, index) => ({ ...item, index }));


    function renderDishes(items) {
      return items.map((item) => UI.MenuItem({ index: item.index, nameZh: item.nameZh, nameEn: item.nameEn, effort: item.effort })).join('');
    }

    function renderCourse(course) {
      const items = dishes.filter((item) => item.course === course.key);
      if (!items.length) return '';
      const wide = course === mainCourse;
      let rows;
      if (wide) {
        const midpoint = Math.ceil(items.length / 2);
        rows = `<div class="kitchenMenu__dishColumns">
          <div class="kitchenMenu__dishColumn">${renderDishes(items.slice(0, midpoint))}</div>
          <div class="kitchenMenu__dishColumn">${renderDishes(items.slice(midpoint))}</div>
        </div>`;
      } else {
        rows = renderDishes(items);
      }
      return `<section class="kitchenMenu__course${wide ? ' kitchenMenu__course--wide' : ''}">
        <h2 class="kitchenMenu__courseHead"><span class="kitchenMenu__courseEn" lang="en">${course.en}</span><span class="kitchenMenu__courseLine" aria-hidden="true"></span></h2>
        ${rows}
      </section>`;
    }

    return `<section class="chapter c-kitchen section--kitchenMenu" id="kitchen">
      <div class="home__content">
        <header class="kitchenMenu__head"><h2 class="chapter__title kitchenMenu__title">${kitchen.title}</h2><p class="kitchenMenu__description">${kitchen.description}</p></header>
        <div class="kitchenMenu__menu">
          ${mainCourse ? renderCourse(mainCourse) : ''}
          ${courseColumns.map((column) => `<div class="kitchenMenu__column">${column.filter((course) => course !== mainCourse).map(renderCourse).join('')}</div>`).join('')}
        </div>
      </div>
      <div class="kitchenMenu__overlay" inert aria-hidden="true"><div class="kitchenMenu__scrim"></div><aside class="kitchenMenu__sheet" id="kitchen-recipe" role="dialog" aria-modal="true" aria-labelledby="kitchen-recipe-name" tabindex="-1" data-lenis-prevent></aside></div>
    </section>`;
  }

  function renderLifeCard(item, index) {
    return UI.PhotoCard({
      variant: 'strip',
      src: resolveAssetPath(item.imageSrc),
      alt: item.imageAlt,
      note: item.note,
      location: item.location,
      date: item.date,
      index,
      loading: 'eager', // every Life photo loads up front, so nothing finishes loading (and shifts the strip) mid-scroll
    });
  }

  function renderLifeSection(life) {
    return `
      <section class="chapter c-life life section--life" id="life">
        <div class="home__content">
          <header class="life__head">
            <h2 class="chapter__title life__title">${life.title}</h2>
            <p class="life__intro life__description">${life.description}</p>
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

  // One bar in front of each chapter (style/home/_nav.scss): numbered link, stacked at the top or bottom of the screen.
  function renderChapterBar(index) {
    const item = content.nav[index];
    return `<a class="chapter-bar" style="--bar:${index}" href="${item.href}"><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${item.label}</span></a>`;
  }

  document.body.classList.add('home-page');
  root.innerHTML = `
    <main id="top">
      <section class="hero section--main">
        ${UI.PhotoCard({ variant: 'portrait', src: resolveAssetPath(content.hero.imageSrc), alt: content.hero.imageAlt, caption: content.hero.caption })}
        <div class="hero__text">
          <h1 class="hero__big"><span class="line1">Product</span><span class="line2">Designer</span></h1>
          <p class="hero__intro" id="intro">${content.hero.description}</p>
        </div>
      </section>
      ${renderChapterBar(0)}
      <section class="chapter work c-work section--work" id="work">
        <div class="tabs block--switcher" role="group" aria-label="Project category">
          <button type="button" class="block__design selected is-selected is-on" aria-pressed="true"><h4>${content.workTabs.design}</h4></button>
          <button type="button" class="block__coding" aria-pressed="false"><h4>${content.workTabs.code}</h4></button>
        </div>
        <div id="project-list">${renderProjects(content.projects)}</div>
      </section>
      ${renderChapterBar(1)}
      <section class="chapter about c-about section--about" id="about">
        <div class="about__body">
          <figure class="about__photo media--avatar"><img src="${resolveAssetPath(content.about.imageSrc)}" alt="${content.about.imageAlt}" /></figure>
          <div class="about__text"><div class="about__intro"><h2 class="chapter__title block__title">${content.about.title}</h2>
            <div class="about__paragraphs">${renderAboutParagraphs(content.about.paragraphs)}</div></div>
          </div>
          <div class="jobs block__jobs">${renderJobs(content.about.jobs)}</div>
        </div>
      </section>
      ${renderChapterBar(2)}
      ${renderKitchenMenuSection(content.kitchen)}
      ${renderChapterBar(3)}
      ${renderLifeSection(content.life)}
    </main>
  `;

  root
    .querySelectorAll('.block__descriptionLink')
    .forEach((link) => link.classList.add('ui-link'));
})();
