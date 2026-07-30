# Quote

## 1. Metadata

- Name: Quote
- Category: Case study content
- Status: Stable

## 2. Overview

Use for highlighted research quotes or key statements.

Do not use as a generic decorative card.

## 3. Anatomy

- Quote text
- Optional citation

## 4. Tokens used

- `--color-accent-subtle`
- `--color-interactive-subtle`
- `--space-*`
- `--font-family-serif`

## 5. Props/API

Use `.ui-quote`; project content retains `.project-module` modifiers for layout variants.

## 6. States

- Default: highlighted quotation
- Hover: none
- Active: none
- Focus: linked citations retain focus
- Disabled: not applicable
- Error: omit an empty citation element

## 7. Code example

```html
<blockquote class="ui-quote project-module--quote"><p>Research quote</p></blockquote>
```

## 8. Cross-references

- [Callout](./callout.md)
- [Project Module](./project-module.md)
