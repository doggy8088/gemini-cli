# 疑難排解指南

本指南提供常見問題的解決方案和偵錯技巧，包括以下主題：

- 驗證或登入錯誤
- 常見問題 (FAQ)
- 偵錯技巧
- 與您的問題類似的現有 GitHub 問題或建立新問題

## 驗證或登入錯誤

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 擁有 Google Workspace 帳戶或與其 Gmail 帳戶相關聯的 Google Cloud 帳戶的使用者可能無法啟用 Google Code Assist 計畫的免費層級。
  - 對於 Google Cloud 帳戶，您可以透過將 `GOOGLE_CLOUD_PROJECT` 設定為您的專案 ID 來解決此問題。
  - 或者，您可以從 [Google AI Studio](http://aistudio.google.com/app/apikey) 取得 Gemini API 金鑰，它也包含單獨的免費層級。

- **錯誤：`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 或 `unable to get local issuer certificate`**
  - **原因**：您可能位於使用防火牆攔截和檢查 SSL/TLS 流量的企業網路上。這通常需要 Node.js 信任自訂根 CA 憑證。
  - **解決方案**：將 `NODE_EXTRA_CA_CERTS` 環境變數設定為您企業根 CA 憑證檔案的絕對路徑。
    - 範例：`export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

## 常見問題 (FAQ)

- **問：如何將 Gemini CLI 更新到最新版本？**
  - 答：如果您透過 `npm` 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 更新。如果您從原始碼編譯，請從儲存庫提取最新變更，然後使用指令 `npm run build` 重新建置。

- **問：Gemini CLI 設定或設定檔案儲存在哪裡？**
  - 答：Gemini CLI 設定儲存在兩個 `settings.json` 檔案中：
    1. 在您的主目錄：`~/.gemini/settings.json`。
    2. 在您專案的根目錄：`./.gemini/settings.json`。

    請參閱 [Gemini CLI 設定](./cli/configuration.md) 以取得更多詳細資訊。

- **問：為什麼我在統計輸出中看不到快取的權杖計數？**
  - 答：只有在使用快取權杖時才會顯示快取權杖資訊。此功能適用於 API 金鑰使用者（Gemini API 金鑰或 Google Cloud Vertex AI），但不適用於 OAuth 使用者（例如 Google 個人/企業帳戶，如 Google Gmail 或 Google Workspace）。這是因為 Gemini Code Assist API 不支援快取內容建立。您仍然可以使用 Gemini CLI 中的 `/stats` 指令查看您的總權杖使用量。

## 常見錯誤訊息與解決方案

- **錯誤：`EADDRINUSE`（位址已被使用）在啟動 MCP 伺服器時。**
  - **原因：** 另一個程序正在使用 MCP 伺服器嘗試綁定的連接埠。
  - **解決方案：**
    停止使用該連接埠的其他程序，或設定 MCP 伺服器使用不同的連接埠。

- **錯誤：找不到指令（嘗試使用 `gemini` 執行 Gemini CLI 時）。**
  - **原因：** Gemini CLI 未正確安裝或不在您系統的 `PATH` 中。
  - **解決方案：**
    更新方式取決於您如何安裝 Gemini CLI：
    - 如果您全域安裝了 `gemini`，請檢查您的 `npm` 全域二進位檔案目錄是否在您的 `PATH` 中。您可以使用指令 `npm install -g @google/gemini-cli@latest` 更新 Gemini CLI。
    - 如果您從原始碼執行 `gemini`，請確保您使用正確的指令來叫用它（例如 `node packages/cli/dist/index.js ...`）。要更新 Gemini CLI，請從儲存庫拉取最新變更，然後使用指令 `npm run build` 重新建置。

- **錯誤：`MODULE_NOT_FOUND` 或匯入錯誤。**
  - **原因：** 相依性未正確安裝，或專案尚未建置。
  - **解決方案：**
    1.  執行 `npm install` 以確保所有相依性都存在。
    2.  執行 `npm run build` 來編譯專案。
    3.  使用 `npm run start` 驗證建置是否成功完成。

- **錯誤：「不允許操作」、「權限被拒絕」或類似錯誤。**
  - **原因：** 啟用沙箱化時，Gemini CLI 可能嘗試進行被您的沙箱設定限制的操作，例如在專案目錄或系統暫存目錄之外寫入檔案。
  - **解決方案：** 請參考 [設定：沙箱化](./cli/configuration.md#sandboxing) 文件以取得更多資訊，包括如何自訂您的沙箱設定。

- **Gemini CLI 在「CI」環境中未以互動模式執行**
  - **問題：** 如果設定了以 `CI_` 開頭的環境變數（例如 `CI_TOKEN`），Gemini CLI 不會進入互動模式（不會出現提示）。這是因為底層 UI 框架使用的 `is-in-ci` 套件會偵測這些變數並假設是非互動式 CI 環境。
  - **原因：** `is-in-ci` 套件會檢查是否存在 `CI`、`CONTINUOUS_INTEGRATION` 或任何具有 `CI_` 前綴的環境變數。當找到任何這些變數時，它會表示環境是非互動式的，這會阻止 Gemini CLI 以互動模式啟動。
  - **解決方案：** 如果 CLI 運作不需要 `CI_` 前綴變數，您可以暫時為該指令取消設定它。例如：`env -u CI_TOKEN gemini`

- **DEBUG 模式無法從專案 .env 檔案運作**
  - **問題：** 在專案的 `.env` 檔案中設定 `DEBUG=true` 無法啟用 gemini-cli 的偵錯模式。
  - **原因：** `DEBUG` 和 `DEBUG_MODE` 變數會自動從專案 `.env` 檔案中排除，以防止干擾 gemini-cli 行為。
  - **解決方案：** 改用 `.gemini/.env` 檔案，或在您的 `settings.json` 中設定 `advanced.excludedEnvVars` 設定以排除較少的變數。

## 退出代碼

Gemini CLI 使用特定的退出代碼來指示終止的原因。這對於腳本編寫和自動化特別有用。

| 退出代碼 | 錯誤類型                   | 描述                                                                                               |
| -------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| 41       | `FatalAuthenticationError` | 驗證過程中發生錯誤。                                                                               |
| 42       | `FatalInputError`          | 提供給 CLI 的輸入無效或缺失。（僅限非互動模式）                                                     |
| 44       | `FatalSandboxError`        | 沙箱環境發生錯誤（例如 Docker、Podman 或 Seatbelt）。                                              |
| 52       | `FatalConfigError`         | 設定檔案（`settings.json`）無效或包含錯誤。                                                        |
| 53       | `FatalTurnLimitedError`    | 已達到工作階段的最大對話輪數。（僅限非互動模式）                                                    |

## 偵錯技巧

- **CLI 偵錯：**
  - 在 CLI 指令中使用 `--verbose` 旗標（如果可用）以獲得更詳細的輸出。
  - 檢查 CLI 日誌，通常位於使用者特定的設定或快取目錄中。

- **核心偵錯：**
  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 如果可設定，增加日誌詳細程度。
  - 如果您需要逐步執行伺服器端程式碼，請使用 Node.js 偵錯工具（例如 `node --inspect`）。

- **工具問題：**
  - 如果特定工具失敗，請嘗試執行該工具執行的指令或操作的最簡單版本來隔離問題。
  - 對於 `run_shell_command`，請先檢查指令是否直接在您的 Shell 中運作。
  - 對於檔案系統工具，請驗證路徑是否正確並檢查權限。

- **預檢檢查：**
  - 在提交程式碼之前，請務必執行 `npm run preflight`。這可以捕捉許多與格式化、Lint 檢查和類型錯誤相關的常見問題。

## 與您的問題類似的現有 GitHub 問題或建立新問題

如果您遇到本疑難排解指南未涵蓋的問題，請考慮搜尋 Gemini CLI [GitHub 問題追蹤器](https://github.com/google-gemini/gemini-cli/issues)。如果您找不到類似的問題，請考慮建立新的 GitHub 問題並提供詳細描述。我們也歡迎拉取請求！
