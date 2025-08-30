# 記憶體工具 (`save_memory`)

本文件描述 Gemini CLI 的 `save_memory` 工具。

## 描述

使用 `save_memory` 在您的 Gemini CLI 工作階段之間儲存和回憶資訊。使用 `save_memory`，您可以指示 CLI 跨工作階段記住關鍵詳細資料，提供個人化和有針對性的協助。

### 引數

`save_memory` 接受一個引數：

- `fact`（string，必要）：要記住的特定事實或資訊片段。這應該是用自然語言撰寫的清楚、自包含陳述。

## 如何在 Gemini CLI 中使用 `save_memory`

此工具將提供的 `fact` 附加到位於使用者主目錄的特殊 `GEMINI.md` 檔案（`~/.gemini/GEMINI.md`）。此檔案可以設定為具有不同的名稱。

新增後，事實會儲存在 `## Gemini Added Memories` 部分下。此檔案會在後續工作階段中載入為內容，允許 CLI 回憶儲存的資訊。

使用方式：

```
save_memory(fact="Your fact here.")
```

### `save_memory` 範例

記住使用者偏好：

```
save_memory(fact="我偏好的程式語言是 Python。")
```

儲存專案特定詳細資料：

```
save_memory(fact="我目前正在進行的專案叫做 'gemini-cli'。")
```

## 重要注意事項

- **一般用法：** 此工具應用於簡潔、重要的事實。它不適用於儲存大量資料或對話歷史記錄。
- **記憶體檔案：** 記憶體檔案是純文字 Markdown 檔案，因此您可以在需要時手動檢視和編輯它。
