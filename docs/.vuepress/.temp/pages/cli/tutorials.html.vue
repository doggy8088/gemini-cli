<template><div><h1 id="指南" tabindex="-1"><a class="header-anchor" href="#指南"><span>指南</span></a></h1>
<p>此頁面包含與 Gemini CLI 互動的指南。</p>
<h2 id="設定模型情境協議-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#設定模型情境協議-mcp-伺服器"><span>設定模型情境協議 (MCP) 伺服器</span></a></h2>
<blockquote>
<p>[!CAUTION]
在使用第三方 MCP 伺服器之前，請確保您信任其來源並了解其提供的工具。您使用第三方伺服器的風險由您自行承擔。</p>
</blockquote>
<p>本指南以 <a href="https://github.com/github/github-mcp-server" target="_blank" rel="noopener noreferrer">GitHub MCP 伺服器</a> 為例，展示如何設定 MCP 伺服器。GitHub MCP 伺服器提供與 GitHub 儲存庫互動的工具，例如建立 issue 和對 pull request 發表評論。</p>
<h3 id="事前準備" tabindex="-1"><a class="header-anchor" href="#事前準備"><span>事前準備</span></a></h3>
<p>在開始之前，請確保您已安裝並設定好以下項目：</p>
<ul>
<li><strong>Docker：</strong> 安裝並執行 <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">Docker</a>。</li>
<li><strong>GitHub 個人存取權杖 (PAT)：</strong> 建立一個具有必要範圍的新的 <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer">classic</a> 或 <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">fine-grained</a> PAT。</li>
</ul>
<h3 id="指南-1" tabindex="-1"><a class="header-anchor" href="#指南-1"><span>指南</span></a></h3>
<h4 id="在-settings-json-中設定-mcp-伺服器" tabindex="-1"><a class="header-anchor" href="#在-settings-json-中設定-mcp-伺服器"><span>在 <code v-pre>settings.json</code> 中設定 MCP 伺服器</span></a></h4>
<p>在您的專案根目錄中，建立或開啟 <RouteLink to="/cli/configuration.html"><code v-pre>.gemini/settings.json</code> 檔案</RouteLink>。在檔案中，新增 <code v-pre>mcpServers</code> 設定區塊，其中提供了如何啟動 GitHub MCP 伺服器的說明。</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"mcpServers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"github"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"docker"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"run"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"-i"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"--rm"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"-e"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"GITHUB_PERSONAL_ACCESS_TOKEN"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"ghcr.io/github/github-mcp-server"</span></span>
<span class="line">      <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"GITHUB_PERSONAL_ACCESS_TOKEN"</span><span class="token operator">:</span> <span class="token string">"${GITHUB_PERSONAL_ACCESS_TOKEN}"</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="設定您的-github-權杖" tabindex="-1"><a class="header-anchor" href="#設定您的-github-權杖"><span>設定您的 GitHub 權杖</span></a></h4>
<blockquote>
<p>[!CAUTION]
使用範圍廣泛、可存取個人和私有儲存庫的個人存取權杖，可能會導致私有儲存庫的資訊洩漏到公有儲存庫中。我們建議使用範圍限定的存取權杖，該權杖不會同時共用對公有和私有儲存庫的存取權限。</p>
</blockquote>
<p>使用環境變數來儲存您的 GitHub PAT：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">GITHUB_PERSONAL_ACCESS_TOKEN</span><span class="token operator">=</span><span class="token string">"pat_YourActualGitHubTokenHere"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Gemini CLI 會在您於 <code v-pre>settings.json</code> 檔案中定義的 <code v-pre>mcpServers</code> 設定中使用此值。</p>
<h4 id="啟動-gemini-cli-並驗證連線" tabindex="-1"><a class="header-anchor" href="#啟動-gemini-cli-並驗證連線"><span>啟動 Gemini CLI 並驗證連線</span></a></h4>
<p>當您啟動 Gemini CLI 時，它會自動讀取您的設定並在背景啟動 GitHub MCP 伺服器。然後，您可以使用自然語言提示詞，要求 Gemini CLI 執行 GitHub 操作。例如：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token string">"get all open issues assigned to me in the 'foo/bar' repo and prioritize them"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


