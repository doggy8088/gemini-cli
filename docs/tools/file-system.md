# Gemini CLI 檔案系統工具

Gemini CLI 提供與本機檔案系統互動的完整工具套件。這些工具允許 Gemini 模型讀取、寫入、列出、搜尋和修改檔案和目錄，全部在您的控制下，通常需要對敏感操作進行確認。

**注意**：為了安全起見，所有檔案系統工具都在 `rootDirectory`（通常是您啟動 CLI 的目前工作目錄）內運作。您提供給這些工具的路徑通常預期為絕對路徑，或相對於此根目錄進行解析。

## 1. `list_directory` (ReadFolder)

`list_directory` 列出指定目錄路徑內的檔案和子目錄名稱。它可以選擇性地忽略符合提供的 glob 模式的項目。

- **工具名稱**：`list_directory`
- **顯示名稱**：ReadFolder
- **檔案**：`ls.ts`
- **參數**：
  - `path`（字串，必要）：要列出的目錄的絕對路徑。
  - `ignore`（字串陣列，選用）：要從列表中排除的 glob 模式清單（例如，`["*.log", ".git"]`）。
  - `respect_git_ignore`（布林值，選用）：列出檔案時是否遵守 `.gitignore` 模式。預設為 `true`。
- **行為**：
  - 傳回檔案和目錄名稱清單。
  - 指示每個項目是否為目錄。
  - 排序項目時目錄優先，然後按字母順序排列。
- **輸出 (`llmContent`)**：類似以下的字串：`Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png`
- **確認**：否。

## 2. `read_file` (ReadFile)

`read_file` 讀取並傳回指定檔案的內容。此工具處理文字、影像（PNG、JPG、GIF、WEBP、SVG、BMP）和 PDF 檔案。對於文字檔案，它可以讀取特定的行範圍。其他二進位檔案類型通常會跳過。

- **工具名稱**：`read_file`
- **顯示名稱**：ReadFile
- **檔案**：`read-file.ts`
- **參數**：
  - `path`（字串，必要）：要讀取的檔案的絕對路徑。
  - `offset`（數字，選用）：對於文字檔案，開始讀取的 0 基行號。需要設定 `limit`。
  - `limit`（數字，選用）：對於文字檔案，要讀取的最大行數。如果省略，讀取預設最大值（例如，2000 行）或整個檔案（如果可行）。
- **Behavior:**
  - For text files: Returns the content. If `offset` and `limit` are used, returns only that slice of lines. Indicates if content was truncated due to line limits or line length limits.
  - For image and PDF files: Returns the file content as a base64-encoded data structure suitable for model consumption.
  - For other binary files: Attempts to identify and skip them, returning a message indicating it's a generic binary file.
- **Output:** (`llmContent`):
  - For text files: The file content, potentially prefixed with a truncation message (e.g., `[File content truncated: showing lines 1-100 of 500 total lines...]\nActual file content...`).
  - For image/PDF files: An object containing `inlineData` with `mimeType` and base64 `data` (e.g., `{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`).
  - For other binary files: A message like `Cannot display content of binary file: /path/to/data.bin`.
- **Confirmation:** No.

## 3. `write_file` (WriteFile)

`write_file` writes content to a specified file. If the file exists, it will be overwritten. If the file doesn't exist, it (and any necessary parent directories) will be created.

- **Tool name:** `write_file`
- **Display name:** WriteFile
- **File:** `write-file.ts`
- **Parameters:**
  - `file_path` (string, required): The absolute path to the file to write to.
  - `content` (string, required): The content to write into the file.
- **Behavior:**
  - Writes the provided `content` to the `file_path`.
  - Creates parent directories if they don't exist.
- **Output (`llmContent`):** A success message, e.g., `Successfully overwrote file: /path/to/your/file.txt` or `Successfully created and wrote to new file: /path/to/new/file.txt`.
- **Confirmation:** Yes. Shows a diff of changes and asks for user approval before writing.

## 4. `glob` (FindFiles)

`glob` finds files matching specific glob patterns (e.g., `src/**/*.ts`, `*.md`), returning absolute paths sorted by modification time (newest first).

- **Tool name:** `glob`
- **Display name:** FindFiles
- **File:** `glob.ts`
- **Parameters:**
  - `pattern` (string, required): The glob pattern to match against (e.g., `"*.py"`, `"src/**/*.js"`).
  - `path` (string, optional): The absolute path to the directory to search within. If omitted, searches the tool's root directory.
  - `case_sensitive` (boolean, optional): Whether the search should be case-sensitive. Defaults to `false`.
  - `respect_git_ignore` (boolean, optional): Whether to respect .gitignore patterns when finding files. Defaults to `true`.
- **Behavior:**
  - Searches for files matching the glob pattern within the specified directory.
  - Returns a list of absolute paths, sorted with the most recently modified files first.
  - Ignores common nuisance directories like `node_modules` and `.git` by default.
- **Output (`llmContent`):** A message like: `Found 5 file(s) matching "*.ts" within src, sorted by modification time (newest first):\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **Confirmation:** No.

## 5. `search_file_content` (SearchText)

`search_file_content` searches for a regular expression pattern within the content of files in a specified directory. Can filter files by a glob pattern. Returns the lines containing matches, along with their file paths and line numbers.

- **Tool name:** `search_file_content`
- **Display name:** SearchText
- **File:** `grep.ts`
- **Parameters:**
  - `pattern` (string, required): The regular expression (regex) to search for (e.g., `"function\s+myFunction"`).
  - `path` (string, optional): The absolute path to the directory to search within. Defaults to the current working directory.
  - `include` (string, optional): A glob pattern to filter which files are searched (e.g., `"*.js"`, `"src/**/*.{ts,tsx}"`). If omitted, searches most files (respecting common ignores).
- **Behavior:**
  - Uses `git grep` if available in a Git repository for speed; otherwise, falls back to system `grep` or a JavaScript-based search.
  - Returns a list of matching lines, each prefixed with its file path (relative to the search directory) and line number.
- **Output (`llmContent`):** A formatted string of matches, e.g.:
  ```
  Found 3 matches for pattern "myFunction" in path "." (filter: "*.ts"):
  ---
  File: src/utils.ts
  L15: export function myFunction() {
  L22:   myFunction.call();
  ---
  File: src/index.ts
  L5: import { myFunction } from './utils';
  ---
  ```
- **Confirmation:** No.

## 6. `replace` (Edit)

`replace` replaces text within a file. By default, replaces a single occurrence, but can replace multiple occurrences when `expected_replacements` is specified. This tool is designed for precise, targeted changes and requires significant context around the `old_string` to ensure it modifies the correct location.

- **Tool name:** `replace`
- **Display name:** Edit
- **File:** `edit.ts`
- **Parameters:**
  - `file_path` (string, required): The absolute path to the file to modify.
  - `old_string` (string, required): The exact literal text to replace.

    **CRITICAL:** This string must uniquely identify the single instance to change. It should include at least 3 lines of context _before_ and _after_ the target text, matching whitespace and indentation precisely. If `old_string` is empty, the tool attempts to create a new file at `file_path` with `new_string` as content.

  - `new_string` (string, required): The exact literal text to replace `old_string` with.
  - `expected_replacements` (number, optional): The number of occurrences to replace. Defaults to `1`.

- **Behavior:**
  - If `old_string` is empty and `file_path` does not exist, creates a new file with `new_string` as content.
  - If `old_string` is provided, it reads the `file_path` and attempts to find exactly one occurrence of `old_string`.
  - If one occurrence is found, it replaces it with `new_string`.
  - **Enhanced Reliability (Multi-Stage Edit Correction):** To significantly improve the success rate of edits, especially when the model-provided `old_string` might not be perfectly precise, the tool incorporates a multi-stage edit correction mechanism.
    - If the initial `old_string` isn't found or matches multiple locations, the tool can leverage the Gemini model to iteratively refine `old_string` (and potentially `new_string`).
    - This self-correction process attempts to identify the unique segment the model intended to modify, making the `replace` operation more robust even with slightly imperfect initial context.
- **Failure conditions:** Despite the correction mechanism, the tool will fail if:
  - `file_path` is not absolute or is outside the root directory.
  - `old_string` is not empty, but the `file_path` does not exist.
  - `old_string` is empty, but the `file_path` already exists.
  - `old_string` is not found in the file after attempts to correct it.
  - `old_string` is found multiple times, and the self-correction mechanism cannot resolve it to a single, unambiguous match.
- **Output (`llmContent`):**
  - On success: `Successfully modified file: /path/to/file.txt (1 replacements).` or `Created new file: /path/to/new_file.txt with provided content.`
  - On failure: An error message explaining the reason (e.g., `Failed to edit, 0 occurrences found...`, `Failed to edit, expected 1 occurrences but found 2...`).
- **Confirmation:** Yes. Shows a diff of the proposed changes and asks for user approval before writing to the file.

These file system tools provide a foundation for the Gemini CLI to understand and interact with your local project context.
