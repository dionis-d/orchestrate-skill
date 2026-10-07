# Worker brief

Replace fields with concrete values; omit irrelevant fields. Give each worker the complete brief.

```text
Task: <ticket or complete task and acceptance criteria>
Instructions: <paths and relevant inherited rules>
Worktree: <absolute path>
Branch: <assigned branch>
Baseline: <commit SHA>
Scope: <files, behavioral boundaries, dependencies>
Resources: <ports / disposable database / temporary namespace>
Verification: <commands, working directories, prerequisites, expected behavior>
Endgame: <local commits or explicitly authorized push/draft PR>

Implement only in the assigned worktree and branch. Preserve unrelated work.
Report cross-worker scope/resource dependencies before touching them. Discover
setup from repository instructions; do not copy secrets. Test acceptance behavior.
Commit intended changes when authorized; report remaining dirty/ignored artifacts.
Do not merge branches or administer sibling worktrees. Publishing is limited to
the explicit endgame above.

Return: done/blocked and reason; behavior changed; commit hashes; commands actually
run and results; missing evidence; unresolved findings; PR URL when applicable.
```
