# 疑難排解指南

本指南提供常見問題的解決方案與偵錯技巧。

## 認證

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 使用 Google Workspace 帳號的使用者，或使用與其 Gmail 帳號關聯的 Google Cloud 帳號的使用者，可能無法啟用 Google Code Assist 方案的免費層級。
  - 對於 Google Cloud 帳號，您可以透過將 `GOOGLE_CLOUD_PROJECT` 設定為您的專案 ID 來解決此問題。
  - 您也可以從 [AI Studio](http://aistudio.google.com/app/apikey) 取得 API 金鑰，其中也包含一個獨立的免費層級。

## 常見問題 (FAQs)

- **問：如何將 Gemini CLI 更新至最新版本？**
  - 答：如果透過 npm 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 更新 Gemini CLI。如果從原始碼執行，請從儲存庫拉取最新變更，並使用 `npm run build` 重新建構。

- **問：Gemini CLI 的設定檔儲存在哪裡？**
  - 答：CLI 設定儲存在兩個 `settings.json` 檔案中：一個在您的家目錄，另一個在您專案的根目錄。在這兩個位置，`settings.json` 都位於 `.gemini/` 資料夾中。更多詳情請參閱 [CLI 設定](./cli/configuration.md)。

- **問：為什麼我在統計資料輸出中看不到快取 token 的計數？**
  - 答：快取的 token 資訊僅在使用快取 token 時才會顯示。此功能目前適用於 API 金鑰使用者（Gemini API 金鑰或 Vertex AI），但不適用於 OAuth 使用者（Google 個人/企業帳號），因為 Code Assist API 不支援建立快取內容。您仍然可以使用 `/stats` 指令查看您的總 token 使用量。

## 常見錯誤訊息與解決方案

- **錯誤：啟動 MCP 伺服器時出現 `EADDRINUSE` (Address already in use)。**
  - **原因：** 另一個處理程序已在使用 MCP 伺服器嘗試綁定的連接埠。
  - **解決方案：**
    停止使用該連接埠的另一個處理程序，或將 MCP 伺服器設定為使用不同的連接埠。

- **錯誤：指令找不到 (嘗試執行 Gemini CLI 時)。**
  - **原因：** Gemini CLI 未正確安裝或未在您系統的 PATH 中。
  - **解決方案：**
    1.  確保 Gemini CLI 安裝成功。
    2.  如果為全域安裝，請檢查您的 npm 全域二進位目錄是否在您的 PATH 中。
    3.  如果從原始碼執行，請確保您使用正確的指令來呼叫它（例如 `node packages/cli/dist/index.js ...`）。

- **錯誤：`MODULE_NOT_FOUND` 或匯入錯誤。**
  - **原因：** 相依套件未正確安裝，或專案尚未建構。
  - **解決方案：**
    1.  執行 `npm install` 以確保所有相依套件都存在。
    2.  執行 `npm run build` 以編譯專案。

- **錯誤：「Operation not permitted」、「Permission denied」或類似錯誤。**
  - **原因：** 如果啟用沙箱，應用程式很可能嘗試執行受沙箱限制的操作，例如寫入專案目錄或系統暫存目錄之外的位置。
  - **解決方案：** 參閱 [沙箱](./cli/configuration.md#sandboxing) 以取得更多資訊，包括如何自訂您的沙箱設定。

- **CLI 在「CI」環境中不具互動性**
  - **問題：** 如果設定了以 `CI_` 開頭的環境變數（例如 `CI_TOKEN`），CLI 將不會進入互動模式（不會出現提示符號）。這是因為底層 UI 框架使用的 `is-in-ci` 套件會偵測這些變數，並假設為非互動式的 CI 環境。
  - **原因：** `is-in-ci` 套件會檢查是否存在 `CI`、`CONTINUOUS_INTEGRATION` 或任何以 `CI_` 為前綴的環境變數。當找到任何這些變數時，它會發出信號表示環境為非互動式，這會阻止 CLI 以其互動模式啟動。
  - **解決方案：** 如果 CLI 運作不需要以 `CI_` 為前綴的變數，您可以暫時為該指令取消設定它。例如：`env -u CI_TOKEN gemini`

## 偵錯技巧

- **CLI 偵錯：**
  - 搭配 CLI 指令使用 `--verbose` 旗標（如果可用）以取得更詳細的輸出。
  - 檢查 CLI 記錄檔，通常位於使用者特定的設定或快取目錄中。

- **核心偵錯：**
  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 如果可設定，請增加記錄的詳細程度。
  - 如果您需要逐步執行伺服器端程式碼，請使用 Node.js 偵錯工具（例如 `node --inspect`）。

- **工具問題：**
  - 如果特定工具失敗，請嘗試透過執行該工具所執行指令或操作的最簡單版本來隔離問題。
  - 對於 `run_shell_command`，請先檢查該指令是否能直接在您的 shell 中運作。
  - 對於檔案系統工具，請再次檢查路徑和權限。

- **飛行前檢查：**
  - 在提交程式碼之前，請務必執行 `npm run preflight`。這可以捕捉到許多與格式化、程式碼風格檢查和類型錯誤相關的常見問題。

如果您遇到此處未涵蓋的問題，請考慮在 GitHub 上搜尋專案的問題追蹤器，或回報一個包含詳細資訊的新問題。
