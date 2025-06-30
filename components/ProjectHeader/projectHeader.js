class ProjectHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const duration = this.getAttribute("duration") || "";
    const role = this.getAttribute("role") || "";
    const responsibility = this.getAttribute("responsibility") || "";
    const company = this.getAttribute("company") || "";

    this.innerHTML = `
      <main class="section section--header" id="top">
        <div class="container container--content">
          <div class="container container--title">
            <h2 class="module module__title">${title}</h2>
            <div class="module module__metaData">
              <div class="module__data">
                <h5 class="module__dataTitle">Duration</h5>
                <p class="module__dataDescription">${duration}</p>
              </div>
              <div class="module__data">
                <h5 class="module__dataTitle">Role</h5>
                <p class="module__dataDescription">${role}</p>
              </div>
              <div class="module__data">
                <h5 class="module__dataTitle">Responsibility</h5>
                <p class="module__dataDescription">${responsibility}</p>
              </div>
              <div class="module__data">
                <h5 class="module__dataTitle">Company</h5>
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
if (!customElements.get("project-header")) {
  customElements.define("project-header", ProjectHeader);
}

export default ProjectHeader;
