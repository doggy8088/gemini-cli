# 搭配 Gemini CLI 使用 MCP 伺服器

本文件提供一份指南，說明如何為 Gemini CLI 設定與使用模型情境協定（MCP）伺服器。

## MCP 伺服器是什麼？

MCP 伺服器是一種應用程式，可透過模型情境協定將工具和資源公開給 Gemini CLI，使其能夠與外部系統和資料來源互動。MCP 伺服器扮演著 Gemini 模型與您的本機環境或其他服務（如 API）之間的橋樑。

MCP 伺服器能讓 Gemini CLI 做到：

- **探索工具：** 透過標準化的綱要定義，列出可用的工具、其描述和參數。
- **執行工具：** 使用定義好的參數呼叫特定工具，並接收結構化的回應。
- **存取資源：** 從特定資源讀取資料（不過 Gemini CLI 主要著重於工具執行）。

透過 MCP 伺服器，您可以擴展 Gemini CLI 的功能，使其能執行超越其內建功能的操作，例如與資料庫、API、自訂腳本或專門的工作流程互動。

## 核心整合架構

Gemini CLI 透過內建於核心套件（`packages/core/src/tools/`）中的精密探索與執行系統，與 MCP 伺服器進行整合：

### 探索層 (`mcp-client.ts`)

探索流程由 `discoverMcpTools()` 協調，其功能為：

1. **迭代已設定的伺服器** 從您的 `settings.json` `mcpServers` 設定中
2. **建立連線** 使用適當的傳輸機制（Stdio、SSE 或 Streamable HTTP）
3. **擷取工具定義** 使用 MCP 協定從各個伺服器
4. **清理並驗證** 工具綱要，以確保與 Gemini API 的相容性
5. **註冊工具** 在全域工具登錄檔中，並解決衝突

### 執行層 (`mcp-tool.ts`)

每個探索到的 MCP 工具都被包裝在一個 `DiscoveredMCPTool` 實例中，該實例會：

- **處理確認邏輯** 根據伺服器信任設定和使用者偏好
- **管理工具執行** 透過使用正確的參數呼叫 MCP 伺服器
- **處理回應** 供 LLM 情境和使用者顯示使用
- **維護連線狀態** 並處理逾時

### 傳輸機制

Gemini CLI 支援三種 MCP 傳輸類型：

- **Stdio 傳輸：** 產生一個子程序並透過 stdin/stdout 進行通訊
- **SSE 傳輸：** 連接到伺服器發送事件（Server-Sent Events）端點
- **Streamable HTTP 傳輸：** 使用 HTTP 串流進行通訊

## 如何設定您的 MCP 伺服器

Gemini CLI 使用您 `settings.json` 檔案中的 `mcpServers` 設定來定位並連接到 MCP 伺服器。此設定支援多個使用不同傳輸機制的伺服器。

### 在 settings.json 中設定 MCP 伺服器

您可以在 `~/.gemini/settings.json` 檔案中進行全域層級的 MCP 伺服器設定，或在您的專案根目錄中，建立或開啟 `.gemini/settings.json` 檔案。在檔案內，新增 `mcpServers` 設定區塊。

### 設定結構

將一個 `mcpServers` 物件新增至您的 `settings.json` 檔案中：

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

每個伺服器設定支援以下屬性：

#### 必要項（以下擇一）

- **`command`** (字串): Stdio 傳輸的可執行檔路徑
- **`url`** (字串): SSE 端點 URL（例如：`"http://localhost:8080/sse"`）
- **`httpUrl`** (字串): HTTP 串流端點 URL

#### 選項

- **`args`** (字串[]): Stdio 傳輸的命令列參數
- **`env`** (物件): 伺服器程序的環境變數。值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法來引用環境變數
- **`cwd`** (字串): Stdio 傳輸的工作目錄
- **`timeout`** (數字): 請求逾時時間，單位為毫秒（預設值：600,000 毫秒 = 10 分鐘）
- **`trust`** (布林值): 若為 `true`，則會略過此伺服器的所有工具呼叫確認（預設值：`false`）

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

## 探索流程深度解析

當 Gemini CLI 啟動時，它會透過以下詳細流程執行 MCP 伺服器探索：

### 1. 伺服器迭代與連線

對於 `mcpServers` 中每個已設定的伺服器：

1. **開始追蹤狀態：** 伺服器狀態設為 `CONNECTING`
2. **選擇傳輸機制：** 根據設定屬性：
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **建立連線：** MCP 客戶端會嘗試在設定的逾時時間內連線
4. **錯誤處理：** 連線失敗會被記錄下來，且伺服器狀態會設為 `DISCONNECTED`

### 2. 工具探索

成功連線後：

1. **工具清單：** 客戶端會呼叫 MCP 伺服器的工具清單端點
2. **結構驗證：** 每個工具的函式宣告都會經過驗證
3. **名稱清理：** 清理工具名稱以符合 Gemini API 的要求：
   - 無效字元（非英數字元、底線、點、連字號）將被底線取代
   - 長度超過 63 個字元的名稱將會被截斷，並在中間以 `___` 取代

### 3. 衝突解決

當多個伺服器公開同名工具時：

1. **先註冊者優先：** 第一個註冊工具名稱的伺服器會獲得無前綴的名稱
2. **自動加上前綴：** 後續的伺服器會獲得加上前綴的名稱：`serverName__toolName`
3. **註冊表追蹤：** 工具註冊表會維護伺服器名稱與其工具之間的對應關係

### 4. 結構處理

工具參數結構會經過清理，以確保與 Gemini API 的相容性：

- **`$schema` 屬性**會被移除
- **`additionalProperties`** 會被去除
- **帶有 `default` 的 `anyOf`** 其預設值會被移除（為與 Vertex AI 相容）
- **遞迴處理**適用於巢狀結構

### 5. 連線管理

探索完成後：

- **持續連線：** 成功註冊工具的伺服器會維持其連線
- **清理：** 未提供任何可用工具的伺服器，其連線將被關閉
- **狀態更新：** 最終的伺服器狀態會設為 `CONNECTED` 或 `DISCONNECTED`

## 工具執行流程

當 Gemini 模型決定使用 MCP 工具時，會發生以下執行流程：

### 1. 工具呼叫

模型會產生一個 `FunctionCall`，其中包含：

- **工具名稱：** 已註冊的名稱（可能帶有前綴）
- **引數：** 符合工具參數結構的 JSON 物件

### 2. 確認流程

每個 `DiscoveredMCPTool` 都實作了精密的確認邏輯：

#### 基於信任的繞過機制

```typescript
if (this.trust) {
  return false; // 不需要確認
}
```

#### 動態允許清單

系統會為以下項目維護內部允許清單：

- **伺服器層級：** `serverName` → 此伺服器的所有工具皆受信賴
- **工具層級：** `serverName.toolName` → 此特定工具受信賴

#### 使用者選擇處理

需要確認時，使用者可以選擇：

- **執行一次：** 僅執行這一次
- **一律允許此工具：** 新增至工具層級的允許清單
- **一律允許此伺服器：** 新增至伺服器層級的允許清單
- **取消：** 中止執行

### 3. 執行

確認後（或信任繞過後）：

1. **參數準備：** 根據工具的結構驗證引數
2. **MCP 呼叫：** 底層的 `CallableTool` 會透過以下方式呼叫伺服器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // 原始伺服器工具名稱
       args: params,
     },
   ];
   ```

3. **回應處理：** 結果會被格式化，以便用於 LLM 情境和使用者顯示

### 4. 回應處理

執行結果包含：

- **`llmContent`:** 用於語言模型情境的原始回應部分
- **`returnDisplay`:** 用於使用者顯示的格式化輸出（通常是 markdown 程式碼區塊中的 JSON）

## 如何與您的 MCP 伺服器互動

### 使用 `/mcp` 指令

`/mcp` 指令提供關於您 MCP 伺服器設定的全面資訊：

```bash
/mcp
```

這會顯示：

- **伺服器清單：** 所有已設定的 MCP 伺服器
- **連線狀態：** `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`
- **伺服器詳細資料：** 設定摘要（不含敏感資料）
- **可用工具：** 來自每個伺服器的工具清單及其說明
- **探索狀態：** 整體探索流程的狀態

### `/mcp` 輸出範例

```
MCP 伺服器狀態：

📡 pythonTools (CONNECTED)
  指令：python -m my_mcp_server --port 8080
  工作目錄：./mcp-servers/python
  逾時：15000ms
  工具：calculate_sum, file_analyzer, data_processor

🔌 nodeServer (DISCONNECTED)
  指令：node dist/server.js --verbose
  錯誤：連線被拒

🐳 dockerizedServer (CONNECTED)
  指令：docker run -i --rm -e API_KEY my-mcp-server:latest
  工具：docker__deploy, docker__status

探索狀態：COMPLETED
```

### 工具使用

一旦探索完成，MCP 工具就如同內建工具一樣可供 Gemini 模型使用。模型將自動：

1. **根據您的請求選擇適當的工具**
2. **顯示確認對話方塊**（除非伺服器受信賴）
3. **以正確的參數執行工具**
4. **以使用者友善的格式顯示結果**

## 狀態監控與疑難排解

### 連線狀態

MCP 整合會追蹤數個狀態：

#### 伺服器狀態 (`MCPServerStatus`)

- **`DISCONNECTED`:** 伺服器未連線或發生錯誤
- **`CONNECTING`:** 正在嘗試連線
- **`CONNECTED`:** 伺服器已連線並準備就緒

#### 探索狀態 (`MCPDiscoveryState`)

- **`NOT_STARTED`:** 探索尚未開始
- **`IN_PROGRESS`:** 正在探索伺服器
- **`COMPLETED`:** 探索已完成（無論是否發生錯誤）

### 常見問題與解決方案

#### 伺服器無法連線

**症狀：** 伺服器顯示 `DISCONNECTED` 狀態

**疑難排解：**

1. **檢查設定：** 確認 `command`、`args` 和 `cwd` 是否正確
2. **手動測試：** 直接執行伺服器指令以確保其能正常運作
3. **檢查相依套件：** 確保所有必要的套件都已安裝
4. **檢閱日誌：** 在 CLI 輸出中尋找錯誤訊息
5. **驗證權限：** 確保 CLI 可以執行伺服器指令

#### 未探索到任何工具

**症狀：** 伺服器已連線但沒有可用的工具

**疑難排解：**

1. **驗證工具註冊：** 確保您的伺服器確實有註冊工具
2. **檢查 MCP 協定：** 確認您的伺服器正確實作了 MCP 工具清單功能
3. **檢閱伺服器日誌：** 檢查伺服器端的 stderr 輸出是否有錯誤
4. **測試工具清單：** 手動測試您伺服器的工具探索端點

#### 工具未執行

**症狀：** 工具已探索到，但在執行期間失敗

**疑難排解：**

1. **參數驗證：** 確保您的工具接受預期的參數
2. **結構描述相容性：** 驗證您的輸入結構描述為有效的 JSON Schema
3. **錯誤處理：** 檢查您的工具是否擲回未處理的例外狀況
4. **逾時問題：** 考慮增加 `timeout` 設定

#### 沙箱相容性

**症狀：** 啟用沙箱時 MCP 伺服器失敗

**解決方案：**

1. **以 Docker 為基礎的伺服器：** 使用包含所有相依套件的 Docker 容器
2. **路徑可存取性：** 確保伺服器執行檔在沙箱中可用
3. **網路存取：** 設定沙箱以允許必要的網路連線
4. **環境變數：** 驗證必要的環境變數已傳遞

### 除錯提示

1. **啟用除錯模式：** 使用 `--debug_mode` 執行 CLI 以取得詳細輸出
2. **檢查 stderr：** MCP 伺服器的 stderr 會被擷取並記錄（INFO 訊息會被過濾）
3. **隔離測試：** 在整合前獨立測試您的 MCP 伺服器
4. **漸進式設定：** 從簡單的工具開始，再加入複雜的功能
5. **經常使用 `/mcp`：** 在開發期間監控伺服器狀態

## 重要注意事項

### 安全性考量

- **信任設定：** `trust` 選項會繞過所有確認對話方塊。請謹慎使用，且僅用於您完全控制的伺服器
- **存取權杖：** 設定包含 API 金鑰或權杖的環境變數時，請注意安全性
- **沙箱相容性：** 使用沙箱時，請確保 MCP 伺服器在沙箱環境中可用
- **私密資料：** 使用範圍廣泛的個人存取權杖可能導致儲存庫之間的資訊洩漏

### 效能與資源管理

- **連線持續性：** CLI 會與成功註冊工具的伺服器維持持續連線
- **自動清理：** 與未提供任何工具的伺服器連線會自動關閉
- **逾時管理：** 根據您伺服器的回應特性設定適當的逾時時間
- **資源監控：** MCP 伺服器作為獨立的程序執行並消耗系統資源

### 結構描述相容性

- **屬性移除：** 系統會自動移除某些結構描述屬性（`$schema`、`additionalProperties`）以符合 Gemini API 的相容性
- **名稱清理：** 工具名稱會自動清理以符合 API 要求
- **衝突解決：** 伺服器之間的工具名稱衝突會透過自動加上前綴來解決

這種全面的整合使 MCP 伺服器成為擴展 Gemini CLI 功能的強大方式，同時保有安全性、可靠性與易用性。
