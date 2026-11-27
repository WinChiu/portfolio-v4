# Photo Card

## 1. Metadata

- Name: Photo Card
- Category: Content
- Status: Stable

## 2. Overview

Use for a photo in a paper frame: the tilted portrait on the home hero, or a card in the Life film strip.

Do not use for project covers or documentation images; use the project cover and zoomable media instead.

## 3. Anatomy

- Frame
- Photo
- Caption (portrait) or note and meta line (strip)

## 4. Tokens used

- `--sys-color-background`
- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-border-hairline`
- `--sys-space-*`
- `--comp-hero-portrait-width`
- `--comp-life-card-width`
- `--comp-life-photo-height`

## 5. Props/API

`UI.PhotoCard({ variant, ... })` from `components/PhotoCard/photoCard.js`. `variant: "portrait"` takes `src`, `alt` and `caption`; dragging is added by `utility/heroPortrait.js`. `variant: "strip"` takes `src`, `alt`, `note` (may carry markup), `location`, `date`, `index` and `loading`; `utility/lifeStrip.js` adds `photo-card--landscape` for wide photos. Styles: `components/PhotoCard/_photoCard.scss`.

## 6. States

- Default: photo in its frame
- Portrait: tilted; with a mouse or pen it can be dragged and thrown (shadow on hover, grab cursor, solid shadow lit from the top left while off the page, free rotation, bounce, a handwritten "Drag & Throw!" beside it, a dashed outline left where it came from, which it snaps back into when close, none of the motion with reduced motion)
- Hover, focus, disabled, error: not applicable

## 7. Code example

```html
<figure class="photo-card photo-card--portrait">…</figure>
```

## 8. Cross-references

- [Project Card](./project-card.md)
