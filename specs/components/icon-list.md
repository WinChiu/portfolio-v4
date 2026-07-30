# Icon List

## 1. Metadata

- Name: Icon List
- Category: Case study content
- Status: Stable

## 2. Overview

Use for short parallel facts represented by an icon and label.

Do not use for long prose or ordered procedures.

## 3. Anatomy

- List
- Icon item
- Icon
- Label

## 4. Tokens used

- `--color-text`
- `--space-*`
- `--font-size-*`
- `--radius-*`

## 5. Props/API

Icon-list modifier classes under `.project-module`.

## 6. States

- Default: aligned icon items
- Hover: none
- Active: none
- Focus: linked items retain focus
- Disabled: not applicable
- Error: missing icons require meaningful text labels

## 7. Code example

```html
<ul class="project-module__icon-list"><li><img alt=""><span>Fast</span></li></ul>
```

## 8. Cross-references

- [Project Module](./project-module.md)
- [Process Flow](./process-flow.md)
