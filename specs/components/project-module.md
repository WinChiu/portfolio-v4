# Project Module

## 1. Metadata

- Name: Project Module
- Category: Case study
- Status: Stable

## 2. Overview

Use as the primary compositional container for case-study text, media, lists, and callouts.

Do not use for site chrome.

## 3. Anatomy

- Section title
- Body content
- Media
- Caption
- Optional callout

## 4. Tokens used

- `--color-*`
- `--space-*`
- `--font-size-*`
- `--font-weight-*`
- `--radius-*`
- `--shadow-low`

## 5. Props/API

CSS block `.project-module` with modifier classes for existing content arrangements.

## 6. States

- Default: stacked editorial content
- Hover: zoomable media may elevate
- Active: not applicable
- Focus: links and zoomable media remain focusable
- Disabled: not applicable
- Error: missing media must not remove its caption context

## 7. Code example

```html
<section class="project-module"><h2 class="project-module__title">Research</h2><p>Findings</p></section>
```

## 8. Cross-references

- [Quote](./quote.md)
- [Media Aside](./media-aside.md)
- [Icon List](./icon-list.md)
- [Process Flow](./process-flow.md)
