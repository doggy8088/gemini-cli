# 記憶工具 (`save_memory`)

本文件說明 Gemini CLI 的 `save_memory` 工具。

## 說明

使用 `save_memory` 可以在你的 Gemini CLI 工作階段之間儲存並回憶資訊。透過 `save_memory`，你可以指示命令列介面 (Command Line Interface) 在不同工作階段間記住關鍵細節，提供個人化且有針對性的協助。

### 參數

`save_memory` 需要一個參數：

- `fact`（字串，必填）：要記住的具體事實或資訊。這應該是一個明確、完整且以自然語言撰寫的陳述。

## 如何在 Gemini CLI 中使用 `save_memory`

此工具會將提供的 `fact` 附加到使用者家目錄 (`~/.gemini/GEMINI.md`) 下的一個特殊 `GEMINI.md` 記憶檔案 (memory file)。此檔案名稱可進行設定。

新增後，這些事實會被儲存在 `## Gemini Added Memories` 區段下。該檔案會在後續工作階段作為 context 載入，使命令列介面 (Command Line Interface) 能回憶已儲存的資訊。

用法：

```
save_memory(fact="Your fact here.")
```

### `save_memory` 範例

記住使用者偏好設定：

```
save_memory(fact="My preferred programming language is Python.")
```

儲存專案專屬的細節：

```
save_memory(fact="The project I'm currently working on is called 'gemini-cli'.")
```

## 重要注意事項

- **一般使用情境：** 此工具應用於儲存簡明且重要的事實，不適合用來儲存大量資料或對話歷史。
- **記憶檔案 (memory file)：** 記憶檔案是一個純文字的 Markdown 檔案，因此你可以在需要時手動檢視或編輯它。
