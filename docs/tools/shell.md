# Shell 工具 (`run_shell_command`)

本文件說明 Gemini CLI 的 `run_shell_command` 工具。

## 說明

使用 `run_shell_command` 與底層系統互動、執行腳本或執行命令列操作。`run_shell_command` 會執行指定的 shell 指令。在 Windows 上，指令會以 `cmd.exe /c` 執行。在其他平台上，指令會以 `bash -c` 執行。

### 引數

`run_shell_command` 接受以下引數：

- `command` (字串，必要)：要執行的確切 shell 指令。
- `description` (字串，可選)：指令用途的簡要說明，將會顯示給使用者。
- `directory` (字串，可選)：執行指令的目錄 (相對於專案根目錄)。如果未提供，指令會在專案根目錄中執行。

## 如何搭配 Gemini CLI 使用 `run_shell_command`

使用 `run_shell_command` 時，指令會以子進程執行。`run_shell_command` 可以使用 `&` 啟動背景進程。該工具會傳回有關執行的詳細資訊，包括：

- `Command`: 已執行的指令。
- `Directory`: 指令執行的目錄。
- `Stdout`: 標準輸出串流的輸出。
- `Stderr`: 標準錯誤串流的輸出。
- `Error`: 子進程回報的任何錯誤訊息。
- `Exit Code`: 指令的結束代碼。
- `Signal`: 如果指令被信���終止，則為信號編號。
- `Background PIDs`: 任何已啟動背景進程的 PID 列表。

用法：

```
run_shell_command(command="您的指令。", description="您對指令的描述。", directory="您的執行目錄。")
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

- **安全性：** 執行指令時請務必小心，特別是由使用者輸入建構的指令，以防止安全漏洞。
- **互動式指令：** 避免需要互動式使用者輸入的指令，因為這可能會導致工具掛起。如果可用，請使用非互動式旗標 (例如 `npm init -y`)。
- **錯誤處理：** 檢查 `Stderr`、`Error` 和 `Exit Code` 欄位以判斷指令是否成功執行。
- **背景進程：** 當指令使用 `&` 在背景執行時，工具會立即傳回，而進程會繼續在背景執行。`Background PIDs` 欄位將包含背景進程的進程 ID。
