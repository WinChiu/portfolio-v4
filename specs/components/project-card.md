# Project Card

## 1. Metadata

- Name: Project Card
- Category: Content
- Status: Stable

## 2. Overview

Use on the home work grid to summarize and link to one portfolio project.

Do not use for long case-study content or generic navigation.

## 3. Anatomy

- Cover image
- Project number
- Title
- Tag
- Description
- Primary project link
- Optional site link

## 4. Tokens used

- `--color-text`
- `--color-text-subtle`
- `--color-interactive`
- `--color-interactive-hover`
- `--color-text-inverse`
- `--space-*`
- `--font-weight-*`

## 5. Props/API

`<project-card>` attributes: `number`, `title`, `tag`, `description`, `image-url`, `project-url`, optional `site-url`, `type`, and `lang`.

## 6. States

- Default: project summary and primary action
- Hover: shared Button hover state
- Active: inherited link activation
- Focus: shared Button focus state
- Disabled: shared Button disabled state
- Error: not defined; omit cards with invalid required data

## 7. Code example

```html
<project-card number="01" title="RFID" tag="UX" description="Case study" image-url="img/rfid.webp" project-url="pages/en/rfid.html"></project-card>
```

## 8. Cross-references

- [Button](./button.md)
- [Hero](./hero.md)
- [Tag](./tag.md)
- [Work Switcher](./work-switcher.md)
