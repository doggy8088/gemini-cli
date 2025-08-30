# 整合測試

本文件提供此專案中使用的整合測試框架的資訊。

## 總覽

整合測試旨在驗證 Gemini CLI 的端對端功能。它們在受控環境中執行建置的二進位檔，並驗證它在與檔案系統互動時的行為是否如預期。

這些測試位於 `integration-tests` 目錄中，並使用自訂測試執行器執行。

## 執行測試

整合測試不會作為預設 `npm run test` 指令的一部分執行。必須使用 `npm run test:integration:all` 腳本明確執行。

整合測試也可以使用以下快速指令執行：

```bash
npm run test:e2e
```

## 執行特定測試集

要執行測試檔案的子集，您可以使用 `npm run <integration test command> <file_name1> ....`，其中 `<integration test command>` 是 `test:e2e` 或 `test:integration*`，`<file_name>` 是 `integration-tests/` 目錄中任何的 `.test.js` 檔案。例如，以下指令執行 `list_directory.test.js` 和 `write_file.test.js`：

```bash
npm run test:e2e list_directory write_file
```

### 按名稱執行單一測試

要按名稱執行單一測試，請使用 `--test-name-pattern` 旗標：

```bash
npm run test:e2e -- --test-name-pattern "reads a file"
```

### 執行所有測試

要執行整套整合測試，請使用以下指令：

```bash
npm run test:integration:all
```

### 沙箱矩陣

`all` 指令將為 `no sandboxing`、`docker` 和 `podman` 執行測試。
每個個別類型可以使用以下指令執行：

```bash
npm run test:integration:sandbox:none
```

```bash
npm run test:integration:sandbox:docker
```

```bash
npm run test:integration:sandbox:podman
```

## 診斷

整合測試執行器提供多種診斷選項來幫助追蹤測試失敗。

### 保留測試輸出

您可以保留測試執行期間建立的暫存檔案以供檢查。這對於偵錯檔案系統操作問題很有用。

要保留測試輸出，請將 `KEEP_OUTPUT` 環境變數設定為 `true`。

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
