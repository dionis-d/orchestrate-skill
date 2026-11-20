---
name: orchestrate
description: Use for independent implementation tasks that need isolated workspaces or integration in sequence.
---

# Coordinate workers

If a delivery coordinator is active, do the assigned phase. For standalone use, give the user the integrated local result unless the request specifies another result. For delivery, use `ship-change` if available. If that skill is unavailable, use the project procedure.

## 1. Prepare

1. Read the request and repository instructions.
2. If `.workflow-skills.json` is available, read the project preferences.
3. Use preferences that agree with the repository instructions.
4. Record the base revision and the acceptance criteria.
5. Use the [worker brief](references/worker-prompt.md) to give each worker one task.
6. For parallel work, give each worker an isolated writable workspace.
7. Before work starts, make sure that each workspace and branch agree with its assignment.
8. If you cannot isolate writable workspaces or test resources, do the work in sequence.
9. Use disposable test data and the minimum necessary access.
10. Before any check, examine the command and the programs it starts for effects outside the approved scope.
11. If a command has such effects, use a check-only command that the project accepts.
12. If there is no such command, record the missing check.

## 2. Integrate

1. Compare each worker result with the assigned base and acceptance criteria.
2. Examine the diff and applicable local files before integration.
3. Integrate the changes in dependency order.
4. After conflict resolution or other changes, do the applicable checks again.
5. Examine the integrated diff.
6. If independent review is necessary before handoff, get that review on the integrated revision.

Give the coordinator or user the integrated revision, check results, and missing evidence. Keep changes that other work needs. If the work is safe and you have approval, remove the temporary resources.

For new or changed English technical text, use [ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) if the output rules let you.
