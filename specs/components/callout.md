# Callout

## 1. Metadata

- Name: Callout
- Category: Content
- Status: Stable

## 2. Overview

Use for supplementary findings, warnings, and key supporting information.

Do not use as a quotation or generic decoration.

## 3. Anatomy

- Container
- Optional title
- Content

## 4. Tokens used

- `--color-interactive-subtle`
- `--color-interactive`
- `--color-text`
- `--space-md`

## 5. Props/API

Use `.ui-callout`; project content keeps `.project-module__callout` for its layout variant.

## 6. States

- Default: emphasized supporting content
- Hover: none
- Active: none
- Focus: links retain focus
- Disabled: not applicable
- Error: omit empty callouts

## 7. Code example

```html
<aside class="ui-callout"><strong>Finding</strong><p>Supporting information</p></aside>
```

## 8. Cross-references

- [Quote](./quote.md)
- [Project Module](./project-module.md)
