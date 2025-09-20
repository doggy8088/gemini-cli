# 疑難排解指南

本指南提供常見問題的解決方案與除錯技巧，內容涵蓋：

- 認證或登入錯誤
- 常見問答（FAQs）
- 除錯技巧
- 與你遇到的問題類似的 GitHub Issues（GitHub 問題追蹤），或建立新的 Issue

## 認證或登入錯誤

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 使用 Google Workspace 帳戶或與 Gmail 帳戶關聯的 Google Cloud 帳戶的用戶，可能無法啟用 Google Code Assist 方案的免費層級。
  - 對於 Google Cloud 帳戶，你可以透過將 `GOOGLE_CLOUD_PROJECT` 設定為你的專案 ID 來繞過此限制。
  - 或者，你也可以從 [Google AI Studio](http://aistudio.google.com/app/apikey) 取得 Gemini API 金鑰，該服務同樣提供獨立的免費層級。

- **錯誤：`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 或 `unable to get local issuer certificate`**
  - **原因：** 你可能處於有防火牆攔截並檢查 SSL/TLS 流量的企業網路環境。這通常需要 Node.js 信任自訂的根 CA 憑證。
  - **解決方法：** 將 `NODE_EXTRA_CA_CERTS` 環境變數設為你的企業根 CA 憑證檔案的絕對路徑。
    - 範例：`export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

## 常見問答（FAQs）

- **問：如何將 Gemini CLI 更新到最新版本？**
  - 答：如果你是透過 `npm` 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 進行更新。如果你是從原始碼編譯，請先從儲存庫拉取最新變更，然後使用指令 `npm run build` 重新建置。

- **問：Gemini CLI 的設定或組態檔存放在哪裡？**
  - 答：Gemini CLI 的設定儲存在兩個 `settings.json` 檔案中：
    1. 你的家目錄下：`~/.gemini/settings.json`。
    2. 你的專案根目錄下：`./.gemini/settings.json`。

    詳細資訊請參考 [Gemini CLI Configuration](./cli/configuration.md)。

- **問：為什麼在統計輸出中看不到快取的 Token 計數？**
  - 答：只有在實際使用快取 Token 時，才會顯示快取的 Token 資訊。此功能僅適用於 API 金鑰用戶（Gemini API 金鑰或 Google Cloud Vertex AI），不適用於 OAuth 用戶（例如 Google 個人/企業帳戶，如 Google Gmail 或 Google Workspace）。這是因為 Gemini Code Assist API 不支援快取內容建立。你仍可使用 Gemini CLI 的 `/stats` 指令查看你的總 Token 使用量。

## 常見錯誤訊息與解決方案

- **錯誤：`EADDRINUSE`（位址已被使用）在啟動 MCP 伺服器時發生。**
  - **原因：** 另一個程序已經佔用了 MCP 伺服器嘗試綁定的埠口。
  - **解決方法：**
    停止佔用該埠口的其他程序，或將 MCP 伺服器設定為使用其他埠口。

- **錯誤：找不到指令（嘗試使用 `gemini` 執行 Gemini CLI 時）。**
  - **原因：** Gemini CLI 未正確安裝，或未加入系統的 `PATH`。
  - **解決方法：**
    更新方式取決於你安裝 Gemini CLI 的方式：
    - 如果你是全域安裝 `gemini`，請確認你的 `npm` 全域二進位目錄已加入 `PATH`。你可以使用指令 `npm install -g @google/gemini-cli@latest` 更新 Gemini CLI。
    - 如果你是從原始碼執行 `gemini`，請確保你使用正確的指令來啟動（例如 `node packages/cli/dist/index.js ...`）。要更新 Gemini CLI，請從儲存庫拉取最新變更，然後使用指令 `npm run build` 重新建置。

- **錯誤：`MODULE_NOT_FOUND` 或 import 錯誤。**
  - **原因：** 相依套件未正確安裝，或專案尚未建置。
  - **解決方法：**
    1. 執行 `npm install` 以確保所有相依套件都已安裝。
    2. 執行 `npm run build` 以編譯專案。
    3. 使用 `npm run start` 驗證建置是否成功。

- **錯誤："Operation not permitted"、"Permission denied" 或類似訊息。**
  - **原因：** 啟用 sandbox 時，Gemini CLI 可能嘗試執行被 sandbox 設定限制的操作，例如寫入專案目錄或系統暫存目錄以外的位置。
  - **解決方法：** 請參考 [Configuration: Sandboxing](./cli/configuration.md#sandboxing) 文件，瞭解如何自訂 sandbox 設定。

- **Gemini CLI 在 "CI" 環境中未以互動模式執行**
  - **問題：** 如果設定了以 `CI_` 開頭的環境變數（例如 `CI_TOKEN`），Gemini CLI 不會進入互動模式（不會出現提示字元）。這是因為底層 UI 框架所使用的 `is-in-ci` 套件會偵測這些變數，並假設處於非互動式 CI 環境。
  - **原因：** `is-in-ci` 套件會檢查是否存在 `CI`、`CONTINUOUS_INTEGRATION` 或任何帶有 `CI_` 前綴的環境變數。若偵測到其中任一，則視為非互動環境，導致 Gemini CLI 無法啟動互動模式。
  - **解決方法：** 若 CLI 運作時不需要 `CI_` 前綴的變數，可以在執行指令時暫時取消設定。例如：`env -u CI_TOKEN gemini`

- **DEBUG 模式無法從專案 .env 檔案啟用**
  - **問題：** 在專案的 `.env` 檔案中設定 `DEBUG=true`，不會啟用 gemini-cli 的除錯模式。
  - **原因：** 為避免影響 gemini-cli 行為，`DEBUG` 與 `DEBUG_MODE` 這兩個變數會自動從專案 `.env` 檔案中排除。
  - **解決方法：** 請改用 `.gemini/.env` 檔案，或在你的 `settings.json` 中調整 `advanced.excludedEnvVars` 設定，以減少排除的變數。

## 結束代碼（Exit Codes）

Gemini CLI 使用特定的結束代碼來表示終止原因。這對於腳本與自動化特別有用。

| 結束代碼 | 錯誤類型                 | 說明                                                                                         |
| -------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| 41       | `FatalAuthenticationError` | 認證過程中發生錯誤。                                                |
| 42       | `FatalInputError`          | 提供給 CLI 的輸入無效或遺漏。（僅限非互動模式）                       |
| 44       | `FatalSandboxError`        | Sandboxing 環境（如 Docker、Podman 或 Seatbelt）發生錯誤。              |
| 52       | `FatalConfigError`         | 設定檔（`settings.json`）無效或包含錯誤。                               |
| 53       | `FatalTurnLimitedError`    | 已達到本次會話的最大對話輪數。（僅限非互動模式） |

## 除錯技巧

- **CLI 除錯：**
  - 使用 CLI 指令的 `--verbose` 旗標（如有提供）以獲得更詳細的輸出。
  - 檢查 CLI 日誌，通常位於使用者專屬的設定或快取目錄中。

- **核心除錯：**
  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 若可設定，請提高日誌詳細程度。
  - 若需逐步檢查伺服器端程式碼，可使用 Node.js 除錯工具（如 `node --inspect`）。

- **工具問題：**
  - 若某個特定工具出現故障，請嘗試以最簡單的指令或操作來隔離問題。
  - 對於 `run_shell_command`，請先在你的 shell 中直接測試該指令是否可用。
  - 對於 _檔案系統工具_，請確認路徑正確並檢查權限。

- **預檢（Pre-flight）檢查：**
  - 在提交程式碼前，務必執行 `npm run preflight`。這能捕捉許多與格式、lint、型別錯誤相關的常見問題。

## 與你遇到的問題類似的 GitHub Issues（GitHub 問題追蹤）或建立新 Issue

如果你遇到的問題未在本 _疑難排解指南_ 中涵蓋，請考慮在 Gemini CLI 的 [GitHub Issue tracker](https://github.com/google-gemini/gemini-cli/issues) 搜尋。若找不到類似問題，請考慮建立新的 GitHub Issue，並提供詳細描述。我們也歡迎 Pull Request！
