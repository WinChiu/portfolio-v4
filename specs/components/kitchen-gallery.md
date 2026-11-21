# Kitchen Menu

## 1. Metadata

- Name: Kitchen Menu
- Category: Content display
- Status: Stable

## 2. Overview

Use for the bilingual kitchen restaurant menu in normal page flow.

Do not use as a looping carousel or hijack page scrolling.

## 3. Anatomy

- Title and description
- Two menu columns grouped by course; one column at tablet
- Numbered dish buttons with bilingual names, dotted leaders and three effort flames
- One modal recipe sheet: navigation, framed photo, names, handwritten note and metadata
- Optional ingredients and numbered interactive method rail; coming-soon line when absent

## 4. Tokens used

- `--color-text`
- `--color-text-muted`
- `--color-background`
- `--color-border`
- `--color-border-muted`
- `--color-interactive`
- `--color-overlay`
- `--space-*`
- `--font-size-*`
- `--font-family-mono`
- `--motion-duration-*`
- `--motion-ease-*`
- `--z-modal`

## 5. Props/API

CSS block `.kitchenMenu` in `.section--kitchenMenu#kitchen`; rendered by `renderKitchenMenuSection`, initialized by `utility/kitchenMenu.js`. Each of 49 items has one course; optional time, ingredients [{ name, qty }] and steps [string] are never synthesized. Localized courses and labels live in each kitchen content object.

## 6. States

- Default: six ordered courses with no counts, filters or footer
- Hover/focus: interactive Chinese dish name and border-colored dotted leader
- Open: right sheet slides, scrim fades and photo wipes left to right
- Modal: focus trapped, page inert and scroll locked, Lenis stopped; native sheet scroll
- Navigation: Prev/Next and arrow keys wrap through original item order and replay photo wipe
- Close: Escape, scrim or close button restores focus, scroll styles and prior Lenis state
- Method: keyboard-accessible numbered buttons fill the rail through the selected node
- Reduced motion: sheet and photo show without slide or wipe

## 7. Code example

```html
<section class="section section--kitchenMenu" id="kitchen"><button class="kitchenMenu__dish" aria-haspopup="dialog" aria-controls="kitchen-recipe">Dish</button></section>
```

## 8. Cross-references

- [Rating](./rating.md)
