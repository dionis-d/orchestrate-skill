#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { agents, manage, inspect } from '../lib/manager.mjs';

const help = `workflow-skills [add|list|check|update|remove] [options]

With no command, opens an interactive menu. add/install installs ship-change.
  --project <path>     Target project (default: current directory)
  --global             Use your home directory
  --agent <a,b>        codex/openai, claude-code/claude, zcode, opencode
  --skill <a,b>        Select names for add, update, or remove (default: all applicable)
  --skills-dir <path>  Relative discovery directory for another harness
  --yes, -y           Non-interactive mode; accepts displayed default selections
  --dry-run           Show add/update/remove plan without writing files
  --help, -h          Show help

Uses editable copies. Refuses unmanaged files, modified skills, and symlink paths.
Update uses this checkout/package's source; refresh the checkout before updating.
list/check/update/remove manage this installer's manifest, not skills CLI installs.`;

async function main() {
  const argv = process.argv.slice(2);
  const options = {};
  let command;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (['--help', '-h'].includes(arg)) { console.log(help); return; }
    if (['--yes', '-y', '--global', '--dry-run'].includes(arg)) { options[arg === '-y' ? '--yes' : arg] = true; continue; }
    if (['--project', '--agent', '--skill', '--skills-dir'].includes(arg)) {
      if (!argv[i + 1] || argv[i + 1].startsWith('-')) throw new Error(`Missing value for ${arg}`);
      if (options[arg]) throw new Error(`Duplicate option ${arg}`);
      options[arg] = argv[++i]; continue;
    }
    if (arg.startsWith('-') || command) throw new Error(`Unexpected argument: ${arg}`);
    command = arg;
  }
  if (options['--global'] && options['--project']) throw new Error('Choose --global or --project');
  const interactive = !options['--yes'] && stdin.isTTY && stdout.isTTY;
  let rl;
  const ask = async (question, fallback) => {
    if (options['--yes']) return fallback;
    if (!interactive) throw new Error('Interactive input requires a terminal. Use --yes and explicit options for automation.');
    rl ??= createInterface({ input: stdin, output: stdout });
    const answer = (await rl.question(`${question} [${fallback}]: `)).trim();
    return answer || fallback;
  };
  try {
    command ??= options['--yes'] ? 'add' : await ask('Command: add, list, check, update, remove', 'add');
    if (command === 'install') command = 'add';
    if (!['add', 'list', 'check', 'update', 'remove'].includes(command)) throw new Error(`Unknown command: ${command}`);
    if (options['--agent'] && options['--skills-dir']) throw new Error('Choose --agent or --skills-dir, not both');
    if (command !== 'add' && (options['--agent'] || options['--skills-dir'])) throw new Error('--agent and --skills-dir apply only to add; use --skill to select managed entries');
    let global = Boolean(options['--global']);
    if (interactive && command === 'add' && !options['--global'] && !options['--project']) {
      const scope = await ask('Scope: project or global', 'project');
      if (!['project', 'global'].includes(scope)) throw new Error('Scope must be project or global');
      global = scope === 'global';
    }
    const root = global ? homedir() : resolve(options['--project'] ?? process.cwd());
    if (command === 'list' || command === 'check') {
      const rows = await inspect(root);
      console.log(rows.length ? rows.map(row => `${row.name}\t${row.directory}\t${row.status}`).join('\n') : 'No skills managed here by workflow-skills.');
      if (command === 'check' && rows.some(row => row.status !== 'current')) process.exitCode = 1;
      return;
    }
    const split = value => value.split(',').map(x => x.trim()).filter(Boolean);
    const names = options['--skill'] ? split(options['--skill']) : undefined;
    let agentNames = options['--agent'] ? split(options['--agent']) : Object.keys(agents);
    if (interactive && command === 'add' && !options['--agent'] && !options['--skills-dir']) {
      agentNames = split(await ask('Agents (comma separated)', Object.keys(agents).join(',')));
    }
    const args = { command, root, names, agentNames, skillsDir: options['--skills-dir'] };
    const plan = await manage({ ...args, dryRun: true });
    console.log(`${command} in ${root}:\n${plan.map(row => `  ${row.directory}`).join('\n') || '  No managed entries selected.'}`);
    if (options['--dry-run'] || !plan.length) return;
    if (!options['--yes']) {
      if ((await ask('Apply this plan? yes/no', 'no')).toLowerCase() !== 'yes') { console.log('Cancelled.'); return; }
    }
    await manage(args);
    console.log(`Completed ${command}: ${plan.length} skill directories. Restart/refresh your agent to discover them.`);
  } finally { rl?.close(); }
}

main().catch(error => { console.error(`workflow-skills: ${error.message}`); process.exitCode = 1; });
