const fs = require('node:fs');
const path = require('node:path');

const projectDir = path.join(__dirname, '..', 'pages');
const generatedDir = path.join(__dirname, '..', 'content', 'projects', 'generated');
const legacyOutputPath = path.join(
  __dirname,
  '..',
  'content',
  'projects',
  'generatedProjects.js'
);
const supportedLangs = ['en', 'zh'];
const excludedSlugs = new Set(['designSystem']);

const { convertProject } = require('./project-content-converter');

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractMatch(html, pattern, label, filePath) {
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Failed to extract ${label} from ${filePath}`);
  }

  return match[1];
}

function parseAttributes(markup) {
  const attrs = {};
  const attrPattern = /([\w-]+)="([\s\S]*?)"/g;
  let match = attrPattern.exec(markup);

  while (match) {
    attrs[match[1]] = normalizeWhitespace(match[2]);
    match = attrPattern.exec(markup);
  }

  return attrs;
}

function extractProjectData(filePath, lang) {
  const html = fs.readFileSync(filePath, 'utf8');
  const headerMarkup = html.match(/<main class="project-header"[\s\S]*?<\/main>/)?.[0];
  const introMarkup = html.match(/<section class="project-intro">[\s\S]*?<\/section>/)?.[0];

  if (!headerMarkup) {
    throw new Error(`Failed to extract project header from ${filePath}`);
  }

  if (!introMarkup) {
    throw new Error(`Failed to extract project introduction from ${filePath}`);
  }
  const contentHtml = extractMatch(
    html,
    /<section class="(?:section section--content|project-page__content)">\s*<div class="(?:container container--content|project-page__content-inner)">([\s\S]*?)<\/div>\s*<\/section>\s*<nav class="project-nav"/,
    'content section',
    filePath
  ).trim();

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const navigationLanguage = /<a href="\.\.\/\.\.\/home-zh\.html#work">Back<\/a>/.test(html)
    ? 'zh'
    : 'en';

  const tags = [...headerMarkup.matchAll(/<div class="project-header__tag">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g)].map(
    (match) => normalizeWhitespace(match[1])
  );
  const headerValues = [...headerMarkup.matchAll(/<p class="project-header__meta-value">([\s\S]*?)<\/p>/g)].map(
    (match) => normalizeWhitespace(match[1])
  );
  const introImage = introMarkup.match(
    /<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?class="project-intro__image"/
  );
  const introSections = [...introMarkup.matchAll(
    /<div class="project-intro__summary">\s*<p class="project-intro__summary-title">([\s\S]*?)<\/p>\s*<p class="project-intro__summary-content">([\s\S]*?)<\/p>\s*<\/div>/g
  )];
  const introMap = Object.fromEntries(
    introSections.map((match) => [normalizeWhitespace(match[1]).toLowerCase(), normalizeWhitespace(match[2])])
  );
  const headerTitle =
    html.match(/<h2 class="project-header__title">([\s\S]*?)<\/h2>/)?.[1] || '';

  return {
    head: {
      htmlLang: lang,
      title: titleMatch ? normalizeWhitespace(titleMatch[1]) : normalizeWhitespace(headerTitle),
      translatorHref: null,
      navigationLanguage,
      imageAlt: introImage?.[2] || normalizeWhitespace(headerTitle),
    },
    header: {
      title: normalizeWhitespace(headerTitle),
      duration: headerValues[0] || '',
      role: headerValues[1] || '',
      responsibility: headerValues[2] || '',
      company: headerValues[3] || '',
    },
    introduction: {
      purpose: introMap.purpose || '',
      challenge: introMap.challenge || '',
      production: introMap.production || '',
      outcome: introMap.outcome || '',
    },
    coverImage: introImage?.[1] || '',
    tags: tags.join(', '),
    rawContentHtml: contentHtml,
  };
}

function buildProjectsData() {
  const enDir = path.join(projectDir, 'en');
  const slugs = fs
    .readdirSync(enDir)
    .filter((fileName) => fileName.endsWith('.html'))
    .map((fileName) => path.basename(fileName, '.html'))
    .filter((slug) => !excludedSlugs.has(slug));

  const projects = {};

  slugs.forEach((slug) => {
    const perLang = {};

    supportedLangs.forEach((lang) => {
      const filePath = path.join(projectDir, lang, `${slug}.html`);
      perLang[lang] = extractProjectData(filePath, lang);
    });

    projects[slug] = {
      slug,
      tags: perLang.en.tags || perLang.zh.tags,
      coverImage: perLang.en.coverImage || perLang.zh.coverImage,
      languageLabel: '繁中 | EN',
      head: {
        en: {
          ...perLang.en.head,
          translatorHref: `../zh/${slug}.html`,
        },
        zh: {
          ...perLang.zh.head,
          translatorHref: `../en/${slug}.html`,
        },
      },
      header: {
        en: perLang.en.header,
        zh: perLang.zh.header,
      },
      introduction: {
        en: perLang.en.introduction,
        zh: perLang.zh.introduction,
      },
      rawContentHtml: {
        en: perLang.en.rawContentHtml,
        zh: perLang.zh.rawContentHtml,
      },
    };
  });

  return projects;
}

const projects = buildProjectsData();

fs.mkdirSync(generatedDir, { recursive: true });

for (const [slug, project] of Object.entries(projects)) {
  const convertedProject = convertProject(project);
  const fileContent = `const project = ${JSON.stringify(convertedProject, null, 2)};

module.exports = {
  project,
};
`;

  fs.writeFileSync(path.join(generatedDir, `${slug}.js`), fileContent, 'utf8');
}

if (fs.existsSync(legacyOutputPath)) {
  try {
    fs.unlinkSync(legacyOutputPath);
  } catch (error) {
    if (error.code !== 'EPERM') {
      throw error;
    }
  }
}

console.log('Generated split project files in content/projects/generated.');
