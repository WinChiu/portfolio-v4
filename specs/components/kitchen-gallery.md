# Kitchen Gallery

## 1. Metadata

- Name: Kitchen Gallery
- Category: Interactive content
- Status: Stable

## 2. Overview

Use for the personal kitchen project list, preview, controls, and lightbox.

Do not use for a generic image carousel.

## 3. Anatomy

- Intro
- Preview stack
- Item table
- Effort rating
- Previous and next controls
- Lightbox

## 4. Tokens used

- `--color-*`
- `--space-*`
- `--font-size-*`
- `--font-weight-*`
- `--radius-*`
- `--shadow-*`
- `--transition-*`
- `--z-overlay`

## 5. Props/API

CSS block `.section--kitchen`; composes Interactive List Item, Rating, Icon Button, and Modal primitives.

## 6. States

- Default: first visible item
- Hover: row highlight and control lift
- Active: `.kitchen__item--active` highlights selection
- Focus: controls and rows show focus outline
- Disabled: `.kitchen__control--disabled` prevents movement
- Error: missing images should retain item text and controls

## 7. Code example

```html
<button class="kitchen__item kitchen__item--active"><span class="kitchen__nameZh">料理</span></button>
```

## 8. Cross-references

- [Image Zoom](./image-zoom.md)
- [Icon List](./icon-list.md)
