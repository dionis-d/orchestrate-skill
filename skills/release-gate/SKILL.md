---
name: release-gate
description: Discover, run, and report required checks for a specific delivery phase and revision. Use to verify readiness or as the verification phase of an active delivery workflow.
---

# Release gate

Verify the candidate for the requested phase. Accept the phase, candidate, and receipts from the active delivery coordinator. When invoked alone, derive them from the request and project. Return evidence to the caller and leave delivery transitions with their owner.

## Discover requirements

Read the applicable project instructions, optional project preferences, manifests, hooks, and CI or release workflows. Trace wrappers and triggers. Identify the baseline and exact candidate revision or working-tree snapshot, including relevant untracked inputs. Account for configuration, dependencies, generated output, and build or publication effects as well as executable changes.

List the required checks for this phase from project policy. Commit, push, draft creation, readiness, merge, and release may require different suites, hosts, receipts, or candidate revisions. For a final gate, use the defined project suite or derive the local scope from required CI and affected boundaries. Record missing requirements and where remote or platform-specific verification belongs. If no required set can be established, run meaningful available checks and report readiness as unconfirmed.

## Reuse or run checks

For clean committed verification, establish and record the exact HEAD and clean checkout before running checks. Inspect staged and tracked state and identify any relevant untracked, ignored, or generated inputs. Resolve disallowed inputs within scope or report the requirement incomplete. Record allowed inputs that affect results so the delivery owner can verify that the checkout and PR source still match the evidence before creating either kind of PR.

- Accept a receipt only when policy permits reuse and it identifies the exact required revision or an explicitly accepted equivalent artifact, command or job, working directory, environment and dependencies, scope, and result. Use the required remote head or merge candidate when specified. For a clean committed check, the receipt must also establish cleanliness and relevant input state at test start. An approximate diff, stale result, skipped or uncollected suite, or missing receipt leaves a gap.
- Run unsatisfied required checks from the documented environment. Run the full integrated gate once when earlier checks did not satisfy it. After changes, rerun invalidated checks and any aggregate gate policy requires. Honor phase-specific fresh runs.
- Use the project's accepted check-only route when a wrapper would also push, publish, deploy, or mutate shared state outside authorization. If no accepted route exists, mark that check incomplete. Use disposable fixtures and run concurrently only with independent resources.
- Confirm collection, execution, and any skips. Diagnose failures, repair in-scope issues if assigned, and rerun affected checks. Preserve unrelated failures and protections. Record diagnostic retries and distinguish static evidence from runtime coverage.

Report `pass`, `fail`, `incomplete`, or `not applicable` for the phase. A pass requires evidence for every required check. Include the candidate, the checks run or reused, where they ran, results, and material gaps. For unintegrated work, state what still needs verification after integration.
