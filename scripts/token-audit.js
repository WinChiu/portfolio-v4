#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const includeArchive = !process.argv.includes('--active');
const json = process.argv.includes('--json');
const ignoredDirectories = new Set(['.git', 'node_modules', 'specs']);
const ignoredFiles = new Set([
  path.join('style', 'tokens.css'),
]);

const tokenSuggestions = new Map([
  ['#363a35', '--color-text'], ['#7a776d', '--color-text-muted'],
  ['#868684', '--color-text-subtle'], ['#c14804', '--color-link'],
  ['#c8c8c8', '--color-disabled'], ['#d1b129', '--color-accent'],
  ['#f37021', '--color-accent-bright'], ['#f8f6ed', '--color-background-soft'],
  ['#b74343', '--color-interactive'], ['#4f4b43', '--color-surface-inverse'],
  ['#f5dead', '--color-highlight'], ['#ffffff', '--color-text-inverse'],
  ['#cabd8a', '--color-interactive-hover'], ['#fbfbf6', '--color-background'],
  ['#555', '--color-text-strong'], ['400ms', '--motion-duration-slow'],
  ['0.2s', '--motion-duration-fast'], ['0.25s', '--motion-duration-standard'],
  ['0.3s', '--motion-duration-standard'], ['0.4s', '--motion-duration-slow'],
  ['0.5s', '--motion-duration-slow'], ['0.6s', '--motion-duration-slow'], ['1s', '--motion-duration-loading'],
  ['1.5s', '--motion-duration-entrance'], ['2.5s', '--motion-duration-entrance'],
]);

const categorySuggestions = {
  'pixel spacing': new Map([['16px', '--space-md'], ['72px', '--size-effort-column-legacy'], ['104px', '--size-effort-column']]),
  spacing: new Map([
    ['0', '--space-0'], ['0rem', '--space-0'], ['0.125rem', '--space-hairline'],
    ['0.25rem', '--space-3xs'], ['0.375rem', '--space-2xs'], ['0.5rem', '--space-xs'],
    ['0.75rem', '--space-sm'], ['0.875rem', '--space-custom-875'], ['1rem', '--space-md'],
    ['1.25rem', '--space-lg'], ['1.5rem', '--space-xl'], ['1.75rem', '--space-2xl'],
    ['2rem', '--space-3xl'], ['2.5rem', '--space-4xl'], ['3rem', '--space-5xl'],
    ['4rem', '--space-6xl'], ['6rem', '--space-7xl'], ['8rem', '--space-8xl'],
    ['auto', '--space-auto'], ['20%', '--space-content-percent'], ['21rem', '--space-custom-2100'],
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
    ['10', '--z-sticky'], ['30', '--z-overlay'], ['800', '--z-zoom-image'],
    ['850', '--z-zoom-clone'], ['900', '--z-zoom-backdrop'], ['1000', '--z-modal'], ['9999', '--z-loader'],
  ]),
};

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
      return `calc(var(--motion-duration-stagger) * ${Math.round(steps)})`;
    }
  }
  if (category === 'colors') return 'var(--color-*)';
  if (category === 'semantic color keywords') return 'var(--color-transparent) or var(--color-inherit)';
  if (category === 'spacing') return 'var(--space-*)';
  if (category === 'pixel spacing') return 'var(--space-*) or a relative layout token';
  if (category === 'font sizes') return 'var(--font-size-*)';
  if (category === 'font weights') return 'var(--font-weight-*)';
  if (category === 'border radii') return 'var(--radius-*)';
  if (category === 'z-index') return 'var(--z-*)';
  if (category === 'box shadows') return 'var(--shadow-*)';
  return 'var(--motion-*)';
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
      while ((match = rule.regex.exec(inspectableLine))) {
        counts[rule.category] += 1;
        fileCounts.set(relative, (fileCounts.get(relative) || 0) + 1);
        violations.push({
          file: relative.replaceAll('\\', '/'),
          line: lineIndex + 1,
          severity: rule.severity,
          category: rule.category,
          value: match[0],
          suggestion: suggestion(match[0], rule.category),
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
