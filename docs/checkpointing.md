# 檢查點

Gemini CLI 包含檢查點功能，可在 AI 驅動的工具進行任何檔案修改之前自動儲存專案狀態的快照。這讓您可以安全地實驗和套用程式碼變更，並知道您可以立即回復到工具執行前的狀態。

## 運作方式

當您核准修改檔案系統的工具（如 `write_file` 或 `replace`）時，CLI 會自動建立「檢查點」。此檢查點包括：

1.  **Git 快照**：在位於您主目錄的特殊影子 Git 儲存庫中進行提交（`~/.gemini/history/<project_hash>`）。此快照擷取該時刻專案檔案的完整狀態。它**不會**干擾您自己專案的 Git 儲存庫。
2.  **對話歷史記錄**：儲存您與代理程式到該時點的整個對話。
3.  **工具呼叫**：也會儲存即將執行的特定工具呼叫。

如果您想撤銷變更或只是回到之前的狀態，您可以使用 `/restore` 指令。還原檢查點將：

- 將專案中的所有檔案回復到快照中擷取的狀態。
- 在 CLI 中還原對話歷史記錄。
- 重新提議原始工具呼叫，允許您再次執行它、修改它，或直接忽略它。

所有檢查點資料，包括 Git 快照和對話歷史記錄，都儲存在您的機器本機上。Git 快照儲存在影子儲存庫中，而對話歷史記錄和工具呼叫則儲存在您專案暫存目錄的 JSON 檔案中，通常位於 `~/.gemini/tmp/<project_hash>/checkpoints`。

## 啟用功能

檢查點功能預設為停用。要啟用它，您可以使用命令列旗標或編輯您的 `settings.json` 檔案。

### 使用命令列旗標

您可以在啟動 Gemini CLI 時使用 `--checkpointing` 旗標啟用目前工作階段的檢查點功能：

```bash
gemini --checkpointing
```

### Using the `settings.json` File

To enable checkpointing by default for all sessions, you need to edit your `settings.json` file.

Add the following key to your `settings.json`:

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

啟用後，檢查點會自動建立。要管理它們，您可以使用 `/restore` 指令。

### 列出可用檢查點

要查看目前專案所有已儲存檢查點的清單，只需執行：

```
/restore
```

CLI 會顯示可用檢查點檔案的清單。這些檔案名稱通常由時間戳記、被修改檔案的名稱和即將執行的工具名稱組成（例如，`2025-06-22T10-00-00_000Z-my-file.txt-write_file`）。

### 還原特定檢查點

要將專案還原到特定檢查點，請使用清單中的檢查點檔案：

```
/restore <checkpoint_file>
```

例如：

```
/restore 2025-06-22T10-00-00_000Z-my-file.txt-write_file
```

執行指令後，您的檔案和對話將立即還原到建立檢查點時的狀態，並且原始工具提示會重新出現。
