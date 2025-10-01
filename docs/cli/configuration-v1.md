# Gemini CLI 設定

**關於已淘汰的設定格式說明**

本文件說明 `settings.json` 檔案的舊版 v1 格式。此格式現已被淘汰。

- 新格式將於穩定版自 **[09/10/25]** 起支援。
- 從舊格式自動遷移至新格式將於 **[09/17/25]** 開始。

關於新的建議格式，請參閱[目前的設定文件](./configuration.md)。

Gemini CLI 提供多種方式來設定其行為，包括環境變數、命令列參數以及設定檔案。本文件將說明不同的設定方式與可用的設定選項。

## 設定層級

設定會依下列優先順序套用（數字越小會被數字越大的覆蓋）：

1.  **預設值：** 內建於應用程式的預設值。
2.  **系統預設檔案：** 系統層級的預設設定，可被其他設定檔覆蓋。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案專屬的設定。
5.  **系統設定檔案：** 系統層級的設定，會覆蓋所有其他設定檔。
6.  **環境變數：** 系統或工作階段專屬的變數，可能從 `.env` 檔案載入。
7.  **命令列參數：** 啟動 CLI 時傳入的值。

## 設定檔案

Gemini CLI 使用 JSON 設定檔案來進行持久化設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。可使用 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 提供系統層級的預設設定基礎。這些設定優先順序最低，設計上會被使用者、專案或系統覆寫設定所覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 為您的家目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定會覆蓋系統預設。
- **專案設定檔案：**
  - **位置：** 您專案根目錄下的 `.gemini/settings.json`。
  - **範圍：** 僅在從該專案執行 Gemini CLI 時適用。專案設定會覆蓋使用者設定與系統預設。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。可使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋路徑。
  - **範圍：** 適用於系統上所有使用者的 Gemini CLI 工作階段。系統設定作為覆寫設定，優先於所有其他設定檔。對於企業中的系統管理員控管使用者 Gemini CLI 設定特別有用。

**關於設定檔中的環境變數：** 在您的 `settings.json` 檔案中的字串值，可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法來引用環境變數。這些變數在載入設定時會自動解析。例如，若您有一個環境變數 `MY_API_TOKEN`，可在 `settings.json` 中這樣使用：`"apiKey": "$MY_API_TOKEN"`。

> **企業用戶注意：** 關於在企業環境中部署與管理 Gemini CLI 的指引，請參閱 [企業設定](./enterprise.md) 文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔外，專案的 `.gemini` 目錄還能包含其他與 Gemini CLI 運作相關的專案專屬檔案，例如：

- [自訂 sandbox profiles](#沙箱機制-sandboxing)（如 `.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

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
    - **`respectGitIgnore`**（布林值）：在探索檔案時，是否遵循 `.gitignore` 規則。當設為 `true` 時，所有被 git 忽略的檔案（如 `node_modules/`、`dist/`、`.env`）將自動從 @ 指令與檔案清單操作中排除。
    - **`enableRecursiveFileSearch`**（布林值）：在提示字元中補全 @ 前綴時，是否啟用於目前樹狀結構下遞迴搜尋檔案名稱的功能。
    - **`disableFuzzySearch`**（布林值）：當為 `true` 時，停用搜尋檔案時的模糊搜尋功能，可提升在大型專案中的效能。
  - **範例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false,
      "disableFuzzySearch": true
    }
    ```

### 疑難排解檔案搜尋效能

如果你在檔案搜尋（例如使用 `@` 補全）時遇到效能問題，特別是在擁有大量檔案的專案中，可以依照以下建議順序嘗試以下方法：

1.  **使用 `.geminiignore`：** 在你的專案根目錄建立 `.geminiignore` 檔案，排除那些包含大量你不需要參考的檔案的目錄（例如建置產物、日誌、`node_modules`）。減少被爬取的檔案總數是提升效能最有效的方法。

2.  **停用模糊搜尋（Fuzzy Search）：** 如果僅忽略檔案還不夠，你可以在 `settings.json` 檔案中將 `disableFuzzySearch` 設為 `true` 來停用模糊搜尋。這將改用較簡單、非模糊的比對演算法，通常速度更快。

3.  **停用遞迴檔案搜尋：** 最後手段，你可以將 `enableRecursiveFileSearch` 設為 `false`，完全停用遞迴檔案搜尋。這是最快的選項，因為它會避免遞迴爬取整個專案。不過，這代表你在使用 `@` 補全時，必須輸入完整的檔案路徑。

- **`coreTools`**（字串陣列）：
  - **說明：** 允許你指定一組應該提供給模型使用的核心工具名稱。這可用來限制可用的內建工具集。請參閱 [Built-in Tools](../core/tools-api.md#built-in-tools) 以取得核心工具清單。你也可以針對支援的工具指定特定指令的限制，例如 `ShellTool`。例如，`"coreTools": ["ShellTool(ls -l)"]` 只允許執行 `ls -l` 指令。
  - **預設值：** 所有 Gemini 模型可用的工具。
  - **範例：** `"coreTools": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]`。

- **`allowedTools`**（字串陣列）：
  - **預設值：** `undefined`
  - **說明：** 一組工具名稱清單，這些工具將略過確認對話框。這對於你信任且經常使用的工具很有用。比對語意與 `coreTools` 相同。
  - **範例：** `"allowedTools": ["ShellTool(git status)"]`。

- **`excludeTools`**（字串陣列）：
  - **說明：** 允許你指定一組應從模型中排除的核心工具名稱。如果某工具同時出現在 `excludeTools` 與 `coreTools`，則會被排除。你也可以針對支援的工具指定特定指令的限制，例如 `ShellTool`。例如，`"excludeTools": ["ShellTool(rm -rf)"]` 將會封鎖 `rm -rf` 指令。
  - **預設值：** 不排除任何工具。
  - **範例：** `"excludeTools": ["run_shell_command", "findFiles"]`。
  - **安全性注意事項：** `excludeTools` 中針對 `run_shell_command` 的指令限制僅基於簡單字串比對，容易被繞過。此功能**不是安全機制**，不應用於安全執行不受信任的程式碼。建議使用 `coreTools` 明確選擇允許執行的指令。

- **`allowMCPServers`**（字串陣列）：
  - **說明：** 允許你指定一組應提供給模型使用的 MCP 伺服器名稱。這可用來限制可連線的 MCP 伺服器集合。請注意，若已設定 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值：** 所有 MCP 伺服器皆可供 Gemini 模型使用。
  - **範例：** `"allowMCPServers": ["myPythonServer"]`。
  - **安全性注意事項：** 這是對 MCP 伺服器名稱進行簡單字串比對，名稱可被修改。如果你是系統管理員並希望防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，讓使用者無法自行設定 MCP 伺服器。此設定不應作為嚴密的安全機制。

- **`excludeMCPServers`**（字串陣列）：
  - **說明：** 允許你指定一組應從模型中排除的 MCP 伺服器名稱。如果某伺服器同時出現在 `excludeMCPServers` 與 `allowMCPServers`，則會被排除。請注意，若已設定 `--allowed-mcp-server-names`，此設定將被忽略。
  - **預設值：** 不排除任何 MCP 伺服器。
  - **範例：** `"excludeMCPServers": ["myNodeServer"]`。
  - **安全性注意事項：** 這是對 MCP 伺服器名稱進行簡單字串比對，名稱可被修改。如果你是系統管理員並希望防止使用者繞過此限制，請考慮在系統層級設定 `mcpServers`，讓使用者無法自行設定 MCP 伺服器。此設定不應作為嚴密的安全機制。

- **`autoAccept`**（布林值）：
  - **說明：** 控制 CLI 是否會自動接受並執行被認為安全（例如唯讀操作）的工具呼叫，而不需使用者明確確認。若設為 `true`，CLI 將會略過對被視為安全工具的確認提示。
  - **預設值：** `false`
  - **範例：** `"autoAccept": true`

- **`theme`**（字串）：
  - **說明：** 設定 Gemini CLI 的視覺 [佈景主題](./themes.md)。
  - **預設值：** `"Default"`
  - **範例：** `"theme": "GitHub"`

- **`vimMode`**（布林值）：
  - **說明：** 啟用或停用輸入編輯的 vim 模式。啟用後，輸入區域支援 vim 風格的導覽與編輯指令，具備 NORMAL 與 INSERT 模式。vim 模式狀態會顯示在頁腳，並於不同工作階段間保持不變。
  - **預設值：** `false`
  - **範例：** `"vimMode": true`

- **`sandbox`**（布林值或字串）：
  - **說明：** 控制工具執行時是否以及如何使用沙箱機制。若設為 `true`，Gemini CLI 會使用預建的 `gemini-cli-sandbox` Docker 映像檔。詳情請參閱 [Sandboxing](#沙箱機制-sandboxing)。
  - **預設值：** `false`
  - **範例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`**（字串）：
  - **說明：** 定義自訂 shell 指令，用於從你的專案中發現工具。該 shell 指令必須在 `stdout` 上回傳 [function declarations](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations) 的 JSON 陣列。工具包裝器為選用。
  - **預設值：** 空值
  - **範例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`**（字串）：
  - **說明：** 定義自訂 shell 指令，用於呼叫透過 `toolDiscoveryCommand` 發現的特定工具。該 shell 指令必須符合下列條件：
    - 必須將 function `name`（格式同 [function declaration](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations)）作為第一個命令列參數。
    - 必須從 `stdin` 讀取函式參數（JSON 格式），類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 必須在 `stdout` 回傳函式輸出（JSON 格式），類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **預設值：** 空值
  - **範例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`**（物件）：
  - **說明：** 設定一個或多個 Model-Context Protocol (MCP) 伺服器的連線，用於發現和使用自訂工具。Gemini CLI 會嘗試連線至每個已設定的 MCP 伺服器以發現可用工具。若多個 MCP 伺服器提供同名工具，這些工具名稱會加上你在設定中定義的伺服器別名（例如 `serverAlias__actualToolName`）以避免衝突。請注意，系統可能會為了相容性而移除 MCP 工具定義中的部分 schema 屬性。`command`、`url` 或 `httpUrl` 至少需設定其中之一。若同時設定多個，優先順序為 `httpUrl`，再來是 `url`，最後是 `command`。
  - **預設值：** 空值
  - **屬性：**
    - **`<SERVER_NAME>`**（物件）：該命名伺服器的參數設定。
      - `command`（字串，選填）：啟動 MCP 伺服器（透過標準輸入/輸出）的指令。
      - `args`（字串陣列，選填）：傳遞給該指令的參數。
      - `env`（物件，選填）：要設定給伺服器程序的環境變數。
      - `cwd`（字串，選填）：啟動伺服器時的工作目錄。
      - `url`（字串，選填）：使用 Server-Sent Events (SSE) 通訊的 MCP 伺服器 URL。
      - `httpUrl`（字串，選填）：使用可串流 HTTP 通訊的 MCP 伺服器 URL。
      - `headers`（物件，選填）：發送至 `url` 或 `httpUrl` 請求時要帶的 HTTP 標頭對應表。
      - `timeout`（數字，選填）：此 MCP 伺服器請求的逾時（毫秒）。
      - `trust`（布林值，選填）：信任此伺服器並略過所有工具呼叫確認。
      - `description`（字串，選填）：伺服器的簡短描述，可能用於顯示用途。
      - `includeTools`（字串陣列，選填）：要從此 MCP 伺服器納入的工具名稱清單。若有設定，僅此清單中的工具會從該伺服器啟用（白名單行為）。若未設定，預設啟用伺服器的所有工具。
      - `excludeTools`（字串陣列，選填）：要從此 MCP 伺服器排除的工具名稱清單。即使伺服器有提供，這裡列出的工具也不會提供給模型。**注意：** `excludeTools` 優先於 `includeTools`——若工具同時出現在兩者，將會被排除。
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
  - **說明：** 設定 checkpointing（檢查點）功能，允許你儲存與還原對話及檔案狀態。詳情請參閱 [Checkpointing documentation](../checkpointing.md)。
  - **預設值：** `{"enabled": false}`
  - **屬性：**
    - **`enabled`**（布林值）：當`true`時，`/restore` 指令可用。

- **`preferredEditor`**（字串）：
  - **說明：** 指定用於檢視差異（diffs）的偏好編輯器。
  - **預設值：** `vscode`
  - **範例：** `"preferredEditor": "vscode"`

- **`telemetry`**（物件）
  - **說明：** 設定 Gemini CLI 的日誌（logging）與遙測（telemetry）資料收集。更多資訊請參閱 [Telemetry](../telemetry.md)。
  - **預設值：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **屬性：**
    - **`enabled`**（布林值）：是否啟用遙測（telemetry）。
    - **`target`**（字串）：收集到的遙測資料目的地。支援的值有 `local` 與 `gcp`。
    - **`otlpEndpoint`**（字串）：OTLP Exporter 的端點（endpoint）。
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
  - **說明：**啟用或停用遙測 (telemetry) 使用統計資料的收集。詳情請參見[Usage Statistics](#使用統計資料)。
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
  - **說明：** 啟用或停用命令列介面 (Command Line Interface) 啟動時的橫幅（ASCII 藝術字 logo）。
  - **預設值：** `false`
  - **範例：**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`**（數值）：
  - **說明：** 設定單一對話階段（session）的最大輪數（turns）。如果該對話階段超過此限制，命令列介面（Command Line Interface, CLI）將會停止處理並啟動新的聊天。
  - **預設值：** `-1`（無限制）
  - **範例：**
    ```json
    "maxSessionTurns": 10
    ```

- **`summarizeToolOutput`**（物件）：
  - **說明：**啟用或停用工具輸出的摘要功能。你可以透過 `tokenBudget` 設定來指定摘要的 token 預算。
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
  - **說明：** 指定應該排除、不要從專案`.env`檔案載入的環境變數。這可防止專案專屬的環境變數（例如 `DEBUG=true`）影響 Gemini CLI 的行為。來自`.gemini/.env`檔案的變數則永遠不會被排除。
  - **預設值：** `["DEBUG", "DEBUG_MODE"]`
  - **範例：**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`**（字串陣列）：
  - **說明：** 指定一組額外的絕對或相對路徑，將其納入 workspace context。預設情況下，缺少的目錄會跳過並顯示警告。路徑中可以使用 `~` 來指向使用者的家目錄。此設定可與 `--include-directories` 命令列旗標 (flags) 搭配使用。
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
  - **說明：** 控制聊天記錄壓縮的設定，包含自動壓縮與透過 `/compress` 指令手動觸發時的行為。
  - **屬性：**
    - **`contextPercentageThreshold`**（數值）：介於 0 到 1 之間的數值，指定壓縮觸發的 token 門檻，作為模型總 token 限制的百分比。例如，若值為 `0.6`，則當聊天記錄超過 token 限制的 60% 時會觸發壓縮。
  - **範例：**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`** (boolean)：
  - **說明：** 控制是否在命令列介面 (Command Line Interface) 輸出中的程式碼區塊顯示行號。
  - **預設值：** `true`
  - **範例：**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`**（物件）：
  - **說明：** 設定命令列介面 (Command Line Interface) 的無障礙功能。
  - **屬性：**
    - **`screenReader`**（布林值）：啟用螢幕閱讀器模式，會調整 TUI 以提升與螢幕閱讀器的相容性。此功能也可透過 `--screen-reader` 旗標 (flags) 在命令列啟用，若同時設定，旗標 (flags) 的設定優先。
    - **`disableLoadingPhrases`**（布林值）：停用操作期間顯示載入提示語句。
  - **預設值：** `{"screenReader": false, "disableLoadingPhrases": false}`
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

Gemini CLI 會保留你執行過的 shell 指令歷史紀錄。為了避免不同專案之間的衝突，這些歷史紀錄會儲存在你使用者家目錄下、專案專屬的目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是根據你的專案根路徑產生的唯一識別碼。
  - 歷史紀錄會儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常見方式，特別適合用於 API 金鑰等敏感資訊，或是會因環境不同而變動的設定。若需設定驗證，請參閱 [Authentication documentation](./authentication.md)，其中涵蓋所有可用的驗證方法。

Gemini CLI 會自動從 `.env` 檔案載入環境變數。載入順序如下：

1.  目前工作目錄下的 `.env` 檔案。
2.  若找不到，會往上搜尋父目錄，直到找到 `.env` 檔案，或到達專案根目錄（以 `.git` 資料夾識別）或家目錄為止。
3.  若仍未找到，則會尋找家目錄下的 `~/.env`。

**環境變數排除規則：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除載入，以避免影響 gemini-cli 行為。`.gemini/.env` 檔案中的變數則永遠不會被排除。你可以透過在 `settings.json` 檔案中設定 `excludedProjectEnvVars` 來自訂這個行為。

- **`GEMINI_API_KEY`**：
  - 你的 Gemini API 金鑰。
  - 可用的 [驗證方法](./authentication.md) 之一。
  - 請在 shell 設定檔（例如 `~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中設定。
- **`GEMINI_MODEL`**：
  - 指定預設要使用的 Gemini 模型。
  - 會覆蓋內建的預設值。
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 你的 Google Cloud API 金鑰。
  - 使用 Vertex AI Express Mode 時必須設定。
  - 請確保你擁有必要的權限。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 你的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 時必須設定。
  - 若使用 Vertex AI，請確保你在此專案中擁有必要的權限。
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境中執行時，此變數預設為 Cloud Shell 使用者專用的專案。如果你在 Cloud Shell 的全域環境中已設定 `GOOGLE_CLOUD_PROJECT`，會被此預設值覆蓋。若要在 Cloud Shell 中使用其他專案，必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 你的 Google Application Credentials JSON 檔案路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 你在 Google Cloud 上用於遙測 (telemetry) 的專案 ID。
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 你的 Google Cloud 專案位置（例如 us-central1）。
  - 使用非 Express Mode 的 Vertex AI 時必須設定。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - 作為 `settings.json` 中 `sandbox` 設定的替代方案。
  - 可接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`**（僅限 macOS）：
  - 切換 macOS 上的 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）限制僅能寫入專案資料夾（及其他少數資料夾，詳見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），但允許其他操作。
  - `strict`：使用嚴格設定檔，預設拒絕所有操作。
  - `<profile_name>`：使用自訂設定檔。若要定義自訂設定檔，請在專案的 `.gemini/` 目錄下建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如 `my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（通常由底層函式庫或 CLI 本身使用）：
  - 設為 `true` 或 `1` 可啟用詳細的除錯日誌，有助於問題排查。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案中排除，以避免影響 gemini-cli 行為。如果你需要專為 gemini-cli 設定這些變數，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設定任意值即可停用 CLI 的所有彩色輸出。
- **`CLI_TITLE`**：
  - 設定字串以自訂 CLI 標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定 code assist 伺服器的 endpoint。
  - 適合開發和測試用途。

## 命令列參數

直接在執行 Gemini CLI 時傳入的參數，可在該次執行期間覆蓋其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定本次 session 要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 直接傳送 prompt 給指令，會以非互動模式啟動 Gemini CLI。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以指定 prompt 作為初始輸入啟動互動式 session。
  - prompt 會在互動 session 內處理，而非啟動前處理。
  - 無法與從 stdin 輸入資料同時使用。
  - 範例：`gemini -i "explain this code"`
- **`--sandbox`**（**`-s`**）：
  - 啟用本次 session 的 sandbox 模式。
- **`--sandbox-image`**：
  - 設定 sandbox image 的 URI。
- **`--debug`**（**`-d`**）：
  - 啟用本次 session 的除錯模式，顯示更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 若設定，會遞迴將目前目錄下所有檔案作為 prompt 的 context。
- **`--help`**（或 **`-h`**）：
  - 顯示命令列參數的說明資訊。
- **`--show-memory-usage`**：
  - 顯示目前的記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動同意所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的核准模式。可用模式：
    - `default`：每次工具呼叫時提示核准（預設行為）
    - `auto_edit`：自動核准編輯工具（replace、write_file），其他則提示
    - `yolo`：自動核准所有工具呼叫（等同於 `--yolo`）
  - 不能與 `--yolo` 同時使用。請以 `--approval-mode=yolo` 取代 `--yolo`，採用新的統一方式。
  - 範例：`gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**：
  - 以逗號分隔的工具名稱清單，這些工具將略過確認對話框。
  - 範例：`gemini --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**：
  - 啟用 [遙測 (telemetry)](../telemetry.md)。
- **`--telemetry-target`**：
  - 設定遙測 (telemetry) 目標。詳情請參閱 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**：
  - 設定遙測 (telemetry) 的 OTLP endpoint。詳情請參閱 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-protocol`**：
  - 設定遙測 (telemetry) 的 OTLP 協定（`grpc` 或 `http`），預設為 `grpc`。詳情請參閱 [telemetry](../telemetry.md)。
- **`--telemetry-log-prompts`**：
  - 啟用 prompt 記錄至遙測 (telemetry)。詳情請參閱 [telemetry](../telemetry.md)。
- **`--checkpointing`**：
  - 啟用 [checkpointing](../checkpointing.md)。
- **`--extensions <extension_name ...>`**（**`-e <extension_name ...>`**）：
  - 指定本次 session 要使用的擴充套件清單。若未指定，則會使用所有可用擴充套件。
  - 使用特殊詞彙 `gemini -e none` 可停用所有擴充套件。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用擴充套件並結束。
- **`--proxy`**：
  - 設定 CLI 的 proxy。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在 workspace 中額外包含多個目錄以支援多目錄功能。
  - 可多次指定，或以逗號分隔多個值。
  - 最多可新增 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕閱讀器模式以提升無障礙性。
- **`--version`**：
  - 顯示 CLI 的版本資訊。

## Context 檔案（階層式指令 context）

雖然 context 檔案（預設為 `GEMINI.md`，可透過 `contextFileName` 設定變更）不完全屬於 CLI「行為」的設定，但對於設定提供給 Gemini 模型的「指令 context」（又稱「記憶體」）至關重要。這項強大功能讓你能針對專案提供指令、程式碼風格指南或任何相關背景資訊，使 AI 的回應更貼合你的需求。CLI 也會在 UI（如頁腳的 context 檔案數量指示器）中顯示已載入的 context 檔案數量，讓你隨時掌握目前的 context 狀態。

- **用途：** 這些 Markdown 檔案包含你希望 Gemini 模型在互動過程中知曉的指令、指引或 context。系統會以階層式方式管理這些指令 context。

### Context 檔案內容範例（例如 `GEMINI.md`）

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

此範例說明如何提供一般專案 context、特定程式撰寫慣例，甚至是關於特定檔案或元件的備註。您的 context 檔案越具相關性與精確性，AI 的協助效果就越好。強烈建議建立專案專屬的 context 檔案，以確立慣例與 context。

- **階層式載入與優先順序：** Gemini CLI 實作了一套先進的階層式記憶系統，會從多個位置載入 context 檔案（例如 `GEMINI.md`）。列表中較下方（較具體）的檔案內容通常會覆蓋或補充較上方（較一般）檔案的內容。實際的串接順序與最終 context 可透過 `/memory show` 指令檢查。一般載入順序如下：
  1.  **全域 context 檔案：**
      - 位置：`~/.gemini/<contextFileName>`（例如，您的使用者家目錄中的 `~/.gemini/GEMINI.md`）。
      - 範圍：為所有專案提供預設指令。
  2.  **專案根目錄及其上層目錄的 context 檔案：**
      - 位置：Gemini CLI 會在目前工作目錄搜尋已設定的 context 檔案，然後往上層目錄逐一查找，直到找到專案根目錄（以 `.git` 資料夾識別）或您的家目錄為止。
      - 範圍：提供與整個專案或其主要部分相關的 context。
  3.  **子目錄 context 檔案（具體／在地）：**
      - 位置：Gemini CLI 也會在目前工作目錄以下的子目錄中搜尋已設定的 context 檔案（會遵循常見的忽略模式，例如 `node_modules`、`.git` 等）。預設搜尋範圍最多 200 個目錄，可透過 `settings.json` 檔案中的 `memoryDiscoveryMaxDirs` 欄位進行設定。
      - 範圍：可針對特定元件、模組或專案子區塊提供高度專屬的指令。
- **串接與 UI 指示：** 所有找到的 context 檔案內容會串接（並以分隔符標示來源與路徑），並作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾會顯示已載入的 context 檔案數量，讓您能快速掌握目前啟用的指令 context。
- **內容匯入：** 您可以使用 `@path/to/file.md` 語法將其他 Markdown 檔案模組化匯入到您的 context 檔案。詳情請參閱 [Memory Import Processor 文件](../core/memport.md)。
- **記憶管理指令：**
  - 使用 `/memory refresh` 可強制重新掃描並重新載入所有已設定位置的 context 檔案，更新 AI 的指令 context。
  - 使用 `/memory show` 可顯示目前已載入的合併指令 context，方便您檢查 AI 使用的階層與內容。
  - 詳細指令請參閱 [指令文件](./commands.md#memory)，其中包含 `/memory` 指令及其子指令（`show` 和 `refresh`）。

透過瞭解並善用這些設定層級與 context 檔案的階層特性，您可以有效管理 AI 的記憶，並針對您的需求與專案調整 Gemini CLI 的回應。

## 沙箱機制（Sandboxing）

Gemini CLI 可在沙箱環境中執行可能不安全的操作（如 shell 指令與檔案修改），以保護您的系統。

沙箱機制預設為停用，但您可以透過以下方式啟用：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 當使用 `--yolo` 或 `--approval-mode=yolo` 時，沙箱機制會預設啟用。

預設會使用預先建置的 `gemini-cli-sandbox` Docker 映像檔。

若有專案專屬的沙箱需求，您可以在專案根目錄的 `.gemini/sandbox.Dockerfile` 建立自訂 Dockerfile。此 Dockerfile 可基於基礎沙箱映像檔進行設計：

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

為了協助我們改進 Gemini CLI，我們會收集匿名化的使用統計資料。這些資料有助於我們了解 Gemini CLI 的使用情況、識別常見問題，並協助我們釐定新功能的優先順序。

**我們會收集的資料：**

- **工具呼叫（Tool Calls）：**我們會記錄被呼叫的工具名稱、執行是否成功，以及執行所需的時間。我們不會收集傳遞給工具的參數或工具回傳的任何資料。
- **API 請求（API Requests）：**我們會記錄每次請求所使用的 Gemini 模型、請求的持續時間，以及是否成功。我們不會收集提示詞（prompt）或回應的內容。
- **工作階段資訊（Session Information）：**我們會收集有關 Gemini CLI 設定的資訊，例如已啟用的工具及審核模式（approval mode）。

**我們不會收集的資料：**

- **個人識別資訊（Personally Identifiable Information, PII）：**我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示與回應內容（Prompt and Response Content）：**我們不會記錄您的提示詞內容或 Gemini 模型的回應內容。
- **檔案內容（File Content）：**我們不會記錄任何由 Gemini CLI 讀取或寫入的檔案內容。

**如何選擇退出：**

您可以隨時在您的 `settings.json` 檔案中，將 `usageStatisticsEnabled` 屬性設為 `false`，以選擇不參與使用統計資料的收集：

```json
{
  "usageStatisticsEnabled": false
}
```
