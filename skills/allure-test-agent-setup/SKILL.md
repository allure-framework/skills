---
name: allure-test-agent-setup
description: Add Allure test-agent guidance to a project by detecting the local Allure and test setup, adding short root agent entry-file routers such as AGENTS.md or CLAUDE.md, and creating docs/allure-test-agent.md for future test authoring and review work.
---

# Allure Test Agent Setup

Use this skill when a project wants to adopt Allure test-agent guidance for test work and test reviews.

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
2. If Allure is missing, add or suggest the smallest viable install/config path for the project. Treat this as best-effort bootstrap, not the main acceptance path.
3. Inspect the current local Allure CLI capabilities with the project wrapper, `allure --version`, and `allure agent --help` before writing supported commands or flags into project guidance. Use the version check only to confirm the wrapper works; do not write the exact Allure version into project docs.
4. Discover or document local test facts: test frameworks, wrappers, test roots, Allure integrations, result paths, run profiles, supported selectors, expectation controls, output/state/rerun behavior, local agent service status, metadata conventions, evidence conventions, and CI/default-command execution signal when visible.
5. Create or update relevant root agent entry files so test-related work points to `docs/allure-test-agent.md`. Use existing project conventions first, such as `AGENTS.md`, `CLAUDE.md`, or other model-specific instruction files. If none exist, create `AGENTS.md` as the default Codex-friendly router and keep the snippet easy to copy into other entry files.
6. Create `docs/allure-test-agent.md` from the bundled template and adapt only the parts that must be project-specific.
7. Keep helper-command descriptions short and practical. Put exact commands and supported flags in the generated project guide only after confirming them in the local environment.
8. Keep changes minimal and additive. Preserve unrelated project guidance in every entry file you touch.

## Files To Use

- Project guide template: `references/project-guide-template.md`
- Agent entry-file router snippet: `references/root-agent-entry-snippet.md`

## Guardrails

- Keep agent entry files short. They should route, not duplicate the whole guide.
- Keep helper-command notes short. Prefer one-line descriptions over a growing command catalog.
- Do not store exact Allure versions in generated project files. Do not add fields such as `Detected Allure CLI: 3.8.2` or `Allure version: ...`; store the wrapper, a capability snapshot timestamp or commit, and refresh commands instead.
- Do not invent project-specific metadata conventions unless the repo already uses them.
- Do not invent CI gating status, run profiles, selector support, Allure integration status, metadata conventions, evidence conventions, or expectation controls. Mark unknowns explicitly.
- Do not create persistent output or expectations paths in the project guide. Those are per-run temp artifacts.
- If the project already has better Allure instructions, merge carefully instead of overwriting them.
