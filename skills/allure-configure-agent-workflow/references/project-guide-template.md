# Allure Test Agent

Use Allure agent mode to design, review, validate, debug, and enrich tests in this project.

This file is project-specific guidance. Durable test-design, expectation, and evidence rules live in the `allure-test-agent` skill. If the skill is available, use it together with this file. If the skill is unavailable, follow this file as the local fallback and keep conclusions conservative.

## Review Principle

Runtime first, source second.

- If a command executes tests and its result will be used for smoke checking, reasoning, review, coverage analysis, debugging, or any user-facing conclusion, run it through the local agent test service when available, or through `allure agent` otherwise.
- Use agent-mode execution for smoke checks too, even when the change is small or mechanical.
- Only skip agent mode when it is impossible or when debugging agent mode itself.
- If agent output is missing or incomplete, debug that first and treat console-only conclusions as provisional.

## Local Capability Snapshot

Refresh this section when Allure, test runners, Allure results paths, Allure report generation, CI, or project wrappers change. Confirm local support with the project wrapper, `allure --version`, and `allure agent --help` before using optional commands.

Do not store the exact Allure version here. Version output is a runtime fact; this file should store the wrapper, last snapshot marker, and how to refresh capabilities.

- Allure wrapper: `<fill during setup, e.g. yarn allure, npx allure, pnpm allure, ./gradlew allure>`
- Capability snapshot last checked: `<fill date, commit, or unknown>`
- Refresh capabilities with: `<wrapper> --version` and `<wrapper> agent --help`
- Agent execution: `<supported / limited / unsupported / unknown>`
- Output option: `<fill supported syntax or unknown>`
- Expectation controls: `<fill supported options, command goal controls, file format, or unknown>`
- Latest/state directory recovery: `<supported / unsupported / unknown>`
- Selection/rerun support: `<supported / unsupported / unknown>`
- Discovery/configuration commands: `<supported / unsupported / unknown>`
- Local agent test service: `<start command, endpoint, unsupported, or unknown>`

## Local Agent Test Service

Use the local agent test service when the project provides one and the task is query-heavy, stateful, or iterative. Use `allure agent` directly when service mode is unavailable or unnecessary.

- Service status: `<supported / unsupported / unknown>`
- Start or connect command: `<fill when project-approved, otherwise unknown>`
- Capability/status endpoint: `<fill or unknown>`
- Supported intents: `<run one test/file/label/profile/rerun/query/unknown>`
- Supported profiles and selectors: `<fill or unknown>`
- Query support: `<runs/tests/findings/events/attachments/evidence/unknown>`
- Realtime and cancellation support: `<supported / unsupported / unknown>`
- Service logs or diagnostics: `<path or unknown>`
- Fallback when unavailable: `<wrapper> agent -- <command>` or `<fill local fallback>`

## Local Test Surfaces

- Test frameworks and runners: `<fill during setup>`
- Test roots: `<fill during setup>`
- Allure results paths: `<fill during setup, e.g. <parent>/allure-results>`
- Known selector support: `<file/test name/label/package/suite/test plan/unknown>`
- Known environments or services needed for tests: `<fill during setup>`

## Allure Integrations

Document only integrations detected or explicitly configured in this project.

- Existing Allure adapters/integrations: `<fill or unknown>`
- Runner config files: `<fill or unknown>`
- Result-path configuration: `<confirmed config file, option, property, env var, or unknown>`
- Supported integration configuration targets: `<specified integration / all discovered / none / unknown>`
- Validation command for integration setup: `<focused smoke, discovery only, or unknown>`
- Known unsupported or skipped integrations: `<fill with reasons or unknown>`
- Integration-specific quirks: `<result cleanup, reporter config, env vars, attachments, or unknown>`

## Project Test-Design Conventions

Fill only conventions that exist in this project. Durable test-design rules stay in the `allure-test-agent` skill.

- Accepted test layers: `<unit/component/integration/API/browser/CLI/etc. or unknown>`
- Preferred assertion style: `<framework matchers, custom assertions, deep-match messages, or unknown>`
- Parameterized test style: `<case naming, parameter reporting, limits, or unknown>`
- Boring-test preference: `<explicit tests over loops/factories/conditionals, shared business-step helpers, or unknown>`
- Smoke coverage conventions: `<higher-layer smoke expectations or unknown>`
- Mocking and integration-test preference: `<project rule or unknown>`
- Explicit skip/assumption mechanics: `<it.skip/it.skipIf/assumeThat/xfail/quarantine/setup failure convention or unknown>`
- Suppression/quarantine policy: `<owner/reason/issue/expiry/restore path or unknown>`

## Run Profiles

Document only profiles that exist in this project. If a profile is inferred rather than confirmed, mark it as inferred.
Use `allure agent` output defaults in command examples unless an explicit `--output` path is part of the project convention. Include framework result-directory environment variables only when the local adapter needs them and local evidence, installed help, official docs, or package README/source confirms the exact variable name.

| Profile | Command or service intent | Expected use | Confidence limits |
| --- | --- | --- | --- |
| smoke | `<fill>` | Quick signal for critical paths | Does not prove full coverage |
| affected | `<fill>` | Changes mapped to likely tests | Mapping may miss indirect impact |
| feature/component | `<fill>` | Focused validation for one area | Depends on local labels/selectors |
| full | `<fill>` | Broad validation | Cost may be high |

## Execution Signal And CI Trust

Do not present ignored, excluded, swallowed, advisory, or non-gating test execution as proof that behavior is safe.

- Default local test command: `<fill or unknown>`
- Default local command exclusions: `<fill or unknown>`
- CI test jobs: `<fill names or unknown>`
- CI gating status: `<gating / non-gating / allowed failure / advisory / unknown>`
- Known ignored, skipped, muted, quarantined, or disabled tests: `<fill policy, owner, issue, restore path, or unknown>`
- Test artifacts retained by CI: `<Allure output, logs, traces, none, or unknown>`

If CI or local execution is non-gating, excludes important tests, or swallows failures, call that out before using the run as proof.

Do not hide missing or unsupported coverage behind runtime `if` branches, early returns, conditional test registration, or helper aliases. Use the project's explicit skip, conditional-skip, assumption, xfail, quarantine, or setup-failure convention so the runner and Allure evidence show the reason.

## Local Expectation Controls

Before each validation run, decide whether expectations reduce a real risk for the intended conclusion. When they do, use the smallest fresh inline options supported by local `allure agent --help`.

- Supported expectation mechanism: `<inline CLI options / command goal controls / advanced file mode / unsupported / unknown>`
- Exact test/file/suite/label/profile support: `<fill or unknown>`
- Excluded-scope controls: `<supported / unsupported / unknown>`
- Evidence expectation controls: `<supported / unsupported / unknown>`
- Check/assertion step-name controls: `<supported / unsupported / unknown; fill useful substrings or naming convention>`
- Broad-audit fallback: `<fill local convention or unknown>`

Prefer inline options. Use `--expectations <file>` only as advanced mode when the contract is too large, generated, or policy-controlled.

When expectations are justified, they should state only the parts that matter for this run:

- what claim or validation depth the run is meant to support
- what should run
- what should not run
- which profile, environment, variant, or parameter set is intended
- what important checks or evidence should be visible through supported reporting or documented step-name conventions
- why this scope is enough
- what the run cannot prove

If local expectation support is unavailable or weak, run the narrowest practical command, review observed scope from manifests, and state that expectation checking was limited.

Treat the run goal as a claim boundary for review, not as proof. If the goal is wrong or stale, keep the runtime evidence and report what the observed run actually supports.

## Core Loops

### Test Review Loop

1. Identify the exact review scope and validation depth.
2. Create the smallest meaningful expectations using local supported controls when they protect the review conclusion.
3. Run only that scope through the local agent test service or `allure agent`.
4. Print the run's `index.md` path.
5. Review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, `manifest/findings.jsonl`, and relevant per-test markdown.
6. Inspect source code only after runtime evidence explains what executed.
7. Call out weak scope, weak evidence, execution-signal limits, or partial runtime modeling.

### Test Authoring Loop

1. Understand the feature, issue, expected behavior, and risk.
2. Read the `allure-test-agent` skill's test-design guidance when available.
3. Create the smallest meaningful expectations for the intended scope when they reduce a real validation risk.
4. Write or update focused tests without weakening useful coverage.
5. Run the intended scope through agent mode.
6. Review scope, checks, evidence, and execution signal before claiming validation.
7. Enrich tests when evidence is weak, then rerun with fresh agent output.

### Evidence And Metadata Enrichment Loop

Use this when tests pass but are hard to review:

1. Identify weak evidence, missing checks, missing setup state, missing artifacts, or noisy metadata.
2. Prefer framework integrations and helper-boundary instrumentation over wrapping every line.
3. Add useful steps, attachments, parameters, descriptions, labels, or links using project conventions, keeping per-test intent metadata inline with each test.
4. Redact sensitive values while preserving useful artifact shape.
5. Rerun the same intended scope and report evidence changes.

### Coverage Review Loop

1. Split broad audits into scoped groups when practical.
2. Ensure each group has distinct agent output and use expectations only when the group has a known scope or supports a validation conclusion. Use explicit `--output` paths only when useful for organizing groups.
3. Run each group through agent mode.
4. Separate observed runtime coverage from inferred source-code coverage.
5. Mark review incomplete until every scoped group was validated through matched expectations, reviewed observed scope, or documented as a broad package-health audit.

## Runtime Artifact Review

After each agent-mode run:

- print the run's `index.md` path
- read `manifest/run.json`
- read `manifest/test-events.jsonl`
- read `manifest/tests.jsonl`
- read `manifest/findings.jsonl`
- read relevant per-test markdown before inspecting source
- inspect global stderr/log artifacts when runner-visible failures are not represented as logical tests

## Output, State, And Reruns

Do not create persistent agent output or expectation paths. Modern `allure agent` creates and prints a temp output directory when no output is provided; use that default unless a specific path is needed. Prefer `--output` for explicit paths.

Allure results paths such as `<parent>/allure-results` are separate reporting configuration and may be stable project paths. Do not use framework result variables such as `ALLURE_RESULTS_DIR` as agent-output controls; document them only when the local adapter requires them and the exact variable is confirmed, and keep the final directory name `allure-results` when the results must be discovered by Allure.

- Agent output policy: `<CLI-provided temp dir / explicit --output convention / unknown>`
- Latest output recovery: `<supported command or unknown>`
- State directory override: `<supported env var or unknown>`
- Rerun from latest/prior output: `<supported command or unknown>`
- Selection/test plan support: `<supported command/path or unknown>`
- Parallel-run rule: output paths and expectation state must not be shared
- CI artifact retention: `<agent output, logs, traces, none, or unknown>`

## Project Metadata Conventions

Fill only conventions that exist in this project.

Per-test metadata belongs inline with the test. Do not centralize descriptions, labels, links, parameters, or intent-defining step names in helper wrappers, lookup tables, or mappings keyed by test name. Reusable helpers may handle mechanics only; test intent should stay explicit at each test site.

- Feature/story/component/service labels: `<fill or unknown>`
- Owner/team metadata: `<fill or unknown>`
- Severity or priority metadata: `<fill or unknown>`
- Issue, bug, requirement, or known-defect links: `<fill or unknown>`
- Suite/package/module taxonomy: `<fill or unknown>`
- Parameter naming and dynamic-history exclusions: `<fill or unknown>`
- Metadata to avoid: `<decorative labels, unused taxonomy, or unknown>`

## Project Evidence Conventions

Fill only conventions that exist in this project.

- Test descriptions: `<expected style or unknown>`
- Attachments: `<HTTP exchange/image diff/Playwright trace/logs/SQL/fixture conventions or unknown>`
- Step naming: `<project style or unknown>`
- Check/assertion step naming: `<e.g. "expect <actual> to <matcher>", "validate <contract>", or unknown>`
- Assertion/check visibility: `<integration support, documented step-name convention, or unknown>`
- Fixture/setup evidence: `<file tree/database rows/config/logs or unknown>`
- Sensitive data redaction: `<project policy or unknown>`

## Acceptance Rules

Accept a run only when:

- observed scope matches the intended scope, or drift is explained
- coverage remains meaningful for the stated conclusion
- important checks are visible through supported reporting, documented step-name conventions, or source review covers the gap
- evidence is strong enough to explain what happened
- execution-signal limits are explicit
- no high-confidence placeholder or noop evidence findings remain
- partial runtime modeling is called out

Console-only conclusions are provisional when agent output is absent or incomplete.
