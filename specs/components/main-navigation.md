# Main Navigation

## 1. Metadata

- Name: Main Navigation
- Category: Navigation
- Status: Stable

## 2. Overview

Use as the chapter navigation on the home page.

Do not use inside project-page content.

## 3. Anatomy

- Chapter bar
- Number
- Label

## 4. Tokens used

- `--sys-color-background`
- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-border-hairline`
- `--sys-space-*`
- `--sys-font-size-small`
- `--sys-z-sticky`
- `--comp-nav-width-home`
- `--comp-nav-height-home`
- `--comp-nav-height-home-phone`

## 5. Props/API

A `.chapter-bar` link placed in front of each chapter, with `--bar` set to its position (`utility/renderHomePage.js`). Styles: `style/home/_nav.scss`; `utility/homeNavigation.js` shows one chapter at a time and moves the bars from one side to the other; it also sets `aria-current`.

## 6. States

- Wide (over 1024px): vertical bars on the left (reached) and right (ahead), sliding across when the page turns
- Narrow: horizontal bars at the top (reached) and bottom (ahead), sliding up when the page turns
- Hover: darker text
- Current: `aria-current` only, shown by the stack position
- Focus: inset outline
- Very short narrow screens: one long page, bars scroll with it
- Disabled, error: not applicable

## 7. Code example

```html
<a class="chapter-bar" style="--bar:0" href="#work"><span aria-hidden="true">01</span><span>Work</span></a>
```

## 8. Cross-references

- [Hero](./hero.md)
- [Link](./link.md)
- [Project Navigation](./project-navigation.md)
