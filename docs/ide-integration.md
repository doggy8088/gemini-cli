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

### 2. Manual Installation from CLI

If you previously dismissed the prompt or want to install the extension manually, you can run the following command inside Gemini CLI:

```
/ide install
```

This will find the correct extension for your IDE and install it.

### 3. Manual Installation from a Marketplace

You can also install the extension directly from a marketplace.

- **For Visual Studio Code:** Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=google.gemini-cli-vscode-ide-companion).
- **For VS Code Forks:** To support forks of VS Code, the extension is also published on the [Open VSX Registry](https://open-vsx.org/extension/google/gemini-cli-vscode-ide-companion). Follow your editor's instructions for installing extensions from this registry.

> NOTE:
> The "Gemini CLI Companion" extension may appear towards the bottom of search results. If you don't see it immediately, try scrolling down or sorting by "Newly Published".
>
> After manually installing the extension, you must run `/ide enable` in the CLI to activate the integration.

## Usage

### Enabling and Disabling

You can control the IDE integration from within the CLI:

- To enable the connection to the IDE, run:
  ```
  /ide enable
  ```
- To disable the connection, run:
  ```
  /ide disable
  ```

When enabled, Gemini CLI will automatically attempt to connect to the IDE companion extension.

### Checking the Status

To check the connection status and see the context the CLI has received from the IDE, run:

```
/ide status
```

If connected, this command will show the IDE it's connected to and a list of recently opened files it is aware of.

(Note: The file list is limited to 10 recently accessed files within your workspace and only includes local files on disk.)

### Working with Diffs

When you ask Gemini to modify a file, it can open a diff view directly in your editor.

**To accept a diff**, you can perform any of the following actions:

- Click the **checkmark icon** in the diff editor's title bar.
- Save the file (e.g., with `Cmd+S` or `Ctrl+S`).
- Open the Command Palette and run **Gemini CLI: Accept Diff**.
- Respond with `yes` in the CLI when prompted.

**To reject a diff**, you can:

- Click the **'x' icon** in the diff editor's title bar.
- Close the diff editor tab.
- Open the Command Palette and run **Gemini CLI: Close Diff Editor**.
- Respond with `no` in the CLI when prompted.

You can also **modify the suggested changes** directly in the diff view before accepting them.

If you select ‘Yes, allow always’ in the CLI, changes will no longer show up in the IDE as they will be auto-accepted.

## Using with Sandboxing

If you are using Gemini CLI within a sandbox, please be aware of the following:

- **On macOS:** The IDE integration requires network access to communicate with the IDE companion extension. You must use a Seatbelt profile that allows network access.
- **In a Docker Container:** If you run Gemini CLI inside a Docker (or Podman) container, the IDE integration can still connect to the VS Code extension running on your host machine. The CLI is configured to automatically find the IDE server on `host.docker.internal`. No special configuration is usually required, but you may need to ensure your Docker networking setup allows connections from the container to the host.

## Troubleshooting

If you encounter issues with IDE integration, here are some common error messages and how to resolve them.

### Connection Errors

- **Message:** `🔴 Disconnected: Failed to connect to IDE companion extension in [IDE Name]. Please ensure the extension is running. To install the extension, run /ide install.`
  - **Cause:** Gemini CLI could not find the necessary environment variables (`GEMINI_CLI_IDE_WORKSPACE_PATH` or `GEMINI_CLI_IDE_SERVER_PORT`) to connect to the IDE. This usually means the IDE companion extension is not running or did not initialize correctly.
  - **Solution:**
    1.  Make sure you have installed the **Gemini CLI Companion** extension in your IDE and that it is enabled.
    2.  Open a new terminal window in your IDE to ensure it picks up the correct environment.

- **Message:** `🔴 Disconnected: IDE connection error. The connection was lost unexpectedly. Please try reconnecting by running /ide enable`
  - **Cause:** The connection to the IDE companion was lost.
  - **Solution:** Run `/ide enable` to try and reconnect. If the issue continues, open a new terminal window or restart your IDE.

### Configuration Errors

- **Message:** `🔴 Disconnected: Directory mismatch. Gemini CLI is running in a different location than the open workspace in [IDE Name]. Please run the CLI from one of the following directories: [List of directories]`
  - **Cause:** The CLI's current working directory is outside the workspace you have open in your IDE.
  - **Solution:** `cd` into the same directory that is open in your IDE and restart the CLI.

- **Message:** `🔴 Disconnected: To use this feature, please open a workspace folder in [IDE Name] and try again.`
  - **Cause:** You have no workspace open in your IDE.
  - **Solution:** Open a workspace in your IDE and restart the CLI.

### General Errors

- **Message:** `IDE integration is not supported in your current environment. To use this feature, run Gemini CLI in one of these supported IDEs: [List of IDEs]`
  - **Cause:** You are running Gemini CLI in a terminal or environment that is not a supported IDE.
  - **Solution:** Run Gemini CLI from the integrated terminal of a supported IDE, like VS Code.

- **Message:** `No installer is available for IDE. Please install the Gemini CLI Companion extension manually from the marketplace.`
  - **Cause:** You ran `/ide install`, but the CLI does not have an automated installer for your specific IDE.
  - **Solution:** Open your IDE's extension marketplace, search for "Gemini CLI Companion", and [install it manually](#3-manual-installation-from-a-marketplace).
