# Gemini CLI Core：工具 API

Gemini CLI Core（`packages/core`）具備一套強大的系統，用於定義、註冊與執行工具（tools）。這些工具能擴充 Gemini 模型的能力，讓其能與本地環境互動、擷取網路內容，並執行各種超越單純文字生成的操作。

## 核心概念

- **工具（Tool，`tools.ts`）：** 一個介面與基底類別（`BaseTool`），用來定義所有工具的合約。每個工具必須具備：
  - `name`：唯一的內部名稱（在 API 呼叫 Gemini 時使用）。
  - `displayName`：對使用者友善的名稱。
  - `description`：明確說明工具用途的描述，會提供給 Gemini 模型。
  - `parameterSchema`：定義工具可接受參數的 JSON schema。這對於讓 Gemini 模型正確理解如何呼叫工具至關重要。
  - `validateToolParams()`：驗證輸入參數的方法。
  - `getDescription()`：在執行前，根據特定參數提供人類可讀的工具執行描述的方法。
  - `shouldConfirmExecute()`：判斷執行前是否需要使用者確認的方法（例如：潛在具破壞性的操作）。
  - `execute()`：執行工具主要動作並回傳 `ToolResult` 的核心方法。

- **`ToolResult`（`tools.ts`）：** 定義工具執行結果結構的介面：
  - `llmContent`：要包含在回傳給大型語言模型 (LLM) 歷史紀錄中的事實內容。這可以是單純的字串，或是 `PartListUnion`（`Part` 物件與字串的陣列）以呈現豐富內容。
  - `returnDisplay`：給使用者看的友善字串（通常為 Markdown），或特殊物件（如 `FileDiff`），用於命令列介面 (CLI) 顯示。

- **回傳豐富內容（Returning Rich Content）：** 工具不限於回傳純文字。`llmContent` 可以是 `PartListUnion`，即一個陣列，內含 `Part` 物件（如圖片、音訊等）與 `string` 的混合。這讓單次工具執行能回傳多個豐富內容片段。

- **工具註冊表（Tool Registry，`tool-registry.ts`）：** 一個類別（`ToolRegistry`），負責：
  - **註冊工具：** 管理所有內建工具的集合（例如 `ReadFileTool`、`ShellTool`）。
  - **發現工具：** 也能動態發現工具：
    - **基於指令的發現（Command-based Discovery）：** 若設定中有配置 `tools.discoveryCommand`，則會執行該指令，預期輸出描述自訂工具的 JSON，並將其註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的發現（MCP-based Discovery）：** 若有設定 `mcp.serverCommand`，註冊表可連接至 Model Context Protocol (MCP) 伺服器以列出並註冊工具（`DiscoveredMCPTool`）。
  - **提供 Schemas：** 將所有已註冊工具的 `FunctionDeclaration` schema 暴露給 Gemini 模型，讓其知道有哪些工具可用及如何使用。
  - **取得工具：** 允許核心根據名稱取得特定工具以執行。

## 內建工具

Core 套件內建一系列預先定義的工具，通常位於 `packages/core/src/tools/`。包括：

- **檔案系統工具（File System Tools）：**
  - `LSTool`（`ls.ts`）：列出目錄內容。
  - `ReadFileTool`（`read-file.ts`）：讀取單一檔案內容。需傳入 `absolute_path` 參數，且必須為絕對路徑。
  - `WriteFileTool`（`write-file.ts`）：將內容寫入檔案。
  - `GrepTool`（`grep.ts`）：在檔案中搜尋模式。
  - `GlobTool`（`glob.ts`）：尋找符合萬用字元 (wildcards) 模式的檔案。
  - `EditTool`（`edit.ts`）：對檔案進行原地修改（通常需要確認）。
  - `ReadManyFilesTool`（`read-many-files.ts`）：讀取並串接多個檔案或萬用字元 (wildcards) 模式的內容（命令列介面 (CLI) 中由 `@` 指令使用）。
- **執行工具（Execution Tools）：**
  - `ShellTool`（`shell.ts`）：執行任意 shell 指令（需謹慎沙箱機制與使用者確認）。
- **網路工具（Web Tools）：**
  - `WebFetchTool`（`web-fetch.ts`）：從 URL 擷取內容。
  - `WebSearchTool`（`web-search.ts`）：執行網路搜尋。
- **記憶體工具（Memory Tools）：**
  - `MemoryTool`（`memoryTool.ts`）：與 AI 的記憶體互動。

上述每個工具皆繼承自 `BaseTool`，並實作其專屬功能所需的方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型根據使用者提示與提供的工具 schema，決定使用某個工具，並於回應中回傳 `FunctionCall` 部分，指定工具名稱與參數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具查找：** 於 `ToolRegistry` 中查找所需工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如需）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 若回傳確認細節，核心會將資訊回傳給命令列介面 (CLI)，提示使用者。
    - 使用者決定（如繼續、取消）後，結果回傳給核心。
6.  **執行：** 若驗證通過且已確認（或不需確認），核心會以給定參數及 `AbortSignal`（用於可能的取消）呼叫工具的 `execute()` 方法。
7.  **結果處理：** 從 `execute()` 接收 `ToolResult` 結果。
8.  **回應模型：** 將 `ToolResult` 的 `llmContent` 包裝成 `FunctionResponse`，回傳給 Gemini 模型，以便其繼續生成面向使用者的回應。
9.  **顯示給使用者：** 將 `ToolResult` 的 `returnDisplay` 傳送給命令列介面 (CLI)，顯示工具執行結果。

## 擴充自訂工具

雖然在現有檔案中，對於一般終端使用者並未明確詳述直接以程式方式註冊新工具的主要工作流程，但架構本身支援以下擴充方式：

- **基於指令的發現（Command-based Discovery）：** 進階使用者或專案管理員可於 `settings.json` 中定義 `tools.discoveryCommand`。當 Gemini CLI Core 執行該指令時，應輸出一個 `FunctionDeclaration` 物件的 JSON 陣列。核心會將這些工具作為 `DiscoveredTool` 實例提供。對應的 `tools.callCommand` 則負責實際執行這些自訂工具。
- **MCP 伺服器（MCP Server(s)）：** 較複雜情境下，可透過 `settings.json` 設定中的 `mcpServers`，配置一個或多個 MCP 伺服器。Gemini CLI Core 便能發現並使用這些伺服器所公開的工具。如前所述，若有多個 MCP 伺服器，工具名稱會加上來自設定的伺服器名稱前綴（例如 `serverAlias__actualToolName`）。

此工具系統提供彈性且強大的擴充能力，讓 Gemini CLI 成為多元任務的全方位助手。
