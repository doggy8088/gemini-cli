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

#### 格式化

若要單獨格式化此專案的程式碼，請在專案根目錄執行下列指令：

```bash
npm run format
```

此指令使用 Prettier，依專案的程式風格準則格式化程式碼。

#### Lint 檢查

若要單獨對此專案的程式碼進行 Lint 檢查，請在專案根目錄執行下列指令：

```bash
npm run lint
```

### 程式碼慣例

- 請遵循現有程式碼庫中使用的程式設計風格、模式和約定。
- 請參閱 [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md)（通常位於專案根目錄）以獲取有關 AI 協助開發的具體指示，包括 React、註釋和 Git 使用的約定。
- **匯入：** 特別注意匯入路徑。專案使用 ESLint 來強制限制套件之間的相對匯入。

### 專案結構

- `packages/`: 包含專案的各個子套件。
  - `cli/`: 命令列介面。
  - `core/`: Gemini CLI 的核心後端邏輯。
- `docs/`: 包含所有專案文件。
- `scripts/`: 用於建構、測試和開發任務的工具腳本。

欲了解更詳細的架構，請參閱 `docs/architecture.md`。

## 除錯

### VS Code

0.  在 VS Code 中按 `F5` 可互動式執行 CLI 並進行除錯。
1.  從專案根目錄以除錯模式啟動 CLI：
  ```bash
  npm run debug
  ```
  該指令會在 `packages/cli` 目錄中執行 `node --inspect-brk dist/gemini.js`，在除錯器連線前暫停程式執行。之後可在 Chrome 中開啟 `chrome://inspect` 來連線除錯器。
2.  在 VS Code 中，使用位於 `.vscode/launch.json` 的 "Attach" launch 配置。

另外，如果您偏好直接啟動目前開啟的檔案，也可以使用 VS Code 的 "Launch Program" 配置，但一般建議使用 `F5`。

要在沙箱容器內觸發斷點，請執行：

```bash
DEBUG=1 gemini
```

**注意：** 若專案的 `.env` 檔中有 `DEBUG=true`，這不會影響 gemini-cli，因為該設定會被自動排除。若要針對 gemini-cli 設定除錯，請使用 `.gemini/.env` 檔案。

### React DevTools

要除錯 CLI 的 React-based 使用者介面，可使用 React DevTools。CLI 使用的介面庫 Ink 與 React DevTools 4.x 相容。

1.  啟動 Gemini CLI 的開發模式：

  ```bash
  DEV=true npm start
  ```

2.  安裝並執行 React DevTools（4.28.5 或相容的 4.x 最新版本）：

  您可以全域安裝：

  ```bash
  npm install -g react-devtools@4.28.5
  react-devtools
  ```

  或使用 npx 直接執行：

  ```bash
  npx react-devtools@4.28.5
  ```

  執行中的 CLI 應會自動連線到 React DevTools。
  ![](/docs/assets/connected_devtools.png)

## Sandboxing

### macOS Seatbelt

在 macOS 上，`gemini` 使用 Seatbelt（`sandbox-exec`），預設採用 `permissive-open` 的配置檔（請參見 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`）；該配置會限制對專案資料夾的寫入，但預設允許其他操作與對外網路流量（稱為「open」）。您可以透過在環境變數或 `.env` 檔中設定 `SEATBELT_PROFILE=restrictive-closed` 切換到 `restrictive-closed` 配置檔（請參見 `packages/cli/src/utils/sandbox-macos-restrictive-closed.sb`），此配置預設會拒絕所有操作與對外網路流量（稱為「closed」）。內建的可用配置為 `{permissive,restrictive}-{open,closed,proxied}`（關於代理網路設定請見下方說明）。若要使用自訂配置，請在專案設定目錄 `.gemini` 下建立對應的檔案 `.gemini/sandbox-macos-<profile>.sb`，並將 `SEATBELT_PROFILE=<profile>` 設定為該自訂檔名。

### 容器式沙箱化（適用於所有平台）

若要在 macOS 或其他平台上使用更強的容器式沙箱化，您可以在環境變數或 `.env` 中設定 `GEMINI_SANDBOX=true|docker|podman|<command>`。所指定的命令（若為 `true`，則會使用 `docker` 或 `podman`）必須已安裝於主機。啟用後，`npm run build:all` 會建立一個最小的容器（"sandbox"）映像，而 `npm start` 將在該容器的新實例中啟動。首次建立可能需約 20-30 秒（主要用於下載基底映像），之後的建立與啟動開銷會顯著減少。預設的建置（`npm run build`）不會重建沙箱。

容器式沙箱會將專案目錄（以及系統暫存目錄）以讀寫方式掛載，並會在您啟動/停止 Gemini CLI 時自動啟動、停止與移除。於沙箱中建立的檔案應會自動映射回主機上的使用者/群組。您可以透過設定 `SANDBOX_{MOUNTS,PORTS,ENV}` 來指定額外的掛載、埠或環境變數；亦可在專案設定目錄（`.gemini`）下建立 `.gemini/sandbox.Dockerfile` 與/或 `.gemini/sandbox.bashrc`，然後以 `BUILD_SANDBOX=1` 執行 `gemini`，以觸發自訂沙箱映像的建立。

#### 代理網路

所有沙箱化方法（包括使用 `*-proxied` 配置的 macOS Seatbelt）皆支援透過自訂代理伺服器來限制出站網路流量。可使用 `GEMINI_SANDBOX_PROXY_COMMAND=<command>` 指定代理命令，其中 `<command>` 必須啟動一個監聽 `:::8877` 的代理伺服器以處理相關請求。請參閱 `docs/examples/proxy-script.md` 範例，該範例提供一個最小代理，僅允許對 `example.com:443` 的 HTTPS 連線（例如 `curl https://example.com`），並拒絕其他請求。代理伺服器會與沙箱一同自動啟動與停止。

## 手動發佈

本專案會在每次提交時將 artifact 發佈到內部註冊表。但若您需要手動建立本地發佈，請執行下列指令：

```
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
