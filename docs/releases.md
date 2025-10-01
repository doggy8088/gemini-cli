# Gemini CLI 發行版本

## 發行節奏與標籤

我們將盡可能遵循 https://semver.org/，但若有任何偏離，將會特別說明。每週的發行版本會以次版本號（minor version）遞增，若在兩次發行之間有任何錯誤修正或緊急修復（hotfix），則會針對最新發行版本以修補版本號（patch version）發佈。

每週二約 2000 UTC，將會推出新的 Stable（穩定版）與 Preview（預覽版）發行。推升流程如下：

- 程式碼提交至 main 分支 (main branch)，並於每晚推送至 `nightly` 標籤
- 程式碼在 main 分支 (main branch) 上最多停留 1 週後，會推升至 `preview` 頻道
- 1 週後，最新的 `preview` 頻道會推升至 `stable` 頻道
- 修補（patch）修正將根據需求同時針對 `preview` 與 `stable` 產出，每次修補版本號都會遞增

### 預覽版（Preview）

這些發行版本尚未經過完整驗證，可能包含回歸（regression）或其他未解決的問題。請協助我們測試並使用 `preview` 標籤安裝。

```bash
npm install -g @google/gemini-cli@preview
```

### Stable

這將是上週發佈版本的完整升級，並包含任何錯誤修正及驗證。請使用 `latest` 標籤。

```bash
npm install -g @google/gemini-cli@latest
```

### Nightly

- 新版本會在每天 UTC 0000 發布。這將包含截至發布時間 main 分支 (main branch) 的所有變更。請假設仍有待驗證事項及問題。請使用 `nightly` 標籤。

```bash
npm install -g @google/gemini-cli@nightly
```

## 每週版本推升（Weekly Release Promotion）

每週二，值班工程師會觸發「Promote Release」工作流程。這個單一動作會自動化整個每週版本發佈流程：

1.  **將 Preview 推升為 Stable：** 工作流程會識別最新的 `preview` 版本，並將其推升為 `stable`。這會成為 npm 上新的 `latest` 版本。
2.  **將 Nightly 推升為 Preview：** 接著會將最新的 `nightly` 版本推升為新的 `preview` 版本。
3.  **準備下一個 Nightly：** 系統會自動建立並合併一個 pull request，將 `main` 的版本號提升，以準備下一次 nightly 發佈。

這個流程確保了發佈節奏的一致性與可靠性，並將人工干預降到最低。

### 版本號的唯一權威來源（Source of Truth for Versioning）

為了確保最高的可靠性，版本推升流程會以 **NPM registry 作為唯一權威來源**，用來判斷每個發佈通道（`stable`、`preview` 和 `nightly`）目前的版本。

1.  **從 NPM 取得資訊：** 工作流程會先查詢 NPM 的 `dist-tags`（`latest`、`preview`、`nightly`），取得目前用戶可用套件的精確版本字串。
2.  **完整性交叉檢查：** 對於從 NPM 取得的每個版本，工作流程都會執行關鍵的完整性檢查：
    - 驗證儲存庫中是否存在對應的 **git 標籤（tag）**。
    - 驗證是否已建立對應的 **GitHub Release**。
3.  **發現不一致時中止：** 如果 NPM 上列出的某個版本缺少 git 標籤或 GitHub Release，工作流程會立即失敗。這項嚴格檢查可防止從損壞或不完整的先前版本進行推升，並提醒值班工程師有發佈狀態不一致，需手動處理。
4.  **計算下一個版本號：** 只有在這些檢查全部通過後，工作流程才會根據從 NPM 取得的可信版本號來計算下一個 semantic version。

這種以 NPM 為優先、結合完整性檢查的方式，使發佈流程極為穩健，能防止僅依賴 git 歷史或 API 輸出時可能出現的版本號不一致問題。

## 手動發佈（Manual Releases）

若有需要在常規 nightly 與每週推升排程之外發佈版本，且不屬於修補（patching）流程時，可以使用 `Release: Manual` 工作流程。此流程可直接從任何分支、標籤或 commit SHA 發佈指定版本。

### 如何建立手動發佈

1.  前往儲存庫的 **Actions** 分頁。
2.  從清單中選擇 **Release: Manual** 工作流程。
3.  點擊 **Run workflow** 下拉按鈕。
4.  填寫必要欄位：
    - **Version**：要發佈的精確版本（例如 `v0.6.1`）。必須是有效的 semantic version，且需有 `v` 前綴。
    - **Ref**：要發佈的分支、標籤或完整 commit SHA。
    - **NPM Channel**：要發佈到的 npm channel。選項有 `preview`、`nightly`、`latest`（用於穩定版發佈）以及 `dev`。預設為 `dev`。
    - **Dry Run**：保持為 `true` 會執行所有步驟但不實際發佈，設為 `false` 則會進行實際發佈。
    - **Force Skip Tests**：設為 `true` 可跳過測試套件。不建議在生產環境發佈時使用。
    - **Skip GitHub Release**：設為 `true` 可略過建立 GitHub Release，只建立 npm 發佈。
5.  點擊 **Run workflow**。

之後工作流程會進行測試（若未跳過）、建置並發佈版本。若在非 dry run 執行時失敗，系統會自動建立一則 GitHub issue，並附上失敗細節。

## 回滾／前滾（Rollback/Rollforward）

若某個發佈版本出現重大回歸（regression），你可以快速將 npm `dist-tag` 指回先前穩定版本（回滾），或指向新修補版本（前滾）。`Release: Change Tags` 工作流程提供一個安全且可控的方式來執行這項操作。

這是回滾與前滾的首選方法，因為它不需要完整的發佈流程。

### 如何變更發佈標籤

1.  前往儲存庫的 **Actions** 分頁。
2.  從清單中選擇 **Release: Change Tags** 工作流程。
3.  點擊 **Run workflow** 下拉按鈕。
4.  填寫必要欄位：
    - **Version**：你想將標籤指向的現有套件版本（例如 `0.5.0-preview-2`）。此版本**必須**已發佈到 npm registry。
    - **Channel**：要套用的 npm `dist-tag`（例如 `preview`、`stable`）。
    - **Dry Run**：保持為 `true` 只記錄動作不做變更，設為 `false` 則會實際變更標籤。
5.  點擊 **Run workflow**。

此工作流程會針對 `@google/gemini-cli` 與 `@google/gemini-cli-core` 兩個套件執行 `npm dist-tag add`，將指定 channel 指向指定版本。

## 修補（Patching）

如果某個已在 `main` 上修復的重大 bug 需要回補到 `stable` 或 `preview` 發佈版本，現在流程已高度自動化。

### 如何進行修補

#### 1. 建立 Patch Pull Request

有兩種方式可以建立 patch pull request：

**方式 A：透過 GitHub 留言（建議）**

當包含修復的 pull request 已經合併後，維護者可以在該 PR 下方留言，格式如下：

`/patch [channel]`

- **channel**（可選）：
  - _未指定 channel_ - 同時修補 stable 與 preview channel（預設，建議大多數修復採用）
  - `both` - 同時修補 stable 與 preview channel（與預設相同）
  - `stable` - 僅修補 stable channel
  - `preview` - 僅修補 preview channel

範例：

- `/patch`（同時修補 stable 與 preview－預設）
- `/patch both`（同時修補 stable 與 preview－明確指定）
- `/patch stable`（僅修補 stable）
- `/patch preview`（僅修補 preview）

`Release: Patch from Comment` 工作流程會自動尋找 merge commit SHA 並觸發 `Release: Patch (1) Create PR` 工作流程。如果 PR 尚未合併，系統會留言提示失敗。

**方式 B：手動觸發工作流程**

前往 **Actions** 分頁，執行 **Release: Patch (1) Create PR** 工作流程。

- **Commit**：你想 cherry-pick 的 `main` 上的完整 commit SHA。
- **Channel**：你想修補的 channel（`stable` 或 `preview`）。

此工作流程會自動：

1.  找出該 channel 的最新發佈標籤。
2.  若尚未存在，則從該標籤建立 release branch（例如 `release/v0.5.1`）。
3.  從 release branch 建立新的 hotfix branch。
4.  將指定 commit cherry-pick 到 hotfix branch。
5.  從 hotfix branch 建立 pull request 回 release branch。

#### 2. 審查與合併

審查自動建立的 pull request，確保 cherry-pick 成功且變更正確。審查通過後即可合併。

**安全注意事項：** `release/*` 分支受 branch protection 規則保護。對這些分支的 pull request 必須經過至少一位程式碼擁有者（code owner）審查才能合併，以確保未經授權的程式碼不會被發佈。

#### 2.5. 將多個 commit 加入 hotfix（進階用法）

如果你需要在單一 patch 發佈中納入多個修復，可以在初始 patch PR 建立後，將其他 commit 加入 hotfix branch：

1. **從主要修復開始：** 在最重要的 PR 上使用 `/patch`（或 `/patch both`）來建立初始 hotfix branch 與 PR。

2. **在本地端檢出 hotfix branch：**

   ```bash
   git fetch origin
   git checkout hotfix/v0.5.1/stable/cherry-pick-abc1234  # Use the actual branch name from the PR
   ```

3. **擷取（cherry-pick）其他提交（commits）**：

   ```bash
   git cherry-pick <commit-sha-1>
   git cherry-pick <commit-sha-2>
   # Add as many commits as needed
   ```

4. **推送已更新的分支**：

   ```bash
   git push origin hotfix/v0.5.1/stable/cherry-pick-abc1234
   ```

5. **測試與審查**：現有的 patch PR 會自動隨著你的額外 commit 進行更新。由於你現在是同時釋出多個變更，請務必徹底測試。

6. **更新 PR 描述**：建議更新 PR 標題與描述，以反映此 PR 已包含多個修復項目。

這種做法讓你可以將相關的修復項目整合到單一的 patch 版本釋出，同時完全掌控納入內容及衝突解決方式。

#### 3. 自動化釋出

當 pull request 合併後，`Release: Patch (2) Trigger` workflow 會自動觸發。接著會啟動 `Release: Patch (3) Release` workflow，其將會：

1.  建置並測試修補後的程式碼。
2.  將新的 patch 版本發佈到 npm。
3.  建立一個包含 patch 說明的全新 GitHub Release。

這個全自動流程可確保 patch 的建立與釋出始終如一且可靠。

#### 疑難排解：舊分支 Workflow

**問題**：如果 patch 觸發 workflow 失敗，出現類似 "Resource not accessible by integration" 或提及不存在的 workflow 檔案（例如 `patch-release.yml`）的錯誤，這表示 hotfix 分支包含了過時的 workflow 檔案版本。

**根本原因**：當 PR 合併時，GitHub Actions 會執行**來源分支**（即 hotfix 分支）上的 workflow 定義，而不是目標分支（release 分支）上的。如果 hotfix 分支是從早於 workflow 改進的舊 release 分支建立，則會使用舊的 workflow 邏輯。

**解決方式**：

**方案一：手動觸發（快速修復）**  
從擁有最新 workflow 程式碼的分支手動觸發已更新的 workflow：

```bash
# For a preview channel patch with tests skipped
gh workflow run release-patch-2-trigger.yml --ref <branch-with-updated-workflow> \
  --field ref="hotfix/v0.6.0-preview.2/preview/cherry-pick-abc1234" \
  --field workflow_ref=<branch-with-updated-workflow> \
  --field dry_run=false \
  --field force_skip_tests=true

# For a stable channel patch
gh workflow run release-patch-2-trigger.yml --ref <branch-with-updated-workflow> \
  --field ref="hotfix/v0.5.1/stable/cherry-pick-abc1234" \
  --field workflow_ref=<branch-with-updated-workflow> \
  --field dry_run=false \
  --field force_skip_tests=false

# Example using main branch (most common case)
gh workflow run release-patch-2-trigger.yml --ref main \
  --field ref="hotfix/v0.6.0-preview.2/preview/cherry-pick-abc1234" \
  --field workflow_ref=main \
  --field dry_run=false \
  --field force_skip_tests=true
```

**注意**：請將 `<branch-with-updated-workflow>` 替換為包含最新 workflow 改進的分支（通常是 `main`，但如果在測試更新，也可能是某個 feature 分支）。

**選項 2：更新 Hotfix 分支**
將最新的 main 分支 (main branch) 合併到你的 hotfix 分支，以取得已更新的 workflows：

```bash
git checkout hotfix/v0.6.0-preview.2/preview/cherry-pick-abc1234
git merge main
git push
```

然後關閉並重新開啟 PR，以使用已更新的版本重新觸發 workflow。

**選項 3：直接觸發發佈（Direct Release Trigger）**
完全跳過觸發 workflow，直接執行發佈（release）workflow：

```bash
# Replace channel and release_ref with appropriate values
gh workflow run release-patch-3-release.yml --ref main \
  --field type="preview" \
  --field dry_run=false \
  --field force_skip_tests=true \
  --field release_ref="release/v0.6.0-preview.2"
```

### Docker

我們也會執行一個 Google Cloud Build，名為 [release-docker.yml](../.gcp/release-docker.yml)。這個流程會發佈 sandbox Docker，以配合你的發佈版本。待服務帳戶（service account）權限設定完成後，這部分也會移轉到 GitHub，並與主要發佈檔案合併。

## 發佈驗證（Release Validation）

推送新版本後，應進行 smoke testing（冒煙測試），以確保套件運作如預期。你可以在本地安裝這些套件，並執行一系列測試來驗證其功能是否正常。

- `npx -y @google/gemini-cli@latest --version` 用來驗證推送是否如預期運作（如果你不是使用 rc 或 dev 標籤）
- `npx -y @google/gemini-cli@<release tag> --version` 用來驗證標籤是否正確推送
- _這會在本地造成破壞性操作_ `npm uninstall @google/gemini-cli && npm uninstall -g @google/gemini-cli && npm cache clean --force &&  npm install @google/gemini-cli@<version>`
- 建議進行 smoke testing，基本執行幾個大型語言模型 (LLM) 指令與工具，以確保套件如預期運作。我們未來會將這部分流程進一步標準化。

## 本地測試與驗證：套件打包與發佈流程的變更

如果你需要在不實際發佈到 npm 或建立公開 GitHub 發佈版本的情況下測試發佈流程，可以從 GitHub UI 手動觸發 workflow。

1.  前往儲存庫的 [Actions 分頁](https://github.com/google-gemini/gemini-cli/actions/workflows/release-manual.yml)。
2.  點擊「Run workflow」下拉選單。
3.  保持 `dry_run` 選項已勾選（`true`）。
4.  點擊「Run workflow」按鈕。

這會執行完整的發佈流程，但會略過 `npm publish` 和 `gh release create` 步驟。你可以檢查 workflow 日誌，以確保一切運作正常。

在提交任何套件打包與發佈流程的變更前，務必先在本地進行測試。這可以確保套件能正確發佈，且使用者安裝時能如預期運作。

為了驗證你的變更，可以執行一次發佈流程的 dry run（模擬執行）。這會模擬發佈流程，但不會真的將套件發佈到 npm registry。

```bash
npm_package_version=9.9.9 SANDBOX_IMAGE_REGISTRY="registry" SANDBOX_IMAGE_NAME="thename" npm run publish:npm --dry-run
```

此指令將執行以下操作：

1.  建置所有套件。
2.  執行所有 prepublish 腳本 (scripts)。
3.  建立將要發佈到 npm 的套件壓縮檔 (tarballs)。
4.  輸出將要發佈的套件摘要。

你可以檢查產生的壓縮檔，確保它們包含正確的檔案，並且 `package.json` 檔案已正確更新。壓縮檔會建立在每個套件目錄的根目錄下（例如：`packages/cli/google-gemini-cli-0.1.6.tgz`）。

透過執行 dry run（模擬執行），你可以確信你對封裝流程的更動是正確的，並且套件將能順利發佈。

## 發佈流程深度解析

發佈流程會為不同的發佈管道建立兩種不同型態的產物：供 NPM registry 使用的標準套件，以及供 GitHub Releases 使用的單一自包含可執行檔。

以下是主要階段：

**階段 1：發佈前檢查與版本號更新**

- **執行內容：** 在任何檔案移動前，流程會確保專案狀態良好。這包括執行測試、程式碼檢查（linting）以及型別檢查（`npm run preflight`）。根目錄下的 `package.json` 和 `packages/cli/package.json` 會更新為新的發佈版本號。

**階段 2：為 NPM 建置原始碼**

- **執行內容：** 將 `packages/core/src` 和 `packages/cli/src` 內的 TypeScript 原始碼編譯為標準 JavaScript。
- **檔案移動：**
  - `packages/core/src/**/*.ts` -> 編譯為 -> `packages/core/dist/`
  - `packages/cli/src/**/*.ts` -> 編譯為 -> `packages/cli/dist/`
- **原因：** 開發期間撰寫的 TypeScript 程式碼需要轉換為 Node.js 可執行的純 JavaScript。`core` 套件會先建置，因為 `cli` 套件依賴它。

**階段 3：將標準套件發佈到 NPM**

- **執行內容：** 針對 `@google/gemini-cli-core` 和 `@google/gemini-cli` 套件執行 `npm publish` 指令。
- **原因：** 這會將它們發佈為標準 Node.js 套件。使用者透過 `npm install -g @google/gemini-cli` 安裝時會下載這些套件，`npm` 會自動處理 `@google/gemini-cli-core` 依賴的安裝。這些套件中的程式碼不會被打包成單一檔案。

**階段 4：組裝並建立 GitHub Release 產物**

此階段於 NPM 發佈後進行，會建立單一檔案的可執行檔，讓 `npx` 能直接從 GitHub repository 使用。

1.  **建立 JavaScript Bundle：**
    - **執行內容：** 來自 `packages/core/dist` 和 `packages/cli/dist` 的已建置 JavaScript，以及所有第三方 JavaScript 依賴，會由 `esbuild` 打包成單一可執行的 JavaScript 檔案（例如：`gemini.js`）。`node-pty` 函式庫因包含原生二進位檔而不會被納入此 bundle。
    - **原因：** 這會產生一個包含所有必要應用程式碼的單一最佳化檔案。對於希望執行 CLI 而不需完整 `npm install` 的使用者來說，這大幅簡化了執行流程，所有依賴（包含 `core` 套件）都直接內嵌。

2.  **組裝 `bundle` 目錄：**
    - **執行內容：** 在專案根目錄建立暫存的 `bundle` 資料夾。將單一的 `gemini.js` 可執行檔及其他必要檔案放入其中。
    - **檔案移動：**
      - `gemini.js`（來自 esbuild）-> `bundle/gemini.js`
      - `README.md` -> `bundle/README.md`
      - `LICENSE` -> `bundle/LICENSE`
      - `packages/cli/src/utils/*.sb`（sandbox profiles）-> `bundle/`
    - **原因：** 這樣會產生一個乾淨、自包含的目錄，內含執行 CLI 及瞭解其授權和用法所需的一切。

3.  **建立 GitHub Release：**
    - **執行內容：** 將 `bundle` 目錄的內容（包含 `gemini.js` 可執行檔）作為資產附加到新的 GitHub Release。
    - **原因：** 這讓 CLI 的單一檔案版本可供直接下載，並啟用 `npx https://github.com/google-gemini/gemini-cli` 指令，該指令會下載並執行這個特定的 bundle 產物。

**產物摘要**

- **NPM：** 發佈標準、未打包的 Node.js 套件。主要產物為 `packages/cli/dist` 內的程式碼，並依賴 `@google/gemini-cli-core`。
- **GitHub Release：** 發佈單一打包的 `gemini.js` 檔案，內含所有依賴，便於透過 `npx` 執行。

這種雙重產物流程確保了傳統 `npm` 使用者，以及偏好 `npx` 便利性的使用者，都能獲得最佳化的體驗。

## 通知

失敗的發佈工作流程會自動建立一個帶有標籤 `release-failure` 的 issue。

當這類型的 issue 被建立時，會自動在維護者的聊天頻道發送通知。

### 修改聊天通知

通知使用 [GitHub for Google Chat](https://workspace.google.com/marketplace/app/github_for_google_chat/536184076190)。若要修改通知，請在聊天空間內使用 `/github-settings`。

> [!WARNING]
> 以下說明為依賴聊天應用程式 UI 內部結構的脆弱變通方式，未來更新後可能會失效。

目前可用標籤清單無法正確載入。如果你想新增一個在 repo 前 30 個標籤（依字母排序）中未出現的標籤，必須使用瀏覽器的開發者工具手動修改 UI：

1. 開啟瀏覽器的開發者工具（例如 Chrome DevTools）。
2. 在 `/github-settings` 對話框中，檢查標籤清單。
3. 找到其中一個代表標籤的 `<li>` 元素。
4. 在 HTML 中，將該 `<li>` 元素的 `data-option-value` 屬性修改為你想要的標籤名稱（例如：`release-failure`）。
5. 在 UI 上點擊你剛剛修改的標籤以選取，然後儲存設定。
