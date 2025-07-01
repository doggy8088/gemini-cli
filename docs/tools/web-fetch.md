# 網頁擷取工具

此文件說明 Gemini CLI 的 `web_fetch` 工具。

## 說明

使用 `web_fetch` 可摘要、比較或擷取網頁中的資訊。`web_fetch` 工具會處理提示中嵌入的一個或多個 (最多 20 個) URL 的內容。`web_fetch` 會接受自然語言提示，並傳回產生的回應。

### 引數

`web_fetch` 接受一個引數：

- `prompt` (字串，必要)：一個完整的提示，其中包含要擷取的 URL (最多 20 個) 以及如何處理其內容的具體指示。例如：`"摘要 https://example.com/article 並從 https://another.com/data 擷取重點"`。提示中必須包含至少一個以 `http://` 或 `https://` 開頭的 URL。

## 如何搭配 Gemini CLI 使用 `web_fetch`

若要搭配 Gemini CLI 使用 `web_fetch`，請提供包含 URL 的自然語言提示。此工具在擷取任何 URL 之前會要求確認。確認後，此工具將透過 Gemini API 的 `urlContext` 處理 URL。

如果 Gemini API 無法存取該 URL，此工具將改為直接從本機擷取內容作為備援方案。此工具會設定回應的格式，並盡可能包含來源出處與引用。接著，此工具會將回應提供給使用者。

用法：

```
web_fetch(prompt="您的提示，包含一個 URL，例如 https://google.com。")
```

## `web_fetch` 範例

摘要單篇文章：

```
web_fetch(prompt="您可以摘要 https://example.com/news/latest 的要點嗎？")
```

比較兩篇文章：

```
web_fetch(prompt="這兩篇論文的結論有何不同：https://arxiv.org/abs/2401.0001 和 https://arxiv.org/abs/2401.0002？")
```

## 重要注意事項

- **URL 處理**：`web_fetch` 仰賴 Gemini API 存取及處理所提供 URL 的能力。
- **輸出品質**：輸出的品質將取決於提示中指令的清晰度。