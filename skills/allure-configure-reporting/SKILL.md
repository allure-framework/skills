---
name: allure-configure-reporting
description: Configure Allure reporting in existing projects by selecting test framework adapters, result directories, local Allure tool installation, package/build scripts, additional evidence integrations, and CI artifact or report handling. Use when tests do not yet emit Allure results, an existing Allure setup is incomplete or broken, or the user asks to install Allure, add adapters, add report commands, publish reports in CI, or add integrations such as HTTP attachments, matchers, screenshots, traces, image diffs, logs, or other rich evidence.
---

# Configure Allure Reporting

## Overview

Use this skill when the primary goal is to make Allure reporting work in an existing project. Leave the project with the smallest idiomatic change that emits Allure results, generates or serves an Allure report, preserves or publishes CI artifacts, or adds the requested evidence integration, plus a clear validation summary.

If the goal is AI/coding-agent workflow guidance after reporting is configured, use `allure-configure-agent-workflow`. If the goal is writing, reviewing, debugging, or enriching tests through Allure agent mode, use `allure-test-agent`.

## Operating Style

Use the checklist as an advisory scaffold, not a rigid script.

- Prefer local project evidence over generic examples.
- Do additional local inspection or official documentation research when package names, config APIs, CI syntax, or installed CLI behavior may have changed.
- Keep optional surfaces out of scope unless the user asked for them, they are needed for validation, or the project already expects them.
- Do not claim setup works without either verified emitted Allure results or a clear caveat about what remains unverified.

## Integration Surfaces

Think in surfaces. Start with the surface that matches the user's goal, but prefer test framework result emission before higher-level report or CI work when reporting is not already working.

1. Test framework integration: make test execution emit Allure results.
2. Allure tool installation: make report generation, serving, or CLI wrapping available through project-approved tooling.
3. Build system scripts and commands: add stable local commands only when they match existing project conventions.
4. Additional integrations: configure official or project-provided integrations for matchers, HTTP capture, screenshots, traces, image diffs, logs, labels, or attachments when they are in scope and useful.
5. CI integrations: preserve Allure results, aggregate shards, generate Allure reports, or publish reports without hiding test failures.

## Advisory Checklist

### Orient

- Identify active languages, package managers, build systems, test runners, and test commands.
- Look for existing Allure dependencies, plugins, reporters, Allure results paths, report scripts, CI artifacts, and documentation.
- Determine which integration surfaces are in scope for this request.
- If multiple plausible runners or build systems exist, determine which one is active for the requested test scope.

### Plan

- State the intended surface, config target, result directory, validation command, and success signal before editing when the change is non-trivial.
- Prefer the smallest additive change that fits the project.
- Preserve existing test wrappers, reporters, package scripts, build tasks, and CI behavior when practical.
- Use current official Allure and test-runner documentation when local evidence is incomplete or likely stale.
- Keep configured Allure result paths named `allure-results`. Many adapters can write to arbitrary paths, but this skill guides projects toward `allure-results` as the stable final directory name. Choose the parent directory from the language, build system, runner, or project output convention. This also matters for `allure run`, whose default discovery looks for directories named `allure-results`.

### Configure

- Add or update framework adapter configuration before adding report generation unless the user explicitly asked for a different surface.
- Keep result paths explicit when the project or integration supports it, using `allure-results` as the stable final directory name.
- Prefer committed runner or build configuration files over environment variables for stable result paths. Use environment variables mainly for per-run overrides, secrets, CI wiring, or cases where the integration only supports environment configuration.
- Avoid replacing unrelated reporters or CI steps unless the existing setup requires it.
- Avoid broad refactors, formatting churn, or new project structure while configuring Allure.

### Validate

- Run the narrowest meaningful local check available.
- Verify whether Allure results were created or updated in the expected directory.
- Inspect enough emitted data to confirm real test identity, status, timing, labels, steps, parameters, or attachments when available.
- If tests fail but Allure files are emitted, distinguish product/test failure from reporting integration success.
- If validation cannot run, explain the blocker and what remains unverified.

### Handoff

- Summarize configured surfaces, changed files, validation command, Allure results path, and remaining unknowns.
- Mention whether Allure results emission, Allure report generation, CI artifact handling, or evidence enrichment was verified.
- If the project has `docs/allure-test-agent.md`, update it when reporting changes affect local wrappers, test commands, Allure results paths, integrations, CI artifacts, run profiles, or evidence conventions.
- If the project does not have agent workflow guidance, suggest `allure-configure-agent-workflow` only after reporting works or the missing reporting pieces are clearly documented.

## Stop And Ask

Ask before proceeding when:

- the requested surface is ambiguous across multiple active test runners
- installing dependencies requires network access or changes the user has not approved
- direct runner commands would bypass a custom wrapper, environment setup, or service startup
- Allure is already configured but appears intentionally disabled or replaced
- validation requires external services, credentials, browsers, containers, paid services, or long-running suites
- CI publishing would require new repository permissions, tokens, branch policies, pages settings, or artifact retention decisions

## Reference Routing

Load only the reference files needed for the current surface:

- Core model and result/report terminology: `references/concepts.md`
- Test framework adapter selection and result emission: `references/test-frameworks.md`
- Allure CLI, package, plugin, or standalone tool choices: `references/tool-installation.md`
- Package scripts, build tasks, Make targets, or wrapper commands: `references/build-system-commands.md`
- Official/project integrations for matchers, HTTP capture, screenshots, traces, image diffs, labels, attachments, and related helpers: `references/additional-integrations.md`
- GitHub Actions, GitLab CI, CircleCI, Jenkins, TeamCity, Azure Pipelines, Buildkite, and artifact/report publication: `references/ci-integrations.md`
- Adaptable best-practice sketches: `references/examples.md`

## Research Guidance

Use local files first. Search official Allure docs, official test-runner docs, package README files, and existing project examples when:

- the adapter package, config API, or CLI option may have changed
- CI syntax or action/plugin versions are provider-specific
- the repo already has partial custom Allure setup
- validation fails in a way that suggests stale guidance
- the user asks for the latest or recommended setup

Do not paste a generic snippet without adapting it to the repository's package manager, wrappers, Allure results paths, and CI model.

## Final Report Shape

When reporting back, prefer this shape:

- Configured: surfaces and changed files.
- Validated: command run and result directory checked.
- Evidence: what Allure results or attachments were observed.
- Agent workflow guidance: updated, unchanged, suggested, or not applicable.
- Partial or blocked: what could not be verified and why.
- Next useful step: optional follow-up surface, such as CI publication or agent workflow guidance.
