# Media Aside

## 1. Metadata

- Name: Media Aside
- Category: Case study content
- Status: Stable

## 2. Overview

Use when media and explanatory copy must sit side by side.

Do not use when content order would become ambiguous on mobile.

## 3. Anatomy

- Media region
- Text region
- Title
- Caption

## 4. Tokens used

- `--color-text`
- `--space-*`
- `--font-size-*`
- `--radius-*`

## 5. Props/API

Media-aside modifier classes under `.project-module`.

## 6. States

- Default: split layout
- Hover: zoomable media may elevate
- Active: not applicable
- Focus: media and links retain focus
- Disabled: not applicable
- Error: copy expands to full width if media is absent

## 7. Code example

```html
<div class="project-module__media-aside"><figure>…</figure><div>Explanation</div></div>
```

## 8. Cross-references

- [Project Module](./project-module.md)
- [Image Zoom](./image-zoom.md)
