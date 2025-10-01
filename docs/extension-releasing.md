# 擴充套件發佈

將擴充套件發佈給使用者主要有兩種方式：

- [Git 儲存庫 (Git repository)](#透過-git-儲存庫發佈)
- [GitHub Releases](#透過-github-releases-發佈)

透過 Git 儲存庫發佈通常是最簡單且最具彈性的方式，而 GitHub Releases 則能在初次安裝時更有效率，因為它們以單一壓縮檔案的形式提供，而不需要像 git clone 那樣逐一下載每個檔案。如果你需要發佈特定平台的二進位檔案，GitHub Releases 也支援附帶平台專屬的壓縮檔案。

## 透過 Git 儲存庫發佈

這是最彈性且簡單的選項。你只需要建立一個公開可存取的 Git 儲存庫（例如公開的 GitHub 儲存庫），然後使用者就可以透過 `gemini extensions install <your-repo-uri>` 安裝你的擴充套件，若是 GitHub 儲存庫，也可以使用簡化的 `gemini extensions install <org>/<repo>` 格式。使用者也可以透過 `--ref=<some-ref>` 參數選擇依賴特定的 ref（分支/標籤/提交），預設為預設分支。

每當有提交（commit）推送到使用者所依賴的 ref 時，系統會提示使用者更新擴充套件。請注意，這也方便進行回滾操作，HEAD commit 永遠被視為最新版本，不論 `gemini-extension.json` 檔案中的實際版本為何。

### 使用 Git 儲存庫管理發佈通道

使用者可以依賴你 Git 儲存庫中的任何 ref，例如分支或標籤，這讓你可以管理多個發佈通道。

舉例來說，你可以維護一個 `stable` 分支，讓使用者透過 `gemini extensions install <your-repo-uri> --ref=stable` 方式安裝。或者，你也可以將預設分支作為穩定版發佈分支，並在另一個分支（例如叫做 `dev`）上進行開發。你可以維護任意多的分支或標籤，為你和使用者提供最大的彈性。

請注意，這些 `ref` 參數可以是標籤、分支，甚至是特定的提交，這讓使用者可以依賴你擴充套件的特定版本。如何管理標籤和分支則由你自行決定。

### 使用 Git 儲存庫的發佈流程範例

雖然你可以用多種方式管理 Git flow 發佈，但我們建議將預設分支視為「穩定」發佈分支。這表示 `gemini extensions install <your-repo-uri>` 的預設行為會在穩定發佈分支上。

假設你想維護三個標準發佈通道，分別是 `stable`、`preview` 和 `dev`。你會在 `dev` 分支上進行所有標準開發。當你準備好進行預覽發佈時，將該分支合併到 `preview` 分支。當你準備將預覽分支升級為穩定版時，將 `preview` 合併到穩定分支（這可能是你的預設分支，或是其他分支）。

你也可以使用 `git cherry-pick` 進行 cherry pick，將某些變更從一個分支挑選到另一個分支，但請注意，這會導致各分支的歷史略有分歧，除非你在每次發佈時強制推送（force push）分支來還原乾淨的歷史（根據你的儲存庫設定，預設分支可能無法這麼做）。如果你打算進行 cherry pick，建議不要將預設分支作為穩定分支，以避免對預設分支進行 force push（通常應避免這麼做）。

## 透過 GitHub Releases 發佈

Gemini CLI 擴充套件可以透過 [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) 發佈。這能為使用者帶來更快、更可靠的初次安裝體驗，因為不需要 clone 整個儲存庫。

每個 release 至少包含一個壓縮檔案，該檔案包含了與該標籤（tag）對應的儲存庫完整內容。如果你的擴充套件需要編譯步驟或有平台專屬的二進位檔案，也可以包含 [預先建置的壓縮檔案](#自訂預先建置壓縮檔案)。

在檢查更新時，Gemini 只會尋找 GitHub 上的最新 release（你必須在建立 release 時標記為最新），除非使用者在安裝時有指定 `--ref=<some-release-tag>` 來選擇特定 release。目前我們尚未支援選擇預發佈版（pre-release）或 semver。

### 自訂預先建置壓縮檔案

自訂壓縮檔案必須直接作為資產（asset）附加到 GitHub release，且必須完全自給自足。也就是說，壓縮檔內應包含完整的擴充套件內容，詳見 [壓縮檔案結構](#壓縮檔案結構)。

如果你的擴充套件與平台無關，你可以只提供一個通用資產。在這種情況下，release 上應只附加一個資產。

如果你想在較大的儲存庫中開發擴充套件，也可以使用自訂壓縮檔案，讓其結構與儲存庫本身不同（例如只壓縮包含擴充套件的子目錄）。

#### 平台專屬壓縮檔案

為了讓 Gemini CLI 能自動找到各平台對應的 release 資產，你必須遵循以下命名規範。CLI 會依下列順序尋找資產：

1.  **平台與架構專屬：** `{platform}.{arch}.{name}.{extension}`
2.  **平台專屬：** `{platform}.{name}.{extension}`
3.  **通用資產：** 若只提供一個資產，則會作為通用備用方案。

- `{name}`：你的擴充套件名稱。
- `{platform}`：作業系統。支援的值有：
  - `darwin`（macOS）
  - `linux`
  - `win32`（Windows）
- `{arch}`：架構。支援的值有：
  - `x64`
  - `arm64`
- `{extension}`：壓縮檔案的副檔名（例如 `.tar.gz` 或 `.zip`）。

**範例：**

- `darwin.arm64.my-tool.tar.gz`（專屬於 Apple Silicon Mac）
- `darwin.my-tool.tar.gz`（適用於所有 Mac）
- `linux.x64.my-tool.tar.gz`
- `win32.my-tool.zip`

#### 壓縮檔案結構

壓縮檔案必須是完整的擴充套件，且需符合所有標準要求——特別是 `gemini-extension.json` 檔案必須位於壓縮檔案的根目錄。

其餘結構應與一般擴充套件完全相同，詳見 [extensions.md](extension.md)。

#### GitHub Actions 工作流程範例

以下是一個 GitHub Actions 工作流程範例，用於為多個平台建置並發佈 Gemini CLI 擴充套件：

```yaml
name: Release Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build extension
        run: npm run build

      - name: Create release assets
        run: |
          npm run package -- --platform=darwin --arch=arm64
          npm run package -- --platform=linux --arch=x64
          npm run package -- --platform=win32 --arch=x64

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            release/darwin.arm64.my-tool.tar.gz
            release/linux.arm64.my-tool.tar.gz
            release/win32.arm64.my-tool.zip
```
