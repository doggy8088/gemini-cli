# 企業版 Gemini CLI

本文檔說明在企業環境中部署與管理 Gemini CLI 的設定模式與最佳實踐。透過運用系統層級的設定，管理員可以強制執行安全政策、管理工具存取權限，並確保所有使用者皆有一致的操作體驗。

> **安全性說明：** 本文件所描述的模式旨在協助管理員建立更受控且安全的 Gemini CLI 使用環境。然而，這些措施不應被視為萬無一失的安全邊界。具備足夠本機權限的進階使用者，仍有可能繞過這些設定。這些作法主要是為了防止意外誤用，並在受管理的環境下強制執行公司政策，而非防禦擁有本機管理權限的惡意行為者。

## 集中式設定：系統設定檔

對於企業管理而言，最強大的工具就是系統層級的設定檔。這些檔案可讓您定義基準設定（`system-defaults.json`）以及一組套用於該機器所有使用者的覆寫設定（`settings.json`）。如需完整的設定選項說明，請參閱 [Configuration documentation](./configuration.md)。

設定會從四個檔案合併而來。針對單一值設定（如 `theme`），其優先順序如下：

1. 系統預設值（`system-defaults.json`）
2. 使用者設定（`~/.gemini/settings.json`）
3. workspace 設定（`<project>/.gemini/settings.json`）
4. 系統覆寫（`settings.json`）

這代表系統覆寫檔案具有最終決定權。對於陣列（`includeDirectories`）或物件（`mcpServers`）類型的設定，則會進行合併。

**合併與優先順序範例：**

以下說明不同層級的設定如何被合併。

- **系統預設值 `system-defaults.json`：**

  ```json
  {
    "ui": {
      "theme": "default-corporate-theme"
    },
    "context": {
      "includeDirectories": ["/etc/gemini-cli/common-context"]
    }
  }
  ```

- **User `settings.json` (`~/.gemini/settings.json`):**


- **使用者 `settings.json` (`~/.gemini/settings.json`)：**

  ```json
  {
    "ui": {
      "theme": "user-preferred-dark-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-dev"
      },
      "user-tool": {
        "command": "npm start --prefix ~/tools/my-tool"
      }
    },
    "context": {
      "includeDirectories": ["~/gemini-context"]
    }
  }
  ```

- **Workspace `settings.json` (`<project>/.gemini/settings.json`)：**

  ```json
  {
    "ui": {
      "theme": "project-specific-light-theme"
    },
    "mcpServers": {
      "project-tool": {
        "command": "npm start"
      }
    },
    "context": {
      "includeDirectories": ["./project-context"]
    }
  }
  ```

- **系統覆寫 `settings.json`:**
  ```json
  {
    "ui": {
      "theme": "system-enforced-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-prod"
      }
    },
    "context": {
      "includeDirectories": ["/etc/gemini-cli/global-context"]
    }
  }
  ```

這會產生以下合併後的組態：

- **最終合併組態：**
  ```json
  {
    "ui": {
      "theme": "system-enforced-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-prod"
      },
      "user-tool": {
        "command": "npm start --prefix ~/tools/my-tool"
      },
      "project-tool": {
        "command": "npm start"
      }
    },
    "context": {
      "includeDirectories": [
        "/etc/gemini-cli/common-context",
        "~/gemini-context",
        "./project-context",
        "/etc/gemini-cli/global-context"
      ]
    }
  }
  ```

**原因說明：**

- **`theme`**：系統覆寫（`system-enforced-theme`）的值會被採用，因為它具有最高優先權。
- **`mcpServers`**：物件會被合併。來自系統覆寫的 `corp-server` 定義會優先於使用者的定義。獨特的 `user-tool` 和 `project-tool` 也會被包含進來。
- **`includeDirectories`**：陣列會依照系統預設、使用者、workspace，最後是系統覆寫的順序串接。

- **位置**：
  - **Linux**：`/etc/gemini-cli/settings.json`
  - **Windows**：`C:\ProgramData\gemini-cli\settings.json`
  - **macOS**：`/Library/Application Support/GeminiCli/settings.json`
  - 可以透過 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數來覆寫此路徑。
- **控管**：此檔案應由系統管理員負責管理，並設置適當的檔案權限，以防止使用者未經授權的修改。

透過使用系統設定檔，您可以強制執行下方所描述的安全性與組態模式。

## 限制工具存取

您可以透過控管 Gemini 模型可使用哪些工具，大幅提升安全性。這可透過 `tools.core` 和 `tools.exclude` 設定來達成。可用工具清單請參閱 [工具文件](../tools/index.md)。

### 使用 `coreTools` 進行允許清單設定

最安全的做法是明確將允許使用者執行的工具和指令加入允許清單（allowlist）。這將防止使用任何未經核准的工具。

**範例：** 只允許安全的唯讀檔案操作與檔案列表查詢。

```json
{
  "tools": {
    "core": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]
  }
}
```

### 使用 `excludeTools` 進行封鎖清單管理

另外，您也可以將在您的環境中被認為具有風險的特定工具加入封鎖清單（blocklist）。

**範例：** 防止使用 shell 工具來刪除檔案。

```json
{
  "tools": {
    "exclude": ["ShellTool(rm -rf)"]
  }
}
```

**安全性注意事項：** 使用 `excludeTools` 進行阻擋名單（blocklisting）比起使用 `coreTools` 進行允許名單（allowlisting）來得不安全，因為它僅依賴於阻擋已知的惡意指令，而有經驗的使用者可能會找到繞過單純字串比對的方式。**建議優先採用允許名單（allowlisting）的方法。**

## 管理自訂工具（MCP 伺服器）

如果您的組織透過 [Model-Context Protocol (MCP) 伺服器](../core/tools-api.md) 使用自訂工具，了解伺服器設定的管理方式對於有效套用安全政策至關重要。

### MCP 伺服器設定的合併方式

Gemini CLI 會從三個層級載入 `settings.json` 檔案：系統（System）、workspace，以及使用者（User）。針對 `mcpServers` 物件，這些設定會被**合併**：

1.  **合併：** 來自三個層級的伺服器列表會合併成單一列表。
2.  **優先順序：** 如果同一個伺服器名稱在多個層級中都有定義（例如，名為 `corp-api` 的伺服器同時存在於系統和使用者設定中），則會採用優先順序最高層級的定義。優先順序為：**系統 > workspace > 使用者**。

這表示使用者**無法**覆寫已在系統層級設定中定義的伺服器。不過，他們**可以**新增具有唯一名稱的新伺服器。

### 強制執行工具目錄（Catalog）

您的 MCP 工具生態系統的安全性，取決於定義標準伺服器並將其名稱加入允許名單的組合。

### 限制 MCP 伺服器內的工具

為了進一步提升安全性，特別是在處理第三方 MCP 伺服器時，您可以限制模型可存取該伺服器中的特定工具。這可以透過在伺服器定義中使用 `includeTools` 和 `excludeTools` 屬性來實現。如此一來，您可以只允許伺服器中的部分工具，而不必開放所有潛在高風險的工具。

遵循最小權限原則，強烈建議您使用 `includeTools`，僅將必要的工具加入允許名單。

**範例：** 即使某第三方 MCP 伺服器還提供 `delete-ticket` 等其他工具，也只允許 `code-search` 和 `get-ticket-details` 這兩個工具。

```json
{
  "mcp": {
    "allowed": ["third-party-analyzer"]
  },
  "mcpServers": {
    "third-party-analyzer": {
      "command": "/usr/local/bin/start-3p-analyzer.sh",
      "includeTools": ["code-search", "get-ticket-details"]
    }
  }
}
```

#### 更安全的模式：在系統設定中定義並加入允許清單

為了建立一個安全且集中管理的工具目錄，系統管理員**必須**在系統層級的 `settings.json` 檔案中同時完成以下兩項操作：

1.  在 `mcpServers` 物件中，**為每一個核准的伺服器定義完整的設定**。這可確保即使使用者定義了同名伺服器，安全的系統層級定義仍會優先採用。
2.  使用 `mcp.allowed` 設定，**將這些伺服器的名稱加入允許清單**。這是關鍵的安全步驟，可防止使用者執行未在清單上的任何伺服器。如果省略此設定，命令列介面 (CLI) 將會合併並允許任何由使用者定義的伺服器。

**系統 `settings.json` 範例：**

1. 將所有核准伺服器的_名稱_加入允許清單。
   這將防止使用者自行新增伺服器。

2. 為允許清單上的每個伺服器提供標準_定義_。

```json
{
  "mcp": {
    "allowed": ["corp-data-api", "source-code-analyzer"]
  },
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh",
      "timeout": 5000
    },
    "source-code-analyzer": {
      "command": "/usr/local/bin/start-analyzer.sh"
    }
  }
}
```

這種模式更為安全，因為它同時使用了定義與允許清單（allowlist）。使用者所定義的任何伺服器，如果名稱與系統定義相同，將會被系統定義覆蓋；如果名稱不在`mcp.allowed`清單中，則會被阻擋。

### 較不安全的模式：省略允許清單

如果管理員定義了`mcpServers`物件，但沒有同時指定`mcp.allowed`允許清單，則使用者可能會自行新增伺服器。

**範例系統`settings.json`：**

此設定雖然定義了伺服器，但並未強制執行允許清單。
管理員並未包含 "mcp.allowed" 設定。

```json
{
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh"
    }
  }
}
```

在此情境下，使用者可以在其本機的 `settings.json` 中新增自己的伺服器。由於沒有 `mcp.allowed` 清單來過濾合併後的結果，使用者的伺服器將會被加入可用工具清單並允許執行。

## 強制啟用沙箱機制以提升安全性

為了降低潛在有害操作的風險，您可以強制所有工具執行時都採用沙箱機制（sandboxing）。沙箱會將工具執行隔離在 sandbox 容器化環境中。

**範例：** 強制所有工具執行都在 Docker 沙箱中進行。

```json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

你也可以透過 `--sandbox-image` 命令列參數，或依照 [沙箱機制文件](./configuration.md#sandboxing) 中的說明自行建置自訂的 `sandbox.Dockerfile`，來為 sandbox 容器指定自訂且強化安全的 Docker 映像檔。

## 透過 Proxy 控制網路存取

在網路政策嚴格的企業環境中，你可以設定 Gemini CLI 將所有對外流量導向企業 proxy。這可以透過環境變數設定，也可以針對自訂工具，透過 `mcpServers` 設定來強制執行。

**範例（針對 MCP 伺服器）:**

```json
{
  "mcpServers": {
    "proxied-server": {
      "command": "node",
      "args": ["mcp_server.js"],
      "env": {
        "HTTP_PROXY": "http://proxy.example.com:8080",
        "HTTPS_PROXY": "http://proxy.example.com:8080"
      }
    }
  }
}
```

## 遙測 (telemetry) 與稽核

為了稽核與監控用途，您可以設定 Gemini CLI 將遙測 (telemetry) 資料傳送到集中位置。這可讓您追蹤工具的使用情況及其他事件。欲了解更多資訊，請參閱 [telemetry documentation](../telemetry.md)。

**範例：** 啟用遙測 (telemetry) 並將資料傳送至本地 OTLP collector。如果未指定 `otlpEndpoint`，則預設為 `http://localhost:4317`。

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "logPrompts": false
  }
}
```

**注意：**請確保在企業環境中將 `logPrompts` 設定為 `false`，以避免從使用者提示中收集到可能具敏感性的資訊。

## 認證（Authentication）

你可以在系統層級的 `settings.json` 檔案中設定 `enforcedAuthType`，以強制所有使用者採用特定的認證方式。這將防止使用者選擇其他認證方法。詳細資訊請參閱 [Authentication docs](./authentication.md)。

**範例：**強制所有使用者使用 Google 登入。

```json
{
  "enforcedAuthType": "oauth-personal"
}
```

如果使用者設定了不同的驗證方式，系統會提示使用者切換至被強制要求的驗證方式。在非互動模式下，若已設定的驗證方式與強制要求的不符，命令列介面 (CLI) 將會以錯誤訊息結束。

## 綜合應用：範例系統 `settings.json`

以下是一個系統 `settings.json` 檔案的範例，結合了上述討論的多種模式，為 Gemini CLI 建立一個安全且受控的環境。

```json
{
  "tools": {
    "sandbox": "docker",
    "core": [
      "ReadFileTool",
      "GlobTool",
      "ShellTool(ls)",
      "ShellTool(cat)",
      "ShellTool(grep)"
    ]
  },
  "mcp": {
    "allowed": ["corp-tools"]
  },
  "mcpServers": {
    "corp-tools": {
      "command": "/opt/gemini-tools/start.sh",
      "timeout": 5000
    }
  },
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "otlpEndpoint": "https://telemetry-prod.example.com:4317",
    "logPrompts": false
  },
  "advanced": {
    "bugCommand": {
      "urlTemplate": "https://servicedesk.example.com/new-ticket?title={title}&details={info}"
    }
  },
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```

此組態設定：

- 強制所有工具執行都在 Docker 沙箱機制中進行。
- 嚴格使用允許清單（allowlist），僅允許一小部分安全的 shell 指令與檔案工具。
- 定義並僅允許單一企業 MCP 伺服器（MCP server）用於自訂工具。
- 啟用遙測 (telemetry) 以供稽核，但不會記錄提示內容。
- 將 `/bug` 指令重新導向至內部工單系統。
- 停用一般使用統計資料的收集。
