# 發布

## 發布週期與標籤

我們會盡可能嚴格遵循 https://semver.org/，但會在必須偏離時說明原因。我們的每週發布將是次版本增量，發布之間的任何錯誤修正或緊急修正將作為最新發布的修補版本發布。

### 預覽版

新的預覽版發布將在每週二 UTC 23:59 發布。這些發布尚未經過完全審查，可能包含回歸或其他未解決的問題。請協助我們測試並使用 `preview` 標籤安裝。

```bash
npm install -g @google/gemini-cli@preview
```

### 穩定版

- 新的穩定版發布將在每週二 UTC 20:00 發布，這將是上週發布的完整推廣加上任何錯誤修正和驗證。使用 `latest` 標籤。

```bash
npm install -g @google/gemini-cli@latest
```

### 每夜版

- 新版本將在每天 UTC 00:00 發布，這將是發布時主分支的所有變更。應假定有待驗證和問題。使用 `nightly` 標籤。

```bash
npm install -g @google/gemini-cli@nightly
```

# 發布程序

其中 `x.y.z` 是下一個要發布的版本。在大多數週版本發布情況下，這將是 `y` 的遞增，即次版本更新。主版本更新 `x` 將需要更廣泛的協調和溝通。對於修補程式 `z`，請參閱下方。在可能的情況下，我們會盡力遵循 https://semver.org/

我們的發布節奏是新版本先傳送到預覽頻道一週，然後在一週後推廣到穩定版。版本號將遵循 SemVer，週版本遞增次版本。對預覽版和穩定版的修補程式和錯誤修正將遞增修補版本。

## 每夜版發布

每天 UTC 0000 我們會從 `main` 自動部署每夜版發布。這將是下一個正式版 x.y.z 的版本，帶有 nightly 標籤。

## 建立預覽版發布

每週二 UTC 23:59 我們會自動部署下一個正式版 x.y.z 的預覽版發布。

- 這將發生 as a scheduled instance of the ‘release’ action. It will be cut off of Main.
- 這將建立 a branch `release/vx.y.z-preview.n`
- 我們將執行 evals and smoke testing against this branch and the npm package. 目前這應該是手動煙霧測試, 我們還沒有專門的矩陣 或特定的詳細流程. 即將有工作 讓這更正式化和自動化 see https://github.com/google-gemini/gemini-cli/issues/3788
- 安裝的使用者 `@preview` 也會獲得此發布

## Promote Stable Release

經過一週後 (On the following Tuesday) 所有信號都正常, 我們將手動發布 at 2000 UTC 透過目前值班人員.

- 發布動作將使用 並以來源分支為 `release/vx.y.z-preview.n`
- 版本將是 x.y.z
- 發布者將建立並合併 a pr 到主分支，包含版本變更.
- 將執行煙霧測試和手動驗證. 目前這應該是手動煙霧測試, 我們還沒有專門的矩陣 或特定的詳細流程. 即將有工作 讓這更正式化和自動化 see https://github.com/google-gemini/gemini-cli/issues/3788

## Patching Releases

如果關鍵錯誤需要修正 在下次排程發布前, 請遵循此流程 建立修補程式.

### 1. Create a Hotfix Branch

首先，建立新分支 供您修正使用. 此分支的來源取決於 您是要修補 穩定版還是預覽版發布.

- **For a stable release patch:**
  從 Git 標籤建立分支 您需要修補的版本. 標籤名稱格式為 `vx.y.z`.

  ```bash
  # 範例：建立熱修復分支 for v0.2.0
  git checkout v0.2.0 -b hotfix/issue-123-fix-for-v0.2.0
  ```

- **For a preview release patch:**
  從現有的分支建立 預覽版發布分支, 其格式為 `release/vx.y.z-preview.n`.

  ```bash
  # 範例：建立熱修復分支 for a preview release
  git checkout release/v0.2.0-preview.0 && git checkout -b hotfix/issue-456-fix-for-preview
  ```

### 2. Implement the Fix

在您的新熱修復分支中, 建立新提交 包含修正 或從中挑選現有提交 from the `main` branch. 將您的變更合併到 熱修復分支的來源 (ex. https://github.com/google-gemini/gemini-cli/pull/6850).

### 3. Perform the Release

遵循手動發布流程 using the "Release" GitHub Actions workflow.

- **Version**: 對於穩定版修補, 遞增修補版本 (e.g., `v0.2.0` -> `v0.2.1`). 對於預覽版修補, 遞增預覽編號 (e.g., `v0.2.0-preview.0` -> `v0.2.0-preview.1`).
- **Ref**: 使用您的來源分支作為參考 (ex. `release/v0.2.0-preview.0`)

![如何執行發布](assets/release_patch.png)

### 4. Update Versions

熱修復發布後, 將變更合併回 適當的分支.

- **For a stable release hotfix:**
  開啟拉取請求 合併發布分支 (e.g., `release/0.2.1`) back into `main`. 這保持版本號 in `main` up to date.

- **For a preview release hotfix:**
  開啟拉取請求 to merge the new 預覽版發布分支 (e.g., `release/v0.2.0-preview.1`) 回到現有的 預覽版發布分支 (`release/v0.2.0-preview.0`) (ex. https://github.com/google-gemini/gemini-cli/pull/6868)

## Release Schedule

<table>
  <tr>
   <td>Date
   </td>
   <td>Stable UTC 2000
   </td>
   <td>Preview UTC 2359
   </td>
  </tr>
  <tr>
   <td>Aug 19th, 2025
   </td>
   <td>N/A
   </td>
   <td>0.2.0-preview.0
   </td>
  </tr>
  <tr>
   <td>Aug 26th, 2025
   </td>
   <td>0.2.0
   </td>
   <td>0.3.0-preview.0
   </td>
  </tr>
  <tr>
   <td>Sep 2nd, 2025
   </td>
   <td>0.3.0
   </td>
   <td>0.4.0-preview.0
   </td>
  </tr>
  <tr>
   <td>Sep 9th, 2025
   </td>
   <td>0.4.0
   </td>
   <td>0.5.0-preview.0
   </td>
  </tr>
  <tr>
   <td>Sep 16th, 2025
   </td>
   <td>0.5.0
   </td>
   <td>0.6.0-preview.0
   </td>
  </tr>
  <tr>
   <td>Sep 23rd, 2025
   </td>
   <td>0.6.0
   </td>
   <td>0.7.0-preview.0
   </td>
  </tr>
</table>

## 如何發布

發布透過 [release.yml](https://github.com/google-gemini/gemini-cli/actions/workflows/release.yml) GitHub Actions 工作流程管理。要執行修補或熱修復的手動發布：

1.  導覽到儲存庫的 **Actions** 標籤。
2.  從清單中選擇 **Release** 工作流程。
3.  點選 **Run workflow** 下拉按鈕。
4.  填入必要輸入：
    - **Version**：要發布的確切版本（例如，`v0.2.1`）。
    - **Ref**：要發布的分支或提交 SHA（預設為 `main`）。
    - **Dry Run**：保持 `true` 以測試工作流程而不發布，或設定為 `false` 以執行實際發布。
5.  點選 **Run workflow**。

### 簡要說明

每個發布，無論是自動化還是手動，都會執行以下步驟：

1.  從 `main` 分支檢出最新程式碼。
1.  安裝所有相依性。
1.  執行完整的 `preflight` 檢查和整合測試套件。
1.  如果所有測試成功，根據輸入計算下一個版本號。
1.  建立分支名稱 `release/${VERSION}`。
1.  建立標籤名稱 `v${VERSION}`。
1.  然後建置並發布套件到 npm，使用提供的版本號。
1.  最後，為版本建立 GitHub Release。

### 失敗處理

如果工作流程中的任何步驟失敗，它會自動在儲存庫中建立新問題，帶有 `bug` 和 `release-failure` 標籤。問題將包含失敗工作流程執行的連結，以便輕鬆偵錯。

### Docker

我們也執行名為 [release-docker.yml](../.gcp/release-docker.yml) 的 Google cloud build。它發布沙箱 docker 以配合您的發布。一旦服務帳戶權限整理好，這也會移至 GH 並與主要發布檔案合併。

## 發布驗證

推送新發布後，應執行煙霧測試以確保套件按預期運作。這可以透過在本機安裝套件並執行一系列測試來確保它們正常運作。

- `npx -y @google/gemini-cli@latest --version` 如果您不是在進行 rc 或 dev 標籤，用來驗證推送按預期運作
- `npx -y @google/gemini-cli@<release tag> --version` 用來驗證標籤適當推送
- _這在本機是破壞性的_ `npm uninstall @google/gemini-cli && npm uninstall -g @google/gemini-cli && npm cache clean --force &&  npm install @google/gemini-cli@<version>`
- 建議進行基本執行的煙霧測試，練習一些 llm 指令和工具，以確保套件按預期運作。我們會在未來將此編成規範。

## 本機測試與驗證：封裝和發布流程的變更

如果您需要測試發布流程而不實際發布到 NPM 或建立公開 GitHub 發布，您可以從 GitHub UI 手動觸發工作流程。

1.  前往儲存庫的 [Actions 標籤](https://github.com/google-gemini/gemini-cli/actions/workflows/release.yml)。
2.  點選「Run workflow」下拉選單。
3.  保持 `dry_run` 選項勾選（`true`）。
4.  點選「Run workflow」按鈕。

這將執行整個發布流程，但會跳過 `npm publish` 和 `gh release create` 步驟。您可以檢查工作流程日誌以確保一切按預期運作。

在提交之前，在本機測試封裝和發布流程的任何變更是至關重要的。這確保套件會正確發布，並且在使用者安裝時會按預期運作。

要驗證您的變更，您可以執行發布流程的試執行。這將模擬發布流程而不實際將套件發布到 npm 註冊表。

```bash
npm_package_version=9.9.9 SANDBOX_IMAGE_REGISTRY="registry" SANDBOX_IMAGE_NAME="thename" npm run publish:npm --dry-run
```

此指令將執行以下操作：

1.  建置所有套件。
2.  執行所有預發布腳本。
3.  建立將發布到 npm 的套件 tarball。
4.  列印將發布的套件摘要。

然後您可以檢查產生的 tarball，以確保它們包含正確的檔案且 `package.json` 檔案已正確更新。tarball 將在每個套件目錄的根目錄中建立（例如，`packages/cli/google-gemini-cli-0.1.6.tgz`）。

透過執行試執行，您可以確信您對封裝流程的變更是正確的，並且套件會成功發布。

## Release Deep Dive

The main goal of the release process is to take the source code from the packages/ directory, build it, and assemble a
clean, self-contained package in a temporary `bundle` directory at the root of the project. This `bundle` directory is what
actually gets published to NPM.

Here are the key stages:

Stage 1: Pre-Release Sanity Checks and Versioning

- What happens: Before any files are moved, the process ensures the project is in a good state. This involves running tests,
  linting, and type-checking (npm run preflight). The version number in the root package.json and packages/cli/package.json
  is updated to the new release version.
- Why: This guarantees that only high-quality, working code is released. Versioning is the first step to signify a new
  release.

Stage 2: Building the Source Code

- What happens: The TypeScript source code in packages/core/src and packages/cli/src is compiled into JavaScript.
- File movement:
  - packages/core/src/\*_/_.ts -> compiled to -> packages/core/dist/
  - packages/cli/src/\*_/_.ts -> compiled to -> packages/cli/dist/
- Why: The TypeScript code written during development needs to be converted into plain JavaScript that can be run by
  Node.js. The core package is built first as the cli package depends on it.

Stage 3: Assembling the Final Publishable Package

This is the most critical stage where files are moved and transformed into their final state for publishing. A temporary
`bundle` folder is created at the project root to house the final package contents.

1.  The `package.json` is Transformed:
    - What happens: The package.json from packages/cli/ is read, modified, and written into the root `bundle`/ directory.
    - File movement: packages/cli/package.json -> (in-memory transformation) -> `bundle`/package.json
    - Why: The final package.json must be different from the one used in development. Key changes include:
      - Removing devDependencies.
      - Removing workspace-specific "dependencies": { "@gemini-cli/core": "workspace:\*" } and ensuring the core code is
        bundled directly into the final JavaScript file.
      - Ensuring the bin, main, and files fields point to the correct locations within the final package structure.

2.  The JavaScript Bundle is Created:
    - What happens: The built JavaScript from both packages/core/dist and packages/cli/dist are bundled into a single,
      executable JavaScript file.
    - File movement: packages/cli/dist/index.js + packages/core/dist/index.js -> (bundled by esbuild) -> `bundle`/gemini.js (or a
      similar name).
    - Why: This creates a single, optimized file that contains all the necessary application code. It simplifies the package
      by removing the need for the core package to be a separate dependency on NPM, as its code is now included directly.

3.  Static and Supporting Files are Copied:
    - What happens: Essential files that are not part of the source code but are required for the package to work correctly
      or be well-described are copied into the `bundle` directory.
    - File movement:
      - README.md -> `bundle`/README.md
      - LICENSE -> `bundle`/LICENSE
      - packages/cli/src/utils/\*.sb (sandbox profiles) -> `bundle`/
    - Why:
      - The README.md and LICENSE are standard files that should be included in any NPM package.
      - The sandbox profiles (.sb files) are critical runtime assets required for the CLI's sandboxing feature to
        function. They must be located next to the final executable.

Stage 4: Publishing to NPM

- What happens: The npm publish command is run from inside the root `bundle` directory.
- Why: By running npm publish from within the `bundle` directory, only the files we carefully assembled in Stage 3 are uploaded
  to the NPM registry. This prevents any source code, test files, or development configurations from being accidentally
  published, resulting in a clean and minimal package for users.

Summary of File Flow

```mermaid
graph TD
    subgraph "Source Files"
        A["packages/core/src/*.ts<br/>packages/cli/src/*.ts"]
        B["packages/cli/package.json"]
        C["README.md<br/>LICENSE<br/>packages/cli/src/utils/*.sb"]
    end

    subgraph "Process"
        D(Build)
        E(Transform)
        F(Assemble)
        G(Publish)
    end

    subgraph "Artifacts"
        H["Bundled JS"]
        I["Final package.json"]
        J["bundle/"]
    end

    subgraph "Destination"
        K["NPM Registry"]
    end

    A --> D --> H
    B --> E --> I
    C --> F
    H --> F
    I --> F
    F --> J
    J --> G --> K
```

This process ensures that the final published artifact is a purpose-built, clean, and efficient representation of the
project, rather than a direct copy of the development workspace.
