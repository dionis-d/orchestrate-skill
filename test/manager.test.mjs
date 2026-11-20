import test from 'node:test';
import assert from 'node:assert/strict';
import fs, { mkdtemp, mkdir, writeFile, readFile, rename, rm, access, symlink, utimes, stat, realpath } from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { manage, inspect, readLock, configure, sourceRoot } from '../lib/manager.mjs';

const exec = promisify(execFile);
async function fixture(t) {
  const temp = await mkdtemp(join(await realpath(tmpdir()), 'workflow-skills-test-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const root = join(temp, 'project with spaces');
  const source = join(temp, 'source');
  await mkdir(root);
  await mkdir(join(source, 'demo', 'references'), { recursive: true });
  await writeFile(join(source, 'demo', 'SKILL.md'), '---\nname: demo\ndescription: Test fixture\n---\nVersion one\n');
  await writeFile(join(source, 'demo', 'references', 'guide.md'), 'Behavior guide\n');
  return { root, source, temp };
}

test('default installation copies references, deduplicates shared harness path, and is idempotent', async t => {
  const f = await fixture(t);
  const result = await manage({ ...f, command: 'add' });
  assert.equal(result.length, 3);
  for (const row of result) assert.equal(await readFile(join(f.root, row.directory, 'references', 'guide.md'), 'utf8'), 'Behavior guide\n');
  assert.equal((await readLock(f.root)).entries.length, 3);
  await manage({ ...f, command: 'add' });
  assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), ['current', 'current', 'current']);
});

test('update detects new source, replaces owned copy, and removes obsolete reference', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', agentNames: ['openai'] });
  await writeFile(join(f.source, 'demo', 'SKILL.md'), 'Version two');
  await rm(join(f.source, 'demo', 'references', 'guide.md'));
  assert.equal((await inspect(f.root, f.source))[0].status, 'update available');
  await manage({ ...f, command: 'update' });
  assert.equal(await readFile(join(f.root, '.agents/skills/demo/SKILL.md'), 'utf8'), 'Version two');
  await assert.rejects(access(join(f.root, '.agents/skills/demo/references/guide.md')));
  assert.equal((await inspect(f.root, f.source))[0].status, 'current');
});

test('modified copies block update and removal without losing edits', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', agentNames: ['claude'] });
  const path = join(f.root, '.claude/skills/demo/SKILL.md');
  await writeFile(path, 'User changes');
  assert.equal((await inspect(f.root, f.source))[0].status, 'modified');
  for (const command of ['update', 'remove', 'add']) await assert.rejects(manage({ ...f, command, agentNames: ['claude'] }), /Locally modified/);
  assert.equal(await readFile(path, 'utf8'), 'User changes');
});

test('unmanaged collision preflights the whole batch before writing', async t => {
  const f = await fixture(t);
  await mkdir(join(f.root, '.zcode/skills/demo'), { recursive: true });
  await writeFile(join(f.root, '.zcode/skills/demo/SKILL.md'), 'Other installer');
  await assert.rejects(manage({ ...f, command: 'add' }), /unmanaged/);
  await assert.rejects(access(join(f.root, '.agents/skills/demo')));
});

test('remove preserves unrelated skills and configuration', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', agentNames: ['zcode'] });
  await mkdir(join(f.root, '.zcode/skills/unrelated'));
  await writeFile(join(f.root, '.zcode/skills/unrelated/SKILL.md'), 'Keep');
  await configure(f.root, { gateCommands: ['make check'] });
  await manage({ ...f, command: 'remove' });
  assert.equal((await readLock(f.root)).entries.length, 0);
  assert.equal(await readFile(join(f.root, '.zcode/skills/unrelated/SKILL.md'), 'utf8'), 'Keep');
  assert.deepEqual(JSON.parse(await readFile(join(f.root, '.workflow-skills.json'), 'utf8')).gateCommands, ['make check']);
});

test('dry run does not create installation or manifest', async t => {
  const f = await fixture(t);
  assert.equal((await manage({ ...f, command: 'add', dryRun: true })).length, 3);
  await assert.rejects(access(join(f.root, '.workflow-skills-lock.json')));
  await assert.rejects(access(join(f.root, '.agents')));
});

test('rejects traversal, absolute external destinations, unknown names and agents', async t => {
  const f = await fixture(t);
  for (const skillsDir of ['../outside', join(f.temp, 'outside')]) await assert.rejects(manage({ ...f, command: 'add', skillsDir }), /inside/);
  await assert.rejects(manage({ ...f, command: 'add', names: ['../demo'] }), /Invalid/);
  await assert.rejects(manage({ ...f, command: 'add', names: ['missing'] }), /available/);
  await assert.rejects(manage({ ...f, command: 'add', agentNames: ['unknown'] }), /Unknown agent/);
});

test('custom harness directory works without creating default harness paths', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', skillsDir: '.custom/skills' });
  await access(join(f.root, '.custom/skills/demo/SKILL.md'));
  await assert.rejects(access(join(f.root, '.agents')));
});

test('symlink or junction destination cannot redirect installation outside project', async t => {
  const f = await fixture(t);
  const outside = join(f.temp, 'outside');
  await mkdir(outside);
  await symlink(outside, join(f.root, '.agents'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(manage({ ...f, command: 'add', agentNames: ['codex'] }), /symbolic link/);
  await assert.rejects(access(join(outside, 'skills')));
});

test('malformed manifest paths cannot escape managed root', async t => {
  const f = await fixture(t);
  await writeFile(join(f.root, '.workflow-skills-lock.json'), JSON.stringify({ version: 1, entries: [{ name: 'demo', directory: '../demo', hash: 'a'.repeat(64) }] }));
  await assert.rejects(manage({ ...f, command: 'remove' }), /inside/);
});

test('missing managed directory is reported and can be restored by update', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', agentNames: ['codex'] });
  await rm(join(f.root, '.agents/skills/demo'), { recursive: true });
  assert.equal((await inspect(f.root, f.source))[0].status, 'missing');
  await manage({ ...f, command: 'update' });
  assert.equal((await inspect(f.root, f.source))[0].status, 'current');
});

test('configuration refuses to overwrite existing project choices', async t => {
  const f = await fixture(t);
  await configure(f.root, { baseBranch: 'develop' });
  await assert.rejects(configure(f.root, { baseBranch: 'main' }), /already exists/);
  assert.equal(JSON.parse(await readFile(join(f.root, '.workflow-skills.json'), 'utf8')).baseBranch, 'develop');
});

test('exclusive install guard refuses concurrent writes', async t => {
  const f = await fixture(t);
  await writeFile(join(f.root, '.workflow-skills-installing'), 'other process');
  await assert.rejects(manage({ ...f, command: 'add' }), /Another installation/);
  assert.equal(await readFile(join(f.root, '.workflow-skills-installing'), 'utf8'), 'other process');
});

test('real CLI installs all four skills, checks them, and removes a selected skill', async t => {
  const f = await fixture(t);
  const cli = resolve('bin/workflow-skills.mjs');
  await exec(process.execPath, [cli, 'add', '--project', f.root, '--agent', 'codex,zcode', '--yes']);
  const rows = await inspect(f.root, sourceRoot);
  assert.equal(rows.length, 8);
  assert.ok(rows.every(row => row.status === 'current'));
  await exec(process.execPath, [cli, 'check', '--project', f.root]);
  await exec(process.execPath, [cli, 'remove', '--project', f.root, '--skill', 'orchestrate', '--yes']);
  assert.equal((await inspect(f.root)).length, 6);
});

test('real CLI installs ship-change by itself into a BB skill directory', async t => {
  const f = await fixture(t);
  const cli = resolve('bin/workflow-skills.mjs');
  await exec(process.execPath, [cli, 'add', '--project', f.root, '--skills-dir', '.bb/skills', '--skill', 'ship-change', '--yes']);
  const rows = await inspect(f.root, sourceRoot);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].directory, '.bb/skills/ship-change');
  assert.equal(rows[0].status, 'current');
});

test('CLI fails on missing option values, conflicting scope, and unexpected input', async () => {
  const cli = resolve('bin/workflow-skills.mjs');
  for (const args of [['add', '--project'], ['add', '--global', '--project', '.'], ['add', '--bogus']]) {
    await assert.rejects(exec(process.execPath, [cli, ...args]), error => error.code === 1);
  }
});

test('custom destination cannot nest inside a source skill', async t => {
  const f = await fixture(t);
  const nestedSource = join(f.root, 'source');
  await mkdir(join(nestedSource, 'demo'), { recursive: true });
  await writeFile(join(nestedSource, 'demo/SKILL.md'), 'Original source');
  await assert.rejects(manage({ ...f, source: nestedSource, command: 'add', skillsDir: 'source/demo' }), /overlap.*source/i);
  await assert.rejects(access(join(nestedSource, 'demo/demo')));
});

test('removal works after the source checkout is no longer available', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', agentNames: ['codex'] });
  await rm(f.source, { recursive: true });
  await manage({ ...f, command: 'remove' });
  assert.equal((await readLock(f.root)).entries.length, 0);
  await assert.rejects(access(join(f.root, '.agents/skills/demo')));
});

test('concurrent project setup preserves exactly one caller configuration', async t => {
  const f = await fixture(t);
  const results = await Promise.allSettled([
    configure(f.root, { baseBranch: 'first' }),
    configure(f.root, { baseBranch: 'second' }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  const config = JSON.parse(await readFile(join(f.root, '.workflow-skills.json'), 'utf8'));
  assert.ok(['first', 'second'].includes(config.baseBranch));
});

test('CLI supports unattended project setup and refuses conflicting destinations', async t => {
  const f = await fixture(t);
  const cli = resolve('bin/workflow-skills.mjs');
  await exec(process.execPath, [cli, 'init', '--project', f.root, '--yes']);
  const config = JSON.parse(await readFile(join(f.root, '.workflow-skills.json'), 'utf8'));
  assert.equal(config.endgame, 'local-branches');
  assert.deepEqual(config.gateCommands, []);
  await assert.rejects(exec(process.execPath, [cli, 'add', '--project', f.root, '--agent', 'codex', '--skills-dir', '.custom/skills', '--yes']), error => error.code === 1);
});

test('custom destinations cannot overlap managed skills in either direction', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', skillsDir: 'outer/demo/inner' });
  for (const skillsDir of ['outer/demo/inner/demo', 'outer']) {
    for (const dryRun of [true, false]) {
      await assert.rejects(manage({ ...f, command: 'add', skillsDir, dryRun }), /overlap.*managed/i);
    }
  }
  assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), ['current']);
  await assert.rejects(access(join(f.root, 'outer/demo/inner/demo/demo')));
});

test('custom destinations cannot turn the installation manifest into a directory', async t => {
  const f = await fixture(t);
  const skillsDir = '.workflow-skills-lock.json/nested';
  await assert.rejects(manage({ ...f, command: 'add', skillsDir }), /overlap.*manifest/i);
  await assert.rejects(access(join(f.root, '.workflow-skills-lock.json')));
});

test('equivalent custom paths preserve the manifest spelling and skip identical writes', async t => {
  const f = await fixture(t);
  const skillsDir = 'Custom/skills';
  await manage({ ...f, command: 'add', skillsDir });
  const paths = [join(f.root, skillsDir, 'demo/SKILL.md'), join(f.root, '.workflow-skills-lock.json')];
  for (const path of paths) await utimes(path, 1234567890, 1234567890);
  const timestamps = await Promise.all(paths.map(async path => (await stat(path)).mtimeMs));
  const alias = process.platform === 'win32' ? 'custom/./SKILLS' : 'Custom/./skills';
  await manage({ ...f, command: 'add', skillsDir: alias });
  await manage({ ...f, command: 'update' });
  assert.deepEqual(await Promise.all(paths.map(async path => (await stat(path)).mtimeMs)), timestamps);
  assert.equal((await readLock(f.root)).entries[0].directory, 'Custom/skills/demo');

  await writeFile(join(f.source, 'demo/SKILL.md'), 'Version two');
  await manage({ ...f, command: 'add', skillsDir: alias });
  assert.equal(await readFile(paths[0], 'utf8'), 'Version two');
  assert.equal((await readLock(f.root)).entries[0].directory, 'Custom/skills/demo');
});

test('manifest rejects duplicate path aliases even when the directory is missing', async t => {
  const f = await fixture(t);
  const hash = 'a'.repeat(64);
  const first = { name: 'demo', directory: 'Custom/skills/demo', hash };
  const alias = process.platform === 'win32' ? 'custom/./SKILLS/demo' : 'Custom/./skills/demo';
  await writeFile(join(f.root, '.workflow-skills-lock.json'), JSON.stringify({
    version: 1, entries: [first, { ...first, directory: alias }],
  }));
  await assert.rejects(readLock(f.root), /duplicate installation path/);
});

test('a locally added __proto__ file blocks removal', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', skillsDir: 'custom' });
  const path = join(f.root, 'custom/demo/__proto__');
  await writeFile(path, 'Local file');
  await assert.rejects(manage({ ...f, command: 'remove' }), /Locally modified/);
  assert.equal(await readFile(path, 'utf8'), 'Local file');
});

test('manifest rename failure restores the skill for add, update, and remove', async t => {
  const f = await fixture(t);
  const manifest = join(f.root, '.workflow-skills-lock.json');
  const path = join(f.root, 'custom/demo/SKILL.md');
  const rename = fs.rename;
  let fail = true;
  const mocked = t.mock.method(fs, 'rename', (from, to) => {
    if (fail && to === manifest) throw new Error('Injected manifest rename failure');
    return rename(from, to);
  });
  syncBuiltinESMExports();
  t.after(() => { mocked.mock.restore(); syncBuiltinESMExports(); });

  const options = { ...f, skillsDir: 'custom' };
  await assert.rejects(manage({ ...options, command: 'add' }), /Injected manifest rename failure/);
  await assert.rejects(access(path));
  await assert.rejects(access(manifest));
  await assert.rejects(access(join(f.root, 'custom')), { code: 'ENOENT' });

  fail = false;
  await manage({ ...options, command: 'add' });
  const original = await readFile(path, 'utf8');
  const lock = await readFile(manifest, 'utf8');
  await writeFile(join(f.source, 'demo/SKILL.md'), 'Version two');
  fail = true;
  for (const command of ['update', 'remove']) {
    await assert.rejects(manage({ ...options, command }), /Injected manifest rename failure/);
    assert.equal(await readFile(path, 'utf8'), original);
    assert.equal(await readFile(manifest, 'utf8'), lock);
  }
});

test('case aliases cannot nest inside a managed skill on a case-insensitive filesystem', async t => {
  const f = await fixture(t);
  await manage({ ...f, command: 'add', skillsDir: 'Custom/skills' });
  const alias = join(f.root, 'custom/SKILLS/demo');
  if (!await stat(alias).catch(error => { if (error.code !== 'ENOENT') throw error; })) {
    return t.skip('Requires a case-insensitive fixture filesystem');
  }

  const skillsDir = 'custom/SKILLS/demo/new/child';
  await assert.rejects(manage({ ...f, command: 'add', skillsDir }), /overlap.*managed/i);
  assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), ['current']);
  await assert.rejects(access(join(alias, 'new')));
});

test('case-distinct managed paths work on a case-sensitive POSIX filesystem', async t => {
  if (process.platform === 'win32') return t.skip('Requires POSIX path handling');
  const f = await fixture(t);
  await manage({ ...f, command: 'add', skillsDir: 'Custom/skills' });
  if (await stat(join(f.root, 'custom')).catch(error => { if (error.code !== 'ENOENT') throw error; })) {
    return t.skip('Requires a case-sensitive fixture filesystem');
  }

  await manage({ ...f, command: 'add', skillsDir: 'custom/skills/demo/new/child' });
  assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), ['current', 'current']);
});

test('backup cleanup failure warns and preserves committed add, update, and remove', async t => {
  const f = await fixture(t);
  const options = { ...f, skillsDir: 'custom' };
  await manage({ ...options, command: 'add' });
  const pendingBackups = [];
  const remove = fs.rm;
  const mocked = t.mock.method(fs, 'rm', (path, options) => {
    if (path.endsWith('.backup')) {
      pendingBackups.push(path);
      throw new Error('Injected backup cleanup failure');
    }
    return remove(path, options);
  });
  syncBuiltinESMExports();
  t.after(() => { mocked.mock.restore(); syncBuiltinESMExports(); });
  const warn = t.mock.method(process, 'emitWarning', () => {});

  for (const command of ['add', 'update', 'remove']) {
    await writeFile(join(f.source, 'demo/SKILL.md'), command);
    assert.equal((await manage({ ...options, command })).length, 1);
    assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), command === 'remove' ? [] : ['current']);
    const backup = pendingBackups.at(-1);
    await access(join(backup, 'SKILL.md'));
    const [message] = warn.mock.calls.at(-1).arguments;
    assert.ok(message.includes(backup));
    assert.match(message, /Injected backup cleanup failure/);
  }
  assert.equal(warn.mock.callCount(), 3);
});

test('a missing skill restored through a case alias keeps one ownership entry', async t => {
  const f = await fixture(t);
  const original = { ...f, command: 'add', skillsDir: 'Custom/skills' };
  await manage(original);
  if (!await stat(join(f.root, 'custom')).catch(error => { if (error.code !== 'ENOENT') throw error; })) {
    return t.skip('Requires a case-insensitive fixture filesystem');
  }
  const moved = join(f.temp, 'moved');
  await rename(join(f.root, 'Custom'), moved);

  const result = await manage({ ...original, skillsDir: 'custom/SKILLS' });
  assert.deepEqual(result, [{ name: 'demo', directory: 'Custom/skills/demo' }]);
  const rows = await inspect(f.root, f.source);
  assert.deepEqual(rows.map(({ directory, status }) => [directory, status]), [['Custom/skills/demo', 'current']]);
  await manage({ ...f, command: 'update' });
  await manage({ ...f, command: 'remove' });
  await access(join(moved, 'skills/demo/SKILL.md'));
  assert.deepEqual((await readLock(f.root)).entries, []);
});

test('rejected case aliases leave missing registered paths missing', async t => {
  for (const [registered, skillsDir] of [
    ['Custom/skills', 'custom/SKILLS/demo/new/child'],
    ['Custom/demo/Inner', 'custom'],
  ]) {
    const f = await fixture(t);
    await manage({ ...f, command: 'add', skillsDir: registered });
    if (!await stat(join(f.root, 'custom')).catch(error => { if (error.code !== 'ENOENT') throw error; })) {
      return t.skip('Requires a case-insensitive fixture filesystem');
    }
    await rename(join(f.root, 'Custom'), join(f.temp, 'moved'));
    const manifest = join(f.root, '.workflow-skills-lock.json');
    const original = await readFile(manifest, 'utf8');

    await assert.rejects(manage({ ...f, command: 'add', skillsDir }), /overlap.*managed/i);
    await assert.rejects(access(join(f.root, 'Custom')), { code: 'ENOENT' });
    assert.equal(await readFile(manifest, 'utf8'), original);
    assert.deepEqual((await inspect(f.root, f.source)).map(row => row.status), ['missing']);
  }
});

test('a case alias cannot turn the missing manifest into a directory', async t => {
  const f = await fixture(t);
  await mkdir(join(f.root, 'CaseProbe'));
  if (!await stat(join(f.root, 'caseprobe')).catch(error => { if (error.code !== 'ENOENT') throw error; })) {
    return t.skip('Requires a case-insensitive fixture filesystem');
  }

  const skillsDir = '.Workflow-Skills-Lock.JSON/nested/skills';
  await assert.rejects(manage({ ...f, command: 'add', skillsDir }), /overlap.*manifest/i);
  await assert.rejects(access(join(f.root, '.workflow-skills-lock.json')), { code: 'ENOENT' });
  await manage({ ...f, command: 'add', skillsDir: 'custom' });
  assert.equal((await readLock(f.root)).entries.length, 1);
});
