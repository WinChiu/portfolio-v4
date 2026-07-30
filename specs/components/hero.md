# Hero

## 1. Metadata

- Name: Hero
- Category: Page section
- Status: Stable

## 2. Overview

Use once at the top of the portfolio landing page.

Do not repeat inside case studies.

## 3. Anatomy

- Eyebrow
- Title
- Description
- Annotation
- Detail list
- Illustration

## 4. Tokens used

- `--color-text`
- `--color-text-subtle`
- `--color-link`
- `--font-size-*`
- `--font-weight-*`
- `--space-*`
- `--motion-duration-entrance`
- `--z-*`

## 5. Props/API

CSS section `.section--main`; animation hooks use `.animate-item` and existing JavaScript.

## 6. States

- Default: content visible after loading
- Hover: inline links change color
- Active: link activation only
- Focus: links use focus-visible behavior
- Disabled: not applicable
- Error: illustration may be absent without hiding text

## 7. Code example

```html
<section class="section section--main"><h1 class="block__title">Portfolio</h1><p class="block__description">Selected work</p></section>
```

## 8. Cross-references

- [Main Navigation](./main-navigation.md)
- [Work Switcher](./work-switcher.md)
