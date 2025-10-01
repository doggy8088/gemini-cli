# 卸載命令列介面 (CLI)

您的卸載方式取決於您執行 Gemini CLI 的方式。請依照 npx 或全域 npm 安裝的指示操作。

## 方法一：使用 npx

npx 會從暫存快取中執行套件，並不會永久安裝。若要「卸載」 Gemini CLI，您必須清除這個快取，這將會移除 gemini-cli 以及先前透過 npx 執行過的所有其他套件。

npx 的快取是一個名為 `_npx` 的目錄，位於您的主要 npm 快取資料夾內。您可以透過執行 `npm config get cache` 來查詢您的 npm 快取路徑。

**適用於 macOS / Linux**

```bash
# The path is typically ~/.npm/_npx
rm -rf "$(npm config get cache)/_npx"
```

**適用於 Windows**

_命令提示字元_

```cmd
:: The path is typically %LocalAppData%\npm-cache\_npx
rmdir /s /q "%LocalAppData%\npm-cache\_npx"
```

_PowerShell_

```powershell
# The path is typically $env:LocalAppData\npm-cache\_npx
Remove-Item -Path (Join-Path $env:LocalAppData "npm-cache\_npx") -Recurse -Force
```

## 方法 2：使用 npm（全域安裝）

如果你是以全域方式安裝 Gemini CLI（例如：`npm install -g @google/gemini-cli`），請使用 `npm uninstall` 指令搭配 `-g` 旗標來移除它。

```bash
npm uninstall -g @google/gemini-cli
```

此指令會將該套件從您的系統中完全移除。
