# Workflow skills

Reusable agent skills for delivering changes across projects and technology stacks. Install `ship-change` for the complete delivery workflow. The other three skills are optional and can be installed on their own. In BB or a project with an active delivery workflow, give the existing coordinator the focused phase and keep one delivery workflow per change.

| Skill | Use it to |
| --- | --- |
| `ship-change` | Implement, independently review, and verify a change through the project's delivery process |
| `orchestrate` | Assign independent tasks to workers and integrate the results |
| `development-testing` | Choose meaningful checks based on the change's risks |
| `release-gate` | Verify a specific candidate against the checks required for its delivery phase |

## One-line installation

Open a terminal in the project where you want the skills installed, then run:

```sh
npx skills@latest add dionis-d/orchestrate-skill --skill ship-change
```

Select your agent at the prompts, then restart or refresh the agent. You do not need to clone the repository first. The [skills CLI](https://github.com/vercel-labs/skills) supports Codex, Claude Code, and OpenCode; use the local installer below for ZCode.

Manage this installation with `npx skills@latest list`, `npx skills@latest update`, and `npx skills@latest remove`. Use the same manager that installed the skills.

## Local installer (including ZCode)

**New to these skills? Follow the [step-by-step installation guide](docs/install.md).** It explains where to run each command, what to enter at the prompts, and how to confirm the agent can load the skills.

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

## Project setup

No configuration is required. Skills discover repository instructions, commands, and CI. Optionally save project preferences:

```sh
node bin/workflow-skills.mjs init --project ../my-project
```

Workers run focused checks in isolated workspaces. The coordinator handles independent review when policy or risk calls for it and verifies the integrated result. See [how the skills work together](docs/guide.md#how-the-skills-work-together).

## Contributing

Run from this repository:

```sh
npm run check
npm pack --dry-run
```

Tests use disposable temporary projects. They check installer behavior; they do not prove agent behavior in every harness. See [design decisions and primary sources](docs/research.md). Licensed under [MIT](LICENSE).

Use ASD-STE100 Issue 9 when you change the skills. Check the approved words, technical terms, and sentence rules against the [writing reference](skills/ship-change/references/technical-english.md).
