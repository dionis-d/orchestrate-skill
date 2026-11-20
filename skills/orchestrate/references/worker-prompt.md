# Worker brief

Give each worker this information.

| Field | Information |
| --- | --- |
| Task | One task and its acceptance criteria |
| Workspace | Path, branch, and exact base revision |
| Scope | Files the worker can change |
| Project rules | Instructions and required checks for this task |
| Test resources | Isolated test data and any shared resource |
| Approval | Actions the worker can do |

Tell the worker to make sure that the workspace agrees with the assignment before a change. Tell the worker to give you the details before use of a shared writable resource.

Give each worker the rules for commands with effects outside the approved scope. If there is no approved check-only command, tell the worker to record the missing check.

Get the changed revision, check results, test environment, and missing evidence. Get the status of applicable files outside the commit. If a change is unnecessary, get evidence that the work meets its acceptance criteria.
