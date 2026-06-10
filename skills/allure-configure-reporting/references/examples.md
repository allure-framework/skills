# Adaptable Best-Practice Examples

These examples are sketches, not copy-paste recipes. Verify exact package names, action versions, CLI options, and config syntax against the project and official docs before applying.

## GitHub Actions: Preserve Allure Results

Use when local Allure result emission works and CI should retain Allure results for debugging or later Allure report generation.

```yaml
- name: Run tests
  run: <existing-test-command>

- name: Upload Allure results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-results-${{ matrix.os || 'default' }}-${{ github.run_attempt }}
    path: <configured-parent>/allure-results
    if-no-files-found: warn
```

Check before applying:

- the Allure results path matches the adapter configuration
- the final directory name is `allure-results`
- the test command is the same command the project trusts
- artifact names are unique for matrix or sharded jobs

## GitHub Actions: Wrapped Run And Aggregation

Use when the installed Allure CLI supports wrapping or dumping run data and the project wants a final aggregated report across jobs or shards.

Important: the test command wrapped by `allure run` must emit Allure results into a directory named `allure-results`. Use parent directories or artifact names for shard identity; do not rename the result directory itself.

```yaml
# Sketch only. Verify exact Allure CLI options in this project.
- name: Run tests with Allure wrapper
  run: allure run --dump <dump-output-path> -- <existing-test-command>

- name: Upload Allure run data
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-data-${{ matrix.shard || github.run_attempt }}
    path: <dump-output-path>
```

In a final job, download each artifact, aggregate or generate the Allure report with the project-approved Allure command, then upload or publish the report according to the repository's CI policy. If the artifact contains Allure results rather than CLI dump data, keep the internal result directory named `allure-results`.

Prefer this pattern when:

- each shard/job needs independent Allure run data or Allure results
- the Allure report should be generated once after all tests finish
- failed tests should still produce inspectable artifacts

## Local Package Script: Generate Report From Existing Results

Use when tests already emit results and the project wants a local convenience command.

```json
{
  "scripts": {
    "allure:report": "<project-allure-command> generate <output-parent>/allure-results --output <report-path>",
    "allure:serve": "<project-allure-command> open <report-path>"
  }
}
```

Adapt command names and flags to the installed Allure tool and existing package-script style.

## HTTP Integration: Official Helper

Use when the project wants HTTP exchanges represented in Allure results and an official Allure integration or project helper exists for the HTTP client.

Sketch:

- configure the official integration or existing project helper at the HTTP client boundary
- keep the framework adapter's `allure-results` path unchanged
- run one focused API test that exercises the configured client
- confirm the expected HTTP integration signal appears in Allure results

Do not add a custom HTTP attachment helper when an official integration already covers the project need.
