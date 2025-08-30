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

#### Managing OAuth Authentication

Use the `/mcp auth` command to manage OAuth authentication:

```bash
# List servers requiring authentication
/mcp auth

# Authenticate with a specific server
/mcp auth serverName

# Re-authenticate if tokens expire
/mcp auth serverName
```

#### OAuth Configuration Properties

- **`enabled`** (boolean): Enable OAuth for this server
- **`clientId`** (string): OAuth client identifier (optional with dynamic registration)
- **`clientSecret`** (string): OAuth client secret (optional for public clients)
- **`authorizationUrl`** (string): OAuth authorization endpoint (auto-discovered if omitted)
- **`tokenUrl`** (string): OAuth token endpoint (auto-discovered if omitted)
- **`scopes`** (string[]): Required OAuth scopes
- **`redirectUri`** (string): Custom redirect URI (defaults to `http://localhost:7777/oauth/callback`)
- **`tokenParamName`** (string): Query parameter name for tokens in SSE URLs
- **`audiences`** (string[]): Audiences the token is valid for

#### Token Management

OAuth tokens are automatically:

- **Stored securely** in `~/.gemini/mcp-oauth-tokens.json`
- **Refreshed** when expired (if refresh tokens are available)
- **Validated** before each connection attempt
- **Cleaned up** when invalid or expired

#### Authentication Provider Type

You can specify the authentication provider type using the `authProviderType` property:

- **`authProviderType`** (string): Specifies the authentication provider. Can be one of the following:
  - **`dynamic_discovery`** (default): The CLI will automatically discover the OAuth configuration from the server.
  - **`google_credentials`**: The CLI will use the Google Application Default Credentials (ADC) to authenticate with the server. When using this provider, you must specify the required scopes.

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

### Example Configurations

#### Python MCP Server (Stdio)

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

#### Docker-based MCP Server

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

#### HTTP-based MCP Server

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

#### HTTP-based MCP Server with Custom Headers

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

#### MCP Server with Tool Filtering

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

## Discovery Process Deep Dive

When the Gemini CLI starts, it performs MCP server discovery through the following detailed process:

### 1. Server Iteration and Connection

For each configured server in `mcpServers`:

1. **Status tracking begins:** Server status is set to `CONNECTING`
2. **Transport selection:** Based on configuration properties:
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **Connection establishment:** The MCP client attempts to connect with the configured timeout
4. **Error handling:** Connection failures are logged and the server status is set to `DISCONNECTED`

### 2. Tool Discovery

Upon successful connection:

1. **Tool listing:** The client calls the MCP server's tool listing endpoint
2. **Schema validation:** Each tool's function declaration is validated
3. **Tool filtering:** Tools are filtered based on `includeTools` and `excludeTools` configuration
4. **Name sanitization:** Tool names are cleaned to meet Gemini API requirements:
   - Invalid characters (non-alphanumeric, underscore, dot, hyphen) are replaced with underscores
   - Names longer than 63 characters are truncated with middle replacement (`___`)

### 3. Conflict Resolution

When multiple servers expose tools with the same name:

1. **First registration wins:** The first server to register a tool name gets the unprefixed name
2. **Automatic prefixing:** Subsequent servers get prefixed names: `serverName__toolName`
3. **Registry tracking:** The tool registry maintains mappings between server names and their tools

### 4. Schema Processing

Tool parameter schemas undergo sanitization for Gemini API compatibility:

- **`$schema` properties** are removed
- **`additionalProperties`** are stripped
- **`anyOf` with `default`** have their default values removed (Vertex AI compatibility)
- **Recursive processing** applies to nested schemas

### 5. Connection Management

After discovery:

- **Persistent connections:** Servers that successfully register tools maintain their connections
- **Cleanup:** Servers that provide no usable tools have their connections closed
- **Status updates:** Final server statuses are set to `CONNECTED` or `DISCONNECTED`

## Tool Execution Flow

When the Gemini model decides to use an MCP tool, the following execution flow occurs:

### 1. Tool Invocation

The model generates a `FunctionCall` with:

- **Tool name:** The registered name (potentially prefixed)
- **Arguments:** JSON object matching the tool's parameter schema

### 2. Confirmation Process

Each `DiscoveredMCPTool` implements sophisticated confirmation logic:

#### Trust-based Bypass

```typescript
if (this.trust) {
  return false; // No confirmation needed
}
```

#### Dynamic Allow-listing

The system maintains internal allow-lists for:

- **Server-level:** `serverName` → All tools from this server are trusted
- **Tool-level:** `serverName.toolName` → This specific tool is trusted

#### User Choice Handling

When confirmation is required, users can choose:

- **Proceed once:** Execute this time only
- **Always allow this tool:** Add to tool-level allow-list
- **Always allow this server:** Add to server-level allow-list
- **Cancel:** Abort execution

### 3. Execution

Upon confirmation (or trust bypass):

1. **Parameter preparation:** Arguments are validated against the tool's schema
2. **MCP call:** The underlying `CallableTool` invokes the server with:

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // Original server tool name
       args: params,
     },
   ];
   ```

3. **Response processing:** Results are formatted for both LLM context and user display

### 4. Response Handling

The execution result contains:

- **`llmContent`:** Raw response parts for the language model's context
- **`returnDisplay`:** Formatted output for user display (often JSON in markdown code blocks)

## How to interact with your MCP server

### Using the `/mcp` Command

The `/mcp` command provides comprehensive information about your MCP server setup:

```bash
/mcp
```

This displays:

- **Server list:** All configured MCP servers
- **Connection status:** `CONNECTED`, `CONNECTING`, or `DISCONNECTED`
- **Server details:** Configuration summary (excluding sensitive data)
- **Available tools:** List of tools from each server with descriptions
- **Discovery state:** Overall discovery process status

### Example `/mcp` Output

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

### Tool Usage

Once discovered, MCP tools are available to the Gemini model like built-in tools. The model will automatically:

1. **Select appropriate tools** based on your requests
2. **Present confirmation dialogs** (unless the server is trusted)
3. **Execute tools** with proper parameters
4. **Display results** in a user-friendly format

## Status Monitoring and Troubleshooting

### Connection States

The MCP integration tracks several states:

#### Server Status (`MCPServerStatus`)

- **`DISCONNECTED`:** Server is not connected or has errors
- **`CONNECTING`:** Connection attempt in progress
- **`CONNECTED`:** Server is connected and ready

#### Discovery State (`MCPDiscoveryState`)

- **`NOT_STARTED`:** Discovery hasn't begun
- **`IN_PROGRESS`:** Currently discovering servers
- **`COMPLETED`:** Discovery finished (with or without errors)

### Common Issues and Solutions

#### Server Won't Connect

**Symptoms:** Server shows `DISCONNECTED` status

**Troubleshooting:**

1. **Check configuration:** Verify `command`, `args`, and `cwd` are correct
2. **Test manually:** Run the server command directly to ensure it works
3. **Check dependencies:** Ensure all required packages are installed
4. **Review logs:** Look for error messages in the CLI output
5. **Verify permissions:** Ensure the CLI can execute the server command

#### No Tools Discovered

**Symptoms:** Server connects but no tools are available

**Troubleshooting:**

1. **Verify tool registration:** Ensure your server actually registers tools
2. **Check MCP protocol:** Confirm your server implements the MCP tool listing correctly
3. **Review server logs:** Check stderr output for server-side errors
4. **Test tool listing:** Manually test your server's tool discovery endpoint

#### Tools Not Executing

**Symptoms:** Tools are discovered but fail during execution

**Troubleshooting:**

1. **Parameter validation:** Ensure your tool accepts the expected parameters
2. **Schema compatibility:** Verify your input schemas are valid JSON Schema
3. **Error handling:** Check if your tool is throwing unhandled exceptions
4. **Timeout issues:** Consider increasing the `timeout` setting

#### Sandbox Compatibility

**Symptoms:** MCP servers fail when sandboxing is enabled

**Solutions:**

1. **Docker-based servers:** Use Docker containers that include all dependencies
2. **Path accessibility:** Ensure server executables are available in the sandbox
3. **Network access:** Configure sandbox to allow necessary network connections
4. **Environment variables:** Verify required environment variables are passed through

### Debugging Tips

1. **Enable debug mode:** Run the CLI with `--debug` for verbose output
2. **Check stderr:** MCP server stderr is captured and logged (INFO messages filtered)
3. **Test isolation:** Test your MCP server independently before integrating
4. **Incremental setup:** Start with simple tools before adding complex functionality
5. **Use `/mcp` frequently:** Monitor server status during development

## Important Notes

### Security Considerations

- **Trust settings:** The `trust` option bypasses all confirmation dialogs. Use cautiously and only for servers you completely control
- **Access tokens:** Be security-aware when configuring environment variables containing API keys or tokens
- **Sandbox compatibility:** When using sandboxing, ensure MCP servers are available within the sandbox environment
- **Private data:** Using broadly scoped personal access tokens can lead to information leakage between repositories

### Performance and Resource Management

- **Connection persistence:** The CLI maintains persistent connections to servers that successfully register tools
- **Automatic cleanup:** Connections to servers providing no tools are automatically closed
- **Timeout management:** Configure appropriate timeouts based on your server's response characteristics
- **Resource monitoring:** MCP servers run as separate processes and consume system resources

### Schema Compatibility

- **Property stripping:** The system automatically removes certain schema properties (`$schema`, `additionalProperties`) for Gemini API compatibility
- **Name sanitization:** Tool names are automatically sanitized to meet API requirements
- **Conflict resolution:** Tool name conflicts between servers are resolved through automatic prefixing

This comprehensive integration makes MCP servers a powerful way to extend the Gemini CLI's capabilities while maintaining security, reliability, and ease of use.

## Returning Rich Content from Tools

MCP tools are not limited to returning simple text. You can return rich, multi-part content, including text, images, audio, and other binary data in a single tool response. This allows you to build powerful tools that can provide diverse information to the model in a single turn.

All data returned from the tool is processed and sent to the model as context for its next generation, enabling it to reason about or summarize the provided information.

### How It Works

To return rich content, your tool's response must adhere to the MCP specification for a [`CallToolResult`](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result). The `content` field of the result should be an array of `ContentBlock` objects. The Gemini CLI will correctly process this array, separating text from binary data and packaging it for the model.

You can mix and match different content block types in the `content` array. The supported block types include:

- `text`
- `image`
- `audio`
- `resource` (embedded content)
- `resource_link`

### Example: Returning Text and an Image

Here is an example of a valid JSON response from an MCP tool that returns both a text description and an image:

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

When the Gemini CLI receives this response, it will:

1.  Extract all the text and combine it into a single `functionResponse` part for the model.
2.  Present the image data as a separate `inlineData` part.
3.  Provide a clean, user-friendly summary in the CLI, indicating that both text and an image were received.

This enables you to build sophisticated tools that can provide rich, multi-modal context to the Gemini model.

## MCP Prompts as Slash Commands

In addition to tools, MCP servers can expose predefined prompts that can be executed as slash commands within the Gemini CLI. This allows you to create shortcuts for common or complex queries that can be easily invoked by name.

### Defining Prompts on the Server

Here's a small example of a stdio MCP server that defines prompts:

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

This can be included in `settings.json` under `mcpServers` with:

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

### Invoking Prompts

Once a prompt is discovered, you can invoke it using its name as a slash command. The CLI will automatically handle parsing arguments.

```bash
/poem-writer --title="Gemini CLI" --mood="reverent"
```

or, using positional arguments:

```bash
/poem-writer "Gemini CLI" reverent
```

When you run this command, the Gemini CLI executes the `prompts/get` method on the MCP server with the provided arguments. The server is responsible for substituting the arguments into the prompt template and returning the final prompt text. The CLI then sends this prompt to the model for execution. This provides a convenient way to automate and share common workflows.

## Managing MCP Servers with `gemini mcp`

While you can always configure MCP servers by manually editing your `settings.json` file, the Gemini CLI provides a convenient set of commands to manage your server configurations programmatically. These commands streamline the process of adding, listing, and removing MCP servers without needing to directly edit JSON files.

### Adding a Server (`gemini mcp add`)

The `add` command configures a new MCP server in your `settings.json`. Based on the scope (`-s, --scope`), it will be added to either the user config `~/.gemini/settings.json` or the project config `.gemini/settings.json` file.

**Command:**

```bash
gemini mcp add [options] <name> <commandOrUrl> [args...]
```

- `<name>`: A unique name for the server.
- `<commandOrUrl>`: The command to execute (for `stdio`) or the URL (for `http`/`sse`).
- `[args...]`: Optional arguments for a `stdio` command.

**Options (Flags):**

- `-s, --scope`: Configuration scope (user or project). [default: "project"]
- `-t, --transport`: Transport type (stdio, sse, http). [default: "stdio"]
- `-e, --env`: Set environment variables (e.g. -e KEY=value).
- `-H, --header`: Set HTTP headers for SSE and HTTP transports (e.g. -H "X-Api-Key: abc123" -H "Authorization: Bearer abc123").
- `--timeout`: Set connection timeout in milliseconds.
- `--trust`: Trust the server (bypass all tool call confirmation prompts).
- `--description`: Set the description for the server.
- `--include-tools`: A comma-separated list of tools to include.
- `--exclude-tools`: A comma-separated list of tools to exclude.

#### Adding an stdio server

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
