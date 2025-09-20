# 整合測試

本文檔說明本專案所使用的整合測試框架。

## 概述

整合測試旨在驗證 Gemini CLI 的端對端功能。這些測試會在受控環境中執行已建置的二進位檔，並驗證其在與檔案系統互動時，是否如預期般運作。

這些測試位於 `integration-tests` 目錄中，並透過自訂的測試執行器來執行。

## 執行測試

整合測試不會作為預設的 `npm run test` 指令的一部分執行。必須透過明確執行 `npm run test:integration:all` 腳本來執行這些測試。

也可以使用以下捷徑來執行整合測試：

```bash
npm run test:e2e
```

## 執行特定的一組測試

若要執行部分測試檔案，您可以使用 `npm run <integration test command> <file_name1> ....`，其中 &lt;integration test command&gt; 可以是 `test:e2e` 或 `test:integration*`，而 `<file_name>` 則是 `integration-tests/` 目錄下任何 `.test.js` 檔案。例如，以下指令會執行 `list_directory.test.js` 和 `write_file.test.js`：

```bash
npm run test:e2e list_directory write_file
```

### 依名稱執行單一測試

若要依測試名稱執行單一測試，請使用 `--test-name-pattern` 旗標：

```bash
npm run test:e2e -- --test-name-pattern "reads a file"
```

### 執行所有測試

若要執行完整的整合測試套件，請使用以下指令：

```bash
npm run test:integration:all
```

### Sandbox 矩陣

`all` 指令將會針對 `no sandboxing`、`docker` 和 `podman` 執行測試。
每一種測試類型都可以使用以下指令單獨執行：

```bash
npm run test:integration:sandbox:none
```

（原文內容為空，無需翻譯。）
```bash
npm run test:integration:sandbox:docker
```

請提供原文、初始譯文、品質分析與改進建議，這樣我才能根據品質分析意見改進翻譯。
```bash
npm run test:integration:sandbox:podman
```

## 診斷

整合測試執行器（integration test runner）提供多種診斷選項，以協助追蹤測試失敗的原因。

### 保留測試輸出

你可以保留測試執行期間所產生的暫存檔案，以便進行檢查。這對於除錯檔案系統操作相關問題非常有用。

若要保留測試輸出，請將 `KEEP_OUTPUT` 環境變數設為 `true`。

```bash
KEEP_OUTPUT=true npm run test:integration:sandbox:none
```

當輸出被保留時，測試執行器會列印本次測試執行所使用的唯一目錄路徑。

### 詳細輸出

若需更詳細的除錯資訊，請將 `VERBOSE` 環境變數設為 `true`。

```bash
VERBOSE=true npm run test:integration:sandbox:none
```

當在同一個命令中同時使用 `VERBOSE=true` 和 `KEEP_OUTPUT=true` 時，輸出內容會同時串流到主控台，並且儲存到該測試暫存目錄中的日誌檔案。

詳細輸出會經過格式化，以清楚標示日誌來源：

```
--- TEST: <log dir>:<test-name> ---
... output from the gemini command ...
--- END TEST: <log dir>:<test-name> ---
```

## 程式碼檢查與格式化

為了確保程式碼品質與一致性，整合測試檔案會作為主要建置流程的一部分進行程式碼檢查（linting）。你也可以手動執行程式碼檢查工具和自動修正功能。

### 執行程式碼檢查工具

若要檢查是否有程式碼檢查錯誤，請執行以下指令：

```bash
npm run lint
```

您可以在指令中加入 `:fix` 旗標，以自動修正所有可修復的程式碼檢查（linting）錯誤：

```bash
npm run lint:fix
```

## 目錄結構

整合測試會在`.integration-tests`目錄內，為每次測試執行建立一個唯一的目錄。在這個目錄下，會為每個測試檔案建立一個子目錄，而在該子目錄中，則會為每個個別的測試案例再建立一個子目錄。

這樣的結構讓你能夠輕鬆定位特定測試執行、檔案或案例所產生的產物。

```
.integration-tests/
└── <run-id>/
    └── <test-file-name>.test.js/
        └── <test-case-name>/
            ├── output.log
            └── ...other test artifacts...
```

## 持續整合

為了確保整合測試能夠持續執行，在 `.github/workflows/e2e.yml` 中定義了一個 GitHub Actions 工作流程。此工作流程會自動針對提交到 `main` 分支的 pull request，或是當 pull request 被加入合併佇列時，執行整合測試。

該工作流程會在不同的 sandboxing 環境中執行測試，以確保 Gemini CLI 能夠在各種環境下被測試：

- `sandbox:none`：在沒有任何 sandboxing 的情況下執行測試。
- `sandbox:docker`：在 Docker 容器中執行測試。
- `sandbox:podman`：在 Podman 容器中執行測試。
