// Builds the token preview page (specs/tokens/index.html) from style/tokens.css.
// Run: node scripts/generate-token-preview.js   (also part of `npm run specs:generate`)
// The page links the real tokens.css, so every swatch, bar and sample is drawn with the live variable.
// Layout follows the three tiers: reference (raw values) -> system (roles) -> component.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'style', 'tokens.css');
const outputPath = path.join(root, 'specs', 'tokens', 'index.html');

// ---- parse tokens.css: order, nearest group comment, trailing note
const tokens = [];
let group = '';
for (const raw of fs.readFileSync(sourcePath, 'utf8').replace(/\r/g, '').split('\n')) {
  const line = raw.trim();
  const comment = line.match(/^\/\*\s*(.+?)\s*\*\/$/);
  if (comment) { group = comment[1]; continue; }
  const declaration = line.match(/^(--[\w-]+):\s*(.+?);\s*(?:\/\*\s*(.*?)\s*\*\/)?$/);
  if (declaration) tokens.push({ name: declaration[1], value: declaration[2], note: declaration[3] || '', group });
}
const tierOf = (name) => (name.startsWith('--ref-') ? 'ref' : name.startsWith('--sys-') ? 'sys' : 'comp');
tokens.forEach((token) => { token.tier = tierOf(token.name); });
const byName = new Map(tokens.map((token) => [token.name, token]));
const refs = tokens.filter((t) => t.tier === 'ref');
const sys = tokens.filter((t) => t.tier === 'sys');
const comps = tokens.filter((t) => t.tier === 'comp');

// ---- relationships
const varsIn = (value) => [...value.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]);
const usedBy = new Map();
tokens.forEach((token) => varsIn(token.value).forEach((name) => { if (!usedBy.has(name)) usedBy.set(name, []); usedBy.get(name).push(token.name); }));
const pointsAt = (token) => varsIn(token.value).filter((name) => byName.has(name));
// a token "writes its own value" when it points at nothing (a raw value); mixed values such as clamp(var(), 4vw, var()) count as pointing
const writesOwnValue = (token) => pointsAt(token).length === 0;

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const used = new Set();
const take = (list) => { list.forEach((token) => used.add(token.name)); return list; };
const startsWith = (prefix, list) => list.filter((token) => token.name.startsWith(prefix));
const label = (token) => token.group.replace(/^(Reference|System|Component):\s*/, '').replace(/^Color:\s*/, '').replace(/^./, (c) => c.toUpperCase());

// ---- one token row
// follow a plain alias (var(--x)) down to the value that is finally written, so a role shows the real value next to what it points at
function resolved(token, depth = 0) {
  const alias = depth < 8 && token.value.match(/^var\((--[\w-]+)\)$/);
  return alias && byName.has(alias[1]) ? resolved(byName.get(alias[1]), depth + 1) : token.value;
}

function row(token, demo, extra = '') {
  const targets = pointsAt(token);
  const alias = targets.length
    ? `<span class="tk__alias">${targets.map((name) => `<span class="arrow">→</span><code>${esc(name)}</code>`).join(' ')}</span>`
    : '';
  const users = token.tier === 'ref' && usedBy.has(token.name)
    ? `<span class="tk__uses" title="${esc(usedBy.get(token.name).join(', '))}">used by ${usedBy.get(token.name).length}</span>`
    : token.tier === 'ref' ? '<span class="tk__uses tk__uses--none">not used</span>' : '';
  return `<div class="tk ${extra}">
    <div class="tk__demo">${demo}</div>
    <code class="tk__name">${esc(token.name)}</code>
    ${alias}
    <span class="tk__value">${esc(resolved(token))}</span>
    ${users}${token.note ? `<span class="tk__note">${esc(token.note)}</span>` : ''}
  </div>`;
}
const wide = (token, demo) => row(token, demo, 'tk--wide');
const grid = (items, cls = '') => `<div class="grid ${cls}">${items.join('')}</div>`;
const list = (items) => `<div class="list">${items.join('')}</div>`;
const swatch = (token) => `<span class="swatch" style="background:var(${token.name})"></span>`;

// ---------------------------------------------------------------- reference
function referencePalette() {
  const palette = take(startsWith('--ref-palette-', refs));
  const hues = new Map();
  palette.forEach((token) => { const hue = token.name.split('-')[4]; if (!hues.has(hue)) hues.set(hue, []); hues.get(hue).push(token); });
  return [...hues].map(([hue, items]) => `<h3>${esc(hue)}</h3>${grid(items.map((token) => row(token, swatch(token))), 'grid--swatch')}`).join('');
}
function referenceType() {
  const faces = take(startsWith('--ref-typeface-', refs)).map((token) => wide(token, `<span class="sample" style="font-family:var(${token.name});font-size:var(--sys-font-size-title-sm)">The quick brown fox · 設計系統</span>`));
  const weights = take(startsWith('--ref-font-weight-', refs)).map((token) => row(token, `<span class="sample" style="font-weight:var(${token.name});font-size:var(--sys-font-size-title-sm)">Aa 設計</span>`));
  const heights = take(startsWith('--ref-line-height-', refs)).map((token) => wide(token, `<span class="sample" style="line-height:var(${token.name});font-size:var(--sys-font-size-small);display:block;max-width:18rem">Components consume tokens only, so the system can change in one place.</span>`));
  const tracking = take(startsWith('--ref-letter-spacing-', refs)).map((token) => wide(token, `<span class="sample" style="letter-spacing:var(${token.name});font-size:var(--sys-font-size-title-md)">Design system</span>`));
  return `<h3>Typefaces</h3>${list(faces)}<h3>Font weights</h3>${grid(weights)}<h3>Line heights</h3>${list(heights)}<h3>Letter spacing</h3>${list(tracking)}`;
}
function referenceSizes() {
  const sizes = take(startsWith('--ref-size-', refs)).map((token) => wide(token, `<span class="bar" style="width:min(var(${token.name}), 100%);${token.value.startsWith('-') ? 'opacity:.4' : ''}"></span>`));
  return list(sizes);
}

// ---------------------------------------------------------------- system
function systemColors() {
  const groups = new Map();
  take(startsWith('--sys-color-', sys)).forEach((token) => { const k = label(token); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(token); });
  return [...groups].map(([name, items]) => `<h3>${esc(name)}</h3>${grid(items.map((token) => row(token, swatch(token))), 'grid--swatch')}`).join('');
}
function systemType() {
  const families = take(startsWith('--sys-font-family-', sys)).map((token) => wide(token, `<span class="sample" style="font-family:var(${token.name});font-size:var(--sys-font-size-title-sm)">The quick brown fox · 設計系統</span>`));
  const sizes = take(startsWith('--sys-font-size-', sys)).map((token) => wide(token, `<span class="sample" style="font-size:var(${token.name});line-height:1.1;white-space:nowrap;overflow:hidden;display:block;text-overflow:clip">Aa Design system</span>`));
  const weights = take(startsWith('--sys-font-weight-', sys)).map((token) => row(token, `<span class="sample" style="font-weight:var(${token.name});font-size:var(--sys-font-size-title-sm)">Aa 設計</span>`));
  const heights = take(startsWith('--sys-line-height-', sys)).map((token) => wide(token, `<span class="sample" style="line-height:var(${token.name});font-size:var(--sys-font-size-small);display:block;max-width:18rem">Components consume tokens only, so the system can change in one place.</span>`));
  const tracking = take(startsWith('--sys-letter-spacing-', sys)).map((token) => wide(token, `<span class="sample" style="letter-spacing:var(${token.name});font-size:var(--sys-font-size-title-md)">Design system</span>`));
  return `<h3>Families</h3>${list(families)}<h3>Sizes</h3>${list(sizes)}<h3>Weights</h3>${grid(weights)}<h3>Line heights</h3>${list(heights)}<h3>Letter spacing</h3>${list(tracking)}`;
}
function systemSpace() {
  const items = take(startsWith('--sys-space-', sys));
  const bars = items.filter((token) => token.value !== 'auto').map((token) => wide(token, `<span class="bar" style="width:min(var(${token.name}), 100%)"></span>`));
  const keyword = items.filter((token) => token.value === 'auto').map((token) => wide(token, ''));
  return list([...bars, ...keyword]);
}
const systemShape = () => grid(take(startsWith('--sys-radius-', sys)).map((token) => row(token, `<span class="box" style="border-radius:var(${token.name})"></span>`)));
const systemElevation = () => grid(take(startsWith('--sys-shadow-', sys)).map((token) => row(token, `<span class="box box--card" style="box-shadow:var(${token.name})"></span>`)), 'grid--roomy');
function systemLayers() {
  const items = take(startsWith('--sys-z-', sys)).slice().sort((a, b) => Number(a.value) - Number(b.value));
  return list(items.map((token) => wide(token, `<span class="z">${esc(token.value)}</span>`)));
}
function systemMotion() {
  const durations = take(startsWith('--sys-motion-duration-', sys)).map((token) => wide(token, `<span class="track"><span class="run" style="animation-duration:min(var(${token.name}), 4s)"></span></span>`));
  const eases = take(startsWith('--sys-motion-ease-', sys)).map((token) => wide(token, `<span class="track"><span class="dot" style="animation-timing-function:var(${token.name})"></span></span>`));
  const transitions = take(startsWith('--sys-transition-', sys)).map((token) => wide(token, ''));
  return `<h3>Durations</h3>${list(durations)}<h3>Easing</h3>${list(eases)}<h3>Composed transitions</h3>${list(transitions)}`;
}
function systemRest() {
  const rest = sys.filter((token) => !used.has(token.name));
  rest.forEach((token) => used.add(token.name));
  const groups = new Map();
  rest.forEach((token) => { const k = label(token); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(token); });
  return [...groups].map(([name, items]) => `<h3>${esc(name)}</h3>${list(items.map((token) => wide(token, '')))}`).join('');
}

// ---------------------------------------------------------------- component
function componentTokens() {
  const groups = new Map();
  comps.forEach((token) => { const k = label(token); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(token); });
  return [...groups].map(([name, items]) => `<h3>${esc(name)}</h3>${list(items.map((token) => wide(token, '')))}`).join('');
}

// ---------------------------------------------------------------- overview and checks
function overview() {
  // the rule the tiers exist for: one value, one name, in the reference layer
  const byValue = new Map();
  refs.forEach((token) => { const k = token.value.toLowerCase(); if (!byValue.has(k)) byValue.set(k, []); byValue.get(k).push(token.name); });
  const duplicates = [...byValue].filter(([, names]) => names.length > 1);
  const rawSys = sys.filter(writesOwnValue);
  const rawComp = comps.filter(writesOwnValue);
  const unused = refs.filter((token) => !usedBy.has(token.name));
  const status = (ok) => `<span class="status ${ok ? 'status--ok' : 'status--warn'}">${ok ? 'ok' : 'check'}</span>`;
  const names = (items) => items.map((token) => `<code>${esc(token.name)}</code>`).join(' ');
  return `<div class="tiers">
      <article><h3>Reference <small>${refs.length}</small></h3><p>Every approved raw value, named for what it is: a palette tone, a typeface, a length. One value has one name. Components never use these.</p></article>
      <article><h3>System <small>${sys.length}</small></h3><p>The decisions and roles that give the design its character. Each points at a reference token wherever the value exists there. Components consume these.</p></article>
      <article><h3>Component <small>${comps.length}</small></h3><p>Measures and properties that belong to one element or section. They point at system or reference tokens; a one-off length may be written here.</p></article>
    </div>
    <h3>Checks</h3>
    <div class="table"><table><tbody>
      <tr><td>${status(duplicates.length === 0)}</td><td>Reference values that carry two names</td><td>${duplicates.length ? duplicates.map(([v, n]) => `<code>${esc(v)}</code>: ${n.map((x) => `<code>${esc(x)}</code>`).join(' ')}`).join('<br>') : 'none'}</td></tr>
      <tr><td>${status(unused.length === 0)}</td><td>Reference tokens nothing points at</td><td>${unused.length ? names(unused) : 'none'}</td></tr>
      <tr><td><span class="status status--note">info</span></td><td>System tokens that write their own value (no reference to point at)</td><td><details><summary>${rawSys.length} of ${sys.length}: shadows, z-index, motion, opacity, keywords and fluid sizes</summary>${names(rawSys)}</details></td></tr>
      <tr><td><span class="status status--note">info</span></td><td>Component tokens that write their own value (one-off measures)</td><td><details><summary>${rawComp.length} of ${comps.length}</summary>${names(rawComp)}</details></td></tr>
    </tbody></table></div>`;
}

// ---------------------------------------------------------------- assemble
const sections = [
  { id: 'overview', title: 'Overview', tier: '', body: overview() },
  { id: 'ref-palette', title: 'Palette', tier: 'Reference', body: referencePalette() },
  { id: 'ref-type', title: 'Type', tier: 'Reference', body: referenceType() },
  { id: 'ref-size', title: 'Sizes', tier: 'Reference', body: referenceSizes() },
  { id: 'sys-color', title: 'Color roles', tier: 'System', body: systemColors() },
  { id: 'sys-type', title: 'Typography', tier: 'System', body: systemType() },
  { id: 'sys-space', title: 'Spacing', tier: 'System', body: systemSpace() },
  { id: 'sys-shape', title: 'Shape', tier: 'System', body: systemShape() },
  { id: 'sys-elevation', title: 'Elevation', tier: 'System', body: systemElevation() },
  { id: 'sys-layers', title: 'Layers', tier: 'System', body: systemLayers() },
  { id: 'sys-motion', title: 'Motion', tier: 'System', body: systemMotion() },
];
const rest = systemRest();
if (rest) sections.push({ id: 'sys-other', title: 'Other', tier: 'System', body: rest });
sections.push({ id: 'comp', title: 'Component tokens', tier: 'Component', body: componentTokens() });

const nav = [];
let lastTier = null;
sections.forEach((section) => {
  if (section.tier !== lastTier) { if (section.tier) nav.push(`<span class="nav__tier">${section.tier}</span>`); lastTier = section.tier; }
  nav.push(`<a href="#${section.id}">${section.title}</a>`);
});

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Design tokens</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000&family=DM+Serif+Display&family=Caveat:wght@400&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../../style/tokens.css" />
<style>
  /* Page chrome only; it uses system tokens. Everything inside a demo is drawn with the live token. */
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--sys-color-background); color: var(--sys-color-text); font-family: var(--sys-font-family-body); font-size: var(--sys-font-size-small); line-height: var(--sys-line-height-body); }
  code { font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-caption); }
  .shell { display: grid; grid-template-columns: 13rem minmax(0, 1fr); gap: var(--sys-space-5xl); max-width: 84rem; margin: 0 auto; padding: var(--sys-space-5xl) var(--sys-space-3xl) var(--sys-space-8xl); }
  nav { position: sticky; top: var(--sys-space-5xl); align-self: start; display: flex; flex-direction: column; gap: var(--sys-space-xs); font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-caption); max-height: calc(100vh - 6rem); overflow: auto; }
  nav a { color: var(--sys-color-text-muted); text-decoration: none; padding: var(--sys-space-3xs) 0; }
  nav a:hover { color: var(--sys-color-text); }
  .nav__tier { margin-top: var(--sys-space-lg); padding-top: var(--sys-space-xs); border-top: var(--sys-space-hairline) solid var(--sys-color-text); color: var(--sys-color-text); }
  h1 { font-size: var(--sys-font-size-display-sm); font-weight: var(--sys-font-weight-medium); line-height: var(--sys-line-height-tight); margin: 0 0 var(--sys-space-md); }
  .meta { color: var(--sys-color-text-muted); margin: 0 0 var(--sys-space-7xl); max-width: 46rem; }
  section { padding-top: var(--sys-space-5xl); border-top: var(--sys-space-hairline) solid var(--sys-color-text); margin-bottom: var(--sys-space-7xl); }
  .eyebrow { display: block; font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-caption); color: var(--sys-color-text-muted); margin-bottom: var(--sys-space-xs); }
  h2 { font-size: var(--sys-font-size-title-md); font-weight: var(--sys-font-weight-medium); margin: 0 0 var(--sys-space-3xl); }
  h3 { font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-small); font-weight: var(--sys-font-weight-regular); color: var(--sys-color-text-muted); margin: var(--sys-space-5xl) 0 var(--sys-space-lg); }
  h3 small { font-size: var(--sys-font-size-caption); margin-left: var(--sys-space-xs); }
  .tiers { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--sys-space-3xl); }
  .tiers h3 { margin-top: 0; color: var(--sys-color-text); }
  .tiers p { margin: 0; color: var(--sys-color-text-muted); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); gap: var(--sys-space-xl) var(--sys-space-lg); }
  .grid--swatch { grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); }
  .grid--roomy { grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: var(--sys-space-4xl) var(--sys-space-3xl); }
  .list { display: flex; flex-direction: column; }
  .tk { display: flex; flex-direction: column; gap: var(--sys-space-2xs); min-width: 0; }
  .tk--wide { display: grid; grid-template-columns: minmax(0, 1fr) 17rem 12rem; align-items: center; gap: var(--sys-space-xs) var(--sys-space-lg); padding: var(--sys-space-sm) var(--sys-space-0); border-bottom: var(--sys-space-hairline) solid color-mix(in srgb, var(--sys-color-text) 10%, transparent); }
  .tk--wide .tk__demo { grid-column: 1; grid-row: 1 / span 2; min-width: 0; }
  .tk--wide .tk__name { grid-column: 2; grid-row: 1; }
  .tk--wide .tk__value { grid-column: 3; grid-row: 1; }
  .tk--wide .tk__alias { grid-column: 2 / span 2; grid-row: 2; }
  .tk--wide .tk__uses, .tk--wide .tk__note { grid-column: 2 / span 2; }
  .tk__value { color: var(--sys-color-text-muted); font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-caption); overflow-wrap: anywhere; }
  .tk__alias { font-size: var(--sys-font-size-caption); color: var(--sys-color-text-muted); }
  .tk__alias code { color: var(--sys-color-text); }
  .arrow { color: var(--sys-color-text-muted); margin-right: var(--sys-space-3xs); }
  .tk__uses { font-size: var(--sys-font-size-caption); color: var(--sys-color-text-muted); cursor: default; }
  .tk__uses--none { color: var(--sys-color-interactive); }
  .tk__note { color: var(--sys-color-text-muted); font-size: var(--sys-font-size-caption); line-height: var(--sys-line-height-body); }
  .swatch { display: block; height: 4rem; border: var(--sys-space-hairline) solid color-mix(in srgb, var(--sys-color-text) 14%, transparent); }
  .bar { display: block; height: var(--sys-space-sm); background: var(--sys-color-text); max-width: 100%; }
  .box { display: block; width: 4rem; height: 4rem; background: var(--sys-color-text); }
  .box--card { width: 100%; height: 4.5rem; background: var(--sys-color-background); border: var(--sys-space-hairline) solid color-mix(in srgb, var(--sys-color-text) 8%, transparent); }
  .z { font-family: var(--sys-font-family-mono); }
  .track { display: block; position: relative; height: var(--sys-space-md); background: color-mix(in srgb, var(--sys-color-text) 8%, transparent); }
  .run { position: absolute; inset: 0 auto 0 0; background: var(--sys-color-text); animation: run 1.6s var(--sys-motion-ease-standard) infinite alternate; }
  .dot { position: absolute; top: 0; width: var(--sys-space-md); height: var(--sys-space-md); background: var(--sys-color-text); animation: slide 1.6s linear infinite alternate; }
  @keyframes run { from { width: 0; } to { width: 100%; } }
  @keyframes slide { from { left: 0; } to { left: calc(100% - var(--sys-space-md)); } }
  .table { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; font-size: var(--sys-font-size-caption); }
  td { padding: var(--sys-space-sm) var(--sys-space-md) var(--sys-space-sm) var(--sys-space-0); border-top: var(--sys-space-hairline) solid color-mix(in srgb, var(--sys-color-text) 10%, transparent); vertical-align: top; }
  td:first-child { width: 4.5rem; }
  details summary { cursor: pointer; color: var(--sys-color-text-muted); }
  details code { display: inline-block; margin: var(--sys-space-3xs) var(--sys-space-xs) var(--sys-space-3xs) var(--sys-space-0); }
  .status { display: inline-block; padding: var(--sys-space-3xs) var(--sys-space-xs); border: var(--sys-space-hairline) solid currentColor; font-family: var(--sys-font-family-mono); font-size: var(--sys-font-size-caption); }
  .status--ok { color: var(--ref-palette-green-55); }
  .status--warn { color: var(--sys-color-interactive); }
  .status--note { color: var(--sys-color-text-muted); }
  @media (max-width: 52rem) {
    .shell { grid-template-columns: 1fr; gap: var(--sys-space-3xl); padding: var(--sys-space-3xl) var(--sys-space-lg) var(--sys-space-7xl); }
    nav { position: static; flex-direction: row; flex-wrap: wrap; gap: var(--sys-space-xs) var(--sys-space-lg); max-height: none; }
    .nav__tier { margin-top: 0; border-top: 0; padding-top: 0; }
    .tk--wide { grid-template-columns: 1fr; }
    .tk--wide .tk__demo, .tk--wide .tk__name, .tk--wide .tk__value, .tk--wide .tk__alias, .tk--wide .tk__uses, .tk--wide .tk__note { grid-column: 1; grid-row: auto; }
  }
  @media (prefers-reduced-motion: reduce) { .run, .dot { animation: none; } }
</style>
</head>
<body>
<div class="shell">
  <nav aria-label="Token groups">${nav.join('')}</nav>
  <main>
    <h1>Design tokens</h1>
    <p class="meta">${tokens.length} tokens from <code>style/tokens.css</code>, in three tiers: reference, system, component. Generated by <code>scripts/generate-token-preview.js</code>; edit the tokens, then run <code>npm run specs:generate</code>.</p>
    ${sections.map((section) => `<section id="${section.id}">${section.tier ? `<span class="eyebrow">${section.tier}</span>` : ''}<h2>${section.title}</h2>${section.body}</section>`).join('\n    ')}
  </main>
</div>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html);
console.log(`Wrote ${tokens.length} tokens (${refs.length} reference, ${sys.length} system, ${comps.length} component) to ${path.relative(root, outputPath)}.`);
