# 如何貢獻

我們很樂意接受您對此專案的修補程式和貢獻。

## 開始之前

### 簽署我們的貢獻者授權協議

對此專案的貢獻必須附帶[貢獻者授權協議](https://cla.developers.google.com/about) (CLA)。
您（或您的雇主）保留對您貢獻的版權；這只是給予我們使用和重新分發您的貢獻作為專案一部分的權限。

如果您或您目前的雇主已經簽署了 Google CLA（即使是針對不同的專案），您可能不需要再次簽署。

請造訪 <https://cla.developers.google.com/> 查看您目前的協議或簽署新協議。

### 檢閱我們的社群準則

此專案遵循 [Google 的開源社群準則](https://opensource.google/conduct/)。

## 貢獻流程

### 程式碼審查

所有提交內容，包括專案成員的提交內容，都需要審查。我們為此目的使用 [GitHub 拉取請求](https://docs.github.com/articles/about-pull-requests)。

### 自行指派問題

如果您正在尋找要處理的問題，請查看我們標記為["需要協助"](https://github.com/google-gemini/gemini-cli/issues?q=is%3Aissue+state%3Aopen+label%3A%22help+wanted%22)的問題清單。

要將問題指派給自己，只需新增包含文字 `/assign` 的留言。留言必須僅包含該文字，不得包含其他內容。如果問題尚未被指派，此指令將把問題指派給您。

請注意，您在任何時候最多只能被指派 3 個問題。

### 拉取請求準則

為了幫助我們快速審查和合併您的拉取請求，請遵循這些準則。不符合這些標準的拉取請求可能會被關閉。

#### 1. 連結到現有問題

所有拉取請求都應該連結到我們追蹤器中的現有問題。這確保每個變更在撰寫任何程式碼之前都已經過討論並與專案目標一致。

- **對於錯誤修正**：拉取請求應該連結到錯誤報告問題。
- **對於功能**：拉取請求應該連結到已被維護者核准的功能請求或提案問題。

如果您的變更沒有對應的問題，請**先開啟一個問題**並在開始編碼之前等待回饋。

#### 2. 保持小巧且專注

我們偏好解決單一問題或新增單一自包含功能的小型、原子性拉取請求。

- **應該做**：建立修正一個特定錯誤或新增一個特定功能的拉取請求。
- **不應該做**：將多個不相關的變更（例如，錯誤修正、新功能和重構）打包到單一拉取請求中。

大型變更應該分解為一系列較小的、邏輯性的拉取請求，可以獨立審查和合併。

#### 3. 使用草稿拉取請求處理進行中的工作

如果您想對您的工作獲得早期回饋，請使用 GitHub 的**草稿拉取請求**功能。這向維護者表明拉取請求尚未準備好進行正式審查，但開放討論和初步回饋。

#### 4. 確保所有檢查都通過

在提交拉取請求之前，請透過執行 `npm run preflight` 確保所有自動檢查都通過。此指令會執行所有測試、程式碼檢查和其他樣式檢查。

#### 5. 更新說明文件

如果您的拉取請求引入了面向使用者的變更（例如，新指令、修改的旗標或行為變更），您也必須更新 `/docs` 目錄中的相關說明文件。

#### 6. 撰寫清楚的提交訊息和良好的拉取請求描述

您的拉取請求應該有清楚、描述性的標題和變更的詳細描述。請遵循 [Conventional Commits](https://www.conventionalcommits.org/) 標準來撰寫您的提交訊息。

- **良好的拉取請求標題**：`feat(cli): Add --json flag to 'config get' command`
- **不良的拉取請求標題**：`Made some changes`

在拉取請求描述中，說明您變更背後的「原因」並連結到相關問題（例如，`Fixes #123`）。

## 分叉

如果您分叉此儲存庫，您將能夠執行建置、測試和整合測試工作流程。但是，為了讓整合測試執行，您需要新增一個值為 `GEMINI_API_KEY` 的 [GitHub 儲存庫密鑰](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)，並將其設定為您可用的有效 API 金鑰。您的金鑰和密鑰對您的儲存庫是私有的；沒有存取權限的人無法看到您的金鑰，您也無法看到與此儲存庫相關的任何密鑰。

此外，您需要點擊 `Actions` 標籤並為您的儲存庫啟用工作流程，您會發現它是螢幕中央的大藍色按鈕。

## 開發設定和工作流程

本節指導貢獻者如何建置、修改和了解此專案的開發設定。

### 設定開發環境

**先決條件：**

1.  **Node.js**：
    - **開發**：請使用 Node.js `~20.19.0`。由於上游開發相依性問題，需要此特定版本。您可以使用 [nvm](https://github.com/nvm-sh/nvm) 等工具來管理 Node.js 版本。
    - **生產環境**：對於在生產環境中執行 CLI，任何 Node.js `>=20` 版本都可以接受。
2.  **Git**

### 建置流程

複製儲存庫：

```bash
git clone https://github.com/google-gemini/gemini-cli.git # 或您的分叉 URL
cd gemini-cli
```

安裝 `package.json` 中定義的相依性以及根相依性：

```bash
npm install
```

建置整個專案（所有套件）：

```bash
npm run build
```

此指令通常會將 TypeScript 編譯為 JavaScript、打包資產，並為執行準備套件。請參考 `scripts/build.js` 和 `package.json` 腳本，了解建置過程中發生的詳細資訊。

### 啟用沙箱化

強烈建議使用[沙箱化](#sandboxing)，至少需要在您的 `~/.env` 中設定 `GEMINI_SANDBOX=true`，並確保沙箱化提供者（例如 `macOS Seatbelt`、`docker` 或 `podman`）可用。請參閱[沙箱化](#sandboxing)了解詳細資訊。

要同時建置 `gemini` CLI 公用程式和沙箱容器，請從根目錄執行 `build:all`：

```bash
npm run build:all
```

要跳過建置沙箱容器，您可以改用 `npm run build`。

### 執行

要從原始碼啟動 Gemini CLI（建置後），請從根目錄執行以下指令：

```bash
npm start
```

如果您想在 gemini-cli 資料夾外執行原始碼建置，您可以使用 `npm link path/to/gemini-cli/packages/cli`（請參閱：[文件](https://docs.npmjs.com/cli/v9/commands/npm-link)）或 `alias gemini="node path/to/gemini-cli/packages/cli"` 以 `gemini` 執行

### 執行測試

此專案包含兩種類型的測試：單元測試和整合測試。

#### 單元測試

要執行專案的單元測試套件：

```bash
npm run test
```

這將執行位於 `packages/core` 和 `packages/cli` 目錄中的測試。在提交任何變更之前，請確保測試通過。為了進行更全面的檢查，建議執行 `npm run preflight`。

#### 整合測試

整合測試旨在驗證 Gemini CLI 的端對端功能。它們不會作為預設 `npm run test` 指令的一部分執行。

要執行整合測試，請使用以下指令：

```bash
npm run test:e2e
```

有關整合測試框架的更詳細資訊，請參閱[整合測試說明文件](./docs/integration-tests.md)。

### 程式碼檢查和飛行前檢查

要確保程式碼品質和格式一致性，請執行飛行前檢查：

```bash
npm run preflight
```

此指令將執行 ESLint、Prettier、所有測試和專案 `package.json` 中定義的其他檢查。

_專業提示_

複製後建立 git precommit hook 檔案以確保您的提交始終乾淨。

```bash
echo "
# Run npm build and check for errors
if ! npm run preflight; then
  echo "npm build failed. Commit aborted."
  exit 1
fi
" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

#### Formatting

To separately format the code in this project by running the following command from the root directory:

```bash
npm run format
```

This command uses Prettier to format the code according to the project's style guidelines.

#### Linting

To separately lint the code in this project, run the following command from the root directory:

```bash
npm run lint
```

### Coding Conventions

- Please adhere to the coding style, patterns, and conventions used throughout the existing codebase.
- Consult [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md) (typically found in the project root) for specific instructions related to AI-assisted development, including conventions for React, comments, and Git usage.
- **Imports:** Pay special attention to import paths. The project uses ESLint to enforce restrictions on relative imports between packages.

### Project Structure

- `packages/`: Contains the individual sub-packages of the project.
  - `cli/`: The command-line interface.
  - `core/`: The core backend logic for the Gemini CLI.
- `docs/`: Contains all project documentation.
- `scripts/`: Utility scripts for building, testing, and development tasks.

For more detailed architecture, see `docs/architecture.md`.

## Debugging

### VS Code:

0.  Run the CLI to interactively debug in VS Code with `F5`
1.  Start the CLI in debug mode from the root directory:
    ```bash
    npm run debug
    ```
    This command runs `node --inspect-brk dist/gemini.js` within the `packages/cli` directory, pausing execution until a debugger attaches. You can then open `chrome://inspect` in your Chrome browser to connect to the debugger.
2.  In VS Code, use the "Attach" launch configuration (found in `.vscode/launch.json`).

Alternatively, you can use the "Launch Program" configuration in VS Code if you prefer to launch the currently open file directly, but 'F5' is generally recommended.

To hit a breakpoint inside the sandbox container run:

```bash
DEBUG=1 gemini
```

**Note:** If you have `DEBUG=true` in a project's `.env` file, it won't affect gemini-cli due to automatic exclusion. Use `.gemini/.env` files for gemini-cli specific debug settings.

### React DevTools

To debug the CLI's React-based UI, you can use React DevTools. Ink, the library used for the CLI's interface, is compatible with React DevTools version 4.x.

1.  **Start the Gemini CLI in development mode:**

    ```bash
    DEV=true npm start
    ```

2.  **Install and run React DevTools version 4.28.5 (or the latest compatible 4.x version):**

    You can either install it globally:

    ```bash
    npm install -g react-devtools@4.28.5
    react-devtools
    ```

    Or run it directly using npx:

    ```bash
    npx react-devtools@4.28.5
    ```

    Your running CLI application should then connect to React DevTools.
    ![](/docs/assets/connected_devtools.png)

## Sandboxing

### macOS Seatbelt

On macOS, `gemini` uses Seatbelt (`sandbox-exec`) under a `permissive-open` profile (see `packages/cli/src/utils/sandbox-macos-permissive-open.sb`) that restricts writes to the project folder but otherwise allows all other operations and outbound network traffic ("open") by default. You can switch to a `restrictive-closed` profile (see `packages/cli/src/utils/sandbox-macos-restrictive-closed.sb`) that declines all operations and outbound network traffic ("closed") by default by setting `SEATBELT_PROFILE=restrictive-closed` in your environment or `.env` file. Available built-in profiles are `{permissive,restrictive}-{open,closed,proxied}` (see below for proxied networking). You can also switch to a custom profile `SEATBELT_PROFILE=<profile>` if you also create a file `.gemini/sandbox-macos-<profile>.sb` under your project settings directory `.gemini`.

### Container-based Sandboxing (All Platforms)

For stronger container-based sandboxing on macOS or other platforms, you can set `GEMINI_SANDBOX=true|docker|podman|<command>` in your environment or `.env` file. The specified command (or if `true` then either `docker` or `podman`) must be installed on the host machine. Once enabled, `npm run build:all` will build a minimal container ("sandbox") image and `npm start` will launch inside a fresh instance of that container. The first build can take 20-30s (mostly due to downloading of the base image) but after that both build and start overhead should be minimal. Default builds (`npm run build`) will not rebuild the sandbox.

Container-based sandboxing mounts the project directory (and system temp directory) with read-write access and is started/stopped/removed automatically as you start/stop Gemini CLI. Files created within the sandbox should be automatically mapped to your user/group on host machine. You can easily specify additional mounts, ports, or environment variables by setting `SANDBOX_{MOUNTS,PORTS,ENV}` as needed. You can also fully customize the sandbox for your projects by creating the files `.gemini/sandbox.Dockerfile` and/or `.gemini/sandbox.bashrc` under your project settings directory (`.gemini`) and running `gemini` with `BUILD_SANDBOX=1` to trigger building of your custom sandbox.

#### Proxied Networking

All sandboxing methods, including macOS Seatbelt using `*-proxied` profiles, support restricting outbound network traffic through a custom proxy server that can be specified as `GEMINI_SANDBOX_PROXY_COMMAND=<command>`, where `<command>` must start a proxy server that listens on `:::8877` for relevant requests. See `docs/examples/proxy-script.md` for a minimal proxy that only allows `HTTPS` connections to `example.com:443` (e.g. `curl https://example.com`) and declines all other requests. The proxy is started and stopped automatically alongside the sandbox.

## Manual Publish

We publish an artifact for each commit to our internal registry. But if you need to manually cut a local build, then run the following commands:

```
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
