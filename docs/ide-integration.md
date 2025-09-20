# IDE 整合

Gemini CLI 可以與你的 IDE 整合，提供更無縫且具情境感知的體驗。這項整合讓命令列介面 (Command Line Interface) 能更深入理解你的 workspace，並啟用如原生編輯器內 diff 檢視等強大功能。

目前唯一支援的 IDE 為 [Visual Studio Code](https://code.visualstudio.com/) 及其他支援 VS Code 擴充套件的編輯器。如需為其他編輯器建立支援，請參閱 [IDE Companion Extension Spec](./ide-companion-spec.md)。

## 功能特色

- **Workspace 情境感知：** CLI 會自動獲取你的 workspace 狀態，以提供更相關且精確的回應。這些情境包含：
  - 你 workspace 中**最近存取的 10 個檔案**。
  - 你目前的游標位置。
  - 你所選取的文字（上限 16KB，超過將被截斷）。

- **原生 Diff 檢視：** 當 Gemini 建議程式碼修改時，你可以直接在 IDE 的原生 diff 檢視器中查看變更，讓你能無縫地審查、編輯並接受或拒絕建議的變更。

- **VS Code 指令：** 你可以直接從 VS Code 指令面板（`Cmd+Shift+P` 或 `Ctrl+Shift+P`）存取 Gemini CLI 功能：
  - `Gemini CLI: Run`：在整合式終端機啟動新的 Gemini CLI 工作階段。
  - `Gemini CLI: Accept Diff`：在作用中的 diff 編輯器中接受變更。
  - `Gemini CLI: Close Diff Editor`：拒絕變更並關閉作用中的 diff 編輯器。
  - `Gemini CLI: View Third-Party Notices`：顯示此擴充套件的第三方授權聲明。

## 安裝與設定

你可以透過三種方式完成 IDE 整合的設定：

### 1. 自動提示（推薦）

當你在支援的編輯器中執行 Gemini CLI 時，系統會自動偵測你的環境並提示你是否要連線。選擇「是」後，系統會自動執行必要的設定，包括安裝 IDE companion 擴充功能並啟用連線。

### 2. 透過 CLI 手動安裝

如果你先前關閉了提示，或想要手動安裝擴充功能，可以在 Gemini CLI 內執行以下指令：

```
/ide install
```

這將會自動尋找並安裝適用於你 IDE 的正確擴充套件。

### 3. 從 Marketplace 手動安裝

你也可以直接從 marketplace 手動安裝擴充套件。

- **針對 Visual Studio Code：** 請從 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=google.gemini-cli-vscode-ide-companion) 安裝。
- **針對 VS Code 分支版本：** 為了支援 VS Code 的分支版本，該擴充套件也已發佈在 [Open VSX Registry](https://open-vsx.org/extension/google/gemini-cli-vscode-ide-companion)。請依照你的編輯器說明，從此 registry 安裝擴充套件。

> 注意：
> 「Gemini CLI Companion」擴充套件可能會出現在搜尋結果的下方。如果你沒有立即看到，請嘗試向下捲動或以「最新發佈」排序。
>
> 手動安裝擴充套件後，你必須在命令列介面 (Command Line Interface) 中執行 `/ide enable` 來啟用整合。

## 使用方式

### 啟用與停用

你可以透過命令列介面 (Command Line Interface) 控制 IDE 整合：

- 若要啟用與 IDE 的連線，請執行：
  ```
  /ide enable
  ```
- 若要停用連線，請執行：
  ```
  /ide disable
  ```

啟用後，Gemini CLI 會自動嘗試連接至 IDE companion 擴充功能。

### 檢查狀態

若要檢查連線狀態並查看 Gemini CLI 從 IDE 接收到的 context，請執行：

```
/ide status
```

如果已連線，此指令會顯示目前連線的 IDE 以及它所知的最近開啟檔案清單。

（注意：檔案清單僅限於 workspace 內最近存取的 10 個檔案，且只包含本機磁碟上的檔案。）

### 使用 Diff 檢視

當你要求 Gemini 修改檔案時，它可以直接在你的編輯器中開啟 diff 檢視。

**若要接受 diff**，你可以採取以下任一動作：

- 點擊 diff 編輯器標題列上的**勾選圖示**。
- 儲存檔案（例如使用 `Cmd+S` 或 `Ctrl+S`）。
- 開啟 Command Palette 並執行 **Gemini CLI: Accept Diff**。
- 在 CLI 提示時回覆 `yes`。

**若要拒絕 diff**，你可以：

- 點擊 diff 編輯器標題列上的**「x」圖示**。
- 關閉 diff 編輯器分頁。
- 開啟 Command Palette 並執行 **Gemini CLI: Close Diff Editor**。
- 在 CLI 提示時回覆 `no`。

你也可以在接受前，直接於 diff 檢視中**修改建議的變更**。

如果你在 CLI 中選擇「Yes, allow always」，之後的變更將自動接受，不會再於 IDE 中顯示。

## 搭配沙箱機制（Sandboxing）使用

如果你在沙箱中使用 Gemini CLI，請注意下列事項：

- **在 macOS 上：** IDE 整合需要網路存取權，以便與 IDE companion 擴充功能通訊。你必須使用允許網路存取的 Seatbelt 設定檔。
- **在 Docker 容器中：** 若你在 Docker（或 Podman）容器內執行 Gemini CLI，IDE 整合仍可連線到你主機上執行的 VS Code 擴充功能。CLI 已設定自動在 `host.docker.internal` 尋找 IDE 伺服器。通常不需特別設定，但你可能需要確保 Docker 網路設定允許容器連線到主機。

## 疑難排解

如果你在 IDE 整合過程中遇到問題，以下是一些常見錯誤訊息及其解決方式。

### 連線錯誤

- **訊息：** `🔴 Disconnected: Failed to connect to IDE companion extension in [IDE Name]. Please ensure the extension is running. To install the extension, run /ide install.`
  - **原因：** Gemini CLI 找不到連線 IDE 所需的環境變數（`GEMINI_CLI_IDE_WORKSPACE_PATH` 或 `GEMINI_CLI_IDE_SERVER_PORT`）。這通常表示 IDE companion 擴充功能未執行或初始化失敗。
  - **解決方式：**
    1. 請確認你已在 IDE 中安裝並啟用 **Gemini CLI Companion** 擴充功能。
    2. 在 IDE 中開啟新的終端機視窗，以確保載入正確的環境變數。

- **訊息：** `🔴 Disconnected: IDE connection error. The connection was lost unexpectedly. Please try reconnecting by running /ide enable`
  - **原因：** 與 IDE companion 的連線中斷。
  - **解決方式：** 執行 `/ide enable` 嘗試重新連線。若問題持續，請開啟新的終端機視窗或重新啟動 IDE。

### 設定錯誤

- **訊息：** `🔴 Disconnected: Directory mismatch. Gemini CLI is running in a different location than the open workspace in [IDE Name]. Please run the CLI from one of the following directories: [List of directories]`
  - **原因：** CLI 目前的工作目錄不在你 IDE 開啟的 workspace 內。
  - **解決方式：** `cd` 到與 IDE 開啟相同的目錄，並重新啟動 CLI。

- **訊息：** `🔴 Disconnected: To use this feature, please open a workspace folder in [IDE Name] and try again.`
  - **原因：** 你的 IDE 沒有開啟任何 workspace。
  - **解決方式：** 在 IDE 中開啟 workspace，並重新啟動 CLI。

### 一般錯誤

- **訊息：** `IDE integration is not supported in your current environment. To use this feature, run Gemini CLI in one of these supported IDEs: [List of IDEs]`
  - **原因：** 你在非支援的 IDE 的終端機或環境中執行 Gemini CLI。
  - **解決方式：** 請從支援的 IDE（如 VS Code）的整合終端機執行 Gemini CLI。

- **訊息：** `No installer is available for IDE. Please install the Gemini CLI Companion extension manually from the marketplace.`
  - **原因：** 你執行了 `/ide install`，但 CLI 尚未針對你的特定 IDE 提供自動安裝程式。
  - **解決方式：** 請開啟你的 IDE 擴充套件市集，搜尋「Gemini CLI Companion」，並[手動安裝](#3-從-marketplace-手動安裝)。
