# Web Search Tool (`google_web_search`)

本文檔說明 `google_web_search` 工具。

## 說明

使用 `google_web_search` 可透過 Gemini API 利用 Google Search 執行網頁搜尋。`google_web_search` 工具會回傳包含來源的網頁搜尋結果摘要。

### 參數

`google_web_search` 僅接受一個參數：

- `query`（字串，必填）：搜尋查詢內容。

## 如何在 Gemini CLI 中使用 `google_web_search`

`google_web_search` 工具會將查詢送至 Gemini API，進而執行網頁搜尋。`google_web_search` 會根據搜尋結果產生回應，並包含引用與來源。

用法：

```
google_web_search(query="Your query goes here.")
```

## `google_web_search` 範例

取得某主題的相關資訊：

```
google_web_search(query="latest advancements in AI-powered code generation")
```

## 重要注意事項

- **回應內容：**`google_web_search` 工具會回傳經過處理的摘要，而不是原始的搜尋結果清單。
- **引用來源：** 回應中會包含用於產生摘要的來源引用。
