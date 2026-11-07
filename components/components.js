import ProjectCard from './ProjectCard/projectCard.js?v=bbf0e87b';

const components = {
  'project-card': ProjectCard,
};

Object.entries(components).forEach(([tagName, component]) => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, component);
  }
});

export default components;
