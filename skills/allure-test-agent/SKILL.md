---
name: allure-test-agent
description: Write, review, debug, and improve tests with Allure agent mode by preserving useful coverage, planning scope, creating per-run expectations, running targeted tests, reviewing runtime evidence, and enriching weak test evidence.
---

# Allure Test Agent

Use this skill for feature or bug work that changes tests, for reviewing existing tests, auditing coverage, triaging failing suites, investigating weak evidence, or debugging flaky and environment-sensitive failures.

- If a command executes tests and its result will be used for smoke checking, reasoning, review, coverage analysis, debugging, or any user-facing conclusion, run it through `allure agent`. It preserves the original console logs and adds agent-mode artifacts without inheriting the normal report or export plugins from the project config.
- Use `allure agent` for smoke checks too, even when the change is small or mechanical.
- Only skip agent mode when it is impossible or when you are debugging agent mode itself.

## Read First

If the project has `docs/allure-test-agent.md`, read it before writing or reviewing tests.

If it does not, use the guidance in this skill and suggest using `$allure-configure-agent-workflow` later.

Read `references/test-design.md` before adding, changing, deleting, skipping, suppressing, or reviewing tests.

Read `references/allure-evidence.md` before adding, reviewing, or fixing Allure steps, attachments, parameters, labels, descriptions, or weak evidence findings.

Read `references/expectations.md` before creating or evaluating Allure agent expectations. Confirm the local expectation mechanism through the project guide or `allure agent --help`.

## Workflow

1. Understand the feature, issue, or review goal and decide the intended test scope.
2. Decide whether expectation controls reduce a real risk for this run. When they do, create the smallest fresh expectations supported by the local Allure agent.
3. Write or update the tests using test-design rules, or keep the current tests unchanged if the task is review-only.
4. Run only the intended scope with `allure agent` before relying on raw console output.
5. Print the run's `index.md` path from the output directory so collaborators can open the run overview quickly.
6. Review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, `manifest/findings.jsonl`, and the relevant test markdown files before inspecting source code.
7. If evidence is weak, enrich the tests with real steps, attachments, or minimal metadata.
8. Confirm the run is a trustworthy signal: the selected profile fits the goal, important tests are not silently excluded, and any non-gating local or CI signal is called out.
9. Rerun with a fresh agent output directory and fresh expectations when expectation controls are still justified for the same intended scope. Use the CLI-provided temp output unless a specific path is needed.
10. Accept only when scope matches, coverage remains meaningful, evidence is good enough to review, execution limitations are explicit, and any partial runtime modeling has been called out.

## Review Variants

### Small Test Change Workflow

1. Decide whether to use the CLI-provided temp output directory or an explicit `--output` path, and create the smallest meaningful expectations for the touched scope when justified.
2. Run the touched scope with `allure agent`, even if the goal is only a smoke check after a mechanical change such as typing cleanup, mock refactors, or helper extraction.
3. Print the run's `index.md` path from the output directory.
4. Review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, and `manifest/findings.jsonl`.
5. Only then make a final statement about regression safety or test correctness.

### Coverage Review Workflow

1. Split command or package audits into scoped groups.
2. Ensure each group has distinct agent output and use expectations only when the group has a known scope or will support a validation conclusion. Use explicit `--output` paths only when useful for organizing groups.
3. Run each group with `allure agent`.
4. Review runtime artifacts first, then inspect source code only after the run explains what actually executed.
5. Mark the review incomplete until each scoped group is validated through matched expectations, reviewed observed scope, or explicit broad package-health documentation.

Compact coverage-review pattern when an explicit output path is useful:

```bash
TMP_DIR="$(mktemp -d)"

npx allure agent \
  --output "$TMP_DIR/agent-output" \
  <minimal local expectation options when justified> \
  -- npm test -- <scope>
```

Before running, decide what should run, what should not run, why that scope is enough, and whether an expectation option would catch a real mistake. Express only justified controls supported by the local Allure agent.

## Requirements

- Full agent-mode runtime evidence requires Allure CLI `allure@3.11.0` or newer with `allure agent`.
- Before relying on agent-mode conclusions, confirm the local project wrapper supports `allure agent` and is not below the minimum version. If the wrapper reports an older version, warn the user and treat agent-mode evidence as unavailable or incomplete until the CLI is upgraded.
- Agent-mode runs need unique output. Modern `allure agent` creates and prints a temp output directory when no output is provided; use that default unless a specific path is needed.
- When choosing a specific output directory, prefer the supported `--output` option. `ALLURE_AGENT_OUTPUT` may work as a fallback when the local CLI or wrapper documents it, but do not prefer it without a concrete reason.
- Agent output, framework Allure results, and generated reports are separate artifacts. Do not use framework result settings such as `ALLURE_RESULTS_DIR` as agent-output controls.
- Do not add or override framework result directories in an agent command unless the project guide, runner config, or adapter docs require it for this run. When a per-run result directory is needed, keep its final path component `allure-results` and ensure it is discoverable by the local Allure command.
- Runs that use expectations must use fresh expectations for the intended scope.
- Parallel runs must never share output paths or expectation state.
- After each agent-mode test run, print the `index.md` path from that run's output directory.
- Inspect `allure agent --help` before assuming specific expectation option names. Prefer inline options; use file-based expectations only as advanced mode for large, generated, or policy-controlled contracts.
- Do not add expectation flags defensively. If expectation controls are unavailable or not justified, review observed scope from the output and call out weaker scope checking.
- If a run, local command, or CI job is non-gating or excludes important tests by default, call that out before using it as proof.
- Metadata enrichment is part of this loop, not a separate workflow.

## Guardrails

- Runtime first, source second.
- Tests are behavior contracts; do not weaken assertions, skip tests, or delete coverage just to make the run pass.
- Steps must represent real behavior, not filler.
- Attachments must come from the current execution.
- Keep metadata minimal and only add labels that help review or policy.
- Prefer helper-boundary instrumentation over repetitive caller wrapping.
- If runner-visible failures are not represented as logical tests, inspect global stderr and treat the run as a partial runtime review.
- Do not present ignored, excluded, swallowed, or non-gating tests as a passing validation signal.

## Reference Files

- Test design guide: `references/test-design.md`
- Allure evidence guide: `references/allure-evidence.md`
- Expectations guide: `references/expectations.md`
