# 設定

**已棄用設定格式說明**

本文件描述 `settings.json` 檔案的舊版 v1 格式。此格式現已棄用。

- 新格式將從 **09/10/25** 開始在穩定版本中支援。
- 從舊格式到新格式的自動遷移將於 **09/17/25** 開始。

有關新的推薦格式的詳細資訊，請參閱[目前的設定說明文件](./configuration.md)。

Gemini CLI 提供多種設定其行為的方式，包括環境變數、命令列參數和設定檔。本文件概述不同的設定方法和可用設定。

## 設定層級

設定按以下優先順序套用（較低數字被較高數字覆寫）：

1.  **預設值：** 應用程式內的硬編碼預設值。
2.  **系統預設檔案：** 可被其他設定檔覆寫的系統範圍預設設定。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案特定設定。
5.  **系統設定檔案：** 覆寫所有其他設定檔的系統範圍設定。
6.  **環境變數：** 系統範圍或工作階段特定變數，可能從 `.env` 檔案載入。
7.  **命令列參數：** 啟動 CLI 時傳遞的值。

## 設定檔案

Gemini CLI 使用 JSON 設定檔進行持久性設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。路徑可以使用 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋。
  - **範圍：** 提供系統範圍預設設定的基底層。這些設定具有最低優先順序，旨在被使用者、專案或系統覆蓋設定覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 是您的主目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定會覆蓋系統預設值。
- **專案設定檔案：**
  - **位置：** 專案根目錄內的 `.gemini/settings.json`。
  - **範圍：** 僅在從該特定專案執行 Gemini CLI 時適用。專案設定會覆蓋使用者設定和系統預設值。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。路徑可以使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋。
  - **範圍：** 適用於系統上所有使用者的所有 Gemini CLI 工作階段。系統設定作為覆蓋，優先於所有其他設定檔案。對於企業的系統管理員控制使用者的 Gemini CLI 設定可能很有用。

**設定中環境變數的注意事項：** `settings.json` 檔案中的字串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參考環境變數。這些變數會在載入設定時自動解析。例如，如果您有環境變數 `MY_API_TOKEN`，您可以在 `settings.json` 中這樣使用：`"apiKey": "$MY_API_TOKEN"`。

> **企業使用者注意事項：** 有關在企業環境中部署和管理 Gemini CLI 的指導，請參閱[企業設定](./enterprise.md)說明文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔案外，專案的 `.gemini` 目錄還可以包含與 Gemini CLI 操作相關的其他專案特定檔案，例如：

- [自訂沙箱設定檔](#沙箱化)（例如，`.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

### `settings.json` 中的可用設定：

- **`contextFileName`**（字串或字串陣列）：
  - **說明：** 指定內容檔案的檔案名稱（例如，`GEMINI.md`、`AGENTS.md`）。可以是單一檔案名稱或接受的檔案名稱清單。
  - **預設值：** `GEMINI.md`
  - **範例：** `"contextFileName": "AGENTS.md"`

- **`bugCommand`**（物件）：
  - **說明：** 覆寫 `/bug` 指令的預設 URL。
  - **預設值：** `"urlTemplate": "https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml&title={title}&info={info}"`
  - **屬性：**
    - **`urlTemplate`**（字串）：可以包含 `{title}` 和 `{info}` 預留位置的 URL。
  - **範例：**
    ```json
    "bugCommand": {
      "urlTemplate": "https://bug.example.com/new?title={title}&info={info}"
    }
    ```

- **`fileFiltering`**（物件）：
  - **說明：** 控制 @ 指令和檔案探索工具的 git 感知檔案篩選行為。
  - **預設值：** `"respectGitIgnore": true, "enableRecursiveFileSearch": true`
  - **屬性：**
    - **`respectGitIgnore`**（布林值）：探索檔案時是否遵守 .gitignore 模式。設為 `true` 時，git 忽略的檔案（如 `node_modules/`、`dist/`、`.env`）會自動從 @ 指令和檔案清單操作中排除。
    - **`enableRecursiveFileSearch`**（布林值）：在提示中完成 @ 前綴時，是否啟用在目前樹狀結構下遞迴搜尋檔案名稱。
    - **`disableFuzzySearch`**（布林值）：設為 `true` 時，停用搜尋檔案時的模糊搜尋功能，可在檔案數量龐大的專案中改善效能。
  - **範例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false,
      "disableFuzzySearch": true
    }
    ```

### 檔案搜尋效能疑難排解

如果您在檔案搜尋（例如，`@` 自動完成）方面遇到效能問題，特別是在檔案數量非常多的專案中，您可以按建議順序嘗試以下幾項設定：

1.  **使用 `.geminiignore`：** 在專案根目錄建立 `.geminiignore` 檔案，排除包含大量檔案且您不需要參考的目錄（例如，建置製品、日誌、`node_modules`）。減少爬取的檔案總數是改善效能最有效的方法。

2.  **停用模糊搜尋：** 如果忽略檔案還不夠，您可以在 `settings.json` 檔案中將 `disableFuzzySearch` 設為 `true` 來停用模糊搜尋。這將使用更簡單、非模糊的比對演算法，速度可能更快。

3.  **停用遞迴檔案搜尋：** 作為最後手段，您可以將 `enableRecursiveFileSearch` 設為 `false` 來完全停用遞迴檔案搜尋。這將是最快的選項，因為它避免了遞迴爬取您的專案。但是，這意味著使用 `@` 自動完成時需要輸入檔案的完整路徑。

- **`coreTools`**（字串陣列）：
  - **說明：** 允許您指定應提供給模型的核心工具名稱清單。這可用於限制內建工具集。請參閱[內建工具](../core/tools-api.md#內建工具)以取得核心工具清單。您也可以為支援的工具指定指令特定限制，如 `ShellTool`。例如，`"coreTools": ["ShellTool(ls -l)"]` 將只允許執行 `ls -l` 指令。
  - **預設值：** 所有可供 Gemini 模型使用的工具。
  - **範例：** `"coreTools": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]`。

- **`allowedTools`**（字串陣列）：
  - **預設值：** `undefined`
  - **說明：** 將略過確認對話框的工具名稱清單。這對您信任且經常使用的工具很有用。比對語義與 `coreTools` 相同。
  - **範例：** `"allowedTools": ["ShellTool(git status)"]`。

- **`excludeTools`**（字串陣列）：
  - **說明：** 允許您指定應從模型中排除的核心工具名稱清單。同時列在 `excludeTools` 和 `coreTools` 中的工具會被排除。您也可以為支援的工具指定指令特定限制，如 `ShellTool`。例如，`"excludeTools": ["ShellTool(rm -rf)"]` 將封鎖 `rm -rf` 指令。
  - **預設值**：不排除任何工具。
  - **範例：** `"excludeTools": ["run_shell_command", "findFiles"]`。
  - **安全注意事項：** `excludeTools` 中 `run_shell_command` 的指令特定限制基於簡單字串比對，可輕易略過。此功能**不是安全機制**，不應依賴它來安全執行不信任的程式碼。建議使用 `coreTools` 明確選擇可執行的指令。

- **`allowMCPServers`**（字串陣列）：
  - **說明：** 允許您指定應提供給模型的 MCP 伺服器名稱清單。這可用於限制要連線的 MCP 伺服器集。請注意，如果設定了 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值：** 所有 MCP 伺服器都可供 Gemini 模型使用。
  - **範例：** `"allowMCPServers": ["myPythonServer"]`。
  - **安全注意事項：** 這使用對 MCP 伺服器名稱的簡單字串比對，可以修改。如果您是系統管理員想要防止使用者略過此設定，請考慮在系統設定層級設定 `mcpServers`，使用者將無法設定自己的任何 MCP 伺服器。這不應用作密封的安全機制。

- **`excludeMCPServers`**（字串陣列）：
  - **說明：** 允許您指定應從模型中排除的 MCP 伺服器名稱清單。同時列在 `excludeMCPServers` 和 `allowMCPServers` 中的伺服器會被排除。請注意，如果設定了 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值**：不排除任何 MCP 伺服器。
  - **範例：** `"excludeMCPServers": ["myNodeServer"]`。
  - **安全注意事項：** 這使用對 MCP 伺服器名稱的簡單字串比對，可以修改。如果您是系統管理員想要防止使用者略過此設定，請考慮在系統設定層級設定 `mcpServers`，使用者將無法設定自己的任何 MCP 伺服器。這不應用作密封的安全機制。

- **`autoAccept`**（布林值）：
  - **說明：** 控制 CLI 是否自動接受並執行被視為安全的工具呼叫（例如，唯讀操作），而無需明確的使用者確認。如果設為 `true`，CLI 將略過被視為安全的工具的確認提示。
  - **預設值：** `false`
  - **範例：** `"autoAccept": true`

- **`theme`**（字串）：
  - **說明：** 設定 Gemini CLI 的視覺[主題](./themes.md)。
  - **預設值：** `"Default"`
  - **範例：** `"theme": "GitHub"`

- **`vimMode`**（布林值）：
  - **說明：** 啟用或停用輸入編輯的 vim 模式。啟用時，輸入區域支援 vim 風格的導覽和編輯指令，具有 NORMAL 和 INSERT 模式。vim 模式狀態顯示在頁尾，並在工作階段之間持續存在。
  - **預設值：** `false`
  - **範例：** `"vimMode": true`

- **`sandbox`**（布林值或字串）：
  - **說明：** 控制是否以及如何使用沙箱化進行工具執行。如果設為 `true`，Gemini CLI 使用預建的 `gemini-cli-sandbox` Docker 映像。如需更多資訊，請參閱[沙箱化](#沙箱化)。
  - **預設值：** `false`
  - **範例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`**（字串）：
  - **說明：** 定義從您的專案中探索工具的自訂 shell 指令。shell 指令必須在 `stdout` 上回傳[函式宣告](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations)的 JSON 陣列。工具包裝器是可選的。
  - **預設值：** 空
  - **範例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`**（字串）：
  - **說明：** 定義呼叫使用 `toolDiscoveryCommand` 探索的特定工具的自訂 shell 指令。shell 指令必須符合以下條件：
    - 它必須將函式 `name`（與[函式宣告](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations)中完全相同）作為第一個命令列引數。
    - 它必須從 `stdin` 讀取函式引數作為 JSON，類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 它必須在 `stdout` 上回傳函式輸出作為 JSON，類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **預設值：** 空
  - **範例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`**（物件）：
  - **說明：** 設定連線到一個或多個模型內容協定（MCP）伺服器，以探索和使用自訂工具。Gemini CLI 嘗試連線到每個設定的 MCP 伺服器以探索可用工具。如果多個 MCP 伺服器暴露同名工具，工具名稱將加上您在設定中定義的伺服器別名前綴（例如，`serverAlias__actualToolName`）以避免衝突。請注意，系統可能會從 MCP 工具定義中剝離某些綱要屬性以確保相容性。必須提供 `command`、`url` 或 `httpUrl` 中的至少一個。如果指定多個，優先順序為 `httpUrl`、然後 `url`、然後 `command`。
  - **預設值：** 空
  - **屬性：**
    - **`<SERVER_NAME>`**（物件）：指定伺服器的伺服器參數。
      - `command`（字串，可選）：執行以透過標準 I/O 啟動 MCP 伺服器的指令。
      - `args`（字串陣列，可選）：傳遞給指令的引數。
      - `env`（物件，可選）：為伺服器程序設定的環境變數。
      - `cwd`（字串，可選）：啟動伺服器的工作目錄。
      - `url`（字串，可選）：使用伺服器發送事件（SSE）進行通訊的 MCP 伺服器 URL。
      - `httpUrl`（字串，可選）：使用可串流 HTTP 進行通訊的 MCP 伺服器 URL。
      - `headers`（物件，可選）：發送請求到 `url` 或 `httpUrl` 時的 HTTP 標頭對應。
      - `timeout`（數字，可選）：對此 MCP 伺服器請求的逾時時間（毫秒）。
      - `trust`（布林值，可選）：信任此伺服器並略過所有工具呼叫確認。
      - `description`（字串，可選）：伺服器的簡要說明，可用於顯示目的。
      - `includeTools`（字串陣列，可選）：從此 MCP 伺服器包含的工具名稱清單。指定時，只有此處列出的工具才可從此伺服器使用（白名單行為）。如果未指定，預設啟用伺服器的所有工具。
      - `excludeTools`（字串陣列，可選）：從此 MCP 伺服器排除的工具名稱清單。此處列出的工具將不可供模型使用，即使伺服器暴露了它們。**注意：** `excludeTools` 優先於 `includeTools` - 如果工具在兩個清單中，它將被排除。
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
        "description": "基於 SSE 的 MCP 伺服器範例。"
      },
      "myStreamableHttpServer": {
        "httpUrl": "http://localhost:8082/stream",
        "headers": {
          "X-API-Key": "$MY_HTTP_API_KEY"
        },
        "description": "基於可串流 HTTP 的 MCP 伺服器範例。"
      }
    }
    ```

- **`checkpointing`**（物件）：
  - **說明：** 設定檢查點功能，讓您可以儲存和還原對話及檔案狀態。如需更多詳細資訊，請參閱[檢查點說明文件](../checkpointing.md)。
  - **預設值：** `{"enabled": false}`
  - **屬性：**
    - **`enabled`**（布林值）：設為 `true` 時，`/restore` 指令可用。

- **`preferredEditor`**（字串）：
  - **說明：** 指定檢視差異時要使用的偏好編輯器。
  - **預設值：** `vscode`
  - **範例：** `"preferredEditor": "vscode"`

- **`telemetry`**（物件）
  - **說明：** 設定 Gemini CLI 的日誌記錄和指標收集。如需更多資訊，請參閱[遙測](../telemetry.md)。
  - **預設值：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **屬性：**
    - **`enabled`**（布林值）：是否啟用遙測。
    - **`target`**（字串）：收集的遙測資料目的地。支援的值為 `local` 和 `gcp`。
    - **`otlpEndpoint`**（字串）：OTLP 匯出器的端點。
    - **`logPrompts`**（布林值）：是否在日誌中包含使用者提示的內容。
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
  - **說明：** 啟用或停用使用統計資料的收集。如需更多資訊，請參閱[使用統計資料](#使用統計資料)。
  - **預設值：** `true`
  - **範例：**
    ```json
    "usageStatisticsEnabled": false
    ```

- **`hideTips`**（布林值）：
  - **說明：** 啟用或停用 CLI 介面中的實用提示。
  - **預設值：** `false`
  - **範例：**

    ```json
    "hideTips": true
    ```

- **`hideBanner`**（布林值）：
  - **說明：** 啟用或停用 CLI 介面中的啟動橫幅（ASCII 藝術標誌）。
  - **預設值：** `false`
  - **範例：**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`**（數字）：
  - **說明：** 設定工作階段的最大回合數。如果工作階段超過此限制，CLI 將停止處理並開始新的聊天。
  - **預設值：** `-1`（無限制）
  - **範例：**
    ```json
    "maxSessionTurns": 10
    ```

- **`summarizeToolOutput`**（物件）：
  - **說明：** 啟用或停用工具輸出的摘要。您可以使用 `tokenBudget` 設定指定摘要的代幣預算。
  - 注意：目前只支援 `run_shell_command` 工具。
  - **預設值：** `{}`（預設停用）
  - **範例：**
    ```json
    "summarizeToolOutput": {
      "run_shell_command": {
        "tokenBudget": 2000
      }
    }
    ```

- **`excludedProjectEnvVars`**（字串陣列）：
  - **說明：** 指定應從專案 `.env` 檔案中排除載入的環境變數。這可防止專案特定的環境變數（如 `DEBUG=true`）干擾 gemini-cli 行為。來自 `.gemini/.env` 檔案的變數永遠不會被排除。
  - **預設值：** `["DEBUG", "DEBUG_MODE"]`
  - **範例：**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`**（字串陣列）：
  - **說明：** 指定要包含在工作區內容中的其他絕對或相對路徑陣列。預設情況下，遺失的目錄會被跳過並顯示警告。路徑可以使用 `~` 來參考使用者的主目錄。此設定可與 `--include-directories` 命令列旗標結合使用。
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
  - **說明：** 控制 `/memory refresh` 指令的行為。如果設為 `true`，應從所有新增的目錄載入 `GEMINI.md` 檔案。如果設為 `false`，只應從目前目錄載入 `GEMINI.md`。
  - **預設值：** `false`
  - **範例：**
    ```json
    "loadMemoryFromIncludeDirectories": true
    ```

- **`chatCompression`**（物件）：
  - **說明：** 控制聊天歷史記錄壓縮的設定，包括自動壓縮和透過 /compress 指令手動呼叫的壓縮。
  - **屬性：**
    - **`contextPercentageThreshold`**（數字）：0 到 1 之間的值，指定作為模型總代幣限制百分比的壓縮代幣閾值。例如，值 `0.6` 將在聊天歷史記錄超過代幣限制的 60% 時觸發壓縮。
  - **範例：**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`**（布林值）：
  - **說明：** 控制是否在 CLI 輸出的程式碼區塊中顯示行號。
  - **預設值：** `true`
  - **範例：**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`**（物件）：
  - **說明：** 設定 CLI 的無障礙功能。
  - **屬性：**
    - **`screenReader`**（布林值）：啟用螢幕報讀器模式，調整 TUI 以提供與螢幕報讀器更好的相容性。這也可以透過 `--screen-reader` 命令列旗標啟用，該旗標將優先於此設定。
    - **`disableLoadingPhrases`**（布林值）：停用操作期間載入短語的顯示。
  - **預設值：** `{"screenReader": false, "disableLoadingPhrases": false}`
  - **範例：**
    ```json
    "accessibility": {
      "screenReader": true,
      "disableLoadingPhrases": true
    }
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

## Shell 歷史記錄

CLI 保留您執行的 shell 指令歷史記錄。為避免不同專案之間的衝突，此歷史記錄儲存在使用者主資料夾內的專案特定目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是從您專案根路徑生成的唯一識別碼。
  - 歷史記錄儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常見方式，特別是對於 API 金鑰等敏感資訊，或可能在不同環境之間變更的設定。如需驗證設定，請參閱涵蓋所有可用驗證方法的[驗證說明文件](./authentication.md)。

CLI 會自動從 `.env` 檔案載入環境變數。載入順序為：

1.  目前工作目錄中的 `.env` 檔案。
2.  如果找不到，它會在父目錄中向上搜尋，直到找到 `.env` 檔案或達到專案根目錄（由 `.git` 資料夾識別）或主目錄。
3.  如果仍然找不到，它會尋找 `~/.env`（在使用者的主目錄中）。

**環境變數排除：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除載入，以防止干擾 gemini-cli 行為。來自 `.gemini/.env` 檔案的變數永遠不會被排除。您可以使用 `settings.json` 檔案中的 `excludedProjectEnvVars` 設定來自訂此行為。

- **`GEMINI_API_KEY`**：
  - 您的 Gemini API 金鑰。
  - 數種可用[驗證方法](./authentication.md)之一。
  - 在您的 shell 設定檔（例如，`~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中設定這個。
- **`GEMINI_MODEL`**：
  - 指定要使用的預設 Gemini 模型。
  - 覆寫硬編碼預設值
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 您的 Google Cloud API 金鑰。
  - 在快速模式中使用 Vertex AI 時必要。
  - 確保您有必要的權限。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 您的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 時必要。
  - 如果使用 Vertex AI，請確保您在此專案中有必要的權限。
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境中執行時，此變數預設為分配給 Cloud Shell 使用者的特殊專案。如果您在 Cloud Shell 的全域環境中設定了 `GOOGLE_CLOUD_PROJECT`，它將被此預設值覆寫。要在 Cloud Shell 中使用不同的專案，您必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 您的 Google Application Credentials JSON 檔案的路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 您在 Google Cloud 中遙測的 Google Cloud 專案 ID
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 您的 Google Cloud 專案位置（例如，us-central1）。
  - 在非快速模式中使用 Vertex AI 時必要。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - `settings.json` 中 `sandbox` 設定的替代方案。
  - 接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`**（macOS 特定）：
  - 在 macOS 上切換 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）限制對專案資料夾的寫入（以及其他一些資料夾，請參閱 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），但允許其他操作。
  - `strict`：使用預設拒絕操作的嚴格設定檔。
  - `<profile_name>`：使用自訂設定檔。要定義自訂設定檔，請在專案的 `.gemini/` 目錄中建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如，`my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（通常由底層程式庫或 CLI 本身使用）：
  - 設為 `true` 或 `1` 以啟用詳細除錯日誌記錄，這對疑難排解很有幫助。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案中排除，以防止干擾 gemini-cli 行為。如果您需要專門為 gemini-cli 設定這些，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設為任何值以停用 CLI 中的所有色彩輸出。
- **`CLI_TITLE`**：
  - 設為字串以自訂 CLI 的標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定程式碼協助伺服器的端點。
  - 這對開發和測試很有用。

## 命令列引數

直接在執行 CLI 時傳遞的引數可以覆寫該特定工作階段的其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定此工作階段要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 用於直接將提示傳遞給指令。這會在非互動模式中呼叫 Gemini CLI。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以提供的提示作為初始輸入開始互動工作階段。
  - 提示在互動工作階段內處理，而不是在之前。
  - 從 stdin 管道輸入時無法使用。
  - 範例：`gemini -i "explain this code"`
- **`--sandbox`**（**`-s`**）：
  - 為此工作階段啟用沙箱模式。
- **`--sandbox-image`**：
  - 設定沙箱映像 URI。
- **`--debug`**（**`-d`**）：
  - 為此工作階段啟用除錯模式，提供更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 如果設定，會遞迴包含目前目錄內的所有檔案作為提示的內容。
- **`--help`**（或 **`-h`**）：
  - 顯示有關命令列引數的說明資訊。
- **`--show-memory-usage`**：
  - 顯示目前的記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動核准所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的核准模式。可用模式：
    - `default`：對每個工具呼叫提示核准（預設行為）
    - `auto_edit`：自動核准編輯工具（replace、write_file），同時對其他工具提示
    - `yolo`：自動核准所有工具呼叫（等同於 `--yolo`）
  - 無法與 `--yolo` 一起使用。使用 `--approval-mode=yolo` 而不是 `--yolo` 以採用新的統一方法。
  - 範例：`gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**：
  - 將略過確認對話框的工具名稱的逗號分隔清單。
  - 範例：`gemini --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**：
  - 啟用[遙測](../telemetry.md)。
- **`--telemetry-target`**：
  - 設定遙測目標。如需更多資訊，請參閱[遙測](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**：
  - 設定遙測的 OTLP 端點。如需更多資訊，請參閱[遙測](../telemetry.md)。
- **`--telemetry-otlp-protocol`**：
  - 設定遙測的 OTLP 協定（`grpc` 或 `http`）。預設為 `grpc`。如需更多資訊，請參閱[遙測](../telemetry.md)。
- **`--telemetry-log-prompts`**：
  - 啟用遙測的提示日誌記錄。如需更多資訊，請參閱[遙測](../telemetry.md)。
- **`--checkpointing`**：
  - 啟用[檢查點](../checkpointing.md)。
- **`--extensions <extension_name ...>`**（**`-e <extension_name ...>`**）：
  - 指定工作階段要使用的擴充功能清單。如果未提供，將使用所有可用的擴充功能。
  - 使用特殊術語 `gemini -e none` 來停用所有擴充功能。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用的擴充功能並結束。
- **`--proxy`**：
  - 設定 CLI 的代理。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在工作區中包含其他目錄以提供多目錄支援。
  - 可以多次指定或作為逗號分隔的值。
  - 最多可新增 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕報讀器模式以提供無障礙功能。
- **`--version`**：
  - 顯示 CLI 的版本。

## 內容檔案（階層指令內容）

雖然嚴格來說不是 CLI _行為_ 的設定，但內容檔案（預設為 `GEMINI.md`，但可透過 `contextFileName` 設定進行設定）對於設定提供給 Gemini 模型的_指令內容_（也稱為「記憶體」）至關重要。這個強大的功能讓您可以向 AI 提供專案特定的指示、編碼風格指南或任何相關的背景資訊，使其回應更符合您的需求且更準確。CLI 包含 UI 元素，例如頁尾中顯示已載入內容檔案數量的指示器，以讓您了解作用中的內容。

- **目的：** 這些 Markdown 檔案包含您希望 Gemini 模型在互動期間了解的指示、指導原則或內容。系統設計為階層式管理此指示內容。

### 範例內容檔案內容（例如，`GEMINI.md`）

以下是 TypeScript 專案根目錄中內容檔案可能包含的概念範例：

```markdown
# 專案：我的出色 TypeScript 程式庫

## 一般指示：

- 產生新的 TypeScript 程式碼時，請遵循現有的編碼風格。
- 確保所有新函式和類別都有 JSDoc 註解。
- 在適當的地方偏好函式程式設計範式。
- 所有程式碼都應與 TypeScript 5.0 和 Node.js 20+ 相容。

## 編碼風格：

- 使用 2 個空格進行縮排。
- 介面名稱應以 `I` 為前綴（例如，`IUserService`）。
- 私有類別成員應以底線（`_`）為前綴。
- 始終使用嚴格相等（`===` 和 `!==`）。

## 特定元件：`src/api/client.ts`

- 此檔案處理所有出站 API 請求。
- 新增新的 API 呼叫函式時，請確保它們包含強健的錯誤處理和日誌記錄。
- 對所有 GET 請求使用現有的 `fetchWithRetry` 工具。

## 關於相依性：

- 除非絕對必要，否則避免引入新的外部相依性。
- 如果需要新的相依性，請說明原因。
```

此範例展示了如何提供一般專案內容、特定編碼慣例，甚至關於特定檔案或元件的註記。您的內容檔案越相關和精確，AI 就能更好地協助您。強烈建議專案特定的內容檔案建立慣例和內容。

- **階層載入與優先順序：** CLI 透過從多個位置載入內容檔案（例如 `GEMINI.md`）來實作精密的階層記憶體系統。此清單中較低位置（較具體）的檔案內容通常會覆寫或補充較高位置（較一般）的檔案內容。確切的串聯順序和最終內容可以使用 `/memory show` 指令檢查。典型的載入順序為：
  1.  **全域內容檔案：**
      - 位置：`~/.gemini/<contextFileName>`（例如，您使用者主目錄中的 `~/.gemini/GEMINI.md`）。
      - 範圍：為您的所有專案提供預設指示。
  2.  **專案根目錄與上級內容檔案：**
      - 位置：CLI 在目前工作目錄中搜尋設定的內容檔案，然後在每個父目錄中搜尋，直到專案根目錄（由 `.git` 資料夾識別）或您的主目錄。
      - 範圍：提供與整個專案或其重要部分相關的內容。
  3.  **子目錄內容檔案（上下文/本機）：**
      - 位置：CLI 也會在目前工作目錄_下方_的子目錄中掃描設定的內容檔案（遵守常見的忽略模式，如 `node_modules`、`.git` 等）。此搜尋的廣度預設限制為 200 個目錄，但可以使用 `settings.json` 檔案中的 `memoryDiscoveryMaxDirs` 欄位進行設定。
      - 範圍：允許與您專案的特定元件、模組或子節高度相關的特定指示。
- **串聯與 UI 指示：** 所有找到的內容檔案的內容都會串聯在一起（使用指示其來源和路徑的分隔符號），並作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾顯示已載入內容檔案的數量，為您提供關於作用中指示內容的快速視覺提示。
- **匯入內容：** 您可以使用 `@path/to/file.md` 語法匯入其他 Markdown 檔案來模組化您的內容檔案。如需更多詳細資訊，請參閱[記憶體匯入處理器說明文件](../core/memport.md)。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 強制重新掃描並重新載入所有設定位置的內容檔案。這會更新 AI 的指示內容。
  - 使用 `/memory show` 顯示目前載入的合併指示內容，讓您可以驗證 AI 正在使用的階層和內容。
  - 請參閱[指令說明文件](./commands.md#內建指令)以取得 `/memory` 指令及其子指令（`show` 和 `refresh`）的完整詳細資訊。

透過理解並利用這些設定層級和內容檔案的階層性質，您可以有效管理 AI 的記憶體，並根據您的特定需求和專案客製化 Gemini CLI 的回應。

## 沙箱化

Gemini CLI 可以在沙箱化環境中執行潛在不安全的操作（如 shell 指令和檔案修改），以保護您的系統。

沙箱化預設為停用，但您可以透過幾種方式啟用：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 使用 `--yolo` 或 `--approval-mode=yolo` 時預設啟用沙箱。

預設情況下，它使用預建的 `gemini-cli-sandbox` Docker 映像。

對於專案特定的沙箱化需求，您可以在專案根目錄的 `.gemini/sandbox.Dockerfile` 建立自訂 Dockerfile。此 Dockerfile 可以基於基底沙箱映像：

```dockerfile
FROM gemini-cli-sandbox

# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當 `.gemini/sandbox.Dockerfile` 存在時，您可以在執行 Gemini CLI 時使用 `BUILD_SANDBOX` 環境變數來自動建置自訂沙箱映像：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用統計資料

為了幫助我們改善 Gemini CLI，我們會收集匿名使用統計資料。這些資料幫助我們了解 CLI 的使用方式、識別常見問題並優先考慮新功能。

**我們收集的資料：**

- **工具呼叫：** 我們記錄呼叫的工具名稱、它們是否成功或失敗，以及執行所需的時間。我們不會收集傳遞給工具的引數或工具回傳的任何資料。
- **API 請求：** 我們記錄每個請求使用的 Gemini 模型、請求的持續時間，以及是否成功。我們不會收集提示或回應的內容。
- **工作階段資訊：** 我們收集關於 CLI 設定的資訊，例如啟用的工具和核准模式。

**我們不收集的資料：**

- **個人識別資訊（PII）：** 我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示和回應內容：** 我們不會記錄您的提示內容或來自 Gemini 模型的回應。
- **檔案內容：** 我們不會記錄 CLI 讀取或寫入的任何檔案內容。

**如何退出：**

您可以隨時透過在 `settings.json` 檔案中將 `usageStatisticsEnabled` 屬性設為 `false` 來退出使用統計資料收集：

```json
{
  "usageStatisticsEnabled": false
}
```
