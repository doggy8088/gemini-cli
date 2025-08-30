# 核心：工具 API

Gemini CLI 核心（`packages/core`）具有強健的工具定義、註冊和執行系統。這些工具擴展了 Gemini 模型的能力，讓它能夠與本地環境互動、擷取網頁內容，並執行超越簡單文字生成的各種動作。

## 核心概念

- **工具（`tools.ts`）：** 定義所有工具合約的介面和基礎類別（`BaseTool`）。每個工具必須具有：
  - `name`：唯一的內部名稱（用於 Gemini 的 API 呼叫）。
  - `displayName`：使用者友善的名稱。
  - `description`：工具功能的清楚說明，提供給 Gemini 模型。
  - `parameterSchema`：定義工具接受參數的 JSON 綱要。這對於 Gemini 模型了解如何正確呼叫工具至關重要。
  - `validateToolParams()`：驗證傳入參數的方法。
  - `getDescription()`：提供工具在執行前以特定參數執行動作的人類可讀說明方法。
  - `shouldConfirmExecute()`：決定執行前是否需要使用者確認的方法（例如，對於潛在的破壞性操作）。
  - `execute()`：執行工具動作並回傳 `ToolResult` 的核心方法。

- **`ToolResult`（`tools.ts`）：** 定義工具執行結果結構的介面：
  - `llmContent`：要包含在發送回 LLM 以提供內容的歷史記錄中的事實內容。這可以是簡單字串或 `PartListUnion`（`Part` 物件和字串的陣列）以供豐富內容使用。
  - `returnDisplay`：在 CLI 中顯示的使用者友善字串（通常是 Markdown）或特殊物件（如 `FileDiff`）。

- **回傳豐富內容：** 工具不僅限於回傳簡單文字。`llmContent` 可以是 `PartListUnion`，這是一個可以包含混合 `Part` 物件（用於圖像、音訊等）和 `字串` 的陣列。這允許單一工具執行回傳多個豐富內容片段。

- **工具註冊表（`tool-registry.ts`）：** 負責以下工作的類別（`ToolRegistry`）：
  - **註冊工具：** 持有所有可用內建工具的集合（例如，`ReadFileTool`、`ShellTool`）。
  - **探索工具：** 它也可以動態探索工具：
    - **基於指令的探索：** 如果在設定中設定了 `tools.discoveryCommand`，則執行此指令。預期它輸出描述自訂工具的 JSON，然後註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的探索：** 如果設定了 `mcp.serverCommand`，註冊表可以連接到模型內容協定（MCP）伺服器以列出和註冊工具（`DiscoveredMCPTool`）。
  - **提供綱要：** 將所有註冊工具的 `FunctionDeclaration` 綱要暴露給 Gemini 模型，使其知道有哪些工具可用以及如何使用它們。
  - **檢索工具：** 允許核心按名稱取得特定工具以執行。

## 內建工具

核心附帶一套預定義工具，通常位於 `packages/core/src/tools/`。這些包括：

- **檔案系統工具：**
  - `LSTool`（`ls.ts`）：列出目錄內容。
  - `ReadFileTool`（`read-file.ts`）：讀取單一檔案的內容。它接受 `absolute_path` 參數，該參數必須是絕對路徑。
  - `WriteFileTool`（`write-file.ts`）：將內容寫入檔案。
  - `GrepTool`（`grep.ts`）：在檔案中搜尋模式。
  - `GlobTool`（`glob.ts`）：尋找符合 glob 模式的檔案。
  - `EditTool`（`edit.ts`）：對檔案執行就地修改（通常需要確認）。
  - `ReadManyFilesTool`（`read-many-files.ts`）：從多個檔案或 glob 模式讀取和串聯內容（由 CLI 中的 `@` 指令使用）。
- **執行工具：**
  - `ShellTool`（`shell.ts`）：執行任意 Shell 指令（需要謹慎的沙箱化和使用者確認）。
- **網頁工具：**
  - `WebFetchTool`（`web-fetch.ts`）：從 URL 擷取內容。
  - `WebSearchTool`（`web-search.ts`）：執行網頁搜尋。
- **記憶體工具：**
  - `MemoryTool`（`memoryTool.ts`）：與 AI 的記憶體互動。

這些工具中的每一個都擴展 `BaseTool` 並為其特定功能實作所需的方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型基於使用者的提示和提供的工具綱要，決定使用工具並在其回應中回傳 `FunctionCall` 部分，指定工具名稱和引數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具檢索：** 它在 `ToolRegistry` 中查找請求的工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如果需要）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 如果它回傳確認的詳細資訊，核心將此傳達回 CLI，CLI 會提示使用者。
    - 使用者的決定（例如，繼續、取消）會發送回核心。
6.  **執行：** 如果已驗證和確認（或如果不需要確認），核心會使用提供的引數和 `AbortSignal`（用於潛在取消）呼叫工具的 `execute()` 方法。
7.  **結果處理：** 核心接收來自 `execute()` 的 `ToolResult`。
8.  **回應模型：** 來自 `ToolResult` 的 `llmContent` 被包裝為 `FunctionResponse` 並發送回 Gemini 模型，使其可以繼續生成面向使用者的回應。
9.  **顯示給使用者：** 來自 `ToolResult` 的 `returnDisplay` 被發送到 CLI 以向使用者顯示工具執行的動作。

## 使用自訂工具擴展

雖然在提供的檔案中，使用者直接程式化註冊新工具的方式對於典型終端使用者而言並未明確詳述為主要工作流程，但架構透過以下方式支援擴展：

- **基於指令的探索：** 進階使用者或專案管理員可以在 `settings.json` 中定義 `tools.discoveryCommand`。當 Gemini CLI 核心執行此指令時，應輸出 `FunctionDeclaration` 物件的 JSON 陣列。核心會將這些作為 `DiscoveredTool` 實例提供。對應的 `tools.callCommand` 然後負責實際執行這些自訂工具。
- **MCP 伺服器：** 對於更複雜的場景，可以設定一個或多個 MCP 伺服器，並透過 `settings.json` 中的 `mcpServers` 設定進行設定。Gemini CLI 核心然後可以探索和使用這些伺服器暴露的工具。如前所述，如果您有多個 MCP 伺服器，工具名稱將以您設定中的伺服器名稱為前綴（例如，`serverAlias__actualToolName`）。

此工具系統提供了一種靈活而強大的方式來增強 Gemini 模型的能力，使 Gemini CLI 成為廣泛任務的多功能助手。
