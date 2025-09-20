# 擴充套件發佈

將擴充套件發佈給使用者有兩種主要方式：

- [Git 儲存庫 (Git repository)](#透過-git-儲存庫發佈)
- [GitHub Releases](#透過-github-releases-發佈)

透過 Git 儲存庫 (Git repository) 發佈通常是最簡單且最具彈性的方式；而 GitHub Releases 則能在初次安裝時更有效率，因為它們以單一壓縮檔案方式提供，而不需要進行 git clone（逐一下載每個檔案）。如果你需要發佈特定平台的二進位檔案，也可以在 GitHub Releases 中提供平台專屬的壓縮檔。

## 透過 Git 儲存庫發佈

這是最彈性且簡單的選項。你只需要建立一個公開可存取的 Git 儲存庫（例如公開的 GitHub repository），然後使用者就可以透過 `gemini extensions install <your-repo-uri>` 安裝你的擴充套件，若是 GitHub repository 則可以使用簡化的 `gemini extensions install <org>/<repo>` 格式。使用者也可以選擇依賴特定的 ref（分支/標籤/提交）來安裝，方法是使用 `--ref=<some-ref>` 參數，預設會使用預設分支。

每當你將提交推送到使用者所依賴的 ref 時，系統會提示使用者更新擴充套件。請注意，這也讓回滾變得容易，HEAD 提交永遠被視為最新版本，無論 `gemini-extension.json` 檔案中的實際版本為何。

### 使用 Git 儲存庫管理發佈通道

使用者可以依賴你 Git 儲存庫中的任何 ref，例如分支或標籤，這讓你可以管理多個發佈通道。

舉例來說，你可以維護一個 `stable` 分支，使用者可以透過 `gemini extensions install <your-repo-uri> --ref=stable` 這種方式安裝。或者，你也可以將預設分支作為穩定發佈分支，並在另一個分支（例如稱為 `dev`）進行開發。你可以維護任意數量的分支或標籤，為你和使用者提供最大的彈性。

請注意，這些 `ref` 參數可以是標籤、分支，甚至是特定的提交，這讓使用者可以依賴你擴充套件的特定版本。如何管理標籤和分支則由你自行決定。

### 使用 Git 儲存庫的發佈流程範例

雖然你可以用多種方式管理 Git flow 的發佈流程，我們建議將預設分支視為「穩定」發佈分支。這表示 `gemini extensions install <your-repo-uri>` 的預設行為會在穩定發佈分支上。

假設你想維護三個標準發佈通道：`stable`、`preview` 和 `dev`。你會在 `dev` 分支進行所有標準開發。當你準備好進行預覽發佈時，將該分支合併到 `preview` 分支。當你準備好將預覽分支晉升為穩定版時，將 `preview` 合併到穩定分支（這可能是預設分支，也可能是其他分支）。

你也可以使用 `git cherry-pick` 將某些變更 cherry-pick 到另一個分支，但請注意，這會導致分支之間的歷史略有分歧，除非你在每次發佈時強制推送（force push）變更到分支，以將歷史重設為乾淨狀態（根據你的儲存庫設定，這對預設分支可能不可行）。如果你打算進行 cherry-pick，建議不要將預設分支作為穩定分支，以避免對預設分支進行 force-push，這通常應該避免。

## 透過 GitHub Releases 發佈

Gemini CLI 擴充套件可以透過 [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) 發佈。這能為使用者帶來更快速、更可靠的初次安裝體驗，因為不需要 clone 整個儲存庫。

每個發佈至少包含一個壓縮檔案，該檔案包含與標籤對應的儲存庫完整內容。如果你的擴充套件需要建置步驟或有平台專屬的二進位檔案，也可以包含 [預先建置的壓縮檔](#自訂預先建置壓縮檔)。

在檢查更新時，Gemini 只會查找 GitHub 上的最新發佈（你必須在建立發佈時將其標記為最新），除非使用者在安裝時指定了特定發佈版本（使用 `--ref=<some-release-tag>` 參數）。目前尚未支援選擇預發佈版本或 semver。

### 自訂預先建置壓縮檔

自訂壓縮檔必須直接作為資產附加到 GitHub 發佈，且必須完全自給自足。也就是說，壓縮檔內應包含完整的擴充套件內容，請參考 [壓縮檔結構](#壓縮檔結構)。

如果你的擴充套件與平台無關，可以只提供一個通用資產。在這種情況下，發佈只需附加一個資產即可。

如果你想在較大的儲存庫中開發擴充套件，也可以使用自訂壓縮檔，內容結構可與儲存庫不同（例如只壓縮包含擴充套件的子目錄）。

#### 平台專屬壓縮檔

為了讓 Gemini CLI 能自動找到每個平台對應的發佈資產，你必須遵循以下命名規則。CLI 會依照下列順序搜尋資產：

1.  **平台與架構專屬：** `{platform}.{arch}.{name}.{extension}`
2.  **平台專屬：** `{platform}.{name}.{extension}`
3.  **通用：** 如果只提供一個資產，則會作為通用備用資產使用。

- `{name}`：你的擴充套件名稱。
- `{platform}`：作業系統。支援的值有：
  - `darwin`（macOS）
  - `linux`
  - `win32`（Windows）
- `{arch}`：架構。支援的值有：
  - `x64`
  - `arm64`
- `{extension}`：壓縮檔的副檔名（例如 `.tar.gz` 或 `.zip`）。

**範例：**

- `darwin.arm64.my-tool.tar.gz`（專屬於 Apple Silicon Macs）
- `darwin.my-tool.tar.gz`（適用於所有 Mac）
- `linux.x64.my-tool.tar.gz`
- `win32.my-tool.zip`

#### 壓縮檔結構

壓縮檔必須是完整的擴充套件，且需符合所有標準要求——特別是 `gemini-extension.json` 檔案必須位於壓縮檔根目錄。

其餘結構應與一般擴充套件完全相同，請參考 [extensions.md](extension.md)。

#### GitHub Actions 工作流程範例

以下是一個 GitHub Actions 工作流程範例，可用於建置並發佈多平台的 Gemini CLI 擴充套件：

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
