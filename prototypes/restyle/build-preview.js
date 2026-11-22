// Builds restyle previews from the REAL generated pages, so every real
// element, block type and language is covered without touching production.
//
//   node prototypes/restyle/build-preview.js
//
// Output: prototypes/restyle/preview/{index.html, home-zh.html, pages/{en,zh}/*.html}
// Each copy gets a <base> so its original relative paths still resolve, plus
// the restyle layer: tokens.css + home.css or work.css + preview.js.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const out = path.join(__dirname, 'preview');
const layer = '/prototypes/restyle/layer';

const fonts =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Noto+Sans+TC:wght@400;500;600&display=swap" />';

function inject(html, base, kind) {
  const head = `<head>\n    <base href="${base}" />`;
  const css = `    ${fonts}\n    <link rel="stylesheet" href="${layer}/tokens.css" />\n    <link rel="stylesheet" href="${layer}/${kind}.css" />\n  </head>`;
  const js = `    <script src="${layer}/preview.js"></script>\n    <script src="${layer}/${kind}.js"></script>\n  </body>`;
  return html.replace(/<head>/i, head).replace(/<\/head>/i, css).replace(/<\/body>/i, js)
    .replace(/<body([^>]*)>/i, `<body$1 data-restyle="${kind}">`);
}

function write(rel, html) {
  const file = path.join(out, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

fs.rmSync(out, { recursive: true, force: true });

for (const name of ['index.html', 'home-zh.html']) {
  write(name, inject(fs.readFileSync(path.join(root, name), 'utf8'), '/', 'home'));
}

for (const lang of ['en', 'zh']) {
  const dir = path.join(root, 'pages', lang);
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    write(path.join('pages', lang, name),
      inject(fs.readFileSync(path.join(dir, name), 'utf8'), `/pages/${lang}/`, 'work'));
  }
}

console.log('Preview built in', path.relative(root, out));
