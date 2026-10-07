---
name: orchestrate
description: Coordinate independent implementation tasks in isolated branches and worktrees, review their evidence, and integrate approved results. Use for parallel tickets, multiple worker agents, or an explicitly coordinated batch of tasks.
compatibility: Git is needed for branch and worktree isolation. Parallel execution requires workers that can operate in distinct directories; otherwise use sequential execution.
---

# Orchestrate

Own scheduling, isolation, review, and integration. Each worker owns only its assigned task and branch. Preserve user choices and repository instructions.

## Establish the run

Read applicable instructions, tasks, repository status, and optional root `.workflow-skills.json` guidance. Configuration is not permission to publish or merge. Discover commands from the actual project and CI; do not require a ticket system, language, package manager, or hosting provider.

Identify acceptance criteria, file/resource scope, dependencies, and completion evidence for each task. Schedule dependencies in successive waves; serialize overlapping files and shared resources. Respect actual harness concurrency and the project's resource budget.

Read [harness capabilities](references/harnesses.md) before dispatch. Keep the session model unless another was requested or configured and supported. Never invent model identifiers or tool names. If isolated parallel workers are unavailable, run sequentially and disclose that mode.

Use the requested endgame: reviewed local branches, draft PRs, or integration. If unspecified, retain reviewed local branches and report them. Reuse existing authorization; ask only for a missing material decision. Pushing, PR creation, merging, and deployment require corresponding authorization and permissions. A missing remote does not authorize direct merging.

## Prepare isolation

Resolve the base from user/project configuration, then the remote default branch when available, otherwise the current branch. Record its exact commit as the comparison baseline. Report a nonexistent configured ref; do not silently substitute another. In a non-Git project, run sequentially and report the lack of branch isolation.

Preserve unrelated changes. Never reset a dirty main checkout: create workers from an agreed committed baseline. If tasks need uncommitted changes, resolve how to include them before dispatch. Check existing worktrees and branch names; use unique branches following project conventions and an ignored or external worktree location. Do not prune live worktrees or reuse occupied branches.

Install dependencies using repository instructions and lockfiles as needed. Do not copy credentials or environment files automatically. Use documented test configuration and authorized secret access. Assign separate ports, database namespaces, temporary paths, and other resources when checks need them.

## Dispatch and review

Fill [the worker brief](references/worker-prompt.md) with task, absolute worktree, branch, baseline, boundaries, acceptance checks, resources, and authorized endgame. Pass repository instructions and enough context to work without parent history. Never share a writable checkout between parallel implementation workers.

Verify each result independently:

- Inspect the diff against the recorded baseline and acceptance criteria, including relevant tracked, untracked, and ignored artifacts.
- Verify commits are on the assigned branch and contain intended changes. A clean worktree alone is not completion; a no-op task may legitimately have no commit if its acceptance criteria already hold.
- Inspect or run meaningful acceptance evidence. Distinguish passing execution from skipped, blocked, or uncollected checks.
- Review correctness, scope, integration risk, and test quality. Use an independent reviewer when available and warranted; otherwise review directly and state that limitation.

Return actionable findings to the responsible worker. After a bounded repair round, review again. Unresolved material defects remain blocked and unmerged; retry exhaustion is not approval. Stop retrying when external input or an environment change is required.

## Integrate and conclude

Integrate only reviewed results within the authorized endgame. Choose dependency order and conflict risk rather than blindly sorting by diff size. Use a separate integration branch/worktree for local integration so a half-integrated wave does not contaminate the base. Run affected checks after each merge and the completion gate after the final integration edit. Use the installed `release-gate` skill if available; otherwise discover equivalent project checks directly.

Resolve conflicts by both tasks' intended behavior and rerun affected checks. Substantive conflict resolution requires renewed review. Use the hosting provider's supported merge method, required checks, and merge queue; never bypass protections or mark failing work ready. Retained branches/PRs are valid delivery when the user owns integration; state pending integration checks.

Report task, branch/commit, actual model if known, review outcome, verification, and PR links. Continue authorized subsequent waves until complete or blocked. Remove only worktrees created by this run that are clean and safely delivered. Preserve dirty or unmerged work; delete branches only when their work is demonstrably retained and cleanup is authorized. Avoid forced cleanup.
