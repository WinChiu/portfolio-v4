// index.html and home-zh.html were two hand-maintained, nearly-identical
// files (same markup/scripts, differing only in `lang` and the og:description
// meta) -- every edit to one had to be manually re-applied to the other, and
// zh is currently unlinked from the UI (see the `* { }` reset comment in
// style/home/_globals.scss: language switching is temporarily disabled
// site-wide) without actually removing it, since it's coming back later.
// This template is the single source for both; run `npm run build:home` (or
// `npm run build:all`) after editing it to regenerate index.html/home-zh.html.
//
// The page content itself was already fully data-driven (content/homeContent.js
// + utility/renderHomePage.js, which reads document.documentElement.lang at
// runtime) -- this template only covers the static HTML shell around that.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT_DIR = path.join(__dirname, '..');

// Cache-busting query for a local asset, derived from the file's own content
// -- every edit gets a fresh URL automatically, so there's no hand-maintained
// `?v=N` to remember to bump. A stale `?v=` (or a missing one, like
// smoothScroll.js used to have) silently serves an old cached copy of the
// script/stylesheet with no error, which is exactly the kind of bug that's
// invisible until someone's browser is caught running mismatched files.
function withVersion(relativePath) {
  const absolutePath = path.join(ROOT_DIR, relativePath.replace(/^\.\//, ''));
  const contents = fs.readFileSync(absolutePath);
  const hash = crypto.createHash('sha1').update(contents).digest('hex').slice(0, 8);
  return `${relativePath}?v=${hash}`;
}

const HOME_META = {
  en: {
    htmlLang: 'en',
    ogDescription:
      "Hi! I'm Win, a product designer with 2+ years of experience across e-commerce and B2B healthcare, specializing in complex workflow design and design systems. Currently pursuing a Master's in Interactive Media Technology at KTH, expanding into information visualization and accessibility.",
  },
  zh: {
    htmlLang: 'zh',
    ogDescription:
      'Hi！我是 Win，一位經濟系與創意創業學程背景、擁有基礎前端技能和 2+ 年產業經驗的產品設計師，曾在政府部門、電商、B2B 醫療產業協助打造數位產品，目前正於瑞典皇家理工學院（KTH）攻讀 Interactive Media Technology 碩士學位',
  },
};

function renderHomePage(lang) {
  const meta = HOME_META[lang];
  if (!meta) {
    throw new Error(`Unknown home page language: ${lang}`);
  }

  return `<!doctype html>
<html lang="${meta.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:url" content="https://winchiuwc.com" />
    <meta property="og:image" content="https://i.imgur.com/boUdes1.jpg" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Win Chiu's Portfolio" />
    <meta
      property="og:description"
      content="${meta.ogDescription}"
    />
    <title>Win's Portfolio</title>
    <link rel="icon" href="./img/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="${withVersion('style/style.css')}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&family=DM+Serif+Text:ital@0;1&family=Courier+Prime:wght@400;700&family=Caveat:wght@500;600&display=swap"
      rel="stylesheet"
    />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./utility/gsap.min.js"></script>
    <script src="./utility/ScrollTrigger.min.js"></script>
    <script src="./utility/Flip.min.js"></script>
    <script src="./utility/SplitText.min.js"></script>
    <script src="./utility/lenis.min.js"></script>
    <script src="${withVersion('./utility/smoothScroll.js')}"></script>
    <script type="module" src="${withVersion('./components/components.js')}"></script>
    <script
      src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js"
      type="module"
    ></script>
  </head>
  <body>
    <!-- Loading Mask -->
    <div class="ui-loader loading-mask">
      <dotlottie-wc
        src="https://lottie.host/5d48cdf2-9cfc-4b40-8a88-807eb0ffee03/ejEDoHb0VS.lottie"
        autoplay
        loop
      ></dotlottie-wc>
    </div>
    <div id="home-page-root"></div>
    <script src="${withVersion('content/homeContent.js')}"></script>
    <script src="${withVersion('utility/renderHomePage.js')}"></script>
    <script src="${withVersion('utility/kitchenFanAnimation.js')}"></script>
    <script src="${withVersion('utility/lifeStackAnimation.js')}"></script>
    <script src="${withVersion('utility/landingPageAnimation.js')}"></script>
    <script src="${withVersion('utility/eyeAnimation.js')}"></script>
    <script src="${withVersion('utility/loadingPage.js')}"></script>
  </body>
</html>
`;
}

module.exports = { renderHomePage, HOME_META };
