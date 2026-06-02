# Claude Code Memory

This repository contains Allure Report skills.

Start with `README.md` for the repository purpose, install examples, and release checklist.

For maintainer-only Allure agent-mode command guidance, generated project-guide design, and CLI help wording, read `docs/allure-agent-mode-reference.md`. Do not copy that file into installable skills unless the guidance is intentionally user-facing.

## Validation

Run:

```bash
node scripts/validate-skills.ts
```

## Skill Folders

Each skill lives under `skills/<skill-name>` and must include:

- `SKILL.md`
- `CLAUDE.md`
- `agents/openai.yaml`
- Any referenced files under `references/`, `scripts/`, or `assets/`

Keep durable shared guidance in `SKILL.md`; keep Claude-specific notes minimal and synchronized.
