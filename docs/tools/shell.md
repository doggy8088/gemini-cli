# Shell 工具 (`run_shell_command`)

本文件描述 Gemini CLI 的 `run_shell_command` 工具。

## 描述

使用 `run_shell_command` 與底層系統互動、執行腳本或執行命令列操作。`run_shell_command` 執行給定的 Shell 指令。在 Windows 上，指令將使用 `cmd.exe /c` 執行。在其他平台上，指令將使用 `bash -c` 執行。

### 引數

`run_shell_command` 接受以下引數：

- `command`（string，必要）：要執行的確切 Shell 指令。
- `description`（string，選用）：指令用途的簡短描述，將顯示給使用者。
- `directory`（string，選用）：執行指令的目錄（相對於專案根目錄）。如果未提供，指令會在專案根目錄中執行。

## 如何在 Gemini CLI 中使用 `run_shell_command`

使用 `run_shell_command` 時，指令會作為子程序執行。`run_shell_command` 可以使用 `&` 啟動背景程序。此工具回傳執行的詳細資訊，包括：

- `Command`：已執行的指令。
- `Directory`：執行指令的目錄。
- `Stdout`：標準輸出串流的輸出。
- `Stderr`：標準錯誤串流的輸出。
- `Error`：子程序回報的任何錯誤訊息。
- `Exit Code`：指令的退出代碼。
- `Signal`：如果指令被信號終止的信號編號。
- `Background PIDs`：任何已啟動背景程序的 PID 清單。

使用方式：

```
run_shell_command(command="Your commands.", description="Your description of the command.", directory="Your execution directory.")
```

## `run_shell_command` 範例

列出目前目錄中的檔案：

```
run_shell_command(command="ls -la")
```

在特定目錄中執行腳本：

```
run_shell_command(command="./my_script.sh", directory="scripts", description="執行我的自訂腳本")
```

啟動背景伺服器：

```
run_shell_command(command="npm run dev &", description="在背景啟動開發伺服器")
```

## 重要注意事項

- **安全性：** 執行指令時要小心，特別是從使用者輸入建構的指令，以防止安全漏洞。
- **互動式指令：** 避免需要互動式使用者輸入的指令，因為這可能導致工具掛起。如果可用，請使用非互動式旗標（例如，`npm init -y`）。
- **錯誤處理：** 檢查 `Stderr`、`Error` 和 `Exit Code` 欄位以確定指令是否成功執行。
- **背景程序：** 當指令使用 `&` 在背景執行時，工具會立即返回，程序會繼續在背景執行。`Background PIDs` 欄位會包含背景程序的程序 ID。

## 環境變數

當 `run_shell_command` 執行指令時，它會在子程序的環境中設定 `GEMINI_CLI=1` 環境變數。這允許腳本或工具偵測它們是否正在 Gemini CLI 內執行。

## 指令限制

您可以透過在設定檔中使用 `tools.core` 和 `tools.exclude` 設定來限制 `run_shell_command` 工具可以執行的指令。

- `tools.core`：要將 `run_shell_command` 限制為特定指令集，請以 `run_shell_command(<指令>)` 格式將項目新增到 `tools` 類別下的 `core` 清單。例如，`"tools": {"core": ["run_shell_command(git)"]}` 將只允許 `git` 指令。包含通用的 `run_shell_command` 作為萬用字元，允許任何未明確封鎖的指令。
- `tools.exclude`：要封鎖特定指令，請以 `run_shell_command(<指令>)` 格式將項目新增到 `tools` 類別下的 `exclude` 清單。例如，`"tools": {"exclude": ["run_shell_command(rm)"]}` 將封鎖 `rm` 指令。

驗證邏輯設計為安全且靈活：

1. **停用指令鏈接**：工具會自動分割使用 `&&`、`||` 或 `;` 鏈接的指令，並分別驗證每個部分。如果鏈中的任何部分不被允許，整個指令會被封鎖。
2. **前綴匹配**：工具使用前綴匹配。例如，如果您允許 `git`，您可以執行 `git status` 或 `git log`。
3. **封鎖清單優先**：`tools.exclude` 清單總是先檢查。如果指令匹配封鎖的前綴，即使它也匹配 `tools.core` 中允許的前綴，也會被拒絕。

### 指令限制範例

**僅允許特定指令前綴**

要僅允許 `git` 和 `npm` 指令，並封鎖所有其他指令：

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

要封鎖 `rm` 並允許所有其他指令：

```json
{
  "tools": {
    "core": ["run_shell_command"],
    "exclude": ["run_shell_command(rm)"]
  }
}
```

- `rm -rf /`：封鎖
- `git status`：允許
- `npm install`：允許

**封鎖清單優先**

如果指令前綴同時在 `tools.core` 和 `tools.exclude` 中，它會被封鎖。

```json
{
  "tools": {
    "core": ["run_shell_command(git)"],
    "exclude": ["run_shell_command(git push)"]
  }
}
```

- `git push origin main`：封鎖
- `git status`：允許

**封鎖所有 shell 指令**

要封鎖所有 shell 指令，請將 `run_shell_command` 萬用字元新增到 `tools.exclude`：

```json
{
  "tools": {
    "exclude": ["run_shell_command"]
  }
}
```

- `ls -l`：封鎖
- `any other command`：封鎖

## `excludeTools` 的安全性注意事項

`run_shell_command` 在 `excludeTools` 中的指令特定限制基於簡單的字串匹配，可以輕易被繞過。此功能**不是安全機制**，不應依賴它來安全執行不受信任的程式碼。建議使用 `coreTools` 明確選擇可以執行的指令。
