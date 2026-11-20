# Assertion quality

## Expected results

- If a rule uses one source before a fallback source, give the two sources different test values.
- If a test double supplies input to an adapter, compare the output from the adapter with the expected output.
- If a contract specifies a call count or destination, put that requirement in an assertion.
- If an interoperability test uses a round trip, add a known example of the wire format.
- Before you accept a snapshot change, compare the new output with the contract.
- If a contract specifies an error, put that error in the assertion.
- If the error is an asynchronous rejection, wait for the assertion to complete.
- If a test must show that an operation has no side effects, examine the side-effect log after the operation.

## Mutation checks

For a mutation check, change one behavior in an isolated copy.
Make sure that the test reaches the assertion for that behavior.
Make sure that the assertion fails because of the mutation.
Do the test again on the code without the mutation.
If the test passes with the mutation, examine the input and expected result.
If the mutation gives an equivalent result, record that result.
