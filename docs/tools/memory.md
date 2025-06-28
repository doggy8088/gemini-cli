# 記憶體工具 (`save_memory`)

本文件說明 Gemini CLI 的 `save_memory` 工具。

## 說明

使用 `save_memory` 可在您的 Gemini CLI 工作階段之間儲存及取用資訊。透過 `save_memory`，您可以指示 CLI 跨工作階段記住關鍵細節，以提供個人化且具針對性的協助。

### 引數

`save_memory` 有一個引數：
- `fact` (字串，必要)：要記住的特定事實或資訊片段。這應是以自然語言撰寫的清晰、獨立陳述。

## 如何搭配 Gemini CLI 使用 `save_memory`

此工具會將提供的 `fact` 附加到位於使用者家目錄 (`~/.gemini/GEMINI.md`) 中的一個特殊 `GEMINI.md` 檔案。此檔案可設定為不同的名稱。
新增後，這些事實會儲存在 `## Gemini Added Memories` 區段底下。此檔案會在後續的工作階段中載入為上下文，讓 CLI 能夠取用已儲存的資訊。

使用方式：

```
save_memory(fact="Your fact here.")
```

### `save_memory` 範例

記住使用者偏好：

```
save_memory(fact="My preferred programming language is Python.")
```

儲存專案特定細節：

```
save_memory(fact="The project I'm currently working on is called 'gemini-cli'.")
```
## 重要注意事項

- **一般用法：**此工具應用於簡潔、重要的事實。不適用於儲存大量資料或對話記錄。
- **記憶檔案：**記憶檔案是一個純文字 Markdown 檔案，因此您可以在需要時手動檢視和編輯。