# CI Integrations

Use this reference when configuring Allure in CI or changing CI artifact/report behavior.

## Detection

Look for provider files before editing:

- GitHub Actions: `.github/workflows/*.yml` or `.yaml`
- GitLab CI: `.gitlab-ci.yml` and included templates
- CircleCI: `.circleci/config.yml`
- Jenkins: `Jenkinsfile`
- TeamCity, Azure Pipelines, Buildkite, Bamboo, Drone, Bitbucket Pipelines, and custom CI directories

Read existing test jobs, matrix/shard strategy, artifact retention, cache setup, permissions, and publish steps before adding Allure behavior.

## CI Principles

- Confirm local result emission first when practical.
- Preserve Allure results or equivalent Allure run data even when tests fail. For Allure results, the directory basename should stay `allure-results`, especially when the data will be discovered by `allure run` or inspected later by supported agent tooling.
- Use provider-specific always-run conditions for artifact/report steps.
- Keep test pass/fail semantics visible. Report publication should not silently turn failed tests into green jobs.
- Aggregate shards or matrix outputs in a dedicated final job when results are split.
- Separate publishing concerns from test execution when possible.
- Do not add pages publishing, token scopes, or branch permissions without a clear user goal.

## Artifact Strategy

For most CI systems, a safe first pass is to upload Allure results artifacts from each test job. Allure report generation and publishing can be a later surface.

For multi-job or sharded runs:

- give artifacts deterministic names that include runner, shard, OS, browser, or matrix values
- keep each artifact's internal result directory basename as `allure-results`; encode matrix identity in the parent path or artifact name
- download all Allure results artifacts in a final aggregation job
- generate or publish an Allure report from the aggregated result set
- preserve raw results or dump artifacts in a shape that can be downloaded and inspected later with `allure agent inspect` when the installed CLI supports it
- keep enough Allure results or Allure run data to debug report-generation failures

When `allure agent inspect` is supported, retained artifacts can be reviewed later with `allure agent inspect <allure-results-dir-or-glob>` or `allure agent inspect --dump <archive-or-glob>`. Prefer that agent-readable output before relying on long logs or generated HTML.

If `agent inspect` is unavailable or cannot consume the artifact shape, a later review can still produce agent output by generating a temporary Allure config that enables only the `agent` plugin and running `allure generate --config <generated-config> --output <agent-output>` against the retained results or dumps.

## Provider Notes

GitHub Actions commonly uses `if: always()` for artifact and report steps, `actions/upload-artifact` for Allure results artifacts, and a final job for aggregation or publishing. Pages publishing also involves repository permissions and Pages settings.

GitLab CI commonly uses `artifacts: when: always` and may expose reports through Pages or retained artifacts.

CircleCI, Buildkite, Jenkins, TeamCity, and Azure Pipelines have provider-specific artifact and publish mechanisms. Prefer existing project conventions and official provider docs over generic snippets.

## Validation

For CI edits, validate syntax locally when tooling is available. If the project guide expects existing-result or dump inspection, confirm the installed CLI's `allure agent inspect` syntax before documenting or relying on it. If CI cannot be run locally, verify paths and commands against the existing workflow and clearly state that runtime validation requires a CI run.
