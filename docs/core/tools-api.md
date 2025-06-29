# Gemini CLI 核心：工具 API

Gemini CLI 核心 (`packages/core`) 提供一個強大的系統，用於定義、註冊和執行工具。這些工具擴充了 Gemini 模型的功能，使其能夠與本機環境互動、擷取網頁內容，並執行簡單文字生成以外的各種操作。

## 核心概念

- **工具 (`tools.ts`)：** 一個介面和基底類別 (`BaseTool`)，定義了所有工具的合約。每個工具都必須有：
  - `name`：唯一的內部名稱（用於對 Gemini 的 API 呼叫）。
  - `displayName`：使用者易於理解的名稱。
  - `description`：清楚說明工具功能的描述，會提供給 Gemini 模型。
  - `parameterSchema`：一個 JSON 結構，定義工具接受的參數。這對於 Gemini 模型正確理解如何呼叫工具至關重要。
  - `validateToolParams()`：一個驗證傳入參數的方法。
  - `getDescription()`：一個在執行前提供人類可讀描述的方法，說明工具將使用特定參數執行什麼操作。
  - `shouldConfirmExecute()`：一個決定執行前是否需要使用者確認的方法（例如，對於可能具有破壞性的操作）。
  - `execute()`：執行工具操作並傳回 `ToolResult` 的核心方法。

- **`ToolResult` (`tools.ts`)：** 一個介面，定義工具執行結果的結構：
  - `llmContent`：要包含在傳回給 LLM 的歷史記錄中的事實性字串內容，以供上下文參考。
  - `returnDisplay`：一個使用者易於理解的字串（通常是 Markdown）或特殊物件（如 `FileDiff`），用於在 CLI 中顯示。

- **工具註冊表 (`tool-registry.ts`)：** 一個類別 (`ToolRegistry`)，負責：
  - **註冊工具：** 持有所有可用的內建工具集合（例如 `ReadFileTool`、`ShellTool`）。
  - **發現工具：** 它也可以動態發現工具：
    - **基於指令的發現：** 如果在設定中設定了 `toolDiscoveryCommand`，則會執行此指令。它應該輸出描述自訂工具的 JSON，然後這些工具會被註冊為 `DiscoveredTool` 實例。
    - **基於 MCP 的發現：** 如果設定了 `mcpServerCommand`，註冊表可以連接到模型情境協定 (MCP) 伺服器來列出和註冊工具 (`DiscoveredMCPTool`)。
  - **提供結構：** 將所有已註冊工具的 `FunctionDeclaration` 結構公開給 Gemini 模型，以便它知道有哪些工具可用以及如何使用它們。
  - **擷取工具：** 允許核心按名稱取得特定工具以供執行。

## 內建工具

核心隨附一套預先定義的工具，通常位於 `packages/core/src/tools/` 中。這些包括：

- **檔案系���工具：**
  - `LSTool` (`ls.ts`)：列出目錄內容。
  - `ReadFileTool` (`read-file.ts`)：讀取單一檔案的內容。它接受一個 `absolute_path` 參數，該參數必須是絕對路徑。
  - `WriteFileTool` (`write-file.ts`)：將內容寫入檔案。
  - `GrepTool` (`grep.ts`)：在檔案中搜尋模式。
  - `GlobTool` (`glob.ts`)：尋找符合 glob 模式的檔案。
  - `EditTool` (`edit.ts`)：對檔案進行就地修改（通常需要確認）。
  - `ReadManyFilesTool` (`read-many-files.ts`)：從多個檔案或 glob 模式讀取並串連內容（由 CLI 中的 `@` 指令使用）。
- **執行工具：**
  - `ShellTool` (`shell.ts`)：執行任意 shell 指令（需要謹慎的沙箱和使用者確認）。
- **網頁工具：**
  - `WebFetchTool` (`web-fetch.ts`)：從 URL 擷取內容。
  - `WebSearchTool` (`web-search.ts`)：執行網頁搜尋。
- **記憶體工具：**
  - `MemoryTool` (`memoryTool.ts`)：與 AI 的記憶體互動。

這些工具中的每一個都擴充了 `BaseTool` 並為其特定功能實作了必要的方法。

## 工具執行流程

1.  **模型請求：** Gemini 模型根據使用者的提示和提供的工具結構，決定使用一個工具，並在其回應中傳回一個 `FunctionCall` 部分，指定工具名稱和參數。
2.  **核心接收請求：** 核心解析此 `FunctionCall`。
3.  **工具擷取：** 它在 `ToolRegistry` 中查詢請求的工具。
4.  **參數驗證：** 呼叫工具的 `validateToolParams()` 方法。
5.  **確認（如果需要）：**
    - 呼叫工具的 `shouldConfirmExecute()` 方法。
    - 如果它傳回需要確認的詳細資訊，核心會將此資訊傳回給 CLI，CLI 會提示使用者。
    - 使用者的決定（例如，繼續、取消）會被傳回給核心。
6.  **執行：** 如果已驗證並確認（或者如果不需要確認），核心會使用提供的參數和 `AbortSignal`（用於潛在的取消）呼叫工具的 `execute()` 方法。
7.  **結果處理：** 核心接收來自 `execute()` 的 `ToolResult`。
8.  **回應模型：** 來自 `ToolResult` 的 `llmContent` 被打包為 `FunctionResponse` 並傳回給 Gemini 模型，以便它可以繼續生成面向使用者的回應。
9.  **向使用者顯示：** 來自 `ToolResult` 的 `returnDisplay` 被傳送到 CLI，以向使用者顯示該工具執行的操作。

## 使用自訂工具進行擴充

雖然在提供的檔案中，對於一般使用者而言，直接以程式化方式註冊新工具並未被詳細說明為主要工作流程，但該架構支援透過以下方式進行擴充：

- **基於指令的發現：** 進階使用者或專案管理員可以在 `settings.json` 中定義 `toolDiscoveryCommand`。當 Gemini CLI 核心執行此指令時，它應該輸出一個 `FunctionDeclaration` 物件的 JSON 陣列。然後，核心會將這些物件作為 `DiscoveredTool` 實例提供。對應的 `toolCallCommand` 接著將負責實際執行這些自訂工具。
- **MCP 伺服器：** 對於更複雜的情境，可以設定一或多個 MCP 伺服器，並透過 `settings.json` 中的 `mcpServers` 設定進行配置。Gemini CLI 核心接著可以發現並使用這些伺erv器公開的工具。如前所述，如果您有多個 MCP 伺服器，工具名稱將會以您設定中的伺服器名稱作為前綴（例如 `serverAlias__actualToolName`）。

這個工具系統提供了一種靈活而強大的方式來增強 Gemini 模型的功能，使 Gemini CLI 成為執行各種任務的多功能助理。