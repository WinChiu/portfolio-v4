class ProjectNavigation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Default to English if no language is specified
    const language = this.getAttribute('language') || 'en';

    // Determine the back link based on language
    const backLink = language === 'zh' ? '../../home-zh.html#work' : '/#work';

    this.innerHTML = `
      <nav class="nav nav--main" id="navbar">
        <div class="block block--navList">
          <h6 class="block__navItem">
            <a href="${backLink}">Back</a>
          </h6>
        </div>
        <div class="block block--navList">
          <h6 class="block__navItem">
            <a href="#top">Top</a>
          </h6>
        </div>
      </nav>
    `;
  }
}

// Define the custom element
if (!customElements.get('project-navigation')) {
  customElements.define('project-navigation', ProjectNavigation);
}

export default ProjectNavigation;
