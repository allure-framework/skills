---
name: allure-agent-mode
description: Write, review, debug, and improve tests with Allure agent mode by preserving useful coverage, planning scope, creating per-run expectations, running targeted tests, inspecting existing Allure results or dumps from local or CI runs, reviewing runtime evidence, and enriching weak test evidence.
---

# Allure Agent Mode

Use this skill for feature or bug work that changes tests, for reviewing existing tests, auditing coverage, triaging failing suites, investigating weak evidence, or debugging flaky and environment-sensitive failures.

**Non-negotiable: do test work through `allure agent`, and reach every conclusion from the agent output — not from console text or your own reporting.**

- Run every test command whose result informs a conclusion through `allure agent` — smoke checks included, even for small or mechanical changes. It preserves the original console output and adds agent-mode artifacts without inheriting the project's normal report or export plugins, so there is no cost to routing through it. Skip only when agent mode is impossible or you are debugging agent mode itself.
- After a run, open the output directory, read its `AGENTS.md` guide, and follow its reading order (`manifest/run.json` and the manifests, then `index.md`, then the per-test files). `allure agent` already did the analysis — read that structured output directly (use `allure agent query` to inspect it). Do not hand-roll a report from console or `allure agent query` text with `grep`/`tail`/`head`/counting, and never `>/dev/null` the run.
- Weigh every signal, not just pass/fail: findings, weak or placeholder evidence, scope drift, broken vs failed, flaky and retried tests, global stderr, attachments. A green count is not a passing review.
- If agent output is missing or incomplete, fix that first; never silently fall back to console-only conclusions.

## Read First

If the project has `docs/allure-agent-mode.md`, read it before writing or reviewing tests.

If it does not, use the guidance in this skill and suggest using `$allure-configure-agent-workflow` later.

Read `references/test-design.md` before adding, changing, deleting, skipping, suppressing, or reviewing tests.

Read `references/allure-evidence.md` before adding, reviewing, or fixing Allure steps, attachments, parameters, labels, descriptions, or weak evidence findings.

Read `references/expectations.md` before creating or evaluating Allure agent expectations. Confirm the local expectation mechanism through the project guide or `allure agent --help`.

## Workflow

1. Understand the feature, issue, or review goal and decide the intended test scope.
2. Decide whether expectation controls reduce a real risk for this run. When they do, create the smallest fresh expectations supported by the local Allure agent.
3. Write or update the tests using test-design rules, or keep the current tests unchanged if the task is review-only.
4. When executing tests yourself, run only the intended scope with `allure agent` before relying on raw console output.
5. When investigating an execution that already emitted raw Allure results or dump artifacts, prefer a locally confirmed `allure agent inspect` flow to create agent-readable output from those artifacts before parsing raw logs or generated HTML reports.
6. For iterative agent-only loops, prefer `--report off` when supported. For a final validation or user-facing review run, prefer `--report auto` or force the appropriate HTML report mode, then share the generated report link when one exists.
7. Print the run or inspected output's `index.md` path so collaborators can open the overview quickly.
8. Review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, `manifest/findings.jsonl`, `manifest/expected.json` when the run used expectations, and the relevant test markdown files before inspecting source code.
9. If evidence is weak, enrich the tests with real steps, attachments, or minimal metadata.
10. Confirm the run is a trustworthy signal: the selected profile fits the goal, important tests are not silently excluded, and any non-gating local or CI signal is called out.
11. Rerun with a fresh agent output directory and fresh expectations when expectation controls are still justified for the same intended scope. Use the CLI-provided temp output unless a specific path is needed.
12. Accept only when scope matches, coverage remains meaningful, evidence is good enough to review, execution limitations are explicit, and any partial runtime modeling has been called out.

## Review Variants

### Small Test Change Workflow

1. Decide whether to use the CLI-provided temp output directory or an explicit `--output` path, and create the smallest meaningful expectations for the touched scope when justified.
2. Run the touched scope with `allure agent`, even if the goal is only a smoke check after a mechanical change such as typing cleanup, mock refactors, or helper extraction.
3. Print the run's `index.md` path from the output directory.
4. Review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, `manifest/findings.jsonl`, and `manifest/expected.json` when the run used expectations.
5. Only then make a final statement about regression safety or test correctness.

### Coverage Review Workflow

1. Split command or package audits into scoped groups.
2. Ensure each group has distinct agent output and use expectations only when the group has a known scope or will support a validation conclusion. Use explicit `--output` paths only when useful for organizing groups.
3. Run each group with `allure agent`.
4. Review runtime artifacts first, then inspect source code only after the run explains what actually executed.
5. Mark the review incomplete until each scoped group is validated through matched expectations, reviewed observed scope, or explicit broad package-health documentation.

Compact coverage-review pattern:

```bash
npx allure agent \
  <report mode: --report off for iterative loops, auto/awesome/config for final runs> \
  <minimal local expectation options when justified> \
  -- npm test -- <scope>
```

Before running, decide what should run, what should not run, why that scope is enough, and whether an expectation option would catch a real mistake. Express only justified controls supported by the local Allure agent. Use the CLI-provided temp output by default; locate it from the agent output or a supported helper such as `allure agent latest` when available. Add `--output <path>` only when a specific path is needed.

## Requirements

- Full agent-mode runtime evidence requires Allure CLI `allure@3.11.0` or newer with `allure agent`.
- Before relying on agent-mode conclusions, confirm the local project wrapper supports `allure agent` and is not below the minimum version. If the wrapper reports an older version, warn the user and treat agent-mode evidence as unavailable or incomplete until the CLI is upgraded.
- Existing-result inspection requires local `allure agent inspect` support, available in `allure@3.12.0` and newer. Confirm it through the project wrapper with `allure agent capabilities --json` and `allure agent inspect --help`.
- Use `allure agent inspect [<allure-results-dir-or-glob> ...]` for local or downloaded `allure-results` directories, and repeated `--dump <archive-or-glob>` for dump archives created by `allure run --dump`.
- Use `--report auto|off|awesome|config` when controlling optional report generation. The default `auto` mode may write an HTML report at `awesome/index.html` and `manifest/human-report.json` inside the agent output when the stored result count is within the local CLI threshold.
- Use `--report off` for private iterative loops unless the user needs an HTML report for that run. For final validation or handoff runs, prefer `--report auto`; use `--report awesome` to force the single-file Awesome report, or `--report config` when the project-configured report plugins should run.
- When `allure agent inspect` is unavailable or cannot consume the artifact shape, prefer an advanced fallback that generates a temporary Allure config enabling only the `agent` plugin, then run `allure generate --config <generated-config> --output <agent-output> <results...>` with repeated `--dump <archive-or-glob>` as needed. Treat that explicit `<agent-output>` as caller-managed cleanup.
- If neither `agent inspect` nor the generated agent-only config fallback is usable, inspect raw Allure results, dump contents, or logs only as a weaker fallback. `allure log <allure-results>` is a local console fallback for result folders when supported, but it is not agent output.
- Agent-mode runs need unique output. Modern `allure agent` creates and prints a temp output directory when no output is provided; use that default unless a specific path is needed. In `allure@3.12.0` and newer, CLI-provided agent output is cleaned automatically by agent-mode lifecycle handling.
- When using the default output location, get the generated directory from the agent output or a supported helper such as `allure agent latest` when available.
- When choosing a specific output directory, prefer the supported `--output` option. Explicit output is caller-managed: remove or archive it yourself when it is no longer needed, because automatic agent cleanup does not remove caller-provided output paths. Use an output-related environment variable only if the local CLI help, wrapper, or official docs explicitly document one; the supported control on the current CLI is `--output`.
- Agent output, framework Allure results, and generated reports are separate artifacts. Do not use framework result settings such as `ALLURE_RESULTS_DIR` as agent-output controls.
- Do not add or override framework result directories in an agent command unless the project guide, runner config, installed help, official docs, or adapter README/source confirms it is required for this run. When a per-run result directory is needed, keep its final path component `allure-results` and ensure it is discoverable by the local Allure command.
- Never invent Allure environment variables from plausible names. If the exact variable or flag is not confirmed, use the documented `allure agent` option, leave the setting unknown, or ask to verify official docs.
- Runs that use expectations must use fresh expectations for the intended scope.
- Parallel runs must never share output paths or expectation state.
- After each agent-mode test run, print the `index.md` path from that run's output directory. When a final run generates an HTML report, read `manifest/human-report.json` and resolve its recorded report path against the agent output directory before sharing it.
- In user-facing output, call the artifact simply the report and do not put the report target in inline code or a code block. Say `Here is the report: <link>` using a normal Markdown link to the absolute local report file, such as `[report](/absolute/agent-output/awesome/index.html)`, so Codex and similar clients can expose clickable or previewable affordances. Never link a relative manifest value such as `awesome/index.html` directly.
- Inspect `allure agent --help` before assuming specific expectation option names. Prefer inline options; use file-based expectations only as advanced mode for large, generated, or policy-controlled contracts.
- Do not add expectation flags defensively. If expectation controls are unavailable or not justified, review observed scope from the output and call out weaker scope checking.
- If a run, local command, or CI job is non-gating or excludes important tests by default, call that out before using it as proof.
- Metadata enrichment is part of this loop, not a separate workflow.

## Guardrails

- Runtime first, source second.
- Tests are behavior contracts; do not weaken assertions, skip tests, or delete coverage just to make the run pass.
- Keep tests boring and explicit. Prefer readable, stable, linear tests over conditional logic, loops, factories, or generated tests whose main value is saving a few repeated lines.
- Do not hard-skip tests with runtime `if` branches or helper aliases that hide coverage gaps; use runner-native skip, conditional-skip, or assumption mechanics with clear reasoning.
- Steps must represent real behavior, not filler.
- Do not wrap an entire test body in one manual step just to make Allure evidence non-empty.
- Attachments must come from the current execution.
- Keep metadata minimal and only add labels that help review or policy.
- Keep per-test intent metadata inline with the test: descriptions, labels, links, parameters, and intent-defining step names must be explicit at each test site.
- Prefer helper-boundary instrumentation over repetitive caller wrapping.
- Reusable helpers may handle mechanics, but must not centralize test intent in wrappers, lookup tables, or test-name mappings.
- If runner-visible failures are not represented as logical tests, inspect global stderr and treat the run as a partial runtime review.
- Do not present ignored, excluded, swallowed, or non-gating tests as a passing validation signal.

## Reference Files

- Test design guide: `references/test-design.md`
- Allure evidence guide: `references/allure-evidence.md`
- Expectations guide: `references/expectations.md`
