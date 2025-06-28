<template><div><h1 id="網路搜尋工具-google-web-search" tabindex="-1"><a class="header-anchor" href="#網路搜尋工具-google-web-search"><span>網路搜尋工具 (<code v-pre>google_web_search</code>)</span></a></h1>
<p>本文件說明 <code v-pre>google_web_search</code> 工具。</p>
<h2 id="說明" tabindex="-1"><a class="header-anchor" href="#說明"><span>說明</span></a></h2>
<p>使用 <code v-pre>google_web_search</code> 透過 Gemini API 執行 Google 網路搜尋。<code v-pre>google_web_search</code> 工具會傳回網路搜尋結果的摘要及來源。</p>
<h3 id="引數" tabindex="-1"><a class="header-anchor" href="#引數"><span>引數</span></a></h3>
<p><code v-pre>google_web_search</code> 接受一個引數：</p>
<ul>
<li><code v-pre>query</code> (字串，必要)：搜尋查詢。</li>
</ul>
<h2 id="如何搭配-gemini-cli-使用-google-web-search" tabindex="-1"><a class="header-anchor" href="#如何搭配-gemini-cli-使用-google-web-search"><span>如何搭配 Gemini CLI 使用 <code v-pre>google_web_search</code></span></a></h2>
<p><code v-pre>google_web_search</code> 工具會將查詢傳送至 Gemini API，接著執行網路搜尋。<code v-pre>google_web_search</code> 會根據搜尋結果傳回產生的回應，其中包含引用資料和來源。</p>
<p>用法：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">google_web_search(query="Your query goes here.")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="google-web-search-範例" tabindex="-1"><a class="header-anchor" href="#google-web-search-範例"><span><code v-pre>google_web_search</code> 範例</span></a></h2>
<p>取得特定主題的資訊：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">google_web_search(query="latest advancements in AI-powered code generation")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<ul>
<li><strong>傳回的回應：</strong> <code v-pre>google_web_search</code> 工具會傳回經過處理的摘要，而非原始的搜尋結果清單。</li>
<li><strong>引用資料：</strong> 回應中包含用來產生摘要的來源引用資料。</li>
</ul>
</div></template>


