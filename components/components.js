import ProjectHeader from './ProjectHeader/projectHeader.js';
import ProjectIntroduction from './ProjectIntroduction/projectIntroduction.js';
import ProjectNavigation from './ProjectNavigation/projectNavigation.js';
import ProjectCard from './ProjectCard/projectCard.js';
import ProjectContentBigQuote from './ProjectContentBigQuote/ProjectContentBigQuote.js';

// Register all components
const components = {
  'project-header': ProjectHeader,
  'project-introduction': ProjectIntroduction,
  'project-navigation': ProjectNavigation,
  'project-card': ProjectCard,
  'project-content-bigquote': ProjectContentBigQuote,
};

// Auto-register components
Object.entries(components).forEach(([tagName, component]) => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, component);
  }
});

export default components;
