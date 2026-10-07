import { stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { available, sourceRoot, tree } from '../lib/manager.mjs';

const problems = [];
const names = await available();
for (const expected of ['orchestrate', 'development-testing', 'release-gate']) {
  if (!names.includes(expected)) problems.push(`Missing required skill: ${expected}`);
}
for (const name of names) {
  const root = resolve(sourceRoot, name);
  const files = await tree(root);
  const text = files['SKILL.md'].toString('utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) { problems.push(`${name}: missing frontmatter`); continue; }
  // This collection deliberately uses portable, plain scalar frontmatter.
  const fields = Object.fromEntries(match[1].split(/\r?\n/).map(line => {
    const colon = line.indexOf(':');
    return [line.slice(0, colon), line.slice(colon + 1).trim()];
  }));
  if (fields.name !== name || name.length > 64) problems.push(`${name}: invalid name`);
  if (!fields.description || fields.description.length > 1024) problems.push(`${name}: invalid description`);
  if (fields.compatibility?.length > 500) problems.push(`${name}: compatibility exceeds 500 characters`);
  if (Object.keys(fields).some(key => !['name', 'description', 'compatibility', 'license'].includes(key))) problems.push(`${name}: unsupported frontmatter in collection`);
  if (text.split('\n').length > 500) problems.push(`${name}: entrypoint exceeds 500 lines`);
  for (const [file, content] of Object.entries(files)) {
    if (!file.endsWith('.md')) continue;
    for (const [, target] of content.toString('utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      try { await stat(resolve(dirname(resolve(root, file)), target.split('#')[0])); }
      catch { problems.push(`${name}/${file}: broken link ${target}`); }
    }
  }
}
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log('Validated all skill entrypoints and local references.');
