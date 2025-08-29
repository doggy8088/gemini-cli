# 網頁搜尋工具 (`google_web_search`)

本文件描述 `google_web_search` 工具。

## 描述

使用 `google_web_search` 透過 Gemini API 使用 Google 搜尋執行網頁搜尋。`google_web_search` 工具回傳網頁結果摘要及來源。

### 引數

`google_web_search` 接受一個引數：

- `query`（string，必要）：搜尋查詢。

## 如何在 Gemini CLI 中使用 `google_web_search`

`google_web_search` 工具將查詢傳送到 Gemini API，然後執行網頁搜尋。`google_web_search` 將根據搜尋結果回傳生成的回應，包括引用和來源。

使用方式：

```
google_web_search(query="Your query goes here.")
```

## `google_web_search` 範例

Get information on a topic:

```
google_web_search(query="latest advancements in AI-powered code generation")
```

## Important notes

- **Response returned:** The `google_web_search` tool returns a processed summary, not a raw list of search results.
- **Citations:** The response includes citations to the sources used to generate the summary.
