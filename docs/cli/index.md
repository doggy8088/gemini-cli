# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是供使用者與 Gemini AI 模型及其相關工具傳送和接收提示的前端。如需 Gemini CLI 的一般總覽，請參閱[主要說明文件頁面](../index.md)。

## 導覽本節

- **[驗證](./authentication.md)**：設定 Google AI 服務驗證的指南。
- **[指令](./commands.md)**：Gemini CLI 指令的參考（例如，`/help`、`/tools`、`/theme`）。
- **[設定](./configuration.md)**：使用設定檔案調整 Gemini CLI 行為的指南。
- **[企業版](./enterprise.md)**：企業版設定指南。
- **[權杖快取](./token-caching.md)**：透過權杖快取最佳化 API 成本。
- **[主題](./themes.md)**：使用不同主題自訂 CLI 外觀的指南。
- **[教學課程](tutorials.md)**：示範如何使用 Gemini CLI 自動化開發任務的教學課程。

## 非互動模式

Gemini CLI 可以在非互動模式下執行，這對於指令碼編寫和自動化很有用。在此模式下，您將輸入傳送到 CLI，它執行指令，然後退出。

以下範例從您的終端機將指令傳送到 Gemini CLI：

```bash
echo "What is fine tuning?" | gemini
```

Gemini CLI 執行指令並將輸出列印到您的終端機。請注意，您可以使用 `--prompt` 或 `-p` 旗標達到相同的行為。例如：

```bash
gemini -p "What is fine tuning?"
```
