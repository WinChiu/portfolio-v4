# Button

## 1. Metadata

- Name: Button
- Category: Action
- Status: Stable

## 2. Overview

Use for actions that change state or start a task.

Do not use a button for navigation when a link is semantically correct.

## 3. Anatomy

- Container
- Label
- Optional icon

## 4. Tokens used

- `--color-interactive`
- `--color-interactive-hover`
- `--color-text-inverse`
- `--color-focus`
- `--space-*`
- `--font-weight-medium`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-button` with `.ui-button--primary`, `.ui-button--secondary`, or `.ui-button--text`. Native `disabled`, `aria-disabled="true"`, and `.is-disabled` share the disabled state.

## 6. States

- Default: variant surface and label
- Hover: interactive color feedback
- Active: pressed color feedback
- Focus: tokenized focus outline
- Disabled: muted, non-interactive state
- Error: not applicable

## 7. Code example

```html
<button class="ui-button ui-button--primary" type="button">View project</button>
```

## 8. Cross-references

- [Icon Button](./icon-button.md)
- [Link](./link.md)
