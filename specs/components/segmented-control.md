# Segmented Control

## 1. Metadata

- Name: Segmented Control
- Category: Selection
- Status: Stable

## 2. Overview

Use for switching between a small set of mutually exclusive views.

Do not use for navigation to unrelated pages.

## 3. Anatomy

- Group
- Items
- Selected state

## 4. Tokens used

- `--color-background`
- `--color-border`
- `--color-interactive-hover`
- `--color-text-inverse`
- `--space-*`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-segmented-control` with native buttons using `.ui-segmented-control__item` and `aria-pressed`.

## 6. States

- Default: unselected option
- Hover: interactive surface
- Active: pressed option
- Focus: tokenized focus outline
- Disabled: native button disabled
- Error: exactly one item should be selected

## 7. Code example

```html
<div class="ui-segmented-control"><button class="ui-segmented-control__item is-selected" aria-pressed="true">Design</button></div>
```

## 8. Cross-references

- [Work Switcher](./work-switcher.md)
- [Button](./button.md)
