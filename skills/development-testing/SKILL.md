---
name: development-testing
description: Plan and run risk-based verification before changing executable behavior, contracts, or test reliability; also audit tests on an existing diff. Skip prose-only and cosmetic edits unless they affect built output or product behavior.
---

# Development testing

Choose evidence that would detect the change's likely failures. Use the cheapest test boundary that exercises the real behavior, then add checks for risks it cannot observe. Existing sufficient coverage is a reason to reuse tests, not duplicate them.

## 1. Establish the verification target

Before implementation, inspect the relevant instructions, changed behavior, nearby tests, fixtures, and test configuration. Use available domain documentation and decision records when domain rules or compatibility matter. Discover commands from project scripts and CI; inspect setup and target environments before running integration checks.

Identify the observable contract, a representative success, and the most consequential wrong outcome. Include affected consumers and state transitions where relevant. Resolve material ambiguity from available context; ask only when the missing decision prevents correct work.

Scale verification to impact, uncertainty, and recovery cost:

| Risk                                                                       | Evidence to select                                                                                                                                                                        |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Low: local, well-understood, easily reversed                               | Existing or focused behavioral tests and relevant static checks. A new test should protect a meaningful failure.                                                                          |
| Medium: interaction or compatibility across a boundary                     | Focused cases plus evidence at that boundary, including a likely failure or edge case.                                                                                                    |
| High: authorization, data loss, concurrency, migration, difficult recovery | Complementary checks for the critical invariant, realistic integration, and relevant failure/recovery paths. Add manual or non-functional checks where they reveal otherwise unseen risk. |

For substantive changes, briefly state **behavior → failure risk → test boundary/check**. A short sentence suffices for a small fix. Read [testing strategy](references/testing-strategy.md) when choosing between test levels, doubles, broad input coverage, or non-functional checks. Specialized techniques are selected by risk, not a checklist to run in full.

## 2. Build evidence with the change

- **Bug fix:** reproduce the symptom through the real affected path. Add or adapt a regression test and observe its relevant assertion fail before fixing the code. A setup, import, or compiler failure is not that evidence. If faithful automation is impractical, preserve the reproduction and explain the coverage limit.
- **New behavior:** express acceptance examples before implementation and develop tests with the behavior in small slices. Test-first is useful where it clarifies the contract; it is not mandatory for every edit.
- **Refactor:** establish passing behavioral coverage before risky restructuring. Preserve the contract; characterize undocumented behavior when needed without treating a known defect as the desired specification.
- **Late invocation:** audit the changed behavior and tests, repair in-scope gaps, and use an isolated pre-fix version or targeted mutation if needed. Preserve existing work. Report which evidence was actually observed; late loading alone does not establish thinner coverage.

When diagnosis or explicit TDD is already in use, keep one implementation loop and use this skill for risk selection and complementary evidence. This skill adds no separate approval checkpoint. Follow applicable repository instructions and existing user authorization.

## 3. Check that tests discriminate

For each added or changed test, name a plausible incorrect behavior its assertion should reject. Expectations should follow from the contract, known examples, or independent invariants. Exercise production behavior through a stable interface; mock dependencies only where their real behavior is outside the claim.

Read [assertion quality](references/assertion-quality.md) when auditing weak tests, using mocks or shared expected values, designing property/snapshot checks, or applying a deletion/mutation check. Deletion is one diagnostic: surviving it is not automatically tautology, and failing to compile proves nothing about an assertion. Demonstrate sensitivity with the observed regression or a valid targeted mutation when risk or uncertainty warrants it; mechanical mutation of every test is unnecessary.

Keep fixtures isolated and reproducible. Control clocks, randomness, identities, and relevant locale/time-zone settings. Await asynchronous work; use bounded condition waits and framework retrying assertions for rendering or eventual results. Diagnose whole-test retries separately from these waits.

## 4. Validate and close

Run focused checks first, then affected integration/consumer checks and applicable static/build checks. Confirm the intended tests were collected and executed; a zero-test run or skipped database suite is not a pass. Parallelize only checks with independent resources.

Apply the project's completion gate after the final relevant edit. Use the installed `release-gate` skill if available; otherwise discover and run equivalent checks directly. Select additional integration/browser checks from the changed boundary. Read [verification discovery](references/verification-discovery.md) when resolving commands, environments, or gate coverage. This skill works independently of the other skills in this collection. Optional root `.workflow-skills.json` supplies project guidance; repository instructions and actual CI remain authoritative.

Investigate failures, fix those introduced by this work, and preserve evidence for unrelated or unresolved failures. For coverage, mutation, flaky-test, or performance claims, read [quality measurement](references/quality-measurement.md). Once selected checks pass, stop expanding or repeating them unless a new change, failure, or uncovered risk justifies it.

Before concluding, review the diff for missed behavior, weakened assertions, accidental skips, and temporary instrumentation. Report the behavior verified, checks actually run and their results, and material gaps with reasons. Distinguish passed, failed, partial, and not-run evidence; a blocker is not successful verification. Keep this proportional to the task rather than emitting empty report headings.

## Additional references

- [BDD](references/bdd.md): stakeholder-readable acceptance examples.
- [QA procedures](references/qa-procedures.md): visual, accessibility, exploratory, or recovery checks needing human judgment.
