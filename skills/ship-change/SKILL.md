---
name: ship-change
description: Coordinate one repository change through implementation, fresh independent review, and verified delivery. Use to ship a change or prepare a verified PR when no delivery workflow already owns the task.
---

# Ship a change

Own one shippable slice and its authorized endpoint. In BB, use the existing parent thread or coordinating session and its native tools. When a project workflow or parent already owns delivery, follow that coordinator and contribute only the assigned phase. Select one end-to-end workflow per slice. Use other skills for bounded phases, without handing them the delivery lifecycle or starting a second harness.

## Discover the delivery rules

Read the request, active project instructions, repository state, and available skills. Record the comparison base, acceptance criteria, and authorized endpoint. Verify optional project preferences against applicable instructions, scripts, hooks, and workflows. Keep project-specific details in the working context and evidence for authorized recipients.

Identify requirements before each applicable transition: local commit, push, draft creation, ready for review, merge, and release. Record which checks and reviews are required when, which revision they cover, the required environment, and any required receipt or human approval. Order review, gate runs, and delivery actions around these prerequisites. Read wrappers and remote triggers before running anything that might publish, deploy, alter shared data, or notify others. Use disposable fixtures and keep production credentials outside worker and test environments.

## Implement and integrate

Assign one implementation owner for a small change. For a larger slice, delegate one bounded task per worker with its baseline, workspace, writable scope, acceptance criteria, resources, and evidence to return. If installed, use the isolation and worker guidance in `orchestrate` as a phase of this run. Use native worktrees or environments when provided, validate their paths and branches, and serialize work that shares files or fixtures. Work sequentially when delegation or requisite isolation is unavailable.

Use the target project's compatible diagnosis skill for uncertain bugs, TDD for requested or applicable test-first work, and changed-code tools for risks they can evaluate. Give each a phase result to produce. Use `development-testing` for risk selection when available. Without these skills, reproduce bugs through the affected path, use existing or focused regression and boundary checks, and inspect the changed code and affected consumers directly.

Workers run focused acceptance checks and any checks required for their own authorized transitions. They return the revision, evidence, and gaps. The coordinator integrates in dependency order, verifies conflicts and affected boundaries, and owns the full gate for the integrated artifact. Keep outgoing changes scoped and inspect them for sensitive material before any authorized push.

## Review and verify

Arrange fresh independent review of the integrated change through a compatible project review skill or a native independent reviewer. In BB, use a fresh reviewer thread when authorized and available. Supply a fixed base and candidate revision, request and acceptance criteria, applicable standards, and evidence. Ask for findings about correctness, scope, and changed failure paths. Reviewers should inspect the candidate without editing it or performing delivery actions. Use the required native or provider review route when specified. Reuse that review when it covers the same candidate and criteria. Add another review only for a distinct requirement or uncovered scope.

Fix material findings and get independent verification of the affected fixes on the revised candidate. If fresh independent review is unavailable, inspect the diff directly and report independent review as pending. Pause any transition that requires it.

Use `release-gate` for the required verification phase when installed, or run the project-defined checks directly. Default to one full gate on the final integrated candidate. Run any earlier required checks at their prescribed phase, even if that policy requires another run later. Reuse a receipt only if project policy accepts it and the exact revision or explicitly accepted artifact identity, check scope, dependencies, environment, and results match the requirement. Changes invalidate affected evidence. Verify the actual PR head or merge candidate when required.

## Deliver within scope

Open a draft only if authorized, creation requirements are satisfied, and the draft enables required checks or useful feedback. If independent review requires a PR, meet its creation prerequisites, open an authorized draft where allowed, and obtain that review against the PR head before advancing. Use the project-accepted local review route if a PR-based review is unavailable within scope. When policy requires review before creation, arrange it on the local candidate first. Use an installed PR skill for the required PR preparation or operation only. As a fallback, prepare the scope, evidence, gaps, and relevant recovery details directly.

Before marking ready, merging, or releasing, confirm the applicable review and checks for that transition. Keep required protections and human-only steps in place. Treat pushes, PR operations, tracker writes, merges, deployments, and shared-state changes as scoped side effects. A push or merge that automatically deploys also requires authorization for the triggered deployment. If a required wrapper has side effects outside that scope, use a project-accepted check-only path or report the blocked requirement.

Report the delivered revision or PR, review outcome, checks actually completed, and outstanding requirements. Continue authorized work that can proceed when another phase is blocked.
