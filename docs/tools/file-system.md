# Gemini CLI 檔案系統工具

Gemini CLI 提供了一套全面的工具，用於與本地檔案系統互動。這些工具讓 Gemini 模型能夠讀取、寫入、列出、搜尋和修改檔案與目錄，所有操作都在您的控制之下，且敏感操作通常需要確認。

**注意：** 為了安全起見，所有檔案系統工具都在一個 `rootDirectory`（通常是您啟動 CLI 的目前工作目錄）內運作。您提供給這些工具的路徑通常應為絕對路徑，或會相對於此根目錄進行解析。

## 1. `list_directory` (ReadFolder)

`list_directory` 會列出指定目錄路徑下檔案和子目錄的名稱。它可以選擇性地忽略符合所提供 glob 模式的項目。

- **工具名稱：** `list_directory`
- **顯示名稱：** ReadFolder
- **檔案：** `ls.ts`
- **參數：**
  - `path` (string, required)：要列出目錄的絕對路徑。
  - `ignore` (array of strings, optional)：要從清單中排除的 glob 模式列表（例如：`["*.log", ".git"]`）。
  - `respect_git_ignore` (boolean, optional)：列出檔案時是否遵循 `.gitignore` 模式。預設為 `true`。
- **行為：**
  - 傳回檔案和目錄名稱的列表。
  - 指出每個項目是否為目錄。
  - 排序項目時，目錄在前，然後按字母順序排列。
- **輸出 (`llmContent`)：** 類似這樣的字串：`Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png`
- **確認：** 否。
- **工具名稱：** `list_directory`
- **顯示名稱：** ReadFolder
- **檔案：** `ls.ts`
- **參數：**
  - `path` (string, required)：要列出目錄的絕對路徑。
  - `ignore` (array of strings, optional)：要從清單中排除的 glob 模式列表（例如：`["*.log", ".git"]`）。
  - `respect_git_ignore` (boolean, optional)：列出檔案時是否遵循 `.gitignore` 模式。預設為 `true`。
- **行為：**
  - 傳回檔案和目錄名稱的列表。
  - 指出每個項目是否為目錄。
  - 排序項目時，目錄在前，然後按字母順序排列。
- **輸出 (`llmContent`)：** 類似這樣的字串：`Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png`
- **確認：** 否。

## 2. `read_file` (ReadFile)

`read_file` 讀取並傳回指定檔案的內容。此工具可處理文字、圖片（PNG、JPG、GIF、WEBP、SVG、BMP）和 PDF 檔案。對於文字檔案，它可以讀取特定的行範圍。其他二進位檔案類型通常會被略過。

- **工具名稱：** `read_file`
- **顯示名稱：** ReadFile
- **檔案：** `read-file.ts`
- **參數：**
  - `path` (string, required)：要讀取檔案的絕對路徑。
  - `offset` (number, optional)：對於文字檔案，從中開始讀取的 0-based 行號。需要設定 `limit`。
  - `limit` (number, optional)：對於文字檔案，要讀取的最大行數。若省略，則讀取預設的最大值（例如 2000 行），或在可行的情況下讀取整個檔案。
- **行為：**
  - 對於文字檔案：傳回內容。若使用 `offset` 和 `limit`，則僅傳回該範圍的行。會指出內容是否因行數限制或行長度限制而被截斷。
  - 對於圖片和 PDF 檔案：將檔案內容作為適合模型使用的 base64 編碼資料結構傳回。
  - 對於其他二進位檔案：嘗試識別並略過它們，傳回一條訊息，指出它是一個通用的二進位檔案。
- **輸出：** (`llmContent`)：
  - 對於文字檔案：檔案內容，前面可能會加上截斷訊息（例如：`[檔案內容已截斷：顯示共 500 行中的第 1-100 行...]\n實際檔案內容...`）。
  - 對於圖片/PDF 檔案：一個包含 `inlineData` 的物件，其中包含 `mimeType` 和 base64 `data`（例如：`{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 對於其他二進位檔案：類似 `Cannot display content of binary file: /path/to/data.bin` 的訊息。
- **確認：** 否。
- **工具名稱：** `read_file`
- **顯示名稱：** ReadFile
- **檔案：** `read-file.ts`
- **參數：**
  - `path` (string, required)：要讀取檔案的絕對路徑。
  - `offset` (number, optional)：對於文字檔案，從中開始讀取的 0-based 行號。需要設定 `limit`。
  - `limit` (number, optional)：對於文字檔案，要讀取的最大行數。若省略，則讀取預設的最大值（例如 2000 行），或在可行的情況下讀取整個檔案。
- **行為：**
  - 對於文字檔案：傳回內容。如果使用 `offset` 和 `limit`，則僅傳回該範圍的行。指出內容是否因行數限制或行長限制而被截斷。
  - 對於圖片和 PDF 檔案：將檔案內容以 base64 編碼的資料結構傳回，適合模型使用。
  - 對於其他二進位檔案：嘗試識別並跳過它們，傳回一則訊息，指出它是一個通用的二進位檔案。
- **輸出：** (`llmContent`)：
  - 對於文字檔案：檔案內容，可能會加上截斷訊息前綴（例如：`[檔案內容已截斷：顯示總共 500 行中的第 1-100 行...]\n實際檔案內容...`）。
  - 對於圖片/PDF 檔案：一個包含 `inlineData` 的物件，其中包含 `mimeType` 和 base64 `data`（例如：`{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 對於其他二進位檔案：類似 `無法顯示二進位檔案的內容：/path/to/data.bin` 的訊息。
- **確認：** 否。

## 3. `write_file` (WriteFile)

`write_file` 將內容寫入指定的檔案。如果檔案存在，它將被覆寫。如果檔案不存在，它（以及任何必要的父目錄）將會被建立。

- **工具名稱：** `write_file`
- **顯示名稱：** WriteFile
- **檔案：** `write-file.ts`
- **參數：**
  - `file_path` (string, required)：要寫入檔案的絕對路徑。
  - `content` (string, required)：要寫入檔案的內容。
- **行為：**
  - 將提供的 `content` 寫入 `file_path`。
  - 如果父目錄不存在，則建立它們。
- **輸出 (`llmContent`)：** 成功訊息，例如：`成功覆寫檔案：/path/to/your/file.txt` 或 `成功建立新檔案並寫入：/path/to/new/file.txt`。
- **確認：** 是。顯示變更的差異比較，並在寫入前請求使用者核准。
- **工具名稱：** `write_file`
- **顯示名稱：** WriteFile
- **檔案：** `write-file.ts`
- **參數：**
  - `file_path` (string, required)：要寫入檔案的絕對路徑。
  - `content` (string, required)：要寫入檔案的內容。
- **行為：**
  - 將提供的 `content` 寫入 `file_path`。
  - 如果父目錄不存在，則建立它們。
- **輸出 (`llmContent`)：** 成功訊息，例如：`成功覆寫檔案：/path/to/your/file.txt` 或 `成功建立新檔案並寫入：/path/to/new/file.txt`。
 - **確認：** 是。顯示變更的差異比較，並在寫入前請求使用者核准。

## 4. `glob` (FindFiles)

`glob` 尋找符合特定 glob 模式（例如 `src/**/*.ts`、`*.md`）的檔案，傳回依修改時間排序（最新的在最前面）的絕對路徑。

- **工具名稱：** `glob`
- **顯示名稱：** FindFiles
- **檔案：** `glob.ts`
- **參數：**
  - `pattern` (string, required)：要比對的 glob 模式（例如 `"*.py"`、`"src/**/*.js"`）。
  - `path` (string, optional)：要搜尋的目錄絕對路徑。如果省略，則搜尋工具的根目錄。
  - `case_sensitive` (boolean, optional)：搜尋是否應區分大小寫。預設為 `false`。
  - `respect_git_ignore` (boolean, optional)：尋找檔案時是否遵循 .gitignore 模式。預設為 `true`。
- **行為：**
  - 在指定的目錄中搜尋符合 glob 模式的檔案。
  - 傳回一個絕對路徑列表，依最近修改的檔案優先排序。
  - 預設會忽略 `node_modules` 和 `.git` 等常見的麻煩目錄。
- **輸出 (`llmContent`)：** 類似以下的訊息：`在 src 中找到 5 個符合 "*.ts" 的檔案，依修改時間排序 (最新的在最前面)：\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **確認：** 否。
- **工具名稱：** `glob`
- **顯示名稱：** FindFiles
- **檔案：** `glob.ts`
- **參數：**
  - `pattern` (string, required)：要比對的 glob 模式（例如 `"*.py"`、`"src/**/*.js"`）。
  - `path` (string, optional)：要搜尋的目錄絕對路徑。如果省略，則搜尋工具的根目錄。
  - `case_sensitive` (boolean, optional)：搜尋是否應區分大小寫。預設為 `false`。
  - `respect_git_ignore` (boolean, optional)：尋找檔案時是否遵循 .gitignore 模式。預設為 `true`。
- **行為：**
  - 在指定的目錄中搜尋符合 glob 模式的檔案。
  - 傳回一個絕對路徑列表，依最近修改的檔案優先排序。
  - 預設會忽略 `node_modules` 和 `.git` 等常見的麻煩目錄。
- **輸出 (`llmContent`)：** 類似以下的訊息：`在 src 中找到 5 個符合 "*.ts" 的檔案，依修改時間排序 (最新的在最前面)：\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **確認：** 否。

## 5. `search_file_content` (SearchText)

`search_file_content` 會在指定目錄的檔案內容中搜尋正規表示式模式。可透過 glob 模式篩選檔案。傳回包含相符內容的行，以及其檔案路徑和行號。

- **工具名稱：** `search_file_content`
- **顯示名稱：** SearchText
- **檔案：** `grep.ts`
- **參數：**
  - `pattern` (字串，必要)：要搜尋的正規表示式 (regex) (例如 `"function\s+myFunction"`)。
  - `path` (字串，選用)：要搜尋的目錄的絕對路徑。預設為目前的工作目錄。
  - `include` (字串，選用)：用來篩選要搜尋之檔案的 glob 模式 (例如 `"*.js"`、`"src/**/*.{ts,tsx}"`)。若省略，則會搜尋大部分檔案 (遵循常見的忽略設定)。
- **行為：**
  - 如果在 Git 儲存庫中可用，則使用 `git grep` 以提高速度，否則會退回使用系統的 `grep` 或基於 JavaScript 的搜尋。
  - 傳回相符行的清單，每行前面都會加上其檔案路徑 (相對於搜尋目錄) 和行號。
- **輸出 (`llmContent`)：** 格式化的相符字串，例如：
- **工具名稱：** `search_file_content`
- **顯示名稱：** SearchText
- **檔案：** `grep.ts`
- **參數：**
  - `pattern` (字串，必要)：要搜尋的正規表示式 (regex) (例如 `"function\s+myFunction"`)。
  - `path` (字串，選用)：要搜尋的目錄的絕對路徑。預設為目前的工作目錄。
  - `include` (字串，選用)：用來篩選要搜尋之檔案的 glob 模式 (例如 `"*.js"`、`"src/**/*.{ts,tsx}"`)。若省略，則會搜尋大部分檔案 (遵循常見的忽略設定)。
- **行為：**
  - 如果在 Git 儲存庫中可用，則使用 `git grep` 以提高速度，否則會退回使用系統的 `grep` 或基於 JavaScript 的搜尋。
  - 傳回相符行的清單，每行前面都會加上其檔案路徑 (相對於搜尋目錄) 和行號。
- **輸出 (`llmContent`)：** 格式化的相符字串，例如：
  ```
  在路徑 "." 中找到 3 個符合模式 "myFunction" 的結果 (篩選條件："*.ts")：
  ---
  檔案：src/utils.ts
  L15: export function myFunction() {
  L22:   myFunction.call();
  ---
  檔案：src/index.ts
  L5: import { myFunction } from './utils';
  ---
  ```
- **確認：** 否。
- **確認：** 否。

## 6. `replace` (編輯)

`replace` 可取代檔案內的文字。預設情況下，它會取代單一出現的字串，但若指定 `expected_replacements`，則可取代多個出現的字串。此工具專為精確、目標性的變更而設計，且 `old_string` 周圍需要有足夠的上下文，以確保它能修改正確的位置。

- **工具名稱：** `replace`
- **顯示名稱：** Edit
- **檔案：** `edit.ts`
- **參數：**

  - `file_path` (字串，必要)：要修改之檔案的絕對路徑。
  - `old_string` (字串，必要)：要取代的確切文字字串。

    **關鍵：** 此字串必須能唯一識別要變更的單一實例。它應包含目標文字_前後_至少 3 行的上下文，並精確匹配空白和縮排。如果 `old_string` 為空，工具會嘗試在 `file_path` 建立一個新檔案，並以 `new_string` 作為其內容。

  - `new_string` (字串，必要)：用來取代 `old_string` 的確切文字字串。
  - `expected_replacements` (數字，選用)：要取代的出現次數。預設為 `1`。

- **行為：**
  - 如果 `old_string` 為空且 `file_path` 不存在，則會建立一個內容為 `new_string` 的新檔案。
  - 如果提供了 `old_string`，它會讀取 `file_path` 並嘗試尋找 `old_string` 的單一出現位置。
  - 如果找到一個出現位置，它會用 `new_string` 取代它。
  - **增強可靠性 (多階段編輯校正)：** 為了大幅提高編輯的成功率，特別是當模型提供的 `old_string` 可能不夠精確時，此工具整合了多階段編輯校正機制。
  - 如果找不到初始的 `old_string` 或其匹配到多個位置，此工具可以利用 Gemini 模型來反覆優化 `old_string` (以及可能的 `new_string`)。
  - 這個自我校正過程會嘗試識別模型意圖修改的唯一區段，即使初始上下文稍有不完美，也能使 `replace` 操作更加穩健。
- **失敗條件：** 儘管有校正機制，但在以下情況下，工具仍會失敗：
  - `file_path` 不是絕對路徑或位於根目錄之外。
  - `old_string` 不是空的，但 `file_path` 不存在。
  - `old_string` 是空的，但 `file_path` 已存在。
  - 嘗試修正後，在檔案中仍找不到 `old_string`。
  - `old_string` 被找到多次，且自我修正機制無法將其解析為單一、明確的匹配項。
- **輸出 (`llmContent`):**
  - 成功時：`Successfully modified file: /path/to/file.txt (1 replacements).` 或 `Created new file: /path/to/new_file.txt with provided content.`
  - 失敗時：解釋原因的錯誤訊息 (例如，`Failed to edit, 0 occurrences found...`、`Failed to edit, expected 1 occurrences but found 2...`)。
- **確認：** 是。顯示建議變更的差異比對，並在寫入檔案前請求使用者批准。

  - `new_string` (字串，必要)：用來取代 `old_string` 的確切文字。
  - `expected_replacements` (數字，選用)：要取代的出現次數。預設為 `1`。

- **行為：**
  - 如果 `old_string` 是空的且 `file_path` 不存在，則會建立一個以 `new_string` 為內容的新檔案。
  - 如果提供了 `old_string`，它會讀取 `file_path` 並嘗試找到 `old_string` 恰好出現一次的地方。
  - 如果找到一個符合項目，它會用 `new_string` 將其取代。
  - **增強的可靠性 (多階段編輯修正)：** 為了大幅提高編輯的成功率，特別是當模型提供的 `old_string` 可能不夠精確時，此工具整合了多階段編輯修正機制。
    - 如果找不到初始的 `old_string` 或其匹配到多個位置，此工具可以利用 Gemini 模型來反覆修正 `old_string` (以及可能的 `new_string`)。
    - 這個自我修正過程會嘗試識別模型意圖修改的獨特區段，即使在初始上下文略有不完美的情況下，也能讓 `replace` 操作更加穩健。
- **失敗條件：** 儘管有修正機制，但在以下情況下工具仍會失敗：
  - `file_path` 不是絕對路徑或位於根目錄之外。
  - `old_string` 不是空的，但 `file_path` 不存在。
  - `old_string` 是空的，但 `file_path` 已存在。
  - 嘗試修正後，在檔案中仍找不到 `old_string`。
  - `old_string` 被找到多次，且自我修正機制無法將其解析為單一、明確的匹配項。
- **輸出 (`llmContent`):**
  - 成功時：`Successfully modified file: /path/to/file.txt (1 replacements).` 或 `Created new file: /path/to/new_file.txt with provided content.`
  - 失敗時：解釋原因的錯誤訊息 (例如，`Failed to edit, 0 occurrences found...`、`Failed to edit, expected 1 occurrences but found 2...`)。
- **確認：** 是。顯示建議變更的差異比對，並在寫入檔案前請求使用者批准。

這些檔案系統工具為 Gemini CLI 提供了一個基礎，使其能夠理解您本地專案的上下文並與之互動。
