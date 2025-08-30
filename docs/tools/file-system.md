# 檔案系統工具

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
- **行為**：
  - 對於文字檔案：傳回內容。如果使用了 `offset` 和 `limit`，僅傳回該行片段。指示內容是否因行限制或行長度限制而被截斷。
  - 對於影像和 PDF 檔案：將檔案內容作為適合模型使用的 base64 編碼資料結構傳回。
  - 對於其他二進位檔案：嘗試識別並跳過它們，傳回指示這是通用二進位檔案的訊息。
- **輸出**（`llmContent`）：
  - 對於文字檔案：檔案內容，可能以截斷訊息為前綴（例如，`[檔案內容已截斷：顯示第 1-100 行，總共 500 行...]\n實際檔案內容...`）。
  - 對於影像/PDF 檔案：包含具有 `mimeType` 和 base64 `data` 的 `inlineData` 的物件（例如，`{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 對於其他二進位檔案：類似 `無法顯示二進位檔案的內容：/path/to/data.bin` 的訊息。
- **確認**：否。

## 3. `write_file`（WriteFile）

`write_file` 將內容寫入指定檔案。如果檔案存在，將被覆寫。如果檔案不存在，則會建立它（以及任何必要的父目錄）。

- **工具名稱**：`write_file`
- **顯示名稱**：WriteFile
- **檔案**：`write-file.ts`
- **參數**：
  - `file_path`（字串，必要）：要寫入的檔案的絕對路徑。
  - `content`（字串，必要）：要寫入檔案的內容。
- **行為**：
  - 將提供的 `content` 寫入 `file_path`。
  - 如果父目錄不存在，則建立父目錄。
- **輸出**（`llmContent`）：成功訊息，例如，`成功覆寫檔案：/path/to/your/file.txt` 或 `成功建立並寫入新檔案：/path/to/new/file.txt`。
- **確認**：是。顯示變更的差異並在寫入前要求使用者批准。

## 4. `glob`（FindFiles）

`glob` 尋找符合特定 glob 模式的檔案（例如，`src/**/*.ts`、`*.md`），傳回按修改時間排序的絕對路徑（最新的在前）。

- **工具名稱**：`glob`
- **顯示名稱**：FindFiles
- **檔案**：`glob.ts`
- **參數**：
  - `pattern`（字串，必要）：要匹配的 glob 模式（例如，`"*.py"`、`"src/**/*.js"`）。
  - `path`（字串，選用）：要在其中搜尋的目錄的絕對路徑。如果省略，搜尋工具的根目錄。
  - `case_sensitive`（布林值，選用）：搜尋是否應區分大小寫。預設為 `false`。
  - `respect_git_ignore`（布林值，選用）：尋找檔案時是否遵守 .gitignore 模式。預設為 `true`。
- **行為**：
  - 在指定目錄內搜尋符合 glob 模式的檔案。
  - 傳回絕對路徑清單，以最近修改的檔案優先排序。
  - 預設忽略常見的干擾目錄，如 `node_modules` 和 `.git`。
- **輸出**（`llmContent`）：類似以下的訊息：`在 src 中找到 5 個符合 "*.ts" 的檔案，按修改時間排序（最新的在前）：\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **確認**：否。

## 5. `search_file_content`（SearchText）

`search_file_content` 在指定目錄中的檔案內容中搜尋正規表示式模式。可以透過 glob 模式篩選檔案。傳回包含匹配的行以及其檔案路徑和行號。

- **工具名稱**：`search_file_content`
- **顯示名稱**：SearchText
- **檔案**：`grep.ts`
- **參數**：
  - `pattern`（字串，必要）：要搜尋的正規表示式（regex）（例如，`"function\s+myFunction"`）。
  - `path`（字串，選用）：要在其中搜尋的目錄的絕對路徑。預設為目前工作目錄。
  - `include`（字串，選用）：用於篩選要搜尋的檔案的 glob 模式（例如，`"*.js"`、`"src/**/*.{ts,tsx}"`）。如果省略，搜尋大多數檔案（遵守常見忽略）。
- **行為**：
  - 如果在 Git 儲存庫中可用，使用 `git grep` 以提高速度；否則，回退到系統 `grep` 或基於 JavaScript 的搜尋。
  - 傳回匹配行清單，每行都以其檔案路徑（相對於搜尋目錄）和行號為前綴。
- **輸出**（`llmContent`）：格式化的匹配字串，例如：
  ```
  在路徑 "." 中找到模式 "myFunction" 的 3 個匹配（篩選器：`"*.ts"`）：
  ---
  檔案：src/utils.ts
  第15行：export function myFunction() {
  第22行：myFunction.call();
  ---
  檔案：src/index.ts
  第5行：import { myFunction } from './utils';
  ---
  ```
- **確認**：否。

## 6. `replace`（Edit）

`replace` 替換檔案中的文字。預設替換單一出現次數，但當指定 `expected_replacements` 時可以替換多個出現次數。此工具專為精確、針對性的變更而設計，需要 `old_string` 周圍的大量內容以確保修改正確的位置。

- **工具名稱**：`replace`
- **顯示名稱**：Edit
- **檔案**：`edit.ts`
- **參數**：
  - `file_path`（字串，必要）：要修改的檔案的絕對路徑。
  - `old_string`（字串，必要）：要替換的確切字面文字。

    **重要：** 此字串必須唯一識別要變更的單一實例。它應該在目標文字_之前_和_之後_包含至少 3 行內容，精確匹配空格和縮排。如果 `old_string` 為空，工具會嘗試在 `file_path` 建立新檔案，以 `new_string` 作為內容。

  - `new_string`（字串，必要）：要替換 `old_string` 的確切字面文字。
  - `expected_replacements`（數字，選用）：要替換的出現次數。預設為 `1`。

- **行為**：
  - 如果 `old_string` 為空且 `file_path` 不存在，則使用 `new_string` 作為內容建立新檔案。
  - 如果提供了 `old_string`，它會讀取 `file_path` 並嘗試找到 `old_string` 的確切一個出現次數。
  - 如果找到一個出現次數，則用 `new_string` 替換它。
  - **增強可靠性（多階段編輯修正）：** 為了顯著提高編輯的成功率，特別是當模型提供的 `old_string` 可能不完全精確時，工具納入了多階段編輯修正機制。
    - 如果找不到初始 `old_string` 或匹配多個位置，工具可以利用 Gemini 模型迭代精煉 `old_string`（以及可能的 `new_string`）。
    - 這個自我修正過程嘗試識別模型意圖修改的唯一段落，使 `replace` 操作更加強健，即使初始內容稍有不完美。
- **失敗條件：** 儘管有修正機制，如果出現以下情況，工具將失敗：
  - `file_path` 不是絕對路徑或在根目錄之外。
  - `old_string` 不為空，但 `file_path` 不存在。
  - `old_string` 為空，但 `file_path` 已存在。
  - 嘗試修正後在檔案中找不到 `old_string`。
  - 找到多個 `old_string`，且自我修正機制無法將其解析為單一、明確的匹配。
- **輸出**（`llmContent`）：
  - 成功時：`成功修改檔案：/path/to/file.txt（1 次替換）。` 或 `使用提供的內容建立新檔案：/path/to/new_file.txt。`
  - 失敗時：解釋原因的錯誤訊息（例如，`編輯失敗，找到 0 個出現次數...`、`編輯失敗，預期 1 個出現次數但找到 2 個...`）。
- **確認**：是。顯示建議變更的差異並在寫入檔案前要求使用者批准。

這些檔案系統工具為 Gemini CLI 提供了理解和與您的本機專案內容互動的基礎。
