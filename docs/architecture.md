# 架構總覽

本文件提供 Gemini CLI 架構的高階總覽。

## 核心元件

Gemini CLI 主要由兩個主要套件組成，以及一套在處理命令列輸入過程中可供系統使用的工具：

1.  **CLI 套件 (`packages/cli`)**：
    - **目的**：包含 Gemini CLI 面向使用者的部分，例如處理初始使用者輸入、呈現最終輸出，以及管理整體使用者體驗。
    - **套件包含的主要功能**：
      - [輸入處理](./cli/commands.md)
      - 歷史記錄管理
      - 顯示渲染
      - [主題和 UI 自訂](./cli/themes.md)
      - [CLI 設定](./cli/configuration.md)

2.  **核心套件 (`packages/core`)**：
    - **目的**：作為 Gemini CLI 的後端。它接收來自 `packages/cli` 的請求，協調與 Gemini API 的互動，並管理可用工具的執行。
    - **套件包含的主要功能**：
      - 與 Google Gemini API 通訊的 API 用戶端
      - 提示建構和管理
      - 工具註冊和執行邏輯
      - 對話或工作階段的狀態管理
      - 伺服器端設定

3.  **工具 (`packages/core/src/tools/`)**：
    - **目的**：這些是擴充 Gemini 模型功能的個別模組，讓它能與本機環境互動（例如，檔案系統、Shell 指令、網頁擷取）。
    - **互動**：`packages/core` 根據來自 Gemini 模型的請求調用這些工具。

## Interaction Flow

A typical interaction with the Gemini CLI follows this flow:

1.  **User input:** The user types a prompt or command into the terminal, which is managed by `packages/cli`.
2.  **Request to core:** `packages/cli` sends the user's input to `packages/core`.
3.  **Request processed:** The core package:
    - Constructs an appropriate prompt for the Gemini API, possibly including conversation history and available tool definitions.
    - Sends the prompt to the Gemini API.
4.  **Gemini API response:** The Gemini API processes the prompt and returns a response. This response might be a direct answer or a request to use one of the available tools.
5.  **Tool execution (if applicable):**
    - When the Gemini API requests a tool, the core package prepares to execute it.
    - If the requested tool can modify the file system or execute shell commands, the user is first given details of the tool and its arguments, and the user must approve the execution.
    - Read-only operations, such as reading files, might not require explicit user confirmation to proceed.
    - Once confirmed, or if confirmation is not required, the core package executes the relevant action within the relevant tool, and the result is sent back to the Gemini API by the core package.
    - The Gemini API processes the tool result and generates a final response.
6.  **Response to CLI:** The core package sends the final response back to the CLI package.
7.  **Display to user:** The CLI package formats and displays the response to the user in the terminal.

## Key Design Principles

- **Modularity:** Separating the CLI (frontend) from the Core (backend) allows for independent development and potential future extensions (e.g., different frontends for the same backend).
- **Extensibility:** The tool system is designed to be extensible, allowing new capabilities to be added.
- **User experience:** The CLI focuses on providing a rich and interactive terminal experience.
