# Task A — port the HOME restyle into the real site

Branch is already `restyle-figma`. **Do not commit, do not switch branches, do not run `npm run build:*` / `npm run scss`** (the lead runs the builds).
Follow `CODEX.md` / `specs/`: read the relevant spec first, use only tokens from `style/tokens.css`, and keep `npm run audit:tokens -- --active` at **0 errors**.
New tokens may be added to `style/tokens.css` ONLY inside a block you create and delimit with `/* home-restyle */ … /* /home-restyle */` (another agent is editing the same file for project pages; make minimal edits, never rewrite the file). Base colors are already updated by the lead: `--color-text` is Ink `#1d1712`, `--color-text-strong/-muted` is Muted ink `#5a5048`, `--color-border` is `#1d1712`, plus `--color-chapter-work|about|kitchen|life` and `--color-me`.

## Source of truth
The finished, approved prototype lives in `prototypes/restyle/` (plain HTML/CSS/JS). Reproduce its **look and behavior** on the real home page, adapting to the real DOM and keeping the real data/JS where it exists.
Read: `prototypes/restyle/home.html`, `home.css`, `restyle.css`, `nav.js`, `home-extra.js`, `kitchen-life.js`. Values in them come from Figma, so copy sizes/spacing/colors exactly (convert to tokens).

## Your files (only touch these)
`style/home/*.scss`, `style/style.scss`, `utility/renderHomePage.js`, `templates/homePage.js`, `utility/kitchenMenu.js`, `utility/lifeStrip.js`, `utility/landingPageAnimation.js`, `utility/eyeAnimation.js`, `utility/loadingPage.js` (only if needed), `content/homeContent.js` (only if needed), and new files under `style/home/` or `utility/` if needed.
**Do not touch:** `style/work/**`, `style/workStyle.scss`, `templates/projectPage.js`, `templates/projectBlocks.js`, `utility/createToc.js`, `utility/projectPageAnimation.js`, `utility/image-zoom.js`, generated files (`index.html`, `home-zh.html`, `pages/**`, `style/style.css`, `style/workStyle.css`).
To check SCSS compiles without writing the tracked output: `npx sass --no-source-map style/style.scss %TEMP%/home-check.css`.

## What to build (summary — the prototype CSS has every number)
- Fonts: DM Serif Display for the 160px chapter titles (Work/About/Kitchen/Life) and the hero title (solid fill, tracking −6px); DM Sans/DM Mono elsewhere; Noto Sans TC for Chinese names; Caveat only for the recipe note.
- Page gutter is 80px (≥64rem), 32px tablet, 20px phone.
- **Index nav (`nav--main`)**: 99px column on desktop, 2px right rule, chapter links 14px Muted ink (no numbers, no name), LinkedIn icon 28px at the bottom, centered. Phone: 56px top bar with links + LinkedIn. The whole bar **fills with the chapter color as you scroll** (logic in `prototypes/restyle/nav.js`: Work fills empty bar top→bottom; afterwards bar is always full — the current chapter's color grows from the top, the previous chapter's color stays below; links/icon over colored area turn paper color). Hide the language link.
- **Hero**: remove the avatar (and its eye animation wiring; keep the code safe when absent). Title "Product" (indented ~1.05em) / "Designer" in `--color-me`, side-by-side with the intro on ≥88rem, stacked below (88rem and under). Intro block: "Hi! I'm Win" 22px semibold (keep the typing animation on this line), 14/24 paragraph with highlight in `--color-me`, details row. Remove the translator box.
- **Work**: chapter title; a **sticky full-width segmented tab bar** (2 equal halves, 2px lines top/bottom and between, selected half = solid `--color-chapter-work` with paper text, unselected transparent) that sticks to the top while scrolling the Work section (below the 56px bar on phone). Project rows: 100px outline number (transparent fill, 1.5px stroke chapter color), copy column (mono tag, 40/40 −1px title, 14/24 description, mono link), 504×378 cover; rows separated by 2px rules; row padding 40px top / 48px bottom. Keep real hairline covers and cards' real links ("View project →", "View site ↗").
- **About**: paper background (no dark band), portrait 459×689 with an 8px offset shadow in about-ink, title+3 paragraphs+job rows (1px rules, past rows 60% opacity, company in mono right-aligned). Phone order: title/paragraphs, photo, jobs.
- **Kitchen**: title, lede 24/32, two-column menu (course head: 28px zh + 18px mono en + 1px rule; dish rows 70px high with dotted leader and flames in kitchen ink), hover photo 17rem wide with a dark hint bar "Click to see the recipe →", recipe drawer 576px wide (2px left rule, three 36px square buttons: prev/next left, close right, tabler-style chevrons/x SVG; 478px square photo with 8px kitchen-ink offset shadow; 28px Noto zh title, 22px semibold en title, Course/Effort row; Caveat 24px note; "Ingredients"/"Method" mono headings with 1px rules; dotted-leader ingredient rows; method steps with connector line). **Opening the drawer must not shift the page**: pad `body` by the scrollbar width while scroll is locked.
- **Life**: title + intro, film strip cards (354px wide, 2px border, 24px padding, ±1.5° tilt, 378px-tall image, caption 14/24 + mono location; landscape cards 525px). Remove the footer line "© 2026 Win Chiu".
- Remove every language switch / translator on the home page (English-first).
- Keep all existing animations that still apply (typing, drawing, reveal, loader, Lenis smooth scroll, life strip scrub, kitchen peek). Respect `prefers-reduced-motion`.
- Responsive: ≤88rem hero stacks; ≤72rem project rows become number+copy with the cover below; ≤48rem phone layout exactly as in the prototype's `@media (max-width: 48rem)` block. No horizontal scroll at 360px.

## Done when
`npx sass` compiles `style/style.scss`, `npm run audit:tokens -- --active` has 0 errors, the changed JS has no syntax errors (`node --check`), and a short report lists what changed, what you could not verify, and any token you added.
