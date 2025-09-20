# Gemini CLI 的沙箱機制

本文件提供有關 Gemini CLI 沙箱機制的指南，包括先決條件、快速入門及設定說明。

## 先決條件

在使用沙箱機制之前，您需要安裝並設定 Gemini CLI：

```bash
npm install -g @google/gemini-cli
```

驗證安裝是否成功

```bash
gemini --version
```

## 沙箱機制（Sandboxing）概述

沙箱機制（Sandboxing）可將具有潛在危險性的操作（例如 shell 指令或檔案修改）與您的主機系統隔離，為 AI 操作與您的環境之間提供一層安全防護。

使用沙箱機制的好處包括：

- **安全性**：防止意外造成系統損壞或資料遺失。
- **隔離性**：限制檔案系統存取僅限於專案目錄。
- **一致性**：確保在不同系統間能重現相同的執行環境。
- **安全防護**：在處理不受信任的程式碼或實驗性指令時降低風險。

## 沙箱機制的方法

根據您的作業平台及偏好的容器解決方案，理想的沙箱機制方法可能有所不同。

### 1. macOS Seatbelt（僅限 macOS）

使用 `sandbox-exec` 進行輕量且內建的沙箱機制。

**預設設定檔**：`permissive-open` - 限制專案目錄以外的寫入，但允許大多數其他操作。

### 2. 基於容器的方式（Docker/Podman）

跨平台的沙箱機制，提供完整的程序隔離。

**注意**：需要在本地建置沙箱映像檔，或使用您的組織註冊表中已發佈的映像檔。

## 快速入門

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

### 啟用沙箱（依優先順序）

1. **命令旗標**：`-s` 或 `--sandbox`
2. **環境變數**：`GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **設定檔**：在你的 `settings.json` 檔案的 `tools` 物件中設定 `"sandbox": true`（例如，`{"tools": {"sandbox": true}}`）。

### macOS Seatbelt 配置檔

內建配置檔（透過 `SEATBELT_PROFILE` 環境變數設置）：

- `permissive-open`（預設）：限制寫入，允許網路
- `permissive-closed`：限制寫入，不允許網路
- `permissive-proxied`：限制寫入，僅允許透過代理伺服器的網路
- `restrictive-open`：嚴格限制，允許網路
- `restrictive-closed`：最大限制

### 自訂 Sandbox 旗標

針對基於容器的沙箱（sandbox container），你可以透過 `SANDBOX_FLAGS` 環境變數，將自訂旗標注入到 `docker` 或 `podman` 指令中。這對於進階設定非常有用，例如針對特定用途停用安全性功能。

**範例（Podman）**：

若要停用掛載磁碟區時的 SELinux 標記，可以設定如下：

```bash
export SANDBOX_FLAGS="--security-opt label=disable"
```

可以將多個旗標（flag）以空格分隔的字串形式提供：

```bash
export SANDBOX_FLAGS="--flag1 --flag2=value"
```

## Linux UID/GID 處理

sandbox 會自動處理 Linux 上的使用者權限。你可以使用以下方式覆寫這些權限：

```bash
export SANDBOX_SET_UID_GID=true   # Force host UID/GID
export SANDBOX_SET_UID_GID=false  # Disable UID/GID mapping
```

## 疑難排解

### 常見問題

**"Operation not permitted"（操作不允許）**

- 操作需要存取 sandbox 以外的資源。
- 請嘗試使用權限更寬鬆的設定檔，或新增掛載點（mount points）。

**缺少指令**

- 請新增至自訂 Dockerfile。
- 可透過 `sandbox.bashrc` 安裝。

**網路問題**

- 請確認 sandbox 設定檔允許網路存取。
- 請檢查代理伺服器（proxy）設定。

### 除錯模式

```bash
DEBUG=1 gemini -s -p "debug command"
```

**注意：** 如果你在專案的 `.env` 檔案中有 `DEBUG=true`，由於自動排除，這不會影響 Gemini CLI。請使用 `.gemini/.env` 檔案來設定專屬於 Gemini CLI 的除錯設定。

### 檢查 sandbox

```bash
# Check environment
gemini -s -p "run shell command: env | grep SANDBOX"

# List mounts
gemini -s -p "run shell command: mount | grep workspace"
```

## 安全性注意事項

- 沙箱化（Sandboxing）可以降低，但無法完全消除所有風險。
- 請使用允許您工作所需的最嚴格設定檔（profile）。
- 除了首次建置外，sandbox 容器的額外負擔極小。
- 圖形化介面（GUI）應用程式在沙箱中可能無法運作。

## 相關文件

- [Configuration](./cli/configuration.md)：完整的設定選項。
- [Commands](./cli/commands.md)：可用的指令。
- [Troubleshooting](./troubleshooting.md)：一般疑難排解。
