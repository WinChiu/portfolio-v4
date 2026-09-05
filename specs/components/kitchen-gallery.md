# Kitchen Gallery

## 1. Metadata

- Name: Kitchen Gallery
- Category: Content display
- Status: Stable

## 2. Overview

Use for the personal kitchen project list as an interactive recipe index with one expanded dish.

Do not use for a generic image carousel or click-to-open lightbox.

## 3. Anatomy

- Intro (title and description)
- Infinite compact recipe index
- Expanded card: photo, names, note, effort rating, and number

## 4. Tokens used

- `--color-text`
- `--color-background`
- `--color-background-soft`
- `--color-text-muted`
- `--color-border-muted`
- `--space-*`
- `--font-size-label`
- `--font-size-caption`
- `--font-weight-regular`
- `--font-weight-bold`
- `--font-family-mono`
- `--line-height-body`
- `--radius-lg`
- `--z-base`
- `--z-content`

## 5. Props/API

CSS block `.section--kitchenFan`. Markup comes from `renderKitchenFanCard` and `renderKitchenFanSection`; behaviour is initialized by `utility/kitchenFanAnimation.js`.

## 6. States

- Default: compact dishes form an infinitely looping list
- Browsing: the expanded row closes as scrolling starts and stays closed during inertia
- Settle: the nearest item snaps to centre, holds, then expands
- Direct selection: click and arrow-key input close and scroll simultaneously before settling
- Mobile card: the photo stays square and card content remains visible

## 7. Code example

```html
<article class="kitchenFan__item">
  <button class="kitchenFan__summary" aria-expanded="false">料理</button>
  <div class="kitchenFan__panel" aria-hidden="true">…</div>
</article>
```

## 8. Cross-references

- [Rating](./rating.md)
