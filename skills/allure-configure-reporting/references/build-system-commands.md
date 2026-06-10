# Build System Commands

Use this reference when adding package scripts, build tasks, Make targets, profiles, or wrapper commands around Allure.

## When To Add Commands

Add commands when they improve repeatability or match existing conventions. Do not add scripts just because a generic setup guide includes them.

Useful commands often cover:

- running tests with the configured Allure results path
- generating an Allure report from an existing Allure results path
- opening or serving a generated Allure report locally
- cleaning generated Allure report output when the project already has clean conventions
- wrapping a test command with Allure tooling when the installed CLI supports that pattern

## Naming

Follow local naming style. Common names include:

- `allure:generate`, `allure:report`, `allure:serve`, `report:allure`
- `test:allure` or a runner-specific variant when the command changes test execution
- Gradle/Maven task names or profiles that fit the existing build
- Make targets such as `allure-report` only when the repo already uses Make

Avoid creating multiple overlapping names in the first pass.

## Command Design

- Keep the test command as the source of truth when possible.
- Use the same `allure-results` directory that the framework adapter writes.
- Separate test execution from Allure report generation unless the user wants a combined convenience command.
- Preserve existing environment setup and wrappers.
- Verify installed CLI flags before adding newer commands such as run wrappers, dump output, or aggregation.

## Validation

Run the new or changed command when practical. If it is expensive, validate the underlying smaller command and explain why the wrapper was not run.
