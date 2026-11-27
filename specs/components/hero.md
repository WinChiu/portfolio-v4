# Hero

## 1. Metadata

- Name: Hero
- Category: Page section
- Status: Stable

## 2. Overview

Use once at the top of the portfolio landing page.

Do not repeat inside case studies.

## 3. Anatomy

- Portrait photo card
- Two-line headline
- Introduction

## 4. Tokens used

- `--sys-color-text`
- `--comp-hero-accent`
- `--sys-font-size-hero`
- `--sys-font-size-body-lg`
- `--sys-space-*`
- `--comp-hero-portrait-width`
- `--comp-hero-copy-width`
- `--comp-hero-line2-indent`

## 5. Props/API

CSS section `.section--main` with `.hero__big` and `.hero__text`; the entrance is `setupHeroAnimation` in `utility/landingPageAnimation.js`.

## 6. States

- Default: content visible after loading
- Hover: inline links change color
- Active: link activation only
- Focus: links use focus-visible behavior
- Disabled: not applicable
- Error: illustration may be absent without hiding text

## 7. Code example

```html
<section class="hero section--main"><figure class="photo-card photo-card--portrait">…</figure><div class="hero__text">…</div></section>
```

## 8. Cross-references

- [Main Navigation](./main-navigation.md)
- [Work Switcher](./work-switcher.md)
