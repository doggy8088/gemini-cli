# Gemini CLI 設定

**新設定格式說明**

`settings.json` 檔案的格式已更新為更有組織的新結構。

- 新格式將於穩定版本 **[09/10/25]** 起支援。
- 從舊格式自動遷移至新格式將於 **[09/17/25]** 開始。

關於舊格式的詳細資訊，請參閱 [v1 設定文件](./configuration-v1.md)。

Gemini CLI 提供多種方式來設定其行為，包括環境變數、命令列參數，以及設定檔。本文件將說明不同的設定方法與可用設定項目。

## 設定層級

設定會依以下優先順序套用（數字越小會被後面的數字覆蓋）：

1.  **預設值：** 內建於應用程式的預設值。
2.  **系統預設檔案：** 系統層級的預設設定，可被其他設定檔覆蓋。
3.  **使用者設定檔案：** 目前使用者的全域設定。
4.  **專案設定檔案：** 專案專屬的設定。
5.  **系統設定檔案：** 可覆蓋所有其他設定檔的系統層級設定。
6.  **環境變數：** 系統或工作階段專屬的變數，可能從 `.env` 檔案載入。
7.  **命令列參數：** 啟動 CLI 時傳遞的值。

## 設定檔案

Gemini CLI 使用 JSON 設定檔案來進行持久化設定。這些檔案有四個位置：

- **系統預設檔案：**
  - **位置：** `/etc/gemini-cli/system-defaults.json`（Linux）、`C:\ProgramData\gemini-cli\system-defaults.json`（Windows）或 `/Library/Application Support/GeminiCli/system-defaults.json`（macOS）。可使用 `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` 環境變數覆蓋此路徑。
  - **範圍：** 提供系統層級的預設設定基礎。這些設定優先權最低，預期會被使用者、專案或系統覆寫設定覆蓋。
- **使用者設定檔案：**
  - **位置：** `~/.gemini/settings.json`（其中 `~` 為你的家目錄）。
  - **範圍：** 適用於目前使用者的所有 Gemini CLI 工作階段。使用者設定會覆蓋系統預設。
- **專案設定檔案：**
  - **位置：** 你的專案根目錄下的 `.gemini/settings.json`。
  - **範圍：** 僅在從該專案執行 Gemini CLI 時適用。專案設定會覆蓋使用者設定與系統預設。
- **系統設定檔案：**
  - **位置：** `/etc/gemini-cli/settings.json`（Linux）、`C:\ProgramData\gemini-cli\settings.json`（Windows）或 `/Library/Application Support/GeminiCli/settings.json`（macOS）。可使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆蓋此路徑。
  - **範圍：** 適用於系統上所有使用者的 Gemini CLI 工作階段。系統設定作為覆寫，優先於所有其他設定檔。對於企業系統管理員控管使用者的 Gemini CLI 設定特別有用。

**關於設定檔中的環境變數說明：** 你的 `settings.json` 檔案中的字串值可以透過 `$VAR_NAME` 或 `${VAR_NAME}` 語法引用環境變數。這些變數在載入設定時會自動解析。例如，如果你有環境變數 `MY_API_TOKEN`，可以在 `settings.json` 中這樣使用：`"apiKey": "$MY_API_TOKEN"`。

> **企業用戶注意：** 關於在企業環境中部署與管理 Gemini CLI 的指引，請參閱 [企業設定](./enterprise.md) 文件。

### 專案中的 `.gemini` 目錄

除了專案設定檔外，專案的 `.gemini` 目錄還可包含其他與 Gemini CLI 運作相關的專案專屬檔案，例如：

- [自訂沙箱設定檔](#sandboxing)（例如 `.gemini/sandbox-macos-custom.sb`、`.gemini/sandbox.Dockerfile`）。

### `settings.json` 中可用的設定

設定依類別組織。所有設定都應放在 `settings.json` 檔案中對應的頂層類別物件下。

#### `general`

- **`general.preferredEditor`**（字串）：
  - **說明：** 偏好的檔案開啟編輯器。
  - **預設值：** `undefined`

- **`general.vimMode`**（布林值）：
  - **說明：** 啟用 Vim 鍵綁定。
  - **預設值：** `false`

- **`general.disableAutoUpdate`**（布林值）：
  - **說明：** 停用自動更新。
  - **預設值：** `false`

- **`general.disableUpdateNag`**（布林值）：
  - **說明：** 停用更新通知提示。
  - **預設值：** `false`

- **`general.checkpointing.enabled`**（布林值）：
  - **說明：** 啟用工作階段檢查點以利復原。
  - **預設值：** `false`

#### `output`

- **`output.format`**（字串）：
  - **說明：** CLI 輸出的格式。
  - **預設值：** `"text"`
  - **可用值：** `"text"`、`"json"`

#### `ui`

- **`ui.theme`**（字串）：
  - **說明：** UI 的配色主題。可用選項請參見 [主題](./themes.md)。
  - **預設值：** `undefined`

- **`ui.customThemes`**（物件）：
  - **說明：** 自訂主題定義。
  - **預設值：** `{}`

- **`ui.hideWindowTitle`**（布林值）：
  - **說明：** 隱藏視窗標題列。
  - **預設值：** `false`

- **`ui.hideTips`**（布林值）：
  - **說明：** 隱藏 UI 中的提示說明。
  - **預設值：** `false`

- **`ui.hideBanner`**（布林值）：
  - **說明：** 隱藏應用程式橫幅。
  - **預設值：** `false`

- **`ui.hideFooter`**（布林值）：
  - **說明：** 隱藏 UI 的頁尾。
  - **預設值：** `false`

- **`ui.showMemoryUsage`**（布林值）：
  - **說明：** 在 UI 中顯示記憶體使用資訊。
  - **預設值：** `false`

- **`ui.showLineNumbers`**（布林值）：
  - **說明：** 在聊天中顯示行號。
  - **預設值：** `false`

- **`ui.showCitations`**（布林值）：
  - **說明：** 在聊天中顯示產生文字的引用來源。
  - **預設值：** `true`

- **`ui.accessibility.disableLoadingPhrases`**（布林值）：
  - **說明：** 為無障礙需求停用載入提示語。
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

- **`model.maxSessionTurns`**（數值）：
  - **說明：** 工作階段中保留的使用者/模型/工具輪數上限。-1 代表無限制。
  - **預設值：** `-1`

- **`model.summarizeToolOutput`**（物件）：
  - **說明：** 啟用或停用工具輸出摘要。你可以透過 `tokenBudget` 設定指定摘要的 token 預算。注意：目前僅支援 `run_shell_command` 工具。例如 `{"run_shell_command": {"tokenBudget": 2000}}`
  - **預設值：** `undefined`

- **`model.chatCompression.contextPercentageThreshold`**（數值）：
  - **說明：** 設定聊天記錄壓縮的臨界值，為模型總 token 限制的百分比。此值介於 0 與 1 之間，適用於自動壓縮及手動 `/compress` 指令。例如，設定為 `0.6` 時，當聊天記錄超過 token 限制的 60% 時會觸發壓縮。
  - **預設值：** `0.7`

- **`model.skipNextSpeakerCheck`**（布林值）：
  - **說明：** 跳過下一個說話者檢查。
  - **預設值：** `false`

#### `context`

- **`context.fileName`**（字串或字串陣列）：
  - **說明：** context 檔案名稱。
  - **預設值：** `undefined`

- **`context.importFormat`**（字串）：
  - **說明：** 匯入記憶體時使用的格式。
  - **預設值：** `undefined`

- **`context.discoveryMaxDirs`**（數值）：
  - **說明：** 搜尋記憶體時最多搜尋的目錄數。
  - **預設值：** `200`

- **`context.includeDirectories`**（陣列）：
  - **說明：** 要額外納入 workspace context 的目錄。缺少的目錄會跳過並顯示警告。
  - **預設值：** `[]`

- **`context.loadFromIncludeDirectories`**（布林值）：
  - **說明：** 控制 `/memory refresh` 指令的行為。若設為 `true`，`GEMINI.md` 檔案應從所有新增的目錄載入。若設為 `false`，`GEMINI.md` 只從目前目錄載入。
  - **預設值：** `false`

- **`context.fileFiltering.respectGitIgnore`**（布林值）：
  - **說明：** 搜尋時是否遵循 .gitignore 檔案。
  - **預設值：** `true`

- **`context.fileFiltering.respectGeminiIgnore`**（布林值）：
  - **說明：** 搜尋時是否遵循 .geminiignore 檔案。
  - **預設值：** `true`

- **`context.fileFiltering.enableRecursiveFileSearch`**（布林值）：
  - **說明：** 在提示中補全 `@` 前綴時，是否啟用於目前樹狀結構下遞迴搜尋檔名。
  - **預設值：** `true`

#### `tools`

- **`tools.sandbox`**（布林值或字串）：
  - **說明：** 沙箱執行環境（可為布林值或路徑字串）。
  - **預設值：** `undefined`

- **`tools.shell.enableInteractiveShell`**（布林值）：

  使用 `node-pty` 以獲得互動式 shell 體驗。仍可回退至 `child_process`。預設為 `false`。

- **`tools.core`**（字串陣列）：
  - **說明：** 可用來限制內建工具集 [使用允許清單](./enterprise.md#restricting-tool-access)。核心工具清單請見 [內建工具](../core/tools-api.md#built-in-tools)。比對語意與 `tools.allowed` 相同。
  - **預設值：** `undefined`

- **`tools.exclude`**（字串陣列）：
  - **說明：** 要排除於探索之外的工具名稱。
  - **預設值：** `undefined`

- **`tools.allowed`**（字串陣列）：
  - **說明：** 不需確認對話框即可執行的工具名稱清單。適用於你信任且經常使用的工具。例如，`["run_shell_command(git)", "run_shell_command(npm test)"]` 會略過任何 `git` 和 `npm test` 指令的確認對話框。關於前綴比對、指令串接等細節請參閱 [Shell 工具指令限制](../tools/shell.md#command-restrictions)。
  - **預設值：** `undefined`

- **`tools.discoveryCommand`**（字串）：
  - **說明：** 用於工具探索的指令。
  - **預設值：** `undefined`

- **`tools.callCommand`**（字串）：
  - **說明：** 定義針對透過 `tools.discoveryCommand` 探索到的特定工具所呼叫的自訂 shell 指令。該 shell 指令必須符合以下條件：
    - 第一個命令列參數必須為 function `name`（格式同 [function 宣告](https://ai.google.dev/gemini-api/docs/function-calling#function-declarations)）。
    - 必須從 `stdin` 讀取 function 參數（類似於 [`functionCall.args`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)）。
    - 必須將 function 輸出以 JSON 格式寫至 `stdout`（類似於 [`functionResponse.response.content`](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)）。
  - **預設值：** `undefined`

#### `mcp`

- **`mcp.serverCommand`**（字串）：
  - **說明：** 啟動 MCP 伺服器的指令。
  - **預設值：** `undefined`

- **`mcp.allowed`**（字串陣列）：
  - **說明：** MCP

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

命令列介面 (CLI) 會保留你執行過的 shell 指令歷史。為了避免不同專案間的衝突，這些歷史記錄會儲存在你使用者家目錄下、專案專屬的目錄中。

- **位置：** `~/.gemini/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是根據你的專案根目錄路徑產生的唯一識別碼。
  - 歷史記錄會儲存在名為 `shell_history` 的檔案中。

## 環境變數與 `.env` 檔案

環境變數是設定應用程式的一種常見方式，特別適合用於 API 金鑰等敏感資訊，或是在不同環境間可能變動的設定。關於驗證設定，請參閱 [Authentication documentation](./authentication.md)，其中涵蓋所有可用的驗證方法。

CLI 會自動從 `.env` 檔案載入環境變數。載入順序如下：

1.  目前工作目錄下的 `.env` 檔案。
2.  若未找到，則會往上搜尋父目錄，直到找到 `.env` 檔案，或到達專案根目錄（以 `.git` 資料夾識別）或家目錄為止。
3.  若仍未找到，則會尋找 `~/.env`（於使用者家目錄中）。

**環境變數排除說明：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案的 `.env` 檔案排除載入，以避免影響 gemini-cli 行為。來自 `.gemini/.env` 檔案的變數則永不會被排除。你可以透過 `advanced.excludedEnvVars` 設定在 `settings.json` 檔案中自訂這個行為。

- **`GEMINI_API_KEY`**：
  - 你的 Gemini API 金鑰。
  - 眾多 [驗證方法](./authentication.md) 之一。
  - 可設於 shell 設定檔（如 `~/.bashrc`、`~/.zshrc`）或 `.env` 檔案中。
- **`GEMINI_MODEL`**：
  - 指定預設要使用的 Gemini 模型。
  - 會覆蓋內建預設值。
  - 範例：`export GEMINI_MODEL="gemini-2.5-flash"`
- **`GOOGLE_API_KEY`**：
  - 你的 Google Cloud API 金鑰。
  - 使用 Vertex AI Express Mode 時必須提供。
  - 請確保你擁有必要的權限。
  - 範例：`export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"`。
- **`GOOGLE_CLOUD_PROJECT`**：
  - 你的 Google Cloud 專案 ID。
  - 使用 Code Assist 或 Vertex AI 時必須提供。
  - 若使用 Vertex AI，請確保你在此專案中擁有必要的權限。
  - **Cloud Shell 注意事項：** 在 Cloud Shell 環境執行時，此變數預設為分配給 Cloud Shell 使用者的特殊專案。如果你在 Cloud Shell 的全域環境中設定了 `GOOGLE_CLOUD_PROJECT`，將會被此預設值覆蓋。若要在 Cloud Shell 中使用不同的專案，必須在 `.env` 檔案中定義 `GOOGLE_CLOUD_PROJECT`。
  - 範例：`export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_APPLICATION_CREDENTIALS`**（字串）：
  - **說明：** 指向你的 Google Application Credentials JSON 檔案的路徑。
  - **範例：** `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_GOOGLE_CLOUD_PROJECT`**：
  - 你在 Google Cloud 上用於遙測 (telemetry) 的 Google Cloud 專案 ID
  - 範例：`export OTLP_GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"`。
- **`GOOGLE_CLOUD_LOCATION`**：
  - 你的 Google Cloud 專案位置（如 us-central1）。
  - 使用非 Express Mode 的 Vertex AI 時必須提供。
  - 範例：`export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"`。
- **`GEMINI_SANDBOX`**：
  - 作為 `settings.json` 中 `sandbox` 設定的替代方案。
  - 可接受 `true`、`false`、`docker`、`podman`，或自訂指令字串。
- **`SEATBELT_PROFILE`**（僅限 macOS）：
  - 切換 macOS 上的 Seatbelt（`sandbox-exec`）設定檔。
  - `permissive-open`：（預設）僅允許寫入專案資料夾（及其他少數資料夾，詳見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），但允許其他操作。
  - `strict`：使用嚴格設定檔，預設拒絕所有操作。
  - `<profile_name>`：使用自訂設定檔。若要定義自訂設定檔，請在專案的 `.gemini/` 目錄下建立名為 `sandbox-macos-<profile_name>.sb` 的檔案（例如 `my-project/.gemini/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`**（通常由底層函式庫或 CLI 本身使用）：
  - 設為 `true` 或 `1` 可啟用詳細除錯日誌，有助於疑難排解。
  - **注意：** 這些變數預設會自動從專案 `.env` 檔案排除，以避免影響 gemini-cli 行為。若需專為 gemini-cli 設定，請使用 `.gemini/.env` 檔案。
- **`NO_COLOR`**：
  - 設定任意值即可停用 CLI 所有彩色輸出。
- **`CLI_TITLE`**：
  - 設定字串可自訂 CLI 標題。
- **`CODE_ASSIST_ENDPOINT`**：
  - 指定 code assist 伺服器的 endpoint。
  - 適合開發與測試用途。

## 命令列參數

直接在執行 CLI 時傳遞的參數，可以覆蓋該次執行階段的其他設定。

- **`--model <model_name>`**（**`-m <model_name>`**）：
  - 指定本次執行要使用的 Gemini 模型。
  - 範例：`npm start -- --model gemini-1.5-pro-latest`
- **`--prompt <your_prompt>`**（**`-p <your_prompt>`**）：
  - 直接將提示詞傳給指令，會以非互動模式執行 Gemini CLI。
  - 若需腳本範例，請搭配 `--output-format json` 旗標取得結構化輸出。
- **`--prompt-interactive <your_prompt>`**（**`-i <your_prompt>`**）：
  - 以提供的提示詞作為初始輸入，啟動互動式會話。
  - 提示詞會在互動式會話中處理，而非啟動前。
  - 無法與 stdin 輸入導管同時使用。
  - 範例：`gemini -i "explain this code"`
- **`--output-format <format>`**：
  - **說明：** 指定非互動模式下 CLI 輸出的格式。
  - **可選值：**
    - `text`：（預設）標準的人類可讀輸出。
    - `json`：機器可讀的 JSON 輸出。
  - **注意：** 若需結構化輸出與腳本整合，請使用 `--output-format json` 旗標。
- **`--sandbox`**（**`-s`**）：
  - 啟用本次執行的沙箱機制 (sandbox mode)。
- **`--sandbox-image`**：
  - 設定 sandbox 映像檔 URI。
- **`--debug`**（**`-d`**）：
  - 啟用本次執行的除錯模式，提供更詳細的輸出。
- **`--all-files`**（**`-a`**）：
  - 若設定，會將目前目錄下所有檔案遞迴納入 prompt 的 context。
- **`--help`**（或 **`-h`**）：
  - 顯示命令列參數的說明資訊。
- **`--show-memory-usage`**：
  - 顯示目前的記憶體使用量。
- **`--yolo`**：
  - 啟用 YOLO 模式，自動允許所有工具呼叫。
- **`--approval-mode <mode>`**：
  - 設定工具呼叫的核准模式。可用模式：
    - `default`：每次工具呼叫時提示核准（預設行為）
    - `auto_edit`：自動核准編輯工具（replace、write_file），其餘仍提示
    - `yolo`：自動核准所有工具呼叫（等同於 `--yolo`）
  - 不能與 `--yolo` 同時使用。請以 `--approval-mode=yolo` 取代 `--yolo`，採用新的統一方式。
  - 範例：`gemini --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**：
  - 以逗號分隔的工具名稱清單，這些工具將略過確認對話框。
  - 範例：`gemini --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**：
  - 啟用 [遙測 (telemetry)](../telemetry.md)。
- **`--telemetry-target`**：
  - 設定遙測 (telemetry) 目標。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**：
  - 設定遙測 (telemetry) 的 OTLP endpoint。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-otlp-protocol`**：
  - 設定遙測 (telemetry) 的 OTLP 協定（`grpc` 或 `http`），預設為 `grpc`。詳見 [telemetry](../telemetry.md)。
- **`--telemetry-log-prompts`**：
  - 啟用遙測 (telemetry) 的 prompt 紀錄。詳見 [telemetry](../telemetry.md)。
- **`--checkpointing`**：
  - 啟用 [checkpointing](../checkpointing.md)。
- **`--extensions <extension_name ...>`**（**`-e <extension_name ...>`**）：
  - 指定本次會話要使用的擴充套件清單。若未指定，則會載入所有可用擴充套件。
  - 使用特殊詞彙 `gemini -e none` 可停用所有擴充套件。
  - 範例：`gemini -e my-extension -e my-other-extension`
- **`--list-extensions`**（**`-l`**）：
  - 列出所有可用擴充套件並結束執行。
- **`--proxy`**：
  - 設定 CLI 的代理伺服器。
  - 範例：`--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**：
  - 在 workspace 中加入額外目錄，以支援多個目錄。
  - 可重複指定，或以逗號分隔多個值。
  - 最多可加入 5 個目錄。
  - 範例：`--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**：
  - 啟用螢幕閱讀器模式，讓 TUI 更適合螢幕閱讀器使用。
- **`--version`**：
  - 顯示 CLI 的版本。

## Context 檔案（階層式指令 context）

雖然 context 檔案（預設為 `GEMINI.md`，但可透過 `context.fileName` 設定調整）不完全屬於 CLI「行為」的設定，但它們對於設定提供給 Gemini 模型的「指令 context」（也稱為「記憶體」）至關重要。這個強大的功能讓你能夠為 AI 提供專案專屬的指令、程式碼風格指南，或任何相關背景資訊，使其回應更貼合你的需求。CLI 也會在 UI 中顯示相關元素，例如頁腳會顯示已載入 context 檔案的數量，方便你掌握目前的 context 狀態。

- **用途：** 這些 Markdown 檔案包含你希望 Gemini 模型在互動過程中知曉的指令、指引或 context。系統設計為階層式管理這些指令 context。

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

本範例說明了如何提供一般專案 context、特定的程式撰寫慣例，甚至是針對特定檔案或元件的備註。您的 context 檔案越具相關性與精確性，AI 的協助效果就越好。強烈建議建立專案專屬的 context 檔案，以建立慣例與 context。

- **階層式載入與優先順序：** 命令列介面 (CLI) 透過從多個位置載入 context 檔案（如 `GEMINI.md`），實現了先進的階層式記憶系統。列表中較下方（更具體）的檔案內容，通常會覆蓋或補充較上方（較一般）檔案的內容。您可以透過 `/memory show` 指令檢查實際的串接順序與最終 context。典型的載入順序如下：
  1.  **全域 context 檔案：**
      - 位置：`~/.gemini/<configured-context-filename>`（例如，您使用者家目錄下的 `~/.gemini/GEMINI.md`）。
      - 範圍：為所有專案提供預設指示。
  2.  **專案根目錄與上層目錄 context 檔案：**
      - 位置：CLI 會在目前工作目錄，然後依序往上至專案根目錄（以 `.git` 資料夾識別）或您的家目錄，搜尋已設定的 context 檔案。
      - 範圍：提供與整個專案或其大部分相關的 context。
  3.  **子目錄 context 檔案（情境式／區域性）：**
      - 位置：CLI 也會在目前工作目錄「之下」的子目錄中，搜尋已設定的 context 檔案（會遵循常見的忽略模式，如 `node_modules`、`.git` 等）。預設搜尋範圍限制為 200 個目錄，但可透過 `settings.json` 檔案中的 `context.discoveryMaxDirs` 設定調整。
      - 範圍：允許針對特定元件、模組或專案子區塊，提供高度專屬的指示。
- **串接與 UI 指示：** 所有找到的 context 檔案內容會串接在一起（並以分隔符標示來源與路徑），並作為系統提示的一部分提供給 Gemini 模型。CLI 頁尾會顯示已載入 context 檔案的數量，讓您快速掌握當前啟用的指示 context。
- **內容匯入：** 您可以透過 `@path/to/file.md` 語法，將其他 Markdown 檔案匯入以模組化您的 context 檔案。詳情請參閱 [記憶匯入處理器文件](../core/memport.md)。
- **記憶體管理指令：**
  - 使用 `/memory refresh` 可強制重新掃描並重新載入所有已設定位置的 context 檔案，更新 AI 的指示 context。
  - 使用 `/memory show` 可顯示目前已載入的合併指示 context，讓您驗證 AI 實際採用的階層與內容。
  - `/memory` 指令及其子指令（`show` 與 `refresh`）的完整說明，請參閱 [指令文件](./commands.md#memory)。

透過理解並善用這些設定層級及 context 檔案的階層特性，您可以有效管理 AI 的記憶體，並針對您的專案與需求調整 Gemini CLI 的回應。

## 沙箱機制（Sandboxing）

Gemini CLI 可在沙箱機制下執行可能不安全的操作（如 shell 指令與檔案修改），以保護您的系統。

沙箱機制預設為停用，但您可以透過以下方式啟用：

- 使用 `--sandbox` 或 `-s` 旗標 (flag)。
- 設定 `GEMINI_SANDBOX` 環境變數。
- 使用 `--yolo` 或 `--approval-mode=yolo` 時，沙箱機制預設啟用。

預設情況下，會使用預先建置好的 `gemini-cli-sandbox` Docker 映像檔。

若有專案專屬的沙箱需求，您可以在專案根目錄下的 `.gemini/sandbox.Dockerfile` 建立自訂 Dockerfile。此 Dockerfile 可基於預設的 sandbox 映像檔進行擴充：

```dockerfile
FROM gemini-cli-sandbox

# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

當`.gemini/sandbox.Dockerfile`存在時，您可以在執行 Gemini CLI 時，使用`BUILD_SANDBOX`環境變數，自動建置自訂的 sandbox 映像檔：

```bash
BUILD_SANDBOX=1 gemini -s
```

## 使用統計資料

為了協助我們改進 Gemini CLI，我們會收集匿名化的使用統計資料。這些資料有助於我們了解 CLI 的使用情形、識別常見問題，並協助新功能的優先排序。

**我們會收集的資料：**

- **工具呼叫 (Tool Calls)：**我們會記錄被呼叫的工具名稱、執行是否成功，以及執行所需的時間。我們不會收集傳遞給工具的參數或工具回傳的任何資料。
- **API 請求 (API Requests)：**我們會記錄每個請求所使用的 Gemini 模型、請求的持續時間，以及是否成功。我們不會收集提示詞（prompt）或回應的內容。
- **工作階段資訊 (Session Information)：**我們會收集有關 CLI 設定的資訊，例如啟用的工具和核准模式（approval mode）。

**我們不會收集的資料：**

- **可識別個人身分的資訊 (PII)：**我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。
- **提示詞與回應內容：**我們不會記錄您的提示詞內容或 Gemini 模型的回應內容。
- **檔案內容：**我們不會記錄任何由 CLI 讀取或寫入的檔案內容。

**如何選擇不參與（opt out）：**

您可以隨時透過在您的 `settings.json` 檔案中，於 `privacy` 分類下將 `usageStatisticsEnabled` 屬性設為 `false`，來選擇不參與使用統計資料的收集：

```json
{
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```
