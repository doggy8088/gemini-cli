<template><div><h1 id="記憶體工具-save-memory" tabindex="-1"><a class="header-anchor" href="#記憶體工具-save-memory"><span>記憶體工具 (<code v-pre>save_memory</code>)</span></a></h1>
<p>本文件說明 Gemini CLI 的 <code v-pre>save_memory</code> 工具。</p>
<h2 id="說明" tabindex="-1"><a class="header-anchor" href="#說明"><span>說明</span></a></h2>
<p>使用 <code v-pre>save_memory</code> 可在您的 Gemini CLI 工作階段之間儲存及取用資訊。透過 <code v-pre>save_memory</code>，您可以指示 CLI 跨工作階段記住關鍵細節，以提供個人化且具針對性的協助。</p>
<h3 id="引數" tabindex="-1"><a class="header-anchor" href="#引數"><span>引數</span></a></h3>
<p><code v-pre>save_memory</code> 有一個引數：</p>
<ul>
<li><code v-pre>fact</code> (字串，必要)：要記住的特定事實或資訊片段。這應是以自然語言撰寫的清晰、獨立陳述。</li>
</ul>
<h2 id="如何搭配-gemini-cli-使用-save-memory" tabindex="-1"><a class="header-anchor" href="#如何搭配-gemini-cli-使用-save-memory"><span>如何搭配 Gemini CLI 使用 <code v-pre>save_memory</code></span></a></h2>
<p>此工具會將提供的 <code v-pre>fact</code> 附加到位於使用者家目錄 (<code v-pre>~/.gemini/GEMINI.md</code>) 中的一個特殊 <code v-pre>GEMINI.md</code> 檔案。此檔案可設定為不同的名稱。
新增後，這些事實會儲存在 <code v-pre>## Gemini Added Memories</code> 區段底下。此檔案會在後續的工作階段中載入為上下文，讓 CLI 能夠取用已儲存的資訊。</p>
<p>使用方式：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">save_memory(fact="Your fact here.")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="save-memory-範例" tabindex="-1"><a class="header-anchor" href="#save-memory-範例"><span><code v-pre>save_memory</code> 範例</span></a></h3>
<p>記住使用者偏好：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">save_memory(fact="My preferred programming language is Python.")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>儲存專案特定細節：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">save_memory(fact="The project I'm currently working on is called 'gemini-cli'.")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<ul>
<li>**一般用法：**此工具應用於簡潔、重要的事實。不適用於儲存大量資料或對話記錄。</li>
<li>**記憶檔案：**記憶檔案是一個純文字 Markdown 檔案，因此您可以在需要時手動檢視和編輯。</li>
</ul>
</div></template>


