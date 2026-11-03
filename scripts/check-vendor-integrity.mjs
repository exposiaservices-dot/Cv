import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, resolve, sep } from 'node:path';

const root = fileURLToPath(new URL('../vendor/reveal.js-plugins/', import.meta.url));
const manifest = JSON.parse(readFileSync(new URL('../vendor/reveal.js-plugins-integrity.json', import.meta.url), 'utf8'));
if (manifest.algorithm !== 'sha256') throw new Error('Unsupported vendor integrity algorithm');
const files = [];
function walk(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = resolve(path, entry.name);
    if (entry.isDirectory()) walk(child);
    else if (entry.isFile()) files.push(relative(root, child).split(sep).join('/'));
    else throw new Error(`Unexpected non-file in vendor: ${child}`);
  }
}
walk(root);
const expected = Object.keys(manifest.files).sort();
if (files.sort().join('\n') !== expected.join('\n')) throw new Error('Vendored plugin file list differs from its manifest');
for (const file of expected) {
  const digest = createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex');
  if (digest !== manifest.files[file]) throw new Error(`Vendored plugin integrity mismatch: ${file}`);
}
console.log(`Vendored plugin integrity verified: ${files.length} files.`);
