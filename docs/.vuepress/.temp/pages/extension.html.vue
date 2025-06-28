<template><div><h1 id="gemini-cli-擴充功能" tabindex="-1"><a class="header-anchor" href="#gemini-cli-擴充功能"><span>Gemini CLI 擴充功能</span></a></h1>
<p>Gemini CLI 支援可用於設定和擴充其功能的擴充功能。</p>
<h2 id="運作方式" tabindex="-1"><a class="header-anchor" href="#運作方式"><span>運作方式</span></a></h2>
<p>啟動時，Gemini CLI 會在兩個位置尋找擴充功能：</p>
<ol>
<li><code v-pre>&lt;workspace&gt;/.gemini/extensions</code></li>
<li><code v-pre>&lt;home&gt;/.gemini/extensions</code></li>
</ol>
<p>Gemini CLI 會從這兩個位置載入所有擴充功能。如果兩個位置都存在同名的擴充功能，則工作區目錄中的擴充功能優先。
在每個位置中，個別的擴充功能都以一個包含 <code v-pre>gemini-extension.json</code> 檔案的目錄形式存在。例如：</p>
<p><code v-pre>&lt;workspace&gt;/.gemini/extensions/my-extension/gemini-extension.json</code></p>
<h3 id="gemini-extension-json" tabindex="-1"><a class="header-anchor" href="#gemini-extension-json"><span><code v-pre>gemini-extension.json</code></span></a></h3>
<p><code v-pre>gemini-extension.json</code> 檔案包含擴充功能的設定。該檔案的結構如下：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"my-extension"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"my-server"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"node my-server.js"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"contextFileName"</span><span class="token operator">:</span> <span class="token string">"GEMINI.md"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>name</code>：擴充功能的名稱。這可用來唯一識別擴充功能。這應該與您的擴充功能目錄名稱相符。</li>
<li><code v-pre>version</code>：擴充功能的版本。</li>
<li><code v-pre>mcpServers</code>：要設定的 MCP 伺服器對應。鍵是伺服器的名稱，值是伺服器的設定。這些伺服器將在啟動時載入，就像在 <RouteLink to="/cli/configuration.html"><code v-pre>settings.json</code> 檔案</RouteLink> 中設定的 MCP 伺服器一樣。如果擴充功能和 <code v-pre>settings.json</code> 檔案都設定了同名的 MCP 伺服器，則以 <code v-pre>settings.json</code> 檔案中定義的伺服器為優先。</li>
<li><code v-pre>contextFileName</code>：包含擴充功能內容的檔案名稱。這將用於從工作區載入內容。如果未使用此屬性，但您的擴充功能目錄中存在 <code v-pre>GEMINI.md</code> 檔案，則會載入該檔案。</li>
</ul>
<p>當 Gemini CLI 啟動時，它會載入所有擴充功能並合併其設定。如果發生任何衝突，則以工作區設定為優先。</p>
</div></template>


