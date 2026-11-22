# Restyle layer spec

A style layer that sits **on top of the real, unchanged site** to preview the new direction on every real element.

- Preview pages: `node prototypes/restyle/build-preview.js` copies `index.html`, `home-zh.html`, `pages/{en,zh}/*.html` into `prototypes/restyle/preview/`. It adds a `<base>` and loads, in this order: the site's own CSS, then `layer/tokens.css`, then `layer/home.css` or `layer/work.css`; and before `</body>`, the scripts `layer/preview.js` and then `layer/home.js` or `layer/work.js`.
- Serve: `npx serve .` from the repo root, then open `/prototypes/restyle/preview/index.html` or `/prototypes/restyle/preview/pages/en/keepwell.html`.
- **Never edit** anything outside `prototypes/restyle/layer/` (except rebuilding preview output). The real site, `style/`, `templates/`, `utility/`, `content/` stay untouched.
- The layer may only add CSS overrides and small DOM enhancements in JS. Every original element, piece of content, and animation stays. That includes the typing intro, eye animation, drawing animations, hairline covers, loader, reveal, image zoom, photo wipe, and recipe sheet steps.

## Direction

Editorial and quiet. Warm off‑white paper, dark 2px rules, one color per chapter (home) or per project (project pages). The type is **sans + mono only**. Chrome stays quiet; the color goes to outline headings, big numbers, and the content itself.

## Global rules (apply everywhere)

| Topic | Rule |
|---|---|
| Fonts | `--rs-sans` (DM Sans + Noto Sans TC) for all text, `--rs-mono` (DM Mono) for numbers, tags, labels, meta, captions. Replace every DM Serif Display, DM Serif Text, Courier Prime and Caveat usage. Handwritten notes become sans 1.125rem. |
| Weights | 400, 500, 600 max. Nothing at 700+ (e.g. active TOC label was 700 → 500 + accent color). |
| Case | Sentence case. No `text-transform: uppercase` and no wide tracking anywhere (e.g. recipe sheet `__h`). |
| Italic | None (e.g. Kitchen course English names were serif italic → mono, muted). |
| Tracking | Negative letter‑spacing only on text ≥ 2rem. Small text 0. CJK (`html[lang=zh]`) headings: letter-spacing 0. |
| Color | Background `#fbfbf6`. Text: `--rs-ink`, `--rs-ink-soft`, `--rs-mute`. Accent text and links: `var(--accent-ink)`. Outline strokes, big numbers, fills, progress lines: `var(--accent)`. Highlights (`.highlight`, hero `.highlight`, links in copy) use `--accent-ink`, weight 500, no bold red. |
| Lines | Structural rules are `var(--rs-line)`: 2px solid #363a35 (the original). Dotted leaders: 2px dotted `--rs-leader`. |
| Outline headings | Keep the original stroke-heading look (Kitchen, Life, About titles, project card numbers, and any other place the site uses it). Change the stroke color from dark gold to `var(--accent)`. Stroke is 2px on desktop and 1.5px at ≤30rem. Fill stays transparent. |
| Spacing | 4px grid (rem in 0.25 steps). |
| Corners | Square (radius 0) for buttons, boxes and images, except round things that are meant to be round (icon circles, step nodes). |
| Buttons | Primary: background `--rs-ink`, text background color, 2px border `--rs-ink`, mono 0.875rem, padding 0.75rem 1.25rem, trailing "→". Hover: background and border `--accent-ink`. Secondary (e.g. "View Site"): transparent, 2px border `--rs-ink`, text `--rs-ink`, trailing "↗". Hover: background `--rs-ink`, text background. No scale, no shadow. |
| Motion | Keep all existing animations. Transitions only on color, background, border-color, opacity, transform. Use `var(--rs-ease)` and `--rs-fast` or `--rs-base`. Remove hover scale on cards and images. |
| zh | Body line-height 1.75 for `html[lang=zh]`. Chinese strings are shorter, so check nothing looks empty. Long English strings must wrap without overflow. |
| Responsive | Breakpoints: 72rem (tablet), 50rem (mobile-wide), 30rem (mobile). No horizontal page scroll at 360px. |

## Home (`layer/home.css`, `layer/home.js`)

1. **Main nav (`.nav--main`)**
   - **Desktop (>50rem):** Left column 13rem wide, 2px right rule. Top: "Win Chiu" (600) with "Product Designer" (muted) below; inject it with JS. Middle: the existing nav links, each prefixed with a mono number `01`–`04` in a fixed 2rem column. The active chapter link (whichever section is under the viewport middle) is colored with that chapter's `--accent-ink` and gets a 2px `--accent` line under the label that grows with section progress (scaleX). Bottom: the LinkedIn icon at 20px, colored by the text role, plus the text "LinkedIn", then the language link `繁 / EN`. Show `.nav__language` on desktop too.
   - **≤50rem:** Top bar, 56px tall, full width, 2px bottom rule. Left: nav labels without numbers. Right: the LinkedIn icon (24px) and the language link. **LinkedIn and language must stay visible on every width.** At ≤360px, reduce gaps but keep everything in one row.
   - Shift the page content to clear the nav, at the new width on desktop and the new height on mobile.
2. **Hero**
   - Keep the eyebrow (typing), the title, the description, the details (Stockholm / Master's), the avatar with eye animation, and the translator box.
   - Title: sans 500, large (clamp to about 7rem), tracking -0.04em.
   - Description: sans 1.375rem. Every `.highlight` and link becomes `--accent-ink`, and only real links keep a 1px underline (offset 3px).
   - Details: title 500 `--rs-ink`, subtitle `--rs-mute`, sentence case.
   - Translator box (`.block__translator`): 2px border, mono, square. Hover inverts.
3. **Work switcher (`.block--switcher`)**
   - Keep the full-width segmented bar with 2px rules, and keep its sticky behavior if it has one.
   - Unselected: `--rs-mute`, background transparent. Selected: `--accent-ink` text on the background plus a 4px `--accent` bar at the bottom edge. No gold fill.
   - Labels sans 500.
4. **Project cards (`project-card`)**
   - Both Design and Programming types, all 10 cards.
   - Number: keep the outline style in `--accent`.
   - Tag: mono `--rs-mute`. Title: sans 500 with tracking -0.02em. Description: `--rs-ink-soft`, and the colored left border becomes a 2px `--accent` left rule.
   - Buttons per the global rule: "View Project" is primary and "View Site" is secondary.
   - Hairline covers (`hairline-cover`) and image covers are untouched apart from no hover zoom.
   - 2px rule between cards.
5. **About**
   - Outline "About" title.
   - Paragraphs `--rs-ink-soft`.
   - Job rows keep the dotted leader (2px dotted `--rs-leader`). Title is `--rs-ink`, company is mono, and past rows are muted.
6. **Kitchen**, which keeps the real menu and its JS:
   - Outline title. Description `--rs-ink-soft`.
   - Course head: Chinese sans 600, English mono `--rs-mute` (not italic), 2px rule.
   - Dish: Chinese sans 500, which turns `--accent-ink` on hover and focus. English mono `--rs-mute`. The leader turns `--accent` on hover.
   - Effort flames: on = fill and stroke `--accent`; off = stroke `--rs-leader`.
   - Peek photo: 2px border.
   - Recipe sheet (with every part kept: photo wipe, ingredients, steps timeline, "coming soon", time meta):
     - 2px left rule.
     - Top meta in mono.
     - Prev/next/close as 36px square buttons with 2px borders. Hover inverts.
     - The name in Chinese is sans 600; the English name is mono.
     - The note (Caveat before) becomes sans 1.125rem `--rs-ink-soft`.
     - Section heads `__h` in mono sentence case, no uppercase, with a 2px bottom rule.
     - Step nodes keep their circle with a 2px border; past nodes fill `--accent`.
7. **Life**, which keeps the real film strip and its JS:
   - Outline title.
   - Cards keep the 2px border and the ±1.5deg tilt.
   - Note (Caveat before) becomes sans 1.125rem. Location and date in mono `--rs-mute`.
   - The section's top progress line uses `--accent`.

## Project pages (`layer/work.css`, `layer/work.js`)

1. **Nav (`.project-nav`, TOC built by `utility/createToc.js`: `.project-nav__toc > a.project-toc > .project-toc__dot + .project-toc__label`, active class `project-toc--active`)**
   - **Desktop (>72rem):** Left column 15rem, 2px right rule, always expanded (no hover reveal).
     - Top: "← All work" in mono, from the existing Back link.
     - TOC: each item is a grid with a 2rem mono number column (`01`… injected by JS) and the label in sans 0.9375rem, line-height 1.35. The label **wraps up to 2 lines** with a line clamp and an ellipsis, and the full text goes into a `title` attribute. Real titles reach about 50 characters ("Action 1: Facility Operations Workflow Investigation"), and a project has up to 10 items.
     - Hide the dot. Inactive items are `--rs-mute`, hover `--rs-ink`. Active is `--accent-ink` plus a 2px `--accent` line under the label.
     - If the list is taller than the space it gets, the list scrolls inside the column.
     - Bottom: language switch `繁 / EN` linking to the same project in the other language (`pages/en/x.html` ↔ `pages/zh/x.html`; inject it), then "Top ↑" from the existing Top link.
   - **Tablet (50–72rem):** A collapsed 4.5rem rail that shows only Back (as "←"), the numbers, and the bottom links. On hover or focus-within it expands to 17rem **over** the content, with background `#fbfbf6` and a 2px right rule. Labels follow the same 2-line rule.
   - **≤50rem:** Top bar 56px with a 2px bottom rule.
     - Left: "←" Back.
     - Middle: the current section as "03 Goal Breakdown" (mono number plus label), one line with an ellipsis.
     - Right: a "Sections" button (mono, 2px border).
     - A 2px `--accent` progress bar along the bottom edge shows page progress.
     - The button opens a panel under the bar listing every TOC item (number plus full label, wrapping freely) and the language switch. Tapping an item scrolls there and closes the panel; Esc and tapping outside also close it.
     - The TOC must not be lost on mobile; it was hidden in the original.
   - Shift the page content to clear the nav at each size.
2. **Header (`.project-header`, `_project-header.scss`)**
   - Tags in mono `--rs-mute`.
   - Title sans 500, large, tracking -0.03em.
   - Info grid: labels mono `--rs-mute`, values `--rs-ink`, separated by 2px rules.
   - Keep the hairline cover and header images.
3. **Section titles (`.project-module--section-title .project-module__heading`)**
   - Above the heading: a mono number `01`… (same order as the TOC) in `--accent`, about 2.5rem, injected by JS or done with a CSS counter.
   - Heading: sans 500, 2.25–3rem, tracking -0.03em, with a 2px rule above the section.
4. **Subsection title (`--subsection-title`)**: sans 600, 1.375rem.
5. **Eyebrow (`--eyebrow`)**: mono, `--accent-ink`, sentence case.
6. **Text**: sans 1.0625rem, line-height 1.7, `--rs-ink-soft`. `.highlight` is `--accent-ink` 500. Links are `--accent-ink` with an underline.
7. **Feature / bg quote (`--feature-quote`, `--bg-quote`, the dark band)**: keep the dark band with background `--rs-ink`. Text is the page background color, sans 500 at about 2rem. The left bar is 2px `--accent`. Labels are mono `--accent` (light enough on dark).
8. **Quote (`--quote`, the "Design Focus" yellow box)**: no yellow. Use a 2px `--accent` left rule and a background of `--accent` at 8% opacity (`color-mix`). Text is sans 500 `--rs-ink`.
9. **Big quote**: sans 500, about 1.75rem, `--rs-ink`. Any decorative quote mark is `--accent`.
10. **Callout (`.ui-callout`, e.g. the NDA note)**: 2px `--rs-ink` border, no fill, title sans 600, text `--rs-ink-soft`.
11. **Icon lists (`--icon-list-horizontal`, `--icon-list-vertical`)**: the yellow band background becomes `--color-background-soft`. Keep the white icon circles. Labels (e.g. "Business Goal") are mono `--accent-ink`, titles sans 600, text `--rs-ink-soft`.
12. **Media aside, image, image pair, captioned media grid, img-and-content block**: images are square, captions mono 0.8125rem `--rs-mute`, and nothing zooms on hover (the click-to-zoom from `image-zoom.js` stays).
13. **Lists (ordered/unordered)**: markers are mono `--accent-ink`.
14. **Buttons (e.g. "Visit site" on code projects)**: per the global rule.
15. **Process flow (`_process-flow.scss`, unused today)**: lines 2px, labels mono. Keep it working.
16. **Loader, reveal, translator**: untouched except fonts and colors.

## Done when

- Every home section and all 18 project pages (en + zh) render with no console errors and no horizontal scroll at 1440, 1024, 768, 390 and 360 widths.
- No serif, Courier or Caveat fonts appear (check the computed `font-family` of visible text).
- No uppercase transforms and no weights above 600.
- LinkedIn and the language switch are visible on mobile home. The TOC is reachable on mobile project pages.
- Long TOC labels wrap to 2 lines with an ellipsis on desktop and wrap freely in the mobile panel.

## Update: English only (no language switch)

The site is English-first for now. **Remove every language switch** in the layer:
- Hide the home nav `.nav__language` and the hero translator box `.block__translator`.
- Do not inject a `繁 / EN` link on project pages (desktop, tablet, or the mobile Sections panel).
- Mobile home top bar: nav labels + LinkedIn only.
- zh pages are no longer a review target; English pages are.
