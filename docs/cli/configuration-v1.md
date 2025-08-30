# 設定

**已棄用設定格式說明**

本文件描述 `settings.json` 檔案的舊版 v1 格式。此格式現已棄用。

- 新格式將從 **[09/10/25]** 開始在穩定版本中支援。
- 從舊格式到新格式的自動遷移將於 **[09/17/25]** 開始。

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

- [自訂沙箱設定檔](#sandboxing)（例如，`.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

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
  - **說明：** 允許您指定應提供給模型的核心工具名稱清單。這可用於限制內建工具集。請參閱[內建工具](../core/tools-api.md#built-in-tools)以取得核心工具清單。您也可以為支援的工具指定指令特定限制，如 `ShellTool`。例如，`"coreTools": ["ShellTool(ls -l)"]` 將只允許執行 `ls -l` 指令。
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
  - **說明：** 控制是否以及如何使用沙箱化進行工具執行。如果設為 `true`，Gemini CLI 使用預建的 `gemini-cli-sandbox` Docker 映像。如需更多資訊，請參閱[沙箱化](#sandboxing)。
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

- **`checkpointing`** (object):
  - **Description:** Configures the checkpointing feature, which allows you to save and restore conversation and file states. See the [Checkpointing documentation](../checkpointing.md) for more details.
  - **Default:** `{"enabled": false}`
  - **Properties:**
    - **`enabled`** (boolean): When `true`, the `/restore` command is available.

- **`preferredEditor`** (string):
  - **Description:** Specifies the preferred editor to use for viewing diffs.
  - **Default:** `vscode`
  - **Example:** `"preferredEditor": "vscode"`

- **`telemetry`** (object)
  - **Description:** Configures logging and metrics collection for Gemini CLI. For more information, see [Telemetry](../telemetry.md).
  - **Default:** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **Properties:**
    - **`enabled`** (boolean): Whether or not telemetry is enabled.
    - **`target`** (string): The destination for collected telemetry. Supported values are `local` and `gcp`.
    - **`otlpEndpoint`** (string): The endpoint for the OTLP Exporter.
    - **`logPrompts`** (boolean): Whether or not to include the content of user prompts in the logs.
  - **Example:**
    ```json
    "telemetry": {
      "enabled": true,
      "target": "local",
      "otlpEndpoint": "http://localhost:16686",
      "logPrompts": false
    }
    ```
- **`usageStatisticsEnabled`** (boolean):
  - **Description:** Enables or disables the collection of usage statistics. See [Usage Statistics](#usage-statistics) for more information.
  - **Default:** `true`
  - **Example:**
    ```json
    "usageStatisticsEnabled": false
    ```

- **`hideTips`** (boolean):
  - **Description:** Enables or disables helpful tips in the CLI interface.
  - **Default:** `false`
  - **Example:**

    ```json
    "hideTips": true
    ```

- **`hideBanner`** (boolean):
  - **Description:** Enables or disables the startup banner (ASCII art logo) in the CLI interface.
  - **Default:** `false`
  - **Example:**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`** (number):
  - **Description:** Sets the maximum number of turns for a session. If the session exceeds this limit, the CLI will stop processing and start a new chat.
  - **Default:** `-1` (unlimited)
  - **Example:**
    ```json
    "maxSessionTurns": 10
    ```

- **`summarizeToolOutput`** (object):
  - **Description:** Enables or disables the summarization of tool output. You can specify the token budget for the summarization using the `tokenBudget` setting.
  - Note: Currently only the `run_shell_command` tool is supported.
  - **Default:** `{}` (Disabled by default)
  - **Example:**
    ```json
    "summarizeToolOutput": {
      "run_shell_command": {
        "tokenBudget": 2000
      }
    }
    ```

- **`excludedProjectEnvVars`** (array of strings):
  - **Description:** Specifies environment variables that should be excluded from being loaded from project `.env` files. This prevents project-specific environment variables (like `DEBUG=true`) from interfering with gemini-cli behavior. Variables from `.gemini/.env` files are never excluded.
  - **Default:** `["DEBUG", "DEBUG_MODE"]`
  - **Example:**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`** (array of strings):
  - **Description:** Specifies an array of additional absolute or relative paths to include in the workspace context. Missing directories will be skipped with a warning by default. Paths can use `~` to refer to the user's home directory. This setting can be combined with the `--include-directories` command-line flag.
  - **Default:** `[]`
  - **Example:**
    ```json
    "includeDirectories": [
      "/path/to/another/project",
      "../shared-library",
      "~/common-utils"
    ]
    ```

- **`loadMemoryFromIncludeDirectories`** (boolean):
  - **Description:** Controls the behavior of the `/memory refresh` command. If set to `true`, `GEMINI.md` files should be loaded from all directories that are added. If set to `false`, `GEMINI.md` should only be loaded from the current directory.
  - **Default:** `false`
  - **Example:**
    ```json
    "loadMemoryFromIncludeDirectories": true
    ```

- **`chatCompression`** (object):
  - **Description:** Controls the settings for chat history compression, both automatic and
    when manually invoked through the /compress command.
  - **Properties:**
    - **`contextPercentageThreshold`** (number): A value between 0 and 1 that specifies the token threshold for compression as a percentage of the model's total token limit. For example, a value of `0.6` will trigger compression when the chat history exceeds 60% of the token limit.
  - **Example:**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`** (boolean):
  - **Description:** Controls whether line numbers are displayed in code blocks in the CLI output.
  - **Default:** `true`
  - **Example:**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`** (object):
  - **Description:** Configures accessibility features for the CLI.
  - **Properties:**
    - **`screenReader`** (boolean): Enables screen reader mode, which adjusts the TUI for better compatibility with screen readers. This can also be enabled with the `--screen-reader` command-line flag, which will take precedence over the setting.
    - **`disableLoadingPhrases`** (boolean): Disables the display of loading phrases during operations.
  - **Default:** `{"screenReader": false, "disableLoadingPhrases": false}`
  - **Example:**
    ```json
    "accessibility": {
      "screenReader": true,
      "disableLoadingPhrases": true
    }
    ```

### Example `settings.json`:

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

## Shell History

The CLI keeps a history of shell commands you run. To avoid conflicts between different projects, this history is stored in a project-specific directory within your user's home folder.

- **Location:** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` is a unique identifier generated from your project's root path.
  - The history is stored in a file named `shell_history`.

## Environment Variables & `.env` Files

Environment variables are a common way to configure applications, especially for sensitive information like API keys or for settings that might change between environments. For authentication setup, see the [Authentication documentation](./authentication.md) which covers all available authentication methods.

The CLI automatically loads environment variables from an `.env` file. The loading order is:

1.  `.env` file in the current working directory.
2.  If not found, it searches upwards in parent directories until it finds an `.env` file or reaches the project root (identified by a `.git` folder) or the home directory.
3.  If still not found, it looks for `~/.env` (in the user's home directory).

**Environment Variable Exclusion:** Some environment variables (like `DEBUG` and `DEBUG_MODE`) are automatically excluded from being loaded from project `.env` files to prevent interference with gemini-cli behavior. Variables from `.gemini/.env` files are never excluded. You can customize this behavior using the `excludedProjectEnvVars` setting in your `settings.json` file.

- **`GEMINI_API_KEY`**:
  - Your API key for the Gemini API.
  - One of several available [authentication methods](./authentication.md).
  - Set this in your shell profile (e.g., `~/.bashrc`, `~/.zshrc`) or an `.env` file.
- **`GEMINI_MODEL`**:
  - Specifies the default Gemini model to use.
  - Overrides the hardcoded default
  - Example: `export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**:
  - Your Google Cloud API key.
  - Required for using Vertex AI in express mode.
  - Ensure you have the necessary permissions.
  - Example: `export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`.
- **`GOOGLE_CLOUD_PROJECT`**:
  - Your Google Cloud Project ID.
  - Required for using Code Assist or Vertex AI.
  - If using Vertex AI, ensure you have the necessary permissions in this project.
  - **Cloud Shell Note:** When running in a Cloud Shell environment, this variable defaults to a special project allocated for Cloud Shell users. If you have `GOOGLE_CLOUD_PROJECT` set in your global environment in Cloud Shell, it will be overridden by this default. To use a different project in Cloud Shell, you must define `GOOGLE_CLOUD_PROJECT` in a `.env` file.
  - Example: `export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`.
- **`GOOGLE_APPLICATION_CREDENTIALS`** (string):
  - **Description:** The path to your Google Application Credentials JSON file.
  - **Example:** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**:
  - Your Google Cloud Project ID for Telemetry in Google Cloud
  - Example: `export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`.
- **`GOOGLE_CLOUD_LOCATION`**:
  - Your Google Cloud Project Location (e.g., us-central1).
  - Required for using Vertex AI in non express mode.
  - Example: `export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`.
- **`GEMINI_SANDBOX`**:
  - Alternative to the `sandbox` setting in `settings.json`.
  - Accepts `true`, `false`, `docker`, `podman`, or a custom command string.
- **`SEATBELT_PROFILE`** (macOS specific):
  - Switches the Seatbelt (`sandbox-exec`) profile on macOS.
  - `permissive-open`: (Default) Restricts writes to the project folder (and a few other folders, see `packages/cli/src/utils/sandbox-macos-permissive-open.sb`) but allows other operations.
  - `strict`: Uses a strict profile that declines operations by default.
  - `<profile_name>`: Uses a custom profile. To define a custom profile, create a file named `sandbox-macos-<profile_name>.sb` in your project's `.gemini/` directory (e.g., `my-project/.gemini/sandbox-macos-custom.sb`).
- **`DEBUG` or `DEBUG_MODE`** (often used by underlying libraries or the CLI itself):
  - Set to `true` or `1` to enable verbose debug logging, which can be helpful for troubleshooting.
  - **Note:** These variables are automatically excluded from project `.env` files by default to prevent interference with gemini-cli behavior. Use `.gemini/.env` files if you need to set these for gemini-cli specifically.
- **`NO_COLOR`**:
  - Set to any value to disable all color output in the CLI.
- **`CLI_TITLE`**:
  - Set to a string to customize the title of the CLI.
- **`CODE_ASSIST_ENDPOINT`**:
  - Specifies the endpoint for the code assist server.
  - This is useful for development and testing.

## Command-Line Arguments

Arguments passed directly when running the CLI can override other configurations for that specific session.

- **`--model <model_name>`** (**`-m <model_name>`**):
  - Specifies the Gemini model to use for this session.
  - Example: `npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`** (**`-p <your_prompt>`**):
  - Used to pass a prompt directly to the command. This invokes Gemini CLI in a non-interactive mode.
- **`--prompt-interactive <your_prompt>`** (**`-i <your_prompt>`**):
  - Starts an interactive session with the provided prompt as the initial input.
  - The prompt is processed within the interactive session, not before it.
  - Cannot be used when piping input from stdin.
  - Example: `gemini -i "explain this code"`
- **`--sandbox`** (**`-s`**):
  - Enables sandbox mode for this session.
- **`--sandbox-image`**:
  - Sets the sandbox image URI.
- **`--debug`** (**`-d`**):
  - Enables debug mode for this session, providing more verbose output.
- **`--all-files`** (**`-a`**):
  - If set, recursively includes all files within the current directory as context for the prompt.
- **`--help`** (or **`-h`**):
  - Displays help information about command-line arguments.
- **`--show-memory-usage`**:
  - Displays the current memory usage.
- **`--yolo`**:
  - Enables YOLO mode, which automatically approves all tool calls.
- **`--approval-mode <mode>`**:
  - Sets the approval mode for tool calls. Available modes:
    - `default`: Prompt for approval on each tool call (default behavior)
    - `auto_edit`: Automatically approve edit tools (replace, write_file) while prompting for others
    - `yolo`: Automatically approve all tool calls (equivalent to `--yolo`)
  - Cannot be used together with `--yolo`. Use `--approval-mode=yolo` instead of `--yolo` for the new unified approach.
  - Example: `gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**:
  - A comma-separated list of tool names that will bypass the confirmation dialog.
  - Example: `gemini --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**:
  - Enables [telemetry](../telemetry.md).
- **`--telemetry-target`**:
  - Sets the telemetry target. See [telemetry](../telemetry.md) for more information.
- **`--telemetry-otlp-endpoint`**:
  - Sets the OTLP endpoint for telemetry. See [telemetry](../telemetry.md) for more information.
- **`--telemetry-otlp-protocol`**:
  - Sets the OTLP protocol for telemetry (`grpc` or `http`). Defaults to `grpc`. See [telemetry](../telemetry.md) for more information.
- **`--telemetry-log-prompts`**:
  - Enables logging of prompts for telemetry. See [telemetry](../telemetry.md) for more information.
- **`--checkpointing`**:
  - Enables [checkpointing](../checkpointing.md).
- **`--extensions <extension_name ...>`** (**`-e <extension_name ...>`**):
  - Specifies a list of extensions to use for the session. If not provided, all available extensions are used.
  - Use the special term `gemini -e none` to disable all extensions.
  - Example: `gemini -e my-extension -e my-other-extension`
- **`--list-extensions`** (**`-l`**):
  - Lists all available extensions and exits.
- **`--proxy`**:
  - Sets the proxy for the CLI.
  - Example: `--proxy http://localhost:7890`.
- **`--include-directories <dir1,dir2,...>`**:
  - Includes additional directories in the workspace for multi-directory support.
  - Can be specified multiple times or as comma-separated values.
  - 5 directories can be added at maximum.
  - Example: `--include-directories /path/to/project1,/path/to/project2` or `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**:
  - Enables screen reader mode for accessibility.
- **`--version`**:
  - Displays the version of the CLI.

## Context Files (Hierarchical Instructional Context)

While not strictly configuration for the CLI's _behavior_, context files (defaulting to `GEMINI.md` but configurable via the `contextFileName` setting) are crucial for configuring the _instructional context_ (also referred to as "memory") provided to the Gemini model. This powerful feature allows you to give project-specific instructions, coding style guides, or any relevant background information to the AI, making its responses more tailored and accurate to your needs. The CLI includes UI elements, such as an indicator in the footer showing the number of loaded context files, to keep you informed about the active context.

- **Purpose:** These Markdown files contain instructions, guidelines, or context that you want the Gemini model to be aware of during your interactions. The system is designed to manage this instructional context hierarchically.

### Example Context File Content (e.g., `GEMINI.md`)

Here's a conceptual example of what a context file at the root of a TypeScript project might contain:

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

This example demonstrates how you can provide general project context, specific coding conventions, and even notes about particular files or components. The more relevant and precise your context files are, the better the AI can assist you. Project-specific context files are highly encouraged to establish conventions and context.

- **Hierarchical Loading and Precedence:** The CLI implements a sophisticated hierarchical memory system by loading context files (e.g., `GEMINI.md`) from several locations. Content from files lower in this list (more specific) typically overrides or supplements content from files higher up (more general). The exact concatenation order and final context can be inspected using the `/memory show` command. The typical loading order is:
  1.  **Global Context File:**
      - Location: `~/.gemini/<contextFileName>` (e.g., `~/.gemini/GEMINI.md` in your user home directory).
      - Scope: Provides default instructions for all your projects.
  2.  **Project Root & Ancestors Context Files:**
      - Location: The CLI searches for the configured context file in the current working directory and then in each parent directory up to either the project root (identified by a `.git` folder) or your home directory.
      - Scope: Provides context relevant to the entire project or a significant portion of it.
  3.  **Sub-directory Context Files (Contextual/Local):**
      - Location: The CLI also scans for the configured context file in subdirectories _below_ the current working directory (respecting common ignore patterns like `node_modules`, `.git`, etc.). The breadth of this search is limited to 200 directories by default, but can be configured with a `memoryDiscoveryMaxDirs` field in your `settings.json` file.
      - Scope: Allows for highly specific instructions relevant to a particular component, module, or subsection of your project.
- **Concatenation & UI Indication:** The contents of all found context files are concatenated (with separators indicating their origin and path) and provided as part of the system prompt to the Gemini model. The CLI footer displays the count of loaded context files, giving you a quick visual cue about the active instructional context.
- **Importing Content:** You can modularize your context files by importing other Markdown files using the `@path/to/file.md` syntax. For more details, see the [Memory Import Processor documentation](../core/memport.md).
- **Commands for Memory Management:**
  - Use `/memory refresh` to force a re-scan and reload of all context files from all configured locations. This updates the AI's instructional context.
  - Use `/memory show` to display the combined instructional context currently loaded, allowing you to verify the hierarchy and content being used by the AI.
  - See the [Commands documentation](./commands.md#memory) for full details on the `/memory` command and its sub-commands (`show` and `refresh`).

By understanding and utilizing these configuration layers and the hierarchical nature of context files, you can effectively manage the AI's memory and tailor the Gemini CLI's responses to your specific needs and projects.

## Sandboxing

The Gemini CLI can execute potentially unsafe operations (like shell commands and file modifications) within a sandboxed environment to protect your system.

Sandboxing is disabled by default, but you can enable it in a few ways:

- Using `--sandbox` or `-s` flag.
- Setting `GEMINI_SANDBOX` environment variable.
- Sandbox is enabled when using `--yolo` or `--approval-mode=yolo` by default.

By default, it uses a pre-built `gemini-cli-sandbox` Docker image.

For project-specific sandboxing needs, you can create a custom Dockerfile at `.gemini/sandbox.Dockerfile` in your project's root directory. This Dockerfile can be based on the base sandbox image:

```dockerfile
FROM gemini-cli-sandbox

# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

When `.gemini/sandbox.Dockerfile` exists, you can use `BUILD_SANDBOX` environment variable when running Gemini CLI to automatically build the custom sandbox image:

```bash
BUILD_SANDBOX=1 gemini -s
```

## Usage Statistics

To help us improve the Gemini CLI, we collect anonymized usage statistics. This data helps us understand how the CLI is used, identify common issues, and prioritize new features.

**What we collect:**

- **Tool Calls:** We log the names of the tools that are called, whether they succeed or fail, and how long they take to execute. We do not collect the arguments passed to the tools or any data returned by them.
- **API Requests:** We log the Gemini model used for each request, the duration of the request, and whether it was successful. We do not collect the content of the prompts or responses.
- **Session Information:** We collect information about the configuration of the CLI, such as the enabled tools and the approval mode.

**What we DON'T collect:**

- **Personally Identifiable Information (PII):** We do not collect any personal information, such as your name, email address, or API keys.
- **Prompt and Response Content:** We do not log the content of your prompts or the responses from the Gemini model.
- **File Content:** We do not log the content of any files that are read or written by the CLI.

**How to opt out:**

You can opt out of usage statistics collection at any time by setting the `usageStatisticsEnabled` property to `false` in your `settings.json` file:

```json
{
  "usageStatisticsEnabled": false
}
```
