# IDE 整合

Gemini CLI 可以與您的 IDE 整合，提供更無縫且具備情境感知的體驗。這項整合讓 CLI 能更深入理解您的 workspace，並啟用如原生編輯器內差異比對（diffing）等強大功能。

目前唯一支援的 IDE 為 [Visual Studio Code](https://code.visualstudio.com/) 以及其他支援 VS Code 擴充功能的編輯器。若需為其他編輯器建立支援，請參閱 [IDE Companion Extension Spec](./ide-companion-spec.md)。

## 功能特色

- **Workspace 情境感知：** CLI 會自動獲取您的 workspace 狀態，以提供更相關且精確的回應。這些情境包含：
  - 您 workspace 中**最近存取的 10 個檔案**。
  - 您目前的游標位置。
  - 您所選取的文字（上限 16KB，超過部分將被截斷）。

- **原生差異比對（Native Diffing）：** 當 Gemini 建議程式碼修改時，您可以直接在 IDE 的原生差異檢視器中查看變更。這讓您能無縫審查、編輯，以及接受或拒絕建議的變更。

- **VS Code 指令：** 您可以直接從 VS Code 指令面板（`Cmd+Shift+P` 或 `Ctrl+Shift+P`）存取 Gemini CLI 的功能：
  - `Gemini CLI: Run`：在整合終端機中啟動新的 Gemini CLI 工作階段。
  - `Gemini CLI: Accept Diff`：在作用中的差異編輯器中接受變更。
  - `Gemini CLI: Close Diff Editor`：拒絕變更並關閉作用中的差異編輯器。
  - `Gemini CLI: View Third-Party Notices`：顯示此擴充功能的第三方授權聲明。

## 安裝與設定

您可以透過以下三種方式設定 IDE 整合：

### 1. 自動提示（建議使用）

當您在支援的編輯器中執行 Gemini CLI 時，系統會自動偵測您的環境並提示您進行連線。選擇「是」後，系統會自動執行必要的設定，包括安裝 companion 擴充功能並啟用連線。

### 2. 透過 CLI 手動安裝

若您先前關閉了提示，或希望手動安裝擴充功能，您可以在 Gemini CLI 中執行以下指令：

```
/ide install
```

這將會為您的 IDE 找到正確的擴充功能並進行安裝。

### 3. 從 Marketplace 手動安裝

您也可以直接從 marketplace 安裝擴充功能。

- **針對 Visual Studio Code：** 請從 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=google.gemini-cli-vscode-ide-companion) 安裝。
- **針對 VS Code 分支版本：** 為了支援 VS Code 的分支版本，該擴充功能也已發佈在 [Open VSX Registry](https://open-vsx.org/extension/google/gemini-cli-vscode-ide-companion)。請依照您的編輯器指示，從此 registry 安裝擴充功能。

> 注意：
> 「Gemini CLI Companion」擴充功能可能會出現在搜尋結果的較下方。如果您沒有立即看到它，請嘗試向下捲動或以「新發佈」排序。
>
> 手動安裝擴充功能後，您必須在命令列介面 (CLI) 中執行 `/ide enable` 以啟用整合。

## 使用方式

### 啟用與停用

您可以直接在命令列介面 (CLI) 中控制 IDE 整合：

- 若要啟用與 IDE 的連接，請執行：
  ```
  /ide enable
  ```
- 若要停用連線，請執行：
  ```
  /ide disable
  ```

啟用後，Gemini CLI 會自動嘗試連接至 IDE companion 擴充功能。

### 檢查狀態

若要檢查連線狀態並查看命令列介面 (CLI) 從 IDE 接收到的 context，請執行：

```
/ide status
```

如果已連線，這個指令會顯示目前連線的 IDE，以及它所知道的最近開啟檔案清單。

（注意：檔案清單僅限於 workspace 內最近存取的 10 個檔案，且只包含本機磁碟上的檔案。）

### 使用 Diff 檢視

當你請 Gemini 修改檔案時，它可以直接在你的編輯器中開啟 diff 檢視。

**要接受 diff**，你可以執行以下任一動作：

- 點擊 diff 編輯器標題列上的**勾勾圖示**。
- 儲存檔案（例如使用 `Cmd+S` 或 `Ctrl+S`）。
- 開啟命令選單（Command Palette），執行 **Gemini CLI: Accept Diff**。
- 在命令列介面 (CLI) 提示時回覆 `yes`。

**要拒絕 diff**，你可以：

- 點擊 diff 編輯器標題列上的**「x」圖示**。
- 關閉 diff 編輯器分頁。
- 開啟命令選單（Command Palette），執行 **Gemini CLI: Close Diff Editor**。
- 在命令列介面 (CLI) 提示時回覆 `no`。

你也可以在接受前，直接於 diff 檢視中**修改建議的變更**。

如果你在命令列介面 (CLI) 選擇「Yes, allow always」，之後的變更將會自動接受，不再於 IDE 顯示。

## 搭配沙箱機制 (Sandboxing) 使用

如果你在沙箱環境中使用 Gemini CLI，請注意下列事項：

- **在 macOS 上：** IDE 整合需要網路存取權限，以便與 IDE companion 擴充功能通訊。你必須使用允許網路存取的 Seatbelt 設定檔。
- **在 Docker 容器中：** 如果你在 Docker（或 Podman）容器內執行 Gemini CLI，IDE 整合仍可連線至你主機上執行的 VS Code 擴充功能。CLI 已預設自動尋找 `host.docker.internal` 上的 IDE 伺服器。通常不需特別設定，但你可能需要確保 Docker 網路設置允許容器連線至主機。

## 疑難排解

若你遇到 IDE 整合相關問題，以下是一些常見錯誤訊息及解決方法。

### 連線錯誤

- **訊息：** `🔴 Disconnected: Failed to connect to IDE companion extension in [IDE Name]. Please ensure the extension is running. To install the extension, run /ide install.`
  - **原因：** Gemini CLI 找不到連線 IDE 所需的環境變數（`GEMINI_CLI_IDE_WORKSPACE_PATH` 或 `GEMINI_CLI_IDE_SERVER_PORT`）。通常代表 IDE companion 擴充功能未執行或初始化失敗。
  - **解決方法：**
    1. 請確認你已在 IDE 安裝並啟用 **Gemini CLI Companion** 擴充功能。
    2. 在 IDE 中開啟新的終端機視窗，以確保載入正確的環境變數。

- **訊息：** `🔴 Disconnected: IDE connection error. The connection was lost unexpectedly. Please try reconnecting by running /ide enable`
  - **原因：** 與 IDE companion 的連線中斷。
  - **解決方法：** 執行 `/ide enable` 嘗試重新連線。如果問題持續，請開啟新的終端機視窗或重新啟動 IDE。

### 設定錯誤

- **訊息：** `🔴 Disconnected: Directory mismatch. Gemini CLI is running in a different location than the open workspace in [IDE Name]. Please run the CLI from one of the following directories: [List of directories]`
  - **原因：** CLI 目前的工作目錄不在你 IDE 開啟的 workspace 內。
  - **解決方法：** 請 `cd` 到與 IDE 開啟相同的目錄，並重新啟動 CLI。

- **訊息：** `🔴 Disconnected: To use this feature, please open a workspace folder in [IDE Name] and try again.`
  - **原因：** 你的 IDE 尚未開啟任何 workspace。
  - **解決方法：** 請在 IDE 中開啟 workspace，並重新啟動 CLI。

### 一般錯誤

- **訊息：** `IDE integration is not supported in your current environment. To use this feature, run Gemini CLI in one of these supported IDEs: [List of IDEs]`
  - **原因：** 你在非支援的 IDE 的終端機或環境中執行 Gemini CLI。
  - **解決方法：** 請於支援的 IDE（如 VS Code）內建終端機執行 Gemini CLI。

- **訊息：** `No installer is available for IDE. Please install the Gemini CLI Companion extension manually from the marketplace.`
  - **原因：** 你執行了 `/ide install`，但 CLI 尚未支援你特定 IDE 的自動安裝程式。
  - **解決方法：** 請開啟 IDE 的擴充功能市集，搜尋「Gemini CLI Companion」，並[手動安裝](#3-manual-installation-from-a-marketplace)。
