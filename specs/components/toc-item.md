# TOC Item

## 1. Metadata

- Name: TOC Item
- Category: Navigation
- Status: Stable

## 2. Overview

Use in project navigation to link to a generated section anchor.

Do not use outside an in-page table of contents.

## 3. Anatomy

- Link
- Status dot
- Label

## 4. Tokens used

- `--color-interactive`
- `--color-focus`
- `--font-weight-bold`
- `--motion-duration-fast`

## 5. Props/API

Use `.ui-toc-item` with `.ui-link`; apply `.is-active` to the current section.

## 6. States

- Default: section link
- Hover: reduced opacity feedback
- Active: interactive color and bold label
- Focus: tokenized focus outline
- Disabled: not applicable
- Error: target anchor must exist

## 7. Code example

```html
<a class="ui-link ui-toc-item is-active" href="#research">Research</a>
```

## 8. Cross-references

- [Project Navigation](./project-navigation.md)
- [Link](./link.md)
