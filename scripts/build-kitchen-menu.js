// Builds content/kitchenMenuData.js from content/kitchen-menu.csv.
// The CSV is the one place to maintain the Kitchen menu: edit it (Excel,
// Numbers, or the synced Claude Sheet), then run `npm run build:kitchen`
// (also part of `npm run build:all`).
//
// Columns: no, course, nameZh, nameEn, noteZh, noteEn, effort, time,
// imageSrc, imageAltEn, imageClass, ingredients, steps
//   ingredients: "雞腿肉=1 片; 洋蔥=半顆"   (name=qty, separated by ;)
//   steps:       "煎到金黃 | 加泡菜炒香"     (separated by |)
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const csvPath = path.join(root, 'content', 'kitchen-menu.csv');
const outPath = path.join(root, 'content', 'kitchenMenuData.js');
const COURSES = ['rice', 'noodle', 'main', 'stew', 'snack', 'sweet'];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

const [header, ...records] = parseCsv(fs.readFileSync(csvPath, 'utf8').replace(/^﻿/, ''));
const col = Object.fromEntries(header.map((name, index) => [name.trim(), index]));
const errors = [];

const items = records
  .map((record, index) => {
    const get = (name) => (record[col[name]] ?? '').trim().replace(/^'/, '');
    const line = index + 2;
    const item = {
      no: Number(get('no')) || index + 1,
      course: get('course'),
      nameZh: get('nameZh'),
      nameEn: get('nameEn'),
      noteZh: get('noteZh'),
      noteEn: get('noteEn'),
      effort: Number(get('effort')),
      imageSrc: get('imageSrc'),
      imageAltEn: get('imageAltEn') || get('nameEn'),
      imageClass: get('imageClass'),
    };
    if (get('time')) item.time = get('time');
    const ingredients = get('ingredients').split(';').map((s) => s.trim()).filter(Boolean)
      .map((entry) => {
        const [name, ...qty] = entry.split('=');
        return { name: name.trim(), qty: qty.join('=').trim() };
      });
    if (ingredients.length) item.ingredients = ingredients;
    const steps = get('steps').split('|').map((s) => s.trim()).filter(Boolean);
    if (steps.length) item.steps = steps;

    if (!item.nameZh || !item.nameEn) errors.push(`row ${line}: nameZh and nameEn are required`);
    if (!COURSES.includes(item.course)) errors.push(`row ${line}: course must be one of ${COURSES.join(', ')}`);
    if (![1, 2, 3].includes(item.effort)) errors.push(`row ${line}: effort must be 1, 2 or 3`);
    if (!item.imageSrc) errors.push(`row ${line}: imageSrc is required`);
    else if (!fs.existsSync(path.join(root, item.imageSrc.replace(/^\//, '')))) {
      errors.push(`row ${line}: image not found: ${item.imageSrc}`);
    }
    return item;
  })
  .sort((a, b) => a.no - b.no)
  .map(({ no, ...item }) => item);

if (errors.length) {
  console.error(`kitchen-menu.csv has ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

fs.writeFileSync(outPath, `// Generated from content/kitchen-menu.csv by scripts/build-kitchen-menu.js.
// Do not edit by hand: edit the CSV and run \`npm run build:kitchen\`.
window.__KITCHEN_MENU__ = ${JSON.stringify(items, null, 2)};
`);
console.log(`Generated content/kitchenMenuData.js (${items.length} dishes).`);
