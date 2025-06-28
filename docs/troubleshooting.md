# 故障排除指南

本指南提供常見問題的解決方案與除錯技巧。

## 認證

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**

  - 擁有 Google Workspace 帳戶的使用者，或其 Gmail 帳戶已關聯 Google Cloud 帳戶的使用者，可能無法啟用 Google Code Assist 方案的免費層級。
  - 對於 Google Cloud 帳戶，您可以透過設定
    `GOOGLE_CLOUD_PROJECT` 為您的專案 ID 來解決此問題。
  - 您也可以從 [AI Studio](http://aistudio.google.com/app/apikey) 取得 API 金鑰，該金鑰也包含一個獨立的免費層級。

## 常見問題 (FAQs)

- **問：如何將 Gemini CLI 更新至最新版本？**

  - 答：若透過 npm 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 更新 Gemini CLI。若從原始碼執行，請從儲存庫拉取最新變更，並使用 `npm run build` 重新建構。

- **問：Gemini CLI 的設定檔儲存在哪裡？**

  - 答：CLI 設定儲存在兩個 `settings.json` 檔案中：一個位於您的家目錄，另一個位於您專案的根目錄。在這兩個位置，`settings.json` 都位於 `.gemini/` 資料夾內。更多詳細資訊請參考 [CLI 設定](./cli/configuration.md)。

- **問：為什麼我在統計資料輸出中看不到快取權杖的數量？**

  - 答：快取權杖的資訊只有在使用快取權杖時才會顯示。此功能目前適用於 API 金鑰使用者 (Gemini API 金鑰或 Vertex AI)，但不適用於 OAuth 使用者 (Google 個人/企業帳戶)，因為 Code Assist API 不支援快取內容的建立。您仍然可以使用 `/stats` 指令查看您的總權杖用量。

## 常見錯誤訊息與解決方案

- **錯誤：啟動 MCP 伺服器時出現 `EADDRINUSE` (Address already in use)。**

  - **原因：** 有另一個程序已在使用 MCP 伺服器嘗試綁定的連接埠。
  - **解決方案：**
    停止正在使用該連接埠的其他程序，或將 MCP 伺服器設定為使用不同的連接埠。

- **錯誤：找不到指令 (嘗試執行 Gemini CLI 時)。**

  - **原因：** Gemini CLI 未正確安裝或未在您系統的 PATH 中。
  - **解決方案：**
    1.  確保 Gemini CLI 安裝成功。
    2.  若為全域安裝，請檢查您的 npm 全域二進位檔目錄是否在您的 PATH 中。
    3.  若從原始碼執行，請確保您使用正確的指令來呼叫它 (例如 `node packages/cli/dist/index.js ...`)。

- **錯誤：`MODULE_NOT_FOUND` 或匯入錯誤。**

  - **原因：** 相依套件未正確安裝，或專案尚未建構。
  - **解決方案：**
    1.  執行 `npm install` 以確保所有相依套件都已存在。
    2.  執行 `npm run build` 來編譯專案。

- **錯誤：「Operation not permitted」、「Permission denied」或類似錯誤。**

  - **原因：** 如果啟用了沙箱模式，應用程式很可能正在嘗試執行受沙箱限制的操作，例如寫入專案目錄或系統暫存目錄之外的位置。
  - **解決方案：** 關於更多資訊，包括如何自訂您的沙箱設定，請參閱 [沙箱模式](./cli/configuration.md#sandboxing)。

## 除錯技巧

- **CLI 除錯：**

  - 使用 CLI 指令的 `--verbose` 旗標 (如果可用) 以取得更詳細的輸出。
  - 檢查 CLI 日誌，通常位於使用者特定的設定或快取目錄中。

- **核心除錯：**

  - 檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。
  - 如果可設定，請提高日誌的詳細程度。
  - 如果需要逐步執行伺服器端程式碼，請使用 Node.js 除錯工具 (例如 `node --inspect`)。

- **工具問題：**

  - 如果某個特定工具失敗，請嘗試執行該工具最簡單版本的指令或操作，以隔離問題。
  - 對於 `run_shell_command`，請先檢查該指令是否能直接在您的 shell 中運作。
  - 對於檔案系統工具，請再次檢查路徑和權限。

- **飛行前檢查：**
  - 在提交程式碼之前，務必執行 `npm run preflight`。這可以捕捉到許多與格式化、程式碼風格檢查和類型錯誤相關的常見問題。

如果您遇到此處未涵蓋的問題，請考慮在 GitHub 上搜尋專案的問題追蹤器，或回報一個包含詳細資訊的新問題。
