# Gemini CLI 中的沙箱化

本文件提供 Gemini CLI 中沙箱化的指南，包括先決條件、快速入門和設定。

## 先決條件

在使用沙箱化之前，您需要安裝和設定 Gemini CLI：

```bash
npm install -g @google/gemini-cli
```

驗證安裝

```bash
gemini --version
```

## 沙箱化總覽

沙箱化將潛在危險的操作（如 Shell 指令或檔案修改）與您的主機系統隔離，在 AI 操作和您的環境之間提供安全屏障。

沙箱化的好處包括：

- **安全性**：防止意外的系統損壞或資料遺失。
- **隔離**：限制檔案系統存取到專案目錄。
- **一致性**：確保在不同系統間的可重現環境。
- **安全**：在處理不信任程式碼或實驗性指令時降低風險。

## 沙箱化方法

您理想的沙箱化方法可能因您的平台和偏好的容器解決方案而有所不同。

### 1. macOS Seatbelt（僅限 macOS）

使用 `sandbox-exec` 的輕量級內建沙箱化。

**預設設定檔**：`permissive-open` - 限制專案目錄外的寫入，但允許大多數其他操作。

### 2. 基於容器（Docker/Podman）

具有完全程序隔離的跨平台沙箱化。

**注意**：需要在本地建置沙箱映像或使用組織註冊表中的已發布映像。

## 快速入門

```bash
# 使用指令旗標啟用沙箱化
gemini -s -p "analyze the code structure"

# 使用環境變數
export GEMINI_SANDBOX=true
gemini -p "run the test suite"

# 在 settings.json 中設定
{
  "tools": {
    "sandbox": "docker"
  }
}
```

## 設定

### 啟用沙箱化（按優先順序）

1. **指令旗標**：`-s` 或 `--sandbox`
2. **環境變數**：`GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **設定檔案**：在 `settings.json` 檔案的 `tools` 物件中使用 `"sandbox": true`（例如，`{"tools": {"sandbox": true}}`）。

### macOS Seatbelt 設定檔

內建設定檔（透過 `SEATBELT_PROFILE` 環境變數設定）：

- `permissive-open`（預設）：寫入限制，允許網路
- `permissive-closed`：寫入限制，無網路
- `permissive-proxied`：寫入限制，透過代理的網路
- `restrictive-open`：嚴格限制，允許網路
- `restrictive-closed`：最大限制

### 自訂沙箱旗標

對於基於容器的沙箱化，您可以使用 `SANDBOX_FLAGS` 環境變數將自訂旗標注入 `docker` 或 `podman` 指令。這對於進階設定很有用，例如為特定使用案例停用安全功能。

**範例（Podman）**：

要為卷掛載停用 SELinux 標籤，您可以設定以下內容：

```bash
export SANDBOX_FLAGS="--security-opt label=disable"
```

多個旗標可以作為以空格分隔的字串提供：

```bash
export SANDBOX_FLAGS="--flag1 --flag2=value"
```

## Linux UID/GID 處理

沙箱在 Linux 上自動處理使用者權限。使用以下方式覆蓋這些權限：

```bash
export SANDBOX_SET_UID_GID=true   # 強制主機 UID/GID
export SANDBOX_SET_UID_GID=false  # 停用 UID/GID 對應
```

## 疑難排解

### 常見問題

**「Operation not permitted」**

- 操作需要沙箱外的存取。
- 嘗試更寬鬆的設定檔或新增掛載點。

**遺失指令**

- 新增到自訂 Dockerfile。
- 透過 `sandbox.bashrc` 安裝。

**網路問題**

- 檢查沙箱設定檔是否允許網路。
- 驗證代理設定。

### 除錯模式

```bash
DEBUG=1 gemini -s -p "debug command"
```

**注意：** 如果您在專案的 `.env` 檔案中有 `DEBUG=true`，由於自動排除，它不會影響 gemini-cli。使用 `.gemini/.env` 檔案進行 gemini-cli 特定的除錯設定。

### 檢查沙箱

```bash
# 檢查環境
gemini -s -p "run shell command: env | grep SANDBOX"

# 列出掛載
gemini -s -p "run shell command: mount | grep workspace"
```

## 安全性注意事項

- 沙箱化會降低但不會消除所有風險。
- 使用允許您工作的最嚴格設定檔。
- 首次建置後容器負荷微乎其微。
- GUI 應用程式可能無法在沙箱中運作。

## 相關說明文件

- [設定](./cli/configuration.md)：完整設定選項。
- [指令](./cli/commands.md)：可用指令。
- [疑難排解](./troubleshooting.md)：一般疑難排解。
