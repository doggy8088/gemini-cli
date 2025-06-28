# Gemini CLI 核心：工具 API

Gemini CLI 核心 (`packages/core`) 具備一個強大的系統，用於定義、註冊和執行工具。這些工具擴展了 Gemini 模型的功能，使其能夠與本機環境互動、擷取網頁內容，並執行簡單文本生成以外的各種操作。

## 核心概念

- **工具 (`tools.ts`)：** 一個介面和基礎類別 (`BaseTool`)，定義了所有工具的合約。每個工具都必須具備：

  - `name`: 唯一的內部名稱（用於對 Gemini 的 API 呼叫）。
  - `displayName`: 使用者友善的名稱。
  - `description`: 對工具功能的清晰解釋，會提供給 Gemini 模型。
  - `parameterSchema`: 一個 JSON schema，定義了工具接受的參數。這對於 Gemini 模型理解如何正確呼叫工具至關重要。
  - `validateToolParams()`: 一個用來驗證傳入參數的方法。
  - `getDescription()`: 一個在執行前提供人類可讀描述的方法，說明工具將使用特定參數做什麼。
  - `shouldConfirmExecute()`: 一個用來判斷執行前是否需要使用者確認的方法（例如，對於可能具有破壞性的操作）。
  - `execute()`: 執行工具動作並回傳 `ToolResult` 的核心方法。

- **`ToolResult` (`tools.ts`)：** 一個定義工具執行結果結構的介面：

  - `llmContent`: 事實性的字串內容，會包含在傳回給 LLM 的歷史記錄中以提供上下文。
  - `returnDisplay`: 一個使用者友善的字串（通常是 Markdown）或一個特殊物件（如 `FileDiff`），用於在 CLI 中顯示。

- **工具註冊表 (`tool-registry.ts`)：** 一個類別 (`ToolRegistry`)，負責：
  - **註冊工具：** 持有所有可用的內建工具集合（例如 `ReadFileTool`、`ShellTool`）。
  - **探索工具：** 它也可以動態探索工具：
    - **基於指令的探索：** 如果在設定中配置了 `toolDiscoveryCommand`，則會執行此指令。它應輸出描述自訂工具的 JSON，這些工具隨後會被註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的探索：** 如果配置了 `mcpServerCommand`，註冊表可以連接到模型內容協定（MCP）伺服器，以列出並註冊工具（`DiscoveredMCPTool`）。
  - **提供 Schemas：** 向 Gemini 模型公開所有已註冊工具的 `FunctionDeclaration` schemas，以便它知道有哪些工具可用以及如何使用它們。
  - **擷取工具：** 允許核心依名稱取得特定工具以供執行。

## 內建工具

核心附帶一套預先定義的工具，通常位於 `packages/core/src/tools/` 中。這些包括：

- **檔案系統工具：**
  - `LSTool` (`ls.ts`): 列出目錄內容。
  - `ReadFileTool` (`read-file.ts`): 讀取單一檔案的內容。它接受一個 `absolute_path` 參數，該參數必須是絕對路徑。
  - `WriteFileTool` (`write-file.ts`): 將內容寫入檔案。
  - `GrepTool` (`grep.ts`): 在檔案中搜尋模式。
  - `GlobTool` (`glob.ts`): 尋找符合 glob 模式的檔案。
  - `EditTool` (`edit.ts`): 對檔案進行就地修改（通常需要確認）。
  - `ReadManyFilesTool` (`read-many-files.ts`): 從多個檔案或 glob 模式中讀取並串連內容（CLI 中的 `@` 指令使用）。
- **執行工具：**
  - `ShellTool` (`shell.ts`): 執行任意 shell 指令（需要謹慎的沙箱環境和使用者確認）。
- **網頁工具：**
  - `WebFetchTool` (`web-fetch.ts`): 從 URL 擷取內容。
  - `WebSearchTool` (`web-search.ts`): 執行網頁搜尋。
- **記憶體工具：**
  - `MemoryTool` (`memoryTool.ts`): 與 AI 的記憶體互動。

這些工具都擴展了 `BaseTool` 並為其特定功能實作了所需的方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型根據使用者的提示和提供的工具 schemas，決定使用一個工具，並在其回應中回傳一個 `FunctionCall` 部分，指定工具名稱和參數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具擷取：** 它會在 `ToolRegistry` 中查找請求的工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如果需要）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 如果它回傳了需要確認的詳細資訊，核心會將此訊息傳回給 CLI，CLI 會提示使用者。
    - 使用者的決定（例如，繼續、取消）會被傳回給核心。
6.  **執行：** 若已驗證並確認 (或無需確認)，核心會以提供的引數和一個 `AbortSignal` (用於可能的取消) 呼叫工具的 `execute()` 方法。
7.  **結果處理：** 核心會接收來自 `execute()` 的 `ToolResult`。
8.  **回應模型：** 來自 `ToolResult` 的 `llmContent` 會被封裝為 `FunctionResponse` 並傳回 Gemini 模型，以便其繼續產生面向使用者的回應。
9.  **向使用者顯示：** 來自 `ToolResult` 的 `returnDisplay` 會傳送至 CLI，以向使用者顯示工具執行的動作。

## 以自訂工具擴充

雖然在提供的檔案中，並未將使用者直接以程式設計方式註冊新工具，詳細說明為一般終端使用者的主要工作流程，但該架構支援透過以下方式進行擴充：

- **基於指令的探索：** 進階使用者或專案管理員可以在 `settings.json` 中定義一個 `toolDiscoveryCommand`。此指令由 Gemini CLI 核心執行時，應輸出一個 `FunctionDeclaration` 物件的 JSON 陣列。核心接著會將這些工具以 `DiscoveredTool` 執行個體的形式提供使用。對應的 `toolCallCommand` 接著會負責實際執行這些自訂工具。
- **MCP 伺服器：** 對於更複雜的情境，可以透過 `settings.json` 中的 `mcpServers` 設定來建立並設定一或多個 MCP 伺服器。Gemini CLI 核心接著可以探索並使用這些伺服器所公開的工具。如前所述，如果您有多個 MCP 伺服器，工具名稱將會以您設定檔中的伺服器名稱作為前置詞 (例如 `serverAlias__actualToolName`)。

此工具系統提供了一種彈性且強大的方式來增強 Gemini 模型的功能，使 Gemini CLI 成為一個能處理各式各樣任務的多功能助理。
