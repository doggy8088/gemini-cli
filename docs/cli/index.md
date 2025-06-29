# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是使用者用來傳送和接收來自 Gemini AI 模型及其相關工具的提示的前端。如需 Gemini CLI 的一般概觀，請參閱[主要文件頁面](../index.md)。

## 導覽本節

- **[驗證](./authentication.md)：** 設定 Google AI 服務驗證的指南。
- **[指令](./commands.md)：** Gemini CLI 指令的參考資料 (例如 `/help`、`/tools`、`/theme`)。
- **[設定](./configuration.md)：** 使用設定檔調整 Gemini CLI 行為的指南。
- **[權杖快取](./token-caching.md)：** 透過權杖快取最佳化 API 成本。
- **[主題](./themes.md)**：自訂 CLI 外觀與不同主題的指南。
- **[教學課程](tutorials.md)**：示範如何使用 Gemini CLI 自動化開發任務的教學課程。

## 非互動模式

Gemini CLI 可以在非互動模式下執行，這對於指令碼和自動化很有用。在此模式下，您將輸入傳送至 CLI，它會執行指令，然後結束。

以下範例將指令從您的終端機傳送至 Gemini CLI：

```bash
echo "什麼是微調？" | gemini
```

Gemini CLI 會執行指令並將輸出列印至您的終端機。請注意，您可以使用 `--prompt` 或 `-p` 旗標來達到相同的行為��例如：

```bash
gemini -p "什麼是微調？"
```
