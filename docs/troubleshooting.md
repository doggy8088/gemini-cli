# 疑難排解指南

本指南提供常見問題的解決方案和偵錯技巧。

## 驗證

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 擁有 Google Workspace 帳戶的使用者，或將 Google Cloud 帳戶與其 Gmail 帳戶關聯的使用者，可能無法啟用 Google Code Assist 方案的免費層級。
  - 對於 Google Cloud 帳戶，您可以將 `GOOGLE_CLOUD_PROJECT` 設定為您的專案 ID 來解決此問題。
  - 您也可以從 [AI Studio](http://aistudio.google.com/app/apikey) 取得 API 金鑰，其中也包含一個獨立的免費層級。

## 常見問題 (FAQ)

- **問：如何將 Gemini CLI 更新至最新版本？**
  - 答：如果透過 npm 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 更新 Gemini CLI。如果從原始碼執行，請從儲存庫拉取最新變更並使用 `npm run build` 重新建置。

- **問：Gemini CLI 設定檔儲存在哪裡？**
  - 答：CLI 設定儲存在兩個 `settings.json` 檔案中：一個在您的主目錄中，另一個在您專案的根目錄中。在這兩個位置，`settings.json` 都位於 `.gemini/` 資料夾中。有關更多詳細資訊，請參閱 [CLI 設定](./cli/configuration.md)。

- **問：為什麼我在統計資料輸出中看不到快取的權杖計數？**
  - 答：快取的權杖資訊僅在使用快取權杖時顯示。此功能目前適用於 API 金鑰使用者 (Gemini API 金鑰或 Vertex AI)，但���適用於 OAuth 使用者 (Google 個人/企業帳戶)，因為 Code Assist API 不支援快取內容建立。您仍然可以使用 `/stats` 指令查看您的總權杖使用量。

## 常見錯誤訊息和解決方案

- **錯誤：啟動 MCP 伺服器時出現 `EADDRINUSE` (位址已在使用中)。**
  - **原因：** 另一個處理程序已在使用 MCP 伺服器嘗試繫結的連接埠。
  - **解決方案：** 停止使用該連接埠的其他處理程序，或將 MCP 伺服器設定為使用不同的連接埠。

- **錯誤：找不到指令 (嘗試執行 Gemini CLI 時)。**
  - **原因：** Gemini CLI 未正確安裝或不在您的系統 PATH 中。
  - **解決方案：**
    1.  確保 Gemini CLI 安裝成功。
    2.  如果是全域安裝，請檢查您的 npm 全域二進位目錄是否在您的 PATH 中。
    3.  如果從原始碼執行，請確保您使用正確的指令來叫用它 (例如 `node packages/cli/dist/index.js ...`)。

- **錯誤：`MODULE_NOT_FOUND` 或匯入錯誤。**
  - **原因：** 相依性未正確安裝，或專案尚未建置。
  - **解決方案：**
    1.  執行 `npm install` 以確保所有相依性都存在。
    2.  執行 `npm run build` 以編譯專案。

- **錯誤：「操作不允許」、「權限遭拒」或類似錯誤。**
  - **原因：** 如果啟用沙箱，應用程式可能會嘗試執行受沙箱限制的操作，例如寫入專案目錄或系統暫存目錄之外的位置。
  - **解決方案：** 有關更多資訊，包括如何自訂您的沙箱設定，請參閱 [沙箱](./cli/configuration.md#sandboxing)。

- **CLI 在「CI」環境中不是互動式的**
  - **問題：** 如果設定了以 `CI_` 開頭的環境變數 (例如 `CI_TOKEN`)，CLI 不會進入互動模式 (不會出現提示)。這是因為底層 UI 框架使用的 `is-in-ci` 套件會偵測到這些變數，並假設為非互動式的 CI 環境。
  - **原因：** `is-in-ci` 套件會檢查是否存在 `CI`、`CONTINUOUS_INTEGRATION` 或任何帶有 `CI_` 前置詞的環境變數。當找到其中任何一個時，它會發出信號，表示環境是非互動式的，這會阻止 CLI 以其互動模式啟動。
  - **解決方案：** 如果 CLI 運作不需要帶有 `CI_` 前置詞的變數，您可以暫時為該指令取消設定它。例如 `env -u CI_TOKEN gemini`

## 偵錯技巧

- **CLI 偵錯：**
  - 將 `--verbose` 旗標 (如果可用) 與 CLI 指令一起使用，以取得更詳細的輸出。
  - 檢查 CLI 記錄，通常位於使用者特定的設定或快取目錄中。

- **核心偵錯：**
  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 如果可設定，請增加記錄詳細���度。
  - 如果您需要逐步執行伺服器端程式碼，請使用 Node.js 偵錯工具 (例如 `node --inspect`)。

- **工具問題：**
  - 如果特定工具失敗，請嘗試透過執行該工具執行的指令或操作的最簡單版本來隔離問題。
  - 對於 `run_shell_command`，請先檢查該指令是否直接在您的 shell 中運作。
  - 對於檔案系統工具，請仔細檢查路徑和權限。

- **飛行前檢查：**
  - 在提交程式碼之前，請務必執行 `npm run preflight`。這可以捕捉到許多與格式化、程式碼檢查和類型錯誤相關的常見問題。

如果您遇到此處未涵蓋的問題，請考慮在 GitHub 上搜尋專案的問題追蹤器，或回報一個包含詳細資訊的新問題。
