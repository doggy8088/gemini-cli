# 設定

**新設定格式說明**

`settings.json` 檔案的格式已更新為新的、更有條理的結構。

- 新格式將從 **09/10/25** 開始在穩定版本中受到支援。
- 從舊格式到新格式的自動遷移將於 **09/17/25** 開始。

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

- [自訂沙箱設定檔](#沙箱化)（例如，`.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

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

- **`tools.sandbox`**（布林值或字串）：
  - **說明：** 沙箱執行環境（可以是布林值或路徑字串）。
  - **預設值：** `undefined`

- **`tools.usePty`**（布林值）：
  - **說明：** 使用 node-pty 進行 Shell 指令執行。仍適用回退到 child_process。
  - **預設值：** `false`

- **`tools.core`**（字串陣列）：
  - **說明：** 核心工具定義的路徑。
  - **預設值：** `undefined`

- **`tools.exclude`**（字串陣列）：
  - **說明：** 要從探索中排除的工具名稱。
  - **預設值：** `undefined`

- **`tools.discoveryCommand`**（字串）：
  - **說明：** 要為工具探索執行的指令。
  - **預設值：** `undefined`

- **`tools.callCommand`**（字串）：
  - **說明：** 要為工具呼叫執行的指令。
  - **預設值：** `undefined`

#### `mcp`

- **`mcp.serverCommand`**（字串）：
  - **說明：** 啟動 MCP 伺服器的指令。
  - **預設值：** `undefined`

- **`mcp.allowed`**（字串陣列）：
  - **說明：** 允許的 MCP 伺服器白名單。
  - **預設值：** `undefined`

- **`mcp.excluded`**（字串陣列）：
  - **說明：** 要排除的 MCP 伺服器黑名單。
  - **預設值：** `undefined`

#### `security`

- **`security.folderTrust.featureEnabled`**（布林值）：
  - **說明：** 啟用資料夾信任功能以增強安全性。
  - **預設值：** `false`

- **`security.folderTrust.enabled`**（布林值）：
  - **說明：** 追蹤資料夾信任是否啟用的設定。
  - **預設值：** `false`

- **`security.auth.selectedType`**（字串）：
  - **說明：** 目前選取的驗證類型。
  - **預設值：** `undefined`

- **`security.auth.useExternal`**（布林值）：
  - **說明：** 是否使用外部驗證流程。
  - **預設值：** `undefined`

#### `advanced`

- **`advanced.autoConfigureMemory`**（布林值）：
  - **說明：** 自動設定 Node.js 記憶體限制。
  - **預設值：** `false`

- **`advanced.dnsResolutionOrder`**（字串）：
  - **說明：** DNS 解析順序。
  - **預設值：** `undefined`

- **`advanced.excludedEnvVars`**（字串陣列）：
  - **說明：** 要從專案內容中排除的環境變數。
  - **預設值：** `["DEBUG","DEBUG_MODE"]`

- **`advanced.bugCommand`**（物件）：
  - **說明：** 錯誤報告指令的設定。
  - **預設值：** `undefined`

#### 頂層設定

以下設定保留在 `settings.json` 檔案的頂層。

- **`mcpServers`**（物件）：
  - **說明：** 設定與一個或多個模型內容協定（MCP）伺服器的連線，以探索和使用自訂工具。Gemini CLI 會嘗試連線到每個設定的 MCP 伺服器以探索可用工具。如果多個 MCP 伺服器公開同名的工具，工具名稱將以您在設定中定義的伺服器別名為前綴（例如，`serverAlias__actualToolName`）以避免衝突。請注意，系統可能會為了相容性而從 MCP 工具定義中剝離某些結構描述屬性。必須提供 `command`、`url` 或 `httpUrl` 中的至少一個。如果指定多個，優先順序為 `httpUrl`，然後是 `url`，然後是 `command`。
  - **預設值：** `{}`
  - **屬性：**
    - **`<SERVER_NAME>`**（物件）：指定伺服器的伺服器參數。
      - `command`（字串，選用）：要執行以透過標準 I/O 啟動 MCP 伺服器的指令。
      - `args`（字串陣列，選用）：要傳遞給指令的引數。
      - `env`（物件，選用）：要為伺服器程序設定的環境變數。
      - `cwd`（字串，選用）：啟動伺服器的工作目錄。
      - `url`（字串，選用）：使用伺服器傳送事件（SSE）進行通訊的 MCP 伺服器 URL。
      - `httpUrl`（字串，選用）：使用可串流 HTTP 進行通訊的 MCP 伺服器 URL。
      - `headers`（物件，選用）：要與 `url` 或 `httpUrl` 請求一起傳送的 HTTP 標頭對應。
      - `timeout`（數字，選用）：對此 MCP 伺服器請求的逾時（毫秒）。
      - `trust`（布林值，選用）：信任此伺服器並繞過所有工具呼叫確認。
      - `description`（字串，選用）：伺服器的簡要描述，可能用於顯示目的。
      - `includeTools`（字串陣列，選用）：要從此 MCP 伺服器包含的工具名稱清單。指定時，只有此處列出的工具才能從此伺服器使用（白名單行為）。如果未指定，預設啟用伺服器的所有工具。
      - `excludeTools`（字串陣列，選用）：要從此 MCP 伺服器排除的工具名稱清單。此處列出的工具將無法供模型使用，即使伺服器公開了它們。**注意：** `excludeTools` 優先於 `includeTools` - 如果工具同時在兩個清單中，將被排除。

- **`telemetry`**（物件）
  - **說明：** 設定 Gemini CLI 的日誌記錄和指標收集。如需更多資訊，請參閱[遙測](../telemetry.md)。
  - **預設值：** `undefined`
  - **屬性：**
    - **`enabled`**（布林值）：是否啟用遙測。
    - **`target`**（字串）：收集的遙測資料的目的地。支援的值為 `local` 和 `gcp`。
    - **`otlpEndpoint`**（字串）：OTLP 匯出器的端點。
    - **`otlpProtocol`**（字串）：OTLP 匯出器的協定（`grpc` 或 `http`）。
    - **`logPrompts`**（布林值）：是否在日誌中包含使用者提示的內容。
    - **`outfile`**（字串）：當 `target` 為 `local` 時要寫入遙測資料的檔案。

### 範例 `settings.json`

以下是使用新巢狀結構的 `settings.json` 檔案範例：

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

## Shell 歷史記錄

CLI 會保留您執行的 Shell 指令歷史記錄。為了避免不同專案之間的衝突，此歷史記錄儲存在使用者主資料夾內的專案特定目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是從您專案的根路徑產生的唯一識別碼。
  - 歷史記錄儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的常見方式，特別是對於 API 金鑰等敏感資訊或可能在不同環境之間變更的設定。如需驗證設定，請參閱[驗證說明文件](./authentication.md)，其中涵蓋所有可用的驗證方法。

CLI 會自動從 `.env` 檔案載入環境變數。載入順序為：

1.  目前工作目錄中的 `.env` 檔案。
2.  如果找不到，它會向上搜尋父目錄，直到找到 `.env` 檔案或到達專案根目錄（由 `.git` 資料夾識別）或主目錄。
3.  如果仍然找不到，它會尋找 `~/.env`（在使用者的主目錄中）。

**環境變數排除：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動排除不從專案 `.env` 檔案載入，以防止干擾 gemini-cli 行為。來自 `.gemini/.env` 檔案的變數永遠不會被排除。您可以使用 `settings.json` 檔案中的 `advanced.excludedEnvVars` 設定來自訂此行為。

- **`GEMINI_API_KEY`**：
  - 您的 Gemini API 金鑰。
  - 多種可用[驗證方法](./authentication.md)之一。
  - 在您的 Shell 設定檔（例如，`~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中設定此項。
- **`GEMINI_MODEL`**：
  - 指定要使用的預設 Gemini 模型。
  - 覆蓋硬編碼預設值
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 您的 Google Cloud API 金鑰。
  - 在快速模式中使用 Vertex AI 時需要。
  - 確保您具有必要的權限。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 您的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 時需要。
  - 如果使用 Vertex AI，確保您在此專案中具有必要的權限。
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境中執行時，此變數預設為分配給 Cloud Shell 使用者的特殊專案。如果您在 Cloud Shell 的全域環境中設定了 `GOOGLE_CLOUD_PROJECT`，它將被此預設值覆蓋。要在 Cloud Shell 中使用不同的專案，您必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 您的 Google 應用程式憑證 JSON 檔案的路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 您在 Google Cloud 中用於遙測的 Google Cloud 專案 ID
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 您的 Google Cloud 專案位置（例如，us-central1）。
  - 在非快速模式中使用 Vertex AI 時需要。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - `settings.json` 中 `sandbox` 設定的替代方案。
  - 接受 `true`、`false`、`docker`、`podman` 或自訂指令字串。
- **`SEATBELT_PROFILE`**（macOS 特定）：
  - 在 macOS 上切換 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）限制寫入專案資料夾（以及其他一些資料夾，請參閱 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`）但允許其他操作。
  - `strict`：使用預設拒絕操作的嚴格設定檔。
  - `<profile_name>`：使用自訂設定檔。要定義自訂設定檔，請在專案的 `.gemini/` 目錄中建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如，`my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（通常由底層程式庫或 CLI 本身使用）：
  - 設定為 `true` 或 `1` 以啟用詳細偵錯日誌記錄，這對於疑難排解很有幫助。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案中排除，以防止干擾 gemini-cli 行為。如果您需要專門為 gemini-cli 設定這些變數，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設定為任何值以停用 CLI 中的所有顏色輸出。
- **`CLI_TITLE`**：
  - 設定為字串以自訂 CLI 的標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定程式碼協助伺服器的端點。
  - 這對於開發和測試很有用。

## 命令列引數

執行 CLI 時直接傳遞的引數可以覆蓋該特定工作階段的其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定此工作階段要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 用於直接將提示傳遞給指令。這會在非互動模式下呼叫 Gemini CLI。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以提供的提示作為初始輸入啟動互動工作階段。
  - 提示在互動工作階段內處理，而不是在它之前。
  - 從 stdin 管道輸入時無法使用。
  - 範例：`gemini -i "explain this code"`
- **`--sandbox`**（**`-s`**）：
  - 為此工作階段啟用沙箱模式。
- **`--sandbox-image`**：
  - 設定沙箱影像 URI。
- **`--debug`**（**`-d`**）：
  - 為此工作階段啟用偵錯模式，提供更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 如果設定，遞迴包含目前目錄內的所有檔案作為提示的內容。
- **`--help`**（或 **`-h`**）：
  - 顯示關於命令列引數的幫助資訊。
- **`--show-memory-usage`**：
  - 顯示目前的記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動批准所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的批准模式。可用模式：
    - `default`：對每個工具呼叫提示批准（預設行為）
    - `auto_edit`：自動批准編輯工具（replace、write_file）而對其他工具提示
    - `yolo`：自動批准所有工具呼叫（等同於 `--yolo`）
  - 無法與 `--yolo` 一起使用。請使用 `--approval-mode=yolo` 代替 `--yolo` 以採用新的統一方法。
  - 範例：`gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**：
  - 將繞過確認對話方塊的工具名稱逗號分隔清單。
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
  - 指定要用於工作階段的擴充功能清單。如果未提供，則使用所有可用的擴充功能。
  - 使用特殊術語 `gemini -e none` 來停用所有擴充功能。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用的擴充功能並退出。
- **`--proxy`**：
  - 設定 CLI 的代理。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在工作區中包含額外目錄以支援多目錄。
  - 可以多次指定或作為逗號分隔的值。
  - 最多可以新增 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕閱讀器模式以提供無障礙功能。
- **`--version`**：
  - 顯示 CLI 的版本。

## 內容檔案（階層式指示內容）

雖然嚴格來說不是 CLI _行為_ 的設定，但內容檔案（預設為 `GEMINI.md`，但可透過 `context.fileName` 設定進行設定）對於設定提供給 Gemini 模型的_指示內容_（也稱為「記憶體」）至關重要。這個強大的功能允許您向 AI 提供專案特定的指示、編碼風格指南或任何相關的背景資訊，使其回應更符合您的需求且更準確。CLI 包含 UI 元素，例如頁尾中顯示已載入內容檔案數量的指示器，讓您了解啟用的內容。

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

- **階層式載入和優先順序：** CLI 透過從多個位置載入內容檔案（例如，`GEMINI.md`）實作複雜的階層式記憶體系統。來自此清單較低位置（更具體）的檔案內容通常會覆蓋或補充來自較高位置（更一般）的檔案內容。確切的串聯順序和最終內容可以使用 `/memory show` 指令檢查。典型的載入順序為：
  1.  **全域內容檔案：**
      - 位置：`~/.gemini/<configured-context-filename>`（例如，您使用者主目錄中的 `~/.gemini/GEMINI.md`）。
      - 範圍：為您的所有專案提供預設指示。
  2.  **專案根目錄與祖先內容檔案：**
      - 位置：CLI 在目前工作目錄中搜尋設定的內容檔案，然後在每個父目錄中向上搜尋，直到專案根目錄（由 `.git` 資料夾識別）或您的主目錄。
      - 範圍：提供與整個專案或其重要部分相關的內容。
  3.  **子目錄內容檔案（內容相關/本機）：**
      - 位置：CLI 也在目前工作目錄_下方_的子目錄中掃描設定的內容檔案（遵守常見的忽略模式，如 `node_modules`、`.git` 等）。預設情況下，此搜尋的廣度限制為 200 個目錄，但可以使用 `settings.json` 檔案中的 `context.discoveryMaxDirs` 設定進行設定。
      - 範圍：允許與專案的特定元件、模組或子部分相關的高度具體指示。
- **串聯與 UI 指示：** 所有找到的內容檔案的內容會串聯（使用指示其來源和路徑的分隔符號）並作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾顯示已載入內容檔案的計數，讓您快速視覺化啟用的指示內容。
- **匯入內容：** 您可以使用 `@path/to/file.md` 語法匯入其他 Markdown 檔案來模組化您的內容檔案。如需更多詳細資訊，請參閱[記憶體匯入處理器說明文件](../core/memport.md)。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 強制重新掃描並重新載入來自所有設定位置的所有內容檔案。這會更新 AI 的指示內容。
  - 使用 `/memory show` 顯示目前載入的組合指示內容，讓您驗證 AI 使用的階層和內容。
  - 有關 `/memory` 指令及其子指令（`show` 和 `refresh`）的完整詳細資訊，請參閱[指令說明文件](./commands.md#內建指令)。

透過理解和利用這些設定層級以及內容檔案的階層性質，您可以有效管理 AI 的記憶體並將 Gemini CLI 的回應調整為您的特定需求和專案。

## 沙箱化

Gemini CLI 可以在沙箱環境中執行潛在不安全的操作（如 Shell 指令和檔案修改）以保護您的系統。

沙箱化預設是停用的，但您可以透過幾種方式啟用它：

- 使用 `--sandbox` 或 `-s` 旗標。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 預設情況下，使用 `--yolo` 或 `--approval-mode=yolo` 時會啟用沙箱。

預設情況下，它使用預建的 `gemini-cli-sandbox` Docker 影像。

對於專案特定的沙箱需求，您可以在專案的根目錄中建立自訂 Dockerfile，位於 `.gemini/sandbox.Dockerfile`。此 Dockerfile 可以基於基礎沙箱影像：

```dockerfile
FROM gemini-cli-sandbox

# 在此處新增您的自訂相依性或設定
# 例如：
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當 `.gemini/sandbox.Dockerfile` 存在時，您可以在執行 Gemini CLI 時使用 `BUILD_SANDBOX` 環境變數來自動建置自訂沙箱影像：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用統計資料

為了幫助我們改善 Gemini CLI，我們收集匿名使用統計資料。此資料幫助我們了解 CLI 的使用方式、識別常見問題並優先處理新功能。

**我們收集的內容：**

- **工具呼叫：** 我們記錄被呼叫的工具名稱、是否成功或失敗，以及執行所需的時間。我們不會收集傳遞給工具的引數或工具傳回的任何資料。
- **API 請求：** 我們記錄每個請求使用的 Gemini 模型、請求的持續時間以及是否成功。我們不會收集提示或回應的內容。
- **工作階段資訊：** 我們收集有關 CLI 設定的資訊，例如啟用的工具和批准模式。

**我們不收集的內容：**

- **個人身分識別資訊（PII）：** 我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示和回應內容：** 我們不會記錄您的提示內容或來自 Gemini 模型的回應。
- **檔案內容：** 我們不會記錄 CLI 讀取或寫入的任何檔案內容。

**如何選擇退出：**

您可以隨時透過在 `settings.json` 檔案中的 `privacy` 類別下將 `usageStatisticsEnabled` 屬性設定為 `false` 來選擇退出使用統計資料收集：

```json
{
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```
