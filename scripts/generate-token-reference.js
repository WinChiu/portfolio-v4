const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'style', 'tokens.css');
const outputPath = path.join(root, 'specs', 'tokens', 'token-reference.md');
const source = fs.readFileSync(sourcePath, 'utf8');
const variables = [...source.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((match) => ({
  name: match[1],
  value: match[2],
}));

function usage(name) {
  if (name.startsWith('--ds-')) return 'Upstream primitive. Override only when integrating a parent design system.';
  if (name.startsWith('--color-')) return 'Use for semantic color roles named by this token.';
  if (name.startsWith('--space-')) return 'Use for spacing, inset, margin, padding, or gap.';
  if (name.startsWith('--size-')) return 'Use for the named component dimension.';
  if (name.startsWith('--font-family-')) return 'Use for the named typography family.';
  if (name.startsWith('--font-size-')) return 'Use for responsive type sizing.';
  if (name.startsWith('--font-weight-')) return 'Use for semantic text emphasis.';
  if (name.startsWith('--line-height-')) return 'Use for the named text density.';
  if (name.startsWith('--radius-')) return 'Use for corner rounding.';
  if (name.startsWith('--shadow-') || name.startsWith('--filter-shadow-')) return 'Use for the named elevation level.';
  if (name.startsWith('--z-')) return 'Use only for the named stacking role.';
  if (name.startsWith('--motion-')) return 'Use to compose transitions and animation timing.';
  if (name.startsWith('--transition-')) return 'Use as a complete transition value.';
  return 'Project design token.';
}

function escapeCell(value) {
  return value.replaceAll('|', '\\|');
}

const sections = [
  ['Layer 1 upstream primitives', variables.filter((item) => item.name.startsWith('--ds-'))],
  ['Layer 2 project aliases', variables.filter((item) => !item.name.startsWith('--ds-'))],
];

let markdown = '# Token reference\n\n';
markdown += 'Generated from `style/tokens.css` by `node scripts/generate-token-reference.js`. Components may consume Layer 2 only.\n\n';
for (const [heading, items] of sections) {
  markdown += `## ${heading}\n\n| Variable | Value | When to use |\n| --- | --- | --- |\n`;
  for (const item of items) markdown += `| \`${item.name}\` | \`${escapeCell(item.value)}\` | ${usage(item.name)} |\n`;
  markdown += '\n';
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${variables.length} tokens to ${path.relative(root, outputPath)}.`);
