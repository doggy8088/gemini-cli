# Gemini CLI 檔案系統工具

Gemini CLI 提供了一套完整的工具，讓你可以與本地檔案系統互動。這些工具允許 Gemini 模型在你的控制下（通常對敏感操作會要求確認）讀取、寫入、列出、搜尋及修改檔案和目錄。

**注意：** 所有檔案系統工具都會在`rootDirectory`（通常是你啟動 CLI 時的目前工作目錄）內運作，以確保安全性。你提供給這些工具的路徑通常預期為絕對路徑，或會相對於此根目錄進行解析。

## 1. `list_directory`（ReadFolder）

`list_directory` 會列出指定目錄路徑下，直接包含的檔案和子目錄名稱。你也可以選擇忽略符合指定萬用字元 (wildcards) 的項目。

- **工具名稱：** `list_directory`
- **顯示名稱：** ReadFolder
- **檔案：** `ls.ts`
- **參數：**
  - `path`（string，必填）：要列出的目錄的絕對路徑。
  - `ignore`（字串陣列，選填）：要從清單中排除的萬用字元 (wildcards) 清單（例如：`["*.log", ".git"]`）。
  - `respect_git_ignore`（布林值，選填）：列出檔案時是否遵循`.gitignore`模式。預設為`true`。
- **行為：**
  - 回傳檔案和目錄名稱的清單。
  - 指示每個項目是否為目錄。
  - 先以目錄排序，再依字母順序排列。
- **輸出（`llmContent`）：** 一個類似 `Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png` 的字串。
- **需確認：** 否。

## 2. `read_file`（ReadFile）

`read_file` 會讀取並回傳指定檔案的內容。此工具可處理文字檔、圖片（PNG、JPG、GIF、WEBP、SVG、BMP）及 PDF 檔案。對於文字檔案，可以讀取特定行範圍。其他二進位檔案類型通常會略過。

- **工具名稱：** `read_file`
- **顯示名稱：** ReadFile
- **檔案：** `read-file.ts`
- **參數：**
  - `path`（string，必填）：要讀取的檔案絕對路徑。
  - `offset`（數字，選填）：對於文字檔案，開始讀取的 0-based 行號。需搭配`limit`設定。
  - `limit`（數字，選填）：對於文字檔案，要讀取的最大行數。如未指定，則會讀取預設最大值（例如 2000 行）或在可行時讀取整個檔案。
- **行為：**
  - 對於文字檔案：回傳內容。如果有使用`offset`和`limit`，則僅回傳該行數範圍。若因行數或行長度限制而截斷，會顯示相關訊息。
  - 對於圖片和 PDF 檔案：以 base64 編碼的資料結構回傳，方便模型使用。
  - 其他二進位檔案：會嘗試辨識並略過，回傳為一般二進位檔案的訊息。
- **輸出（`llmContent`）：**
  - 文字檔案：檔案內容，可能會加上截斷提示訊息（例如：`[File content truncated: showing lines 1-100 of 500 total lines...]\nActual file content...`）。
  - 圖片/PDF 檔案：包含`inlineData`、`mimeType`及 base64 `data` 的物件（例如：`{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 其他二進位檔案：類似 `Cannot display content of binary file: /path/to/data.bin` 的訊息。
- **需確認：** 否。

## 3. `write_file`（WriteFile）

`write_file` 會將內容寫入指定檔案。如果檔案已存在，將會覆寫；若不存在，則會自動建立檔案及必要的父目錄。

- **工具名稱：** `write_file`
- **顯示名稱：** WriteFile
- **檔案：** `write-file.ts`
- **參數：**
  - `file_path`（string，必填）：要寫入的檔案絕對路徑。
  - `content`（string，必填）：要寫入檔案的內容。
- **行為：**
  - 將提供的`content`寫入`file_path`。
  - 若父目錄不存在則自動建立。
- **輸出（`llmContent`）：** 成功訊息，例如 `Successfully overwrote file: /path/to/your/file.txt` 或 `Successfully created and wrote to new file: /path/to/new/file.txt`。
- **需確認：** 是。會顯示變更差異（diff），並在寫入前要求使用者確認。

## 4. `glob`（FindFiles）

`glob` 會尋找符合特定萬用字元 (wildcards) 模式的檔案（例如：`src/**/*.ts`、`*.md`），並回傳依修改時間（最新優先）排序的絕對路徑。

- **工具名稱：** `glob`
- **顯示名稱：** FindFiles
- **檔案：** `glob.ts`
- **參數：**
  - `pattern`（string，必填）：要比對的萬用字元 (wildcards) 模式（例如：`"*.py"`、`"src/**/*.js"`）。
  - `path`（string，選填）：要搜尋的目錄絕對路徑。如未指定，則搜尋工具的根目錄。
  - `case_sensitive`（布林值，選填）：搜尋時是否區分大小寫。預設為`false`。
  - `respect_git_ignore`（布林值，選填）：尋找檔案時是否遵循 .gitignore 規則。預設為`true`。
- **行為：**
  - 在指定目錄內搜尋符合萬用字元 (wildcards) 模式的檔案。
  - 回傳絕對路徑清單，依最近修改時間排序（最新優先）。
  - 預設會忽略常見的干擾目錄，如`node_modules`和`.git`。
- **輸出（`llmContent`）：** 類似 `Found 5 file(s) matching "*.ts" within src, sorted by modification time (newest first):\nsrc/file1.ts\nsrc/subdir/file2.ts...` 的訊息。
- **需確認：** 否。

## 5. `search_file_content`（SearchText）

`search_file_content` 會在指定目錄下檔案內容中搜尋正則表達式（regex）模式。可透過萬用字元 (wildcards) 過濾要搜尋的檔案。回傳包含符合項目的行，以及其檔案路徑與行號。

- **工具名稱：** `search_file_content`
- **顯示名稱：** SearchText
- **檔案：** `grep.ts`
- **參數：**
  - `pattern`（string，必填）：要搜尋的正則表達式（regex）（例如：`"function\s+myFunction"`）。
  - `path`（string，選填）：要搜尋的目錄絕對路徑。預設為目前工作目錄。
  - `include`（string，選填）：用於過濾要搜尋檔案的萬用字元 (wildcards) 模式（例如：`"*.js"`、`"src/**/*.{ts,tsx}"`）。如未指定，則搜尋大多數檔案（會遵循常見忽略規則）。
- **行為：**
  - 若在 Git 儲存庫 (Git repository) 中可用，會使用`git grep`以提升速度；否則會回退至系統`grep`或以 JavaScript 進行搜尋。
  - 回傳所有符合行的清單，每行前面會標註相對於搜尋目錄的檔案路徑及行號。
- **輸出（`llmContent`）：** 格式化的符合結果字串，例如：
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
- **確認：**否。

## 6. `replace`（編輯）

`replace` 用於在檔案內取代文字。預設情況下只會取代單一出現，但當指定 `expected_replacements` 時，可以取代多個出現。此工具設計用於精確、目標明確的修改，並且需要在 `old_string` 周圍提供充足的 context，以確保修改正確的位置。

- **工具名稱：**`replace`
- **顯示名稱：**Edit
- **檔案：**`edit.ts`
- **參數：**
  - `file_path`（string，必填）：要修改的檔案絕對路徑。
  - `old_string`（string，必填）：要被取代的精確原始文字。

    **重要：**此字串必須能唯一識別要變更的單一實例。應至少包含目標文字_前後_各三行的 context，並且必須精確符合空白與縮排。如果 `old_string` 為空，工具會嘗試在 `file_path` 建立新檔案，內容為 `new_string`。

  - `new_string`（string，必填）：用來取代 `old_string` 的精確原始文字。
  - `expected_replacements`（number，選填）：要取代的出現次數。預設為 `1`。

- **行為：**
  - 若 `old_string` 為空且 `file_path` 不存在，則建立新檔案，內容為 `new_string`。
  - 若有提供 `old_string`，則會讀取 `file_path` 並嘗試精確找到一個 `old_string` 的出現位置。
  - 若找到一個出現，則以 `new_string` 取代。
  - **增強型可靠性（多階段編輯修正）：**為顯著提升編輯成功率，特別是在模型提供的 `old_string` 可能不夠精確時，工具內建多階段編輯修正機制。
    - 若初始的 `old_string` 未找到或匹配多個位置，工具可利用 Gemini 模型，反覆修正 `old_string`（以及可能的 `new_string`）。
    - 此自我修正流程會嘗試辨識模型原本欲修改的唯一片段，即使初始 context 略有不精確，也能讓 `replace` 操作更具韌性。
- **失敗條件：**即使有修正機制，若發生下列情況工具仍會失敗：
  - `file_path` 不是絕對路徑，或超出 root 目錄。
  - `old_string` 不為空，但 `file_path` 不存在。
  - `old_string` 為空，但 `file_path` 已存在。
  - 經修正後仍在檔案中找不到 `old_string`。
  - `old_string` 在檔案中出現多次，且自我修正機制無法縮小至唯一明確的匹配。
- **輸出（`llmContent`）：**
  - 成功時：`Successfully modified file: /path/to/file.txt (1 replacements).` 或 `Created new file: /path/to/new_file.txt with provided content.`
  - 失敗時：會顯示錯誤訊息，說明原因（例如：`Failed to edit, 0 occurrences found...`、`Failed to edit, expected 1 occurrences but found 2...`）。
- **確認：**是。會顯示擬議變更的 diff，並在寫入檔案前請用戶確認。

這些檔案系統工具為 Gemini CLI 提供了理解並互動你本地專案 context 的基礎。
