---
name: orchestrate
description: Coordinate bounded implementation tasks in isolated workspaces and integrate reviewed results. Use for multiple workers or a coordinated batch, or for the delegation phase of an active delivery workflow.
compatibility: Git supports branch and worktree isolation. Parallel work requires workers that can honor assigned directories and resource boundaries.
---

# Orchestrate

When called from an active delivery workflow, use its coordinator, baseline, and endpoint. Own only the assigned scheduling, isolation, or integration phase. When invoked alone, act as the single coordinator for the batch. Use one end-to-end harness for each task.

## Establish the run

Read applicable instructions, tasks, repository status, and optional project preferences. Record each task's acceptance criteria, dependencies, writable scope, resource needs, and completion evidence. Schedule unblocked tasks in waves. Serialize tasks with overlapping writes or non-isolatable fixtures, even across different worktrees. Respect the harness and project resource limits.

Use the authorized endpoint. If unspecified, retain reviewed local results. Discover requirements for each authorized transition from the target project. Delegate implementation and focused checks by default. Keep push, PR, merge, and release ownership with the coordinator, and check authorization for downstream effects such as deployments before any remote operation.

## Prepare isolation

Read [harness capabilities](references/harnesses.md) before dispatch. Resolve the base from user or project guidance, then the remote default branch when available, otherwise the current branch. Verify the ref and record its exact commit. Preserve unrelated changes and resolve any dependency on uncommitted work before dispatch.

Reuse assigned native environments and verify actual paths and branches before writes or checks. If creating isolation yourself, use unique branches and worktrees from the agreed baseline and keep existing worktrees intact. Give parallel workers one writable checkout each. Use separate ports, database namespaces, test identities, and temporary paths when needed. Shared fixtures must be read-only, isolated copies, or scheduled serially. Avoid copying credentials and environment files. Use documented disposable setup.

If isolated workers are unavailable or unauthorized, proceed sequentially within the assigned workspace and disclose the limitation.

## Dispatch and inspect results

Give each worker one task using [the worker brief](references/worker-prompt.md). Workers run focused acceptance checks and applicable requirements for their own authorized transitions. Route compatible project diagnosis, TDD, or changed-code tools to a bounded phase when helpful. Use direct reproduction, focused verification, and diff inspection as fallbacks.

Inspect the returned revision against the assigned baseline and acceptance criteria. Account for relevant tracked, untracked, and ignored artifacts. Confirm commits are on the assigned branch, intended changes are present, and claimed checks ran. If the criteria already hold without a change, document the evidence.

For standalone orchestration, arrange fresh independent review of the candidate being delivered. Use the required native or provider review route where specified, or use a compatible installed review skill or fresh reviewer. Give the reviewer the fixed base, exact candidate, acceptance criteria, and project standards. Where required review depends on an authorized draft, satisfy creation prerequisites first and review the PR head. Resolve material findings before advancing and use the same review route to verify fixes on the revised candidate. If independent review is unavailable, inspect directly, report the gap, and stop before transitions that require it. In an active delivery workflow, supply worker evidence to its review owner. Keep worker acceptance checks useful without commissioning duplicate final reviews.

## Integrate and conclude

Integrate within scope, in dependency order, using an isolated integration branch or environment where supported. Resolve conflicts against the intended behavior and rerun affected checks. Include substantive integration changes in independent review of the integrated result. Use protected provider checks and merge procedures for authorized remote integration.

The delivery coordinator owns the full gate on the final integrated candidate. In standalone orchestration, honor checks due at each phase and reuse qualifying receipts directly from the owner of the check phase. Match the exact candidate or project-accepted artifact identity, scoped checks, environment, dependencies, and results to the phase requirements. Invoke `release-gate` only for unmet requirements or when assigned to verify qualifying evidence that no compatible owner has handled. If the skill is unavailable, do that bounded verification directly. When another workflow owns delivery, return revisions, integration checks, and gaps to it.

When project policy requires clean committed verification, establish and record the exact HEAD and clean checkout at test start, including staged and tracked status and any relevant untracked, ignored, or generated inputs. Before opening either a draft or regular PR, confirm that HEAD and the PR source match that verified commit and that the checkout still meets the cleanliness and input requirements. Revalidate affected checks if the evidence no longer applies.

Report task revisions, review, verification, and any authorized delivery links or pending requirements. Retain unmerged or dirty work. Clean up only run-owned resources whose work is safely retained and whose removal is authorized.
