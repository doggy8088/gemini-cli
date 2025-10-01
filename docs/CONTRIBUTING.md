# 如何貢獻

我們非常歡迎你對本專案提出修補與貢獻。

## 在你開始之前

### 簽署我們的貢獻者授權協議（Contributor License Agreement, CLA）

對本專案的貢獻必須附帶[貢獻者授權協議](https://cla.developers.google.com/about)（CLA）。
你（或你的雇主）仍然保有你所貢獻內容的著作權；這僅僅是授權我們可以將你的貢獻作為專案的一部分來使用與再散佈。

如果你或你目前的雇主已經簽署過 Google 的 CLA（即使是為其他專案），通常就不需要再次簽署。

請造訪<https://cla.developers.google.com/>以檢視你目前的協議，或簽署新的協議。

### 閱讀我們的社群規範

本專案遵循 [Google 的開源社群規範](https://opensource.google/conduct/)。

## 貢獻流程

### 程式碼審查（Code Review）

所有提交內容，包括專案成員的提交，都需要經過審查。我們使用 [GitHub pull requests](https://docs.github.com/articles/about-pull-requests) 來進行程式碼審查。

### 自行指派 Issue

如果你正在尋找可以著手處理的 issue，請參考我們標記為「[help wanted]」(https://github.com/google-gemini/gemini-cli/issues?q=is%3Aissue+state%3Aopen+label%3A%22help+wanted%22)的 issue 清單。

要將 issue 指派給自己，只需新增一則內容為 `/assign` 的留言。留言內容必須僅包含該文字，且不得有其他內容。此指令會將該 issue 指派給你，前提是該 issue 尚未被指派。

請注意，你同時最多只能被指派 3 個 issue。

### Pull Request 指南

為了協助我們能更快地審查和合併你的 PR，請遵循以下指南。不符合這些標準的 PR 可能會被關閉。

#### 1. 連結至現有 Issue

所有 PR 都應該連結到我們追蹤器中的現有 issue。這可以確保每一項變更在撰寫程式碼前都已經討論過，並與專案目標保持一致。

- **針對錯誤修正：** PR 應連結至該錯誤回報的 issue。
- **針對新功能：** PR 應連結至經維護者核准的功能請求或提案 issue。

如果你的變更尚未有對應的 issue，請**先建立一個 issue**，並在開始撰寫程式碼前等待回饋。

#### 2. 保持精簡且聚焦

我們偏好小型、原子性的 PR，每次只解決一個 issue 或新增一個獨立的功能。

- **請這樣做：** 建立一個僅修正特定錯誤或新增特定功能的 PR。
- **請避免：** 將多個無關的變更（例如：錯誤修正、新功能、重構）打包在同一個 PR 內。

大型變更應拆分為一系列較小、邏輯清楚的 PR，以便獨立審查與合併。

#### 3. 進行中工作請使用 Draft PR

如果你希望提早獲得回饋，請使用 GitHub 的 **Draft Pull Request** 功能。這會告知維護者該 PR 尚未準備好正式審查，但可以進行討論與初步回饋。

#### 4. 確保所有檢查通過

在提交 PR 前，請先執行 `npm run preflight`，確保所有自動化檢查都通過。此指令會執行所有測試、程式碼檢查及其他風格檢查。

#### 5. 更新文件

如果你的 PR 帶來使用者可見的變更（例如：新增指令、修改旗標、或行為改變），你也必須同步更新 `/docs` 目錄中的相關文件。

#### 6. 撰寫清楚的 Commit 訊息與良好的 PR 描述

你的 PR 應有清楚、具描述性的標題，以及詳細說明變更內容的描述。Commit 訊息請遵循 [Conventional Commits](https://www.conventionalcommits.org/) 標準。

- **良好的 PR 標題：** `feat(cli): Add --json flag to 'config get' command`
- **不良的 PR 標題：** `Made some changes`

在 PR 描述中，請說明你進行這些變更的「原因」，並連結相關的 issue（例如：`Fixes #123`）。

## Fork 操作

如果你 fork 了這個儲存庫，你將可以執行 Build、Test 及 Integration test 工作流程。不過，若要讓整合測試（integration tests）能夠執行，你需要新增一個 [GitHub Repository Secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)，名稱為 `GEMINI_API_KEY`，並設定為你所持有的有效 API 金鑰。你的金鑰與 secret 僅限於你的儲存庫，未經授權者無法存取你的金鑰，你也無法看到與本儲存庫相關的任何 secrets。

此外，你還需要點擊 `Actions` 分頁，並啟用你的儲存庫工作流程，你會在畫面中央看到一個大型藍色按鈕。

## 開發環境設置與工作流程

本節將指引貢獻者如何建置、修改並理解本專案的開發環境設置。

### 開發環境設置

**先決條件：**

1.  **Node.js**：
    - **開發環境：** 請使用 Node.js `~20.19.0`。由於上游開發相依性問題，必須使用此特定版本。你可以使用 [nvm](https://github.com/nvm-sh/nvm) 等工具來管理 Node.js 版本。
    - **生產環境：** 若在生產環境執行命令列介面 (Command Line Interface)，可使用任何 Node.js `>=20` 版本。
2.  **Git**

### 建置流程

要複製此儲存庫：

```bash
git clone https://github.com/google-gemini/gemini-cli.git # Or your fork's URL
cd gemini-cli
```

要安裝`package.json`中定義的相依套件，以及根目錄的相依套件：

```bash
npm install
```

要建置整個專案（所有套件）：

```bash
npm run build
```

此指令通常會將 TypeScript 編譯為 JavaScript、打包資產，並將套件（packages）準備好以供執行。關於建置過程中發生的詳細內容，請參考 `scripts/build.js` 和 `package.json` 腳本。

### 啟用沙箱機制

強烈建議啟用[沙箱機制](#沙箱機制-sandboxing)，其最低需求為在你的 `~/.env` 中設定 `GEMINI_SANDBOX=true`，並確保有可用的沙箱機制提供者（例如 `macOS Seatbelt`、`docker` 或 `podman`）。詳細資訊請參閱[沙箱機制](#沙箱機制-sandboxing)。

若要同時建置 `gemini` 命令列介面 (Command Line Interface) 工具與 sandbox 容器，請於專案根目錄執行 `build:all`：

```bash
npm run build:all
```

若要跳過建置 sandbox 容器，可以改用 `npm run build`。

### 執行

要從原始碼啟動 Gemini CLI（建置完成後），請在專案根目錄執行以下指令：

```bash
npm start
```

如果你希望在 gemini-cli 資料夾之外執行原始碼建置，可以利用 `npm link path/to/gemini-cli/packages/cli`（請參閱：[docs](https://docs.npmjs.com/cli/v9/commands/npm-link)）或 `alias gemini="node path/to/gemini-cli/packages/cli"` 搭配 `gemini` 來執行。

### 執行測試

本專案包含兩種類型的測試：單元測試（unit tests）與整合測試（integration tests）。

#### 單元測試（Unit Tests）

若要執行本專案的單元測試套件：

```bash
npm run test
```

這將會執行位於`packages/core`和`packages/cli`目錄中的測試。在提交任何變更之前，請確保所有測試皆已通過。若需更全面的檢查，建議執行`npm run preflight`。

#### 整合測試

整合測試旨在驗證 Gemini CLI 的端對端功能。這些測試不會在預設的`npm run test`指令中執行。

若要執行整合測試，請使用以下指令：

```bash
npm run test:e2e
```

如需有關整合測試框架的詳細資訊，請參閱 [Integration Tests documentation](./docs/integration-tests.md)。

### 程式碼檢查（Linting）與預先檢查（Preflight Checks）

為確保程式碼品質與格式一致性，請執行預先檢查：

```bash
npm run preflight
```

此指令會依照專案的`package.json`設定，執行 ESLint、Prettier、所有測試以及其他檢查。

_專業小提示_

在 clone 完專案後，請建立一個 git precommit hook 檔案，以確保你的提交始終保持乾淨。

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

若要在此專案中單獨格式化程式碼，請在根目錄執行以下指令：

```bash
npm run format
```

此指令會使用 Prettier，依照專案的程式碼風格指南來格式化程式碼。

#### 程式碼檢查（Linting）

若要單獨對本專案的程式碼進行檢查，請在專案根目錄執行以下指令：

```bash
npm run lint
```

### 程式碼慣例

- 請遵循現有程式碼庫中所使用的程式風格、模式與慣例。
- 請參閱 [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md)（通常位於專案根目錄），以取得有關 AI 協作開發的具體指引，包括 React、註解及 Git 使用等相關慣例。
- **匯入（Imports）：** 請特別注意匯入路徑。本專案使用 ESLint 來強制限制套件之間的相對匯入。

### 專案結構

- `packages/`：包含本專案的各個子套件。
  - `cli/`：命令列介面 (Command Line Interface)。
  - `core/`：Gemini CLI 的核心後端邏輯。
- `docs/`：包含所有專案文件。
- `scripts/`：用於建置、測試與開發任務的工具腳本 (utility scripts)。

如需更詳細的架構說明，請參見 `docs/architecture.md`。

## 除錯 (Debugging)

### VS Code：

0.  使用 `F5` 在 VS Code 中互動式除錯 CLI
1.  從專案根目錄以除錯模式啟動 CLI：
    ```bash
    npm run debug
    ```
    此指令會在`packages/cli`目錄下執行`node --inspect-brk dist/gemini.js`，並在執行時暫停，直到有除錯器連線。接著，你可以在 Chrome 瀏覽器中開啟`chrome://inspect`，以連接到除錯器。
2.  在 Visual Studio Code（VS Code）中，使用「Attach」啟動組態（可在`.vscode/launch.json`中找到）。

另外，如果你偏好直接啟動目前開啟的檔案，也可以在 VS Code 中使用「Launch Program」組態，但一般建議使用「F5」。

若要在 sandbox 容器內觸發中斷點，請執行：

```bash
DEBUG=1 gemini
```

**注意：**如果你在專案的`.env`檔案中有`DEBUG=true`，由於自動排除機制，它不會影響 Gemini CLI。請使用`.gemini/.env`檔案來設定 Gemini CLI 專屬的除錯設定。

### React DevTools

若要除錯 CLI 的 React-based UI，你可以使用 React DevTools。CLI 介面所使用的 Ink 函式庫，與 React DevTools 4.x 版本相容。

1.  **以開發模式啟動 Gemini CLI：**

    ```bash
    DEV=true npm start
    ```

2.  **安裝並執行 React DevTools 4.28.5 版（或最新相容的 4.x 版本）：**

    你可以選擇全域安裝：

    ```bash
    npm install -g react-devtools@4.28.5
    react-devtools
    ```

    或者直接使用 npx 執行：

    ```bash
    npx react-devtools@4.28.5
    ```

    您的執行中命令列介面 (Command Line Interface) 應用程式應會自動連接到 React DevTools。
    ![](/docs/assets/connected_devtools.png)

## 沙箱機制 (Sandboxing)

### macOS Seatbelt

在 macOS 上，`gemini` 會在 `permissive-open` 設定檔（請參閱 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`）下，使用 Seatbelt（`sandbox-exec`），該設定檔會限制對專案資料夾的寫入，但預設允許所有其他操作以及對外網路流量（"open"）。您可以透過在環境變數或 `.env` 檔案中設定 `SEATBELT_PROFILE=restrictive-closed`，切換到 `restrictive-closed` 設定檔（請參閱 `packages/cli/src/utils/sandbox-macos-restrictive-closed.sb`），該設定檔預設拒絕所有操作及對外網路流量（"closed"）。內建可用的設定檔有 `{permissive,restrictive}-{open,closed,proxied}`（有關代理網路設定請見下方）。您也可以切換到自訂設定檔 `SEATBELT_PROFILE=<profile>`，只要您在專案設定目錄 `.gemini` 下建立 `.gemini/sandbox-macos-<profile>.sb` 檔案。

### 基於容器的沙箱機制（所有平台）

若需在 macOS 或其他平台上使用更強的基於容器的沙箱機制，您可以在環境變數或 `.env` 檔案中設定 `GEMINI_SANDBOX=true|docker|podman|<command>`。指定的指令（或若為 `true` 則需安裝 `docker` 或 `podman` 其中之一）必須已安裝於主機上。啟用後，`npm run build:all` 會建立一個最小化的容器（"sandbox"）映像檔，並且 `npm start` 會在該容器的新實例中啟動。首次建置可能需時 20-30 秒（主要因為下載基礎映像檔），但之後的建置與啟動延遲應該都很小。預設建置（`npm run build`）不會重新建置沙箱。

基於容器的沙箱機制會以讀寫權限掛載專案目錄（以及系統暫存目錄），並會在您啟動/停止 Gemini CLI 時自動啟動、停止與移除。沙箱內建立的檔案會自動對應到主機上的使用者/群組。您可以根據需求，透過設定 `SANDBOX_{MOUNTS,PORTS,ENV}`，輕鬆指定額外的掛載點、連接埠或環境變數。您也可以在專案設定目錄（`.gemini`）下建立 `.gemini/sandbox.Dockerfile` 和/或 `.gemini/sandbox.bashrc` 檔案，並以 `gemini` 搭配 `BUILD_SANDBOX=1` 執行，來完全自訂專案的沙箱。

#### 代理網路（Proxied Networking）

所有沙箱機制，包括使用 `*-proxied` 設定檔的 macOS Seatbelt，都支援透過自訂 proxy 伺服器限制對外網路流量，該 proxy 可由 `GEMINI_SANDBOX_PROXY_COMMAND=<command>` 指定，其中 `<command>` 必須啟動一個監聽於 `:::8877` 的 proxy 伺服器以處理相關請求。請參閱 `docs/examples/proxy-script.md`，以取得僅允許 `HTTPS` 連線至 `example.com:443`（例如 `curl https://example.com`）並拒絕所有其他請求的最小 proxy 範例。proxy 會隨著沙箱自動啟動與停止。

## 手動發佈 (Manual Publish)

我們會針對每一次 commit 發佈 artifact 至內部註冊中心。但如果您需要手動產生本地建置，請執行以下指令：

```
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
