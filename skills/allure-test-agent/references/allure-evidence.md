# Allure Evidence Guide

## Purpose

Make a test reviewable from runtime artifacts before source code. A human reviewer and an agent should be able to understand the scenario, inputs, actions, system state, assertions, and likely failure cause from the report.

Optimize for enough evidence to debug and understand root cause without reading code, while keeping the report small enough to inspect.

## Use This When

- adding or fixing Allure steps
- adding attachments, rich artifacts, traces, screenshots, logs, HTTP exchanges, SQL evidence, or fixture evidence
- reporting parameters, labels, links, descriptions, or static metadata
- improving failure diagnostics and report readability
- reviewing whether runtime evidence is useful for humans and agents

## Core Rules

- Record every important action as a step.
- Report important artifacts when they help explain setup, execution, assertion, or failure.
- Prefer Allure runtime APIs and official or project-provided integrations over hand-wrapping every line of test code.
- Use integrations that report executed matchers, expectations, API calls, browser actions, SQL queries, or command executions when available.
- Prefer rich Allure attachment formats over plain text or ad hoc JSON when the integration supports them.
- Make collected evidence human-readable in the report.
- Make collected evidence agent-readable with clear names, structured data, and real state snapshots.
- Avoid metadata that does not affect execution, review, selection, routing, history, or policy.
- Keep per-test intent metadata inline with the test. Descriptions, labels, links, parameters, and intent-defining step names should be explicit at each test site instead of hidden in helper wrappers, lookup tables, or test-name mappings.

## In This File

- [Evidence Quality Test](#evidence-quality-test)
- [Evidence Smells](#evidence-smells)
- [Steps](#steps)
- [Attachments](#attachments)
- [Sensitive Data And Redaction](#sensitive-data-and-redaction)
- [Rich Attachments](#rich-attachments)
- [Runtime APIs And Integrations](#runtime-apis-and-integrations)
- [Parameters](#parameters)
- [Labels And Static Metadata](#labels-and-static-metadata)
- [Descriptions](#descriptions)
- [Examples By Test Type](#examples-by-test-type)
- [Good Evidence Pattern](#good-evidence-pattern)

## Evidence Quality Test

Good evidence is:

- from the current execution
- close to the behavior under test
- sufficient to debug the issue or understand root cause
- readable by a human scanning the report
- readable by an agent inspecting report files and attachments
- specific enough to explain pass or failure
- complete enough to preserve the relevant runtime state
- scoped enough to inspect
- safe to share in the project context

Weak evidence is:

- any evidence smell listed below that makes the report noisy, ambiguous, or hard to debug

## Evidence Smells

Treat these as signs that test evidence may need to be redesigned:

- Too many top-level steps. Prefer up to about 10 first-level steps; group details under parent steps. More top-level steps can be fine when the framework generates an event per action and the scenario is naturally long.
- Many small one-line text attachments. Prefer steps for simple facts and richer attachments for real state snapshots.
- Adjacent steps with the same name, or a parent step and child step with duplicated names.
- Very long test names. Move intent, context, and expected result into a description or evidence instead.
- Descriptions that duplicate the test name.
- No evidence of what was checked, such as reports that show only preparation steps and no executed matchers or assertions.
- Step-heavy, screenshot-heavy, or video-heavy reports where volume hides the behavior under test.
- Same test names for different tests located near each other, such as in the same feature, suite, or file.
- Overprocessed artifacts that hide the real runtime state.
- Tiny snippets chosen by the test author when the full relevant log, response, or snapshot is needed for debugging.
- Screenshots with no action or assertion context.
- Stale files from a previous run.
- Artifacts that expose secrets, credentials, tokens, private customer data, or other sensitive values.
- Redaction that destroys the artifact shape so the state can no longer be understood.
- Labels, parameters, or descriptions that do not help execution, review, selection, routing, history, or policy.
- Descriptions, labels, links, parameters, or intent-defining step names generated from centralized maps, helper wrappers, or test-name lookups instead of being visible at the test site.

## Steps

Use steps for important runtime actions and behavior boundaries:

- setup that changes the scenario or system state
- user actions, page navigation, API calls, command execution, SQL queries, and state transitions
- executed matchers, expectations, and assertion phases when the integration can report them
- retries, polling, and waits when timing matters
- cleanup that affects the scenario or future retries

Step names must be human-readable. Prefer concrete names over generic names with noisy parameters. For example, `open page https://example.org` is often better than `open page` with parameter `page=https://example.org`.

When shared test code is extracted, it is usually most useful when it represents a business-relevant setup, action, assertion, or cleanup block that can be named as a useful step. Small duplication is acceptable in tests; optimize for readable, stable, linear scenarios before optimizing for fewer repeated lines.

Avoid unnecessary or highly dynamic step parameters. Dynamic values in step parameters can make reports noisy and can reduce retry/history usefulness when they are not important to the behavior.

Prefer steps instead of small text attachments for simple facts. For example, record `run command npm test -- --grep login` as a step instead of attaching `command.txt` that contains only the executed command.

## Attachments

Attachments are state snapshots. Use them to preserve real runtime artifacts, not just the single line that seemed important while writing the test.

Use attachments for important artifacts a reviewer or agent may need to inspect:

- browser screenshots, videos, traces, DOM snapshots, accessibility snapshots, and console logs
- performed API requests and responses
- executed SQL queries and result sets
- command stdout, stderr, exit metadata, and process environment when relevant
- generated files, diffs, serialized state, or config used by the test
- database rows, messages, events, queue payloads, or service logs relevant to the assertion
- fixture state prepared before the test

Prefer relevant raw artifacts over heavily filtered summaries. Redact sensitive values, but avoid transforming the artifact so much that it stops representing the runtime state. Use readable names and content types. Attach the artifact near the step that produced it.

For prepared filesystem fixtures, attach enough structure to understand the state. A good pattern is to report the fixture tree and attach relevant files with attachment names based on their relative paths from the fixture root. File content should be the attachment content; the relative file name should be visible in the attachment name.

## Sensitive Data And Redaction

Runtime evidence must be useful and safe to share in the project context.

Redact or omit secrets and sensitive values before attaching artifacts. Common examples include credentials, API keys, bearer tokens, cookies, private keys, auth headers, session ids, payment data, personal data, private customer records, and temporary access URLs.

Prefer field-level redaction that preserves the artifact shape:

- keep request, response, log, SQL result, or environment structure visible
- replace sensitive values with stable placeholders such as `<redacted token>` or `<redacted email>`
- preserve keys, status codes, timings, error messages, row counts, and non-sensitive fields that explain behavior
- note redaction in the attachment name, description, or nearby step when it affects debugging

Do not attach the original artifact when it contains secrets. If safe redaction would remove most of the useful state, attach a smaller safe artifact and report what was omitted.

## Rich Attachments

Prefer rich attachment helpers and content types when available. They preserve structure for humans and agents, and Allure can render them better than generic text files.

- For HTTP traffic, use the Allure HTTP exchange format rather than separate ad hoc request and response text files. In current Allure JS integrations this is exposed as `ContentType.HTTP_EXCHANGE` / `application/vnd.allure.http+json`; prefer the integration constant or helper over hardcoding the string. Include request, response, error, timings, headers, and bodies when relevant, with secrets redacted.
- For screenshot or image comparisons, use the Allure image diff format, `application/vnd.allure.image.diff`, with `expected`, `actual`, and `diff` images. Prefer integration helpers such as screen-diff APIs when they exist.
- For Playwright runs, attach Playwright traces when available. Use the integration helper or `application/vnd.allure.playwright-trace` so the report can recognize the trace as a rich artifact.
- For structured data such as JSON, XML, YAML, CSV, TSV, or URI lists, use the matching media type instead of `text/plain`.

Avoid attachments that are not evidence:

- static success messages
- unrelated fixture blobs
- arbitrarily filtered one-line snippets when the full relevant log is needed
- duplicated console output already present in the run artifacts
- stale files from a previous run

## Runtime APIs And Integrations

Use Allure runtime APIs and available integrations to report evidence at the right abstraction level:

- framework integrations for executed expectations, matchers, fixtures, retries, and parameters
- browser integrations for screenshots, traces, videos, and page actions
- HTTP or API client helpers for rich HTTP exchange attachments
- database helpers for SQL queries and relevant rows
- command helpers for executed commands, environment, exit codes, and logs

Prefer instrumenting stable helper boundaries such as API clients, page objects, SQL helpers, fixture builders, or `runCommand`. Avoid rewriting or wrapping every single line of test code with manual steps.

Manual runtime API calls are still useful when no integration exists or when a specific artifact matters, but keep them close to the behavior they describe.

Reusable helpers may handle mechanics, such as attaching an HTTP exchange, redacting a fixture snapshot, recording a command log, or applying a project-standard label that is not test-specific. They should not own the test's intent. Keep the scenario description, issue or requirement links, scenario parameters, behavior labels, and custom step names that define what the test proves inline with the test itself.

## Parameters

Use parameters for values that distinguish this execution:

- browser, platform, locale, tenant, account type, feature flag, API version
- data variant, boundary value, input file, generated id, or seed
- retry-relevant or environment-relevant values

For parameterized tests, report the test parameters that define the scenario. Parameters help humans and agents understand which case ran and help Allure distinguish meaningful variants.

Mark dynamic parameters as excluded from history when they do not define the test identity. Examples include temp directories, random ports, timestamps, generated ids, and transient file paths. Otherwise retries and history can split incorrectly.

Do not use parameters for stable classification. If the value describes what bucket the test belongs to rather than what varied in this run, it is usually a label.

## Labels And Static Metadata

Static metadata is useful when it supports review, routing, selection, history, or policy:

- feature, story, component, module, package, layer
- owner or team when the project uses ownership
- severity when it feeds triage or quality policy
- microservice, product area, or platform when used by the project
- issue, bug, requirement, or known-defect links

Keep labels minimal and project-aligned. Do not invent a taxonomy for one test, and do not add labels that nobody uses.

## Descriptions

Descriptions are valuable because they preserve test intent and give humans and agents something to cross-check against runtime evidence. A good description explains what the test is meant to prove; steps, attachments, and assertions should then show whether the execution actually matched that intent.

Use descriptions to preserve:

- what scenario is tested
- what result is expected
- why the behavior matters
- what regression or bug the test protects against
- important preconditions or invariants

Do not use descriptions to repeat the test name, narrate implementation steps, paste long requirements text, or claim behavior that the runtime evidence does not show.

## Examples By Test Type

### Unit Tests

Good unit-test evidence is usually compact. Prefer the test framework integration for executed expectations, parameters, fixtures, retries, and assertion failures.

Use steps for:

- meaningful setup, such as constructing a domain object or configuring a fake clock
- the behavior invocation, such as `calculate invoice total`
- important assertions reported by matcher integration or runtime API

Use attachments for:

- complex input data when it is too large for a readable step name
- structured expected vs actual values, diffs, or snapshots
- generated output that explains the assertion

Example intent metadata:

```text
description: verifies invoice total uses item price, quantity, and discount rules
parameters: currency=USD, discount=10%
labels: component=billing
```

Example runtime steps:

```text
prepare invoice with 2 items and 10% discount
calculate invoice total
expect(total).to.equal(99.00)
expect(tax breakdown).to match expected values
```

Avoid attaching every primitive value or wrapping every assertion by hand. A unit report should explain the behavior and failure without becoming noisier than the source code.

### API / HTTP Tests

API tests should preserve the real exchange.

Use steps for:

- preparing server or database state
- sending the request, such as `POST /api/orders`
- assertions on status, headers, response body, side effects, and emitted events

Use attachments for:

- the HTTP exchange in Allure HTTP exchange format
- request and response bodies, headers, timings, and transport errors when the rich format is unavailable
- related database rows, messages, service logs, or emitted events

Example intent metadata:

```text
description: creates an order and publishes the order-created event for an authenticated customer
parameters: apiVersion=v2, tenant=default, authMode=user-token
labels: service=orders, feature=checkout
```

Example runtime steps:

```text
prepare customer account and inventory
POST /api/orders
  attachment: HTTP exchange
expect(response.status).to.equal(201)
expect(response.body.id).to be present
expect(order row).to match requested items
expect(order.created event).to be published
```

Use parameters for API version, tenant, auth mode, locale, feature flag, or data variant when they define the scenario. Use labels for service, component, feature, story, or owner when the project uses them.

### Integration / Service Tests

Integration tests should show prepared state, cross-boundary calls, and observed side effects.

Use steps for:

- preparing database rows, files, queues, caches, or service configuration
- triggering the behavior, such as publishing an event, running a job, or calling a service
- assertions on persisted state, emitted messages, downstream calls, and visible side effects

Use attachments for:

- fixture state before execution, including file trees or relevant database rows
- emitted events, queue messages, service requests, and downstream responses
- database rows or diffs before and after the action
- focused service logs, traces, or metrics snapshots that explain the assertion

Example intent metadata:

```text
description: projects a price change event into the search index and audit stream
parameters: backend=postgres, messageFormat=json
labels: service=search, component=projection
```

Example runtime steps:

```text
prepare product catalog rows
publish PriceChanged event
  attachment: event payload
wait for search projection refresh
expect(search index product price).to.equal(19.99)
expect(audit message).to be emitted
```

Use labels for component, service, module, feature, story, or owner when the project uses them. Use parameters for runtime variants such as database engine, backend mode, tenant, feature flag, or message format.

### Browser / UI Tests

Browser tests should explain both the user journey and the browser state.

Use steps for:

- navigation, user actions, waits, and visible assertions
- important setup such as creating accounts, enabling flags, or seeding data
- network or API actions performed through helper boundaries

Use attachments for:

- screenshots at important state changes and failures
- Playwright traces when available
- videos, browser console logs, network records, DOM snapshots, accessibility snapshots, and storage state when relevant
- Allure image diff attachments for screenshot comparison failures

Example intent metadata:

```text
description: lets an active user complete checkout from a seeded cart
parameters: browser=chromium, locale=en-US
labels: feature=checkout, layer=browser
```

Example runtime steps:

```text
create active user with seeded cart
open page /cart
click Checkout
  attachment: checkout page screenshot
fill payment details
submit order
expect(order confirmation).to be visible
expect(order summary).to contain seeded items
attachment: Playwright trace
```

Prefer browser and test-runner integrations for actions, traces, screenshots, videos, and assertions. Do not replace a trace or screenshot with a text-only summary when the rich artifact is available.

### CLI Tests

CLI tests should preserve the command execution as a state snapshot and the checks as steps.

Use steps for:

- the executed command, with the command in the step name
- important setup such as creating fixture files or configuring environment variables
- assertions on exit code, stdout, stderr, generated files, and side effects

Use attachments for:

- full relevant stdout and stderr logs
- process environment when it affects behavior
- exit metadata, structured command responses, generated files, and fixture trees
- diffs between expected and generated output

Example intent metadata:

```text
description: rejects an invalid config file with a non-zero exit code and readable error
parameters: config=invalid-yaml
labels: component=cli
```

Example runtime steps:

```text
create fixture directory with invalid config
run command npm test -- --grep login
  attachment: process environment
  attachment: full execution log
  attachment: exit metadata
expect(stderr).to.contain("Error")
expect(exitCode).not.to.equal(0)
```

Do not replace the execution log with a hand-picked single line unless the full relevant log is already available elsewhere in the report.

## Good Evidence Pattern

For a behavior test, aim for:

1. A clear test name that states observable behavior.
2. A concise description that preserves intent, expected result, risk, or protected regression.
3. Parameters for the runtime variant, with dynamic non-identity values excluded from history.
4. Labels and links for stable feature, component, owner, issue, or policy metadata used by the project.
5. Steps for setup, action, assertion, and meaningful cleanup phases.
6. Attachments for HTTP exchanges, screenshots, image diffs, Playwright traces, SQL evidence, fixture state, diffs, or logs that preserve relevant runtime state.
7. Evidence from integrations or helper-boundary instrumentation before manual per-line wrapping.

Accept evidence when the runtime artifacts explain the behavior and likely root cause without forcing the reviewer or agent to read source first.
