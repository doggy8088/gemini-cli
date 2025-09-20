# 檢查點（Checkpointing）

Gemini CLI 提供了檢查點（Checkpointing）功能，能在任何 AI 工具對檔案進行修改前，自動儲存你的專案狀態快照。這讓你可以安心地嘗試和套用程式碼變更，因為你隨時都能立即回復到工具執行前的狀態。

## 運作方式

當你核准一個會修改檔案系統的工具（例如 `write_file` 或 `replace`）時，CLI 會自動建立一個「檢查點」。這個檢查點包含：

1.  **Git 快照：** 會在你家目錄下的一個特殊的 shadow Git 儲存庫（`~/.gemini/history/<project_hash>`）建立一個 commit。這個快照完整記錄了當下專案檔案的狀態，**不會**影響你自己的專案 Git 儲存庫。
2.  **對話歷史紀錄：** 你與 agent 之間到目前為止的所有對話內容都會被儲存下來。
3.  **工具呼叫記錄：** 即將被執行的特定工具呼叫也會被保存。

如果你想要還原變更或回到先前狀態，只需使用 `/restore` 指令。還原檢查點時會：

- 將專案中的所有檔案回復到快照所記錄的狀態。
- 還原 CLI 內的對話歷史紀錄。
- 重新提出原本的工具呼叫，讓你可以再次執行、修改或忽略它。

所有檢查點資料，包括 Git 快照和對話歷史，都會儲存在你本機。Git 快照儲存在 shadow 儲存庫中，而對話歷史與工具呼叫則會以 JSON 檔案形式存放於專案的暫存目錄，通常位於 `~/.gemini/tmp/<project_hash>/checkpoints`。

## 啟用此功能

檢查點功能預設為停用。你可以透過命令列旗標（flags）或編輯 `settings.json` 檔案來啟用。

### 使用命令列旗標（flags）

你可以在啟動 Gemini CLI 時，使用 `--checkpointing` 旗標，為當前工作階段啟用檢查點功能：

```bash
gemini --checkpointing
```

### 使用 `settings.json` 檔案

若要預設在所有工作階段啟用 checkpointing，您需要編輯您的 `settings.json` 檔案。

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

啟用後，檢查點會自動建立。若要管理這些檢查點，請使用 `/restore` 指令。

### 列出可用的檢查點

若要查看目前專案中所有已儲存的檢查點清單，只需執行：

```
/restore
```

命令列介面 (CLI) 會顯示可用的 checkpoint 檔案清單。這些檔案名稱通常由時間戳記、正在被修改的檔案名稱，以及即將執行的工具名稱所組成（例如：`2025-06-22T10-00-00_000Z-my-file.txt-write_file`）。

### 還原特定的 Checkpoint

若要將您的專案還原至特定的 checkpoint，請使用清單中的 checkpoint 檔案：

```
/restore <checkpoint_file>
```

例如：

```
/restore 2025-06-22T10-00-00_000Z-my-file.txt-write_file
```

執行該指令後，您的檔案與對話內容將會立即還原至建立檢查點時的狀態，並且原本的工具提示將會再次出現。
