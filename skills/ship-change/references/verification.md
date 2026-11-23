# Do the candidate checks

1. Find the revision or artifact for the next step in the repository rules.
2. Identify the command, working directory, inputs, dependencies, and environment for each check.
3. Before a check, examine the command and the programs it starts for effects outside the approved scope.
4. If a command has such effects, use a check-only command that the repository accepts.
5. If there is no such command, record the missing check.
6. Use disposable test resources and the minimum necessary access.
7. Keep production credentials out of worker and test environments.
8. Do checks in parallel only if they have isolated writable resources.
9. If you cannot find a required set of checks, do applicable checks and record the missing information.

For each check, record the revision, command or CI job, location, environment, applicable inputs, and result. Make sure that the necessary tests ran. Record each failure, skip, or missing check. If the candidate or its test inputs change, do the applicable checks again.

## Checks for a clean commit

1. Before the tests, record the `HEAD` revision and checkout status.
2. Examine staged and tracked changes.
3. Record the applicable untracked, ignored, or generated inputs.
4. Before the tests start, make sure that the checkout and inputs agree with the clean checkout rules.
5. If they do not agree, wait until you can do the tests in a checkout that meets the rules.
6. Before you open a draft or regular pull request, compare local `HEAD` and the PR source with the tested revision.
7. At the same time, compare the checkout and applicable inputs with the clean checkout rules and test evidence.
8. If the evidence does not agree with the candidate and inputs, do the necessary checks again before PR creation.
