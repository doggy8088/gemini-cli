# 網頁擷取工具 (`web_fetch`)

本文件描述 Gemini CLI 的 `web_fetch` 工具。

## 描述

使用 `web_fetch` 摘要、比較或從網頁擷取資訊。`web_fetch` 工具處理提示中嵌入的一個或多個 URL（最多 20 個）的內容。`web_fetch` 接受自然語言提示並回傳生成的回應。

### 引數

`web_fetch` 接受一個引數：

- `prompt`（string，必要）：包含要擷取的 URL（最多 20 個）和如何處理其內容的特定指示的綜合提示。例如：`"Summarize https://example.com/article and extract key points from https://another.com/data"`。提示必須包含至少一個以 `http://` 或 `https://` 開頭的 URL。

## 如何在 Gemini CLI 中使用 `web_fetch`

要在 Gemini CLI 中使用 `web_fetch`，請提供包含 URL 的自然語言提示。此工具在擷取任何 URL 之前會要求確認。確認後，此工具將透過 Gemini API 的 `urlContext` 處理 URL。

如果 Gemini API 無法存取 URL，此工具將回退到直接從本機機器擷取內容。此工具將格式化回應，包括來源歸屬和引用（如果可能）。然後此工具將向使用者提供回應。

使用方式：

```
web_fetch(prompt="Your prompt, including a URL such as https://google.com.")
```

## `web_fetch` 範例

摘要單一文章：

```
web_fetch(prompt="Can you summarize the main points of https://example.com/news/latest")
```

比較兩篇文章：

```
web_fetch(prompt="What are the differences in the conclusions of these two papers: https://arxiv.org/abs/2401.0001 and https://arxiv.org/abs/2401.0002?")
```

## 重要注意事項

- **URL 處理：** `web_fetch` 依賴 Gemini API 存取和處理指定 URL 的能力。
- **輸出品質：** 輸出品質將取決於提示中指示的清晰度。
