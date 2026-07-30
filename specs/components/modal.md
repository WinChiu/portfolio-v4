# Modal

## 1. Metadata

- Name: Modal
- Category: Overlay
- Status: Stable

## 2. Overview

Use for focused image inspection that temporarily overlays the page.

Do not use for content that can remain in normal page flow.

## 3. Anatomy

- Root
- Backdrop
- Dialog
- Content

## 4. Tokens used

- `--color-overlay`
- `--radius-lg`
- `--shadow-floating`
- `--z-modal`

## 5. Props/API

Use `.ui-modal`, `.ui-modal__backdrop`, and `.ui-modal__dialog`; toggle the native `hidden` attribute.

## 6. States

- Default: hidden
- Hover: none
- Active: open overlay
- Focus: dialog owns focus while open
- Disabled: not applicable
- Error: Escape and backdrop must close the modal

## 7. Code example

```html
<div class="ui-modal" hidden><div class="ui-modal__backdrop"></div><div class="ui-modal__dialog" role="dialog"></div></div>
```

## 8. Cross-references

- [Kitchen Gallery](./kitchen-gallery.md)
- [Icon Button](./icon-button.md)
