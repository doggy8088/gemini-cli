# 解除安裝 CLI

您的解除安裝方法取決於您如何執行 CLI。請依照 npx 或全域 npm 安裝的指示進行。

## 方法一：使用 npx

npx 會從暫存快取中執行套件，而不會永久安裝。若要「解除安裝」CLI，您必須清除此快取，這會移除 gemini-cli 和先前使用 npx 執行的任何其他套件。

npx 快取是位於您主要 npm 快取資料夾中名為 `_npx` 的目錄。您可以執行 `npm config get cache` 來尋找您的 npm 快取路徑。

**適用於 macOS / Linux**

```bash
# 路徑通常是 ~/.npm/_npx
rm -rf "$(npm config get cache)/_npx"
```

**適用於 Windows**

_命令提示字元_

```batch
:: 路徑通常是 %LocalAppData%\npm-cache\_npx
rmdir /s /q "%LocalAppData%\npm-cache\_npx"
```

_PowerShell_

```powershell
# 路徑通常是 $env:LocalAppData\npm-cache\_npx
Remove-Item -Path (Join-Path $env:LocalAppData "npm-cache\_npx") -Recurse -Force
```

## 方法二：使用 npm (全域安裝)

如果您是全域安裝 CLI (例如 `npm install -g @google/gemini-cli`)，請使用 `npm uninstall` 指令搭配 `-g` 旗標來移除它。

```bash
npm uninstall -g @google/gemini-cli
```

此指令會將套件從您的系統中完全移除。