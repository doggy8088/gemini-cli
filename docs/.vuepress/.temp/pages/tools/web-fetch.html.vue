<template><div><h1 id="網頁擷取工具-web-fetch" tabindex="-1"><a class="header-anchor" href="#網頁擷取工具-web-fetch"><span>網頁擷取工具 (<code v-pre>web_fetch</code>)</span></a></h1>
<p>此文件說明 Gemini CLI 的 <code v-pre>web_fetch</code> 工具。</p>
<h2 id="說明" tabindex="-1"><a class="header-anchor" href="#說明"><span>說明</span></a></h2>
<p>使用 <code v-pre>web_fetch</code> 來摘要、比較或擷取網頁中的資訊。<code v-pre>web_fetch</code> 工具會處理提示中嵌入的一個或多個 (最多 20 個) URL 的內容。<code v-pre>web_fetch</code> 接受自然語言提示，並傳回產生的回應。</p>
<h3 id="引數" tabindex="-1"><a class="header-anchor" href="#引數"><span>引數</span></a></h3>
<p><code v-pre>web_fetch</code> 接受一個引數：</p>
<ul>
<li><code v-pre>prompt</code> (字串，必要)：一個完整的提示，其中包含要擷取的 URL (最多 20 個) 以及如何處理其內容的具體說明。例如：<code v-pre>&quot;Summarize https://example.com/article and extract key points from https://another.com/data&quot;</code>。提示必須包含至少一個以 <code v-pre>http://</code> 或 <code v-pre>https://</code> 開頭的 URL。</li>
</ul>
<h2 id="如何搭配-gemini-cli-使用-web-fetch" tabindex="-1"><a class="header-anchor" href="#如何搭配-gemini-cli-使用-web-fetch"><span>如何搭配 Gemini CLI 使用 <code v-pre>web_fetch</code></span></a></h2>
<p>若要搭配 Gemini CLI 使用 <code v-pre>web_fetch</code>，請提供包含 URL 的自然語言提示。在擷取任何 URL 之前，此工具會要求確認。確認後，工具將透過 Gemini API 的 <code v-pre>urlContext</code> 處理 URL。</p>
<p>如果 Gemini API 無法存取 URL，工具將會退回由本機直接擷取內容。工具會格式化回應，並在可能的情況下包含來源歸屬和引文。工具接著會將回應提供給使用者。</p>
<p>使用方式：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">web_fetch(prompt="Your prompt, including a URL such as https://google.com.")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="web-fetch-範例" tabindex="-1"><a class="header-anchor" href="#web-fetch-範例"><span><code v-pre>web_fetch</code> 範例</span></a></h2>
<p>摘要單篇文章：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">web_fetch(prompt="Can you summarize the main points of https://example.com/news/latest")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>比較兩篇文章：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">web_fetch(prompt="What are the differences in the conclusions of these two papers: https://arxiv.org/abs/2401.0001 and https://arxiv.org/abs/2401.0002?")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<ul>
<li><strong>URL 處理：</strong> <code v-pre>web_fetch</code> 仰賴 Gemini API 存取和處理指定 URL 的能力。</li>
<li><strong>輸出品質：</strong> 輸出內容的品質取決於提示中指令的清晰度。</li>
</ul>
</div></template>


