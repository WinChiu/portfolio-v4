class ProjectHeader extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * Generate HTML for tags from a comma-separated string
   * @param {string} tagsString - Comma-separated list of tags
   * @returns {string} HTML string of tag elements
   */
  generateTagsHTML(tagsString) {
    if (!tagsString) return '';

    const tags = tagsString.split(',').map((tag) => tag.trim());
    return `
      <div class="module module__tags">
        ${tags
          .map(
            (tag) => `
          <div class="module__tag">
            <p>${tag}</p>
          </div>
        `
          )
          .join('')}
      </div>`;
  }

  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const duration = this.getAttribute('duration') || '';
    const role = this.getAttribute('role') || '';
    const responsibility = this.getAttribute('responsibility') || '';
    const company = this.getAttribute('company') || '';
    const tags = this.getAttribute('tags') || '';
    const tagsHTML = this.generateTagsHTML(tags);

    this.innerHTML = `
      <main class="section section--header" id="top">
        <div class="container container--content">
          <div class="container container--title">
            ${tagsHTML}
            <h2 class="module module__title">${title}</h2>
            <div class="module module__metaData">
              <div class="module__data">
                <p class="module__dataTitle">Duration</p>
                <p class="module__dataDescription">${duration}</p>
              </div>
              <div class="module__data">
                <p class="module__dataTitle">Role</p>
                <p class="module__dataDescription">${role}</p>
              </div>
              <div class="module__data">
                <p class="module__dataTitle">Responsibility</p>
                <p class="module__dataDescription">${responsibility}</p>
              </div>
              <div class="module__data">
                <p class="module__dataTitle">Company</p>
                <p class="module__dataDescription">${company}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;
  }
}

// Define the custom element
if (!customElements.get('project-header')) {
  customElements.define('project-header', ProjectHeader);
}

export default ProjectHeader;
