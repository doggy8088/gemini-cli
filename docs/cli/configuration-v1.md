# Gemini CLI 設定

**關於已淘汰的設定格式說明**

本文件說明 `settings.json` 檔案的舊版 v1 格式。此格式現已被淘汰。

- 新格式將於穩定版本自 **[09/10/25]** 起支援。
- 從舊格式自動遷移至新格式將於 **[09/17/25]** 開始。

關於新建議格式的詳細資訊，請參閱[目前的設定文件](./configuration.md)。

Gemini CLI 提供多種設定方式，包括環境變數、命令列參數以及設定檔。本文件將說明不同的設定方法及可用的設定選項。

## 設定層級

設定會依照以下優先順序套用（數字越小者會被數字較大的覆蓋）：

1.  **預設值：** 應用程式內建的預設值。
2.  **系統預設檔案：** 系統層級的預設設定，可被其他設定檔覆蓋。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案專屬的設定。
5.  **系統設定檔案：** 系統層級的設定，會覆蓋所有其他設定檔。
6.  **環境變數：** 系統層級或工作階段專屬的變數，可能從 `.env` 檔案載入。
7.  **命令列參數：** 啟動 CLI 時傳遞的值。

## 設定檔案

Gemini CLI 使用 JSON 設定檔案來進行持久化設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。可透過 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 提供系統層級的預設設定基礎。此設定優先權最低，建議由使用者、專案或系統覆寫設定來覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 為你的家目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定會覆蓋系統預設。
- **專案設定檔案：**
  - **位置：** 你的專案根目錄下的 `.gemini/settings.json`。
  - **範圍：** 僅在從該專案執行 Gemini CLI 時適用。專案設定會覆蓋使用者設定與系統預設。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。可透過 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 適用於系統上所有使用者的 Gemini CLI 工作階段。系統設定作為覆蓋層，優先於所有其他設定檔。對於企業環境的系統管理員控管使用者的 Gemini CLI 設定特別有用。

**關於設定檔中的環境變數說明：** 你的 `settings.json` 檔案中的字串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法來引用環境變數。這些變數在載入設定時會自動解析。例如，若你有環境變數 `MY_API_TOKEN`，可以在 `settings.json` 中這樣使用：`"apiKey": "$MY_API_TOKEN"`。

> **企業用戶注意：** 關於在企業環境中部署與管理 Gemini CLI 的指引，請參閱[企業設定](./enterprise.md)文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔外，專案的 `.gemini` 目錄還可包含其他與 Gemini CLI 運作相關的專案專屬檔案，例如：

- [自訂 sandbox profiles](#sandboxing)（如 `.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

### `settings.json` 中可用的設定：

- **`contextFileName`**（字串或字串陣列）：
  - **說明：** 指定 context 檔案的檔名（如 `GEMINI.md`、`AGENTS.md`）。可為單一檔名或多個可接受檔名的清單。
  - **預設值：** `GEMINI.md`
  - **範例：** `"contextFileName": "AGENTS.md"`

- **`bugCommand`**（物件）：
  - **說明：** 覆蓋 `/bug` 指令的預設 URL。
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
    - **`respectGitIgnore`**（布林值）：在探索檔案時，是否遵循 `.gitignore` 規則。當設為 `true` 時，會自動將被 git 忽略的檔案（如 `node_modules/`、`dist/`、`.env`）從 @ 指令與檔案列舉操作中排除。
    - **`enableRecursiveFileSearch`**（布林值）：在提示字元中補全 @ 前綴時，是否啟用於目前目錄樹下遞迴搜尋檔案名稱的功能。
    - **`disableFuzzySearch`**（布林值）：當為 `true` 時，停用檔案搜尋時的模糊搜尋功能，可提升大型專案的效能。
  - **範例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false,
      "disableFuzzySearch": true
    }
    ```

### 檔案搜尋效能疑難排解

如果你在進行檔案搜尋（例如使用 `@` 補全）時遇到效能問題，特別是在擁有大量檔案的專案中，以下是幾個建議的解決方法，依推薦順序排列：

1.  **使用 `.geminiignore`：** 在你的專案根目錄建立一個 `.geminiignore` 檔案，排除包含大量你不需要參考的檔案的目錄（例如建置產物、日誌、`node_modules` 等）。減少被爬取的檔案總數是提升效能最有效的方法。

2.  **停用模糊搜尋：** 如果僅忽略檔案仍不足以改善效能，你可以在 `settings.json` 檔案中將 `disableFuzzySearch` 設為 `true`，以停用模糊搜尋。這會改用較簡單、非模糊的比對演算法，通常速度更快。

3.  **停用遞迴檔案搜尋：** 最後手段，你可以將 `enableRecursiveFileSearch` 設為 `false`，完全停用遞迴檔案搜尋。這是最快的選項，因為它避免了對專案的遞迴爬取。不過，這表示你在使用 `@` 補全時，必須輸入檔案的完整路徑。

- **`coreTools`**（字串陣列）：
  - **說明：** 允許你指定一組應該提供給模型使用的核心工具名稱。這可以用來限制可用的內建工具集。請參閱 [Built-in Tools](../core/tools-api.md#built-in-tools) 以取得核心工具清單。你也可以針對支援的工具指定特定指令的限制，例如 `ShellTool`。舉例來說，`"coreTools": ["ShellTool(ls -l)"]` 只允許執行 `ls -l` 指令。
  - **預設值：** 所有 Gemini 模型可用的工具。
  - **範例：** `"coreTools": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]`。

- **`allowedTools`**（字串陣列）：
  - **預設值：** `undefined`
  - **說明：** 一組工具名稱清單，這些工具將略過確認對話框。這對於你信任且經常使用的工具很有用。比對語意與 `coreTools` 相同。
  - **範例：** `"allowedTools": ["ShellTool(git status)"]`。

- **`excludeTools`**（字串陣列）：
  - **說明：** 允許你指定一組應從模型中排除的核心工具名稱。如果某個工具同時出現在 `excludeTools` 和 `coreTools`，則會被排除。你也可以針對支援的工具指定特定指令的限制，例如 `ShellTool`。舉例來說，`"excludeTools": ["ShellTool(rm -rf)"]` 會封鎖 `rm -rf` 指令。
  - **預設值：** 不排除任何工具。
  - **範例：** `"excludeTools": ["run_shell_command", "findFiles"]`。
  - **安全性注意事項：** `excludeTools` 中針對 `run_shell_command` 的特定指令限制僅採用簡單字串比對，容易被繞過。此功能**不是安全機制**，不應用於安全執行不受信任的程式碼。建議使用 `coreTools` 明確選擇允許執行的指令。

- **`allowMCPServers`**（字串陣列）：
  - **說明：** 允許你指定一組應提供給模型使用的 MCP 伺服器名稱。這可以用來限制可連線的 MCP 伺服器集合。請注意，若已設定 `--allowed-mcp-server-names`，此設定會被忽略。
  - **預設值：** 所有 MCP 伺服器皆可供 Gemini 模型使用。
  - **範例：** `"allowMCPServers": ["myPythonServer"]`。
  - **安全性注意事項：** 這是根據 MCP 伺服器名稱進行簡單字串比對，名稱可被修改。若你是系統管理員並希望防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，使使用者無法自行設定任何 MCP 伺服器。此設定不應視為嚴密的安全機制。

- **`excludeMCPServers`**（字串陣列）：
  - **說明：** 允許你指定一組應從模型中排除的 MCP 伺服器名稱。如果某個伺服器同時出現在 `excludeMCPServers` 和 `allowMCPServers`，則會被排除。請注意，若已設定 `--allowed-mcp-server-names`，此設定會被忽略。
  - **預設值：** 不排除任何 MCP 伺服器。
  - **範例：** `"excludeMCPServers": ["myNodeServer"]`。
  - **安全性注意事項：** 這是根據 MCP 伺服器名稱進行簡單字串比對，名稱可被修改。若你是系統管理員並希望防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，使使用者無法自行設定任何 MCP 伺服器。此設定不應視為嚴密的安全機制。

- **`autoAccept`**（布林值）：
  - **說明：** 控制命令列介面 (CLI) 是否自動接受並執行被認定為安全（例如唯讀操作）的工具呼叫，而無需明確的使用者確認。如果設為 `true`，CLI 會略過安全工具的確認提示。
  - **預設值：** `false`
  - **範例：** `"autoAccept": true`

- **`theme`**（字串）：
  - **說明：** 設定 Gemini CLI 的視覺 [主題](./themes.md)。
  - **預設值：** `"Default"`
  - **範例：** `"theme": "GitHub"`

- **`vimMode`**（布林值）：
  - **說明：** 啟用或停用輸入編輯的 vim 模式。啟用後，輸入區域支援 vim 風格的導覽與編輯指令，包含 NORMAL 與 INSERT 模式。vim 模式的狀態會顯示在頁腳，並於不同工作階段間保留。
  - **預設值：** `false`
  - **範例：** `"vimMode": true`

- **`sandbox`**（布林值或字串）：
  - **說明：** 控制工具執行時是否以及如何啟用沙箱機制 (sandboxing)。若設為 `true`，Gemini CLI 會使用預建的 `gemini-cli-sandbox` Docker 映像檔。詳情請參閱 [Sandboxing](#sandboxing)。
  - **預設值：** `false`
  - **範例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`**（字串）：
  - **說明：** 定義一個自訂的 shell 指令，用於從你的專案中發現工具。該 shell 指令必須在 `stdout` 上回傳一個 [function declarations](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 的 JSON 陣列。工具包裝器為選用。
  - **預設值：** 空值
  - **範例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`**（字串）：
  - **說明：** 定義一個自訂的 shell 指令，用於呼叫透過 `toolDiscoveryCommand` 發現的特定工具。該 shell 指令必須符合下列條件：
    - 必須將 function `name`（格式同 [function declaration](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations)）作為第一個命令列參數。
    - 必須從 `stdin` 讀取 function 參數（JSON 格式），類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 必須在 `stdout` 上以 JSON 格式回傳 function 輸出，類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **預設值：** 空值
  - **範例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`**（物件）：
  - **說明：** 設定一個或多個 Model-Context Protocol (MCP) 伺服器的連線，用於發現與使用自訂工具。Gemini CLI 會嘗試連線到每個已設定的 MCP 伺服器，以發現可用工具。若多個 MCP 伺服器提供同名工具，工具名稱會加上你在設定中定義的伺服器別名（例如 `serverAlias__actualToolName`），以避免衝突。請注意，系統可能會為相容性而移除 MCP 工具定義中的部分 schema 屬性。`command`、`url` 或 `httpUrl` 至少需提供一項。若同時指定多項，優先順序為 `httpUrl`，再來是 `url`，最後是 `command`。
  - **預設值：** 空值
  - **屬性：**
    - **`<SERVER_NAME>`**（物件）：指定伺服器名稱的伺服器參數。
      - `command`（字串，可選）：啟動 MCP 伺服器（透過標準輸入/輸出）的指令。
      - `args`（字串陣列，可選）：傳遞給指令的參數。
      - `env`（物件，可選）：伺服器程序需設定的環境變數。
      - `cwd`（字串，可選）：啟動伺服器時的工作目錄。
      - `url`（字串，可選）：採用 Server-Sent Events (SSE) 通訊的 MCP 伺服器 URL。
      - `httpUrl`（字串，可選）：採用可串流 HTTP 通訊的 MCP 伺服器 URL。
      - `headers`（物件，可選）：發送至 `url` 或 `httpUrl` 請求時的 HTTP 標頭對應表。
      - `timeout`（數值，可選）：此 MCP 伺服器請求的逾時時間（毫秒）。
      - `trust`（布林值，可選）：信任此伺服器並略過所有工具呼叫確認。
      - `description`（字串，可選）：伺服器的簡要描述，可用於顯示用途。
      - `includeTools`（字串陣列，可選）：此 MCP 伺服器允許的工具名稱清單。若有指定，僅允許這裡列出的工具（白名單行為）。若未指定，預設啟用伺服器的所有工具。
      - `excludeTools`（字串陣列，可選）：此 MCP 伺服器需排除的工具名稱清單。即使伺服器有提供，這裡列出的工具也不會提供給模型。**注意：** `excludeTools` 優先於 `includeTools`——若工具同時出現在兩者，將會被排除。
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
  - **說明：** 設定 checkpointing（檢查點）功能，可讓你儲存與還原對話及檔案狀態。詳情請參閱 [Checkpointing documentation](../checkpointing.md)。
  - **預設值：** `{"enabled": false}`
  - **屬性：**
    - **`enabled`**（布林值）：當`true`時，`/restore` 指令可用。

- **`preferredEditor`**（字串）：
  - **說明：** 指定用於檢視差異（diffs）的偏好編輯器。
  - **預設值：** `vscode`
  - **範例：** `"preferredEditor": "vscode"`

- **`telemetry`**（物件）
  - **說明：** 設定 Gemini CLI 的日誌與遙測 (telemetry) 資料收集。更多資訊請參閱 [Telemetry](../telemetry.md)。
  - **預設值：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **屬性：**
    - **`enabled`**（布林值）：是否啟用遙測 (telemetry)。
    - **`target`**（字串）：收集到的遙測 (telemetry) 資料的目的地。支援的值有 `local` 與 `gcp`。
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
  - **說明：**啟用或停用使用狀況統計資料的收集。詳情請參閱[使用狀況統計資料](#usage-statistics)。
  - **預設值：**`true`
  - **範例：**
    ```json
    "usageStatisticsEnabled": false
    ```

- **`hideTips`**（布林值）：
  - **說明：** 啟用或停用命令列介面 (CLI) 中的提示說明功能。
  - **預設值：** `false`
  - **範例：**

    ```json
    "hideTips": true
    ```

- **`hideBanner`** (boolean):
  - **說明：** 啟用或停用命令列介面 (CLI) 啟動畫面橫幅（ASCII 藝術字 logo）。
  - **預設值：** `false`
  - **範例：**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`** (number):
  - **說明：** 設定單一對話階段（session）的最大輪數。如果該對話階段超過此上限，命令列介面 (CLI) 將停止處理並啟動新的聊天。
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
  - **說明：** 指定應該排除、不從專案 `.env` 檔案載入的環境變數。這可防止專案專屬的環境變數（例如 `DEBUG=true`）影響 Gemini CLI 的行為。來自 `.gemini/.env` 檔案的變數則永遠不會被排除。
  - **預設值：** `["DEBUG", "DEBUG_MODE"]`
  - **範例：**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`**（字串陣列）：
  - **說明：** 指定額外要納入 workspace context 的絕對或相對路徑陣列。預設情況下，若目錄不存在，會顯示警告並略過。路徑中可以使用 `~` 來指向使用者的家目錄。此設定可與 `--include-directories` 命令列旗標 (flags) 搭配使用。
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
  - **說明：** 控制`/memory refresh`指令的行為。若設為`true`，則應從所有已加入的目錄載入`GEMINI.md`檔案。若設為`false`，則僅從目前目錄載入`GEMINI.md`。
  - **預設值：** `false`
  - **範例：**
    ```json
    "loadMemoryFromIncludeDirectories": true
    ```

- **`chatCompression`**（物件）：
  - **說明：** 控制聊天記錄壓縮的設定，包含自動壓縮以及透過 `/compress` 指令手動觸發壓縮時的行為。
  - **屬性：**
    - **`contextPercentageThreshold`**（數值）：介於 0 到 1 之間的數值，用來指定壓縮觸發的 token 門檻，表示為模型總 token 限制的百分比。例如，若設定為 `0.6`，則當聊天記錄超過 token 限制的 60% 時會觸發壓縮。
  - **範例：**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`**（布林值）：
  - **說明：** 控制在命令列介面 (CLI) 輸出中的程式碼區塊是否顯示行號。
  - **預設值：** `true`
  - **範例：**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`**（物件）：
  - **說明：** 設定命令列介面 (CLI) 的無障礙功能。
  - **屬性：**
    - **`screenReader`**（布林值）：啟用螢幕閱讀器模式，會調整 TUI 以提升對螢幕閱讀器的相容性。此功能也可透過 `--screen-reader` 旗標 (flags) 在命令列中啟用，命令列旗標的設定優先於此設定值。
    - **`disableLoadingPhrases`**（布林值）：停用操作過程中顯示載入提示語。
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

## Shell 指令歷史紀錄

命令列介面 (CLI) 會保留你執行過的 shell 指令歷史。為了避免不同專案間的衝突，這些歷史紀錄會儲存在你使用者家目錄下、專案專屬的目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是根據你的專案根目錄路徑產生的唯一識別碼。
  - 歷史紀錄會儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常見方式，特別適合用於 API 金鑰等敏感資訊，或是在不同環境間可能變動的設定。若需設定驗證，請參閱 [Authentication documentation](./authentication.md)，其中涵蓋所有可用的驗證方法。

CLI 會自動從 `.env` 檔案載入環境變數。載入順序如下：

1.  目前工作目錄下的 `.env` 檔案。
2.  若找不到，則會往上搜尋父目錄，直到找到 `.env` 檔案，或到達專案根目錄（以 `.git` 資料夾識別）或家目錄為止。
3.  若仍未找到，則會尋找家目錄下的 `~/.env`。

**環境變數排除規則：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除載入，以避免影響 gemini-cli 行為。來自 `.gemini/.env` 檔案的變數則永遠不會被排除。你可以透過 `excludedProjectEnvVars` 設定於 `settings.json` 檔案中自訂這個行為。

- **`GEMINI_API_KEY`**：
  - 你的 Gemini API 金鑰。
  - 為多種 [驗證方法](./authentication.md) 之一。
  - 請在 shell 設定檔（如 `~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中設定。
- **`GEMINI_MODEL`**：
  - 指定預設使用的 Gemini 模型。
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
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境中執行時，此變數預設為分配給 Cloud Shell 使用者的特殊專案。如果你在 Cloud Shell 的全域環境中設定了 `GOOGLE_CLOUD_PROJECT`，將會被此預設值覆蓋。若要在 Cloud Shell 使用其他專案，必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 你的 Google Application Credentials JSON 檔案路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 你的 Google Cloud 專案 ID（用於 Google Cloud 遙測）
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 你的 Google Cloud 專案位置（例如：us-central1）。
  - 使用 Vertex AI 非 Express Mode 時必填。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - 作為 `settings.json` 中 `sandbox` 設定的替代方案。
  - 可接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`**（僅限 macOS）：
  - 切換 macOS 上的 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）限制僅能寫入專案資料夾（及其他少數資料夾，詳見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），但允許其他操作。
  - `strict`：採用嚴格設定檔，預設拒絕所有操作。
  - `<profile_name>`：使用自訂設定檔。若要定義自訂設定檔，請在專案的 `.gemini/` 目錄下建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如：`my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（常被底層函式庫或 CLI 本身使用）：
  - 設為 `true` 或 `1` 可啟用詳細除錯日誌，有助於問題排查。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案中排除，以避免干擾 gemini-cli 行為。若需專為 gemini-cli 設定，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設為任意值即可停用 CLI 的所有彩色輸出。
- **`CLI_TITLE`**：
  - 設為字串可自訂 CLI 標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定 code assist 伺服器的 endpoint。
  - 適用於開發與測試用途。

## 命令列參數

直接在執行 CLI 時傳入的參數，可覆蓋該次會話的其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定本次會話要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 直接傳遞 prompt 給指令。此方式會以非互動模式啟動 Gemini CLI。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以指定 prompt 為初始輸入啟動互動式會話。
  - prompt 會在互動會話中處理，而非會話開始前。
  - 無法與從 stdin 管線輸入同時使用。
  - 範例：`gemini -i "explain this code"`
- **`--sandbox`**（**`-s`**）：
  - 啟用本次會話的 sandbox 模式。
- **`--sandbox-image`**：
  - 設定 sandbox 映像檔 URI。
- **`--debug`**（**`-d`**）：
  - 啟用本次會話的除錯模式，提供更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 若設定，會將目前目錄下所有檔案遞迴納入 prompt 的 context。
- **`--help`**（或 **`-h`**）：
  - 顯示命令列參數的說明資訊。
- **`--show-memory-usage`**：
  - 顯示目前的記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動同意所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的核准模式。可用模式：
    - `default`：每次工具呼叫時提示核准（預設行為）
    - `auto_edit`：自動核准編輯工具（replace、write_file），其他仍提示
    - `yolo`：自動核准所有工具呼叫（等同於 `--yolo`）
  - 不可與 `--yolo` 同時使用。請以 `--approval-mode=yolo` 取代 `--yolo`，以採用新的統一方式。
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
  - 啟用 prompt 的遙測日誌。詳見 [telemetry](../telemetry.md)。
- **`--checkpointing`**：
  - 啟用 [checkpointing](../checkpointing.md)。
- **`--extensions <extension_name ...>`**（**`-e <extension_name ...>`**）：
  - 指定本次會話要使用的擴充套件清單。若未指定，則會使用所有可用擴充套件。
  - 使用特殊詞彙 `gemini -e none` 可停用所有擴充套件。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用擴充套件並結束。
- **`--proxy`**：
  - 設定 CLI 的 proxy。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在 workspace 中額外納入其他目錄，以支援多個目錄。
  - 可重複指定，或以逗號分隔多個值。
  - 最多可新增 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕閱讀器模式，提升無障礙性。
- **`--version`**：
  - 顯示 CLI 的版本資訊。

## Context 檔案（階層式指令 context）

雖然 context 檔案（預設為 `GEMINI.md`，可透過 `contextFileName` 設定自訂）不完全屬於 CLI「行為」的設定，但它們對於設定提供給 Gemini 模型的「指令 context」（也稱為「記憶體」）至關重要。這項強大功能讓你能針對專案提供特定指令、程式碼風格指南，或任何相關背景資訊給 AI，使其回應更貼近你的需求且更精確。CLI 也包含 UI 元素，例如頁腳會顯示已載入 context 檔案數量的指示器，讓你隨時掌握目前啟用的 context 狀態。

- **用途：** 這些 Markdown 檔案包含你希望 Gemini 模型在互動過程中能參考的指令、指引或 context。系統設計為階層式管理這些指令 context。

### 範例 Context 檔案內容（如 `GEMINI.md`）

以下是一個 TypeScript 專案根目錄下 context 檔案的概念範例：

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

本範例說明如何提供一般專案 context、特定的程式撰寫慣例，甚至是關於特定檔案或元件的備註。您的 context 檔案越相關且精確，AI 的協助效果就越好。強烈建議您建立專案專屬的 context 檔案，以建立一致的慣例與 context。

- **階層式載入與優先順序：** 命令列介面 (CLI) 透過從多個位置載入 context 檔案（如 `GEMINI.md`），實作了一套先進的階層式記憶體系統。此清單下方（更具體）的檔案內容，通常會覆蓋或補充上方（較一般）檔案的內容。實際的串接順序與最終 context 可透過 `/memory show` 指令檢視。一般載入順序如下：
  1.  **全域 context 檔案：**
      - 位置：`~/.gemini/<contextFileName>`（例如，您的使用者家目錄下的 `~/.gemini/GEMINI.md`）。
      - 範圍：為您所有專案提供預設指示。
  2.  **專案根目錄與上層目錄 context 檔案：**
      - 位置：CLI 會在目前工作目錄尋找已設定的 context 檔案，接著依序往上至每一層父目錄，直到找到專案根目錄（由 `.git` 資料夾識別）或您的家目錄為止。
      - 範圍：提供與整個專案或其重要部分相關的 context。
  3.  **子目錄 context 檔案（情境／在地）：**
      - 位置：CLI 也會在目前工作目錄「下方」的子目錄中，掃描已設定的 context 檔案（會遵循常見的忽略規則，如 `node_modules`、`.git` 等）。預設最多搜尋 200 個目錄，但可透過您的 `settings.json` 檔案中的 `memoryDiscoveryMaxDirs` 欄位進行調整。
      - 範圍：允許針對專案中特定元件、模組或子區塊，提供高度專屬的指示。
- **串接與 UI 指示：** 所有找到的 context 檔案內容會被串接（並以分隔符標示其來源與路徑），作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾會顯示已載入 context 檔案的數量，讓您能快速掌握目前啟用的指示 context 狀態。
- **內容匯入：** 您可以使用 `@path/to/file.md` 語法，將其他 Markdown 檔案匯入，實現 context 檔案的模組化。詳情請參閱 [Memory Import Processor 文件](../core/memport.md)。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 可強制重新掃描並從所有已設定位置重新載入所有 context 檔案，更新 AI 的指示 context。
  - 使用 `/memory show` 可顯示目前已載入的合併指示 context，方便您檢查 AI 實際使用的階層結構與內容。
  - `/memory` 指令及其子指令（`show` 與 `refresh`）的完整說明，請參閱 [指令文件](./commands.md#memory)。

透過理解並善用這些設定層級與 context 檔案的階層特性，您可以有效管理 AI 的記憶體，並根據自身需求與專案，調整 Gemini CLI 的回應。

## 沙箱機制（Sandboxing）

Gemini CLI 可在沙箱機制下執行具有潛在風險的操作（如 shell 指令與檔案修改），以保護您的系統安全。

沙箱機制預設為關閉，您可以透過以下方式啟用：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 當使用 `--yolo` 或 `--approval-mode=yolo` 時，沙箱機制會預設啟用。

預設情況下，會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。

若有專案專屬的沙箱需求，您可以在專案根目錄下建立自訂的 Dockerfile，路徑為 `.gemini/sandbox.Dockerfile`。此 Dockerfile 可基於預設的沙箱映像檔進行擴充：

```dockerfile
FROM gemini-cli-sandbox

# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當`.gemini/sandbox.Dockerfile`存在時，你可以在執行 Gemini CLI 時使用`BUILD_SANDBOX`環境變數，自動建置自訂的 sandbox 映像檔：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用統計資料

為了協助我們改進 Gemini CLI，我們會收集匿名化的使用統計資料。這些資料有助於我們了解 CLI 的使用方式、找出常見問題，並優先考慮新功能的開發。

**我們會收集的內容：**

- **工具呼叫紀錄：**我們會記錄被呼叫的工具名稱、是否執行成功或失敗，以及執行所需的時間。我們不會收集傳遞給工具的參數或工具回傳的任何資料。
- **API 請求：**我們會記錄每個請求所使用的 Gemini 模型、請求的持續時間，以及是否成功。我們不會收集提示詞（prompt）或回應的內容。
- **工作階段資訊：**我們會收集 CLI 設定相關資訊，例如已啟用的工具和審核模式（approval mode）。

**我們不會收集的內容：**

- **個人識別資訊 (PII)：**我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示詞與回應內容：**我們不會記錄您的提示詞內容或 Gemini 模型的回應內容。
- **檔案內容：**我們不會記錄任何由 CLI 讀取或寫入的檔案內容。

**如何選擇不參與（opt out）：**

您可以隨時在您的 `settings.json` 檔案中，將 `usageStatisticsEnabled` 屬性設為 `false`，以選擇不參與使用統計資料的收集：

```json
{
  "usageStatisticsEnabled": false
}
```
