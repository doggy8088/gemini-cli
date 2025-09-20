# Gemini CLI 工具

Gemini CLI 包含內建工具，讓 Gemini 模型能與你的本地環境互動、存取資訊並執行動作。這些工具增強了命令列介面 (Command Line Interface, CLI) 的能力，使其不僅限於文字生成，還能協助完成各種任務。

## Gemini CLI 工具總覽

在 Gemini CLI 的架構中，工具是 Gemini 模型可請求執行的特定功能或模組。例如，當你要求 Gemini「摘要 `my_document.txt` 的內容」時，模型通常會判斷需要讀取該檔案，並請求執行 `read_file` 工具。

核心元件（`packages/core`）負責管理這些工具，將其定義（schema）提供給 Gemini 模型，並在收到請求時執行工具，然後將結果回傳給模型，進一步產生面向使用者的回應。

這些工具提供下列能力：

- **存取本地資訊：** 工具讓 Gemini 能存取你的本地檔案系統、讀取檔案內容、列出目錄等。
- **執行指令：** 透過像是 `run_shell_command` 這類工具，Gemini 可以執行 shell 指令（具備適當的安全機制與使用者確認）。
- **與網路互動：** 工具可從 URL 擷取內容。
- **執行動作：** 工具可修改檔案、寫入新檔案，或在你的系統上執行其他操作（同樣通常具備安全防護）。
- **回應落地：** 透過工具取得即時或特定本地資料，Gemini 的回應能更精確、相關，並根據你的實際情境產生。

## 如何使用 Gemini CLI 工具

要使用 Gemini CLI 工具，只需向 Gemini CLI 輸入提示。流程如下：

1. 你向 Gemini CLI 輸入提示。
2. CLI 將提示傳送至核心。
3. 核心會連同你的提示與對話歷史，將可用工具及其描述/schema 一併傳送至 Gemini API。
4. Gemini 模型分析你的請求。如果判斷需要使用工具，其回應會包含執行特定工具及參數的請求。
5. 核心收到工具請求後進行驗證，並（對於敏感操作通常會先徵求使用者確認）執行該工具。
6. 工具的輸出結果會回傳給 Gemini 模型。
7. Gemini 模型利用工具的輸出產生最終答案，經由核心回傳 CLI 並顯示給你。

你通常會在 CLI 中看到工具被呼叫及其成功或失敗的相關訊息。

## 安全性與操作確認

許多工具，特別是那些可以修改檔案系統或執行指令（如 `write_file`、`edit`、`run_shell_command`），都以安全為設計重點。Gemini CLI 通常會：

- **要求確認：** 在執行潛在敏感操作前，會提示你確認，並顯示即將執行的動作內容。
- **採用沙箱機制：** 所有工具都受到沙箱機制（sandboxing）限制（詳見 [Sandboxing in the Gemini CLI](../sandbox.md)）。這表示當你在沙箱環境下操作時，任何你想使用的工具（包括 MCP 伺服器）都必須在沙箱環境內可用。例如，若要透過 `npx` 執行 MCP 伺服器，`npx` 執行檔必須安裝在沙箱的 Docker 映像中，或在 `sandbox-exec` 環境中可用。

在允許工具繼續執行前，請務必仔細檢查每個確認提示。

## 進一步了解 Gemini CLI 的工具

Gemini CLI 內建工具大致可分為以下幾類：

- **[檔案系統工具](./file-system.md)：** 用於與檔案和目錄互動（讀取、寫入、列出、搜尋等）。
- **[Shell 工具](./shell.md)（`run_shell_command`）：** 用於執行 shell 指令。
- **[網頁擷取工具](./web-fetch.md)（`web_fetch`）：** 用於從 URL 擷取內容。
- **[網頁搜尋工具 (Web Search Tool)](./web-search.md)（`web_search`）：** 用於網頁搜尋。
- **[多檔案讀取工具](./multi-file.md)（`read_many_files`）：** 專為從多個檔案或目錄讀取內容而設計，常由 `@` 指令呼叫。
- **[記憶工具](./memory.md)（`save_memory`）：** 用於跨工作階段儲存與回憶資訊。

此外，這些工具還包含：

- **[MCP 伺服器 (MCP servers)](./mcp-server.md)：** MCP 伺服器作為 Gemini 模型與你的本地環境或其他服務（如 API）之間的橋樑。
- **[沙箱機制 (Sandboxing)](../sandbox.md)：** 沙箱機制將模型及其變更與你的環境隔離，以降低潛在風險。
