# IDE 整合

Gemini CLI 可以與您的 IDE 整合，提供更無縫和內容感知的體驗。此整合允許 CLI 更好地了解您的工作區，並啟用原生編輯器差異比較等強大功能。

目前，唯一支援的 IDE 是 [Visual Studio Code](https://code.visualstudio.com/) 和其他支援 VS Code 擴充功能的編輯器。

## 功能

- **工作區內容：** CLI 自動獲得您工作區的感知，以提供更相關和準確的回應。此內容包括：
  - 您工作區中**最近存取的 10 個檔案**。
  - 您的作用中游標位置。
  - 您選擇的任何文字（最多 16KB 限制；較長的選擇將被截斷）。

- **原生差異比較：** 當 Gemini 建議程式碼修改時，您可以直接在 IDE 的原生差異檢視器中查看變更。這讓您可以無縫地檢視、編輯並接受或拒絕建議的變更。

- **VS Code 指令：** 您可以直接從 VS Code 指令選擇區（`Cmd+Shift+P` 或 `Ctrl+Shift+P`）存取 Gemini CLI 功能：
  - `Gemini CLI: Run`：在整合終端機中啟動新的 Gemini CLI 工作階段。
  - `Gemini CLI: Accept Diff`：接受作用中差異編輯器中的變更。
  - `Gemini CLI: Close Diff Editor`：拒絕變更並關閉作用中的差異編輯器。
  - `Gemini CLI: View Third-Party Notices`：顯示擴充功能的第三方聲明。

## 安裝與設定

有三種方式可以設定 IDE 整合：

### 1. 自動提示（建議）

當您在支援的編輯器中執行 Gemini CLI 時，它會自動偵測您的環境並提示您連線。回答「是」會自動執行必要的設定，包括安裝配套擴充功能並啟用連線。

### 2. 從 CLI 手動安裝

如果您之前取消了提示或想要手動安裝擴充功能，您可以在 Gemini CLI 內執行以下指令：

```
/ide install
```

這會找到適合您 IDE 的正確擴充功能並安裝。

### 3. 從市集手動安裝

您也可以直接從市集安裝擴充功能。

- **對於 Visual Studio Code：** 從 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=google.gemini-cli-vscode-ide-companion) 安裝。
- **對於 VS Code 分支版本：** 為了支援 VS Code 分支版本，此擴充功能也發佈在 [Open VSX Registry](https://open-vsx.org/extension/google/gemini-cli-vscode-ide-companion) 上。請遵循您編輯器從此註冊表安裝擴充功能的指示。

> 注意：
> "Gemini CLI Companion" 擴充功能可能會出現在搜尋結果的底部。如果您沒有立即看到它，請嘗試向下滾動或按「新發佈」排序。
>
> 手動安裝擴充功能後，您必須在 CLI 中執行 `/ide enable` 來啟用整合。

## 使用方式

### 啟用和停用

您可以從 CLI 內控制 IDE 整合：

- 要啟用與 IDE 的連線，請執行：
  ```
  /ide enable
  ```
- 要停用連線，請執行：
  ```
  /ide disable
  ```

啟用時，Gemini CLI 會自動嘗試連線到 IDE 配套擴充功能。

### 檢查狀態

要檢查連線狀態並查看 CLI 從 IDE 接收到的上下文，請執行：

```
/ide status
```

如果已連線，此指令會顯示它連線的 IDE 以及它知道的最近開啟檔案清單。

（注意：檔案清單限制為工作區內最近存取的 10 個檔案，且僅包含磁碟上的本機檔案。）

### 與差異比較工作

當您要求 Gemini 修改檔案時，它可以直接在您的編輯器中開啟差異檢視。

**要接受差異比較**，您可以執行以下任何動作：

- 點選差異編輯器標題列中的**勾選圖示**。
- 儲存檔案（例如，使用 `Cmd+S` 或 `Ctrl+S`）。
- 開啟指令選擇區並執行 **Gemini CLI: Accept Diff**。
- 在 CLI 提示時回應 `yes`。

**要拒絕差異比較**，您可以：

- 點選差異編輯器標題列中的 **'x' 圖示**。
- 關閉差異編輯器分頁。
- 開啟指令選擇區並執行 **Gemini CLI: Close Diff Editor**。
- 在 CLI 提示時回應 `no`。

您也可以在接受建議變更前，**直接在差異檢視中修改建議的變更**。

如果您在 CLI 中選擇「是，始終允許」，變更將不再出現在 IDE 中，因為它們會被自動接受。

## 與沙箱化一起使用

如果您在沙箱內使用 Gemini CLI，請注意以下事項：

- **在 macOS 上：** IDE 整合需要網路存取權限才能與 IDE 配套擴充功能通訊。您必須使用允許網路存取的 Seatbelt 設定檔。
- **在 Docker 容器中：** 如果您在 Docker（或 Podman）容器內執行 Gemini CLI，IDE 整合仍可連線到在主機上執行的 VS Code 擴充功能。CLI 設定為自動在 `host.docker.internal` 上尋找 IDE 伺服器。通常不需要特殊設定，但您可能需要確保 Docker 網路設定允許從容器連線到主機。

## 疑難排解

如果您在 IDE 整合方面遇到問題，以下是一些常見錯誤訊息及解決方法。

### 連線錯誤

- **訊息：** `🔴 Disconnected: Failed to connect to IDE companion extension in [IDE Name]. Please ensure the extension is running. To install the extension, run /ide install.`
  - **原因：** Gemini CLI 無法找到連線到 IDE 所需的環境變數（`GEMINI_CLI_IDE_WORKSPACE_PATH` 或 `GEMINI_CLI_IDE_SERVER_PORT`）。這通常表示 IDE 配套擴充功能未執行或未正確初始化。
  - **解決方法：**
    1.  確保您已在 IDE 中安裝 **Gemini CLI Companion** 擴充功能且已啟用。
    2.  在 IDE 中開啟新的終端機視窗以確保它擷取正確的環境。

- **訊息：** `🔴 Disconnected: IDE connection error. The connection was lost unexpectedly. Please try reconnecting by running /ide enable`
  - **原因：** 與 IDE 配套的連線中斷。
  - **解決方法：** 執行 `/ide enable` 嘗試重新連線。如果問題持續，請開啟新的終端機視窗或重新啟動您的 IDE。

### 設定錯誤

- **訊息：** `🔴 Disconnected: Directory mismatch. Gemini CLI is running in a different location than the open workspace in [IDE Name]. Please run the CLI from one of the following directories: [List of directories]`
  - **原因：** CLI 的目前工作目錄在您在 IDE 中開啟的工作區之外。
  - **解決方法：** `cd` 到與您在 IDE 中開啟的相同目錄並重新啟動 CLI。

- **訊息：** `🔴 Disconnected: To use this feature, please open a workspace folder in [IDE Name] and try again.`
  - **原因：** 您的 IDE 中沒有開啟工作區。
  - **解決方法：** 在 IDE 中開啟工作區並重新啟動 CLI。

### 一般錯誤

- **訊息：** `IDE integration is not supported in your current environment. To use this feature, run Gemini CLI in one of these supported IDEs: [List of IDEs]`
  - **原因：** 您在不受支援的 IDE 的終端機或環境中執行 Gemini CLI。
  - **解決方法：** 從受支援的 IDE（如 VS Code）的整合終端機執行 Gemini CLI。

- **訊息：** `No installer is available for IDE. Please install the Gemini CLI Companion extension manually from the marketplace.`
  - **原因：** 您執行了 `/ide install`，但 CLI 沒有您特定 IDE 的自動安裝程式。
  - **解決方法：** 開啟您 IDE 的擴充功能市集，搜尋「Gemini CLI Companion」，並[手動安裝](#3-從市集手動安裝)。
