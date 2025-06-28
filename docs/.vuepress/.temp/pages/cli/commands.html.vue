<template><div><h1 id="cli-指令" tabindex="-1"><a class="header-anchor" href="#cli-指令"><span>CLI 指令</span></a></h1>
<p>Gemini CLI 支援數個內建指令，幫助您管理會話、自訂介面並控制其行為。這些指令以正斜線 (<code v-pre>/</code>)、at 符號 (<code v-pre>@</code>) 或驚嘆號 (<code v-pre>!</code>) 為前綴。</p>
<h2 id="斜線指令" tabindex="-1"><a class="header-anchor" href="#斜線指令"><span>斜線指令 (<code v-pre>/</code>)</span></a></h2>
<p>斜線指令提供對 CLI 本身的元級控制。</p>
<ul>
<li>
<p><strong><code v-pre>/bug</code></strong></p>
<ul>
<li><strong>說明：</strong> 回報有關 Gemini CLI 的問題。預設情況下，問題會在 Gemini CLI 的 GitHub 儲存庫中回報。您在 <code v-pre>/bug</code> 後面輸入的字串將成為所回報錯誤的標題。可以使用 <code v-pre>.gemini/settings.json</code> 檔案中的 <code v-pre>bugCommand</code> 設定來修改預設的 <code v-pre>/bug</code> 行為。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/chat</code></strong></p>
<ul>
<li><strong>說明：</strong> 儲存和恢復對話記錄，以便以互動方式建立分支對話狀態，或從稍後的會話恢復先前的狀態。</li>
<li><strong>子指令：</strong>
<ul>
<li><strong><code v-pre>save</code></strong>
<ul>
<li><strong>說明：</strong> 儲存目前的對話記錄。您必須新增一個 <code v-pre>&lt;tag&gt;</code> 來識別對話狀態。</li>
<li><strong>用法：</strong> <code v-pre>/chat save &lt;tag&gt;</code></li>
</ul>
</li>
<li><strong><code v-pre>resume</code></strong>
<ul>
<li><strong>說明：</strong> 從先前的儲存恢復對話。</li>
<li><strong>用法：</strong> <code v-pre>/chat resume &lt;tag&gt;</code></li>
</ul>
</li>
<li><strong><code v-pre>list</code></strong>
<ul>
<li><strong>說明：</strong> 列出可用於恢復聊天狀態的標籤。</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/clear</code></strong></p>
<ul>
<li><strong>說明：</strong> 清除終端機畫面，包括 CLI 內可見的會話記錄和捲動回溯。底層的會話資料（用於歷史記錄呼叫）可能會根據具體的實作而保留，但視覺顯示會被清除。</li>
<li><strong>鍵盤快捷鍵：</strong> 隨時按 <strong>Ctrl+L</strong> 執行清除操作。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/compress</code></strong></p>
<ul>
<li><strong>說明：</strong> 用摘要取代整個聊天內容。這可以節省未來任務所使用的權杖，同時保留已發生事件的高度摘要。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/editor</code></strong></p>
<ul>
<li><strong>說明：</strong> 開啟一個對話方塊以選取支援的編輯器。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/help</code></strong> (或 <strong><code v-pre>/?</code></strong>)</p>
<ul>
<li><strong>說明：</strong> 顯示有關 Gemini CLI 的說明資訊，包括可用指令及其用法。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/mcp</code></strong></p>
<ul>
<li><strong>說明：</strong> 列出已設定的模型內容協定 (MCP) 伺服器、其連線狀態、伺服器詳細資訊和可用工具。</li>
<li><strong>子指令：</strong>
<ul>
<li><strong><code v-pre>desc</code></strong> 或 <strong><code v-pre>descriptions</code></strong>：
<ul>
<li><strong>說明：</strong> 顯示 MCP 伺服器和工具的詳細說明。</li>
</ul>
</li>
<li><strong><code v-pre>nodesc</code></strong> 或 <strong><code v-pre>nodescriptions</code></strong>：
<ul>
<li><strong>說明：</strong> 隱藏工具說明，只顯示工具名稱。</li>
</ul>
</li>
<li><strong><code v-pre>schema</code></strong>：
<ul>
<li><strong>說明：</strong> 顯示工具設定參數的完整 JSON 結構描述。</li>
</ul>
</li>
</ul>
</li>
<li><strong>鍵盤快捷鍵：</strong> 隨時按 <strong>Ctrl+T</strong> 來切換顯示和隱藏工具說明。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/memory</code></strong></p>
<ul>
<li><strong>說明：</strong> 管理 AI 的指令情境（從 <code v-pre>GEMINI.md</code> 檔案載入的階層式記憶體）。</li>
<li><strong>子指令：</strong>
<ul>
<li><strong><code v-pre>add</code></strong>：
<ul>
<li><strong>說明：</strong> 將下列文字新增至 AI 的記憶體中。用法：<code v-pre>/memory add &lt;要記住的文字&gt;</code></li>
</ul>
</li>
<li><strong><code v-pre>show</code></strong>：
<ul>
<li><strong>說明：</strong> 顯示已從所有 <code v-pre>GEMINI.md</code> 檔案載入的目前階層式記憶體的完整串連內容。這可讓您檢查提供給 Gemini 模型的指令情境。</li>
</ul>
</li>
<li><strong><code v-pre>refresh</code></strong>：
<ul>
<li><strong>說明：</strong> 從設定位置（全域、專案/上層目錄和子目錄）中找到的所有 <code v-pre>GEMINI.md</code> 檔案重新載入階層式指令記憶體。此指令會使用最新的 <code v-pre>GEMINI.md</code> 內容更新模型。</li>
</ul>
</li>
<li><strong>注意：</strong> 如需有關 <code v-pre>GEMINI.md</code> 檔案如何貢獻階層式記憶體的更多詳細資訊，請參閱 <RouteLink to="/cli/configuration.html#_4-geminimd-files-hierarchical-instructional-context">CLI 設定文件</RouteLink>。</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/restore</code></strong></p>
<ul>
<li><strong>說明：</strong> 將專案檔案還原到執行工具之前的狀態。這對於復原工具所做的檔案編輯特別有用。如果在沒有工具呼叫 ID 的情況下執行，它將列出可供還原的可用檢查點。</li>
<li><strong>用法：</strong> <code v-pre>/restore [tool_call_id]</code></li>
<li>**注意：**僅在 CLI 使用 <code v-pre>--checkpointing</code> 選項叫用，或透過<RouteLink to="/cli/configuration.html">設定</RouteLink>進行設定時才可用。詳情請參閱 <RouteLink to="/checkpointing.html">Checkpointing 文件</RouteLink>。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/stats</code></strong></p>
<ul>
<li>**說明：**顯示目前 Gemini CLI 工作階段的詳細統計資料，包括權杖用量、快取權杖節省量 (若有) 和工作階段持續時間。注意：快取權杖資訊僅在使用快取權杖時顯示，目前這種情況發生在 API 金鑰驗證時，而非 OAuth 驗證。</li>
</ul>
</li>
<li>
<p><RouteLink to="/cli/themes.html"><strong><code v-pre>/theme</code></strong></RouteLink></p>
<ul>
<li>**說明：**開啟一個對話方塊，讓您變更 Gemini CLI 的視覺主題。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/auth</code></strong></p>
<ul>
<li>**說明：**開啟一個對話方塊，讓您變更驗證方法。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/about</code></strong></p>
<ul>
<li>**說明：**顯示版本資訊。回報問題時請分享此資訊。</li>
</ul>
</li>
<li>
<p><RouteLink to="/tools/"><strong><code v-pre>/tools</code></strong></RouteLink></p>
<ul>
<li>**說明：**顯示目前 Gemini CLI 中可用的工具清單。</li>
<li><strong>子指令：</strong>
<ul>
<li><strong><code v-pre>desc</code></strong> 或 <strong><code v-pre>descriptions</code></strong>：
<ul>
<li>**說明：**顯示每個工具的詳細說明，包括每個工具的名稱及其提供給模型的完整說明。</li>
</ul>
</li>
<li><strong><code v-pre>nodesc</code></strong> 或 <strong><code v-pre>nodescriptions</code></strong>：
<ul>
<li>**說明：**隱藏工具說明，僅顯示工具名稱。</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong><code v-pre>/quit</code></strong> (或 <strong><code v-pre>/exit</code></strong>)</p>
<ul>
<li>**說明：**退出 Gemini CLI。</li>
</ul>
</li>
</ul>
<h2 id="指令" tabindex="-1"><a class="header-anchor" href="#指令"><span>@ 指令 (<code v-pre>@</code>)</span></a></h2>
<p>@ 指令用於將檔案或目錄的內容包含在您給 Gemini 的提示中。這些指令包含 git 感知篩選功能。</p>
<ul>
<li>
<p><strong><code v-pre>@&lt;檔案或目錄的路徑&gt;</code></strong></p>
<ul>
<li>**說明：**將指定檔案的內容注入您目前的提示中。這對於詢問有關特定程式碼、文字或檔案集合的問題很有用。</li>
<li><strong>範例：</strong>
<ul>
<li><code v-pre>@path/to/your/file.txt 解釋這段文字。</code></li>
<li><code v-pre>@src/my_project/ 總結這個目錄中的程式碼。</code></li>
<li><code v-pre>這個檔案是關於什麼的？ @README.md</code></li>
</ul>
</li>
<li><strong>詳細資訊：</strong>
<ul>
<li>如果提供單一檔案的路徑，則會讀取該檔案的內容。</li>
<li>如果提供目錄的路徑，指令會嘗試讀取該目錄及其任何子目錄中檔案的內容。</li>
<li>路徑中的空格應使用反斜線進行跳脫 (例如：<code v-pre>@My\ Documents/file.txt</code>)。</li>
<li>該指令內部使用 <code v-pre>read_many_files</code> 工具。內容會先被擷取，然後插入到您的查詢中，再傳送給 Gemini 模型。</li>
<li>**Git 感知篩選：**預設情況下，會排除 git 忽略的檔案 (例如 <code v-pre>node_modules/</code>、<code v-pre>dist/</code>、<code v-pre>.env</code>、<code v-pre>.git/</code>)。此行為可透過 <code v-pre>fileFiltering</code> 設定進行變更。</li>
<li>**檔案類型：**該指令適用於文字檔。雖然它可能會嘗試讀取任何檔案，但二進位檔案或非常大的檔案可能會被底層的 <code v-pre>read_many_files</code> 工具略過或截斷，以確保效能和關聯性。該工具會指示是否有檔案被略過。</li>
</ul>
</li>
<li>**輸出：**CLI 將顯示一則工具呼叫訊息，指出已使用 <code v-pre>read_many_files</code>，並附上一則詳細說明狀態和已處理路徑的訊息。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>@</code> (單獨的 @ 符號)</strong></p>
<ul>
<li>**說明：**如果您輸入一個不帶路徑的單獨 <code v-pre>@</code> 符號，查詢將會直接傳遞給 Gemini 模型。如果您在提示中特別要討論 <code v-pre>@</code> 符號本身，這可能很有用。</li>
</ul>
</li>
</ul>
<h3 id="指令的錯誤處理" tabindex="-1"><a class="header-anchor" href="#指令的錯誤處理"><span><code v-pre>@</code> 指令的錯誤處理</span></a></h3>
<ul>
<li>如果在 <code v-pre>@</code> 後指定的路徑找不到或無效，將會顯示錯誤訊息，而且查詢可能不會傳送給 Gemini 模型，或者會在不包含檔案內容的情況下傳送。</li>
<li>如果 <code v-pre>read_many_files</code> 工具遇到錯誤 (例如權限問題)，也會回報此錯誤。</li>
</ul>
<h2 id="shell-模式與傳遞指令" tabindex="-1"><a class="header-anchor" href="#shell-模式與傳遞指令"><span>Shell 模式與傳遞指令 (<code v-pre>!</code>)</span></a></h2>
<p><code v-pre>!</code> 前綴可讓您直接從 Gemini CLI 內部與您的系統 shell 互動。</p>
<ul>
<li>
<p><strong><code v-pre>!&lt;shell_指令&gt;</code></strong></p>
<ul>
<li>**說明：**在您系統的預設 shell 中執行給定的 <code v-pre>&lt;shell_指令&gt;</code>。指令的任何輸出或錯誤都會顯示在終端機中。</li>
<li><strong>範例：</strong>
<ul>
<li><code v-pre>!ls -la</code> (執行 <code v-pre>ls -la</code> 並返回 Gemini CLI)</li>
<li><code v-pre>!git status</code> (執行 <code v-pre>git status</code> 並返回 Gemini CLI)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong><code v-pre>!</code> (切換 shell 模式)</strong></p>
<ul>
<li>**說明：**單獨輸入 <code v-pre>!</code> 可切換 shell 模式。
<ul>
<li><strong>進入 shell 模式：</strong>
<ul>
<li>當啟用時，shell 模式會使用不同的顏色和「Shell 模式指示器」。</li>
<li>在 shell 模式下，您輸入的文字會直接被解譯為 shell 指令。</li>
</ul>
</li>
<li><strong>退出 shell 模式：</strong>
<ul>
<li>退出後，UI 會恢復其標準外觀，並恢復正常的 Gemini CLI 行為。</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>**所有 <code v-pre>!</code> 用法的注意事項：**您在 shell 模式下執行的指令，其權限和影響與直接在終端機中執行相同。</p>
</li>
</ul>
</div></template>


