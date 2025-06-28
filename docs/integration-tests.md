# 整合測試

本文件提供關於此專案所使用之整合測試框架的資訊。

## 總覽

整合測試旨在驗證 Gemini CLI 的端對端功能。它們會在受控環境中執行已建置的二進位檔，並驗證其與檔案系統互動時的行為是否符合預期。

這些測試位於 `integration-tests` 目錄中，並使用自訂的測試執行器來執行。

## 執行測試

整合測試不會作為預設 `npm run test` 指令的一部分執行。必須使用 `npm run test:integration:all` 指令碼明確地執行它們。

整合測試也可以使用以下捷徑執行：

```bash
npm run test:e2e
```

## 執行特定的測試集

若要執行一部分的測試檔案，您可以使用 `npm run &lt;integration test command&gt; &lt;file_name1&gt; ....`，其中 `&lt;integration test command&gt;` 是 `test:e2e` 或 `test:integration*`，而 `&lt;file_name&gt;` 是 `integration-tests/` 目錄中的任何 `.test.js` 檔案。例如，以下指令會執行 `list_directory.test.js` 和 `write_file.test.js`：

```bash
npm run test:e2e list_directory write_file
```

### 按名稱執行單一測試

若要按名稱執行單一測試，請使用 `--test-name-pattern` 旗標：

```bash
npm run test:e2e -- --test-name-pattern "reads a file"
```

### 執行所有測試

若要執行整套整合測試，請使用以下指令：

```bash
npm run test:integration:all
```

### 沙箱矩陣

`all` 指令會針對 `no sandboxing`（無沙箱）、`docker` 和 `podman` 執行測試。
可以使用以下指令執行各種類型：

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

整合測試執行器提供數個診斷選項，以協助追蹤測試失敗的原因。

### 保留測試輸出

您可以保留在測試執行期間建立的暫存檔以供檢查。這對於偵錯檔案系統操作問題很有用。

若要保留測試輸出，您可以使用 `--keep-output` 旗標，或將 `KEEP_OUTPUT` 環境變數設定為 `true`。

```bash
# 使用旗標
npm run test:integration:sandbox:none -- --keep-output

# 使用環境變數
KEEP_OUTPUT=true npm run test:integration:sandbox:none
```

保留輸出時，測試執行器將會印出該次測試執行的唯一目錄路徑。

### 詳細輸出

若需更詳細的偵錯，`--verbose` 旗標會將 `gemini` 指令的即時輸出串流至主控台。

```bash
npm run test:integration:sandbox:none -- --verbose
```

在同一個指令中同時使用 `--verbose` 和 `--keep-output` 時，輸出會串流至主控台，並儲存到測試暫存目錄中的記錄檔。

詳細輸出的格式會清楚標示記錄的來源：

```
--- TEST: &lt;file-name-without-js&gt;:&lt;test-name&gt; ---
... 來自 gemini 指令的輸出 ...
--- END TEST: &lt;file-name-without-js&gt;:&lt;test-name&gt; ---
```

## Linting 與格式化

為確保程式碼品質與一致性，整合測試檔案會作為主要建構過程的一部分進行 linting。您也可以手動執行 linter 和自動修復工具。

### 執行 linter

若要檢查 linting 錯誤，請執行以下指令：

```bash
npm run lint
```

您可以在指令中加入 `--fix` 旗標，以自動修復任何可修復的 linting 錯誤：

```bash
npm run lint --fix
```

## 目錄結構

整合測試會在 `.integration-tests` 目錄內為每次測試執行建立一個唯一的目錄。在此目錄中，會為每個測試檔案建立一個子目錄，而在該子目錄中，會為每個獨立的測試案例建立一個子目錄。

這種結構讓您能輕鬆找到特定測試執行、檔案或案例的產物。

```
.integration-tests/
└── &lt;run-id&gt;/
    └── &lt;test-file-name&gt;.test.js/

        └── &lt;test-case-name&gt;/
            ├── output.log
            └── ...其他測試產物...
```

## 持續整合

為確保整合測試總是會執行，在 `.github/workflows/e2e.yml` 中定義了一個 GitHub Actions 工作流程。此工作流程會在每次對 `main` 分支的 pull request 和 push 時自動執行整合測試。

此工作流程會在不同的沙箱環境中執行測試，以確保 Gemini CLI 在每個環境中都經過測試：

- `sandbox:none`：在沒有任何沙箱的情況下執行測試。
- `sandbox:docker`：在 Docker 容器中執行測試。
- `sandbox:podman`：在 Podman 容器中執行測試。
