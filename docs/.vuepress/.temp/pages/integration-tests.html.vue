<template><div><h1 id="整合測試" tabindex="-1"><a class="header-anchor" href="#整合測試"><span>整合測試</span></a></h1>
<p>本文件提供關於此專案所使用之整合測試框架的資訊。</p>
<h2 id="總覽" tabindex="-1"><a class="header-anchor" href="#總覽"><span>總覽</span></a></h2>
<p>整合測試旨在驗證 Gemini CLI 的端對端功能。它們會在受控環境中執行已建置的二進位檔，並驗證其與檔案系統互動時的行為是否符合預期。</p>
<p>這些測試位於 <code v-pre>integration-tests</code> 目錄中，並使用自訂的測試執行器來執行。</p>
<h2 id="執行測試" tabindex="-1"><a class="header-anchor" href="#執行測試"><span>執行測試</span></a></h2>
<p>整合測試不會作為預設 <code v-pre>npm run test</code> 指令的一部分執行。必須使用 <code v-pre>npm run test:integration:all</code> 指令碼明確地執行它們。</p>
<p>整合測試也可以使用以下捷徑執行：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:e2e</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="執行特定的測試集" tabindex="-1"><a class="header-anchor" href="#執行特定的測試集"><span>執行特定的測試集</span></a></h2>
<p>若要執行一部分的測試檔案，您可以使用 <code v-pre>npm run &amp;lt;integration test command&amp;gt; &amp;lt;file_name1&amp;gt; ....</code>，其中 <code v-pre>&amp;lt;integration test command&amp;gt;</code> 是 <code v-pre>test:e2e</code> 或 <code v-pre>test:integration*</code>，而 <code v-pre>&amp;lt;file_name&amp;gt;</code> 是 <code v-pre>integration-tests/</code> 目錄中的任何 <code v-pre>.test.js</code> 檔案。例如，以下指令會執行 <code v-pre>list_directory.test.js</code> 和 <code v-pre>write_file.test.js</code>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:e2e list_directory write_file</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="按名稱執行單一測試" tabindex="-1"><a class="header-anchor" href="#按名稱執行單一測試"><span>按名稱執行單一測試</span></a></h3>
<p>若要按名稱執行單一測試，請使用 <code v-pre>--test-name-pattern</code> 旗標：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:e2e -- --test-name-pattern <span class="token string">"reads a file"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="執行所有測試" tabindex="-1"><a class="header-anchor" href="#執行所有測試"><span>執行所有測試</span></a></h3>
<p>若要執行整套整合測試，請使用以下指令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:integration:all</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="沙箱矩陣" tabindex="-1"><a class="header-anchor" href="#沙箱矩陣"><span>沙箱矩陣</span></a></h3>
<p><code v-pre>all</code> 指令會針對 <code v-pre>no sandboxing</code>（無沙箱）、<code v-pre>docker</code> 和 <code v-pre>podman</code> 執行測試。
可以使用以下指令執行各種類型：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:integration:sandbox:none</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:integration:sandbox:docker</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:integration:sandbox:podman</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="診斷" tabindex="-1"><a class="header-anchor" href="#診斷"><span>診斷</span></a></h2>
<p>整合測試執行器提供數個診斷選項，以協助追蹤測試失敗的原因。</p>
<h3 id="保留測試輸出" tabindex="-1"><a class="header-anchor" href="#保留測試輸出"><span>保留測試輸出</span></a></h3>
<p>您可以保留在測試執行期間建立的暫存檔以供檢查。這對於偵錯檔案系統操作問題很有用。</p>
<p>若要保留測試輸出，您可以使用 <code v-pre>--keep-output</code> 旗標，或將 <code v-pre>KEEP_OUTPUT</code> 環境變數設定為 <code v-pre>true</code>。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用旗標</span></span>
<span class="line"><span class="token function">npm</span> run test:integration:sandbox:none -- --keep-output</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用環境變數</span></span>
<span class="line"><span class="token assign-left variable">KEEP_OUTPUT</span><span class="token operator">=</span>true <span class="token function">npm</span> run test:integration:sandbox:none</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>保留輸出時，測試執行器將會印出該次測試執行的唯一目錄路徑。</p>
<h3 id="詳細輸出" tabindex="-1"><a class="header-anchor" href="#詳細輸出"><span>詳細輸出</span></a></h3>
<p>若需更詳細的偵錯，<code v-pre>--verbose</code> 旗標會將 <code v-pre>gemini</code> 指令的即時輸出串流至主控台。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:integration:sandbox:none -- <span class="token parameter variable">--verbose</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>在同一個指令中同時使用 <code v-pre>--verbose</code> 和 <code v-pre>--keep-output</code> 時，輸出會串流至主控台，並儲存到測試暫存目錄中的記錄檔。</p>
<p>詳細輸出的格式會清楚標示記錄的來源：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">--- TEST: &amp;lt;file-name-without-js&amp;gt;:&amp;lt;test-name&amp;gt; ---</span>
<span class="line">... 來自 gemini 指令的輸出 ...</span>
<span class="line">--- END TEST: &amp;lt;file-name-without-js&amp;gt;:&amp;lt;test-name&amp;gt; ---</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="linting-與格式化" tabindex="-1"><a class="header-anchor" href="#linting-與格式化"><span>Linting 與格式化</span></a></h2>
<p>為確保程式碼品質與一致性，整合測試檔案會作為主要建構過程的一部分進行 linting。您也可以手動執行 linter 和自動修復工具。</p>
<h3 id="執行-linter" tabindex="-1"><a class="header-anchor" href="#執行-linter"><span>執行 linter</span></a></h3>
<p>若要檢查 linting 錯誤，請執行以下指令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run lint</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>您可以在指令中加入 <code v-pre>--fix</code> 旗標，以自動修復任何可修復的 linting 錯誤：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run lint <span class="token parameter variable">--fix</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="目錄結構" tabindex="-1"><a class="header-anchor" href="#目錄結構"><span>目錄結構</span></a></h2>
<p>整合測試會在 <code v-pre>.integration-tests</code> 目錄內為每次測試執行建立一個唯一的目錄。在此目錄中，會為每個測試檔案建立一個子目錄，而在該子目錄中，會為每個獨立的測試案例建立一個子目錄。</p>
<p>這種結構讓您能輕鬆找到特定測試執行、檔案或案例的產物。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.integration-tests/</span>
<span class="line">└── &amp;lt;run-id&amp;gt;/</span>
<span class="line">    └── &amp;lt;test-file-name&amp;gt;.test.js/</span>
<span class="line"></span>
<span class="line">        └── &amp;lt;test-case-name&amp;gt;/</span>
<span class="line">            ├── output.log</span>
<span class="line">            └── ...其他測試產物...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="持續整合" tabindex="-1"><a class="header-anchor" href="#持續整合"><span>持續整合</span></a></h2>
<p>為確保整合測試總是會執行，在 <code v-pre>.github/workflows/e2e.yml</code> 中定義了一個 GitHub Actions 工作流程。此工作流程會在每次對 <code v-pre>main</code> 分支的 pull request 和 push 時自動執行整合測試。</p>
<p>此工作流程會在不同的沙箱環境中執行測試，以確保 Gemini CLI 在每個環境中都經過測試：</p>
<ul>
<li><code v-pre>sandbox:none</code>：在沒有任何沙箱的情況下執行測試。</li>
<li><code v-pre>sandbox:docker</code>：在 Docker 容器中執行測試。</li>
<li><code v-pre>sandbox:podman</code>：在 Podman 容器中執行測試。</li>
</ul>
</div></template>


