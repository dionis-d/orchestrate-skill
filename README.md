# Workflow skills

Reusable agent skills for planning implementation, testing behavior, and checking delivery readiness. They work independently across projects and technology stacks.

| Skill | Use it to |
| --- | --- |
| `orchestrate` | Coordinate isolated workers, review results, and integrate authorized changes |
| `development-testing` | Choose meaningful checks based on the change's risks |
| `release-gate` | Run the project's required checks before handing off the final result |

## One-line installation

Open a terminal in the project where you want the skills installed, then run:

```sh
npx skills@latest add dionis-d/orchestrate-skill
```

Select the skills and your agent at the prompts, then restart or refresh the agent. You do not need to clone the repository first. The [skills CLI](https://github.com/vercel-labs/skills) supports Codex, Claude Code, and OpenCode; use the local installer below for ZCode.

Manage this installation with `npx skills@latest list`, `npx skills@latest update`, and `npx skills@latest remove`. Use the same manager that installed the skills.

## Local installer (including ZCode)

**New to these skills? Follow the [step-by-step installation guide](docs/install.md).** It explains where to run each command, what to enter at the prompts, and how to confirm the agent can load the skills.

Requires Node.js 22 or newer and Git to clone the repository. Replace `../my-project` with your target project's path.

```sh
git clone https://github.com/dionis-d/orchestrate-skill.git workflow-skills
cd workflow-skills
node bin/workflow-skills.mjs add --project ../my-project
```

Select the skills and agents you want, review the destinations, then type `yes` to install. Press Enter at the selection prompts to choose all three skills and the four supported harnesses: Codex, Claude Code, ZCode, and OpenCode. Restart or refresh your agent afterward.

Confirm installation:

```sh
node bin/workflow-skills.mjs list --project ../my-project
```

Then ask your agent to use a skill, for example:

```text
Use development-testing to verify this change against its acceptance criteria.
```

For updates, removal, user-wide installation, and troubleshooting, read the [full usage guide](docs/guide.md).

Choose one installer for each installation. The [full guide](docs/guide.md#alternative-skills-cli) explains how the two managers differ.

## Project setup

No configuration is required. Skills discover repository instructions, commands, and CI. Optionally save project preferences:

```sh
node bin/workflow-skills.mjs init --project ../my-project
```

Parallel orchestration requires a harness that can isolate worker directories; otherwise tasks run sequentially. Installing a skill does not enable unavailable agent tools or authorize publishing and deployment.

## Contributing

Run from this repository:

```sh
npm run check
npm pack --dry-run
```

Tests use disposable temporary projects. They check installer behavior; they do not prove agent behavior in every harness. See [design decisions and primary sources](docs/research.md). Licensed under [MIT](LICENSE).
