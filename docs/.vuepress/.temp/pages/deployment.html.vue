<template><div><h1 id="gemini-cli-執行與部署" tabindex="-1"><a class="header-anchor" href="#gemini-cli-執行與部署"><span>Gemini CLI 執行與部署</span></a></h1>
<p>本文件說明 Gemini CLI 的執行方法與部署架構。</p>
<h2 id="執行-gemini-cli" tabindex="-1"><a class="header-anchor" href="#執行-gemini-cli"><span>執行 Gemini CLI</span></a></h2>
<p>執行 Gemini CLI 有數種方法。您選擇的選項取決於您打算如何使用 Gemini CLI。</p>
<hr>
<h3 id="_1-標準安裝-建議一般使用者採用" tabindex="-1"><a class="header-anchor" href="#_1-標準安裝-建議一般使用者採用"><span>1. 標準安裝（建議一般使用者採用）</span></a></h3>
<p>這是建議終端使用者安裝 Gemini CLI 的方法。此方法會從 NPM 註冊中心下載 Gemini CLI 套件。</p>
<ul>
<li>
<p><strong>全域安裝：</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 全域安裝 CLI</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> @google/gemini-cli</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 現在您可以從任何地方執行 CLI</span></span>
<span class="line">gemini</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>NPX 執行：</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 從 NPM 執行最新版本，無需全域安裝</span></span>
<span class="line">npx @google/gemini-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<hr>
<h3 id="_2-在沙盒中執行-docker-podman" tabindex="-1"><a class="header-anchor" href="#_2-在沙盒中執行-docker-podman"><span>2. 在沙盒中執行 (Docker/Podman)</span></a></h3>
<p>為了安全與隔離，Gemini CLI 可以在容器內執行。這是 CLI 執行可能產生副作用的工具的預設方式。</p>
<ul>
<li><strong>直接從註冊中心執行：</strong>
您可以直接執行已發佈的沙盒映像檔。這對於您只有 Docker 並想執行 CLI 的環境很有用。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 執行已發佈的沙盒映像檔</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token parameter variable">-it</span> us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>使用 <code v-pre>--sandbox</code> 旗標：</strong>
如果您已在本地安裝 Gemini CLI（使用上述的標準安裝方式），您可以指示它在沙盒容器內執行。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gemini <span class="token parameter variable">--sandbox</span> <span class="token string">"在此輸入您的提示"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<hr>
<h3 id="_3-從原始碼執行-建議-gemini-cli-貢獻者採用" tabindex="-1"><a class="header-anchor" href="#_3-從原始碼執行-建議-gemini-cli-貢獻者採用"><span>3. 從原始碼執行（建議 Gemini CLI 貢獻者採用）</span></a></h3>
<p>專案貢獻者會需要直接從原始碼執行 CLI。</p>
<ul>
<li>
<p><strong>開發模式：</strong>
此方法提供熱重載功能，對積極開發很有用。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 從儲存庫的根目錄</span></span>
<span class="line"><span class="token function">npm</span> run start</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>類生產模式（連結套件）：</strong>
此方法透過連結您的本地套件來模擬全域安裝。這對於在生產工作流程中測試本地建構很有用。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 將本地 cli 套件連結到您的全域 node_modules</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">link</span> packages/cli</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 現在您可以使用 `gemini` 指令執行您的本地版本</span></span>
<span class="line">gemini</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<hr>
<h3 id="_4-從-github-執行最新的-gemini-cli-commit" tabindex="-1"><a class="header-anchor" href="#_4-從-github-執行最新的-gemini-cli-commit"><span>4. 從 GitHub 執行最新的 Gemini CLI commit</span></a></h3>
<p>您可以直接從 GitHub 儲存庫執行最近提交的 Gemini CLI 版本。這對於測試仍在開發中的功能很有用。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 直接從 GitHub 上的 main 分支執行 CLI</span></span>
<span class="line">npx https://github.com/google-gemini/gemini-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署架構" tabindex="-1"><a class="header-anchor" href="#部署架構"><span>部署架構</span></a></h2>
<p>上述的執行方法是透過以下的架構元件與流程實現的：</p>
<p><strong>NPM 套件</strong></p>
<p>Gemini CLI 專案是一個 monorepo，它會將兩個核心套件發佈到 NPM 註冊中心：</p>
<ul>
<li><code v-pre>@google/gemini-cli-core</code>：後端，處理邏輯與工具執行。</li>
<li><code v-pre>@google/gemini-cli</code>：面向使用者的前端。</li>
</ul>
<p>在執行標準安裝以及從原始碼執行 Gemini CLI 時，都會使用這些套件。</p>
<p><strong>建構與封裝流程</strong></p>
<p>根據不同的發佈管道，會使用兩種不同的建構流程：</p>
<ul>
<li><strong>NPM 發佈：</strong> 為了發佈到 NPM 註冊中心，<code v-pre>@google/gemini-cli-core</code> 與 <code v-pre>@google/gemini-cli</code> 中的 TypeScript 原始碼会使用 TypeScript 編譯器 (<code v-pre>tsc</code>) 轉譯為標準的 JavaScript。最終產生的 <code v-pre>dist/</code> 目錄就是發佈在 NPM 套件中的內容。這是 TypeScript 函式庫的標準作法。</li>
<li><strong>GitHub <code v-pre>npx</code> 執行：</strong> 當直接從 GitHub 執行最新版的 Gemini CLI 時，<code v-pre>package.json</code> 中的 <code v-pre>prepare</code> 指令碼會觸發一個不同的流程。此指令碼使用 <code v-pre>esbuild</code> 將整個應用程式及其相依性套件打包成一個獨立的 JavaScript 檔案。這個打包檔案是在使用者的機器上即時建立的，並不會被簽入到儲存庫中。</li>
</ul>
<p><strong>Docker 沙盒映像檔</strong></p>
<p>基於 Docker 的執行方法是由 <code v-pre>gemini-cli-sandbox</code> 容器映像檔所支援。此映像檔發佈到一個容器註冊中心，並包含一個預先安裝的全域版本 Gemini CLI。在發佈前，<code v-pre>scripts/prepare-cli-packagejson.js</code> 指令碼會動態地將此映像檔的 URI 注入到 CLI 的 <code v-pre>package.json</code> 中，如此一來，當使用 <code v-pre>--sandbox</code> 旗標時，CLI 就會知道要拉取哪個映像檔。</p>
<h2 id="發佈流程" tabindex="-1"><a class="header-anchor" href="#發佈流程"><span>發佈流程</span></a></h2>
<p>一個名為 <code v-pre>npm run publish:release</code> 的統一腳本會協調整個發布流程。該腳本會執行以下操作：</p>
<ol>
<li>使用 <code v-pre>tsc</code> 建構 NPM 套件。</li>
<li>使用 Docker 映像檔的 URI 更新 CLI 的 <code v-pre>package.json</code>。</li>
<li>建構並標記 <code v-pre>gemini-cli-sandbox</code> Docker 映像檔。</li>
<li>將 Docker 映像檔推送至容器登錄檔。</li>
<li>將 NPM 套件發布至成品登錄檔。</li>
</ol>
</div></template>


