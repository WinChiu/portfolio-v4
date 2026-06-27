/* =============================================================================
Image Zoom JS v0.0.1 | MIT License | https://github.com/alecrios/image-zoom-js
============================================================================= */

"use strict";

class imageZoom {
  constructor(image) {
    // Image
    this.image = image;

    // Backdrop
    this.backdrop = document.querySelector("[data-zoom-backdrop]");
    if (this.backdrop === null) {
      this.backdrop = document.createElement("div");
      this.backdrop.setAttribute("data-zoom-backdrop", "");
      document.body.appendChild(this.backdrop);
    }

    // Pass `this` through to methods
    this.zoomImage = this.zoomImage.bind(this);
    this.resetImage = this.resetImage.bind(this);
    this.resetImageComplete = this.resetImageComplete.bind(this);

    // Add click event handler
    this.image.addEventListener("click", this.zoomImage);
  }

  zoomImage() {
    // Prevent an image from zooming while another is already active
    if (this.backdrop.getAttribute("data-zoom-active") === "true") return;

    // Declare zoom function to be active
    this.backdrop.setAttribute("data-zoom-active", "true");

    // Handle event listeners
    this.image.removeEventListener("click", this.zoomImage);
    this.backdrop.addEventListener("click", this.resetImage);
    document.addEventListener("keyup", this.resetImage);
    window.addEventListener("scroll", this.resetImage);
    window.addEventListener("resize", this.resetImage);

    // Fade in backdrop
    this.backdrop.setAttribute("data-zoom-backdrop", "active");

    // Create a top-level clone so ancestor stacking contexts cannot place the
    // zoomed image below the backdrop or fixed project navigation.
    this.imageBCR = this.image.getBoundingClientRect();
    this.zoomedImage = this.image.cloneNode(true);
    this.zoomedImage.removeAttribute("data-zoom-image");
    this.zoomedImage.setAttribute("data-zoom-clone", "");
    this.zoomedImage.setAttribute("aria-hidden", "true");
    this.zoomedImage.style.top = `${this.imageBCR.top}px`;
    this.zoomedImage.style.left = `${this.imageBCR.left}px`;
    this.zoomedImage.style.width = `${this.imageBCR.width}px`;
    this.zoomedImage.style.height = `${this.imageBCR.height}px`;
    document.body.appendChild(this.zoomedImage);
    this.zoomedImage.addEventListener("click", this.resetImage);

    var scale = Math.min(
      window.innerWidth / this.imageBCR.width,
      window.innerHeight / this.imageBCR.height
    );
    var translateX =
      (window.innerWidth - this.imageBCR.width) / 2 - this.imageBCR.left;
    var translateY =
      (window.innerHeight - this.imageBCR.height) / 2 - this.imageBCR.top;
    requestAnimationFrame(() => {
      this.zoomedImage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    });
  }

  resetImage() {
    // Handle event listeners
    window.removeEventListener("resize", this.resetImage);
    window.removeEventListener("scroll", this.resetImage);
    document.removeEventListener("keyup", this.resetImage);
    this.backdrop.removeEventListener("click", this.resetImage);
    if (this.zoomedImage) {
      this.zoomedImage.removeEventListener("click", this.resetImage);
    }

    // Fade out backdrop
    this.backdrop.setAttribute("data-zoom-backdrop", "");

    // Animate the top-level clone back to the source image.
    if (this.zoomedImage) {
      this.zoomedImage.addEventListener(
        "transitionend",
        this.resetImageComplete,
        { once: true }
      );
      this.zoomedImage.style.transform = "none";
    } else {
      this.resetImageComplete();
    }
  }

  resetImageComplete() {
    if (this.zoomedImage) {
      this.zoomedImage.remove();
      this.zoomedImage = null;
    }

    // Declare zoom function to be not active
    this.backdrop.setAttribute("data-zoom-active", "false");

    this.image.addEventListener("click", this.zoomImage);
  }
}

// Create a new instance for each image
document.querySelectorAll("[data-zoom-image]").forEach(function (img) {
  new imageZoom(img);
});
