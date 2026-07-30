# Metadata Item

## 1. Metadata

- Name: Metadata Item
- Category: Data display
- Status: Stable

## 2. Overview

Use for repeated label and value pairs in project headers.

Do not use for long narrative content.

## 3. Anatomy

- Label
- Value

## 4. Tokens used

- `--color-link`
- `--color-text`
- `--space-xs`
- `--font-family-serif`
- `--font-size-body`

## 5. Props/API

Use `.ui-metadata-item`, `.ui-metadata-item__label`, and `.ui-metadata-item__value`.

## 6. States

- Default: label and value pair
- Hover: none
- Active: none
- Focus: linked values retain link focus
- Disabled: not applicable
- Error: omit pairs without a value

## 7. Code example

```html
<div class="ui-metadata-item"><p class="ui-metadata-item__label">Role</p><p class="ui-metadata-item__value">Designer</p></div>
```

## 8. Cross-references

- [Project Header](./project-header.md)
- [Tag](./tag.md)
