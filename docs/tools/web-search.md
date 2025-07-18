# 網路搜尋工具

本文件說明 `google_web_search` 工具。

## 說明

使用 `google_web_search` 透過 Gemini API 使用 Google 搜尋執行網路搜尋。`google_web_search` 工具會傳回包含來源的網路結果摘要。

### 引數

`google_web_search` 接受一個引數：

- `query` (字串，必要)：搜尋查詢。

## 如何搭配 Gemini CLI 使用 `google_web_search`

`google_web_search` 工具會將查詢傳送至 Gemini API，然後執行網路搜尋。`google_web_search` 會根據搜尋結果傳回產生的回應，包括引文和來源。

用法：

```
google_web_search(query="您的查詢請在此輸入。")
```

## `google_web_search` 範例

取得主題相關資訊：

```
google_web_search(query="AI 驅動程式碼產生領域的最新進展")
```

## 重要注意事項

- **傳回的回應**： `google_web_search` 工具會傳回處理過的摘要，而非原始的搜尋結果清單。
- **引文**： 回應中包含用於產生摘要的來源引文。