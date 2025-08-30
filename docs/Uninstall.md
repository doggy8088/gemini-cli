# 解除安裝 CLI

您的解除安裝方法取決於您如何執行 CLI。請依照 npx 或全域 npm 安裝的說明進行操作。

## 方法 1：使用 npx

npx 從暫存快取中執行套件，而不進行永久安裝。要「解除安裝」CLI，您必須清除此快取，這將移除 gemini-cli 和先前使用 npx 執行的任何其他套件。

npx 快取是您主要 npm 快取資料夾內名為 `_npx` 的目錄。您可以透過執行 `npm config get cache` 來尋找您的 npm 快取路徑。

**對於 macOS / Linux**

```bash
# 路徑通常是 ~/.npm/_npx
rm -rf "$(npm config get cache)/_npx"
```

**對於 Windows**

_命令提示字元_

```cmd
:: 路徑通常是 %LocalAppData%\npm-cache\_npx
rmdir /s /q "%LocalAppData%\npm-cache\_npx"
```

_PowerShell_

```powershell
# 路徑通常是 $env:LocalAppData\npm-cache\_npx
Remove-Item -Path (Join-Path $env:LocalAppData "npm-cache\_npx") -Recurse -Force
```

## 方法 2：使用 npm（全域安裝）

如果您全域安裝了 CLI（例如 `npm install -g @google/gemini-cli`），請使用 `npm uninstall` 指令搭配 `-g` 旗標來移除它。

```bash
npm uninstall -g @google/gemini-cli
```

此指令會完全從您的系統中移除套件。
