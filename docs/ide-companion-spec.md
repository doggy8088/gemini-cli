# Gemini CLI Companion 插ty插件：介面規格

> 最後更新日期：2025 年 9 月 15 日

本文檔定義了建立 Gemini CLI Companion 插ty插件以啟用 Gemini CLI 的 IDE 模式所需遵循的契約。對於 Visual Studio Code，這些功能（原生 diff 檢視、context 感知）由官方擴充套件提供（[marketplace](https://marketplace.visualstudio.com/items?itemName=Google.gemini-cli-vscode-ide-companion)）。本規格適用於希望將類似功能帶到其他編輯器（如 JetBrains IDE、Sublime Text 等）的貢獻者。

## I. 通訊介面

Gemini CLI 與 IDE 插ty插件透過本地通訊通道進行溝通。

### 1. 傳輸層：MCP over HTTP

插件**必須**執行一個本地 HTTP 伺服器，並實作**Model Context Protocol (MCP)**。

- **協定：** 伺服器必須為有效的 MCP 伺服器。我們建議優先使用你所選語言現有的 MCP SDK（若有提供）。
- **端點：** 伺服器應僅暴露一個端點（例如 `/mcp`）以進行所有 MCP 通訊。
- **埠號：** 伺服器**必須**監聽動態分配的埠號（即監聽埠號 `0`）。

### 2. 探索機制：埠號檔案

為了讓 Gemini CLI 能夠連線，必須能夠發現其運行於哪個 IDE 實例，以及你的伺服器所使用的埠號。插件**必須**藉由建立「探索檔案」來協助這一過程。

- **CLI 如何找到該檔案：** CLI 會透過遍歷程序樹來判斷所運行的 IDE 的 Process ID (PID)，然後尋找檔名中包含該 PID 的探索檔案。
- **檔案位置：** 檔案必須建立於特定目錄：`os.tmpdir()/gemini/ide/`。若該目錄不存在，你的插件必須自動建立。
- **檔案命名規則：** 檔名非常重要，**必須**遵循以下格式：
  `gemini-ide-server-${PID}-${PORT}.json`
  - `${PID}`：父層 IDE 程序的 Process ID。你的插件必須判斷此 PID 並將其包含於檔名中。
  - `${PORT}`：你的 MCP 伺服器所監聽的埠號。
- **檔案內容與 workspace 驗證：** 檔案**必須**包含以下結構的 JSON 物件：

  ```json
  {
    "port": 12345,
    "workspacePath": "/path/to/project1:/path/to/project2",
    "authToken": "a-very-secret-token",
    "ideInfo": {
      "name": "vscode",
      "displayName": "VS Code"
    }
  }
  ```
  - `port`（number，必填）：MCP 伺服器的埠號。
  - `workspacePath`（string，必填）：所有已開啟 workspace 根目錄路徑的清單，並以作業系統專屬的路徑分隔符號分隔（Linux/macOS 為 `:`，Windows 為 `;`）。CLI 會使用這個路徑來確保其執行於與 IDE 開啟的同一個專案資料夾中。如果 CLI 的目前工作目錄不是 `workspacePath` 的子目錄，則連線會被拒絕。您的 plugin **必須** 提供正確且絕對的 workspace 根目錄路徑。
  - `authToken`（string，必填）：用於保護連線的秘密權杖。CLI 會在所有請求中，於 `Authorization: Bearer <token>` 標頭中包含此權杖。
  - `ideInfo`（object，必填）：有關 IDE 的資訊。
    - `name`（string，必填）：IDE 的簡短小寫識別碼（例如：`vscode`、`jetbrains`）。
    - `displayName`（string，必填）：IDE 的易讀名稱（例如：`VS Code`、`JetBrains IDE`）。

- **驗證（Authentication）：** 為了保護連線，plugin **必須** 產生唯一且保密的權杖，並將其寫入 discovery 檔案中。CLI 之後會在所有對 MCP 伺服器的請求中，於 `Authorization` 標頭中包含此權杖（例如：`Authorization: Bearer a-very-secret-token`）。您的伺服器 **必須** 在每個請求中驗證此權杖，並拒絕任何未授權的請求。
- **使用環境變數進行衝突排解（建議）：** 為了提供最可靠的體驗，您的 plugin **建議** 同時建立 discovery 檔案，並在整合終端機中設定 `GEMINI_CLI_IDE_SERVER_PORT` 環境變數。檔案作為主要的發現機制，但環境變數對於衝突排解至關重要。如果使用者針對同一個 workspace 開啟了多個 IDE 視窗，CLI 會利用 `GEMINI_CLI_IDE_SERVER_PORT` 變數來識別並連線到正確視窗的伺服器。

## II. Context 介面

為了啟用 context 感知，plugin **可以** 向 CLI 提供使用者在 IDE 中活動的即時資訊。

### `ide/contextUpdate` 通知

當使用者的 context 發生變化時，plugin **可以** 向 CLI 發送 `ide/contextUpdate` [通知](https://modelcontextprotocol.io/specification/2025-06-18/basic/index#notifications)。

- **觸發事件：** 建議在下列情況下（建議去彈跳 50ms）發送此通知：
  - 檔案被開啟、關閉或聚焦時。
  - 使用者在作用中檔案中的游標位置或文字選取範圍變更時。
- **Payload（`IdeContext`）：** 通知參數 **必須** 是一個 `IdeContext` 物件：

  ```typescript
  interface IdeContext {
    workspaceState?: {
      openFiles?: File[];
      isTrusted?: boolean;
    };
  }

  interface File {
    // Absolute path to the file
    path: string;
    // Last focused Unix timestamp (for ordering)
    timestamp: number;
    // True if this is the currently focused file
    isActive?: boolean;
    cursor?: {
      // 1-based line number
      line: number;
      // 1-based character number
      character: number;
    };
    // The text currently selected by the user
    selectedText?: string;
  }
  ```

  **注意：**`openFiles` 清單僅應包含實際存在於磁碟上的檔案。虛擬檔案（例如：尚未儲存且沒有路徑的檔案、編輯器設定頁面）**必須**被排除。

### CLI 如何使用此 context

在收到 `IdeContext` 物件後，命令列介面 (Command Line Interface, CLI) 會在將資訊傳送給模型前，執行多個正規化與截斷步驟。

- **檔案排序：**CLI 會使用 `timestamp` 欄位來判斷最近使用的檔案，並依此對 `openFiles` 清單進行排序。因此，你的外掛**必須**提供檔案最後一次被聚焦時的正確 Unix 時間戳記。
- **作用中檔案：**CLI 僅將排序後的最新檔案視為「作用中」檔案。它會忽略其他所有檔案上的 `isActive` 旗標 (flags)，並清除這些檔案的 `cursor` 與 `selectedText` 欄位。你的外掛應僅針對目前聚焦的檔案設定 `isActive: true`，並提供游標/選取區域的詳細資訊。
- **截斷：**為了管理 token 限制，CLI 會將檔案清單截斷至 10 個檔案，並將 `selectedText` 截斷至 16KB。

雖然 CLI 會負責最終的截斷，但強烈建議你的外掛也應限制傳送的 context 量。

## III. Diffing 介面

為了啟用互動式程式碼修改，外掛**可以**（MAY）提供 diffing 介面。這讓 CLI 能夠請求 IDE 開啟 diff 檢視，顯示對檔案的建議變更。使用者可以直接在 IDE 內檢閱、編輯，並最終接受或拒絕這些變更。

### `openDiff` 工具

外掛**必須**在其 MCP 伺服器上註冊 `openDiff` 工具。

- **說明：**此工具會指示 IDE 為特定檔案開啟可修改的 diff 檢視。
- **請求（`OpenDiffRequest`）：**此工具是透過 `tools/call` 請求觸發的。請求中的 `params` 欄位內的 `arguments` **必須**是一個 `OpenDiffRequest` 物件。

  ```typescript
  interface OpenDiffRequest {
    // The absolute path to the file to be diffed.
    filePath: string;
    // The proposed new content for the file.
    newContent: string;
  }
  ```

- **回應 (`CallToolResult`)：** 工具**必須**立即回傳 `CallToolResult`，以確認收到請求，並回報 diff 檢視是否成功開啟。
  - 成功時：如果 diff 檢視成功開啟，回應**必須**包含空內容（即 `content: []`）。
  - 失敗時：如果因錯誤導致 diff 檢視無法開啟，回應**必須**帶有 `isError: true`，並在 `content` 陣列中包含一個描述錯誤的 `TextContent` 區塊。

  diff 的實際結果（接受或拒絕）會透過非同步通知傳遞。

### `closeDiff` 工具

外掛**必須**在其 MCP 伺服器上註冊 `closeDiff` 工具。

- **說明：** 此工具用於指示 IDE 關閉指定檔案的已開啟 diff 檢視。
- **請求 (`CloseDiffRequest`)：** 此工具透過 `tools/call` 請求呼叫。請求中的 `arguments` 欄位於 `params` 內**必須**是一個 `CloseDiffRequest` 物件。

  ```typescript
  interface CloseDiffRequest {
    // The absolute path to the file whose diff view should be closed.
    filePath: string;
  }
  ```

- **回應（`CallToolResult`）：** 工具**必須**回傳`CallToolResult`。
  - 成功時：如果 diff 檢視已成功關閉，回應**必須**在 content 陣列中包含一個 **TextContent** 區塊，內容為關閉前該檔案的最終內容。
  - 失敗時：如果因錯誤導致 diff 檢視無法關閉，回應**必須**有`isError: true`，並在`content`陣列中包含一個`TextContent`區塊，描述該錯誤。

### `ide/diffAccepted` 通知

當使用者在 diff 檢視中接受變更（例如，點擊「套用」或「儲存」按鈕）時，外掛**必須**向 CLI 發送`ide/diffAccepted`通知。

- **Payload：** 通知參數**必須**包含檔案路徑以及該檔案的最終內容。如果使用者在 diff 檢視中有手動編輯，內容可能會與原始`newContent`不同。

  ```typescript
  {
    // The absolute path to the file that was diffed.
    filePath: string;
    // The full content of the file after acceptance.
    content: string;
  }
  ```

### `ide/diffRejected` 通知

當使用者拒絕變更（例如：在未接受的情況下關閉 diff 檢視），外掛程式**必須**向命令列介面 (Command Line Interface, CLI) 發送 `ide/diffRejected` 通知。

- **Payload：**通知參數**必須**包含被拒絕 diff 的檔案路徑。

  ```typescript
  {
    // The absolute path to the file that was diffed.
    filePath: string;
  }
  ```

## IV. 生命週期介面（Lifecycle Interface）

外掛 **必須** 根據 IDE 的生命週期正確管理其資源以及 discovery 檔案。

- **啟用時（IDE 啟動／外掛啟用）:**
  1. 啟動 MCP 伺服器。
  2. 建立 discovery 檔案。
- **停用時（IDE 關閉／外掛停用）:**
  1. 停止 MCP 伺服器。
  2. 刪除 discovery 檔案。
