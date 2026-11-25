# Installation and usage guide

For a first installation, follow the shorter [installation walkthrough](install.md). This page covers additional options and ongoing management.

Install `ship-change` to use the delivery workflow in any supported repository.

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
node bin/workflow-skills.mjs add --project ../my-project --skill ship-change
```

The installer asks for:

1. Agents: accept all four or enter a comma-separated subset.
2. Confirmation: inspect the displayed destinations, then type `yes` to apply.

It copies the skill instructions, references, metadata, and license. It records ownership in the target project's `.workflow-skills-lock.json`. Existing unmanaged or edited copies are preserved: a collision stops installation.

To install for Codex only:

```sh
node bin/workflow-skills.mjs add --project ../my-project --agent codex
```

For automation, inspect a plan first, then apply it without prompting:

```sh
node bin/workflow-skills.mjs add --project ../my-project --skill ship-change --agent codex --dry-run
node bin/workflow-skills.mjs add --project ../my-project --skill ship-change --agent codex --yes
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
| Codex | `.agents/skills` | `$ship-change` |
| Claude Code | `.claude/skills` | `/ship-change` |
| ZCode | `.zcode/skills` | `$ship-change` |
| OpenCode | `.agents/skills` | Ask the agent to load `ship-change` through its skill tool |

Codex and OpenCode share a single copy. OpenCode also reads Claude-compatible directories, so selecting both Codex and Claude can expose the same skill name through multiple sources. Select only OpenCode when installing for OpenCode alone.

## 4. Use ship-change

Clients that allow automatic skill activation may choose `ship-change` for matching delivery requests. To select it yourself, ask, “Use ship-change to implement this fix and prepare a verified PR.”

### Delivery workflow

1. Set the scope from the request and repository instructions. Find the base revision, acceptance criteria, and approved delivery steps. Identify checks in project scripts, hooks, and CI.
2. Make the change. Do focused checks. If the coordinator delegates, give each worker one task with acceptance criteria. If workers work at the same time, use isolated writable workspaces. Integrate the changes on one branch. Each worker reports the revision, focused checks, results, and missing evidence.
3. Review the integrated change against the request and repository rules. If the repository rules or risk make independent review necessary, get independent review. Correct important defects. Get results for all necessary checks on the integrated revision. If check records agree with the rules for the step, candidate, test scope, inputs, and environment, use them again.
4. Deliver through the last approved step. Report the revision, review result, check results, and missing evidence.

In BB, the parent thread is responsible for integration, final checks, and delivery. It gives one task with acceptance criteria to each implementation child thread. Workers do independent tasks at the same time. Before any PR, get independent review in a separate thread. This rule also applies to draft PRs. The reviewer examines the integrated diff and how the changes work together.

In BB, the reviewer gives one report with all problems that you must correct. For each problem, the report gives the expected behavior and a check for the correction. If possible, use a focused check that fails before the correction and passes after it. The reviewer examines the corrections and all other edits since the last review. The review includes the behavior that these edits can change. If an earlier review result changes, include the related changes and behavior in the review scope. Continue until there are no problems that you must correct.

In BB, complete the review and corrections first. Then do the full set of necessary repository checks once on the final PR revision. If the revision or test inputs change, do the applicable review again. Do the checks for those changes and the checks that the repository rules specify again. If a check needs a PR, do the check after you open the PR. See [candidate checks](../skills/ship-change/references/verification.md) for clean commit checks and test resources.

In BB, use one PR for the full parent task. If the user gave standing approval for routine pushes and PRs, use it within the approved scope. Before external operations, examine scripts and remote triggers for effects on other systems. Get approval for effects outside the approved scope. Get approval for merge and deployment.

On other clients, the active project workflow or session can coordinate the work. If the client has a specialist for a phase with no worker, use that specialist.

If the repository and user let you, use [ASD-STE100 Issue 9](../skills/ship-change/references/technical-english.md) for new or changed English technical text. Keep the specified templates, commands, names, and quotations.

## 5. Update or remove copies

The bundled installer updates from its local source. From an unmodified skills clone, refresh the source with a fast-forward pull and list the managed copies:

```sh
git pull --ff-only
node bin/workflow-skills.mjs list --project ../my-project
```

If you installed an earlier version, remove the retired copies with the installer that added them. For the bundled installer, run this command with the retired names shown in `list`:

```sh
node bin/workflow-skills.mjs remove --project ../my-project --skill orchestrate,development-testing,release-gate
```

If a retired copy has local edits, the installer preserves it. You can still install or update `ship-change` by name. If you used `.workflow-skills.json`, move any preferences you want to keep into the repository's existing instructions.

If `list` shows no managed copy of `ship-change`, install it in the same scope. For a project installation, use:

```sh
node bin/workflow-skills.mjs add --project ../my-project --skill ship-change
```

If `list` shows a managed copy of `ship-change`, use:

```sh
node bin/workflow-skills.mjs update --project ../my-project --skill ship-change --dry-run
node bin/workflow-skills.mjs update --project ../my-project --skill ship-change
```

After installation or update, check the managed copies:

```sh
node bin/workflow-skills.mjs check --project ../my-project
```

If the clone has local edits or diverged history, resolve those before pulling. Back up custom skill edits before updating their installed copies. If a retired copy remains in the installation, `check` reports it as modified or unavailable.

Remove one skill from its recorded destinations:

```sh
node bin/workflow-skills.mjs remove --project ../my-project --skill ship-change
```

Omit `--skill` to remove every copy managed by this installer in the chosen scope. Removal preserves unrelated skills and project configuration. Add `--yes` only when the intended removal is already explicit.

## Other installation options

**Short command.** From the skills clone, install the CLI onto your command path:

```sh
npm install --global .
workflow-skills add --project ../my-project --skill ship-change
```

This installs the CLI from source, not the skills themselves. It does not require an npm registry release. If the global prefix is not writable, use the direct `node` commands above or configure a writable npm prefix. After updating the clone, reinstall the CLI if your npm installation uses a separate copy.

**User-wide skills.** To make skills available to your local projects:

```sh
node bin/workflow-skills.mjs add --global --skill ship-change
node bin/workflow-skills.mjs list --global
```

Use `--global` consistently for checking, updating, and removing those copies. Codex/OpenCode use `~/.agents/skills`, Claude Code uses `~/.claude/skills`, and ZCode uses `~/.zcode/skills`. Local user directories are not automatically available in remote or cloud workspaces.

**BB across projects.** From the skills clone, install into BB's default user skills directory:

```sh
node bin/workflow-skills.mjs add --global --skills-dir .bb/skills --skill ship-change
```

Start a new BB thread in any project and select `/ship-change`. If your BB data directory is customized, use `--project <BB-data-directory> --skills-dir skills` in place of `--global --skills-dir .bb/skills` and use that `--project` path to manage the copy.

**Another harness.** Choose its documented discovery directory:

```sh
node bin/workflow-skills.mjs add --project ../my-project --skills-dir .other-agent/skills --skill ship-change
```

Use either `--agent` or `--skills-dir`. The destination must be inside the target project and must not overlap the source skills. Other harnesses must support standard skill folders or explicitly read the entrypoint; copying files alone cannot add a missing capability.

## Alternative: skills CLI

The [skills CLI](https://github.com/vercel-labs/skills) provides interactive installation from GitHub and local sources. From the target project:

```sh
npx skills@latest add dionis-d/orchestrate-skill --skill ship-change
```

Choose agents and the offered installation method. For a local sibling clone, use `npx skills@latest add ../workflow-skills --skill ship-change`. For explicit ZCode support, use the bundled installer or ZCode's skill import feature; consult the CLI's current supported-agent list before selecting a harness.

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
