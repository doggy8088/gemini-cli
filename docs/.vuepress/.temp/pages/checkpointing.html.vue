<template><div><h1 id="檢查點" tabindex="-1"><a class="header-anchor" href="#檢查點"><span>檢查點</span></a></h1>
<p>Gemini CLI 包含一個「Checkpointing」(檢查點) 功能，它會在 AI 工具進行任何檔案修改前，自動儲存您專案狀態的快照。這讓您可以安全地實驗並套用程式碼變更，同時知道您可以立即還原到工具執行前的狀態。</p>
<h2 id="運作方式" tabindex="-1"><a class="header-anchor" href="#運作方式"><span>運作方式</span></a></h2>
<p>當您批准一個會修改檔案系統的工具 (例如 <code v-pre>write_file</code> 或 <code v-pre>replace</code>) 時，CLI 會自動建立一個「檢查點」。此檢查點包含：</p>
<ol>
<li><strong>Git 快照：</strong> 系統會在一個特殊的影子 Git 儲存庫中建立一個 commit，該儲存庫位於您的家目錄 (<code v-pre>~/.gemini/history/&lt;project_hash&gt;</code>) 中。此快照會擷取您專案檔案在該時刻的完整狀態。它<strong>不會</strong>干擾您自己專案的 Git 儲存庫。</li>
<li><strong>對話紀錄：</strong> 您與代理程式到該時間點為止的完整對話都會被儲存下來。</li>
<li><strong>工具呼叫：</strong> 即將執行的特定工具呼叫也會被儲存。</li>
</ol>
<p>如果您想復原變更或只是回到上一步，您可以使用 <code v-pre>/restore</code> 指令。還原檢查點將會：</p>
<ul>
<li>將您專案中的所有檔案還原到快照中擷取的狀態。</li>
<li>在 CLI 中還原對話紀錄。</li>
<li>重新提出原始的工具呼叫，讓您可以再次執行、修改或直接忽略它。</li>
</ul>
<p>所有的檢查點資料，包含 Git 快照和對話紀錄，都儲存在您本機的電腦上。Git 快照儲存在影子儲存庫中，而對話紀錄和工具呼叫則儲存在您專案暫存目錄中的一個 JSON 檔案裡，該目錄通常位於 <code v-pre>~/.gemini/tmp/&lt;project_hash&gt;/checkpoints</code>。</p>
<h2 id="啟用此功能" tabindex="-1"><a class="header-anchor" href="#啟用此功能"><span>啟用此功能</span></a></h2>
<p>檢查點功能預設為關閉。若要啟用它，您可以使用命令列旗標或編輯您的 <code v-pre>settings.json</code> 檔案。</p>
<h3 id="使用命令列旗標" tabindex="-1"><a class="header-anchor" href="#使用命令列旗標"><span>使用命令列旗標</span></a></h3>
<p>您可以在啟動 Gemini CLI 時使用 <code v-pre>--checkpointing</code> 旗標，為當前的工作階段啟用檢查點功能：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gemini <span class="token parameter variable">--checkpointing</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="使用-settings-json-檔案" tabindex="-1"><a class="header-anchor" href="#使用-settings-json-檔案"><span>使用 <code v-pre>settings.json</code> 檔案</span></a></h3>
<p>若要為所有工作階段預設啟用檢查點功能，您需要編輯您的 <code v-pre>settings.json</code> 檔案。</p>
<p>將以下機碼新增至您的 <code v-pre>settings.json</code>：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"checkpointing"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"enabled"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-restore-指令" tabindex="-1"><a class="header-anchor" href="#使用-restore-指令"><span>使用 <code v-pre>/restore</code> 指令</span></a></h2>
<p>一旦啟用，檢查點就會自動建立。若要管理它們，請使用 <code v-pre>/restore</code> 指令。</p>
<h3 id="列出可用的檢查點" tabindex="-1"><a class="header-anchor" href="#列出可用的檢查點"><span>列出可用的檢查點</span></a></h3>
<p>若要查看當前專案所有已儲存的檢查點列表，只需執行：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">/restore</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>CLI 將會顯示可用檢查點檔案的列表。這些檔案名稱通常由時間戳記、被修改的檔案名稱，以及即將執行的工具名稱所組成 (例如：<code v-pre>2025-06-22T10-00-00_000Z-my-file.txt-write_file</code>)。</p>
<h3 id="還原特定的檢查點" tabindex="-1"><a class="header-anchor" href="#還原特定的檢查點"><span>還原特定的檢查點</span></a></h3>
<p>若要將您的專案還原至特定的檢查點，請使用列表中的檢查點檔案：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">/restore &lt;checkpoint_file></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>例如：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">/restore 2025-06-22T10-00-00_000Z-my-file.txt-write_file</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>執行此指令後，您的檔案和對話將會立即還原到建立檢查點時的狀態，而原始的工具呼叫將會重新出現。</p>
</div></template>


