# Research and adaptation decisions

Researched 2026-10-07. Sources below are primary project documentation, not third-party installation guides.

| Source | Applied decision |
| --- | --- |
| [Vercel skills CLI](https://github.com/vercel-labs/skills) | Support discovery from `skills/`; document interactive installation, local/Git sources, and list/check/update/remove. Retain that tool for its supported harnesses instead of impersonating its lockfile. |
| [Agent Skills specification](https://agentskills.io/specification) | Required name/description, names matching directories, limited metadata, short entrypoints, references loaded as needed, relative links, self-contained folders. |
| [OpenAI local skills](https://learn.chatgpt.com/docs/build-skills) | Current Codex documents `.agents/skills` at repository and user scopes. The skills CLI table still lists `~/.codex/skills`; this installer follows the current product docs. Verify your runtime if using an older Codex release. |
| [Claude Code skills](https://code.claude.com/docs/en/skills) | Project/user `.claude/skills`; keep supported core frontmatter and avoid product-specific tool allowlists in shared instructions. |
| [ZCode skills](https://zcode.z.ai/en/docs/skill), [FAQ paths](https://zcode.z.ai/en/docs/qa) | `.zcode/skills` at project/user scope, standard frontmatter, import/copy options, refresh and enable after installation. Add a local installer because ZCode is absent from the skills CLI table checked today. |
| [OpenCode skills](https://opencode.ai/docs/skills/) | `.agents/skills` is documented at both scopes and can share Codex copies. Avoid assuming subagent dispatch provides worktree isolation. |

## Portability decisions

Project-specific workflows were adapted into three independently installable skills: `orchestrate`, `development-testing`, and `release-gate`. Generic assertion, BDD, QA, measurement, and strategy references were retained. Repository-specific verification guidance was replaced with project-neutral command and environment discovery. All three skills include optional OpenAI display metadata alongside portable instructions.

The orchestration entrypoint uses a short workflow plus capability guidance and a worker brief. Base branch, ticket format, concurrency, ports, and model selection come from the target project and available tools. Environment files are not copied automatically, and no external workflow skill is required. One-writer isolation, dependency waves, acceptance review, clean committed delivery, and integration ownership remain central. Unresolved material review findings block integration even after a repair budget is exhausted.

The release gate discovers required project checks rather than assuming a package manager, language, directory layout, or fixed command. It includes build/config/dependency risks and distinguishes pass/fail/incomplete/not-applicable evidence. A local pass does not guarantee a successful production release.

## Installer choices

The standard skills CLI provides ecosystem-compatible distribution. The additional zero-dependency Node installer supports offline/local usage, ZCode, custom discovery paths, and conservative management of owned copies. Its manifest is separate from `skills-lock.json`; managers do not adopt one another's installations.

Copies work without Windows link privileges and remain portable when a source checkout moves. Hashes cover file names and bytes, enabling refusal of changed or unmanaged destinations. Preflight validates the full selected batch before writing. Exclusive mutation guards avoid competing installer writers, and staging prevents partially copied entrypoints being mistaken for a finished installation. There is no full multi-directory rollback or automatic crash recovery; documentation states that limit.

Tests exercise actual filesystem/CLI outcomes. They validate installer guarantees, not agent compliance with prose. Cross-harness session evaluation and remote GitHub distribution are not claimed merely because local validation passes.
