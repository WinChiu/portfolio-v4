import ProjectCard from './ProjectCard/projectCard.js';

const components = {
  'project-card': ProjectCard,
};

Object.entries(components).forEach(([tagName, component]) => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, component);
  }
});

export default components;
