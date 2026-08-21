# Kitchen rolodex — 接進 portfolio-v4

三個檔案，照順序改。字體、token、BEM 命名都沿用你原本的，沒有新增顏色或字型。

## 1. `style/style.scss`

在 `.section--kitchen { … }` 裡，把這幾段整段換成 `handoff/kitchen-rolodex.scss` 的內容：

- `.kitchen__panel`
- `.kitchen__header`、`.kitchen__headerItem/Note/Effort/Hint`
- `.kitchen__list`、`.kitchen__row`、`.kitchen__row--hidden`
- `.kitchen__item`（含 hover / focus-visible / --active）
- `.kitchen__topRow`
- `.kitchen__controls`、`.kitchen__control*`、`.kitchen__controlIcon`

保留不動：`.kitchen__bg`、`.kitchen__intro`、`.kitchen__title`、`.kitchen__description`、`.kitchen__lightbox*`、`.kitchen__nameZh`、`.kitchen__nameEn`、`.kitchen__note`、`.kitchen__effort`、`.kitchen__star`、`.kitchen__photo--focus-*`。
`.kitchen__preview` / `.kitchen__photoStack` 已無人使用，可留可刪。

三個 media query（75rem / 62.5rem / 30rem）裡原本針對 `__header` / `__item` / `__topRow` / `__list` / `__controls` 的覆寫可以刪掉，新的斷點規則已包在同一份檔案末段。

然後重新編譯 scss（`npm run` 你原本的那支）。

## 2. `utility/renderHomePage.js`

用 `handoff/renderHomePage-kitchen.js` 取代 `renderKitchenItems()` 和 `renderKitchenSection()`；新增 `renderKitchenData()`。`renderKitchenStars()`、`escapeAttribute()`、`resolveAssetPath()` 都照用。

## 3. `utility/kitchenSection.js`

整檔用 `handoff/kitchenSection.js` 取代。上下各露 2 張卡緣（改 `EDGE_COUNT`），↑↓ 翻卡，點卡緣跳，點卡片照片開原本的 lightbox。

## 4. `content/homeContent.js`（選用）

`kitchen` 物件可以拿掉 `pageSize` 和 `mobileHint`，加一行提示文案：

```js
rolodexHint: '↑ ↓ 翻卡，點上下露出的卡緣可以直接跳。',
```

英文版同樣位置放英文句子。`items` 完全不用改。

## 影響到的其他檔案

- `utility/loadingPage.js`：仍靠 `[data-kitchen-image-src]` 預載，隱藏的 `.kitchen__data` 保留了這些屬性，不用改。
- `utility/landingPageAnimation.js`：`setupKitchenReveal()` 抓 `.kitchen__intro` 和 `.kitchen__panel`，兩者都還在，不用改。
- `specs/components/kitchen-gallery.md`：Anatomy／States 需要更新（Preview stack → Rolodex card + edges；移除 prev/next disabled 狀態）。
