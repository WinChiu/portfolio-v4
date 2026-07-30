# Project Header

## 1. Metadata

- Name: Project Header
- Category: Case study
- Status: Stable

## 2. Overview

Use at the start of each project case study.

Do not use on the landing page.

## 3. Anatomy

- Artwork
- Title
- Subtitle
- Metadata tags
- Introduction

## 4. Tokens used

- `--color-background`
- `--color-surface-glass`
- `--color-text`
- `--space-*`
- `--font-size-*`
- `--filter-shadow-project-image`
- `--z-raised`

## 5. Props/API

CSS block `.project-header`; metadata composes Metadata Item and categories compose Tag.

## 6. States

- Default: responsive header layout
- Hover: no component-level hover
- Active: not applicable
- Focus: interactive descendants retain focus
- Disabled: not applicable
- Error: artwork is optional; text structure remains required

## 7. Code example

```html
<header class="project-header"><span class="ui-tag">UX</span><div class="ui-metadata-item">Role</div></header>
```

## 8. Cross-references

- [Metadata Item](./metadata-item.md)
- [Project Navigation](./project-navigation.md)
- [Project Module](./project-module.md)
- [Tag](./tag.md)
