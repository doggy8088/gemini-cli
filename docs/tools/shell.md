# Shell 工具

本文件說明 Gemini CLI 的 `run_shell_command` 工具。

## 說明

使用 `run_shell_command` 可透過指令列與作業系統互動、執行腳本，或執行指令列操作。`run_shell_command` 會執行指定的 Shell 指令。在 Windows 上，指令會以 `cmd.exe /c` 執行。在其他平台上，指令會以 `bash -c` 執行。

### 引數

`run_shell_command` 接受以下引數：

- `command` (字串，必要)：要執行的確切 Shell 指令。
- `description` (字串，選用)：指令用途的簡要說明，將會顯示給使用者。
- `directory` (字串，選用)：執行指令的目錄 (相對於專案根目錄)。若未提供，指令會在專案根目錄中執行。

## 如何搭配 Gemini CLI 使用 `run_shell_command`

使用 `run_shell_command` 時，指令會以子處理程序的形式執行。`run_shell_command` 可使用 `&` 啟動背景處理程序。此工具會傳回執行的詳細資訊，包括：

- `Command`：已執行的指令。
- `Directory`：執行指令的目錄。
- `Stdout`：標準輸出串流的輸出。
- `Stderr`：標準錯誤串流的輸出。
- `Error`：子處理程序回報的任何錯誤訊息。
- `Exit Code`：指令的結束代碼。
- `Signal`：如果指令被訊號終止，則為訊號編號。
- `Background PIDs`：任何已啟動的背景處理程序的 PID 清單。

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

- **安全性：**執行指令時請務必小心，特別是由使用者輸入建構的指令，以防範安全性漏洞。
- **互動式指令：**避免使用需要互動式使用者輸入的指令，因為這可能會導致工具停滯。若有可用的非互動式旗標，請善加利用 (例如 `npm init -y`)。
- **錯誤處理：**檢查 `Stderr`、`Error` 和 `Exit Code` 欄位，以判斷指令是否成功執行。
- **背景處理程序：**當指令使用 `&` 在背景執行時，工具會立即返回，而該處理程序會繼續在背景執行。`Background PIDs` 欄位將包含背景處理程序的處理程序 ID。
