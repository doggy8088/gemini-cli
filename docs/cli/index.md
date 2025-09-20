# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是用戶與 Gemini AI 模型及其相關工具互動（發送與接收提示）的前端介面。若需 Gemini CLI 的整體介紹，請參閱 [主文件頁面](../index.md)。

## 本節導覽

- **[驗證](./authentication.md)：** 設定 Google AI 服務驗證的指南。
- **[指令](./commands.md)：** Gemini CLI 指令參考（例如：`/help`、`/tools`、`/theme`）。
- **[設定](./configuration.md)：** 使用設定檔自訂 Gemini CLI 行為的指南。
- **[企業版](./enterprise.md)：** 企業設定指南。
- **[無頭模式](../headless.md)：** 以程式化方式（用於腳本與自動化）操作 Gemini CLI 的完整指南。
- **[Token 快取](./token-caching.md)：** 透過 Token 快取最佳化 API 成本。
- **[主題](./themes.md)**：自訂 CLI 外觀主題的指南。
- **[教學](tutorials.md)**：示範如何使用 Gemini CLI 自動化開發任務的教學。

## 非互動模式

Gemini CLI 可在非互動模式下執行，非常適合用於腳本（script）與自動化。在此模式下，你可以將輸入透過管線傳送給 CLI，CLI 執行指令後即結束。

以下範例展示如何從終端機將指令透過管線傳送給 Gemini CLI：

```bash
echo "What is fine tuning?" | gemini
```

你也可以使用 `--prompt` 或 `-p` 旗標 (flags)：

```bash
gemini -p "What is fine tuning?"
```

如需有關無頭模式（headless usage）、腳本（scripting）、自動化（automation）及進階範例的完整文件，請參閱 **[Headless Mode](../headless.md)** 指南。
