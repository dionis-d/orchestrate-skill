# Selecting testing evidence

Choose by the fault the test must detect, not a fixed unit/integration/end-to-end ratio. Prefer a fast, deterministic boundary with real collaborators when they are inexpensive. Add another level when it catches a different failure.

## Match the boundary

| Likely failure                                                              | Useful evidence                                                                           | Limit to recognize                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Rule, calculation, validation, state transition                             | Unit or module test through a stable interface                                            | Repeating the algorithm in expectations can repeat its defect.                        |
| Collaborators wired incorrectly                                             | Component/module test with real internal collaborators                                    | Deep mock graphs can remove the interaction being tested.                             |
| SQL, transactions, serialization, HTTP middleware, queue or cache semantics | Integration test with the relevant real engine/runtime and representative configuration   | An in-memory replacement does not establish production-engine behavior.               |
| Client/provider or shared package compatibility                             | Consumer expectations verified against the provider, schema, and representative wire data | Two sides using the same handwritten mock are not independent compatibility evidence. |
| Critical journey across the assembled application                           | Focused end-to-end test                                                                   | Mocked network/persistence narrows the claim; identify which parts remain real.       |
| Broad input space or combinations                                           | Parameterized examples, property-based checks, or bounded fuzzing                         | Generated inputs need meaningful oracles and reachable cases.                         |

Regression is a purpose, not a separate level: choose the boundary that reproduces the defect. Interface stability matters more than a strict public/private keyword; exercise externally meaningful behavior without exposing internals solely for tests.

## Doubles and real dependencies

Use a stub to select a dependency result, a fake for inexpensive realistic behavior, and a spy when the interaction is itself contractual (such as sending once). Keep the behavior under test real. Reset mutable doubles and clean up resources between cases.

Use real dependencies where their semantics carry the risk: transaction rollback, uniqueness constraints, row-level security, locking, or Redis scripts. A unit test with a mocked repository can establish orchestration, but cannot establish those guarantees. Use disposable databases/namespaces and the relevant non-privileged roles. If an environment is unavailable, run the remaining checks and report the missing integration evidence.

For external APIs, normally use controlled boundary responses locally. Validate compatibility using provider specifications, verified contracts, or authorized sandbox checks when relevant. Live credentials and production traffic are not implied by a request to write tests.

## Cases and data

Choose representatives from equivalence classes and the boundaries separating them. Add empty/missing, malformed, duplicate, Unicode, legacy, large, or clock-boundary inputs only where they affect the changed contract. Make locale, time zone, encoding, and units explicit when material. Keep fixtures small enough that the distinguishing input is visible.

For stateful changes, cover the relevant transition and forbidden transition, not only the final happy-path state. For retries or cancellation, observe side effects as well as returned errors. Reject/deny tests may need to prove that nothing was persisted, emitted, or disclosed.

Property-based tests suit codecs, transformations, state machines, and algebraic rules. State the invariant, constrain generators to the domain without filtering away the interesting cases, and retain the seed and minimized counterexample. Pair round trips with independent examples: matching encoder/decoder defects can cancel. Bound fuzzing by time or iterations and retain reproducible failures.

## UI and asynchronous behavior

Prefer user-facing roles, labels, or explicit test IDs to DOM structure selectors. Exercise loading, success, error, and keyboard/focus behavior when affected. In Playwright, use awaited locator assertions such as `await expect(locator).toBeVisible()`; bounded retries synchronize with normal asynchronous rendering. Arbitrary sleeps and whole-test reruns do not supply the same evidence. See [Playwright best practices](https://playwright.dev/docs/best-practices).

Control race ordering with deferred promises, barriers, fake clocks, or schedulers when possible. Await completion and cleanup before the test ends. For transient forbidden effects, observe the event/side-effect history or synchronize on completion; a single negative assertion before work starts is weak evidence.

## Add checks for material non-functional risk

- **Authorization and isolation:** allowed and denied operations, wrong owner/tenant/role, unauthenticated requests, and absence of leaked data or unauthorized side effects through the enforcing boundary.
- **Concurrency and resilience:** competing callers, duplicate/out-of-order delivery, timeout, cancellation, bounded retries, partial failure, and invariant preservation after recovery.
- **Migration and persistence:** representative old data, constraints, partial failure, data reconciliation, and supported restart/rerun behavior. Verify rollback only if supported; otherwise test the documented forward recovery path. Keep production recovery actions outside local test execution.
- **Performance:** representative data/workload, comparable baseline, warm-up, repeated samples, and environment/variance. Measure the reported bottleneck rather than claiming production capacity from a local microbenchmark.
- **Accessibility and compatibility:** affected keyboard/focus semantics, supported browsers/devices, client/server versions, file formats, and relevant locales. Automated accessibility checks cover only part of usability; use [QA procedures](qa-procedures.md) for the rest.

Use existing tooling first. Add a dependency or broad test suite only when the missing evidence justifies its setup and maintenance cost.
