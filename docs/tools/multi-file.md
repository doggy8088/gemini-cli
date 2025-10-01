# 多檔案讀取工具 (`read_many_files`)

本文檔說明 Gemini CLI 的 `read_many_files` 工具。

## 說明

使用 `read_many_files` 可根據指定的路徑或萬用字元 (wildcards) 讀取多個檔案的內容。此工具的行為會依據所提供的檔案類型而有所不同：

- 對於文字檔案，此工具會將所有內容串接成一個字串。
- 對於圖片（例如 PNG、JPEG）、PDF、音訊（MP3、WAV）及影片（MP4、MOV）檔案，若以檔名或副檔名明確指定，則會讀取並以 base64 編碼資料回傳。

`read_many_files` 可用於執行如取得程式碼庫概覽、查找特定功能的實作位置、審查文件、或從多個設定檔收集 context 等任務。

**注意：** `read_many_files` 會依據所提供的路徑或萬用字元 (wildcards) 搜尋檔案。若僅提供目錄路徑（如 `"/docs"`），則會回傳空結果；此工具需提供像 `"/docs/*"` 或 `"/docs/*.md"` 這樣的模式才能辨識相關檔案。

### 參數

`read_many_files` 接受以下參數：

- `paths`（list[string]，必填）：一組萬用字元 (wildcards) 或相對於工具目標目錄的路徑陣列（例如 `["src/**/*.ts"]`、`["README.md", "docs/*", "assets/logo.png"]`）。
- `exclude`（list[string]，選填）：要排除的檔案／目錄萬用字元 (wildcards)（例如 `["**/*.log", "temp/"]`）。若 `useDefaultExcludes` 為 true，則會加入預設排除項目。
- `include`（list[string]，選填）：額外要包含的萬用字元 (wildcards)。這些會與 `paths` 合併（例如 `["*.test.ts"]` 可用於特別加入測試檔案（test files），即使先前已被廣泛排除，或 `["images/*.jpg"]` 用於包含特定圖片類型）。
- `recursive`（boolean，選填）：是否要遞迴搜尋。主要由萬用字元 (wildcards) 中的 `**` 控制。預設值為 `true`。
- `useDefaultExcludes`（boolean，選填）：是否要套用預設排除模式（例如 `node_modules`、`.git`，非圖片／PDF 的二進位檔案）。預設值為 `true`。
- `respect_git_ignore`（boolean，選填）：尋找檔案時是否遵循 .gitignore 規則。預設值為 true。

## 如何在 Gemini CLI 中使用 `read_many_files`

`read_many_files` 會搜尋符合所提供 `paths` 和 `include` 模式的檔案，同時遵循 `exclude` 排除模式及預設排除（若啟用）。

- 文字檔案：會讀取每個符合條件檔案的內容（並嘗試略過未明確指定為圖片／PDF 的二進位檔案），並將內容串接成一個字串，每個檔案內容之間以分隔符 `--- {filePath} ---` 分隔。預設使用 UTF-8 編碼。
- 工具會在最後一個檔案後插入 `--- End of content ---`。
- 圖片及 PDF 檔案：若以檔名或副檔名明確指定（例如 `paths: ["logo.png"]` 或 `include: ["*.pdf"]`），工具會讀取檔案並以 base64 編碼字串回傳內容。
- 工具會嘗試偵測並略過其他二進位檔案（即未符合常見圖片／PDF 類型或未明確指定者），方法是檢查檔案開頭是否有 null 位元組。

使用方式：

```
read_many_files(paths=["Your files or paths here."], include=["Additional files to include."], exclude=["Files to exclude."], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 範例

讀取 `src` 目錄中的所有 TypeScript 檔案：

```
read_many_files(paths=["src/**/*.ts"])
```

讀取主要的 README、`docs` 目錄下所有的 Markdown 檔案，以及特定的 logo 圖片，並排除特定檔案：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

讀取所有 JavaScript 檔案，但明確包含測試檔案以及 `images` 資料夾中的所有 JPEG 檔案：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要注意事項

- **二進位檔案處理：**
  - **圖片/PDF/音訊/影片檔案：** 此工具可讀取常見圖片格式（PNG、JPEG 等）、PDF、音訊（mp3、wav）及影片（mp4、mov）檔案，並以 base64 編碼資料回傳。這些檔案_必須_明確地透過 `paths` 或 `include` 規則指定（例如，直接指定檔名如 `video.mp4`，或使用類似 `*.mov` 的模式）。
  - **其他二進位檔案：** 工具會嘗試透過檢查檔案開頭內容是否有 null byte 來偵測並略過其他類型的二進位檔案。這些檔案將不會被包含在輸出中。
- **效能：** 讀取大量檔案或單一超大檔案時，可能會消耗大量資源。
- **路徑明確性：** 請確保路徑及萬用字元（wildcards）模式是相對於工具目標目錄正確指定。對於圖片/PDF 檔案，請確保模式足夠明確以納入這些檔案。
- **預設排除：** 請注意預設的排除模式（如 `node_modules`、`.git`），若需覆蓋請使用 `useDefaultExcludes=False`，但請謹慎操作。
