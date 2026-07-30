# Tag

## 1. Metadata

- Name: Tag
- Category: Data display
- Status: Stable

## 2. Overview

Use for short project categories and metadata labels.

Do not use tags as interactive filters without button semantics.

## 3. Anatomy

- Container
- Label

## 4. Tokens used

- `--color-text-muted`
- `--color-accent-soft`
- `--space-*`
- `--radius-sm`
- `--font-size-small`

## 5. Props/API

Use `.ui-tag`; add `.ui-tag--text` for the borderless text treatment.

## 6. States

- Default: passive label
- Hover: none
- Active: none
- Focus: not applicable
- Disabled: not applicable
- Error: omit empty tags

## 7. Code example

```html
<span class="ui-tag">UX Design</span>
```

## 8. Cross-references

- [Project Card](./project-card.md)
- [Project Header](./project-header.md)
