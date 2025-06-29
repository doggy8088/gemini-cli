# Gemini CLI 設定

Gemini CLI 提供多種方式來設定其行為，包括環境變數、命令列參數和設定檔。本文件概述了不同的設定方法和可用的設定。

## 設定層級

設定會依照以下優先順序套用 (數字較小的會被數字較大的覆寫)：

1.  **預設值：** 應用程式中寫死的預設值。
2.  **使用者設定檔：** 目前使用者的全域設定。
3.  **專案設定檔：** 專案特定的設定。
4.  **環境變數：** 全系統或工作階段特定的變數，可能從 `.env` 檔案載入。
5.  **命令列參數：** 啟動 CLI 時傳遞的值。

## 使用者設定檔與專案設定檔

Gemini CLI 使用 `settings.json` 檔案進行永久性設定。這些檔案有兩個位置：

- **使用者設定檔：**
  - **位置：** `~/.gemini/settings.json` (`~` 是您的家目錄)。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。
- **專案設定檔：**
  - **位置：** 您專案根目錄下的 `.gemini/settings.json`。
  - **範圍：** 僅在從該特定專案執行 Gemini CLI 時適用。專案設定會覆寫使用者設定。

**關於設定中環境變數的注意���項：** `settings.json` 檔案中的字串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法來參照環境變數。這些變數在載入設定時會自動解析。例如，如果您有一個名為 `MY_API_TOKEN` 的環境變數，您可以在 `settings.json` 中這樣使用它：`"apiKey": "$MY_API_TOKEN"`。

### 您專案中的 `.gemini` 目錄

除了專案設定檔之外，專案的 `.gemini` 目錄還可以包含與 Gemini CLI 操作相關的其他專案特定檔案，例如：

- [自訂沙箱設定檔](#sandboxing) (例如 `.gemini/sandbox-macos-custom.sb`, `.gemini/sandbox.Dockerfile`)。

### `settings.json` 中的可用設定：

- **`contextFileName`** (字串或字串陣列)：
  - **說明：** 指定情境檔案的檔名 (例如 `GEMINI.md`, `AGENTS.md`)。可以是一個檔名或可接受檔名的列表。
  - **預設：** `GEMINI.md`
  - **範例：** `"contextFileName": "AGENTS.md"`

- **`bugCommand`** (物件)：
  - **說明：** 覆寫 `/bug` 指令的預設 URL。
  - **預設：** `"urlTemplate": "https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml&title={title}&info={info}"`
  - **屬性：**
    - **`urlTemplate`** (字串)：可包含 `{title}` 和 `{info}` 預留位置的 URL。
  - **範例：**
    ```json
    "bugCommand": {
      "urlTemplate": "https://bug.example.com/new?title={title}&info={info}"
    }
    ```

- **`fileFiltering`** (物件)：
  - **說明：** 控制 @ 指令和檔案探索工具的 git 感知檔案篩選行為。
  - **預設：** `"respectGitIgnore": true, "enableRecursiveFileSearch": true`
  - **屬性：**
    - **`respectGitIgnore`** (布林值)：在探索檔案時是否遵循 .gitignore 模式。設定為 `true` 時，git 忽略的檔案 (如 `node_modules/`, `dist/`, `.env`) 會自動從 @ 指令和檔案列表操作中排除。
    - **`enableRecursiveFileSearch`** (布林值)：在提示中完成 @ 前綴時，是否啟用在目前樹下遞迴搜尋檔名。
  - **範例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false
    }
    ```

- **`coreTools`** (字串陣列)：
  - **說明：** 允許您指定應提供給模型的核心工具名稱列表。這可用於限制內建工具的集合。有關核心工具的列表，請參閱[內建工具](../core/tools-api.md#built-in-tools)。
  - **預設：** 所有可供 Gemini 模型使用的工具。
  - **範例：** `"coreTools": ["ReadFileTool", "GlobTool", "SearchText"]`。

- **`excludeTools`** (字串陣列)：
  - **說明：** 允許您指定應從模型中排除的核心工具名稱列表。同時列在 `excludeTools` 和 `coreTools` 中的工具將被排除。
  - **預設**：不排除任何工具。
  - **範例：** `"excludeTools": ["run_shell_command", "findFiles"]`。

- **`autoAccept`** (布林值)：
  - **說明：** 控制 CLI 是否自動接受並執行被認為是安全的工具呼叫 (例如，唯讀操作)，而無需使用者明確確認。如果設定為 `true`，CLI 將對被視為安全的工具跳過確認提示。
  - **預設：** `false`
  - **範例：** `"autoAccept": true`

- **`theme`** (字串)：
  - **說明：** 設定 Gemini CLI 的視覺[主題](./themes.md)。
  - **預設：** `"Default"`
  - **範例：** `"theme": "GitHub"`

- **`sandbox`** (布林值或字串)：
  - **說明：** 控制是否以及如何使用沙箱進行工具執行。如果設定為 `true`，Gemini CLI 會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。更多資訊請參閱[沙箱化](#sandboxing)。
  - **預設：** `false`
  - **範例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`** (字串)：
  - **說明：** 定義一個自訂 shell 指令，用於從您的專案中探索工具。該 shell 指令必須在 `stdout` 上回傳一個 [函式宣告](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 的 JSON 陣列。工具包裝器是可選的。
  - **預設：** 空
  - **範例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`** (字串)：
  - **說明：** 定義一個自訂 shell 指令，用於呼叫使用 `toolDiscoveryCommand` 探索到的特定工具。該 shell 指令必須符合以下條件：
    - 它必須將函式 `name` (與[函式宣告](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 中完全相同) 作為第一個命令列參數。
    - 它必須在 `stdin` 上讀取 JSON 格式的函式參數，類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 它必須在 `stdout` 上回傳 JSON 格式的函式輸出，類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **預設：** 空
  - **範例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`** (物件)：
  - **說明：** 設定與一個或多個模型情境協定 (MCP) 伺服器的連線，以探索和使用自訂工具。Gemini CLI 會嘗試連線到每個設定的 MCP 伺服器以探索可用的工具。如果多個 MCP 伺服器公開了同名的工具，工具名稱將會加上您在設定中定義的伺服器別名作為前綴 (例如 `serverAlias__actualToolName`) 以避免衝突。請注意，系統可能會為了相容性而從 MCP 工具定義中移除某些結構描述屬性。
  - **預設：** 空
  - **屬性：**
    - **`<SERVER_NAME>`** (物件)：指定伺服器的伺服器參數。
      - `command` (字串，必要)：執行以啟動 MCP 伺服器的指令。
      - `args` (字串陣列，可選)：傳遞給指令的參數。
      - `env` (物件，可選)：為伺服器程序設定的環境變數。
      - `cwd` (字串，可選)：啟動伺服器的工作目錄。
      - `timeout` (數字，可選)：對此 MCP 伺服器請求的逾時時間 (毫秒)。
      - `trust` (布林值，可選)：信任此伺服器並繞過所有工具呼叫確認。
  - **範例：**
    ```json
    "mcpServers": {
      "myPythonServer": {
        "command": "python",
        "args": ["mcp_server.py", "--port", "8080"],
        "cwd": "./mcp_tools/python",
        "timeout": 5000
      },
      "myNodeServer": {
        "command": "node",
        "args": ["mcp_server.js"],
        "cwd": "./mcp_tools/node"
      },
      "myDockerServer": {
        "command": "docker",
        "args": ["run", "i", "--rm", "-e", "API_KEY", "ghcr.io/foo/bar"],
        "env": {
          "API_KEY": "$MY_API_TOKEN"
        }
      },
    }
    ```

- **`checkpointing`** (物件)：
  - **說明：** 設定檢查點功能，允許您儲存和還原對話和檔案狀態。更多詳細資訊請參閱[檢查點文件](../checkpointing.md)。
  - **預設：** `{"enabled": false}`
  - **屬性：**
    - **`enabled`** (布林值)：當為 `true` 時，`/restore` 指令可用。

- **`preferredEditor`** (字串)：
  - **說明：** 指定檢視差異時偏好的編輯器。
  - **預設：** `vscode`
  - **範例：** `"preferredEditor": "vscode"`

- **`telemetry`** (物件)
  - **說明：** 設定 Gemini CLI 的日誌記錄和指標收集。更多資訊請參閱[遙測](../telemetry.md)。
  - **預設：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **屬性：**
    - **`enabled`** (布林值)：遙測是否啟用。
    - **`target`** (字串)：收集的遙測資料的目的地。支援的值為 `local` 和 `gcp`。
    - **`otlpEndpoint`** (字串)：OTLP 匯出器的端點。
    - **`logPrompts`** (布林值)：是否在日誌中包含使用者提示的內容。
  - **範例：**
    ```json
    "telemetry": {
      "enabled": true,
      "target": "local",
      "otlpEndpoint": "http://localhost:16686",
      "logPrompts": false
    }
    ```
- **`usageStatisticsEnabled`** (布林值)：
  - **說明：** 啟用或停用使用情況統計資料的收集。更多資訊請參閱[使用情況統計](#usage-statistics)。
  - **預設：** `true`
  - **範例：**
    ```json
    "usageStatisticsEnabled": false
    ```

### `settings.json` 範例：

```json
{
  "theme": "GitHub",
  "sandbox": "docker",
  "toolDiscoveryCommand": "bin/get_tools",
  "toolCallCommand": "bin/call_tool",
  "mcpServers": {
    "mainServer": {
      "command": "bin/mcp_server.py"
    },
    "anotherServer": {
      "command": "node",
      "args": ["mcp_server.js", "--verbose"]
    }
  },
  "telemetry": {
    "enabled": true,
    "target": "local",
    "otlpEndpoint": "http://localhost:4317",
    "logPrompts": true
  },
  "usageStatisticsEnabled": true
}
```

## Shell 歷史記錄

CLI 會保留您執行的 shell 指令歷史記錄。為避免不同專案之間的衝突，此歷史記錄儲存在您使用者家目錄內的一個專案特定目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是從您專案根路徑產生的唯一識別碼。
  - 歷史記錄儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常用方法，特別是用�� API 金鑰等敏感資訊或可能因環境而異的設定。

CLI 會自動從 `.env` 檔案載入環境變數。載入順序如下：

1.  目前工作目錄中的 `.env` 檔案。
2.  如果找不到，它會向上搜尋父目錄，直到找到 `.env` 檔案或到達專案根目錄 (由 `.git` 資料夾識別) 或家目錄。
3.  如果仍然找不到，它會尋找 `~/.env` (在使用者家目錄中)。

- **`GEMINI_API_KEY`** (必要)：
  - 您用於 Gemini API 的 API 金鑰。
  - **操作的關鍵。** 沒有它，CLI 將無法運作。
  - 在您的 shell 設定檔 (例如 `~/.bashrc`, `~/.zshrc`) 或 `.env` 檔案中設定此項。
- **`GEMINI_MODEL`**：
  - 指定要使用的預設 Gemini 模型。
  - 覆寫寫死的預設值。
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 您的 Google Cloud API 金鑰。
  - 在快速模式下使用 Vertex AI 所需。
  - 確保您具有必要的權限並設定 `GOOGLE_GENAI_USE_VERTEXAI=true` 環境變數。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 您的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 所需。
  - 如果使用 Vertex AI，請確保您具有必要的權限並設定 `GOOGLE_GENAI_USE_VERTEXAI=true` 環境變數。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`** (字串)：
  - **說明：** 您的 Google 應用程式憑證 JSON 檔案的路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 您用於 Google Cloud 中遙測的 Google Cloud 專案 ID。
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 您的 Google Cloud 專案位置 (例如 us-central1)。
  - 在非快速模式下使用 Vertex AI 所需。
  - 如果使用 Vertex AI，請確保您具有必要的權限並設定 `GOOGLE_GENAI_USE_VERTEXAI=true` 環境變數。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - `settings.json` 中 `sandbox` 設定的替代方案。
  - 接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`** (macOS 特定)：
  - 切換 macOS 上的 Seatbelt (`sandbox-exec`) 設定檔。
  - `permissive-open`：(預設) 限制對專案資料夾 (以及其他一些資料夾，請參閱 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`) 的寫入，但允許其他操作。
  - `strict`：使用預設拒絕操作的嚴格設定檔。
  - `<profile_name>`：使用自訂設定檔。若要定義自���設定檔，請在您專案的 `.gemini/` 目錄中建立一個名為 `sandbox-macos-<profile_name>.sb` 的檔案 (例如 `my-project/.gemini/sandbox-macos-custom.sb`)。
- **`DEBUG` 或 `DEBUG_MODE`** (通常由底層函式庫或 CLI 本身使用)：
  - 設定為 `true` 或 `1` 以啟用詳細的偵錯日誌記錄，這有助於疑難排解。
- **`NO_COLOR`**：
  - 設定為任何值以停用 CLI 中的所有顏色輸出。
- **`CLI_TITLE`**：
  - 設定為字串以自訂 CLI 的標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定程式碼輔助伺服器的端點。
  - 這對於開發和測試很有用。

## 命令列參數

直接在執行 CLI 時傳遞的參數可以覆寫該特定工作階段的其他設定。

- **`--model <model_name>`** (**`-m <model_name>`**):
  - 指定此工作階段要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`** (**`-p <your_prompt>`**):
  - 用於直接將提示傳遞給指令。這會以非互動模式叫用 Gemini CLI。
- **`--sandbox`** (**`-s`**):
  - 為此工作階段啟用沙箱模式。
- **`--sandbox-image`**:
  - 設定沙箱映像檔 URI。
- **`--debug_mode`** (**`-d`**):
  - 為此工作階段啟用偵錯模式，提供更詳細的輸出。
- **`--all_files`** (**`-a`**):
  - 如果設定，則遞迴地將目前目錄中的所有檔案包含為提示的情境。
- **`--help`** (或 **`-h`**):
  - 顯示有關命令列參數的說明資訊。
- **`--show_memory_usage`**:
  - 顯示目前的記憶體使用情況。
- **`--yolo`**:
  - 啟用 YOLO 模式，該模式會自動核准所有工具呼叫。
- **`--telemetry`**:
  - 啟用[遙測](../telemetry.md)。
- **`--telemetry-target`**:
  - 設定遙測目標。更多資訊請參閱[遙測](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**:
  - 設定遙測的 OTLP 端點。更多資訊請參閱[遙測](../telemetry.md)。
- **`--telemetry-log-prompts`**:
  - 啟用遙測的提示日誌記錄。更多資訊請參閱[遙測](../telemetry.md)。
- **`--checkpointing`**:
  - 啟用[檢查點指令](./commands.md#checkpointing-commands)。
- **`--version`**:
  - 顯示 CLI 的版本。

## 情境檔案 (階層式指令情境)

雖然嚴格來說不是 CLI *行為* 的設定，但情境檔案 (預設為 `GEMINI.md`，但可透過 `contextFileName` 設定進行配置) 對於設定提供給 Gemini 模型的*指令情境* (也稱為「記憶」) 至關重要。這個強大的功能可讓您提供���案特定的指令、編碼風格指南或任何相關的背景資訊給 AI，使其回應更能針對您的需求量身打造且更準確。CLI 包含 UI 元素，例如頁尾的指示器會顯示已載入的情境檔案數量，讓您隨時了解作用中的情境。

- **目的：** 這些 Markdown 檔案包含您希望 Gemini 模型在互動期間了解的指令、指南或情境。系統設計為以階層方式管理此指令情境。

### 情境檔案內容範例 (例如 `GEMINI.md`)

這是一個概念性範例，說明 TypeScript 專案根目錄下的情境檔案可能包含的內容：

```markdown
# 專案：我的超棒 TypeScript 函式庫

## 一般指令：

- 產生新的 TypeScript 程式碼時，請遵循現有的編碼風格。
- 確保所有新函式和類別都有 JSDoc 註解。
- 在適當的情況下，偏好使用函數式程式設計範式。
- 所有程式碼都應與 TypeScript 5.0 和 Node.js 18+ 相容。

## 編碼風格：

- 使用 2 個空格進行縮排。
- 介面名稱應以 `I` 為前綴 (例如 `IUserService`)。
- 私有類別成員應以底線 (`_`) 為前綴。
- 一律使用嚴格相等 (`===` 和 `!==`)。

## 特定元件：`src/api/client.ts`

- 此檔案處理所有對外的 API 請求。
- 新增新的 API 呼叫函式時，請確保它們包含健全的錯誤處理和日誌記錄。
- 對於所有 GET 請求，請使用現有的 `fetchWithRetry` 公用程式。

## 關於相依性：

- 除非絕對必要，否則避免引入新的外部相依性。
- 如果需要新的相依性，請說明原因。
```

此範例示範了如何提供一般專案情境、特定的編碼慣例，甚至是關於特定檔案或元件的注意事項。您的情境檔案越相關、越精確，AI 就越能更好地協助您。強烈建議使用專案特定的情境檔案來建立慣例和情境。

- **階層式載入與優先順序：** CLI 透過從多個位置載入情境檔案 (例如 `GEMINI.md`) 來實作一個複雜的階層式記憶系統。此列表中較低層級 (較特定) 的檔案內容通常會覆寫或補充較高層級 (較一般) 的檔案內容。確切的串連順序和最終情境可以使用 `/memory show` 指令進行檢查。典型的載入順序是：
  1.  **全域情境檔案：**
      - 位置：`~/.gemini/<contextFileName>` (例如，您使用者家目錄中的 `~/.gemini/GEMINI.md`)。
      - 範圍：為您的所有專案提供預設指令。
  2.  **專案根目錄與上層目錄情境檔案：**
      - 位置：CLI 會在目前工作目錄中搜尋設定的情境檔案，然後在每個父目錄中向上搜尋，直到專案根目錄 (由 `.git` 資料夾識別) 或您的家目錄。
      - 範圍：提供與整個專案或其重要部分相關的情境。
  3.  **子目錄情境檔案 (情境式/本機)：**
      - 位置：CLI 也會掃描目前工作目錄*下方*的子目錄中設定的情境檔案 (遵循常見的忽略模式，如 `node_modules`, `.git` 等)。
      - 範圍：允許與專案的特定元件、模組或子區段相關的非常具體的指令。
- **串連與 UI 指示：** 所有找到的情境檔案的內容都會被串連起來 (並以分隔符號指示其來源和路徑)，並作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾會顯示已載入的情境檔案計數，讓您快速了解作用中的指令情境。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 強制重新掃描並重新載入所有設定位置的所有情境檔案。這會更新 AI 的指令情境。
  - 使用 `/memory show` 顯示目前載入的組合指令情境，讓您驗證 AI 正在使用的階層和內容。
  - 有關 `/memory` 指令及其子指令 (`show` 和 `refresh`) 的完整詳細資訊，請參閱[指令文件](./commands.md#memory)。

透過了解和利用這些設定層級以及情境檔案的階層式特性，您可以有效地管理 AI 的記憶，並根據您的特定需求和專案量身打造 Gemini CLI 的回應。

## 沙箱化

Gemini CLI 可以在沙箱環境中執行潛在不��全的作業 (如 shell 指令和檔案修改)，以保護您的系統。

沙箱預設為停用，但您可以透過幾種方式啟用它：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 在 `--yolo` 模式下，沙箱預設為啟用。

預設情況下，它會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。

對於專案特定的沙箱需求，您可以在專案根目錄的 `.gemini/sandbox.Dockerfile` 建立自訂 Dockerfile。此 Dockerfile 可以基於基礎沙箱映像檔：

```dockerfile
FROM gemini-cli-sandbox

# 在此處新增您的自訂相依性或設定
# 例如：
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當 `.gemini/sandbox.Dockerfile` 存在時，您可以在執行 Gemini CLI 時使用 `BUILD_SANDBOX` 環境變數來自動建置自訂沙箱映像檔：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用情況統計

為了協助我們改善 Gemini CLI，我們會收集匿名的使用情況統計資料。這些資料有助於我們了解 CLI 的使用方式、識別常見問題並排定新功能的優先順序。

**我們收集的內容：**

- **工具呼叫：** 我們會記錄被呼叫的工具名稱、它們是成功還是失敗，以及執行它們所需的時間。我們不收集傳遞給工具��參數或工具回傳的任何資料。
- **API 請求：** 我們會記錄每個請求使用的 Gemini 模型、請求的持續時間以及是否成功。我們不收集提示或回應的內容。
- **工作階段資訊：** 我們會收集有關 CLI 設定的資訊，例如啟用的工具和核准模式。

**我們不收集的內容：**

- **個人識別資訊 (PII)：** 我們不收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示和回應內容：** 我們不記錄您的提示內容或 Gemini 模型的回應。
- **檔案內容：** 我們不記錄 CLI 讀取或寫入的任何檔案的內容。

**如何選擇退出：**

您可以隨時透過在 `settings.json` 檔案中將 `usageStatisticsEnabled` 屬性設定為 `false` 來選擇不參與使用情況統計資料的收集：

```json
{
  "usageStatisticsEnabled": false
}
```