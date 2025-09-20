# 擴充功能發佈

將擴充功能發佈給使用者主要有兩種方式：

- [Git 儲存庫](#releasing-through-a-git-repository)
- [GitHub Releases](#releasing-through-github-releases)

透過 Git 儲存庫發佈通常是最簡單且最具彈性的方式，而使用 GitHub Releases 則能在初次安裝時更有效率，因為它們是以單一壓縮檔案的形式發佈，而不需要進行 git clone（逐一下載每個檔案）。如果你需要發佈特定平台的二進位檔案，GitHub Releases 也可以包含平台專屬的壓縮檔案。

## 透過 Git 儲存庫發佈

這是最具彈性且最簡單的選擇。你只需要建立一個公開可存取的 Git 儲存庫（例如公開的 GitHub 儲存庫），然後使用者就可以透過 `gemini extensions install <your-repo-uri>` 安裝你的擴充功能，若是 GitHub 儲存庫，也可以使用簡化的 `gemini extensions install <org>/<repo>` 格式。使用者也可以選擇依賴特定的 ref（分支/標籤/提交），方法是使用 `--ref=<some-ref>` 參數，預設為預設分支。

每當有提交推送到使用者所依賴的 ref 時，系統會提示使用者更新擴充功能。請注意，這也讓回滾操作變得容易，HEAD 提交永遠被視為最新版本，而不論 `gemini-extension.json` 檔案中的實際版本為何。

### 使用 Git 儲存庫管理發佈通道

使用者可以依賴你 Git 儲存庫中的任何 ref，例如分支或標籤，這讓你可以管理多個發佈通道。

舉例來說，你可以維護一個 `stable` 分支，使用者可以透過 `gemini extensions install <your-repo-uri> --ref=stable` 這種方式安裝。或者，你也可以將預設分支當作穩定發佈分支，並在另一個分支（例如命名為 `dev`）進行開發。你可以維護任意數量的分支或標籤，為你和使用者提供最大的彈性。

請注意，這些 `ref` 參數可以是標籤、分支，甚至是特定提交，這讓使用者可以依賴你擴充功能的特定版本。你可以自行決定如何管理你的標籤和分支。

### 使用 Git 儲存庫的發佈流程範例

雖然你可以用多種方式管理 Git flow 發佈，但我們建議將預設分支視為「穩定」發佈分支。這表示 `gemini extensions install <your-repo-uri>` 的預設行為是使用穩定發佈分支。

假設你想維護三個標準發佈通道：`stable`、`preview` 和 `dev`。你會在 `dev` 分支進行所有標準開發。當你準備好進行預覽發佈時，將該分支合併到 `preview` 分支。當你準備好將預覽分支提升為穩定版時，將 `preview` 合併到穩定分支（可能是預設分支，也可能是其他分支）。

你也可以使用 `git cherry-pick` 從一個分支挑選（cherry pick）變更到另一個分支，但請注意，這會導致分支之間的歷史略有分歧，除非你在每次發佈時對分支進行強制推送（force push）以恢復乾淨的歷史（根據你的儲存庫設定，預設分支可能無法這麼做）。如果你計畫進行 cherry pick，建議不要將預設分支作為穩定分支，以避免對預設分支進行 force-push（通常應避免這麼做）。

## 透過 GitHub Releases 發佈

Gemini CLI 擴充功能可以透過 [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) 發佈。這能為使用者帶來更快速且更可靠的初次安裝體驗，因為不需要 clone 整個儲存庫。

每個發佈至少包含一個壓縮檔案，內含該標籤（tag）下儲存庫的完整內容。如果你的擴充功能需要執行建置步驟或包含特定平台的二進位檔案，發佈也可以包含 [預先建置的壓縮檔](#custom-pre-built-archives)。

在檢查更新時，gemini 只會在 GitHub 上尋找最新發佈（你必須在建立發佈時將其標記為最新），除非使用者在安裝時有指定 `--ref=<some-release-tag>` 來安裝特定發佈。目前我們尚不支援選擇參與預發佈版本或 semver。

### 自訂預先建置壓縮檔

自訂壓縮檔必須直接作為資產附加到 GitHub 發佈，並且必須完全自給自足。這表示它們應包含完整的擴充功能，請參考 [壓縮檔結構](#archive-structure)。

如果你的擴充功能與平台無關，你可以只提供一個通用資產。在這種情況下，該發佈只需附加一個資產即可。

如果你想在更大的儲存庫中開發你的擴充功能，也可以使用自訂壓縮檔。你可以建置一個與儲存庫本身結構不同的壓縮檔（例如只壓縮包含擴充功能的子目錄）。

#### 特定平台壓縮檔

為了確保 Gemini CLI 能自動找到每個平台對應的發佈資產，你必須遵循以下命名規範。CLI 會依照下列順序搜尋資產：

1.  **特定平台與架構：** `{platform}.{arch}.{name}.{extension}`
2.  **特定平台：** `{platform}.{name}.{extension}`
3.  **通用：** 如果只提供一個資產，則會作為通用備用方案使用。

- `{name}`：你的擴充功能名稱。
- `{platform}`：作業系統。支援的值有：
  - `darwin`（macOS）
  - `linux`
  - `win32`（Windows）
- `{arch}`：架構。支援的值有：
  - `x64`
  - `arm64`
- `{extension}`：壓縮檔的副檔名（例如 `.tar.gz` 或 `.zip`）。

**範例：**

- `darwin.arm64.my-tool.tar.gz`（專屬於 Apple Silicon Mac）
- `darwin.my-tool.tar.gz`（適用於所有 Mac）
- `linux.x64.my-tool.tar.gz`
- `win32.my-tool.zip`

#### 壓縮檔結構

壓縮檔必須是完整的擴充功能，並符合所有標準要求——特別是 `gemini-extension.json` 檔案必須位於壓縮檔的根目錄。

其餘結構應與一般擴充功能完全相同，請參考 [extensions.md](extension.md)。

#### GitHub Actions 工作流程範例

以下是一個 GitHub Actions 工作流程範例，用於建置並發佈多平台的 Gemini CLI 擴充功能：

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
