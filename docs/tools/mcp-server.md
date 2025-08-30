# 透過 Gemini CLI 使用 MCP 伺服器

本文件提供透過 Gemini CLI 設定和使用模型內容協定（MCP）伺服器的指南。

## 什麼是 MCP 伺服器？

MCP 伺服器是一個應用程式，透過模型內容協定向 Gemini CLI 暴露工具和資源，允許它與外部系統和資料來源互動。MCP 伺服器作為 Gemini 模型與您的本地環境或其他服務（如 API）之間的橋樑。

MCP 伺服器讓 Gemini CLI 能夠：

- **探索工具：** 透過標準化綱要定義列出可用工具、其說明和參數。
- **執行工具：** 使用定義的引數呼叫特定工具並接收結構化回應。
- **存取資源：** 從特定資源讀取資料（雖然 Gemini CLI 主要專注於工具執行）。

透過 MCP 伺服器，您可以擴展 Gemini CLI 的能力，執行超越其內建功能的動作，例如與資料庫、API、自訂腳本或專門工作流程互動。

## 核心整合架構

Gemini CLI 透過建立在核心套件（`packages/core/src/tools/`）中的複雜探索和執行系統與 MCP 伺服器整合：

### 探索層（`mcp-client.ts`）

探索流程由 `discoverMcpTools()` 編排，它：

1. **遍歷設定的伺服器** 從您的 `settings.json` `mcpServers` 設定
2. **建立連線** 使用適當的傳輸機制（Stdio、SSE 或 Streamable HTTP）
3. **從每個伺服器擷取工具定義** 使用 MCP 協定
4. **清理和驗證** 工具綱要以確保與 Gemini API 的相容性
5. **在全域工具註冊表中註冊工具** 並解決衝突

### 執行層（`mcp-tool.ts`）

每個被探索的 MCP 工具都被包裝在 `DiscoveredMCPTool` 實例中，它：

- **處理確認邏輯** 基於伺服器信任設定和使用者偏好
- **管理工具執行** 透過使用適當參數呼叫 MCP 伺服器
- **處理回應** 用於 LLM 內容和使用者顯示
- **維護連線狀態** 並處理逾時

### 傳輸機制

Gemini CLI 支援三種 MCP 傳輸類型：

- **Stdio 傳輸：** 產生子程序並透過 stdin/stdout 通訊
- **SSE 傳輸：** 連線到伺服器發送事件端點
- **Streamable HTTP 傳輸：** 使用 HTTP 串流進行通訊

## 如何設定您的 MCP 伺服器

Gemini CLI 使用您 `settings.json` 檔案中的 `mcpServers` 設定來定位並連線到 MCP 伺服器。此設定支援使用不同傳輸機制的多個伺服器。

### 在 settings.json 中設定 MCP 伺服器

您可以在 `settings.json` 檔案中以兩種主要方式設定 MCP 伺服器：透過頂級 `mcpServers` 物件進行特定伺服器定義，以及透過 `mcp` 物件進行控制伺服器探索和執行的全域設定。

#### 全域 MCP 設定（`mcp`）

`settings.json` 中的 `mcp` 物件允許您為所有 MCP 伺服器定義全域規則。

- **`mcp.serverCommand`**（字串）：啟動 MCP 伺服器的全域指令。
- **`mcp.allowed`**（字串陣列）：允許的 MCP 伺服器名稱白名單。如果設定了此項，只有來自此清單的伺服器（符合 `mcpServers` 物件中的金鑰）才會被連線。
- **`mcp.excluded`**（字串陣列）：要排除的 MCP 伺服器名稱黑名單。此清單中的伺服器將不會被連線。

**範例：**

```json
{
  "mcp": {
    "allowed": ["my-trusted-server"],
    "excluded": ["experimental-server"]
  }
}
```

#### 伺服器特定設定（`mcpServers`）

`mcpServers` 物件是您定義希望 CLI 連線的每個個別 MCP 伺服器的地方。

### 設定結構

將 `mcpServers` 物件新增到您的 `settings.json` 檔案：

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

#### 必要（以下其中一項）

- **`command`**（字串）：Stdio 傳輸的可執行檔路徑
- **`url`**（字串）：SSE 端點 URL（例如，`"http://localhost:8080/sse"`）
- **`httpUrl`**（字串）：HTTP 串流端點 URL

#### 選用

- **`args`**（字串陣列）：Stdio 傳輸的命令列引數
- **`headers`**（物件）：使用 `url` 或 `httpUrl` 時的自訂 HTTP 標頭
- **`env`**（物件）：伺服器程序的環境變數。值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參考環境變數
- **`cwd`**（字串）：Stdio 傳輸的工作目錄
- **`timeout`**（數字）：請求逾時毫秒數（預設：600,000ms = 10 分鐘）
- **`trust`**（布林值）：當為 `true` 時，會略過此伺服器的所有工具呼叫確認（預設：`false`）
- **`includeTools`**（字串陣列）：從此 MCP 伺服器包含的工具名稱清單。指定時，只有此處列出的工具才會從此伺服器可用（白名單行為）。如果未指定，預設啟用來自伺服器的所有工具。
- **`excludeTools`**（字串陣列）：從此 MCP 伺服器排除的工具名稱清單。此處列出的工具將不會提供給模型，即使它們由伺服器暴露。**注意：** `excludeTools` 優先於 `includeTools` - 如果工具在兩個清單中，它將被排除。

### 遠端 MCP 伺服器的 OAuth 支援

Gemini CLI 支援使用 SSE 或 HTTP 傳輸的遠端 MCP 伺服器的 OAuth 2.0 驗證。這使得需要驗證的 MCP 伺服器能夠安全存取。

#### 自動 OAuth 探索

對於支援 OAuth 探索的伺服器，您可以省略 OAuth 設定並讓 CLI 自動探索：

```json
{
  "mcpServers": {
    "discoveredServer": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

CLI 會自動：

- 偵測伺服器何時需要 OAuth 驗證（401 回應）
- 從伺服器中繼資料探索 OAuth 端點
- 如果支援，執行動態用戶端註冊
- 處理 OAuth 流程和權杖管理

#### 驗證流程

連線到啟用 OAuth 的伺服器時：

1. **初始連線嘗試**因 401 未授權失敗
2. **OAuth 探索**找到授權和權杖端點
3. **瀏覽器開啟**供使用者驗證（需要本機瀏覽器存取）
4. **授權代碼**交換存取權杖
5. **權杖被安全儲存**供未來使用
6. **連線重試**以有效權杖成功

#### 瀏覽器重新導向需求

**重要：** OAuth 驗證需要您的本機機器能夠：

- 開啟網頁瀏覽器進行驗證
- 在 `http://localhost:7777/oauth/callback` 接收重新導向

此功能在以下情況下無法運作：

- 沒有瀏覽器存取的無頭環境
- 沒有 X11 轉送的遠端 SSH 工作階段
- 沒有瀏覽器支援的容器化環境

#### 管理 OAuth 驗證

使用 `/mcp auth` 指令管理 OAuth 驗證：

```bash
# 列出需要驗證的伺服器
/mcp auth

# 與特定伺服器進行驗證
/mcp auth serverName

# 權杖過期時重新驗證
/mcp auth serverName
```

#### OAuth 設定屬性

- **`enabled`**（布林值）：為此伺服器啟用 OAuth
- **`clientId`**（字串）：OAuth 用戶端識別碼（動態註冊時為選用）
- **`clientSecret`**（字串）：OAuth 用戶端密鑰（公開用戶端為選用）
- **`authorizationUrl`**（字串）：OAuth 授權端點（省略時自動探索）
- **`tokenUrl`**（字串）：OAuth 權杖端點（省略時自動探索）
- **`scopes`**（字串陣列）：所需的 OAuth 範圍
- **`redirectUri`**（字串）：自訂重新導向 URI（預設為 `http://localhost:7777/oauth/callback`）
- **`tokenParamName`**（字串）：SSE URL 中權杖的查詢參數名稱
- **`audiences`**（字串陣列）：權杖有效的目標對象

#### 權杖管理

OAuth 權杖會自動：

- **安全儲存**於 `~/.gemini/mcp-oauth-tokens.json`
- **重新整理**過期權杖（如果有重新整理權杖可用）
- **驗證**每次連線嘗試前
- **清理**無效或過期的權杖

#### 驗證提供者類型

您可以使用 `authProviderType` 屬性指定驗證提供者類型：

- **`authProviderType`**（字串）：指定驗證提供者。可以是以下其中一項：
  - **`dynamic_discovery`**（預設）：CLI 會自動從伺服器探索 OAuth 設定。
  - **`google_credentials`**：CLI 會使用 Google 應用程式預設憑證（ADC）與伺服器進行驗證。使用此提供者時，您必須指定所需的範圍。

```json
{
  "mcpServers": {
    "googleCloudServer": {
      "httpUrl": "https://my-gcp-service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

### 設定範例

#### Python MCP 伺服器（Stdio）

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

#### Node.js MCP 伺服器（Stdio）

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

#### 帶有自訂標頭的基於 HTTP 的 MCP 伺服器

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

#### 帶有工具篩選的 MCP 伺服器

```json
{
  "mcpServers": {
    "filteredServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "includeTools": ["safe_tool", "file_reader", "data_processor"],
      // "excludeTools": ["dangerous_tool", "file_deleter"],
      "timeout": 30000
    }
  }
}
```

## 探索流程深入解析

當 Gemini CLI 啟動時，它透過以下詳細流程執行 MCP 伺服器探索：

### 1. 伺服器迭代與連線

對於 `mcpServers` 中每個設定的伺服器：

1. **狀態追蹤開始：** 伺服器狀態設定為 `CONNECTING`
2. **傳輸選擇：** 基於設定屬性：
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **建立連線：** MCP 用戶端嘗試使用設定的逾時時間連線
4. **錯誤處理：** 連線失敗會被記錄，伺服器狀態設定為 `DISCONNECTED`

### 2. 工具探索

成功連線後：

1. **工具清單：** 用戶端呼叫 MCP 伺服器的工具清單端點
2. **綱要驗證：** 每個工具的函式宣告都會被驗證
3. **工具篩選：** 工具會根據 `includeTools` 和 `excludeTools` 設定進行篩選
4. **名稱淨化：** 工具名稱會被清理以符合 Gemini API 要求：
   - 無效字元（非英數字、底線、點、連字號）會被替換為底線
   - 超過 63 字元的名稱會被截斷並進行中間替換（`___`）

### 3. 衝突解決

當多個伺服器暴露同名工具時：

1. **首次註冊獲勝：** 第一個註冊工具名稱的伺服器取得無前綴名稱
2. **自動加前綴：** 後續伺服器取得加前綴的名稱：`serverName__toolName`
3. **註冊表追蹤：** 工具註冊表維護伺服器名稱與其工具之間的對應

### 4. 綱要處理

工具參數綱要會經過淨化以符合 Gemini API 相容性：

- **`$schema` 屬性**會被移除
- **`additionalProperties`**會被剝離
- **帶有 `default` 的 `anyOf`**會移除其預設值（Vertex AI 相容性）
- **遞迴處理**套用於巢狀綱要

### 5. 連線管理

探索後：

- **持久連線：** 成功註冊工具的伺服器會維持其連線
- **清理：** 不提供可用工具的伺服器會關閉其連線
- **狀態更新：** 最終伺服器狀態設定為 `CONNECTED` 或 `DISCONNECTED`

## 工具執行流程

當 Gemini 模型決定使用 MCP 工具時，會發生以下執行流程：

### 1. 工具呼叫

模型會產生一個 `FunctionCall`，包含：

- **工具名稱：** 註冊的名稱（可能帶有前綴）
- **引數：** 符合工具參數綱要的 JSON 物件

### 2. 確認流程

每個 `DiscoveredMCPTool` 實作複雜的確認邏輯：

#### 基於信任的略過

```typescript
if (this.trust) {
  return false; // 不需要確認
}
```

#### 動態允許清單

系統維護以下內部允許清單：

- **伺服器層級：** `serverName` → 此伺服器的所有工具都受信任
- **工具層級：** `serverName.toolName` → 此特定工具受信任

#### 使用者選擇處理

當需要確認時，使用者可以選擇：

- **僅此次執行：** 僅執行這次
- **總是允許此工具：** 新增到工具層級允許清單
- **總是允許此伺服器：** 新增到伺服器層級允許清單
- **取消：** 中止執行

### 3. 執行

確認後（或信任略過）：

1. **參數準備：** 引數會根據工具綱要進行驗證
2. **MCP 呼叫：** 底層 `CallableTool` 會使用以下參數呼叫伺服器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // 原始伺服器工具名稱
       args: params,
     },
   ];
   ```

3. **回應處理：** 結果會格式化供 LLM 內容和使用者顯示使用

### 4. 回應處理

執行結果包含：

- **`llmContent`：** 供語言模型內容使用的原始回應部分
- **`returnDisplay`：** 供使用者顯示使用的格式化輸出（通常是 markdown 程式碼區塊中的 JSON）

## 如何與您的 MCP 伺服器互動

### 使用 `/mcp` 指令

`/mcp` 指令提供關於您 MCP 伺服器設定的完整資訊：

```bash
/mcp
```

這會顯示：

- **伺服器清單：** 所有設定的 MCP 伺服器
- **連線狀態：** `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`
- **伺服器詳細資料：** 設定摘要（排除敏感資料）
- **可用工具：** 來自每個伺服器的工具清單及說明
- **探索狀態：** 整體探索流程狀態

### `/mcp` 輸出範例

```
MCP 伺服器狀態：

📡 pythonTools (已連線)
  指令：python -m my_mcp_server --port 8080
  工作目錄：./mcp-servers/python
  逾時：15000ms
  工具：calculate_sum、file_analyzer、data_processor

🔌 nodeServer (已中斷連線)
  指令：node dist/server.js --verbose
  錯誤：連線被拒絕

🐳 dockerizedServer (已連線)
  指令：docker run -i --rm -e API_KEY my-mcp-server:latest
  工具：docker__deploy、docker__status

探索狀態：已完成
```

### 工具使用

一旦被探索，MCP 工具就像內建工具一樣可供 Gemini 模型使用。模型會自動：

1. **選擇適當的工具**基於您的請求
2. **顯示確認對話方塊**（除非伺服器受信任）
3. **執行工具**使用適當的參數
4. **顯示結果**以使用者友善的格式

## 狀態監控與疑難排解

### 連線狀態

MCP 整合會追蹤數個狀態：

#### 伺服器狀態（`MCPServerStatus`）

- **`DISCONNECTED`：** 伺服器未連線或有錯誤
- **`CONNECTING`：** 連線嘗試進行中
- **`CONNECTED`：** 伺服器已連線且就緒

#### 探索狀態（`MCPDiscoveryState`）

- **`NOT_STARTED`：** 探索尚未開始
- **`IN_PROGRESS`：** 目前正在探索伺服器
- **`COMPLETED`：** 探索已完成（無論是否有錯誤）

### 常見問題與解決方案

#### 伺服器無法連線

**症狀：** 伺服器顯示 `DISCONNECTED` 狀態

**疑難排解：**

1. **檢查設定：** 驗證 `command`、`args` 和 `cwd` 是否正確
2. **手動測試：** 直接執行伺服器指令以確保它能運作
3. **檢查相依性：** 確保所有必要的套件都已安裝
4. **查看日誌：** 在 CLI 輸出中尋找錯誤訊息
5. **驗證權限：** 確保 CLI 可以執行伺服器指令

#### 沒有探索到工具

**症狀：** 伺服器連線但沒有可用工具

**疑難排解：**

1. **驗證工具註冊：** 確保您的伺服器實際上有註冊工具
2. **檢查 MCP 協定：** 確認您的伺服器正確實作 MCP 工具清單
3. **查看伺服器日誌：** 檢查 stderr 輸出中的伺服器端錯誤
4. **測試工具清單：** 手動測試您伺服器的工具探索端點

#### 工具無法執行

**症狀：** 工具被探索到但在執行時失敗

**疑難排解：**

1. **參數驗證：** 確保您的工具接受預期的參數
2. **綱要相容性：** 驗證您的輸入綱要是有效的 JSON 綱要
3. **錯誤處理：** 檢查您的工具是否丟出未處理的例外
4. **逾時問題：** 考慮增加 `timeout` 設定

#### 沙箱相容性

**症狀：** 啟用沙箱化時 MCP 伺服器失敗

**解決方案：**

1. **基於 Docker 的伺服器：** 使用包含所有相依性的 Docker 容器
2. **路徑可存取性：** 確保伺服器可執行檔在沙箱中可用
3. **網路存取：** 設定沙箱以允許必要的網路連線
4. **環境變數：** 驗證所需的環境變數有被傳遞

### 偵錯技巧

1. **啟用偵錯模式：** 使用 `--debug` 執行 CLI 以取得詳細輸出
2. **檢查 stderr：** MCP 伺服器 stderr 會被擷取並記錄（INFO 訊息已篩選）
3. **測試隔離：** 在整合前獨立測試您的 MCP 伺服器
4. **增量設定：** 在新增複雜功能前先從簡單工具開始
5. **經常使用 `/mcp`：** 在開發期間監控伺服器狀態

## 重要注意事項

### 安全性考量

- **信任設定：** `trust` 選項會略過所有確認對話方塊。請謹慎使用，僅用於您完全控制的伺服器
- **存取權杖：** 設定包含 API 金鑰或權杖的環境變數時要注意安全性
- **沙箱相容性：** 使用沙箱化時，確保 MCP 伺服器在沙箱環境中可用
- **私人資料：** 使用範圍廣泛的個人存取權杖可能導致儲存庫間的資訊洩漏

### 效能與資源管理

- **連線持久性：** CLI 會維持與成功註冊工具的伺服器的持久連線
- **自動清理：** 與不提供工具的伺服器的連線會自動關閉
- **逾時管理：** 根據您伺服器的回應特性設定適當的逾時
- **資源監控：** MCP 伺服器作為獨立程序執行並消耗系統資源

### 綱要相容性

- **屬性剝離：** 系統會自動移除某些綱要屬性（`$schema`、`additionalProperties`）以符合 Gemini API 相容性
- **名稱淨化：** 工具名稱會自動淨化以符合 API 要求
- **衝突解決：** 伺服器間的工具名稱衝突會透過自動加前綴解決

這種完整的整合使 MCP 伺服器成為擴展 Gemini CLI 能力的強大方式，同時維護安全性、可靠性和易用性。

## 從工具傳回豐富內容

MCP 工具不僅限於傳回簡單文字。您可以在單一工具回應中傳回豐富的多部分內容，包括文字、影像、音訊和其他二進位資料。這讓您能夠建置強大的工具，可以在單一回合中向模型提供多樣化的資訊。

從工具傳回的所有資料都會被處理並作為內容傳送給模型進行下一次生成，使其能夠推理或總結提供的資訊。

### 運作方式

要傳回豐富內容，您的工具回應必須遵循 [`CallToolResult`](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result) 的 MCP 規範。結果的 `content` 欄位應該是 `ContentBlock` 物件的陣列。Gemini CLI 會正確處理此陣列，將文字與二進位資料分離並為模型打包。

您可以在 `content` 陣列中混合搭配不同的內容區塊類型。支援的區塊類型包括：

- `text`
- `image`
- `audio`
- `resource`（嵌入內容）
- `resource_link`

### 範例：傳回文字和影像

以下是 MCP 工具的有效 JSON 回應範例，傳回文字說明和影像：

```json
{
  "content": [
    {
      "type": "text",
      "text": "這是您請求的標誌。"
    },
    {
      "type": "image",
      "data": "BASE64_ENCODED_IMAGE_DATA_HERE",
      "mimeType": "image/png"
    },
    {
      "type": "text",
      "text": "此標誌創建於 2025 年。"
    }
  ]
}
```

當 Gemini CLI 收到此回應時，它會：

1. 提取所有文字並將其合併為模型的單一 `functionResponse` 部分。
2. 將影像資料作為獨立的 `inlineData` 部分呈現。
3. 在 CLI 中提供乾淨、使用者友善的摘要，指示已收到文字和影像。

這讓您能夠建置複雜的工具，為 Gemini 模型提供豐富的多模態內容。

## MCP 提示作為斜線指令

除了工具之外，MCP 伺服器還可以暴露預定義的提示，這些提示可以在 Gemini CLI 內作為斜線指令執行。這讓您可以為常見或複雜查詢建立捷徑，可以輕鬆透過名稱呼叫。

### 在伺服器上定義提示

以下是定義提示的 stdio MCP 伺服器小範例：

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'prompt-server',
  version: '1.0.0',
});

server.registerPrompt(
  'poem-writer',
  {
    title: 'Poem Writer',
    description: 'Write a nice haiku',
    argsSchema: { title: z.string(), mood: z.string().optional() },
  },
  ({ title, mood }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `寫一首${mood ? `帶有 ${mood} 情緒的` : ''}名為 ${title} 的俳句。請注意俳句是 5 個音節，接著 7 個音節，再接著 5 個音節`,
        },
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

這可以在 `settings.json` 的 `mcpServers` 下包含：

```json
{
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["filename.ts"]
    }
  }
}
```

### 呼叫提示

一旦提示被探索，您可以使用其名稱作為斜線指令來呼叫它。CLI 會自動處理解析引數。

```bash
/poem-writer --title="Gemini CLI" --mood="reverent"
```

or, using positional arguments:

```bash
/poem-writer "Gemini CLI" reverent
```

When you run this command, the Gemini CLI executes the `prompts/get` method on the MCP server with the provided arguments. The server is responsible for substituting the arguments into the prompt template and returning the final prompt text. The CLI then sends this prompt to the model for execution. This provides a convenient way to automate and share common workflows.

## 使用 `gemini mcp` 管理 MCP 伺服器

雖然您隨時可以透過手動編輯 `settings.json` 檔案來設定 MCP 伺服器，但 Gemini CLI 提供了一套便利的指令來程式化管理您的伺服器設定。這些指令簡化了新增、列出和移除 MCP 伺服器的流程，無需直接編輯 JSON 檔案。

### 新增伺服器（`gemini mcp add`）

`add` 指令會在您的 `settings.json` 中設定新的 MCP 伺服器。根據範圍（`-s, --scope`），它會被新增到使用者設定 `~/.gemini/settings.json` 或專案設定 `.gemini/settings.json` 檔案中。

**指令：**

```bash
gemini mcp add [選項] <名稱> <指令或URL> [引數...]
```

- `<名稱>`：伺服器的唯一名稱。
- `<指令或URL>`：要執行的指令（適用於 `stdio`）或 URL（適用於 `http`/`sse`）。
- `[引數...]`：`stdio` 指令的選用引數。

**選項（旗標）：**

- `-s, --scope`：設定範圍（user 或 project）。[預設：「project」]
- `-t, --transport`：傳輸類型（stdio、sse、http）。[預設：「stdio」]
- `-e, --env`：設定環境變數（例如 -e KEY=value）。
- `-H, --header`：為 SSE 和 HTTP 傳輸設定 HTTP 標頭（例如 -H "X-Api-Key: abc123" -H "Authorization: Bearer abc123"）。
- `--timeout`：設定連線逾時毫秒數。
- `--trust`：信任伺服器（略過所有工具呼叫確認提示）。
- `--description`：設定伺服器的說明。
- `--include-tools`：要包含的工具清單，以逗號分隔。
- `--exclude-tools`：要排除的工具清單，以逗號分隔。

#### 新增 stdio 伺服器

This is the default transport for running local servers.

```bash
# Basic syntax
gemini mcp add <name> <command> [args...]

# Example: Adding a local server
gemini mcp add my-stdio-server -e API_KEY=123 /path/to/server arg1 arg2 arg3

# Example: Adding a local python server
gemini mcp add python-server python server.py --port 8080
```

#### Adding an HTTP server

This transport is for servers that use the streamable HTTP transport.

```bash
# Basic syntax
gemini mcp add --transport http <name> <url>

# Example: Adding an HTTP server
gemini mcp add --transport http http-server https://api.example.com/mcp/

# Example: Adding an HTTP server with an authentication header
gemini mcp add --transport http secure-http https://api.example.com/mcp/ --header "Authorization: Bearer abc123"
```

#### Adding an SSE server

This transport is for servers that use Server-Sent Events (SSE).

```bash
# Basic syntax
gemini mcp add --transport sse <name> <url>

# Example: Adding an SSE server
gemini mcp add --transport sse sse-server https://api.example.com/sse/

# Example: Adding an SSE server with an authentication header
gemini mcp add --transport sse secure-sse https://api.example.com/sse/ --header "Authorization: Bearer abc123"
```

### Listing Servers (`gemini mcp list`)

To view all MCP servers currently configured, use the `list` command. It displays each server's name, configuration details, and connection status.

**Command:**

```bash
gemini mcp list
```

**Example Output:**

```sh
✓ stdio-server: command: python3 server.py (stdio) - Connected
✓ http-server: https://api.example.com/mcp (http) - Connected
✗ sse-server: https://api.example.com/sse (sse) - Disconnected
```

### Removing a Server (`gemini mcp remove`)

To delete a server from your configuration, use the `remove` command with the server's name.

**Command:**

```bash
gemini mcp remove <name>
```

**Example:**

```bash
gemini mcp remove my-server
```

This will find and delete the "my-server" entry from the `mcpServers` object in the appropriate `settings.json` file based on the scope (`-s, --scope`).
