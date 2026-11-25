# Typography

Use `--font-family-body` for UI and prose, `--font-family-display` for editorial headings, `--font-family-serif` for serif text, and `--font-family-mono` for metadata.

Use the 12 semantic sizes: `caption`, `small`, `body`, `body-lg`, `label`, `title-sm`, `title-md`, `title-lg`, `heading`, `display-sm`, `display-md`, and `display-lg`. Choose by content role, not by the closest numeric value.

Use regular, medium, semibold, and bold weight tokens for emphasis. Pair body copy with `--line-height-body` or `--line-height-relaxed`; pair headings with `--line-height-tight` or `--line-height-heading`.

Do not introduce numeric font weights, raw font sizes, or a new font stack in component CSS.

## Project pages: type roles

Big to small. Each role has one size and one weight, so two different roles never look the same:

| Role | Class | Size | Weight |
| --- | --- | --- | --- |
| Chapter title | `.project-module__chapter-title` (`h2`) | `section-title`, 32 to 40 | medium |
| Sub-heading, statement | `.project-module__subheading`, `h3` | `title-sm` 24 (phone: `title-xs` 20) | medium |
| Card and item title | `.project-module__item-title`, `.project-module__callout-title` | `body-lg` 18 | semibold |
| Body copy, lists | `.body`, `.project-module__text`, `.project-module__item-text`, `.project-module__list` | `body` 16, line height `relaxed` | regular |
| Label, caption, tag | eyebrow, `figcaption`, header chips | `small` 14, mono for labels | regular |

The dark statement heading in a problem band is `title-md` 32 (phone: `title-sm` 24). Never give a sub-heading and a card title the same size and weight.
