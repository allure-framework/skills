# Project Guide

Use [Allure Agent Mode](docs/allure-agent-mode.md) for all test-related work in this repository.

**Non-negotiable: do test work through `allure agent`, and reach every conclusion from the agent output — not from console text or your own reporting.**

- Run every test command whose result informs a conclusion through `allure agent` — smoke checks included, even for small or mechanical changes. It preserves the original console output and adds agent-mode artifacts without inheriting the project's normal report or export plugins, so there is no cost to routing through it. Skip only when agent mode is impossible or you are debugging agent mode itself.
- After a run, open the output directory, read its `AGENTS.md` guide, and follow its reading order (`manifest/run.json` and the manifests, then `index.md`, then the per-test files). `allure agent` already did the analysis — read that structured output directly (use `allure agent query` to inspect it). Do not hand-roll a report from console or `allure agent query` text with `grep`/`tail`/`head`/counting, and never `>/dev/null` the run.
- Weigh every signal, not just pass/fail: findings, weak or placeholder evidence, scope drift, broken vs failed, flaky and retried tests, global stderr, attachments. A green count is not a passing review.
- If agent output is missing or incomplete, fix that first; never silently fall back to console-only conclusions.
- Read `docs/allure-agent-mode.md` for local commands and conventions, and use the `$allure-agent-mode` skill as the durable behavior guide when it is installed.
- Do not present ignored, excluded, swallowed, or non-gating tests as a passing validation signal.
