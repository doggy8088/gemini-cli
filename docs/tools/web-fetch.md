# 網頁擷取工具 (`web_fetch`)

此文件說明 Gemini CLI 的 `web_fetch` 工具。

## 說明

使用 `web_fetch` 來摘要、比較或擷取網頁中的資訊。`web_fetch` 工具會處理提示中嵌入的一個或多個 (最多 20 個) URL 的內容。`web_fetch` 接受自然語言提示，並傳回產生的回應。

### 引數

`web_fetch` 接受一個引數：

- `prompt` (字串，必要)：一個完整的提示，其中包含要擷取的 URL (最多 20 個) 以及如何處理其內容的具體說明。例如：`"Summarize https://example.com/article and extract key points from https://another.com/data"`。提示必須包含至少一個以 `http://` 或 `https://` 開頭的 URL。

## 如何搭配 Gemini CLI 使用 `web_fetch`

若要搭配 Gemini CLI 使用 `web_fetch`，請提供包含 URL 的自然語言提示。在擷取任何 URL 之前，此工具會要求確認。確認後，工具將透過 Gemini API 的 `urlContext` 處理 URL。

如果 Gemini API 無法存取 URL，工具將會退回由本機直接擷取內容。工具會格式化回應，並在可能的情況下包含來源歸屬和引文。工具接著會將回應提供給使用者。

使用方式：

```
web_fetch(prompt="Your prompt, including a URL such as https://google.com.")
```

## `web_fetch` 範例

摘要單篇文章：

```
web_fetch(prompt="Can you summarize the main points of https://example.com/news/latest")
```

比較兩篇文章：

```
web_fetch(prompt="What are the differences in the conclusions of these two papers: https://arxiv.org/abs/2401.0001 and https://arxiv.org/abs/2401.0002?")
```


## 重要注意事項

- **URL 處理：** `web_fetch` 仰賴 Gemini API 存取和處理指定 URL 的能力。
- **輸出品質：** 輸出內容的品質取決於提示中指令的清晰度。
