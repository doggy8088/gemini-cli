# 多檔案讀取工具 (`read_many_files`)

本文檔說明 Gemini CLI 的 `read_many_files` 工具。

## 說明

使用 `read_many_files` 可根據指定的路徑或萬用字元 (wildcards) 讀取多個檔案的內容。此工具的行為會依據提供的檔案類型而有所不同：

- 對於文字檔案，此工具會將其內容串接為單一字串。
- 對於圖片（如 PNG、JPEG）、PDF、音訊（MP3、WAV）、以及影片（MP4、MOV）檔案，若以檔名或副檔名明確指定，則會以 base64 編碼資料的方式讀取並回傳。

`read_many_files` 可用於執行如總覽程式碼庫、查找特定功能實作位置、審查文件、或從多個設定檔收集 context 等任務。

**注意：** `read_many_files` 會依據提供的路徑或萬用字元 (wildcards) 搜尋檔案。若僅提供目錄路徑（如 `"/docs"`），將回傳空結果；此工具需要像 `"/docs/*"` 或 `"/docs/*.md"` 這樣的萬用字元模式來識別相關檔案。

### 參數

`read_many_files` 接受以下參數：

- `paths`（list[string]，必填）：相對於工具目標目錄的萬用字元模式或路徑陣列（例如 `["src/**/*.ts"]`、`["README.md", "docs/*", "assets/logo.png"]`）。
- `exclude`（list[string]，選填）：要排除的檔案／目錄萬用字元模式（例如 `["**/*.log", "temp/"]`）。若 `useDefaultExcludes` 為 true，這些會加入預設排除清單。
- `include`（list[string]，選填）：額外要包含的萬用字元模式。這些會與 `paths` 合併（例如，若測試檔案被廣泛排除，可用 `["*.test.ts"]` 來特別加入測試檔案，或用 `["images/*.jpg"]` 來包含特定圖片類型）。
- `recursive`（boolean，選填）：是否進行遞迴搜尋。主要由萬用字元模式中的 `**` 控制。預設為 `true`。
- `useDefaultExcludes`（boolean，選填）：是否套用預設排除模式（例如 `node_modules`、`.git`、非圖片／PDF 的二進位檔案）。預設為 `true`。
- `respect_git_ignore`（boolean，選填）：尋找檔案時是否遵循 .gitignore 規則。預設為 true。

## 如何在 Gemini CLI 中使用 `read_many_files`

`read_many_files` 會搜尋符合所提供 `paths` 和 `include` 模式的檔案，同時遵循 `exclude` 模式及預設排除（若啟用）。

- 對於文字檔案：會讀取每個符合條件檔案的內容（嘗試略過未明確指定為圖片／PDF 的二進位檔案），並將內容以單一字串串接，每個檔案內容之間以分隔符 `--- {filePath} ---` 分隔。預設使用 UTF-8 編碼。
- 工具會在最後一個檔案後插入 `--- End of content ---`。
- 對於圖片與 PDF 檔案：若以檔名或副檔名明確指定（如 `paths: ["logo.png"]` 或 `include: ["*.pdf"]`），工具會讀取檔案並以 base64 編碼字串回傳內容。
- 工具會嘗試偵測並略過其他二進位檔案（不屬於常見圖片／PDF 類型或未明確指定者），方法是檢查檔案開頭是否有 null byte。

用法：

```
read_many_files(paths=["Your files or paths here."], include=["Additional files to include."], exclude=["Files to exclude."], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 範例

讀取 `src` 目錄中的所有 TypeScript 檔案：

```
read_many_files(paths=["src/**/*.ts"])
```

閱讀主要的 README、`docs` 目錄下所有的 Markdown 檔案，以及特定的 logo 圖片，但排除某個特定檔案：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

讀取所有 JavaScript 檔案，但明確包含測試檔案以及 `images` 資料夾中的所有 JPEG 檔案：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要注意事項

- **二進位檔案處理：**
  - **圖片/PDF/音訊/影片檔案：** 此工具可讀取常見圖片格式（PNG、JPEG 等）、PDF、音訊（mp3、wav）以及影片（mp4、mov）檔案，並以 base64 編碼資料的形式回傳。這些檔案_必須_明確地透過 `paths` 或 `include` 模式指定（例如，指定確切檔名如 `video.mp4`，或使用像 `*.mov` 這樣的模式）。
  - **其他二進位檔案：** 工具會嘗試透過檢查檔案開頭內容是否包含 null 位元組來偵測並略過其他類型的二進位檔案。這些檔案將不會包含在輸出結果中。
- **效能：** 讀取大量檔案或單一超大檔案時，可能會消耗較多資源。
- **路徑指定：** 請確保路徑與萬用字元 (wildcards) 模式是相對於工具目標目錄正確指定。對於圖片/PDF 檔案，請確保模式足夠明確以包含這些檔案。
- **預設排除：** 請注意預設的排除模式（如 `node_modules`、`.git`），若需覆寫，請使用 `useDefaultExcludes=False`，但請謹慎操作。
