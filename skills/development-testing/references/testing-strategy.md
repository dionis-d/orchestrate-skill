# Testing strategy

## Test levels

- For a local rule, use a unit test or a module test through a stable interface.
- If the risk depends on a database constraint or runtime behavior, use the applicable engine or runtime.
- For a compatibility risk, use representative consumer data in a provider test.
- For a critical user task, use an end-to-end test.
- For a test of a caller only, use a test double for the dependency as necessary.
- For a changed input limit, include values at and on both sides of the limit.
- For many input combinations, use parameterized tests or property-based tests.
- If a property-based test fails, record the seed and the smallest known input that causes the failure.

## Other risks

- For an authorization change, do tests for permitted and denied operations at the interface that applies the rule.
- For a denied operation, examine the output and side effects for unauthorized access or changes.
- For concurrency or retries, examine the state of the system after the operations.
- For retries, make sure that side effects occur the correct number of times.
- For a migration, use representative data from the earlier version. Do a test of the documented recovery procedure.
- For performance, compare multiple measurements with a baseline from the same conditions.
- For accessibility, examine keyboard operation and focus. For manual checks, read [Procedural and exploratory QA](qa-procedures.md).
