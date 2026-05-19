# Claude Code Memory

This repository contains Allure Report skills.

Start with `README.md` for the repository purpose, install examples, and release checklist.

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
