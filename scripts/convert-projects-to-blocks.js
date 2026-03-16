const fs = require('node:fs');
const path = require('node:path');

const { convertProject } = require('./project-content-converter');

const generatedDir = path.join(__dirname, '..', 'content', 'projects', 'generated');

fs.mkdirSync(generatedDir, { recursive: true });

const projectFiles = fs
  .readdirSync(generatedDir)
  .filter((fileName) => fileName.endsWith('.js') && fileName !== 'index.js');

for (const fileName of projectFiles) {
  const filePath = path.join(generatedDir, fileName);
  const { project } = require(filePath);
  const normalizedProject = convertProject(project);
  const fileContent = `const project = ${JSON.stringify(normalizedProject, null, 2)};

module.exports = {
  project,
};
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
}

console.log('Normalized generated project files.');
