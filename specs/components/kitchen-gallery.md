# Kitchen Gallery

## 1. Metadata

- Name: Kitchen Gallery
- Category: Interactive content
- Status: Stable

## 2. Overview

Use for the personal kitchen project list, preview, and lightbox.

Do not use for a generic image carousel.

## 3. Anatomy

- Intro
- Rolodex card (photo, names, note, effort rating)
- Peeking edges above/below, or left/right at mobile widths (jump targets)
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

CSS block `.section--kitchen`; composes Rating and Modal primitives.

## 6. States

- Default: first card shown, up to 2 card edges peeking above/below; at `<=34rem`, they become textless left/right slivers
- Hover/Focus: edge shows highlight, focus-visible outline
- Flipping: `.kitchen__card--out` / `.kitchen__card--in` (with `--reverse` when going backward) transition the card
- Error: missing images should retain card text

## 7. Code example

```html
<button class="kitchen__edge" data-kitchen-jump="0">
  <span class="kitchen__edgeNameZh">料理</span>
</button>
```

## 8. Cross-references

- [Image Zoom](./image-zoom.md)
- [Icon List](./icon-list.md)
