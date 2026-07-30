# Translator

## 1. Metadata

- Name: Translator
- Category: Utility navigation
- Status: Temporarily hidden

## 2. Overview

Use for switching between Chinese and English project pages when language switching is enabled.

Do not expose it until both language targets exist.

## 3. Anatomy

- Fixed container
- Language link
- Label

## 4. Tokens used

- `--color-background`
- `--color-border`
- `--color-interactive-hover`
- `--color-text-inverse`
- `--space-*`
- `--radius-sm`
- `--shadow-raised`
- `--z-sticky`

## 5. Props/API

Landing `.block__translator` and project `.project-translator`; currently hidden by global policy.

## 6. States

- Default: hidden site-wide
- Hover: gold background and inverse text when enabled
- Active: link navigation
- Focus: link focus remains available
- Disabled: hidden state acts as disabled
- Error: hide when alternate-language URL is absent

## 7. Code example

```html
<aside class="project-translator"><a href="../zh/rfid.html"><p>中文</p></a></aside>
```

## 8. Cross-references

- [Main Navigation](./main-navigation.md)
- [Project Navigation](./project-navigation.md)
