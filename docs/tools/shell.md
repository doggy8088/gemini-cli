# Shell 工具

本文件說明 Gemini CLI 的 `run_shell_command` 工具。

## 說明

使用 `run_shell_command` 與底層系統互動、執行指令碼或執行命令列操作。`run_shell_command` 會執行指定的 Shell 指令。在 Windows 上，指令會以 `cmd.exe /c` 執行。在其他平台上，指令會以 `bash -c` 執行。

### 引數

`run_shell_command` 接受以下引數：

- `command` (字串，必要)：要執行的確切 Shell 指令。
- `description` (字串，可選)：指令用途的簡要說明，將會顯示給使用者。
- `directory` (字串，可選)：執行指令的目錄 (相對於專案根目錄)。如果未提供，指令將在專案根目錄中執行。

## 如何搭配 Gemini CLI 使用 `run_shell_command`

使用 `run_shell_command` 時，指令會以子處理程序執行。`run_shell_command` 可以使用 `&` 啟動背景處理程序。此工具會傳回有關執行的詳細資訊，包括：

- `Command`：已執行的指令。
- `Directory`：執行指令的目錄。
- `Stdout`：標準輸出串流的輸出。
- `Stderr`：標準錯誤串流的輸出。
- `Error`：子處理程序回報的任何錯誤訊息。
- `Exit Code`：指令的結束代碼。
- `Signal`：如果指令被訊號終止，則為訊號編號。
- `Background PIDs`：任何已啟動之背景處理程序的 PID 清單。

用法：

```
run_shell_command(command="您的指令。", description="您對指令的描述。", directory="您的執行目錄。")
```

## `run_shell_command` 範例

列出目前目錄中的檔案：

```
run_shell_command(command="ls -la")
```

在特定目錄中執行指令碼：

```
run_shell_command(command="./my_script.sh", directory="scripts", description="執行我的自訂指令碼")
```

啟動背景伺服器：

```
run_shell_command(command="npm run dev &", description="在背景啟動開發伺服器")
```

## 重要注意事項

- **安全性**： 執行指令時請務必小心，特別是由使用者輸入建構的指令，以防止安全漏洞。
- **互動式指令**： 避免需要互動式使用者輸入的指令，因為這可能會導致工具掛起。如果可用，請使用非互動式旗標 (例如 `npm init -y`)。
- **錯誤處理**： 檢查 `Stderr`、`Error` 和 `Exit Code` 欄位，以判斷指令是否成功執行。
- **背景處理程序**： 當指令以 `&` 在背景執行時，工具會立即傳回，而處理程序將繼續在背景執行。`Background PIDs` 欄位將包含背景處理程序的處理程序 ID。

## 指令限制

您可以使用設定檔中的 `coreTools` 和 `excludeTools` 設定，限制 `run_shell_command` 工具可執行的指令。

- `coreTools`：若要將 `run_shell_command` 限制為一組特定的指令，請將項目新增至 `coreTools` 清單，格式為 `run_shell_command(<command>)`。例如，`"coreTools": ["run_shell_command(git)"]` 只會允許 `git` 指令。包含通用的 `run_shell_command` 可做為萬用字元，允許任何未明確封鎖的指令。
- `excludeTools`：若要封鎖特定指令，請將項目新增至 `excludeTools` 清單，格式為 `run_shell_command(<command>)`。例如，`"excludeTools": ["run_shell_command(rm)"]` 將會封鎖 `rm` 指令。

驗證邏輯的設計兼具安全與彈性：

1.  **停用指令鏈結**：此工具會自動分割以 `&&`、`||` 或 `;` 鏈結的指令，並分別驗證每個部分。如果鏈結的任何部分不被允許，整個指令就會被封鎖。
2.  **前置詞比對**：此工具使用前置詞比對。例如，如果您允許 `git`，就可以執行 `git status` 或 `git log`。
3.  **封鎖清單優先**：一律會先檢查 `excludeTools` 清單。如果指令符合封鎖的前置詞，即使它也符合 `coreTools` 中允許的前置詞，也會被拒絕。

### 指令限制範例

**僅允許特定的指令前置詞**

若只要允許 `git` 和 `npm` 指令，並封鎖所有其他指令：

```json
{
  "coreTools": ["run_shell_command(git)", "run_shell_command(npm)"]
}
```

- `git status`：允許
- `npm install`：允許
- `ls -l`：封鎖

**封鎖特定的指令前置詞**

若要封鎖 `rm` 並允許所有其他指令：

```json
{
  "coreTools": ["run_shell_command"],
  "excludeTools": ["run_shell_command(rm)"]
}
```

- `rm -rf /`：封鎖
- `git status`：允許
- `npm install`：允許

**封鎖清單優先**

如果指令前置詞同時存在於 `coreTools` 和 `excludeTools` 中，則會被封鎖。

```json
{
  "coreTools": ["run_shell_command(git)"],
  "excludeTools": ["run_shell_command(git push)"]
}
```

- `git push origin main`：封鎖
- `git status`：允許

**封鎖所有 Shell 指令**

若要封鎖所有 Shell 指令，請將 `run_shell_command` 萬用字元新增至 `excludeTools`：

```json
{
  "excludeTools": ["run_shell_command"]
}
```

- `ls -l`：封鎖
- `任何其他指令`：封鎖

## `excludeTools` 的安全性說明

`excludeTools` 中針對 `run_shell_command` 的指令特定限制是基於簡單的字串比對，可以輕易地被繞過。此功能**並非安全機制**，不應賴以安全地執行不受信任的程式碼。建議使用 `coreTools` 明確選取可執行的指令。
