# Quality measurement

Metrics are diagnostic evidence, not targets to game. Respect project thresholds; never lower them to obtain a pass or introduce a universal threshold without project evidence. Prefer changed-code and risk-area signals over superficial global percentages.

## Useful signals

Collect only supported and relevant measures: line, branch, function, and diff coverage; mutation score and meaningful survivors; pass and flaky-test rates; suite duration and slow tests; type, lint, format, static-analysis, complexity, security, and accessibility findings; performance baselines; and escaped-defect trends when project data exists.

High coverage with weak assertions is insufficient. Do not add valueless tests or unjustified exclusions merely to change a number. Explain meaningful regressions and report unavailable data as unavailable.

## Mutation testing

Use mutation testing selectively for changed business-critical rules, validation, authorization, financial calculations, and complex conditions where ordinary coverage may conceal weak assertions.

Start with affected or high-risk modules and a passing baseline. Record the score and scope when available, inspect survivors, and distinguish real gaps from equivalent mutants (no observable behavioral difference) or irrelevant mutations. Add a test only when a survivor exposes missing behavior. Avoid brittle implementation assertions written only to kill mutants, and follow existing thresholds.

Keep assertion failures, timeouts, uncovered mutations, and invalid mutations distinct. A tool may count timeouts as detected, but a compiler/setup error does not establish assertion sensitivity. Report the tool's actual categories; a manually tried mutation is not a suite-wide mutation score. See [Stryker's metric definitions](https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/).

## Flaky tests

For an intermittent failure:

1. Preserve the failure output and environment details.
2. Reproduce it where practical.
3. Investigate shared state, timing, randomness, order, network access, resource leaks, and environment assumptions.
4. Fix the cause and repeat the affected test enough to gain risk-proportionate confidence.

Distinguish bounded assertion polling (normal synchronization with rendering or asynchronous state) from whole-test retries. Configured reruns can collect diagnostics or limit disruption, but retain the initial failure and report a retry-pass as flaky evidence, not an unconditional clean pass. Fix synchronization or isolation instead of increasing sleeps. Quarantine or skip only when project policy permits it, with a documented reason and follow-up owner.
