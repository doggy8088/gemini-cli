# 指南

此頁面包含與 Gemini CLI 互動的指南。

## 設定模型情境協議 (MCP) 伺服器

> [!CAUTION]
> 在使用第三方 MCP 伺服器之前，請確保您信任其來源並了解其提供的工具。您使用第三方伺服器的風險由您自行承擔。

本指南以 [GitHub MCP 伺服器](https://github.com/github/github-mcp-server) 為例，展示如何設定 MCP 伺服器。GitHub MCP 伺服器提供與 GitHub 儲存庫互動的工具，例如建立 issue 和對 pull request 發表評論。

### 事前準備

在開始之前，請確保您已安裝並設定好以下項目：

- **Docker：** 安裝並執行 [Docker]。
- **GitHub 個人存取權杖 (PAT)：** 建立一個具有必要範圍的新的 [classic] 或 [fine-grained] PAT。

[Docker]: https://www.docker.com/
[classic]: https://github.com/settings/tokens/new
[fine-grained]: https://github.com/settings/personal-access-tokens/new

### 指南

#### 在 `settings.json` 中設定 MCP 伺服器

在您的專案根目錄中，建立或開啟 [`.gemini/settings.json` 檔案](./configuration.md)。在檔案中，新增 `mcpServers` 設定區塊，其中提供了如何啟動 GitHub MCP 伺服器的說明。

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

#### 設定您的 GitHub 權杖

> [!CAUTION]
> 使用範圍廣泛、可存取個人和私有儲存庫的個人存取權杖，可能會導致私有儲存庫的資訊洩漏到公有儲存庫中。我們建議使用範圍限定的存取權杖，該權杖不會同時共用對公有和私有儲存庫的存取權限。

使用環境變數來儲存您的 GitHub PAT：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN="pat_YourActualGitHubTokenHere"
```

Gemini CLI 會在您於 `settings.json` 檔案中定義的 `mcpServers` 設定中使用此值。

#### 啟動 Gemini CLI 並驗證連線

當您啟動 Gemini CLI 時，它會自動讀取您的設定並在背景啟動 GitHub MCP 伺服器。然後，您可以使用自然語言提示詞，要求 Gemini CLI 執行 GitHub 操作。例如：

```bash
"get all open issues assigned to me in the 'foo/bar' repo and prioritize them"
```
