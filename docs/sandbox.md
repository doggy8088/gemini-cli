# Gemini CLI 的沙箱機制

本文件提供 Gemini CLI 沙箱機制的指南，包括先決條件、快速入門以及設定方式。

## 先決條件

在使用沙箱機制之前，您需要安裝並設定 Gemini CLI：

```bash
npm install -g @google/gemini-cli
```

驗證安裝是否成功

```bash
gemini --version
```

## 沙箱機制概覽

沙箱機制（sandboxing）可將具有潛在危險性的操作（例如 shell 指令或檔案修改）與您的主機系統隔離，為 AI 操作與您的環境之間提供一層安全防護。

沙箱機制的優點包括：

- **安全性**：防止意外損壞系統或資料遺失。
- **隔離性**：將檔案系統存取限制於專案目錄。
- **一致性**：確保在不同系統間可重現的環境。
- **安全防護**：在處理不受信任的程式碼或實驗性指令時降低風險。

## 沙箱機制方法

根據您的平台及偏好的容器解決方案，最適合的沙箱機制方法可能有所不同。

### 1. macOS Seatbelt（僅限 macOS）

使用 `sandbox-exec` 的輕量級內建沙箱機制。

**預設設定檔**：`permissive-open` - 限制專案目錄以外的寫入，但允許大多數其他操作。

### 2. 基於容器（Docker/Podman）

跨平台沙箱機制，提供完整的程序隔離。

**注意**：需要在本地建置 sandbox 映像檔，或使用您組織的 registry 中已發佈的映像檔。

## 快速開始

```bash
# Enable sandboxing with command flag
gemini -s -p "analyze the code structure"

# Use environment variable
export GEMINI_SANDBOX=true
gemini -p "run the test suite"

# Configure in settings.json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

## 設定

### 啟用沙箱機制（依優先順序）

1. **命令旗標 (flags)**：`-s` 或 `--sandbox`
2. **環境變數**：`GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **設定檔**：在你的 `settings.json` 檔案中的 `tools` 物件下設定 `"sandbox": true`（例如：`{"tools": {"sandbox": true}}`）。

### macOS Seatbelt profiles

內建 profiles（可透過 `SEATBELT_PROFILE` 環境變數設定）：

- `permissive-open`（預設）：限制寫入，允許網路
- `permissive-closed`：限制寫入，不允許網路
- `permissive-proxied`：限制寫入，僅允許透過 proxy 的網路
- `restrictive-open`：嚴格限制，允許網路
- `restrictive-closed`：最大限制

### 自訂沙箱旗標 (flags)

針對基於容器的沙箱機制，你可以透過 `SANDBOX_FLAGS` 環境變數，將自訂旗標 (flags) 注入到 `docker` 或 `podman` 指令中。這對於進階設定很有用，例如針對特定情境停用某些安全功能。

**範例（Podman）**：

若要在掛載 volume 時停用 SELinux 標記，可以這樣設定：

```bash
export SANDBOX_FLAGS="--security-opt label=disable"
```

可以將多個旗標 (flags) 以空格分隔的字串方式提供：

```bash
export SANDBOX_FLAGS="--flag1 --flag2=value"
```

## Linux UID/GID 處理

sandbox 會自動處理 Linux 上的使用者權限。你可以透過以下方式覆寫這些權限：

```bash
export SANDBOX_SET_UID_GID=true   # Force host UID/GID
export SANDBOX_SET_UID_GID=false  # Disable UID/GID mapping
```

## 疑難排解

### 常見問題

**"Operation not permitted"（不允許的操作）**

- 操作需要存取 sandbox 容器外部的資源。
- 請嘗試使用更寬鬆的設定檔（profile）或新增掛載點（mount points）。

**缺少指令**

- 請加入自訂的 Dockerfile。
- 可透過 `sandbox.bashrc` 安裝。

**網路相關問題**

- 請確認 sandbox 設定檔允許網路存取。
- 檢查 proxy（代理伺服器）設定是否正確。

### 除錯模式

```bash
DEBUG=1 gemini -s -p "debug command"
```

**注意：** 如果你在專案的 `.env` 檔案中有 `DEBUG=true`，由於會自動排除，這不會影響 Gemini CLI。請使用 `.gemini/.env` 檔案來設定 Gemini CLI 專屬的除錯設定。

### 檢查 sandbox

```bash
# Check environment
gemini -s -p "run shell command: env | grep SANDBOX"

# List mounts
gemini -s -p "run shell command: mount | grep workspace"
```

## 安全性注意事項

- 沙箱機制（sandboxing）能降低但無法完全消除所有風險。
- 請使用允許您工作所需的最嚴格設定檔（profile）。
- 在首次建置後，sandbox 容器的額外負擔極小。
- GUI 應用程式在沙箱機制下可能無法運作。

## 相關文件

- [Configuration](./cli/configuration.md)：完整的設定選項。
- [Commands](./cli/commands.md)：可用指令。
- [Troubleshooting](./troubleshooting.md)：一般疑難排解。
