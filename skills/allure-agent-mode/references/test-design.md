# Test Design Guide

## Purpose

Preserve or improve useful coverage. A green command is not enough if the test no longer proves the intended behavior.

Testing has little value when the tests cannot be trusted, cannot be understood, or cannot provide proof to other people and agents. Design tests as quality signals that can be executed, reviewed, and explained.

## Use This When

- adding, changing, reviewing, deleting, skipping, quarantining, or repairing tests
- deciding what a test should expect
- changing assertions, names, descriptions, setup, fixtures, or test data
- reviewing whether a test still proves meaningful behavior
- reviewing whether test execution and CI provide a trustworthy signal

## Core Rule

Tests are behavior contracts, not obstacles to make green.

Agents must not delete, relax, invert, skip, or replace assertions just to make a run pass. If a test fails, classify why it fails before changing the test.

## In This File

- [Trust, Understand, Prove](#trust-understand-prove)
- [Non-Negotiables](#non-negotiables)
- [Expected Behavior Sources](#expected-behavior-sources)
- [Design Workflow](#design-workflow)
- [Choosing The Test Layer](#choosing-the-test-layer)
- [Cross-Layer Smoke Coverage](#cross-layer-smoke-coverage)
- [Scenario Coverage](#scenario-coverage)
- [Test Shape And Layout](#test-shape-and-layout)
- [Parameterized Tests](#parameterized-tests)
- [Assertion Quality](#assertion-quality)
- [Fixing Failing Tests](#fixing-failing-tests)
- [Handling Flaky Tests](#handling-flaky-tests)
- [Coverage Quality Smells](#coverage-quality-smells)
- [Suite Execution Smells](#suite-execution-smells)
- [Deleting, Skipping, Or Suppressing Tests](#deleting-skipping-or-suppressing-tests)
- [Review Questions](#review-questions)

## Trust, Understand, Prove

Useful tests need all three properties:

- Trust: results are reliable, deterministic enough to act on, and not silently ignored.
- Understand: names, descriptions, setup, actions, and assertions make the intended contract clear.
- Prove: runtime evidence and CI results can show what was tested and why the conclusion is valid.

Treat execution as part of test design. A good test that is excluded by default, ignored without reason, or allowed to fail without affecting CI does not provide the same quality signal as an active test that gates the relevant workflow.

## Non-Negotiables

- Do not weaken verification only because it is the shortest path to a passing build.
- Prefer fixing product code, fixtures, setup, data, selectors, environment, or an incorrect expectation before weakening a test.
- Preserve meaningful assertions unless evidence shows the tested behavior or test intent is wrong.
- Any removed test, weakened assertion, skipped test, muted failure, quarantine, or ignored result needs explicit rationale.
- Keep tests boring and explicit. Prefer readable, stable, linear tests over conditional logic, loops, factories, or generated tests whose main value is saving a few repeated lines.
- Do not hard-skip tests with runtime `if` branches, early returns, conditional registration, or helper aliases that hide the missing coverage from the runner and report.
- New tests should prove behavior that matters, not merely execute code.
- A new or changed regression test should fail for the intended bug before the fix and pass after the fix; if reproducing the pre-fix failure is genuinely impossible, state why and what alternative evidence proves the fix.
- If expected behavior is unclear, report uncertainty instead of inventing a weaker expectation.
- Use fixtures, factories, or controlled test data. Do not depend on production data, live customer records, or other uncontrolled external state.
- Each test must be independently runnable. Do not rely on execution order, shared mutable state across tests, or leftovers from a previous test.

## Expected Behavior Sources

Decide what should be true from legitimate sources:

- user request, acceptance criteria, or bug report
- issue, requirement, API contract, product docs, design notes, or release notes
- existing tests that clearly encode accepted behavior
- previous passing behavior or historical evidence when compatibility matters
- domain invariants, security rules, data rules, or public interface contracts
- direct clarification from the user when the expected behavior is ambiguous

Do not treat the current implementation as truth by default. Product code is evidence of how the system behaves now; it is not automatically evidence of how the system should behave.

When sources disagree, report the disagreement and choose the safest validation path. Do not silently rewrite the test to match the easiest source.

## Design Workflow

Before writing or changing tests:

1. Identify the behavior, risk, and expected result.
2. Identify the source of truth for that expected result.
3. Choose the clearest test layer that proves the behavior with reasonable confidence and reasonable cost.
4. Consider whether lower-layer contract coverage needs higher-layer smoke coverage through real boundaries.
5. Select scenarios that cover the risk without duplicating existing coverage.
6. Write checks that would fail for the intended bug or regression.
7. Shape the test so setup, action, and checks can be understood from runtime evidence.
8. Keep setup deterministic, scoped, and readable.
9. Run through Allure agent mode when the result supports a conclusion.
10. Review runtime evidence before claiming the test is useful.
11. Verify that important tests are part of the expected local or CI signal, or report why they are not.
12. Report remaining coverage gaps and confidence limits.

## Choosing The Test Layer

Use the layer that gives the clearest signal at the lowest reasonable cost.

- Unit tests: best for pure logic, small state transitions, validation rules, formatting, branching, boundaries, and isolated regressions.
- Component or integration tests: best for interactions between modules, adapters, persistence, framework wiring, dependency boundaries, and fixture-heavy logic.
- API or HTTP tests: best for contracts, status codes, request/response behavior, auth, validation, error mapping, compatibility, and service boundaries.
- Browser or end-to-end tests: best for critical user flows, navigation, rendering, accessibility-sensitive behavior, client/server integration, and workflows that lower layers cannot prove.
- CLI tests: best for command behavior, flags, exit codes, stdout/stderr, generated files, config loading, and process-level integration.

Prefer a lower layer when it proves the behavior just as well. Use a higher layer when the user-facing or integration behavior is the point of the test.

Do not create complex mocks only to force a lower-layer test. Unit tests are usually faster and more stable, but a real integration test can be the better design when it is still fast, deterministic, focused, and simpler than maintaining a complicated fake or mock setup.

If the real boundary can be exercised in milliseconds and the suite only needs a few focused cases, prefer the test that gives the clearest evidence. Mocking should reduce cost or isolate risk; it should not make the test harder to trust than the real integration.

## Cross-Layer Smoke Coverage

Always consider a small higher-layer smoke test for contracts that are mostly proven at a lower layer with mocks, fakes, stubs, or isolated adapters.

Use the lower layer for invariants, edge cases, validation rules, negative paths, and detailed contract checks. Use the higher-layer smoke test to prove that the simplest successful path works through the real boundary.

Examples:

- If mocked-service API tests cover all request invariants and error cases, consider one integration test that calls the API with the real service on the simplest successful path.
- If unit tests cover a client adapter's mapping rules, consider one API or service test that proves the adapter is wired to the real dependency or local test double used by the project.
- If component tests cover UI states, consider one browser smoke flow that proves the user can complete the main journey through the real app shell.
- If CLI unit tests cover parsing and validation, consider one process-level test that runs the real command successfully against a minimal fixture.

Do not copy the full lower-layer matrix into the higher layer. The higher-layer smoke test should catch wiring, configuration, serialization, routing, dependency, and integration drift that mocks cannot catch.

If a higher-layer smoke test would be too slow, flaky, expensive, or unavailable, state that limitation and rely on the best existing integration signal instead.

## Scenario Coverage

Choose scenarios based on risk, not on a fixed quota.

Consider:

- primary success path
- important failure or negative path
- boundary or edge case
- regression case for a reported bug
- permissions, roles, feature flags, locale, tenant, platform, or config variants
- compatibility behavior or migration behavior when relevant
- partial failure, retry, timeout, or cancellation behavior when the system supports it

Small safe changes may need one focused regression or smoke test. Risky features may need a mix of unit, integration, API, and browser coverage. Do not imply full coverage from a narrow run.

## Test Shape And Layout

Do not overcomplicate tests. When possible, use one test for one behavior contract.

A behavior contract is a specific promise the system makes: given this state and action, this observable result should happen. A test may check several facts that belong to the same contract, but avoid bundling unrelated contracts only to reduce file count or force a broad green signal.

End-to-end smoke tests can check multiple behavior contracts when the goal is journey health or integration confidence. Do not use broad smoke flows as the main way to prove every contract; keep targeted tests for important behavior.

The simplest useful layout is Given-When-Then:

1. Given: prepare data, fixtures, environment, or system state when needed.
2. When: perform the action under test.
3. Then: validate the observable result.

The layout can be expressed through clear helper names, sections, framework steps, or comments when they help readability. Do not add ceremonial comments when the structure is already obvious.

Design the test with runtime evidence in mind. The report should be able to show the meaningful setup, action, and checks without forcing the reviewer or agent to reverse-engineer the test source.

Prefer a little repetition over clever test generation. Tests have more relaxed duplication rules than production code: optimizing away a few repeated setup or assertion lines is usually less important than keeping each behavior easy to read, debug, select, and map to runtime evidence.

Extract shared code when it improves readability or stability, especially when the extracted block is a real behavior or setup concept in the scenario, such as `create active user`, `seed catalog item`, `submit checkout`, or `assert order-created event`. These helpers should keep intent visible at the call site and are good candidates for Allure steps. Be skeptical of helpers that hide the contract, switch behavior through flags, or mainly exist to show off clever deduplication.

## Parameterized Tests

Parameterized tests are useful when the same behavior contract should be checked across several inputs, variants, boundaries, platforms, locales, feature flags, or data shapes.

Do not make parameterized tests over-generic. One parameterized test should still prove one behavior contract. The parameters should vary the case for that contract, not switch the test between unrelated contracts.

Good parameterization keeps the same Given-When-Then shape and the same expected behavior type for every row. If different rows need different setup paths, different actions, or unrelated assertions, split them into separate tests.

Make parameter values readable in the test name, case name, or Allure parameters. Avoid hiding the scenario inside numeric indexes or opaque fixture names.

Use custom test factories or loops only when they make the suite easier to understand and maintain, not simply to optimize repeated test bodies. Prefer framework-native parameterization when each row keeps the same contract and stays readable in the runner and Allure report.

## Assertion Quality

Good assertions:

- check behavior that matters to a user, caller, contract, or invariant
- check observable output, state, side effects, emitted events, generated files, or user-visible UI when the behavior is observable
- are specific enough to catch the intended regression
- fail for a useful reason
- compare meaningful expected and actual values
- assert the meaningful characteristics of an object or result directly instead of hiding value comparisons inside generic boolean checks
- include a human-readable assertion message for complex or deep matching when the assertion API supports it
- verify externally visible effects when the behavior is externally visible
- include important negative cases when failures matter
- avoid depending on incidental implementation details unless the test layer is specifically about those details

Weak assertions include:

- no assertions or checks
- tautologies, such as checking a value against itself
- generic existence checks when exact behavior matters
- `assertTrue` or `assertFalse` around a non-boolean comparison, object predicate, or helper result when the assertion should expose expected and actual values
- broad snapshots as the only proof of complex behavior
- complex deep matching failures with no assertion message when the raw diff is hard to understand
- `does not throw` as the only assertion when output or state should be checked
- mock-call-only assertions when user-visible behavior or external contract matters
- assertions that duplicate the implementation logic instead of checking the result
- tests that only prove a mock was configured
- assertions so broad that they still pass when the intended bug is present

## Fixing Failing Tests

Classify the failure before editing the test.

Possible classifications:

- product bug: the test is correct and the product should change
- stale test: expected behavior changed and the test should be updated or removed with rationale
- wrong expectation: the test intent is valid but the expected value or matcher is incorrect
- fixture/setup/data issue: the scenario is valid but the test creates the wrong state
- selector or waiting issue: the behavior may be correct but the test interacts with it unreliably
- environment or harness issue: the run did not reach meaningful product validation
- flaky behavior: outcomes vary without a deterministic product change
- duplicate test: the test adds little value beyond another test
- weak test: the test runs but does not prove the stated behavior

Do not solve an unclassified failure by weakening the assertion.

## Handling Flaky Tests

When a failure is classified as flaky behavior:

1. Rerun the narrowest scoped command through Allure agent mode before changing product code or weakening assertions.
2. Check ordering dependencies, shared mutable state, wall-clock timing, async completion, retries, and environment variance.
3. Fix the root cause when possible: stable waits, isolated fixtures, deterministic data, proper cleanup, or removing hidden coupling.
4. If the flake cannot be fixed immediately, use the project's documented quarantine, retry, or xfail mechanics with explicit reason and owner. Do not rerun until green or hide the instability behind weaker assertions.
5. Report the limitation in the validation conclusion. A flaky green run is not strong proof.

## Assertion Changes

Treat these as high-risk edits:

- deleting an assertion
- replacing a precise assertion with a broad existence or truthiness assertion
- changing an expected value to match the current failing output
- inverting an expectation
- removing a negative case
- changing an exact error/status/contract check to a generic success check
- replacing behavior checks with implementation or mock-call checks
- skipping, muting, quarantining, or ignoring a failing test
- hiding a test behind runtime conditional registration, early returns, or custom skip helpers that do not report an explicit skipped or assumed outcome
- deleting a test or removing it from a suite

These edits are allowed only with explicit rationale:

- what changed in the expected behavior
- what source of truth supports the change
- what coverage remains
- what follow-up validation was run
- what risk remains

## Test Names And Descriptions

A test name should state the behavior being checked. It should not promise more than the test proves.

Good descriptions are useful even when the test name is clear. They preserve the intended contract in human-readable form and make it possible to cross-check that runtime evidence matches the actual intended behavior.

Use descriptions to capture intent, bug, requirement, precondition, expected result, or reason the behavior matters. Keep them concise and stable; the description should explain what the test is meant to prove, not narrate implementation details.

Keep descriptions and other per-test intent metadata inline with the test. Do not centralize descriptions, labels, links, parameters, or intent-defining step names in helper wrappers, lookup tables, or mappings keyed by test name. Reusable helpers may handle mechanics, but the contract being proved should remain visible at the test site.

Avoid:

- very long names that hide the actual check
- names that describe setup but not expected behavior
- descriptions that duplicate the name
- descriptions that disagree with runtime evidence or assertions
- names shared by nearby tests that cover different scenarios
- names that claim coverage the assertions do not provide

## Setup And Data

Good setup is deterministic and relevant to the scenario.

- Build only the state needed for the behavior under test.
- Keep random data controlled or reported when it affects the scenario.
- Avoid hidden coupling to test order, wall-clock time, shared mutable state, external services, or previous runs.
- Prefer named fixtures and builders that make scenario intent visible.
- Do not hide important scenario data inside helpers without readable names or evidence.
- Clean up only when cleanup is needed for isolation or future runs.

If setup creates important runtime state, make sure Allure evidence can show enough of that state to debug failures.

## Coverage Quality Smells

Treat these as signs that a test needs review:

- assertion removed or weakened with no rationale
- new test added only to touch code, not prove behavior
- test combines many unrelated behavior contracts when focused tests would be clearer
- parameterized test covers unrelated behavior contracts under one generic name
- loops, factories, dynamic registration, or conditional branches make test intent harder to see than a few explicit tests would be
- happy-path-only coverage for risky logic
- missing negative case for validation, permissions, auth, or error handling
- behavior is only proven with mocks or fakes and no higher-layer smoke covers the real boundary
- complex mocks exist only to avoid a simple, fast, stable integration test
- opaque boolean assertion hides the expected value, actual value, or object characteristics being verified
- complex assertion failure would not explain the intended contract to a human or agent
- broad snapshot with no focused assertions
- duplicated scenario under a different name
- test name or description promises behavior the assertions do not check
- description intent does not match runtime evidence
- test passes if the intended bug is reintroduced
- test only verifies mocks while ignoring externally visible behavior
- flaky wait, sleep, or timing assumption
- fixture data is too generic to explain the scenario
- hard-skipped coverage hidden behind runtime `if` branches, conditional registration, early returns, or custom skip helpers
- skipped or quarantined test has no owner, reason, issue, or restore path when project policy expects one
- stale expectation updated to match current output without identifying the source of truth

## Suite Execution Smells

Treat these as signs that the test suite may not provide a trustworthy quality signal:

- no meaningful tests run in CI
- important tests are excluded from the default local or CI command without a clear reason or replacement signal
- ignored, skipped, muted, quarantined, or suppressed tests have no clear reasoning
- tests for unsupported prerequisites or environments are silently unregistered, returned early, or hidden by helpers instead of reported as skipped, assumed, or failed setup
- CI test jobs run but are allowed to fail while the build is still reported as passing
- test commands swallow failures, such as wrappers that force a zero exit code without reporting the run as non-gating
- test results or runtime evidence are not available to show what was executed

If a test or test job is intentionally non-gating, report that clearly. Do not present non-gating execution as proof that the tested behavior is safe.

## Deleting, Skipping, Or Suppressing Tests

Deleting, skipping, muting, quarantining, xfail-ing, or ignoring a test reduces active coverage unless there is a clear replacement.

Do not hard-skip tests with runtime `if` branches, early returns, conditional test registration, or helper aliases that make missing coverage disappear from the runner and Allure report. Use the test framework's explicit mechanics instead, such as `it.skip`, `it.skipIf`, `assumeThat`, xfail, quarantine, or the project's documented equivalent.

If coverage is expected and a prerequisite is missing, fail setup with a clear error instead of silently skipping the test. If the coverage is intentionally unsupported or temporarily unavailable, declare that explicitly through runner-visible skip or assumption mechanics and include the reason.

Before doing it:

1. Explain why the test is invalid, duplicate, obsolete, or impossible to run now.
2. Identify what coverage remains or what replacement test exists.
3. Link the decision to evidence, issue, requirement, or project policy when available.
4. Add owner, reason, expiry, or restore condition when the project convention supports it.
5. Validate the affected scope after the change.

Do not hide a real product regression or missing environment coverage through suppression.

## Review Questions

Before accepting a test change, answer:

- What behavior should this prove?
- What is the source of truth for that behavior?
- Is this one behavior contract, or a justified smoke/integration flow?
- If parameterized, do all cases still prove the same behavior contract?
- Would this be clearer as explicit boring tests instead of a loop, factory, conditional branch, or generated test matrix?
- If detailed checks are lower-layer or mocked, is there an appropriate higher-layer smoke signal?
- Would this test fail if the intended bug or regression existed?
- Is the assertion specific enough to catch the failure?
- Does the assertion expose the expected and actual observable result?
- Does the description intent match the runtime evidence and assertions?
- Is the chosen test layer appropriate?
- Are important negative, edge, or regression cases covered or intentionally out of scope?
- Are the relevant tests actually run by the expected local or CI command?
- Are missing prerequisites or unsupported environments represented by explicit skip, assumption, xfail, quarantine, or clear setup failure rather than hidden runtime conditionals?
- If a CI test job is non-gating, was that limitation reported clearly?
- Did any assertion, test, or suppression get weaker?
- If coverage got weaker, what evidence justifies that?
- Does the Allure runtime evidence show what was checked?

## Allure Evidence Handoff

This guide answers: does the test prove the right thing?

`allure-evidence.md` answers: can a human or agent understand what happened when the test ran?

If the test design is sound but the report is hard to review, enrich Allure evidence with better steps, visible checks, useful attachments, parameters, labels, or descriptions. If the evidence is rich but the assertions do not prove behavior, fix the test design first.
