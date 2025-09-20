# 如何貢獻

我們非常歡迎你對本專案提出修補與貢獻。

## 在開始之前

### 簽署貢獻者授權協議（CLA）

對本專案的貢獻必須附帶[貢獻者授權協議](https://cla.developers.google.com/about)（Contributor License Agreement, CLA）。
你（或你的雇主）將保留你貢獻內容的著作權；這僅僅是授權我們可以將你的貢獻作為專案的一部分來使用與再發佈。

如果你或你目前的雇主已經簽署過 Google CLA（即使是為了其他專案），通常就不需要再次簽署。

請造訪<https://cla.developers.google.com/>以檢視你目前的協議，或簽署新的協議。

### 閱讀我們的社群指南

本專案遵循 [Google 的開源社群指南](https://opensource.google/conduct/)。

## 貢獻流程

### 程式碼審查（Code Review）

所有提交內容，包括專案成員的提交，都需要經過審查。我們使用 [GitHub pull requests](https://docs.github.com/articles/about-pull-requests) 來進行程式碼審查。

### 自行認領 Issue

如果你正在尋找可以著手處理的 Issue，請參考我們標記為 ["help wanted"](https://github.com/google-gemini/gemini-cli/issues?q=is%3Aissue+state%3Aopen+label%3A%22help+wanted%22) 的 Issue 清單。

要將 Issue 指派給自己，只需新增一則內容為 `/assign` 的留言。該留言必須只包含這段文字，不能有其他內容。這個指令會將該 Issue 指派給你，前提是該 Issue 尚未被指派。

請注意，你同時最多只能被指派 3 個 Issue。

### Pull Request 指南

為了協助我們能更快審查與合併你的 PR，請遵循以下指南。不符合這些標準的 PR 可能會被關閉。

#### 1. 連結至現有 Issue

所有 PR 都應該連結至我們追蹤器中的現有 Issue。這可確保每一項變更在撰寫程式碼前已經討論過，並且符合專案目標。

- **修正錯誤（bug fixes）：** PR 應連結至該錯誤回報的 Issue。
- **新功能（features）：** PR 應連結至經維護者核准的功能請求或提案 Issue。

如果你的變更尚無對應的 Issue，請**先建立一個 Issue**，並在開始撰寫程式碼前等待回饋。

#### 2. 保持 PR 小而專注

我們鼓勵小型、原子性的 PR，只針對單一 Issue 或新增單一、獨立的功能。

- **建議：** 建立一個只修正特定錯誤或新增特定功能的 PR。
- **避免：** 將多個無關的變更（例如：錯誤修正、新功能、重構）合併在同一個 PR。

大型變更應拆分為一系列較小、邏輯清晰的 PR，讓每個 PR 都能獨立審查與合併。

#### 3. 進行中請使用 Draft PR

如果你希望在工作初期獲得回饋，請使用 GitHub 的 **Draft Pull Request** 功能。這會告知維護者該 PR 尚未準備好正式審查，但可以進行討論與初步回饋。

#### 4. 確認所有檢查通過

在提交 PR 前，請執行 `npm run preflight`，確保所有自動化檢查均已通過。此指令會執行所有測試、程式碼檢查與其他風格檢查。

#### 5. 更新文件

如果你的 PR 帶來了使用者可見的變更（例如：新增指令、修改旗標、行為變更），你也必須同步更新 `/docs` 目錄中的相關文件。

#### 6. 撰寫清楚的 Commit 訊息與良好的 PR 描述

你的 PR 應有清楚、具描述性的標題，以及詳細說明變更內容的描述。Commit 訊息請遵循 [Conventional Commits](https://www.conventionalcommits.org/) 標準。

- **良好 PR 標題：** `feat(cli): Add --json flag to 'config get' command`
- **不佳 PR 標題：** `Made some changes`

在 PR 描述中，請說明你進行這些變更的「原因」，並連結至相關 Issue（例如：`Fixes #123`）。

## Fork 專案

如果你 fork 了此儲存庫，你將可以執行 Build、Test 與 Integration test 工作流程。但若要執行整合測試，你需要新增一個 [GitHub Repository Secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)，名稱為 `GEMINI_API_KEY`，並設為你擁有的有效 API 金鑰。你的金鑰與 secret 僅對你的儲存庫私有；沒有權限的人無法看到你的金鑰，你也無法看到與本儲存庫相關的任何 secrets。

此外，你還需要點擊 `Actions` 分頁，並啟用你的儲存庫工作流程，你會在畫面中央看到一個大型藍色按鈕。

## 開發環境設置與工作流程

本節將指引貢獻者如何建置、修改並理解本專案的開發環境。

### 設定開發環境

**先決條件：**

1.  **Node.js**：
    - **開發環境：** 請使用 Node.js `~20.19.0`。由於上游開發相依性問題，必須使用此特定版本。你可以使用像 [nvm](https://github.com/nvm-sh/nvm) 這樣的工具來管理 Node.js 版本。
    - **生產環境：** 若在生產環境執行命令列介面 (Command Line Interface)，可接受任何 Node.js `>=20` 版本。
2.  **Git**

### 建置流程

要複製（clone）此儲存庫：

```bash
git clone https://github.com/google-gemini/gemini-cli.git # Or your fork's URL
cd gemini-cli
```

要安裝`package.json`中定義的相依套件以及 root 相依套件：

```bash
npm install
```

要建置整個專案（所有套件）：

```bash
npm run build
```

此指令通常會將 TypeScript 編譯為 JavaScript、打包資產，並將套件（packages）準備好以供執行。關於建置過程中發生的詳細內容，請參考 `scripts/build.js` 和 `package.json` 腳本。

### 啟用沙箱機制

強烈建議啟用[沙箱機制](#沙箱機制-sandboxing)，且至少需要在你的 `~/.env` 中設定 `GEMINI_SANDBOX=true`，並確保有可用的沙箱機制提供者（例如 `macOS Seatbelt`、`docker` 或 `podman`）。詳細資訊請參閱[沙箱機制](#沙箱機制-sandboxing)。

若要同時建置 `gemini` 命令列介面 (Command Line Interface) 工具與 sandbox 容器，請在專案根目錄執行 `build:all`：

```bash
npm run build:all
```

若要略過 sandbox 容器的建置，可以改用 `npm run build`。

### 執行

若要從原始碼啟動 Gemini CLI（完成建置後），請在專案根目錄執行下列指令：

```bash
npm start
```

如果你希望在 gemini-cli 資料夾之外執行原始碼建置，可以利用 `npm link path/to/gemini-cli/packages/cli`（請參閱：[docs](https://docs.npmjs.com/cli/v9/commands/npm-link)）或 `alias gemini="node path/to/gemini-cli/packages/cli"` 搭配 `gemini` 來執行。

### 執行測試

本專案包含兩種類型的測試：單元測試（unit tests）和整合測試（integration tests）。

#### 單元測試（Unit Tests）

若要執行本專案的單元測試套件：

```bash
npm run test
```

這將會執行位於 `packages/core` 和 `packages/cli` 目錄中的測試。在提交任何變更之前，請確保所有測試皆已通過。若需更全面的檢查，建議執行 `npm run preflight`。

#### 整合測試

整合測試旨在驗證 Gemini CLI 的端對端功能。這些測試不會作為預設的 `npm run test` 指令的一部分執行。

若要執行整合測試，請使用以下指令：

```bash
npm run test:e2e
```

如需有關整合測試框架的詳細資訊，請參閱 [Integration Tests documentation](./docs/integration-tests.md)。

### 程式碼檢查（Linting）與預檢（Preflight Checks）

為了確保程式碼品質與格式一致性，請執行預檢（preflight check）：

```bash
npm run preflight
```

此指令會執行 ESLint、Prettier、所有測試，以及專案`package.json`中定義的其他檢查。

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

若要分開格式化此專案中的程式碼，請在根目錄執行以下指令：

```bash
npm run format
```

此指令會使用 Prettier，依照專案的程式碼風格指南來格式化程式碼。

#### Linting

若要單獨對本專案的程式碼進行 lint，請在專案根目錄執行以下指令：

```bash
npm run lint
```

### 程式撰寫慣例

- 請遵循現有程式碼庫中所使用的程式碼風格、模式與慣例。
- 請參閱 [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md)（通常位於專案根目錄），以取得有關 AI 協助開發的具體指引，包括 React、註解及 Git 使用等相關慣例。
- **匯入（Imports）：** 請特別注意匯入路徑。本專案透過 ESLint 強制限制套件間的相對匯入。

### 專案結構

- `packages/`：包含本專案的各個子套件。
  - `cli/`：命令列介面 (Command Line Interface)。
  - `core/`：Gemini CLI 的核心後端邏輯。
- `docs/`：包含所有專案文件。
- `scripts/`：用於建置、測試與開發任務的工具腳本 (utility scripts)。

如需更詳細的架構說明，請參閱 `docs/architecture.md`。

## 除錯

### VS Code：

0.  執行 CLI 以在 VS Code 中進行互動式除錯，請使用 `F5`
1.  從專案根目錄以除錯模式啟動 CLI：
    ```bash
    npm run debug
    ```
    此指令會在`packages/cli`目錄下執行`node --inspect-brk dist/gemini.js`，並在執行時暫停，直到有除錯器附加。接著，你可以在 Chrome 瀏覽器中開啟`chrome://inspect`，以連接到除錯器。
2.  在 Visual Studio Code（VS Code）中，使用「Attach」啟動組態（可在`.vscode/launch.json`中找到）。

另外，如果你希望直接啟動目前開啟的檔案，也可以在 VS Code 中使用「Launch Program」組態，但一般建議使用 F5。

若要在 sandbox 容器內觸發中斷點，請執行：

```bash
DEBUG=1 gemini
```

**注意：**如果你在專案的`.env`檔案中有`DEBUG=true`，由於自動排除機制，這不會影響 Gemini CLI。請使用`.gemini/.env`檔案來設定 Gemini CLI 專屬的除錯設定。

### React DevTools

若要除錯 CLI 的 React 基礎 UI，可以使用 React DevTools。CLI 介面所用的 Ink 函式庫相容於 React DevTools 4.x 版本。

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

    您的執行中命令列介面 (Command Line Interface) 應用程式應會連接至 React DevTools。
    ![](/docs/assets/connected_devtools.png)

## 沙箱機制 (Sandboxing)

### macOS Seatbelt

在 macOS 上，`gemini` 會在 `permissive-open` 設定檔（請參閱 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`）下使用 Seatbelt（`sandbox-exec`），該設定檔會限制對專案資料夾的寫入，但預設允許所有其他操作及對外網路流量（"open"）。您可以透過在環境變數或 `.env` 檔案中設定 `SEATBELT_PROFILE=restrictive-closed`，切換至 `restrictive-closed` 設定檔（請參閱 `packages/cli/src/utils/sandbox-macos-restrictive-closed.sb`），該設定檔預設拒絕所有操作及對外網路流量（"closed"）。內建可用的設定檔有 `{permissive,restrictive}-{open,closed,proxied}`（如需代理網路相關說明，請見下方）。您也可以切換至自訂設定檔 `SEATBELT_PROFILE=<profile>`，前提是您同時在專案設定目錄 `.gemini` 下建立 `.gemini/sandbox-macos-<profile>.sb` 檔案。

### 基於容器的沙箱機制（所有平台）

若需在 macOS 或其他平台上使用更強的基於容器的沙箱機制，您可以在環境變數或 `.env` 檔案中設定 `GEMINI_SANDBOX=true|docker|podman|<command>`。所指定的指令（或若為 `true` 則需安裝 `docker` 或 `podman` 其中之一）必須已安裝於主機上。啟用後，`npm run build:all` 會建構一個最小化的容器（"sandbox"）映像檔，`npm start` 則會在該容器的新實例中啟動。首次建構可能需時 20-30 秒（主要因為需下載基礎映像檔），但之後的建構與啟動延遲應該都很小。預設建構（`npm run build`）不會重新建構 sandbox。

基於容器的沙箱機制會以讀寫權限掛載專案目錄（以及系統暫存目錄），並會隨著您啟動或停止 Gemini CLI 自動啟動、停止與移除。於 sandbox 內建立的檔案應會自動對應到主機上的使用者/群組。您可以依需求設定 `SANDBOX_{MOUNTS,PORTS,ENV}`，輕鬆指定額外的掛載點、連接埠或環境變數。您也可以在專案設定目錄（`.gemini`）下建立 `.gemini/sandbox.Dockerfile` 和/或 `.gemini/sandbox.bashrc` 檔案，並以 `gemini` 搭配 `BUILD_SANDBOX=1` 執行，以自訂您的 sandbox 並觸發自訂 sandbox 的建構。

#### 代理網路（Proxied Networking）

所有沙箱機制，包括使用 `*-proxied` 設定檔的 macOS Seatbelt，都支援透過自訂 proxy 伺服器來限制對外網路流量，該 proxy 可透過 `GEMINI_SANDBOX_PROXY_COMMAND=<command>` 指定，其中 `<command>` 必須啟動一個 proxy 伺服器並在 `:::8877` 上監聽相關請求。請參閱 `docs/examples/proxy-script.md`，該 proxy 僅允許 `HTTPS` 連線至 `example.com:443`（例如 `curl https://example.com`），其餘所有請求皆會被拒絕。proxy 會隨著 sandbox 自動啟動與停止。

## 手動發佈

我們會將每一次 commit 的產物發佈到內部註冊中心。但如果您需要手動建立本地建構，請執行以下指令：

```
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
