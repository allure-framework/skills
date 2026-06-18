# Allure Report Skills

[<img src="https://allurereport.org/public/img/allure-report.svg" height="80" alt="Allure Report logo" align="right" />](https://allurereport.org)

Portable Agent Skills for using Allure Report as the evidence layer for test work.

These skills help coding agents configure Allure reporting and write, review, debug, and maintain tests without relying only on raw console output or a final pass/fail status. They are intentionally version-light: durable workflow guidance lives in the skills, while exact Allure CLI commands and supported options are discovered from the project and local Allure help.

## Problems

Agents working near tests often fail in predictable ways:

- They treat a green command as proof, even when the wrong tests ran.
- They read raw console output and miss structured runtime context.
- They repeatedly rediscover test commands, Allure results paths, selectors, and framework details.
- They delete, skip, relax, or replace assertions because that is the shortest path to a passing build.
- They add tests with weak assertions, unclear intent, or no visible evidence of what was checked.
- They produce claims users cannot audit because the evidence is fragmented or missing.
- They spend too much context reading source code and long logs before knowing which runtime artifacts matter.
- They cannot reliably compare intended scope with observed scope.
- They struggle with flaky tests, non-gating jobs, excluded tests, and stale metadata.

These are not just reporting problems. They are agent-workflow problems: the agent needs a reliable evidence loop before it can make trustworthy claims about quality.

## Proposed Solution

Allure agent mode turns test execution into an evidence loop for agents and humans:

1. The agent defines the validation goal and intended scope.
2. The agent runs tests through `allure agent`, using local expectation options only when they catch a concrete risk.
3. When tests already produced local or CI Allure results or dump artifacts, the agent can use locally confirmed `allure agent inspect` support to turn those artifacts into the same agent-readable review surface.
4. Allure preserves console output and produces agent-readable markdown, manifests, events, findings, and per-test evidence.
5. The agent reviews runtime artifacts before source code, raw logs, or generated HTML reports.
6. The agent fixes the product, test, fixture, metadata, or evidence quality based on the observed run.
7. The final answer names what ran, what was checked, what evidence supports the conclusion, what remains uncertain, and the generated human report path when a final run produced one.

The skills keep this loop consistent across agents. The generated project guide keeps local commands and capabilities close to the repository. The Allure CLI remains the source of truth for version-specific flags, selectors, rerun support, state paths, and expectation controls.

## Why Allure

Allure already normalizes test results across frameworks and languages for human review. Agent mode extends the same value to agents:

- common result shape instead of vendor-specific parsing
- linked tests, steps, attachments, parameters, labels, findings, and run metadata
- rich evidence such as HTTP exchanges, image diffs, Playwright traces, screenshots, logs, SQL output, and fixture state
- local-first artifacts that do not require cloud access or vendor lock-in
- markdown output that agents can read selectively without loading a whole report

The goal is not to make agents run more commands. The goal is to make test-related conclusions harder to fake, easier to debug, and easier for users to audit.

## Available Skills

| Skill | Use it for | Main output |
| --- | --- | --- |
| `allure-configure-reporting` | Configuring Allure adapters, report commands, rich evidence, and CI report or artifact handling. | A working or clearly bounded Allure reporting setup with validation notes. |
| `allure-configure-agent-workflow` | Configuring AI-agent workflow guidance for Allure test work in a repository. | Root agent router files and `docs/allure-test-agent.md` in the target project. |
| `allure-test-agent` | Writing, reviewing, debugging, enriching, and maintaining tests through Allure agent mode. | Better test changes, better runtime evidence, and more trustworthy validation conclusions. |

Use `allure-configure-reporting` when a project needs reporting configured, use `allure-configure-agent-workflow` once per project to record local agent workflow guidance, then use `allure-test-agent` for normal test work.

## What The Skills Do

`allure-configure-reporting` configures Allure reporting in a repository by:

- detecting active test frameworks, build systems, package managers, existing Allure config, Allure results paths, report commands, and CI files
- selecting the smallest adapter, tool, command, evidence, or CI artifact change for the requested surface
- validating that tests emit Allure results, Allure report generation consumes the intended results path, or CI preserves/publishes the expected artifacts
- keeping examples advisory so agents can inspect local project facts and current official docs before editing

`allure-configure-agent-workflow` prepares a repository for future test work by:

- detecting local Allure and test-runner facts
- checking the local Allure wrapper, `allure --version`, and `allure agent --help`
- creating or updating short root agent entry files that route test work to the project guide
- creating `docs/allure-test-agent.md` with local commands, capabilities, run profiles, output policy, evidence conventions, expectation controls, and known unknowns
- avoiding exact stored Allure versions so generated project guidance does not go stale immediately

The workflow configuration skill does not try to turn every repository into the same shape. It records the local shape so later agents stop rediscovering it.

`allure-test-agent` guides day-to-day test work:

- choose meaningful test scope before running
- avoid weakening assertions just to make a command pass
- use Allure agent mode for smoke checks, targeted validation, review, coverage analysis, and debugging
- use consistent rules for output handling, capability discovery, artifact vocabulary, and runtime review order
- rely on CLI-managed temporary agent output by default, and clean up caller-provided `--output` directories when they are no longer needed
- turn human reports off for private iterative loops, then use `--report auto` or another supported mode for final review runs and share the generated report path
- inspect local or downloaded Allure results or dump artifacts through `allure agent inspect` when the local CLI supports it
- create expectation controls only when they reduce a real risk
- review `index.md`, `manifest/run.json`, `manifest/test-events.jsonl`, `manifest/tests.jsonl`, `manifest/findings.jsonl`, and relevant per-test markdown before relying on source inspection alone
- improve weak runtime evidence with useful steps, attachments, parameters, descriptions, and metadata
- report limitations when tests are skipped, non-gating, broad, weakly evidenced, or only partially modeled

## Requirements

- Node.js 18 or newer for `npx skills`.
- A target project with tests.
- Reporting configuration needs the target project's normal package manager, build system, test runner, and Allure adapter/tooling choices.

If Allure reporting is not configured yet, use `allure-configure-reporting` first. Use `allure-configure-agent-workflow` to document local agent workflow guidance once reporting works or the missing pieces are understood.

## Installation

The recommended cross-agent installer is the [`skills`](https://skills.sh/) CLI:

```bash
npx -y skills add allure-framework/skills --list --full-depth
```

Install all skills for Codex:

```bash
npx -y skills add allure-framework/skills --agent codex --skill '*' --yes --full-depth
```

Install all skills for Claude Code:

```bash
npx -y skills add allure-framework/skills --agent claude-code --skill '*' --yes --full-depth
```

Install all skills for Cursor:

```bash
npx -y skills add allure-framework/skills --agent cursor --skill '*' --yes --full-depth
```

Install a single skill:

```bash
npx -y skills add allure-framework/skills --agent codex --skill allure-test-agent --yes --full-depth
```

By default, `skills add` installs at project scope when run inside a project. Add `--global` to install for the current user instead:

```bash
npx -y skills add allure-framework/skills --agent codex --skill '*' --global --yes --full-depth
```

Restart or reload the agent after installation so the new skills are discovered.

## Skill Structure

Each installable skill lives under `skills/<skill-name>`:

```text
skills/
  allure-configure-reporting/
    SKILL.md
    CLAUDE.md
    agents/openai.yaml
    references/
      additional-integrations.md
      build-system-commands.md
      ci-integrations.md
      concepts.md
      examples.md
      test-frameworks.md
      tool-installation.md
  allure-configure-agent-workflow/
    SKILL.md
    CLAUDE.md
    agents/openai.yaml
    references/
      project-guide-template.md
      root-agent-entry-snippet.md
  allure-test-agent/
    SKILL.md
    CLAUDE.md
    agents/openai.yaml
    references/
      allure-evidence.md
      expectations.md
      test-design.md
```

`SKILL.md` is the canonical behavior guide. `CLAUDE.md` and `agents/openai.yaml` are small compatibility files. `references/` contains durable supporting knowledge that belongs to the skill payload.
