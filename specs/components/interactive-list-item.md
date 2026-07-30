# Interactive List Item

## 1. Metadata

- Name: Interactive List Item
- Category: Selection
- Status: Stable

## 2. Overview

Use for selectable rows that update nearby content.

Do not use a generic div when native button semantics are available.

## 3. Anatomy

- Button row
- Primary label
- Supporting content

## 4. Tokens used

- `--color-highlight-soft`
- `--color-focus`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-interactive-item` on a native button with `aria-pressed`; use `.is-active` for the selected state.

## 6. States

- Default: transparent row
- Hover: highlighted row
- Active: persistent highlight
- Focus: tokenized focus outline
- Disabled: native button disabled
- Error: invalid items should be omitted

## 7. Code example

```html
<button class="ui-interactive-item is-active" aria-pressed="true">Item</button>
```

## 8. Cross-references

- [Kitchen Gallery](./kitchen-gallery.md)
- [Button](./button.md)
