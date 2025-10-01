# 歡迎使用 Gemini CLI 文件

本文件為您提供完整的 Gemini CLI 安裝、使用及開發指南。這個工具讓您能夠透過命令列介面 (Command Line Interface) 與 Gemini 模型互動。

## 概覽

Gemini CLI 將 Gemini 模型的強大功能帶到您的終端機，並提供互動式的 REPL（Read-Eval-Print Loop）環境。Gemini CLI 由用戶端應用程式（`packages/cli`）組成，該應用程式會與本地伺服器（`packages/core`）溝通，而本地伺服器則負責管理對 Gemini API 及其 AI 模型的請求。Gemini CLI 也內建多種工具，協助您執行檔案系統操作、執行 shell 指令及網頁擷取等任務，這些工具由 `packages/core` 管理。

## 文件導覽

本文件分為以下幾個部分：

- **[執行與部署](./deployment.md)：** 關於如何執行 Gemini CLI 的資訊。
- **[架構概覽](./architecture.md)：** 了解 Gemini CLI 的高階設計，包括其組件及互動方式。
- **CLI 使用方式：** `packages/cli` 的相關文件。
  - **[CLI 簡介](./cli/index.md)：** 命令列介面 (Command Line Interface) 的總覽。
  - **[指令說明](./cli/commands.md)：** 可用 CLI 指令的說明。
  - **[設定方式](./cli/configuration.md)：** 有關 CLI 設定的資訊。
  - **[檢查點功能](./checkpointing.md)：** 檢查點功能的文件說明。
  - **[擴充功能](./extension.md)：** 如何為 CLI 擴充新功能。
  - **[IDE 整合](./ide-integration.md)：** 將 CLI 連接到您的編輯器。
  - **[IDE companion 擴充功能規格](./ide-companion-spec.md)：** 建立 IDE companion 擴充功能的規格說明。
  - **[遙測 (telemetry)](./telemetry.md)：** CLI 中遙測 (telemetry) 的概覽。
  - **[信任資料夾](./trusted-folders.md)：** 信任資料夾（Trusted Folders）安全功能的概覽。
- **核心細節：** `packages/core` 的相關文件。
  - **[核心簡介](./core/index.md)：** 核心組件的總覽。
  - **[工具 API](./core/tools-api.md)：** 核心如何管理及提供工具的資訊。
- **工具：**
  - **[工具概覽](./tools/index.md)：** 可用工具的總覽。
  - **[檔案系統工具](./tools/file-system.md)：** `read_file` 與 `write_file` 工具的文件說明。
  - **[多檔案讀取工具](./tools/multi-file.md)：** `read_many_files` 工具的文件說明。
  - **[Shell 工具](./tools/shell.md)：** `run_shell_command` 工具的文件說明。
  - **[網頁擷取工具](./tools/web-fetch.md)：** `web_fetch` 工具的文件說明。
  - **[網頁搜尋工具 (Web Search Tool)](./tools/web-search.md)：** `google_web_search` 工具的文件說明。
  - **[記憶工具](./tools/memory.md)：** `save_memory` 工具的文件說明。
- **[貢獻與開發指南](./CONTRIBUTING.md)：** 提供給貢獻者與開發者的資訊，包括環境設定、建置、測試與程式碼規範。
- **[NPM](./npm.md)：** 關於專案套件結構的詳細說明。
- **[疑難排解指南](./troubleshooting.md)：** 常見問題與解決方案、FAQ。
- **[服務條款與隱私權聲明](./tos-privacy.md)：** 關於您使用 Gemini CLI 所適用的服務條款與隱私權聲明。
- **[版本發佈](./releases.md)：** 專案的版本發佈與部署節奏相關資訊。

我們希望這份文件能幫助您充分發揮 Gemini CLI 的效能！
