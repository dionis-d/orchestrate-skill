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

Use the request and repository rules to set the acceptance criteria and find the approved delivery steps. Use focused checks during implementation. Use independent review when the repository rules or risk make it necessary.

In BB, the parent thread assigns one task with acceptance criteria to each implementation child thread. It runs independent tasks in parallel in isolated workspaces. It integrates the changes on one branch. A separate reviewer checks the integrated change before any PR, including a draft PR. After review and corrections, the parent thread runs the required checks once for the final PR revision. It uses one PR for the assignment when PR creation has approval. See the [delivery workflow](docs/guide.md#delivery-workflow).

## Contributing

Run from this repository:

```sh
npm run check
npm pack --dry-run
```

Tests use disposable temporary projects. They check installer behavior; they do not prove agent behavior in every harness. See [design decisions and primary sources](docs/research.md). Licensed under [MIT](LICENSE).

Use ASD-STE100 Issue 9 when you change the skills. Check the approved words, technical terms, and sentence rules against the [writing reference](skills/ship-change/references/technical-english.md).
