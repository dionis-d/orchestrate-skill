import { lstat, readdir, readFile, mkdir, writeFile, rename, rm, link } from 'node:fs/promises';
import { resolve, relative, dirname, join, isAbsolute, sep } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const sourceRoot = fileURLToPath(new URL('../skills/', import.meta.url));
export const agents = {
  codex: { project: '.agents/skills', global: '.agents/skills' },
  'claude-code': { project: '.claude/skills', global: '.claude/skills' },
  zcode: { project: '.zcode/skills', global: '.zcode/skills' },
  // OpenCode officially reads .agents/skills; share it with Codex to avoid duplicates.
  opencode: { project: '.agents/skills', global: '.agents/skills' },
};
export const aliases = { openai: 'codex', claude: 'claude-code', clode: 'claude-code' };
const lockName = '.workflow-skills-lock.json';
const validName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function stat(path) {
  try { return await lstat(path); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export function contained(root, path) {
  const target = resolve(root, path);
  const rel = relative(root, target);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`Path must be inside the target root: ${path}`);
  }
  return target;
}

// Refuse symlinks/junctions along managed paths, including the target root.
// This avoids writing through existing agent links owned by another installer.
async function safePath(root, path) {
  const target = contained(root, path);
  let cursor = target;
  while (true) {
    const info = await stat(cursor);
    if (info?.isSymbolicLink()) throw new Error(`Refusing symbolic link/junction: ${cursor}`);
    if (cursor === dirname(cursor)) break;
    cursor = dirname(cursor);
  }
  return target;
}

export async function tree(path) {
  const result = {};
  async function walk(dir, prefix = '') {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const key = prefix + entry.name;
      if (entry.isSymbolicLink()) throw new Error(`Refusing symbolic link in skill: ${join(dir, entry.name)}`);
      if (entry.isDirectory()) await walk(join(dir, entry.name), `${key}/`);
      else if (entry.isFile()) result[key] = await readFile(join(dir, entry.name));
      else throw new Error(`Unsupported file in skill: ${key}`);
    }
  }
  await walk(path);
  return result;
}

export function digest(files) {
  const hash = createHash('sha256');
  for (const key of Object.keys(files).sort()) {
    hash.update(`${Buffer.byteLength(key)}:${key}:${files[key].length}:`);
    hash.update(files[key]);
  }
  return hash.digest('hex');
}

export async function available(source = sourceRoot) {
  const names = [];
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.isDirectory() && validName.test(entry.name) && await stat(join(source, entry.name, 'SKILL.md'))) names.push(entry.name);
  }
  return names.sort();
}

export async function readLock(root) {
  const path = await safePath(root, lockName);
  if (!await stat(path)) return { version: 1, entries: [] };
  const lock = JSON.parse(await readFile(path, 'utf8'));
  if (lock.version !== 1 || !Array.isArray(lock.entries)) throw new Error('Unsupported or invalid installation manifest');
  const paths = new Set();
  for (const entry of lock.entries) {
    if (!validName.test(entry.name) || entry.name.length > 64 || typeof entry.directory !== 'string' ||
        !/^[a-f0-9]{64}$/.test(entry.hash)) throw new Error('Invalid installation entry');
    const path = contained(root, entry.directory);
    if (path.split(sep).at(-1) !== entry.name || paths.has(path)) throw new Error('Invalid or duplicate installation path');
    paths.add(path);
  }
  return lock;
}

async function atomicJson(root, name, value, exclusive = false) {
  const path = await safePath(root, name);
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
    if (exclusive) await link(temp, path);
    else await rename(temp, path);
  } finally { await rm(temp, { force: true }); }
}

export async function inspect(root, source = sourceRoot) {
  const lock = await readLock(root);
  const rows = [];
  for (const entry of lock.entries) {
    const target = await safePath(root, entry.directory);
    let status = 'missing';
    if (await stat(target)) {
      const current = digest(await tree(target));
      if (current !== entry.hash) status = 'modified';
      else {
        const upstream = join(source, entry.name);
        status = await stat(upstream) ? (digest(await tree(upstream)) === current ? 'current' : 'update available') : 'source unavailable';
      }
    }
    rows.push({ ...entry, status });
  }
  return rows;
}

export async function manage(options) {
  if (options.dryRun) return applyPlan(options);
  const root = resolve(options.root);
  const guard = await safePath(root, '.workflow-skills-installing');
  await mkdir(root, { recursive: true });
  try { await writeFile(guard, `${process.pid}\n`, { flag: 'wx' }); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('Another installation may be running. If interrupted, verify no installer is active before removing .workflow-skills-installing.');
    throw error;
  }
  try { return await applyPlan(options); }
  finally { await rm(guard, { force: true }); }
}

async function applyPlan({ command, root, names, agentNames = Object.keys(agents), skillsDir, source = sourceRoot, dryRun = false }) {
  root = resolve(root);
  if (!['add', 'update', 'remove'].includes(command)) throw new Error(`Unknown command: ${command}`);
  const known = command === 'remove' ? [] : await available(source);
  const lock = await readLock(root);
  if (names?.some(name => !validName.test(name) || name.length > 64)) throw new Error('Invalid skill name');
  let plans;
  if (command === 'add') {
    names ??= known;
    if (!names.length || names.some(name => !known.includes(name))) throw new Error('Choose available skills');
    const directories = skillsDir ? [skillsDir] : agentNames.map(input => {
      const agent = aliases[input] ?? input;
      if (!agents[agent]) throw new Error(`Unknown agent: ${input}. Use --skills-dir for other harnesses.`);
      return agents[agent].project;
    });
    if (!directories.length) throw new Error('Choose at least one agent');
    plans = [...new Set(directories)].flatMap(directory => [...new Set(names)].map(name => ({ name, directory: `${directory.replaceAll('\\', '/')}/${name}` })));
  } else {
    plans = lock.entries.filter(entry => !names || names.includes(entry.name)).map(entry => ({ ...entry }));
    if (names?.some(name => !plans.some(entry => entry.name === name))) throw new Error('Requested skill is not managed by this installer');
  }
  // Preflight every destination before making changes. No force option: local edits
  // and installations managed by other tools must be preserved.
  for (const plan of plans) {
    plan.target = await safePath(root, plan.directory);
    const within = (parent, child) => {
      const rel = relative(resolve(parent), resolve(child));
      return !rel || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
    };
    if (within(source, plan.target) || within(plan.target, source)) throw new Error('Installation destinations must not overlap the source skills');
    plan.previous = lock.entries.find(entry => resolve(root, entry.directory) === plan.target);
    if (await stat(plan.target)) {
      if (!plan.previous) throw new Error(`Existing unmanaged skill: ${plan.target}`);
      if (digest(await tree(plan.target)) !== plan.previous.hash) throw new Error(`Locally modified skill: ${plan.target}. Back up or relocate edits first.`);
    }
    if (command !== 'remove') {
      if (!known.includes(plan.name)) throw new Error(`Source skill unavailable: ${plan.name}`);
      plan.files = await tree(join(source, plan.name));
      plan.hash = digest(plan.files);
    }
  }
  if (dryRun) return plans.map(({ name, directory }) => ({ name, directory }));
  // Persist ownership after each complete directory replacement. On interruption,
  // previous completed entries remain manageable; mismatches are refused safely.
  for (const plan of plans) {
    if (command === 'remove') {
      await rm(plan.target, { recursive: true, force: true });
    } else {
      await mkdir(dirname(plan.target), { recursive: true });
      const staging = `${plan.target}.${randomUUID()}.tmp`;
      const backup = `${plan.target}.${randomUUID()}.backup`;
      let saved = false;
      try {
        await mkdir(staging);
        for (const [key, bytes] of Object.entries(plan.files)) {
          const file = contained(staging, key);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, bytes, { flag: 'wx' });
        }
        if (await stat(plan.target)) { await rename(plan.target, backup); saved = true; }
        try { await rename(staging, plan.target); }
        catch (error) { if (saved) await rename(backup, plan.target); throw error; }
      } finally { await rm(staging, { recursive: true, force: true }); }
      // Backup removal only follows successful replacement; failed restores are
      // deliberately retained for manual recovery.
      if (saved) await rm(backup, { recursive: true, force: true });
    }
    lock.entries = lock.entries.filter(entry => resolve(root, entry.directory) !== plan.target);
    if (command !== 'remove') lock.entries.push({ name: plan.name, directory: plan.directory, hash: plan.hash });
    await atomicJson(root, lockName, lock);
  }
  return plans.map(({ name, directory }) => ({ name, directory }));
}

export async function configure(root, config) {
  root = resolve(root);
  if (await stat(await safePath(root, '.workflow-skills.json'))) throw new Error('Project configuration already exists; edit it directly to preserve your choices');
  try { await atomicJson(root, '.workflow-skills.json', { version: 1, ...config }, true); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('Project configuration already exists; edit it directly to preserve your choices');
    throw error;
  }
}
