# Restyle mockup v2: fill in the missing elements

**The base is the standalone mockup** in `prototypes/restyle/`, not the original site's look:

- `home.html`
- `project-keepwell.html`
- `restyle.css`
- `nav.js`
- `kitchen-life.js`

Keep its visual language exactly:

- **Surface and lines:** background #fbfbf6, structural lines 2px solid #363a35.
- **Type:** DM Sans and DM Mono only.
- **Color:** one color per chapter or project (`.c-work` and the others in `restyle.css`, with a light `--accent` and a text-safe `--accent-ink`).
- **Big titles:** huge outline (hollow) chapter titles.
- **Nav:** the left index nav with mono numbers and a progress line.
- **Style rules:** sentence case, no italics, no uppercase labels, weights 400–600, square corners, and a 4px spacing grid.

Add the elements the real site has that the mockup left out, **styled in the mockup's language**. Do not bring back the old look: no gold, no serif, no Courier or Caveat, no yellow boxes, no red filled buttons, no dot TOC.

**English only.** No language switch anywhere.

Real content lives in:

- `content/homeContent.js`, which sets `window.__HOME_PAGE_CONTENT__.en`. It holds the projects (Design and Programming types, some `hidden`), the about text, the jobs, the kitchen courses and labels, and the life items.
- `content/kitchenMenuData.js`, which sets `window.__KITCHEN_MENU__`. Dishes can include ingredients, steps and time.
- `prototypes/restyle/data/projects.js`, which sets `window.__PROJECTS__` with every project's English header and sections. Its block types match `templates/projectBlocks.js`; read that file for each block's fields and meaning.

Image paths in the data are relative to the site root, like `/img/...` or `../../img/...`. From `prototypes/restyle/`, both resolve correctly when the site is served from the repo root.

## Part A: home (`home.html`, `kitchen-life.js`, `nav.js`, `restyle.css`)

1. **Nav, mobile (≤48rem).** Change the bottom bar to a top bar 56px tall with a 2px bottom line. Put the chapter links on the left (number hidden) and the LinkedIn icon on the right (`/img/icon-linkedin.svg`, 24px, as a link to https://www.linkedin.com/in/wei-chen-win-chiu, `target=_blank`). Push the content down by 56px. The desktop index nav keeps "LinkedIn ↗" at the bottom; remove the "繁中 / EN" link there.
2. **Hero.**
   - Keep the current layout, the big "Product / Designer" title and the intro sentence.
   - Bring back the eyebrow line "Hi! I'm Win 🏅, and I'm a" above the title, typed in letter by letter on load: a short typing effect with a blinking caret that stops after typing.
   - Bring back the two hero details from `hero.details`: Stockholm / Sweden and Master's Student (year 2) / Interactive Media Technology, KTH. Show them as two small pairs under the intro, title in ink 500 and subtitle muted.
   - Bring back the **eye animation**: the avatar's eyes follow the cursor and blink now and then, like `utility/eyeAnimation.js`. Reuse that script if the avatar markup can carry the same classes; otherwise write an equivalent.
   - Add a page loader that fades out on load, using the same lottie the real site uses: `https://lottie.host/5d48cdf2-9cfc-4b40-8a88-807eb0ffee03/ejEDoHb0VS.lottie` with `dotlottie-wc@0.8.5` from unpkg. Center it on the background.
3. **Work.**
   - Render the project list from `homeContent.en.projects`. Skip hidden ones, sort by `order`, and keep the existing tabs "Design & Research" and "Programming" working. Use the real `title`, `tag`, `description`, `number` and image.
   - The project number is the mockup's mono number but **as an outline** (hollow, `-webkit-text-stroke` 1.5px `--accent`), larger (about 3.5rem).
   - Links: "View project →" goes to `project.html?p=<slug>`, deriving the slug from `projectUrl`. Programming cards with `siteUrl` also get "View site ↗" (external, new tab), styled as the same mono text link in a muted tone.
   - For projects with `coverType` `component-tray` or `delivery` (design system, KeepWell), show the animated hairline cover. Use the real `<hairline-cover figure="..." lang="en">` web component from `/components/HairlineCover/hairlineCover.js` (`type=module`), with the cover image inside as the fallback, exactly like `components/ProjectCard/projectCard.js`.
4. **About.**
   - Use all 3 real paragraphs.
   - Keep the lede sentence with one highlight.
   - Job rows get a **dotted leader** (2px dotted rgba(248,244,230,.3)) between the title and company, and they must not squeeze: the title flexes, the company sits right-aligned in mono.
5. **Kitchen recipe sheet** (`kitchen-life.js`).
   - Add the parts the real sheet has. Read `utility/kitchenMenu.js` for the logic.
   - The meta row shows the course and time when present.
   - **Ingredients** are a list of name … qty rows with dotted leaders and the qty in mono.
   - **Method** is a numbered step timeline: a circle node with a 2px border and a mono number, joined by a 2px line. Clicking a step marks it and the earlier ones as done, filling them in `--accent`.
   - When a dish has neither ingredients nor steps, show "Recipe coming soon." in mono muted.
   - The photo is revealed with a left-to-right clip wipe on open.
   - Swipe left or right on touch changes the dish.
   - Section heads ("Ingredients", "Method") are mono, sentence case, with a 2px bottom line.
6. **Life.** Use the real `life.description` as the intro, with the same one-highlight treatment. Show `date` next to the location when it is present. Landscape photos (natural width > height) get a wider card (photo 5:4 instead of 4:5).
7. Everything still works at 1440, 1024, 768, 390 and 360 widths with no horizontal scroll, and the console shows no errors.

## Part B: project page (`project.html`, `project.css`, `project.js`; read `restyle.css` but do not edit it)

Build `project.html?p=<slug>` that renders **any** project from `window.__PROJECTS__` in the mockup's style; `project-keepwell.html` is the visual reference. Default to `keepwell` when there is no `p`. Set the page title from the project title.

1. **Accent per project.**
   - designSystem: terracotta (`--c-work` / `--c-work-ink`)
   - keepwell, rfid and ba: slate (`--c-about`)
   - pos: brick (`--c-life`)
   - bizpro: mustard (`--c-kitchen`)
   - childcare and forest: sage, which you add as `#7d8f69` with text color `#6a7758`
   - gongChi: plum, `#8d6a85` with text color `#8a6882`
2. **Header** (as in the reference):
   - The big title, with the part before ":" in `--accent` when there is a colon.
   - The tags in mono.
   - A facts grid (Duration, Role, Responsibility, Company) with 2px lines.
   - A cover: for designSystem and keepwell, the `<hairline-cover>` component (`figure` `component-tray` or `delivery`); for the others, the `coverImage`.
3. **Nav and TOC.** The left index nav, built from the project's `bgTitle` headings.
   - **Desktop (>72rem):** the column is 15rem wide. Top: "← All work", linking to `home.html#work`. The list has a 2rem mono number column; the label is sans 0.9375rem with line-height 1.35. **Labels wrap to at most 2 lines with an ellipsis**, and the full title goes in a `title` attribute. Real titles reach about 50 characters, and a project has up to 10 items. The active item gets `--accent-ink` and a 2px `--accent` progress line. When the list does not fit the height, it scrolls inside the column. Bottom: "Top ↑".
   - **Tablet (48–72rem):** a 4.5rem rail showing "←", the numbers and "↑". On hover or focus-within it expands to 17rem over the content, with the page background and a 2px right line.
   - **Mobile (≤48rem):** a top bar 56px tall with a 2px bottom line. Left: "←". Middle: the current section as "03 Goal breakdown", in one line with an ellipsis. Right: a "Sections" button in mono with a 2px border. Along the bottom edge, a 2px `--accent` bar shows page progress. The button opens a panel listing every section with its number and full label, wrapping freely; tapping one scrolls there and closes the panel, and Esc or a tap outside also closes it.
4. **Blocks.** Render every block type in the data, following `templates/projectBlocks.js` for the fields, styled like the reference.
   - **`bgTitle`:** a section with a 2px top line, a big mono number in `--accent` in the left column, and the heading in sans 500 at about 3rem in the right column (`sec__grid`).
   - **`pureTitle`:** sans 600, 1.375rem.
   - **`mdTitle`:** mono, `--accent-ink`.
   - **`pureText` / `paragraph`:** `--ink-soft`, line-height 1.7. Paragraphs with `items` become bullet lists with mono markers.
   - **Highlights:** `.highlight` spans in the HTML, and the `==text==` markers that `utility/createToc.js` converts, become `--accent-ink` 500.
   - **`quote`:** a 3px `--accent` left line on a background of `--accent` at 8%; this covers the NDA note and "Design focus" boxes.
   - **`bgQuote`:** a dark band (background `--ink`) holding `headingHtml` in cream sans 500 with the callouts. Mark the highlight in `--accent`. This is the reference's dark "Problem" style.
   - **`bigQuote`:** large sans 500 text with the sketch `icon` beside it.
   - **`horizontalIconList` / `verticalIconList`:** items with icon, label, title and text. Labels mono `--accent-ink`; icons sit in a 6rem circle on the soft background. Use 3 columns with 2px dividers, like the reference's goals, and stack them on mobile.
   - **`imgAndContentBlock` / `mediaAside`:** image and text side by side, stacked on mobile.
   - **`singleImage`, `doubleImage`, `captionedMediaGrid`:** square-cornered images, captions in mono muted. Click to zoom: a full-screen overlay with Esc or a click to close.
   - **`orderedList`:** mono numbers in `--accent-ink`.
   - **`callOut`:** a 2px ink border box.
   - **`button`:** a mono text link "Visit site ↗".
   - **`linkParagraph`:** links in `--accent-ink`, underlined.
   - **Unknown types:** render their text without crashing.
5. **Footer.** "Next project →", the next visible design project in home order, in its own accent as in the reference.
6. Check all 9 projects at 1440, 1024, 768, 390 and 360 widths: no horizontal scroll and no console errors.

## Rules for both parts

- Write only inside `prototypes/restyle/`. Never edit `style/`, `utility/`, `templates/`, `content/`, `components/`, `pages/` or the root html files.
- Do not commit and do not switch branches.
- Do not touch `prototypes/restyle/layer/` or `preview/`; they are obsolete.

## Clarification: English-only means no language SWITCH, not no Chinese

The Kitchen menu keeps its Chinese text everywhere the real site has it: the Chinese course names (飯, 麵, 主菜…) beside the English ones, every dish's Chinese name (`nameZh`) above the English name, and the Chinese name in the recipe sheet title. Chinese dish names use DM Sans with Noto Sans TC as the fallback.
