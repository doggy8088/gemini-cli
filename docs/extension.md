# Gemini CLI 擴充套件

_本文件已與 v0.4.0 版本同步更新。_

Gemini CLI 擴充套件將提示詞（prompts）、MCP 伺服器（MCP servers）以及自訂指令（custom commands）打包成一個熟悉且易於使用的格式。透過擴充套件，你可以擴展 Gemini CLI 的功能，並將這些功能分享給其他人。這些擴充套件設計上易於安裝與分享。

## 擴充套件管理

我們提供一套擴充套件管理工具，可透過 `gemini extensions` 指令操作。

請注意，這些指令無法在 CLI 內部執行，但你可以使用 `/extensions list` 子指令來列出已安裝的擴充套件。

另外，所有這些指令的變更，僅會在重新啟動後於新的 CLI 工作階段中生效。

### 安裝擴充套件

你可以使用 `gemini extensions install`，搭配 GitHub URL 來源或 `--path=some/local/path` 來安裝擴充套件。

請注意，系統會建立已安裝擴充套件的副本，因此你需要執行 `gemini extensions update`，以同步本地定義的擴充套件及 GitHub 上的擴充套件的最新變更。

```
gemini extensions install https://github.com/gemini-cli-extensions/security
```

這將安裝 Gemini 命令列介面 (CLI) Security 擴充套件，該擴充套件提供對 `/security:analyze` 指令的支援。

### 卸載擴充套件

若要卸載，請執行 `gemini extensions uninstall extension-name`，以本安裝範例來說：

```
gemini extensions uninstall gemini-cli-security
```

### 停用擴充套件

擴充套件預設會在所有 workspace 中啟用。你可以選擇完全停用某個擴充套件，或僅針對特定 workspace 停用。

例如，`gemini extensions disable extension-name` 會在使用者層級停用該擴充套件，因此在所有地方都會被停用。`gemini extensions disable extension-name --scope=workspace` 則只會在目前的 workspace 停用該擴充套件。

### 啟用擴充套件

你可以使用 `gemini extensions enable extension-name` 來啟用擴充套件。你也可以在特定 workspace 內，使用 `gemini extensions enable extension-name --scope=workspace` 只在該 workspace 啟用擴充套件。

這在你將某個擴充套件於全域層級停用，但只想在特定位置啟用時非常有用。

### 更新擴充套件

對於從本機路徑或 Git 儲存庫 (Git repository) 安裝的擴充套件，你可以使用 `gemini extensions update extension-name` 明確更新到最新版本（如 `gemini-extension.json` `version` 欄位所顯示）。

你可以使用以下指令來更新所有擴充套件：

```
gemini extensions update --all
```

## 擴充套件建立

我們提供多種指令，協助您更輕鬆地開發擴充套件。

### 建立樣板擴充功能

我們提供了幾個範例擴充套件 `context`、`custom-commands`、`exclude-tools` 和 `mcp-server`。您可以在[這裡](https://github.com/google-gemini/gemini-cli/tree/main/packages/cli/src/commands/extensions/examples)查看這些範例。

若要將這些範例之一複製到您選擇的開發目錄中，請執行以下指令：

```
gemini extensions new path/to/directory custom-commands
```

### 連結本機擴充套件

`gemini extensions link` 指令會從擴充套件安裝目錄建立一個符號連結 (symlinks) 到開發路徑。

這樣做的好處是，你在測試想要的變更時，就不需要每次都執行 `gemini extensions update`。

```
gemini extensions link path/to/directory
```

## 運作方式

啟動時，Gemini CLI 會在 `<home>/.gemini/extensions` 中尋找擴充套件。

擴充套件以一個目錄（directory）的形式存在，該目錄內包含一個 `gemini-extension.json` 檔案。例如：

`<home>/.gemini/extensions/my-extension/gemini-extension.json`

### `gemini-extension.json`

`gemini-extension.json` 檔案包含此擴充套件的設定。該檔案的結構如下：

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

- `name`：擴充套件的名稱。這個名稱用於唯一識別擴充套件，以及在擴充套件指令名稱與使用者或專案指令名稱相同時進行衝突處理。名稱應僅包含小寫字母或數字，並使用連字號（dash）取代底線或空格。使用者在命令列介面 (Command Line Interface) 中會以此名稱引用你的擴充套件。請注意，我們預期這個名稱需與擴充套件目錄名稱一致。
- `version`：擴充套件的版本。
- `mcpServers`：要設定的 MCP 伺服器 (MCP servers) 對應表。鍵為伺服器名稱，值為伺服器設定。這些伺服器會在啟動時載入，就像在 [`settings.json` 檔案](./cli/configuration.md) 中設定的 MCP 伺服器一樣。如果擴充套件與 `settings.json` 檔案都設定了同名的 MCP 伺服器，則以 `settings.json` 檔案中定義的伺服器為主。
  - 請注意，除了 `trust` 之外，所有 MCP 伺服器設定選項皆支援。
- `contextFileName`：包含擴充套件 context 的檔案名稱。這個檔案將用於從擴充套件目錄載入 context。如果未設定此屬性，但擴充套件目錄中存在 `GEMINI.md` 檔案，則會自動載入該檔案。
- `excludeTools`：要從模型中排除的工具名稱陣列。你也可以針對支援此功能的工具（如 `run_shell_command` 工具）指定特定指令的限制。例如，`"excludeTools": ["run_shell_command(rm -rf)"]` 會封鎖 `rm -rf` 指令。請注意，這與 MCP 伺服器的 `excludeTools` 功能不同，後者可在 MCP 伺服器設定中列出。

當 Gemini CLI 啟動時，會載入所有擴充套件並合併其設定。如果有任何衝突，則以 workspace 設定為主。

### 自訂指令

擴充套件可以透過在擴充套件目錄下的 `commands/` 子目錄中放置 TOML 檔案，提供[自訂指令](./cli/commands.md#custom-commands)。這些指令格式與使用者和專案自訂指令相同，並遵循標準命名慣例。

**範例**

一個名為 `gcp` 的擴充套件，其結構如下：

```
.gemini/extensions/gcp/
├── gemini-extension.json
└── commands/
    ├── deploy.toml
    └── gcs/
        └── sync.toml
```

將會提供以下指令：

- `/deploy` - 在說明中顯示為 `[gcp] Custom command from deploy.toml`
- `/gcs:sync` - 在說明中顯示為 `[gcp] Custom command from sync.toml`

### 衝突解決

擴充套件指令的優先權最低。當與使用者或專案指令發生衝突時：

1. **無衝突**：擴充套件指令會使用其原始名稱（例如：`/deploy`）
2. **有衝突**：擴充套件指令會加上擴充套件前綴重新命名（例如：`/gcp.deploy`）

舉例來說，若使用者和 `gcp` 擴充套件都定義了一個 `deploy` 指令：

- `/deploy` - 執行使用者的 deploy 指令
- `/gcp.deploy` - 執行擴充套件的 deploy 指令（會標記為 `[gcp]` 標籤）

## 變數

Gemini CLI 擴充套件允許在 `gemini-extension.json` 中進行變數替換。如果你需要，例如，取得目前目錄以便使用 `"cwd": "${extensionPath}${/}run.ts"` 執行 MCP 伺服器時，這會很有用。

**支援的變數：**

| 變數                       | 說明                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${extensionPath}`         | 擴充套件在使用者檔案系統中的完整路徑，例如 '/Users/username/.gemini/extensions/example-extension'。此路徑不會展開符號連結 (symlinks)。 |
| `${workspacePath}`         | 目前 workspace 的完整路徑。                                                                                                         |
| `${/} or ${pathSeparator}` | 路徑分隔符（依作業系統而異）。                                                                                                         |
