# Spacing

The core scale is `--space-3xs`, `--space-2xs`, `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`, `--space-4xl`, `--space-5xl`, `--space-6xl`, `--space-7xl`, and `--space-8xl`.

Use `xs` through `xl` inside components, `2xl` through `5xl` between component regions, and `6xl` through `8xl` for page sections. Custom tokens preserve existing layouts and should not be added without evidence that the core scale cannot express the design.

## Project page rhythm

A chapter uses three distances, set as `--tight`, `--flow-gap` and `--block` on `.sec` (phone values first, desktop in brackets): tight `md` (`xl`), flow `3xl` (`5xl`), block `80` (`8xl`).

- **Tight**: a title and the text it introduces, or a card title and its text (`xs` inside an entry, `sm` inside a callout).
- **Flow**: one piece of content after another in the same block.
- **Block**: where a new block starts. The first thing under a chapter title (eyebrow, sub-heading, image or text) also starts a new block, so it uses the block distance, not the tight one.

Paragraphs inside one text module are separated by `md` once; do not add a margin on top of the container gap.
