---
name: release-gate
description: Use for checks on a candidate before a delivery step.
---

# Do the delivery checks

If a delivery coordinator is active, use its candidate and delivery step. For standalone use, find them in the request and project rules. Give the results to the coordinator or user.

## 1. Find the checks

1. Read the repository instructions, test configuration, hooks, and CI workflows.
2. If `.workflow-skills.json` is available, read the project preferences.
3. Use preferences that agree with the repository instructions.
4. Find the candidate, necessary checks, environments, and inputs for the step.
5. If you cannot identify all necessary checks, record the missing information.

If the rules specify a clean commit, do these steps before the tests.

1. Record the `HEAD` revision and checkout status.
2. Examine staged and tracked changes.
3. Record the applicable untracked, ignored, or generated inputs.
4. Make sure that the checkout and inputs agree with the clean checkout rules.
5. If they do not agree, wait until you can do the tests in a checkout that meets the rules.

## 2. Use or get evidence

1. If the project accepts previous evidence for this step, use it.
2. Make sure that the candidate, check, scope, inputs, dependencies, environment, and result agree with the requirement.
3. Before a check, examine the command and the programs it starts for effects outside the approved scope.
4. If a command has such effects, use a check-only command that the project accepts.
5. If no such command is available, record the check as incomplete.
6. Use disposable test resources and the minimum necessary access.
7. Do the remaining applicable checks in the specified environment.
8. Do checks in parallel only if they have isolated writable resources.
9. Make sure that each necessary test ran.
10. If the candidate or its test inputs change, do the applicable checks again.

## 3. Give the result

For each check, give the candidate, command or CI job, location, environment, applicable inputs, and result. For a clean commit, include the checkout status before the tests. Give a list of optional skips.

If the evidence shows that all necessary checks passed, use `pass`. If a necessary check failed, use `fail`. If evidence is missing, use `incomplete`. If the step has no necessary checks, use `not applicable`.

For new or changed English technical text, use [ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) if the output rules let you.
