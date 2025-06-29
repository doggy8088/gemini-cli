# 使用 Gemini CLI 的 MCP 伺服器

本文件提供設定及使用模型內容通訊協定 (MCP) 伺服器搭配 Gemini CLI 的指南。

## 什麼是 MCP 伺服器？

MCP 伺服器是一種應用程式，可透過模型內容通訊協定將工具和資源公開給 Gemini CLI，使其能與外部系統和資料來源互動。MCP 伺服器可做為 Gemini 模型與您的本機環境或其他服務 (例如 API) 之間的橋樑。

MCP 伺服器可讓 Gemini CLI：

- **探索工具：** 透過標準化結構定義列出可用工具、其說明和參數。
- **執行工具：** 使用定義的引數呼叫特定工具，並接收結構化回應。
- **存取資源：** 從特定資源讀取資料 (不過 Gemini CLI 主要著重於工具執行)。

透過 MCP 伺服器，您可以擴充 Gemini CLI 的功能，以執行其內建功能以外的動作，例如與資��庫、API、自訂指令碼或特殊工作流程互動。

## 核心整合架構

Gemini CLI 透過內建於核心套件 (`packages/core/src/tools/`) 的精密探索和執行系統與 MCP 伺服器整合：

### 探索層 (`mcp-client.ts`)

探索程序由 `discoverMcpTools()` 協調，其功能如下：

1. **反覆查看** `settings.json` `mcpServers` 設定中的已設定伺服器
2. 使用適當的傳輸機制 (Stdio、SSE 或可串流 HTTP) **建立連線**
3. 使用 MCP 通訊協定從每部伺服器 **擷取工具定義**
4. **清理並驗證** 工具結構，以確保與 Gemini API 相容
5. 在全域工具登錄檔中 **註冊工具** 並解決衝突

### 執行層 (`mcp-tool.ts`)

每個探索到的 MCP 工具都會包裝在 `DiscoveredMCPTool` 執行個體中，該執行個體會：

- 根據伺服器信任設定和使用者偏好 **處理確認邏輯**
- 透過使用適當的參數呼叫 MCP 伺服器來 **管理工具執行**
- **處理** LLM 內容和使用者顯示的 **回應**
- **維護連線狀態** 並處理逾時

### 傳輸機制

Gemini CLI 支援三種 MCP 傳輸類型：

- **Stdio 傳輸：** 產生子程序並透過 stdin/stdout 進行通訊
- **SSE 傳輸：** 連線至伺服器傳送事件端點
- **可串流 HTTP 傳輸：** 使用 HTTP 串流進行通訊

## 如何設定您的 MCP 伺服器

Gemini CLI 使用您 `settings.json` 檔案中的 `mcpServers` 設定來尋找並連線至 MCP 伺服器。此設定支援具有不同傳輸機制的

### 在 settings.json 中設定 MCP 伺服器

您可以在 `~/.gemini/settings.json` 檔案中或在專案的根目錄中於全域層級設定 MCP 伺服器，建立或開啟 `.gemini/settings.json` 檔案。在檔案中，新增 `mcpServers` 設定區塊。

### 設定結構

將 `mcpServers` 物件新增至您的 `settings.json` 檔案：

```json
{ ...file contains other config objects
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

每個伺服器設定都支援下列屬性：

#### 必要 (下列其中一項)

- **`command`** (字串)：Stdio 傳輸的可執行檔路徑
- **`url`** (字串)：SSE 端點 URL (例如 `"http://localhost:8080/sse"`)
- **`httpUrl`** (字串)：HTTP 串流端點 URL

#### 選用

- **`args`** (字串陣列)：Stdio 傳輸的命令列引數
- **`env`** (物件)：伺服器處理程序的環境變數。值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參照環境變數
- **`cwd`** (字串)：Stdio 傳輸的工作目錄
- **`timeout`** (數字)：要求逾時 (以毫秒為單位) (預設值：600,000 毫秒 = 10 分鐘)
- **`trust`** (布林值)：若為 `true`，則會略過此伺服器的所有工具呼叫確認 (預設值：`false`)

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

#### 以 Docker 為基礎的 MCP 伺服器

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

#### 以 HTTP 為基礎的 MCP 伺服器

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

## 探索程序深入探討

Gemini CLI 啟動時，會透過下列詳細程序執行 MCP 伺服器探索：

### 1. 伺服器反覆運算和連線

對於 `mcpServers` 中的每個已設定伺服器：

1. **狀態追蹤開始：** 伺服器狀態設定為 `CONNECTING`
2. **傳輸選取：** 根據設定屬性：
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **建立連線：** MCP 用戶端會嘗試在設定的逾時時間內連線
4. **錯誤處理：** 記錄連線失敗，並將伺服器狀態設定為 `DISCONNECTED`

### 2. 工具探索

成功連線後：

1. **工具清單：** 用戶端會呼叫 MCP 伺服器的工具清單端點
2. **結構驗證：** 驗證每個工具的函式宣告
3. **名稱清理：** 清理工具名稱以符合 Gemini API 需求：
   - 無效字元 (非英數字元、底線、點、連字號) 會以底線取代
   - 長度超過 63 個字元的名稱會以中間取代 (`___`) 的方式截斷

### 3. 衝突解決

當多部伺服器公開具有相同名稱的工具時：

1. **先註冊者優先：** 第一個註冊工具名稱的伺服器會取得未加前置字元的名稱
2. **自動加上前置字元：** 後續的伺服器會取得加上前置字元的名稱：`serverName__toolName`
3. **登錄檔追蹤：** 工具登錄檔會維護伺服器名稱與其工具之間的對應關係

### 4. 結構處理

工具參數結構會經過清理以確保與 Gemini API 相容：

- **`$schema` 屬性** 已移除
- **`additionalProperties`** 已移除
- **具有 `default` 的 `anyOf`** 的預設值已移除 (Vertex AI 相容性)
- **遞迴處理** 適用於巢狀結構

### 5. 連線管理

探索後：

- **持續性連線：** 成功註冊工具的伺服器會維護其連線
- **清理：** 未提供可用工具的伺服器連線已關閉
- **狀態更新：** 最終伺服器狀態設定為 `CONNECTED` 或 `DISCONNECTED`

## 工具執行流程

當 Gemini 模型決定使用 MCP 工具時，會發生下列執行流程：

### 1. 工具叫用

模型會產生具有下列項目的 `FunctionCall`：

- **工具名稱：** 已註冊的名稱 (可能加上前置字元)
- **引數：** 符合工具參數結構的 JSON 物件

### 2. 確認程序

每個 `DiscoveredMCPTool` 都會實作精密的確認邏輯：

#### 以信任為基礎的略過

```typescript
if (this.trust) {
  return false; // No confirmation needed
}
```

#### 動態允許清單

系統會維護下列項目的內部允許清單：

- **伺服器層級：** `serverName` → 此伺服器的所有工具都受信任
- **工具層級：** `serverName.toolName` → 此特定工具受信任

#### 使用者選擇處理

需要確認時，使用者可以選擇：

- **僅執行一次：** 僅這次執行
- **一律允許此工具：** 新增至工具層級允許清單
- **一律允許此伺服器：** 新增至伺服器層級允許清單
- **取消：** 中止執行

### 3. 執行

確認後 (或信任略過)：

1. **參數準備：** 根據工具的結構驗證引數
2. **MCP 呼叫：** 底層的 `CallableTool` 會使用下列項目叫用伺服器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // Original server tool name
       args: params,
     },
   ];
   ```

3. **回應處理：** 格式化結果以供 LLM 內容和使用者顯示

### 4. 回應處理

執行結果包含：

- **`llmContent`：** 語言模型內容的原始回應部分
- **`returnDisplay`：** 使用者顯示的格式化輸出 (通常是 Markdown 程式碼區塊中的 JSON)

## 如何與您的 MCP 伺服器互動

### 使用 `/mcp` 指令

`/mcp` 指令提供有關您 MCP 伺服器設定的完整資訊：

```bash
/mcp
```

��會顯示：

- **伺服器清單：** 所有已設定的 MCP 伺服器
- **連線狀態：** `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`
- **伺服器詳細資料：** 設定摘要 (不含敏感資料)
- **可用工具：** 每部伺服器的工具清單及其說明
- **探索狀態：** 整體探索程序狀態

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

### 工具使用方式

探索後，MCP 工具即可像內建工具一樣供 Gemini 模型使用。模型會自動：

1. 根據您的要求 **選取適當的工具**
2. **顯示確認對話方塊** (除非伺服器受信任)
3. 使用適當的參數 **執行工具**
4. 以方便使用者使用的方式 **顯示結果**

## 狀態監控與疑難排解

### 連線狀態

MCP 整合會追蹤數種狀態：

#### 伺服器狀態 (`MCPServerStatus`)

- **`DISCONNECTED`：** 伺服器未連線或發���錯誤
- **`CONNECTING`：** 正在嘗試連線
- **`CONNECTED`：** 伺服器已連線並準備就緒

#### 探索狀態 (`MCPDiscoveryState`)

- **`NOT_STARTED`：** 探索尚未開始
- **`IN_PROGRESS`：** 目前正在探索伺服器
- **`COMPLETED`：** 探索完成 (有或沒有錯誤)

### 常見問題與解決方案

#### 伺服器無法連線

**症狀：** 伺服器顯示 `DISCONNECTED` 狀態

**疑難排解：**

1. **檢查設定：** 確認 `command`、`args` 和 `cwd` 正確無誤
2. **手動測試：** 直接執行伺服器指令以確保其正常運作
3. **檢查相依性：** 確保已安裝所有必要的套件
4. **檢閱記錄：** 在 CLI 輸出中尋找錯誤訊息
5. **驗證權限：** 確保 CLI 可以執行伺服器指令

#### 未探索到任何工具

**症狀：** 伺服器已連線但沒有可用的工具

**疑難排解：**

1. **驗證工具註冊：** 確保您的伺服器確實註冊了工具
2. **檢查 MCP 通訊協定：** 確認您的伺服器正確實作 MCP 工具清單
3. **檢閱伺服器記錄：** 檢查 stderr 輸出是否有伺服器端錯誤
4. **測試工具清單：** 手動測試您伺服器的工具探索端點

#### 工具未執行

**症狀：** 工具已探索但在執行期間失敗

**疑難排解：**

1. **參數驗證：** 確保您的工具接受預期的參數
2. **結構相容性：** 確認您的輸入結構是有效的 JSON 結構
3. **錯誤處理：** 檢查您的工具是否擲回未處理的例外狀況
4. **逾時問題：** 請考慮增加 `timeout` 設定

#### 沙箱相容性

**症狀：** 啟用沙箱時 MCP 伺服器失敗

**解決方案：**

1. **以 Docker 為基礎的伺服器：** 使用包含所有相依性的 Docker 容器
2. **路徑可存取性：** 確保伺服器可執行檔可在沙箱中使用
3. **網路存取：** 設定沙箱以允許必要的網路連線
4. **環境變數：** 確認已傳遞必要的環境變數

### 偵錯提示

1. **啟用偵錯模式：** 使用 `--debug_mode` 執行 CLI 以取得詳細輸出
2. **檢查 stderr：** 擷取並記錄 MCP 伺服器 stderr (已篩選 INFO 訊息)
3. **測試隔離：** 在整合前獨立測試您的 MCP 伺服器
4. **漸進式設定：** 從簡單的工具開始，再新增複雜的功能
5. **經常使用 `/mcp`：** 在開發期間監控伺服器狀態

## 重要注意事項

### 安全性考量

- **信任設定：** `trust` 選項會略過所有確認對話方塊。請謹慎使用，且僅用於您完全控制的伺服器
- **存取權杖：** 設定包含 API 金鑰或權杖的環境變數時，請注意安全性
- **沙箱相容性：** 使用沙箱時，請確保 MCP 伺服器可在沙箱環境中使用
- **私人資料：** 使用範圍廣泛的個人存取權杖可能會導致存放庫之間的資訊外洩

### 效能與資源管理

- **連線持續性：** CLI 會維護與成功註冊工具的伺服器的持續性連線
- **自動清理：** 與未提供工具的伺服器的連線會自動關閉
- **逾時管理：** 根據您伺服器的回應特性設定適當的逾時
- **資源監控：** MCP 伺服器會以獨立的程序執行並耗用系統資源

### 結構相容性

- **屬性移除：** 系統會自動移除某些結構屬性 (`$schema`、`additionalProperties`) 以確保與 Gemini API 相容
- **名稱清理：** 工具名稱會自動清理以符合 API 需求
- **衝突解決：** 伺服器之間的工具名稱衝突會透過自動加上前置字元來解決

這種全面的整合讓 MCP 伺服器成為擴充 Gemini CLI 功能的強大方式，同時又能維持安全性、可靠性和易用性。
