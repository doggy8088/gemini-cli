# 記憶工具

本文件說明 Gemini CLI 的 `save_memory` 工具。

## 說明

使用 `save_memory` 可在您的 Gemini CLI 工作階段中儲存及擷取資訊。透過 `save_memory`，您可以指示 CLI 記住跨工作階段的重要詳細資料，以提供個人化且直接的協助。

### 引數

`save_memory` 接受一個引數：

- `fact` (字串，必要)：要記住的特定事實或資訊。這應該是以自然語言撰寫的清楚、獨立的陳述。

## 如何搭配 Gemini CLI 使用 `save_memory`

此工具會將提供的 `fact` 附加到位於使用者主目錄 (`~/.gemini/GEMINI.md`) 中的特殊 `GEMINI.md` 檔案。此檔案可設定為使用不同的名稱。

新增後，事實會儲存在 `## Gemini Added Memories` 區段下。此檔案會在後續工作階段中載入為內容，讓 CLI 能夠擷取儲存的資訊。

用法：

```
save_memory(fact="此處為您的事實。")
```

### `save_memory` 範例

記住使用者偏好設定：

```
save_memory(fact="我偏好的程式語言是 Python。")
```

儲存專案特定詳細資料：

```
save_memory(fact="我目前正在處理的專案稱為「gemini-cli」。")
```

## 重要注意事項

- **一般用法**： 此工具應用於簡潔、重要的事實。不適用於儲存大量資料或對話記錄。
- **記憶檔案**： 記憶檔案是純文字 Markdown 檔案，因此您可以在需要時手動檢視和編輯。