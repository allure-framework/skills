# Allure Report Skills

[<img src="https://allurereport.org/public/img/allure-report.svg" height="80" alt="Allure Report logo" align="right" />](https://allurereport.org)

This repository contains Codex skills for Allure Report.

It is the lightweight install source for Allure-specific agent workflows. Keeping these skills outside the main Allure 3 repository makes installation faster for customers and lets the skills evolve independently from Allure 3 release cycles.

## Available Skills

| Skill | Purpose |
| --- | --- |
| `allure-test-agent-setup` | Add Allure test-agent guidance to a project. |
| `allure-test-agent` | Write, review, debug, and improve tests with Allure evidence. |

## Installation

Use `$skill-installer` in Codex to install one or more skills from this repository.

Install the project setup skill:

```text
Use $skill-installer to install https://github.com/allure-framework/skills/tree/main/skills/allure-test-agent-setup
```

Install the test agent skill:

```text
Use $skill-installer to install https://github.com/allure-framework/skills/tree/main/skills/allure-test-agent
```

Install both skills:

```text
Use $skill-installer to install these skills from allure-framework/skills:
- skills/allure-test-agent-setup
- skills/allure-test-agent
```

Restart Codex after installation so the new skills are discovered.

## Contributing

Skills live under `skills/<skill-name>`.

Each skill must include:

- `SKILL.md` with `name` and `description` frontmatter.
- `CLAUDE.md` that points Claude Code to the canonical skill instructions.
- `agents/openai.yaml` with UI metadata and a default prompt that references `$skill-name`.
- Only supporting files that are required by the skill, such as `references/*`.

Validate the repository before opening a pull request:

```bash
node scripts/validate-skills.ts
```

## Release Checklist

- Run `node scripts/validate-skills.ts`.
- Confirm README install paths match the actual skill folders.
- Confirm each changed skill remains concise and install-ready.
- Tag the release after CI passes on `main`.
