# Allure Agent Expectations Guide

## Purpose

Expectations are a pre-run scope contract. They state what the agent believes should run, what should not run, what evidence should exist, and why that scope is enough for the task.

Expectations protect against false confidence. A run is not trustworthy merely because "expectations were met" if the expectations were generic, empty, written after the run, or too weak for the conclusion.

## Use This When

- creating expectations before an Allure agent run
- choosing scope for smoke, affected, feature, component, package, or full-profile validation
- deciding whether broad package-health runs are acceptable
- evaluating scope drift, missing tests, unexpected tests, or weak evidence after a run
- writing user-facing conclusions from Allure agent output

## Core Rule

Create expectations before the run from the user goal, expected behavior, selected scope, and local Allure agent capabilities.

Do not create expectations just to satisfy a workflow requirement. If the agent cannot explain why an expectation matters, the expectation is not ready.

## In This File

- [Discover Local Support](#discover-local-support)
- [Expectation Contract](#expectation-contract)
- [How To Decide Scope](#how-to-decide-scope)
- [Exact, Broad, And Fallback Scope](#exact-broad-and-fallback-scope)
- [Evidence Expectations](#evidence-expectations)
- [Broad Audits](#broad-audits)
- [Expectation Smells](#expectation-smells)
- [After The Run](#after-the-run)

## Discover Local Support

Expectation controls are version-specific. Before creating expectations, read the project guide or inspect local CLI help:

```bash
allure agent --help
```

Use the expectation mechanism supported by the local Allure agent, such as CLI options, command goals, supported expectation flags, or an expectations file. Do not assume file-based expectations or specific option names unless local help confirms them.

If local help does not expose a meaningful expectation mechanism, run the narrowest practical test command and state that expectation checking was unavailable or weaker.

## Expectation Contract

Good expectations are falsifiable against the run output. They answer:

- what user goal, bug, feature, review, or risk the run is meant to support
- which test, suite, file, package, module, feature, component, label, or profile should run
- which adjacent or unrelated scope should not run
- which environment, service, browser, platform, data variant, or parameter set is intended when it affects the conclusion
- what important checks, matchers, assertions, or evidence should be visible
- what skipped, muted, quarantined, blocked, or known-failing tests are acceptable, if any
- whether the scope is exact, selector-based, label-based, command-scoped, affected, smoke, broad, or full
- why this scope is enough, and what it cannot prove

The contract should match the conclusion the agent wants to make. A smoke expectation can support a smoke conclusion; it cannot support a full-regression conclusion.

## How To Decide Scope

Create expectations before the run from observable context:

- user request, acceptance goal, issue, bug, or requirement
- expected behavior sources from `test-design.md`
- changed files, affected components, ownership, and nearby tests
- existing test inventory, labels, suites, packages, features, stories, or services
- project run profiles and their documented confidence limits
- selected command or intent-level service request
- previous agent output, failed tests, weak-evidence findings, or rerun plan
- known adjacent scope that should stay out of the run

Prefer the narrowest honest expectation. Use exact tests when known; use selectors, labels, modules, profiles, or command scope when exact names are not practical.

Do not silently widen expectations to match an easy command. If the command is broader than the intended scope, say so and treat the run as broader validation with weaker scope precision.

## Exact, Broad, And Fallback Scope

Use exact expectations when the intended tests are known and the local CLI supports exact matching.

Use selector or label expectations when exact names are unstable or unavailable, but the project metadata is reliable.

Use command-scoped expectations when the runner command is the best available boundary, but state that expectation matching is weaker.

Use broad expectations only when the task is explicitly a package-health, inventory, discovery, migration, or exploratory review. Broad expectations should not be presented as precise proof for a narrow behavior.

If local expectation support is missing or too weak:

1. Narrow the test command as much as practical.
2. Record the intended scope in the run goal or final notes.
3. Review observed scope from manifests before making a conclusion.
4. State that expectation checking was limited.

## Evidence Expectations

Expectations may include evidence requirements when local controls support them, or they may be stated in the run goal and reviewed after execution.

Useful evidence expectations include:

- important assertions or matchers should be visible
- setup, action, and assertion phases should be represented as steps
- API, browser, CLI, SQL, fixture, image-diff, or trace artifacts should exist when they are needed for review
- dynamic parameters should not split history when they do not define test identity
- expected labels, descriptions, links, or parameters should be present when they affect selection, grouping, or report understanding

Do not invent evidence requirements that are unrelated to the behavior. Use `allure-evidence.md` to decide which evidence matters.

## Broad Audits

Broad audits may use weaker expectations when exact scope is not practical. Examples include:

- package-health review
- inventory or discovery run
- migration smoke across many modules
- "what does this suite currently do?" review
- exploratory run before creating a better selection profile

For broad audits:

- state that the run is broad before execution
- define the boundary that is known, such as package, module, command, profile, or label
- avoid claiming that every important behavior was covered
- report missing, unexpected, weakly evidenced, or unobserved areas after the run

## Expectation Smells

Treat these as invalid or weak:

- expectations written after seeing the run result
- generic goals such as `Run tests`, `all good`, `validate`, or `make sure it passes`
- no expected scope
- no reason why the scope supports the user goal
- placeholder labels such as `module: my-module`
- labels, selectors, or profiles not used by the project
- expectations that only say tests should pass without saying what should run
- broad package expectations presented as precise safety proof
- forbidden or unrelated scope omitted when adjacent tests are likely to run
- evidence expectations that require filler steps or noisy attachments
- expectations widened to match the command without reporting reduced precision
- final claims that say expectations were met without explaining weak or unavailable expectation support

## After The Run

Review expectation results as evidence, not ceremony:

- If expected scope did not run, do not claim the change is covered.
- If unexpected scope ran, call out scope drift.
- If important checks or evidence are missing, treat the run as weak evidence even if tests passed.
- If expected skips or suppressions changed, review whether coverage or execution trust changed.
- If expectations were broad, state that scope checking was weaker.
- If local expectation support was unavailable, explain the fallback and keep conclusions provisional.
- If expectations were meaningful and matched, use that as support for the review conclusion.

When expectation results and runtime evidence disagree, trust the observed runtime evidence and report the mismatch.
