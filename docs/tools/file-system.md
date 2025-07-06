# 檔案系統工具

Gemini CLI 提供了一套完整的工具，用於與本機檔案系統進行互動。這些工具允許 Gemini 模型讀取、寫入、列出、搜尋和修改檔案和目錄，所有操作都在您的控制之下，並且通常會對敏感操作進行確認。

**注意**： 為安全起見，所有檔案系統工具都在 `rootDirectory`（通常是您啟動 CLI 的目前工作目錄）內運作。您提供給這些工具的路徑通常應為絕對路徑，或相對於此根目錄解析。

## 1. `list_directory` (ReadFolder)

`list_directory` 列出指定目錄路徑中直接包含的檔案和子目錄的名稱。它可以選擇性地忽略與提供的 glob 模式相符的項目。

- **工具名稱**： `list_directory`
- **顯示名稱**： ReadFolder
- **檔案**： `ls.ts`
- **參數**：
  - `path` (字串，必要)：要列出之目錄的絕對路徑。
  - `ignore` (字串陣列，可選)：要從清單中排除的 glob 模式清單（例如 `["*.log", ".git"]`）。
  - `respect_git_ignore` (布林值，可選)：列出檔案時是否遵循 `.gitignore` 模式。預設為 `true`。
- **行為**：
  - 傳回檔案和目錄名稱的清單。
  - 指出每個項目是否為目錄。
  - 先按目錄排序，然後按字母順序排序。
- **輸出 (`llmContent`)**： 類似以下的字串：`Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png`
- **確認**： 否。

## 2. `read_file` (ReadFile)

`read_file` 讀取並傳回指定檔案的內容。此工具可處理文字、圖片（PNG、JPG、GIF、WEBP、SVG、BMP）和 PDF 檔案。對於文字檔案，它可以讀取特定的行範圍。其他二進位檔案類型通常會被略過。

- **工具名稱**： `read_file`
- **顯示名稱**： ReadFile
- **檔案**： `read-file.ts`
- **參數**：
  - `path` (字串，必要)：要讀取之檔案的絕對路徑。
  - `offset` (數字，可選)：對於文字檔案，要從中開始讀取的以 0 為基礎的行號。需要設定 `limit`。
  - `limit` (數字，可選)：對於文字檔案，要讀取的最大行數。如果省略，則讀取預設的最大值（例如 2000 行）或整個檔案（如果可行）。
- **行為**：
  - 對於文字檔案：傳回內容。如果使用 `offset` 和 `limit`，則僅傳回該行片段。指出內容是否因行數限制或行長度限制而被截斷。
  - 對於圖片和 PDF 檔案：將檔案內容傳回為適合模型使用的 base64 編碼資料結構。
  - 對於其他二進位檔案：嘗試識別並略過它們，傳回一則訊息，指出它是一個通用的二進位檔案。
- **輸出 (`llmContent`)**：
  - 對於文字檔案：檔案內容，可能以截斷訊息為前綴（例如 `[File content truncated: showing lines 1-100 of 500 total lines...]\nActual file content...`）。
  - 對於圖片/PDF 檔案：一個包含 `inlineData` 的物件，其中包含 `mimeType` 和 base64 `data`（例如 `{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 對於其他二進位檔案：類似 `Cannot display content of binary file: /path/to/data.bin` 的訊息。
- **確認**： 否。

## 3. `write_file` (WriteFile)

`write_file` 將內容寫入指定的檔案。如果檔案存在，它將被覆寫。如果檔案不存在，它（以及任何必要的父目錄）將被建立。

- **工具名稱**： `write_file`
- **顯示名稱**： WriteFile
- **檔案**： `write-file.ts`
- **參數**：
  - `file_path` (字串，必要)：要寫入之檔案的絕對路徑。
  - `content` (字串，必要)：要寫入檔案的內容。
- **行為**：
  - 將提供的 `content` 寫入 `file_path`。
  - 如果父目錄不存在，則建立它們。
- **輸出 (`llmContent`)**： 成功訊息，例如 `Successfully overwrote file: /path/to/your/file.txt` 或 `Successfully created and wrote to new file: /path/to/new/file.txt`。
- **確認**： 是。顯示變更的差異並在寫入前請求使用者核准。

## 4. `glob` (FindFiles)

`glob` 尋找符合特定 glob 模式的檔案（例如 `src/**/*.ts`、`*.md`），傳回按修改時間排序的絕對路徑（最新的在前）。

- **工具名稱**： `glob`
- **顯示名稱**： FindFiles
- **檔案**： `glob.ts`
- **參數**：
  - `pattern` (字串，必要)：要比對的 glob 模式（例如 `"*.py"`、`"src/**/*.js"`）。
  - `path` (字串，可選)：要在其中搜尋的目錄的絕對路徑。如果省略，則搜尋工具的根目錄。
  - `case_sensitive` (布林值，可選)：搜尋是否應區分大小寫。預設為 `false`。
  - `respect_git_ignore` (布林值，可選)：尋找檔案時是否遵循 .gitignore 模式。預設為 `true`。
- **行為**：
  - 在指定目錄中搜尋符合 glob 模式的檔案。
  - 傳回絕對路徑清單，按最近修改的檔案排序。
  - 預設忽略常見的無用目錄，如 `node_modules` 和 `.git`。
- **輸出 (`llmContent`)**： 類似以下的訊息：`Found 5 file(s) matching "*.ts" within src, sorted by modification time (newest first):\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **確認**： 否。

## 5. `search_file_content` (SearchText)

`search_file_content` 在指定目錄的檔案內容中搜尋規則運算式模式。可以按 glob 模式篩選檔案。傳回包含相符項的行，以及其檔案路徑和行號。

- **工具名稱**： `search_file_content`
- **顯示名稱**： SearchText
- **檔案**： `grep.ts`
- **參數**：
  - `pattern` (字串，必要)：要搜尋的規則運算式 (regex)（例如 `"function\s+myFunction"`）。
  - `path` (字串，可選)：要在其中搜尋的目錄的絕對路徑。預設為目前工作目錄。
  - `include` (字串，可選)：用於篩選要搜尋哪些檔案的 glob 模式（例如 `"*.js"`、`"src/**/*.{ts,tsx}"`）。如果省略，則搜尋大多數檔案（遵循常見的忽略設定）。
- **行為**：
  - 如果在 Git 儲存庫中可用，則使用 `git grep` 以提高速度，否則退回到系統 `grep` 或基於 JavaScript 的搜尋。
  - 傳回相符行的清單，每行前面都帶有其檔案路徑（相對於搜尋目錄）和行號。
- **輸出 (`llmContent`)**： 格式化的相符項字串，例如：
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
- **確認**： 否。

## 6. `replace` (Edit)

`replace` 取代檔案中的文字。預設情況下，取代單一出現處，但當指定 `expected_replacements` 時，可以取代多個出現處。此工具專為精確、有針對性的變更而設計，需要圍繞 `old_string` 提供大量上下文，以確保其修改正確的位置。

- **工具名稱**： `replace`
- **顯示名稱**： Edit
- **檔案**： `edit.ts`
- **參數**：
  - `file_path` (字串，必要)：要修改之檔案的絕對路徑。
  - `old_string` (字串，必要)：要取代的確切文字。

    **關鍵**： 此字串必須唯一地標識要變更的單一實例。它應在目標文字之前和之後至少包含 3 行上下文，並精確比對空白和縮排。如果 `old_string` 為空，則工具會嘗試在 `file_path` 建立一個新檔案，並以 `new_string` 為內容。

  - `new_string` (字串，必要)：要用來取代 `old_string` 的確切文字。
  - `expected_replacements` (數字，可選)：要取代的出現次數。預設為 `1`。

- **行為**：
  - 如果 `old_string` 為空且 `file_path` 不存在，則建立一個以 `new_string` 為內容的新檔案。
  - 如果提供了 `old_string`，它會讀取 `file_path` 並嘗試尋找 `old_string` 的確切一次出現。
  - 如果找到一次出現，它會用 `new_string` 取代它。
  - **增強的可靠性（多階段編輯校正）**： 為了顯著提高編輯的成功率，特別是當模型提供的 `old_string` 可能不完全精確時，該工具採用了多階段編輯校正機制。
    - 如果找不到初始的 `old_string` 或比對到多個位置，該工具可以利用 Gemini 模型反覆修正 `old_string`（並可能修正 `new_string`）。
    - 這個自我校正過程會嘗試識別模型意圖修改的唯一區段，即使初始上下文稍有不完美，也能使 `replace` 操作更加穩健。
- **失敗條件**： 儘管有校正機制，但在以下情況下，工具仍會失敗：
  - `file_path` 不是絕對路徑或位於根目錄之外。
  - `old_string` 不為空，但 `file_path` 不存在。
  - `old_string` 為空，但 `file_path` 已存在。
  - 在嘗試校正後，檔案中仍找不到 `old_string`。
  - `old_string` 被多次找到，且自我校正機制無法將其解析為單一、明確的比對。
- **輸出 (`llmContent`)**：
  - 成功時：`Successfully modified file: /path/to/file.txt (1 replacements).` 或 `Created new file: /path/to/new_file.txt with provided content.`
  - 失敗時：解釋原因的錯誤訊息（例如 `Failed to edit, 0 occurrences found...`、`Failed to edit, expected 1 occurrences but found 2...`）。
- **確認**： 是。顯示建議變更的差異，並在寫入檔案前請求使用者核准。

這些檔案系統工具為 Gemini CLI 提供了理解和與您本機專案上下文互動的基礎。