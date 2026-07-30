# Page Loader

## 1. Metadata

- Name: Page Loader
- Category: Feedback
- Status: Stable

## 2. Overview

Use during initial project-page asset loading.

Do not use for short in-page actions.

## 3. Anatomy

- Full-page mask
- Lottie indicator

## 4. Tokens used

- `--color-background`
- `--motion-duration-loading`
- `--space-*`
- `--z-loader`

## 5. Props/API

Use `.ui-loader` with the legacy page-specific class; add `.is-hidden` after readiness.

## 6. States

- Default: blocks page with visible indicator
- Hover: none
- Active: loading
- Focus: no interactive target
- Disabled: `.is-hidden` fades the mask
- Error: loading timeout must remove the mask and expose content

## 7. Code example

```html
<div class="ui-loader page-loader"><dotlottie-wc aria-label="Loading"></dotlottie-wc></div>
```

## 8. Cross-references

- [Hero](./hero.md)
