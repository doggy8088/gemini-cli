# 網站擷取工具

本文件說明 Gemini CLI 的 `web_fetch` 工具。

## 說明

使用 `web_fetch` 來摘要、比較或擷取網頁資訊。`web_fetch` 工具會處理提示中嵌入的一個或多個 (最多 20 個) 網址的內容。`web_fetch` 會接受自然語言提示並傳回產生的回應。

### 引數

`web_fetch` 接受一個引數：

- `prompt` (字串，必要)：一個完整的提示，其中包含要擷取的網址 (最多 20 個) 以及如何處理其內容的具體說明。例如：`"摘要 https://example.com/article 並從 https://another.com/data 擷取重點"`。提示必須至少包含一個以 `http://` 或 `https://` 開頭的網址。

## 如何搭配 Gemini CLI 使用 `web_fetch`

若要搭配 Gemini CLI 使用 `web_fetch`，請提供包含網址的自然語言提示。該工具在擷取任何網址之前會要求確認。確認後，該工具將透過 Gemini API 的 `urlContext` 處理網址。

如果 Gemini API 無法存取該網址，該工具將會改回直接從本機擷取內容。該工具會格式化回應，並盡可能包含來源歸屬和引文。然後，該工具會將回應提供給使用者。

用法：

```
web_fetch(prompt="您的提示，包含一個網址，例如 https://google.com。")
```

## `web_fetch` 範例

摘要單篇文章：

```
web_fetch(prompt="可以摘要 https://example.com/news/latest 的要點嗎")
```

比較兩篇文章：

```
web_fetch(prompt="這兩篇論文的結論有何不同：https://arxiv.org/abs/2401.0001 和 https://arxiv.org/abs/2401.0002？")
```

## 重要注意事項

- **網址處理**： `web_fetch` 仰賴 Gemini API 存取和處理指定網址的能力。
- **輸出品質**： 輸出品質將取決於提示中說明的清晰度。
