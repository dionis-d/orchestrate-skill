# Assertion quality

A useful test distinguishes intended behavior from a plausible defect. Start with the contract and observe the real result, persisted effect, emitted interaction, or invariant it promises.

## Independent expectations

Use known examples, an independently established fixture, or a domain invariant. Avoid computing the expected result with the same production function or copying the implementation's algorithm. A fixture or catalog constant is independent only for the claim being made: it may verify selection or passthrough, but cannot also prove its own content correct.

When alternatives compete, give them distinguishable values. For a problem-code mapping that must outrank server detail, provide raw detail such as `duplicate key value` and expect the approved friendly copy. If both inputs contain the same friendly text, the test cannot distinguish mapping from fallback. Add unknown-code fallback only if that behavior belongs to the contract.

A mocked dependency's value may legitimately be the expectation for an adapter's passthrough contract. Assert the real adapter result; checking the mock directly verifies the fixture rather than the adapter. Verify call count or arguments when they express required behavior, such as idempotency or destination routing, rather than incidental internal ordering.

## Sensitivity checks

Ask which plausible mistake would break this assertion: reversed precedence, omitted authorization, wrong boundary operator, dropped field, duplicate side effect, or incorrect state transition. The regression's observed pre-fix failure is often sufficient evidence.

When uncertainty remains, make one valid targeted mutation in an isolated copy or safely reversible edit, run the focused test, then restore and rerun it. Preserve unrelated work and concurrent edits; never reset the working tree to perform this check. Confirm the failure is the relevant behavioral assertion, not a broken import, setup, or compile error.

The deletion check is a special case: remove the claimed behavior and see whether its test notices. A survivor suggests inspecting the oracle, chosen input, redundancy, or behavioral equivalence. It does not by itself prove tautology. Conversely, a killed mutation shows sensitivity to that fault, not comprehensive correctness. See [quality measurement](quality-measurement.md) before reporting mutation results.

## Properties, snapshots, and failures

- A round trip alone may allow paired defects. Add known wire-format examples or an independent constraint where interoperability matters.
- Snapshot/golden tests suit reviewable structured output or appearance. Inspect changed output against the intended contract before accepting it; automatic regeneration is not verification.
- Assert specific error meaning or contract when it matters, and await rejection assertions. A broad exception catch can accept a different failure or an unexpected success.
- Check no-write/no-send guarantees at completion or via recorded side effects. Immediate absence can pass before faulty asynchronous work executes.

Repair weak tests within the changed behavior. Passing execution, code coverage, and a convincing test name do not substitute for an assertion that can reject the wrong result.
