# Project Card

## 1. Metadata

- Name: Project Card
- Category: Content
- Status: Stable

## 2. Overview

Use on the home Work list to summarize and link to one portfolio project.

Do not use for long case-study content or generic navigation.

## 3. Anatomy

- Number
- Tag
- Title
- Description
- Project button
- Optional site button
- Cover (image or interactive Hairline figure)

## 4. Tokens used

- `--sys-color-text`
- `--sys-color-text-muted`
- `--sys-font-size-*`
- `--sys-space-*`
- `--comp-project-cover-width`
- `--comp-project-cover-bleed`

## 5. Props/API

`UI.ProjectCard({ number, tag, title, description, imageUrl, projectUrl, siteUrl, type, coverType, lang })` from `components/ProjectCard/projectCard.js`. `type` is `design` or `code`; a code project starts hidden (`workHide`) and may carry a `siteUrl`, which adds a "View site" button. `coverType="component-tray"` or `"delivery"` draws the cover with `<hairline-cover>`; the image is its fallback. `tag`, `title` and `description` may carry markup. It composes Button and takes its accent from the Work chapter (`--accent-ink`). Styles: `components/ProjectCard/_projectCard.scss`.

## 6. States

- Default: project summary and buttons
- Hover and focus: the Button states
- Hidden: `workHide` while its category tab is off
- Disabled, error: not applicable; omit cards with invalid required data

## 7. Code example

```html
<article class="project-card" data-type="design" aria-hidden="false">…</article>
```

## 8. Cross-references

- [Button](./button.md)
- [Photo Card](./photo-card.md)
