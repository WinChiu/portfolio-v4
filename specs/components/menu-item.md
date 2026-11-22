# Menu Item

## 1. Metadata

- Name: Menu Item
- Category: Data display
- Status: Stable

## 2. Overview

Use for one dish on the Kitchen menu: a button that opens the recipe sheet.

Do not use for navigation to another page; it opens a dialog.

## 3. Anatomy

- Button
- Chinese name
- English name
- Leader
- Effort meter

## 4. Tokens used

- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-font-size-body`
- `--sys-font-size-small`
- `--sys-space-xs`
- `--comp-menu-item-padding-block`
- `--sys-motion-duration-fast`

## 5. Props/API

`UI.MenuItem({ index, nameZh, nameEn, effort })` from `components/MenuItem/menuItem.js`. It composes Leader and EffortMeter. The accent color comes from the surrounding chapter (`--accent-ink`). `index` is read back from `data-index` to open the matching recipe.

## 6. States

- Default: name, leader and flames
- Hover and focus: name and leader take the accent ink
- Focus: outline in the accent ink
- Disabled: not applicable
- Error: not applicable

## 7. Code example

```html
<button type="button" class="menu-item" data-index="0" aria-haspopup="dialog" aria-controls="kitchen-recipe">…</button>
```

## 8. Cross-references

- [Effort Meter](./effort-meter.md)
- [Leader](./leader.md)
