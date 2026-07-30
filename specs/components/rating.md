# Rating

## 1. Metadata

- Name: Rating
- Category: Data display
- Status: Stable

## 2. Overview

Use to display the kitchen effort level with a fixed visual scale.

Do not use as an editable rating input.

## 3. Anatomy

- Accessible label
- Rating icons

## 4. Tokens used

- `--space-3xs`
- `--space-lg`

## 5. Props/API

Use `.ui-rating` with decorative `.ui-rating__icon` children and an accessible label on the group.

## 6. States

- Default: read-only rating
- Hover: none
- Active: none
- Focus: not applicable
- Disabled: not applicable
- Error: provide a text equivalent

## 7. Code example

```html
<span class="ui-rating" aria-label="Effort 2 out of 3"><img class="ui-rating__icon" alt=""></span>
```

## 8. Cross-references

- [Kitchen Gallery](./kitchen-gallery.md)
