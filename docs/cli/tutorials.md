# 教學

本頁包含與 Gemini CLI 互動的教學內容。

## 設定 Model Context Protocol (MCP) 伺服器

> [!CAUTION]
> 在使用第三方 MCP 伺服器之前，請確保您信任其來源並了解其所提供的工具。您使用第三方伺服器需自行承擔風險。

本教學將以 [GitHub MCP 伺服器](https://github.com/github/github-mcp-server) 為例，說明如何設定 MCP 伺服器。GitHub MCP 伺服器提供了與 GitHub 儲存庫（GitHub repositories）互動的工具，例如建立 Issue 以及對 Pull Request 留言等功能。

### 先決條件

在開始之前，請確保您已安裝並設定以下項目：

- **Docker：** 安裝並執行 [Docker]。
- **GitHub Personal Access Token (PAT)：** 建立一個新的 [classic] 或 [fine-grained] PAT，並賦予所需的權限範圍。

[Docker]: https://www.docker.com/
[classic]: https://github.com/settings/tokens/new
[fine-grained]: https://github.com/settings/personal-access-tokens/new

### 指南

#### 在 `settings.json` 中設定 MCP 伺服器

於您的專案根目錄下，建立或開啟 [`.gemini/settings.json` 檔案](./configuration.md)。在該檔案中，新增 `mcpServers` 設定區塊，該區塊將提供啟動 GitHub MCP 伺服器的指示。

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

#### 設定你的 GitHub 權杖

> [!CAUTION]
> 使用具有廣泛權限、且能存取個人與私人儲存庫的個人存取權杖（personal access token），可能導致私人儲存庫的資訊外洩到公開儲存庫。我們建議使用細粒度權限的存取權杖（fine-grained access token），且不要同時授權公開與私人儲存庫的存取權。

請使用環境變數來儲存你的 GitHub PAT：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN="pat_YourActualGitHubTokenHere"
```

Gemini CLI 會在你於 `settings.json` 檔案中定義的 `mcpServers` 設定中使用此值。

#### 啟動 Gemini CLI 並驗證連線

當你啟動 Gemini CLI 時，它會自動讀取你的設定，並在背景啟動 GitHub MCP 伺服器。你隨後可以使用自然語言提示，請求 Gemini CLI 執行 GitHub 操作。例如：

```bash
"get all open issues assigned to me in the 'foo/bar' repo and prioritize them"
```
