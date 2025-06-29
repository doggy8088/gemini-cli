# 多檔案讀取工具 (`read_many_files`)

本文件說明 Gemini CLI 的 `read_many_files` 工具。

## 說明

使用 `read_many_files` 可讀取由路徑或 glob 模式指定的多個檔案的內容。此工具的行為取決於提供的檔案：

- 對於文字檔案，此工具會將其內容串連成單一字串。
- 對於圖片 (例如 PNG、JPEG) 和 PDF 檔案，只要透過名稱或副檔名明確要求，它就會讀取並以 base64 編碼資料的形式傳回。

`read_many_files` 可用於執行諸如取得程式碼庫概觀、尋找特定功能的實作位置、檢閱文件或從多個設定檔收集內容等工作。

### 引數

`read_many_files` 接受以下引數：

- `paths` (list[string]，必要)：相對於工具目標目錄的 glob 模式或路徑陣列 (例如 `["src/**/*.ts"]`、`["README.md", "docs/", "assets/logo.png"]`)。
- `exclude` (list[string]，選用)：要排除的檔案/目錄的 glob 模式 (例如 `["**/*.log", "temp/"]`)。如果 `useDefaultExcludes` 為 true，這些模式會新增至預設排除項目。
- `include` (list[string]，選用)：要包含的其他 glob 模式。這些模式會與 `paths` 合併 (例如 `["*.test.ts"]` 可用於在測試檔案被廣泛排��時特別加入，或 `["images/*.jpg"]` 可用於包含特定圖片類型)。
- `recursive` (boolean，選用)：是否要遞迴搜尋。這主要由 glob 模式中的 `**` 控制。預設為 `true`。
- `useDefaultExcludes` (boolean，選用)：是否要套用預設排除模式清單 (例如 `node_modules`、`.git`、非圖片/PDF 的二進位檔案)。預設為 `true`。
- `respect_git_ignore` (boolean，選用)：尋找檔案時是否要遵循 .gitignore 模式。預設為 true。

## 如何搭配 Gemini CLI 使用 `read_many_files`

`read_many_files` 會搜尋符合所提供 `paths` 和 `include` 模式的檔案，同時遵循 `exclude` 模式和預設排除項目 (如果已啟用)。

- 對於文字檔案：它會讀取每個相符檔案的內容 (嘗試略過未明確要求為圖片/PDF 的二進位檔案)，並將其串連成單一字串，每個檔案的內容之間會以 `--- {filePath} ---` 分隔符號隔開。預設使用 UTF-8 編碼。
- 對於圖片和 PDF 檔案：如果透過名稱或副檔名明確要求 (例如 `paths: ["logo.png"]` 或 `include: ["*.pdf"]`)，工具會讀取檔案並以 base64 編碼字串的形式傳回其內容。
- 工具會檢查初始內容中是否有空位元組，藉此嘗試偵測並略過其他二進位檔案 (與常見圖片/PDF 類型不符或未明確要求的檔案)。

使用方式：

```
read_many_files(paths=["此處為您的檔案或路徑。"], include=["要包含的其他檔案。"], exclude=["要排除的檔案。"], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 範例

讀取 `src` 目錄中的所有 TypeScript 檔案：

```
read_many_files(paths=["src/**/*.ts"])
```

讀取主要 README、`docs` 目錄中的所有 Markdown 檔案，以及一個特定的標誌圖片，並排除一個特定檔案：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

讀取所有 JavaScript 檔案，但明確包含測試檔案和 `images` 資料夾中的所有 JPEG 檔案：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要注意事項

- **二進位檔案處理：**
  - **圖片/PDF 檔案：** 工具可以讀取常見的圖片類型 (PNG、JPEG 等) 和 PDF 檔案，並以 base64 編碼資料的形式傳回。這些檔案「必須」由 `paths` 或 `include` 模式明確指定 (例如，透過指定確切的檔案名稱，如 `image.png`，或模式，如 `*.jpeg`)。
  - **其他二進位檔案：** 工具會檢查其初始內容中是否有空位元組，藉此嘗試偵測並略過其他類型的二進位��案。工具會將這些檔案從其輸出中排除。
- **效能：** 讀取大量檔案或非常大的個別檔案可能會耗用大量資源。
- **路徑明確性：** 請確保相對於工具的目標目錄正確指定路徑和 glob 模式。對於圖片/PDF 檔案，請確保模式足夠明確以包含它們。
- **預設排除項目：** 請注意預設的排除模式 (例如 `node_modules`、`.git`)，如果需要覆寫它們，請使用 `useDefaultExcludes=False`，但請謹慎使用。
