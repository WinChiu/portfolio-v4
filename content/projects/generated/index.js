const fs = require('node:fs');
const path = require('node:path');

const generatedProjects = {};

for (const fileName of fs.readdirSync(__dirname)) {
  if (!fileName.endsWith('.js') || fileName === 'index.js') {
    continue;
  }

  const slug = path.basename(fileName, '.js');
  const { project } = require(path.join(__dirname, fileName));
  generatedProjects[slug] = project;
}

module.exports = {
  generatedProjects,
};
