---
name: ship-change
description: Take a repository change from request through implementation, independent review, and verified delivery. Use when asked to ship a change, prepare a verified PR, or coordinate a complete delivery workflow.
---

# Ship a change

Use one short-lived branch and one PR per independently shippable slice where the project uses PRs. The parent owns scope, integration, and delivery. Scale planning and verification to the change's impact and recovery cost. This entrypoint works on its own.

## Discover the delivery rules

Read the task, applicable repository instructions, current branch and working-tree state. Find the intended base and record the starting revision. Preserve unrelated work. Consult optional `.workflow-skills.json` for defaults and use the project's tracked instructions, scripts, hooks, and workflows to verify those defaults.

Identify what must pass **before each applicable transition**: commit, push, PR creation, merge, and release. Trace commands to see which checks they run, what host and fixtures they require, and what they publish or deploy. Check triggers for the intended branch, including deploy-on-merge and branch previews. The user's request and standing authorization set the delivery scope. Repository rules may require additional checks or an authorized human operator. An absent local policy or an available credential grants no authority.

Give workers and verification jobs only the access they need. Use disposable data and isolated execution for untrusted code, with production credentials out of those environments.

## Plan and implement

- **Clear change:** write or extract brief acceptance criteria and identify the cheapest meaningful check through the affected behavior. A small task needs one implementation owner.
- **Uncertain design or dependent work:** answer material design questions first. Split larger work into independently verifiable slices and record blockers. Keep each parent thread or coordinating session responsible for one shippable slice. A worker gets one task, its base, acceptance criteria, boundaries, and required evidence.
- **Bug:** reproduce the reported symptom through the affected path. Where faithful automation is practical, make the regression check fail for that reason before fixing it.

Use isolated worker branches and worktrees when delegation is authorized and supported. Run only unblocked tasks in parallel and serialize tasks or checks that contend for files, fixtures, ports, or machine-wide locks. When worker isolation is unavailable, work sequentially within the authorized scope. Integrate completed work as dependencies allow.

Commit coherent changes. Before every push, including checkpoints, inspect outgoing commits for secrets and unrelated changes. Push meaningful checkpoints to approved feature branches when permitted, after their applicable gates.

Run focused checks while implementing. Use existing behavioral coverage where it proves the acceptance criteria. Add boundary, failure, and recovery checks for changes affecting authentication, permissions, sensitive data, data integrity, migrations, concurrency, or release infrastructure. For risky changes, agree on how to detect failure and recover, and involve the required owner or human reviewer before an irreversible transition.

## Review and verify the integrated change

Give an independent reviewer who did not author the change the base, integrated revision, acceptance criteria, and project standards. Have them check behavior against the request, repository standards, and the changed failure paths. Fix material findings and have the reviewer verify the fixes. Review substantive changes made after review, including conflict resolutions. If no independent reviewer is available, inspect the diff yourself and mark independent review pending. Stop before any transition that requires it.

Run each required gate at its prescribed stage, including pre-PR checks for drafts when applicable. Keep one set of full checks for the integrated result by default, reusing valid evidence when the project permits it. Rerun invalidated checks after changes and honor policies that require separate runs at different stages. Match evidence to the revision and environment actually checked, including the merge candidate when required. A skipped test, a missing receipt, or a deployment-only workflow supplies no passing test evidence.

Use protected CI as the final merge gate where available and configured. Run any required local checks on the documented host and retain their logs or receipts. If a wrapper also performs a release or any other action outside the authorized scope, run its check-only portion when the repository accepts that evidence. If the required check cannot be separated on those terms, report the gate as blocked. Preserve project hooks and branch rules. Report required checks blocked by missing access, fixtures, or platforms as incomplete.

## Deliver within scope

- Open the PR when authorized and the repository's creation requirements are met. Use an early draft only when the project and user allow it and doing so starts useful checks or feedback. Before marking it ready, verify applicable review and gate requirements. Include acceptance evidence, material gaps, and recovery considerations where relevant.
- Treat merge and deployment as separately authorized actions. When a merge or push triggers a release, the action also needs authorization for that release. Follow the project's deployment policy and respect human-only release steps. Keep any verification stopped by an external dependency visible in the handoff.

Finish with the delivered revision or PR, the checks and review actually completed, and any outstanding requirement. If the requested endpoint is blocked, complete the safe work that can proceed and state the exact blocker. For follow-up issues, follow the project's tracker conventions and existing authorization.
