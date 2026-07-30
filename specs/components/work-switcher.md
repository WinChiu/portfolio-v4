# Work Switcher

## 1. Metadata

- Name: Work Switcher
- Category: Navigation
- Status: Stable

## 2. Overview

Use to switch the landing work list between design and coding projects.

Do not use as a generic two-option form control.

## 3. Anatomy

- Design option
- Coding option
- Selected marker

## 4. Tokens used

- `--color-background`
- `--color-border`
- `--color-interactive-hover`
- `--color-text-inverse`
- `--space-*`
- `--font-weight-medium`
- `--z-content`

## 5. Props/API

Use `.ui-segmented-control` with `.ui-segmented-control__item` buttons, `aria-pressed`, and `.is-selected`.

## 6. States

- Default: background surface
- Hover: gold interactive surface
- Active: `.selected` persists the gold surface
- Focus: anchor focus remains available
- Disabled: not defined
- Error: not applicable

## 7. Code example

```html
<div class="ui-segmented-control block--switcher"><button class="ui-segmented-control__item is-selected" aria-pressed="true">Design</button></div>
```

## 8. Cross-references

- [Project Card](./project-card.md)
- [Segmented Control](./segmented-control.md)
