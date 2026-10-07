# Installation and usage guide

For a first installation, follow the shorter [installation walkthrough](install.md). This page covers additional options and ongoing management.

Start with the bundled installer if you want one workflow for Codex, Claude Code, ZCode, and OpenCode. Each skill can also be installed separately.

## 1. Prepare the two folders

You need Node.js 22 or newer, Git, a skills repository, and a target project. Check your tools:

```sh
node --version
git --version
```

The examples place the skills clone next to an existing project called `my-project`:

```text
workspace/
  workflow-skills/    Skills repository and installer
  my-project/        Project that will receive the skills
```

From the parent folder, clone the repository:

```sh
git clone https://github.com/dionis-d/orchestrate-skill.git workflow-skills
cd workflow-skills
```

Use the actual target path instead of `../my-project`. Relative paths are resolved from your terminal's current directory. Quote paths containing spaces. These commands work in PowerShell and common Unix shells; no machine-specific directory is required.

## 2. Install into the project

From the skills clone, run:

```sh
node bin/workflow-skills.mjs add --project ../my-project
```

The installer asks for:

1. Skill names: accept all three or enter a comma-separated subset.
2. Agents: accept all four or enter a comma-separated subset.
3. Confirmation: inspect the displayed destinations, then type `yes` to apply.

It copies the skill instructions, references, metadata, and license. It records ownership in the target project's `.workflow-skills-lock.json`. Existing unmanaged or edited copies are preserved: a collision stops installation.

To install only the testing skill for Codex, for example:

```sh
node bin/workflow-skills.mjs add --project ../my-project --agent codex --skill development-testing
```

For automation, inspect a plan first, then apply it without prompting:

```sh
node bin/workflow-skills.mjs add --project ../my-project --agent codex --dry-run
node bin/workflow-skills.mjs add --project ../my-project --agent codex --yes
```

Project installation is a good starting point when the skills should belong to one repository. To share them with teammates, review and commit the installed skill directories and this installer's lockfile. A user-wide installation is available under [other installation options](#other-installation-options).

## 3. Confirm discovery

```sh
node bin/workflow-skills.mjs list --project ../my-project
node bin/workflow-skills.mjs check --project ../my-project
```

`list` shows managed copies and their status. `check` exits zero when all managed copies match this clone's source; it exits 1 for modified, missing, outdated, or unavailable-source entries. An empty managed list means this installer has nothing to check, not that the agent discovered the skills.

Restart or refresh the agent, open the target project, and look for the installed names in its skill selector. In ZCode, refresh Settings → Skills and confirm the enable switches are on.

| Agent | Project directory | Invocation |
| --- | --- | --- |
| Codex | `.agents/skills` | `$development-testing` |
| Claude Code | `.claude/skills` | `/development-testing` |
| ZCode | `.zcode/skills` | `$development-testing` |
| OpenCode | `.agents/skills` | Ask the agent to load `development-testing` through its skill tool |

Codex and OpenCode share a single copy. OpenCode also reads Claude-compatible directories, so selecting both Codex and Claude can expose the same skill name through multiple sources. Select only OpenCode when installing for OpenCode alone.

## 4. Use the skills

Choose the skill that matches the task. You do not have to run all three in sequence.

| Task | Example request |
| --- | --- |
| Implement several independent tasks | “Use orchestrate for these tickets. Keep reviewed branches local for now.” |
| Develop or review a behavior change | “Use development-testing to verify this fix, including a regression for the reported failure.” |
| Check the final result | “Use release-gate to run this project's required checks and report any missing evidence.” |

Include acceptance criteria and relevant task paths. Skills follow project instructions and discover the project's commands. If the harness cannot run isolated workers, orchestration runs sequentially. A skill can report blocked or incomplete verification when a required service or platform is unavailable.

## 5. Update or remove copies

The bundled installer updates from its local source; it does not download changes. From an unmodified skills clone, refresh the source with a fast-forward pull, then inspect and update the target:

```sh
git pull --ff-only
node bin/workflow-skills.mjs check --project ../my-project
node bin/workflow-skills.mjs update --project ../my-project --dry-run
node bin/workflow-skills.mjs update --project ../my-project
```

If `check` reports an update, its nonzero exit is expected; run the following commands separately rather than chaining them with `&&`. If the clone has local edits or diverged history, resolve those before pulling. Back up custom skill edits before updating their installed copies; the installer refuses to overwrite modified files.

Remove one skill from its recorded destinations:

```sh
node bin/workflow-skills.mjs remove --project ../my-project --skill release-gate
```

Omit `--skill` to remove every copy managed by this installer in the chosen scope. Removal preserves unrelated skills and project configuration. Add `--yes` only when the intended removal is already explicit.

## Other installation options

**Short command.** From the skills clone, install the CLI onto your command path:

```sh
npm install --global .
workflow-skills add --project ../my-project
```

This installs the CLI from source, not the skills themselves. It does not require an npm registry release. If the global prefix is not writable, use the direct `node` commands above or configure a writable npm prefix. After updating the clone, reinstall the CLI if your npm installation uses a separate copy.

**User-wide skills.** To make skills available to your local projects:

```sh
node bin/workflow-skills.mjs add --global
node bin/workflow-skills.mjs list --global
```

Use `--global` consistently for checking, updating, and removing those copies. Codex/OpenCode use `~/.agents/skills`, Claude Code uses `~/.claude/skills`, and ZCode uses `~/.zcode/skills`. Local user directories are not automatically available in remote or cloud workspaces.

**Another harness.** Choose its documented discovery directory:

```sh
node bin/workflow-skills.mjs add --project ../my-project --skills-dir .other-agent/skills
```

Use either `--agent` or `--skills-dir`. The destination must be inside the target project and must not overlap the source skills. Other harnesses must support standard skill folders or explicitly read the entrypoint; copying files alone cannot add a missing capability.

## Optional project preferences

```sh
node bin/workflow-skills.mjs init --project ../my-project
```

This creates `.workflow-skills.json` without overwriting an existing file. You can edit it and commit it with the target project:

```json
{
  "version": 1,
  "baseBranch": "develop",
  "taskSource": "docs/tickets",
  "gateCommands": ["make check"],
  "endgame": "local-branches"
}
```

Replace these examples with actual project choices. Omit `baseBranch` for discovery and leave `gateCommands` empty to discover checks from project instructions and CI. The installer never runs these commands. Preferences do not authorize publishing, merging, or deployment; explicit user instructions and repository rules take precedence.

## Alternative: skills CLI

The [skills CLI](https://github.com/vercel-labs/skills) provides interactive installation from GitHub and local sources. From the target project:

```sh
npx skills@latest add dionis-d/orchestrate-skill
```

Choose skills, agents, and the offered installation method. For a local sibling clone, use `npx skills@latest add ../workflow-skills`. For explicit ZCode support, use the bundled installer or ZCode's skill import feature; consult the CLI's current supported-agent list before selecting a harness.

Manage this installation with the same CLI:

```sh
npx skills@latest list
npx skills@latest check
npx skills@latest update
npx skills@latest remove
```

This manager handles its own sources and lockfile. The bundled installer's `update` uses local source files and its separate ownership manifest. Do not use one manager to update or remove the other's installation, or install the same names into overlapping discovery locations with both managers.

## Troubleshooting

| Symptom | Next step |
| --- | --- |
| Skill absent from the selector | Confirm target directory and installed files, then refresh/restart the agent. Check the harness's supported discovery path and permissions. |
| Interactive input requires a terminal | Run in an interactive terminal, or provide explicit choices and `--yes` for unattended execution. |
| Existing unmanaged skill | Identify the manager or manual copy that owns it. Keep that installation or back it up and relocate it before installing here. |
| Locally modified skill | Preserve your edits, compare with the source, then decide how to reconcile them. The installer has no force-overwrite option. |
| Symbolic link or junction refused | Keep using the manager that created the links, or choose a regular directory for copied skills. |
| Another installation may be running | Wait for it to finish. After an interruption, confirm no installer is active before removing `.workflow-skills-installing` from the target root. |
| Update reports no changes | Refresh the source clone first and check that you chose the correct project/user scope. |

An interrupted multi-directory operation may leave some copies completed or a backup beside a skill directory. Preserve backups and inspect files and the manifest before retrying. The installer stages each directory and records ownership after replacement; it does not promise a transaction across all directories.
