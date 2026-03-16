const fs = require('node:fs');
const path = require('node:path');

const { designSystemProject } = require('../content/projects/designSystem');
const { renderProjectPage } = require('../templates/projectPage');

const outputTargets = [
  {
    lang: 'en',
    outputPath: path.join(__dirname, '..', 'pages', 'en', 'designSystem.html'),
  },
  {
    lang: 'zh',
    outputPath: path.join(__dirname, '..', 'pages', 'zh', 'designSystem.html'),
  },
];

for (const target of outputTargets) {
  const html = renderProjectPage(designSystemProject, target.lang);
  fs.writeFileSync(target.outputPath, html, 'utf8');
}

console.log('Generated designSystem project pages.');
