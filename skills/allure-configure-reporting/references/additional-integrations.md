# Additional Integrations

Use this reference when the task is to configure integrations beyond basic test framework result emission, such as matchers, HTTP capture, browser artifacts, screenshots, traces, image diffs, logs, labels, or attachment helpers.

This file is about whether and how to configure an integration. Detailed evidence quality rules belong to the `allure-agent-mode` skill, especially `references/allure-evidence.md`, when that skill is available.

## Selection Rule

If an official Allure integration exists for the framework, runner, assertion library, browser tool, HTTP client, or artifact type in scope, prefer it over custom instrumentation.

Preference order:

1. Official Allure integration for the tool.
2. Existing project-provided Allure helper or wrapper.
3. Tool-native artifact support that an official Allure adapter can attach or link.
4. Small custom helper at a stable boundary only when no official/project integration exists and the evidence is required.

Do not add integrations just because they are available. Configure integrations only when they match the user's request, an existing project convention, a clear debugging need, or a natural companion to the selected test framework adapter.

## Useful Integration Categories

- Assertion or matcher integrations that report meaningful checks.
- HTTP/API integrations that attach structured exchanges.
- Browser integrations that preserve screenshots, videos, traces, console logs, or page artifacts.
- Visual comparison integrations that emit image diffs.
- Metadata helpers for labels, links, parameters, descriptions, environment, executor, categories, or history when the project uses them.

## Ask Or Proceed

Usually proceed without asking when:

- the user explicitly requested the integration
- the integration is official, low-risk, and standard for the selected adapter
- the project already uses the integration pattern elsewhere
- the integration is needed to validate the configured reporting surface

Ask before configuring when:

- the integration adds dependencies, runtime overhead, artifact volume, privacy risk, or CI storage cost
- multiple competing official integrations exist
- the integration changes test behavior, retries, network capture, browser tracing, or artifact retention
- the value is unclear and the integration would be speculative

## Configuration Principles

- Keep useless integrations out of the project. If an integration will not produce useful review or debugging value, do not add it.
- Prefer configuration-level integration over wrapping many tests manually.
- Configure at stable helper boundaries, such as HTTP clients, page objects, assertion setup, fixture setup, or runner config.
- Preserve project naming, redaction, artifact retention, and CI conventions.
- Avoid creating a parallel evidence taxonomy. If the project needs evidence-quality decisions, use `allure-agent-mode` and its evidence guide.

## Validation

Run the smallest test or command that exercises the configured integration. Confirm that Allure results contain the expected integration signal, such as matcher checks, an HTTP exchange attachment, a trace link, an image diff, or configured metadata.
