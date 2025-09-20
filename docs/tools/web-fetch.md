# Web Fetch Tool (`web_fetch`)

本文檔說明 Gemini CLI 的 `web_fetch` 工具。

## 說明

使用 `web_fetch` 可對網頁內容進行摘要、比較或資訊擷取。`web_fetch` 工具會處理提示中嵌入的一個或多個 URL（最多 20 個）。`web_fetch` 接受自然語言提示，並回傳產生的回應。

### 參數

`web_fetch` 需要一個參數：

- `prompt`（字串，必填）：一個包含要擷取的 URL（最多 20 個）以及針對這些內容要如何處理的具體指示的完整提示。例如：`"Summarize https://example.com/article and extract key points from https://another.com/data"`。提示中必須至少包含一個以 `http://` 或 `https://` 開頭的 URL。

## 如何在 Gemini CLI 中使用 `web_fetch`

要在 Gemini CLI 中使用 `web_fetch`，請提供包含 URL 的自然語言提示。該工具會在擷取任何 URL 前要求確認。確認後，工具會透過 Gemini API 的 `urlContext` 處理這些 URL。

若 Gemini API 無法存取該 URL，工具會退回至直接從本機擷取內容。工具會格式化回應，並在可能的情況下包含來源註記與引用。最後，工具會將回應提供給使用者。

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

- **URL 處理：**`web_fetch` 依賴 Gemini API 能夠存取並處理所提供的 URL。
- **輸出品質：**輸出的品質將取決於提示詞中指令的清晰度。
