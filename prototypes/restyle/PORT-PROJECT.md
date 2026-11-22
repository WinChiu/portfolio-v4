# Task B — port the PROJECT PAGE restyle into the real site

Branch is already `restyle-figma`. **Do not commit, do not switch branches, do not run `npm run build:*` / `npm run scss`** (the lead runs the builds).
Follow `CODEX.md` / `specs/`: read the relevant spec first, use only tokens from `style/tokens.css`, and keep `npm run audit:tokens -- --active` at **0 errors**.
New tokens may be added to `style/tokens.css` ONLY inside a block you create and delimit with `/* work-restyle */ … /* /work-restyle */` (another agent is editing the same file for the home page; make minimal edits, never rewrite the file). Base colors are already updated by the lead: `--color-text` is Ink `#1d1712`, `--color-text-strong/-muted` is Muted ink `#5a5048`, `--color-border` is `#1d1712`, plus `--color-chapter-work|about|kitchen|life` and `--color-me`.

## Source of truth
The approved prototype lives in `prototypes/restyle/` (plain HTML/CSS/JS). Reproduce its **look and behavior** on the real project pages (`templates/projectPage.js` + `templates/projectBlocks.js` generate them; content comes from `content/projects/*`).
Read: `prototypes/restyle/project.html`, `project.css`, `project.js`, `restyle.css`. Values come from Figma ("KeepWell · project?p=keepwell" frame), so copy sizes/spacing/colors exactly (convert to tokens).

## Your files (only touch these)
`style/work/**`, `style/workStyle.scss`, `templates/projectPage.js`, `templates/projectBlocks.js`, `utility/createToc.js`, `utility/projectPageAnimation.js`, and new files under `style/work/` / `utility/` if needed.
**Do not touch:** `style/home/**`, `style/style.scss`, `utility/renderHomePage.js`, `templates/homePage.js`, the home JS (`kitchenMenu.js`, `lifeStrip.js`, `landingPageAnimation.js`, `eyeAnimation.js`), `utility/image-zoom.js`, generated files (`index.html`, `home-zh.html`, `pages/**`, `style/style.css`, `style/workStyle.css`).
To check SCSS compiles without writing the tracked output: `npx sass --no-source-map style/workStyle.scss %TEMP%/work-check.css`.

## What to build (summary — the prototype CSS has every number)
- **Accent per project**: the project color (`--accent-ink`) comes from the palette in `project.js` (`designSystem` work, `keepwell/rfid/ba` about, `pos` life, `bizpro` kitchen, `childcare/forest` sage `#6a7758`, `gongChi` plum `#8a6882`); apply it via a body class from `templates/projectPage.js` (`project-page--<slug>` already exists). Add sage/plum as project-scoped tokens inside your delimited block.
- **Index nav (`project-nav`)**: desktop is a 72px **rail** that shows only the numbers `01…` (centered, fixed position), with plain-text "Back" at the top and "Top" at the bottom (no icons); on hover/focus-within it expands over the content to 272px and reveals the section labels to the right **without any number/Back/Top moving** (rows keep a fixed 2.5rem height). The current section's number is bright/bold, the others pale (opacity .5). The bar **fills top→bottom with the project color as the page is read** (page progress); numbers/Back/Top over the fill switch to paper color. Phone (≤48rem): 56px top bar with "Back", current section "03 Goal Breakdown", a "Sections" button opening a panel with the full TOC, and a 2px page-progress line. Esc/outside-click closes the panel. Hide the language link/translator. The real TOC is built by `utility/createToc.js`; adapt it (numbers injected, titles in a `title` attribute, ellipsis single line).
- **Header**: title 76px DM Sans 500 (tracking −2px), first part before ":" in the project color, rest in Ink; tags in mono below (project color); facts grid (Duration/Role/Responsibility/Company) with 2px top rule and 2px vertical rules. **Remove the header cover/hero image and hairline-cover artwork** from the project header (the Figma has none).
- **Preamble (NDA quote)**: 3px left border in project color, 10% project-color background, 14/24 semibold Muted ink.
- **Sections**: each section has a 2px top rule and 160px (10rem) top/bottom padding (80px on phone ×2 = 96px); grid `1fr 2fr` with 48px gap; a 100px DM Mono number (tracking −6px, project color) that is **`position: sticky; top: 2rem`** on ≥48rem; 48px/52px heading (−1px); blocks 48px apart; body 14/24 Muted ink; highlights in project color, weight 600.
- The "problem" section (dark band) turns the **whole section** Ink with paper text: statement 40/40 −1px; two callouts with 2px project-color top rule, 22px semibold title, 14/24 text.
- Big quote: 160px illustration + 32px text; on phone centered column, max-width 22rem, illustration 8rem.
- Icon lists ("goals"): 3 columns with 2px top rule and 2px vertical rules, 160px circle badges (`--color-background-soft`), label mono in project color, 14px semibold title; padding-top 40px. On phone: icon (88px) on the left, text on the right.
- Media captions mono 14 Muted ink; images square (no radius), keep click-to-zoom. Lists markers mono project color. Callouts: 2px Ink border.
- Next project block: 2px top rule, "Next project" mono label, 76px title in the *next* project's color.
- Keep Lenis smooth scroll, reveal, loader, image zoom and existing GSAP behavior working (sticky/rail must work with Lenis). Respect `prefers-reduced-motion`.
- Responsive: ≤72rem section grid becomes `5rem 1fr`; ≤48rem single column with the phone nav/layout from the prototype's `@media (max-width: 48rem)` block. No horizontal scroll at 360px.

## Done when
`npx sass` compiles `style/workStyle.scss`, `npm run audit:tokens -- --active` has 0 errors, changed JS passes `node --check`, and a short report lists what changed, what you could not verify, and any token you added.
