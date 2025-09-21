# Gemini CLI

在 Gemini CLI 中，`packages/cli` 是用戶與 Gemini AI 模型及其相關工具互動（發送與接收提示）的前端介面。若需 Gemini CLI 的總覽，請參閱 [main documentation page](../index.md)。

## 本節導覽

- **[Authentication](./authentication.md)：** 設定 Google AI 服務驗證的指南。
- **[Commands](./commands.md)：** Gemini CLI 指令參考（例如：`/help`、`/tools`、`/theme`）。
- **[Configuration](./configuration.md)：** 透過設定檔自訂 Gemini CLI 行為的指南。
- **[Enterprise](./enterprise.md)：** 企業級設定指南。
- **[Headless Mode](../headless.md)：** 以程式化方式進行腳本與自動化的 Gemini CLI 使用完整指南。
- **[Token Caching](./token-caching.md)：** 透過 Token 快取最佳化 API 成本。
- **[Themes](./themes.md)**：自訂 CLI 外觀佈景主題的指南。
- **[Tutorials](tutorials.md)**：示範如何利用 Gemini CLI 自動化開發任務的教學。

## 非互動模式

Gemini CLI 支援非互動模式，適合用於腳本（script）與自動化。在此模式下，你可以將輸入資料導入 CLI，CLI 執行指令後即結束。

以下範例展示如何在終端機將指令導入 Gemini CLI：

```bash
echo "What is fine tuning?" | gemini
```

你也可以使用 `--prompt` 或 `-p` 旗標 (flags)：

```bash
gemini -p "What is fine tuning?"
```

如需有關無頭模式（headless usage）、腳本（scripting）、自動化（automation）及進階範例的完整文件，請參閱 **[Headless Mode](../headless.md)** 指南。
