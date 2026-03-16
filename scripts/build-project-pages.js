const fs = require('node:fs');
const path = require('node:path');

const { projects } = require('../content/projects');
const { renderProjectPage } = require('../templates/projectPage');

for (const project of projects) {
  for (const lang of ['en', 'zh']) {
    const html = renderProjectPage(project, lang);
    const outputPath = path.join(
      __dirname,
      '..',
      'pages',
      lang,
      `${project.slug}.html`
    );

    fs.writeFileSync(outputPath, html, 'utf8');
  }
}

console.log('Generated all project pages.');
