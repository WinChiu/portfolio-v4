# Life Film Strip

## 1. Metadata

- Name: Life Film Strip
- Category: Content display
- Status: Stable

## 2. Overview

Use for the homepage Life photos in their original content order.

Do not intercept wheel input or overlap cards.

## 3. Anatomy

- Centered title and description
- Focusable native horizontal viewport
- Row of subtly alternating polaroid cards
- Nearest-card counter, hairline progress track and location

## 4. Tokens used

- `--sys-color-background`
- `--sys-color-border`
- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-space-*`
- `--sys-font-size-*`
- `--sys-font-family-mono`

## 5. Props/API

Section `.section--life#life`, `.life__viewport` and `.life__strip`; rendered by renderLifeSection and initialized by utility/lifeStrip.js. Content comes from the localized life object. Dates render only when non-empty. The first four photos load eagerly; others load lazily.

## 6. States

- Desktop fine pointer at 50rem: ScrollTrigger pins the section and translates the row by its measured overflow; pin releases at the end
- Touch or narrow: native horizontal snap scrolling with horizontal-only Lenis prevention
- Keyboard: Left/Right move one card in either mode
- Progress: nearest card to viewport center determines counter, filled track and location
- Orientation: natural image dimensions select 4:5 portrait or 5:4 landscape at a shared photo height
- Reduced motion: same layout, immediate scrub tracking and permanent tilts without transitions
- Images and resize: recalculate endpoint spacing and debounce ScrollTrigger refresh

## 7. Code example

```html
<section class="section section--life" id="life"><div class="life__viewport" tabindex="0" role="region" aria-label="Life photos" data-lenis-prevent-horizontal><div class="life__strip"></div></div></section>
```

## 8. Cross-references

- [Hero](./hero.md)
