# Test Framework Integrations

Use this reference when configuring the surface that makes test execution emit Allure results.

## Detection

Inspect project-local evidence before choosing an adapter:

- dependency manifests and lockfiles
- test runner config files
- package scripts, build tasks, Make targets, tox/nox files, or CI commands
- existing reporter/plugin/listener configuration
- prior `allure-results` directories or CI artifacts

Prefer the runner used by the requested test scope over the most obvious language in the repository.

## Common Config Targets

JavaScript and TypeScript:

- `package.json` scripts and dependencies
- `playwright.config.*`, `cypress.config.*`, `vitest.config.*`, `jest.config.*`, `wdio.conf.*`, Mocha config, Cucumber.js config, CodeceptJS config
- reporter arrays, plugin setup files, and result directory options such as `resultsDir`
- prefer runner config over environment variables for stable result paths

Java and JVM:

- `pom.xml`, `build.gradle`, `build.gradle.kts`, `settings.gradle*`
- `src/test/resources/allure.properties` or the project's test resources equivalent
- Maven Surefire/Failsafe, Gradle `test` tasks, JUnit Platform, TestNG, Cucumber-JVM, Spock, JBehave, REST Assured
- listeners, aspects, plugins, system properties, and task-level result directories
- prefer `allure.properties` with `allure.results.directory` for stable result paths

Python:

- `pyproject.toml`, `pytest.ini`, `tox.ini`, `setup.cfg`, `requirements*.txt`, `poetry.lock`, `uv.lock`
- pytest, pytest-bdd, behave, Robot Framework
- CLI flags, config options, plugins, tox/nox wrappers, and result path arguments
- prefer project test configuration for stable `--alluredir` settings when the runner supports it

.NET:

- `.csproj`, `.sln`, `Directory.Build.*`, `.runsettings`, NuGet package references
- `dotnet test`, NUnit, xUnit.net, Reqnroll, SpecFlow-style projects
- logger, adapter, runsettings, and output directory configuration
- prefer `.runsettings`, project, or runner/logger config over ad hoc environment variables

Ruby, PHP, Go, Rust, and other ecosystems:

- Gemfile, composer files, module manifests, build scripts, Dart or Flutter config files, and CI commands
- RSpec, Cucumber.rb, PHPUnit, Codeception, Cargo test, and project-specific reporters
- Dart and Flutter integrations may use dedicated project config such as `allure-dart.yml`
- official adapter docs and existing wrapper commands are especially important here

## Configuration Principles

- Add the framework adapter where the runner already accepts reporters, plugins, listeners, or test output options.
- Preserve existing reporters unless the runner requires an exclusive reporter choice.
- Keep result directories explicit when supported, with `allure-results` as the final directory name.
- Choose the parent directory from the build or runner convention: Maven usually `target`, Gradle usually `build`, JavaScript/TypeScript commonly `out`, and other ecosystems should follow the repository's existing output root.
- Prefer committed runner/build config over environment variables for stable result paths. Use environment variables for CI-specific or per-run overrides when appropriate.
- Verify any new environment variable, config key, reporter option, package name, or action input against local evidence, installed help, official docs, or the package README/source before adding it. If it cannot be verified, do not use it.
- Do not replace project wrappers with direct runner commands unless the wrapper is clearly irrelevant.
- If the adapter has both runtime APIs and reporter/plugin setup, configure the reporter/plugin first, then add runtime API usage only for requested evidence enrichment.

## Validation

Run the narrowest meaningful test command that exercises the configured runner. Then verify the expected results directory contains newly created or updated output.

If stale files may already exist, prefer a temporary parent with an `allure-results` child when the integration supports it. If not, compare timestamps or note that validation is limited by pre-existing results.
