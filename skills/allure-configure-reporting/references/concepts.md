# Allure Reporting Concepts

Use this reference when the task needs Allure terminology, result/report boundaries, or validation criteria.

## Core Model

- Adapter or integration: the test-runner-specific code that observes tests and writes Allure result data.
- Allure results: raw machine-readable results emitted by a test framework adapter. Many adapters can write to arbitrary paths, but this skill guides projects toward `allure-results` as the stable final directory name, with the parent chosen from the build system or test tool convention.
- Allure report: generated report files rendered from Allure results. Report generation is downstream from result emission.
- Agent output: files generated for an agent-mode run, such as `index.md`, manifests, findings, and per-test markdown. Agent output is separate from Allure results and Allure report files.
- CLI or tool installation: the project-approved way to run Allure commands. It may be a local package, build plugin, standalone binary, Docker image, CI action, or wrapper.
- Additional integration: optional official or project-provided integration that enriches Allure results with checks, parameters, labels, links, attachments, screenshots, traces, HTTP exchanges, logs, image diffs, or other useful artifacts.

## Result Emission Before Report Generation

Prefer making tests emit Allure results before adding Allure report generation or CI publication. A report command cannot fix missing or empty Allure results.

When Allure result emission works, there should be newly created or updated files in the configured results directory. Depending on the adapter, useful signals may include result JSON files, container JSON files, attachments, environment data, executor data, categories, or history inputs.

## Result Directory Policy

Keep the result directory basename stable as `allure-results`. Vary the parent path, not the final name.

This is the recommended convention even when an adapter supports a custom result path. It is also important for `allure run`: by default, `allure run` looks for directories named `allure-results` as a discovery gate so it does not process arbitrary files across the filesystem. If a project wants to use `allure run` with Allure results from a framework adapter, the result directory should be named `allure-results`.

Preferred pattern:

- Maven: `target/allure-results`
- Gradle: `build/allure-results`
- JavaScript and TypeScript: `out/allure-results` when no stronger project output convention exists
- Python: `build/allure-results`, `.tox/<env>/allure-results`, or another project test-output root when one already exists
- .NET: `TestResults/allure-results` or the repository's existing test-output root
- Ruby and PHP: `tmp/allure-results`, `build/allure-results`, or the framework's existing output root
- Dart and Flutter: the path configured by the project-specific Allure config, with `allure-results` as the final directory
- CI aggregation: keep each shard/job under a unique parent such as `out/allure/<job>/allure-results`; do not encode the job name by renaming the final directory

Avoid names such as `playwright-results`, `junit-allure`, `allure-results-ui`, or `allure-results-1` for new configuration. Distinguish runners, shards, platforms, or browsers by parent directories and artifact names. If an existing project intentionally uses a different final name, document whether `allure run` is in scope. When it is, prefer reconfiguring, copying, or linking results into an `allure-results` directory rather than teaching `allure run` to process unrelated filesystem content.

For temporary validation, use a temporary parent directory with an `allure-results` child when the integration supports it. If the integration cannot override the result path, compare timestamps or clean only the generated result directory after confirming it is safe.

## Configuration Surface Preference

Prefer stable, committed configuration over environment variables:

- Java and JVM integrations: prefer `allure.properties` in test resources, commonly `src/test/resources/allure.properties`, with `allure.results.directory`.
- JavaScript and TypeScript runners: prefer reporter/plugin options in runner config files, such as `playwright.config.*`, `cypress.config.*`, `vitest.config.*`, `jest.config.*`, `wdio.conf.*`, Cucumber.js config, or Mocha config.
- Python pytest: prefer project pytest configuration, such as `pyproject.toml`, `pytest.ini`, `tox.ini`, or `setup.cfg`, for stable `--alluredir` options.
- .NET: prefer `.runsettings`, project files, or runner/logger configuration used by the existing test command.
- Ruby, PHP, Go, Rust, Dart, Flutter, and other ecosystems: prefer the integration's project config file or runner config when one exists, such as `allure-dart.yml` for Dart-style integrations.

Use environment variables for values that are naturally per-run or sensitive, for CI-provided paths, or when the integration documents environment variables as the only supported configuration mechanism. If using environment variables for a stable path, document why a config file was not used.

## Validation Signals

A useful validation checks more than file existence:

- at least one result represents a real test from the intended runner
- status, name, timing, and suite or package data are plausible
- configured labels, parameters, steps, or attachments appear when the task involved them
- generated Allure reports or CI artifacts consume the same Allure results path that the test run writes

If the test command fails but Allure results are produced, report both facts. The reporting integration may be working while the product or tests are failing.

## Version And Documentation Drift

Allure adapters, CLI commands, CI actions, and runner config APIs change over time. Prefer official docs and installed command help for exact package names, option names, and config syntax. Keep durable project guidance focused on wrappers, result paths, validation commands, and refresh instructions rather than exact transient versions.
