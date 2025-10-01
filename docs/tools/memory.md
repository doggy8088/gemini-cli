# 記憶工具 (`save_memory`)

本文件說明 Gemini CLI 的 `save_memory` 工具。

## 說明

使用 `save_memory` 可以在多個 Gemini CLI 工作階段間儲存並回憶資訊。透過 `save_memory`，你可以指示命令列介面 (Command Line Interface) 記住關鍵細節，讓你在不同工作階段都能獲得個人化且有針對性的協助。

### 參數

`save_memory` 需要一個參數：

- `fact`（字串，必填）：要記住的具體事實或資訊。請以自然語言撰寫清楚且自我包含的敘述。

## 如何在 Gemini CLI 中使用 `save_memory`

此工具會將你提供的 `fact` 附加到使用者家目錄 (`~/.gemini/GEMINI.md`) 下的特殊 `GEMINI.md` 記憶檔案 (memory file)。你可以設定該檔案的名稱。

新增後，這些事實會儲存在 `## Gemini Added Memories` 區段下。該檔案會在後續工作階段載入為 context，讓命令列介面 (Command Line Interface) 能回憶先前儲存的資訊。

使用方式：

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

- **一般使用方式：** 此工具適用於儲存簡潔且重要的事實，不建議用來保存大量資料或對話歷史。
- **記憶檔案 (memory file)：** 記憶檔案是一個純文字的 Markdown 檔案，因此你可以在需要時手動檢視或編輯它。
