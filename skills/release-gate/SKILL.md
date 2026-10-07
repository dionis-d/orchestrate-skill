---
name: release-gate
description: Run and report the project's required completion or pre-release quality checks after the final relevant change. Use before handing off executable, configuration, dependency, generated-output, or release-affecting changes, or when explicitly asked to verify readiness.
---

# Release gate

Establish whether the final artifact meets this project's quality requirements. A local pass supplies evidence for the checked revision and environment; it cannot guarantee a future deployment succeeds.

## Discover scope and commands

Read repository instructions, optional root `.workflow-skills.json`, manifests, and CI/release workflows. Inspect what commands actually do; configuration is guidance, not permission. Use the actual language, package manager, working directories, platforms, and prerequisites.

Identify the task baseline and final diff, including committed task changes and relevant untracked files. Do not attribute every dirty file or the last commit to this task. Include runtime code, tests, build settings, dependencies, migrations, and generated artifacts affecting delivery. Docs, styling, markup, and assets can require checks when built, published, or affecting behavior; follow project policy rather than extension-only exemptions.

Use the defined local gate. Otherwise derive an explicit set from required CI checks: relevant tests, static checks, builds, contract/schema validation, and affected integration boundaries. State the derived set and gaps. Do not substitute a convenient unit suite for required completion checks.

Configuration is optional. If no discoverable rules or commands establish readiness, run available meaningful checks and report readiness as unconfirmed rather than inventing a pass.

## Run and evaluate

Run checks after the last relevant edit from correct directories. Reuse evidence for the exact final artifact when no relevant source, environment, or dependency changed. After repairs, rerun affected checks and any invalidated aggregate gate. Parallelize only checks with independent resources.

Inspect wrappers before execution. Extract local checks from scripts that also push, tag, publish, deploy, or mutate production; this skill does not authorize those actions. Use disposable test resources. Report unavailable access/environments while completing independent checks.

Confirm expected tests were collected, executed, and not silently skipped. Record command, directory, revision/diff context, result, and material limitations. Static checks alone do not establish runtime behavior.

Fix failures introduced by the task within scope. Preserve evidence of unrelated failures. Never weaken assertions, disable checks, bypass protections, or silently retry flakes until green. Report bounded diagnostic reruns. Unresolved required checks stay failed or incomplete.

## Report

State `pass`, `fail`, `incomplete`, or `not applicable`, with checks and reasons. Pass requires all required checks for the final artifact to pass. Distinguish unavailable remote/platform checks from local passes. For unintegrated branches, state that the integrated result still needs validation. Do not imply a release occurred.
