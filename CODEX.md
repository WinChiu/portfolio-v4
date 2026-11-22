# Project instructions

Before writing or modifying any UI code, read the relevant spec file in specs/. Use only tokens from tokens.css, and only the system (`--sys-*`) and component (`--comp-*`) tiers; never a reference token (`--ref-*`) or a raw value. See style/README.md. Build repeated UI as a component in components/ (see components/README.md) instead of repeating markup and styles. Run the token audit script before committing. Zero errors required.

Use `npm run audit:tokens` for the required audit. If `style/tokens.css` or component coverage changes, run `npm run specs:generate` and commit the regenerated specs.
