# 疑難排解指南

本指南提供常見問題的解決方案與除錯技巧，涵蓋以下主題：

- 驗證或登入錯誤
- 常見問答 (FAQs)
- 除錯技巧
- 與你遇到的問題類似的現有 GitHub Issues，或建立新的 Issue

## 驗證或登入錯誤

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 擁有 Google Workspace 帳戶或與 Gmail 帳戶關聯的 Google Cloud 帳戶的使用者，可能無法啟用 Google Code Assist 方案的免費層級。
  - 對於 Google Cloud 帳戶，你可以透過將 `GOOGLE_CLOUD_PROJECT` 設定為你的專案 ID 來變通處理。
  - 或者，你也可以從 [Google AI Studio](http://aistudio.google.com/app/apikey) 取得 Gemini API 金鑰，該服務同樣包含獨立的免費層級。

- **錯誤：`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 或 `unable to get local issuer certificate`**
  - **原因：** 你可能位於公司網路，該網路的防火牆會攔截並檢查 SSL/TLS 流量。這通常需要 Node.js 信任自訂的 root CA 憑證。
  - **解決方法：** 將 `NODE_EXTRA_CA_CERTS` 環境變數設定為你公司 root CA 憑證檔案的絕對路徑。
    - 範例：`export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

## 常見問答 (FAQs)

- **Q: 如何將 Gemini CLI 更新到最新版本？**
  - A: 如果你是透過 `npm` 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 來更新。如果你是從原始碼編譯，請先從儲存庫拉取最新變更，然後使用指令 `npm run build` 重新建置。

- **Q: Gemini CLI 的設定檔或設定檔案儲存在哪裡？**
  - A: Gemini CLI 的設定儲存在兩個 `settings.json` 檔案中：
    1. 你的家目錄下：`~/.gemini/settings.json`。
    2. 你的專案根目錄下：`./.gemini/settings.json`。

    詳細資訊請參考 [Gemini CLI 設定](./cli/configuration.md)。

- **Q: 為什麼在我的統計輸出中看不到快取的 token 計數？**
  - A: 只有在使用快取 token 時，才會顯示快取 token 資訊。此功能僅適用於 API 金鑰使用者（Gemini API 金鑰或 Google Cloud Vertex AI），不適用於 OAuth 使用者（例如 Google 個人/企業帳戶，如 Google Gmail 或 Google Workspace）。這是因為 Gemini Code Assist API 不支援快取內容建立。你仍然可以使用 Gemini CLI 的 `/stats` 指令查看你的總 token 使用量。

## 常見錯誤訊息與解決方案

- **錯誤：`EADDRINUSE`（位址已被使用）在啟動 MCP 伺服器時出現。**
  - **原因：** 另一個程序已經佔用了 MCP 伺服器嘗試綁定的埠口。
  - **解決方法：**
    停止正在使用該埠口的其他程序，或將 MCP 伺服器設定為使用不同的埠口。

- **錯誤：找不到指令（嘗試使用 `gemini` 執行 Gemini CLI 時）。**
  - **原因：** Gemini CLI 未正確安裝，或未被加入系統的 `PATH`。
  - **解決方法：**
    更新方式取決於你安裝 Gemini CLI 的方式：
    - 如果你是全域安裝 `gemini`，請確認你的 `npm` 全域執行檔目錄已加入 `PATH`。你可以使用指令 `npm install -g @google/gemini-cli@latest` 來更新 Gemini CLI。
    - 如果你是從原始碼執行 `gemini`，請確保你使用正確的指令來啟動（例如 `node packages/cli/dist/index.js ...`）。如需更新 Gemini CLI，請從儲存庫拉取最新變更，然後使用指令 `npm run build` 重新建置。

- **錯誤：`MODULE_NOT_FOUND` 或匯入錯誤。**
  - **原因：** 相依套件未正確安裝，或專案尚未建置。
  - **解決方法：**
    1. 執行 `npm install` 以確保所有相依套件都已安裝。
    2. 執行 `npm run build` 來編譯專案。
    3. 使用 `npm run start` 確認建置是否成功完成。

- **錯誤："Operation not permitted"、"Permission denied" 或類似訊息。**
  - **原因：** 啟用沙箱機制時，Gemini CLI 可能會嘗試執行被你的沙箱設定限制的操作，例如寫入專案目錄或系統暫存目錄以外的位置。
  - **解決方法：** 請參考 [設定：沙箱機制](./cli/configuration.md#sandboxing) 文件，瞭解更多資訊，包括如何自訂你的沙箱設定。

- **Gemini CLI 在 "CI" 環境中未以互動模式運行**
  - **問題：** 如果設定了以 `CI_` 開頭的環境變數（例如 `CI_TOKEN`），Gemini CLI 不會進入互動模式（不會出現提示字元）。這是因為底層 UI 框架所使用的 `is-in-ci` 套件會偵測這些變數，並假設處於非互動的 CI 環境。
  - **原因：** `is-in-ci` 套件會檢查 `CI`、`CONTINUOUS_INTEGRATION` 或任何以 `CI_` 為前綴的環境變數是否存在。只要偵測到這些變數，就會判斷環境為非互動，導致 Gemini CLI 無法啟動互動模式。
  - **解決方法：** 如果 CLI 運作時不需要該 `CI_` 前綴的變數，可以在執行指令時暫時取消設定。例如：`env -u CI_TOKEN gemini`

- **DEBUG 模式無法從專案 .env 檔案啟用**
  - **問題：** 在專案的 `.env` 檔案中設定 `DEBUG=true`，無法啟用 gemini-cli 的 debug 模式。
  - **原因：** `DEBUG` 和 `DEBUG_MODE` 這兩個變數會自動從專案 `.env` 檔案中排除，以避免干擾 gemini-cli 的行為。
  - **解決方法：** 請改用 `.gemini/.env` 檔案，或在你的 `settings.json` 中調整 `advanced.excludedEnvVars` 設定，以減少排除的變數。

## 結束代碼 (Exit Codes)

Gemini CLI 會使用特定的結束代碼來表示終止原因。這對於腳本與自動化特別有用。

| 結束代碼 | 錯誤類型                 | 說明                                                                                         |
| -------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| 41       | `FatalAuthenticationError` | 驗證過程中發生錯誤。                                                |
| 42       | `FatalInputError`          | 提供給 CLI 的輸入無效或缺失。（僅限非互動模式）                       |
| 44       | `FatalSandboxError`        | 沙箱機制環境（例如 Docker、Podman 或 Seatbelt）發生錯誤。              |
| 52       | `FatalConfigError`         | 設定檔（`settings.json`）無效或包含錯誤。                               |
| 53       | `FatalTurnLimitedError`    | 已達到該工作階段的最大對話輪次。（僅限非互動模式） |

## 除錯技巧

- **CLI 除錯：**
  - 使用 CLI 指令時加上 `--verbose` 旗標（如有提供），以獲得更詳細的輸出。
  - 檢查 CLI 日誌，通常位於使用者專屬的設定或快取目錄中。

- **核心除錯：**
  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 如可設定，請提高日誌詳細程度。
  - 若需逐步執行伺服器端程式碼，可使用 Node.js 除錯工具（例如 `node --inspect`）。

- **工具問題：**
  - 若特定工具失敗，請嘗試以最簡單的指令或操作來隔離問題。
  - 對於 `run_shell_command`，請先在你的 shell 直接測試該指令是否可用。
  - 對於 _檔案系統工具_，請確認路徑正確並檢查權限。

- **預先檢查：**
  - 在提交程式碼前，務必執行 `npm run preflight`。這能捕捉許多常見的格式、lint 及型別錯誤。

## 查找與你類似的現有 GitHub Issues 或建立新 Issue

如果你遇到的問題未在本 _疑難排解指南_ 中涵蓋，建議先到 Gemini CLI 的 [GitHub Issue 追蹤器](https://github.com/google-gemini/gemini-cli/issues) 搜尋。若找不到類似的問題，請考慮建立新的 GitHub Issue 並詳細描述你的狀況。歡迎提交 Pull Request！
