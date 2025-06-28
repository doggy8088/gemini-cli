<template><div><h1 id="gemini-cli-工具" tabindex="-1"><a class="header-anchor" href="#gemini-cli-工具"><span>Gemini CLI 工具</span></a></h1>
<p>Gemini CLI 包含內建工具，Gemini 模型可利用這些工具與您的本機環境互動、存取資訊並執行動作。這些工具增強了 CLI 的功能，使其不僅能產生文字，還能協助處理各種任務。</p>
<h2 id="gemini-cli-工具總覽" tabindex="-1"><a class="header-anchor" href="#gemini-cli-工具總覽"><span>Gemini CLI 工具總覽</span></a></h2>
<p>在 Gemini CLI 的情境中，工具是 Gemini 模型可以請求執行的特定函式或模組。例如，如果您要求 Gemini「總結 <code v-pre>my_document.txt</code> 的內容」，模型很可能會識別出讀取該檔案的需求，並請求執行 <code v-pre>read_file</code> 工具。
核心元件 (<code v-pre>packages/core</code>) 管理這些工具，將其定義 (schema) 呈現給 Gemini 模型，在收到請求時執行它們，並將結果傳回模型，以進一步處理成使用者可見的回應。</p>
<p>這些工具提供以下功能：</p>
<ul>
<li><strong>存取本機資訊：</strong> 工具允許 Gemini 存取您的本機檔案系統、讀取檔案內容、列出目錄等。</li>
<li><strong>執行指令：</strong> 藉由 <code v-pre>run_shell_command</code> 等工具，Gemini 可以執行 shell 指令（在有適當安全措施和使用者確認的情況下）。</li>
<li><strong>與網路互動：</strong> 工具可以從 URL 擷取內容。</li>
<li><strong>執行動作：</strong> 工具可以修改檔案、寫入新檔案，或在您的系統上執行其他動作（同樣地，通常會有安全防護措施）。</li>
<li><strong>讓回應有所依據：</strong> 透過使用工具來擷取即時或特定的本機資料，Gemini 的回應可以更準確、更相關，並更貼近您的實際情境。</li>
</ul>
<h2 id="如何使用-gemini-cli-工具" tabindex="-1"><a class="header-anchor" href="#如何使用-gemini-cli-工具"><span>如何使用 Gemini CLI 工具</span></a></h2>
<p>若要使用 Gemini CLI 工具，請向 Gemini CLI 提供提示。其流程如下：</p>
<ol>
<li>您向 Gemini CLI 提供提示。</li>
<li>CLI 將提示傳送至核心。</li>
<li>核心會連同您的提示和對話記錄，將可用工具的清單及其說明/schema 傳送至 Gemini API。</li>
<li>Gemini 模型會分析您的請求。如果它判斷需要使用工具，其回應將會包含一個請求，要求以特定參數執行特定工具。</li>
<li>核心接收此工具請求，進行驗證，並（通常在使用者確認敏感操作後）執行該工具。</li>
<li>工具的輸出會被傳回給 Gemini 模型。</li>
<li>Gemini 模型使用工具的輸出來形成最終答案，然後該答案會透過核心傳回給 CLI 並顯示給您。</li>
</ol>
<p>您通常會在 CLI 中看到訊息，指示工具何時被呼叫，以及它是成功還是失敗。</p>
<h2 id="安全性與確認" tabindex="-1"><a class="header-anchor" href="#安全性與確認"><span>安全性與確認</span></a></h2>
<p>許多工具，特別是那些可以修改您的檔案系統或執行指令 (<code v-pre>write_file</code>、<code v-pre>edit</code>、<code v-pre>run_shell_command</code>) 的工具，在設計時都考量到了安全性。Gemini CLI 通常會：</p>
<ul>
<li><strong>要求確認：</strong> 在執行潛在的敏感操作前提示您，並顯示即將執行的動作。</li>
<li><strong>利用沙箱 (Sandboxing)：</strong> 所有工具都受到沙箱強制執行的限制（請參閱 <RouteLink to="/sandbox.html">Sandboxing 文件</RouteLink>）。這意味著在沙箱中操作時，您希望使用的任何工具（包括 MCP 伺服器）都必須在沙箱環境 <em>內部</em> 可用。例如，要透過 <code v-pre>npx</code> 執行 MCP 伺服器，<code v-pre>npx</code> 執行檔必須安裝在沙箱的 Docker 映像檔中，或在 <code v-pre>sandbox-exec</code> 環境中可用。
在允許工具繼續執行之前，務必仔細檢視確認提示。</li>
</ul>
<h2 id="深入了解-gemini-cli-的工具" tabindex="-1"><a class="header-anchor" href="#深入了解-gemini-cli-的工具"><span>深入了解 Gemini CLI 的工具</span></a></h2>
<p>Gemini CLI 的內建工具可大致分為以下幾類：</p>
<ul>
<li><strong><RouteLink to="/tools/file-system.html">檔案系統工具</RouteLink>：</strong> 用於與檔案和目錄互動（讀取、寫入、列出、搜尋等）。</li>
<li><strong><RouteLink to="/tools/shell.html">Shell 工具</RouteLink> (<code v-pre>run_shell_command</code>)：</strong> 用於執行 shell 指令。</li>
<li><strong><RouteLink to="/tools/web-fetch.html">網頁擷取工具</RouteLink> (<code v-pre>web_fetch</code>):</strong> 用於從網址擷取內容。</li>
<li><strong><RouteLink to="/tools/web-search.html">網頁搜尋工具</RouteLink> (<code v-pre>web_search</code>):</strong> 用於搜尋網頁。</li>
<li><strong><RouteLink to="/tools/multi-file.html">多檔案讀取工具</RouteLink> (<code v-pre>read_many_files</code>):</strong> 一種專門用於讀取多個檔案或目錄內容的工具，通常由 <code v-pre>@</code> 指令使用。</li>
<li><strong><RouteLink to="/tools/memory.html">記憶工具</RouteLink> (<code v-pre>save_memory</code>):</strong> 用於跨工作階段儲存和回憶資訊。</li>
</ul>
<p>此外，這些工具還包含：</p>
<ul>
<li><strong><RouteLink to="/tools/mcp-server.html">MCP servers</RouteLink></strong>: MCP servers 作為 Gemini 模型與您的本機環境或其他服務 (例如 API) 之間的橋樑。</li>
<li><strong><RouteLink to="/sandbox.html">沙箱</RouteLink></strong>: 沙箱機制可將模型及其變更與您的環境隔離開來，以降低潛在風險。</li>
</ul>
</div></template>


