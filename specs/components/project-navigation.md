# Project Navigation

## 1. Metadata

- Name: Project Navigation
- Category: Navigation
- Status: Stable

## 2. Overview

Use as the fixed project-page navigation and mobile navigation bar.

Do not combine with Main Navigation on the same page.

## 3. Anatomy

- Home link
- Section links
- Language action

## 4. Tokens used

- `--color-background`
- `--color-border`
- `--color-text`
- `--space-*`
- `--font-size-*`
- `--font-weight-*`
- `--transition-nav`
- `--z-sticky`

## 5. Props/API

CSS block `.project-nav`; navigation composes Link and generated TOC Item components.

## 6. States

- Default: fixed rail
- Hover: link feedback
- Active: current section may be marked in markup
- Focus: keyboard focus-visible
- Disabled: not applicable
- Error: broken targets must be removed or corrected

## 7. Code example

```html
<nav class="project-nav"><a class="ui-link ui-toc-item" href="#overview">Overview</a></nav>
```

## 8. Cross-references

- [Link](./link.md)
- [Project Header](./project-header.md)
- [Main Navigation](./main-navigation.md)
- [TOC Item](./toc-item.md)
