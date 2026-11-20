# Quality measurement

## Coverage and mutation

Use the project thresholds.
For coverage results, give the metric and the code that the tool measured.
Before you measure the mutation score, make sure that the baseline tests pass.
Before you add a test for a surviving mutation, make sure that the mutation can change the observable result.
Give the scope and the counts for each result category from the tool.
For a manual mutation check, give the result for that mutation only.

## Intermittent failures

For an intermittent failure, keep the first failure output and the test configuration.
Examine test order, shared state, timing, and random inputs.
After you correct the cause, do the test again.
If a retry passes, record the first failure and the result of the retry.
