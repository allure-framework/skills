# Allure Tool Installation

Use this reference when the task involves installing or invoking the Allure CLI, report generator, build plugin, or wrapper command.

## Choose Project-Local First

Prefer the project's existing tool management style:

- Node projects often prefer a dev dependency and package-manager script.
- Java projects often prefer Gradle or Maven tasks/plugins when the build already owns test/report commands.
- Python projects may prefer a pinned tool in the project environment, a documented external CLI, or a CI image depending on local conventions.
- .NET projects may prefer NuGet tooling, `dotnet` tool conventions, or CI-provided commands.
- Polyglot repos may prefer a top-level Makefile, task runner, Docker image, or CI wrapper.

Do not assume a globally installed `allure` binary is available unless the project already documents that requirement.

## Tooling Is Separate From Result Emission

Framework adapters write results. Allure tools generate, open, serve, wrap, dump, inspect, or aggregate reports and run data. A project can emit results without having a local report tool, and a report tool can exist while result emission is still broken.

Existing-result inspection through `allure agent inspect` is an agent-mode tool surface. Confirm it with installed help before adding commands that inspect local `allure-results` directories or `allure run --dump` archives.

When `agent inspect` is unavailable but the installed tool can load the artifacts with `allure generate`, an advanced fallback can generate a temporary config with only the `agent` plugin enabled and run `allure generate --config <generated-config> --output <agent-output>`. Keep this fallback separate from normal report generation so project report/export plugins do not run accidentally.

## Installation Checklist

- Confirm whether the user wants a local developer command, CI-only generation, or both.
- Reuse the package manager or build system already used by the repo.
- Avoid adding a second package manager just for Allure.
- Prefer documented wrappers over direct global binaries.
- Verify exact command syntax from installed help or official docs before writing scripts.

## Validation

For local report tooling, validate with the smallest command that proves the tool can consume the configured Allure results path. If there are no valid Allure results yet, validate only tool availability and clearly state that Allure report generation remains dependent on Allure result emission.
