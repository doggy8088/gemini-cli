# 擴充功能

Gemini CLI 支援可用於設定和擴展其功能的擴充功能。

## 運作方式

啟動時，Gemini CLI 會在兩個位置尋找擴充功能：

1.  `<workspace>/.gemini/extensions`
2.  `<home>/.gemini/extensions`

Gemini CLI 會從兩個位置載入所有擴充功能。如果在兩個位置都存在同名擴充功能，工作區目錄中的擴充功能會優先。

在每個位置內，個別擴充功能以包含 `gemini-extension.json` 檔案的目錄形式存在。例如：

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

- `name`：擴充功能的名稱。這用於唯一識別擴充功能，並在擴充功能指令與使用者或專案指令同名時進行衝突解決。
- `version`：擴充功能的版本。
- `mcpServers`：要設定的 MCP 伺服器對應表。鍵是伺服器的名稱，值是伺服器設定。這些伺服器會在啟動時載入，就像在 [`settings.json` 檔案](./cli/configuration.md)中設定的 MCP 伺服器一樣。如果擴充功能和 `settings.json` 檔案都設定了同名的 MCP 伺服器，在 `settings.json` 檔案中定義的伺服器會優先。
- `contextFileName`：包含擴充功能內容的檔案名稱。這將用於從工作區載入內容。如果未使用此屬性但您的擴充功能目錄中存在 `GEMINI.md` 檔案，則會載入該檔案。
- `excludeTools`：要從模型中排除的工具名稱陣列。您也可以為支援的工具指定指令特定限制，如 `run_shell_command` 工具。例如，`"excludeTools": ["run_shell_command(rm -rf)"]` 將阻止 `rm -rf` 指令。

當 Gemini CLI 啟動時，它會載入所有擴充功能並合併其設定。如果有任何衝突，工作區設定會優先。

## 擴充功能指令

擴充功能可以透過在擴充功能目錄內的 `commands/` 子目錄中放置 TOML 檔案來提供[自訂指令](./cli/commands.md#custom-commands)。這些指令遵循與使用者和專案自訂指令相同的格式，並使用標準命名慣例。

### 範例

名為 `gcp` 的擴充功能具有以下結構：

```
.gemini/extensions/gcp/
├── gemini-extension.json
└── commands/
    ├── deploy.toml
    └── gcs/
        └── sync.toml
```

會提供這些指令：

- `/deploy` - 在說明中顯示為 `[gcp] Custom command from deploy.toml`
- `/gcs:sync` - 在說明中顯示為 `[gcp] Custom command from sync.toml`

### 衝突解決

擴充功能指令的優先順序最低。當與使用者或專案指令發生衝突時：

1. **無衝突**：擴充功能指令使用其自然名稱（例如，`/deploy`）
2. **有衝突**：擴充功能指令使用擴充功能前綴重新命名（例如，`/gcp.deploy`）

例如，如果使用者和 `gcp` 擴充功能都定義了 `deploy` 指令：

- `/deploy` - 執行使用者的部署指令
- `/gcp.deploy` - 執行擴充功能的部署指令（標記為 `[gcp]` 標籤）

## 安裝擴充功能

您可以使用 `install` 指令安裝擴充功能。此指令允許您從 Git 儲存庫或本地路徑安裝擴充功能。

### 用法

`gemini extensions install <source> | [options]`

### 選項

- `source <url> positional argument`：安裝擴充功能的 Git 儲存庫 URL。儲存庫必須在其根目錄中包含 `gemini-extension.json` 檔案。
- `--path <path>`：安裝為擴充功能的本地目錄路徑。目錄必須包含 `gemini-extension.json` 檔案。

# 變數

Gemini CLI 擴充功能允許在 `gemini-extension.json` 中進行變數替換。如果例如您需要目前目錄來使用 `"cwd": "${extensionPath}${/}run.ts"` 執行 MCP 伺服器，這會很有用。

**支援的變數：**

| 變數                       | 說明                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${extensionPath}`         | 擴充功能在使用者檔案系統中的完全限定路徑，例如 '/Users/username/.gemini/extensions/example-extension'。這不會解開符號連結。                                 |
| `${/} or ${pathSeparator}` | 路徑分隔符（因作業系統而異）。                                                                                                                               |
