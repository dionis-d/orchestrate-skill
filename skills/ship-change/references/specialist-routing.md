# Route a phase

Use one route at a time per applicable phase and keep delivery with the active coordinator.

1. Reuse qualifying evidence and the current phase owner or route when it covers the work and satisfies repository policy. Follow the repository-required route when specified, including native review or repository checks. Identify any uncovered or unmet requirement before assigning more work.
2. For an unassigned phase, check the skills and native capabilities exposed by the current client. Choose at most one available specialist by its advertised capability, compatibility with the repository and phase, and authorization. Use the direct approach for a narrow phase when a specialist adds no value and policy permits. The names below are examples. Skip disabled skills and use manual-only skills only when explicitly invoked by the user and permitted by the client.
3. Use the client's supported skill loader or, where supported, read the selected skill's client-exposed, authorized `SKILL.md` path. If neither is available, use the direct phase approach. Do not guess paths or tool names, bypass invocation restrictions, or install missing skills.
4. Bound each handoff to one phase. Give the specialist the objective, applicable repository rules, fixed baseline or candidate, workspace, permissions, acceptance criteria, and existing evidence. Ask for results, the covered revision, evidence, and gaps. Keep integration and delivery transitions with the coordinator. Use returned evidence in the existing review and verification steps.

| Phase | Capability and example | Direct approach |
| --- | --- | --- |
| Diagnosis of an uncertain failure | Reproduce and isolate the cause, e.g. `diagnosing-bugs` | Reproduce through the affected path and confirm the cause. |
| Requested or applicable test-first work | Develop behavior against a focused failing test, e.g. `tdd` | Add a focused failing test and verify it passes with the fix. |
| Implementation and integration | Isolate and coordinate bounded workers when needed, e.g. `orchestrate` | Implement and integrate in the current coordinator using the entrypoint's workspace rules. |
| Change-focused testing and analysis | Select checks for changed behavior and risks, e.g. `development-testing` or repository-prescribed changed-code analysis tools | Inspect affected consumers and use applicable static, regression, and boundary checks. |
| Independent review | Review a fixed candidate against the request and standards, e.g. `code-review` or a native reviewer | Use authorized native independent review where available. Otherwise follow the entrypoint's pending-review procedure. |
| Required verification | Run or verify required checks, e.g. repository commands, CI, or `release-gate` for unmet verification needs | Run applicable authorized repository checks and record evidence using the entrypoint's receipt rules. |
| PR preparation | Draft the PR body using project conventions, e.g. `pr` | Prepare scope, evidence, gaps, and recovery details. The coordinator handles authorized PR operations through the repository or provider interface. |

Direct work can proceed where authorized. If a mandatory route or its evidence is unavailable, record the missing requirement and hold the dependent transition until policy is satisfied.
