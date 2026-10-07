# Harness capabilities

Inspect current tool descriptions, permissions, and repository instructions. Desktop, CLI, and hosted variants differ; product names do not guarantee APIs. Installing skills does not enable workers or change permissions.

| Harness | Discovery and dispatch |
| --- | --- |
| OpenAI Codex | Use the documented skill locations for the installed runtime. Project installation here uses `.agents/skills`. Use exposed worker tools/custom agents only when workers can honor assigned worktrees. Model overrides depend on runtime. |
| Claude Code | Skills use `.claude/skills` or `~/.claude/skills`. Inspect Agent/task capabilities and isolation options. If the runtime creates worktrees, use returned paths rather than creating duplicate checkouts. |
| ZCode | Skills use `.zcode/skills` or `~/.zcode/skills`. Refresh Settings → Skills after installation. Inspect Agent/subagent capabilities; do not assume dynamic workflows or model overrides exist. |
| OpenCode | Discovers `.opencode/skills`, `.agents/skills`, and `.claude/skills`; user config also supports `~/.config/opencode/skills`. Use configured subagents only when they honor the directory boundary. |
| Other agents | Use a documented discovery directory or explicitly load the standard entrypoint and its references. Map capabilities from actual tools. |

Use a native question tool if available, otherwise chat. List models only through an exposed capability. Resume workers through supported continuation; otherwise give a new worker the branch, findings, and context.

If overrides are unsupported, retain the current model and explain. If parallel isolation is unsupported, work sequentially in distinct branches/worktrees where Git is available. External agent CLIs are optional explicit setup; do not invent flags or launch paid sessions without authorization.
