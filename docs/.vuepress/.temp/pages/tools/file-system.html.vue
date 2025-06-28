<template><div><h1 id="gemini-cli-檔案系統工具" tabindex="-1"><a class="header-anchor" href="#gemini-cli-檔案系統工具"><span>Gemini CLI 檔案系統工具</span></a></h1>
<p>Gemini CLI 提供了一套全面的工具，用於與本地檔案系統互動。這些工具讓 Gemini 模型能夠讀取、寫入、列出、搜尋和修改檔案與目錄，所有操作都在您的控制之下，且敏感操作通常需要確認。</p>
<p><strong>注意：</strong> 為了安全起見，所有檔案系統工具都在一個 <code v-pre>rootDirectory</code>（通常是您啟動 CLI 的目前工作目錄）內運作。您提供給這些工具的路徑通常應為絕對路徑，或會相對於此根目錄進行解析。</p>
<h2 id="_1-list-directory-readfolder" tabindex="-1"><a class="header-anchor" href="#_1-list-directory-readfolder"><span>1. <code v-pre>list_directory</code> (ReadFolder)</span></a></h2>
<p><code v-pre>list_directory</code> 會列出指定目錄路徑下檔案和子目錄的名稱。它可以選擇性地忽略符合所提供 glob 模式的項目。</p>
<ul>
<li><strong>工具名稱：</strong> <code v-pre>list_directory</code></li>
<li><strong>顯示名稱：</strong> ReadFolder</li>
<li><strong>檔案：</strong> <code v-pre>ls.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>path</code> (string, required)：要列出目錄的絕對路徑。</li>
<li><code v-pre>ignore</code> (array of strings, optional)：要從清單中排除的 glob 模式列表（例如：<code v-pre>[&quot;*.log&quot;, &quot;.git&quot;]</code>）。</li>
<li><code v-pre>respect_git_ignore</code> (boolean, optional)：列出檔案時是否遵循 <code v-pre>.gitignore</code> 模式。預設為 <code v-pre>true</code>。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>傳回檔案和目錄名稱的列表。</li>
<li>指出每個項目是否為目錄。</li>
<li>排序項目時，目錄在前，然後按字母順序排列。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 類似這樣的字串：<code v-pre>Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png</code></li>
<li><strong>確認：</strong> 否。</li>
<li><strong>工具名稱：</strong> <code v-pre>list_directory</code></li>
<li><strong>顯示名稱：</strong> ReadFolder</li>
<li><strong>檔案：</strong> <code v-pre>ls.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>path</code> (string, required)：要列出目錄的絕對路徑。</li>
<li><code v-pre>ignore</code> (array of strings, optional)：要從清單中排除的 glob 模式列表（例如：<code v-pre>[&quot;*.log&quot;, &quot;.git&quot;]</code>）。</li>
<li><code v-pre>respect_git_ignore</code> (boolean, optional)：列出檔案時是否遵循 <code v-pre>.gitignore</code> 模式。預設為 <code v-pre>true</code>。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>傳回檔案和目錄名稱的列表。</li>
<li>指出每個項目是否為目錄。</li>
<li>排序項目時，目錄在前，然後按字母順序排列。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 類似這樣的字串：<code v-pre>Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png</code></li>
<li><strong>確認：</strong> 否。</li>
</ul>
<h2 id="_2-read-file-readfile" tabindex="-1"><a class="header-anchor" href="#_2-read-file-readfile"><span>2. <code v-pre>read_file</code> (ReadFile)</span></a></h2>
<p><code v-pre>read_file</code> 讀取並傳回指定檔案的內容。此工具可處理文字、圖片（PNG、JPG、GIF、WEBP、SVG、BMP）和 PDF 檔案。對於文字檔案，它可以讀取特定的行範圍。其他二進位檔案類型通常會被略過。</p>
<ul>
<li><strong>工具名稱：</strong> <code v-pre>read_file</code></li>
<li><strong>顯示名稱：</strong> ReadFile</li>
<li><strong>檔案：</strong> <code v-pre>read-file.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>path</code> (string, required)：要讀取檔案的絕對路徑。</li>
<li><code v-pre>offset</code> (number, optional)：對於文字檔案，從中開始讀取的 0-based 行號。需要設定 <code v-pre>limit</code>。</li>
<li><code v-pre>limit</code> (number, optional)：對於文字檔案，要讀取的最大行數。若省略，則讀取預設的最大值（例如 2000 行），或在可行的情況下讀取整個檔案。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>對於文字檔案：傳回內容。若使用 <code v-pre>offset</code> 和 <code v-pre>limit</code>，則僅傳回該範圍的行。會指出內容是否因行數限制或行長度限制而被截斷。</li>
<li>對於圖片和 PDF 檔案：將檔案內容作為適合模型使用的 base64 編碼資料結構傳回。</li>
<li>對於其他二進位檔案：嘗試識別並略過它們，傳回一條訊息，指出它是一個通用的二進位檔案。</li>
</ul>
</li>
<li><strong>輸出：</strong> (<code v-pre>llmContent</code>)：
<ul>
<li>對於文字檔案：檔案內容，前面可能會加上截斷訊息（例如：<code v-pre>[檔案內容已截斷：顯示共 500 行中的第 1-100 行...]\n實際檔案內容...</code>）。</li>
<li>對於圖片/PDF 檔案：一個包含 <code v-pre>inlineData</code> 的物件，其中包含 <code v-pre>mimeType</code> 和 base64 <code v-pre>data</code>（例如：<code v-pre>{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }</code>）。</li>
<li>對於其他二進位檔案：類似 <code v-pre>Cannot display content of binary file: /path/to/data.bin</code> 的訊息。</li>
</ul>
</li>
<li><strong>確認：</strong> 否。</li>
<li><strong>工具名稱：</strong> <code v-pre>read_file</code></li>
<li><strong>顯示名稱：</strong> ReadFile</li>
<li><strong>檔案：</strong> <code v-pre>read-file.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>path</code> (string, required)：要讀取檔案的絕對路徑。</li>
<li><code v-pre>offset</code> (number, optional)：對於文字檔案，從中開始讀取的 0-based 行號。需要設定 <code v-pre>limit</code>。</li>
<li><code v-pre>limit</code> (number, optional)：對於文字檔案，要讀取的最大行數。若省略，則讀取預設的最大值（例如 2000 行），或在可行的情況下讀取整個檔案。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>對於文字檔案：傳回內容。如果使用 <code v-pre>offset</code> 和 <code v-pre>limit</code>，則僅傳回該範圍的行。指出內容是否因行數限制或行長限制而被截斷。</li>
<li>對於圖片和 PDF 檔案：將檔案內容以 base64 編碼的資料結構傳回，適合模型使用。</li>
<li>對於其他二進位檔案：嘗試識別並跳過它們，傳回一則訊息，指出它是一個通用的二進位檔案。</li>
</ul>
</li>
<li><strong>輸出：</strong> (<code v-pre>llmContent</code>)：
<ul>
<li>對於文字檔案：檔案內容，可能會加上截斷訊息前綴（例如：<code v-pre>[檔案內容已截斷：顯示總共 500 行中的第 1-100 行...]\n實際檔案內容...</code>）。</li>
<li>對於圖片/PDF 檔案：一個包含 <code v-pre>inlineData</code> 的物件，其中包含 <code v-pre>mimeType</code> 和 base64 <code v-pre>data</code>（例如：<code v-pre>{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }</code>）。</li>
<li>對於其他二進位檔案：類似 <code v-pre>無法顯示二進位檔案的內容：/path/to/data.bin</code> 的訊息。</li>
</ul>
</li>
<li><strong>確認：</strong> 否。</li>
</ul>
<h2 id="_3-write-file-writefile" tabindex="-1"><a class="header-anchor" href="#_3-write-file-writefile"><span>3. <code v-pre>write_file</code> (WriteFile)</span></a></h2>
<p><code v-pre>write_file</code> 將內容寫入指定的檔案。如果檔案存在，它將被覆寫。如果檔案不存在，它（以及任何必要的父目錄）將會被建立。</p>
<ul>
<li><strong>工具名稱：</strong> <code v-pre>write_file</code></li>
<li><strong>顯示名稱：</strong> WriteFile</li>
<li><strong>檔案：</strong> <code v-pre>write-file.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>file_path</code> (string, required)：要寫入檔案的絕對路徑。</li>
<li><code v-pre>content</code> (string, required)：要寫入檔案的內容。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>將提供的 <code v-pre>content</code> 寫入 <code v-pre>file_path</code>。</li>
<li>如果父目錄不存在，則建立它們。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 成功訊息，例如：<code v-pre>成功覆寫檔案：/path/to/your/file.txt</code> 或 <code v-pre>成功建立新檔案並寫入：/path/to/new/file.txt</code>。</li>
<li><strong>確認：</strong> 是。顯示變更的差異比較，並在寫入前請求使用者核准。</li>
<li><strong>工具名稱：</strong> <code v-pre>write_file</code></li>
<li><strong>顯示名稱：</strong> WriteFile</li>
<li><strong>檔案：</strong> <code v-pre>write-file.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>file_path</code> (string, required)：要寫入檔案的絕對路徑。</li>
<li><code v-pre>content</code> (string, required)：要寫入檔案的內容。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>將提供的 <code v-pre>content</code> 寫入 <code v-pre>file_path</code>。</li>
<li>如果父目錄不存在，則建立它們。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 成功訊息，例如：<code v-pre>成功覆寫檔案：/path/to/your/file.txt</code> 或 <code v-pre>成功建立新檔案並寫入：/path/to/new/file.txt</code>。</li>
<li><strong>確認：</strong> 是。顯示變更的差異比較，並在寫入前請求使用者核准。</li>
</ul>
<h2 id="_4-glob-findfiles" tabindex="-1"><a class="header-anchor" href="#_4-glob-findfiles"><span>4. <code v-pre>glob</code> (FindFiles)</span></a></h2>
<p><code v-pre>glob</code> 尋找符合特定 glob 模式（例如 <code v-pre>src/**/*.ts</code>、<code v-pre>*.md</code>）的檔案，傳回依修改時間排序（最新的在最前面）的絕對路徑。</p>
<ul>
<li><strong>工具名稱：</strong> <code v-pre>glob</code></li>
<li><strong>顯示名稱：</strong> FindFiles</li>
<li><strong>檔案：</strong> <code v-pre>glob.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>pattern</code> (string, required)：要比對的 glob 模式（例如 <code v-pre>&quot;*.py&quot;</code>、<code v-pre>&quot;src/**/*.js&quot;</code>）。</li>
<li><code v-pre>path</code> (string, optional)：要搜尋的目錄絕對路徑。如果省略，則搜尋工具的根目錄。</li>
<li><code v-pre>case_sensitive</code> (boolean, optional)：搜尋是否應區分大小寫。預設為 <code v-pre>false</code>。</li>
<li><code v-pre>respect_git_ignore</code> (boolean, optional)：尋找檔案時是否遵循 .gitignore 模式。預設為 <code v-pre>true</code>。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>在指定的目錄中搜尋符合 glob 模式的檔案。</li>
<li>傳回一個絕對路徑列表，依最近修改的檔案優先排序。</li>
<li>預設會忽略 <code v-pre>node_modules</code> 和 <code v-pre>.git</code> 等常見的麻煩目錄。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 類似以下的訊息：<code v-pre>在 src 中找到 5 個符合 &quot;*.ts&quot; 的檔案，依修改時間排序 (最新的在最前面)：\nsrc/file1.ts\nsrc/subdir/file2.ts...</code></li>
<li><strong>確認：</strong> 否。</li>
<li><strong>工具名稱：</strong> <code v-pre>glob</code></li>
<li><strong>顯示名稱：</strong> FindFiles</li>
<li><strong>檔案：</strong> <code v-pre>glob.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>pattern</code> (string, required)：要比對的 glob 模式（例如 <code v-pre>&quot;*.py&quot;</code>、<code v-pre>&quot;src/**/*.js&quot;</code>）。</li>
<li><code v-pre>path</code> (string, optional)：要搜尋的目錄絕對路徑。如果省略，則搜尋工具的根目錄。</li>
<li><code v-pre>case_sensitive</code> (boolean, optional)：搜尋是否應區分大小寫。預設為 <code v-pre>false</code>。</li>
<li><code v-pre>respect_git_ignore</code> (boolean, optional)：尋找檔案時是否遵循 .gitignore 模式。預設為 <code v-pre>true</code>。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>在指定的目錄中搜尋符合 glob 模式的檔案。</li>
<li>傳回一個絕對路徑列表，依最近修改的檔案優先排序。</li>
<li>預設會忽略 <code v-pre>node_modules</code> 和 <code v-pre>.git</code> 等常見的麻煩目錄。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 類似以下的訊息：<code v-pre>在 src 中找到 5 個符合 &quot;*.ts&quot; 的檔案，依修改時間排序 (最新的在最前面)：\nsrc/file1.ts\nsrc/subdir/file2.ts...</code></li>
<li><strong>確認：</strong> 否。</li>
</ul>
<h2 id="_5-search-file-content-searchtext" tabindex="-1"><a class="header-anchor" href="#_5-search-file-content-searchtext"><span>5. <code v-pre>search_file_content</code> (SearchText)</span></a></h2>
<p><code v-pre>search_file_content</code> 會在指定目錄的檔案內容中搜尋正規表示式模式。可透過 glob 模式篩選檔案。傳回包含相符內容的行，以及其檔案路徑和行號。</p>
<ul>
<li><strong>工具名稱：</strong> <code v-pre>search_file_content</code></li>
<li><strong>顯示名稱：</strong> SearchText</li>
<li><strong>檔案：</strong> <code v-pre>grep.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>pattern</code> (字串，必要)：要搜尋的正規表示式 (regex) (例如 <code v-pre>&quot;function\s+myFunction&quot;</code>)。</li>
<li><code v-pre>path</code> (字串，選用)：要搜尋的目錄的絕對路徑。預設為目前的工作目錄。</li>
<li><code v-pre>include</code> (字串，選用)：用來篩選要搜尋之檔案的 glob 模式 (例如 <code v-pre>&quot;*.js&quot;</code>、<code v-pre>&quot;src/**/*.{ts,tsx}&quot;</code>)。若省略，則會搜尋大部分檔案 (遵循常見的忽略設定)。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>如果在 Git 儲存庫中可用，則使用 <code v-pre>git grep</code> 以提高速度，否則會退回使用系統的 <code v-pre>grep</code> 或基於 JavaScript 的搜尋。</li>
<li>傳回相符行的清單，每行前面都會加上其檔案路徑 (相對於搜尋目錄) 和行號。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 格式化的相符字串，例如：</li>
<li><strong>工具名稱：</strong> <code v-pre>search_file_content</code></li>
<li><strong>顯示名稱：</strong> SearchText</li>
<li><strong>檔案：</strong> <code v-pre>grep.ts</code></li>
<li><strong>參數：</strong>
<ul>
<li><code v-pre>pattern</code> (字串，必要)：要搜尋的正規表示式 (regex) (例如 <code v-pre>&quot;function\s+myFunction&quot;</code>)。</li>
<li><code v-pre>path</code> (字串，選用)：要搜尋的目錄的絕對路徑。預設為目前的工作目錄。</li>
<li><code v-pre>include</code> (字串，選用)：用來篩選要搜尋之檔案的 glob 模式 (例如 <code v-pre>&quot;*.js&quot;</code>、<code v-pre>&quot;src/**/*.{ts,tsx}&quot;</code>)。若省略，則會搜尋大部分檔案 (遵循常見的忽略設定)。</li>
</ul>
</li>
<li><strong>行為：</strong>
<ul>
<li>如果在 Git 儲存庫中可用，則使用 <code v-pre>git grep</code> 以提高速度，否則會退回使用系統的 <code v-pre>grep</code> 或基於 JavaScript 的搜尋。</li>
<li>傳回相符行的清單，每行前面都會加上其檔案路徑 (相對於搜尋目錄) 和行號。</li>
</ul>
</li>
<li><strong>輸出 (<code v-pre>llmContent</code>)：</strong> 格式化的相符字串，例如：<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">在路徑 "." 中找到 3 個符合模式 "myFunction" 的結果 (篩選條件："*.ts")：</span>
<span class="line">---</span>
<span class="line">檔案：src/utils.ts</span>
<span class="line">L15: export function myFunction() {</span>
<span class="line">L22:   myFunction.call();</span>
<span class="line">---</span>
<span class="line">檔案：src/index.ts</span>
<span class="line">L5: import { myFunction } from './utils';</span>
<span class="line">---</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>確認：</strong> 否。</li>
<li><strong>確認：</strong> 否。</li>
</ul>
<h2 id="_6-replace-編輯" tabindex="-1"><a class="header-anchor" href="#_6-replace-編輯"><span>6. <code v-pre>replace</code> (編輯)</span></a></h2>
<p><code v-pre>replace</code> 可取代檔案內的文字。預設情況下，它會取代單一出現的字串，但若指定 <code v-pre>expected_replacements</code>，則可取代多個出現的字串。此工具專為精確、目標性的變更而設計，且 <code v-pre>old_string</code> 周圍需要有足夠的上下文，以確保它能修改正確的位置。</p>
<ul>
<li>
<p><strong>工具名稱：</strong> <code v-pre>replace</code></p>
</li>
<li>
<p><strong>顯示名稱：</strong> Edit</p>
</li>
<li>
<p><strong>檔案：</strong> <code v-pre>edit.ts</code></p>
</li>
<li>
<p><strong>參數：</strong></p>
<ul>
<li>
<p><code v-pre>file_path</code> (字串，必要)：要修改之檔案的絕對路徑。</p>
</li>
<li>
<p><code v-pre>old_string</code> (字串，必要)：要取代的確切文字字串。</p>
<p><strong>關鍵：</strong> 此字串必須能唯一識別要變更的單一實例。它應包含目標文字_前後_至少 3 行的上下文，並精確匹配空白和縮排。如果 <code v-pre>old_string</code> 為空，工具會嘗試在 <code v-pre>file_path</code> 建立一個新檔案，並以 <code v-pre>new_string</code> 作為其內容。</p>
</li>
<li>
<p><code v-pre>new_string</code> (字串，必要)：用來取代 <code v-pre>old_string</code> 的確切文字字串。</p>
</li>
<li>
<p><code v-pre>expected_replacements</code> (數字，選用)：要取代的出現次數。預設為 <code v-pre>1</code>。</p>
</li>
</ul>
</li>
<li>
<p><strong>行為：</strong></p>
<ul>
<li>如果 <code v-pre>old_string</code> 為空且 <code v-pre>file_path</code> 不存在，則會建立一個內容為 <code v-pre>new_string</code> 的新檔案。</li>
<li>如果提供了 <code v-pre>old_string</code>，它會讀取 <code v-pre>file_path</code> 並嘗試尋找 <code v-pre>old_string</code> 的單一出現位置。</li>
<li>如果找到一個出現位置，它會用 <code v-pre>new_string</code> 取代它。</li>
<li><strong>增強可靠性 (多階段編輯校正)：</strong> 為了大幅提高編輯的成功率，特別是當模型提供的 <code v-pre>old_string</code> 可能不夠精確時，此工具整合了多階段編輯校正機制。</li>
<li>如果找不到初始的 <code v-pre>old_string</code> 或其匹配到多個位置，此工具可以利用 Gemini 模型來反覆優化 <code v-pre>old_string</code> (以及可能的 <code v-pre>new_string</code>)。</li>
<li>這個自我校正過程會嘗試識別模型意圖修改的唯一區段，即使初始上下文稍有不完美，也能使 <code v-pre>replace</code> 操作更加穩健。</li>
</ul>
</li>
<li>
<p><strong>失敗條件：</strong> 儘管有校正機制，但在以下情況下，工具仍會失敗：</p>
<ul>
<li><code v-pre>file_path</code> 不是絕對路徑或位於根目錄之外。</li>
<li><code v-pre>old_string</code> 不是空的，但 <code v-pre>file_path</code> 不存在。</li>
<li><code v-pre>old_string</code> 是空的，但 <code v-pre>file_path</code> 已存在。</li>
<li>嘗試修正後，在檔案中仍找不到 <code v-pre>old_string</code>。</li>
<li><code v-pre>old_string</code> 被找到多次，且自我修正機制無法將其解析為單一、明確的匹配項。</li>
</ul>
</li>
<li>
<p><strong>輸出 (<code v-pre>llmContent</code>):</strong></p>
<ul>
<li>成功時：<code v-pre>Successfully modified file: /path/to/file.txt (1 replacements).</code> 或 <code v-pre>Created new file: /path/to/new_file.txt with provided content.</code></li>
<li>失敗時：解釋原因的錯誤訊息 (例如，<code v-pre>Failed to edit, 0 occurrences found...</code>、<code v-pre>Failed to edit, expected 1 occurrences but found 2...</code>)。</li>
</ul>
</li>
<li>
<p><strong>確認：</strong> 是。顯示建議變更的差異比對，並在寫入檔案前請求使用者批准。</p>
<ul>
<li><code v-pre>new_string</code> (字串，必要)：用來取代 <code v-pre>old_string</code> 的確切文字。</li>
<li><code v-pre>expected_replacements</code> (數字，選用)：要取代的出現次數。預設為 <code v-pre>1</code>。</li>
</ul>
</li>
<li>
<p><strong>行為：</strong></p>
<ul>
<li>如果 <code v-pre>old_string</code> 是空的且 <code v-pre>file_path</code> 不存在，則會建立一個以 <code v-pre>new_string</code> 為內容的新檔案。</li>
<li>如果提供了 <code v-pre>old_string</code>，它會讀取 <code v-pre>file_path</code> 並嘗試找到 <code v-pre>old_string</code> 恰好出現一次的地方。</li>
<li>如果找到一個符合項目，它會用 <code v-pre>new_string</code> 將其取代。</li>
<li><strong>增強的可靠性 (多階段編輯修正)：</strong> 為了大幅提高編輯的成功率，特別是當模型提供的 <code v-pre>old_string</code> 可能不夠精確時，此工具整合了多階段編輯修正機制。
<ul>
<li>如果找不到初始的 <code v-pre>old_string</code> 或其匹配到多個位置，此工具可以利用 Gemini 模型來反覆修正 <code v-pre>old_string</code> (以及可能的 <code v-pre>new_string</code>)。</li>
<li>這個自我修正過程會嘗試識別模型意圖修改的獨特區段，即使在初始上下文略有不完美的情況下，也能讓 <code v-pre>replace</code> 操作更加穩健。</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>失敗條件：</strong> 儘管有修正機制，但在以下情況下工具仍會失敗：</p>
<ul>
<li><code v-pre>file_path</code> 不是絕對路徑或位於根目錄之外。</li>
<li><code v-pre>old_string</code> 不是空的，但 <code v-pre>file_path</code> 不存在。</li>
<li><code v-pre>old_string</code> 是空的，但 <code v-pre>file_path</code> 已存在。</li>
<li>嘗試修正後，在檔案中仍找不到 <code v-pre>old_string</code>。</li>
<li><code v-pre>old_string</code> 被找到多次，且自我修正機制無法將其解析為單一、明確的匹配項。</li>
</ul>
</li>
<li>
<p><strong>輸出 (<code v-pre>llmContent</code>):</strong></p>
<ul>
<li>成功時：<code v-pre>Successfully modified file: /path/to/file.txt (1 replacements).</code> 或 <code v-pre>Created new file: /path/to/new_file.txt with provided content.</code></li>
<li>失敗時：解釋原因的錯誤訊息 (例如，<code v-pre>Failed to edit, 0 occurrences found...</code>、<code v-pre>Failed to edit, expected 1 occurrences but found 2...</code>)。</li>
</ul>
</li>
<li>
<p><strong>確認：</strong> 是。顯示建議變更的差異比對，並在寫入檔案前請求使用者批准。</p>
</li>
</ul>
<p>這些檔案系統工具為 Gemini CLI 提供了一個基礎，使其能夠理解您本地專案的上下文並與之互動。</p>
</div></template>


