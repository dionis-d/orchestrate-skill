# Verification discovery

| Question | Source of truth |
| --- | --- |
| Instructions and completion policy | Agent/contributor docs, optional `.workflow-skills.json` |
| Runtime and dependency setup | Lockfiles, toolchain files, manifests, documented bootstrap |
| Test/build commands | Project scripts, Make targets, task runners, CI jobs |
| Collection and assertions | Runner selection, setup/fixtures, execution summaries |
| Integration prerequisites | Disposable services, environment examples, test namespaces |
| Application checks | E2E config, supported platforms, startup/authentication fixtures |
| Delivery gate | Required CI and local validation extracted from release workflows |

Trace wrappers to actual behavior. Tests may select only unit suites or skip integration when configuration is absent. Confirm collection and non-skipped execution before claiming coverage.

Discover equivalents in any stack; do not install another toolchain because an example uses it. Select the cheapest real boundary proving the contract, then complementary checks for unobserved risk. Shared contracts can require producer and consumer evidence.

Preserve unrelated work when reproducing old behavior. Do not run deployment commands to obtain local testing evidence.
