# 檢查點（Checkpointing）

Gemini CLI 提供「檢查點（Checkpointing）」功能，能在 AI 工具對檔案進行修改前，自動儲存專案狀態的快照。這讓你可以安心地嘗試與套用程式碼變更，隨時都能立即還原到工具執行前的狀態。

## 運作方式

當你核准會修改檔案系統的工具（例如 `write_file` 或 `replace`）時，Gemini CLI 會自動建立一個「檢查點」。這個檢查點包含：

1.  **Git 快照：** 會在你家目錄下的特殊隱藏 Git repository（`~/.gemini/history/<project_hash>`）建立一個 commit。這個快照完整記錄當下專案檔案的狀態，**不會**影響你自己的專案 Git repository。
2.  **對話紀錄：** 你與 agent 的完整對話內容都會被儲存下來。
3.  **工具呼叫紀錄：** 即將執行的特定工具呼叫也會被記錄。

如果你想要復原變更或回到先前狀態，可以使用 `/restore` 指令。還原檢查點時會：

- 將專案中所有檔案還原至快照時的狀態。
- 還原 CLI 內的對話紀錄。
- 重新提出原本的工具呼叫，讓你可以再次執行、修改，或直接忽略。

所有檢查點資料，包括 Git 快照與對話紀錄，都會儲存在你本機。Git 快照儲存在隱藏 repository，而對話紀錄與工具呼叫則會以 JSON 檔案形式，存放於專案的暫存目錄，通常位於 `~/.gemini/tmp/<project_hash>/checkpoints`。

## 啟用此功能

檢查點功能預設為關閉。若要啟用，你可以使用命令列旗標（flags）或編輯 `settings.json` 檔案。

### 使用命令列旗標（flags）

啟動 Gemini CLI 時加上 `--checkpointing` 旗標，即可在本次工作階段啟用檢查點功能：

```bash
gemini --checkpointing
```

### 使用 `settings.json` 檔案

若要預設在所有 session 啟用 checkpointing，您需要編輯您的 `settings.json` 檔案。

請在您的 `settings.json` 中新增以下鍵值：

```json
{
  "general": {
    "checkpointing": {
      "enabled": true
    }
  }
}
```

## 使用 `/restore` 指令

啟用後，檢查點（checkpoint）會自動建立。若要管理這些檢查點，請使用 `/restore` 指令。

### 列出可用的檢查點

若要查看目前專案中所有已儲存的檢查點清單，只需執行：

```
/restore
```

命令列介面 (Command Line Interface, CLI) 會顯示可用的 checkpoint 檔案清單。這些檔案名稱通常由時間戳記、被修改的檔案名稱，以及即將執行的工具名稱所組成（例如：`2025-06-22T10-00-00_000Z-my-file.txt-write_file`）。

### 還原特定的 Checkpoint

若要將你的專案還原到特定的 checkpoint，請從清單中選擇對應的 checkpoint 檔案：

```
/restore <checkpoint_file>
```

例如：

```
/restore 2025-06-22T10-00-00_000Z-my-file.txt-write_file
```

執行該指令後，你的檔案和對話將會立即還原至建立檢查點時的狀態，並且原本的工具提示也會重新出現。
