# 教學課程

本頁面包含與 Gemini CLI 互動的教學課程。

## 設定模型內容通訊協定 (MCP) 伺服器

> [!CAUTION]
> 使用第三方 MCP 伺服器之前，請務必信任其來源並瞭解其提供的工具。您使用第三方伺服器的風險由您自行承擔。

本教學課程示範如何設定 MCP 伺服器，並以 [GitHub MCP 伺服器](https://github.com/github/github-mcp-server) 為例。GitHub MCP 伺服器提供與 GitHub 存放庫互動的工具，例如建立問題和在提取要求上留言。

### 先決條件

開始之前，請確定您已安裝並設定下列項目：

- **Docker**： 安裝並執行 [Docker]。
- **GitHub 個人存取權杖 (PAT)**： 建立一個具有必要範圍的新 [classic] 或 [fine-grained] PAT。

[Docker]: https://www.docker.com/
[classic]: https://github.com/settings/tokens/new
[fine-grained]: https://github.com/settings/personal-access-tokens/new

### 指南

#### 在 `settings.json` 中設定 MCP 伺服器

在專案的根目錄中，建立或開啟 [`.gemini/settings.json` 檔案](./configuration.md)。在檔案中，新增 `mcpServers` 設定區塊，其中提供如何啟動 GitHub MCP 伺服器的說明。

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
> 使用具有廣泛範圍的個人存取權杖，可存取個人和私人存放庫，可能會導致私人存放庫中的資訊洩漏到公用存放庫中。我們建議使用細微的存取權杖，不要共用對公用和私人存放庫的存取權。

使用環境變數來儲存您的 GitHub PAT：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN="pat_YourActualGitHubTokenHere"
```

Gemini CLI 會在您於 `settings.json` 檔案中定義的 `mcpServers` 設定中使用此值。

#### 啟動 Gemini CLI 並驗證連線

當您啟動 Gemini CLI 時，它會自動讀取您的設定並在背景中啟動 GitHub MCP 伺服器。然後，您可以使用自然語言提示來要求 Gemini CLI 執行 GitHub 動作。例如：

```bash
"get all open issues assigned to me in the 'foo/bar' repo and prioritize them"
```