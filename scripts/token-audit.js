#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const includeArchive = !process.argv.includes('--active');
const json = process.argv.includes('--json');
// Standalone design explorations deliberately use values outside the site tokens.
const ignoredDirectories = new Set(['.git', 'node_modules', 'specs', 'prototypes']);
const ignoredFiles = new Set([
  path.join('style', 'tokens.css'),
]);

const tokenSuggestions = new Map([
  ['#363a35', '--color-text'], ['#7a776d', '--color-text-muted'],
  ['#868684', '--color-text-subtle'], ['#c14804', '--color-link'],
  ['#c8c8c8', '--color-text-disabled'], ['#d1b129', '--color-accent'],
  ['#f37021', '--color-accent-bright'], ['#f8f6ed', '--color-background-soft'],
  ['#b74343', '--color-interactive'], ['#4f4b43', '--color-surface-inverse'],
  ['#f5dead', '--color-highlight'], ['#ffffff', '--color-text-inverse'],
  ['#cabd8a', '--color-interactive-hover'], ['#fbfbf6', '--color-background'],
  ['#555', '--color-text-strong'], ['400ms', '--motion-duration-slow'],
  ['0.2s', '--motion-duration-fast'],
  ['0.3s', '--motion-duration-standard'], ['0.4s', '--motion-duration-slow'],
  ['1s', '--motion-duration-loading'], ['1.5s', '--motion-duration-entrance'],
]);

const categorySuggestions = {
  'pixel spacing': new Map([['16px', '--space-md']]),
  spacing: new Map([
    ['0', '--space-0'], ['0rem', '--space-0'], ['0.125rem', '--space-hairline'],
    ['0.25rem', '--space-3xs'], ['0.375rem', '--space-2xs'], ['0.5rem', '--space-xs'],
    ['0.75rem', '--space-sm'], ['0.875rem', '--space-14'], ['1rem', '--space-md'],
    ['1.25rem', '--space-lg'], ['1.5rem', '--space-xl'], ['1.75rem', '--space-2xl'],
    ['2rem', '--space-3xl'], ['2.25rem', '--space-36'], ['2.5rem', '--space-4xl'],
    ['3rem', '--space-5xl'], ['3.5rem', '--space-56'], ['4rem', '--space-6xl'],
    ['4.5rem', '--space-72'], ['4.75rem', '--space-76'], ['5rem', '--space-80'],
    ['5.5rem', '--space-88'], ['6rem', '--space-7xl'], ['7.5rem', '--space-120'],
    ['8rem', '--space-8xl'], ['10rem', '--space-160'], ['16rem', '--space-256'],
    ['auto', '--space-auto'],
  ]),
  'font sizes': new Map([
    ['0.75rem', '--font-size-caption'], ['0.8rem', '--font-size-small'], ['0.875rem', '--font-size-small'],
    ['0.9rem', '--font-size-small'], ['0.95rem', '--font-size-body'], ['1rem', '--font-size-body'],
    ['1.05rem', '--font-size-body'], ['1.125rem', '--font-size-body-lg'], ['1.2', '--font-size-label'],
    ['1.2rem', '--font-size-label'], ['1.25rem', '--font-size-label'], ['1.375rem', '--font-size-title-sm'],
    ['1.5rem', '--font-size-title-sm'], ['1.75rem', '--font-size-title-md'], ['1.875rem', '--font-size-title-md'],
    ['2rem', '--font-size-title-lg'], ['2.25rem', '--font-size-title-lg'], ['2.5rem', '--font-size-heading'],
    ['2.75rem', '--font-size-heading'], ['3rem', '--font-size-display-sm'], ['3.25rem', '--font-size-display-sm'],
    ['3.5rem', '--font-size-display-sm'], ['4rem', '--font-size-display-md'], ['4.5rem', '--font-size-display-md'],
    ['5rem', '--font-size-display-md'], ['6rem', '--font-size-display-lg'],
  ]),
  'font weights': new Map([
    ['300', '--font-weight-light'], ['400', '--font-weight-regular'], ['normal', '--font-weight-regular'],
    ['500', '--font-weight-medium'], ['600', '--font-weight-semibold'], ['700', '--font-weight-bold'],
    ['bold', '--font-weight-bold'], ['inherit', '--font-weight-inherit'],
  ]),
  'border radii': new Map([
    ['0', '--radius-none'], ['0.125rem', '--radius-xs'], ['0.25rem', '--radius-sm'],
    ['0.375rem', '--radius-md'], ['0.5rem', '--radius-lg'], ['0.75rem', '--radius-xl'],
    ['50%', '--radius-round'], ['6.25rem', '--radius-pill'], ['12.5rem', '--radius-pill'],
  ]),
  'z-index': new Map([
    ['-1', '--z-behind'], ['0', '--z-base'], ['1', '--z-content'], ['2', '--z-raised'],
    ['10', '--z-sticky'], ['800', '--z-zoom-image'],
    ['850', '--z-zoom-clone'], ['900', '--z-zoom-backdrop'], ['1000', '--z-modal'], ['9999', '--z-loader'],
  ]),
};

// Suggestions follow tokens.css: drop hints that point at tokens that no longer exist, and derive the exact-value hints from the live tokens.
{
  const defined = new Map();
  const resolveValue = (value, seen = 0) => {
    const alias = seen < 8 && value.match(/^var\((--[\w-]+)\)$/);
    return alias && defined.has(alias[1]) ? resolveValue(defined.get(alias[1]), seen + 1) : value;
  };
  for (const match of fs.readFileSync(path.join(root, 'style', 'tokens.css'), 'utf8').replace(/\r/g, '').matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)) defined.set(match[1], match[2].trim());
  const live = new Map([...defined].filter(([name]) => name.startsWith('--sys-')).map(([name, value]) => [name, resolveValue(value)]));
  const prune = (map) => { for (const [value, token] of [...map]) if (!defined.has(token)) map.delete(value); };
  prune(tokenSuggestions);
  Object.values(categorySuggestions).forEach(prune);
  const derive = (map, prefix) => { for (const [name, value] of live) if (name.startsWith(prefix) && /^-?[\d.]+(rem|px|ms|s)?$/.test(value)) map.set(value, name); };
  [categorySuggestions.spacing, categorySuggestions['font sizes'], categorySuggestions['font weights'], categorySuggestions['border radii'], categorySuggestions['z-index']].forEach((map) => map.clear());
  derive(categorySuggestions.spacing, '--sys-space-');
  derive(categorySuggestions['font sizes'], '--sys-font-size-');
  derive(categorySuggestions['font weights'], '--sys-font-weight-');
  derive(categorySuggestions['border radii'], '--sys-radius-');
  derive(categorySuggestions['z-index'], '--sys-z-');
  tokenSuggestions.clear();
  for (const [name, value] of live) if (name.startsWith('--sys-color-') && /^#/.test(value)) tokenSuggestions.set(value.toLowerCase(), name);
  for (const [name, value] of live) if (name.startsWith('--sys-motion-duration-')) tokenSuggestions.set(value, name);
}

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    if (!includeArchive && entry.name === 'archive') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, files);
    else if (/\.(?:css|scss)$/i.test(entry.name)) files.push(absolute);
  }
  return files;
}

function withoutComments(line, state) {
  let output = '';
  for (let index = 0; index < line.length; index += 1) {
    if (!state.block && line[index] === '/' && line[index + 1] === '*') {
      state.block = true;
      index += 1;
    } else if (state.block && line[index] === '*' && line[index + 1] === '/') {
      state.block = false;
      index += 1;
    } else if (!state.block) output += line[index];
  }
  return output.replace(/\/\/.*$/, '');
}

function suggestion(value, category) {
  const normalized = value.toLowerCase();
  const categoryToken = categorySuggestions[category]?.get(normalized);
  if (categoryToken) return `var(${categoryToken})`;
  if (tokenSuggestions.has(normalized)) return `var(${tokenSuggestions.get(normalized)})`;
  if (category === 'transition durations' && normalized.endsWith('s')) {
    const steps = Number.parseFloat(normalized) / 0.05;
    if (Number.isFinite(steps) && Math.abs(steps - Math.round(steps)) < 0.000001) {
      return `calc(var(--sys-motion-duration-stagger) * ${Math.round(steps)})`;
    }
  }
  if (category === 'colors') return 'var(--sys-color-*)';
  if (category === 'semantic color keywords') return 'var(--sys-color-transparent) or var(--sys-color-inherit)';
  if (category === 'spacing') return 'var(--sys-space-*)';
  if (category === 'pixel spacing') return 'var(--sys-space-*) or a component token';
  if (category === 'font sizes') return 'var(--sys-font-size-*)';
  if (category === 'font weights') return 'var(--sys-font-weight-*)';
  if (category === 'border radii') return 'var(--sys-radius-*)';
  if (category === 'z-index') return 'var(--sys-z-*)';
  if (category === 'box shadows') return 'var(--sys-shadow-*)';
  return 'var(--sys-motion-*)';
}

const rules = [
  { category: 'colors', severity: 'error', regex: /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi },
  { category: 'semantic color keywords', severity: 'error', property: /^(?:color|background|background-color)$/, regex: /\b(?:transparent|inherit)\b/gi },
  { category: 'pixel spacing', severity: 'error', regex: /-?(?:\d*\.)?\d+px\b/gi },
  { category: 'spacing', severity: 'error', property: /^(?:margin|padding|gap|row-gap|column-gap)(?:-[\w-]+)?$/, regex: /\bauto\b|-?(?:\d*\.)?\d+(?:px|rem|em|vh|vw|%)?\b/gi },
  { category: 'font sizes', severity: 'error', property: /^(?:-webkit-)?font-size$/, regex: /\b(?:\d*\.)?\d+(?:px|rem|em|%|vw|vh)?\b/gi },
  { category: 'font weights', severity: 'error', property: /^font-weight$/, regex: /\b(?:[1-9]00|normal|bold|bolder|lighter|inherit)\b/gi },
  { category: 'border radii', severity: 'error', property: /^border-radius$/, regex: /-?(?:\d*\.)?\d+(?:px|rem|em|%)?\b/gi },
  { category: 'z-index', severity: 'error', property: /^z-index$/, regex: /-?\d+\b/g },
  { category: 'box shadows', severity: 'error', property: /^(?:box-shadow|filter)$/, regex: /(?:-?(?:\d*\.)?\d+(?:px|rem|em)\s*){2,}|rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/gi },
  { category: 'reference token used directly', severity: 'error', raw: true, regex: /var\(\s*--ref-[\w-]+/g, message: 'use the --sys-* or --comp-* token that points at it' },
  { category: 'transition durations', severity: 'warning', property: /^(?:transition|transition-duration|animation|animation-duration|animation-delay)$/, regex: /\b(?:\d*\.)?\d+(?:ms|s)\b/gi },
];

const violations = [];
const counts = Object.fromEntries(rules.map((rule) => [rule.category, 0]));
const fileCounts = new Map();

for (const file of walk(root)) {
  const relative = path.relative(root, file);
  if (ignoredFiles.has(relative)) continue;
  const state = { block: false, property: null };
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((sourceLine, lineIndex) => {
    const line = withoutComments(sourceLine, state);
    if (!line.trim()) return;
    const inspectableLine = line.replace(/var\([^)]*\)/g, '');
    const declaration = inspectableLine.match(/^\s*([\w-]+)\s*:\s*(.*)$/);
    const property = declaration?.[1]?.toLowerCase() || state.property;
    if (declaration) state.property = sourceLine.includes(';') ? null : property;
    for (const rule of rules) {
      if (rule.property && (!property || !rule.property.test(property))) continue;
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(rule.raw ? line : inspectableLine))) {
        counts[rule.category] += 1;
        fileCounts.set(relative, (fileCounts.get(relative) || 0) + 1);
        violations.push({
          file: relative.replaceAll('\\', '/'),
          line: lineIndex + 1,
          severity: rule.severity,
          category: rule.category,
          value: match[0],
          suggestion: rule.message || suggestion(match[0], rule.category),
        });
      }
    }
    if (state.property && sourceLine.includes(';')) state.property = null;
  });
}

const result = {
  scope: includeArchive ? 'all CSS/SCSS including archive' : 'active CSS/SCSS only',
  filesScanned: walk(root).filter((file) => !ignoredFiles.has(path.relative(root, file))).length,
  counts,
  total: violations.length,
  errors: violations.filter((item) => item.severity === 'error').length,
  warnings: violations.filter((item) => item.severity === 'warning').length,
  files: [...fileCounts.entries()].sort((a, b) => b[1] - a[1]).map(([file, count]) => ({ file: file.replaceAll('\\', '/'), count })),
  violations,
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
} else if (violations.length === 0) {
  console.log(`Token audit passed: ${result.filesScanned} files scanned, zero violations.`);
} else {
  for (const item of violations) {
    console.log(`${item.severity.toUpperCase()} ${item.file}:${item.line} ${item.category}: ${item.value} -> ${item.suggestion}`);
  }
  console.log(`\n${result.errors} errors, ${result.warnings} warnings across ${result.filesScanned} files.`);
}

process.exitCode = result.errors > 0 ? 1 : 0;
