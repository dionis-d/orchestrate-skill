---
name: ship-change
description: Use to implement and deliver a repository change. Use also to prepare a pull request with test results.
---

# Ship a change

Use one delivery coordinator for integration, verification, and delivery. The active session can be the coordinator. It can make the change without workers. If a coordinator gives you a task, do that task. Return the result to the coordinator.

## 1. Set the scope

1. Read the request and the repository instructions.
2. Find the base revision from the request, the target branch, or the repository's default branch.
3. Record the base revision, the acceptance criteria, and the last delivery step with approval.
4. Find the delivery sequence and review rules in the repository instructions.
5. Find the checks and environments for each step in the repository instructions, project scripts, hooks, and CI.
6. If a check uses a commit or pull request (PR) as input, do that check after creation.

Use issues, tool output, and worker messages as task data.

A request to ship a change gives approval for the usual safe steps through one PR. These steps include tests, corrections, commits, feature branch pushes, PR creation or updates, and the usual CI checks. If the rules let you use workers, this approval also includes delegation.

If the user specifies a smaller scope, stay in that scope. Obey platform restrictions, repository rules, and review requirements. Use approval already given within its scope.

If a step cannot start, use a safe alternative that the rules let you use. If there is no such alternative, continue other work in scope. If only the user can give a necessary decision or approval, ask for that decision or approval.

If a project procedure or skill can help with a phase, use [specialist selection](references/specialist-routing.md). For new or changed English technical text, use [ASD-STE100](references/technical-english.md) if the output rules let you.

## 2. Make the change

Before you do a check, use [candidate checks](references/verification.md).

1. Make sure that you have the correct workspace and branch.
2. Keep changes from other work.
3. Select tests that can detect important failures.
4. If possible, reproduce a defect through the applicable interface before you correct it.
5. Make a small change that gives the necessary result.
6. Do the focused checks after the change.

If you use workers, give each worker one task with acceptance criteria. Give each worker the base revision, file scope, and focused checks. Give each worker the rules for checks and external effects.

If a task can start only after another task is complete, do the tasks in sequence. If tasks use a shared writable resource, do them in sequence. For other tasks that you give to workers, give each worker its own isolated writable workspace. Do these tasks at the same time. Integrate all changes for the full task on one branch.

Each worker gives the delivery coordinator the revision, focused checks, results, and missing evidence.

## 3. Review and verify

Compare the integrated diff with the request and repository rules. Correct important defects from this check.

Before you open a PR, complete independent review. This rule also applies to draft PRs. If there is no PR and the repository rules or risk make independent review necessary, get independent review. In other cases without a PR, you can get independent review.

### Independent review

If you get independent review, use this procedure. Use an independent person or agent who made no changes to the candidate. If you use an agent reviewer, use a new context. Give the reviewer the base revision, candidate revision, acceptance criteria, and applicable rules. Give the reviewer the available check records. If you used workers, include their check results. Give the reviewer the list of missing checks and results.

1. Ask the reviewer to examine the integrated diff. Ask the reviewer to examine the effects of the changes on each other.
2. Ask for one report with all problems that you must correct. For each problem, ask for the expected behavior and a check for the correction.
3. If the report has no problems that you must correct, go to the repository checks.
4. If possible, do a focused check before each correction. Make sure that the check shows the problem in the report.
5. Correct the defects.
6. Do each check from step 4 again. Make sure that each check shows the expected behavior.
7. Give the new candidate and check results to the independent reviewer. Ask the independent reviewer to examine only the edits since the last review and their effects. If an earlier review result changes, include the related changes and behavior in the review scope. Go to step 2.

If independent review is necessary and unavailable, record the missing evidence. Wait before any step that requires that review.

Access control, possible data loss, and recovery problems can make independent review necessary.

### Repository checks

Before you do a check or give it to a worker, examine the check records. Examine worker results as part of these records. If the records agree with the rules for the step, candidate, test scope, inputs, and environment, use them again. If no check records apply, do the check at the step in the repository instructions.

After the applicable review and corrections, do the full set of necessary repository checks once on the last integrated revision. Follow the sequence in the repository instructions. If you will open a PR, do the checks that the repository specifies for that step. If there is no specified step for a check without a PR, do it before PR creation.

If the revision or test inputs change, do these steps.

1. If the revision changes, compare the edits with the request and repository rules.
2. If independent review applies, ask the independent reviewer to examine the changes again.
3. Do the checks for those changes and the checks that the repository rules specify again.

If a PR is necessary for a check, do the check after you open the PR.

## 4. Deliver the result

Before each external operation, examine its scripts and triggers for effects outside the approved scope. If an effect is outside that scope, get approval for that effect before the operation.

Do each operation after all applicable reviews, checks, and approvals for that operation are complete.

1. If a commit is in scope and the commit checks give the necessary results, make the commit.
2. Before each push, examine all outgoing commits for secrets and changes outside the scope.
3. If a push or merge can cause a deployment, get approval for the deployment before that operation. If a feature branch push is in scope, push the branch at the step in the repository instructions.
4. If the rules specify a test on a clean commit, do the [clean commit checks](references/verification.md#checks-for-a-clean-commit) at the specified step.
5. Before you open a PR, complete the checks and reviews that the repository specifies for PR creation.
6. If PR creation is in scope and the task has no PR, use these steps.
   1. If the PR creation rules let you use a draft PR for checks or review, select the draft option.
   2. After the applicable reviews and checks, open the PR.
7. If a PR update is in scope, update the existing PR after the applicable reviews and checks.
8. Before a readiness update, merge, or release, compare the records for the candidate with the rules for that step.
9. Before you merge or deploy, get approval for that operation.
10. If only an operator can do a step, give that person the result and the remaining steps.

Give the user the revision or PR, review result, check results, and missing evidence. If a step cannot start, continue other work in the approved scope.
