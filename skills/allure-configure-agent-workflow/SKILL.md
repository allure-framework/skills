---
name: allure-configure-agent-workflow
description: Configure project guidance for AI/coding agents to use Allure agent mode during test work by detecting local test commands, Allure capabilities, result paths, and evidence conventions, then creating short root agent routers plus docs/allure-agent-mode.md. Use when the goal is agent workflow guidance, evidence review workflow, expectations, and project-specific test-work instructions; not when the primary goal is installing Allure adapters, making tests emit results, adding report scripts, or configuring CI publishing.
---

# Configure Allure Agent Workflow

Use this skill when a project wants to configure AI/coding-agent workflow guidance for test work and test reviews with Allure agent mode.

If the primary goal is to install framework adapters, make tests emit Allure results, add report scripts, or configure CI report publishing, use `allure-configure-reporting` instead.

- If a command executes tests and its result will be used for smoke checking, reasoning, review, coverage analysis, debugging, or any user-facing conclusion, run it through `allure agent`. It preserves the original console logs and adds agent-mode artifacts without inheriting the normal report or export plugins from the project config.
- Use `allure agent` for smoke checks too, even when the change is small or mechanical.
- Only skip agent mode when it is impossible or when you are debugging agent mode itself.
- After an `allure agent` run, read the agent output, not the console: open `index.md`, read the `manifest/*.jsonl` files, or use `allure agent query --latest`. Never pipe an agent run to `tail`, `grep`, or `head` to reach a conclusion. Doing so discards the printed agent-output directory path and reverts to raw-log parsing, which defeats the purpose of agent mode. Make this rule explicit in the routers and the generated project guide.

## Goal

Leave the project with:

- root agent entry-file router guidance that points test work to `docs/allure-agent-mode.md`, present for every agent runtime used in the repo. These entry files are not interchangeable: Claude Code loads `CLAUDE.md` and does not read `AGENTS.md`, Codex reads `AGENTS.md`, and other tools read their own files. Do not leave any targeted runtime without a router.
- a project `docs/allure-agent-mode.md` guide with local wrappers, capabilities, Allure integrations, test-design conventions, run profiles, expectation controls, local/CI existing-result or dump inspection support, human-report mode policy, output/state policy, execution-signal notes, metadata conventions, and evidence conventions
- enough Allure bootstrap guidance for the agent to continue, even if the project is not fully configured yet

## Workflow

1. Check whether the project already emits Allure results or already has Allure configuration.
2. If Allure is missing and the user wants reporting configured, hand off to `allure-configure-reporting`. If the user only wants agent workflow guidance, document the missing reporting setup as unknown or blocked.
3. Inspect the current local Allure CLI capabilities with the project wrapper, `allure --version`, `allure agent --help`, and `allure agent capabilities --json` before writing supported commands or flags into project guidance. If existing-result or dump review is in scope, also check `allure agent inspect --help` when the wrapper exposes it. If the detected Allure CLI version is lower than `3.11.0`, warn the user that the full agent-mode runtime-evidence workflow requires `allure@3.11.0` or newer and mark agent execution as unsupported or limited. If existing-result inspection is in scope and the detected CLI is lower than `3.12.0` or lacks `agent inspect`, mark inspect as unsupported or limited. Use version checks only to confirm support and warn on old CLIs; do not write the exact detected Allure version into project docs.
4. Discover or document local test facts: test frameworks, wrappers, test roots, Allure integrations, Allure results paths, run profiles, supported selectors, expectation controls, output/state/rerun behavior, existing-result or dump inspection support, metadata conventions, evidence conventions, and CI/default-command execution signal when visible. Keep agent output, framework Allure results, dump artifacts, and generated reports distinct.
5. Treat command flags, config keys, and environment variables as supported only after local evidence, installed help, official Allure/test-runner docs, or package README/source confirms them. If they cannot be confirmed, write `unknown` instead of guessing.
6. If this skill is being used after `allure-configure-reporting` changed reporting configuration, refresh any stale local wrappers, test commands, Allure results paths, integrations, CI artifacts, run profiles, and evidence conventions in `docs/allure-agent-mode.md`.
7. Create or update root agent entry files so test-related work points to `docs/allure-agent-mode.md`. Each agent runtime reads its own entry file and they are not interchangeable: Claude Code loads `CLAUDE.md` and does not read `AGENTS.md`, while Codex reads `AGENTS.md`. Honor existing project conventions first. When no entry file exists, create both `AGENTS.md` and `CLAUDE.md` so neither Codex nor Claude Code is left without the router; if the project wants a single source of truth, make `CLAUDE.md` a symlink to `AGENTS.md` or have it carry the same short snippet. When an entry file exists for one runtime but not another that works in the repo, add the missing one rather than assuming the existing file is shared. Keep the snippet easy to copy into other model-specific instruction files.
8. Create `docs/allure-agent-mode.md` from the bundled template and adapt only the parts that must be project-specific.
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
- Do not create persistent agent output or expectation paths in the project guide. Modern `allure agent` creates and prints a temp output directory by default, and `allure@3.12.0` and newer clean CLI-provided agent output automatically through agent-mode lifecycle handling. Document explicit `--output` paths only when the project has a concrete convention, and state that caller-provided output must be removed or archived by the agent when no longer needed. Agent output is separate from stable Allure results paths such as `<parent>/allure-results`.
- Do not synthesize framework result-directory environment variables such as `ALLURE_RESULTS_DIR` in agent commands. Document them only when the local adapter, installed help, official docs, or package README/source confirms them, and keep the final directory name `allure-results` when the results must be discovered by Allure.
- Do not claim `allure agent inspect` support for existing results or dump artifacts unless `allure agent capabilities --json` or local help confirms the command and the exact input/output syntax. Version output alone is not enough.
- If the project already has better Allure instructions, merge carefully instead of overwriting them.
