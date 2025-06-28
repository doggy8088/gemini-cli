# 如何貢獻

我們很樂意接受您對此專案的補丁和貢獻。

## 開始之前

### 簽署我們的貢獻者授權協議

對此專案的貢獻必須伴隨[貢獻者授權協議](https://cla.developers.google.com/about)（CLA）。
您（或您的雇主）保留對您貢獻的版權；這只是給予我們使用和重新分發您的貢獻作為專案一部分的許可。

如果您或您目前的雇主已經簽署了 Google CLA（即使是針對不同的專案），您可能不需要再次簽署。

訪問 <https://cla.developers.google.com/> 查看您目前的協議或簽署新的協議。

### 查看我們的社群準則

此專案遵循 [Google 的開源社群準則](https://opensource.google/conduct/)。

## 貢獻流程

### 程式碼審查

所有提交，包括專案成員的提交，都需要審查。我們使用 [GitHub pull requests](https://docs.github.com/articles/about-pull-requests) 來達成此目的。

### Pull Request 準則

為了幫助我們快速審查和合併您的 PR，請遵循這些準則。不符合這些標準的 PR 可能會被關閉。

#### 1. 連結到現有的 Issue

所有 PR 都應該連結到我們追蹤器中的現有 issue。這確保每個變更都已經討論過，並在撰寫任何程式碼之前與專案目標一致。

- **針對錯誤修復：** PR 應該連結到錯誤報告 issue。
- **針對功能：** PR 應該連結到已被維護者批准的功能請求或提案 issue。

如果您的變更沒有對應的 issue，請**先開啟一個**並等待回饋後再開始編碼。

#### 2. 保持小且專注

我們偏好解決單一 issue 或添加單一、自包含功能的小型、原子性 PR。

- **應該：** 建立修復一個特定錯誤或添加一個特定功能的 PR。
- **不應該：** 將多個不相關的變更（例如錯誤修復、新功能和重構）捆綁到單一 PR 中。

大型變更應該分解為一系列較小的、邏輯性的 PR，這些 PR 可以獨立審查和合併。

#### 3. 對進行中的工作使用草稿 PR

如果您希望對您的工作獲得早期回饋，請使用 GitHub 的**草稿 Pull Request**功能。這向維護者表明 PR 尚未準備好進行正式審查，但開放討論和初步回饋。

#### 4. 確保所有檢查通過

在提交您的 PR 之前，通過執行 `npm run preflight` 確保所有自動檢查都通過。此命令執行所有測試、程式碼檢查和其他樣式檢查。

#### 5. 更新文件

如果您的 PR 引入了面向使用者的變更（例如新命令、修改的標誌或行為變更），您還必須更新 `/docs` 目錄中的相關文件。

#### 6. 撰寫清晰的提交訊息和良好的 PR 描述

您的 PR 應該有清晰、描述性的標題和詳細的變更說明。遵循 [Conventional Commits](https://www.conventionalcommits.org/) 標準來撰寫您的提交訊息。

- **良好的 PR 標題：** `feat(cli): Add --json flag to 'config get' command`
- **不良的 PR 標題：** `Made some changes`

在 PR 描述中，解釋您變更背後的「為什麼」並連結到相關的 issue（例如 `Fixes #123`）。

## Fork

如果您正在 fork 儲存庫，您將能夠執行建置、測試和整合測試工作流程。但是為了讓整合測試執行，您需要添加一個 [GitHub 儲存庫密鑰](<[url](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)>)，值為 `GEMINI_API_KEY` 並將其設定為您可用的有效 API 金鑰。您的金鑰和密鑰對您的儲存庫是私有的；沒有存取權限的人無法看到您的金鑰，您也無法看到與此儲存庫相關的任何密鑰。

此外，您需要點擊 `Actions` 標籤並為您的儲存庫啟用工作流程，您會發現螢幕中央有一個大型藍色按鈕。

## 開發設定和工作流程

本節指導貢獻者如何建置、修改和理解此專案的開發設定。

### 設定開發環境

**先決條件：**

1. 安裝 [Node 18+](https://nodejs.org/en/download)
2. Git

### 建置流程

複製儲存庫：

```bash
git clone https://github.com/google-gemini/gemini-cli.git # 或您 fork 的 URL
cd gemini-cli
```

安裝 `package.json` 中定義的依賴項以及根依賴項：

```bash
npm install
```

建置整個專案（所有套件）：

```bash
npm run build
```

此命令通常將 TypeScript 編譯為 JavaScript，打包資產，並準備套件以供執行。有關建置過程中發生的詳細信息，請參閱 `scripts/build.js` 和 `package.json` 腳本。

### 啟用沙盒

強烈建議使用基於容器的[沙盒](#sandboxing)，至少需要在您的 `~/.env` 中設定 `GEMINI_SANDBOX=true` 並確保容器引擎（例如 `docker` 或 `podman`）可用。詳見[沙盒](#sandboxing)。

要建置 `gemini` CLI 工具和沙盒容器，請從根目錄執行 `build:all`：

```bash
npm run build:all
```

要跳過建置沙盒容器，您可以改用 `npm run build`。

### 執行

要從原始碼啟動 Gemini CLI（建置後），請從根目錄執行以下命令：

```bash
npm start
```

如果您想在 gemini-cli 資料夾外執行原始建置，您可以利用 `npm link path/to/gemini-cli/packages/cli`（見：[文件](https://docs.npmjs.com/cli/v9/commands/npm-link)）或 `alias gemini="node path/to/gemini-cli/packages/cli"` 來用 `gemini` 執行

### 執行測試

此專案包含兩種類型的測試：單元測試和整合測試。

#### 單元測試

執行專案的單元測試套件：

```bash
npm run test
```

這將執行位於 `packages/core` 和 `packages/cli` 目錄中的測試。在提交任何變更之前確保測試通過。為了更全面的檢查，建議執行 `npm run preflight`。

#### 整合測試

整合測試旨在驗證 Gemini CLI 的端到端功能。它們不作為預設 `npm run test` 命令的一部分執行。

要執行整合測試，使用以下命令：

```bash
npm run test:e2e
```

有關整合測試框架的更詳細信息，請參閱[整合測試文件](./integration-tests.md)。

### 程式碼檢查和預檢檢查

為了確保程式碼品質和格式一致性，執行預檢檢查：

```bash
npm run preflight
```

此命令將執行 ESLint、Prettier、所有測試和專案 `package.json` 中定義的其他檢查。

_小技巧_

複製後建立一個 git precommit hook 檔案以確保您的提交始終乾淨。

```bash
echo "
# Run npm build and check for errors
if ! npm run preflight; then
  echo "npm build failed. Commit aborted."
  exit 1
fi
" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

#### 格式化

要單獨格式化此專案中的程式碼，請從根目錄執行以下命令：

```bash
npm run format
```

此命令使用 Prettier 根據專案的樣式準則格式化程式碼。

#### 程式碼檢查

要單獨檢查此專案中的程式碼，請從根目錄執行以下命令：

```bash
npm run lint
```

### 編碼慣例

- 請遵循整個現有程式碼庫中使用的編碼樣式、模式和慣例。
- 查閱 [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md)（通常在專案根目錄中找到）以獲取與 AI 輔助開發相關的具體說明，包括 React、註釋和 Git 使用的慣例。
- **匯入：** 特別注意匯入路徑。專案使用 `eslint-rules/no-relative-cross-package-imports.js` 來強制限制套件間的相對匯入。

### 專案結構

- `packages/`：包含專案的各個子套件。
  - `cli/`：命令列介面。
  - `server/`：CLI 互動的後端伺服器。
- `docs/`：包含所有專案文件。
- `scripts/`：用於建置、測試和開發任務的工具腳本。

有關更詳細的架構，請參閱 `docs/architecture.md`。

## 除錯

### VS Code：

0.  在 VS Code 中按 `F5` 執行 CLI 進行互動式除錯
1.  從根目錄在除錯模式下啟動 CLI：
    ```bash
    npm run debug
    ```
    此命令在 `packages/cli` 目錄內執行 `node --inspect-brk dist/gemini.js`，暫停執行直到除錯器附加。然後您可以在 Chrome 瀏覽器中開啟 `chrome://inspect` 連接到除錯器。
2.  在 VS Code 中，使用「Attach」啟動配置（在 `.vscode/launch.json` 中找到）。

或者，如果您偏好直接啟動目前開啟的檔案，可以在 VS Code 中使用「Launch Program」配置，但通常建議使用 'F5'。

要在沙盒容器內命中斷點，請執行：

```bash
DEBUG=1 gemini
```

### React DevTools

要除錯 CLI 的基於 React 的 UI，您可以使用 React DevTools。用於 CLI 介面的函式庫 Ink 與 React DevTools 4.x 版本相容。

1.  **在開發模式下啟動 Gemini CLI：**

    ```bash
    DEV=true npm start
    ```

2.  **安裝並執行 React DevTools 4.28.5 版本（或最新的相容 4.x 版本）：**

    您可以全域安裝：

    ```bash
    npm install -g react-devtools@4.28.5
    react-devtools
    ```

    或使用 npx 直接執行：

    ```bash
    npx react-devtools@4.28.5
    ```

    您執行中的 CLI 應用程式隨後應連接到 React DevTools。
    ![](./assets/connected_devtools.png)

## 沙盒

### MacOS Seatbelt

在 MacOS 上，`gemini` 使用 Seatbelt（`sandbox-exec`）在 `permissive-open` 設定檔下（見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`），該設定檔限制對專案資料夾的寫入，但預設允許所有其他操作和出站網路流量（「開放」）。您可以通過在您的環境或 `.env` 檔案中設定 `SEATBELT_PROFILE=restrictive-closed` 來切換到 `restrictive-closed` 設定檔（見 `.../sandbox-macos-strict.sb`），該設定檔預設拒絕所有操作和出站網路流量（「關閉」）。可用的內建設定檔為 `{permissive,restrictive}-{open,closed,proxied}`（見下文的代理網路）。如果您也在專案設定目錄 `.gemini` 下建立檔案 `.gemini/sandbox-macos-<profile>.sb`，您也可以切換到自定義設定檔 `SEATBELT_PROFILE=<profile>`。

### 基於容器的沙盒（所有平台）

對於 MacOS 或其他平台上更強的基於容器的沙盒，您可以在您的環境或 `.env` 檔案中設定 `GEMINI_SANDBOX=true|docker|podman|<command>`。指定的命令（或如果是 `true` 則是 `docker` 或 `podman`）必須安裝在主機上。啟用後，`npm run build:all` 將建置最小容器（「沙盒」）映像，`npm start` 將在該容器的新實例內啟動。第一次建置可能需要 20-30 秒（主要由於下載基礎映像），但之後建置和啟動開銷應該是最小的。預設建置（`npm run build`）不會重建沙盒。

基於容器的沙盒以讀寫存取權限掛載專案目錄（和系統臨時目錄），並在您啟動/停止 Gemini CLI 時自動啟動/停止/移除。在沙盒內建立的檔案應該自動映射到主機上的您的使用者/群組。您可以通過根據需要設定 `SANDBOX_{MOUNTS,PORTS,ENV}` 輕鬆指定額外的掛載、連接埠或環境變數。您也可以通過在專案設定目錄（`.gemini`）下建立檔案 `.gemini/sandbox.Dockerfile` 和/或 `.gemini/sandbox.bashrc` 並以 `BUILD_SANDBOX=1` 執行 `gemini` 來觸發您自定義沙盒的建置，完全自定義您專案的沙盒。

#### 代理網路

所有沙盒方法，包括使用 `*-proxied` 設定檔的 MacOS Seatbelt，都支援通過可以指定為 `GEMINI_SANDBOX_PROXY_COMMAND=<command>` 的自定義代理伺服器限制出站網路流量，其中 `<command>` 必須啟動一個在 `:::8877` 監聽相關請求的代理伺服器。見 `scripts/example-proxy.js` 以獲取一個僅允許 `HTTPS` 連接到 `example.com:443`（例如 `curl https://example.com`）並拒絕所有其他請求的最小代理。代理與沙盒一起自動啟動和停止。

## 手動發布

我們為每個提交向我們的內部註冊表發布工件。但如果您需要手動建立本地建置，請執行以下命令：

```
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
