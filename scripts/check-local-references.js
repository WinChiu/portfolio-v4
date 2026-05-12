const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceExtensions = new Set(['.html', '.css']);
const ignoredDirectories = new Set(['.git', 'archive', 'node_modules']);

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      files.push(...walk(path.join(directory, entry.name)));
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

function isLocalReference(value) {
  return (
    value &&
    !value.startsWith('#') &&
    !value.startsWith('http://') &&
    !value.startsWith('https://') &&
    !value.startsWith('mailto:') &&
    !value.startsWith('tel:') &&
    !value.startsWith('data:')
  );
}

function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

function referencesFrom(content) {
  const references = [];
  const attributePattern = /\b(?:src|href)=["']([^"']+)["']/g;
  const cssUrlPattern = /url\((['"]?)([^'")]+)\1\)/g;
  let match;

  while ((match = attributePattern.exec(content)) !== null) {
    references.push(match[1]);
  }

  while ((match = cssUrlPattern.exec(content)) !== null) {
    references.push(match[2]);
  }

  return references;
}

const missing = [];

for (const file of walk(root)) {
  const content = fs.readFileSync(file, 'utf8');
  const directory = path.dirname(file);

  for (const rawReference of referencesFrom(content)) {
    if (!isLocalReference(rawReference)) {
      continue;
    }

    const cleanReference = stripQueryAndHash(rawReference);

    if (!cleanReference) {
      continue;
    }

    const resolved = cleanReference.startsWith('/')
      ? path.join(root, cleanReference)
      : path.resolve(directory, cleanReference);

    if (!fs.existsSync(resolved)) {
      missing.push({
        file: path.relative(root, file).replace(/\\/g, '/'),
        reference: rawReference,
      });
    }
  }
}

if (missing.length > 0) {
  console.error('Missing local references:');

  for (const item of missing) {
    console.error(`- ${item.file}: ${item.reference}`);
  }

  process.exit(1);
}

console.log('All local HTML/CSS references exist.');
