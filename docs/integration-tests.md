# 整合測試

本文件提供此專案中使用的整合測試框架的資訊。

## 總覽

整合測試旨在驗證 Gemini CLI 的端對端功能。它們在受控環境中執行建置的二進位檔，並驗證它在與檔案系統互動時的行為是否如預期。

這些測試位於 `integration-tests` 目錄中，並使用自訂測試執行器執行。

## Running the tests

The integration tests are not run as part of the default `npm run test` command. They must be run explicitly using the `npm run test:integration:all` script.

The integration tests can also be run using the following shortcut:

```bash
npm run test:e2e
```

## Running a specific set of tests

To run a subset of test files, you can use `npm run <integration test command> <file_name1> ....` where <integration test command> is either `test:e2e` or `test:integration*` and `<file_name>` is any of the `.test.js` files in the `integration-tests/` directory. For example, the following command runs `list_directory.test.js` and `write_file.test.js`:

```bash
npm run test:e2e list_directory write_file
```

### Running a single test by name

To run a single test by its name, use the `--test-name-pattern` flag:

```bash
npm run test:e2e -- --test-name-pattern "reads a file"
```

### Running all tests

To run the entire suite of integration tests, use the following command:

```bash
npm run test:integration:all
```

### Sandbox matrix

The `all` command will run tests for `no sandboxing`, `docker` and `podman`.
Each individual type can be run using the following commands:

```bash
npm run test:integration:sandbox:none
```

```bash
npm run test:integration:sandbox:docker
```

```bash
npm run test:integration:sandbox:podman
```

## Diagnostics

The integration test runner provides several options for diagnostics to help track down test failures.

### Keeping test output

You can preserve the temporary files created during a test run for inspection. This is useful for debugging issues with file system operations.

To keep the test output set the `KEEP_OUTPUT` environment variable to `true`.

```bash
KEEP_OUTPUT=true npm run test:integration:sandbox:none
```

When output is kept, the test runner will print the path to the unique directory for the test run.

### Verbose output

For more detailed debugging, set the `VERBOSE` environment variable to `true`.

```bash
VERBOSE=true npm run test:integration:sandbox:none
```

When using `VERBOSE=true` and `KEEP_OUTPUT=true` in the same command, the output is streamed to the console and also saved to a log file within the test's temporary directory.

The verbose output is formatted to clearly identify the source of the logs:

```
--- TEST: <log dir>:<test-name> ---
... output from the gemini command ...
--- END TEST: <log dir>:<test-name> ---
```

## Linting and formatting

To ensure code quality and consistency, the integration test files are linted as part of the main build process. You can also manually run the linter and auto-fixer.

### Running the linter

To check for linting errors, run the following command:

```bash
npm run lint
```

You can include the `:fix` flag in the command to automatically fix any fixable linting errors:

```bash
npm run lint:fix
```

## Directory structure

The integration tests create a unique directory for each test run inside the `.integration-tests` directory. Within this directory, a subdirectory is created for each test file, and within that, a subdirectory is created for each individual test case.

This structure makes it easy to locate the artifacts for a specific test run, file, or case.

```
.integration-tests/
└── <run-id>/
    └── <test-file-name>.test.js/
        └── <test-case-name>/
            ├── output.log
            └── ...other test artifacts...
```

## Continuous integration

To ensure the integration tests are always run, a GitHub Actions workflow is defined in `.github/workflows/e2e.yml`. This workflow automatically runs the integrations tests for pull requests against the `main` branch, or when a pull request is added to a merge queue.

The workflow runs the tests in different sandboxing environments to ensure Gemini CLI is tested across each:

- `sandbox:none`: Runs the tests without any sandboxing.
- `sandbox:docker`: Runs the tests in a Docker container.
- `sandbox:podman`: Runs the tests in a Podman container.
