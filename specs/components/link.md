# Link

## 1. Metadata

- Name: Link
- Category: Navigation
- Status: Stable

## 2. Overview

Use for navigation to another location or resource.

Do not use a link for an action that does not navigate.

## 3. Anatomy

- Anchor
- Label
- Optional icon

## 4. Tokens used

- `--color-link`
- `--color-link-hover`
- `--color-focus`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-link`; add `.ui-link--nav` for navigation chrome and `.is-active` for the current destination.

## 6. States

- Default: link color
- Hover: stronger link color
- Active: current destination or activation
- Focus: tokenized focus outline
- Disabled: omit the href and use a non-link element
- Error: empty destinations are invalid

## 7. Code example

```html
<a class="ui-link" href="/work">Work</a>
```

## 8. Cross-references

- [Button](./button.md)
- [Main Navigation](./main-navigation.md)
