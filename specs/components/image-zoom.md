# Image Zoom

## 1. Metadata

- Name: Image Zoom
- Category: Media utility
- Status: Stable

## 2. Overview

Use on case-study images that benefit from full-screen inspection.

Do not use on decorative images or tiny icons.

## 3. Anatomy

- Source image
- Backdrop
- Zoom clone

## 4. Tokens used

- `--color-zoom-overlay`
- `--motion-duration-slow`
- `--motion-ease-standard`
- `--z-zoom-image`
- `--z-zoom-clone`
- `--z-zoom-backdrop`
- `--z-modal`

## 5. Props/API

Use `.ui-zoomable-media` with `data-zoom-image`; backdrop and clone continue to use data attributes.

## 6. States

- Default: source image in document flow
- Hover: zoom cursor
- Active: image or clone moves above backdrop
- Focus: provide keyboard activation in JavaScript
- Disabled: omit `data-zoom-image`
- Error: failed clones must restore source image and scrolling

## 7. Code example

```html
<img data-zoom-image src="img/detail.webp" alt="Interface detail">
```

## 8. Cross-references

- [Media Aside](./media-aside.md)
- [Project Module](./project-module.md)
