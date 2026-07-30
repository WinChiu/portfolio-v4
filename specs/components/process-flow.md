# Process Flow

## 1. Metadata

- Name: Process Flow
- Category: Case study content
- Status: Stable

## 2. Overview

Use to show the ordered phases of a project process.

Do not use for unordered feature lists.

## 3. Anatomy

- Step number
- Step heading
- Step description
- Connector

## 4. Tokens used

- `--color-link`
- `--color-text`
- `--space-*`
- `--font-size-*`
- `--font-weight-*`

## 5. Props/API

Process-flow modifier classes under `.project-module`; local custom properties derive from Layer 2 tokens.

## 6. States

- Default: ordered flow
- Hover: none
- Active: none
- Focus: linked steps retain focus
- Disabled: not applicable
- Error: step order and numbering must remain consistent

## 7. Code example

```html
<ol class="project-module__process-flow"><li><h3>Discover</h3></li></ol>
```

## 8. Cross-references

- [Project Module](./project-module.md)
- [Icon List](./icon-list.md)
