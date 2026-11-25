# Ship a change

`ship-change` is an agent skill for implementing, reviewing, verifying, and delivering a repository change. It uses each repository's instructions, scripts, hooks, and CI.

## One-line installation

Open a terminal in the target project and run:

```sh
npx skills@latest add dionis-d/orchestrate-skill --skill ship-change
```

Select your agent at the prompts, then restart or refresh the agent. You do not need to clone the repository first. The [skills CLI](https://github.com/vercel-labs/skills) supports Codex, Claude Code, and OpenCode; use the local installer below for ZCode.

Manage this installation with `npx skills@latest list`, `npx skills@latest update`, and `npx skills@latest remove`. Use the same manager that installed the skills.

## Local installer (including ZCode)

**Follow the [step-by-step installation guide](docs/install.md)** for commands, prompts, and discovery checks.

Requires Node.js 22 or newer and Git to clone the repository. Replace `../my-project` with your target project's path.

```sh
git clone https://github.com/dionis-d/orchestrate-skill.git workflow-skills
cd workflow-skills
node bin/workflow-skills.mjs add --project ../my-project --skill ship-change
```

Select the agents you want, review the destinations, then type `yes` to install. Restart or refresh your agent afterward.

Confirm installation:

```sh
node bin/workflow-skills.mjs list --project ../my-project
```

Clients that allow automatic skill activation may select `ship-change` for matching requests. To invoke it explicitly, ask:

```text
Use ship-change to implement this fix and prepare a verified pull request.
```

For updates, removal, user-wide installation, and troubleshooting, read the [full usage guide](docs/guide.md). To use `ship-change` across BB projects, follow the [BB installation instructions](docs/guide.md#other-installation-options).

Choose one installer for each installation. The [full guide](docs/guide.md#alternative-skills-cli) explains how the two managers differ.

## How it works

One coordinator manages the change on one branch. The coordinator can make the change without workers. If the coordinator uses workers, each worker gets one task with acceptance criteria.

Before you open a pull request (PR), complete independent review. This rule also applies to draft PRs. After the applicable review and corrections, do the full set of necessary repository checks once on the last integrated revision. Do the [repository checks](skills/ship-change/SKILL.md#repository-checks) in the specified sequence. A request to "ship" gives approval to open one PR for the task or update its existing PR. If the user specifies a smaller scope, stay in that scope. See the [delivery workflow](docs/guide.md#delivery-workflow).

## Contributing

Run from this repository:

```sh
npm run check
npm pack --dry-run
```

Tests use disposable temporary projects. They check installer behavior; they do not prove agent behavior in every harness. See [design decisions and primary sources](docs/research.md). Licensed under [MIT](LICENSE).

Use ASD-STE100 Issue 9 for new or changed English text that agents write in this repository. Before delivery, examine the changed text. See the [repository writing rules](AGENTS.md).
