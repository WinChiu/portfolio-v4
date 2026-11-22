# Effort Meter

## 1. Metadata

- Name: Effort Meter
- Category: Data display
- Status: Stable

## 2. Overview

Use to show how much work a dish takes, from one to three flames.

Do not use as a generic rating; it has no interaction.

## 3. Anatomy

- Container with an accessible name
- Flames (on or off)

## 4. Tokens used

- `--sys-space-hairline`
- `--sys-space-sm`
- `--sys-space-14`

## 5. Props/API

`UI.EffortMeter({ level, max = 3 })` from `components/EffortMeter/effortMeter.js`. Flames are drawn in the surrounding accent ink; a flame above `level` is an outline only. The container has `role="img"` and an `aria-label` such as "Effort 2 of 3".

## 6. States

- Default: filled flames up to the level
- Hover, focus, disabled, error: not applicable

## 7. Code example

```html
<span class="effort-meter" role="img" aria-label="Effort 2 of 3">…</span>
```

## 8. Cross-references

- [Menu Item](./menu-item.md)
