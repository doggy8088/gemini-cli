# 擴充功能

Gemini CLI 支援可擴充其功能的擴充功能。

## 運作方式

啟動時，Gemini CLI 會在兩個位置尋找擴充功能：

1.  `<workspace>/.gemini/extensions`
2.  `<home>/.gemini/extensions`

Gemini CLI 會從這兩個位置載入所有擴充功能。如果兩個位置都存在同名的擴充功能，則工作區目錄中的擴充功能優先。

在每個位置中，個別擴充功能都以包含 `gemini-extension.json` 檔案的目錄形式存在。例如：

`<workspace>/.gemini/extensions/my-extension/gemini-extension.json`

### `gemini-extension.json`

`gemini-extension.json` 檔案包含擴充功能的設定。該檔案具有以下結構：

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "mcpServers": {
    "my-server": {
      "command": "node my-server.js"
    }
  },
  "contextFileName": "GEMINI.md",
  "excludeTools": ["run_shell_command"]
}
```

- `name`：擴充功能的名稱。這用於唯一識別擴充功能。這應該與您的擴充功能目錄的名稱相符。
- `version`：擴充功能的版本。
- `mcpServers`：要設定的 MCP 伺服器對應。鍵是伺服器的名稱，值是伺服器設定。這些伺服器將在啟動時載入，就像在 [`settings.json` 檔案](./cli/configuration.md) 中設定的 MCP 伺服器一樣。如果擴充功能和 `settings.json` 檔案都設定了同名的 MCP 伺服器，則 `settings.json` 檔案中定義的伺服器優先。
- `contextFileName`：包含擴充功能內容的檔案名稱。這將用於從工作區載入內容。如果未使用此屬性，但您的擴充功能目錄中存在 `GEMINI.md` 檔案，則將載入該檔案。
- `excludeTools`：要從模型中排除的工具名稱陣列。您還可以為支援它的工具指定特定於指令的限制，例如 `run_shell_command` 工具。例如，`"excludeTools": ["run_shell_command(rm -rf)"]` 將會封鎖 `rm -rf` 指令。

當 Gemini CLI 啟動時，它會載入所有擴充功能並合併其設定。如果存在任何衝突，則工作區設定優先。