# BDD and Gherkin

Use one observable behavior in each Gherkin scenario.
Use the terms from the acceptance criteria.

1. Use `Given` for the initial state.
2. Use `When` for the action.
3. Use `Then` for the observable result.

For a small set of inputs with the same behavior, use a `Scenario Outline`.
If the project supports executable scenarios, connect each scenario to its test.
