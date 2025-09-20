# Shell 工具 (`run_shell_command`)

本文檔說明了 Gemini CLI 的 `run_shell_command` 工具。

## 說明

使用 `run_shell_command` 可以與底層系統互動、執行腳本 (script) 或進行命令列操作。`run_shell_command` 會執行指定的 shell 指令，包括需要使用者輸入的互動式指令（例如 `vim`、`git rebase -i`），前提是 `tools.shell.enableInteractiveShell` 設定為 `true`。

在 Windows 上，指令會以 `cmd.exe /c` 執行。在其他平台上，則會以 `bash -c` 執行。

### 參數

`run_shell_command` 接受以下參數：

- `command`（字串，必填）：要執行的完整 shell 指令。
- `description`（字串，選填）：此指令用途的簡要描述，將顯示給使用者。
- `directory`（字串，選填）：執行指令時所在的目錄（相對於專案根目錄）。若未提供，則於專案根目錄執行。

## 如何在 Gemini CLI 中使用 `run_shell_command`

當使用 `run_shell_command` 時，指令會以子程序方式執行。`run_shell_command` 可透過 `&` 啟動背景程序。該工具會回傳執行相關的詳細資訊，包括：

- `Command`：實際執行的指令。
- `Directory`：執行指令時所在的目錄。
- `Stdout`：標準輸出流的內容。
- `Stderr`：標準錯誤流的內容。
- `Error`：子程序回報的任何錯誤訊息。
- `Exit Code`：指令的結束碼 (exit code)。
- `Signal`：若指令因訊號終止，則為該訊號編號。
- `Background PIDs`：任何已啟動背景程序的 PID 清單。

用法：

```
run_shell_command(command="Your commands.", description="Your description of the command.", directory="Your execution directory.")
```

## `run_shell_command` 範例

列出目前目錄中的檔案：

```
run_shell_command(command="ls -la")
```

在特定目錄中執行腳本 (script)：

```
run_shell_command(command="./my_script.sh", directory="scripts", description="Run my custom script")
```

啟動背景伺服器：

```
run_shell_command(command="npm run dev &", description="Start development server in background")
```

## 設定

你可以透過修改你的 `settings.json` 檔案，或是在 Gemini CLI 中使用 `/settings` 指令，來設定 `run_shell_command` 工具的行為。

### 啟用互動式指令

若要啟用互動式指令，你需要將 `tools.shell.enableInteractiveShell` 設定為 `true`。這將會使用 `node-pty` 來執行 shell 指令，允許進行互動式工作階段。如果 `node-pty` 不可用，則會回退至 `child_process` 實作，該實作不支援互動式指令。

**`settings.json` 範例：**

```json
{
  "tools": {
    "shell": {
      "enableInteractiveShell": true
    }
  }
}
```

### 在輸出中顯示顏色

若要在 shell 輸出中顯示顏色，您需要將 `tools.shell.showColor` 設定為 `true`。**注意：此設定僅在啟用 `tools.shell.enableInteractiveShell` 時適用。**

**`settings.json` 範例：**

```json
{
  "tools": {
    "shell": {
      "showColor": true
    }
  }
}
```

### 設定分頁器（Pager）

你可以透過設定 `tools.shell.pager` 來自訂 shell 輸出的分頁器。預設的分頁器為 `cat`。**注意：此設定僅在啟用 `tools.shell.enableInteractiveShell` 時適用。**

**`settings.json` 範例：**

```json
{
  "tools": {
    "shell": {
      "pager": "less"
    }
  }
}
```

## 互動式指令

`run_shell_command` 工具現在透過整合 pseudo-terminal (pty) 支援互動式指令。這讓你可以執行需要即時使用者輸入的指令，例如文字編輯器（`vim`、`nano`）、終端機式 UI（`htop`），以及互動式版本控制操作（`git rebase -i`）。

當互動式指令正在執行時，你可以從 Gemini CLI 傳送輸入給它。要將焦點切換到互動式 shell，請按下 `ctrl+f`。終端機輸出（包含複雜的 TUI）都會正確顯示。

## 重要注意事項

- **安全性：** 執行指令時請務必小心，特別是那些由使用者輸入組成的指令，以避免安全性漏洞。
- **錯誤處理：** 請檢查 `Stderr`、`Error` 和 `Exit Code` 欄位，以判斷指令是否成功執行。
- **背景程序：** 當指令以 `&` 在背景執行時，工具會立即回傳，且該程序會繼續在背景運作。`Background PIDs` 欄位將包含該背景程序的程序 ID。

## 環境變數

當 `run_shell_command` 執行指令時，會在子程序的環境中設定 `GEMINI_CLI=1` 環境變數。這讓腳本或工具可以偵測是否是在 Gemini CLI 內部執行。

## 指令限制

你可以透過在設定檔中使用 `tools.core` 和 `tools.exclude` 設定，限制 `run_shell_command` 工具可執行的指令。

- `tools.core`：若要將 `run_shell_command` 限制為特定指令集合，請在 `tools` 分類下的 `core` 清單中，依照 `run_shell_command(<command>)` 格式新增條目。例如，`"tools": {"core": ["run_shell_command(git)"]}` 只允許 `git` 指令。包含通用的 `run_shell_command` 則作為萬用字元 (wildcard)，允許任何未被明確封鎖的指令。
- `tools.exclude`：若要封鎖特定指令，請在 `tools` 分類下的 `exclude` 清單中，依照 `run_shell_command(<command>)` 格式新增條目。例如，`"tools": {"exclude": ["run_shell_command(rm)"]}` 會封鎖 `rm` 指令。

驗證邏輯設計上兼顧安全與彈性：

1.  **禁用指令串接**：工具會自動將以 `&&`、`||` 或 `;` 串接的指令拆開，並分別驗證每一部分。只要其中任何一部分不被允許，整個指令就會被封鎖。
2.  **前綴比對**：工具採用前綴比對。例如，若允許 `git`，則可以執行 `git status` 或 `git log`。
3.  **封鎖清單優先**：`tools.exclude` 清單會被優先檢查。如果指令符合被封鎖的前綴，即使同時符合 `tools.core` 中允許的前綴，也會被拒絕。

### 指令限制範例

**僅允許特定指令前綴**

若只允許 `git` 和 `npm` 指令，並封鎖其他所有指令：

```json
{
  "tools": {
    "core": ["run_shell_command(git)", "run_shell_command(npm)"]
  }
}
```

- `git status`：允許
- `npm install`：允許
- `ls -l`：封鎖

**封鎖特定指令前綴**

若要封鎖 `rm` 並允許所有其他指令：

```json
{
  "tools": {
    "core": ["run_shell_command"],
    "exclude": ["run_shell_command(rm)"]
  }
}
```

- `rm -rf /`: 已封鎖
- `git status`: 已允許
- `npm install`: 已允許

**封鎖清單優先**

如果某個指令前綴同時存在於`tools.core`和`tools.exclude`，則該指令會被封鎖。

```json
{
  "tools": {
    "core": ["run_shell_command(git)"],
    "exclude": ["run_shell_command(git push)"]
  }
}
```

- `git push origin main`: 已封鎖
- `git status`: 已允許

**封鎖所有 shell 指令**

若要封鎖所有 shell 指令，請在 `tools.exclude` 中加入 `run_shell_command` 萬用字元 (wildcards)：

```json
{
  "tools": {
    "exclude": ["run_shell_command"]
  }
}
```

- `ls -l`：已封鎖
- `any other command`：已封鎖

## `excludeTools` 的安全性注意事項

`excludeTools` 中針對 `run_shell_command` 的指令限制，是基於簡單的字串比對，容易被繞過。此功能**不是安全機制**，不應依賴它來安全地執行不受信任的程式碼。建議使用 `coreTools` 明確選擇允許執行的指令。
