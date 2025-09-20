# Gemini CLI 企業版指南

本文件說明在企業環境中部署與管理 Gemini CLI 的設定模式與最佳實踐。透過運用系統層級的設定，管理員可以強制執行安全政策、管理工具存取權限，並確保所有使用者獲得一致的體驗。

> **安全性說明：** 本文件所描述的設定模式旨在協助管理員建立一個更受控且安全的 Gemini CLI 使用環境。然而，這些措施並非萬無一失的安全邊界。若使用者在本機擁有足夠權限，仍有可能繞過這些設定。這些措施的設計目的是防止意外誤用，並在受管理的環境中強制執行公司政策，而非防禦擁有本機管理員權限的惡意行為者。

## 集中化設定：系統設定檔案

對於企業管理而言，最強大的工具就是全系統層級的設定檔案。這些檔案可讓你定義基準設定（`system-defaults.json`）以及一組覆寫設定（`settings.json`），適用於機器上的所有使用者。完整的設定選項請參考 [Configuration documentation](./configuration.md)。

設定會從四個檔案合併而來。對於單一值設定（如 `theme`），其優先順序如下：

1. 系統預設值（`system-defaults.json`）
2. 使用者設定（`~/.gemini/settings.json`）
3. workspace 設定（`<project>/.gemini/settings.json`）
4. 系統覆寫設定（`settings.json`）

這代表系統覆寫設定檔案具有最終決定權。對於陣列（`includeDirectories`）或物件（`mcpServers`）類型的設定，則會進行合併。

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

- **workspace `settings.json` (`<project>/.gemini/settings.json`)：**

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

- **系統覆寫 `settings.json`：**
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

**說明：**

- **`theme`**：來自系統覆寫（`system-enforced-theme`）的值會被使用，因為它具有最高優先權。
- **`mcpServers`**：物件會被合併。來自系統覆寫的 `corp-server` 定義會優先於使用者的定義。唯一的 `user-tool` 和 `project-tool` 也會被包含。
- **`includeDirectories`**：陣列會依照 System Defaults、User、Workspace，然後 System Overrides 的順序串接。

- **位置**：
  - **Linux**：`/etc/gemini-cli/settings.json`
  - **Windows**：`C:\ProgramData\gemini-cli\settings.json`
  - **macOS**：`/Library/Application Support/GeminiCli/settings.json`
  - 可以透過 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數來覆寫此路徑。
- **控管**：此檔案應由系統管理員管理，並設定適當的檔案權限，以防止未經授權的使用者修改。

透過使用系統設定檔，您可以強制執行下方所述的安全性與設定模式。

## 限制工具存取

您可以透過控制 Gemini 模型可使用哪些工具，大幅提升安全性。這可透過 `tools.core` 和 `tools.exclude` 設定來達成。可用工具清單請參閱 [Tools documentation](../tools/index.md)。

### 使用 `coreTools` 進行允許清單（Allowlisting）

最安全的做法是明確將允許使用者執行的工具與指令加入允許清單（allowlist）。這樣可以防止使用任何未經核准的工具。

**範例：** 只允許安全的唯讀檔案操作與列出檔案。

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

**安全性注意：** 使用 `excludeTools` 進行封鎖名單（blocklisting）比起使用 `coreTools` 進行允許名單（allowlisting）來得不安全，因為封鎖名單僅依賴於阻擋已知的惡意指令，而有經驗的使用者可能會找到繞過單純字串封鎖的方法。**建議優先採用允許名單（allowlisting）做法。**

## 管理自訂工具（MCP 伺服器）

如果您的組織透過 [Model-Context Protocol (MCP) 伺服器](../core/tools-api.md) 使用自訂工具，了解伺服器設定的管理方式對於有效套用安全性政策至關重要。

### MCP 伺服器設定的合併方式

Gemini CLI 會從三個層級載入 `settings.json` 檔案：系統、workspace 和使用者。針對 `mcpServers` 物件，這些設定會進行**合併**：

1.  **合併：** 來自三個層級的伺服器清單會合併為單一清單。
2.  **優先順序：** 如果同名的伺服器（例如名為 `corp-api` 的伺服器）在多個層級（如系統和使用者設定）中都有定義，則會採用優先順序最高層級的定義。優先順序為：**系統 > workspace > 使用者**。

這代表使用者**無法**覆寫已在系統層級設定中定義的伺服器，但他們**可以**新增名稱唯一的伺服器。

### 強制執行工具目錄（Catalog）

您的 MCP 工具生態系統安全性，取決於同時定義標準伺服器並將其名稱加入允許名單（allowlist）。

### 限制 MCP 伺服器內的工具

為了進一步提升安全性，特別是在使用第三方 MCP 伺服器時，您可以限制模型可存取伺服器中的特定工具。這可透過在伺服器定義中使用 `includeTools` 與 `excludeTools` 屬性來達成。如此一來，您可以僅允許伺服器中的部分工具被使用，而不必開放所有（可能具風險的）工具。

遵循最小權限原則，強烈建議使用 `includeTools` 建立僅包含必要工具的允許名單（allowlist）。

**範例：** 即使某第三方 MCP 伺服器還提供 `delete-ticket` 等其他工具，也僅允許 `code-search` 與 `get-ticket-details` 這兩個工具被存取。

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

#### 更安全的模式：於系統設定中定義並加入允許清單

為了建立一個安全且集中管理的工具目錄，系統管理員**必須**在系統層級的 `settings.json` 檔案中同時執行以下兩項操作：

1. 於 `mcpServers` 物件中**定義每一個核准伺服器的完整設定**。這可確保即使使用者定義了相同名稱的伺服器，系統層級的安全定義仍會優先採用。
2. 使用 `mcp.allowed` 設定，**將這些伺服器的名稱加入允許清單**。這是關鍵的安全步驟，可防止使用者執行未在清單上的任何伺服器。如果省略此設定，命令列介面 (Command Line Interface) 將會合併並允許任何由使用者定義的伺服器。

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

這種模式更為安全，因為它同時使用了定義和允許清單（allowlist）。使用者所定義的任何伺服器，要嘛會被系統定義（如果名稱相同）所覆蓋，要嘛因其名稱不在 `mcp.allowed` 清單中而被阻擋。

### 較不安全的模式：省略允許清單

如果管理員定義了 `mcpServers` 物件，但未同時指定 `mcp.allowed` 允許清單，則使用者可能會新增自己的伺服器。

**範例系統 `settings.json`：**

此設定雖然定義了伺服器，但未強制執行允許清單。
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

在此情境下，使用者可以在本地的 `settings.json` 新增自己的伺服器。由於沒有 `mcp.allowed` 清單來過濾合併後的結果，使用者的伺服器將會被加入可用工具的清單，並允許執行。

## 強制啟用沙箱機制以提升安全性

為了降低潛在有害操作的風險，您可以強制所有工具執行時都使用沙箱機制（sandboxing）。沙箱會將工具執行隔離在容器化的環境中。

**範例：** 強制所有工具執行都在 Docker 沙箱中進行。

```json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

你也可以使用 `--sandbox-image` 命令列參數，或依照 [Sandboxing documentation](./configuration.md#sandboxing) 中的說明建立自訂的 `sandbox.Dockerfile`，來指定自訂且強化的 Docker sandbox 容器映像檔。

## 透過 Proxy 控制網路存取

在網路政策嚴格的企業環境中，你可以設定 Gemini CLI，將所有對外流量經由企業 proxy 轉送。這可以透過環境變數設定，也可以針對自訂工具，透過 `mcpServers` 設定來強制執行。

**範例（針對 MCP 伺服器）：**

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

**範例：** 啟用遙測 (telemetry) 並將其傳送至本地 OTLP collector。如果未指定 `otlpEndpoint`，則預設為 `http://localhost:4317`。

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "logPrompts": false
  }
}
```

**注意：**請確保在企業環境中將 `logPrompts` 設定為 `false`，以避免從使用者提示中收集到可能具有敏感性的資訊。

## 驗證（Authentication）

你可以透過在系統層級的 `settings.json` 檔案中設定 `enforcedAuthType`，強制所有使用者採用特定的驗證方式。這將防止使用者選擇其他驗證方法。詳細資訊請參閱 [Authentication docs](./authentication.md)。

**範例：**強制所有使用者使用 Google 登入。

```json
{
  "enforcedAuthType": "oauth-personal"
}
```

如果使用者已設定不同的驗證方式，系統會提示他們切換至強制要求的驗證方式。在非互動模式下，若已設定的驗證方式與強制要求的不符，Gemini CLI 將會顯示錯誤並結束執行。

## 綜合應用：系統範例 `settings.json`

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

此設定：

- 強制所有工具執行於 Docker 沙箱機制中。
- 嚴格使用允許清單（allowlist），僅允許一小部分安全的 shell 指令與檔案工具。
- 定義並僅允許單一企業用的 MCP 伺服器以支援自訂工具。
- 啟用遙測 (telemetry) 以進行稽核，但不會記錄提示內容。
- 將 `/bug` 指令重新導向至內部工單系統。
- 停用一般使用統計資料的收集。
