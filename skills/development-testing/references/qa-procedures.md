# Procedural and exploratory QA

Use procedural QA when automation cannot economically provide enough confidence, particularly for visual, hardware, environment-specific, recovery, or human-perception behavior. It complements repeatable automation rather than replacing it.

## Procedure

Write a runnable procedure with:

1. Objective and scope.
2. Required environment and exact build.
3. Preconditions, test data, and accounts.
4. Numbered actions with an expected result after each meaningful action.
5. Negative, boundary, and recovery cases justified by risk.
6. Evidence to capture, such as screenshots, logs, traces, timings, or record identifiers.
7. Cleanup or restoration.
8. Binary pass/fail criteria and known limitations.

Keep credentials and personal data out of the procedure. Do not perform production or external-system testing without authorization.

## Exploratory charter

Time-box the session and state:

- Area and risk to explore.
- User persona and goal.
- Data variations and failure modes.
- Available observability.
- Evidence to retain.

Record each finding with impact, exact reproduction steps, environment/build, expected versus observed behavior, and captured evidence. Separate confirmed defects from questions and observations.
