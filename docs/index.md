# 歡迎使用 Gemini CLI 使用手冊

本文件提供安裝、使用及開發 Gemini CLI 的完整指南。此工具讓您能透過命令列介面與 Gemini 模型互動。

## 總覽

Gemini CLI 將 Gemini 模型的功能帶到您的終端機，並提供一個互動式的 Read-Eval-Print Loop (REPL) 環境。Gemini CLI 由一個客戶端應用程式 (`packages/cli`) 組成，該程式與一個本地伺服器 (`packages/core`) 通訊，而後者則負責管理對 Gemini API 及其 AI 模型的請求。Gemini CLI 也包含多種工具，可用於執行檔案系統操作、執行 shell、以及擷取網頁等任務，這些工具由 `packages/core` 管理。

## 文件導覽

本文件分為以下幾個部分：

- **[執行與部署](./deployment.md):** 執行 Gemini CLI 的相關資訊。
- **[架構總覽](./architecture.md):** 瞭解 Gemini CLI 的高階設計，包含其元件以及它們如何互動。
- **CLI 用法：** `packages/cli` 的文件。
  - **[CLI 簡介](./cli/index.md):** 命令列介面總覽。
  - **[指令](./cli/commands.md):** 可用 CLI 指令的說明。
  - **[設定](./cli/configuration.md):** 設定 CLI 的相關資訊。
  - **[檢查點](./checkpointing.md):** 檢查點功能的文件。
  - **[擴充功能](./extension.md):** 如何為 CLI 擴充新功能。
  - **[遙測](./telemetry.md):** CLI 中的遙測總覽。
- **核心詳情：** `packages/core` 的文件。
  - **[核心簡介](./core/index.md):** 核心元件總覽。
  - **[工具 API](./core/tools-api.md):** 關於核心如何管理及公開工具的資訊。
- **工具：**
  - **[工具總覽](./tools/index.md):** 可用工具總覽。
  - **[檔案系統工具](./tools/file-system.md):** `read_file` 與 `write_file` 工具的文件。
  - **[多檔案讀取工具](./tools/multi-file.md):** `read_many_files` 工具的文件。
  - **[Shell 工具](./tools/shell.md):** `run_shell_command` 工具的文件。
  - **[網頁擷取工具](./tools/web-fetch.md):** `web_fetch` 工具的文件。
  - **[網路搜尋工具](./tools/web-search.md):** `google_web_search` 工具的文件。
  - **[記憶工具](./tools/memory.md):** `save_memory` 工具的文件。
- **[貢獻與開發指南](./CONTRIBUTING.md):** 提供給貢獻者與開發者的資訊，包含設定、建構、測試與程式設計慣例。
- **[疑難排解指南](./troubleshooting.md):** 尋找常見問題與 FAQ 的解決方案。
- **[服務條款與隱私權聲明](./tos-privacy.md):** 適用於您使用 Gemini CLI 的服務條款與隱私權聲明資訊。

我們希望這份文件能幫助您充分利用 Gemini CLI！