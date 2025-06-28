# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是一個前端工具，讓使用者可以透過 Gemini AI 模型及其相關工具來傳送和接收提示。關於 Gemini CLI 的一般性總覽，請參閱 [主文件頁面](../index.md)。

## 導覽本節

- **[驗證](./authentication.md):** 一份設定與 Google AI 服務進行驗證的指南。
- **[指令](./commands.md):** Gemini CLI 指令的參考資料（例如：`/help`、`/tools`、`/theme`）。
- **[組態設定](./configuration.md):** 一份透過組態設定檔來客製化 Gemini CLI 行為的指南。
- **[權杖快取](./token-caching.md):** 透過權杖快取來優化 API 成本。
- **[主題](./themes.md)**: 一份透過不同主題來自訂 CLI 外觀的指南。
- **[指南](tutorials.md)**: 一份展示如何使用 Gemini CLI 自動化開發任務的指南。

## 非互動模式
Gemini CLI 可以在非互動模式下執行，這對於腳本自動化和自動化作業相當有用。在此模式下，您可以將輸入透過管線 (pipe) 傳遞給 CLI，CLI 會執行指令，然後結束。

以下範例是從您的終端機透過管線將指令傳遞給 Gemini CLI：

```bash
echo "什麼是微調？" | gemini
```

Gemini CLI 會執行該指令並將輸出結果印在您的終端機上。請注意，您也可以使用 `--prompt` 或 `-p` 旗標來達到相同的效果。例如：

```bash
gemini -p "什麼是微調？"
```
