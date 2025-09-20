# Gemini CLI Companion Extension：介面規格說明

> 最後更新日期：2025 年 9 月 15 日

本文檔定義了建立 Companion Extension 以啟用 Gemini CLI 的 IDE 模式所需遵循的合約。對於 VS Code，這些功能（原生差異比對、上下文感知）由官方擴充套件提供（[marketplace](https://marketplace.visualstudio.com/items?itemName=Google.gemini-cli-vscode-ide-companion)）。本規格適用於希望將類似功能帶到其他編輯器（如 JetBrains IDE、Sublime Text 等）的貢獻者。

## I. 通訊介面

Gemini CLI 與 IDE 擴充套件之間透過本地通訊通道進行溝通。

### 1. 傳輸層：MCP over HTTP

擴充套件**必須**執行一個本地 HTTP 伺服器，並實作**Model Context Protocol (MCP)**。

- **協定：** 伺服器必須是一個有效的 MCP 伺服器。我們建議優先使用你所選語言的現有 MCP SDK（如有提供）。
- **端點：** 伺服器應該僅暴露一個端點（例如：`/mcp`）來處理所有 MCP 通訊。
- **連接埠：** 伺服器**必須**監聽一個動態分配的連接埠（即監聽於 `0` 埠）。

### 2. 探索機制：連接埠檔案

為了讓 Gemini CLI 進行連線，需要能夠發現其所運行的 IDE 實例，以及你的伺服器所使用的連接埠。擴充套件**必須**透過建立一個「探索檔案」來實現這一點。

- **CLI 如何尋找檔案：** CLI 會遍歷程序樹以判斷其所運行的 IDE 的 Process ID (PID)。接著，它會尋找檔名中包含該 PID 的探索檔案。
- **檔案位置：** 檔案必須建立於特定目錄：`os.tmpdir()/gemini/ide/`。若該目錄不存在，擴充套件必須自行建立。
- **檔名命名規則：** 檔名非常重要，**必須**遵循下列格式：
  `gemini-ide-server-${PID}-${PORT}.json`
  - `${PID}`：父層 IDE 程序的 Process ID。擴充套件必須取得該 PID 並將其包含於檔名中。
  - `${PORT}`：你的 MCP 伺服器所監聽的連接埠。
- **檔案內容與 workspace 驗證：** 檔案**必須**包含一個具有下列結構的 JSON 物件：
  ```json
  {
    "port": 12345,
    "workspacePath": "/path/to/project1:/path/to/project2"
  }
  ```
  - `port`（數字）：MCP 伺服器的埠號。
  - `workspacePath`（字串）：所有已開啟 workspace 根目錄路徑的列表，使用作業系統特定的路徑分隔符號（Linux/macOS 為 `:`，Windows 為 `;`）分隔。命令列介面 (CLI) 會利用這個路徑來確保其執行位置與 IDE 中開啟的專案資料夾一致。如果 CLI 的目前工作目錄不是 `workspacePath` 的子目錄，則連線會被拒絕。您的擴充套件**必須**提供正確且絕對的 workspace 根目錄路徑。
- **使用環境變數進行衝突排解（建議做法）：** 為了獲得最可靠的體驗，您的擴充套件**應同時**建立 discovery 檔案，並在整合式終端機中設定 `GEMINI_CLI_IDE_SERVER_PORT` 和 `GEMINI_CLI_IDE_WORKSPACE_PATH` 環境變數。檔案作為主要的 discovery 機制，但環境變數對於衝突排解至關重要。如果使用者針對同一個 workspace 開啟了多個 IDE 視窗，CLI 會利用 `GEMINI_CLI_IDE_SERVER_PORT` 變數來識別並連接到正確視窗的伺服器。
  - 在原型開發階段，您可以選擇_僅_設定環境變數。然而，這並不是生產環境下的穩健解決方案，因為環境變數在所有終端機工作階段（例如還原的終端機）中可能無法可靠設定，這可能導致連線失敗。
- **驗證機制：** 為了確保連線安全，擴充套件**應**產生一組唯一且保密的 token，並將其包含在 discovery 檔案中。CLI 之後會在所有對 MCP 伺服器的請求中附帶此 token。
  - **Token 產生：** 擴充套件應產生一組隨機字串作為 bearer token 使用。
  - **Discovery 檔案內容：** 必須在 discovery 檔案的 JSON 物件中新增 `authToken` 欄位：
    ```json
    {
      "port": 12345,
      "workspacePath": "/path/to/project",
      "authToken": "a-very-secret-token"
    }
    ```
  - **請求授權：** 命令列介面 (CLI) 會從檔案中讀取`authToken`，並在所有對 MCP 伺服器的 HTTP 請求中，將其包含於`Authorization`標頭中（例如：`Authorization: Bearer a-very-secret-token`）。你的伺服器**必須**在每一次請求時驗證此 token，並拒絕任何未授權的請求。

## II. Context 介面

為了實現情境感知，擴充套件**可以**即時提供命令列介面 (CLI) 使用者在 IDE 中的操作資訊。

### `ide/contextUpdate` 通知

擴充套件**可以**在使用者情境發生變化時，向命令列介面 (CLI) 發送`ide/contextUpdate` [通知](https://modelcontextprotocol.io/specification/2025-06-18/basic/index#notifications)。

- **觸發事件：** 當下列情況發生時（建議去彈跳時間為 50 毫秒），應發送此通知：
  - 檔案被開啟、關閉或聚焦時。
  - 使用者在作用中檔案中的游標位置或文字選取範圍發生變化時。
- **Payload (`IdeContext`)：** 通知參數**必須**是一個`IdeContext`物件：

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

  **注意：**`openFiles` 清單僅應包含實際存在於磁碟上的檔案。虛擬檔案（例如：尚未儲存、沒有路徑的檔案，或編輯器設定頁面）**必須**排除在外。

### 命令列介面 (CLI) 如何使用此上下文

在收到 `IdeContext` 物件後，命令列介面 (CLI) 會在將資訊傳送給模型之前，執行多項正規化與截斷處理。

- **檔案排序：**命令列介面 (CLI) 會使用 `timestamp` 欄位來判斷最近使用的檔案，並根據此值對 `openFiles` 清單進行排序。因此，你的擴充套件**必須**提供檔案最後一次被聚焦時的正確 Unix 時間戳記。
- **作用中檔案：**命令列介面 (CLI) 僅將排序後最靠前的檔案視為「作用中」檔案。它會忽略其他檔案的 `isActive` 旗標 (flags)，並清除這些檔案的 `cursor` 與 `selectedText` 欄位。你的擴充套件應僅針對目前聚焦的檔案設定 `isActive: true`，並提供游標／選取區細節。
- **截斷處理：**為了管理 token 限制，命令列介面 (CLI) 會將檔案清單截斷為 10 個檔案，並將 `selectedText` 截斷為 16KB。

雖然命令列介面 (CLI) 會負責最終的截斷處理，但強烈建議你的擴充套件也應限制所傳送的上下文內容量。

## III. 差異比對 (Diffing) 介面

為了支援互動式程式碼修改，擴充套件**可以**（MAY）提供差異比對 (diffing) 介面。這讓命令列介面 (CLI) 能請求 IDE 開啟差異檢視，顯示對檔案的建議變更。使用者可直接在 IDE 中檢閱、編輯，並最終接受或拒絕這些變更。

### `openDiff` 工具

擴充套件**必須**在其 MCP 伺服器上註冊一個 `openDiff` 工具。

- **說明：**此工具會指示 IDE 為特定檔案開啟可修改的差異檢視。
- **請求（`OpenDiffRequest`）：**該工具透過 `tools/call` 請求觸發。請求中的 `arguments` 欄位**必須**是一個 `OpenDiffRequest` 物件，且位於 `params` 之中。

  ```typescript
  interface OpenDiffRequest {
    // The absolute path to the file to be diffed.
    filePath: string;
    // The proposed new content for the file.
    newContent: string;
  }
  ```

- **回應（`CallToolResult`）：** 此工具**必須**立即回傳`CallToolResult`，以確認已收到請求，並回報 diff 檢視畫面是否成功開啟。
  - 成功時：如果 diff 檢視畫面成功開啟，回應**必須**包含空內容（即`content: []`）。
  - 失敗時：如果因錯誤導致 diff 檢視畫面無法開啟，回應**必須**為`isError: true`，並在`content`陣列中包含描述錯誤的`TextContent`區塊。

  diff 的實際結果（接受或拒絕）將透過非同步通知傳遞。

### `closeDiff` 工具

擴充套件**必須**在其 MCP 伺服器上註冊`closeDiff`工具。

- **說明：** 此工具用於指示 IDE 關閉特定檔案已開啟的 diff 檢視畫面。
- **請求（`CloseDiffRequest`）：** 此工具透過`tools/call`請求呼叫。請求中的`params`內的`arguments`欄位**必須**是一個`CloseDiffRequest`物件。

  ```typescript
  interface CloseDiffRequest {
    // The absolute path to the file whose diff view should be closed.
    filePath: string;
  }
  ```

- **回應 (`CallToolResult`)：** 工具**必須**回傳 `CallToolResult`。
  - 成功時：如果 diff 檢視已成功關閉，回應**必須**在 content 陣列中包含一個 **TextContent** 區塊，內容為關閉前檔案的最終內容。
  - 失敗時：如果有錯誤導致 diff 檢視無法關閉，回應**必須**帶有 `isError: true`，並在 `content` 陣列中包含一個 `TextContent` 區塊，描述該錯誤。

### `ide/diffAccepted` 通知

當使用者在 diff 檢視中接受變更（例如點擊「套用」或「儲存」按鈕）時，擴充套件**必須**向命令列介面 (CLI) 發送 `ide/diffAccepted` 通知。

- **Payload：** 通知參數**必須**包含檔案路徑與檔案的最終內容。如果使用者在 diff 檢視中有手動編輯，內容可能會與原始 `newContent` 不同。

  ```typescript
  {
    // The absolute path to the file that was diffed.
    filePath: string;
    // The full content of the file after acceptance.
    content: string;
  }
  ```

### `ide/diffRejected` 通知

當使用者拒絕變更（例如：關閉 diff 檢視而未接受變更時），擴充套件**必須**向命令列介面 (CLI) 發送 `ide/diffRejected` 通知。

- **Payload：**通知參數**必須**包含被拒絕 diff 的檔案路徑。

  ```typescript
  {
    // The absolute path to the file that was diffed.
    filePath: string;
  }
  ```

## IV. 支援更多 IDE

若要為新的 IDE 增加支援，需在 Gemini CLI 程式碼庫中更新兩個主要元件：偵測邏輯與安裝器邏輯。

### 1. IDE 偵測（`@packages/core/src/ide/detect-ide.ts`）

// TODO(skeshive): 確認我們是否應該透過 port 檔案來發現 IDE

命令列介面 (CLI) 必須能夠辨識其是否在特定 IDE 的整合式終端機中執行。這主要是透過檢查獨特的環境變數來完成。作為備用方案，若無獨特環境變數，也可以檢查行程資訊（例如指令名稱），以協助區分不同的 IDE。

- **新增至 `DetectedIde` 列舉：** 首先，將你的新 IDE 加入 `DetectedIde` 列舉（enum）。
- **更新 `detectIdeFromEnv`：** 在此函式中加入針對你 IDE 專屬環境變數（例如 `if (process.env['MY_IDE_VAR']) { return DetectedIde.MyIde; }`）的檢查。
- **更新 `detectIde`（選用）：** 若你的 IDE 沒有專屬的環境變數，可以在 `detectIde` 函式中加入邏輯，檢查 `ideProcessInfo`（例如 `ideProcessInfo.command`）作為次要偵測機制。

### 2. 擴充功能安裝（`@packages/core/src/ide/ide-installer.ts`）

命令列介面 (CLI) 提供一個指令（`/ide install`），協助使用者自動安裝 companion 擴充功能。雖然這不是必要步驟，但建議為你的 IDE 實作 `IdeInstaller`，以提供更順暢的安裝體驗。

- **建立安裝器類別：** 建立一個新的類別，實作 `IdeInstaller` 介面。
- **實作 `install()`：** `install` 方法應：
  1.  尋找 IDE 的命令列可執行檔。`VsCodeInstaller` 提供了在不同作業系統上搜尋常見安裝路徑的範例。
  2.  透過 marketplace ID（例如 `"path/to/my-ide-cli" --install-extension my-publisher.my-extension-id`）執行安裝擴充功能的指令。
  3.  回傳一個結果物件，指示成功或失敗。
- **更新 `getIdeInstaller`：** 在此 factory 函式的 `switch` 敘述中，新增一個 case，當你的 `DetectedIde` 列舉被匹配時，回傳新安裝器類別的實例。

## V. 生命週期介面

擴充功能**必須**根據 IDE 的生命週期正確管理其資源與 discovery 檔案。

- **啟用時（IDE 啟動／擴充功能啟用）：**
  1.  啟動 MCP 伺服器。
  2.  建立 discovery 檔案。
- **停用時（IDE 關閉／擴充功能停用）：**
  1.  停止 MCP 伺服器。
  2.  刪除 discovery 檔案。
