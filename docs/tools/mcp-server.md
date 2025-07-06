#  MCP 伺服器

本文件提供設定及使用模型內容協定（Model Context Protocol，MCP）伺服器與 Gemini CLI 的指南。

## 什麼是 MCP 伺服器？

MCP 伺服器是一個應用程式，透過模型內容協定將工具和資源公開給 Gemini CLI，使其能夠與外部系統和資料來源互動。MCP 伺服器作為 Gemini 模型與您的本機環境或其他服務（如 API）之間的橋樑。

MCP 伺服器使 Gemini CLI 能夠：

- **發現工具**： 透過標準化的結構定義列出可用的工具、其描述和參數。
- **執行工具**： 使用定義的參數呼叫特定工具並接收結構化回應。
- **存取資源**： 從特定資源讀取資料（雖然 Gemini CLI 主要專注於工具執行）。

透過 MCP 伺服器，您可以擴充 Gemini CLI 的功能，以執行其內建功能以外的操作，例如與資料庫、API、自訂指令碼或特殊工作流程互動。

## 核心整合架構

Gemini CLI 透過內建於核心套件（`packages/core/src/tools/`）的精密發現和執行系統與 MCP 伺服器整合：

### 發現層 (`mcp-client.ts`)

發現過程由 `discoverMcpTools()` 協調，其功能如下：

1.  **迭代設定的伺服器**，從您的 `settings.json` `mcpServers` 設定中讀取。
2.  **建立連線**，使用適當的傳輸機制（Stdio、SSE 或可串流 HTTP）。
3.  **擷取工具定義**，使用 MCP 協定從每個伺服器取得。
4.  **清理和驗證** 工具結構，以確保與 Gemini API 相容。
5.  **註冊工具** 至全域工具註冊表，並解決衝突。

### 執行層 (`mcp-tool.ts`)

每個發現的 MCP 工具都被包裝在一個 `DiscoveredMCPTool` 實例中，該實例：

- **處理確認邏輯**，根據伺服器信任設定和使用者偏好。
- **管理工具執行**，透過使用適當的參數呼叫 MCP 伺服器。
- **處理回應**，供大型語言模型（LLM）上下文和使用者顯示使用。
- **維護連線狀態** 並處理逾時。

### 傳輸機制

Gemini CLI 支援三種 MCP 傳輸類型：

- **Stdio 傳輸**： 產生一個子程序並透過 stdin/stdout 進行通訊。
- **SSE 傳輸**： 連線到伺服器發送事件（Server-Sent Events）端點。
- **可串流 HTTP 傳輸**： 使用 HTTP 串流進行通訊。

## 如何設定您的 MCP 伺服器

Gemini CLI 使用您 `settings.json` 檔案中的 `mcpServers` 設定來定位並連線到 MCP 伺服器。此設定支援多個使用不同傳輸機制的伺服器。

### 在 settings.json 中設定 MCP 伺服器

您可以在全域層級的 `~/.gemini/settings.json` 檔案中設定 MCP 伺服器，或在您的專案根目錄中，建立或開啟 `.gemini/settings.json` 檔案。在檔案中，新增 `mcpServers` 設定區塊。

### 設定結構

將 `mcpServers` 物件新增至您的 `settings.json` 檔案：

```json
{ ...檔案包含其他設定物件
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "cwd": "./server-directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

### 設定屬性

每個伺服器設定支援以下屬性：

#### 必要（以下之一）

- **`command`** (字串): Stdio 傳輸的可執行檔路徑。
- **`url`** (字串): SSE 端點 URL (例如 `"http://localhost:8080/sse"`)。
- **`httpUrl`** (字串): HTTP 串流端點 URL。

#### 選用

- **`args`** (字串[]): Stdio 傳輸的命令列參數。
- **`headers`** (物件): 使用 `httpUrl` 時的自訂 HTTP 標頭。
- **`env`** (物件): 伺服器處理程序的環境變數。值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參考環境變數。
- **`cwd`** (字串): Stdio 傳輸的工作目錄。
- **`timeout`** (數字): 請求逾時（毫秒）（預設值：600,000 毫秒 = 10 分鐘）。
- **`trust`** (布林值): 若為 `true`，則繞過此伺服器的所有工具呼叫確認（預設值：`false`）。

### 設定範例

#### Python MCP 伺服器 (Stdio)

```json
{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server", "--port", "8080"],
      "cwd": "./mcp-servers/python",
      "env": {
        "DATABASE_URL": "$DB_CONNECTION_STRING",
        "API_KEY": "${EXTERNAL_API_KEY}"
      },
      "timeout": 15000
    }
  }
}
```

#### Node.js MCP 伺服器 (Stdio)

```json
{
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["dist/server.js", "--verbose"],
      "cwd": "./mcp-servers/node",
      "trust": true
    }
  }
}
```

#### 基於 Docker 的 MCP 伺服器

```json
{
  "mcpServers": {
    "dockerizedServer": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY",
        "-v",
        "${PWD}:/workspace",
        "my-mcp-server:latest"
      ],
      "env": {
        "API_KEY": "$EXTERNAL_SERVICE_TOKEN"
      }
    }
  }
}
```

#### 基於 HTTP 的 MCP 伺服器

```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "http://localhost:3000/mcp",
      "timeout": 5000
    }
  }
}
```

#### 具有自訂標頭的基於 HTTP 的 MCP 伺服器

```json
{
  "mcpServers": {
    "httpServerWithAuth": {
      "httpUrl": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer your-api-token",
        "X-Custom-Header": "custom-value",
        "Content-Type": "application/json"
      },
      "timeout": 5000
    }
  }
}
```

## 發現過程深入探討

當 Gemini CLI 啟動時，它會透過以下詳細過程執行 MCP 伺服器發現：

### 1. 伺服器迭代與連線

對於 `mcpServers` 中的每個設定伺服器：

1.  **狀態追蹤開始**： 伺服器狀態設定為 `CONNECTING`。
2.  **傳輸選擇**： 根據設定屬性：
    - `httpUrl` → `StreamableHTTPClientTransport`
    - `url` → `SSEClientTransport`
    - `command` → `StdioClientTransport`
3.  **建立連線**： MCP 客戶端嘗試使用設定的逾時時間進行連線。
4.  **錯誤處理**： 連線失敗會被記錄下來，且伺服器狀態設定為 `DISCONNECTED`。

### 2. 工具發現

成功連線後：

1.  **工具列表**： 客戶端呼叫 MCP 伺服器的工具列表端點。
2.  **結構驗證**： 每個工具的函式宣告都會被驗證。
3.  **名稱清理**： 工具名稱會被清理以符合 Gemini API 的要求：
    - 無效字元（非字母數字、底線、點、連字號）會被底線取代。
    - 超過 63 個字元的名稱會被截斷並在中間替換（`___`）。

### 3. 衝突解決

當多個伺服器公開同名工具時：

1.  **先註冊者優先**： 第一個註冊工具名稱的伺服器會獲得未加前綴的名稱。
2.  **自動加前綴**： 後續的伺服器會獲得加前綴的名稱：`serverName__toolName`。
3.  **註冊表追蹤**： 工具註冊表會維護伺服器名稱與其工具之間的對應關係。

### 4. 結構處理

工具參數結構會經過清理以符合 Gemini API 的相容性：

- **`$schema` 屬性**會被移除。
- **`additionalProperties`** 會被移除。
- **具有 `default` 的 `anyOf`** 的預設值會被移除（Vertex AI 相容性）。
- **遞迴處理** 會應用於巢狀結構。

### 5. 連線管理

發現後：

- **持續連線**： 成功註冊工具的伺服器會維持其連線。
- **清理**： 未提供任何可用工具的伺服器連線會被關閉。
- **狀態更新**： 最終的伺服器狀態會設定為 `CONNECTED` 或 `DISCONNECTED`。

## 工具執行流程

當 Gemini 模型決定使用 MCP 工具時，會發生以下執行流程：

### 1. 工具叫用

模型會產生一個 `FunctionCall`，其中包含：

- **工具名稱**： 已註冊的名稱（可能已加前綴）。
- **參數**： 符合工具參數結構的 JSON 物件。

### 2. 確認過程

每個 `DiscoveredMCPTool` 都會實作精密的確認邏輯：

#### 基於信任的繞過

```typescript
if (this.trust) {
  return false; // 不需要確認
}
```

#### 動態允許清單

系統會維護內部允許清單：

- **伺服器層級**： `serverName` → 此伺服器的所有工具都受信任。
- **工具層級**： `serverName.toolName` → 此特定工具受信任。

#### 使用者選擇處理

需要確認時，使用者可以選擇：

- **僅執行一次**： 僅此次執行。
- **永遠允許此工具**： 新增至工具層級允許清單。
- **永遠允許此伺服器**： 新增至伺服器層級允許清單。
- **取消**： 中止執行。

### 3. 執行

確認後（或信任繞過）：

1.  **參數準備**： 參數會根據工具的結構進行驗證。
2.  **MCP 呼叫**： 底層的 `CallableTool` 會使用以下方式叫用伺服器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // 原始伺服器工具名稱
       args: params,
     },
   ];
   ```

3.  **回應處理**： 結果會被格式化，供 LLM 上下文和使用者顯示。

### 4. 回應處理

執行結果包含：

- **`llmContent`:** 供語言模型上下文使用的原始回應部分。
- **`returnDisplay`:** 供使用者顯示的格式化輸出（通常是 markdown 程式碼區塊中的 JSON）。

## 如何與您的 MCP 伺服器互動

### 使用 `/mcp` 指令

`/mcp` 指令提供有關您 MCP 伺服器設定的完整資訊：

```bash
/mcp
```

這會顯示：

- **伺服器列表**： 所有已設定的 MCP 伺服器。
- **連線狀態**： `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`。
- **伺服器詳細資料**： 設定摘要（不包括敏感資料）。
- **可用工具**： 每個伺服器的工具列表及其描述。
- **發現狀態**： 整體發現過程的狀態。

### `/mcp` 輸出範例

```
MCP Servers Status:

📡 pythonTools (CONNECTED)
  Command: python -m my_mcp_server --port 8080
  Working Directory: ./mcp-servers/python
  Timeout: 15000ms
  Tools: calculate_sum, file_analyzer, data_processor

🔌 nodeServer (DISCONNECTED)
  Command: node dist/server.js --verbose
  Error: Connection refused

🐳 dockerizedServer (CONNECTED)
  Command: docker run -i --rm -e API_KEY my-mcp-server:latest
  Tools: docker__deploy, docker__status

Discovery State: COMPLETED
```

### 工具使用

一旦發現，MCP 工具就像內建工具一樣可供 Gemini 模型使用。模型會自動：

1.  **根據您的要求選擇適當的工具**。
2.  **呈現確認對話方塊**（除非伺服器受信任）。
3.  **使用適當的參數執行工具**。
4.  **以使用者友善的格式顯示結果**。

## 狀態監控與疑難排解

### 連線狀態

MCP 整合會追蹤多種狀態：

#### 伺服器狀態 (`MCPServerStatus`)

- **`DISCONNECTED`:** 伺服器未連線或發生錯誤。
- **`CONNECTING`:** 正在嘗試連線。
- **`CONNECTED`:** 伺服器已連線並準備就緒。

#### 發現狀態 (`MCPDiscoveryState`)

- **`NOT_STARTED`:** 發現尚未開始。
- **`IN_PROGRESS`:** 正在發現伺服器。
- **`COMPLETED`:** 發現已完成（無論有無錯誤）。

### 常見問題與解決方案

#### 伺服器無法連線

**症狀**： 伺服器顯示 `DISCONNECTED` 狀態。

**疑難排解**：

1.  **檢查設定**： 確認 `command`、`args` 和 `cwd` 是否正確。
2.  **手動測試**： 直接執行伺服器指令以確保其可運作。
3.  **檢查相依性**： 確保所有必要的套件都已安裝。
4.  **檢閱日誌**： 在 CLI 輸出中尋找錯誤訊息。
5.  **驗證權限**： 確保 CLI 可以執行伺服器指令。

#### 未發現任何工具

**症狀**： 伺服器已連線但沒有可用的工具。

**疑難排解**：

1.  **驗證工具註冊**： 確保您的伺服器確實註冊了工具。
2.  **檢查 MCP 協定**： 確認您的伺服器正確實作了 MCP 工具列表功能。
3.  **檢閱伺服器日誌**： 檢查 stderr 輸出以尋找伺服器端錯誤。
4.  **測試工具列表**： 手動測試您伺服器的工具發現端點。

#### 工具無法執行

**症狀**： 工具已發現但在執行期間失敗。

**疑難排解**：

1.  **參數驗證**： 確保您的工具接受預期的參數。
2.  **結構相容性**： 確認您的輸入結構是有效的 JSON 結構。
3.  **錯誤處理**： 檢查您的工具是否擲回未處理的例外狀況。
4.  **逾時問題**： 考慮增加 `timeout` 設定。

#### 沙盒相容性

**症狀**： 啟用沙盒時 MCP 伺服器失敗。

**解決方案**：

1.  **基於 Docker 的伺服器**： 使用包含所有相依性的 Docker 容器。
2.  **路徑可存取性**： 確保伺服器可執行檔在沙盒中可用。
3.  **網路存取**： 設定沙盒以允許必要的網路連線。
4.  **環境變數**： 確認必要的環境變數已傳遞。

### 偵錯技巧

1.  **啟用偵錯模式**： 使用 `--debug_mode` 執行 CLI 以取得詳細輸出。
2.  **檢查 stderr**： MCP 伺服器的 stderr 會被擷取並記錄下來（INFO 訊息會被過濾）。
3.  **隔離測試**： 在整合前獨立測試您的 MCP 伺服器。
4.  **漸進式設定**： 在新增複雜功能前，先從簡單的工具開始。
5.  **經常使用 `/mcp`**： 在開發期間監控伺服器狀態。

## 重要注意事項

### 安全考量

- **信任設定**： `trust` 選項會繞過所有確認對話方塊。請謹慎使用，且僅用於您完全控制的伺服器。
- **存取權杖**： 在設定包含 API 金鑰或權杖的環境變數時，請注意安全性。
- **沙盒相容性**： 使用沙盒時，請確保 MCP 伺服器在沙盒環境中可用。
- **私人資料**： 使用範圍廣泛的個人存取權杖可能會導致儲存庫之間的資訊外洩。

### 效能與資源管理

- **連線持續性**： CLI 會維持與成功註冊工具的伺服器的持續連線。
- **自動清理**： 未提供任何工具的伺服器連線會自動關閉。
- **逾時管理**： 根據您伺服器的回應特性設定適當的逾時。
- **資源監控**： MCP 伺服器作為獨立的處理程序執行並消耗系統資源。

### 結構相容性

- **屬性移除**： 系統會自動移除某些結構屬性（`$schema`、`additionalProperties`）以符合 Gemini API 的相容性。
- **名稱清理**： 工具名稱會自動清理以符合 API 要求。
- **衝突解決**： 伺服器之間的工具名稱衝突會透過自動加前綴來解決。

這種全面的整合使 MCP 伺服器成為擴充 Gemini CLI 功能的強大方式，同時維持安全性、可靠性和易用性。