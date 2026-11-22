const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'style', 'tokens.css');
const outputPath = path.join(root, 'specs', 'tokens', 'token-reference.md');
const source = fs.readFileSync(sourcePath, 'utf8');
const variables = [...source.matchAll(/^\s*(--[\w-]+):\s*(.+?);[ \t]*(?:\/\*.*\*\/)?[ \t]*\r?$/gm)].map((match) => ({
  name: match[1],
  value: match[2],
}));

const tierOf = (name) => (name.startsWith('--ref-') ? 'ref' : name.startsWith('--sys-') ? 'sys' : 'comp');

// What a token is for. Reference tokens describe a value; system and component tokens describe a role.
function usage(name) {
  const tier = tierOf(name);
  const key = name.replace(/^--(ref|sys|comp)-/, '--');
  if (tier === 'ref') return 'Raw value. Reference it from a system or component token, never from a component.';
  if (key.startsWith('--color-')) return 'Use for the semantic color role named by this token.';
  if (key.startsWith('--space-')) return 'Use for spacing, inset, margin, padding, or gap.';
  if (key.startsWith('--font-family-')) return 'Use for the named typography family.';
  if (key.startsWith('--font-size-')) return 'Use for type sizing.';
  if (key.startsWith('--font-weight-')) return 'Use for semantic text emphasis.';
  if (key.startsWith('--line-height-')) return 'Use for the named text density.';
  if (key.startsWith('--letter-spacing-')) return 'Use for tracking on display type.';
  if (key.startsWith('--radius-')) return 'Use for corner rounding.';
  if (key.startsWith('--shadow-')) return 'Use for the named elevation level.';
  if (key.startsWith('--z-')) return 'Use only for the named stacking role.';
  if (key.startsWith('--motion-')) return 'Use to compose transitions and animation timing.';
  if (key.startsWith('--transition-')) return 'Use as a complete transition value.';
  return tier === 'sys' ? 'System decision.' : 'Measure or property of one component or section.';
}

function escapeCell(value) {
  return value.replaceAll('|', '\\|');
}

const titles = { ref: 'Reference tokens', sys: 'System tokens', comp: 'Component tokens' };
const blurbs = {
  ref: 'Every approved raw value, named for what it is. One value has one name. Components never use these directly.',
  sys: 'Decisions and roles. Each points at a reference token wherever the value exists there. Components consume these.',
  comp: 'Measures and properties that belong to one component or section. They point at system or reference tokens.',
};

let markdown = '# Token reference\n\n';
markdown += 'Generated from `style/tokens.css` by `node scripts/generate-token-reference.js`. Three tiers, as in Material 3: reference, system, component. Components may consume system and component tokens only — never a raw value and never a reference token.\n\n';
for (const tier of ['ref', 'sys', 'comp']) {
  const list = variables.filter((item) => tierOf(item.name) === tier);
  markdown += `## ${titles[tier]} (${list.length})\n\n${blurbs[tier]}\n\n| Variable | Value | When to use |\n| --- | --- | --- |\n`;
  for (const item of list) markdown += `| \`${item.name}\` | \`${escapeCell(item.value)}\` | ${usage(item.name)} |\n`;
  markdown += '\n';
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${variables.length} tokens to ${path.relative(root, outputPath)}.`);
