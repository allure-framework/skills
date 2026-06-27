# Project Guide

Use [Allure Agent Mode](docs/allure-agent-mode.md) for all test-related work in this repository.

- Read `docs/allure-agent-mode.md` before designing, writing, reviewing, validating, debugging, or enriching tests. Use the `$allure-agent-mode` skill as the durable behavior guide when it is installed; this project file contains local commands and conventions.
- If a command executes tests and its result will be used for smoke checking, reasoning, review, coverage analysis, debugging, or any user-facing conclusion, run it through `allure agent`. It preserves the original console logs and adds agent-mode artifacts without inheriting the normal report or export plugins from the project config.
- Use agent-mode execution for smoke checks too, even when the change is small or mechanical.
- Only skip agent mode when it is impossible or when you are debugging agent mode itself.
- After an `allure agent` run, review the agent output: open `index.md`, read the `manifest/*.jsonl` files, or use `allure agent query --latest`. Do not pipe an agent run to `tail`, `grep`, or `head` and conclude from console output — that throws away the printed agent-output path and reverts to raw-log parsing.
- If agent output is missing or incomplete, debug that first rather than silently falling back to console-only review.
- Use Allure agent-mode when adding tests for features or fixes so expectations, evidence quality, and scope review are part of the loop.
- Do not present ignored, excluded, swallowed, or non-gating tests as a passing validation signal.
