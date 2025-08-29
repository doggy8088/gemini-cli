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

- For text files: it reads the content of each matched file (attempting to skip binary files not explicitly requested as image/PDF) and concatenates it into a single string, with a separator `--- {filePath} ---` between the content of each file. Uses UTF-8 encoding by default.
- The tool inserts a `--- End of content ---` after the last file.
- For image and PDF files: if explicitly requested by name or extension (e.g., `paths: ["logo.png"]` or `include: ["*.pdf"]`), the tool reads the file and returns its content as a base64 encoded string.
- The tool attempts to detect and skip other binary files (those not matching common image/PDF types or not explicitly requested) by checking for null bytes in their initial content.

Usage:

```
read_many_files(paths=["Your files or paths here."], include=["Additional files to include."], exclude=["Files to exclude."], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` examples

Read all TypeScript files in the `src` directory:

```
read_many_files(paths=["src/**/*.ts"])
```

Read the main README, all Markdown files in the `docs` directory, and a specific logo image, excluding a specific file:

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

Read all JavaScript files but explicitly include test files and all JPEGs in an `images` folder:

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## Important notes

- **Binary file handling:**
  - **Image/PDF/Audio/Video files:** The tool can read common image types (PNG, JPEG, etc.), PDF, audio (mp3, wav), and video (mp4, mov) files, returning them as base64 encoded data. These files _must_ be explicitly targeted by the `paths` or `include` patterns (e.g., by specifying the exact filename like `video.mp4` or a pattern like `*.mov`).
  - **Other binary files:** The tool attempts to detect and skip other types of binary files by examining their initial content for null bytes. The tool excludes these files from its output.
- **Performance:** Reading a very large number of files or very large individual files can be resource-intensive.
- **Path specificity:** Ensure paths and glob patterns are correctly specified relative to the tool's target directory. For image/PDF files, ensure the patterns are specific enough to include them.
- **Default excludes:** Be aware of the default exclusion patterns (like `node_modules`, `.git`) and use `useDefaultExcludes=False` if you need to override them, but do so cautiously.
