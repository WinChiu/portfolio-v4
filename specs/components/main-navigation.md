# Main Navigation

## 1. Metadata

- Name: Main Navigation
- Category: Navigation
- Status: Stable

## 2. Overview

Use as the persistent site-level navigation on landing pages.

Do not use inside project-page content.

## 3. Anatomy

- Navigation list
- Navigation item
- Social links
- Language action

## 4. Tokens used

- `--color-background`
- `--color-border`
- `--color-text`
- `--space-*`
- `--font-size-*`
- `--z-sticky`

## 5. Props/API

CSS block `.nav--main`; navigation anchors compose the shared `.ui-link.ui-link--nav` component and same-page scrolling is initialized by `utility/landingPageAnimation.js`.

## 6. States

- Default: fixed vertical rail
- Hover: link and icon browser behavior
- Active: same-page links scroll to their section with interruptible GSAP motion
- Reduced motion: same-page scrolling uses a shorter, gentler transition
- Focus: native focus-visible behavior
- Disabled: not applicable
- Error: missing targets retain native link behavior

## 7. Code example

```html
<nav class="nav nav--main"><a class="ui-link ui-link--nav" href="#work">Work</a></nav>
```

## 8. Cross-references

- [Hero](./hero.md)
- [Link](./link.md)
- [Project Navigation](./project-navigation.md)
