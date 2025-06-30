class ProjectCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const number = this.getAttribute("number") || "";
    const title = this.getAttribute("title") || "";
    const tag = this.getAttribute("tag") || "";
    const description = this.getAttribute("description") || "";
    const imageUrl = this.getAttribute("image-url") || "";
    const projectUrl = this.getAttribute("project-url") || "#";
    const siteUrl = this.getAttribute("site-url");
    const type = this.getAttribute("type") || "design";
    const lang = this.getAttribute("lang") || "zh";

    const viewProjectText = lang === "zh" ? "查看專案" : "View Project";
    const viewSiteText = lang === "zh" ? "查看網站" : "View Site";
    const hideClass = type === "code" ? "workHide" : "";
    const buttonClass = `block__button block__button--${
      type === "code" ? "code" : "design"
    }`;

    // Create the project button
    const projectButton = `
      <div class="${buttonClass}">
        <a href="${projectUrl}"${
      siteUrl ? "" : ' target="_blank" rel="noopener noreferrer"'
    }>
          <p>${viewProjectText}</p>
        </a>
      </div>`;

    // Create the site button if siteUrl exists
    const siteButton = siteUrl
      ? `
      <a 
        href="${siteUrl}" 
        class="block__button--viewSite" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <p>${viewSiteText}</p>
      </a>`
      : "";

    // Create the button container with appropriate structure
    const buttonContainer = siteUrl
      ? `<div class="block__buttonContainer">
           ${projectButton}
           ${siteButton}
         </div>`
      : `<div class="block__button">
           <a href="${projectUrl}" target="_blank" rel="noopener noreferrer">
             <p>${viewProjectText}</p>
           </a>
         </div>`;

    this.innerHTML = `
      <div class="container container--content ${hideClass}" data-type="${type}">
        <figure class="media media--workCover">
          <img class="media__img" src="${imageUrl}" alt="${title}" />
        </figure>
        <article class="block block--introduction">
          <div class="block__header">
            <h1 class="block__number">${number}</h1>
            <div class="block__content">
              <h2 class="block__title">${title}</h2>
              <h5 class="block__tag">${tag}</h5>
            </div>
          </div>
          <p class="block__description">${description}</p>
          ${buttonContainer}
        </article>
      </div>`;
  }
}

// Define the custom element
if (!customElements.get("project-card")) {
  customElements.define("project-card", ProjectCard);
}

export default ProjectCard;
