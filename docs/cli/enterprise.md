# 企業版

本文件概述在企業環境中部署和管理 Gemini CLI 的設定模式和最佳實務。透過利用系統層級設定，管理員可以強制執行安全政策、管理工具存取權限，並確保所有使用者擁有一致的體驗。

> **安全性說明：** 本文件中描述的模式旨在幫助管理員為使用 Gemini CLI 建立更受控制和安全的環境。然而，它們不應被視為萬無一失的安全邊界。在本機電腦上擁有足夠權限的有心使用者仍可能能夠規避這些設定。這些措施旨在防止意外誤用並在受管理的環境中強制執行企業政策，而不是防禦具有本機管理權限的惡意行為者。

## 集中化設定：系統設定檔案

企業管理最強大的工具是系統範圍的設定檔案。這些檔案允許您定義基準設定（`system-defaults.json`）和套用到電腦上所有使用者的覆寫設定（`settings.json`）。如需設定選項的完整總覽，請參閱[設定說明文件](./configuration.md)。

設定會從四個檔案合併。單值設定（如 `theme`）的優先順序為：

1. 系統預設值（`system-defaults.json`）
2. 使用者設定（`~/.gemini/settings.json`）
3. 工作區設定（`<project>/.gemini/settings.json`）
4. 系統覆寫（`settings.json`）

這表示系統覆寫檔案具有最終決定權。對於陣列（`includeDirectories`）或物件（`mcpServers`）的設定，值會被合併。

**合併和優先順序範例：**

以下是不同層級設定的組合方式。

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

- **使用者 `settings.json`（`~/.gemini/settings.json`）：**

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

- **工作區 `settings.json`（`<project>/.gemini/settings.json`）：**

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

這會產生以下合併設定：

- **最終合併設定：**
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

**原因：**

- **`theme`**：使用系統覆寫的值（`system-enforced-theme`），因為它具有最高優先順序。
- **`mcpServers`**：物件被合併。系統覆寫的 `corp-server` 定義優先於使用者的定義。唯一的 `user-tool` 和 `project-tool` 包含在內。
- **`includeDirectories`**：陣列按系統預設值、使用者、工作區，然後系統覆寫的順序串聯。

- **位置**：
  - **Linux**：`/etc/gemini-cli/settings.json`
  - **Windows**：`C:\ProgramData\gemini-cli\settings.json`
  - **macOS**：`/Library/Application Support/GeminiCli/settings.json`
  - 可以使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 環境變數覆寫路徑。
- **控制**：此檔案應由系統管理員管理，並以適當的檔案權限保護，以防止使用者未經授權的修改。

透過使用系統設定檔案，您可以強制執行下面描述的安全性和設定模式。

## 限制工具存取

您可以透過控制 Gemini 模型可以使用的工具來大幅增強安全性。這透過 `tools.core` 和 `tools.exclude` 設定來實現。如需可用工具清單，請參閱[工具說明文件](../tools/index.md)。

### 使用 `coreTools` 的允許清單

最安全的方法是明確將使用者允許執行的工具和指令新增到允許清單中。這可以防止使用任何不在核准清單上的工具。

**範例：** 僅允許安全的唯讀檔案操作和列出檔案。

```json
{
  "tools": {
    "core": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]
  }
}
```

### 使用 `excludeTools` 的封鎖清單

或者，您可以將在您環境中被視為危險的特定工具新增到封鎖清單中。

**範例：** 防止使用 shell 工具來移除檔案。

```json
{
  "tools": {
    "exclude": ["ShellTool(rm -rf)"]
  }
}
```

**安全性說明：** 使用 `excludeTools` 的封鎖清單比使用 `coreTools` 的允許清單安全性較低，因為它依賴於封鎖已知的不良指令，而聰明的使用者可能會找到方法繞過簡單的字串型封鎖。**建議使用允許清單方法。**

## 管理自訂工具（MCP 伺服器）

如果您的組織透過[模型上下文通訊協定（MCP）伺服器](../core/tools-api.md)使用自訂工具，了解如何管理伺服器設定以有效套用安全政策至關重要。

### MCP 伺服器設定的合併方式

Gemini CLI 從三個層級載入 `settings.json` 檔案：系統、工作區和使用者。對於 `mcpServers` 物件，這些設定會被**合併**：

1.  **合併：** 所有三個層級的伺服器清單會合併成單一清單。
2.  **優先順序：** 如果在多個層級定義了**相同名稱**的伺服器（例如，系統和使用者設定中都存在名為 `corp-api` 的伺服器），則使用最高優先順序層級的定義。優先順序為：**系統 > 工作區 > 使用者**。

這表示使用者**無法**覆寫已在系統層級設定中定義的伺服器定義。然而，他們**可以**新增具有唯一名稱的新伺服器。

### 強制執行工具目錄

您 MCP 工具生態系統的安全性取決於定義規範伺服器和將其名稱新增到允許清單的組合。

### 限制 MCP 伺服器內的工具

為了獲得更大的安全性，特別是在處理第三方 MCP 伺服器時，您可以限制從伺服器公開給模型的特定工具。這是透過伺服器定義中的 `includeTools` 和 `excludeTools` 屬性來完成的。這允許您使用伺服器的工具子集，而不允許潛在危險的工具。

遵循最小權限原則，強烈建議使用 `includeTools` 來建立僅包含必要工具的允許清單。

**範例：** 僅允許第三方 MCP 伺服器的 `code-search` 和 `get-ticket-details` 工具，即使伺服器提供其他工具如 `delete-ticket`。

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

#### 更安全的模式：在系統設定中定義並新增到允許清單

要建立安全的、集中管理的工具目錄，系統管理員**必須**在系統層級的 `settings.json` 檔案中執行以下兩項操作：

1.  **在 `mcpServers` 物件中定義每個核准伺服器的完整設定**。這確保即使使用者定義了相同名稱的伺服器，安全的系統層級定義也會優先。
2.  **使用 `mcp.allowed` 設定將這些伺服器的名稱新增到允許清單**。這是關鍵的安全步驟，可防止使用者執行不在此清單中的任何伺服器。如果省略此設定，CLI 會合併並允許使用者定義的任何伺服器。

**系統 `settings.json` 範例：**

1. 將所有核准伺服器的_名稱_新增到允許清單。
   這將防止使用者新增自己的伺服器。

2. 為允許清單上的每個伺服器提供規範_定義_。

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

這種模式更安全，因為它同時使用定義和允許清單。使用者定義的任何伺服器要麼被系統定義覆寫（如果它有相同的名稱），要麼因為其名稱不在 `mcp.allowed` 清單中而被封鎖。

### 較不安全的模式：省略允許清單

如果管理員定義了 `mcpServers` 物件但未同時指定 `mcp.allowed` 允許清單，使用者可能會新增自己的伺服器。

**系統 `settings.json` 範例：**

此設定定義了伺服器但未強制執行允許清單。
管理員尚未包含 "mcp.allowed" 設定。

```json
{
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh"
    }
  }
}
```

在此情況下，使用者可以在其本機 `settings.json` 中新增自己的伺服器。由於沒有 `mcp.allowed` 清單來過濾合併結果，使用者的伺服器會被新增到可用工具清單中並允許執行。

## 強制執行沙箱化以提升安全性

為了降低潛在有害操作的風險，您可以強制所有工具執行都使用沙箱化。沙箱將工具執行隔離在容器化環境中。

**範例：** 強制所有工具執行都在 Docker 沙箱中進行。

```json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

您也可以使用 `--sandbox-image` 命令列參數或建置自訂的 `sandbox.Dockerfile`（如[沙箱化說明文件](./configuration.md#sandboxing)中所述）來指定自訂的強化 Docker 映像檔用於沙箱。

## 透過代理伺服器控制網路存取

在具有嚴格網路政策的企業環境中，您可以設定 Gemini CLI 透過企業代理伺服器路由所有出站流量。這可以透過環境變數設定，但也可以透過 `mcpServers` 設定強制用於自訂工具。

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

## 遙測和稽核

出於稽核和監控目的，您可以設定 Gemini CLI 將遙測資料傳送到中央位置。這允許您追蹤工具使用情況和其他事件。如需更多資訊，請參閱[遙測說明文件](../telemetry.md)。

**範例：** 啟用遙測並將其傳送到本機 OTLP 收集器。如果未指定 `otlpEndpoint`，預設為 `http://localhost:4317`。

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "logPrompts": false
  }
}
```

**注意：** 確保在企業設定中將 `logPrompts` 設定為 `false`，以避免收集使用者提示中潛在的敏感資訊。

## 統整：系統 `settings.json` 範例

以下是結合上述討論的幾種模式的系統 `settings.json` 檔案範例，用於為 Gemini CLI 建立安全、受控的環境。

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

- 強制所有工具執行進入 Docker 沙箱。
- 嚴格使用一小組安全 shell 指令和檔案工具的允許清單。
- 定義並允許單一企業 MCP 伺服器用於自訂工具。
- 啟用遙測以進行稽核，不記錄提示內容。
- 將 `/bug` 指令重新導向到內部票務系統。
- 停用一般使用統計收集。
