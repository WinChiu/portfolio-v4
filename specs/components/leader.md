# Leader

## 1. Metadata

- Name: Leader
- Category: Data display
- Status: Stable

## 2. Overview

Use to join a label to its value with a dotted line (a menu item to its effort, an ingredient to its quantity).

Do not use as a divider between unrelated blocks.

## 3. Anatomy

- Dotted line

## 4. Tokens used

- `--sys-color-text`
- `--sys-space-hairline`
- `--sys-font-size-body`
- `--sys-motion-duration-fast`

## 5. Props/API

`UI.Leader()` from `components/Leader/leader.js`. It is decorative (`aria-hidden`) and stretches to fill the row it sits in. A parent may turn it to the accent ink on hover.

## 6. States

- Default: dotted line in the text color at reduced strength
- Hover, focus, disabled, error: not applicable

## 7. Code example

```html
<span class="leader" aria-hidden="true"></span>
```

## 8. Cross-references

- [Menu Item](./menu-item.md)
