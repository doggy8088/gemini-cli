<template><div><h1 id="gemini-cli-設定" tabindex="-1"><a class="header-anchor" href="#gemini-cli-設定"><span>Gemini CLI 設定</span></a></h1>
<p>Gemini CLI 提供數種方式來設定其行為，包括環境變數、命令列參數及設定檔。本文件概述了不同的設定方法與可用設定。</p>
<h2 id="設定層級" tabindex="-1"><a class="header-anchor" href="#設定層級"><span>設定層級</span></a></h2>
<p>設定會依下列優先順序套用（數字較低的會被數字較高的覆寫）：</p>
<ol>
<li><strong>預設值：</strong> 應用程式中寫死的預設值。</li>
<li><strong>使用者設定檔：</strong> 目前使用者的全域設定。</li>
<li><strong>專案設定檔：</strong> 專案特定的設定。</li>
<li><strong>環境變數：</strong> 全系統或工作階段特定的變數，可能從 <code v-pre>.env</code> 檔案載入。</li>
<li><strong>命令列參數：</strong> 啟動 CLI 時傳入的值。</li>
</ol>
<h2 id="使用者設定檔與專案設定檔" tabindex="-1"><a class="header-anchor" href="#使用者設定檔與專案設定檔"><span>使用者設定檔與專案設定檔</span></a></h2>
<p>Gemini CLI 使用 <code v-pre>settings.json</code> 檔案進行永久性設定。這些檔案有兩個位置：</p>
<ul>
<li><strong>使用者設定檔：</strong>
<ul>
<li><strong>位置：</strong> <code v-pre>~/.gemini/settings.json</code>（其中 <code v-pre>~</code> 是您的家目錄）。</li>
<li><strong>範圍：</strong> 套用於目前使用者的所有 Gemini CLI 工作階段。</li>
</ul>
</li>
<li><strong>專案設定檔：</strong>
<ul>
<li><strong>位置：</strong> 您專案根目錄下的 <code v-pre>.gemini/settings.json</code>。</li>
<li><strong>範圍：</strong> 僅在從該特定專案執行 Gemini CLI 時套用。專案設定會覆寫使用者設定。
<strong>關於設定中的環境變數注意事項：</strong> <code v-pre>settings.json</code> 檔案中的字串值可以使用 <code v-pre>$VAR_NAME</code> 或 <code v-pre>${VAR_NAME}</code> 語法來引用環境變數。這些變數在載入設定時會自動解析。例如，如果您有一個環境變數 <code v-pre>MY_API_TOKEN</code>，您可以在 <code v-pre>settings.json</code> 中這樣使用它：<code v-pre>&quot;apiKey&quot;: &quot;$MY_API_TOKEN&quot;</code>。</li>
</ul>
</li>
</ul>
<h3 id="您專案中的-gemini-目錄" tabindex="-1"><a class="header-anchor" href="#您專案中的-gemini-目錄"><span>您專案中的 <code v-pre>.gemini</code> 目錄</span></a></h3>
<p>除了專案設定檔之外，專案的 <code v-pre>.gemini</code> 目錄還可以包含其他與 Gemini CLI 操作相關的專案特定檔案，例如：</p>
<ul>
<li><a href="#sandboxing">自訂沙盒設定檔</a>（例如 <code v-pre>.gemini/sandbox-macos-custom.sb</code>、<code v-pre>.gemini/sandbox.Dockerfile</code>）。</li>
</ul>
<h3 id="settings-json-中的可用設定" tabindex="-1"><a class="header-anchor" href="#settings-json-中的可用設定"><span><code v-pre>settings.json</code> 中的可用設定：</span></a></h3>
<ul>
<li>
<p><strong><code v-pre>contextFileName</code></strong>（字串或字串陣列）：</p>
<ul>
<li><strong>說明：</strong> 指定情境檔案的檔名（例如 <code v-pre>GEMINI.md</code>、<code v-pre>AGENTS.md</code>）。可以是一個檔名或是一份可接受的檔名清單。</li>
<li><strong>預設值：</strong> <code v-pre>GEMINI.md</code></li>
<li><strong>範例：</strong> <code v-pre>&quot;contextFileName&quot;: &quot;AGENTS.md&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>bugCommand</code></strong>（物件）：</p>
<ul>
<li><strong>說明：</strong> 覆寫 <code v-pre>/bug</code> 指令的預設 URL。</li>
<li><strong>預設值：</strong> <code v-pre>&quot;urlTemplate&quot;: &quot;https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml&amp;title={title}&amp;info={info}&quot;</code></li>
<li><strong>屬性：</strong>
<ul>
<li><strong><code v-pre>urlTemplate</code></strong>（字串）：可包含 <code v-pre>{title}</code> 和 <code v-pre>{info}</code> 佔位符的 URL。</li>
</ul>
</li>
<li><strong>範例：</strong><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token property">"bugCommand"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"urlTemplate"</span><span class="token operator">:</span> <span class="token string">"https://bug.example.com/new?title={title}&amp;info={info}"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong><code v-pre>fileFiltering</code></strong>（物件）：</p>
<ul>
<li><strong>說明：</strong> 控制 @ 指令與檔案探索工具的 git 感知檔案篩選行為。</li>
<li><strong>預設值：</strong> <code v-pre>&quot;respectGitIgnore&quot;: true, &quot;enableRecursiveFileSearch&quot;: true</code></li>
<li><strong>屬性：</strong>
<ul>
<li><strong><code v-pre>respectGitIgnore</code></strong>（布林值）：探索檔案時是否遵循 .gitignore 模式。設定為 <code v-pre>true</code> 時，git 忽略的檔案（如 <code v-pre>node_modules/</code>、<code v-pre>dist/</code>、<code v-pre>.env</code>）將自動從 @ 指令與檔案清單操作中排除。</li>
<li><strong><code v-pre>enableRecursiveFileSearch</code></strong>（布林值）：在提示中完成 @ 字首時，是否啟用在目前樹狀結構下遞迴搜尋檔名。</li>
</ul>
</li>
<li><strong>範例：</strong><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token property">"fileFiltering"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"respectGitIgnore"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"enableRecursiveFileSearch"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong><code v-pre>coreTools</code></strong>（字串陣列）：</p>
<ul>
<li><strong>說明：</strong> 允許您指定應提供給模型的核心工具名稱清單。這可用於限制內建工具的集合。請參閱 <RouteLink to="/core/tools-api.html#built-in-tools">內建工具</RouteLink> 以取得核心工具清單。</li>
<li><strong>預設值：</strong> Gemini 模型可使用的所有工具。</li>
<li><strong>範例：</strong> <code v-pre>&quot;coreTools&quot;: [&quot;ReadFileTool&quot;, &quot;GlobTool&quot;, &quot;SearchText&quot;]</code>。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>excludeTools</code></strong>（字串陣列）：</p>
<ul>
<li><strong>說明：</strong> 允許您指定應從模型中排除的核心工具名稱清單。同時列在 <code v-pre>excludeTools</code> 和 <code v-pre>coreTools</code> 中的工具將會被排除。</li>
<li><strong>預設值</strong>：不排除任何工具。</li>
<li><strong>範例：</strong> <code v-pre>&quot;excludeTools&quot;: [&quot;run_shell_command&quot;, &quot;findFiles&quot;]</code>。</li>
</ul>
</li>
<li>
<p><strong><code v-pre>autoAccept</code></strong>（布林值）：</p>
<ul>
<li><strong>說明：</strong> 控制 CLI 是否在沒有使用者明確確認的情況下，自動接受並執行被視為安全的工具呼叫（例如唯讀操作）。若設定為 <code v-pre>true</code>，CLI 將會略過對認定為安全的工具的確認提示。</li>
<li><strong>預設值：</strong> <code v-pre>false</code></li>
<li><strong>範例：</strong> <code v-pre>&quot;autoAccept&quot;: true</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>theme</code></strong> (string):</p>
<ul>
<li><strong>說明：</strong> 設定 Gemini CLI 的視覺<RouteLink to="/cli/themes.html">主題</RouteLink>。</li>
<li><strong>預設值：</strong> <code v-pre>&quot;Default&quot;</code></li>
<li><strong>範例：</strong> <code v-pre>&quot;theme&quot;: &quot;GitHub&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>sandbox</code></strong> (boolean or string):</p>
<ul>
<li><strong>說明：</strong> 控制是否以及如何使用沙箱來執行工具。若設定為 <code v-pre>true</code>，Gemini CLI 會使用預先建構的 <code v-pre>gemini-cli-sandbox</code> Docker 映像檔。如需更多資訊，請參閱<a href="#sandboxing">沙箱</a>。</li>
<li><strong>預設值：</strong> <code v-pre>false</code></li>
<li><strong>範例：</strong> <code v-pre>&quot;sandbox&quot;: &quot;docker&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>toolDiscoveryCommand</code></strong> (string):</p>
<ul>
<li><strong>說明：</strong> 定義一個自訂 shell 指令，用來從您的專案中探索工具。該 shell 指令必須在 <code v-pre>stdout</code> 上回傳一個 <a href="https://ai.google.dev/gemini-api/docs/function-calling#function-declarations" target="_blank" rel="noopener noreferrer">function declarations</a> 的 JSON 陣列。工具包裝函式為選用項目。</li>
<li><strong>預設值：</strong> 空值</li>
<li><strong>範例：</strong> <code v-pre>&quot;toolDiscoveryCommand&quot;: &quot;bin/get_tools&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>toolCallCommand</code></strong> (string):</p>
<ul>
<li><strong>說明：</strong> 定義一個自訂 shell 指令，用來呼叫透過 <code v-pre>toolDiscoveryCommand</code> 探索到的特定工具。該 shell 指令必須符合以下條件：
<ul>
<li>它必須將函式 <code v-pre>name</code>（與 <a href="https://ai.google.dev/gemini-api/docs/function-calling#function-declarations" target="_blank" rel="noopener noreferrer">function declaration</a> 中完全相同）作為第一個命令列引數。</li>
<li>它必須在 <code v-pre>stdin</code> 上讀取 JSON 格式的函式引數，類似於 <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall" target="_blank" rel="noopener noreferrer"><code v-pre>functionCall.args</code></a>。</li>
<li>它必須在 <code v-pre>stdout</code> 上回傳 JSON 格式的函式輸出，類似於 <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse" target="_blank" rel="noopener noreferrer"><code v-pre>functionResponse.response.content</code></a>。</li>
</ul>
</li>
<li><strong>預設值：</strong> 空值</li>
<li><strong>範例：</strong> <code v-pre>&quot;toolCallCommand&quot;: &quot;bin/call_tool&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>mcpServers</code></strong> (物件):</p>
<ul>
<li><strong>說明：</strong> 設定與一或多個 Model-Context Protocol (MCP) 伺服器的連線，以探索並使用自訂工具。Gemini CLI 會嘗試連線至每個已設定的 MCP 伺服器以探索可用工具。若多個 MCP 伺服器公開了同名工具，工具名稱將會加上您在設定中定義的伺服器別名作為前綴（例如 <code v-pre>serverAlias__actualToolName</code>）以避免衝突。請注意，系統可能會為了相容性而從 MCP 工具定義中移除某些結構描述屬性。</li>
<li><strong>預設值：</strong> 空值</li>
<li><strong>屬性：</strong>
<ul>
<li><strong><code v-pre>&lt;SERVER_NAME&gt;</code></strong> (物件)：指定伺服器的伺服器參數。
<ul>
<li><code v-pre>command</code> (字串，必要)：執行以啟動 MCP 伺服器的指令。</li>
<li><code v-pre>args</code> (字串陣列，選用)：傳遞給指令的引數。</li>
<li><code v-pre>env</code> (物件，選用)：為伺服器程序設定的環境變數。</li>
<li><code v-pre>cwd</code> (字串，選用)：啟動伺服器所在的工作目錄。</li>
<li><code v-pre>timeout</code> (number, optional)：對此 MCP 伺erver 請求的逾時時間（毫秒）。</li>
<li><code v-pre>trust</code> (boolean, optional)：信任此伺服器並略過所有工具呼叫確認。</li>
</ul>
</li>
</ul>
</li>
<li><strong>範例：</strong><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"myPythonServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"python"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"mcp_server.py"</span><span class="token punctuation">,</span> <span class="token string">"--port"</span><span class="token punctuation">,</span> <span class="token string">"8080"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"cwd"</span><span class="token operator">:</span> <span class="token string">"./mcp_tools/python"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"timeout"</span><span class="token operator">:</span> <span class="token number">5000</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"myNodeServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"node"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"mcp_server.js"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"cwd"</span><span class="token operator">:</span> <span class="token string">"./mcp_tools/node"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"myDockerServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"docker"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"run"</span><span class="token punctuation">,</span> <span class="token string">"i"</span><span class="token punctuation">,</span> <span class="token string">"--rm"</span><span class="token punctuation">,</span> <span class="token string">"-e"</span><span class="token punctuation">,</span> <span class="token string">"API_KEY"</span><span class="token punctuation">,</span> <span class="token string">"ghcr.io/foo/bar"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"API_KEY"</span><span class="token operator">:</span> <span class="token string">"$MY_API_TOKEN"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong><code v-pre>checkpointing</code></strong> (物件):</p>
<ul>
<li>**說明：**設定檢查點功能，可讓您儲存和還原對話和檔案狀態。如需更多詳細資訊，請參閱 <RouteLink to="/checkpointing.html">檢查點文件</RouteLink>。</li>
<li><strong>預設值：</strong><code v-pre>{&quot;enabled&quot;: false}</code></li>
<li><strong>屬性：</strong>
<ul>
<li><strong><code v-pre>enabled</code></strong> (布林值)：當設為 <code v-pre>true</code> 時，可使用 <code v-pre>/restore</code> 指令。</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong><code v-pre>preferredEditor</code></strong> (字串)：</p>
<ul>
<li>**說明：**指定用來檢視差異的首選編輯器。</li>
<li><strong>預設值：</strong><code v-pre>vscode</code></li>
<li><strong>範例：</strong> <code v-pre>&quot;preferredEditor&quot;: &quot;vscode&quot;</code></li>
</ul>
</li>
<li>
<p><strong><code v-pre>telemetry</code></strong> (物件)</p>
<ul>
<li>**說明：**設定 Gemini CLI 的記錄和指標收集。如需更多資訊，請參閱 <RouteLink to="/telemetry.html">遙測</RouteLink>。</li>
<li><strong>預設值：</strong><code v-pre>{&quot;enabled&quot;: false, &quot;target&quot;: &quot;local&quot;, &quot;otlpEndpoint&quot;: &quot;http://localhost:4317&quot;, &quot;logPrompts&quot;: true}</code></li>
<li><strong>屬性：</strong>
<ul>
<li><strong><code v-pre>enabled</code></strong> (布林值)：是否啟用遙測。</li>
<li><strong><code v-pre>target</code></strong> (字串)：收集到的遙測資料的目的地。支援的值為 <code v-pre>local</code> 和 <code v-pre>gcp</code>。</li>
<li><strong><code v-pre>otlpEndpoint</code></strong> (字串)：OTLP 匯出器的端點。</li>
<li><strong><code v-pre>logPrompts</code></strong> (布林值)：是否在日誌中包含使用者提示的內容。</li>
</ul>
</li>
<li><strong>範例：</strong><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token property">"telemetry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"enabled"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"target"</span><span class="token operator">:</span> <span class="token string">"local"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"otlpEndpoint"</span><span class="token operator">:</span> <span class="token string">"http://localhost:16686"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"logPrompts"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong><code v-pre>usageStatisticsEnabled</code></strong> (布林值)：</p>
<ul>
<li>**說明：**啟用或停用使用情況統計資料的收集。如需更多資訊，請參閱 <a href="#usage-statistics">使用情況統計</a>。</li>
<li><strong>預設值：</strong><code v-pre>true</code></li>
<li><strong>範例：</strong><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token property">"usageStatisticsEnabled"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
<h3 id="settings-json-範例" tabindex="-1"><a class="header-anchor" href="#settings-json-範例"><span><code v-pre>settings.json</code> 範例：</span></a></h3>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"theme"</span><span class="token operator">:</span> <span class="token string">"GitHub"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"sandbox"</span><span class="token operator">:</span> <span class="token string">"docker"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"toolDiscoveryCommand"</span><span class="token operator">:</span> <span class="token string">"bin/get_tools"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"toolCallCommand"</span><span class="token operator">:</span> <span class="token string">"bin/call_tool"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"mainServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"bin/mcp_server.py"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"anotherServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"node"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"mcp_server.js"</span><span class="token punctuation">,</span> <span class="token string">"--verbose"</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"telemetry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"enabled"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"target"</span><span class="token operator">:</span> <span class="token string">"local"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"otlpEndpoint"</span><span class="token operator">:</span> <span class="token string">"http://localhost:4317"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"logPrompts"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"usageStatisticsEnabled"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="shell-歷史記錄" tabindex="-1"><a class="header-anchor" href="#shell-歷史記錄"><span>Shell 歷史記錄</span></a></h2>
<p>CLI 會保留您執行的 Shell 指令歷史記錄。為避免不同專案之間的衝突，此歷史記錄會儲存在您使用者主資料夾內的專案特定目錄中。</p>
<ul>
<li><strong>位置：</strong><code v-pre>~/.gemini/tmp/&lt;project_hash&gt;/shell_history</code>
<ul>
<li><code v-pre>&lt;project_hash&gt;</code> 是從您專案的根路徑產生的唯一識別碼。</li>
<li>歷史記錄儲存在名為 <code v-pre>shell_history</code> 的檔案中。</li>
</ul>
</li>
</ul>
<h2 id="環境變數與-env-檔案" tabindex="-1"><a class="header-anchor" href="#環境變數與-env-檔案"><span>環境變數與 <code v-pre>.env</code> 檔案</span></a></h2>
<p>環境變數是設定應用程式的常用方法，特別適用於 API 金鑰等敏感資訊，或可能因環境而異的設定。</p>
<p>CLI 會自動從 <code v-pre>.env</code> 檔案載入環境變數。載入順序如下：</p>
<ol>
<li>目前工作目錄中的 <code v-pre>.env</code> 檔案。</li>
<li>如果找不到，它會向上搜尋父目錄，直到找到 <code v-pre>.env</code> 檔案或到達專案根目錄（由 <code v-pre>.git</code> 資料夾識別）或主目錄。</li>
<li>如果仍然找不到，它會尋找 <code v-pre>~/.env</code>（在使用者主目錄中）。</li>
</ol>
<ul>
<li><strong><code v-pre>GEMINI_API_KEY</code></strong> (必要)：
<ul>
<li>您的 Gemini API 金鑰。</li>
<li>**操作的關鍵。**若無此金鑰，CLI 將無法運作。</li>
<li>請在您的 Shell 設定檔（例如 <code v-pre>~/.bashrc</code>、<code v-pre>~/.zshrc</code>）或 <code v-pre>.env</code> 檔案中設定此項。</li>
</ul>
</li>
<li><strong><code v-pre>GEMINI_MODEL</code></strong>：
<ul>
<li>指定要使用的預設 Gemini 模型。</li>
<li>覆寫硬式編碼的預設值</li>
<li>範例：<code v-pre>export GEMINI_MODEL=&quot;gemini-2.5-flash&quot;</code></li>
</ul>
</li>
<li><strong><code v-pre>GOOGLE_API_KEY</code></strong>：
<ul>
<li>您的 Google Cloud API 金鑰。</li>
<li>在快速模式下使用 Vertex AI 所需。</li>
<li>請確保您擁有必要的權限，並設定 <code v-pre>GOOGLE_GENAI_USE_VERTEXAI=true</code> 環境變數。</li>
<li>範例：<code v-pre>export GOOGLE_API_KEY=&quot;YOUR_GOOGLE_API_KEY&quot;</code>。</li>
</ul>
</li>
<li><strong><code v-pre>GOOGLE_CLOUD_PROJECT</code></strong>：
<ul>
<li>您的 Google Cloud 專案 ID。</li>
<li>使用 Code Assist 或 Vertex AI 所需。</li>
<li>若使用 Vertex AI，請確保您擁有必要的權限，並設定 <code v-pre>GOOGLE_GENAI_USE_VERTEXAI=true</code> 環境變數。</li>
<li>範例：<code v-pre>export GOOGLE_CLOUD_PROJECT=&quot;YOUR_PROJECT_ID&quot;</code>。</li>
</ul>
</li>
<li><strong><code v-pre>GOOGLE_APPLICATION_CREDENTIALS</code></strong> (字串)：
<ul>
<li>**說明：**您的 Google Application Credentials JSON 檔案的路徑。</li>
<li><strong>範例：</strong><code v-pre>export GOOGLE_APPLICATION_CREDENTIALS=&quot;/path/to/your/credentials.json&quot;</code></li>
</ul>
</li>
<li><strong><code v-pre>OTLP_GOOGLE_CLOUD_PROJECT</code></strong>：
<ul>
<li>您在 Google Cloud 中用於遙測的 Google Cloud 專案 ID</li>
<li>範例：<code v-pre>export OTLP_GOOGLE_CLOUD_PROJECT=&quot;YOUR_PROJECT_ID&quot;</code>。</li>
</ul>
</li>
<li><strong><code v-pre>GOOGLE_CLOUD_LOCATION</code></strong>：
<ul>
<li>您的 Google Cloud 專案位置（例如 us-central1）。</li>
<li>在非 express 模式下使用 Vertex AI 為必要項。</li>
<li>若使用 Vertex AI，請確保您具有必要的權限，並設定 <code v-pre>GOOGLE_GENAI_USE_VERTEXAI=true</code> 環境變數。</li>
<li>範例：<code v-pre>export GOOGLE_CLOUD_LOCATION=&quot;YOUR_PROJECT_LOCATION&quot;</code>。</li>
</ul>
</li>
<li><strong><code v-pre>GEMINI_SANDBOX</code></strong>：
<ul>
<li><code v-pre>settings.json</code> 中 <code v-pre>sandbox</code> 設定的替代方案。</li>
<li>接受 <code v-pre>true</code>、<code v-pre>false</code>、<code v-pre>docker</code>、<code v-pre>podman</code> 或自訂指令字串。</li>
</ul>
</li>
<li><strong><code v-pre>SEATBELT_PROFILE</code></strong>（macOS 特定）：
<ul>
<li>在 macOS 上切換 Seatbelt（<code v-pre>sandbox-exec</code>）設定檔。</li>
<li><code v-pre>permissive-open</code>：（預設）限制寫入專案資料夾（以及其他幾個資料夾，請參閱 <code v-pre>packages/cli/src/utils/sandbox-macos-permissive-open.sb</code>），但允許其他操作。</li>
<li><code v-pre>strict</code>：使用嚴格的設定檔，預設會拒絕操作。</li>
<li><code v-pre>&lt;profile_name&gt;</code>：使用自訂設定檔。若要定義自訂設定檔，請在專案的 <code v-pre>.gemini/</code> 目錄中建立一個名為 <code v-pre>sandbox-macos-&lt;profile_name&gt;.sb</code> 的檔案（例如 <code v-pre>my-project/.gemini/sandbox-macos-custom.sb</code>）。</li>
</ul>
</li>
<li><strong><code v-pre>DEBUG</code> 或 <code v-pre>DEBUG_MODE</code></strong>（通常由底層函式庫或 CLI 本身使用）：
<ul>
<li>設定為 <code v-pre>true</code> 或 <code v-pre>1</code> 以啟用詳細的偵錯記錄，這有助於疑難排解。</li>
</ul>
</li>
<li><strong><code v-pre>NO_COLOR</code></strong>：
<ul>
<li>設定為任何值以停用 CLI 中的所有顏色輸出。</li>
</ul>
</li>
<li><strong><code v-pre>CLI_TITLE</code></strong>：
<ul>
<li>設定為字串以自訂 CLI 的標題。</li>
</ul>
</li>
<li><strong><code v-pre>CODE_ASSIST_ENDPOINT</code></strong>：
<ul>
<li>指定程式碼協助伺服器的端點。</li>
<li>這對於開發和測試很有用。</li>
</ul>
</li>
</ul>
<h2 id="命令列參數" tabindex="-1"><a class="header-anchor" href="#命令列參數"><span>命令列參數</span></a></h2>
<p>執行 CLI 時直接傳遞的參數可以覆寫該特定工作階段的其他設定。</p>
<ul>
<li><strong><code v-pre>--model &lt;model_name&gt;</code></strong>（<strong><code v-pre>-m &lt;model_name&gt;</code></strong>）：
<ul>
<li>指定此工作階段要使用的 Gemini 模型。</li>
<li>範例：<code v-pre>npm start -- --model gemini-1.5-pro-latest</code></li>
</ul>
</li>
<li><strong><code v-pre>--prompt &lt;your_prompt&gt;</code></strong>（<strong><code v-pre>-p &lt;your_prompt&gt;</code></strong>）：
<ul>
<li>用於將提示直接傳遞給指令。這會以非互動模式呼叫 Gemini CLI。</li>
</ul>
</li>
<li><strong><code v-pre>--sandbox</code></strong>（<strong><code v-pre>-s</code></strong>）：
<ul>
<li>為此工作階段啟用沙盒模式。</li>
</ul>
</li>
<li><strong><code v-pre>--sandbox-image</code></strong>：
<ul>
<li>設定沙盒映像 URI。</li>
</ul>
</li>
<li><strong><code v-pre>--debug_mode</code></strong>（<strong><code v-pre>-d</code></strong>）：
<ul>
<li>為此工作階段啟用偵錯模式，提供更詳細的輸出。</li>
</ul>
</li>
<li><strong><code v-pre>--all_files</code></strong>（<strong><code v-pre>-a</code></strong>）：
<ul>
<li>若設定此項，會遞迴地將目前目錄中的所有檔案作為提示的上下文。</li>
</ul>
</li>
<li><strong><code v-pre>--help</code></strong>（或 <strong><code v-pre>-h</code></strong>）：
<ul>
<li>顯示有關命令列參數的說明資訊。</li>
</ul>
</li>
<li><strong><code v-pre>--show_memory_usage</code></strong>：
<ul>
<li>顯示目前的記憶體使用情況。</li>
</ul>
</li>
<li><strong><code v-pre>--yolo</code></strong>：
<ul>
<li>啟用 YOLO 模式，此模式會自動核准所有工具呼叫。</li>
</ul>
</li>
<li><strong><code v-pre>--telemetry</code></strong>：
<ul>
<li>啟用 <RouteLink to="/telemetry.html">telemetry</RouteLink>。</li>
</ul>
</li>
<li><strong><code v-pre>--telemetry-target</code></strong>：
<ul>
<li>設定 telemetry 目標。請參閱 <RouteLink to="/telemetry.html">telemetry</RouteLink> 以取得更多資訊。</li>
</ul>
</li>
<li><strong><code v-pre>--telemetry-otlp-endpoint</code></strong>：
<ul>
<li>設定 telemetry 的 OTLP 端點。請參閱 <RouteLink to="/telemetry.html">telemetry</RouteLink> 以取得更多資訊。</li>
</ul>
</li>
<li><strong><code v-pre>--telemetry-log-prompts</code></strong>：
<ul>
<li>啟用 telemetry 的提示記錄。請參閱 <RouteLink to="/telemetry.html">telemetry</RouteLink> 以取得更多資訊。</li>
</ul>
</li>
<li><strong><code v-pre>--checkpointing</code></strong>：
<ul>
<li>啟用 <RouteLink to="/cli/commands.html#checkpointing-commands">checkpointing</RouteLink>。</li>
</ul>
</li>
<li><strong><code v-pre>--version</code></strong>：
<ul>
<li>顯示 CLI 的版本。</li>
</ul>
</li>
</ul>
<h2 id="情境檔案-階層式指令情境" tabindex="-1"><a class="header-anchor" href="#情境檔案-階層式指令情境"><span>情境檔案（階層式指令情境）</span></a></h2>
<p>雖然情境檔案並非嚴格意義上的 CLI <em>行為</em> 設定，但情境檔案（預設為 <code v-pre>GEMINI.md</code>，但可透過 <code v-pre>contextFileName</code> 設定進行配置）對於設定提供給 Gemini 模型的 <em>指令情境</em>（也稱為「記憶」）至關重要。這個強大的功能可讓您提供專案特定的指令、程式設計風格指南或任何相關的背景資訊給 AI，使其回應更能貼近您的需求且更準確。CLI 包含 UI 元素，例如頁尾的指示器會顯示已載入的情境檔案數量，讓您隨時了解目前作用中的情境。</p>
<ul>
<li><strong>目的：</strong> 這些 Markdown 檔案包含您希望 Gemini 模型在互動期間知悉的指令、指南或情境。系統的設計旨在以階層方式管理此指令情境。</li>
</ul>
<h3 id="情境檔案內容範例-例如-gemini-md" tabindex="-1"><a class="header-anchor" href="#情境檔案內容範例-例如-gemini-md"><span>情境檔案內容範例（例如 <code v-pre>GEMINI.md</code>）</span></a></h3>
<p>以下是一個位於 TypeScript 專案根目錄的情境檔案可能包含的概念性範例：</p>
<div class="language-markdown line-numbers-mode" data-highlighter="prismjs" data-ext="md"><pre v-pre><code class="language-markdown"><span class="line"><span class="token title important"><span class="token punctuation">#</span> 專案：我的超棒 TypeScript 函式庫</span></span>
<span class="line"></span>
<span class="line"><span class="token title important"><span class="token punctuation">##</span> 一般指令：</span></span>
<span class="line"></span>
<span class="line"><span class="token list punctuation">-</span> 產生新的 TypeScript 程式碼時，請遵循現有的程式設計風格。</span>
<span class="line"><span class="token list punctuation">-</span> 確保所有新的函式和類別都有 JSDoc 註解。</span>
<span class="line"><span class="token list punctuation">-</span> 在適當的情況下，優先採用函數式程式設計範式。</span>
<span class="line"><span class="token list punctuation">-</span> 所有程式碼都應與 TypeScript 5.0 及 Node.js 18+ 相容。</span>
<span class="line"></span>
<span class="line"><span class="token title important"><span class="token punctuation">##</span> 程式設計風格：</span></span>
<span class="line"></span>
<span class="line"><span class="token list punctuation">-</span> 使用 2 個空格進行縮排。</span>
<span class="line"><span class="token list punctuation">-</span> 介面名稱應以 <span class="token code-snippet code keyword">`I`</span> 為前綴（例如：<span class="token code-snippet code keyword">`IUserService`</span>）。</span>
<span class="line"><span class="token list punctuation">-</span> 私有類別成員應以底線 (<span class="token code-snippet code keyword">`_`</span>) 為前綴。</span>
<span class="line"><span class="token list punctuation">-</span> 一律使用嚴格相等 (<span class="token code-snippet code keyword">`===`</span> 和 <span class="token code-snippet code keyword">`!==`</span>)。</span>
<span class="line"></span>
<span class="line"><span class="token title important"><span class="token punctuation">##</span> 特定元件：`src/api/client.ts`</span></span>
<span class="line"></span>
<span class="line"><span class="token list punctuation">-</span> 此檔案處理所有對外的 API 請求。</span>
<span class="line"><span class="token list punctuation">-</span> 新增 API 呼叫函式時，請確保包含穩健的錯誤處理和日誌記錄。</span>
<span class="line"><span class="token list punctuation">-</span> 所有 GET 請求都請使用現有的 <span class="token code-snippet code keyword">`fetchWithRetry`</span> 工具程式。</span>
<span class="line"></span>
<span class="line"><span class="token title important"><span class="token punctuation">##</span> 關於相依套件：</span></span>
<span class="line"></span>
<span class="line"><span class="token list punctuation">-</span> 除非絕對必要，否則避免引入新的外部相依套件。</span>
<span class="line"><span class="token list punctuation">-</span> 如果需要新的相依套件，請說明原因。</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此範例展示了如何提供一般專案情境、特定的程式設計慣例，甚至是關於特定檔案或元件的註解。您的情境檔案越相關、越精確，AI 就越能更好地協助您。強烈建議使用專案特定的情境檔案來建立慣例和情境。</p>
<ul>
<li><strong>階層式載入與優先順序：</strong> CLI 透過從數個位置載入情境檔案（例如 <code v-pre>GEMINI.md</code>），實作了一個精密的階層式記憶體系統。此清單中位置較低（較特定）的檔案內容，通常會覆寫或補充位置較高（較一般）的檔案內容。確切的串連順序和最終情境可以使用 <code v-pre>/memory show</code> 指令來檢視。典型的載入順序為：
<ol>
<li><strong>全域情境檔案：</strong>
<ul>
<li>位置：<code v-pre>~/.gemini/&lt;contextFileName&gt;</code>（例如，在您的使用者家目錄中的 <code v-pre>~/.gemini/GEMINI.md</code>）。</li>
<li>範圍：為您的所有專案提供預設指令。</li>
</ul>
</li>
<li><strong>專案根目錄與上層目錄情境檔案：</strong>
<ul>
<li>位置：CLI 會在目前的工作目錄中尋找設定的情境檔案，然後在每個上層目錄中一路找到專案根目錄（由 <code v-pre>.git</code> 資料夾識別）或您的家目錄為止。</li>
<li>範圍：提供與整個專案或其中重要部分相關的情境。</li>
</ul>
</li>
<li><strong>子目錄情境檔案（情境式/本機）：</strong>
<ul>
<li>位置：CLI 也會掃描目前工作目錄 <em>下方</em> 的子目錄中設定的情境檔案（遵循常見的忽略模式，如 <code v-pre>node_modules</code>、<code v-pre>.git</code> 等）。</li>
<li>範圍：允許針對專案的特定元件、模組或子區段提供高度特定的指令。</li>
</ul>
</li>
</ol>
</li>
<li><strong>串連與 UI 指示：</strong> 所有找到的情境檔案內容都會被串連起來（並以分隔符號指示其來源和路徑），作為系統提示的一部分提供給 Gemini 模型。CLI 的頁尾會顯示已載入的情境檔案數量，讓您快速地看到目前作用中的指令情境。</li>
<li><strong>記憶體管理指令：</strong>
<ul>
<li>使用 <code v-pre>/memory refresh</code> 來強制重新掃描並從所有設定的位置重新載入所有情境檔案。這會更新 AI 的指令情境。</li>
<li>使用 <code v-pre>/memory show</code> 來顯示目前載入的組合指令情境，讓您能夠驗證 AI 正在使用的階層和內容。</li>
<li>有關 <code v-pre>/memory</code> 指令及其子指令（<code v-pre>show</code> 和 <code v-pre>refresh</code>）的完整詳細資訊，請參閱 <RouteLink to="/cli/commands.html#memory">指令文件</RouteLink>。</li>
</ul>
</li>
</ul>
<p>透過理解和利用這些設定層級以及情境檔案的階層式特性，您可以有效地管理 AI 的記憶體，並根據您的特定需求和專案量身打造 Gemini CLI 的回應。</p>
<h2 id="沙盒-sandboxing" tabindex="-1"><a class="header-anchor" href="#沙盒-sandboxing"><span>沙盒（Sandboxing）</span></a></h2>
<p>Gemini CLI 可以在沙盒環境中執行潛在不安全的作業（如 shell 指令碼和檔案修改），以保護您的系統。</p>
<p>沙盒功能預設為停用，但您可以透過幾種方式啟用它：</p>
<ul>
<li>使用 <code v-pre>--sandbox</code> 或 <code v-pre>-s</code> 旗標。</li>
<li>設定 <code v-pre>GEMINI_SANDBOX</code> 環境變數。</li>
<li>在 <code v-pre>--yolo</code> 模式下，沙盒預設為啟用。</li>
</ul>
<p>預設情況下，它會使用預先建構的 <code v-pre>gemini-cli-sandbox</code> Docker 映像檔。</p>
<p>若有專案特定的沙盒需求，您可以在專案的根目錄中建立一個自訂的 Dockerfile，路徑為 <code v-pre>.gemini/sandbox.Dockerfile</code>。這個 Dockerfile 可以基於基礎沙盒映像檔：</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> gemini-cli-sandbox</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在此處新增您的自訂相依套件或設定</span></span>
<span class="line"><span class="token comment"># 範例：</span></span>
<span class="line"><span class="token comment"># RUN apt-get update &amp;&amp; apt-get install -y some-package</span></span>
<span class="line"><span class="token comment"># COPY ./my-config /app/my-config</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>當 <code v-pre>.gemini/sandbox.Dockerfile</code> 存在時，您可以在執行 Gemini CLI 時使用 <code v-pre>BUILD_SANDBOX</code> 環境變數，以自動建構自訂沙盒映像檔：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">BUILD_SANDBOX</span><span class="token operator">=</span><span class="token number">1</span> gemini <span class="token parameter variable">-s</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="使用情況統計" tabindex="-1"><a class="header-anchor" href="#使用情況統計"><span>使用情況統計</span></a></h2>
<p>為了協助我們改善 Gemini CLI，我們會收集匿名的使用情況統計資料。這些資料有助於我們了解 CLI 的使用方式、找出常見問題並排定新功能的優先順序。</p>
<p><strong>我們收集的內容：</strong></p>
<ul>
<li><strong>工具呼叫：</strong> 我們會記錄被呼叫的工具名稱、呼叫成功或失敗，以及執行所需的時間。我們不會收集傳遞給工具的引數或工具傳回的任何資料。</li>
<li><strong>API 請求：</strong> 我們會記錄每個請求使用的 Gemini 模型、請求的持續時間以及請求是否成功。我們不會收集提示或回應的內容。</li>
<li><strong>工作階段資訊：</strong> 我們會收集有關 CLI 組態的資訊，例如已啟用的工具和核准模式。</li>
</ul>
<p><strong>我們「不」收集的內容：</strong></p>
<ul>
<li><strong>個人識別資訊 (PII)：</strong> 我們不會收集任何個人資訊，例如您的姓名、電子郵件地址或 API 金鑰。</li>
<li><strong>提示和回應內容：</strong> 我們不會記錄您的提示內容或 Gemini 模型的回應。</li>
<li><strong>檔案內容：</strong> 我們不會記錄 CLI 讀取或寫入的任何檔案內容。</li>
</ul>
<p><strong>如何選擇停用：</strong></p>
<p>您可以隨時選擇停用使用情況統計資料收集，方法是將 <code v-pre>settings.json</code> 檔案中的 <code v-pre>usageStatisticsEnabled</code> 屬性設定為 <code v-pre>false</code>：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"usageStatisticsEnabled"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


