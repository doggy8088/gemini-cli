# Web Fetch Tool (`web_fetch`)

本文檔說明了 Gemini CLI 的 `web_fetch` 工具。

## 說明

使用 `web_fetch` 可以摘要、比較或擷取網頁資訊。`web_fetch` 工具會處理提示中嵌入的一個或多個 URL（最多 20 個）的內容。`web_fetch` 會接收自然語言提示，並回傳產生的回應。

### 參數

`web_fetch` 接受一個參數：

- `prompt`（字串，必填）：一個包含要擷取的 URL（最多 20 個）及具體內容處理指示的完整提示。例如：`"Summarize https://example.com/article and extract key points from https://another.com/data"`。提示中必須至少包含一個以 `http://` 或 `https://` 開頭的 URL。

## 如何在 Gemini CLI 中使用 `web_fetch`

要在 Gemini CLI 中使用 `web_fetch`，請提供包含 URL 的自然語言提示。該工具會在擷取任何 URL 前先要求確認。確認後，工具會透過 Gemini API 的 `urlContext` 處理這些 URL。

如果 Gemini API 無法存取該 URL，工具會退回到從本機直接擷取內容。工具會格式化回應，並在可能的情況下包含來源註明及引用。最後，工具會將回應提供給使用者。

用法：

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

- **URL 處理：**`web_fetch` 依賴 Gemini API 存取並處理所提供的 URL。
- **輸出品質：**輸出的品質將取決於提示中指令的清晰度。
