---
name: development-testing
description: Select tests for changes to software behavior or software contracts. For an existing change or an unreliable test, use this skill to examine the tests. For changes to text or appearance, select tests only for effects on software behavior or build output.
---

# Development testing

If a coordinator gives you tests, do the tests in that scope. Give the results to the coordinator.

## Prepare the checks

Find the test commands in the project scripts or CI configuration.
If `.workflow-skills.json` is available, read the project preferences.
Use preferences that agree with the repository instructions.
Before each check, examine the command and the programs it starts for effects outside the approved scope.
If a command has such effects, use a check-only command that the project accepts.
If there is no such command, record the missing check.
For command selection and test services, read [Verification discovery](references/verification-discovery.md).

## Select the tests

Before you change the code, record the expected behavior and the failure with the highest risk.
Select the smallest test that can find the failure at the interface where it occurs.
If an existing test can find the failure, use that test.

For a change to a shared interface, select a test with the applicable producer and consumer.
For risks such as data loss or authorization failures, include tests for the applicable failure and recovery paths.

For test levels, test doubles, or risks such as migration and concurrency, read [Testing strategy](references/testing-strategy.md).

## Get regression evidence

Before you correct a defect, do a regression test through the interface where the defect occurs.
If the code contains the correction, do the regression test on an isolated copy without the correction.
If the earlier code is unavailable, use an isolated mutation only if it can give necessary evidence.

For an automated regression test, make sure that the test reaches the assertion for the defect.
Make sure that the assertion fails because of the defect.
With the correction, make sure that the same test passes.
If an automated test cannot show the defect, use a manual test.
For a manual test, record the steps and the result.

Before you add behavior, write examples of the expected results.
Before you refactor code, make sure that tests for the behavior of that code pass.

## Examine the assertions

For each new or changed test, record one incorrect result that the assertion must find.
Get the expected result from the contract, an example with known values, or an invariant.
Keep the code under test out of the expected result calculation.
For a test audit with a diff, examine the diff for weaker assertions and changes to test selection.

For weak assertions, snapshots, or mutation checks, read [Assertion quality](references/assertion-quality.md).

## Do the tests

Use disposable test data and isolated resources for tests that change state.
If tests must share a writable resource, do those tests in sequence.
If time can change the result, use a fixed test clock.
If random inputs can change the result, use a known seed.
If the operation is asynchronous, wait for its completion with a time limit.

Do the focused tests first.
Then, do the other tests that you selected for the change.

Make sure that the runner found each intended test.
Make sure that the runner executed each of those tests.
For each skipped or uncollected test, record its status.
If no tests execute, record a zero-test run.

For intermittent failures or measurements, read [Quality measurement](references/quality-measurement.md).

## Give the results

Give the behavior under test, the revision or patch, the test commands, and the environment.
For each check, give its status (`pass`, `fail`, `partial`, `skipped`, or `not run`).
If you know the cause of a failure or skip, give the cause.
For a check that you did not do, give the reason.
If a check gives only some of the necessary information, give the limits of the check.

For new or changed English technical text, use [ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) if the output rules let you.

## Other test procedures

- For stakeholder review of acceptance examples, read [BDD and Gherkin](references/bdd.md).
- For manual, exploratory, or visual checks, read [Procedural and exploratory QA](references/qa-procedures.md).
