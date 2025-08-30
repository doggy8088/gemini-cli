# 多檔案讀取工具 (`read_many_files`)

本文件描述 Gemini CLI 的 `read_many_files` 工具。

## 描述

使用 `read_many_files` 從路徑或 glob 模式指定的多個檔案讀取內容。此工具的行為取決於提供的檔案：

- 對於文字檔案，此工具將其內容串連成單一字串。
- 對於影像（例如，PNG、JPEG）、PDF、音訊（MP3、WAV）和視訊（MP4、MOV）檔案，如果按名稱或副檔名明確請求，它會讀取並以 base64 編碼資料的形式回傳。

`read_many_files` 可用於執行諸如取得程式碼庫概觀、尋找特定功能的實作位置、檢閱文件或從多個設定檔收集內容等工作。

**注意**：`read_many_files` 會依循提供的路徑或 glob 模式尋找檔案。目錄路徑（如 `"/docs"`）將回傳空結果；此工具需要模式（如 `"/docs/*"` 或 `"/docs/*.md"`）來識別相關檔案。

### 引數

`read_many_files` 接受以下引數：

- `paths`（list[string]，必要）：相對於工具目標目錄的 glob 模式或路徑陣列（例如，`["src/**/*.ts"]`、`["README.md", "docs/*", "assets/logo.png"]`）。
- `exclude`（list[string]，選用）：要排除的檔案/目錄的 glob 模式（例如，`["**/*.log", "temp/"]`）。如果 `useDefaultExcludes` 為 true，這些會新增至預設排除項。
- `include`（list[string]，選用）：要包含的其他 glob 模式。這些會與 `paths` 合併（例如，如果測試檔案被廣泛排除，可以用 `["*.test.ts"]` 特別新增測試檔案，或用 `["images/*.jpg"]` 包含特定影像類型）。
- `recursive`（boolean，選用）：是否遞迴搜尋。這主要由 glob 模式中的 `**` 控制。預設為 `true`。
- `useDefaultExcludes`（boolean，選用）：是否套用預設排除模式清單（例如，`node_modules`、`.git`、非影像/pdf 二進位檔案）。預設為 `true`。
- `respect_git_ignore`（boolean，選用）：尋找檔案時是否遵守 .gitignore 模式。預設為 true。

## 如何在 Gemini CLI 中使用 `read_many_files`

`read_many_files` 會搜尋符合提供的 `paths` 和 `include` 模式的檔案，同時遵守 `exclude` 模式和預設排除項（如果啟用）。

- 對於文字檔案：它會讀取每個匹配檔案的內容（嘗試跳過未明確請求為影像/PDF 的二進位檔案），並將其串連成單一字串，每個檔案的內容之間使用分隔符 `--- {filePath} ---`。預設使用 UTF-8 編碼。
- 工具在最後一個檔案後插入 `--- End of content ---`。
- 對於影像和 PDF 檔案：如果透過名稱或副檔名明確請求（例如，`paths: ["logo.png"]` 或 `include: ["*.pdf"]`），工具會讀取檔案並以 base64 編碼字串形式回傳其內容。
- 工具嘗試透過檢查其初始內容中的 null 位元組來偵測並跳過其他二進位檔案（那些不匹配常見影像/PDF 類型或未明確請求的檔案）。

Usage:

```
read_many_files(paths=["Your files or paths here."], include=["Additional files to include."], exclude=["Files to exclude."], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 範例

讀取 `src` 目錄中的所有 TypeScript 檔案：

```
read_many_files(paths=["src/**/*.ts"])
```

讀取主要 README、`docs` 目錄中的所有 Markdown 檔案和特定標誌影像，排除特定檔案：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

讀取所有 JavaScript 檔案，但明確包含測試檔案和 `images` 資料夾中的所有 JPEG：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要注意事項

- **二進位檔案處理：**
  - **影像/PDF/音訊/視訊檔案：** 工具可以讀取常見的影像類型（PNG、JPEG 等）、PDF、音訊（mp3、wav）和視訊（mp4、mov）檔案，以 base64 編碼資料回傳。這些檔案_必須_透過 `paths` 或 `include` 模式明確指定（例如，透過指定確切檔案名稱如 `video.mp4` 或模式如 `*.mov`）。
  - **其他二進位檔案：** 工具嘗試透過檢查其初始內容中的 null 位元組來偵測並跳過其他類型的二進位檔案。工具會從輸出中排除這些檔案。
- **效能：** 讀取大量檔案或非常大的個別檔案可能會消耗大量資源。
- **路徑特定性：** 確保路徑和 glob 模式相對於工具的目標目錄正確指定。對於影像/PDF 檔案，確保模式足夠具體以包含它們。
- **預設排除：** 請注意預設排除模式（如 `node_modules`、`.git`），如果需要覆蓋它們，請使用 `useDefaultExcludes=False`，但要謹慎進行。
