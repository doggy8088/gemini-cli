# Gemini CLI 中的沙箱（Sandboxing）功能

本文件提供 Gemini CLI 中沙箱功能的指南，內容包含先決條件、快速入門與設定。

## 先決條件

在使用沙箱功能之前，您需要安裝並設定 Gemini CLI：

```bash
# install gemini-cli with npm
npm install -g @google/gemini-cli

# Verify installation
gemini --version
```

## 沙箱功能總覽

沙箱功能可將潛在的危險操作（例如 shell 指令或檔案修改）與您的主機系統隔離，在 AI 操作與您的環境之間提供一道安全屏障。

沙箱功能的優點包括：

- **安全性**：防止意外的系統損壞或資料遺失。
- **隔離性**：將檔案系統的存取權限限制在專案目錄內。
- **一致性**：確保在不同系統上都能有一致且可重現的環境。
- **安全**：在處理不受信任的程式碼或實驗性指令時降低風險。

## 沙箱方法

您理想的沙箱方法可能會因您的平台和偏好的容器解決方案而異。

### 1. macOS Seatbelt（僅限 macOS）

使用 `sandbox-exec` 的輕量級內建沙箱功能。

**預設設定檔**：`permissive-open` - 限制在專案目錄外的寫入，但允許大多數其他操作。

### 2. 基於容器（Docker/Podman）

具有完整程序隔離的跨平台沙箱功能。

**注意**：需要於本機建構沙箱映像檔，或使用您組織註冊中心發布的映像檔。

## 快速入門

```bash
# 使用指令旗標啟用沙箱功能
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

### 啟用沙箱功能（依優先順序）

1. **指令旗標**：`-s` 或 `--sandbox`
2. **環境變數**：`GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **設定檔**：在 `settings.json` 中設定 `"sandbox": true`

### macOS Seatbelt 設定檔

內建設定檔（透過 `SEATBELT_PROFILE` 環境變數設定）：

- `permissive-open` (預設)：寫入限制，允許網路連線
- `permissive-closed`：寫入限制，無網路連線
- `permissive-proxied`：寫入限制，透過代理伺服器連線網路
- `restrictive-open`：嚴格限制，允許網路連線
- `restrictive-closed`：最大程度限制

## Linux UID/GID 處理

沙箱會自動處理 Linux 上的使用者權限。若要覆寫這些權限，請使用：

```bash
export SANDBOX_SET_UID_GID=true   # 強制使用主機 UID/GID
export SANDBOX_SET_UID_GID=false  # 停用 UID/GID 對應
```

## 疑難排解

### 常見問題

**「操作不允許」（Operation not permitted）**

- 操作需要沙箱外的存取權限。
- 嘗試使用更寬鬆的設定檔或新增掛載點。

**缺少指令**

- 新增至自訂的 Dockerfile。
- 透過 `sandbox.bashrc` 安 zentral。

**網路問題**

- 檢查沙箱設定檔是否允許網路連線。
- 驗證代理伺服器設定。

### 偵錯模式

```bash
DEBUG=1 gemini -s -p "debug command"
```

### 檢查沙箱

```bash
# 檢查環境
gemini -s -p "run shell command: env | grep SANDBOX"

# 列出掛載點
gemini -s -p "run shell command: mount | grep workspace"
```

## 安全性注意事項

- 沙箱功能可降低但無法完全消除所有風險。
- 使用可完成工作中最嚴格的設定檔。
- 首次建構後，容器的額外負擔極小。
- GUI 應用程式可能無法在沙箱中運作。

## 相關文件

- [設定](./cli/configuration.md)：完整的設定選項。
- [指令](./cli/commands.md)：可用的指令。
- [疑難排解](./troubleshooting.md)：一般疑難排解。
