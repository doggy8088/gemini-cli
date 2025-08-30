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

當保留輸出時，測試執行器會列印測試執行的唯一目錄路徑。

### 詳細輸出

如需更詳細的偵錯資訊，請將 `VERBOSE` 環境變數設定為 `true`。

```bash
VERBOSE=true npm run test:integration:sandbox:none
```

在同一指令中使用 `VERBOSE=true` 和 `KEEP_OUTPUT=true` 時，輸出會串流到主控台，同時也會儲存到測試暫存目錄中的日誌檔案。

詳細輸出格式化後會清楚識別日誌來源：

```
--- TEST: <log dir>:<test-name> ---
... output from the gemini command ...
--- END TEST: <log dir>:<test-name> ---
```

## 語法檢查和格式化

為了確保程式碼品質和一致性，整合測試檔案會作為主要建置程序的一部分進行語法檢查。您也可以手動執行語法檢查器和自動修正器。

### 執行語法檢查器

要檢查語法檢查錯誤，請執行以下指令：

```bash
npm run lint
```

您可以在指令中包含 `:fix` 旗標來自動修正任何可修正的語法檢查錯誤：

```bash
npm run lint:fix
```

## 目錄結構

整合測試會在 `.integration-tests` 目錄內為每次測試執行建立唯一的目錄。在此目錄中，會為每個測試檔案建立子目錄，並在其中為每個個別測試案例建立子目錄。

此結構讓您可以輕鬆找到特定測試執行、檔案或案例的成品。

```
.integration-tests/
└── <run-id>/
    └── <test-file-name>.test.js/
        └── <test-case-name>/
            ├── output.log
            └── ...其他測試成品...
```

## 持續整合

為了確保整合測試始終執行，在 `.github/workflows/e2e.yml` 中定義了 GitHub Actions 工作流程。此工作流程會自動為針對 `main` 分支的拉取請求，或當拉取請求新增到合併佇列時，執行整合測試。

工作流程會在不同的沙箱環境中執行測試，以確保 Gemini CLI 在每個環境中都經過測試：

- `sandbox:none`：在沒有任何沙箱的情況下執行測試。
- `sandbox:docker`：在 Docker 容器中執行測試。
- `sandbox:podman`：在 Podman 容器中執行測試。
