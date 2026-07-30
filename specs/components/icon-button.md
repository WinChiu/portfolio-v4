# Icon Button

## 1. Metadata

- Name: Icon Button
- Category: Action
- Status: Stable

## 2. Overview

Use for compact actions whose icon has a clear accessible label.

Do not use without `aria-label` when no visible text exists.

## 3. Anatomy

- Button container
- Icon
- Accessible name

## 4. Tokens used

- `--color-interactive`
- `--color-interactive-hover`
- `--color-focus`
- `--space-4xl`
- `--radius-lg`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-icon-button` on a native button and provide `aria-label`.

## 6. States

- Default: interactive surface
- Hover: raised hover feedback
- Active: pressed feedback
- Focus: tokenized focus outline
- Disabled: native disabled state
- Error: missing accessible name is invalid

## 7. Code example

```html
<button class="ui-icon-button" type="button" aria-label="Next"><img src="next.svg" alt=""></button>
```

## 8. Cross-references

- [Button](./button.md)
- [Modal](./modal.md)
