# Gemini CLI 設定

**關於已淘汰的設定格式說明**

本文件說明 `settings.json` 檔案的舊版 v1 格式。此格式現已被淘汰。

- 新格式將於正式版自 **[09/10/25]** 起支援。
- 從 **[09/17/25]** 起，將自動從舊格式遷移至新格式。

關於新且推薦的格式，請參閱[目前的設定文件](./configuration.md)。

Gemini CLI 提供多種方式來設定其行為，包括環境變數、命令列參數以及設定檔。本文件說明不同的設定方法與可用的設定選項。

## 設定層級

設定會依照以下優先順序套用（數字越小會被數字越大的覆蓋）：

1.  **預設值：** 內建於應用程式的預設值。
2.  **系統預設檔案：** 系統層級的預設設定，可被其他設定檔覆蓋。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案專屬設定。
5.  **系統設定檔案：** 系統層級的設定，會覆蓋所有其他設定檔。
6.  **環境變數：** 系統層級或工作階段專屬的變數，可能從 `.env` 檔案載入。
7.  **命令列參數：** 啟動 CLI 時傳入的值。

## 設定檔案

Gemini CLI 使用 JSON 設定檔來做持久化設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。可透過 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 提供系統層級的預設設定基礎。這些設定優先權最低，建議由使用者、專案或系統覆寫設定來覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 為你的家目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定會覆蓋系統預設。
- **專案設定檔案：**
  - **位置：** 專案根目錄下的 `.gemini/settings.json`。
  - **範圍：** 僅在從該專案執行 Gemini CLI 時適用。專案設定會覆蓋使用者設定與系統預設。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。可透過 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 適用於系統上所有使用者的所有 Gemini CLI 工作階段。系統設定作為覆寫，優先於所有其他設定檔。對於企業系統管理員控管使用者 Gemini CLI 設定特別有用。

**關於設定檔中的環境變數說明：** 你的 `settings.json` 檔案中的字串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法來引用環境變數。這些變數在載入設定時會自動解析。例如，若你有一個環境變數 `MY_API_TOKEN`，可以在 `settings.json` 中這樣使用：`"apiKey": "$MY_API_TOKEN"`。

> **企業用戶注意：** 關於在企業環境中部署與管理 Gemini CLI 的指引，請參閱[企業設定](./enterprise.md)文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔外，專案的 `.gemini` 目錄還可包含其他與 Gemini CLI 運作相關的專案專屬檔案，例如：

- [自訂 sandbox profiles](#沙箱機制sandboxing)（例如 `.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

### `settings.json` 中可用的設定：

- **`contextFileName`**（字串或字串陣列）：
  - **說明：** 指定 context 檔案的檔名（例如 `GEMINI.md`、`AGENTS.md`）。可為單一檔名或接受的檔名清單。
  - **預設值：** `GEMINI.md`
  - **範例：** `"contextFileName": "AGENTS.md"`

- **`bugCommand`**（物件）：
  - **說明：** 覆寫 `/bug` 指令的預設 URL。
  - **預設值：** `"urlTemplate": "https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml&title={title}&info={info}"`
  - **屬性：**
    - **`urlTemplate`**（字串）：可包含 `{title}` 與 `{info}` 占位符的 URL。
  - **範例：**
    ```json
    "bugCommand": {
      "urlTemplate": "https://bug.example.com/new?title={title}&info={info}"
    }
    ```

- **`fileFiltering`**（物件）：
  - **說明：** 控制 @ 指令與檔案探索工具的 git 感知檔案過濾行為。
  - **預設值：** `"respectGitIgnore": true, "enableRecursiveFileSearch": true`
  - **屬性：**
    - **`respectGitIgnore`**（布林值）：在探索檔案時，是否遵循 `.gitignore` 規則。當設為 `true` 時，會自動將 git 忽略的檔案（如 `node_modules/`、`dist/`、`.env`）從 @ 指令與檔案清單操作中排除。
    - **`enableRecursiveFileSearch`**（布林值）：在提示字元補全 @ 前綴時，是否啟用於目前樹狀結構下遞迴搜尋檔案名稱的功能。
    - **`disableFuzzySearch`**（布林值）：當為 `true` 時，停用檔案搜尋時的模糊搜尋功能，可提升在大量檔案專案中的效能。
  - **範例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false,
      "disableFuzzySearch": true
    }
    ```

### 檔案搜尋效能疑難排解

如果你在檔案搜尋（例如使用 `@` 補全）時遇到效能問題，特別是在擁有大量檔案的專案中，可以依照以下建議順序嘗試下列方法：

1.  **使用 `.geminiignore`：** 在專案根目錄建立 `.geminiignore` 檔案，排除包含大量你不需要參考的檔案的目錄（例如建置產物、日誌、`node_modules`）。減少爬取的檔案總數，是提升效能最有效的方法。

2.  **停用模糊搜尋（Fuzzy Search）：** 如果忽略檔案仍不足以改善效能，你可以在 `settings.json` 檔案中將 `disableFuzzySearch` 設為 `true`，以停用模糊搜尋。這將改用較簡單、非模糊的比對演算法，通常速度更快。

3.  **停用遞迴檔案搜尋：** 最後手段，你可以將 `enableRecursiveFileSearch` 設為 `false`，完全停用遞迴檔案搜尋。這是最快的選項，因為它避免了對專案的遞迴爬取。但這也表示，當你使用 `@` 補全時，必須輸入完整的檔案路徑。

- **`coreTools`**（字串陣列）：
  - **說明：** 允許你指定一組應該提供給模型使用的核心工具名稱。這可用於限制可用的內建工具集。請參考 [Built-in Tools](../core/tools-api.md#built-in-tools) 以取得核心工具清單。你也可以針對支援的工具指定指令層級的限制，例如 `ShellTool`。例如，`"coreTools": ["ShellTool(ls -l)"]` 只允許執行 `ls -l` 指令。
  - **預設值：** 所有 Gemini 模型可用的工具。
  - **範例：** `"coreTools": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]`。

- **`allowedTools`**（字串陣列）：
  - **預設值：** `undefined`
  - **說明：** 會略過確認對話框的工具名稱清單。這對你信任且經常使用的工具很有用。比對語意與 `coreTools` 相同。
  - **範例：** `"allowedTools": ["ShellTool(git status)"]`。

- **`excludeTools`**（字串陣列）：
  - **說明：** 允許你指定要從模型中排除的核心工具名稱清單。如果某工具同時出現在 `excludeTools` 與 `coreTools`，則會被排除。你也可以針對支援的工具指定指令層級的限制，例如 `ShellTool`。例如，`"excludeTools": ["ShellTool(rm -rf)"]` 會封鎖 `rm -rf` 指令。
  - **預設值：** 無排除任何工具。
  - **範例：** `"excludeTools": ["run_shell_command", "findFiles"]`。
  - **安全性注意事項：** `excludeTools` 中針對 `run_shell_command` 的指令層級限制僅基於簡單字串比對，容易被繞過。此功能**不是安全機制**，不應用於安全執行不受信任的程式碼。建議使用 `coreTools` 明確選擇允許執行的指令。

- **`allowMCPServers`**（字串陣列）：
  - **說明：** 允許你指定應該提供給模型使用的 MCP 伺服器名稱清單。這可用於限制可連線的 MCP 伺服器集合。請注意，若已設定 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值：** 所有 MCP 伺服器皆可供 Gemini 模型使用。
  - **範例：** `"allowMCPServers": ["myPythonServer"]`。
  - **安全性注意事項：** 這是針對 MCP 伺服器名稱進行簡單字串比對，名稱可能被修改。如果你是系統管理員，想防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，讓使用者無法自行設定任何 MCP 伺服器。此設定不應視為絕對安全的機制。

- **`excludeMCPServers`**（字串陣列）：
  - **說明：** 允許你指定應從模型中排除的 MCP 伺服器名稱清單。如果某伺服器同時出現在 `excludeMCPServers` 與 `allowMCPServers`，則會被排除。請注意，若已設定 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值：** 無排除任何 MCP 伺服器。
  - **範例：** `"excludeMCPServers": ["myNodeServer"]`。
  - **安全性注意事項：** 這是針對 MCP 伺服器名稱進行簡單字串比對，名稱可能被修改。如果你是系統管理員，想防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，讓使用者無法自行設定任何 MCP 伺服器。此設定不應視為絕對安全的機制。

- **`autoAccept`**（布林值）：
  - **說明：** 控制 CLI 是否會自動接受並執行被認為安全的工具呼叫（例如唯讀操作），而無需明確的使用者確認。如果設為 `true`，CLI 會略過對被認為安全工具的確認提示。
  - **預設值：** `false`
  - **範例：** `"autoAccept": true`

- **`theme`**（字串）：
  - **說明：** 設定 Gemini CLI 的視覺 [主題](./themes.md)。
  - **預設值：** `"Default"`
  - **範例：** `"theme": "GitHub"`

- **`vimMode`**（布林值）：
  - **說明：** 啟用或停用輸入編輯的 vim 模式。啟用後，輸入區域支援 vim 風格的導覽與編輯指令，包含 NORMAL 與 INSERT 模式。vim 模式狀態會顯示於頁腳，並於不同工作階段間保留。
  - **預設值：** `false`
  - **範例：** `"vimMode": true`

- **`sandbox`**（布林值或字串）：
  - **說明：** 控制工具執行時是否以及如何使用沙箱機制（sandboxing）。若設為 `true`，Gemini CLI 會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。更多資訊請參見 [Sandboxing](#沙箱機制sandboxing)。
  - **預設值：** `false`
  - **範例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`**（字串）：
  - **說明：** 定義用於從你的專案中發現工具的自訂 shell 指令。該 shell 指令必須在 `stdout` 上回傳一個 [function declarations](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 的 JSON 陣列。工具包裝器（tool wrappers）為選用。
  - **預設值：** 空值
  - **範例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`**（字串）：
  - **說明：** 定義用於呼叫透過 `toolDiscoveryCommand` 發現的特定工具的自訂 shell 指令。該 shell 指令必須符合以下條件：
    - 必須將 function `name`（格式與 [function declaration](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 完全相同）作為第一個命令列參數。
    - 必須在 `stdin` 上以 JSON 讀取 function 參數，類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 必須在 `stdout` 上以 JSON 回傳 function 輸出，類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **預設值：** 空值
  - **範例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`**（物件）：
  - **說明：** 設定一個或多個 Model-Context Protocol (MCP) 伺服器的連線，用於發現與使用自訂工具。Gemini CLI 會嘗試連線至每個已設定的 MCP 伺服器以發現可用工具。如果多個 MCP 伺服器提供同名工具，工具名稱會加上你在設定中定義的伺服器別名（例如 `serverAlias__actualToolName`）以避免衝突。請注意，系統可能會為了相容性，從 MCP 工具定義中移除部分 schema 屬性。`command`、`url` 或 `httpUrl` 至少需提供其中一項。若同時指定多項，優先順序為 `httpUrl`，再來是 `url`，最後是 `command`。
  - **預設值：** 空值
  - **屬性：**
    - **`<SERVER_NAME>`**（物件）：指定伺服器的參數。
      - `command`（字串，選填）：透過標準輸入/輸出啟動 MCP 伺服器的執行指令。
      - `args`（字串陣列，選填）：傳遞給指令的參數。
      - `env`（物件，選填）：要設定給伺服器程序的環境變數。
      - `cwd`（字串，選填）：啟動伺服器時的工作目錄。
      - `url`（字串，選填）：使用 Server-Sent Events (SSE) 通訊的 MCP 伺服器 URL。
      - `httpUrl`（字串，選填）：使用可串流 HTTP 通訊的 MCP 伺服器 URL。
      - `headers`（物件，選填）：發送至 `url` 或 `httpUrl` 請求時的 HTTP 標頭對應表。
      - `timeout`（數值，選填）：對此 MCP 伺服器請求的逾時（毫秒）。
      - `trust`（布林值，選填）：信任此伺服器並略過所有工具呼叫確認。
      - `description`（字串，選填）：伺服器的簡短描述，可能用於顯示。
      - `includeTools`（字串陣列，選填）：要從此 MCP 伺服器納入的工具名稱清單。若有指定，僅此清單內的工具可用（白名單行為）。若未指定，預設啟用伺服器所有工具。
      - `excludeTools`（字串陣列，選填）：要從此 MCP 伺服器排除的工具名稱清單。即使伺服器有提供，這些工具也不會提供給模型。**注意：** `excludeTools` 優先於 `includeTools`——若工具同時出現在兩者，將會被排除。
  - **範例：**
    ```json
    "mcpServers": {
      "myPythonServer": {
        "command": "python",
        "args": ["mcp_server.py", "--port", "8080"],
        "cwd": "./mcp_tools/python",
        "timeout": 5000,
        "includeTools": ["safe_tool", "file_reader"],
      },
      "myNodeServer": {
        "command": "node",
        "args": ["mcp_server.js"],
        "cwd": "./mcp_tools/node",
        "excludeTools": ["dangerous_tool", "file_deleter"]
      },
      "myDockerServer": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "-e", "API_KEY", "ghcr.io/foo/bar"],
        "env": {
          "API_KEY": "$MY_API_TOKEN"
        }
      },
      "mySseServer": {
        "url": "http://localhost:8081/events",
        "headers": {
          "Authorization": "Bearer $MY_SSE_TOKEN"
        },
        "description": "An example SSE-based MCP server."
      },
      "myStreamableHttpServer": {
        "httpUrl": "http://localhost:8082/stream",
        "headers": {
          "X-API-Key": "$MY_HTTP_API_KEY"
        },
        "description": "An example Streamable HTTP-based MCP server."
      }
    }
    ```

- **`checkpointing`**（物件）：
  - **說明：** 設定 checkpointing（檢查點）功能，允許你儲存與還原對話和檔案狀態。詳情請參閱 [Checkpointing documentation](../checkpointing.md)。
  - **預設值：** `{"enabled": false}`
  - **屬性：**
    - **`enabled`**（布林值）：當為 `true` 時，`/restore` 指令可用。

- **`preferredEditor`**（字串）：
  - **說明：** 指定用於檢視 diff 的偏好編輯器。
  - **預設值：** `vscode`
  - **範例：** `"preferredEditor": "vscode"`

- **`telemetry`**（物件）
  - **說明：** 設定 Gemini CLI 的日誌與遙測 (telemetry) 收集。更多資訊請參閱 [Telemetry](../telemetry.md)。
  - **預設值：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **屬性：**
    - **`enabled`**（布林值）：是否啟用遙測 (telemetry)。
    - **`target`**（字串）：收集到的遙測 (telemetry) 資料的目的地。支援的值為 `local` 和 `gcp`。
    - **`otlpEndpoint`**（字串）：OTLP Exporter 的端點。
    - **`logPrompts`**（布林值）：是否在日誌中包含使用者提示內容。
  - **範例：**
    ```json
    "telemetry": {
      "enabled": true,
      "target": "local",
      "otlpEndpoint": "http://localhost:16686",
      "logPrompts": false
    }
    ```
- **`usageStatisticsEnabled`**（布林值）：
  - **說明：**啟用或停用使用狀況統計資料的收集。詳情請參見[Usage Statistics](#使用統計資料)。
  - **預設值：**`true`
  - **範例：**
    ```json
    "usageStatisticsEnabled": false
    ```

- **`hideTips`**（布林值）：
  - **說明：**啟用或停用命令列介面（Command Line Interface）中的提示說明功能。
  - **預設值：**`false`
  - **範例：**

    ```json
    "hideTips": true
    ```

- **`hideBanner`**（布林值）：
  - **說明：**啟用或停用命令列介面（Command Line Interface）中的啟動畫面橫幅（ASCII 藝術風格 logo）。
  - **預設值：**`false`
  - **範例：**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`** (number):
  - **說明：** 設定單一 session（會話）的最大回合數。如果 session 超過此限制，命令列介面 (Command Line Interface) 將停止處理並啟動新的聊天。
  - **預設值：** `-1`（無限制）
  - **範例：**
    ```json
    "maxSessionTurns": 10
    ```

- **`summarizeToolOutput`**（物件）：
  - **說明：**啟用或停用工具輸出的摘要功能。你可以使用 `tokenBudget` 設定來指定摘要的 token 預算。
  - 注意：目前僅支援 `run_shell_command` 工具。
  - **預設值：**`{}`（預設為停用）
  - **範例：**
    ```json
    "summarizeToolOutput": {
      "run_shell_command": {
        "tokenBudget": 2000
      }
    }
    ```

- **`excludedProjectEnvVars`**（字串陣列）：
  - **說明：** 指定應該排除、不從專案`.env`檔案載入的環境變數。這可避免專案專屬的環境變數（例如 `DEBUG=true`）影響 Gemini CLI 的行為。來自`.gemini/.env`檔案的變數永遠不會被排除。
  - **預設值：** `["DEBUG", "DEBUG_MODE"]`
  - **範例：**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`**（字串陣列）：
  - **說明：** 指定一組額外的絕對路徑或相對路徑，將其納入 workspace context。預設情況下，缺少的目錄會跳過並顯示警告。路徑中可以使用`~`來指向使用者的家目錄。此設定可與`--include-directories`命令列旗標 (flags) 一起使用。
  - **預設值：** `[]`
  - **範例：**
    ```json
    "includeDirectories": [
      "/path/to/another/project",
      "../shared-library",
      "~/common-utils"
    ]
    ```

- **`loadMemoryFromIncludeDirectories`**（布林值）：
  - **說明：** 控制`/memory refresh`指令的行為。若設定為`true`，則應從所有已加入的目錄載入`GEMINI.md`檔案。若設定為`false`，則僅從目前目錄載入`GEMINI.md`。
  - **預設值：** `false`
  - **範例：**
    ```json
    "loadMemoryFromIncludeDirectories": true
    ```

- **`chatCompression`**（物件）：
  - **說明：** 控制聊天記錄壓縮的設定，包含自動壓縮以及透過 `/compress` 指令手動觸發時的行為。
  - **屬性：**
    - **`contextPercentageThreshold`**（數值）：介於 0 到 1 之間的數值，用來指定壓縮觸發的 token 門檻，該值為模型總 token 限制的百分比。例如，若設為 `0.6`，則當聊天記錄超過 token 限制的 60% 時會觸發壓縮。
  - **範例：**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`**（布林值）：
  - **說明：** 控制在命令列介面（Command Line Interface）輸出中的程式碼區塊是否顯示行號。
  - **預設值：** `true`
  - **範例：**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`**（物件）：
  - **說明：** 設定命令列介面 (Command Line Interface) 的無障礙功能。
  - **屬性：**
    - **`screenReader`**（布林值）：啟用螢幕閱讀器模式，會調整 TUI 以提升與螢幕閱讀器的相容性。此功能也可透過 `--screen-reader` 旗標 (flags) 啟用，若同時設定，旗標 (flags) 優先。
    - **`disableLoadingPhrases`**（布林值）：停用操作期間顯示載入提示語。
  - **預設值：**`{"screenReader": false, "disableLoadingPhrases": false}`
  - **範例：**
    ```json
    "accessibility": {
      "screenReader": true,
      "disableLoadingPhrases": true
    }
    ```

### 範例 `settings.json`:

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
  "usageStatisticsEnabled": true,
  "hideTips": false,
  "hideBanner": false,
  "maxSessionTurns": 10,
  "summarizeToolOutput": {
    "run_shell_command": {
      "tokenBudget": 100
    }
  },
  "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"],
  "includeDirectories": ["path/to/dir1", "~/path/to/dir2", "../path/to/dir3"],
  "loadMemoryFromIncludeDirectories": true
}
```

## Shell 歷史紀錄

Gemini CLI 會保留你執行過的 shell 指令歷史。為了避免不同專案間的衝突，這些歷史紀錄會儲存在你使用者家目錄下專案專屬的目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是根據你的專案根目錄路徑產生的唯一識別碼。
  - 歷史紀錄會儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常見方式，特別適合用於 API 金鑰等敏感資訊，或是在不同環境間可能會變動的設定。若需設定驗證，請參閱 [Authentication documentation](./authentication.md)，其中涵蓋所有可用的驗證方法。

Gemini CLI 會自動從 `.env` 檔案載入環境變數。載入順序如下：

1.  目前工作目錄下的 `.env` 檔案。
2.  若找不到，則會往上搜尋父目錄，直到找到 `.env` 檔案，或抵達專案根目錄（以 `.git` 資料夾識別）或家目錄為止。
3.  若仍找不到，則會尋找使用者家目錄下的 `~/.env`。

**環境變數排除說明：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除，以避免影響 gemini-cli 的行為。來自 `.gemini/.env` 檔案的變數則永遠不會被排除。你可以透過在 `settings.json` 檔案中設定 `excludedProjectEnvVars` 來自訂這個行為。

- **`GEMINI_API_KEY`**：
  - 你的 Gemini API 金鑰。
  - 為多種 [驗證方法](./authentication.md) 之一。
  - 可在 shell 設定檔（如 `~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中設定。
- **`GEMINI_MODEL`**：
  - 指定預設要使用的 Gemini 模型。
  - 會覆蓋內建預設值。
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 你的 Google Cloud API 金鑰。
  - 使用 Vertex AI Express Mode 時必填。
  - 請確保你擁有必要的權限。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 你的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 時必填。
  - 若使用 Vertex AI，請確保你在此專案中擁有必要權限。
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境下執行時，此變數預設為 Cloud Shell 使用者分配的特殊專案。如果你在 Cloud Shell 的全域環境中已設定 `GOOGLE_CLOUD_PROJECT`，將會被此預設值覆蓋。若要在 Cloud Shell 中使用其他專案，必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 你的 Google Application Credentials JSON 檔案路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 你在 Google Cloud 上用於遙測 (telemetry) 的專案 ID。
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 你的 Google Cloud 專案位置（例如 us-central1）。
  - 使用 Vertex AI 非 Express Mode 時必填。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - 作為 `settings.json` 中 `sandbox` 設定的替代方案。
  - 可接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`**（僅限 macOS）：
  - 切換 macOS 上的 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）限制僅能寫入專案資料夾（及其他少數資料夾，詳見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），但允許其他操作。
  - `strict`：使用嚴格設定檔，預設拒絕所有操作。
  - `<profile_name>`：使用自訂設定檔。若要定義自訂設定檔，請在專案的 `.gemini/` 目錄下建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如 `my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（常由底層函式庫或 CLI 本身使用）：
  - 設為 `true` 或 `1` 可啟用詳細的除錯日誌，有助於故障排除。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案中排除，以避免影響 gemini-cli 行為。若需專為 gemini-cli 設定，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設定任意值即可停用 CLI 所有顏色輸出。
- **`CLI_TITLE`**：
  - 設定字串以自訂 CLI 標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定 code assist server 的 endpoint。
  - 適用於開發與測試用途。

## 命令列參數

直接在執行 Gemini CLI 時傳入的參數，可覆蓋該次會話的其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定本次會話要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 直接將提示詞（prompt）傳給指令。這會以非互動模式啟動 Gemini CLI。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以指定的提示詞作為初始輸入啟動互動式會話。
  - 提示詞會在互動式會話中處理，而非會話啟動前。
  - 無法與從 stdin 管線輸入同時使用。
  - 範例：`gemini -i "explain this code"`
- **`--sandbox`**（**`-s`**）：
  - 啟用本次會話的沙箱模式（sandbox mode）。
- **`--sandbox-image`**：
  - 設定沙箱映像 URI。
- **`--debug`**（**`-d`**）：
  - 啟用本次會話的除錯模式，提供更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 若設定，會將目前目錄下所有檔案遞迴納入提示詞 context。
- **`--help`**（或 **`-h`**）：
  - 顯示命令列參數的說明資訊。
- **`--show-memory-usage`**：
  - 顯示目前記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動核准所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的核准模式。可用模式：
    - `default`：每次工具呼叫時提示核准（預設行為）
    - `auto_edit`：自動核准編輯類工具（replace、write_file），其他仍需提示
    - `yolo`：自動核准所有工具呼叫（等同於 `--yolo`）
  - 不可與 `--yolo` 同時使用。建議改用 `--approval-mode=yolo` 取代 `--yolo`，以採用新的統一方式。
  - 範例：`gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**：
  - 以逗號分隔的工具名稱清單，這些工具將略過確認對話框。
  - 範例：`gemini --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**：
  - 啟用 [遙測 (telemetry)](../telemetry.md)。
- **`--telemetry-target`**：
  - 設定遙測目標。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**：
  - 設定遙測的 OTLP endpoint。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-protocol`**：
  - 設定遙測的 OTLP 協定（`grpc` 或 `http`），預設為 `grpc`。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-log-prompts`**：
  - 啟用提示詞記錄以用於遙測。詳見 [telemetry](../telemetry.md)。
- **`--checkpointing`**：
  - 啟用 [checkpointing](../checkpointing.md)。
- **`--extensions <extension_name ...>`**（**`-e <extension_name ...>`**）：
  - 指定本次會話要使用的擴充套件清單。若未指定，則預設載入所有可用擴充套件。
  - 使用特殊詞 `gemini -e none` 可停用所有擴充套件。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用擴充套件並結束程式。
- **`--proxy`**：
  - 設定 CLI 的 proxy。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在 workspace 中納入額外目錄，以支援多個目錄。
  - 可重複指定，或以逗號分隔多個值。
  - 最多可新增 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕閱讀器模式以提升無障礙性。
- **`--version`**：
  - 顯示 CLI 版本。

## Context 檔案（階層式指令 context）

雖然 context 檔案（預設為 `GEMINI.md`，可透過 `contextFileName` 設定自訂）不算是 CLI「行為」的設定，但它們對於設定提供給 Gemini 模型的「指令 context」（亦稱為「記憶體」）至關重要。這個強大的功能讓你能針對專案提供指令、程式碼風格指引或其他相關背景資訊，使 AI 回應更貼合你的需求。CLI 也包含 UI 元件，例如頁腳會顯示已載入 context 檔案數量，方便你隨時掌握目前的 context 狀態。

- **用途：** 這些 Markdown 檔案用來存放你希望 Gemini 模型在互動過程中能參考的指令、指引或 context。系統會以階層式方式管理這些指令 context。

### 範例 Context 檔案內容（例如 `GEMINI.md`）

以下是一個 TypeScript 專案根目錄下 context 檔案的概念範例內容：

```markdown
# Project: My Awesome TypeScript Library

## General Instructions:

- When generating new TypeScript code, please follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- All code should be compatible with TypeScript 5.0 and Node.js 20+.

## Coding Style:

- Use 2 spaces for indentation.
- Interface names should be prefixed with `I` (e.g., `IUserService`).
- Private class members should be prefixed with an underscore (`_`).
- Always use strict equality (`===` and `!==`).

## Specific Component: `src/api/client.ts`

- This file handles all outbound API requests.
- When adding new API call functions, ensure they include robust error handling and logging.
- Use the existing `fetchWithRetry` utility for all GET requests.

## Regarding Dependencies:

- Avoid introducing new external dependencies unless absolutely necessary.
- If a new dependency is required, please state the reason.
```

以下範例說明如何提供一般專案 context、特定程式撰寫慣例，甚至針對特定檔案或元件添加註解。您的 context 檔案越相關且精確，AI 的協助效果就越好。強烈建議建立專案專屬的 context 檔案，以建立慣例與 context。

- **階層式載入與優先順序：**  
  Gemini CLI 透過從多個位置載入 context 檔案（例如 `GEMINI.md`），實作了先進的階層式記憶體系統。清單中較下方（更具體）的檔案內容，通常會覆蓋或補充較上方（較一般性）檔案的內容。實際串接順序與最終 context 可透過 `/memory show` 指令檢查。一般載入順序如下：
  1.  **全域 Context 檔案：**
      - 位置：`~/.gemini/<contextFileName>`（例如您使用者家目錄下的 `~/.gemini/GEMINI.md`）。
      - 範圍：為您所有專案提供預設指示。
  2.  **專案根目錄與上層目錄 Context 檔案：**
      - 位置：Gemini CLI 會在目前工作目錄，然後依序往上至專案根目錄（以 `.git` 資料夾識別）或您的家目錄，搜尋已設定的 context 檔案。
      - 範圍：提供與整個專案或其主要部分相關的 context。
  3.  **子目錄 Context 檔案（情境／區域性）：**
      - 位置：Gemini CLI 也會在目前工作目錄以下的子目錄中，搜尋已設定的 context 檔案（會遵循常見的忽略模式，如 `node_modules`、`.git` 等）。預設最多搜尋 200 個目錄，可透過您的 `settings.json` 檔案中的 `memoryDiscoveryMaxDirs` 欄位調整。
      - 範圍：允許針對專案中特定元件、模組或子區塊，提供高度專屬的指示。
- **串接與 UI 指示：**  
  所有找到的 context 檔案內容會串接起來（並以分隔符標示來源與路徑），作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾會顯示已載入 context 檔案的數量，讓您能快速掌握目前啟用的指示 context。
- **內容匯入：**  
  您可以使用 `@path/to/file.md` 語法，將其他 Markdown 檔案模組化匯入您的 context 檔案。詳情請參閱 [Memory Import Processor 文件](../core/memport.md)。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 可強制重新掃描並重新載入所有已設定位置的 context 檔案，更新 AI 的指示 context。
  - 使用 `/memory show` 可顯示目前已載入的合併指示 context，方便您驗證 AI 正在使用的階層與內容。
  - `/memory` 指令及其子指令（`show` 與 `refresh`）的完整說明，請參閱 [指令文件](./commands.md#memory)。

透過理解並善用這些設定層級與 context 檔案的階層特性，您可以有效管理 AI 的記憶體，並根據您的專案需求，調整 Gemini CLI 的回應。

## 沙箱機制（Sandboxing）

Gemini CLI 可在沙箱機制（sandboxed environment）中執行具有潛在風險的操作（如 shell 指令與檔案修改），以保護您的系統。

沙箱機制預設為關閉，您可以透過下列方式啟用：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 當使用 `--yolo` 或 `--approval-mode=yolo` 時，預設會啟用沙箱機制。

預設會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。

若有專案專屬的沙箱需求，您可以在專案根目錄下的 `.gemini/sandbox.Dockerfile` 建立自訂 Dockerfile。此 Dockerfile 可基於預設的沙箱映像檔進行擴充：

```dockerfile
FROM gemini-cli-sandbox

# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當`.gemini/sandbox.Dockerfile`存在時，你可以在執行 Gemini CLI 時使用`BUILD_SANDBOX`環境變數，來自動建置自訂的 sandbox 映像檔：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用統計資料

為了協助我們改進 Gemini CLI，我們會收集匿名化的使用統計資料。這些資料有助於我們了解 CLI 的使用情況、識別常見問題，並協助新功能的優先排序。

**我們會收集的內容：**

- **工具呼叫（Tool Calls）：**我們會記錄被呼叫的工具名稱、執行是否成功，以及執行所需的時間。我們不會收集傳遞給工具的參數或工具回傳的任何資料。
- **API 請求（API Requests）：**我們會記錄每次請求所使用的 Gemini 模型、請求的持續時間，以及是否成功。我們不會收集提示詞（prompt）或回應的內容。
- **工作階段資訊（Session Information）：**我們會收集 CLI 的組態資訊，例如已啟用的工具和審核（approval）模式。

**我們不會收集的內容：**

- **個人識別資訊（Personally Identifiable Information, PII）：**我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示詞與回應內容（Prompt and Response Content）：**我們不會記錄您的提示詞內容或 Gemini 模型的回應內容。
- **檔案內容（File Content）：**我們不會記錄任何由 CLI 讀取或寫入檔案的內容。

**如何選擇不參與（opt out）：**

您可以隨時在您的 `settings.json` 檔案中，將 `usageStatisticsEnabled` 屬性設為 `false`，以選擇不參與使用統計資料的收集：

```json
{
  "usageStatisticsEnabled": false
}
```
