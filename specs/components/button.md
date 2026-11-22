# Button

## 1. Metadata

- Name: Button
- Category: Action
- Status: Stable

## 2. Overview

Use for actions that change state or start a task.

Do not use a button for navigation when a link is semantically correct.

## 3. Anatomy

- Link container
- Label
- Optional icon

## 4. Tokens used

- `--sys-color-interactive`
- `--sys-color-interactive-hover`
- `--sys-color-text-inverse`
- `--sys-color-focus`
- `--sys-space-*`
- `--sys-font-weight-medium`
- `--sys-motion-duration-fast`

## 5. Props/API

`UI.Button({ label, href, variant, icon, external, className })` from `components/Button/button.js` (browser and Node). `variant` is `outline` (accent ink, inside a chapter), `bordered` (ink border, inside a project page), `solid`, `secondary` or `text`. `icon` is a decorative glyph. `external` opens a new tab with `rel="noopener noreferrer"`. Styles live in `components/Button/_button.scss`; the solid, secondary and text variants share the `disabled`, `aria-disabled="true"` and `.is-disabled` state.

## 6. States

- Default: variant surface and label
- Hover: interactive color feedback
- Active: pressed color feedback
- Focus: tokenized focus outline
- Disabled: muted, non-interactive state
- Error: not applicable

## 7. Code example

```html
<a class="button button--outline" href="pages/en/rfid.html"><span class="button__label">View project</span> <span class="button__icon" aria-hidden="true">→</span></a>
```

## 8. Cross-references

- [Icon Button](./icon-button.md)
- [Link](./link.md)
