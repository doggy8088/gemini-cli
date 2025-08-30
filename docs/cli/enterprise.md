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

## Managing Custom Tools (MCP Servers)

If your organization uses custom tools via [Model-Context Protocol (MCP) servers](../core/tools-api.md), it is crucial to understand how server configurations are managed to apply security policies effectively.

### How MCP Server Configurations are Merged

Gemini CLI loads `settings.json` files from three levels: System, Workspace, and User. When it comes to the `mcpServers` object, these configurations are **merged**:

1.  **Merging:** The lists of servers from all three levels are combined into a single list.
2.  **Precedence:** If a server with the **same name** is defined at multiple levels (e.g., a server named `corp-api` exists in both system and user settings), the definition from the highest-precedence level is used. The order of precedence is: **System > Workspace > User**.

This means a user **cannot** override the definition of a server that is already defined in the system-level settings. However, they **can** add new servers with unique names.

### Enforcing a Catalog of Tools

The security of your MCP tool ecosystem depends on a combination of defining the canonical servers and adding their names to an allowlist.

### Restricting Tools Within an MCP Server

For even greater security, especially when dealing with third-party MCP servers, you can restrict which specific tools from a server are exposed to the model. This is done using the `includeTools` and `excludeTools` properties within a server's definition. This allows you to use a subset of tools from a server without allowing potentially dangerous ones.

Following the principle of least privilege, it is highly recommended to use `includeTools` to create an allowlist of only the necessary tools.

**Example:** Only allow the `code-search` and `get-ticket-details` tools from a third-party MCP server, even if the server offers other tools like `delete-ticket`.

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

#### More Secure Pattern: Define and Add to Allowlist in System Settings

To create a secure, centrally-managed catalog of tools, the system administrator **must** do both of the following in the system-level `settings.json` file:

1.  **Define the full configuration** for every approved server in the `mcpServers` object. This ensures that even if a user defines a server with the same name, the secure system-level definition will take precedence.
2.  **Add the names** of those servers to an allowlist using the `mcp.allowed` setting. This is a critical security step that prevents users from running any servers that are not on this list. If this setting is omitted, the CLI will merge and allow any server defined by the user.

**Example System `settings.json`:**

1. Add the _names_ of all approved servers to an allowlist.
   This will prevent users from adding their own servers.

2. Provide the canonical _definition_ for each server on the allowlist.

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

This pattern is more secure because it uses both definition and an allowlist. Any server a user defines will either be overridden by the system definition (if it has the same name) or blocked because its name is not in the `mcp.allowed` list.

### Less Secure Pattern: Omitting the Allowlist

If the administrator defines the `mcpServers` object but fails to also specify the `mcp.allowed` allowlist, users may add their own servers.

**Example System `settings.json`:**

This configuration defines servers but does not enforce the allowlist.
The administrator has NOT included the "mcp.allowed" setting.

```json
{
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh"
    }
  }
}
```

In this scenario, a user can add their own server in their local `settings.json`. Because there is no `mcp.allowed` list to filter the merged results, the user's server will be added to the list of available tools and allowed to run.

## Enforcing Sandboxing for Security

To mitigate the risk of potentially harmful operations, you can enforce the use of sandboxing for all tool execution. The sandbox isolates tool execution in a containerized environment.

**Example:** Force all tool execution to happen within a Docker sandbox.

```json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

You can also specify a custom, hardened Docker image for the sandbox using the `--sandbox-image` command-line argument or by building a custom `sandbox.Dockerfile` as described in the [Sandboxing documentation](./configuration.md#sandboxing).

## Controlling Network Access via Proxy

In corporate environments with strict network policies, you can configure Gemini CLI to route all outbound traffic through a corporate proxy. This can be set via an environment variable, but it can also be enforced for custom tools via the `mcpServers` configuration.

**Example (for an MCP Server):**

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

## Telemetry and Auditing

For auditing and monitoring purposes, you can configure Gemini CLI to send telemetry data to a central location. This allows you to track tool usage and other events. For more information, see the [telemetry documentation](../telemetry.md).

**Example:** Enable telemetry and send it to a local OTLP collector. If `otlpEndpoint` is not specified, it defaults to `http://localhost:4317`.

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "logPrompts": false
  }
}
```

**Note:** Ensure that `logPrompts` is set to `false` in an enterprise setting to avoid collecting potentially sensitive information from user prompts.

## Putting It All Together: Example System `settings.json`

Here is an example of a system `settings.json` file that combines several of the patterns discussed above to create a secure, controlled environment for Gemini CLI.

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

This configuration:

- Forces all tool execution into a Docker sandbox.
- Strictly uses an allowlist for a small set of safe shell commands and file tools.
- Defines and allows a single corporate MCP server for custom tools.
- Enables telemetry for auditing, without logging prompt content.
- Redirects the `/bug` command to an internal ticketing system.
- Disables general usage statistics collection.
