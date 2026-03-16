const { designSystemProject } = require('./designSystem');
const { generatedProjects } = require('./generated');

const projects = [designSystemProject, ...Object.values(generatedProjects)];

module.exports = {
  projects,
};
