class ProjectIntroduction extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const imageUrl = this.getAttribute("image-url") || "";
    const imageAlt = this.getAttribute("image-alt") || "";
    const purpose = this.getAttribute("purpose");
    const challenge = this.getAttribute("challenge");
    const production = this.getAttribute("production");
    const outcome = this.getAttribute("outcome");

    const renderIntroSection = (title, content) => {
      if (!content) return "";
      return `
        <div class="block block__intro">
          <h5 class="block--title">${title}</h5>
          <p class="block--content">${content}</p>
        </div>`;
    };

    // Check which layout to use
    const hasAllSections = purpose && challenge && production && outcome;
    const hasPurposeProductionOnly =
      purpose && production && !challenge && !outcome;

    let topRightSections = "";
    let bottomSections = "";

    if (hasAllSections) {
      // Layout 1: All four sections (Purpose/Challenge top, Production/Outcome bottom)
      topRightSections = [
        renderIntroSection("Purpose", purpose),
        renderIntroSection("Challenge", challenge),
      ].join("");

      bottomSections = [
        renderIntroSection("Production", production),
        renderIntroSection("Outcome", outcome),
      ].join("");
    } else if (hasPurposeProductionOnly) {
      // Layout 2: Only Purpose and Production in top right
      topRightSections = [
        renderIntroSection("Purpose", purpose),
        renderIntroSection("Production", production),
      ].join("");
    } else {
      // Fallback: Show any available sections in top right
      const sections = [
        purpose && renderIntroSection("Purpose", purpose),
        challenge && renderIntroSection("Challenge", challenge),
        production && renderIntroSection("Production", production),
        outcome && renderIntroSection("Outcome", outcome),
      ].filter(Boolean);

      if (sections.length > 0) {
        topRightSections = sections.join("");
      }
    }

    this.innerHTML = `
      <section class="section section--introduction">
        <div class="container container--content">
          <div class="block block__top">
            <div class="block block__img">
              <img
                src="${imageUrl}"
                alt="${imageAlt}"
                class="img"
              />
            </div>
            ${
              topRightSections
                ? `
            <div class="block block__topRight">
              ${topRightSections}
            </div>`
                : ""
            }
          </div>
          ${
            bottomSections
              ? `
          <div class="block block__bottom">
            ${bottomSections}
          </div>`
              : ""
          }
        </div>
      </section>`;
  }
}

// Define the custom element
if (!customElements.get("project-introduction")) {
  customElements.define("project-introduction", ProjectIntroduction);
}

export default ProjectIntroduction;
