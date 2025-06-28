<template><div><h1 id="gemini-cli-可觀測性指南" tabindex="-1"><a class="header-anchor" href="#gemini-cli-可觀測性指南"><span>Gemini CLI 可觀測性指南</span></a></h1>
<p>遙測功能提供有關 Gemini CLI 的效能、健康狀況與使用情況的資料。啟用此功能後，您可以透過追蹤、指標與結構化日誌來監控操作、偵錯問題並最佳化工具使用。</p>
<p>Gemini CLI 的遙測系統基於 <strong><a href="https://opentelemetry.io/" target="_blank" rel="noopener noreferrer">OpenTelemetry</a> (OTEL)</strong> 標準建構，可讓您將資料傳送至任何相容的後端。</p>
<h2 id="啟用遙測" tabindex="-1"><a class="header-anchor" href="#啟用遙測"><span>啟用遙測</span></a></h2>
<p>您可以用多種方式啟用遙測。設定主要透過 <RouteLink to="/cli/configuration.html"><code v-pre>.gemini/settings.json</code> 檔案</RouteLink> 和環境變數進行管理，但 CLI 旗標可以覆寫這些設定以供特定工作階段使用。</p>
<h3 id="優先順序" tabindex="-1"><a class="header-anchor" href="#優先順序"><span>優先順序</span></a></h3>
<p>以下列出套用遙測設定的優先順序，清單中位置較高的項目具有較高的優先權：</p>
<ol>
<li>
<p><strong>CLI 旗標 (適用於 <code v-pre>gemini</code> 指令)：</strong></p>
<ul>
<li><code v-pre>--telemetry</code> / <code v-pre>--no-telemetry</code>：覆寫 <code v-pre>telemetry.enabled</code>。</li>
<li><code v-pre>--telemetry-target &lt;local|gcp&gt;</code>：覆寫 <code v-pre>telemetry.target</code>。</li>
<li><code v-pre>--telemetry-otlp-endpoint &lt;URL&gt;</code>：覆寫 <code v-pre>telemetry.otlpEndpoint</code>。</li>
<li><code v-pre>--telemetry-log-prompts</code> / <code v-pre>--no-telemetry-log-prompts</code>：覆寫 <code v-pre>telemetry.logPrompts</code>。</li>
</ul>
</li>
<li>
<p><strong>環境變數：</strong></p>
<ul>
<li><code v-pre>OTEL_EXPORTER_OTLP_ENDPOINT</code>：覆寫 <code v-pre>telemetry.otlpEndpoint</code>。</li>
</ul>
</li>
<li>
<p><strong>工作區設定檔 (<code v-pre>.gemini/settings.json</code>):</strong> 來自此專案特定檔案中 <code v-pre>telemetry</code> 物件的值。</p>
</li>
<li>
<p><strong>使用者設定檔 (<code v-pre>~/.gemini/settings.json</code>):</strong> 來自此全域使用者檔案中 <code v-pre>telemetry</code> 物件的值。</p>
</li>
<li>
<p><strong>預設值：</strong> 如果上述任何一項皆未設定，則套用預設值。</p>
<ul>
<li><code v-pre>telemetry.enabled</code>：<code v-pre>false</code></li>
<li><code v-pre>telemetry.target</code>：<code v-pre>local</code></li>
<li><code v-pre>telemetry.otlpEndpoint</code>：<code v-pre>http://localhost:4317</code></li>
<li><code v-pre>telemetry.logPrompts</code>：<code v-pre>true</code></li>
</ul>
</li>
</ol>
<p><strong>對於 <code v-pre>npm run telemetry -- --target=&lt;gcp|local&gt;</code> 指令碼：</strong>
此指令碼的 <code v-pre>--target</code> 引數<em>僅</em>在該指令碼的持續時間與目的內覆寫 <code v-pre>telemetry.target</code> (即選擇要啟動哪個收集器)。它不會永久變更您的 <code v-pre>settings.json</code>。該指令碼會先在 <code v-pre>settings.json</code> 中尋找 <code v-pre>telemetry.target</code> 以用作其預設值。</p>
<h3 id="設定範例" tabindex="-1"><a class="header-anchor" href="#設定範例"><span>設定範例</span></a></h3>
<p>您可以將下列程式碼新增至您的工作區 (<code v-pre>.gemini/settings.json</code>) 或使用者 (<code v-pre>~/.gemini/settings.json</code>) 設定中，以啟用遙測並將輸出傳送至 Google Cloud：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"telemetry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"enabled"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"target"</span><span class="token operator">:</span> <span class="token string">"gcp"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"sandbox"</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="執行-otel-collector" tabindex="-1"><a class="header-anchor" href="#執行-otel-collector"><span>執行 OTEL Collector</span></a></h2>
<p>OTEL Collector 是一項接收、處理和匯出遙測資料的服務。
CLI 使用 OTLP/gRPC 協定傳送資料。
在<a href="https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/" target="_blank" rel="noopener noreferrer">文件</a>中深入了解 OTEL 匯出器標準設定。</p>
<h3 id="本地" tabindex="-1"><a class="header-anchor" href="#本地"><span>本地</span></a></h3>
<p>使用 <code v-pre>npm run telemetry -- --target=local</code> 指令可自動化設定本地遙測管道的程序，包括在您的 <code v-pre>.gemini/settings.json</code> 檔案中設定必要的設定。底層指令碼會安裝 <code v-pre>otelcol-contrib</code> (OpenTelemetry Collector) 和 <code v-pre>jaeger</code> (用於檢視追蹤的 Jaeger UI)。使用方法如下：</p>
<ol>
<li>
<p><strong>執行指令</strong>：
從儲存庫的根目錄執行指令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run telemetry -- <span class="token parameter variable">--target</span><span class="token operator">=</span>local</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>此指令碼將會：</p>
<ul>
<li>在需要時下載 Jaeger 和 OTEL。</li>
<li>啟動一個本地 Jaeger 執行個體。</li>
<li>啟動一個設定為從 Gemini CLI 接收資料的 OTEL 收集器。</li>
<li>在您的工作區設定中自動啟用遙測。</li>
<li>退出時，停用遙測。</li>
</ul>
</li>
<li>
<p><strong>檢視追蹤</strong>：
開啟您的網頁瀏覽器並瀏覽至 <strong>http://localhost:16686</strong> 以存取 Jaeger UI。您可以在此處檢查 Gemini CLI 操作的詳細追蹤。</p>
</li>
<li>
<p><strong>檢查日誌與指標</strong>：
指令碼會將 OTEL 收集器輸出 (包含日誌和指標) 重新導向至 <code v-pre>~/.gemini/tmp/&lt;projectHash&gt;/otel/collector.log</code>。指令碼將提供連結以供檢視，以及用於在本機追蹤您的遙測資料 (追蹤、指標、日誌) 的指令。</p>
</li>
<li>
<p><strong>停止服務</strong>：
在執行指令碼的終端機中按下 <code v-pre>Ctrl+C</code> 以停止 OTEL Collector 和 Jaeger 服務。</p>
</li>
</ol>
<h3 id="google-cloud" tabindex="-1"><a class="header-anchor" href="#google-cloud"><span>Google Cloud</span></a></h3>
<p>使用 <code v-pre>npm run telemetry -- --target=gcp</code> 指令來自動化設定一個本地 OpenTelemetry collector，它會將資料轉送到您的 Google Cloud 專案，並包含在您的 <code v-pre>.gemini/settings.json</code> 檔案中設定必要的設定。其底層的腳本會安裝 <code v-pre>otelcol-contrib</code>。使用方式如下：</p>
<ol>
<li>
<p><strong>先決條件</strong>：</p>
<ul>
<li>擁有一個 Google Cloud 專案 ID。</li>
<li>匯出 <code v-pre>GOOGLE_CLOUD_PROJECT</code> 環境變數，讓 OTEL collector 可以存取。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">OTLP_GOOGLE_CLOUD_PROJECT</span><span class="token operator">=</span><span class="token string">"your-project-id"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>向 Google Cloud 進行驗證 (例如，執行 <code v-pre>gcloud auth application-default login</code> 或確保已設定 <code v-pre>GOOGLE_APPLICATION_CREDENTIALS</code>)。</li>
<li>確保您的 Google Cloud 帳戶/服務帳戶具有必要的 IAM 角色：「Cloud Trace Agent」、「Monitoring Metric Writer」和「Logs Writer」。</li>
</ul>
</li>
<li>
<p><strong>執行指令</strong>：
從儲存庫的根目錄執行指令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run telemetry -- <span class="token parameter variable">--target</span><span class="token operator">=</span>gcp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>此腳本將會：</p>
<ul>
<li>在需要時下載 <code v-pre>otelcol-contrib</code> 二進位檔。</li>
<li>啟動一個 OTEL collector，其設定為從 Gemini CLI 接收資料並將其匯出到您指定的 Google Cloud 專案。</li>
<li>在您的工作區設定 (<code v-pre>.gemini/settings.json</code>) 中自動啟用遙測並停用沙箱模式。</li>
<li>提供直接連結，以便在您的 Google Cloud Console 中檢視追蹤、指標和日誌。</li>
<li>在退出時 (Ctrl+C)，它會嘗試還原您原來的遙測和沙箱設定。</li>
</ul>
</li>
<li>
<p><strong>執行 Gemini CLI：</strong>
在另一個終端機中，執行您的 Gemini CLI 指令。這會產生遙測資料，並由 collector 擷取。</p>
</li>
<li>
<p><strong>在 Google Cloud 中檢視遙測</strong>：
使用腳本提供的連結，導覽至 Google Cloud Console 並檢視您的追蹤、指標和日誌。</p>
</li>
<li>
<p><strong>檢查本地 collector 日誌</strong>：
此腳本會將本地 OTEL collector 的輸出重新導向至 <code v-pre>~/.gemini/tmp/&lt;projectHash&gt;/otel/collector-gcp.log</code>。此腳本提供連結和指令，讓您可以在本地檢視和追蹤 collector 的日誌。</p>
</li>
<li>
<p><strong>停止服務</strong>：
在執行腳本的終端機中按下 <code v-pre>Ctrl+C</code> 來停止 OTEL Collector。</p>
</li>
</ol>
<h2 id="日誌與指標參考" tabindex="-1"><a class="header-anchor" href="#日誌與指標參考"><span>日誌與指標參考</span></a></h2>
<p>以下章節說明為 Gemini CLI 產生的日誌與指標結構。</p>
<ul>
<li><code v-pre>sessionId</code> 作為一個通用屬性，包含在所有日誌和指標中。</li>
</ul>
<h3 id="日誌" tabindex="-1"><a class="header-anchor" href="#日誌"><span>日誌</span></a></h3>
<p>日誌是特定事件的帶時間戳記的紀錄。為 Gemini CLI 記錄了以下事件：</p>
<ul>
<li>
<p><code v-pre>gemini_cli.config</code>：此事件在啟動時，連同 CLI 的設定一同發生一次。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code> (字串)</li>
<li><code v-pre>embedding_model</code> (字串)</li>
<li><code v-pre>sandbox_enabled</code> (布林值)</li>
<li><code v-pre>core_tools_enabled</code> (字串)</li>
<li><code v-pre>approval_mode</code> (字串)</li>
<li><code v-pre>api_key_enabled</code> (布林值)</li>
<li><code v-pre>vertex_ai_enabled</code> (布林值)</li>
<li><code v-pre>code_assist_enabled</code> (布林值)</li>
<li><code v-pre>log_prompts_enabled</code> (布林值)</li>
<li><code v-pre>file_filtering_respect_git_ignore</code> (布林值)</li>
<li><code v-pre>debug_mode</code> (布林值)</li>
<li><code v-pre>mcp_servers</code> (字串)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.user_prompt</code>：此事件在使用者提交提示時發生。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>prompt_length</code></li>
<li><code v-pre>prompt</code> (如果 <code v-pre>log_prompts_enabled</code> 設定為 <code v-pre>false</code>，則此屬性會被排除)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.tool_call</code>：此事件在每次函式呼叫時發生。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>function_name</code></li>
<li><code v-pre>function_args</code></li>
<li><code v-pre>duration_ms</code></li>
<li><code v-pre>success</code> (布林值)</li>
<li><code v-pre>decision</code> (字串：「accept」、「reject」或「modify」，如適用)</li>
<li><code v-pre>error</code> (如適用)</li>
<li><code v-pre>error_type</code> (如適用)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.api_request</code>：此事件在向 Gemini API 發出請求時發生。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
<li><code v-pre>request_text</code> (如適用)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.api_error</code>：如果 API 請求失敗，則會發生此事件。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
<li><code v-pre>error</code></li>
<li><code v-pre>error_type</code></li>
<li><code v-pre>status_code</code></li>
<li><code v-pre>duration_ms</code></li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.api_response</code>：此事件在收到來自 Gemini API 的回應時發生。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
<li><code v-pre>status_code</code></li>
<li><code v-pre>duration_ms</code></li>
<li><code v-pre>error</code> (可選)</li>
<li><code v-pre>input_token_count</code></li>
<li><code v-pre>output_token_count</code></li>
<li><code v-pre>cached_content_token_count</code></li>
<li><code v-pre>thoughts_token_count</code></li>
<li><code v-pre>tool_token_count</code></li>
<li><code v-pre>response_text</code> (如適用)</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="指標" tabindex="-1"><a class="header-anchor" href="#指標"><span>指標</span></a></h3>
<p>指標是行為隨時間變化的數值測量。為 Gemini CLI 收集了以下指標：</p>
<ul>
<li>
<p><code v-pre>gemini_cli.session.count</code> (計數器，整數)：每次 CLI 啟動時遞增一次。</p>
</li>
<li>
<p><code v-pre>gemini_cli.tool.call.count</code> (計數器，整數)：計算工具呼叫次數。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>function_name</code></li>
<li><code v-pre>success</code> (布林值)</li>
<li><code v-pre>decision</code> (字串：「accept」、「reject」或「modify」，如適用)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.tool.call.latency</code> (直方圖，毫秒)：測量工具呼叫延遲。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>function_name</code></li>
<li><code v-pre>decision</code> (字串：「accept」、「reject」或「modify」，如適用)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.api.request.count</code> (計數器，整數)：計算所有 API 請求。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
<li><code v-pre>status_code</code></li>
<li><code v-pre>error_type</code> (如適用)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.api.request.latency</code> (直方圖，毫秒)：測量 API 請求延遲。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.token.usage</code> (計數器，整數)：計算使用的權杖數量。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>model</code></li>
<li><code v-pre>type</code> (字串：「input」、「output」、「thought」、「cache」或「tool」)</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>gemini_cli.file.operation.count</code> (計數器，整數)：計算檔案操作。</p>
<ul>
<li><strong>屬性</strong>：
<ul>
<li><code v-pre>operation</code> (字串：「建立」、「read」、「update」)：檔案操作的類型。</li>
<li><code v-pre>lines</code> (整數，如適用)：檔案中的行數。</li>
<li><code v-pre>mimetype</code> (字串，如適用)：檔案的 Mimetype。</li>
<li><code v-pre>extension</code> (字串，如適用)：檔案的副檔名。</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


