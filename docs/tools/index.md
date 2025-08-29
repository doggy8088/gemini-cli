# Gemini CLI 工具

Gemini CLI 包含內建工具，供 Gemini 模型用來與您的本機環境互動、存取資訊和執行動作。這些工具增強了 CLI 的功能，使其能夠超越文字生成並協助執行各種任務。

## Gemini CLI 工具總覽

在 Gemini CLI 的情境中，工具是 Gemini 模型可以請求執行的特定函數或模組。例如，如果您要求 Gemini「摘要 `my_document.txt` 的內容」，模型很可能會識別出需要讀取該檔案，並請求執行 `read_file` 工具。

核心元件 (`packages/core`) 管理這些工具，將其定義（結構描述）呈現給 Gemini 模型，在請求時執行它們，並將結果回傳給模型，以進一步處理為面向使用者的回應。

這些工具提供以下功能：

- **存取本機資訊**：工具允許 Gemini 存取您的本機檔案系統、讀取檔案內容、列出目錄等。
- **執行指令**：透過 `run_shell_command` 等工具，Gemini 可以執行 Shell 指令（具有適當的安全措施和使用者確認）。
- **與網路互動**：工具可以從 URL 擷取內容。
- **執行動作**：工具可以修改檔案、寫入新檔案，或在您的系統上執行其他動作（同樣，通常具有安全保護措施）。
- **基礎回應**：透過使用工具擷取即時或特定本機資料，Gemini 的回應可以更準確、相關，並建立在您的實際情境上。

## 如何使用 Gemini CLI 工具

要使用 Gemini CLI 工具，請向 Gemini CLI 提供提示。流程如下：

1.  您向 Gemini CLI 提供提示。
2.  CLI 將提示傳送到核心。
3.  核心連同您的提示和對話歷史記錄，將可用工具清單及其描述/結構描述傳送到 Gemini API。
4.  Gemini 模型分析您的請求。如果它判斷需要工具，其回應將包含執行具有特定參數的特定工具的請求。
5.  核心接收此工具請求，驗證它，並（通常在敏感操作的使用者確認後）執行工具。
6.  工具的輸出被送回 Gemini 模型。
7.  Gemini 模型使用工具的輸出來制定其最終答案，然後透過核心送回 CLI 並顯示給您。

You will typically see messages in the CLI indicating when a tool is being called and whether it succeeded or failed.

## Security and confirmation

Many tools, especially those that can modify your file system or execute commands (`write_file`, `edit`, `run_shell_command`), are designed with safety in mind. The Gemini CLI will typically:

- **Require confirmation:** Prompt you before executing potentially sensitive operations, showing you what action is about to be taken.
- **Utilize sandboxing:** All tools are subject to restrictions enforced by sandboxing (see [Sandboxing in the Gemini CLI](../sandbox.md)). This means that when operating in a sandbox, any tools (including MCP servers) you wish to use must be available _inside_ the sandbox environment. For example, to run an MCP server through `npx`, the `npx` executable must be installed within the sandbox's Docker image or be available in the `sandbox-exec` environment.

It's important to always review confirmation prompts carefully before allowing a tool to proceed.

## Learn more about Gemini CLI's tools

Gemini CLI's built-in tools can be broadly categorized as follows:

- **[File System Tools](./file-system.md):** For interacting with files and directories (reading, writing, listing, searching, etc.).
- **[Shell Tool](./shell.md) (`run_shell_command`):** For executing shell commands.
- **[Web Fetch Tool](./web-fetch.md) (`web_fetch`):** For retrieving content from URLs.
- **[Web Search Tool](./web-search.md) (`web_search`):** For searching the web.
- **[Multi-File Read Tool](./multi-file.md) (`read_many_files`):** A specialized tool for reading content from multiple files or directories, often used by the `@` command.
- **[Memory Tool](./memory.md) (`save_memory`):** For saving and recalling information across sessions.

Additionally, these tools incorporate:

- **[MCP servers](./mcp-server.md)**: MCP servers act as a bridge between the Gemini model and your local environment or other services like APIs.
- **[Sandboxing](../sandbox.md)**: Sandboxing isolates the model and its changes from your environment to reduce potential risk.
