# 多檔案讀取工具

此文件說明 Gemini CLI 的 `read_many_files` 工具。

## 說明

使用 `read_many_files` 可依據路徑或 glob 模式讀取多個檔案的內容。此工具的行為取決於提供的檔案：

- 對於文字檔，此工具會將其內容串接成單一字串。
- 對於圖片 (例如 PNG、JPEG) 和 PDF 檔案，如果透過名稱或副檔名明確指定，工具會讀取並以 base64 編碼資料的形式傳回。

`read_many_files` 可用於執行諸如取得程式碼庫概觀、尋找特定功能的實作位置、審閱文件，或從多個設定檔收集情境等任務。

### 引數

`read_many_files` 接受以下引數：

- `paths` (list[string]，必要)：相對於工具目標目錄的 glob 模式或路徑陣列 (例如：`["src/**/*.ts"]`、`["README.md", "docs/", "assets/logo.png"]`)。
- `exclude` (list[string]，選用)：要排除的檔案/目錄的 glob 模式 (例如：`["**/*.log", "temp/"]`)。如果 `useDefaultExcludes` 為 true，這些會被新增至預設排除項目中。
- `include` (list[string]，選用)：要包含的額外 glob 模式。這些會與 `paths` 合併 (例如：`["*.test.ts"]` 可用來特別加入被廣泛排除的測試檔案，或 `["images/*.jpg"]` 可用來包含特定的圖片類型)。
- `recursive` (boolean，選用)：是否要遞迴搜尋。這主要由 glob 模式中的 `**` 控制。預設為 `true`。
- `useDefaultExcludes` (boolean，選用)：是否要套用預設的排除模式清單 (例如：`node_modules`、`.git`、非圖片/PDF 的二進位檔案)。預設為 `true`。
- `respect_git_ignore` (boolean，選用)：尋找檔案時是否遵循 .gitignore 模式。預設為 true。

## 如何搭配 Gemini CLI 使用 `read_many_files`

`read_many_files` 會搜尋符合所提供之 `paths` 與 `include` 模式的檔案，同時遵循 `exclude` 模式和預設排除項 (若已啟用)。

- 對於文字檔：它會讀取每個相符檔案的內容 (會嘗試跳過未明確要求為圖片/PDF 的二進位檔案)，並將其串接成單一字串，每個檔案的內容之間會以分隔符 `--- {filePath} ---` 隔開。預設使用 UTF-8 編碼。
- 對於圖片和 PDF 檔案：如果透過名稱或副檔名明確指定 (例如：`paths: ["logo.png"]` 或 `include: ["*.pdf"]`)，工具會讀取檔案並將其內容以 base64 編碼字串的形式傳回。
- 此工具會嘗試透過檢查其他二進位檔案 (那些不符合常見圖片/PDF 類型或未明確指定的檔案) 的初始內容中是否有空位元組，來偵測並跳過它們。

用法：

```
read_many_files(paths=["在此輸入您的檔案或路徑。"], include=["要額外包含的檔案。"], exclude=["要排除的檔案。"], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 範例

讀取 `src` 目錄中所有的 TypeScript 檔案：

```
read_many_files(paths=["src/**/*.ts"])
```

讀取主要的 README、`docs` 目錄中所有的 Markdown 檔案，以及一個特定的標誌圖片，並排除一個特定檔案：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

讀取所有 JavaScript 檔案，但明確包含測試檔案以及 `images` 資料夾中的所有 JPEG 檔案：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要注意事項

- **二進位檔案處理：**
  - **圖片/PDF 檔案：** 此工具可讀取常見的圖片類型 (PNG、JPEG 等) 和 PDF 檔案，並以 base64 編碼資料的形式傳回。這些檔案**必須**由 `paths` 或 `include` 模式明確指定 (例如，透過指定確切的檔名如 `image.png` 或模式如 `*.jpeg`)。
  - **其他二進位檔案：** 此工具會嘗試透過檢查其初始內容中的空位元組來偵測並跳過其他類型的二進位檔案。此工具會將這些檔案從其輸出中排除。
- **效能：** 讀取大量檔案或非常大的單一檔案可能會耗用大量資源。
- **路徑明確性：** 請確保路徑和 glob 模式是相對於工具的目標目錄正確指定的。對於圖片/PDF 檔案，請確保模式足夠具體以包含它們。
- **預設排除項：** 請注意預設的排除模式 (如 `node_modules`、`.git`)，如果您需要覆寫它們，請使用 `useDefaultExcludes=False`，但請謹慎操作。
