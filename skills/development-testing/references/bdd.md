# BDD and Gherkin

Use Gherkin when product, QA, business, or domain stakeholders benefit from reviewing behavior in shared domain language and the scenarios map to acceptance criteria. Prefer an ordinary automated test when it communicates the behavior more directly.

## Scenario shape

- `Feature` names one user or business capability.
- `Background` contains only context genuinely shared by every scenario.
- `Scenario` describes one meaningful behavior.
- `Given` establishes relevant initial state.
- `When` performs one primary action.
- `Then` states observable outcomes.
- `And` or `But` improves readability without hiding multiple actions.
- `Scenario Outline` holds a small, meaningful example table; use ordinary parameterized tests for broad data variation.

Scenarios describe behavior rather than click mechanics or internal implementation. Keep them independent, consistent in domain vocabulary, narrowly scoped, and traceable to acceptance criteria. Make them executable when the project supports that. Use tags only for a real execution or review purpose such as risk, feature, test level, or execution group.

Check that scenarios and lower-level tests do not redundantly assert the same details. A Gherkin scenario should protect stakeholder-visible intent; focused tests should carry technical boundaries and edge cases.
