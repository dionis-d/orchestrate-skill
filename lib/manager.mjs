import { lstat, realpath, readdir, readFile, mkdir, writeFile, rename, rm, rmdir, link } from 'node:fs/promises';
import { resolve, relative, dirname, basename, join, isAbsolute, toNamespacedPath, sep } from 'node:path';
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

async function stat(path, options) {
  try { return await lstat(path, options); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function isInside(rel) {
  return rel !== '' && !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`);
}

export function contained(root, path) {
  const target = resolve(root, path);
  const rel = relative(root, target);
  if (!isInside(rel)) throw new Error(`Path must be inside the target root: ${path}`);
  if (process.platform === 'win32' && rel.split(sep).some(part => /[. ]$|:/.test(part))) {
    throw new Error(`Ambiguous Windows path: ${path}`);
  }
  return target;
}

async function windowsPathKey(path) {
  try { return (await realpath(path)).toLowerCase(); }
  catch (error) {
    const parent = dirname(path);
    if (error.code !== 'ENOENT' || parent === path) throw error;
    return join(await windowsPathKey(parent), relative(parent, path).toLowerCase());
  }
}

async function posixPathKeys(path) {
  const parent = dirname(path);
  const ancestors = parent === path ? [] : await posixPathKeys(parent);
  const info = await stat(path, { bigint: true });
  // Existing components use filesystem identity. Missing names retain their spelling.
  const key = info ? `${info.dev}:${info.ino}` : `${ancestors[0]}/${basename(path)}`;
  return [key, ...ancestors];
}

async function pathKeys(path) {
  if (process.platform !== 'win32') return posixPathKeys(path);
  const keys = [];
  for (let cursor = await windowsPathKey(path); ; cursor = dirname(cursor)) {
    keys.push(cursor);
    if (cursor === dirname(cursor)) return keys;
  }
}

function keysOverlap(first, second) {
  return first.includes(second[0]) || second.includes(first[0]);
}

function overlaps(first, second) {
  return first === second || isInside(relative(first, second)) || isInside(relative(second, first));
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
  const result = Object.create(null);
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
  await registeredPaths(root, lock.entries);
  return lock;
}

async function registeredPaths(root, entries) {
  const paths = new Map();
  for (const entry of entries) {
    if (!validName.test(entry.name) || entry.name.length > 64 || typeof entry.directory !== 'string' ||
        !/^[a-f0-9]{64}$/.test(entry.hash)) throw new Error('Invalid installation entry');
    const path = contained(root, entry.directory);
    const keys = await pathKeys(path);
    if (path.split(sep).at(-1) !== entry.name || paths.has(keys[0])) throw new Error('Invalid or duplicate installation path');
    paths.set(keys[0], { entry, keys });
  }
  return paths;
}

function findPrevious(managed, keys, target, command) {
  const previous = managed.get(keys[0]);
  if (command !== 'remove') {
    for (const existing of managed.values()) {
      if (existing !== previous && keysOverlap(existing.keys, keys)) {
        throw new Error(`Installation destination would overlap a managed skill: ${target}`);
      }
    }
  }
  return previous?.entry;
}

async function removeEmptyParents(parent, firstCreated) {
  const created = [parent];
  const boundary = toNamespacedPath(firstCreated);
  while (toNamespacedPath(created.at(-1)) !== boundary) {
    const path = created.at(-1);
    const ancestor = dirname(path);
    if (ancestor === path) return;
    created.push(ancestor);
  }
  for (const path of created) {
    try { await rmdir(path); }
    catch (error) {
      if (error.code === 'ENOTEMPTY') return;
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

async function atomicJson(root, name, value, exclusive = false) {
  const path = await safePath(root, name);
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${randomUUID()}.tmp`;
  let moved = false;
  try {
    await writeFile(temp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
    if (exclusive) await link(temp, path);
    else {
      await rename(temp, path);
      moved = true;
    }
  } finally {
    if (!moved) await rm(temp, { force: true });
  }
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
  const managed = await registeredPaths(root, lock.entries);
  const sourceKeys = await pathKeys(resolve(source));

  // Preflight every destination before making changes. No force option: local edits
  // and installations managed by other tools must be preserved.
  for (const plan of plans) {
    if (overlaps(join(root, lockName), resolve(root, plan.directory))) {
      throw new Error('Installation destination would overlap the installation manifest');
    }
    plan.target = await safePath(root, plan.directory);
    const keys = await pathKeys(plan.target);
    if (keysOverlap(sourceKeys, keys)) throw new Error('Installation destinations must not overlap the source skills');
    plan.previous = findPrevious(managed, keys, plan.target, command);
    if (plan.previous) {
      plan.directory = plan.previous.directory;
      plan.target = await safePath(root, plan.directory);
    }
    plan.exists = Boolean(await stat(plan.target));
    if (plan.exists) {
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
  // Keep the previous directory until its manifest change has been committed.
  for (const plan of plans) {
    if (command !== 'remove' && plan.exists && plan.hash === plan.previous.hash) continue;
    const staging = `${plan.target}.${randomUUID()}.tmp`;
    const backup = `${plan.target}.${randomUUID()}.backup`;
    const parent = dirname(plan.target);
    let firstCreated;
    let saved = false;
    let installed = false;
    let committed = false;
    let previous = plan.previous;
    try {
      if (command !== 'remove') {
        firstCreated = await mkdir(parent, { recursive: true });
        if (firstCreated && (await stat(join(root, lockName)))?.isDirectory()) {
          throw new Error('Installation destination would overlap the installation manifest');
        }
        await mkdir(staging);
        for (const [key, bytes] of Object.entries(plan.files)) {
          const file = contained(staging, key);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, bytes, { flag: 'wx' });
        }
      }
      if (plan.exists) {
        await rename(plan.target, backup);
        saved = true;
      }
      if (command !== 'remove') {
        await rename(staging, plan.target);
        installed = true;
        if (!plan.exists) {
          // New directories can make previously missing registrations resolve to the same path.
          const paths = await registeredPaths(root, lock.entries);
          previous = findPrevious(paths, await pathKeys(plan.target), plan.target, command);
        }
      }
      const entries = [...lock.entries];
      const index = entries.indexOf(previous);
      if (command === 'remove') entries.splice(index, 1);
      else if (previous) entries[index] = { ...previous, hash: plan.hash };
      else entries.push({ name: plan.name, directory: plan.directory, hash: plan.hash });
      await atomicJson(root, lockName, { ...lock, entries });
      lock.entries = entries;
      if (previous) plan.directory = previous.directory;
      committed = true;
    } catch (error) {
      if (installed) await rm(plan.target, { recursive: true, force: true });
      if (saved) await rename(backup, plan.target);
      throw error;
    } finally {
      if (command !== 'remove' && !installed) await rm(staging, { recursive: true, force: true });
      if (!committed && firstCreated) await removeEmptyParents(parent, firstCreated);
    }
    if (saved) {
      try { await rm(backup, { recursive: true, force: true }); }
      catch (error) { process.emitWarning(`Could not clean up skill backup at ${backup}: ${error.message}`); }
    }
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
