# 網路搜尋工具 (`google_web_search`)

本文件說明 `google_web_search` 工具。

## 說明

使用 `google_web_search` 透過 Gemini API 執行 Google 網路搜尋。`google_web_search` 工具會傳回網路搜尋結果的摘要及來源。

### 引數

`google_web_search` 接受一個引數：

- `query` (字串，必要)：搜尋查詢。

## 如何搭配 Gemini CLI 使用 `google_web_search`

`google_web_search` 工具會將查詢傳送至 Gemini API，接著執行網路搜尋。`google_web_search` 會根據搜尋結果傳回產生的回應，其中包含引用資料和來源。

用法：

```
google_web_search(query="Your query goes here.")
```

## `google_web_search` 範例

取得特定主題的資訊：

```
google_web_search(query="latest advancements in AI-powered code generation")
```

## 重要注意事項

- **傳回的回應：** `google_web_search` 工具會傳回經過處理的摘要，而非原始的搜尋結果清單。
- **引用資料：** 回應中包含用來產生摘要的來源引用資料。
