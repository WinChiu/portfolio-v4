const fs = require('node:fs');
const path = require('node:path');

const { renderHomePage } = require('../templates/homePage');

const OUTPUT_PATHS = {
  en: path.join(__dirname, '..', 'index.html'),
  zh: path.join(__dirname, '..', 'home-zh.html'),
};

for (const [lang, outputPath] of Object.entries(OUTPUT_PATHS)) {
  fs.writeFileSync(outputPath, renderHomePage(lang), 'utf8');
}

console.log('Generated home pages (index.html, home-zh.html).');
