class ProjectContentBigQuote extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const icon = this.getAttribute('icon') || '';
    let content = this.getAttribute('content') || this.innerHTML.trim();

    // First, normalize the content by replacing newlines with a space
    content = content.replace(/\s+/g, ' ').trim();

    // Then apply the highlight
    content = content.replace(
      /==(.*?)==/g,
      '<span class="highlight">$1</span>'
    );

    // Set innerHTML directly without shadow DOM
    this.innerHTML = `
      <div class="module module__bgQuote">
        ${icon ? `<img src="${icon}" alt="" />` : ''}
        <h3>${content}</h3>
      </div>
    `;
  }
}

// Define the custom element
if (!customElements.get('project-content-bigquote')) {
  customElements.define('project-content-bigquote', ProjectContentBigQuote);
}

export default ProjectContentBigQuote;
