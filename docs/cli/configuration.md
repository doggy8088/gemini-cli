# 設定

**新設定格式說明**

`settings.json` 檔案的格式已更新為新的、更有條理的結構。

- 新格式將從 **[09/10/25]** 開始在穩定版本中受到支援。
- 從舊格式到新格式的自動遷移將於 **[09/17/25]** 開始。

如需之前格式的詳細資訊，請參閱 [v1 設定說明文件](./configuration-v1.md)。

Gemini CLI 提供多種設定其行為的方式，包括環境變數、命令列引數和設定檔。本文件概述不同的設定方法和可用設定。

## 設定層級

設定按以下優先順序套用（較低的數字會被較高的數字覆蓋）：

1.  **預設值：** 應用程式內的硬編碼預設值。
2.  **系統預設檔案：** 可被其他設定檔覆蓋的系統範圍預設設定。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案特定的設定。
5.  **系統設定檔案：** 覆蓋所有其他設定檔的系統範圍設定。
6.  **環境變數：** 系統範圍或工作階段特定的變數，可能從 `.env` 檔案載入。
7.  **命令列引數：** 啟動 CLI 時傳遞的值。

## 設定檔

Gemini CLI 使用 JSON 設定檔進行持久設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。路徑可以使用 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋。
  - **範圍：** 提供系統範圍預設設定的基礎層。這些設定具有最低優先順序，旨在被使用者、專案或系統覆蓋設定覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 是您的主目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定覆蓋系統預設值。
- **專案設定檔案：**
  - **位置：** 專案根目錄內的 `.gemini/settings.json`。
  - **範圍：** 僅適用於從該特定專案執行 Gemini CLI 時。專案設定覆蓋使用者設定和系統預設值。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。路徑可以使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋。
  - **範圍：** 適用於系統上所有使用者的所有 Gemini CLI 工作階段。系統設定作為覆蓋，優先於所有其他設定檔。對於企業的系統管理員來說，控制使用者的 Gemini CLI 設定可能很有用。

**設定中環境變數的說明：** 您的 `settings.json` 檔案內的字串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參考環境變數。載入設定時，這些變數會自動解析。例如，如果您有環境變數 `MY_API_TOKEN`，您可以在 `settings.json` 中這樣使用它：`"apiKey": "$MY_API_TOKEN"`。

> **企業使用者注意事項：** 如需在企業環境中部署和管理 Gemini CLI 的指導，請參閱[企業設定](./enterprise.md)說明文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔案外，專案的 `.gemini` 目錄還可以包含與 Gemini CLI 操作相關的其他專案特定檔案，例如：

- [自訂沙箱設定檔](#sandboxing)（例如，`.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

### `settings.json` 中的可用設定

設定分為不同類別。所有設定都應放置在 `settings.json` 檔案中相對應的頂層類別物件內。

#### `general`

- **`general.preferredEditor`**（字串）：
  - **說明：** 開啟檔案的偏好編輯器。
  - **預設值：** `undefined`

- **`general.vimMode`**（布林值）：
  - **說明：** 啟用 Vim 鍵盤繫結。
  - **預設值：** `false`

- **`general.disableAutoUpdate`**（布林值）：
  - **說明：** 停用自動更新。
  - **預設值：** `false`

- **`general.disableUpdateNag`**（布林值）：
  - **說明：** 停用更新通知提示。
  - **預設值：** `false`

- **`general.checkpointing.enabled`**（布林值）：
  - **說明：** 啟用工作階段檢查點以供復原。
  - **預設值：** `false`

#### `ui`

- **`ui.theme`**（字串）：
  - **說明：** UI 的色彩主題。可用選項請參閱[主題](./themes.md)。
  - **預設值：** `undefined`

- **`ui.customThemes`**（物件）：
  - **說明：** 自訂主題定義。
  - **預設值：** `{}`

- **`ui.hideWindowTitle`**（布林值）：
  - **說明：** 隱藏視窗標題列。
  - **預設值：** `false`

- **`ui.hideTips`**（布林值）：
  - **說明：** 在 UI 中隱藏有用的提示。
  - **預設值：** `false`

- **`ui.hideBanner`**（布林值）：
  - **說明：** 隱藏應用程式橫幅。
  - **預設值：** `false`

- **`ui.hideFooter`**（布林值）：
  - **說明：** 從 UI 中隱藏頁尾。
  - **預設值：** `false`

- **`ui.showMemoryUsage`**（布林值）：
  - **說明：** 在 UI 中顯示記憶體使用量資訊。
  - **預設值：** `false`

- **`ui.showLineNumbers`**（布林值）：
  - **說明：** 在聊天中顯示行號。
  - **預設值：** `false`

- **`ui.accessibility.disableLoadingPhrases`**（布林值）：
  - **說明：** 為無障礙功能停用載入片語。
  - **預設值：** `false`

#### `ide`

- **`ide.enabled`**（布林值）：
  - **說明：** 啟用 IDE 整合模式。
  - **預設值：** `false`

- **`ide.hasSeenNudge`**（布林值）：
  - **說明：** 使用者是否已看過 IDE 整合提示。
  - **預設值：** `false`

#### `privacy`

- **`privacy.usageStatisticsEnabled`**（布林值）：
  - **說明：** 啟用使用統計資料收集。
  - **預設值：** `true`

#### `model`

- **`model.name`**（字串）：
  - **說明：** 用於對話的 Gemini 模型。
  - **預設值：** `undefined`

- **`model.maxSessionTurns`**（數字）：
  - **說明：** 工作階段中保留的使用者/模型/工具輪次的最大數量。-1 表示無限制。
  - **預設值：** `-1`

- **`model.summarizeToolOutput`**（物件）：
  - **說明：** 摘要工具輸出的設定。
  - **預設值：** `undefined`

- **`model.chatCompression`**（物件）：
  - **說明：** 聊天壓縮設定。
  - **預設值：** `undefined`

- **`model.skipNextSpeakerCheck`**（布林值）：
  - **說明：** 跳過下一位發言者檢查。
  - **預設值：** `false`

#### `context`

- **`context.fileName`**（字串或字串陣列）：
  - **說明：** 內容檔案的名稱。
  - **預設值：** `undefined`

- **`context.importFormat`**（字串）：
  - **說明：** 匯入記憶體時使用的格式。
  - **預設值：** `undefined`

- **`context.discoveryMaxDirs`**（數字）：
  - **說明：** 搜尋記憶體的最大目錄數量。
  - **預設值：** `200`

- **`context.includeDirectories`**（陣列）：
  - **說明：** 要包含在工作區內容中的額外目錄。遺失的目錄將被跳過並發出警告。
  - **預設值：** `[]`

- **`context.loadFromIncludeDirectories`**（布林值）：
  - **說明：** 是否從包含目錄載入記憶體檔案。
  - **預設值：** `false`

- **`context.fileFiltering.respectGitIgnore`**（布林值）：
  - **說明：** 搜尋時遵守 .gitignore 檔案。
  - **預設值：** `true`

- **`context.fileFiltering.respectGeminiIgnore`**（布林值）：
  - **說明：** 搜尋時遵守 .geminiignore 檔案。
  - **預設值：** `true`

- **`context.fileFiltering.enableRecursiveFileSearch`**（布林值）：
  - **說明：** 啟用遞迴檔案搜尋功能。
  - **預設值：** `true`

#### `tools`

- **`tools.sandbox`** (boolean or string):
  - **Description:** Sandbox execution environment (can be a boolean or a path string).
  - **Default:** `undefined`

- **`tools.usePty`** (boolean):
  - **Description:** Use node-pty for shell command execution. Fallback to child_process still applies.
  - **Default:** `false`

- **`tools.core`** (array of strings):
  - **Description:** Paths to core tool definitions.
  - **Default:** `undefined`

- **`tools.exclude`** (array of strings):
  - **Description:** Tool names to exclude from discovery.
  - **Default:** `undefined`

- **`tools.discoveryCommand`** (string):
  - **Description:** Command to run for tool discovery.
  - **Default:** `undefined`

- **`tools.callCommand`** (string):
  - **Description:** Command to run for tool calls.
  - **Default:** `undefined`

#### `mcp`

- **`mcp.serverCommand`** (string):
  - **Description:** Command to start an MCP server.
  - **Default:** `undefined`

- **`mcp.allowed`** (array of strings):
  - **Description:** A whitelist of MCP servers to allow.
  - **Default:** `undefined`

- **`mcp.excluded`** (array of strings):
  - **Description:** A blacklist of MCP servers to exclude.
  - **Default:** `undefined`

#### `security`

- **`security.folderTrust.featureEnabled`** (boolean):
  - **Description:** Enable folder trust feature for enhanced security.
  - **Default:** `false`

- **`security.folderTrust.enabled`** (boolean):
  - **Description:** Setting to track whether Folder trust is enabled.
  - **Default:** `false`

- **`security.auth.selectedType`** (string):
  - **Description:** The currently selected authentication type.
  - **Default:** `undefined`

- **`security.auth.useExternal`** (boolean):
  - **Description:** Whether to use an external authentication flow.
  - **Default:** `undefined`

#### `advanced`

- **`advanced.autoConfigureMemory`** (boolean):
  - **Description:** Automatically configure Node.js memory limits.
  - **Default:** `false`

- **`advanced.dnsResolutionOrder`** (string):
  - **Description:** The DNS resolution order.
  - **Default:** `undefined`

- **`advanced.excludedEnvVars`** (array of strings):
  - **Description:** Environment variables to exclude from project context.
  - **Default:** `["DEBUG","DEBUG_MODE"]`

- **`advanced.bugCommand`** (object):
  - **Description:** Configuration for the bug report command.
  - **Default:** `undefined`

#### Top-Level Settings

The following settings remain at the top level of the `settings.json` file.

- **`mcpServers`** (object):
  - **Description:** Configures connections to one or more Model-Context Protocol (MCP) servers for discovering and using custom tools. Gemini CLI attempts to connect to each configured MCP server to discover available tools. If multiple MCP servers expose a tool with the same name, the tool names will be prefixed with the server alias you defined in the configuration (e.g., `serverAlias__actualToolName`) to avoid conflicts. Note that the system might strip certain schema properties from MCP tool definitions for compatibility. At least one of `command`, `url`, or `httpUrl` must be provided. If multiple are specified, the order of precedence is `httpUrl`, then `url`, then `command`.
  - **Default:** `{}`
  - **Properties:**
    - **`<SERVER_NAME>`** (object): The server parameters for the named server.
      - `command` (string, optional): The command to execute to start the MCP server via standard I/O.
      - `args` (array of strings, optional): Arguments to pass to the command.
      - `env` (object, optional): Environment variables to set for the server process.
      - `cwd` (string, optional): The working directory in which to start the server.
      - `url` (string, optional): The URL of an MCP server that uses Server-Sent Events (SSE) for communication.
      - `httpUrl` (string, optional): The URL of an MCP server that uses streamable HTTP for communication.
      - `headers` (object, optional): A map of HTTP headers to send with requests to `url` or `httpUrl`.
      - `timeout` (number, optional): Timeout in milliseconds for requests to this MCP server.
      - `trust` (boolean, optional): Trust this server and bypass all tool call confirmations.
      - `description` (string, optional): A brief description of the server, which may be used for display purposes.
      - `includeTools` (array of strings, optional): List of tool names to include from this MCP server. When specified, only the tools listed here will be available from this server (whitelist behavior). If not specified, all tools from the server are enabled by default.
      - `excludeTools` (array of strings, optional): List of tool names to exclude from this MCP server. Tools listed here will not be available to the model, even if they are exposed by the server. **Note:** `excludeTools` takes precedence over `includeTools` - if a tool is in both lists, it will be excluded.

- **`telemetry`** (object)
  - **Description:** Configures logging and metrics collection for Gemini CLI. For more information, see [Telemetry](../telemetry.md).
  - **Default:** `undefined`
  - **Properties:**
    - **`enabled`** (boolean): Whether or not telemetry is enabled.
    - **`target`** (string): The destination for collected telemetry. Supported values are `local` and `gcp`.
    - **`otlpEndpoint`** (string): The endpoint for the OTLP Exporter.
    - **`otlpProtocol`** (string): The protocol for the OTLP Exporter (`grpc` or `http`).
    - **`logPrompts`** (boolean): Whether or not to include the content of user prompts in the logs.
    - **`outfile`** (string): The file to write telemetry to when `target` is `local`.

### Example `settings.json`

Here is an example of a `settings.json` file with the new nested structure:

```json
{
  "general": {
    "vimMode": true,
    "preferredEditor": "code"
  },
  "ui": {
    "theme": "GitHub",
    "hideBanner": true,
    "hideTips": false
  },
  "tools": {
    "sandbox": "docker",
    "discoveryCommand": "bin/get_tools",
    "callCommand": "bin/call_tool",
    "exclude": ["write_file"]
  },
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
  "privacy": {
    "usageStatisticsEnabled": true
  },
  "model": {
    "name": "gemini-1.5-pro-latest",
    "maxSessionTurns": 10,
    "summarizeToolOutput": {
      "run_shell_command": {
        "tokenBudget": 100
      }
    }
  },
  "context": {
    "fileName": ["CONTEXT.md", "GEMINI.md"],
    "includeDirectories": ["path/to/dir1", "~/path/to/dir2", "../path/to/dir3"],
    "loadFromIncludeDirectories": true,
    "fileFiltering": {
      "respectGitIgnore": false
    }
  },
  "advanced": {
    "excludedEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
  }
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

**Environment Variable Exclusion:** Some environment variables (like `DEBUG` and `DEBUG_MODE`) are automatically excluded from being loaded from project `.env` files to prevent interference with gemini-cli behavior. Variables from `.gemini/.env` files are never excluded. You can customize this behavior using the `advanced.excludedEnvVars` setting in your `settings.json` file.

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

While not strictly configuration for the CLI's _behavior_, context files (defaulting to `GEMINI.md` but configurable via the `context.fileName` setting) are crucial for configuring the _instructional context_ (also referred to as "memory") provided to the Gemini model. This powerful feature allows you to give project-specific instructions, coding style guides, or any relevant background information to the AI, making its responses more tailored and accurate to your needs. The CLI includes UI elements, such as an indicator in the footer showing the number of loaded context files, to keep you informed about the active context.

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
      - Location: `~/.gemini/<configured-context-filename>` (e.g., `~/.gemini/GEMINI.md` in your user home directory).
      - Scope: Provides default instructions for all your projects.
  2.  **Project Root & Ancestors Context Files:**
      - Location: The CLI searches for the configured context file in the current working directory and then in each parent directory up to either the project root (identified by a `.git` folder) or your home directory.
      - Scope: Provides context relevant to the entire project or a significant portion of it.
  3.  **Sub-directory Context Files (Contextual/Local):**
      - Location: The CLI also scans for the configured context file in subdirectories _below_ the current working directory (respecting common ignore patterns like `node_modules`, `.git`, etc.). The breadth of this search is limited to 200 directories by default, but can be configured with the `context.discoveryMaxDirs` setting in your `settings.json` file.
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

You can opt out of usage statistics collection at any time by setting the `usageStatisticsEnabled` property to `false` under the `privacy` category in your `settings.json` file:

```json
{
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```
