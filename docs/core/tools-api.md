# Gemini CLI Core：工具 API

Gemini CLI Core（`packages/core`）具備一套強大的系統，用於定義、註冊與執行工具（tools）。這些工具能擴充 Gemini 模型的能力，使其能與本地環境互動、擷取網頁內容，並執行各種超越單純文字生成的操作。

## 核心概念

- **工具（Tool，`tools.ts`）：** 一個介面與基礎類別（`BaseTool`），定義所有工具的合約。每個工具必須具備：
  - `name`：唯一的內部名稱（用於對 Gemini 的 API 呼叫）。
  - `displayName`：易於理解的名稱。
  - `description`：明確說明工具用途的描述，會提供給 Gemini 模型。
  - `parameterSchema`：定義工具可接受參數的 JSON schema。這對於 Gemini 模型正確呼叫工具至關重要。
  - `validateToolParams()`：驗證輸入參數的方法。
  - `getDescription()`：在執行前，根據特定參數提供人類可讀的操作說明的方法。
  - `shouldConfirmExecute()`：判斷執行前是否需要使用者確認的方法（例如：潛在具破壞性的操作）。
  - `execute()`：執行工具核心行為並回傳 `ToolResult` 的方法。

- **`ToolResult`（`tools.ts`）：** 定義工具執行結果結構的介面：
  - `llmContent`：要回傳給大型語言模型 (LLM) 以提供上下文的事實內容。可以是單純的字串，或是 `PartListUnion`（由`Part`物件與字串組成的陣列）以支援豐富內容。
  - `returnDisplay`：用於命令列介面 (Command Line Interface) 顯示的易讀字串（通常為 Markdown），或是特殊物件（如 `FileDiff`）。

- **回傳豐富內容（Returning Rich Content）：** 工具不限於回傳純文字。`llmContent` 可以是 `PartListUnion`，即一個陣列，可同時包含`Part`物件（如圖片、音訊等）與`string`。這讓單次工具執行能回傳多個豐富內容片段。

- **工具註冊中心（Tool Registry，`tool-registry.ts`）：** 一個類別（`ToolRegistry`），負責：
  - **註冊工具：** 保存所有內建工具（例如 `ReadFileTool`、`ShellTool`）的集合。
  - **發現工具：** 也能動態發現工具：
    - **基於指令的發現（Command-based Discovery）：** 若在設定中配置了 `tools.discoveryCommand`，則會執行該指令。預期其輸出描述自訂工具的 JSON，並註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的發現（MCP-based Discovery）：** 若配置了 `mcp.serverCommand`，則註冊中心可連接 Model Context Protocol (MCP) 伺服器，列出並註冊工具（`DiscoveredMCPTool`）。
  - **提供 Schema：** 將所有已註冊工具的 `FunctionDeclaration` schema 暴露給 Gemini 模型，讓其知道有哪些工具可用及如何使用。
  - **檢索工具：** 允許核心根據名稱取得特定工具以執行。

## 內建工具

核心內建一系列預先定義的工具，通常位於 `packages/core/src/tools/`。包括：

- **檔案系統工具：**
  - `LSTool`（`ls.ts`）：列出目錄內容。
  - `ReadFileTool`（`read-file.ts`）：讀取單一檔案內容。需傳入 `absolute_path` 參數，且必須為絕對路徑。
  - `WriteFileTool`（`write-file.ts`）：將內容寫入檔案。
  - `GrepTool`（`grep.ts`）：在檔案中搜尋特定模式。
  - `GlobTool`（`glob.ts`）：尋找符合 glob 模式的檔案。
  - `EditTool`（`edit.ts`）：對檔案進行原地修改（通常需要使用者確認）。
  - `ReadManyFilesTool`（`read-many-files.ts`）：讀取並串接多個檔案或 glob 模式的內容（CLI 中由 `@` 指令使用）。
- **執行工具：**
  - `ShellTool`（`shell.ts`）：執行任意 shell 指令（需謹慎沙箱機制與使用者確認）。
- **網頁工具：**
  - `WebFetchTool`（`web-fetch.ts`）：從 URL 擷取內容。
  - `WebSearchTool`（`web-search.ts`）：執行網頁搜尋。
- **記憶體工具：**
  - `MemoryTool`（`memoryTool.ts`）：與 AI 記憶體互動。

這些工具皆繼承自 `BaseTool`，並依其功能實作所需方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型根據使用者提示與提供的工具 schema，決定使用某個工具，並於回應中回傳 `FunctionCall` 部分，指定工具名稱與參數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具檢索：** 於 `ToolRegistry` 中查找所請求的工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如需）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 若回傳需要確認的細節，核心會將此資訊回傳給命令列介面 (CLI)，提示使用者。
    - 使用者決定（如繼續、取消）後，結果會回傳給核心。
6.  **執行：** 若已驗證且確認（或不需確認），核心會以提供的參數與 `AbortSignal`（用於可能的取消）呼叫工具的 `execute()` 方法。
7.  **結果處理：** 從 `execute()` 接收到 `ToolResult`。
8.  **回應模型：** 將 `ToolResult` 的 `llmContent` 包裝為 `FunctionResponse`，回傳給 Gemini 模型，以便其繼續產生面向使用者的回應。
9.  **顯示給使用者：** 將 `ToolResult` 的 `returnDisplay` 傳送至 CLI，向使用者展示工具執行結果。

## 擴充自訂工具

雖然一般終端使用者直接以程式方式註冊新工具並非主要工作流程，架構仍支援透過以下方式擴充：

- **基於指令的發現（Command-based Discovery）：** 進階使用者或專案管理員可於 `settings.json` 中定義 `tools.discoveryCommand`。當 Gemini CLI Core 執行該指令時，應輸出一個 `FunctionDeclaration` 物件的 JSON 陣列。核心會將這些工具註冊為 `DiscoveredTool` 實例。對應的 `tools.callCommand` 則負責實際執行這些自訂工具。
- **MCP 伺服器（MCP Server(s)）：** 較複雜場景下，可透過 `settings.json` 的 `mcpServers` 設定一個或多個 MCP 伺服器。Gemini CLI Core 可發現並使用這些伺服器所暴露的工具。如有多個 MCP 伺服器，工具名稱會加上設定中的伺服器名稱作為前綴（例如：`serverAlias__actualToolName`）。

這套工具系統為擴充 Gemini 模型能力提供彈性且強大的方式，使 Gemini CLI 成為各式任務的多功能助理。
