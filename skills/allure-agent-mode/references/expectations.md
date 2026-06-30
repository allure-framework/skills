# Allure Agent Expectations Guide

## Purpose

Expectations are a pre-run scope contract for `allure agent`. They help an agent avoid false confidence by stating the run scope and evidence requirements before executing tests.

Expectations are not test assertions. Test assertions define product behavior. Agent expectations define what the validation run is supposed to cover and what conclusion it can support.

## Core Rule

Use expectations only when they reduce a real risk in the current validation run. Do not add expectation flags defensively or decoratively.

For every expectation option, know which mistake it should catch. If no concrete mistake would be caught, omit the option and rely on the run output and findings.

## Discover Local Support

Expectation controls are version-specific. Before using them, read the project guide or inspect local CLI help:

```bash
allure agent --help
```

Use only controls supported by the installed Allure version. Do not assume a file schema, inline option name, or matching behavior that local help does not expose.

Prefer inline expectation options. They are usually cheaper, easier to read in the executed command, and avoid extra temporary files that the agent must explain or clean up.

Use `--expectations <file>` only as advanced mode when the contract is too large or generated, such as many expected tests, a policy-controlled contract, or a matrix/rerun contract that would make inline options unreadable.

If local expectation support is unavailable or too weak, run the narrowest practical command, review observed scope from the output, and state that expectation checking was limited.

## When To Use Expectations

Use expectations for runs that support a user-facing validation conclusion, especially:

- fixing one known failing test
- fixing product behavior with existing focused tests
- adding or changing tests for a feature or regression
- smoke-checking a changed area
- reviewing one specific test
- validating runtime evidence enrichment
- debugging API, browser, CLI, SQL, image, trace, or fixture behavior where a specific artifact matters
- validating metadata changes that affect selection, grouping, ownership, links, or report understanding
- rerunning a focused slice from prior agent output
- checking flakiness or environment-specific behavior for a known scope

Do not use expectations just because a command runs tests. If the task is still discovery-oriented or the intended scope is unknown, first discover the project, inspect prior output, or run a broad exploratory command and keep the conclusion narrow.

## Minimal Option Policy

Start with the smallest falsifiable expectation:

1. Include a concrete `--goal` when supported. Treat it as the intended claim boundary for evidence review, not as proof by itself.
2. Add one strongest scope control when the intended scope is known. Common scope controls are:
   - `--expect-env <id>` when the environment matters to the conclusion
   - `--expect-label name=value` when project labels are trusted
   - `--expect-prefix <prefix>` for a stable suite, file, package, or full-name prefix
   - `--expect-test "<fullName>"` for a known individual test
3. Add `--expect-tests <count>` only when the exact count is stable and meaningful, such as one exact test review or an explicit zero-test absence check.
4. Add `--forbid-label name=value` only when there is a known unwanted labeled scope that must not be part of the run.
5. Add evidence expectations only when evidence quality is part of the task or required for debugging. Use step-name (`--expect-step-containing`), step-count (`--expect-steps`), attachment-count (`--expect-attachments`), or attachment-filter (`--expect-attachment`) expectations only when each one protects a concrete review/debugging need.

Prefer one strong scope expectation over several weak ones. Do not combine labels, prefixes, counts, forbids, and evidence requirements unless each option protects against a different concrete risk.

Do not create an expectations file for a small contract that fits naturally in command options.

## Common Patterns

### Known Test Fix

Use when validating a specific failing test after a code or fixture change.

```bash
allure agent \
  --goal "verify the fixed checkout discount test" \
  --expect-test "test/checkout.test.ts#checkout applies percentage discount" \
  --expect-tests 1 \
  -- npm test -- test/checkout.test.ts
```

If the expected test is missing or the count differs, do not claim the fix is validated. Correct the selector, restore coverage, or rerun the intended test.

### Focused Feature Or Bug Validation

Use one scope boundary that matches the project best.

```bash
allure agent \
  --goal "verify checkout discount regression coverage" \
  --expect-prefix "test/checkout.test.ts#checkout" \
  -- npm test -- test/checkout.test.ts
```

or:

```bash
allure agent \
  --goal "verify checkout discount regression coverage" \
  --expect-label feature=checkout \
  -- npm test -- --grep checkout
```

If the command is broader than the expected scope, say so in the final conclusion.

### Smoke Check

Use a goal that names the validation depth. Add a smoke label or prefix only when the project actually has one.

```bash
allure agent \
  --goal "smoke-check checkout after discount change; does not prove full checkout regression" \
  --expect-label layer=smoke \
  -- npm test -- --grep "@checkout.*@smoke"
```

Do not present a smoke expectation as full regression proof.

### Evidence Enrichment Or Debug Artifact Check

Use evidence options when the artifact or evidence shape matters to the task.

```bash
allure agent \
  --goal "verify checkout API evidence includes the HTTP exchange" \
  --expect-test "test/api/checkout.test.ts#checkout API creates order" \
  --expect-step-containing "response contains created order id" \
  --expect-attachment content-type=application/vnd.allure.http+json \
  -- npm test -- test/api/checkout.test.ts
```

Do not require attachments for ordinary unit tests unless an attachment is actually needed to understand the result.

Use specific step substrings that describe the behavior or check, not generic text like `check`, unless that exact convention is documented for the project.

### Focused Rerun

Use rerun controls from local help, then add only the filters that are part of the rerun intent.

```bash
allure agent \
  --goal "rerun checkout failures from the previous agent output" \
  --rerun-from /tmp/allure-agent-output-before \
  --rerun-preset failed \
  --expect-label feature=checkout \
  -- npm test
```

If the output reports scope drift, missing expected scope, or weak rerun selection, treat the rerun as incomplete.

## After The Run

Review expectation results as evidence, not ceremony:

- If expected scope did not run, do not claim the change is covered.
- If unexpected scope ran, call out scope drift or rerun a narrower command.
- If evidence expectations were missed, enrich the evidence or downgrade the conclusion.
- If expectations were broad, state that scope checking was weaker.
- If local expectation support was unavailable, explain the fallback and keep the conclusion provisional.
- If the Allure output reports findings, follow the recommended actions from the output files.
- If the goal was weak, stale, or wrong, keep the runtime evidence and state the narrower conclusion it actually supports, or rerun with a corrected goal.

When expectation results and runtime evidence disagree, trust the observed runtime evidence and report the mismatch.

## Smells

Treat these as weak or invalid expectation usage:

- expectations written after seeing the run result
- generic goals such as `Run tests`, `validate`, or `make sure it passes`
- expectations that only say tests should pass without saying what should run
- exact test counts for unstable broad suites
- forbids added without a known unwanted scope
- evidence requirements that force filler steps or noisy attachments
- expectations widened to match an easy command without reporting reduced precision
- final claims that say expectations were met without explaining weak or unavailable expectation support
