# 沙盒功能

本文件提供 Gemini CLI 中沙盒的指南，包括先決條件、快速入門和設定。

## 先決條件

在使用沙盒之前，您需要安裝和設定 Gemini CLI：

```bash
# 使用 npm 安裝 gemini-cli
npm install -g @google/gemini-cli

# 驗證安裝
gemini --version
```

## 沙盒總覽

沙盒會將潛在的危險操作（例如 shell 指令或檔案修改）與您的主機系統隔離，在 AI 操作和您的環境之間提供一道安全屏障。

沙盒的優點包括：

- **安全性**：防止意外的系統損壞或資料遺失。
- **隔離**：將檔案系統存取限制在專案目錄中。
- **一致性**：確保在不同系統中可重現的環境。
- **安全性**：降低使用不受信任的程式碼或實驗性指令時的風險。

## 沙盒方法

您理想的沙盒方法可能會因您的平台和偏好的容器解決方案而異。

### 1. macOS Seatbelt (僅限 macOS)

使用 `sandbox-exec` 的輕量級內建沙盒。

**預設設定檔**：`permissive-open` - 限制在專案目錄外的寫入，但允許大多數其他操作。

### 2. 基於容器 (Docker/Podman)

具有完整程序隔離的跨平台沙盒。

**注意**：需要本機建置沙盒映像檔或使用您組織註冊中心發布的映像檔。

## 快速入門

```bash
# 使用指令旗標啟用沙盒
gemini -s -p "analyze the code structure"

# 使用環境變數
export GEMINI_SANDBOX=true
gemini -p "run the test suite"

# 在 settings.json 中設定
{
  "sandbox": "docker"
}
```

## 設定

### 啟用沙盒（依優先順序）

1. **指令旗標**：`-s` 或 `--sandbox`
2. **環境變數**：`GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **設定檔**：在 `settings.json` 中設定 `"sandbox": true`

### macOS Seatbelt 設定檔

內建設定檔（透過 `SEATBELT_PROFILE` 環境變數設定）：

- `permissive-open`（預設）：寫入限制，允許網路
- `permissive-closed`：寫入限制，無網路
- `permissive-proxied`：寫入限制，透過代理伺服器連接網路
- `restrictive-open`：嚴格限制，允許網路
- `restrictive-closed`：最大限制

## Linux UID/GID 處理

沙盒會自動處理 Linux 上的使用者權限。使用以下指令覆寫這些權限：

```bash
export SANDBOX_SET_UID_GID=true   # 強制使用主機的 UID/GID
export SANDBOX_SET_UID_GID=false  # 停用 UID/GID 對應
```

## 疑難排解

### 常見問題

**"不允許的操作"**

- 操作需要存取沙盒外部。
- 嘗試使用更寬鬆的設定檔或新增掛載點。

**缺少指令**

- 新增至自訂 Dockerfile。
- 透過 `sandbox.bashrc` 安裝。

**網路問題**

- 檢查沙盒設定檔是否允許網路。
- 驗證代理伺服器設定。

### 偵錯模式

```bash
DEBUG=1 gemini -s -p "debug command"
```

### 檢查沙盒

```bash
# 檢查環境
gemini -s -p "run shell command: env | grep SANDBOX"

# 列出掛載點
gemini -s -p "run shell command: mount | grep workspace"
```

## 安全性注意事項

- 沙盒可降低但無法完全消除所有風險。
- 使用允許您工作的最嚴格設定檔。
- 首次建置後，容器的額外負荷極小。
- 圖形化使用者介面應用程式可能無法在沙盒中運作。

## 相關文件

- [設定](./cli/configuration.md)：完整的設定選項。
- [指令](./cli/commands.md)：可用的指令。
- [疑難排解](./troubleshooting.md)：一般疑難排解。