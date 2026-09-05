# Stylesheet architecture

## Design tokens

`tokens.css` is the single source of truth for colors, spacing, typography, radius, shadow, z-index, and motion. Component styles consume these CSS custom properties with `var(--token-name)`; do not hardcode raw design values in component CSS.

Spacing has two deliberate naming forms:

- T-shirt names such as `--space-xs`, `--space-md`, and `--space-2xl` form the clean spacing scale.
- Numeric, pixel-based names such as `--space-14`, `--space-36`, and `--space-72` cover in-between values. The number is the equivalent pixel size at a 16px root font size.

For a new one-off spacing value, use the same numeric-pixel convention. Do not reintroduce `--space-custom-*` tokens.

`_tokens.scss` is a legacy compatibility shim for older partials. Its Sass variables, such as `$color-black`, map to custom properties such as `var(--color-text)`. Prefer the CSS custom properties directly in new code; keep the shim only while older styles still depend on it.

## File layout

- `style.scss` is the home-page entry point and contains only the `@use` manifest plus the token import. Home-page sections live in `home/`, one partial per section.
- `workStyle.scss` is the project-page entry point. Project layout, typography, overrides, and utilities live in `work/`; reusable project components live in `work/components/`.
- `_mixins.scss`, `_ui-primitives.scss`, and `_type-scale.scss` are shared by both entry points.
- `style.css` and `workStyle.css` are generated outputs; edit their Sass sources instead.

## Commands

- `npm run scss` compiles both stylesheet entry points.
- `npm run scss:watch` watches and recompiles both entry points.
- `npm run audit:tokens` runs `scripts/token-audit.js` to find raw values that should use tokens. Run it before committing style changes.
- `npm run specs:generate` regenerates `specs/tokens/token-reference.md` and `specs/components/*.md` from `tokens.css` and the component definitions. Run it after changing `tokens.css` or component token usage, and commit the generated specs.
