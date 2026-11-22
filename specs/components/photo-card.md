# Photo Card

## 1. Metadata

- Name: Photo Card
- Category: Content
- Status: Stable

## 2. Overview

Use for a photo in a paper frame: a loose, draggable card on the hero, or a card in the Life film strip.

Do not use for project covers or documentation images; use the project cover and zoomable media instead.

## 3. Anatomy

- Frame
- Photo
- Caption (floating) or note and meta line (strip)

## 4. Tokens used

- `--sys-color-background`
- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-border-hairline`
- `--sys-space-*`
- `--comp-hero-card-width`
- `--comp-life-card-width`
- `--comp-life-photo-height`

## 5. Props/API

`UI.PhotoCard({ variant, ... })` from `components/PhotoCard/photoCard.js`. `variant: "floating"` takes `src`, `alt`, `caption` and a `style` string that sets `--x --y --r --mx --my` (position and tilt); dragging is added by `utility/heroCards.js`. `variant: "strip"` takes `src`, `alt`, `note` (may carry markup), `location`, `date`, `index` and `loading`; `utility/lifeStrip.js` adds `photo-card--landscape` for wide photos. Styles: `components/PhotoCard/_photoCard.scss`.

## 6. States

- Default: photo in its frame
- Floating: grab cursor; dragging uses the grabbing cursor
- Focus: brand-colored outline on the floating card
- Hover, disabled, error: not applicable

## 7. Code example

```html
<figure class="photo-card photo-card--floating" tabindex="0" style="--x:47%;--y:3rem;--r:-2deg">…</figure>
```

## 8. Cross-references

- [Project Card](./project-card.md)
