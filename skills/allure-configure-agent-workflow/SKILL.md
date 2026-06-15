---
name: allure-configure-agent-workflow
description: Configure project guidance for AI/coding agents to use Allure agent mode during test work by detecting local test commands, Allure capabilities, result paths, and evidence conventions, then creating short root agent routers plus docs/allure-test-agent.md. Use when the goal is agent workflow guidance, evidence review workflow, expectations, and project-specific test-work instructions; not when the primary goal is installing Allure adapters, making tests emit results, adding report scripts, or configuring CI publishing.
---

# Configure Allure Agent Workflow

Use this skill when a project wants to configure AI/coding-agent workflow guidance for test work and test reviews with Allure agent mode.

If the primary goal is to install framework adapters, make tests emit Allure results, add report scripts, or configure CI report publishing, use `allure-configure-reporting` instead.

- If a command executes tests and its result will be used for smoke checking, reasoning, review, coverage analysis, debugging, or any user-facing conclusion, run it through `allure agent`. It preserves the original console logs and adds agent-mode artifacts without inheriting the normal report or export plugins from the project config.
- Use `allure agent` for smoke checks too, even when the change is small or mechanical.
- Only skip agent mode when it is impossible or when you are debugging agent mode itself.

## Goal

Leave the project with:

- root agent entry-file router guidance, such as `AGENTS.md`, `CLAUDE.md`, or other project-specific agent instruction files, that points test work to `docs/allure-test-agent.md`
- a project `docs/allure-test-agent.md` guide with local wrappers, capabilities, Allure integrations, test-design conventions, run profiles, expectation controls, output/state policy, execution-signal notes, metadata conventions, and evidence conventions
- enough Allure bootstrap guidance for the agent to continue, even if the project is not fully configured yet

## Workflow

1. Check whether the project already emits Allure results or already has Allure configuration.
2. If Allure is missing and the user wants reporting configured, hand off to `allure-configure-reporting`. If the user only wants agent workflow guidance, document the missing reporting setup as unknown or blocked.
3. Inspect the current local Allure CLI capabilities with the project wrapper, `allure --version`, and `allure agent --help` before writing supported commands or flags into project guidance. If the detected Allure CLI version is lower than `3.11.0`, warn the user that the full agent-mode runtime-evidence workflow requires `allure@3.11.0` or newer and mark agent execution as unsupported or limited. Use the version check only to confirm support and warn on an old CLI; do not write the exact detected Allure version into project docs.
4. Discover or document local test facts: test frameworks, wrappers, test roots, Allure integrations, Allure results paths, run profiles, supported selectors, expectation controls, output/state/rerun behavior, metadata conventions, evidence conventions, and CI/default-command execution signal when visible. Keep agent output, framework Allure results, and generated reports distinct.
5. Treat command flags, config keys, and environment variables as supported only after local evidence, installed help, official Allure/test-runner docs, or package README/source confirms them. If they cannot be confirmed, write `unknown` instead of guessing.
6. If this skill is being used after `allure-configure-reporting` changed reporting configuration, refresh any stale local wrappers, test commands, Allure results paths, integrations, CI artifacts, run profiles, and evidence conventions in `docs/allure-test-agent.md`.
7. Create or update relevant root agent entry files so test-related work points to `docs/allure-test-agent.md`. Use existing project conventions first, such as `AGENTS.md`, `CLAUDE.md`, or other model-specific instruction files. If none exist, create `AGENTS.md` as the default Codex-friendly router and keep the snippet easy to copy into other entry files.
8. Create `docs/allure-test-agent.md` from the bundled template and adapt only the parts that must be project-specific.
9. Keep helper-command descriptions short and practical. Put exact commands and supported flags in the generated project guide only after confirming them in the local environment.
10. Keep changes minimal and additive. Preserve unrelated project guidance in every entry file you touch.

## Files To Use

- Project guide template: `references/project-guide-template.md`
- Agent entry-file router snippet: `references/root-agent-entry-snippet.md`

## Guardrails

- Keep agent entry files short. They should route, not duplicate the whole guide.
- Keep helper-command notes short. Prefer one-line descriptions over a growing command catalog.
- Do not store exact Allure versions in generated project files. Do not add fields such as `Detected Allure CLI: 3.8.2` or `Allure version: ...`; store the wrapper, a capability snapshot timestamp or commit, and refresh commands instead.
- Do not invent project-specific metadata conventions unless the repo already uses them.
- Do not invent CI gating status, run profiles, selector support, Allure integration status, metadata conventions, evidence conventions, or expectation controls. Mark unknowns explicitly.
- Do not create persistent agent output or expectation paths in the project guide. Modern `allure agent` creates and prints a temp output directory by default; document explicit `--output` paths only when the project has a concrete convention. Agent output is separate from stable Allure results paths such as `<parent>/allure-results`.
- Do not synthesize framework result-directory environment variables such as `ALLURE_RESULTS_DIR` in agent commands. Document them only when the local adapter, installed help, official docs, or package README/source confirms them, and keep the final directory name `allure-results` when the results must be discovered by Allure.
- If the project already has better Allure instructions, merge carefully instead of overwriting them.
