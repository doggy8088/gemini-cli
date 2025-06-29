# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是使用者用來與 Gemini AI 模型及其相關工具收發提示的介面前端。若想對 Gemini CLI 有個總體了解，請參閱[主文件頁面](../index.md)。

## 導覽本節

- **[驗證](./authentication.md):** 設定 Google AI 服務驗證的指南。
- **[指令](./commands.md):** Gemini CLI 指令的參考（例如：`/help`、`/tools`、`/theme`）。
- **[設定](./configuration.md):** 使用設定檔來客製化 Gemini CLI 行為的指南。
- **[權杖快取](./token-caching.md):** 透過權杖快取來優化 API 成本。
- **[主題](./themes.md)**: 使用不同主題來自訂 CLI 外觀的指南。
- **[指南](tutorials.md)**: 展示如何使用 Gemini CLI 來自動化開發任務的指南。

## 非互動模式

Gemini CLI 可以在非互動模式下執行，這對於腳本編寫和自動化很有用。在此模式下，您可以將輸入透過管線（pipe）傳送至 CLI，CLI 會執行該指令，然後退出。

以下範例從您的終端機透過管線（pipe）將指令傳送至 Gemini CLI：

```bash
echo "什麼是微調？" | gemini
```

Gemini CLI 會執行該指令並將輸出結果印在您的終端機上。請注意，您也可以使用 `--prompt` 或 `-p` 旗標來達到相同的效果。例如：

```bash
gemini -p "什麼是微調？"
```
