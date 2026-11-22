# Stylesheet architecture

## Design tokens

`tokens.css` is the single source of truth. It has three tiers, the same model as [Material 3](https://m3.material.io/foundations/design-tokens/overview):

| Tier | Prefix | What it holds | Who may use it |
| --- | --- | --- | --- |
| Reference | `--ref-*` | Every approved raw value, named for what it **is**: a palette tone (`--ref-palette-neutral-8`), a typeface, a length (`--ref-size-24`). One value, one name. | Only other tokens. Never a component. |
| System | `--sys-*` | The decisions and roles: `--sys-color-text`, `--sys-space-md`, `--sys-font-size-body`. They point at a reference token wherever the value exists there. | Components. |
| Component | `--comp-*` | Measures that belong to one element or section: `--comp-hero-card-width`, `--comp-nav-width-project`. They point at system or reference tokens; a one-off length may be written here. | Components. |

Rules:

- **One value, one name** in the reference tier. If two roles need the same color, both point at the same `--ref-palette-*` token. The preview page checks this and `scripts/token-audit.js` fails the build if a component writes `var(--ref-*)`.
- Name a system or component token by its **role**, never by its value or the page it first appeared on.
- Roles that need a tint use `color-mix(in srgb, var(--ref-palette-…) N%, transparent)`, so a tint always follows its palette tone.
- Motion, z-index, opacity, elevation and keywords live in the system tier and hold their own values (Material does the same); there is nothing to share.
- Rem lengths are shared through `--ref-size-N` (N is px at a 16px root). Px lengths stay literal because the root font size is fluid.
- `--sys-space-pull-*` are negative margins that pull an element toward its neighbor. `--comp-measure-*` are maximum text widths.
- `--sys-motion-duration-*` and `--sys-motion-ease-*` are read by the scripts in `utility/` as well as by CSS.

Open `specs/tokens/index.html` (generated) to see all three tiers drawn with their live values, what each role points at, and which reference tokens are used by how many roles.

## Scales

- **Fonts**: DM Sans, DM Mono, DM Serif Display and Caveat for handwriting. Chinese glyphs fall back to the system CJK font.
- **Font sizes**: caption 12, small 14, body 16, body-lg 18, title-xs 20, title-sm 24, title-md 32, title-lg 40, display-sm 56, display-md 72, display-lg 96 (px at a 16px root). The `hero`, `chapter`, `section-*` and `project-title` sizes are fluid `clamp()` roles. Do not use a spacing token as a font size.
- **Line heights**: four unitless steps, tight 1, heading 1.2, body 1.5, relaxed 1.75. Do not set a line height in rem or px.
- **Letter spacing**: `display` (em) and three tightening steps (`tight` −1px, `tighter` −3px, `tightest` −6px).
- **Colors** are grouped by purpose: text, surface, border, brand and chapter inks, interactive, emphasis tints, overlay. A color nobody uses does not belong in the file.

## File layout

```
style/
├─ tokens.css                design tokens (source of truth)
├─ style.scss                home-page entry: only a @use manifest + token import
├─ workStyle.scss            project-page entry: same shape
├─ _ui-primitives.scss       shared UI primitives (button, link, loader shell, …)
├─ _page-transition.scss     page loader and page-to-page curtain (both entries)
├─ _lenis.scss               smooth-scroll hooks (both entries)
├─ home/                     one partial per home-page section
│  ├─ _base.scss             reset, typography, links, shared helpers
│  ├─ _nav.scss              fixed index + page progress
│  ├─ _chapters.scss         chapter headings
│  ├─ _hero.scss, _work.scss, _about.scss, _kitchen-menu.scss, _life.scss
└─ work/                     one partial per project-page area
   ├─ _base.scss, _theme.scss (accent ink per project), _nav-rail.scss, _header.scss
   └─ _sections.scss, _media.scss, _lists.scss, _modules.scss
```

- Component styles live with the component, not here: `components/<Name>/_<name>.scss` is `@use`d from `style.scss` / `workStyle.scss` (see `components/README.md`).
- A partial owns its own breakpoints: its `@media` blocks sit next to the rules they change. Rules keep their original order inside a partial because later rules intentionally override earlier ones (for example `.workHide` must stay after `.project`).
- `style.css` and `workStyle.css` are generated outputs; edit the Sass sources instead.
- There is no separate "restyle" layer, Sass variable shim, or mixin file any more. Use CSS custom properties directly.

## Commands

- `npm run scss` compiles both stylesheet entry points.
- `npm run scss:watch` watches and recompiles both entry points.
- `npm run audit:tokens` runs `scripts/token-audit.js` to find raw values that should use tokens. Run it before committing style changes; zero violations are required.
- `npm run specs:generate` regenerates `specs/tokens/token-reference.md`, the token preview page `specs/tokens/index.html`, and `specs/components/*.md`. Run it after changing `tokens.css` or component token usage, and commit the generated files.
