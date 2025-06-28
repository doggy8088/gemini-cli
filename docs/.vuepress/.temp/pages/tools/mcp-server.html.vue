<template><div><h1 id="gemini-cli-的-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#gemini-cli-的-mcp-伺服器"><span>Gemini CLI 的 MCP 伺服器</span></a></h1>
<p>本文件提供設定與使用模型情境協定 (MCP) 伺服器與 Gemini CLI 的指南。</p>
<h2 id="mcp-伺服器是什麼" tabindex="-1"><a class="header-anchor" href="#mcp-伺服器是什麼"><span>MCP 伺服器是什麼？</span></a></h2>
<p>MCP 伺服器是一種應用程式，透過模型情境協定將工具與資源公開給 Gemini CLI，使其能與外部系統和資料來源互動。MCP 伺服器扮演著 Gemini 模型與您的本機環境或其他服務（如 API）之間的橋樑。
MCP 伺服器讓 Gemini CLI 能夠：</p>
<ul>
<li><strong>探索工具：</strong> 透過標準化結構定義，列出可用的工具、其描述及參數。</li>
<li><strong>執行工具：</strong> 使用定義好的參數呼叫特定工具，並接收結構化回應。</li>
<li><strong>存取資源：</strong> 從特定資源讀取資料（儘管 Gemini CLI 主要專注於工具執行）。
透過 MCP 伺服器，您可以擴充 Gemini CLI 的功能，以執行其內建功能以外的動作，例如與資料庫、API、自訂腳本或專門的工作流程互動。</li>
</ul>
<h2 id="核心整合架構" tabindex="-1"><a class="header-anchor" href="#核心整合架構"><span>核心整合架構</span></a></h2>
<p>Gemini CLI 透過內建於核心套件 (<code v-pre>packages/core/src/tools/</code>) 的精密探索與執行系統，與 MCP 伺服器整合：</p>
<h3 id="探索層-mcp-client-ts" tabindex="-1"><a class="header-anchor" href="#探索層-mcp-client-ts"><span>探索層 (<code v-pre>mcp-client.ts</code>)</span></a></h3>
<p>探索過程由 <code v-pre>discoverMcpTools()</code> 協調，其功能為：</p>
<ol>
<li><strong>迭代已設定的伺服器</strong> 從您的 <code v-pre>settings.json</code> <code v-pre>mcpServers</code> 設定中</li>
<li><strong>建立連線</strong> 使用適當的傳輸機制 (Stdio、SSE 或可串流 HTTP)</li>
<li><strong>擷取工具定義</strong> 使用 MCP 協定從每個伺服器擷取</li>
<li><strong>清理與驗證</strong> 工具結構，確保與 Gemini API 的相容性</li>
<li><strong>註冊工具</strong> 在全域工具註冊表中，並解決衝突</li>
</ol>
<h3 id="執行層-mcp-tool-ts" tabindex="-1"><a class="header-anchor" href="#執行層-mcp-tool-ts"><span>執行層 (<code v-pre>mcp-tool.ts</code>)</span></a></h3>
<p>每個探索到的 MCP 工具都會被包裝在一個 <code v-pre>DiscoveredMCPTool</code> 實例中，該實例會：</p>
<ul>
<li><strong>處理確認邏輯</strong> 根據伺服器信任設定和使用者偏好</li>
<li><strong>管理工具執行</strong> 透過使用正確的參數呼叫 MCP 伺服器</li>
<li><strong>處理回應</strong> 供 LLM 情境和使用者顯示使用</li>
<li><strong>維護連線狀態</strong> 並處理逾時</li>
</ul>
<h3 id="傳輸機制" tabindex="-1"><a class="header-anchor" href="#傳輸機制"><span>傳輸機制</span></a></h3>
<p>Gemini CLI 支援三種 MCP 傳輸類型：</p>
<ul>
<li><strong>Stdio 傳輸：</strong> 產生一個子程序並透過 stdin/stdout 進行通訊</li>
<li><strong>SSE 傳輸：</strong> 連線至 Server-Sent Events 端點</li>
<li><strong>可串流 HTTP 傳輸：</strong> 使用 HTTP 串流進行通訊</li>
</ul>
<h2 id="如何設定您的-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#如何設定您的-mcp-伺服器"><span>如何設定您的 MCP 伺服器</span></a></h2>
<p>Gemini CLI 使用您 <code v-pre>settings.json</code> 檔案中的 <code v-pre>mcpServers</code> 設定來定位並連線至 MCP 伺服器。此設定支援多個使用不同傳輸機制的伺服器。</p>
<h3 id="在-settings-json-中設定-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#在-settings-json-中設定-mcp-伺服器"><span>在 settings.json 中設定 MCP 伺服器</span></a></h3>
<p>您可以在全域層級的 <code v-pre>~/.gemini/settings.json</code> 檔案中設定 MCP 伺服器，或在您專案的根目錄中，建立或開啟 <code v-pre>.gemini/settings.json</code> 檔案。在檔案中，新增 <code v-pre>mcpServers</code> 設定區塊。</p>
<h3 id="設定結構" tabindex="-1"><a class="header-anchor" href="#設定結構"><span>設定結構</span></a></h3>
<p>在您的 <code v-pre>settings.json</code> 檔案中新增一個 <code v-pre>mcpServers</code> 物件：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span> ...檔案包含其他設定物件</span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"serverName"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"path/to/server"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"--arg1"</span><span class="token punctuation">,</span> <span class="token string">"value1"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"API_KEY"</span><span class="token operator">:</span> <span class="token string">"$MY_API_TOKEN"</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"cwd"</span><span class="token operator">:</span> <span class="token string">"./server-directory"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"timeout"</span><span class="token operator">:</span> <span class="token number">30000</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"trust"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="設定屬性" tabindex="-1"><a class="header-anchor" href="#設定屬性"><span>設定屬性</span></a></h3>
<p>每個伺服器設定支援以下屬性：</p>
<h4 id="必要項-以下擇一" tabindex="-1"><a class="header-anchor" href="#必要項-以下擇一"><span>必要項（以下擇一）</span></a></h4>
<ul>
<li><strong><code v-pre>command</code></strong> (字串): Stdio 傳輸的可執行檔路徑</li>
<li><strong><code v-pre>url</code></strong> (字串): SSE 端點網址 (例如：<code v-pre>&quot;http://localhost:8080/sse&quot;</code>)</li>
<li><strong><code v-pre>httpUrl</code></strong> (字串): HTTP 串流端點網址</li>
</ul>
<h4 id="選用項" tabindex="-1"><a class="header-anchor" href="#選用項"><span>選用項</span></a></h4>
<ul>
<li><strong><code v-pre>args</code></strong> (字串[]): Stdio 傳輸的命令列參數</li>
<li><strong><code v-pre>env</code></strong> (物件): 伺服器程序的環境變數。值可以使用 <code v-pre>$VAR_NAME</code> 或 <code v-pre>${VAR_NAME}</code> 語法參照環境變數</li>
<li><strong><code v-pre>cwd</code></strong> (字串): Stdio 傳輸的工作目錄</li>
<li><strong><code v-pre>timeout</code></strong> (數字): 請求逾時時間（毫秒）(預設值：600,000ms = 10 分鐘)</li>
<li><strong><code v-pre>trust</code></strong> (布林值): 若為 <code v-pre>true</code>，將略過此伺服器的所有工具呼叫確認 (預設值：<code v-pre>false</code>)</li>
</ul>
<h3 id="設定範例" tabindex="-1"><a class="header-anchor" href="#設定範例"><span>設定範例</span></a></h3>
<h4 id="python-mcp-伺服器-stdio" tabindex="-1"><a class="header-anchor" href="#python-mcp-伺服器-stdio"><span>Python MCP 伺服器 (Stdio)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"pythonTools"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"python"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"-m"</span><span class="token punctuation">,</span> <span class="token string">"my_mcp_server"</span><span class="token punctuation">,</span> <span class="token string">"--port"</span><span class="token punctuation">,</span> <span class="token string">"8080"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"cwd"</span><span class="token operator">:</span> <span class="token string">"./mcp-servers/python"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"DATABASE_URL"</span><span class="token operator">:</span> <span class="token string">"$DB_CONNECTION_STRING"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"API_KEY"</span><span class="token operator">:</span> <span class="token string">"${EXTERNAL_API_KEY}"</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"timeout"</span><span class="token operator">:</span> <span class="token number">15000</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="node-js-mcp-伺服器-stdio" tabindex="-1"><a class="header-anchor" href="#node-js-mcp-伺服器-stdio"><span>Node.js MCP 伺服器 (Stdio)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"nodeServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"node"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"dist/server.js"</span><span class="token punctuation">,</span> <span class="token string">"--verbose"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"cwd"</span><span class="token operator">:</span> <span class="token string">"./mcp-servers/node"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"trust"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="基於-docker-的-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#基於-docker-的-mcp-伺服器"><span>基於 Docker 的 MCP 伺服器</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"dockerizedServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"docker"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"run"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"-i"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"--rm"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"-e"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"API_KEY"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"-v"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"${PWD}:/workspace"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"my-mcp-server:latest"</span></span>
<span class="line">      <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"API_KEY"</span><span class="token operator">:</span> <span class="token string">"$EXTERNAL_SERVICE_TOKEN"</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="基於-http-的-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#基於-http-的-mcp-伺服器"><span>基於 HTTP 的 MCP 伺服器</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"httpServer"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"httpUrl"</span><span class="token operator">:</span> <span class="token string">"http://localhost:3000/mcp"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"timeout"</span><span class="token operator">:</span> <span class="token number">5000</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="深入探索發現程序" tabindex="-1"><a class="header-anchor" href="#深入探索發現程序"><span>深入探索發現程序</span></a></h2>
<p>當 Gemini CLI 啟動時，它會透過以下詳細程序執行 MCP 伺服器探索：</p>
<h3 id="_1-伺服器迭代與連線" tabindex="-1"><a class="header-anchor" href="#_1-伺服器迭代與連線"><span>1. 伺服器迭代與連線</span></a></h3>
<p>對於 <code v-pre>mcpServers</code> 中設定的每個伺服器：</p>
<ol>
<li><strong>狀態追蹤開始：</strong> 伺服器狀態設定為 <code v-pre>CONNECTING</code></li>
<li><strong>傳輸選擇：</strong> 根據設定屬性：
<ul>
<li><code v-pre>httpUrl</code> → <code v-pre>StreamableHTTPClientTransport</code></li>
<li><code v-pre>url</code> → <code v-pre>SSEClientTransport</code></li>
<li><code v-pre>command</code> → <code v-pre>StdioClientTransport</code></li>
</ul>
</li>
<li><strong>建立連線：</strong> MCP 客戶端嘗試在設定的逾時時間內連線</li>
<li><strong>錯誤處理：</strong> 記錄連線失敗，並將伺服器狀態設定為 <code v-pre>DISCONNECTED</code></li>
</ol>
<h3 id="_2-工具探索" tabindex="-1"><a class="header-anchor" href="#_2-工具探索"><span>2. 工具探索</span></a></h3>
<p>成功連線後：</p>
<ol>
<li><strong>工具列表：</strong> 客戶端呼叫 MCP 伺服器的工具列表端點</li>
<li><strong>結構驗證：</strong> 驗證每個工具的函式宣告</li>
<li><strong>名稱清理：</strong> 清理工具名稱以符合 Gemini API 的要求：
<ul>
<li>無效字元（非英數字、底線、點、連字號）會被底線取代</li>
<li>長度超過 63 個字元的名稱會被截斷並在中間替換 (<code v-pre>___</code>)</li>
</ul>
</li>
</ol>
<h3 id="_3-衝突解決" tabindex="-1"><a class="header-anchor" href="#_3-衝突解決"><span>3. 衝突解決</span></a></h3>
<p>當多個伺服器公開同名工具時：</p>
<ol>
<li><strong>先註冊者優先：</strong> 第一個註冊工具名稱的伺服器會獲得無前綴的名稱</li>
<li><strong>自動加上前綴：</strong> 後續的伺服器會獲得加上前綴的名稱：<code v-pre>serverName__toolName</code></li>
<li><strong>註冊表追蹤：</strong> 工具註冊表會維護伺服器名稱及其工具之間的對應關係</li>
</ol>
<h3 id="_4-結構處理" tabindex="-1"><a class="header-anchor" href="#_4-結構處理"><span>4. 結構處理</span></a></h3>
<p>工具參數結構會經過清理以符合 Gemini API 的相容性：</p>
<ul>
<li><strong><code v-pre>$schema</code> 屬性</strong>會被移除</li>
<li><strong><code v-pre>additionalProperties</code></strong> 會被移除</li>
<li><strong>帶有 <code v-pre>default</code> 的 <code v-pre>anyOf</code></strong> 會移除其預設值（為了 Vertex AI 相容性）</li>
<li><strong>遞迴處理</strong>會應用於巢狀結構</li>
</ul>
<h3 id="_5-連線管理" tabindex="-1"><a class="header-anchor" href="#_5-連線管理"><span>5. 連線管理</span></a></h3>
<p>探索完成後：</p>
<ul>
<li><strong>持續連線：</strong> 成功註冊工具的伺服器會保持其連線</li>
<li><strong>清理：</strong> 提供無可用工具的伺服器，其連線將被關閉</li>
<li><strong>狀態更新：</strong> 最終伺服器狀態會設定為 <code v-pre>CONNECTED</code> 或 <code v-pre>DISCONNECTED</code></li>
</ul>
<h2 id="工具執行流程" tabindex="-1"><a class="header-anchor" href="#工具執行流程"><span>工具執行流程</span></a></h2>
<p>當 Gemini 模型決定使用 MCP 工具時，會發生以下執行流程：</p>
<h3 id="_1-工具呼叫" tabindex="-1"><a class="header-anchor" href="#_1-工具呼叫"><span>1. 工具呼叫</span></a></h3>
<p>模型會產生一個帶有以下內容的 <code v-pre>FunctionCall</code>：</p>
<ul>
<li><strong>工具名稱：</strong> 已註冊的名稱（可能帶有前綴）</li>
<li><strong>引數：</strong> 符合工具參數結構的 JSON 物件</li>
</ul>
<h3 id="_2-確認程序" tabindex="-1"><a class="header-anchor" href="#_2-確認程序"><span>2. 確認程序</span></a></h3>
<p>每個 <code v-pre>DiscoveredMCPTool</code> 都會實作精密的確認邏輯：</p>
<h4 id="基於信任的繞過機制" tabindex="-1"><a class="header-anchor" href="#基於信任的繞過機制"><span>基於信任的繞過機制</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>trust<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 不需要確認</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="動態允許清單" tabindex="-1"><a class="header-anchor" href="#動態允許清單"><span>動態允許清單</span></a></h4>
<p>系統會維護內部的允許清單，用於：</p>
<ul>
<li><strong>伺服器層級：</strong> <code v-pre>serverName</code> → 信任此伺服器的所有工具</li>
<li><strong>工具層級：</strong> <code v-pre>serverName.toolName</code> → 信任此特定工具</li>
</ul>
<h4 id="使用者選擇處理" tabindex="-1"><a class="header-anchor" href="#使用者選擇處理"><span>使用者選擇處理</span></a></h4>
<p>當需要確認時，使用者可以選擇：</p>
<ul>
<li><strong>執行一次：</strong> 僅執行這一次</li>
<li><strong>永遠允許此工具：</strong> 新增至工具層級的允許清單</li>
<li><strong>永遠允許此伺服器：</strong> 新增至伺服器層級的允許清單</li>
<li><strong>取消：</strong> 中止執行</li>
</ul>
<h3 id="_3-執行" tabindex="-1"><a class="header-anchor" href="#_3-執行"><span>3. 執行</span></a></h3>
<p>確認後（或透過信任繞過）：</p>
<ol>
<li>
<p><strong>參數準備：</strong> 根據工具的結構驗證引數</p>
</li>
<li>
<p><strong>MCP 呼叫：</strong> 底層的 <code v-pre>CallableTool</code> 會以下列內容呼叫伺服器：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> functionCalls <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    name<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>serverToolName<span class="token punctuation">,</span> <span class="token comment">// 原始伺服器工具名稱</span></span>
<span class="line">    args<span class="token operator">:</span> params<span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>回應處理：</strong> 將結果格式化，以便用於 LLM 上下文和使用者顯示</p>
</li>
</ol>
<h3 id="_4-回應處理" tabindex="-1"><a class="header-anchor" href="#_4-回應處理"><span>4. 回應處理</span></a></h3>
<p>執行結果包含：</p>
<ul>
<li><strong><code v-pre>llmContent</code>:</strong> 用於語言模型上下文的原始回應部分</li>
<li><strong><code v-pre>returnDisplay</code>:</strong> 供使用者顯示的格式化輸出（通常是 markdown 程式碼區塊中的 JSON）</li>
</ul>
<h2 id="如何與您的-mcp-伺服器互動" tabindex="-1"><a class="header-anchor" href="#如何與您的-mcp-伺服器互動"><span>如何與您的 MCP 伺服器互動</span></a></h2>
<h3 id="使用-mcp-指令" tabindex="-1"><a class="header-anchor" href="#使用-mcp-指令"><span>使用 <code v-pre>/mcp</code> 指令</span></a></h3>
<p><code v-pre>/mcp</code> 指令提供有關您 MCP 伺服器設定的全面資訊：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">/mcp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>這會顯示：</p>
<ul>
<li><strong>伺服器列表：</strong> 所有已設定的 MCP 伺服器</li>
<li><strong>連線狀態：</strong> <code v-pre>CONNECTED</code>、<code v-pre>CONNECTING</code> 或 <code v-pre>DISCONNECTED</code></li>
<li><strong>伺服器詳細資訊：</strong> 設定摘要（不含敏感資料）</li>
<li><strong>可用工具：</strong> 來自各伺服器的工具清單及其描述</li>
<li><strong>探索狀態：</strong> 整體探索程序狀態</li>
</ul>
<h3 id="mcp-輸出範例" tabindex="-1"><a class="header-anchor" href="#mcp-輸出範例"><span><code v-pre>/mcp</code> 輸出範例</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">MCP Servers Status:</span>
<span class="line"></span>
<span class="line">📡 pythonTools (CONNECTED)</span>
<span class="line">  Command: python -m my_mcp_server --port 8080</span>
<span class="line">  Working Directory: ./mcp-servers/python</span>
<span class="line">  Timeout: 15000ms</span>
<span class="line">  Tools: calculate_sum, file_analyzer, data_processor</span>
<span class="line"></span>
<span class="line">🔌 nodeServer (DISCONNECTED)</span>
<span class="line">  Command: node dist/server.js --verbose</span>
<span class="line">  Error: Connection refused</span>
<span class="line"></span>
<span class="line">🐳 dockerizedServer (CONNECTED)</span>
<span class="line">  Command: docker run -i --rm -e API_KEY my-mcp-server:latest</span>
<span class="line">  Tools: docker__deploy, docker__status</span>
<span class="line"></span>
<span class="line">Discovery State: COMPLETED</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="工具使用" tabindex="-1"><a class="header-anchor" href="#工具使用"><span>工具使用</span></a></h3>
<p>一旦探索完成，MCP 工具就像內建工具一樣可供 Gemini 模型使用。模型將會自動：</p>
<ol>
<li>根據您的請求<strong>選擇適當的工具</strong></li>
<li><strong>顯示確認對話方塊</strong>（除非伺服器受信任）</li>
<li>使用適當的參數<strong>執行工具</strong></li>
<li>以使用者友善的格式<strong>顯示結果</strong></li>
</ol>
<h2 id="狀態監控與疑難排解" tabindex="-1"><a class="header-anchor" href="#狀態監控與疑難排解"><span>狀態監控與疑難排解</span></a></h2>
<h3 id="連線狀態" tabindex="-1"><a class="header-anchor" href="#連線狀態"><span>連線狀態</span></a></h3>
<p>MCP 整合會追蹤數種狀態：</p>
<h4 id="伺服器狀態-mcpserverstatus" tabindex="-1"><a class="header-anchor" href="#伺服器狀態-mcpserverstatus"><span>伺服器狀態 (<code v-pre>MCPServerStatus</code>)</span></a></h4>
<ul>
<li><strong><code v-pre>DISCONNECTED</code>：</strong> 伺服器未連線或有錯誤</li>
<li><strong><code v-pre>CONNECTING</code>：</strong> 正在嘗試連線</li>
<li><strong><code v-pre>CONNECTED</code>：</strong> 伺服器已連線並準備就緒</li>
</ul>
<h4 id="探索狀態-mcpdiscoverystate" tabindex="-1"><a class="header-anchor" href="#探索狀態-mcpdiscoverystate"><span>探索狀態 (<code v-pre>MCPDiscoveryState</code>)</span></a></h4>
<ul>
<li><strong><code v-pre>NOT_STARTED</code>：</strong> 探索尚未開始</li>
<li><strong><code v-pre>IN_PROGRESS</code>：</strong> 正在探索伺服器</li>
<li><strong><code v-pre>COMPLETED</code>：</strong> 探索已完成（無論是否有錯誤）</li>
</ul>
<h3 id="常見問題與解決方案" tabindex="-1"><a class="header-anchor" href="#常見問題與解決方案"><span>常見問題與解決方案</span></a></h3>
<h4 id="伺服器無法連線" tabindex="-1"><a class="header-anchor" href="#伺服器無法連線"><span>伺服器無法連線</span></a></h4>
<p><strong>症狀：</strong> 伺服器顯示 <code v-pre>DISCONNECTED</code> 狀態</p>
<p><strong>疑難排解：</strong></p>
<ol>
<li><strong>檢查設定：</strong> 驗證 <code v-pre>command</code>、<code v-pre>args</code> 和 <code v-pre>cwd</code> 是否正確</li>
<li><strong>手動測試：</strong> 直接執行伺服器指令以確保其可運作</li>
<li><strong>檢查相依性：</strong> 確保所有必要的套件都已安裝</li>
<li><strong>檢閱日誌：</strong> 在 CLI 輸出中尋找錯誤訊息</li>
<li><strong>驗證權限：</strong> 確保 CLI 可以執行伺服器指令</li>
</ol>
<h4 id="未探索到任何工具" tabindex="-1"><a class="header-anchor" href="#未探索到任何工具"><span>未探索到任何工具</span></a></h4>
<p><strong>症狀：</strong> 伺服器已連線但沒有可用的工具</p>
<p><strong>疑難排解：</strong></p>
<ol>
<li><strong>驗證工具註冊：</strong> 確保您的伺服器確實有註冊工具</li>
<li><strong>檢查 MCP 協定：</strong> 確認您的伺服器正確實作 MCP 工具列表功能</li>
<li><strong>檢閱伺服器日誌：</strong> 檢查 stderr 輸出以找出伺服器端錯誤</li>
<li><strong>測試工具列表：</strong> 手動測試您伺服器的工具探索端點</li>
</ol>
<h4 id="工具無法執行" tabindex="-1"><a class="header-anchor" href="#工具無法執行"><span>工具無法執行</span></a></h4>
<p><strong>症狀：</strong> 工具已探索到但在執行期間失敗</p>
<p><strong>疑難排解：</strong></p>
<ol>
<li><strong>參數驗證：</strong> 確保您的工具接受預期的參數</li>
<li><strong>結構（Schema）相容性：</strong> 驗證您的輸入結構是有效的 JSON Schema</li>
<li><strong>錯誤處理：</strong> 檢查您的工具是否拋出未處理的例外</li>
<li><strong>逾時問題：</strong> 考慮增加 <code v-pre>timeout</code> 設定</li>
</ol>
<h4 id="沙箱相容性" tabindex="-1"><a class="header-anchor" href="#沙箱相容性"><span>沙箱相容性</span></a></h4>
<p><strong>症狀：</strong> 啟用沙箱時 MCP 伺服器失敗</p>
<p><strong>解決方案：</strong></p>
<ol>
<li><strong>基於 Docker 的伺服器：</strong> 使用包含所有相依性的 Docker 容器</li>
<li><strong>路徑可存取性：</strong> 確保伺服器執行檔在沙箱中可用</li>
<li><strong>網路存取：</strong> 設定沙箱以允許必要的網路連線</li>
<li><strong>環境變數：</strong> 驗證必要的環境變數已傳遞</li>
</ol>
<h3 id="除錯技巧" tabindex="-1"><a class="header-anchor" href="#除錯技巧"><span>除錯技巧</span></a></h3>
<ol>
<li><strong>啟用除錯模式：</strong> 使用 <code v-pre>--debug_mode</code> 執行 CLI 以取得詳細輸出</li>
<li><strong>檢查 stderr：</strong> MCP 伺服器的 stderr 會被擷取並記錄下來（INFO 訊息會被過濾）</li>
<li><strong>隔離測試：</strong> 在整合前獨立測試您的 MCP 伺服器</li>
<li><strong>漸進式設定：</strong> 從簡單的工具開始，再逐步增加複雜的功能</li>
<li><strong>頻繁使用 <code v-pre>/mcp</code>：</strong> 在開發過程中監控伺服器狀態</li>
</ol>
<h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<h3 id="安全性考量" tabindex="-1"><a class="header-anchor" href="#安全性考量"><span>安全性考量</span></a></h3>
<ul>
<li><strong>信任設定：</strong> <code v-pre>trust</code> 選項會繞過所有確認對話方塊。請謹慎使用，且僅用於您完全控制的伺服器</li>
<li><strong>存取權杖：</strong> 設定包含 API 金鑰或權杖的環境變數時，請注意安全性</li>
<li><strong>沙箱相容性：</strong> 使用沙箱時，請確保 MCP 伺服器在沙箱環境中可用</li>
<li><strong>私密資料：</strong> 使用範圍過廣的個人存取權杖可能導致儲存庫之間的資訊洩漏</li>
</ul>
<h3 id="效能與資源管理" tabindex="-1"><a class="header-anchor" href="#效能與資源管理"><span>效能與資源管理</span></a></h3>
<ul>
<li><strong>連線持續性：</strong> CLI 會與成功註冊工具的伺服器保持持續連線</li>
<li><strong>自動清理：</strong> 與未提供任何工具的伺服器的連線將會自動關閉</li>
<li><strong>逾時管理：</strong> 根據您伺服器的回應特性設定適當的逾時時間</li>
<li><strong>資源監控：</strong> MCP 伺服器會以獨立的程序執行並消耗系統資源</li>
</ul>
<h3 id="schema-相容性" tabindex="-1"><a class="header-anchor" href="#schema-相容性"><span>Schema 相容性</span></a></h3>
<ul>
<li><strong>屬性移除：</strong> 系統會自動移除某些 schema 屬性 (<code v-pre>$schema</code>, <code v-pre>additionalProperties</code>) 以確保與 Gemini API 的相容性</li>
<li><strong>名稱清理：</strong> 工具名稱會自動清理以符合 API 要求</li>
<li><strong>衝突解決：</strong> 伺服器之間的工具名稱衝突會透過自動加上前綴來解決</li>
</ul>
<p>這種全面的整合使 MCP 伺服器成為擴充 Gemini CLI 功能的強大方式，同時保有安全性、可靠性與易用性。</p>
</div></template>


