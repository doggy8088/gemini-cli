# 使用 Gemini CLI 搭配 MCP 伺服器

本文件提供如何在 Gemini CLI 中設定與使用 Model Context Protocol（MCP）伺服器的指南。

## 什麼是 MCP 伺服器？

MCP 伺服器是一種應用程式，透過 Model Context Protocol（MCP）將工具與資源暴露給 Gemini CLI，使其能與外部系統及資料來源互動。MCP 伺服器充當 Gemini 模型與本地環境或其他服務（如 API）之間的橋樑。

MCP 伺服器讓 Gemini CLI 能夠：

- **發現工具：** 透過標準化的 schema 定義，列出可用工具、其描述與參數。
- **執行工具：** 以定義好的參數呼叫特定工具，並接收結構化回應。
- **存取資源：** 從特定資源讀取資料（雖然 Gemini CLI 主要聚焦於工具執行）。

透過 MCP 伺服器，您可以擴充 Gemini CLI 的能力，執行內建功能以外的操作，例如與資料庫、API、自訂腳本或專業化工作流程互動。

## 核心整合架構

Gemini CLI 透過內建於核心套件（`packages/core/src/tools/`）的進階發現與執行系統，與 MCP 伺服器整合：

### 發現層（`mcp-client.ts`）

發現流程由 `discoverMcpTools()` 負責協調，其步驟如下：

1. **遍歷已設定的伺服器**，根據您的 `settings.json` `mcpServers` 設定
2. **建立連線**，使用適當的傳輸機制（Stdio、SSE 或 Streamable HTTP）
3. **透過 MCP 協定取得工具定義**，從每個伺服器擷取工具資訊
4. **淨化與驗證** 工具 schema，以確保與 Gemini API 相容
5. **註冊工具** 至全域工具註冊表，並處理衝突解決

### 執行層（`mcp-tool.ts`）

每個被發現的 MCP 工具都會包裝在 `DiscoveredMCPTool` 實例中，其負責：

- **處理確認邏輯**，根據伺服器信任設定與使用者偏好
- **管理工具執行**，以正確參數呼叫 MCP 伺服器
- **處理回應**，同時供大型語言模型 (LLM) context 與使用者顯示
- **維護連線狀態**，並處理逾時情況

### 傳輸機制

Gemini CLI 支援三種 MCP 傳輸類型：

- **Stdio 傳輸：** 啟動子行程，並透過 stdin/stdout 溝通
- **SSE 傳輸：** 連接至 Server-Sent Events 端點
- **Streamable HTTP 傳輸：** 使用 HTTP 串流進行通訊

## 如何設定您的 MCP 伺服器

Gemini CLI 會在您的 `settings.json` 檔案中，透過 `mcpServers` 設定來尋找並連接 MCP 伺服器。此設定支援多個伺服器及不同的傳輸機制。

### 在 settings.json 中設定 MCP 伺服器

您可以在 `settings.json` 檔案中，透過兩種主要方式設定 MCP 伺服器：一是使用頂層的 `mcpServers` 物件來定義特定伺服器，二是透過 `mcp` 物件來進行伺服器發現與執行的全域設定。

#### 全域 MCP 設定（`mcp`）

您的 `settings.json` 中的 `mcp` 物件，可用來為所有 MCP 伺服器定義全域規則。

- **`mcp.serverCommand`**（字串）：啟動 MCP 伺服器的全域指令。
- **`mcp.allowed`**（字串陣列）：允許連線的 MCP 伺服器名稱清單。若設定此項，僅會連線此清單中（與 `mcpServers` 物件鍵值相符）的伺服器。
- **`mcp.excluded`**（字串陣列）：排除連線的 MCP 伺服器名稱清單。此清單中的伺服器將不會被連線。

**範例：**

```json
{
  "mcp": {
    "allowed": ["my-trusted-server"],
    "excluded": ["experimental-server"]
  }
}
```

#### 伺服器專屬設定（`mcpServers`）

`mcpServers` 物件是用來定義每一個你希望命令列介面（CLI）連線的 MCP 伺服器。

### 設定結構

在你的 `settings.json` 檔案中新增一個 `mcpServers` 物件：

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

#### 必要（以下擇一）

- **`command`**（字串）：Stdio 傳輸方式的可執行檔路徑
- **`url`**（字串）：SSE 端點 URL（例如：`"http://localhost:8080/sse"`）
- **`httpUrl`**（字串）：HTTP 串流端點 URL

#### 選用

- **`args`**（字串陣列）：Stdio 傳輸方式的命令列參數
- **`headers`**（物件）：使用 `url` 或 `httpUrl` 時的自訂 HTTP 標頭
- **`env`**（物件）：伺服器程序的環境變數。值可使用 `$VAR_NAME` 或 `${VAR_NAME}` 語法參照環境變數
- **`cwd`**（字串）：Stdio 傳輸方式的工作目錄
- **`timeout`**（數字）：請求逾時時間（毫秒），預設為 600,000ms（10 分鐘）
- **`trust`**（布林值）：當 `true` 時，略過此伺服器的所有工具呼叫確認（預設：`false`）
- **`includeTools`**（字串陣列）：要從此 MCP 伺服器納入的工具名稱清單。若指定，僅此清單中的工具會從該伺服器提供（白名單行為）。若未指定，預設啟用伺服器上的所有工具。
- **`excludeTools`**（字串陣列）：要從此 MCP 伺服器排除的工具名稱清單。即使伺服器有提供，這些工具也不會對模型開放。**注意：**`excludeTools` 的優先順序高於 `includeTools`——如果工具同時出現在兩個清單，將會被排除。

### 遠端 MCP 伺服器的 OAuth 支援

Gemini CLI 支援遠端 MCP 伺服器（使用 SSE 或 HTTP 傳輸方式）的 OAuth 2.0 驗證。這可讓需要驗證的 MCP 伺服器安全存取。

#### 自動 OAuth 探索

對於支援 OAuth 探索的伺服器，你可以省略 OAuth 設定，讓 CLI 自動偵測：

```json
{
  "mcpServers": {
    "discoveredServer": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

命令列介面 (CLI) 會自動執行以下動作：

- 偵測伺服器是否需要 OAuth 驗證（401 回應）
- 從伺服器中繼資料自動發現 OAuth 端點
- 若支援，則執行動態用戶端註冊
- 處理 OAuth 流程與權杖管理

#### 驗證流程

當連線至支援 OAuth 的伺服器時：

1. **初次連線嘗試** 因 401 Unauthorized 失敗
2. **OAuth 探索** 取得授權與權杖端點
3. **瀏覽器自動開啟** 以進行使用者驗證（需本機可存取瀏覽器）
4. **授權碼** 交換為存取權杖
5. **權杖會被安全儲存** 以供日後使用
6. **重新嘗試連線**，使用有效權杖即可成功

#### 瀏覽器重新導向需求

**重要：** OAuth 驗證需要您的本機能夠：

- 開啟網頁瀏覽器以進行驗證
- 在 `http://localhost:7777/oauth/callback` 上接收重新導向

此功能無法在以下環境運作：

- 無法存取瀏覽器的無頭（headless）環境
- 未啟用 X11 轉發的遠端 SSH 連線
- 不支援瀏覽器的容器化（containerized）環境

#### 管理 OAuth 驗證

請使用 `/mcp auth` 指令來管理 OAuth 驗證：

```bash
# List servers requiring authentication
/mcp auth

# Authenticate with a specific server
/mcp auth serverName

# Re-authenticate if tokens expire
/mcp auth serverName
```

#### OAuth 設定屬性

- **`enabled`**（布林值）：啟用此伺服器的 OAuth
- **`clientId`**（字串）：OAuth 用戶端識別碼（動態註冊時可選填）
- **`clientSecret`**（字串）：OAuth 用戶端密鑰（公開用戶端可選填）
- **`authorizationUrl`**（字串）：OAuth 授權端點（若未填寫則自動發現）
- **`tokenUrl`**（字串）：OAuth 權杖端點（若未填寫則自動發現）
- **`scopes`**（字串陣列）：所需的 OAuth 權杖範圍（scopes）
- **`redirectUri`**（字串）：自訂重新導向 URI（預設為 `http://localhost:7777/oauth/callback`）
- **`tokenParamName`**（字串）：SSE URL 中權杖的查詢參數名稱
- **`audiences`**（字串陣列）：權杖有效的受眾（audiences）

#### 權杖管理

OAuth 權杖會自動：

- **安全儲存**於 `~/.gemini/mcp-oauth-tokens.json`
- **在過期時自動刷新**（若有提供 refresh token）
- **於每次連線嘗試前驗證**
- **在權杖無效或過期時自動清除**

#### 驗證提供者類型

你可以透過 `authProviderType` 屬性指定驗證提供者類型：

- **`authProviderType`**（字串）：指定驗證提供者。可為下列其中之一：
  - **`dynamic_discovery`**（預設）：命令列介面 (CLI) 會自動從伺服器發現 OAuth 設定。
  - **`google_credentials`**：命令列介面 (CLI) 會使用 Google Application Default Credentials（ADC，Google 應用程式預設憑證）來驗證伺服器。使用此提供者時，必須指定所需的權杖範圍（scopes）。

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

### 範例設定

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

#### Node.js MCP Server (Stdio)


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

#### 支援自訂標頭的 HTTP 型 MCP 伺服器

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

#### 具備工具過濾功能的 MCP 伺服器

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

## 探索流程深度解析

當 Gemini CLI 啟動時，會透過以下詳細流程進行 MCP 伺服器的探索：

### 1. 伺服器迭代與連線

針對 `mcpServers` 中設定的每一個伺服器：

1. **開始狀態追蹤：** 伺服器狀態設為 `CONNECTING`
2. **傳輸方式選擇：** 根據組態屬性選擇：
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **建立連線：** MCP 用戶端會在設定的逾時時間內嘗試連線
4. **錯誤處理：** 連線失敗時會記錄日誌，並將伺服器狀態設為 `DISCONNECTED`

### 2. 工具探索

成功連線後：

1. **工具清單：** 用戶端呼叫 MCP 伺服器的工具清單端點
2. **結構驗證：** 驗證每個工具的函式宣告
3. **工具過濾：** 根據 `includeTools` 和 `excludeTools` 組態過濾工具
4. **名稱淨化：** 工具名稱會清理以符合 Gemini API 要求：
   - 無效字元（非英數字、底線、點、連字號）會被底線取代
   - 超過 63 個字元的名稱會以中間替換（`___`）方式截斷

### 3. 衝突解決

當多個伺服器提供同名工具時：

1. **先註冊者優先：** 第一個註冊該工具名稱的伺服器可獲得未加前綴的名稱
2. **自動加前綴：** 後續伺服器會獲得加上前綴的名稱：`serverName__toolName`
3. **註冊表追蹤：** 工具註冊表會維護伺服器名稱與其工具之間的對應關係

### 4. 結構處理

工具參數結構會進行淨化，以確保與 Gemini API 相容：

- **`$schema` 屬性** 會被移除
- **`additionalProperties`** 會被去除
- **帶有 `default` 的 `anyOf`** 其預設值會被移除（Vertex AI 相容性）
- **遞迴處理** 會套用於巢狀結構

### 5. 連線管理

探索完成後：

- **持久連線：** 成功註冊工具的伺服器會維持連線
- **清理：** 未提供可用工具的伺服器會關閉連線
- **狀態更新：** 最終伺服器狀態會設為 `CONNECTED` 或 `DISCONNECTED`

## 工具執行流程

當 Gemini 模型決定使用某個 MCP 工具時，會發生以下執行流程：

### 1. 工具呼叫

模型會產生 `FunctionCall`，內容包含：

- **工具名稱：** 註冊名稱（可能包含前綴）
- **參數：** 與工具參數結構相符的 JSON 物件

### 2. 確認流程

每個 `DiscoveredMCPTool` 都會實作進階的確認邏輯：

#### 基於信任的略過

```typescript
if (this.trust) {
  return false; // No confirmation needed
}
```

#### 動態允許清單（Allow-listing）

系統會維護內部允許清單，分為：

- **伺服器層級：** `serverName` → 來自此 MCP 伺服器的所有工具皆被信任
- **工具層級：** `serverName.toolName` → 此特定工具被信任

#### 使用者選擇處理

當需要確認時，使用者可以選擇：

- **僅執行一次：** 只執行這一次
- **永遠允許此工具：** 加入工具層級允許清單
- **永遠允許此伺服器：** 加入伺服器層級允許清單
- **取消：** 中止執行

### 3. 執行

經過確認（或信任繞過）後：

1. **參數準備：** 參數會依據工具的 schema 進行驗證
2. **MCP 呼叫：** 底層的 `CallableTool` 會以以下方式呼叫伺服器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // Original server tool name
       args: params,
     },
   ];
   ```

3. **回應處理：** 結果會同時格式化，提供大型語言模型 (LLM) 的 context 與用戶顯示

### 4. 回應處理

執行結果包含：

- **`llmContent`：** 提供給大型語言模型 (LLM) context 的原始回應部分
- **`returnDisplay`：** 格式化後的輸出，供用戶顯示（通常是在 markdown 程式碼區塊中的 JSON）

## 如何與你的 MCP 伺服器互動

### 使用 `/mcp` 指令

`/mcp` 指令可提供有關你的 MCP 伺服器設定的完整資訊：

```bash
/mcp
```

這會顯示：

- **伺服器清單：** 所有已設定的 MCP 伺服器
- **連線狀態：** `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`
- **伺服器詳細資訊：** 設定摘要（不包含敏感資料）
- **可用工具：** 每個伺服器所提供的工具清單及其說明
- **探索狀態：** 整體探索程序的狀態

### 範例 `/mcp` 輸出

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

一旦被發現，MCP 工具就會像內建工具一樣提供給 Gemini 模型使用。模型會自動：

1. **根據你的請求選擇合適的工具**
2. **顯示確認對話框**（除非伺服器被信任）
3. **以正確的參數執行工具**
4. **以易於閱讀的格式顯示結果**

## 狀態監控與疑難排解

### 連線狀態

MCP 整合會追蹤多種狀態：

#### 伺服器狀態 (`MCPServerStatus`)

- **`DISCONNECTED`：** 伺服器未連線或發生錯誤
- **`CONNECTING`：** 正在嘗試連線
- **`CONNECTED`：** 伺服器已連線且可用

#### 探索狀態 (`MCPDiscoveryState`)

- **`NOT_STARTED`：** 尚未開始探索
- **`IN_PROGRESS`：** 目前正在探索伺服器
- **`COMPLETED`：** 探索已完成（不論是否有錯誤）

### 常見問題與解決方法

#### 伺服器無法連線

**症狀：** 伺服器顯示 `DISCONNECTED` 狀態

**疑難排解：**

1. **檢查設定：** 確認 `command`、`args` 和 `cwd` 是否正確
2. **手動測試：** 直接執行伺服器指令以確保其可運作
3. **檢查相依套件：** 確認所有必要的套件都已安裝
4. **檢查日誌：** 在命令列介面 (CLI) 輸出中尋找錯誤訊息
5. **檢查權限：** 確認命令列介面 (CLI) 有權執行伺服器指令

#### 未發現任何工具

**症狀：** 伺服器已連線但沒有可用工具

**疑難排解：**

1. **確認工具註冊：** 確認你的伺服器確實有註冊工具
2. **檢查 MCP 協定：** 確認你的伺服器正確實作 MCP 工具清單功能
3. **檢查伺服器日誌：** 檢查 stderr 輸出是否有伺服器端錯誤
4. **測試工具清單：** 手動測試伺服器的工具探索端點

#### 工具無法執行

**症狀：** 工具已被發現但執行時失敗

**疑難排解：**

1. **參數驗證：** 確認你的工具能接受預期的參數
2. **Schema 相容性：** 確認你的輸入 schema 為有效的 JSON Schema
3. **錯誤處理：** 檢查你的工具是否有未處理的例外
4. **逾時問題：** 考慮增加 `timeout` 設定

#### 沙箱機制相容性

**症狀：** 啟用沙箱機制時 MCP 伺服器失敗

**解決方法：**

1. **基於 Docker 的伺服器：** 使用包含所有相依套件的 Docker 容器
2. **路徑可存取性：** 確認伺服器可執行檔在沙箱內可用
3. **網路存取：** 設定沙箱允許必要的網路連線
4. **環境變數：** 確認所需的環境變數有正確傳遞

### 除錯建議

1. **啟用除錯模式：** 使用 `--debug` 旗標執行命令列介面 (CLI) 以獲得詳細輸出
2. **檢查 stderr：** MCP 伺服器的 stderr 會被擷取並記錄（INFO 訊息會被過濾）
3. **獨立測試：** 在整合前先獨立測試你的 MCP 伺服器
4. **漸進式設置：** 先從簡單工具開始，再逐步加入複雜功能
5. **經常使用 `/mcp`：** 開發過程中持續監控伺服器狀態

## 重要注意事項

### 安全性考量

- **信任設定：** `trust` 選項會略過所有確認對話框。請謹慎使用，僅用於你完全掌控的伺服器
- **存取權杖：** 設定包含 API 金鑰或權杖的環境變數時，請注意安全性
- **沙箱機制相容性：** 使用沙箱機制時，請確保 MCP 伺服器可在沙箱環境中存取
- **私人資料：** 使用權限範圍過大的個人存取權杖，可能導致不同儲存庫間的資訊洩漏

### 效能與資源管理

- **連線持續性：** 命令列介面 (CLI) 會對成功註冊工具的伺服器維持持久連線
- **自動清理：** 對未提供工具的伺服器連線會自動關閉
- **逾時管理：** 根據伺服器回應特性設定合適的逾時時間
- **資源監控：** MCP 伺服器以獨立程序運行，會佔用系統資源

### Schema 相容性

- **屬性過濾：** 系統會自動移除部分 schema 屬性（`$schema`、`additionalProperties`），以符合 Gemini API 相容性
- **名稱正規化：** 工具名稱會自動正規化以符合 API 要求
- **衝突解決：** 伺服器間的工具名稱衝突會自動加上前綴解決

這套完整的整合機制，讓 MCP 伺服器成為擴充 Gemini CLI 功能的強大方式，同時兼顧安全性、可靠性與易用性。

## 從工具回傳豐富內容

MCP 工具不限於回傳純文字。你可以在單一工具回應中回傳豐富、多元的內容，包括文字、圖片、音訊及其他二進位資料。這讓你能打造功能強大的工具，於單次互動中提供多樣資訊給模型。

所有從工具回傳的資料都會被處理，並作為 context 傳遞給模型的下一輪推論，讓模型能針對所提供的資訊進行推理或摘要。

### 運作方式

若要回傳豐富內容，你的工具回應必須遵循 MCP 規範中的 [`CallToolResult`](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result)。結果中的 `content` 欄位應為 `ContentBlock` 物件陣列。Gemini CLI 會正確處理這個陣列，將文字與二進位資料分離並包裝給模型。

你可以在 `content` 陣列中混合各種內容區塊類型。目前支援的區塊類型包括：

- `text`
- `image`
- `audio`
- `resource`（內嵌內容）
- `resource_link`

### 範例：回傳文字與圖片

以下是一個 MCP 工具回傳文字描述與圖片的有效 JSON 回應範例：

```json
{
  "content": [
    {
      "type": "text",
      "text": "Here is the logo you requested."
    },
    {
      "type": "image",
      "data": "BASE64_ENCODED_IMAGE_DATA_HERE",
      "mimeType": "image/png"
    },
    {
      "type": "text",
      "text": "The logo was created in 2025."
    }
  ]
}
```

當 Gemini CLI 收到此回應時，將會：

1.  擷取所有文字並將其合併為單一的 `functionResponse` 部分，提供給模型使用。
2.  將影像資料作為獨立的 `inlineData` 部分呈現。
3.  在命令列介面 (CLI) 中提供一個簡潔且易於理解的摘要，指出已收到文字與影像。

這使您能夠打造能夠為 Gemini 模型提供豐富多模態 context 的進階工具。

## 以斜線指令形式使用 MCP Prompts

除了工具之外，MCP 伺服器也可以公開預先定義的 prompts，讓使用者能在 Gemini CLI 內以斜線指令（slash command）方式執行。這讓您可以為常見或複雜的查詢建立捷徑，並可直接透過名稱輕鬆呼叫。

### 在伺服器上定義 Prompts

以下是一個簡單的 stdio MCP 伺服器範例，說明如何定義 prompts：

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
          text: `Write a haiku${mood ? ` with the mood ${mood}` : ''} called ${title}. Note that a haiku is 5 syllables followed by 7 syllables followed by 5 syllables `,
        },
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

這可以透過以下方式，包含在`settings.json`的`mcpServers`之下：

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

### 呼叫 Prompts

當 prompt 被發現後，你可以使用其名稱作為斜線指令來呼叫它。命令列介面 (CLI) 會自動處理參數的解析。

```bash
/poem-writer --title="Gemini CLI" --mood="reverent"
```

或者，使用位置引數：

```bash
/poem-writer "Gemini CLI" reverent
```

當你執行此指令時，Gemini CLI 會在 MCP 伺服器上以提供的參數執行 `prompts/get` 方法。伺服器負責將參數代入提示模板，並回傳最終的提示文字。CLI 隨後會將這個提示傳送給模型進行執行。這提供了一種方便的方式來自動化並分享常見的工作流程。

## 使用 `gemini mcp` 管理 MCP 伺服器

雖然你可以隨時透過手動編輯 `settings.json` 檔案來設定 MCP 伺服器，Gemini CLI 也提供了一組方便的指令，讓你能以程式化方式管理伺服器設定。這些指令簡化了新增、列出及移除 MCP 伺服器的流程，無需直接編輯 JSON 檔案。

### 新增伺服器 (`gemini mcp add`)

`add` 指令會在你的 `settings.json` 中設定一個新的 MCP 伺服器。根據作用範圍 (`-s, --scope`)，它會被加入到使用者設定 `~/.gemini/settings.json` 或專案設定 `.gemini/settings.json` 檔案中。

**指令：**

```bash
gemini mcp add [options] <name> <commandOrUrl> [args...]
```

- `<name>`：伺服器的唯一名稱。
- `<commandOrUrl>`：要執行的指令（針對 `stdio`）或 URL（針對 `http`/`sse`）。
- `[args...]`：`stdio` 指令的可選參數。

**選項（旗標 flags）：**

- `-s, --scope`：設定檔範圍（user 或 project）。[預設值："project"]
- `-t, --transport`：傳輸類型（stdio、sse、http）。[預設值："stdio"]
- `-e, --env`：設定環境變數（例如：-e KEY=value）。
- `-H, --header`：為 SSE 和 HTTP 傳輸設定 HTTP 標頭（例如：-H "X-Api-Key: abc123" -H "Authorization: Bearer abc123"）。
- `--timeout`：設定連線逾時（毫秒）。
- `--trust`：信任伺服器（略過所有工具呼叫確認提示）。
- `--description`：設定伺服器描述。
- `--include-tools`：要包含的工具，以逗號分隔的清單。
- `--exclude-tools`：要排除的工具，以逗號分隔的清單。

#### 新增 stdio 伺服器

這是執行本地伺服器的預設傳輸方式。

```bash
# Basic syntax
gemini mcp add <name> <command> [args...]

# Example: Adding a local server
gemini mcp add my-stdio-server -e API_KEY=123 /path/to/server arg1 arg2 arg3

# Example: Adding a local python server
gemini mcp add python-server python server.py --port 8080
```

#### 新增 HTTP 伺服器

此傳輸方式適用於使用可串流 HTTP 傳輸的伺服器。

```bash
# Basic syntax
gemini mcp add --transport http <name> <url>

# Example: Adding an HTTP server
gemini mcp add --transport http http-server https://api.example.com/mcp/

# Example: Adding an HTTP server with an authentication header
gemini mcp add --transport http secure-http https://api.example.com/mcp/ --header "Authorization: Bearer abc123"
```

#### 新增 SSE 伺服器

此傳輸方式適用於使用 Server-Sent Events（SSE）的伺服器。

```bash
# Basic syntax
gemini mcp add --transport sse <name> <url>

# Example: Adding an SSE server
gemini mcp add --transport sse sse-server https://api.example.com/sse/

# Example: Adding an SSE server with an authentication header
gemini mcp add --transport sse secure-sse https://api.example.com/sse/ --header "Authorization: Bearer abc123"
```

### 列出伺服器 (`gemini mcp list`)

若要檢視目前已設定的所有 MCP 伺服器，請使用 `list` 指令。此指令會顯示每個伺服器的名稱、組態細節，以及連線狀態。

**指令：**

```bash
gemini mcp list
```

**範例輸出：**

```sh
✓ stdio-server: command: python3 server.py (stdio) - Connected
✓ http-server: https://api.example.com/mcp (http) - Connected
✗ sse-server: https://api.example.com/sse (sse) - Disconnected
```

### 移除伺服器 (`gemini mcp remove`)

若要從您的設定中刪除一個伺服器，請使用 `remove` 指令並指定該伺服器的名稱。

**指令：**

```bash
gemini mcp remove <name>
```

**範例：**

```bash
gemini mcp remove my-server
```

這將根據範圍（`-s, --scope`），在相應的 `settings.json` 檔案中的 `mcpServers` 物件裡，找到並刪除 "my-server" 項目。
