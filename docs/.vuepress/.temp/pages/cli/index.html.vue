<template><div><h1 id="gemini-cli" tabindex="-1"><a class="header-anchor" href="#gemini-cli"><span>Gemini CLI</span></a></h1>
<p>在 Gemini CLI 中，<code v-pre>packages/cli</code> 是一個前端工具，讓使用者可以透過 Gemini AI 模型及其相關工具來傳送和接收提示。關於 Gemini CLI 的一般性總覽，請參閱 <RouteLink to="/">主文件頁面</RouteLink>。</p>
<h2 id="導覽本節" tabindex="-1"><a class="header-anchor" href="#導覽本節"><span>導覽本節</span></a></h2>
<ul>
<li><strong><RouteLink to="/cli/authentication.html">驗證</RouteLink>:</strong> 一份設定與 Google AI 服務進行驗證的指南。</li>
<li><strong><RouteLink to="/cli/commands.html">指令</RouteLink>:</strong> Gemini CLI 指令的參考資料（例如：<code v-pre>/help</code>、<code v-pre>/tools</code>、<code v-pre>/theme</code>）。</li>
<li><strong><RouteLink to="/cli/configuration.html">組態設定</RouteLink>:</strong> 一份透過組態設定檔來客製化 Gemini CLI 行為的指南。</li>
<li><strong><RouteLink to="/cli/token-caching.html">權杖快取</RouteLink>:</strong> 透過權杖快取來優化 API 成本。</li>
<li><strong><RouteLink to="/cli/themes.html">主題</RouteLink></strong>: 一份透過不同主題來自訂 CLI 外觀的指南。</li>
<li><strong><RouteLink to="/cli/tutorials.html">指南</RouteLink></strong>: 一份展示如何使用 Gemini CLI 自動化開發任務的指南。</li>
</ul>
<h2 id="非互動模式" tabindex="-1"><a class="header-anchor" href="#非互動模式"><span>非互動模式</span></a></h2>
<p>Gemini CLI 可以在非互動模式下執行，這對於腳本自動化和自動化作業相當有用。在此模式下，您可以將輸入透過管線 (pipe) 傳遞給 CLI，CLI 會執行指令，然後結束。</p>
<p>以下範例是從您的終端機透過管線將指令傳遞給 Gemini CLI：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"什麼是微調？"</span> <span class="token operator">|</span> gemini</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Gemini CLI 會執行該指令並將輸出結果印在您的終端機上。請注意，您也可以使用 <code v-pre>--prompt</code> 或 <code v-pre>-p</code> 旗標來達到相同的效果。例如：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gemini <span class="token parameter variable">-p</span> <span class="token string">"什麼是微調？"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


