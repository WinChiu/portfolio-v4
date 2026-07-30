# Hardcoded visual value audit

## Scope

Initial snapshot taken before migration across all 30 CSS and SCSS files, including compiled outputs, SCSS token variables, and `archive/legacy-css`. Counts are occurrences, not unique values. A value can appear in more than one category, such as an RGBA color inside a shadow.

## Totals

| Category | Occurrences |
| --- | ---: |
| Hex, RGB, and RGBA colors | 661 |
| Pixel spacing | 8 |
| Raw font sizes | 313 |
| Raw font weights | 160 |
| Border radii | 56 |
| Z-index values | 107 |
| Box shadows | 54 |
| Transition durations | 394 |
| Total findings | 1,753 |

## Values by category

### Colors

`#363a35`, `#4f4b43`, `#555`, `#615f58`, `#7a776d`, `#868684`, `#b74343`, `#c14804`, `#c8c8c8`, `#cabd8a`, `#d1b129`, `#f5dead`, `#f8f6ed`, `#fbfbf6`, `#ffffff`, `rgb(133.0426395939, 49.6324873096, 2.7573604061)`, `rgb(209, 211, 212)`, `rgb(232, 213, 117)`, `rgb(35, 31, 32)`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.16)`, `rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.23)`, `rgba(0, 0, 0, 0.529)`, `rgba(0, 0, 0, 0.55)`, `rgba(54, 58, 53, 0.08)`, `rgba(122, 119, 109, 0.45)`, `rgba(183, 67, 67, 0.16)`, `rgba(183, 67, 67, 0.18)`, `rgba(183, 67, 67, 0.2)`, `rgba(183, 67, 67, 0.35)`, `rgba(183, 67, 67, 0.5)`, `rgba(209, 177, 41, 0.12)`, `rgba(209, 177, 41, 0.2)`, `rgba(245, 222, 173, 0.28)`, `rgba(251, 251, 246, 0.4)`, `rgba(255, 255, 255, 0.85)`, plus equivalent SCSS color-function forms.

### Pixel spacing

`16px`, `72px`, `104px`. All were normalized to spacing or named size tokens.

### Font sizes

`0.75rem`, `0.8rem`, `0.875rem`, `0.9rem`, `0.95rem`, `1rem`, `1.05rem`, `1.125rem`, `1.2`, `1.25rem`, `1.375rem`, `1.5rem`, `1.75rem`, `1.875rem`, `2rem`, `2.25rem`, `2.5rem`, `2.75rem`, `3rem`, `3.25rem`, `3.5rem`, `4rem`, `4.5rem`, `5rem`, `6rem`.

### Font weights

`300`, `400`, `500`, `600`, `700`, `normal`, `bold`.

### Border radii

`0`, `0.125rem`, `0.25rem`, `0.375rem`, `0.5rem`, `0.75rem`, `6.25rem`, `12.5rem`, `50`.

### Z-index

`-1`, `0`, `1`, `2`, `10`, `30`, `800`, `850`, `900`, `1000`, `9999`.

### Box shadows

`0 0.1875rem 0.375rem rgba(0, 0, 0, 0.16)`, the same shadow paired with `rgba(0, 0, 0, 0.23)`, `0 1.5rem 2rem rgba(0, 0, 0, 0.2)`, `0 1.5rem 3rem rgba(0, 0, 0, 0.2)`, and `0 1.5rem 3.5rem rgba(54, 58, 53, 0.08)`.

### Transition durations

`0s` through `2.65s` in `0.05s` SVG drawing increments, plus `400ms`. Repeated component durations were `0.2s`, `0.25s`, `0.3s`, `0.5s`, `1s`, `1.5s`, and `2.5s`.

## Files with the most findings

| File | Findings |
| --- | ---: |
| `src/css/style.css` | 347 |
| `style/style.css` | 347 |
| `archive/legacy-css/src/css/style.css` | 326 |
| `style/workStyle.css` | 162 |
| `src/css/workStyle.css` | 147 |
| `archive/legacy-css/src/css/workStyle.css` | 119 |
| `style/style.scss` | 115 |
| `style/work/base/_typography.scss` | 23 |
| `archive/legacy-css/src/css/projectCard.css` | 22 |
| `style/work/layout/_project-page.scss` | 21 |

## Result

The migration moved all findings to the exempt definition file `style/tokens.css`. `node scripts/token-audit.js` now scans the same 30 source, compiled, and archived files and reports zero violations.
