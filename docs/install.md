# Install the skills in a project

This guide installs `orchestrate`, `development-testing`, and `release-gate` for Codex, Claude Code, ZCode, or OpenCode. No project configuration is required.

## Fastest option: one command

For Codex, Claude Code, or OpenCode, open a terminal **in your target project's root** and run:

```sh
npx skills@latest add dionis-d/orchestrate-skill
```

Choose your skills and agent at the prompts, then restart or refresh the agent. This command downloads the skills directly; you can skip the cloning steps below.

To install all three skills for Codex without prompts:

```sh
npx --yes skills@latest add dionis-d/orchestrate-skill --skill '*' --agent codex --yes
```

Replace `codex` with `claude-code` or `opencode` to choose one of those agents. Manage these installations from the target project with `npx skills@latest list`, `npx skills@latest update`, and `npx skills@latest remove`. See the [skills CLI documentation](https://github.com/vercel-labs/skills) for all supported agents and options.

For ZCode, offline use, or custom harness directories, follow the local-installer steps below. Keep using the manager that installed each copy.

## 1. Check prerequisites

Open a terminal and run:

```sh
node --version
git --version
```

Use Node.js 22 or newer. If either command is unavailable, install that tool before continuing.

## 2. Download this repository

Clone the skills repository and open its folder:

```sh
git clone https://github.com/dionis-d/orchestrate-skill.git workflow-skills
cd workflow-skills
```

If you already have a clone, open a terminal in that clone instead.

## 3. Choose the project to receive the skills

Use the root folder of your existing project. For example, if the folders are next to each other:

```text
workspace/
  workflow-skills/    Run the installer here
  my-project/        Install the skills here
```

Run this command **from `workflow-skills`**:

```sh
node bin/workflow-skills.mjs add --project "../my-project"
```

Replace `../my-project` with your project's actual relative or absolute path. Keep quotes around paths containing spaces. Verify that this path points to the intended project root before confirming installation.

## 4. Answer the installer prompts

1. **Skills:** press Enter to install all three, or type names separated by commas, such as `development-testing,release-gate`.
2. **Agents:** type the agent you use from the table below. For several agents, separate their names with commas. Press Enter to select all four.
3. **Confirmation:** check that the displayed paths belong to the intended project, then type `yes`.

| Agent | Name to enter | Installed project directory |
| --- | --- | --- |
| OpenAI Codex | `codex` | `.agents/skills` |
| Claude Code | `claude-code` | `.claude/skills` |
| ZCode | `zcode` | `.zcode/skills` |
| OpenCode | `opencode` | `.agents/skills` |

If you use only OpenCode, select `opencode` alone. Codex and OpenCode share the same directory. Installation preserves existing unmanaged or modified skills and reports a conflict rather than overwriting them.

## 5. Verify the installation

From the same terminal, run:

```sh
node bin/workflow-skills.mjs list --project "../my-project"
node bin/workflow-skills.mjs check --project "../my-project"
```

Use the same target path as before. The selected skills should appear with status `current`. If the list is empty, confirm the target path and repeat installation. These commands verify copied files; the next step confirms the agent can load them.

## 6. Open the project in your agent

Restart or refresh the agent and open the target project. In ZCode, use **Settings → Skills → Refresh** and enable the installed skills.

Select `development-testing` from the agent's skills menu, or ask:

```text
Use development-testing to plan verification for my next code change.
```

Codex and ZCode support `$development-testing`; Claude Code uses `/development-testing`. In OpenCode, ask the agent to load the skill through its skill tool.

Installation is complete when the agent can load the selected skill.

## Other options

- **Install from GitHub with the skills CLI:** see [alternative installer](guide.md#alternative-skills-cli). Use one manager per installation.
- **Install once for your user, update, or remove skills:** see [the full usage guide](guide.md).
- **Skill missing or installation refused:** see [troubleshooting](guide.md#troubleshooting).
