# 核心：Tools API

Gemini CLI 核心（`packages/core`）具備一個強大的系統，用於定義、註冊和執行工具。這些工具擴充了 Gemini 模型的功能，使其能夠與本地環境互動、擷取網頁內容，並執行簡單文字生成以外的各種操作。

## 核心概念

- **工具 (`tools.ts`)：** 一個介面和基底類別 (`BaseTool`)，定義了所有工具的合約。每個工具都必須具備：
  - `name`：一個唯一的內部名稱（用於對 Gemini 的 API 呼叫）。
  - `displayName`：一個方便使用者閱讀的名稱。
  - `description`：清楚說明該工具的功能，此說明會提供給 Gemini 模型。
  - `parameterSchema`：一個定義該工具接受參數的 JSON 結構。這對於 Gemini 模型理解如何正確呼叫該工具至關重要。
  - `validateToolParams()`：一個驗證傳入參數的方法。
  - `getDescription()`：一個在執行前，針對特定參數提供人類可讀的工具行為描述的方法。
  - `shouldConfirmExecute()`：一個決定執行前是否需要使用者確認的方法（例如，用於可能具有破壞性的操作）。
  - `execute()`：執行工具動作並回傳 `ToolResult` 的核心方法。

- **`ToolResult` (`tools.ts`)：** 一個定義工具執行結果結構的介面：
  - `llmContent`：要包含在傳回給 LLM 作為上下文的歷史記錄中的事實性字串內容。
  - `returnDisplay`：一個方便使用者閱讀的字串（通常是 Markdown）或一個特殊物件（如 `FileDiff`），用於在 CLI 中顯示。

- **工具註冊表 (`tool-registry.ts`)：** 一個 `ToolRegistry` 類別，負責：
  - **註冊工具：** 持有所有可用的內建工具集合（例如 `ReadFileTool`、`ShellTool`）。
  - **探索工具：** 它也可以動態探索工具：
    - **基於指令的探索：** 如果在設定中配置了 `toolDiscoveryCommand`，這個指令就會被執行。它應該輸出描述自訂工具的 JSON，這些工具隨後會被註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的探索：** 如果配置了 `mcpServerCommand`，註冊表可以連接到一個模型上下文協議（MCP）伺服器，以列出並註冊工具（`DiscoveredMCPTool`）。
  - **提供結構：** 向 Gemini 模型公開所有已註冊工具的 `FunctionDeclaration` 結構，使其知道有哪些工具可用以及如何使用它們。
  - **擷取工具：** 允許核心依名稱取得特定工具以供執行。

## 內建工具

核心內建了一套預先定義的工具，通常位於 `packages/core/src/tools/`。這些包括：

- **檔案系統工具：**
  - `LSTool` (`ls.ts`)：列出目錄內容。
  - `ReadFileTool` (`read-file.ts`)：讀取單一檔案的內容。它接受一個 `absolute_path` 參數，該參數必須是絕對路徑。
  - `WriteFileTool` (`write-file.ts`)：將內容寫入檔案。
  - `GrepTool` (`grep.ts`)：在檔案中搜尋模式。
  - `GlobTool` (`glob.ts`)：尋找符合 glob 模式的檔案。
  - `EditTool` (`edit.ts`)：對檔案進行原地修改（通常需要確認）。
  - `ReadManyFilesTool` (`read-many-files.ts`)：從多個檔案或 glob 模式中讀取並串連內容（CLI 中的 `@` 指令使用）。
- **執行工具：**
  - `ShellTool` (`shell.ts`)：執行任意 shell 指令（需要謹慎的沙箱環境和使用者確認）。
- **網頁工具：**
  - `WebFetchTool` (`web-fetch.ts`)：從 URL 擷取內容。
  - `WebSearchTool` (`web-search.ts`)：執行網頁搜尋。
- **記憶工具：**
  - `MemoryTool` (`memoryTool.ts`)：與 AI 的記憶互動。

這些工具都繼承了 `BaseTool` 並為其特定功能實作了所需的方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型根據使用者的提示和提供的工具結構，決定使用一個工具，並在其回應中回傳一個 `FunctionCall` 部分，指定工具名稱和參數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具擷取：** 它在 `ToolRegistry` 中查詢請求的工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如果需要）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 如果它回傳了需要確認的詳細資訊，核心會將此訊息傳回給 CLI，CLI 會提示使用者。
    - 使用者的決定（例如，繼續、取消）會被傳回給核心。
6.  **執行：** 如果已驗證並確認（或不需要確認），核心會使用提供的參數和一個 `AbortSignal`（用於潛在的取消操作）來呼叫工具的 `execute()` 方法。
7.  **結果處理：** 核心接收來自 `execute()` 的 `ToolResult`。
8.  **回應模型：** 來自 `ToolResult` 的 `llmContent` 被封裝成一個 `FunctionResponse` 並傳回給 Gemini 模型，以便它能繼續產生面向使用者的回應。
9.  **向使用者顯示：** 來自 `ToolResult` 的 `returnDisplay` 被傳送到 CLI，以向使用者顯示該工具做了什麼。

## 使用自訂工具進行擴充

雖然對於一般終端使用者而言，在提供的檔案中並未明確詳述由使用者直接以程式化方式註冊新工具作為主要工作流程，但該架構支援透過以下方式進行擴充：

- **基於指令的探索：** 進階使用者或專案管理員可以在 `settings.json` 中定義一個 `toolDiscoveryCommand`。當 Gemini CLI 核心執行此指令時，它應該輸出一個 `FunctionDeclaration` 物件的 JSON 陣列。核心接著會將這些工具作為 `DiscoveredTool` 實例提供。相應的 `toolCallCommand` 則負責實際執行這些自訂工具。
- **MCP 伺服器：** 對於更複雜的情境，可以透過 `settings.json` 中的 `mcpServers` 設定來建立和配置一個或多個 MCP 伺服器。Gemini CLI 核心接著可以探索並使用這些伺服器公開的工具。如前所述，如果您有多個 MCP 伺服器，工具名稱將會以您的配置中的伺服器名稱作為前綴（例如 `serverAlias__actualToolName`）。

此工具系統提供了一種彈性且強大的方式來增強 Gemini 模型的能力，使 Gemini CLI 成為一個能處理各種任務的多功能助理。