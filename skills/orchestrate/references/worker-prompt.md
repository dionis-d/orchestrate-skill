# Worker brief

Fill the applicable fields with values from the target project's working context.

```text
Task and acceptance criteria: <one bounded implementation task>
Project instructions: <relevant instructions and compatible phase skills>
Assigned workspace, branch, and baseline: <verified workspace and revision>
Writable scope and dependencies: <files, behavior, dependencies>
Resources: <isolated fixtures, namespaces, and reserved shared resources>
Verification: <focused checks and applicable requirements for local handoff>
Authorized actions: <explicit worker transitions and side effects>

Verify the workspace and branch before writing or running checks. Work within
the assigned scope. Report cross-worker dependencies before touching shared
resources. Use documented disposable fixtures and authorized access.

Return the candidate revision, behavior changed, checks and results, where
they ran, relevant environment and fixture details, and remaining evidence
or scope gaps. Identify dirty or ignored artifacts relevant to handoff.
```

The coordinator handles integration, independent review, the final integrated gate, and external delivery. Assign an exception only for a specific phase or check the worker is authorized to perform.
